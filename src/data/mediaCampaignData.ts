// Data model and analytics data for advertising & media campaigns on Afrodelicious

export interface AdFormatMetrics {
  formatId: 'native' | 'video' | 'sponsored_recipe' | 'collection' | 'coupon' | 'shoppable_ads';
  formatName: string;
  formatDescription: string;
  cpmEur: number;
  cpmUsd: number;
  cpcEur: number;
  cpcUsd: number;
  // 90-day averages
  ctrPercent: number; // clics / impressions
  interactionRatePercent: number; // swipes, zooms, recipe open, grocery add
  avgTimeSpentSeconds: number; // temps passé
  recipeSaveRatePercent: number; // taux de sauvegarde
  recipeShareRatePercent: number; // taux de partage
  brandReturnRatePercent: number; // taux de retour recette / marque
  totalImpressions90d: number;
  totalClicks90d: number;
}

export interface VideoSpecificKPIs {
  vcrCompletionRatePercent: number; // Vues 100% / démarrées
  completionQuartiles: {
    q25: number;
    q50: number;
    q75: number;
    q100: number;
  };
  avgWatchDurationSeconds: number;
  totalVideoDurationReferenceSeconds: number;
  threeSecondsViewRatePercent: number; // Hook rate
  postVideoClickRatePercent: number; // Clic post-vidéo end card
  replayRatePercent: number; // Taux de replay spontané
  totalVideoStarts90d: number;
  totalVideoFullViews90d: number;
}

export interface RetailerPerformance {
  retailerName: string;
  logoText: string;
  sharePercent: number;
  clicksCount: number;
  directCartAddsCount: number;
  conversionRatePercent: number;
}

export interface PurchaseIntentKPIs {
  totalProductAndBrandClicks: number; // Clics vers page produit, site marque ou retailer
  retailerOutboundClickRatePercent: number; // Taux de clic sortant vers retailers
  retailers: RetailerPerformance[];
  partnerCartAdditionsCount: number; // Ajouts au panier e-commerce partenaire
  partnerCartAdditionRatePercent: number;
  couponRedemptionsAndQrScans: number; // Utilisations de coupons ou scans QR code
  couponRedemptionRatePercent: number;
  groceryListAdditionsCount: number; // Ajouts à la liste de courses intégrée
  groceryListAdditionRatePercent: number;
  brandSearchLiftPercent: number; // Recherches de marque ou produit après exposition (+%)
  finalPurchaseConversionsCount: number; // Achats confirmés mesurés
  conversionRatePercent: number; // Taux de conversion global
  cpaEur: number; // Coût Par Acquisition (CPA)
  cpaUsd: number;
  roasMultiplier: number; // Return on Ad Spend (ROAS)
}

export interface MediaCampaign {
  id: string;
  name: string;
  brandName: string;
  brandCategory: string;
  status: 'active' | 'scheduled' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  budgetTotalEur: number;
  budgetSpentEur: number;
  retailersTargeted: string[];
  formatsUsed: string[];
  targetGeography: string;
  impressions: number;
  clicks: number;
  ctrPercent: number;
  productAndRetailerClicks: number;
  retailerOutboundRatePercent: number;
  cartAdditions: number;
  couponScans: number;
  groceryListAdds: number;
  searchLiftPercent: number;
  conversions: number;
  conversionRatePercent: number;
  cpaEur: number;
  roas: number;
}

export interface CampaignPackage {
  id: string;
  name: string;
  durationDays: number;
  priceEur: number;
  priceUsd: number;
  guaranteedImpressions: number;
  formatsIncluded: string[];
  keyHighlights: string[];
  recommendedFor: string;
}

export interface MediaAnalyticsData {
  periodLabel: string;
  lastUpdated: string;
  // Audience
  audience: {
    totalActiveUsersMonthly: number;
    dailyActiveUsers: number;
    usAudience: {
      percentage: number;
      totalUsers: number;
      topMetros: { city: string; percentage: number; users: number }[];
    };
    internationalBreakdown: { region: string; percentage: number; users: number; flag: string }[];
    ageDistribution: { range: string; percentage: number; description: string }[];
    genderSplit: { gender: string; percentage: number; icon: string }[];
    groceryHabits: {
      cookAtHomeFrequentlyPercent: number; // >= 4x/semaine
      avgBasketSpendEur: number;
      avgBasketSpendUsd: number;
      shoppingFrequency: { label: string; percentage: number }[];
      preferredShoppingChannels: { channel: string; percentage: number }[];
      recipeToGroceryConversionRate: number; // % ajout liste de courses
    };
  };
  // Contexte
  context: {
    topConsultedRecipes: { recipe: string; country: string; monthlyViews: number; category: string }[];
    topSearchedIngredients: { name: string; category: string; searchCount90d: number }[];
    dietaryRegimes: { regime: string; percentage: number; description: string }[];
    devicesUsed: { device: string; percentage: number; icon: string }[];
  };
  // Preuve de valeur
  valueProof: {
    overallEngagementRatePercent: number;
    benchmarkFoodIndustryPercent: number;
    avgTimeSpentOnSponsoredContent: string;
    totalQualifiedClicks90d: number;
    totalGroceryAdditions90d: number;
    avgVideoCompletionRatePercent: number;
  };
  // Intention d'achat (Crucial pour marques FNB)
  purchaseIntent: PurchaseIntentKPIs;
  // Tarifs
  rates: {
    cpmBaselineEur: number;
    cpmBaselineUsd: number;
    cpcBaselineEur: number;
    cpcBaselineUsd: number;
    collectionSponsorshipMonthlyEur: number;
    collectionSponsorshipMonthlyUsd: number;
    packages: CampaignPackage[];
  };
  // Formats & KPIs 90j
  formatsKPIs: AdFormatMetrics[];
  // Video metrics
  videoKPIs: VideoSpecificKPIs;
}

