import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

// Only the publishable key is ever used in the browser. Privileged keys must stay server-side.
export const supabase = createClient<Database>(
  supabaseUrl || 'http://localhost:54321',
  supabasePublishableKey || 'missing-publishable-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Implicit flow so password-reset links also work when opened on another device/browser
      detectSessionInUrl: true,
      flowType: 'implicit',
    },
  }
);

export const RECIPE_IMAGES_BUCKET = 'recipe-images';

/** Maps Supabase/PostgREST errors to a safe, user-facing French message. */
export function toUserMessage(error: unknown, fallback = 'Une erreur est survenue. Veuillez réessayer.'): string {
  if (!error || typeof error !== 'object') return fallback;
  const { message = '', code = '', status } = error as { message?: string; code?: string; status?: number };
  if (code === 'validation') return message;
  const msg = message.toLowerCase();

  if (msg.includes('invalid login credentials')) return 'Email ou mot de passe incorrect.';
  if (msg.includes('email not confirmed')) return 'Veuillez confirmer votre adresse email avant de vous connecter.';
  if (msg.includes('user already registered') || code === 'user_already_exists') return 'Un compte existe déjà avec cette adresse email.';
  if (code === 'email_address_invalid') return 'Cette adresse email ne peut pas recevoir de message. Vérifiez-la.';
  if (code === 'email_address_not_authorized') return 'L’envoi d’emails n’est pas encore activé pour cette adresse. Contactez le support Afrodelicious.';
  if (code === 'weak_password' || msg.includes('password should')) return 'Mot de passe trop faible (8 caractères minimum).';
  if (code === 'same_password') return 'Le nouveau mot de passe doit être différent de l’ancien.';
  if (code === 'over_email_send_rate_limit' || status === 429 || msg.includes('rate limit')) return 'Trop de tentatives. Patientez quelques minutes avant de réessayer.';
  if (msg.includes('jwt expired') || code === 'PGRST301' || code === 'session_not_found') return 'Votre session a expiré. Veuillez vous reconnecter.';
  if (code === '42501' || msg.includes('row-level security') || msg.includes('permission denied')) return 'Action non autorisée pour votre compte.';
  if (code === '23514' || code === '22P02') return 'Certaines données sont invalides. Vérifiez le formulaire.';
  if (code === '23505') return 'Cette valeur existe déjà.';
  if (msg.includes('failed to fetch') || msg.includes('network')) return 'Connexion au serveur impossible. Vérifiez votre réseau.';
  return fallback;
}
