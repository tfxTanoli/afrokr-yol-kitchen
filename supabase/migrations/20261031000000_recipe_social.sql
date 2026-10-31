-- Likes, bookmarks and comments on recipes.
--  * likes / bookmarks: one row per (recipe, user); each user only sees and changes their own rows
--  * comments: readable by every signed-in user on recipes they can see; authors (and admins) delete them
--  * public counters come from recipe_social_counts(), so no one can list who liked what

-- =============================================================================
-- Tables
-- =============================================================================
create table public.recipe_likes (
  recipe_id  uuid not null references public.recipes (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (recipe_id, user_id)
);
create index recipe_likes_user_id_idx on public.recipe_likes (user_id);

create table public.recipe_bookmarks (
  recipe_id  uuid not null references public.recipes (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (recipe_id, user_id)
);
create index recipe_bookmarks_user_id_idx on public.recipe_bookmarks (user_id);

create table public.recipe_comments (
  id                uuid primary key default gen_random_uuid(),
  recipe_id         uuid not null references public.recipes (id) on delete cascade,
  user_id           uuid not null references public.profiles (id) on delete cascade,
  body              text not null check (char_length(btrim(body)) between 1 and 1000),
  -- Author credit is copied from the profile (other users cannot read profiles)
  author_name       text check (author_name is null or char_length(author_name) <= 120),
  author_handle     text check (author_handle is null or char_length(author_handle) <= 60),
  author_avatar_url text check (author_avatar_url is null or char_length(author_avatar_url) <= 2048),
  created_at        timestamptz not null default now()
);
create index recipe_comments_recipe_id_created_at_idx on public.recipe_comments (recipe_id, created_at desc);
create index recipe_comments_user_id_idx on public.recipe_comments (user_id);

-- The author and credit always come from the signed-in user, whatever the client sends.
create or replace function public.recipe_comments_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  p public.profiles%rowtype;
begin
  if new.user_id is distinct from auth.uid() then
    raise exception 'comments can only be posted as yourself' using errcode = '42501';
  end if;
  new.body := btrim(new.body);
  new.created_at := now();
  select * into p from public.profiles where id = new.user_id;
  new.author_name := p.full_name;
  new.author_handle := p.handle;
  new.author_avatar_url := p.avatar_url;
  return new;
end;
$$;

create trigger recipe_comments_before_insert
  before insert on public.recipe_comments
  for each row execute function public.recipe_comments_before_insert();

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.recipe_likes     enable row level security;
alter table public.recipe_bookmarks enable row level security;
alter table public.recipe_comments  enable row level security;

revoke all on public.recipe_likes, public.recipe_bookmarks, public.recipe_comments from anon;
revoke update on public.recipe_likes, public.recipe_bookmarks, public.recipe_comments from authenticated;

-- A recipe the caller can interact with: published, or any recipe for an admin
create policy "recipe_likes: read own"
  on public.recipe_likes for select to authenticated
  using (user_id = (select auth.uid()));
create policy "recipe_likes: insert own on visible recipe"
  on public.recipe_likes for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.recipes r where r.id = recipe_id and (r.is_published or (select public.is_admin())))
  );
create policy "recipe_likes: delete own"
  on public.recipe_likes for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "recipe_bookmarks: read own"
  on public.recipe_bookmarks for select to authenticated
  using (user_id = (select auth.uid()));
create policy "recipe_bookmarks: insert own on visible recipe"
  on public.recipe_bookmarks for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.recipes r where r.id = recipe_id and (r.is_published or (select public.is_admin())))
  );
create policy "recipe_bookmarks: delete own"
  on public.recipe_bookmarks for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "recipe_comments: read on visible recipe"
  on public.recipe_comments for select to authenticated
  using (exists (select 1 from public.recipes r where r.id = recipe_id and (r.is_published or (select public.is_admin()))));
create policy "recipe_comments: insert on visible recipe"
  on public.recipe_comments for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.recipes r where r.id = recipe_id and (r.is_published or (select public.is_admin())))
  );
create policy "recipe_comments: delete own or admin"
  on public.recipe_comments for delete to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- =============================================================================
-- Counters
-- =============================================================================
create or replace function public.recipe_social_counts()
returns table (recipe_id uuid, likes_count bigint, bookmarks_count bigint, comments_count bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select
    r.id,
    (select count(*) from public.recipe_likes l where l.recipe_id = r.id),
    (select count(*) from public.recipe_bookmarks b where b.recipe_id = r.id),
    (select count(*) from public.recipe_comments c where c.recipe_id = r.id)
  from public.recipes r
  where r.is_published or public.is_admin();
$$;

revoke execute on function public.recipe_social_counts() from public, anon;
grant execute on function public.recipe_social_counts() to authenticated;
revoke execute on function public.recipe_comments_before_insert() from public, anon, authenticated;
