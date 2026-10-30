-- Performance hardening from the Supabase advisors (no change in who can do what):
--  * evaluate auth.uid() / is_admin() once per statement via (select ...)
--  * a single permissive SELECT policy per table
--  * index the remaining foreign key

drop policy "profiles: users read own" on public.profiles;
drop policy "profiles: admins read all" on public.profiles;
create policy "profiles: read own or admin"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

drop policy "profiles: users update own" on public.profiles;
create policy "profiles: users update own"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy "user_roles: users read own" on public.user_roles;
drop policy "user_roles: admins read all" on public.user_roles;
create policy "user_roles: read own or admin"
  on public.user_roles for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy "recipes: read published or admin" on public.recipes;
create policy "recipes: read published or admin"
  on public.recipes for select to authenticated
  using (is_published or (select public.is_admin()));

drop policy "recipes: admins insert" on public.recipes;
create policy "recipes: admins insert"
  on public.recipes for insert to authenticated
  with check ((select public.is_admin()));

drop policy "recipes: admins update" on public.recipes;
create policy "recipes: admins update"
  on public.recipes for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy "recipes: admins delete" on public.recipes;
create policy "recipes: admins delete"
  on public.recipes for delete to authenticated
  using ((select public.is_admin()));

create index if not exists user_roles_updated_by_idx on public.user_roles (updated_by);