export const INITIAL_MEDIA_CAMPAIGNS: MediaCampaign[] = [
  {
    id: 'camp-1',
    name: 'Campagne Maggi Terroirs & Bouillons d\'Or 2026',
    brandName: 'Maggi / Nestlé Terroirs',
    brandCategory: 'Condiments & Bouillons',
    status: 'active',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    budgetTotalEur: 12500,
    budgetSpentEur: 8750,
    retailersTargeted: ['Walmart', 'Target', 'Amazon Fresh', 'Épiceries de quartier'],
    formatsUsed: ['Recette Sponsorisée', 'Shoppable Ads', 'Vidéo Stories'],
    targetGeography: 'USA & France',
    impressions: 480000,
    clicks: 34560,
    ctrPercent: 7.2,
    productAndRetailerClicks: 26800,
    retailerOutboundRatePercent: 77.5,
    cartAdditions: 7420,
    couponScans: 4180,
    groceryListAdds: 8950,
    searchLiftPercent: 48.2,
    conversions: 2480,
    conversionRatePercent: 9.2,
    cpaEur: 3.52,
    roas: 4.8
  },
  {
    id: 'camp-2',
    name: 'Poivre Blanc de Penja IGP & Épices Rares (USA Launch)',
    brandName: 'Penja Terroirs Gourmets',
    brandCategory: 'Épices d’Exception',
    status: 'active',
    startDate: '2026-09-15',
    endDate: '2026-12-15',
    budgetTotalEur: 8500,
    budgetSpentEur: 5200,
    retailersTargeted: ['Amazon Fresh', 'Instacart', 'Target', 'Whole Foods'],
    formatsUsed: ['Recette Sponsorisée', 'Vidéo In-Feed', 'Shoppable Ads'],
    targetGeography: 'États-Unis (Atlanta, NY, Houston)',
    impressions: 310000,
    clicks: 22630,
    ctrPercent: 7.3,
    productAndRetailerClicks: 17800,
    retailerOutboundRatePercent: 78.6,
    cartAdditions: 4950,
    couponScans: 2850,
    groceryListAdds: 6100,
    searchLiftPercent: 41.5,
    conversions: 1620,
    conversionRatePercent: 9.1,
    cpaEur: 3.21,
    roas: 5.1
  },
  {
    id: 'camp-3',
    name: 'Attiéké Garba Frais sous vide - Drive & Retailers',
    brandName: 'Garba Royal Abidjan',
    brandCategory: 'Féculents & Semoules',
    status: 'active',
    startDate: '2026-08-01',
    endDate: '2026-11-01',
    budgetTotalEur: 6000,
    budgetSpentEur: 5400,
    retailersTargeted: ['Instacart', 'Walmart', 'Kroger', 'Marchés Abidjan & Dakar'],
    formatsUsed: ['Shoppable Ads', 'Coupons Promotionnels', 'Native Feed'],
    targetGeography: 'Afrique (Côte d\'Ivoire, Sénégal, Cameroun)',
    impressions: 260000,
    clicks: 18980,
    ctrPercent: 7.3,
    productAndRetailerClicks: 14200,
    retailerOutboundRatePercent: 74.8,
    cartAdditions: 3820,
    couponScans: 3940,
    groceryListAdds: 5280,
    searchLiftPercent: 39.4,
    conversions: 1350,
    conversionRatePercent: 9.5,
    cpaEur: 4.00,
    roas: 4.4
  },
  {
    id: 'camp-4',
    name: 'Sauces Scotch Bonnet & Miel Pimenté Créole',
    brandName: 'Caribbean Fire Honey',
    brandCategory: 'Sauces Pimentées',
    status: 'active',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    budgetTotalEur: 9500,
    budgetSpentEur: 3200,
    retailersTargeted: ['Amazon Fresh', 'Kroger', 'Target', 'Supermercados Caraïbes'],
    formatsUsed: ['Vidéo Stories', 'Recette Sponsorisée', 'Coupons Promotionnels'],
    targetGeography: 'Amérique Centrale (Panama, Costa Rica) & Caraïbes',
    impressions: 210000,
    clicks: 16170,
    ctrPercent: 7.7,
    productAndRetailerClicks: 12450,
    retailerOutboundRatePercent: 77.0,
    cartAdditions: 3340,
    couponScans: 2790,
    groceryListAdds: 4120,
    searchLiftPercent: 43.1,
    conversions: 1140,
    conversionRatePercent: 9.1,
    cpaEur: 2.81,
    roas: 5.3
  },
  {
    id: 'camp-5',
    name: 'Manioc & Pâte d\'Acarajé Bio Afro-Brésilienne',
    brandName: 'Bahia Afro-Gourmet',
    brandCategory: 'Farines & Traiteur',
    status: 'active',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    budgetTotalEur: 7000,
    budgetSpentEur: 4800,
    retailersTargeted: ['Walmart', 'Carrefour Brésil', 'Épiceries spécialisées'],
    formatsUsed: ['Recette Sponsorisée', 'Shoppable Ads', 'Vidéo Stories'],
    targetGeography: 'Amérique Latine (Brésil / Salvador da Bahia, Colombie)',
    impressions: 240000,
    clicks: 18240,
    ctrPercent: 7.6,
    productAndRetailerClicks: 13800,
    retailerOutboundRatePercent: 75.6,
    cartAdditions: 3720,
    couponScans: 2450,
    groceryListAdds: 4680,
    searchLiftPercent: 46.2,
    conversions: 1280,
    conversionRatePercent: 9.3,
    cpaEur: 3.75,
    roas: 4.9
  },
  {
    id: 'camp-6',
    name: 'Épices Fusion & Lait de Coco Créole (Singapour & Malaisie)',
    brandName: 'Siam-Afro Aromas',
    brandCategory: 'Épices & Nectars',
    status: 'active',
    startDate: '2026-09-10',
    endDate: '2026-12-10',
    budgetTotalEur: 5500,
    budgetSpentEur: 2900,
    retailersTargeted: ['Amazon Singapour', 'Lazada Grocery', 'RedMart'],
    formatsUsed: ['Shoppable Ads', 'Vidéo In-Feed', 'Coupons'],
    targetGeography: 'Asie du Sud-Est (Singapour, Thaïlande, Malaisie)',
    impressions: 175000,
    clicks: 13650,
    ctrPercent: 7.8,
    productAndRetailerClicks: 10500,
    retailerOutboundRatePercent: 76.9,
    cartAdditions: 2950,
    couponScans: 1840,
    groceryListAdds: 3410,
    searchLiftPercent: 37.8,
    conversions: 980,
    conversionRatePercent: 9.3,
    cpaEur: 2.96,
    roas: 5.2
  },
  {
    id: 'camp-7',
    name: 'Huile de Palme Rouge Vierge Bio & Fufu Cassava',
    brandName: 'Nature Terroir Bio',
    brandCategory: 'Huiles & Farines Végétales',
    status: 'paused',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    budgetTotalEur: 5000,
    budgetSpentEur: 4100,
    retailersTargeted: ['Walmart', 'Épiceries indépendantes'],
    formatsUsed: ['Native Feed', 'Coupons Promotionnels'],
    targetGeography: 'France & Belgique',
    impressions: 195000,
    clicks: 11310,
    ctrPercent: 5.8,
    productAndRetailerClicks: 7800,
    retailerOutboundRatePercent: 68.9,
    cartAdditions: 1980,
    couponScans: 2210,
    groceryListAdds: 3120,
    searchLiftPercent: 26.8,
    conversions: 780,
    conversionRatePercent: 10.0,
    cpaEur: 5.25,
    roas: 3.8
  }
];

