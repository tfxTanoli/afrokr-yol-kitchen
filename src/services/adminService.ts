import { supabase } from '../lib/supabase';
import type { AppRole, ProfileRow } from './profileService';

export interface AdminUserRow extends ProfileRow {
  role: AppRole;
}

/** Lists all registered users. Only returns other users' rows for administrators (RLS). */
export async function fetchAllUsers(): Promise<AdminUserRow[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_roles(role)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(({ user_roles, ...profile }) => ({
    ...profile,
    role: (Array.isArray(user_roles) ? user_roles[0]?.role : user_roles?.role) ?? 'user',
  }));
}

/** Changes a user's role through the admin-only, server-side RPC. */
export async function setUserRole(userId: string, role: AppRole): Promise<void> {
  const { error } = await supabase.rpc('set_user_role', { target_user_id: userId, new_role: role });
  if (error) throw error;
}
