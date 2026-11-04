// Multi-Format Ad Campaigns Manager for Afrodelicious (All Features)
// Formats: native, video, recette sponsorisée, collection, coupon, shoppable ads.
// Media Types: images, textes, videos.

export type AdFormat = 
  | 'native' 
  | 'video' 
  | 'sponsored_recipe' 
  | 'collection' 
  | 'coupon' 
  | 'shoppable_ads';

export type AdMediaType = 'image' | 'text' | 'video';

export type AppFeatureTarget = 
  | 'all'
  | 'feed'
  | 'explore'
  | 'masterclasses' // Online Cooking Classes
  | 'experiences'
  | 'delivery'
  | 'planner'
  | 'communities'
  | 'grocery';

export interface ShoppableProduct {
  name: string;
  price: string;
  retailer: 'Amazon' | 'Walmart' | 'Instacart' | 'Carrefour' | 'Kroger' | 'Target';
  link: string;
  image?: string;
}

export interface CollectionItem {
  title: string;
  image: string;
  tag: string;
  link?: string;
}

export interface AdminAdCampaign {
  id: string;
  brandName: string;
  campaignName: string;
  format: AdFormat;
  mediaType: AdMediaType;
  targetFeatures: AppFeatureTarget[];
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  badgeLabel?: string;
  imageUrl?: string;
  videoUrl?: string;
  videoDurationSeconds?: number;
  couponCode?: string;
  discountPercentage?: string;
  shoppableProducts?: ShoppableProduct[];
  collectionItems?: CollectionItem[];
  sponsoredRecipeId?: string;
  status: 'active' | 'paused';
  impressions: number;
  clicks: number;
  createdAt: string;
}