export const GEOGRAPHIC_TARGET_REGIONS = [
  { id: 'us', label: 'États-Unis (USA)', flag: '🇺🇸', description: 'Atlanta, New York, Houston, Chicago, Washington D.C.' },
  { id: 'africa', label: 'Afrique', flag: '🌍', description: 'Afrique de l’Ouest, Centrale, Est & Australe (Abidjan, Dakar, Douala, Lagos, Nairobi)' },
  { id: 'central_america', label: 'Amérique Centrale', flag: '🌴', description: 'Panama, Costa Rica, Honduras & Caraïbes' },
  { id: 'latin_america', label: 'Amérique Latine', flag: '🌎', description: 'Brésil (Salvador da Bahia, Rio), Colombie, Caraïbes hispaniques' },
  { id: 'southeast_asia', label: 'Asie du Sud-Est', flag: '🌏', description: 'Singapour, Thaïlande, Malaisie, Vietnam' },
  { id: 'france_europe', label: 'France & Europe', flag: '🇫🇷', description: 'Paris, Lyon, Bruxelles, Londres, Genève' },
  { id: 'canada', label: 'Canada', flag: '🇨🇦', description: 'Montréal, Toronto, Québec' },
  { id: 'global', label: 'Global (Tous Continents)', flag: '🌐', description: 'Diffusion internationale multilingue' }
];

