import { supabase } from '../lib/supabase';
import type { PlatformFeatureFlags } from '../types';

/**
 * Used until the database answers (and if it cannot be reached): delivery- and
 * AI-related modules stay off, matching the database defaults.
 */
export const FEATURE_FLAG_DEFAULTS: PlatformFeatureFlags = {
  delivery: false,
  recommended: false,
  driverTips: false,
  pdfInvoices: false,
  tableBooking: false,
  foodCamera: false,
  masterclasses: true,
  experiences: true,
  stories: true,
  planner: true,
  grocery: true,
  savedRecipes: true,
  referrals: true
};

export const FEATURE_FLAG_LABELS: Record<keyof PlatformFeatureFlags, string> = {
  delivery: 'Delivery Food (commandes & livraison)',
  recommended: 'Restaurants Recommandés & Sponsoring',
  driverTips: 'Pourboires Livreurs',
  pdfInvoices: 'Factures PDF des commandes',
  tableBooking: 'Réservation de Tables',
  foodCamera: 'Scan Photo IA',
  masterclasses: 'Masterclasses',
  experiences: 'Expériences Culinaires',
  stories: 'Stories Vidéo',
  planner: 'Planificateur de Repas',
  grocery: 'Liste de Courses',
  savedRecipes: 'Recettes Sauvegardées',
  referrals: 'Parrainage & Gains'
};

/** What each top-level switch hides when it is off (shown in the admin dashboard). */
export const FEATURE_FLAG_HINTS: Partial<Record<keyof PlatformFeatureFlags, string>> = {
  delivery: 'Onglet Livraison, suivi de commandes, pourboires et factures PDF',
  recommended: 'Restaurants recommandés, sponsoring et réservation de tables',
  foodCamera: 'Bouton « Prendre une photo » (scan de plats par IA)',
  masterclasses: 'Onglet Masterclasses',
  experiences: 'Onglet Expériences culinaires',
  stories: 'Stories vidéo du fil d’accueil',
  planner: 'Planificateur de repas',
  grocery: 'Liste de courses',
  savedRecipes: 'Onglet Recettes sauvegardées',
  referrals: 'Carte Parrainage & Gains du menu'
};

/**
 * Switches shown in the admin dashboard. Tips, PDF invoices and table booking only
 * exist inside the delivery / restaurant modules, so they follow those switches.
 */
export const FEATURE_FLAG_GROUPS: { title: string; hint: string; keys: (keyof PlatformFeatureFlags)[] }[] = [
  { title: 'Livraison & Restaurants', hint: 'Prévu pour une phase ultérieure', keys: ['delivery', 'recommended'] },
  { title: 'Intelligence Artificielle', hint: 'Prévu pour une phase ultérieure', keys: ['foodCamera'] },
  { title: 'Communauté & Contenus', hint: 'Modules existants de l’application', keys: ['masterclasses', 'experiences', 'stories', 'planner', 'grocery', 'savedRecipes', 'referrals'] }
];

const FLAG_KEYS = Object.keys(FEATURE_FLAG_DEFAULTS) as (keyof PlatformFeatureFlags)[];

export async function fetchFeatureFlags(): Promise<PlatformFeatureFlags> {
  const { data, error } = await supabase.from('feature_flags').select('key, enabled');
  if (error) throw error;
  const flags = { ...FEATURE_FLAG_DEFAULTS };
  for (const row of data) {
    if (FLAG_KEYS.includes(row.key as keyof PlatformFeatureFlags)) {
      flags[row.key as keyof PlatformFeatureFlags] = row.enabled;
    }
  }
  return flags;
}

/** Admin only (enforced by RLS). Throws if the change was not applied. */
export async function setFeatureFlag(key: keyof PlatformFeatureFlags, enabled: boolean): Promise<void> {
  const { data, error } = await supabase.from('feature_flags').update({ enabled }).eq('key', key).select('key');
  if (error) throw error;
  if (!data || data.length === 0) throw Object.assign(new Error('not allowed'), { code: '42501' });
}

/** Admin only: switches every module on or off at once. */
export async function setAllFeatureFlags(enabled: boolean): Promise<void> {
  const { data, error } = await supabase.from('feature_flags').update({ enabled }).in('key', FLAG_KEYS).select('key');
  if (error) throw error;
  if (!data || data.length === 0) throw Object.assign(new Error('not allowed'), { code: '42501' });
}
