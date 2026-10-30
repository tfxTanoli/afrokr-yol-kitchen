export type AfroIngredientCategory = 
  | 'Bases & Féculents'
  | 'Légumineuses'
  | 'Légumes & Racines'
  | 'Fruits Tropicaux'
  | 'Protéines'
  | 'Épices & Aromates'
  | 'Matières Grasses & Liquides'
  | 'Condiments & Sauces';

export interface AfroIngredient {
  id: string;
  name: string;
  nom_fr?: string;
  nom_en?: string;
  icon: string;
  category: AfroIngredientCategory;
  type?: string;
  sous_type?: string;
  region?: string[];
  pays_associes?: string[];
  origine_principale?: string;
  niveau_piquant?: number;
  profil_gustatif?: string[];
  usage_culinaire?: string[];
  formes?: string[];
  compatibilite?: string[];
  substituts?: string[];
  aliases: string[];
  tags: string[];
  aisle: 'Marché Frais & Légumes' | 'Boucherie & Poissons' | 'Épicerie & Épices Afro' | 'Féculents & Racines' | 'Condiments & Huiles' | 'Rayon Frais';
  defaultAmount: number;
  defaultUnit: string;
  popular?: boolean;
  culturalNote?: string;
}

export interface IngredientCategoryMeta {
  id: AfroIngredientCategory;
  label: string;
  icon: string;
  description: string;
  color: string;
  bgLight: string;
  borderColor: string;
}

export const AFRO_INGREDIENT_CATEGORIES: IngredientCategoryMeta[] = [
  {
    id: 'Bases & Féculents',
    label: 'Bases & Féculents',
    icon: '🌾',
    description: 'Bouillies, pains plats, purées et accompagnements phares',
    color: 'text-amber-800',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-300'
  },
  {
    id: 'Légumineuses',
    label: 'Légumineuses',
    icon: '🫘',
    description: 'Haricots, pois, niébé et arachides en ragoûts et sauces',
    color: 'text-emerald-800',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-300'
  },
  {
    id: 'Légumes & Racines',
    label: 'Légumes & Racines',
    icon: '🥬',
    description: 'Feuilles traditionnelles, gombos, piments et racines locales',
    color: 'text-green-800',
    bgLight: 'bg-green-50',
    borderColor: 'border-green-300'
  },
  {
    id: 'Fruits Tropicaux',
    label: 'Fruits Tropicaux',
    icon: '🥭',
    description: 'Saveurs sucrées, marinades acides, jus et desserts créoles',
    color: 'text-orange-800',
    bgLight: 'bg-orange-50',
    borderColor: 'border-orange-300'
  },
  {
    id: 'Protéines',
    label: 'Protéines',
    icon: '🥩',
    description: 'Poissons fumés, fruits de mer, viandes mijotées et œufs',
    color: 'text-rose-800',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-300'
  },
  {
    id: 'Épices & Aromates',
    label: 'Épices & Aromates',
    icon: '🌿',
    description: 'L’âme et la signature aromatique des terroirs afro-caribéens',
    color: 'text-teal-800',
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-300'
  },
  {
    id: 'Matières Grasses & Liquides',
    label: 'Matières Grasses & Liquides',
    icon: '🛢️',
    description: 'Huile rouge, laits de coco, canne à sucre et bouillons',
    color: 'text-yellow-800',
    bgLight: 'bg-yellow-50',
    borderColor: 'border-yellow-300'
  },
  {
    id: 'Condiments & Sauces',
    label: 'Condiments & Sauces',
    icon: '🥫',
    description: 'Pâtes signatures, égusi, green seasoning et marinades',
    color: 'text-purple-800',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-300'
  }
];