export const MEDIA_CAMPAIGN_ANALYTICS: MediaAnalyticsData = {
  periodLabel: 'Moyenne consolidée sur les 90 derniers jours (Août - Octobre 2026)',
  lastUpdated: '29 Octobre 2026',
  
  // 1. AUDIENCE
  audience: {
    totalActiveUsersMonthly: 142850,
    dailyActiveUsers: 46200,
    usAudience: {
      percentage: 38,
      totalUsers: 54283,
      topMetros: [
        { city: 'Atlanta (Georgia)', percentage: 28, users: 15199 },
        { city: 'New York Metro (NY/NJ)', percentage: 24, users: 13028 },
        { city: 'Washington D.C. & Maryland', percentage: 18, users: 9771 },
        { city: 'Houston (Texas)', percentage: 16, users: 8685 },
        { city: 'Chicago (Illinois)', percentage: 14, users: 7600 }
      ]
    },
    internationalBreakdown: [
      { region: 'États-Unis (USA)', percentage: 34, users: 48569, flag: '🇺🇸' },
      { region: 'France & Europe (Paris, Lyon, Bruxelles, Londres)', percentage: 26, users: 37141, flag: '🇫🇷' },
      { region: 'Afrique (Afrique de l’Ouest, Centrale, Est & Australe)', percentage: 18, users: 25713, flag: '🌍' },
      { region: 'Amérique Latine (Brésil / Bahia, Colombie, Caraïbes)', percentage: 8, users: 11428, flag: '🌎' },
      { region: 'Canada (Montréal, Toronto)', percentage: 6, users: 8571, flag: '🇨🇦' },
      { region: 'Asie du Sud-Est (Singapour, Thaïlande, Malaisie)', percentage: 5, users: 7142, flag: '🌏' },
      { region: 'Amérique Centrale (Panama, Costa Rica, Caraïbes)', percentage: 3, users: 4286, flag: '🌴' }
    ],
    ageDistribution: [
      { range: '18-24 ans', percentage: 19, description: 'Étudiants & jeunes explorateurs culinaires (Street food, bento, snacks)' },
      { range: '25-34 ans', percentage: 44, description: 'Cœur de cible actifs & foodies (Repas créatifs, batch cooking, brunchs)' },
      { range: '35-44 ans', percentage: 23, description: 'Familles & cuisiniers du dimanche (Grandes tablées, traditions, bio)' },
      { range: '45-54 ans', percentage: 10, description: 'Gardiens des terroirs & chefs amateurs expérimentés' },
      { range: '55+ ans', percentage: 4, description: 'Cuisine patrimoniale & transmission de recettes secrètes' }
    ],
    genderSplit: [
      { gender: 'Femmes', percentage: 64, icon: 'female' },
      { gender: 'Hommes', percentage: 33, icon: 'male' },
      { gender: 'Non-binaire / Autre', percentage: 3, icon: 'genderless' }
    ],
    groceryHabits: {
      cookAtHomeFrequentlyPercent: 84, // Cuisinent au moins 4x par semaine
      avgBasketSpendEur: 78.50,
      avgBasketSpendUsd: 86.00,
      shoppingFrequency: [
        { label: 'Hebdomadaire (1 à 2 fois par semaine)', percentage: 71 },
        { label: 'Bi-mensuelle (Tous les 15 jours)', percentage: 22 },
        { label: 'Occasionnelle / dépannage', percentage: 7 }
      ],
      preferredShoppingChannels: [
        { channel: 'Épiceries afro-créoles indépendantes de quartier', percentage: 68 },
        { channel: 'Grandes surfaces (Rayon Saveurs du Monde)', percentage: 59 },
        { channel: 'E-commerce & livraison d’ingrédients spécialisés', percentage: 42 },
        { channel: 'Marchés frais & primeurs locaux', percentage: 37 }
      ],
      recipeToGroceryConversionRate: 76 // 76% ajoutent les ingrédients à la liste de courses
    }
  },

  // 2. CONTEXTE
  context: {
    topConsultedRecipes: [
      { recipe: 'Thiéboudienne Rouge Penda Mbaye', country: 'Sénégal', monthlyViews: 52400, category: 'Plat Signature' },
      { recipe: 'Poulet Yassa braisé aux Oignons caramélisés', country: 'Sénégal / Mali', monthlyViews: 46100, category: 'Familial' },
      { recipe: 'Colombo de Cabri & Épices Torréfiées', country: 'Antilles / Guadeloupe', monthlyViews: 39800, category: 'Mijoté festif' },
      { recipe: 'Ndolé Royal aux Crevettes & Viande Fumée', country: 'Cameroun', monthlyViews: 34200, category: 'Traditionnel' },
      { recipe: 'Bokit Frit Morue & Sauce Chien', country: 'Guadeloupe', monthlyViews: 31900, category: 'Street Food' },
      { recipe: 'Alloco croustillant & Sauce Piment Doux', country: 'Côte d’Ivoire', monthlyViews: 28700, category: 'Apéro & Encas' },
      { recipe: 'Egusi Soup au Fufu de Manioc', country: 'Nigeria', monthlyViews: 26400, category: 'Soupe & Fufu' }
    ],
    topSearchedIngredients: [
      { name: 'Piment Habanero / Scotch Bonnet frais', category: 'Épices & Condiments', searchCount90d: 64200 },
      { name: 'Banane Plantain Mûre (Aloko)', category: 'Féculents & Fruits', searchCount90d: 58900 },
      { name: 'Attiéké Frais Garba de Côte d’Ivoire', category: 'Semoules & Terroirs', searchCount90d: 51300 },
      { name: 'Manioc Frais & Farine de Fufu', category: 'Tubercules', searchCount90d: 43800 },
      { name: 'Gombo Frais (Okra)', category: 'Légumes', searchCount90d: 38200 },
      { name: 'Huile de Palme Rouge Vierge Bio', category: 'Huiles & Matières grasses', searchCount90d: 32600 },
      { name: 'Soumbala / Nététou Traditionnel', category: 'Condiments fermentés', searchCount90d: 27100 },
      { name: 'Poivre Blanc de Penja IGP', category: 'Épices d’exception', searchCount90d: 23500 }
    ],
    dietaryRegimes: [
      { regime: 'Halal certifié', percentage: 38, description: 'Forte sensibilité aux viandes et produits certifiés halal' },
      { regime: 'Traditionnel Afro-Fusion', percentage: 31, description: 'Recettes authentiques avec touches contemporaines' },
      { regime: 'Végétarien & Flexitarien', percentage: 16, description: 'Plats riches en légumineuses, gombo, plantain et sauces sans viande' },
      { regime: 'Sans Gluten (Cassava/Plantain base)', percentage: 10, description: 'Cuisine naturellement sans gluten à base de tubercules' },
      { regime: 'Pescétarien (Poissons & Fruits de mer)', percentage: 5, description: 'Caris de poissons, crevettes sautées, daubes de thon' }
    ],
    devicesUsed: [
      { device: 'iOS (iPhone / iPad)', percentage: 58, icon: 'apple' },
      { device: 'Android (Samsung, Pixel, Xiaomi)', percentage: 34, icon: 'smartphone' },
      { device: 'Web Mobile', percentage: 5, icon: 'globe' },
      { device: 'Desktop / Ordinateur', percentage: 3, icon: 'monitor' }
    ]
  },

  // 3. PREUVE DE VALEUR
  valueProof: {
    overallEngagementRatePercent: 7.8,
    benchmarkFoodIndustryPercent: 2.1,
    avgTimeSpentOnSponsoredContent: '3 min 48s',
    totalQualifiedClicks90d: 194850,
    totalGroceryAdditions90d: 44200,
    avgVideoCompletionRatePercent: 68.4
  },

  // 4. KPIS D'INTENTION D'ACHAT (SECTION LA PLUS CRUCIALE POUR LES MARQUES FNB)
  purchaseIntent: {
    totalProductAndBrandClicks: 148200, // Clics vers fiche produit, site marque ou retailer
    retailerOutboundClickRatePercent: 76.1, // 76.1% des clics sont sortants vers un marchand d'achat
    retailers: [
      { retailerName: 'Amazon Fresh & Pantry', logoText: 'Amazon', sharePercent: 36, clicksCount: 53352, directCartAddsCount: 14240, conversionRatePercent: 9.4 },
      { retailerName: 'Walmart Grocery & Supercenter', logoText: 'Walmart', sharePercent: 25, clicksCount: 37050, directCartAddsCount: 9630, conversionRatePercent: 8.8 },
      { retailerName: 'Instacart Delivery', logoText: 'Instacart', sharePercent: 18, clicksCount: 26676, directCartAddsCount: 7420, conversionRatePercent: 10.2 },
      { retailerName: 'Target Food & Market', logoText: 'Target', sharePercent: 11, clicksCount: 16302, directCartAddsCount: 4110, conversionRatePercent: 7.9 },
      { retailerName: 'Kroger Pickup', logoText: 'Kroger', sharePercent: 6, clicksCount: 8892, directCartAddsCount: 2050, conversionRatePercent: 7.4 },
      { retailerName: 'Épiceries Partenaires Afro & Terroirs', logoText: 'Afro Shops', sharePercent: 4, clicksCount: 5928, directCartAddsCount: 1820, conversionRatePercent: 11.5 }
    ],
    partnerCartAdditionsCount: 39270, // Ajouts directs au panier e-commerce partenaire
    partnerCartAdditionRatePercent: 26.5,
    couponRedemptionsAndQrScans: 22640, // Utilisations de coupons / scans QR codes
    couponRedemptionRatePercent: 28.5,
    groceryListAdditionsCount: 44200, // Ajouts à la liste de courses in-app
    groceryListAdditionRatePercent: 29.8,
    brandSearchLiftPercent: 42.6, // Search lift : +42.6% de recherches de marque dans l'app
    finalPurchaseConversionsCount: 12450, // Achats confirmés trackés
    conversionRatePercent: 8.4, // Taux de conversion global
    cpaEur: 3.65, // Coût par acquisition / commande confirmée
    cpaUsd: 3.98,
    roasMultiplier: 4.8 // Return on Ad Spend : 4.80 € générés pour 1 € investi
  },

  // 5. TARIFS & PACKAGES
  rates: {
    cpmBaselineEur: 18.00,
    cpmBaselineUsd: 19.50,
    cpcBaselineEur: 0.95,
    cpcBaselineUsd: 1.05,
    collectionSponsorshipMonthlyEur: 3200,
    collectionSponsorshipMonthlyUsd: 3500,
    packages: [
      {
        id: 'pack-starter',
        name: 'Pack Starter Terroir',
        durationDays: 30,
        priceEur: 2400,
        priceUsd: 2600,
        guaranteedImpressions: 120000,
        formatsIncluded: ['Native Feed Ads', '1 Recette de Chef Sponsorisée', 'Lien Shopping direct'],
        keyHighlights: [
          'Visibilité garantie sur 120 000 impressions',
          'Ciblage géographique France ou USA',
          'Rapport de performance hebdomadaire'
        ],
        recommendedFor: 'Marques agroalimentaires émergentes & épiceries locales'
      },
      {
        id: 'pack-impact-360',
        name: 'Pack Brand Impact 360°',
        durationDays: 60,
        priceEur: 7500,
        priceUsd: 8200,
        guaranteedImpressions: 450000,
        formatsIncluded: [
          '3 Recettes de Chefs Sponsorisées',
          '2 Vidéos Stories Immersion 24h',
          'Format Shoppable 1-Click Grocery',
          'Coupons Promotionnels In-App'
        ],
        keyHighlights: [
          '450 000 impressions garanties',
          'Ajout automatique au panier / liste de courses',
          'Exclusivité de catégorie durant les 60 jours',
          'Accompagnement créatif par notre studio éditorial'
        ],
        recommendedFor: 'Marques nationales, distributeurs & chaînes de restauration'
      },
      {
        id: 'pack-domination',
        name: 'Pack Masterclass & Domination',
        durationDays: 90,
        priceEur: 14900,
        priceUsd: 16200,
        guaranteedImpressions: 1100000,
        formatsIncluded: [
          'Sponsoring Exclusif de Collection (90 jours)',
          'Masterclass Vidéo HD avec Chef Vedette',
          'Tous Formats : Vidéo, Native, Shoppable & Coupons',
          'Push Notifications Partenaire ciblées'
        ],
        keyHighlights: [
          '+1,1 Million d’impressions multi-plateformes',
          'Logo sponsorisé sur toute la thématique',
          'Intégration permanente dans l’annuaire des marques',
          'Export des insights conso anonymisés'
        ],
        recommendedFor: 'Grands groupes FMCG, offices de tourisme & leaders de l’agro-industrie'
      }
    ]
  },

  // 6. KPIS D'ENGAGEMENT PAR FORMAT (MOYENNE 90 DERNIERS JOURS)
  formatsKPIs: [
    {
      formatId: 'native',
      formatName: 'Format Native Display',
      formatDescription: 'Encarts visuels et textuels fondus naturellement dans le feed de découverte.',
      cpmEur: 18.00,
      cpmUsd: 19.50,
      cpcEur: 0.85,
      cpcUsd: 0.95,
      ctrPercent: 3.4,
      interactionRatePercent: 6.2,
      avgTimeSpentSeconds: 65,
      recipeSaveRatePercent: 4.8,
      recipeShareRatePercent: 3.2,
      brandReturnRatePercent: 18.5,
      totalImpressions90d: 840000,
      totalClicks90d: 28560
    },
    {
      formatId: 'video',
      formatName: 'Format Vidéo In-Feed & Stories',
      formatDescription: 'Courtes capsules verticales 9:16 dynamiques, astuces de chefs et coulisses de recettes.',
      cpmEur: 28.00,
      cpmUsd: 30.50,
      cpcEur: 1.15,
      cpcUsd: 1.25,
      ctrPercent: 5.2,
      interactionRatePercent: 15.4,
      avgTimeSpentSeconds: 145,
      recipeSaveRatePercent: 8.5,
      recipeShareRatePercent: 12.6,
      brandReturnRatePercent: 24.8,
      totalImpressions90d: 620000,
      totalClicks90d: 32240
    },
    {
      formatId: 'sponsored_recipe',
      formatName: 'Recette Sponsorisée de Chef',
      formatDescription: 'Recette authentique dédiée mettant en vedette les produits de la marque sponsor.',
      cpmEur: 24.00,
      cpmUsd: 26.00,
      cpcEur: 1.05,
      cpcUsd: 1.15,
      ctrPercent: 6.8,
      interactionRatePercent: 19.2,
      avgTimeSpentSeconds: 258,
      recipeSaveRatePercent: 16.4,
      recipeShareRatePercent: 9.2,
      brandReturnRatePercent: 34.2,
      totalImpressions90d: 490000,
      totalClicks90d: 33320
    },
    {
      formatId: 'collection',
      formatName: 'Sponsoring de Collection Thématique',
      formatDescription: 'Hub thématique saisonnier (ex: Grillades Afro-Caribéennes, Fêtes de Fin d’Année).',
      cpmEur: 22.00,
      cpmUsd: 24.00,
      cpcEur: 0.95,
      cpcUsd: 1.05,
      ctrPercent: 4.9,
      interactionRatePercent: 13.8,
      avgTimeSpentSeconds: 150,
      recipeSaveRatePercent: 11.2,
      recipeShareRatePercent: 7.8,
      brandReturnRatePercent: 22.1,
      totalImpressions90d: 380000,
      totalClicks90d: 18620
    },
    {
      formatId: 'coupon',
      formatName: 'Coupons & Bons de Réduction',
      formatDescription: 'Offres promotionnelles immédiates à valoir en supermarché ou épiceries en ligne.',
      cpmEur: 26.00,
      cpmUsd: 28.50,
      cpcEur: 0.88,
      cpcUsd: 0.98,
      ctrPercent: 9.1,
      interactionRatePercent: 18.1,
      avgTimeSpentSeconds: 85,
      recipeSaveRatePercent: 12.8,
      recipeShareRatePercent: 11.4,
      brandReturnRatePercent: 36.5,
      totalImpressions90d: 310000,
      totalClicks90d: 28210
    },
    {
      formatId: 'shoppable_ads',
      formatName: 'Shoppable Ads (Ajout Panier 1-Clic)',
      formatDescription: 'Publicité interactive permettant d’ajouter tous les ingrédients à la liste de courses en un clic.',
      cpmEur: 34.00,
      cpmUsd: 37.00,
      cpcEur: 1.25,
      cpcUsd: 1.38,
      ctrPercent: 7.9,
      interactionRatePercent: 22.4,
      avgTimeSpentSeconds: 225,
      recipeSaveRatePercent: 14.8,
      recipeShareRatePercent: 6.4,
      brandReturnRatePercent: 29.8,
      totalImpressions90d: 410000,
      totalClicks90d: 32390
    }
  ],

  // 7. INDICATEURS VIDÉO INDISPENSABLES
  videoKPIs: {
    vcrCompletionRatePercent: 68.4,
    completionQuartiles: {
      q25: 92.1,
      q50: 81.4,
      q75: 73.8,
      q100: 68.4
    },
    avgWatchDurationSeconds: 24.6,
    totalVideoDurationReferenceSeconds: 30.0,
    threeSecondsViewRatePercent: 86.2,
    postVideoClickRatePercent: 11.4,
    replayRatePercent: 17.3,
    totalVideoStarts90d: 420000,
    totalVideoFullViews90d: 287280
  }
};