export const INITIAL_ADMIN_ADS: AdminAdCampaign[] = [
  {
    id: 'ad-native-spices',
    brandName: 'Épices Royales d’Afrique',
    campaignName: 'Piment de Penja & Poivre Sauvage Bio',
    format: 'native',
    mediaType: 'image',
    targetFeatures: ['all', 'feed', 'explore'],
    title: 'Poivre Blanc de Penja IGP & Piment Habanero Sauvage',
    description: 'Sélectionné à la main par nos producteurs partenaires au Cameroun. Rehaussez vos sauces et grillades avec l’excellence gastronomique.',
    ctaText: 'Commander le coffret dégustation (-20%)',
    ctaLink: 'https://amazon.com',
    badgeLabel: 'Sponsorisé · Terroirs d’Excellence',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    impressions: 12450,
    clicks: 1120,
    createdAt: '2026-10-15'
  },
  {
    id: 'ad-video-sauce',
    brandName: 'Maison Kédjénou & Braisés',
    campaignName: 'Recette Braisée en Vidéo HD 4K',
    format: 'video',
    mediaType: 'video',
    targetFeatures: ['all', 'feed', 'masterclasses', 'experiences'],
    title: 'Découvrez le secret d’un poulet braisé croustillant et juteux',
    description: 'Regardez notre capsule vidéo de 30 secondes pour maîtriser la marinade aux 14 herbes et épices fraîches.',
    ctaText: 'Voir la masterclass offerte',
    ctaLink: '#',
    badgeLabel: 'Annonce Vidéo Sponsorisée',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-vegetables-in-a-pan-43093-large.mp4',
    videoDurationSeconds: 28,
    status: 'active',
    impressions: 18900,
    clicks: 2340,
    createdAt: '2026-10-20'
  },
  {
    id: 'ad-recipe-attieke',
    brandName: 'Garba Express & Terroir',
    campaignName: 'Recette Sponsorisée : Attiéké Poisson Thon Braisé',
    format: 'sponsored_recipe',
    mediaType: 'image',
    targetFeatures: ['all', 'feed', 'explore', 'planner'],
    title: 'Recette Signature : Attiéké Garba Authentique d’Abidjan',
    description: 'Par Cheffe Awa Traoré en partenariat exclusif avec Garba Express. Une semoule de manioc ultra-fraîche accompagnée d’un thon mariné aux oignons croustillants.',
    ctaText: 'Cuisiner cette recette sponsorisée',
    ctaLink: '#',
    badgeLabel: 'Recette Sponsorisée · Garba Express',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    impressions: 15400,
    clicks: 1670,
    createdAt: '2026-10-22'
  },
  {
    id: 'ad-collection-rum',
    brandName: 'Terres Créoles & Rhums Rares',
    campaignName: 'Collection Dégustation : Rhums Agricoles & Vanilles Bourbon',
    format: 'collection',
    mediaType: 'image',
    targetFeatures: ['all', 'experiences', 'explore', 'masterclasses'],
    title: 'Collection Prestige des Caraïbes & Mascareignes',
    description: 'Explorez notre sélection artisanale de fûts d’exception, rhums vieux AOC Martinique, et gousses de vanille de Madagascar.',
    ctaText: 'Découvrir la Collection Prestige',
    ctaLink: '#',
    badgeLabel: 'Collection Partenaire',
    collectionItems: [
      {
        title: 'Rhum Vieux Agricole 12 ans',
        image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80',
        tag: 'Martinique AOC'
      },
      {
        title: 'Gousses Vanille Noire Bourbon',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
        tag: 'Madagascar Bio'
      },
      {
        title: 'Miel Sauvage de Forêt Tropicale',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
        tag: 'Guadeloupe'
      }
    ],
    status: 'active',
    impressions: 9800,
    clicks: 890,
    createdAt: '2026-10-25'
  },
  {
    id: 'ad-coupon-supermarket',
    brandName: 'AfroMarket & Carrefour Bio',
    campaignName: 'Bon de Réduction -30% Produits Frais & Épicerie',
    format: 'coupon',
    mediaType: 'text',
    targetFeatures: ['all', 'delivery', 'grocery', 'planner', 'feed'],
    title: 'Bon d’Achat Exclusif : -30% sur votre panier d’épicerie africaine',
    description: 'Valable sur l’huile de palme rouge pressée à froid, plantains mûrs, attiéké, et poissons fumés jusqu’au 30 novembre 2026.',
    ctaText: 'Utiliser sur AfroMarket',
    ctaLink: 'https://amazon.com',
    couponCode: 'AFRODELICIOUS30',
    discountPercentage: '-30% Immédiat',
    badgeLabel: 'Coupon Vérifié Partenaire',
    status: 'active',
    impressions: 21300,
    clicks: 3410,
    createdAt: '2026-10-26'
  },
  {
    id: 'ad-shoppable-sauces',
    brandName: 'Pimenterie des Antilles',
    campaignName: 'Shoppable Ads : Trio de Piments & Condiments',
    format: 'shoppable_ads',
    mediaType: 'image',
    targetFeatures: ['all', 'feed', 'explore', 'grocery', 'delivery'],
    title: 'Shoppable Ad : Achetez les ingrédients directement en 1 clic',
    description: 'Disponibles immédiatement chez nos partenaires de livraison rapide (Amazon Prime, Walmart Grocery & Instacart).',
    ctaText: 'Ajouter les 3 articles au panier',
    ctaLink: 'https://instacart.com',
    badgeLabel: 'Shoppable Ad · Achat en 1 clic',
    imageUrl: 'https://images.unsplash.com/photo-1588276552401-30058a0fe57b?auto=format&fit=crop&w=800&q=80',
    shoppableProducts: [
      {
        name: 'Sauce Piment Habanero Créole',
        price: '4.80 €',
        retailer: 'Amazon',
        link: 'https://amazon.com'
      },
      {
        name: 'Pâte d’Ail & Gingembre Pilé',
        price: '3.50 €',
        retailer: 'Walmart',
        link: 'https://walmart.com'
      },
      {
        name: 'Huile de Piment Végétarien Doux',
        price: '5.20 €',
        retailer: 'Instacart',
        link: 'https://instacart.com'
      }
    ],
    status: 'active',
    impressions: 17200,
    clicks: 2180,
    createdAt: '2026-10-28'
  }
];

const LOCAL_STORAGE_KEY = 'afrodelicious_admin_ad_campaigns';

export function getStoredAdCampaigns(): AdminAdCampaign[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading ad campaigns from localStorage:', e);
  }
  return INITIAL_ADMIN_ADS;
}

export function saveAdCampaigns(campaigns: AdminAdCampaign[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(campaigns));
  } catch (e) {
    console.error('Error saving ad campaigns to localStorage:', e);
  }
}

export function getAdsForFeature(feature: AppFeatureTarget): AdminAdCampaign[] {
  const allAds = getStoredAdCampaigns();
  return allAds.filter(ad => 
    ad.status === 'active' && 
    (ad.targetFeatures.includes('all') || ad.targetFeatures.includes(feature))
  );
}
