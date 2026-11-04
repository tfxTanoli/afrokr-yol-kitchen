// Pricing & Subscription Plans Store for Afrodelicious
// Managed by Super Admin in AdminDashboardModal and rendered in PricingModal

export interface PricingPlan {
  id: string;
  name: string;
  slug: 'free' | 'gourmet_plus' | 'club_vip';
  tagline: string;
  badge?: string;
  badgeColor?: string;
  priceMonthly: number;
  priceAnnually: number; // total for the year
  currency: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  status: 'active' | 'paused';
  subscribersCount: number;
}

export const INITIAL_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'plan-free',
    name: 'Formule Découverte',
    slug: 'free',
    tagline: 'Pour explorer les recettes authentiques et la communauté afro-caribéenne',
    badge: 'Gratuit',
    badgeColor: 'bg-slate-100 text-slate-700',
    priceMonthly: 0,
    priceAnnually: 0,
    currency: 'EUR',
    features: [
      'Accès libre aux milliers de recettes communautaires',
      'Import illimité de recettes par URL (TikTok, Instagram, Web)',
      'Génération intelligente de la liste de courses',
      'Fiches ingrédients du terroir et équivalences',
      'Accès au chat et communautés gourmandes'
    ],
    highlighted: false,
    buttonText: 'Formule Actuelle',
    status: 'active',
    subscribersCount: 124500
  },
  {
    id: 'plan-gourmet-plus',
    name: 'Afrodelicious+ Gourmet',
    slug: 'gourmet_plus',
    tagline: 'L’expérience culinaire intégrale sans aucune publicité',
    badge: 'Le Plus Populaire ⭐',
    badgeColor: 'bg-gradient-to-r from-[#FF4E27] to-amber-500 text-white',
    priceMonthly: 9.99,
    priceAnnually: 89, // ~7.41 € / mois
    currency: 'EUR',
    features: [
      'Expérience 100% zéro publicité (Ad-Free) sur toute l’application',
      'Accès illimité à toutes les Online Cooking Classes pas-à-pas',
      'Fiches recettes techniques téléchargeables en PDF haute qualité',
      'Planificateur hebdomadaire intelligent (Meal Planner & Prep)',
      'Calculateur nutritionnel avancé et macros personnalisés',
      'Support client prioritaire 7j/7'
    ],
    highlighted: true,
    buttonText: 'Choisir Gourmet+',
    status: 'active',
    subscribersCount: 14820
  },
  {
    id: 'plan-club-vip',
    name: 'Club VIP & Magazine Papier',
    slug: 'club_vip',
    tagline: '4 Magazines papier collector livrés chez vous + accès VIP chefs',
    badge: 'Club Privilège 👑',
    badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 font-black',
    priceMonthly: 19.99,
    priceAnnually: 179, // ~14.90 € / mois
    currency: 'EUR',
    features: [
      '4 Magazines papier grand format collector livrés directement à votre adresse',
      'Tous les avantages Afrodelicious+ Gourmet (0 publicité + Masterclasses)',
      'Masterclasses en direct exclusives avec les grands chefs étoilés',
      'Réduction permanente de -20% sur la livraison Food et les ateliers',
      'Badge VIP gourmet certifié sur votre profil et vos recettes',
      'Invitations exclusives aux dégustations et dîners secrets en terroirs'
    ],
    highlighted: false,
    buttonText: 'Rejoindre le Club VIP',
    status: 'active',
    subscribersCount: 3480
  }
];

const STORAGE_KEY = 'afrodelicious_pricing_plans_v2';

export const getStoredPricingPlans = (): PricingPlan[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading pricing plans:', err);
  }
  return INITIAL_PRICING_PLANS;
};

export const savePricingPlans = (plans: PricingPlan[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch (err) {
    console.error('Error saving pricing plans:', err);
  }
};

export const resetPricingPlans = (): PricingPlan[] => {
  savePricingPlans(INITIAL_PRICING_PLANS);
  return INITIAL_PRICING_PLANS;
};
