-- =============================================================================
-- Platform feature flags: modules an administrator can switch on/off for everyone.
-- Delivery- and AI-related modules ship disabled (client request: activate later).
-- =============================================================================

create table public.feature_flags (
  key         text primary key check (key ~ '^[a-zA-Z]{2,40}$'),
  enabled     boolean not null default false,
  description text not null default '',
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id) on delete set null
);

create index feature_flags_updated_by_idx on public.feature_flags (updated_by);

-- updated_at / updated_by are always set server-side
create or replace function public.feature_flags_before_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

create trigger feature_flags_before_update
  before update on public.feature_flags
  for each row execute function public.feature_flags_before_update();

revoke execute on function public.feature_flags_before_update() from public, anon, authenticated;

alter table public.feature_flags enable row level security;

-- Every signed-in user reads the flags (the UI hides disabled modules)
create policy "feature_flags: authenticated read"
  on public.feature_flags for select to authenticated
  using (true);

-- Only administrators toggle them
create policy "feature_flags: admins update"
  on public.feature_flags for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- The set of modules is fixed by the app: no client inserts/deletes, only `enabled` is writable
revoke all on public.feature_flags from anon;
revoke insert, update, delete on public.feature_flags from authenticated;
grant update (enabled) on public.feature_flags to authenticated;

insert into public.feature_flags (key, enabled, description) values
  ('delivery',      false, 'Afrodelicious Delivery Food (commandes & géolocalisation)'),
  ('recommended',   false, 'Restaurants Recommandés & Sponsoring Payant'),
  ('driverTips',    false, 'Pourboires Livreurs'),
  ('pdfInvoices',   false, 'Facturation PDF des commandes'),
  ('tableBooking',  false, 'Réservation de Tables'),
  ('foodCamera',    false, 'Scan Photo IA (Food Camera)'),
  ('masterclasses', true,  'Masterclasses & Formations Chefs'),
  ('experiences',   true,  'Expériences Culinaires & Tables d''hôtes'),
  ('stories',       true,  'Stories Vidéo'),
  ('planner',       true,  'Planificateur de Repas'),
  ('grocery',       true,  'Liste de Courses'),
  ('savedRecipes',  true,  'Recettes Sauvegardées'),
  ('referrals',     true,  'Programme Parrainage & Gains')
on conflict (key) do nothing;