export const AFRO_CARIBBEAN_INGREDIENTS: AfroIngredient[] = [
  // ==========================================
  // 1. BASES ET FÉCULENTS
  // ==========================================
  {
    id: 'ing_rice',
    name: 'Riz',
    nom_fr: 'Riz',
    nom_en: 'Rice',
    icon: '🌾',
    category: 'Bases & Féculents',
    type: 'feculent',
    sous_type: 'cereale',
    region: ['Afrique', 'Caraibes'],
    pays_associes: ['Ghana', 'Nigeria', 'Senegal', 'Jamaique', 'Haiti', 'Trinite-et-Tobago'],
    origine_principale: 'Multi-regional',
    niveau_piquant: 0,
    profil_gustatif: ['neutre', 'doux'],
    usage_culinaire: ['accompagnement', 'plat_principal', 'riz_pilaf', 'riz_aux_haricots'],
    formes: ['grain_long', 'grain_court', 'riz_parfume', 'riz_complet'],
    compatibilite: ['poisson', 'poulet', 'haricots', 'sauces'],
    substituts: ['millet', 'sorgho', 'fonio'],
    aliases: ['broken rice', 'riz brisé', 'jasmine rice', 'riz rouge', 'ceebu jen rice', 'white_rice', 'brown_rice', 'base-riz'],
    tags: ['base', 'feculent', 'cereale', 'sans gluten', 'incontournable'],
    aisle: 'Féculents & Racines',
    defaultAmount: 500,
    defaultUnit: 'g',
    popular: true,
    culturalNote: 'Base du Thiéboudienne sénégalais, Jollof Rice ouest-africain et riz collé antillais'
  },
  {
    id: 'ing_corn',
    name: 'Maïs',
    nom_fr: 'Maïs',
    nom_en: 'Corn',
    icon: '🌽',
    category: 'Bases & Féculents',
    type: 'feculent',
    sous_type: 'cereale',
    region: ['Afrique', 'Caraibes'],
    pays_associes: ['Kenya', 'Tanzanie', 'Zimbabwe', 'Jamaique'],
    origine_principale: 'Multi-regional',
    niveau_piquant: 0,
    profil_gustatif: ['doux', 'feculent'],
    usage_culinaire: ['bouillies', 'polenta', 'pain', 'accompagnement'],
    formes: ['grain', 'farine', 'semoule'],
    compatibilite: ['haricots', 'legumes', 'viandes'],
    substituts: ['millet', 'sorgho', 'riz'],
    aliases: ['corn', 'maize', 'épis de maïs', 'grains de maïs', 'choclo', 'base-mais'],
    tags: ['base', 'feculent', 'cereale', 'bouillie', 'grillé'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'épis',
    popular: true
  },
  {
    id: 'ing_sweet_potato',
    name: 'Patate douce',
    nom_fr: 'Patate douce',
    nom_en: 'Sweet Potato',
    icon: '🥔',
    category: 'Bases & Féculents',
    type: 'feculent',
    sous_type: 'tubercule',
    region: ['Afrique', 'Caraibes'],
    pays_associes: ['Nigeria', 'Ghana', 'Haïti', 'République dominicaine'],
    origine_principale: 'Multi-regional',
    niveau_piquant: 0,
    profil_gustatif: ['doux', 'sucre', 'terreux'],
    usage_culinaire: ['bouilli', 'rôti', 'purée', 'soupe'],
    formes: ['orange', 'blanche', 'violette'],
    compatibilite: ['poisson', 'poulet', 'soupes', 'legumes'],
    substituts: ['igname', 'taro', 'pommes_de_terre'],
    aliases: ['sweet potato', 'batata', 'camote', 'boniato', 'yam_sweet', 'base-patate-douce'],
    tags: ['base', 'tubercule', 'sucré', 'racine', 'doux', 'frites', 'purée'],
    aisle: 'Féculents & Racines',
    defaultAmount: 2,
    defaultUnit: 'pièces',
    popular: true
  },
  {
    id: 'ing_yam',
    name: 'Igname',
    nom_fr: 'Igname',
    nom_en: 'Yam',
    icon: '🍠',
    category: 'Bases & Féculents',
    type: 'feculent',
    sous_type: 'tubercule',
    region: ['Afrique', 'Caraibes'],
    pays_associes: ['Nigeria', 'Ghana', 'Côte d\'Ivoire', 'Jamaique', 'Haïti'],
    origine_principale: 'Afrique de l\'Ouest',
    niveau_piquant: 0,
    profil_gustatif: ['doux', 'feculent', 'terreux'],
    usage_culinaire: ['bouilli', 'pilé', 'frit', 'soupe'],
    formes: ['frais', 'poudre', 'flocons'],
    compatibilite: ['soupes', 'sauces', 'poisson', 'viandes'],
    substituts: ['patate_douce', 'igname_douce', 'taro'],
    aliases: ['yam', 'ñame', 'igname blanche', 'igname jaune', 'pounded yam', 'yam_root', 'base-igname'],
    tags: ['base', 'tubercule', 'traditionnel', 'racine', 'pili-pili', 'fufu'],
    aisle: 'Féculents & Racines',
    defaultAmount: 500,
    defaultUnit: 'g',
    popular: true,
    culturalNote: 'Pilier des fêtes de l’igname en Afrique de l’Ouest et Caraïbes'
  },
  {
    id: 'ing_cassava',
    name: 'Manioc / yuca / cassava',
    nom_fr: 'Manioc',
    nom_en: 'Cassava',
    icon: '🌿',
    category: 'Bases & Féculents',
    type: 'feculent',
    sous_type: 'racine',
    region: ['Afrique', 'Caraibes'],
    pays_associes: ['Nigeria', 'Congo', 'Ghana', 'Haiti', 'Guyana', 'Grenade'],
    origine_principale: 'Tropical',
    niveau_piquant: 0,
    profil_gustatif: ['neutre', 'terreux'],
    usage_culinaire: ['fufu', 'gari', 'eba', 'bammie', 'farine', 'bouillies'],
    formes: ['racine', 'farine', 'gari', 'tapioca', 'chips'],
    compatibilite: ['sauces', 'ragouts', 'soupes', 'poisson'],
    substituts: ['patate_douce', 'igname', 'taro'],
    aliases: ['manioc', 'yuca', 'cassava', 'mandioca', 'aipim', 'yucca', 'cassava_root', 'base-manioc'],
    tags: ['base', 'racine', 'tropical', 'tubercule', 'sans gluten', 'fermenté', 'bouilli', 'frit'],
    aisle: 'Féculents & Racines',
    defaultAmount: 600,
    defaultUnit: 'g',
    popular: true,
    culturalNote: 'Plante nourricière par excellence, consommée en racine, semoule (gari/attiéké) ou feuilles (saka-saka)'
  },
  {
    id: 'ing_plantain',
    name: 'Plantain',
    nom_fr: 'Plantain',
    nom_en: 'Plantain',
    icon: '🍌',
    category: 'Bases & Féculents',
    type: 'feculent',
    sous_type: 'fruit_cuisinable',
    region: ['Afrique', 'Caraibes'],
    pays_associes: ['Nigeria', 'Ghana', 'Cameroun', 'Jamaique', 'Haiti', 'Barbade'],
    origine_principale: 'Tropical',
    niveau_piquant: 0,
    profil_gustatif: ['doux', 'feculent', 'legerement_sucre'],
    usage_culinaire: ['frit', 'bouilli', 'grille', 'ecrase', 'chips'],
    formes: ['vert', 'mure', 'tres_mure'],
    compatibilite: ['poisson', 'riz', 'haricots', 'viandes'],
    substituts: ['banane_verte', 'breadfruit'],
    aliases: ['banane plantain', 'green plantain', 'ripe plantain', 'alloco', 'dodo', 'tostones', 'maduros', 'cooking_banana', 'base-plantain'],
    tags: ['base', 'tropical', 'polyvalent', 'féculent', 'frit', 'aloco', 'vert ou mûr'],
    aisle: 'Féculents & Racines',
    defaultAmount: 3,
    defaultUnit: 'pièces',
    popular: true,
    culturalNote: 'Indispensable vert en chips/tostones ou mûr en alloco/maduros'
  },
  {
    id: 'base-pain-manioc',
    name: 'Pain de manioc / cassava bread',
    icon: '🍞',
    category: 'Bases & Féculents',
    aliases: ['cassava bread', 'bammy', 'cassave', 'kassav', 'pan de yuca'],
    tags: ['pain plat', 'traditionnel', 'galette', 'amérindien', 'antillais'],
    aisle: 'Féculents & Racines',
    defaultAmount: 2,
    defaultUnit: 'galettes'
  },
  {
    id: 'base-farine-manioc',
    name: 'Farine de manioc',
    icon: '🫓',
    category: 'Bases & Féculents',
    aliases: ['cassava flour', 'tapioca flour', 'polvilho', 'farofa'],
    tags: ['farine', 'sans gluten', 'épaississant', 'galette'],
    aisle: 'Féculents & Racines',
    defaultAmount: 250,
    defaultUnit: 'g'
  },
  {
    id: 'base-semoule-mais',
    name: 'Semoule de maïs / cornmeal',
    icon: '🥣',
    category: 'Bases & Féculents',
    aliases: ['cornmeal', 'polenta', 'farine de maïs', 'cou-cou', 'mayi moulen'],
    tags: ['céréale', 'bouillie', 'coucou', 'pâte'],
    aisle: 'Féculents & Racines',
    defaultAmount: 300,
    defaultUnit: 'g'
  },
  {
    id: 'base-millet',
    name: 'Millet',
    icon: '🌾',
    category: 'Bases & Féculents',
    aliases: ['mil', 'pearl millet', 'millet grain', 'thiakry', 'souna'],
    tags: ['céréale ancienne', 'sahélien', 'sans gluten', 'couscous de mil'],
    aisle: 'Féculents & Racines',
    defaultAmount: 250,
    defaultUnit: 'g'
  },
  {
    id: 'base-sorgho',
    name: 'Sorgho',
    icon: '🌾',
    category: 'Bases & Féculents',
    aliases: ['sorghum', 'gros mil', 'kafir corn', 'jowar'],
    tags: ['céréale', 'résistant', 'bouillie', 'farine'],
    aisle: 'Féculents & Racines',
    defaultAmount: 200,
    defaultUnit: 'g'
  },
  {
    id: 'base-teff',
    name: 'Teff',
    icon: '🌾',
    category: 'Bases & Féculents',
    aliases: ['tef', 'teff flour', 'farine de teff', 'grain de teff'],
    tags: ['céréale éthiopienne', 'injera', 'riche en fer', 'sans gluten'],
    aisle: 'Féculents & Racines',
    defaultAmount: 300,
    defaultUnit: 'g',
    culturalNote: 'Céréale sacrée d’Éthiopie et d’Érythrée, base de l’Injera'
  },
  {
    id: 'base-orge',
    name: 'Orge',
    icon: '🌾',
    category: 'Bases & Féculents',
    aliases: ['barley', 'orge perlé', 'talbina'],
    tags: ['céréale', 'soupe', 'bouillie', 'fibres'],
    aisle: 'Féculents & Racines',
    defaultAmount: 200,
    defaultUnit: 'g'
  },
  {
    id: 'base-fonio',
    name: 'Fonio',
    icon: '🫘',
    category: 'Bases & Féculents',
    aliases: ['acha', 'hungry rice', 'fonio blanc', 'digitaria exilis'],
    tags: ['super aliment', 'sans gluten', 'index glycémique bas', 'salade'],
    aisle: 'Féculents & Racines',
    defaultAmount: 250,
    defaultUnit: 'g',
    popular: true,
    culturalNote: 'Le grain d’or d’Afrique de l’Ouest, ultra digeste et subtil'
  },
  {
    id: 'base-avoine',
    name: 'Avoine',
    icon: '🌾',
    category: 'Bases & Féculents',
    aliases: ['oats', 'oatmeal', 'flocons d’avoine', 'porridge'],
    tags: ['flocons', 'petit-déjeuner', 'fibres'],
    aisle: 'Féculents & Racines',
    defaultAmount: 150,
    defaultUnit: 'g'
  },
  {
    id: 'base-roti',
    name: 'Roti',
    icon: '🫓',
    category: 'Bases & Féculents',
    aliases: ['roti bread', 'dhalpuri', 'buss up shut', 'chapati', 'paratha caribéen'],
    tags: ['pain plat', 'antillais', 'trinidad', 'guyane', 'street food'],
    aisle: 'Féculents & Racines',
    defaultAmount: 4,
    defaultUnit: 'pains'
  },
  {
    id: 'base-fufu',
    name: 'Fufu',
    icon: '🍞',
    category: 'Bases & Féculents',
    aliases: ['foufou', 'fufuo', 'foofoo', 'foutou', 'pounded cassava & plantain'],
    tags: ['pâte pilée', 'sauce graine', 'sauce gombo', 'ghana', 'côte d’ivoire'],
    aisle: 'Féculents & Racines',
    defaultAmount: 400,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'base-ugali',
    name: 'Ugali / pap / sadza',
    icon: '🥣',
    category: 'Bases & Féculents',
    aliases: ['ugali', 'pap', 'sadza', 'nshima', 'posho', 'phaletche'],
    tags: ['bouillie ferme', 'afrique de l’est', 'afrique australe', 'sukuma wiki'],
    aisle: 'Féculents & Racines',
    defaultAmount: 350,
    defaultUnit: 'g'
  },
  {
    id: 'base-injera',
    name: 'Injera',
    icon: '🍞',
    category: 'Bases & Féculents',
    aliases: ['enjera', 'crêpe éthiopienne', 'galette fermentée'],
    tags: ['crêpe fermentée', 'éthiopie', 'érythrée', 'doro wat'],
    aisle: 'Féculents & Racines',
    defaultAmount: 3,
    defaultUnit: 'galettes'
  },
  {
    id: 'base-dasheen',
    name: 'Dasheen / taro / eddoe / malanga',
    icon: '🥔',
    category: 'Bases & Féculents',
    aliases: ['taro', 'dasheen', 'eddoe', 'malanga', 'macabo', 'madère', 'chou de chine'],
    tags: ['tubercule', 'caraïbes', 'soupe', 'bouilli', 'frit'],
    aisle: 'Féculents & Racines',
    defaultAmount: 400,
    defaultUnit: 'g'
  },
  {
    id: 'base-breadfruit',
    name: 'Breadfruit / fruit à pain',
    icon: '🍞',
    category: 'Bases & Féculents',
    aliases: ['fruit à pain', 'breadfruit', 'châtaigne pays', 'arbre à pain'],
    tags: ['féculent', 'rôti', 'frit', 'gratin', 'caribéen'],
    aisle: 'Féculents & Racines',
    defaultAmount: 1,
    defaultUnit: 'pièce',
    culturalNote: 'Cuit sous la cendre, frit en tranches croustillantes ou en migan'
  },
  {
    id: 'base-gari',
    name: 'Gari',
    icon: '🌽',
    category: 'Bases & Féculents',
    aliases: ['garri', 'farine de manioc fermentée', 'gari blanc', 'gari jaune'],
    tags: ['semoule croustillante', 'eba', 'snack', 'afrique de l’ouest'],
    aisle: 'Féculents & Racines',
    defaultAmount: 300,
    defaultUnit: 'g'
  },
  {
    id: 'base-dumplings',
    name: 'Dumplings / boulettes de pâte',
    icon: '🥟',
    category: 'Bases & Féculents',
    aliases: ['spinners', 'boiled dumplings', 'dombrés', 'fried dumplings', 'festival'],
    tags: ['pâte bouillie', 'soupe', 'dombré', 'jamaican spinners'],
    aisle: 'Féculents & Racines',
    defaultAmount: 6,
    defaultUnit: 'pièces'
  },

  // ==========================================
  // 2. LÉGUMINEUSES
  // ==========================================
  {
    id: 'leg-haricots-rouges',
    name: 'Haricots rouges',
    icon: '🫘',
    category: 'Légumineuses',
    aliases: ['red kidney beans', 'pois rouges', 'haricots rouges créoles'],
    tags: ['légumineuse', 'riz et pois', 'mijoté', 'protéine végétale'],
    aisle: 'Féculents & Racines',
    defaultAmount: 250,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'leg-haricots-noirs',
    name: 'Haricots noirs',
    icon: '🫘',
    category: 'Légumineuses',
    aliases: ['black beans', 'feijão preto', 'frijoles negros', 'pois noirs'],
    tags: ['légumineuse', 'feijoada', 'caraïbes', 'soupe'],
    aisle: 'Féculents & Racines',
    defaultAmount: 250,
    defaultUnit: 'g'
  },
  {
    id: 'leg-haricots-blancs',
    name: 'Haricots blancs',
    icon: '🫘',
    category: 'Légumineuses',
    aliases: ['white beans', 'haricots lingots', 'cannellini'],
    tags: ['légumineuse', 'sauce', 'mijoté'],
    aisle: 'Féculents & Racines',
    defaultAmount: 200,
    defaultUnit: 'g'
  },
  {
    id: 'leg-haricots-pinto',
    name: 'Haricots pinto',
    icon: '🫘',
    category: 'Légumineuses',
    aliases: ['pinto beans', 'frijoles pintos'],
    tags: ['légumineuse', 'onctueux', 'ragoût'],
    aisle: 'Féculents & Racines',
    defaultAmount: 200,
    defaultUnit: 'g'
  },
  {
    id: 'leg-haricots-coco',
    name: 'Haricots coco',
    icon: '🫘',
    category: 'Légumineuses',
    aliases: ['haricots coco blancs', 'coco de paimpol'],
    tags: ['fondant', 'purée', 'soupe'],
    aisle: 'Féculents & Racines',
    defaultAmount: 200,
    defaultUnit: 'g'
  },
  {
    id: 'leg-pois-chiches',
    name: 'Pois chiches',
    icon: '🫘',
    category: 'Légumineuses',
    aliases: ['chickpeas', 'garbanzo', 'channa', 'doubles channa'],
    tags: ['trinidad doubles', 'curry de channa', 'protéine végétale'],
    aisle: 'Féculents & Racines',
    defaultAmount: 250,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'leg-pois-dangole',
    name: 'Pois d’angole / pigeon peas',
    icon: '🟤',
    category: 'Légumineuses',
    aliases: ['pigeon peas', 'gungo peas', 'pois de bois', 'gandules', 'toor dal'],
    tags: ['incontournable antillais', 'arroz con gandules', 'riz collé', 'noël créole'],
    aisle: 'Féculents & Racines',
    defaultAmount: 250,
    defaultUnit: 'g',
    popular: true,
    culturalNote: 'Roi du repas de Noël aux Antilles et du Rice and Peas jamaïcain'
  },
  {
    id: 'leg-black-eyed-peas',
    name: 'Black-eyed peas / niébé',
    icon: '🟤',
    category: 'Légumineuses',
    aliases: ['niébé', 'black eyed peas', 'pois à œil noir', 'cowpeas', 'akara beans', 'koki'],
    tags: ['akara', 'accras de niébé', 'waakye', 'koki', 'afrique de l’ouest'],
    aisle: 'Féculents & Racines',
    defaultAmount: 300,
    defaultUnit: 'g',
    popular: true,
    culturalNote: 'Permet de confectionner les beignets Akara/Acarajé et le Waakye ghanéen'
  },
  {
    id: 'leg-lentilles',
    name: 'Lentilles',
    icon: '🟤',
    category: 'Légumineuses',
    aliases: ['lentils', 'lentilles corail', 'lentilles vertes', 'lentilles blondes', 'mesir wat'],
    tags: ['fer', 'soupe', 'purée', 'éthiopie'],
    aisle: 'Féculents & Racines',
    defaultAmount: 200,
    defaultUnit: 'g'
  },
  {
    id: 'leg-pois-casses',
    name: 'Pois cassés',
    icon: '🟤',
    category: 'Légumineuses',
    aliases: ['split peas', 'yellow split peas', 'dhal', 'dal purée'],
    tags: ['dhal caribéen', 'dhalpuri roti', 'purée onctueuse'],
    aisle: 'Féculents & Racines',
    defaultAmount: 200,
    defaultUnit: 'g'
  },
  {
    id: 'leg-arachides',
    name: 'Arachides / groundnuts',
    icon: '🟤',
    category: 'Légumineuses',
    aliases: ['arachides', 'cacahuètes', 'groundnuts', 'peanuts', 'arachides grillées'],
    tags: ['sauce arachide', 'mafé', 'ndolé', 'snack'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 200,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'leg-pois-bambara',
    name: 'Pois bambara',
    icon: '🟤',
    category: 'Légumineuses',
    aliases: ['voandzou', 'bambara groundnut', 'pois de terre', 'jugo beans', 'okpa'],
    tags: ['légumineuse ancestrale', 'okpa', 'farine de voandzou'],
    aisle: 'Féculents & Racines',
    defaultAmount: 200,
    defaultUnit: 'g'
  },
  {
    id: 'leg-haricots-rouges-secs',
    name: 'Haricots rouges secs',
    icon: '🫘',
    category: 'Légumineuses',
    aliases: ['dried kidney beans', 'haricots secs'],
    tags: ['trempage', 'mijotage long', 'tradition'],
    aisle: 'Féculents & Racines',
    defaultAmount: 300,
    defaultUnit: 'g'
  },
  {
    id: 'leg-haricots-verts',
    name: 'Haricots verts',
    icon: '🫘',
    category: 'Légumineuses',
    aliases: ['green beans', 'string beans', 'haricots fins'],
    tags: ['légume vert', 'croquant', 'sauté'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 250,
    defaultUnit: 'g'
  },
  {
    id: 'leg-pois-du-cap',
    name: 'Pois du Cap / guandules',
    icon: '🫘',
    category: 'Légumineuses',
    aliases: ['guandules', 'lima beans', 'pois du cap', 'butter beans', 'haricots de lima'],
    tags: ['fondant', 'curry', 'créole réunionnais'],
    aisle: 'Féculents & Racines',
    defaultAmount: 250,
    defaultUnit: 'g'
  },

  // ==========================================
  // 3. LÉGUMES ET RACINES
  // ==========================================
  {
    id: 'veg-oignon',
    name: 'Oignon',
    icon: '🧅',
    category: 'Légumes & Racines',
    aliases: ['onion', 'oignon jaune', 'oignon rouge', 'oignons caramélisés'],
    tags: ['base aromatique', 'yassa', 'fond de sauce'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 3,
    defaultUnit: 'pièces',
    popular: true
  },
  {
    id: 'veg-ail',
    name: 'Ail',
    icon: '🧄',
    category: 'Légumes & Racines',
    aliases: ['garlic', 'gousses d’ail', 'ail écrasé'],
    tags: ['assaisonnement', 'marinade', 'incontournable'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 4,
    defaultUnit: 'gousses',
    popular: true
  },
  {
    id: 'veg-piment',
    name: 'Piment',
    icon: '🌶️',
    category: 'Légumes & Racines',
    aliases: ['chili pepper', 'piment frais', 'piment oiseau', 'hot pepper', 'piment végétarien'],
    tags: ['relevé', 'parfumé', 'sauce pimentée'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 1,
    defaultUnit: 'pièce',
    popular: true
  },
  {
    id: 'veg-scotch-bonnet',
    name: 'Scotch bonnet',
    icon: '🌶️',
    category: 'Légumes & Racines',
    aliases: ['scotch bonnet pepper', 'bonnet écossais', 'piment antillais', 'jamaican pepper'],
    tags: ['fruité', 'très piquant', 'arôme unique', 'caraïbes'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 1,
    defaultUnit: 'pièce',
    popular: true,
    culturalNote: 'Célèbre pour son parfum fruité exceptionnel et son piquant volcanique'
  },
  {
    id: 'veg-habanero',
    name: 'Habanero',
    icon: '🌶️',
    category: 'Légumes & Racines',
    aliases: ['piment habanero', 'rocotillo', 'piment lampion', 'ata rodo'],
    tags: ['jollof sauce', 'nigeria', 'piquant intense'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'pièces'
  },
  {
    id: 'veg-poivron',
    name: 'Poivron',
    icon: '🫑',
    category: 'Légumes & Racines',
    aliases: ['bell pepper', 'poivron vert', 'poivron rouge', 'sweet pepper'],
    tags: ['croquant', 'coloré', 'sauce tomate'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'pièces'
  },
  {
    id: 'veg-tomate',
    name: 'Tomate',
    icon: '🍅',
    category: 'Légumes & Racines',
    aliases: ['tomato', 'tomates fraîches', 'tomates mûres'],
    tags: ['base de sauce', 'jollof', 'rougail'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 4,
    defaultUnit: 'pièces',
    popular: true
  },
  {
    id: 'veg-feuilles-manioc',
    name: 'Feuilles de manioc',
    icon: '🥬',
    category: 'Légumes & Racines',
    aliases: ['saka saka', 'pondu', 'cassava leaves', 'sombe', 'mpondu'],
    tags: ['légume feuille', 'plat national congo', 'mijoté long'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 400,
    defaultUnit: 'g',
    popular: true,
    culturalNote: 'Base du Saka Saka / Pondu congolais, pilé et cuit à l’huile de palme'
  },
  {
    id: 'veg-callaloo',
    name: 'Callaloo',
    icon: '🥬',
    category: 'Légumes & Racines',
    aliases: ['callaloo', 'amarante', 'feuilles de dasheen', 'callaloo jamaïcain', 'bhaji'],
    tags: ['plat national jamaïque', 'antilles', 'soupe de callaloo'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 300,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'veg-epinard',
    name: 'Épinard',
    icon: '🥬',
    category: 'Légumes & Racines',
    aliases: ['spinach', 'épinards frais', 'efo tete'],
    tags: ['feuilles tendres', 'efo riro', 'fer'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 300,
    defaultUnit: 'g'
  },
  {
    id: 'veg-feuilles-patate-douce',
    name: 'Feuilles de patate douce',
    icon: '🥬',
    category: 'Légumes & Racines',
    aliases: ['mataba', 'sweet potato leaves', 'brèdes patate', 'kassava leaf'],
    tags: ['sauce mataba', 'mayotte', 'comores', 'antilles'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 300,
    defaultUnit: 'g'
  },
  {
    id: 'veg-feuilles-gombo',
    name: 'Feuilles de gombo',
    icon: '🥬',
    category: 'Légumes & Racines',
    aliases: ['okra leaves', 'feuilles d’okra', 'brèdes gombo'],
    tags: ['mucilagineux', 'sauce gluante', 'traditionnel'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 200,
    defaultUnit: 'g'
  },
  {
    id: 'veg-concombre',
    name: 'Concombre',
    icon: '🥒',
    category: 'Légumes & Racines',
    aliases: ['cucumber', 'concombre pays'],
    tags: ['fraîcheur', 'salade', 'vinaigrette'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 1,
    defaultUnit: 'pièce'
  },
  {
    id: 'veg-carotte',
    name: 'Carotte',
    icon: '🥕',
    category: 'Légumes & Racines',
    aliases: ['carrot', 'carottes en rondelles'],
    tags: ['croquant', 'colombo', 'thiéboudienne'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 3,
    defaultUnit: 'pièces'
  },
  {
    id: 'veg-chou',
    name: 'Chou',
    icon: '🥦',
    category: 'Légumes & Racines',
    aliases: ['cabbage', 'chou blanc', 'chou vert', 'coleslaw'],
    tags: ['thiébou dien', 'garniture', 'croquant'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 0.5,
    defaultUnit: 'pièce'
  },
  {
    id: 'veg-aubergine',
    name: 'Aubergine',
    icon: '🍆',
    category: 'Légumes & Racines',
    aliases: ['eggplant', 'bringèle', 'aubergine africaine', 'gnangnan', 'garden eggs'],
    tags: ['amertume raffinée', 'sauce graine', 'rougail'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'pièces'
  },
  {
    id: 'veg-haricots-verts-leg',
    name: 'Haricots verts',
    icon: '🫛',
    category: 'Légumes & Racines',
    aliases: ['french beans', 'green snap beans'],
    tags: ['légume vert', 'accompagnement'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 250,
    defaultUnit: 'g'
  },
  {
    id: 'veg-gombo',
    name: 'Gombo / okra',
    icon: '🟩',
    category: 'Légumes & Racines',
    aliases: ['okra', 'calou', 'gumbo', 'lady’s finger', 'quiabo', 'kopé'],
    tags: ['sauce gombo', 'soupe kandia', 'antilles', 'incontournable'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 250,
    defaultUnit: 'g',
    popular: true,
    culturalNote: 'Donne leur texture onctueuse et liée aux sauces africaines et caribéennes'
  },
  {
    id: 'veg-courge',
    name: 'Courge / pumpkin',
    icon: '🎃',
    category: 'Légumes & Racines',
    aliases: ['pumpkin', 'giraumon', 'courge butternut', 'soupe joumou'],
    tags: ['soupe de l’indépendance haïtienne', 'velouté', 'giraumonade'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 400,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'veg-calabaza',
    name: 'Calabaza',
    icon: '🎃',
    category: 'Légumes & Racines',
    aliases: ['calabaza squash', 'potiron antillais', 'auyama', 'west indian pumpkin'],
    tags: ['sucré', 'purée', 'ragoût créole'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 500,
    defaultUnit: 'g'
  },
  {
    id: 'veg-taro-leaves',
    name: 'Taro leaves',
    icon: '🥔',
    category: 'Légumes & Racines',
    aliases: ['feuilles de taro', 'feuilles de malanga', 'dasheen bush'],
    tags: ['callaloo vert', 'créole', 'soupe'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 300,
    defaultUnit: 'g'
  },
  {
    id: 'veg-chayote',
    name: 'Chayote',
    icon: '🥔',
    category: 'Légumes & Racines',
    aliases: ['christophine', 'chouchou', 'mirliton', 'sousou'],
    tags: ['gratin de christophine', 'farcie', 'délicate'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'pièces',
    popular: true
  },
  {
    id: 'veg-chou-frise',
    name: 'Chou frisé / collard greens',
    icon: '🥬',
    category: 'Légumes & Racines',
    aliases: ['collard greens', 'collards', 'chou cavalier', 'sukuma wiki', 'couve'],
    tags: ['soul food', 'sukuma wiki kenyan', 'feijoada couve'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 300,
    defaultUnit: 'g'
  },
  {
    id: 'veg-navet',
    name: 'Navet',
    icon: '🥕',
    category: 'Légumes & Racines',
    aliases: ['turnip', 'navet blanc', 'navet violet'],
    tags: ['légume racine', 'thiéboudienne'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'pièces'
  },
  {
    id: 'veg-celeri',
    name: 'Céleri',
    icon: '🥬',
    category: 'Légumes & Racines',
    aliases: ['celery', 'branche de céleri', 'céleri à côtes'],
    tags: ['aromate', 'bouillon', 'marinade'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'branches'
  },
  {
    id: 'veg-bissap-leaves',
    name: 'Bissap leaves / feuilles d’oseille',
    icon: '🌿',
    category: 'Légumes & Racines',
    aliases: ['feuilles d’hibiscus', 'roselle leaves', 'oseille de guinée', 'ngai ngai', 'sour leaves'],
    tags: ['acidulé', 'sauce ngai ngai', 'poisson braisé'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 200,
    defaultUnit: 'g'
  },
  {
    id: 'veg-moringa',
    name: 'Feuilles de moringa',
    icon: '🌿',
    category: 'Légumes & Racines',
    aliases: ['moringa oleifera', 'feuilles de nébéday', 'arbre de vie', 'drumstick leaves'],
    tags: ['super aliment', 'antioxydant', 'infusion', 'sauce'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 150,
    defaultUnit: 'g'
  },

  // ==========================================
  // 4. FRUITS TROPICAUX
  // ==========================================
  {
    id: 'fruit-mangue',
    name: 'Mangue',
    icon: '🥭',
    category: 'Fruits Tropicaux',
    aliases: ['mango', 'mangue julie', 'mangue greffée', 'chutney mangue'],
    tags: ['sucré', 'chutney', 'dessert', 'salade exotique'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 1,
    defaultUnit: 'pièce',
    popular: true
  },
  {
    id: 'fruit-ananas',
    name: 'Ananas',
    icon: '🍍',
    category: 'Fruits Tropicaux',
    aliases: ['pineapple', 'ananas victoria', 'ananas pain de sucre'],
    tags: ['acidulé', 'rôti au rhum', 'marinade sucrée-salée'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 1,
    defaultUnit: 'pièce',
    popular: true
  },
  {
    id: 'fruit-coco',
    name: 'Noix de coco',
    icon: '🥥',
    category: 'Fruits Tropicaux',
    aliases: ['coconut', 'pulpe de coco', 'dry coconut', 'chair de coco'],
    tags: ['râpée', 'lait de coco', 'bonbons coco', 'douceur'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 1,
    defaultUnit: 'pièce',
    popular: true
  },
  {
    id: 'fruit-banane',
    name: 'Banane',
    icon: '🍌',
    category: 'Fruits Tropicaux',
    aliases: ['banana', 'banane douce', 'banane jaune', 'figue pomme'],
    tags: ['dessert', 'beignets', 'flambée'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 3,
    defaultUnit: 'pièces'
  },
  {
    id: 'fruit-banane-plantain',
    name: 'Banane plantain',
    icon: '🍌',
    category: 'Fruits Tropicaux',
    aliases: ['ripe plantain', 'banane mûre', 'plantain jaune', 'alloco'],
    tags: ['sucré', 'frit', 'caramélisé'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'pièces'
  },
  {
    id: 'fruit-orange',
    name: 'Orange',
    icon: '🍊',
    category: 'Fruits Tropicaux',
    aliases: ['orange', 'jus d’orange frais', 'zeste d’orange'],
    tags: ['agrume', 'jus', 'marinade griot haïtien'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'pièces'
  },
  {
    id: 'fruit-citron',
    name: 'Citron',
    icon: '🍋',
    category: 'Fruits Tropicaux',
    aliases: ['lemon', 'citron jaune'],
    tags: ['assaisonnement', 'nettoyage viandes', 'marinade'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'pièces'
  },
  {
    id: 'fruit-citron-vert',
    name: 'Citron vert',
    icon: '🍋',
    category: 'Fruits Tropicaux',
    aliases: ['lime', 'lime pays', 'limette', 'jus de lime'],
    tags: ['ti-punch', 'marinade créole', 'ceviche', 'sauce chien'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 3,
    defaultUnit: 'pièces',
    popular: true
  },
  {
    id: 'fruit-papaye',
    name: 'Papaye',
    icon: '🍈',
    category: 'Fruits Tropicaux',
    aliases: ['papaya', 'papaye verte', 'pawpaw'],
    tags: ['salade papaye verte', 'gratin', 'tendre'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 1,
    defaultUnit: 'pièce'
  },
  {
    id: 'fruit-goyave',
    name: 'Goyave',
    icon: '🍈',
    category: 'Fruits Tropicaux',
    aliases: ['guava', 'goyave rose', 'gelée de goyave'],
    tags: ['confiture', 'jus', 'pâtisserie'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 3,
    defaultUnit: 'pièces'
  },
  {
    id: 'fruit-passion',
    name: 'Fruit de la passion',
    icon: '🍈',
    category: 'Fruits Tropicaux',
    aliases: ['passion fruit', 'maracuja', 'grenadille'],
    tags: ['acidulé', 'jus maracuja', 'vinaigrette exotique'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 4,
    defaultUnit: 'pièces'
  },
  {
    id: 'fruit-corossol',
    name: 'Corossol / soursop',
    icon: '🍈',
    category: 'Fruits Tropicaux',
    aliases: ['soursop', 'graviola', 'guanábana', 'corossol frais'],
    tags: ['onctueux', 'jus de corossol', 'sorbet'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 1,
    defaultUnit: 'pièce',
    popular: true
  },
  {
    id: 'fruit-acai',
    name: 'Açaï',
    icon: '🍈',
    category: 'Fruits Tropicaux',
    aliases: ['acai berry', 'baies d’açaï', 'pulpe d’açaï'],
    tags: ['antioxydant', 'bowl', 'amazonien'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 100,
    defaultUnit: 'g'
  },
  {
    id: 'fruit-fruit-a-pain',
    name: 'Fruit à pain',
    icon: '🍈',
    category: 'Fruits Tropicaux',
    aliases: ['breadfruit', 'arbre à pain'],
    tags: ['cuit', 'frit', 'dessert sucré'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 1,
    defaultUnit: 'pièce'
  },
  {
    id: 'fruit-cerise-antilles',
    name: 'Cerise des Antilles',
    icon: '🍒',
    category: 'Fruits Tropicaux',
    aliases: ['acerola', 'acérola', 'barbados cherry', 'cerise pays'],
    tags: ['vitamine C', 'jus revigorant', 'punch'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 150,
    defaultUnit: 'g'
  },
  {
    id: 'fruit-prune-tropicale',
    name: 'Prune tropicale',
    icon: '🍑',
    category: 'Fruits Tropicaux',
    aliases: ['prune de cythère', 'pomme cythère', 'june plum', 'ambarella', 'prune mombin'],
    tags: ['jus de pomme cythère', 'acidulé', 'chutney'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 4,
    defaultUnit: 'pièces'
  },
  {
    id: 'fruit-avocat',
    name: 'Avocat',
    icon: '🍏',
    category: 'Fruits Tropicaux',
    aliases: ['avocado', 'avocat pays', 'féroce d’avocat'],
    tags: ['féroce', 'onctueux', 'salade'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 1,
    defaultUnit: 'pièce',
    popular: true
  },
  {
    id: 'fruit-pomme-cajou',
    name: 'Pomme-cajou / cashew apple',
    icon: '🍎',
    category: 'Fruits Tropicaux',
    aliases: ['cashew apple', 'pomme cajou', 'marañón', 'caju'],
    tags: ['jus de caju', 'astringent', 'rare'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'pièces'
  },
  {
    id: 'fruit-tamarin',
    name: 'Tamarin',
    icon: '🍇',
    category: 'Fruits Tropicaux',
    aliases: ['tamarind', 'pâte de tamarin', 'tamarindo', 'dakhar'],
    tags: ['acidulé aigre-doux', 'jus de tamarin', 'sauce'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 100,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'fruit-sapotille',
    name: 'Sapotille',
    icon: '🍈',
    category: 'Fruits Tropicaux',
    aliases: ['sapodilla', 'naseberry', 'chiku', 'sapote'],
    tags: ['saveur caramel-poire', 'très doux'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'pièces'
  },
  {
    id: 'fruit-genipe',
    name: 'Genipe',
    icon: '🍈',
    category: 'Fruits Tropicaux',
    aliases: ['quenette', 'guinep', 'mamoncillo', 'chenette', 'canepa'],
    tags: ['snack de rue', 'acidulé sucré', 'caraïbes'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 10,
    defaultUnit: 'pièces'
  },
  {
    id: 'fruit-carambole',
    name: 'Carambole',
    icon: '🍈',
    category: 'Fruits Tropicaux',
    aliases: ['starfruit', 'carambola', 'étoile'],
    tags: ['décoration', 'jus rafraîchissant'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'pièces'
  },
  {
    id: 'fruit-litchi',
    name: 'Litchi tropical / selon région',
    icon: '🍈',
    category: 'Fruits Tropicaux',
    aliases: ['litchi', 'lychee', 'quenette de chine', 'letchi madagascar'],
    tags: ['parfumé', 'frais', 'île de la réunion'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 200,
    defaultUnit: 'g'
  },

  // ==========================================
  // 5. PROTÉINES
  // ==========================================
  {
    id: 'prot-poisson',
    name: 'Poisson',
    icon: '🐟',
    category: 'Protéines',
    aliases: ['fish', 'poisson blanc', 'mérou', 'thiof', 'capitaine', 'vivaneau', 'red snapper'],
    tags: ['braisé', 'thiéboudienne', 'court-bouillon'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 500,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'prot-crevettes',
    name: 'Crevettes',
    icon: '🦐',
    category: 'Protéines',
    aliases: ['shrimp', 'prawns', 'crevettes grises', 'gambas'],
    tags: ['sauté à l’ail', 'curry créole', 'brochettes'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 350,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'prot-crabe',
    name: 'Crabe',
    icon: '🦀',
    category: 'Protéines',
    aliases: ['crab', 'crabe de terre', 'crabe de mangrove', 'matoutou', 'matété'],
    tags: ['matoutou de crabe', 'pâques créole', 'fêtes'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 4,
    defaultUnit: 'pièces',
    culturalNote: 'Plat signature de la fête de Pâques aux Antilles françaises'
  },
  {
    id: 'prot-calmar',
    name: 'Calmar',
    icon: '🦑',
    category: 'Protéines',
    aliases: ['squid', 'calamars', 'encornet', 'seiche'],
    tags: ['persillade', 'braisé', 'sauce créole'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 400,
    defaultUnit: 'g'
  },
  {
    id: 'prot-poulet',
    name: 'Poulet',
    icon: '🐔',
    category: 'Protéines',
    aliases: ['chicken', 'poulet fermier', 'cuisses de poulet', 'poulet boucané', 'jerk chicken'],
    tags: ['yassa', 'jerk', 'colombo', 'incontournable'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 800,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'prot-chevre',
    name: 'Chèvre',
    icon: '🐐',
    category: 'Protéines',
    aliases: ['goat', 'goat meat', 'cabri', 'curry goat', 'chèvre au curry'],
    tags: ['curry goat jamaïcain', 'cabri colombo', 'viande tendre mijotée'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 600,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'prot-boeuf',
    name: 'Bœuf',
    icon: '🐄',
    category: 'Protéines',
    aliases: ['beef', 'paleron', 'macreuse', 'jarret de bœuf'],
    tags: ['mijoté', 'ragoût', 'suya'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 500,
    defaultUnit: 'g'
  },
  {
    id: 'prot-porc',
    name: 'Porc',
    icon: '🐖',
    category: 'Protéines',
    aliases: ['pork', 'échine de porc', 'griot de porc', 'carnitas'],
    tags: ['griot haïtien', 'boudin créole', 'rôti'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 500,
    defaultUnit: 'g'
  },
  {
    id: 'prot-agneau',
    name: 'Agneau',
    icon: '🐑',
    category: 'Protéines',
    aliases: ['lamb', 'mouton', 'souris d’agneau', 'dibi'],
    tags: ['dibi d’agneau sénégalais', 'grillade', 'méchoui'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 500,
    defaultUnit: 'g'
  },
  {
    id: 'prot-oxtail',
    name: 'Oxtail / queue de bœuf',
    icon: '🥩',
    category: 'Protéines',
    aliases: ['oxtail', 'queue de bœuf', 'stewed oxtail'],
    tags: ['incontournable jamaïque', 'gélatineux', 'sauce riche', 'butter beans'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 800,
    defaultUnit: 'g',
    popular: true,
    culturalNote: 'Plat de prestige de la gastronomie caribéenne, fondant après 3h de mijotage'
  },
  {
    id: 'prot-abats',
    name: 'Abats',
    icon: '🫀',
    category: 'Protéines',
    aliases: ['tripes', 'gésiers', 'foie', 'rognons', 'cow foot', 'pigs tail'],
    tags: ['soupe de tripes', 'cow foot soup', 'goût robuste'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 400,
    defaultUnit: 'g'
  },
  {
    id: 'prot-poisson-fume',
    name: 'Poisson fumé',
    icon: '🐟',
    category: 'Protéines',
    aliases: ['smoked fish', 'kouthia', 'bonga', 'mâchoiron fumé', 'capitaine fumé'],
    tags: ['parfum boisé', 'sauce gombo', 'sauce feuille'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 250,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'prot-poisson-seche',
    name: 'Poisson séché',
    icon: '🐟',
    category: 'Protéines',
    aliases: ['dried fish', 'stockfish', 'guedj', 'poisson salé-séché'],
    tags: ['umami puissant', 'thiéboudienne sénégalaise', 'assaisonnement'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 150,
    defaultUnit: 'g'
  },
  {
    id: 'prot-morue-salee',
    name: 'Morue salée',
    icon: '🐟',
    category: 'Protéines',
    aliases: ['saltfish', 'morue séchée', 'bacalao', 'chiktay de morue', 'accras'],
    tags: ['accras de morue', 'ackee and saltfish', 'féroce'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 300,
    defaultUnit: 'g',
    popular: true,
    culturalNote: 'Au cœur des Accras des Antilles et du plat national jamaïcain Ackee & Saltfish'
  },
  {
    id: 'prot-sardines',
    name: 'Sardines',
    icon: '🐟',
    category: 'Protéines',
    aliases: ['sardines', 'sardines à l’huile', 'sardines fraîches braisées'],
    tags: ['oméga 3', 'sandwich street food', 'grillées'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 1,
    defaultUnit: 'boîte'
  },
  {
    id: 'prot-fruits-de-mer',
    name: 'Fruits de mer',
    icon: '🦪',
    category: 'Protéines',
    aliases: ['seafood', 'moules', 'palourdes', 'lambi', 'conch', 'burgot'],
    tags: ['fricassée de lambi', 'caraïbes', 'exclusif'],
    aisle: 'Boucherie & Poissons',
    defaultAmount: 400,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'prot-oeufs',
    name: 'Œufs',
    icon: '🥚',
    category: 'Protéines',
    aliases: ['eggs', 'œufs frais', 'doro wat eggs'],
    tags: ['petit-déjeuner', 'doro wat', 'farce'],
    aisle: 'Rayon Frais',
    defaultAmount: 4,
    defaultUnit: 'pièces'
  },
  {
    id: 'prot-fromage-frais',
    name: 'Fromage frais',
    icon: '🧀',
    category: 'Protéines',
    aliases: ['wagashi', 'fromage peul', 'fresh cheese', 'queso blanco', 'chongololo'],
    tags: ['wagashi béninois', 'grillé', 'sauce tomate'],
    aisle: 'Rayon Frais',
    defaultAmount: 200,
    defaultUnit: 'g'
  },
  {
    id: 'prot-yaourt',
    name: 'Yaourt',
    icon: '🥛',
    category: 'Protéines',
    aliases: ['yogurt', 'lait caillé', 'dèguè yogurt', 'lait fermenté'],
    tags: ['thiakry', 'dèguè', 'dessert onctueux'],
    aisle: 'Rayon Frais',
    defaultAmount: 250,
    defaultUnit: 'ml'
  },

  // ==========================================
  // 6. ÉPICES ET AROMATES
  // ==========================================
  {
    id: 'sp-sel',
    name: 'Sel',
    icon: '🧂',
    category: 'Épices & Aromates',
    aliases: ['salt', 'sel marin', 'gros sel', 'sel fin'],
    tags: ['assaisonnement de base'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-poivre-noir',
    name: 'Poivre noir',
    icon: '⚫',
    category: 'Épices & Aromates',
    aliases: ['black pepper', 'poivre moulu', 'grains de poivre noir'],
    tags: ['piquant', 'marinade'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-piment-jamaique',
    name: 'Piment de la Jamaïque / allspice',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['allspice', 'bois d’inde', 'jamaican pimento', 'quatre-épices antillais'],
    tags: ['jerk seasoning', 'feuilles de bois d’inde', 'arôme chaud'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café',
    popular: true,
    culturalNote: 'Clé aromatique absolue de la cuisine jamaïcaine et du colombo antillais'
  },
  {
    id: 'sp-muscade',
    name: 'Muscade',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['nutmeg', 'noix de muscade râpée'],
    tags: ['sauces blanches', 'pâtisseries', 'punch antillais'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 0.5,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-clou-girofle',
    name: 'Clou de girofle',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['cloves', 'girofle moulu'],
    tags: ['court-bouillon', 'griot', 'parfumé'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 3,
    defaultUnit: 'clous'
  },
  {
    id: 'sp-cannelle',
    name: 'Cannelle',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['cinnamon', 'bâton de cannelle', 'cannelle moulue'],
    tags: ['douceur', 'mijotés créoles', 'pain doux'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'bâton'
  },
  {
    id: 'sp-gingembre',
    name: 'Gingembre',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['ginger', 'gingembre moulu', 'ginger powder'],
    tags: ['épicé', 'chaleur', 'marinade'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-curcuma',
    name: 'Curcuma',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['turmeric', 'safran pays', 'curcuma moulu'],
    tags: ['couleur or', 'anti-inflammatoire', 'riz jaune'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-cumin',
    name: 'Cumin',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['cumin powder', 'cumin moulu', 'jeera'],
    tags: ['oriental', 'curry', 'légumineuses'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-coriandre-graines',
    name: 'Coriandre',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['coriander seeds', 'graines de coriandre', 'coriandre moulue'],
    tags: ['citronné', 'mélange d’épices'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-paprika',
    name: 'Paprika',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['paprika doux', 'paprika fumé', 'smoked paprika'],
    tags: ['couleur rouge', 'saveur douce ou fumée'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'sp-thym',
    name: 'Thym',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['thyme', 'thym frais', 'thym de la jamaïque', 'thym séché'],
    tags: ['bouquet garni', 'sauce créole', 'incontournable'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 3,
    defaultUnit: 'branches',
    popular: true
  },
  {
    id: 'sp-laurier',
    name: 'Laurier',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['bay leaves', 'feuilles de laurier', 'bois d’inde feuille'],
    tags: ['mijotage', 'sauces'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 2,
    defaultUnit: 'feuilles'
  },
  {
    id: 'sp-curry',
    name: 'Curry',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['curry powder', 'poudre de cari', 'curry madrass'],
    tags: ['curry de poulet', 'arôme intense'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'sp-feuilles-curry',
    name: 'Feuilles de curry',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['curry leaves', 'feuilles de cari', 'karrirapilai'],
    tags: ['fraîches', 'sautées à l’huile', 'saveur toastée'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 10,
    defaultUnit: 'feuilles'
  },
  {
    id: 'sp-anis-etoile',
    name: 'Anis étoilé',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['star anise', 'badiane'],
    tags: ['anisé', 'sirop', 'court-bouillon'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 2,
    defaultUnit: 'étoiles'
  },
  {
    id: 'sp-fenugrec',
    name: 'Fenugrec',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['fenugreek', 'methi', 'helba'],
    tags: ['berbéré éthiopien', 'légère amertume'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 0.5,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-moutarde',
    name: 'Moutarde',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['mustard', 'moutarde de dijon', 'moutarde forte'],
    tags: ['yassa au poulet', 'vinaigrette', 'marinade'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe',
    popular: true
  },
  {
    id: 'sp-cardamome',
    name: 'Cardamome',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['cardamom', 'gousses de cardamome', 'korarima'],
    tags: ['café éthiopien', 'riz épicé', 'parfum royal'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 4,
    defaultUnit: 'capsules'
  },
  {
    id: 'sp-safran-inde',
    name: 'Safran d’Inde',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['indian saffron', 'curcuma longa'],
    tags: ['teinture dorée', 'riz parfumé'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-achiote',
    name: 'Achiote / annatto',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['achiote', 'roucou', 'annatto seeds', 'urucum', 'graines de roucou'],
    tags: ['huile de roucou', 'rouge rubis naturel', 'saveur terreuse'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à soupe',
    popular: true,
    culturalNote: 'Utilisé par les Amérindiens et Caribéens pour colorer et parfumer les sauces en rouge flamboyant'
  },
  {
    id: 'sp-piment-cayenne',
    name: 'Piment de Cayenne',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['cayenne pepper', 'piment moulu en poudre'],
    tags: ['piquant sec', 'dosage précis'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 0.5,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-poivre-guinee',
    name: 'Poivre de Guinée / grains de paradis',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['grains of paradise', 'melegueta pepper', 'alligator pepper', 'poivre mbongo'],
    tags: ['ancestral', 'suya spice', 'notes cardamome et gingembre'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-moutarde-graines',
    name: 'Moutarde en graines',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['mustard seeds', 'graines de moutarde noire'],
    tags: ['croquant torréfié', 'pickles', 'achards'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-poudre-colombo',
    name: 'Poudre de colombo',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['colombo powder', 'épices à colombo antillais', 'massalé'],
    tags: ['incontournable antilles', 'colombo de cabri', 'colombo de poulet'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe',
    popular: true,
    culturalNote: 'Mélange signature antillais mêlant coriandre, curcuma, fenugrec et riz grillé'
  },
  {
    id: 'sp-geera',
    name: 'Geera / cumin',
    icon: '🟤',
    category: 'Épices & Aromates',
    aliases: ['geera', 'roasted cumin', 'geera pork spice', 'trinidad geera'],
    tags: ['geera pork trinidadien', 'torréfié', 'arôme boisé profond'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1.5,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'sp-persil',
    name: 'Persil',
    icon: '🌿',
    category: 'Épices & Aromates',
    aliases: ['parsley', 'persil plat', 'persil frisé'],
    tags: ['herbe fraîche', 'sauce chien', 'fondant'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 0.5,
    defaultUnit: 'botte',
    popular: true
  },
  {
    id: 'sp-coriandre-fraiche',
    name: 'Coriandre fraîche',
    icon: '🌿',
    category: 'Épices & Aromates',
    aliases: ['cilantro', 'fresh coriander', 'feuilles de coriandre'],
    tags: ['herbe fraîche', 'garniture', 'ceviche'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 0.5,
    defaultUnit: 'botte'
  },
  {
    id: 'sp-ciboulette',
    name: 'Ciboulette',
    icon: '🌿',
    category: 'Épices & Aromates',
    aliases: ['chives', 'cives', 'oignon pays', 'ceboulèt'],
    tags: ['cive antillaise', 'marinade', 'sauce chien'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 1,
    defaultUnit: 'botte',
    popular: true
  },
  {
    id: 'sp-oregano',
    name: 'Oregano',
    icon: '🌿',
    category: 'Épices & Aromates',
    aliases: ['origan', 'origan sauvage', 'lippia', 'oregano dominicain'],
    tags: ['herbe sèche', 'marinade pour viandes'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café'
  },
  {
    id: 'sp-chadon-beni',
    name: 'Chadon beni / culantro',
    icon: '🌿',
    category: 'Épices & Aromates',
    aliases: ['chadon beni', 'shadow beni', 'culantro', 'recao', 'coriandre longue', 'bhandhanya'],
    tags: ['herbe signature caraïbes', 'trinidad', 'porto rico', 'intense'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 6,
    defaultUnit: 'feuilles',
    popular: true,
    culturalNote: 'Herbe reine des sauces des Caraïbes du Sud, 10 fois plus intense que la coriandre'
  },
  {
    id: 'sp-basilic',
    name: 'Basilic',
    icon: '🌿',
    category: 'Épices & Aromates',
    aliases: ['basil', 'basilic africain', 'tchayo', 'basilic sacré'],
    tags: ['herbe parfumée', 'sauce fraîche'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 5,
    defaultUnit: 'feuilles'
  },
  {
    id: 'sp-menthe',
    name: 'Menthe',
    icon: '🌿',
    category: 'Épices & Aromates',
    aliases: ['mint', 'menthe fraîche', 'menthe poivrée'],
    tags: ['ataya sénégalais', 'fraîcheur', 'boisson'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 1,
    defaultUnit: 'branche'
  },
  {
    id: 'sp-citronnelle',
    name: 'Citronnelle',
    icon: '🌿',
    category: 'Épices & Aromates',
    aliases: ['lemongrass', 'fever grass', 'herbe citron'],
    tags: ['tige parfumée', 'bouillon', 'infusion'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'tiges'
  },
  {
    id: 'sp-gingembre-frais',
    name: 'Gingembre frais',
    icon: '🌿',
    category: 'Épices & Aromates',
    aliases: ['fresh ginger', 'racine de gingembre', 'gnamakoudji'],
    tags: ['jus de gingembre', 'marinade', 'chaleur piquante'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 30,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'sp-ail-frais',
    name: 'Ail frais',
    icon: '🌿',
    category: 'Épices & Aromates',
    aliases: ['fresh garlic cloves', 'ail nouveau'],
    tags: ['croquant', 'écrasé'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 3,
    defaultUnit: 'gousses'
  },
  {
    id: 'sp-oignon-nouveau',
    name: 'Oignon nouveau',
    icon: '🌿',
    category: 'Épices & Aromates',
    aliases: ['scallion', 'spring onion', 'cive pays', 'oignon vert'],
    tags: ['croquant', 'garniture fraîche'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 2,
    defaultUnit: 'tiges'
  },

  // ==========================================
  // 7. MATIÈRES GRASSES ET LIQUIDES
  // ==========================================
  {
    id: 'fat-huile-palme',
    name: 'Huile de palme',
    icon: '🛢️',
    category: 'Matières Grasses & Liquides',
    aliases: ['red palm oil', 'huile rouge', 'dendê', 'huile de palme brute'],
    tags: ['couleur rouge profond', 'sauce graine', 'acarajé', 'moqueca'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 3,
    defaultUnit: 'c. à soupe',
    popular: true,
    culturalNote: 'Huile vierge rouge riche en bêta-carotène, pilier des terroirs ouest-africains et bahianais'
  },
  {
    id: 'fat-huile-arachide',
    name: 'Huile d’arachide',
    icon: '🛢️',
    category: 'Matières Grasses & Liquides',
    aliases: ['peanut oil', 'groundnut oil', 'huile de cacahuète'],
    tags: ['haute température', 'friture plantains', 'sauce yassa'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 4,
    defaultUnit: 'c. à soupe',
    popular: true
  },
  {
    id: 'fat-huile-vegetale',
    name: 'Huile végétale',
    icon: '🛢️',
    category: 'Matières Grasses & Liquides',
    aliases: ['vegetable oil', 'huile de tournesol', 'huile neutre'],
    tags: ['cuisson', 'polyvalente'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 3,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'fat-huile-coco',
    name: 'Huile de coco',
    icon: '🛢️',
    category: 'Matières Grasses & Liquides',
    aliases: ['coconut oil', 'huile de coprah vierge'],
    tags: ['parfum exotique', 'cuisson du riz'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'fat-lait-coco',
    name: 'Lait de coco',
    icon: '🥥',
    category: 'Matières Grasses & Liquides',
    aliases: ['coconut milk', 'crème légère de coco'],
    tags: ['onctuosité', 'riz coco', 'curry caribéen'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 400,
    defaultUnit: 'ml',
    popular: true
  },
  {
    id: 'fat-creme-coco',
    name: 'Crème de coco',
    icon: '🥥',
    category: 'Matières Grasses & Liquides',
    aliases: ['coconut cream', 'crème épaisse'],
    tags: ['gourmandise', 'desserts', 'sauces riches'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 200,
    defaultUnit: 'ml'
  },
  {
    id: 'fat-beurre',
    name: 'Beurre',
    icon: '🧈',
    category: 'Matières Grasses & Liquides',
    aliases: ['butter', 'beurre doux', 'niter kibbeh beurre épicé'],
    tags: ['fondant', 'dorage'],
    aisle: 'Rayon Frais',
    defaultAmount: 30,
    defaultUnit: 'g'
  },
  {
    id: 'fat-margarine',
    name: 'Margarine',
    icon: '🧈',
    category: 'Matières Grasses & Liquides',
    aliases: ['margarine végétale', 'blue band'],
    tags: ['pains', 'pâtisseries africaines'],
    aisle: 'Rayon Frais',
    defaultAmount: 30,
    defaultUnit: 'g'
  },
  {
    id: 'fat-bouillon-stock',
    name: 'Bouillon / stock cube',
    icon: '🧴',
    category: 'Matières Grasses & Liquides',
    aliases: ['bouillon cube', 'fond de volaille', 'bouillon de légumes', 'stock'],
    tags: ['assaisonnement rapide', 'profondeur de goût'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'cube'
  },
  {
    id: 'fat-miel',
    name: 'Miel',
    icon: '🍯',
    category: 'Matières Grasses & Liquides',
    aliases: ['honey', 'miel de brousse', 'miel sauvage'],
    tags: ['adoucit marinades', 'glaçage viandes'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'fat-sirop-canne',
    name: 'Sirop de canne',
    icon: '🍯',
    category: 'Matières Grasses & Liquides',
    aliases: ['cane syrup', 'batterie', 'sirop de canne à sucre', 'sirop batterie'],
    tags: ['ti-punch', 'desserts antillais', 'marinades'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe',
    popular: true
  },
  {
    id: 'fat-cassonade',
    name: 'Cassonade',
    icon: '🍬',
    category: 'Matières Grasses & Liquides',
    aliases: ['brown sugar', 'sucre de canne roux', 'demerara'],
    tags: ['croquant', 'caramélisation'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'fat-sucre-brun',
    name: 'Sucre brun',
    icon: '🍬',
    category: 'Matières Grasses & Liquides',
    aliases: ['dark brown sugar', 'muscovado', 'panela', 'rapadura'],
    tags: ['browning sauce', 'sauce jerk', 'mélasse'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'fat-rhum',
    name: 'Rhum',
    icon: '🍷',
    category: 'Matières Grasses & Liquides',
    aliases: ['rum', 'rhum blanc agricole', 'dark rum', 'rhum vieux', 'overproof rum'],
    tags: ['flambage', 'marinade', 'pâtisseries créoles'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe',
    popular: true,
    culturalNote: 'Indissociable des marinades caribéennes et du flambage des bananes et crevettes'
  },
  {
    id: 'fat-vinaigre',
    name: 'Vinaigre',
    icon: '🍶',
    category: 'Matières Grasses & Liquides',
    aliases: ['vinegar', 'vinaigre blanc', 'vinaigre de canne', 'vinaigre de cidre'],
    tags: ['nettoyage des volailles', 'sauce chien', 'pickles'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'fat-jus-citron-vert',
    name: 'Jus de citron vert',
    icon: '🍋',
    category: 'Matières Grasses & Liquides',
    aliases: ['lime juice', 'jus de lime pressé'],
    tags: ['marinade fraîche', 'sauce pimentée'],
    aisle: 'Marché Frais & Légumes',
    defaultAmount: 3,
    defaultUnit: 'c. à soupe',
    popular: true
  },

  // ==========================================
  // 8. CONDIMENTS ET SAUCES
  // ==========================================
  {
    id: 'cond-sauce-soja',
    name: 'Sauce soja',
    icon: '🧂',
    category: 'Condiments & Sauces',
    aliases: ['soy sauce', 'sauce soya', 'dark soy sauce'],
    tags: ['umami', 'marinade jerk', 'riz sauté'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'cond-pate-tomate',
    name: 'Pâte de tomate',
    icon: '🥫',
    category: 'Condiments & Sauces',
    aliases: ['tomato paste', 'purée de tomate'],
    tags: ['fond rouge', 'jollof', 'rougail'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'cond-concentre-tomate',
    name: 'Concentré de tomate',
    icon: '🥫',
    category: 'Condiments & Sauces',
    aliases: ['concentré de tomate', 'double concentré de tomate', 'tomato concentrate'],
    tags: ['thiéboudienne rouge', 'richesse', 'liaison'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 70,
    defaultUnit: 'g',
    popular: true
  },
  {
    id: 'cond-sauce-piquante',
    name: 'Sauce piquante',
    icon: '🌶️',
    category: 'Condiments & Sauces',
    aliases: ['hot sauce', 'piment pilé', 'shito', 'pepper sauce', 'sauce piment'],
    tags: ['relevé', 'condiment de table'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 1,
    defaultUnit: 'c. à café'
  },
  {
    id: 'cond-pate-arachide',
    name: 'Pâte d’arachide / peanut butter cuisine',
    icon: '🟤',
    category: 'Condiments & Sauces',
    aliases: ['peanut butter', 'dakatine', 'pâte d’arachide pure', 'groundnut paste'],
    tags: ['sauce mafé', 'onctueux', 'incontournable'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 3,
    defaultUnit: 'c. à soupe',
    popular: true,
    culturalNote: 'L’élément central du célébrissime Mafé sénégalais et malien'
  },
  {
    id: 'cond-egusi',
    name: 'Égusi / graines de melon',
    icon: '🟤',
    category: 'Condiments & Sauces',
    aliases: ['egusi', 'graines de melon', 'egusi soup seeds', 'agushi'],
    tags: ['egusi soup nigériane', 'épaississant riche en protéines'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 200,
    defaultUnit: 'g',
    popular: true,
    culturalNote: 'Star incontestée de la cuisine nigériane et ghanéenne pour les soupes épaisses'
  },
  {
    id: 'cond-ogbono',
    name: 'Ogbono / graines de mangue sauvage',
    icon: '🟤',
    category: 'Condiments & Sauces',
    aliases: ['ogbono', 'wild mango seed', 'dika nut', 'ogbono soup'],
    tags: ['texture étirable', 'saveur noisette', 'soupe traditionnelle'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 100,
    defaultUnit: 'g'
  },
  {
    id: 'cond-achi',
    name: 'Achi',
    icon: '🟠',
    category: 'Condiments & Sauces',
    aliases: ['achi powder', 'brachystegia eurycoma', 'achi thickener'],
    tags: ['épaississant traditionnel', 'soupe oha'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'cond-poudre-colombo',
    name: 'Poudre de colombo',
    icon: '🟠',
    category: 'Condiments & Sauces',
    aliases: ['colombo paste', 'pâte de colombo', 'mélange colombo'],
    tags: ['fond de sauce', 'colombo'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe'
  },
  {
    id: 'cond-green-seasoning',
    name: 'Green seasoning',
    icon: '🟠',
    category: 'Condiments & Sauces',
    aliases: ['green seasoning', 'assaisonnement vert', 'épis haïtien', 'sofrito caribéen'],
    tags: ['base magique caraïbes', 'ail cives thym piments mixés'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 3,
    defaultUnit: 'c. à soupe',
    popular: true,
    culturalNote: 'Le secret de grand-mère caribéen : purée fraîche de cive, ail, piment végétarien et chadon beni'
  },
  {
    id: 'cond-marinade-creole',
    name: 'Marinade créole',
    icon: '🟠',
    category: 'Condiments & Sauces',
    aliases: ['creole marinade', 'sauce chien', 'marinade antillaise', 'assaisonnement créole'],
    tags: ['sauce chien', 'poisson grillé', 'poulet grillé'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 4,
    defaultUnit: 'c. à soupe',
    popular: true
  },
  {
    id: 'cond-bouillon-cube',
    name: 'Bouillon cube',
    icon: '🟤',
    category: 'Condiments & Sauces',
    aliases: ['jumbo cube', 'cube maggi', 'bouillon arôme', 'cube d’or'],
    tags: ['exhausteur', 'incontournable street food'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'cube'
  },
  {
    id: 'cond-pate-crevettes',
    name: 'Pâte de crevettes',
    icon: '🟤',
    category: 'Condiments & Sauces',
    aliases: ['shrimp paste', 'crayfish powder', 'poudre d’écrevisse', 'crevettes séchées moulues'],
    tags: ['umami nigérian', 'jollof', 'egusi soup'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 2,
    defaultUnit: 'c. à soupe',
    popular: true
  },
  {
    id: 'cond-poisson-fermente',
    name: 'Pâte de poisson fermenté',
    icon: '🟤',
    category: 'Condiments & Sauces',
    aliases: ['fermented fish paste', 'nététou', 'soumbala', 'dawadawa', 'yeet'],
    tags: ['fermentation ancestrale', 'umami pur', 'ceebu jen'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café',
    popular: true,
    culturalNote: 'Condiment ancestral ouest-africain apportant une note umami et fumée inimitable'
  },
  {
    id: 'cond-sel-aromatise',
    name: 'Sel aromatisé',
    icon: '🟤',
    category: 'Condiments & Sauces',
    aliases: ['seasoned salt', 'sel aux épices', 'sel créole'],
    tags: ['assaisonnement tout-en-un'],
    aisle: 'Épicerie & Épices Afro',
    defaultAmount: 1,
    defaultUnit: 'c. à café'
  },
  {
    id: 'cond-sauce-jerk',
    name: 'Sauce jerk',
    icon: '🟤',
    category: 'Condiments & Sauces',
    aliases: ['jerk sauce', 'jerk marinade', 'jerk paste', 'pâte jerk jamaïcaine'],
    tags: ['jamaïque', 'fumée et pimentée', 'barbecue'],
    aisle: 'Condiments & Huiles',
    defaultAmount: 3,
    defaultUnit: 'c. à soupe',
    popular: true,
    culturalNote: 'Emblème de la Jamaïque combinant piment scotch bonnet, bois d’inde, thym et ail'
  }
];

/**
 * Normalise un texte (supprime accents et casse) pour une recherche tolérante
 */
export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Recherche des ingrédients afro-caribéens par nom, alias, tags ou catégorie
 */
export function searchAfroIngredients(
  query: string,
  categoryFilter?: AfroIngredientCategory | 'all'
): AfroIngredient[] {
  const cleanQuery = normalizeText(query);
  
  return AFRO_CARIBBEAN_INGREDIENTS.filter(item => {
    // Filtrage par catégorie
    if (categoryFilter && categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }

    if (!cleanQuery) return true;

    // Correspondance par nom
    if (normalizeText(item.name).includes(cleanQuery)) return true;

    // Correspondance par alias
    if (item.aliases.some(alias => normalizeText(alias).includes(cleanQuery))) {
      return true;
    }

    // Correspondance par tags
    if (item.tags.some(tag => normalizeText(tag).includes(cleanQuery))) {
      return true;
    }

    // Correspondance par catégorie
    if (normalizeText(item.category).includes(cleanQuery)) {
      return true;
    }

    return false;
  });
}

/**
 * Détermine la catégorie d'un ingrédient à partir de son nom ou de son rayon
 */
export function getIngredientCategory(ingredientName: string, aisle?: string): AfroIngredientCategory | null {
  const norm = normalizeText(ingredientName);
  if (!norm) return null;
  
  // 1. Recherche directe dans la base afro-caribéenne
  const exactMatch = AFRO_CARIBBEAN_INGREDIENTS.find(item => {
    if (normalizeText(item.name) === norm) return true;
    if (item.nom_fr && normalizeText(item.nom_fr) === norm) return true;
    if (item.nom_en && normalizeText(item.nom_en) === norm) return true;
    return item.aliases.some(a => normalizeText(a) === norm);
  });
  if (exactMatch) return exactMatch.category;

  // 2. Recherche partielle dans les noms et alias
  const partialMatch = AFRO_CARIBBEAN_INGREDIENTS.find(item => {
    const itemNorm = normalizeText(item.name);
    if (norm.includes(itemNorm) || itemNorm.includes(norm)) return true;
    return item.aliases.some(a => {
      const aNorm = normalizeText(a);
      return aNorm.length >= 3 && (norm.includes(aNorm) || aNorm.includes(norm));
    });
  });
  if (partialMatch) return partialMatch.category;

  // 3. Analyse heuristique résiliente par mot-clé
  // Bases & Féculents
  if (/riz|manioc|cassava|yuca|igname|yam|plantain|banane|mais|corn|millet|sorgho|teff|fonio|fufu|foufou|ugali|sadza|injera|dasheen|taro|eddoe|malanga|breadfruit|fruit a pain|arbre a pain|gari|dumpling|dombre|roti|patate douce|sweet potato|semoule|farine/i.test(norm)) {
    return 'Bases & Féculents';
  }
  // Légumineuses
  if (/haricot|bean|pois|chiche|pigeon peas|d'angole|dangole|niebe|black-eyed|lentille|arachide|peanut|groundnut|bambara|voandzou|guandules/i.test(norm)) {
    return 'Légumineuses';
  }
  // Légumes & Racines (légumes et feuilles)
  if (/oignon|ail|garlic|onion|piment|pepper|scotch bonnet|habanero|poivron|tomate|feuille|callaloo|spinach|epinard|saka|pondu|mataba|gombo|okra|courge|pumpkin|giraumon|calabaza|chayote|christophine|chou|cabbage|collard|sukuma|navet|celeri|aubergine|eggplant|concombre|carotte|moringa|bissap/i.test(norm)) {
    return 'Légumes & Racines';
  }
  // Fruits Tropicaux
  if (/mangue|mango|ananas|pineapple|coco|coconut|orange|citron|lime|papaye|papaya|goyave|guava|passion|maracuja|corossol|soursop|acai|acerola|cerise|prune|avocat|avocado|tamarin|sapotille|quenette|carambole|litchi/i.test(norm)) {
    return 'Fruits Tropicaux';
  }
  // Protéines
  if (/poisson|fish|crevette|shrimp|prawn|crabe|crab|calmar|squid|poulet|chicken|chevre|goat|cabri|boeuf|beef|porc|pork|griot|agneau|lamb|oxtail|queue de boeuf|morue|saltfish|chiktay|sardine|mer|seafood|oeuf|egg|fromage|cheese|wagashi|lambi|viande/i.test(norm)) {
    return 'Protéines';
  }
  // Matières Grasses & Liquides (huiles, laits et matières grasses)
  if (/huile|oil|beurre|butter|margarine|lait de coco|coconut milk|creme de coco|bouillon|stock|miel|honey|canne|cane|sucre|sugar|rhum|rum|vinaigre|vinegar/i.test(norm)) {
    return 'Matières Grasses & Liquides';
  }
  // Épices & Aromates
  if (/sel|salt|poivre|curry|cari|colombo|muscade|nutmeg|girofle|clove|cannelle|cinnamon|gingembre|ginger|curcuma|turmeric|cumin|coriandre|coriander|paprika|thym|thyme|laurier|bay leaf|anis|fenugrec|cardamome|safran|roucou|annatto|achiote|persil|parsley|ciboulette|cive|chadon beni|culantro|recao|menthe|mint|citronnelle|lemongrass/i.test(norm)) {
    return 'Épices & Aromates';
  }
  // Condiments & Sauces
  if (/sauce|pate de tomate|tomato paste|concentre|shito|dakatine|peanut butter|egusi|ogbono|achi|green seasoning|marinade|cube|maggi|netetou|soumbala|dawadawa|jerk/i.test(norm)) {
    return 'Condiments & Sauces';
  }

  // 4. Déduction secondaire selon le rayon d'épicerie
  if (aisle === 'Boucherie & Poissons') return 'Protéines';
  if (aisle === 'Féculents & Racines') return 'Bases & Féculents';
  if (aisle === 'Marché Frais & Légumes') return 'Légumes & Racines';
  if (aisle === 'Condiments & Huiles') return 'Condiments & Sauces';
  if (aisle === 'Épicerie & Épices Afro') return 'Épices & Aromates';

  return null;
}

/**
 * Récupère l'ensemble des catégories d'ingrédients représentées dans une recette
 */
export function getRecipeIngredientCategories(ingredients: { name: string; aisle?: string }[]): Set<AfroIngredientCategory> {
  const categories = new Set<AfroIngredientCategory>();
  for (const ing of ingredients) {
    const cat = getIngredientCategory(ing.name, ing.aisle);
    if (cat) {
      categories.add(cat);
    }
  }
  return categories;
}
