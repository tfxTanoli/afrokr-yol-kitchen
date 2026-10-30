import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import type { User } from '../types';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type AppRole = Database['public']['Enums']['app_role'];

export type ProfileUpdate = Partial<Pick<ProfileRow, 'full_name' | 'country' | 'country_flag' | 'bio' | 'specialties' | 'avatar_url'>>;

/** Local, privacy-safe initials avatar (no third-party avatar service). */
export function initialsAvatar(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('') || 'A';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#FF4E27"/><text x="50" y="50" dy=".35em" text-anchor="middle" font-family="Arial,sans-serif" font-size="40" font-weight="700" fill="#fff">${initials.replace(/[<>&"]/g, '')}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Maps a database profile to the UI's User model. */
export function profileToUser(profile: ProfileRow, role: AppRole, recipesCount = 0): User {
  const name = profile.full_name || profile.email.split('@')[0];
  return {
    id: profile.id,
    name,
    handle: profile.handle || '',
    email: profile.email,
    avatar: profile.avatar_url || initialsAvatar(name),
    role: role === 'admin' ? 'admin' : 'member',
    country: profile.country || '',
    countryFlag: profile.country_flag || '🌍',
    bio: profile.bio,
    specialties: profile.specialties,
    followersCount: 0,
    followingCount: 0,
    recipesCount,
    isVerified: role === 'admin',
    isCurrentUser: true,
    isPlusMember: false,
    subscriptionTier: 'basic',
  };
}

export async function fetchOwnProfile(userId: string): Promise<{ profile: ProfileRow; role: AppRole }> {
  const [profileRes, roleRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('user_roles').select('role').eq('user_id', userId).maybeSingle(),
  ]);
  if (profileRes.error) throw profileRes.error;
  if (roleRes.error) throw roleRes.error;
  return { profile: profileRes.data, role: roleRes.data?.role ?? 'user' };
}

export async function updateOwnProfile(userId: string, changes: ProfileUpdate): Promise<ProfileRow> {
  const clean: ProfileUpdate = { ...changes };
  if (clean.full_name !== undefined) {
    clean.full_name = clean.full_name.trim();
    if (clean.full_name.length < 2 || clean.full_name.length > 120) {
      throw Object.assign(new Error('Le nom doit contenir entre 2 et 120 caractères.'), { code: 'validation' });
    }
  }
  if (clean.bio !== undefined) {
    clean.bio = clean.bio.trim();
    if (clean.bio.length > 1000) {
      throw Object.assign(new Error('La bio ne peut pas dépasser 1000 caractères.'), { code: 'validation' });
    }
  }
  if (clean.specialties !== undefined) {
    clean.specialties = clean.specialties.map(s => s.trim()).filter(Boolean).slice(0, 20);
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(clean)
    .eq('id', userId)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}
