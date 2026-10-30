import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AppRole, fetchOwnProfile, ProfileRow, ProfileUpdate, updateOwnProfile } from '../services/profileService';

type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
  country: string;
  countryFlag: string;
}

interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  profile: ProfileRow | null;
  role: AppRole | null;
  isAdmin: boolean;
  /** True after the user followed a password-reset link and must choose a new password. */
  isPasswordRecovery: boolean;
  profileError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (changes: ProfileUpdate) => Promise<ProfileRow>;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const PASSWORD_MIN_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validationError(message: string) {
  return Object.assign(new Error(message), { code: 'validation' });
}

function assertEmail(email: string) {
  if (!EMAIL_PATTERN.test(email.trim())) throw validationError('Adresse email invalide.');
}

function assertPassword(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw validationError(`Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`);
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw validationError('Le mot de passe doit contenir au moins une lettre et un chiffre.');
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const userId = session?.user.id ?? null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoaded(true);
    });

    // Keep this callback synchronous: Supabase calls inside it can deadlock the auth client.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true);
      if (event === 'SIGNED_OUT') setIsPasswordRecovery(false);
      setSession(newSession);
      setSessionLoaded(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = useCallback(async (id: string) => {
    try {
      const result = await fetchOwnProfile(id);
      setProfile(result.profile);
      setRole(result.role);
      setProfileError(null);
    } catch (error) {
      const { code, message = '' } = error as { code?: string; message?: string };
      // An invalid/expired session cannot be recovered client-side: sign out cleanly.
      if (code === 'PGRST301' || /jwt/i.test(message)) {
        await supabase.auth.signOut();
        return;
      }
      setProfileError('Impossible de charger votre profil. Vérifiez votre connexion puis réessayez.');
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setRole(null);
      setProfileError(null);
      return;
    }
    loadProfile(userId);
  }, [userId, loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    assertEmail(email);
    if (!password) throw validationError('Veuillez saisir votre mot de passe.');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async ({ fullName, email, password, country, countryFlag }: SignUpInput) => {
    const name = fullName.trim();
    if (name.length < 2 || name.length > 120) throw validationError('Le nom doit contenir entre 2 et 120 caractères.');
    assertEmail(email);
    assertPassword(password);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        // Profile data only; the role is always assigned server-side.
        data: { full_name: name, country, country_flag: countryFlag },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    // With email confirmation enabled Supabase returns a user without a session.
    return { needsEmailConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      // Even if the server call fails (e.g. already-expired token), clear the local session.
      await supabase.auth.signOut({ scope: 'local' });
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    assertEmail(email);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    });
    if (error) throw error;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    assertPassword(password);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    setIsPasswordRecovery(false);
  }, []);

  const updateProfile = useCallback(async (changes: ProfileUpdate) => {
    if (!userId) throw validationError('Vous devez être connecté.');
    const updated = await updateOwnProfile(userId, changes);
    setProfile(updated);
    return updated;
  }, [userId]);

  const reloadProfile = useCallback(async () => {
    if (userId) await loadProfile(userId);
  }, [userId, loadProfile]);

  const status: AuthStatus = !sessionLoaded
    ? 'loading'
    : !session
      ? 'signedOut'
      : profile
        ? 'signedIn'
        : profileError
          ? 'signedIn'
          : 'loading';

  const value = useMemo<AuthContextValue>(() => ({
    status,
    session,
    profile,
    role,
    isAdmin: role === 'admin',
    isPasswordRecovery,
    profileError,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updatePassword,
    updateProfile,
    reloadProfile,
  }), [status, session, profile, role, isPasswordRecovery, profileError, signIn, signUp, signOut, requestPasswordReset, updatePassword, updateProfile, reloadProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
