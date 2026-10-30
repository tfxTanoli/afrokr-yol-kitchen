-- =============================================================================
-- Afrodelicious MVP schema: profiles, roles (RBAC), recipes, storage + RLS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Roles
-- -----------------------------------------------------------------------------
create type public.app_role as enum ('user', 'admin');

-- -----------------------------------------------------------------------------
-- Shared trigger: keep updated_at server-controlled
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  full_name    text not null default '' check (char_length(full_name) <= 120),
  email        text not null,
  handle       text unique check (handle is null or char_length(handle) <= 60),
  avatar_url   text check (avatar_url is null or char_length(avatar_url) <= 2048),
  country      text check (country is null or char_length(country) <= 80),
  country_flag text check (country_flag is null or char_length(country_flag) <= 16),
  bio          text not null default '' check (char_length(bio) <= 1000),
  specialties  text[] not null default '{}' check (cardinality(specialties) <= 20),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- User roles (one role per user; never writable by end users)
-- -----------------------------------------------------------------------------
create table public.user_roles (
  user_id    uuid primary key references public.profiles (id) on delete cascade,
  role       public.app_role not null default 'user',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create trigger user_roles_set_updated_at
  before update on public.user_roles
  for each row execute function public.set_updated_at();

-- Role check used by every policy. Only ever checks the *calling* user.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- Auto-create profile + default role on sign-up.
-- The role is ALWAYS 'user' – metadata supplied by the client is never trusted
-- for authorization.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := left(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 120);
  v_base text;
begin
  if v_name = '' then
    v_name := split_part(new.email, '@', 1);
  end if;

  v_base := lower(regexp_replace(v_name, '[^a-zA-Z0-9]+', '_', 'g'));
  v_base := trim(both '_' from left(v_base, 40));
  if v_base = '' then
    v_base := 'gourmet';
  end if;

  insert into public.profiles (id, full_name, email, handle, country, country_flag)
  values (
    new.id,
    v_name,
    new.email,
    '@' || v_base || '_' || left(replace(new.id::text, '-', ''), 6),
    nullif(left(btrim(coalesce(new.raw_user_meta_data ->> 'country', '')), 80), ''),
    nullif(left(btrim(coalesce(new.raw_user_meta_data ->> 'country_flag', '')), 16), '')
  );

  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profiles.email in sync when the auth email changes.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- -----------------------------------------------------------------------------
-- Admin-only role management (the trusted process for role assignment)
-- -----------------------------------------------------------------------------
create or replace function public.set_user_role(target_user_id uuid, new_role public.app_role)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Only administrators can change roles' using errcode = '42501';
  end if;

  if target_user_id = auth.uid() and new_role <> 'admin' then
    raise exception 'Administrators cannot remove their own admin role' using errcode = '42501';
  end if;

  update public.user_roles
     set role = new_role, updated_by = auth.uid()
   where user_id = target_user_id;

  if not found then
    raise exception 'User not found' using errcode = 'P0002';
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- Recipes
-- -----------------------------------------------------------------------------
create table public.recipes (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique check (slug is null or slug ~ '^[a-z0-9][a-z0-9-]{1,99}$'),
  title             text not null check (char_length(btrim(title)) between 3 and 150),
  description       text not null default '' check (char_length(description) <= 2000),
  ingredients       jsonb not null default '[]' check (jsonb_typeof(ingredients) = 'array'),
  instructions      jsonb not null default '[]' check (jsonb_typeof(instructions) = 'array'),
  preparation_time  integer not null default 0 check (preparation_time between 0 and 1440),
  cooking_time      integer not null default 0 check (cooking_time between 0 and 2880),
  servings          integer not null default 4 check (servings between 1 and 100),
  difficulty        text not null default 'Moyen' check (difficulty in ('Facile', 'Moyen', 'Expert')),
  category          text not null default 'Plats Traditionnels' check (category in (
                      'Plats Traditionnels', 'Street Food', 'Desserts & Douceurs',
                      'Sauces & Marinades', 'Boissons & Cocktails', 'Végétarien & Vegan')),
  country           text check (country is null or char_length(country) <= 80),
  country_flag      text check (country_flag is null or char_length(country_flag) <= 16),
  heritage_story    text check (heritage_story is null or char_length(heritage_story) <= 4000),
  image_url         text check (image_url is null or char_length(image_url) <= 2048),
  -- Display credit (the chef shown on the recipe card). Defaults to the creator.
  author_name       text check (author_name is null or char_length(author_name) <= 120),
  author_handle     text check (author_handle is null or char_length(author_handle) <= 60),
  author_avatar_url text check (author_avatar_url is null or char_length(author_avatar_url) <= 2048),
  created_by        uuid references public.profiles (id) on delete set null,
  is_published      boolean not null default false,
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index recipes_published_created_idx on public.recipes (is_published, created_at desc);
create index recipes_created_by_idx on public.recipes (created_by);

create trigger recipes_set_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

-- created_by is always the caller; author credit falls back to the creator's profile;
-- published_at tracks publication.
create or replace function public.recipes_before_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  p public.profiles%rowtype;
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then
      new.created_by := auth.uid();
    end if;
    new.created_at := now();
  else
    new.created_by := old.created_by;
    new.created_at := old.created_at;
  end if;

  if new.author_name is null and new.created_by is not null then
    select * into p from public.profiles where id = new.created_by;
    new.author_name := p.full_name;
    new.author_handle := coalesce(new.author_handle, p.handle);
    new.author_avatar_url := coalesce(new.author_avatar_url, p.avatar_url);
  end if;

  if new.is_published and (tg_op = 'INSERT' or not old.is_published) then
    new.published_at := now();
  elsif not new.is_published then
    new.published_at := null;
  end if;

  return new;
end;
$$;

create trigger recipes_before_write
  before insert or update on public.recipes
  for each row execute function public.recipes_before_write();

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.profiles   enable row level security;
alter table public.user_roles enable row level security;
alter table public.recipes    enable row level security;

-- Anonymous visitors get nothing from these tables.
revoke all on public.profiles, public.user_roles, public.recipes from anon;

-- ---- profiles ---------------------------------------------------------------
create policy "profiles: users read own"
  on public.profiles for select to authenticated
  using (id = auth.uid());

create policy "profiles: admins read all"
  on public.profiles for select to authenticated
  using (public.is_admin());

create policy "profiles: users update own"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Inserts come only from the signup trigger; deletes cascade from auth.users.
revoke insert, delete, update on public.profiles from authenticated;
grant update (full_name, avatar_url, country, country_flag, bio, specialties)
  on public.profiles to authenticated;

-- ---- user_roles -------------------------------------------------------------
create policy "user_roles: users read own"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid());

create policy "user_roles: admins read all"
  on public.user_roles for select to authenticated
  using (public.is_admin());

-- No write policies: changes go exclusively through public.set_user_role().
revoke insert, update, delete on public.user_roles from authenticated;

-- ---- recipes ----------------------------------------------------------------
create policy "recipes: read published or admin"
  on public.recipes for select to authenticated
  using (is_published or public.is_admin());

create policy "recipes: admins insert"
  on public.recipes for insert to authenticated
  with check (public.is_admin());

create policy "recipes: admins update"
  on public.recipes for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "recipes: admins delete"
  on public.recipes for delete to authenticated
  using (public.is_admin());

-- ---- function privileges ----------------------------------------------------
revoke execute on function public.set_user_role(uuid, public.app_role) from public, anon;
grant execute on function public.set_user_role(uuid, public.app_role) to authenticated;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_user_email_change() from public, anon, authenticated;
revoke execute on function public.recipes_before_write() from public, anon, authenticated;

-- =============================================================================
-- Storage: recipe images (public read, admin write)
-- =============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('recipe-images', 'recipe-images', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "recipe-images: admins read"
  on storage.objects for select to authenticated
  using (bucket_id = 'recipe-images' and public.is_admin());

create policy "recipe-images: admins upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'recipe-images' and public.is_admin());

create policy "recipe-images: admins update"
  on storage.objects for update to authenticated
  using (bucket_id = 'recipe-images' and public.is_admin())
  with check (bucket_id = 'recipe-images' and public.is_admin());

create policy "recipe-images: admins delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'recipe-images' and public.is_admin());