/**
 * Download Media Campaign Analytics as CSV
 */
export function downloadMediaReportCsv(): void {
  const data = MEDIA_CAMPAIGN_ANALYTICS;
  const rows: (string | number)[][] = [
    ['AFRODELICIOUS - ANALYSES MEDIAS & CAMPAGNES PUBLICITAIRES (MEDIA KIT 2026)'],
    ['Periode', data.periodLabel],
    ['Derniere mise a jour', data.lastUpdated],
    [],
    ['=== 1. AUDIENCE & DEMOGRAPHIE ==='],
    ['Utilisateurs Actifs Mensuels (MAU)', data.audience.totalActiveUsersMonthly],
    ['Utilisateurs Actifs Quotidiens (DAU)', data.audience.dailyActiveUsers],
    ['Part Audience Etats-Unis (USA)', `${data.audience.usAudience.percentage}% (${data.audience.usAudience.totalUsers} utilisateurs)`],
    [],
    ['Top Metropoles USA', 'Part %', 'Nombre utilisateurs'],
    ...data.audience.usAudience.topMetros.map(m => [m.city, `${m.percentage}%`, m.users]),
    [],
    ['=== 2. KPIS D\'INTENTION D\'ACHAT (BRANDS FNB) ==='],
    ['Clics vers page produit, site de marque ou retailer', data.purchaseIntent.totalProductAndBrandClicks],
    ['Taux de clic sortant vers retailers partenaires', `${data.purchaseIntent.retailerOutboundClickRatePercent}%`],
    ['Ajouts au panier e-commerce partenaire', `${data.purchaseIntent.partnerCartAdditionsCount} (${data.purchaseIntent.partnerCartAdditionRatePercent}%)`],
    ['Utilisations de coupons et scans QR code', `${data.purchaseIntent.couponRedemptionsAndQrScans} (${data.purchaseIntent.couponRedemptionRatePercent}%)`],
    ['Ajouts a la liste de courses in-app', `${data.purchaseIntent.groceryListAdditionsCount} (${data.purchaseIntent.groceryListAdditionRatePercent}%)`],
    ['Search Lift post-exposition (Recherches marque)', `+${data.purchaseIntent.brandSearchLiftPercent}%`],
    ['Achats confirmes trackes', data.purchaseIntent.finalPurchaseConversionsCount],
    ['Taux de conversion global', `${data.purchaseIntent.conversionRatePercent}%`],
    ['CPA moyen (Cout par acquisition)', `${data.purchaseIntent.cpaEur} EUR / $${data.purchaseIntent.cpaUsd} USD`],
    ['ROAS (Return on Ad Spend)', `${data.purchaseIntent.roasMultiplier}x`],
    [],
    ['Repartition par Retailer Partenaire', 'Part %', 'Clics Sortants', 'Ajouts Panier', 'Taux Conversion'],
    ...data.purchaseIntent.retailers.map(r => [r.retailerName, `${r.sharePercent}%`, r.clicksCount, r.directCartAddsCount, `${r.conversionRatePercent}%`]),
    [],
    ['=== 3. KPIS D\'ENGAGEMENT PAR FORMAT (MOYENNE 90 JOURS) ==='],
    [
      'Format',
      'CPM (EUR)',
      'CPC (EUR)',
      'CTR (Clics/Impressions)',
      'Taux d\'interaction',
      'Temps passe moyen',
      'Taux de sauvegarde',
      'Taux de partage',
      'Taux de retour marque'
    ],
    ...data.formatsKPIs.map(f => [
      f.formatName,
      `${f.cpmEur.toFixed(2)} €`,
      `${f.cpcEur.toFixed(2)} €`,
      `${f.ctrPercent}%`,
      `${f.interactionRatePercent}%`,
      `${Math.floor(f.avgTimeSpentSeconds / 60)}m ${f.avgTimeSpentSeconds % 60}s`,
      `${f.recipeSaveRatePercent}%`,
      `${f.recipeShareRatePercent}%`,
      `${f.brandReturnRatePercent}%`
    ]),
    [],
    ['=== 4. INDICATEURS VIDEO INDISPENSABLES ==='],
    ['Taux de completion video (VCR)', `${data.videoKPIs.vcrCompletionRatePercent}%`],
    ['Completion a 25%', `${data.videoKPIs.completionQuartiles.q25}%`],
    ['Completion a 50%', `${data.videoKPIs.completionQuartiles.q50}%`],
    ['Completion a 75%', `${data.videoKPIs.completionQuartiles.q75}%`],
    ['Completion a 100%', `${data.videoKPIs.completionQuartiles.q100}%`],
    ['Duree moyenne de visionnage', `${data.videoKPIs.avgWatchDurationSeconds} secondes (sur video 30s)`],
    ['Taux de visionnage apres 3 secondes (Hook rate)', `${data.videoKPIs.threeSecondsViewRatePercent}%`],
    ['Taux de clic post-video (End Card CTA)', `${data.videoKPIs.postVideoClickRatePercent}%`],
    ['Taux de replay spontane', `${data.videoKPIs.replayRatePercent}%`]
  ];

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.map(val => `"${val}"`).join(';')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Media_Kit_Campagnes_Pub_Afrodelicious_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download Media Campaign Analytics as JSON
 */
export function downloadMediaReportJson(): void {
  const exportPayload = {
    analytics: MEDIA_CAMPAIGN_ANALYTICS,
    activeCampaigns: INITIAL_MEDIA_CAMPAIGNS
  };
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `Media_Kit_Campagnes_Pub_Afrodelicious_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
