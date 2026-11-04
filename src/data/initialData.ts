import { User, Recipe, Course, Community, DayPlan, InAppNotification, Story, StorySlide, CulinaryExperience } from '../types';
import { CHEF_AVATARS, RECIPE_DISH_IMAGES } from './appImages';

export const INITIAL_CURRENT_USER: User = {
  id: 'user-current',
  name: 'Chef Fatou Ndiaye',
  handle: '@fatou_cuisine',
  email: 'fatou.ndiaye@afrokreyol.com',
  avatar: CHEF_AVATARS.fatou,
  role: 'chef',
  country: 'Sénégal',
  countryFlag: '🇸🇳',
  bio: 'Cheffe ambassadrice de la Teranga sénégalaise. Passionnée par la transmission des secrets du Thiéboudienne et du Yassa au feu de bois.',
  specialties: ['Thiéboudienne', 'Yassa braisé', 'Pastels', 'Fumage traditionnel'],
  followersCount: 14250,
  followingCount: 340,
  recipesCount: 18,
  isVerified: true,
  isCurrentUser: true,
  followingIds: ['user-rodrigue', 'user-marcus', 'user-aicha'],
};

export const CHEF_RODRIGUE: User = {
  id: 'user-rodrigue',
  name: 'Chef Rodrigue Belfort',
  handle: '@rodrigue_kreyol',
  email: 'rodrigue@kreyolchef.mq',
  avatar: CHEF_AVATARS.rodrigue,
  role: 'chef',
  country: 'Martinique',
  countryFlag: '🇲🇶',
  bio: 'Gardien des saveurs des Mornes. Du colombo mijoté au bokit boucané croustillant, je perpétue l\'héritage culinaire antillais.',
  specialties: ['Colombo de cabri', 'Poulet boucané', 'Court-bouillon', 'Sauce chien'],
  followersCount: 9800,
  followingCount: 210,
  recipesCount: 12,
  isVerified: true,
};

export const CHEF_MARCUS: User = {
  id: 'user-marcus',
  name: 'Chef Marcus Sterling',
  handle: '@marcus_jerkking',
  email: 'marcus@jamaicanjerk.com',
  avatar: CHEF_AVATARS.marcus,
  role: 'chef',
  country: 'Jamaïque',
  countryFlag: '🇯🇲',
  bio: 'From Kingston with smoke and scotch bonnet heat! Pitmaster passionné de barbecue caribéen au pimento wood.',
  specialties: ['Jerk Chicken', 'Rice and Peas', 'Curry Goat', 'Festival Bread'],
  followersCount: 18400,
  followingCount: 420,
  recipesCount: 22,
  isVerified: true,
};

export const MEMBER_MARIE_LINE: User = {
  id: 'user-marieline',
  name: 'Marie-Line Gbagbo',
  handle: '@marieline_gourmet',
  email: 'marieline@gmail.com',
  avatar: CHEF_AVATARS.marieline,
  role: 'member',
  country: 'Côte d\'Ivoire',
  countryFlag: '🇨🇮',
  bio: 'Gourmande passionnée d\'Attiéké garba, d\'Alloco fondant et de sauces graine. En quête permanente de nouvelles recettes afro-fusion !',
  specialties: ['Attiéké poisson', 'Alloco', 'Sauce feuille'],
  followersCount: 1250,
  followingCount: 480,
  recipesCount: 6,
  isVerified: false,
};

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-thieb',
    title: 'Ceebu Jën Royal (Thiéboudienne Rouge Authentique)',
    description: 'Le joyau classé au patrimoine de l\'UNESCO : riz brisé mijoté au concentré de tomate et bouillon de mérou frais, légumes du terroir (manioc, chou, carottes, aubergine amère) et son rof persillé piquant.',
    authorId: 'user-current',
    authorName: 'Chef Fatou Ndiaye',
    authorAvatar: CHEF_AVATARS.fatou,
    authorHandle: '@fatou_cuisine',
    authorRole: 'chef',
    country: 'Sénégal',
    countryFlag: '🇸🇳',
    category: 'Plats Traditionnels',
    difficulty: 'Expert',
    prepTimeMinutes: 45,
    cookTimeMinutes: 90,
    servings: 6,
    imageUrl: RECIPE_DISH_IMAGES.thieboudienne,
    heritageStory: 'Né au XIXe siècle dans l\'ancienne capitale de Saint-Louis (Ndar) sous les mains expertes de Penda Mbaye, le Ceebu Jën est le symbole vibrant de la Teranga, l\'hospitalité légendaire sénégalaise.',
    likesCount: 342,
    commentsCount: 28,
    bookmarksCount: 189,
    isLiked: false,
    isBookmarked: true,
    ingredients: [
      { id: 'i1', name: 'Riz brisé deux fois (Riz parfumé)', amount: 600, unit: 'g', aisle: 'Féculents & Racines' },
      { id: 'i2', name: 'Mérou ou Dorade royale fraîche', amount: 1.2, unit: 'kg', aisle: 'Boucherie & Poissons' },
      { id: 'i3', name: 'Poisson séché (Guedj) et Yet (mollusque fermenté)', amount: 80, unit: 'g', aisle: 'Épicerie & Épices Afro' },
      { id: 'i4', name: 'Concentré de tomates riche', amount: 140, unit: 'g', aisle: 'Condiments & Huiles' },
      { id: 'i5', name: 'Huile d\'arachide ou de tournesol', amount: 200, unit: 'ml', aisle: 'Condiments & Huiles' },
      { id: 'i6', name: 'Persil frais, ail, piment oiseau pour le Rof', amount: 1, unit: 'bouquet', aisle: 'Marché Frais & Légumes' },
      { id: 'i7', name: 'Manioc, Carottes, Navets, Chou blanc', amount: 800, unit: 'g', aisle: 'Marché Frais & Légumes' },
      { id: 'i8', name: 'Gombo frais & Piments antillais entiers', amount: 6, unit: 'pièces', aisle: 'Marché Frais & Légumes' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Préparation du Rof (Farce aromatique)',
        instruction: 'Piler au mortier le persil plat, l\'ail, un piment doux, du poivre noir et une pincée de sel jusqu\'à obtenir une pâte parfumée intense.',
        durationMinutes: 10,
        tip: 'Faites deux incisions profondes dans la chair du poisson pour y insérer généreusement le rof.'
      },
      {
        stepNumber: 2,
        title: 'Friture et bouillon de base',
        instruction: 'Dorer le poisson farci dans l\'huile chaude avec un petit morceau de Yet. Retirer délicatement le poisson, puis faire revenir les oignons émincés et le concentré de tomate jusqu\'à obtention d\'une belle couleur rouge sombre.',
        durationMinutes: 20,
        tip: 'Laissez caraméliser la tomate sans la brûler pour donner la couleur dorée légendaire au riz.'
      },
      {
        stepNumber: 3,
        title: 'Cuisson des légumes et extraction du bouillon',
        instruction: 'Mouiller avec 1,8 litre d\'eau chaude. Ajouter le guedj, le manioc, les carottes, le chou et les piments entiers. Laisser mijoter à feu moyen pendant 40 minutes, puis retirer tous les légumes et le poisson.',
        durationMinutes: 40,
        tip: 'Ne crevez jamais les piments entiers dans le bouillon au risque de rendre le plat trop piquant pour les convives.'
      },
      {
        stepNumber: 4,
        title: 'Cuisson du riz brisé à la vapeur et dans le bouillon',
        instruction: 'Précuire le riz lavé à la vapeur au-dessus du bouillon, puis verser le riz dans le bouillon filtré réduit. Couvrir hermétiquement et cuire à feu très doux pendant 25 minutes jusqu\'à absorption complète.',
        durationMinutes: 25,
        tip: 'Le secret réside dans le "Xonx", la fine croûte croustillante au fond de la cocotte que tout le monde s\'arrache.'
      }
    ],
    comments: [
      {
        id: 'c1',
        userId: 'user-rodrigue',
        userName: 'Chef Rodrigue Belfort',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        userHandle: '@rodrigue_kreyol',
        text: 'La couleur de ce riz est spectaculaire Cheffe ! Le Guedj apporte cette profondeur umami incomparable.',
        createdAt: 'Il y a 3 heures',
        likesCount: 14
      },
      {
        id: 'c2',
        userId: 'user-marieline',
        userName: 'Marie-Line Gbagbo',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
        userHandle: '@marieline_gourmet',
        text: 'Recette testée ce midi avec du mérou blanc : un pur régal familial ! Le rof change absolument tout.',
        createdAt: 'Il y a 1 heure',
        likesCount: 8
      }
    ],
    createdAt: '2026-09-22T10:15:00Z'
  },
  {
    id: 'rec-colombo',
    title: 'Colombo de Cabri aux Épices Torréfiées & Bois d\'Inde',
    description: 'Le grand classique dominical des Antilles françaises. Morceaux tendres de chevreau marinés au citron vert et cives, puis mijotés lentement avec la poudre de colombo, massalé grillé, mangue verte et pommes de terre fondantes.',
    authorId: 'user-rodrigue',
    authorName: 'Chef Rodrigue Belfort',
    authorAvatar: CHEF_AVATARS.rodrigue,
    authorHandle: '@rodrigue_kreyol',
    authorRole: 'chef',
    country: 'Martinique',
    countryFlag: '🇲🇶',
    category: 'Plats Traditionnels',
    difficulty: 'Moyen',
    prepTimeMinutes: 30,
    cookTimeMinutes: 75,
    servings: 5,
    imageUrl: RECIPE_DISH_IMAGES.colomboCabri,
    heritageStory: 'Fruit du métissage entre la culture indienne arrivée aux Antilles après l\'abolition de 1848 et les traditions créoles, le colombo incarne l\'âme chaleureuse de nos îles caribéennes.',
    likesCount: 278,
    commentsCount: 19,
    bookmarksCount: 142,
    isLiked: true,
    isBookmarked: false,
    ingredients: [
      { id: 'c1', name: 'Cabri (chevreau) ou agneau coupé en morceaux', amount: 1.2, unit: 'kg', aisle: 'Boucherie & Poissons' },
      { id: 'c2', name: 'Poudre de colombo artisanal torréfiée', amount: 4, unit: 'c. à soupe', aisle: 'Épicerie & Épices Afro' },
      { id: 'c3', name: 'Feuilles de bois d\'Inde et thym pays', amount: 5, unit: 'feuilles', aisle: 'Marché Frais & Légumes' },
      { id: 'c4', name: 'Cives (oignons pays), ail frais écrasé', amount: 1, unit: 'botte', aisle: 'Marché Frais & Légumes' },
      { id: 'c5', name: 'Citrons verts bien juteux', amount: 2, unit: 'pièces', aisle: 'Marché Frais & Légumes' },
      { id: 'c6', name: 'Aubergines violettes & Pommes de terre', amount: 500, unit: 'g', aisle: 'Marché Frais & Légumes' },
      { id: 'c7', name: 'Piment habanero entier (sans percer)', amount: 1, unit: 'pièce', aisle: 'Marché Frais & Légumes' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Marinade antillaise à froid',
        instruction: 'Masser la viande avec le jus des citrons verts, les cives hachées, 4 gousses d\'ail écrasées, sel, poivre et 2 cuillères de poudre de colombo. Laisser reposer au moins 2 heures.',
        durationMinutes: 15,
        tip: 'Une marinade toute une nuit sublime les chairs denses du cabri.'
      },
      {
        stepNumber: 2,
        title: 'Saisie et rissolage',
        instruction: 'Faire chauffer un filet d\'huile dans une cocotte en fonte. Faire dorer les morceaux de viande de tous les côtés jusqu\'à belle coloration.',
        durationMinutes: 15
      },
      {
        stepNumber: 3,
        title: 'Mijoté aux légumes et sauce onctueuse',
        instruction: 'Ajouter les 2 autres cuillères de colombo diluées dans un demi-verre d\'eau tiède, les feuilles de bois d\'Inde, les dés d\'aubergine et les pommes de terre. Couvrir d\'eau à hauteur et laisser mijoter à feu doux pendant 50 minutes.',
        durationMinutes: 50,
        tip: 'L\'aubergine fondante sert de liant naturel pour épaissir la sauce colombo.'
      }
    ],
    comments: [],
    createdAt: '2026-09-23T14:00:00Z'
  },
  {
    id: 'rec-griot',
    title: 'Griot de Porc Croustillant & Pikliz Piquant d\'Haïti',
    description: 'Morceaux de porc confits aux agrumes (orange amère, citron vert) et épices créoles, puis dorés à la perfection. Servi avec son Pikliz de chou croquant mariné au piment et ses bananes pesées croustillantes.',
    authorId: 'user-current',
    authorName: 'Chef Fatou Ndiaye',
    authorAvatar: CHEF_AVATARS.fatou,
    authorHandle: '@fatou_cuisine',
    authorRole: 'chef',
    country: 'Haïti',
    countryFlag: '🇭🇹',
    category: 'Plats Traditionnels',
    difficulty: 'Moyen',
    prepTimeMinutes: 40,
    cookTimeMinutes: 55,
    servings: 4,
    imageUrl: RECIPE_DISH_IMAGES.griotHaitien,
    heritageStory: 'Le Griot est le plat de fête par excellence en Haïti. Aucun rassemblement familial ou mariage ne commence sans l\'odeur envoûtante du porc mariné à l\'orange amère.',
    likesCount: 312,
    commentsCount: 22,
    bookmarksCount: 201,
    isLiked: true,
    isBookmarked: true,
    ingredients: [
      { id: 'g1', name: 'Épaule de porc fermier coupée en gros cubes', amount: 1, unit: 'kg', aisle: 'Boucherie & Poissons' },
      { id: 'g2', name: 'Oranges amères (ou mélange orange douce + citron vert)', amount: 3, unit: 'pièces', aisle: 'Marché Frais & Légumes' },
      { id: 'g3', name: 'Épis haïtien (ciboulette, persil, thym, ail, poivron)', amount: 4, unit: 'c. à soupe', aisle: 'Marché Frais & Légumes' },
      { id: 'g4', name: 'Pikliz : Chou blanc râpé, carotte, échalote', amount: 300, unit: 'g', aisle: 'Marché Frais & Légumes' },
      { id: 'g5', name: 'Vinaigre de cidre et piment bouc pour le Pikliz', amount: 150, unit: 'ml', aisle: 'Condiments & Huiles' },
      { id: 'g6', name: 'Bananes plantains vertes pour bananes pesées', amount: 3, unit: 'pièces', aisle: 'Féculents & Racines' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Nettoyage et marinade au citron vert',
        instruction: 'Frotter la viande avec des demi-citrons verts, rincer à l\'eau tiède. Assaisonner avec l\'épis haïtien, le jus d\'orange amère, sel et poivre.',
        durationMinutes: 15
      },
      {
        stepNumber: 2,
        title: 'Cuisson fondante à l\'étouffée',
        instruction: 'Dans une casserole, faire cuire la viande dans son propre jus et sa marinade à feu doux pendant 35 minutes jusqu\'à ce qu\'elle devienne tendre et que le liquide soit évaporé.',
        durationMinutes: 35
      },
      {
        stepNumber: 3,
        title: 'Friture dorée et croustillante',
        instruction: 'Faire dorer les cubes de porc dans de l\'huile chaude jusqu\'à obtenir une croûte croustillante ambrée, tout en gardant l\'intérieur ultra juteux.',
        durationMinutes: 10
      }
    ],
    comments: [],
    createdAt: '2026-09-21T18:20:00Z'
  },
  {
    id: 'rec-attieke',
    title: 'Attiéké Garba & Thon Braisé Sauce Chien Ivoirienne',
    description: 'La street-food reine d\'Abidjan : semoule de manioc fermentée vapeur, darnes de thon frites assaisonnées, concassé de tomates fraîches, oignons rouges doux et piment vert haché au cube d\'épices.',
    authorId: 'user-marieline',
    authorName: 'Marie-Line Gbagbo',
    authorAvatar: CHEF_AVATARS.marieline,
    authorHandle: '@marieline_gourmet',
    authorRole: 'member',
    country: 'Côte d\'Ivoire',
    countryFlag: '🇨🇮',
    category: 'Street Food',
    difficulty: 'Facile',
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    servings: 2,
    imageUrl: RECIPE_DISH_IMAGES.attiekeGarba,
    heritageStory: 'Le Garba est bien plus qu\'un plat : c\'est le carburant populaire des campus et maquis ivoiriens, apprécié pour sa fraîcheur acidulée et son croustillant inimitable.',
    likesCount: 421,
    commentsCount: 35,
    bookmarksCount: 260,
    isLiked: false,
    isBookmarked: false,
    ingredients: [
      { id: 'a1', name: 'Attiéké frais ou sous vide de qualité', amount: 400, unit: 'g', aisle: 'Féculents & Racines' },
      { id: 'a2', name: 'Darnes de thon rouge ou thonine', amount: 400, unit: 'g', aisle: 'Boucherie & Poissons' },
      { id: 'a3', name: 'Farine de manioc ou blé pour enrober', amount: 50, unit: 'g', aisle: 'Féculents & Racines' },
      { id: 'a4', name: 'Tomates fermes & Oignons rouges doux', amount: 3, unit: 'pièces', aisle: 'Marché Frais & Légumes' },
      { id: 'a5', name: 'Piments frais vert & jaune', amount: 3, unit: 'pièces', aisle: 'Marché Frais & Légumes' },
      { id: 'a6', name: 'Huile de friture du poisson (pour arroser l\'attiéké)', amount: 3, unit: 'c. à soupe', aisle: 'Condiments & Huiles' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Chauffage de l\'Attiéké',
        instruction: 'Égrener l\'attiéké à la fourchette pour retirer les petits grumeaux de fibres. Cuire 5 minutes à la vapeur ou 2 minutes au micro-ondes en l\'humidifiant très légèrement.',
        durationMinutes: 5
      },
      {
        stepNumber: 2,
        title: 'Assaisonnement et friture du thon',
        instruction: 'Saler les morceaux de thon, les passer dans la farine et les plonger dans l\'huile bien chaude pour obtenir une chair cuite à cœur avec une croûte bien dorée.',
        durationMinutes: 12
      },
      {
        stepNumber: 3,
        title: 'Dressage traditionnel au maquis',
        instruction: 'Déposer l\'attiéké tiède, émietter le thon croustillant dessus. Arroser avec une cuillère d\'huile de friture chaude et garnir avec les tomates, oignons et piments crus finement émincés.',
        durationMinutes: 5
      }
    ],
    comments: [],
    createdAt: '2026-09-24T08:00:00Z'
  },
  {
    id: 'rec-jerk',
    title: 'Jerk Chicken Fumé au Barbecue & Rice and Peas',
    description: 'Poulet fermier mariné 24h avec le mythique rub jamaïcain : piments scotch bonnet frais, baies de la Jamaïque écrasées, thym sauvage, gingembre et cassonade, fumé doucement à basse température.',
    authorId: 'user-marcus',
    authorName: 'Chef Marcus Sterling',
    authorAvatar: CHEF_AVATARS.marcus,
    authorHandle: '@marcus_jerkking',
    authorRole: 'chef',
    country: 'Jamaïque',
    countryFlag: '🇯🇲',
    category: 'Plats Traditionnels',
    difficulty: 'Moyen',
    prepTimeMinutes: 30,
    cookTimeMinutes: 50,
    servings: 4,
    imageUrl: RECIPE_DISH_IMAGES.jerkChicken,
    heritageStory: 'Créé par les Marrons de Jamaïque réfugiés dans les Blue Mountains, la technique du Jerk consistait à fumer la viande dans des fosses souterraines pour ne laisser échapper aucune fumée visible.',
    likesCount: 512,
    commentsCount: 41,
    bookmarksCount: 310,
    isLiked: true,
    isBookmarked: true,
    ingredients: [
      { id: 'j1', name: 'Cuisses de poulet fermier avec peau', amount: 1.2, unit: 'kg', aisle: 'Boucherie & Poissons' },
      { id: 'j2', name: 'Piments Scotch Bonnet frais', amount: 3, unit: 'pièces', aisle: 'Marché Frais & Légumes' },
      { id: 'j3', name: 'Piment de la Jamaïque (Allspice) en grains', amount: 2, unit: 'c. à soupe', aisle: 'Épicerie & Épices Afro' },
      { id: 'j4', name: 'Thym frais, cives et gingembre frais râpé', amount: 1, unit: 'botte', aisle: 'Marché Frais & Légumes' },
      { id: 'j5', name: 'Sauce soja noire et vinaigre de canne', amount: 50, unit: 'ml', aisle: 'Condiments & Huiles' },
      { id: 'j6', name: 'Riz long grain & Haricots rouges Kidney', amount: 400, unit: 'g', aisle: 'Féculents & Racines' },
      { id: 'j7', name: 'Lait de coco crémeux pour le riz', amount: 250, unit: 'ml', aisle: 'Rayon Frais' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pâte Jerk artisanale',
        instruction: 'Mixer les piments Scotch Bonnet, les grains d\'allspice, le thym, les cives, le gingembre, l\'ail, la sauce soja et un soupçon de cassonade jusqu\'à obtenir une pâte sombre et aromatique.',
        durationMinutes: 10
      },
      {
        stepNumber: 2,
        title: 'Marinade en profondeur',
        instruction: 'Entailler la chair du poulet jusqu\'à l\'os et frictionner intensément avec la pâte Jerk. Laisser infuser 12 à 24 heures au frais.',
        durationMinutes: 10
      },
      {
        stepNumber: 3,
        title: 'Cuisson fumée et laquage',
        instruction: 'Cuire le poulet au barbecue fermé ou au four très chaud à 200°C pendant 45 minutes en le retournant et en le badigeonnant du jus de marinade.',
        durationMinutes: 45
      }
    ],
    comments: [],
    createdAt: '2026-09-20T16:45:00Z'
  },
  {
    id: 'rec-bokit',
    title: 'Bokit Croustillant Guadeloupéen au Poulet Boucané',
    description: 'Le fameux sandwich traditionnel frit à la commande : pâte à pain gonflée et dorée, garnie de poulet boucané effiloché, sauce créole pimentée, fromage râpé et crudités.',
    authorId: 'user-rodrigue',
    authorName: 'Chef Rodrigue Belfort',
    authorAvatar: CHEF_AVATARS.rodrigue,
    authorHandle: '@rodrigue_kreyol',
    authorRole: 'chef',
    country: 'Guadeloupe',
    countryFlag: '🇬🇵',
    category: 'Street Food',
    difficulty: 'Moyen',
    prepTimeMinutes: 35,
    cookTimeMinutes: 20,
    servings: 4,
    imageUrl: RECIPE_DISH_IMAGES.bokitGuadeloupe,
    heritageStory: 'Inspiré des "journey cakes" des marins, le bokit s\'est enraciné en Guadeloupe au milieu du XIXe siècle pour devenir l\'icône indétrônable des camions food-trucks de Sainte-Anne et Pointe-à-Pitre.',
    likesCount: 389,
    commentsCount: 17,
    bookmarksCount: 220,
    isLiked: false,
    isBookmarked: false,
    ingredients: [
      { id: 'b1', name: 'Farine de blé T55', amount: 500, unit: 'g', aisle: 'Féculents & Racines' },
      { id: 'b2', name: 'Levure boulangère sèche réactivée', amount: 10, unit: 'g', aisle: 'Épicerie & Épices Afro' },
      { id: 'b3', name: 'Poulet fumé ou boucané effiloché', amount: 400, unit: 'g', aisle: 'Boucherie & Poissons' },
      { id: 'b4', name: 'Sauce Chien maison (cive, piment, ail, huile, eau chaude)', amount: 150, unit: 'ml', aisle: 'Condiments & Huiles' },
      { id: 'b5', name: 'Salade croquante & Tomates en rondelles', amount: 200, unit: 'g', aisle: 'Marché Frais & Légumes' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pétrissage de la pâte à bokit',
        instruction: 'Mélanger farine, sel, levure et eau tiède jusqu\'à obtenir une pâte souple qui ne colle pas aux doigts. Laisser lever 1 heure à l\'abri des courants d\'air.',
        durationMinutes: 20
      },
      {
        stepNumber: 2,
        title: 'Friture minute en bain d\'huile',
        instruction: 'Diviser la pâte en 4 pâtons ronds légèrement aplatis. Plonger dans une huile à 175°C. Les bokits vont gonfler comme des ballons dorés.',
        durationMinutes: 8
      },
      {
        stepNumber: 3,
        title: 'Garnissage gourmand',
        instruction: 'Inciser le bokit chaud sur le flanc, imbiber de sauce chien, ajouter le poulet boucané bien chaud, un peu de fromage et des crudités.',
        durationMinutes: 5
      }
    ],
    comments: [],
    createdAt: '2026-09-19T11:00:00Z'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-ndole-cameroon',
    title: 'Make Ndolè Dish',
    subtitle: 'Ndolè royal du Littoral camerounais aux crevettes tigrées, viande braisée et feuilles amères lavées à la perfection.',
    chefId: 'user-jean-paul',
    chefName: 'Chef Jean-Paul Mvondo',
    chefAvatar: CHEF_AVATARS.rodrigue,
    chefCountry: 'Cameroun 🇨🇲',
    chefTitle: 'Grand Maître du Terroir Sawa',
    price: 64, // $64 as shown in reference mockup
    currency: 'USD',
    level: 'Intermédiaire',
    durationHours: '3h 15min',
    durationLabel: '01 Week',
    rating: 4.98,
    reviewsCount: 312,
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    description: 'Apprenez à maîtriser le plat légendaire du Cameroun : la désamérisation artisanale des feuilles de Ndolè, la cuisson onctueuse de la pâte d\'arachide blanche et le grésillement final des oignons et crevettes dans l\'huile fumante.',
    category: 'Dishes',
    country: 'Cameroon',
    countryFlag: '🇨🇲',
    scheduleDate: '12 April 2026',
    scheduleTime: '07:00 - 10:30',
    isFree: false,
    learningOutcomes: [
      'Nettoyer et blanchir les feuilles de vernonia pour un équilibre parfait sans amertume',
      'Obtenir la consistance crémeuse signature de l\'arachide fraîche sans cailler',
      'Dorer les crevettes et faire chanter l\'huile d\'oignon versée en direct sur le plat'
    ],
    lessons: [
      { id: 'l-nd1', title: '1. Lavage et rinçage rituel des feuilles de Ndolè', duration: '20 min', description: 'Technique des grands-mères du Littoral.', isFreePreview: true },
      { id: 'l-nd2', title: '2. Pâte d\'arachide blanche et bouillon de viandes fumées', duration: '35 min', description: 'Mijoté doux à feu modéré.', isFreePreview: false },
      { id: 'l-nd3', title: '3. Le choc thermique final aux crevettes royales', duration: '25 min', description: 'Le geste spectaculaire qui sublime le Ndolè.', isFreePreview: false }
    ],
    enrolledStudentsCount: 420,
    isEnrolled: false
  },
  {
    id: 'course-fumbwa-congo',
    title: 'Make Fumbwa Dish',
    subtitle: 'Fumbwa traditionnel de Kinshasa : feuilles sauvages de koko râpées, poisson fumé capitaine et pâte d\'arachide pure.',
    chefId: 'user-mireille',
    chefName: 'Cheffe Mireille Bakala',
    chefAvatar: CHEF_AVATARS.aicha,
    chefCountry: 'Congo RDC 🇨🇩',
    chefTitle: 'Ambassadrice Gastronomie du Bassin du Congo',
    price: 0, // GRATUIT / FREE as requested
    currency: 'USD',
    level: 'Tous niveaux',
    durationHours: '2h 10min',
    durationLabel: '01 Week',
    rating: 4.95,
    reviewsCount: 520,
    thumbnail: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80',
    description: 'Cours de cuisine en ligne 100% GRATUIT offert à la communauté ! Découvrez les secrets de cuisson du Fumbwa du Congo pour des feuilles tendres et un bouillon délicatement fumé.',
    category: 'Dishes',
    country: 'Congo DRC',
    countryFlag: '🇨🇩',
    scheduleDate: '12 April 2026',
    scheduleTime: '07:00 - 10:30',
    isFree: true,
    learningOutcomes: [
      'Attendrir les fibres du Fumbwa sauvage sans perdre ses nutriments',
      'Désarrêter et infuser le poisson fumé dans le bouillon aromatique',
      'Réussir l\'accompagnement au Fufu de manioc et banane plantain'
    ],
    lessons: [
      { id: 'l-fu1', title: '1. Préparation du Fumbwa séché et trempage', duration: '15 min', description: 'Hydrater et attendrir les feuilles de koko.', isFreePreview: true },
      { id: 'l-fu2', title: '2. Incorporation de la pâte d\'arachide et du poisson fumé', duration: '30 min', description: 'La réduction lente à feu doux.', isFreePreview: true },
      { id: 'l-fu3', title: '3. Battre le Fufu à la spatule en bois', duration: '18 min', description: 'L\'accompagnement incontournable.', isFreePreview: true }
    ],
    enrolledStudentsCount: 1240,
    isEnrolled: true,
    progressPercent: 40
  },
  {
    id: 'course-jollof-rice',
    title: 'Make Jollof Rice Dish',
    subtitle: 'Le légendaire Jollof Rice ouest-africain au goût fumé Smokey Party, poivrons rouges rôtis et piments Scotch Bonnet.',
    chefId: 'user-olumide',
    chefName: 'Chef Olumide Adeyemi',
    chefAvatar: CHEF_AVATARS.marcus,
    chefCountry: 'Nigéria 🇳🇬',
    chefTitle: 'King of Smokey Jollof',
    price: 0, // GRATUIT / FREE
    currency: 'USD',
    level: 'Tous niveaux',
    durationHours: '1h 45min',
    durationLabel: '03 Days',
    rating: 4.99,
    reviewsCount: 780,
    thumbnail: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    description: 'Session interactive en direct gratuite pour percer le mystère du vrai goût fumé (smokey flavor) sans brûler le riz. Idéal pour vos repas de fête et dimanches en famille.',
    category: 'Cuisine',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    scheduleDate: '12 April 2026',
    scheduleTime: '07:00 - 10:30',
    isFree: true,
    learningOutcomes: [
      'Composer le mix de base Obe Ata parfait (tomates prunes, tatale, habanero)',
      'Contrôler la vapeur avec le papier d\'aluminium pour un grain de riz détaché',
      'Obtenir la note fumée emblématique sans aucune amertume'
    ],
    lessons: [
      { id: 'l-jr1', title: '1. Rôtissage des poivrons et du piment au four', duration: '20 min', description: 'Concentrer les sucres naturels avant mixage.', isFreePreview: true },
      { id: 'l-jr2', title: '2. Friture du concentré et réduction du coulis de tomates', duration: '25 min', description: 'L\'étape clé pour éliminer toute acidité.', isFreePreview: true },
      { id: 'l-jr3', title: '3. Cuisson étouffée sous aluminium et caramélisation', duration: '30 min', description: 'La magie du Smokey Party Jollof.', isFreePreview: true }
    ],
    enrolledStudentsCount: 1980,
    isEnrolled: false
  },
  {
    id: 'course-kedjenou-dish',
    title: 'Make Poulet Kedjénou Dish',
    subtitle: 'Poulet fermier mijoté à l\'étouffée dans son canari en terre cuite, jus limpide et parfumé aux herbes d\'Abidjan.',
    chefId: 'user-aicha',
    chefName: 'Cheffe Aïcha Touré',
    chefAvatar: CHEF_AVATARS.aicha,
    chefCountry: 'Côte d\'Ivoire 🇨🇮',
    chefTitle: 'Maître Cuisine Ivoirienne',
    price: 35, // Paid course
    currency: 'USD',
    level: 'Tous niveaux',
    durationHours: '2h 00min',
    durationLabel: '01 Week',
    rating: 4.94,
    reviewsCount: 210,
    thumbnail: RECIPE_DISH_IMAGES.allocoIvoirien,
    description: 'Cuisinez sans une seule goutte d\'eau ajoutée ! Le Kedjénou cuit hermétiquement à la vapeur de ses propres légumes. Technique de secouage du canari pour lier les sucs.',
    category: 'Soups & Stews',
    country: 'Côte d\'Ivoire',
    countryFlag: '🇨🇮',
    scheduleDate: '14 April 2026',
    scheduleTime: '07:00 - 10:30',
    isFree: false,
    learningOutcomes: [
      'Mariner le poulet fermier aux 4 épices forestières de Côte d\'Ivoire',
      'Luter le canari hermétiquement avec des feuilles de bananier',
      'Maîtriser le balancement régulier pour éviter que le fond n\'accroche'
    ],
    lessons: [
      { id: 'l-kj1', title: '1. Découpe du poulet et assaisonnement Akpi & Njangsa', duration: '25 min', description: 'Les graines magiques qui épaississent le jus.', isFreePreview: true },
      { id: 'l-kj2', title: '2. Garniture aromatique brute et mise en canari', duration: '20 min', description: 'Disposer les tomates, oignons et piments entiers.', isFreePreview: false },
      { id: 'l-kj3', title: '3. Cuisson lente sur braises douces et service avec l\'Attiéké', duration: '35 min', description: 'L\'accord parfait avec la semoule de manioc.', isFreePreview: false }
    ],
    enrolledStudentsCount: 310,
    isEnrolled: false
  },
  {
    id: 'course-thieb-master',
    title: 'Ceebu Jën Royal Penda Mbaye',
    subtitle: 'La classe définitive pour réussir le plat national sénégalais avec la croûte dorée Xonx et ses sauces bissap.',
    chefId: 'user-fatou',
    chefName: 'Cheffe Fatou Ndiaye',
    chefAvatar: CHEF_AVATARS.fatou,
    chefCountry: 'Sénégal 🇸🇳',
    chefTitle: 'Ambassadrice Gastronomie Teranga',
    price: 29.99,
    currency: 'USD',
    level: 'Intermédiaire',
    durationHours: '2h 45min',
    durationLabel: '2h 45min',
    rating: 4.96,
    reviewsCount: 148,
    thumbnail: RECIPE_DISH_IMAGES.thieboudienne,
    description: 'Rejoignez Cheffe Fatou dans sa cuisine pour découvrir les gestes précis transmis de mère en fille : le dosage du Guedj, le secret de la caramélisation de la tomate, et la cuisson à la vapeur du riz brisé pour une texture aérienne.',
    category: 'Main courses',
    country: 'Sénégal',
    countryFlag: '🇸🇳',
    scheduleDate: '15 April 2026',
    scheduleTime: '18:00 - 20:30',
    isFree: false,
    learningOutcomes: [
      'Maîtriser la fabrication du Rof aromatique traditionnel au mortier',
      'Réussir la croûte dorée croustillante (Xonx) sans calciner le fond',
      'Équilibrer les saveurs umami avec le Yet et le Guedj',
      'Préparer le Bégué (sauce feuille d\'oseille de Guinée & bissap)'
    ],
    lessons: [
      { id: 'l1', title: '1. Sélection des poissons et secrets du Guedj fermenté', duration: '18 min', description: 'Comment choisir un poisson ferme et manipuler les condiments marins séchés.', isFreePreview: true },
      { id: 'l2', title: '2. Pilonnage du Rof et incision de la chair', duration: '24 min', description: 'Technique ancestrale pour parfumer les chairs de mérou en profondeur.', isFreePreview: false },
      { id: 'l3', title: '3. Le bouillon rouge parfait & cuisson étagée des légumes', duration: '35 min', description: 'Gérer la réduction et préserver le croquant du manioc et des patates douces.', isFreePreview: false },
      { id: 'l4', title: '4. La vapeur de riz brisé & le fameux croquant du Xonx', duration: '30 min', description: 'Absorption lente du bouillon et dressage spectaculaire du grand plat partagé.', isFreePreview: false }
    ],
    enrolledStudentsCount: 312,
    isEnrolled: true,
    progressPercent: 65
  },
  {
    id: 'course-jerk-bbq',
    title: 'Pitmaster Jerk Fumé au Bois de Pimentier',
    subtitle: 'La bible du barbecue jamaïcain pour maîtriser le rub, la fumée lente et le glaçage piquant.',
    chefId: 'user-marcus',
    chefName: 'Chef Marcus Sterling',
    chefAvatar: CHEF_AVATARS.marcus,
    chefCountry: 'Jamaïque 🇯🇲',
    chefTitle: 'Pitmaster & BBQ Champion',
    price: 0,
    currency: 'USD',
    level: 'Tous niveaux',
    durationHours: '1h 15min',
    durationLabel: '02 Days',
    rating: 4.98,
    reviewsCount: 260,
    thumbnail: RECIPE_DISH_IMAGES.jerkChicken,
    description: 'Cours d\'initiation gratuit offert par Chef Marcus pour propager la passion du véritable Jerk jamaïcain à travers le monde.',
    category: 'Main courses',
    country: 'Jamaïque',
    countryFlag: '🇯🇲',
    scheduleDate: '16 April 2026',
    scheduleTime: '16:00 - 18:30',
    isFree: true,
    learningOutcomes: [
      'Gérer le piquant du Scotch Bonnet sans agresser le palais',
      'Créer un fumoir d\'appoint même dans une cuisine d\'appartement',
      'Réussir le Rice and Peas au lait de coco onctueux'
    ],
    lessons: [
      { id: 'l30', title: '1. Anatomie du piment Scotch Bonnet et du Pimento Berry', duration: '12 min', description: 'Pourquoi le Jerk ne ressemble à aucun autre barbecue.', isFreePreview: true },
      { id: 'l31', title: '2. Marinade 24h et cuisson indirecte à basse température', duration: '25 min', description: 'Obtenir une viande juteuse et une peau dorée et caramélisée.', isFreePreview: true },
      { id: 'l32', title: '3. Accompagnements traditionnels : Rice and peas & Festival', duration: '20 min', description: 'Les beignets de maïs croustillants et le riz au coco.', isFreePreview: true }
    ],
    enrolledStudentsCount: 890,
    isEnrolled: true,
    progressPercent: 100
  },
  {
    id: 'course-accras-morue',
    title: 'Accras Dorés de Morue & Sauce Chien',
    subtitle: 'L\'entrée reine des Antilles françaises : pâte légère, morue effilochée, piment végétarien et bain d\'huile croustillant.',
    chefId: 'user-rodrigue',
    chefName: 'Chef Rodrigue Montrose',
    chefAvatar: CHEF_AVATARS.rodrigue,
    chefCountry: 'Martinique 🇲🇶',
    chefTitle: 'Maître Cuisinier Créole',
    price: 19,
    currency: 'USD',
    level: 'Tous niveaux',
    durationHours: '1h 30min',
    durationLabel: '01 Day',
    rating: 4.94,
    reviewsCount: 185,
    thumbnail: RECIPE_DISH_IMAGES.bokitGuadeloupe,
    description: 'Réalisez des accras gonflés et croustillants sans aucune lourdeur grâce au geste du fouet et au dosage millimétré de la levure et des cives fraîches.',
    category: 'Entree',
    country: 'Martinique',
    countryFlag: '🇲🇶',
    scheduleDate: '17 April 2026',
    scheduleTime: '11:00 - 12:30',
    isFree: false,
    learningOutcomes: [
      'Dessaler et effilocher la morue à la main pour garder la texture',
      'Maîtriser la température du bain d\'huile à 180°C pour des beignets non gras',
      'Réaliser la véritable sauce chien parfumée à l\'eau bouillante'
    ],
    lessons: [
      { id: 'l-ac1', title: '1. Appareil à accras & hachis de cives antillaises', duration: '25 min', description: 'Le secret d\'une pâte aérée.', isFreePreview: true },
      { id: 'l-ac2', title: '2. Friture minute et sauce chien émulsionnée', duration: '30 min', description: 'Dorure parfaite et dégustation chaude.', isFreePreview: false }
    ],
    enrolledStudentsCount: 240,
    isEnrolled: false
  },
  {
    id: 'course-pastels-senegal',
    title: 'Pastels Croustillants au Thon & Pâte Levée',
    subtitle: 'Boulangerie et petits chaussons dorés farcis au thon frais épicé avec sauce tomate piquante.',
    chefId: 'user-fatou',
    chefName: 'Cheffe Fatou Ndiaye',
    chefAvatar: CHEF_AVATARS.fatou,
    chefCountry: 'Sénégal 🇸🇳',
    chefTitle: 'Ambassadrice Gastronomie Teranga',
    price: 0,
    currency: 'USD',
    level: 'Tous niveaux',
    durationHours: '1h 15min',
    durationLabel: '02 Hours',
    rating: 4.97,
    reviewsCount: 420,
    thumbnail: RECIPE_DISH_IMAGES.pastelsSenegal,
    description: 'Cours de boulangerie & finger food en ligne gratuit ! Apprenez à pétrir la pâte souple, la plier en demi-lune et sceller les bords à la fourchette.',
    category: 'Baking',
    country: 'Sénégal',
    countryFlag: '🇸🇳',
    scheduleDate: '18 April 2026',
    scheduleTime: '15:00 - 16:30',
    isFree: true,
    learningOutcomes: [
      'Pétrir une pâte à pastels fine et croustillante qui ne durcit pas',
      'Assaisonner la farce de thon au poivre de Penja et persil plat',
      'Cuire la sauce tomate aigre-douce relevée au piment'
    ],
    lessons: [
      { id: 'l-ps1', title: '1. Pétrissage de la pâte et découpe à l\'emporte-pièce', duration: '20 min', description: 'Étaler finement la pâte.', isFreePreview: true },
      { id: 'l-ps2', title: '2. Garniture, scellage et bain d\'huile doré', duration: '25 min', description: 'Cuisson homogène à feu moyen.', isFreePreview: true }
    ],
    enrolledStudentsCount: 650,
    isEnrolled: true
  },
  {
    id: 'course-tourment-amour',
    title: 'Tourment d\'Amour & Pâtisserie Coco des Saintes',
    subtitle: 'Le mythique gâteau antillais : pâte brisée dorée, confiture de noix de coco fraîche râpée et génoise aérienne vanillée.',
    chefId: 'user-marieline',
    chefName: 'Cheffe Marie-Line Desroses',
    chefAvatar: CHEF_AVATARS.marieline,
    chefCountry: 'Guadeloupe 🇬🇵',
    chefTitle: 'Pâtissière & Gardienne des Douceurs Créoles',
    price: 24,
    currency: 'USD',
    level: 'Intermédiaire',
    durationHours: '2h 15min',
    durationLabel: '01 Day',
    rating: 4.99,
    reviewsCount: 310,
    thumbnail: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    description: 'Plongez dans l\'art des desserts antillais. Apprenez à concocter la confiture de coco maison parfumée à la cannelle et au zeste de citron vert, couverte d\'une génoise mousseuse.',
    category: 'Deserts',
    country: 'Guadeloupe',
    countryFlag: '🇬🇵',
    scheduleDate: '19 April 2026',
    scheduleTime: '14:00 - 16:30',
    isFree: false,
    learningOutcomes: [
      'Réaliser une confiture de coco onctueuse au sucre de canne roux',
      'Monter une génoise légère et stable sans s\'effondrer à la cuisson',
      'Foncer les petits moules cannelés traditionnels'
    ],
    lessons: [
      { id: 'l-ta1', title: '1. Râpage de la pulpe de coco et cuisson du sirop épicé', duration: '30 min', description: 'Cannelle, muscade et vanille bourbon.', isFreePreview: true },
      { id: 'l-ta2', title: '2. Montage étagé et cuisson dorée au four', duration: '35 min', description: 'Surveiller la croûte dorée.', isFreePreview: false }
    ],
    enrolledStudentsCount: 380,
    isEnrolled: false
  },
  {
    id: 'course-alloco-kids',
    title: 'Atelier Enfants : Alloco Pops & Mini Brochettes Suya',
    subtitle: 'Cuisinez en famille avec vos enfants ! Découpe sécurisée des plantains, dorure douce et sauces yaourt aux herbes douces.',
    chefId: 'user-aicha',
    chefName: 'Cheffe Aïcha Touré',
    chefAvatar: CHEF_AVATARS.aicha,
    chefCountry: 'Côte d\'Ivoire 🇨🇮',
    chefTitle: 'Maître Cuisine Ivoirienne',
    price: 0,
    currency: 'USD',
    level: 'Tous niveaux',
    durationHours: '1h 00min',
    durationLabel: '45 min',
    rating: 4.95,
    reviewsCount: 520,
    thumbnail: RECIPE_DISH_IMAGES.allocoIvoirien,
    description: 'Une session ludique spécialement conçue pour les petits gourmets (6-14 ans accompagnés de leurs parents) pour s\'initier aux saveurs d\'Afrique de l\'Ouest.',
    category: 'Kids',
    country: 'Côte d\'Ivoire',
    countryFlag: '🇨🇮',
    scheduleDate: '20 April 2026',
    scheduleTime: '10:00 - 11:00',
    isFree: true,
    learningOutcomes: [
      'Apprendre les gestes sécurisés de découpe des fruits exotiques',
      'Assembler des mini brochettes colorées et équilibrées',
      'Créer des sauces gourmandes douces sans piquant'
    ],
    lessons: [
      { id: 'l-kd1', title: '1. Découpe des étoiles de plantains mûrs', duration: '15 min', description: 'Gestes simples pour les enfants.', isFreePreview: true },
      { id: 'l-kd2', title: '2. Cuisson dorée et dressage festif', duration: '20 min', description: 'Présentation sur bâtonnets en bois.', isFreePreview: true }
    ],
    enrolledStudentsCount: 710,
    isEnrolled: true
  },
  {
    id: 'course-bissap-cocktails',
    title: 'Mixologie Afro : Nectars Tropicaux, Bissap & Rhum Vieux',
    subtitle: 'Infusions à froid de fleurs d\'hibiscus sabdariffa, nectars de baobab (Bouye) et cocktails créoles raffinés.',
    chefId: 'user-marcus',
    chefName: 'Chef Marcus Sterling',
    chefAvatar: CHEF_AVATARS.marcus,
    chefCountry: 'Haïti 🇭🇹',
    chefTitle: 'Mixologue & Barman Créole',
    price: 15,
    currency: 'USD',
    level: 'Tous niveaux',
    durationHours: '1h 15min',
    durationLabel: '01 Hour',
    rating: 4.96,
    reviewsCount: 195,
    thumbnail: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
    description: 'Maîtrisez les sirops maison de menthe sauvage, l\'infusion de fleurs de bissap séchées d\'Afrique et les accords rhums agricoles XO avec glaçons infusés.',
    category: 'Beverages',
    country: 'Haïti',
    countryFlag: '🇭🇹',
    scheduleDate: '21 April 2026',
    scheduleTime: '19:00 - 20:30',
    isFree: false,
    learningOutcomes: [
      'Réussir l\'infusion à froid de fleurs de karkadé sans acidité excessive',
      'Émulsionner le nectar velouté de pain de singe (bouye) au lait de coco',
      'Équilibrer le Ti-Punch traditionnel et cocktails sans alcool mocktails'
    ],
    lessons: [
      { id: 'l-bv1', title: '1. L\'infusion parfaite de fleurs d\'hibiscus et feuilles de menthe', duration: '20 min', description: 'Technique d\'extraction aromatique.', isFreePreview: true },
      { id: 'l-bv2', title: '2. Shaker, glaçons aromatisés et équilibre sucre/acidité', duration: '25 min', description: 'Cocktails avec et sans alcool.', isFreePreview: false }
    ],
    enrolledStudentsCount: 290,
    isEnrolled: false
  },
  {
    id: 'course-creole-tapas',
    title: 'Tapas & Apéro Dinatoire Créole & Piment Doux',
    subtitle: 'Féroce d\'avocat à la morue et farine de manioc, samoussas croustillants et dips de patate douce.',
    chefId: 'user-rodrigue',
    chefName: 'Chef Rodrigue Montrose',
    chefAvatar: CHEF_AVATARS.rodrigue,
    chefCountry: 'Guadeloupe 🇬🇵',
    chefTitle: 'Maître Cuisinier Créole',
    price: 0,
    currency: 'USD',
    level: 'Tous niveaux',
    durationHours: '1h 30min',
    durationLabel: '01 Day',
    rating: 4.98,
    reviewsCount: 380,
    thumbnail: RECIPE_DISH_IMAGES.griotHaitien,
    description: 'Cours gratuit pour réussir vos apéritifs et buffets dînatoires ensoleillés. Techniques express et présentation élégante.',
    category: 'Appetizes',
    country: 'Guadeloupe',
    countryFlag: '🇬🇵',
    scheduleDate: '22 April 2026',
    scheduleTime: '18:00 - 19:30',
    isFree: true,
    learningOutcomes: [
      'Écraser l\'avocat mûr avec la farine de manioc toastée pour le Féroce',
      'Plier les feuilles de brick en triangles hermétiques dorés au four',
      'Créer des sauces dip onctueuses au piment végétarien doux'
    ],
    lessons: [
      { id: 'l-ap1', title: '1. Le Féroce d\'avocat traditionnel martiniquais', duration: '25 min', description: 'Texture granuleuse parfaite.', isFreePreview: true },
      { id: 'l-ap2', title: '2. Pliage des samoussas et cuisson croustillante', duration: '25 min', description: 'Cuisson poêle ou four sans éclat.', isFreePreview: true }
    ],
    enrolledStudentsCount: 820,
    isEnrolled: true
  },
  {
    id: 'course-salade-mangue-papaye',
    title: 'Salade Fraîcheur Tropicale : Mangue, Papaye & Crevettes',
    subtitle: 'Émincé fin de papaye verte mariné au jus de citron vert, dés de mangue avion et vinaigrette passion-piment.',
    chefId: 'user-fatou',
    chefName: 'Cheffe Fatou Ndiaye',
    chefAvatar: CHEF_AVATARS.fatou,
    chefCountry: 'Sénégal 🇸🇳',
    chefTitle: 'Ambassadrice Gastronomie Teranga',
    price: 12,
    currency: 'USD',
    level: 'Tous niveaux',
    durationHours: '45 min',
    durationLabel: '45 min',
    rating: 4.93,
    reviewsCount: 160,
    thumbnail: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    description: 'Une explosion de fraîcheur acidulée et sucrée-salée pour accompagner vos plats chauds ou régaler vos convives en été.',
    category: 'Salad',
    country: 'Sénégal',
    countryFlag: '🇸🇳',
    scheduleDate: '23 April 2026',
    scheduleTime: '12:00 - 13:00',
    isFree: false,
    learningOutcomes: [
      'Râper et attendrir la chair de la papaye verte avec une pincée de sel',
      'Émulsionner une vinaigrette aux fruits de la passion et huile de tournesol',
      'Snacker les crevettes à la poêle avec un filet d\'ail écrasé'
    ],
    lessons: [
      { id: 'l-sl1', title: '1. Julienne de papaye et découpe de mangue mûre', duration: '15 min', description: 'Taillage régulier.', isFreePreview: true },
      { id: 'l-sl2', title: '2. Dressage en dôme et perles de fruit de la passion', duration: '15 min', description: 'Présentation gastronomique.', isFreePreview: false }
    ],
    enrolledStudentsCount: 190,
    isEnrolled: false
  },
  {
    id: 'course-petit-dej-afro',
    title: 'Petit-Déjeuner Teranga : Bouillie de Mil, Beignets Koki & Café Touba',
    subtitle: 'Commencer la journée avec énergie : Thiakry onctueux au yaourt doux, beignets soufflés et café épicé au poivre Selim.',
    chefId: 'user-fatou',
    chefName: 'Cheffe Fatou Ndiaye',
    chefAvatar: CHEF_AVATARS.fatou,
    chefCountry: 'Sénégal 🇸🇳',
    chefTitle: 'Ambassadrice Gastronomie Teranga',
    price: 0,
    currency: 'USD',
    level: 'Tous niveaux',
    durationHours: '1h 00min',
    durationLabel: '01 Hour',
    rating: 4.98,
    reviewsCount: 470,
    thumbnail: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    description: 'Apprenez à préparer le premier repas de la journée à la mode dakaroise : la vapeur douce du mil roulé, le parfum envoûtant du Djar (poivre de Selim) et les beignets dorés.',
    category: 'Breakfast',
    country: 'Sénégal',
    countryFlag: '🇸🇳',
    scheduleDate: '24 April 2026',
    scheduleTime: '08:00 - 09:15',
    isFree: true,
    learningOutcomes: [
      'Régler la cuisson à la vapeur du couscous de mil ou fonio',
      'Torréfier et moudre les grains de café avec le poivre de Selim',
      'Former et dorer des beignets croustillants à l\'extérieur et moelleux dedans'
    ],
    lessons: [
      { id: 'l-bf1', title: '1. Préparation du Thiakry et assemblage yaourt/vanille', duration: '20 min', description: 'Le petit déjeuner réconfortant.', isFreePreview: true },
      { id: 'l-bf2', title: '2. Filtration du Café Touba traditionnel', duration: '15 min', description: 'Le rituel matinal sénégalais.', isFreePreview: true }
    ],
    enrolledStudentsCount: 560,
    isEnrolled: true
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm-mafe',
    name: 'Les Maîtres du Mafé & Yassa',
    tagline: 'Pour l\'amour inconditionnel des oignons caramélisés et de la pâte d\'arachide onctueuse.',
    description: 'Le cercle des passionnés de cuisine sénégalaise, malienne et guinéenne. Partage de variantes familiales, astuces de fumage et secrets d\'oignons.',
    coverImage: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80',
    membersCount: 4820,
    region: 'Afrique de l\'Ouest',
    interestCategory: 'traditional',
    interestLabel: 'Plats Traditionnels & Mijotés',
    tags: ['Mafé', 'Yassa', 'Sénégal', 'Mijotés', 'Arachide'],
    privacy: 'public',
    isJoined: true,
    posts: [
      {
        id: 'cp1',
        authorName: 'Cheikh Sarr',
        authorAvatar: CHEF_AVATARS.rodrigue,
        authorCountry: 'Sénégal 🇸🇳',
        content: 'Question pour les puristes : est-ce que vous mettez du bouillon de mouton ou de bœuf pour votre Mafé aux patates douces ? Mon secret personnel : 2 cuillères de pâte d\'arachide torréfiée au tout début !',
        timestamp: 'Hier à 19:30',
        likes: 34,
        repliesCount: 16
      },
      {
        id: 'cp2',
        authorName: 'Aissatou Diallo',
        authorAvatar: CHEF_AVATARS.marieline,
        authorCountry: 'Guinée 🇬🇳',
        content: 'La caramélisation des oignons du Yassa prend au moins 45 minutes à feu très doux pour éviter toute amertume. Quel vinaigre utilisez-vous pour la touche acidulée ?',
        timestamp: 'Il y a 2 jours',
        likes: 28,
        repliesCount: 11
      }
    ]
  },
  {
    id: 'comm-streetfood',
    name: 'Street Food Panafricaine & Bouchées',
    tagline: 'Du Garba d\'Abidjan aux Bokits guadeloupéens, Pastels de Dakar et Suya de Lagos.',
    description: 'La référence des snacks, beignets et sandwichs emblématiques vendus au coin des rues vibrantes d\'Afrique et des Caraïbes.',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    membersCount: 5140,
    region: 'Panafricain & Diaspora',
    interestCategory: 'street_food',
    interestLabel: 'Street Food & Bouchées',
    tags: ['Garba', 'Bokit', 'Pastel', 'Alloco', 'StreetFood'],
    privacy: 'public',
    isJoined: true,
    posts: [
      {
        id: 'cp-sf1',
        authorName: 'Cheffe Aïcha Touré',
        authorAvatar: CHEF_AVATARS.aicha,
        authorCountry: 'Côte d\'Ivoire 🇨🇮',
        content: 'Pour un Alloco bien doré et caramélisé sans être gras, trempez vos rondelles de banane plantain très mûres 3 minutes dans une eau légèrement salée avant la friture !',
        timestamp: 'Il y a 1 jour',
        likes: 62,
        repliesCount: 19
      }
    ]
  },
  {
    id: 'comm-kreyol',
    name: 'Saveurs Créoles & Bokit Fans',
    tagline: 'Martinique, Guadeloupe, Guyane et Réunion : le temple des accras et du colombo.',
    description: 'Échangez vos recettes d\'accras de morue dorés, de boudins créoles, de chiquetaille de morue et de rhums arrangés traditionnels.',
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    membersCount: 3650,
    region: 'Caraïbes & Antilles',
    interestCategory: 'traditional',
    interestLabel: 'Cuisine Créole & Antillaise',
    tags: ['Colombo', 'Accras', 'Bokit', 'Antilles', 'Martinique'],
    privacy: 'public',
    isJoined: true,
    posts: [
      {
        id: 'cp3',
        authorName: 'Léa Célestine',
        authorAvatar: CHEF_AVATARS.aicha,
        authorCountry: 'Guadeloupe 🇬🇵',
        content: 'Astuce pour des accras ultra légers qui ne boivent pas l\'huile : ajoutez une demi-cuillère à café de bicarbonate dans votre pâte bien relevée en cive et piment végétarien !',
        timestamp: 'Il y a 5 heures',
        likes: 45,
        repliesCount: 9
      }
    ]
  },
  {
    id: 'comm-afrovegan',
    name: 'Afro-Vegan & Végétal Créatif',
    tagline: 'Réinventer les classiques avec du gombo, du manioc, des légumineuses et du jaquier.',
    description: 'Une communauté vibrante qui prouve que la cuisine afro-caribéenne regorge naturellement de pépites végétales riches en saveurs et en nutriments.',
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    membersCount: 2190,
    region: 'Diaspora Mondiale',
    interestCategory: 'healthy_vegan',
    interestLabel: 'Afro-Vegan & Santé',
    tags: ['Vegan', 'Manioc', 'Gombo', 'Ital', 'SansGluten'],
    privacy: 'public',
    isJoined: false,
    posts: [
      {
        id: 'cp4',
        authorName: 'Malik Camara',
        authorAvatar: CHEF_AVATARS.marcus,
        authorCountry: 'Côte d\'Ivoire 🇨🇮',
        content: 'Mon "Garba Végétarien" avec des cubes de tofu fumé mariné au piment doux et citron vert a bluffé toute ma famille ce week-end ! L\'Attiéké s\'adapte merveilleusement.',
        timestamp: 'Il y a 3 jours',
        likes: 58,
        repliesCount: 14
      }
    ]
  },
  {
    id: 'comm-bbq',
    name: 'Barbecue, Braisés & Jerk Smokehouse',
    tagline: 'L\'art des marinades de 24h, des braises incandescentes et du piment pimenté.',
    description: 'Pour tous les adeptes de poissons braisés entiers, Choukouya d\'agneau au feu de bois et authentique Jerk Chicken jamaïcain.',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    membersCount: 3890,
    region: 'Panafricain & Caraïbes',
    interestCategory: 'grills_bbq',
    interestLabel: 'Barbecue & Braisés',
    tags: ['Braisé', 'Jerk', 'Barbecue', 'Choukouya', 'Poissons'],
    privacy: 'public',
    isJoined: false,
    posts: [
      {
        id: 'cp-bbq1',
        authorName: 'Chef Marcus Garvey Jr',
        authorAvatar: CHEF_AVATARS.marcus,
        authorCountry: 'Jamaïque 🇯🇲',
        content: 'Le véritable secret du Jerk jamaïcain : ne jamais négliger les baies de piment de la Jamaïque écrasées au mortier avec du thym frais et du gingembre sauvage.',
        timestamp: 'Il y a 4 heures',
        likes: 71,
        repliesCount: 22
      }
    ]
  },
  {
    id: 'comm-pastry',
    name: 'Douceurs, Pâtisseries & Desserts Tropicaux',
    tagline: 'Tourments d\'amour, gâteaux coco, beignets soufflés et Thiacry gourmands.',
    description: 'Le temple des gourmandises sucrées parfumées à la vanille bourbon, fève tonka, cannelle, mangue, corossol et coco râpé.',
    coverImage: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
    membersCount: 2980,
    region: 'Antilles & Afrique',
    interestCategory: 'pastry_sweets',
    interestLabel: 'Pâtisserie & Douceurs Tropicales',
    tags: ['Desserts', 'Coco', 'Cannelle', 'Thiacry', 'Beignets'],
    privacy: 'public',
    isJoined: false,
    posts: [
      {
        id: 'cp-p1',
        authorName: 'Marie-Line',
        authorAvatar: CHEF_AVATARS.marieline,
        authorCountry: 'Martinique 🇲🇶',
        content: 'Réussir la pâte sablée d\'un tourment d\'amour des Saintes : une touche de zeste de citron vert râpé dans la confiture de goyave fait toute la différence !',
        timestamp: 'Hier',
        likes: 39,
        repliesCount: 8
      }
    ]
  }
];

export const INITIAL_MEAL_PLAN: DayPlan[] = [
  {
    dayName: 'Lundi',
    lunch: INITIAL_RECIPES[3], // Attiéké Garba
    dinner: INITIAL_RECIPES[1]  // Colombo de Cabri
  },
  {
    dayName: 'Mardi',
    lunch: INITIAL_RECIPES[4], // Jerk Chicken
    dinner: undefined
  },
  {
    dayName: 'Mercredi',
    lunch: INITIAL_RECIPES[5], // Bokit Poulet
    dinner: INITIAL_RECIPES[2]  // Griot de Porc
  },
  {
    dayName: 'Jeudi',
    lunch: undefined,
    dinner: INITIAL_RECIPES[0]  // Thiéboudienne
  },
  {
    dayName: 'Vendredi',
    lunch: INITIAL_RECIPES[3], // Attiéké Garba
    dinner: undefined
  },
  {
    dayName: 'Samedi',
    lunch: INITIAL_RECIPES[4], // Jerk Chicken
    dinner: INITIAL_RECIPES[1]  // Colombo
  },
  {
    dayName: 'Dimanche',
    lunch: INITIAL_RECIPES[0], // Thiéboudienne Royal du Dimanche
    dinner: INITIAL_RECIPES[2]  // Griot
  }
];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    type: 'enrollment',
    title: 'Nouvelle inscription à votre Masterclass !',
    message: 'Amina Diop s\'est inscrite à "L\'Art Secret du Ceebu Jën Royal & des Sauces Traditionnelles".',
    actorName: 'Amina Diop',
    actorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    actorHandle: '@amina_foodie',
    targetId: 'course-thieb-master',
    targetTitle: 'L\'Art Secret du Ceebu Jën Royal & des Sauces Traditionnelles',
    targetImage: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80',
    createdAt: 'Il y a 12 minutes',
    isRead: false,
    amountEarned: 25.49
  },
  {
    id: 'notif-2',
    type: 'comment',
    title: 'Nouveau commentaire sur votre recette',
    message: 'Chef Rodrigue Belfort : « La couleur de ce riz est spectaculaire Cheffe ! Le Guedj apporte cette profondeur umami incomparable. »',
    actorName: 'Chef Rodrigue Belfort',
    actorAvatar: CHEF_AVATARS.rodrigue,
    actorHandle: '@rodrigue_kreyol',
    targetId: 'rec-thieb',
    targetTitle: 'Ceebu Jën Royal (Thiéboudienne Rouge Authentique)',
    targetImage: RECIPE_DISH_IMAGES.thieboudienne,
    createdAt: 'Il y a 45 minutes',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'like',
    title: 'Nouveau coup de cœur sur votre recette',
    message: 'Marie-Line Gbagbo a aimé votre recette "Ceebu Jën Royal (Thiéboudienne Rouge Authentique)".',
    actorName: 'Marie-Line Gbagbo',
    actorAvatar: CHEF_AVATARS.marieline,
    actorHandle: '@marieline_gourmet',
    targetId: 'rec-thieb',
    targetTitle: 'Ceebu Jën Royal (Thiéboudienne Rouge Authentique)',
    targetImage: RECIPE_DISH_IMAGES.thieboudienne,
    createdAt: 'Il y a 2 heures',
    isRead: false
  },
  {
    id: 'notif-4',
    type: 'like',
    title: 'Nouveau coup de cœur sur votre recette',
    message: 'Chef Marcus Sterling a aimé votre recette "Griot de Porc Croustillant & Pikliz Piquant d\'Haïti".',
    actorName: 'Chef Marcus Sterling',
    actorAvatar: CHEF_AVATARS.marcus,
    actorHandle: '@marcus_jerkking',
    targetId: 'rec-griot',
    targetTitle: 'Griot de Porc Croustillant & Pikliz Piquant d\'Haïti',
    targetImage: RECIPE_DISH_IMAGES.griotHaitien,
    createdAt: 'Hier à 18:20',
    isRead: true
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-fatou',
    userId: 'user-current',
    userName: 'Chef Fatou Ndiaye',
    userHandle: '@fatou_cuisine',
    userAvatar: CHEF_AVATARS.fatou,
    userRole: 'chef',
    userCountry: 'Sénégal',
    userCountryFlag: '🇸🇳',
    isVerified: true,
    isCurrentUser: true,
    createdAt: 'Il y a 35 min',
    isViewed: false,
    slides: [
      {
        id: 'slide-fatou-1',
        mediaUrl: RECIPE_DISH_IMAGES.thieboudienne,
        mediaType: 'image',
        caption: '🔥 Le secret du Xonx bien doré pour le Ceebu Jën : baisser le feu au minimum et laisser croûter 20 min sans remuer !',
        location: 'Dakar, Sénégal 🇸🇳',
        tagRecipeId: 'rec-thieb',
        tagRecipeTitle: 'Ceebu Jën Royal (Thiéboudienne Rouge Authentique)',
        tagRecipeImage: RECIPE_DISH_IMAGES.thieboudienne,
        sticker: {
          type: 'poll',
          question: 'Votre préférence pour le Thiéboudienne ?',
          options: [
            { label: '🔴 Rouge (Xonx)', votes: 142 },
            { label: '⚪ Blanc (Penda Mbaye)', votes: 38 }
          ]
        },
        likesCount: 89,
        durationSeconds: 6
      },
      {
        id: 'slide-fatou-2',
        mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80',
        mediaType: 'image',
        caption: '🍋 Marinade au rof piquant et tamarin pour les poissons grillés du marché Soumbédioune.',
        location: 'Marché Soumbédioune, Dakar',
        sticker: {
          type: 'tip',
          tipTitle: 'Astuce de Cheffe 💡',
          tipContent: 'Toujours inciser le poisson frais en biais pour que le rof pénètre jusqu\'à l\'arête dorsale.'
        },
        likesCount: 64,
        durationSeconds: 5
      }
    ]
  },
  {
    id: 'story-rodrigue',
    userId: 'user-rodrigue',
    userName: 'Chef Rodrigue Belfort',
    userHandle: '@rodrigue_kreyol',
    userAvatar: CHEF_AVATARS.rodrigue,
    userRole: 'chef',
    userCountry: 'Martinique',
    userCountryFlag: '🇲🇶',
    isVerified: true,
    createdAt: 'Il y a 1h',
    isViewed: false,
    slides: [
      {
        id: 'slide-rodrigue-1',
        mediaUrl: RECIPE_DISH_IMAGES.colomboCabri,
        mediaType: 'image',
        caption: '🌿 Torréfaction minute des graines à colombo au mortier en pierre de lave. Les arômes envahissent la cuisine !',
        location: 'Fort-de-France, Martinique 🇲🇶',
        tagRecipeId: 'rec-colombo',
        tagRecipeTitle: 'Colombo de Cabri Fermier aux Épices Torréfiées',
        tagRecipeImage: RECIPE_DISH_IMAGES.colomboCabri,
        sticker: {
          type: 'tip',
          tipTitle: 'Secret Créole 🔥',
          tipContent: 'Ne jamais faire brûler la poudre de colombo : 30 secondes à sec dans la poêle chaude suffisent.'
        },
        likesCount: 118,
        durationSeconds: 5
      }
    ]
  },
  {
    id: 'story-marcus',
    userId: 'user-marcus',
    userName: 'Chef Marcus Sterling',
    userHandle: '@marcus_jerkking',
    userAvatar: CHEF_AVATARS.marcus,
    userRole: 'chef',
    userCountry: 'Jamaïque',
    userCountryFlag: '🇯🇲',
    isVerified: true,
    createdAt: 'Il y a 3h',
    isViewed: false,
    slides: [
      {
        id: 'slide-marcus-1',
        mediaUrl: RECIPE_DISH_IMAGES.jerkChicken,
        mediaType: 'image',
        caption: '🍗 Authentic Jerk Pit fired up with pimento wood & allspice leaves! Who\'s ready for the weekend heat?',
        location: 'Kingston, Jamaica 🇯🇲',
        tagRecipeId: 'rec-jerk',
        tagRecipeTitle: 'Authentic Jamaican Jerk Chicken au Bois de Piment',
        tagRecipeImage: RECIPE_DISH_IMAGES.jerkChicken,
        sticker: {
          type: 'poll',
          question: 'How spicy do you like your Jerk?',
          options: [
            { label: '🌶️ Extra Hot Scotch Bonnet', votes: 215 },
            { label: '🍯 Sweet & Mild Glaze', votes: 76 }
          ]
        },
        likesCount: 204,
        durationSeconds: 6
      }
    ]
  },
  {
    id: 'story-marieline',
    userId: 'user-marieline',
    userName: 'Marie-Line Gbagbo',
    userHandle: '@marieline_gourmet',
    userAvatar: CHEF_AVATARS.marieline,
    userRole: 'member',
    userCountry: 'Côte d\'Ivoire',
    userCountryFlag: '🇨🇮',
    isVerified: false,
    createdAt: 'Il y a 4h',
    isViewed: false,
    slides: [
      {
        id: 'slide-marieline-1',
        mediaUrl: RECIPE_DISH_IMAGES.allocoIvoirien,
        mediaType: 'image',
        caption: '🍌 Pause goûter : Alloco bien doré servi avec une sauce pimentée tomate-oignon et du poisson frit !',
        location: 'Abidjan, Côte d\'Ivoire 🇨🇮',
        tagRecipeId: 'rec-alloco',
        tagRecipeTitle: 'Alloco Fondant & Sauce Pimentée d\'Abidjan',
        tagRecipeImage: RECIPE_DISH_IMAGES.allocoIvoirien,
        likesCount: 92,
        durationSeconds: 5
      }
    ]
  },
  {
    id: 'story-aicha',
    userId: 'user-aicha',
    userName: 'Cheffe Aïcha Touré',
    userHandle: '@aicha_pastels',
    userAvatar: CHEF_AVATARS.aicha,
    userRole: 'chef',
    userCountry: 'Guinée',
    userCountryFlag: '🇬🇳',
    isVerified: true,
    createdAt: 'Il y a 6h',
    isViewed: true,
    slides: [
      {
        id: 'slide-aicha-1',
        mediaUrl: RECIPE_DISH_IMAGES.pastelsSenegal,
        mediaType: 'image',
        caption: '🥟 Pliage minutieux des pastels sénégalais farcis au thon et persil plat. Cuisson dorée croustillante !',
        location: 'Conakry, Guinée 🇬🇳',
        tagRecipeId: 'rec-pastels',
        tagRecipeTitle: 'Pastels Dorés au Thon Frais & Sauce Tomate Épicée',
        tagRecipeImage: RECIPE_DISH_IMAGES.pastelsSenegal,
        sticker: {
          type: 'poll',
          question: 'La sauce idéale pour tremper ?',
          options: [
            { label: '🥫 Sauce tomate pimentée', votes: 167 },
            { label: '🍋 Sauce rof vinaigrée', votes: 83 }
          ]
        },
        likesCount: 145,
        durationSeconds: 5
      }
    ]
  }
];

export const INITIAL_EXPERIENCES: CulinaryExperience[] = [
  {
    id: 'exp-1',
    title: 'Atelier Thiéboudienne Royal au Feu de Bois & Cérémonie Ataya',
    description: 'Immergez-vous dans la pure tradition de la Teranga sénégalaise. Après une sélection d\'épices et de poissons frais au port, vous apprendrez le pilonnage du rof, la cuisson du riz brisé parfumé et dégusterez le plat autour du grand bol avec la célèbre cérémonie du thé ataya.',
    category: 'cooking_workshop',
    categoryLabel: 'Atelier Culinaire',
    categoryEmoji: '🍳',
    hostId: 'user-current',
    hostName: 'Chef Fatou Ndiaye',
    hostAvatar: CHEF_AVATARS.fatou,
    hostRole: 'Cheffe Certifiée & Ambassadrice Teranga',
    hostBio: 'Passionnée par la transmission des secrets culinaires wolofs depuis plus de 15 ans. Ses ateliers ont été recommandés par les plus grands guides gastronomiques.',
    hostRating: 4.95,
    reviewsCount: 48,
    pricePerPerson: 65,
    commissionRate: 0.30,
    hostNetPerPerson: 45.5,
    platformFeePerPerson: 19.5,
    country: 'Sénégal',
    countryFlag: '🇸🇳',
    city: 'Dakar',
    locationAddress: 'Maison de la Teranga, Ruelle des Baobabs, Île de Ngor',
    meetingPoint: 'Débarcadère de la navette pour Ngor (plage des Almadies)',
    durationMinutes: 240,
    durationDisplay: '4h',
    maxGuests: 8,
    bookedGuestsCount: 5,
    availableDates: ['Samedi 3 Octobre - 10h00', 'Dimanche 11 Octobre - 10h00', 'Samedi 17 Octobre - 10h00'],
    imageUrl: RECIPE_DISH_IMAGES.thieboudienne,
    galleryImages: [
      RECIPE_DISH_IMAGES.thieboudienne,
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80'
    ],
    includedItems: [
      'Tous les ingrédients frais du marché bio',
      'Tablier souvenir Afrodelicious brodé',
      'Dégustation complète du Thiéboudienne avec bissap frais',
      'Cérémonie traditionnelle des 3 verres de thé Ataya',
      'Fiche recette secrète imprimée'
    ],
    language: 'Français & Wolof',
    isFeatured: true
  },
  {
    id: 'exp-2',
    title: 'Dégustation Grands Crus Sud-Africains & Rhums Agricoles des Mornes',
    description: 'Une masterclass de dégustation immersive guidée par deux sommeliers passionnés. Découvrez les cépages emblématiques de Stellenbosch (Pinotage, Chenin Blanc) combinés aux rhums vieux XO antillais vieillis en fûts de chêne, accompagnés d\'accords mets & bouchées caribéennes.',
    category: 'wine_tasting',
    categoryLabel: 'Dégustation de Vins & Rhums',
    categoryEmoji: '🍷',
    hostId: 'user-rodrigue',
    hostName: 'Chef Rodrigue Belfort & Sommelier Kwesi',
    hostAvatar: CHEF_AVATARS.rodrigue,
    hostRole: 'Chef Étoilé & Maître Sommelier',
    hostBio: 'Rodrigue sublime le terroir antillais tandis que Kwesi est sommelier certifié WSET 3 spécialisé dans les vignobles d\'Afrique australe.',
    hostRating: 4.98,
    reviewsCount: 36,
    pricePerPerson: 85,
    commissionRate: 0.30,
    hostNetPerPerson: 59.5,
    platformFeePerPerson: 25.5,
    country: 'Martinique',
    countryFlag: '🇲🇶',
    city: 'Fort-de-France',
    locationAddress: 'Domaine des Mornes, Habitation Bel-Air',
    meetingPoint: 'Cour d\'honneur de l\'Habitation, sous le tamarinier centenaire',
    durationMinutes: 150,
    durationDisplay: '2h30',
    maxGuests: 12,
    bookedGuestsCount: 8,
    availableDates: ['Vendredi 9 Octobre - 18h30', 'Samedi 17 Octobre - 18h30', 'Jeudi 22 Octobre - 19h00'],
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=900&auto=format&fit=crop&q=80'
    ],
    includedItems: [
      'Dégustation de 5 cuvées rares (3 vins & 2 rhums hors d\'âge)',
      'Planche d\'accords gourmands (accras de morue, rillettes de marlin fumé, fromages affinés)',
      'Guide oenologique des terroirs africains & créoles',
      'Verre de dégustation gravé offert'
    ],
    language: 'Français & Anglais',
    isFeatured: true
  },
  {
    id: 'exp-3',
    title: 'Street Food Safari & Marché Gourmand à Little Africa & Brixton',
    description: 'Arpentez les marchés afro-caribéens les plus vibrants avec un chef local. Nous naviguerons entre les étals d\'épices, tubercules d\'igname, piments scotch bonnet et poissons fumés, avant 6 arrêts dégustation de street food authentique servie à la minute.',
    category: 'market_tour',
    categoryLabel: 'Marché Gourmand & Food Tour',
    categoryEmoji: '🎒',
    hostId: 'user-amara',
    hostName: 'Chef Amara Diop',
    hostAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
    hostRole: 'Guide Gastronomique & Chef Street Food',
    hostBio: 'Pionnier des food tours afro-urbains, Amara vous ouvre les portes secrètes des artisans et épiciers les plus réputés.',
    hostRating: 4.92,
    reviewsCount: 64,
    pricePerPerson: 45,
    commissionRate: 0.30,
    hostNetPerPerson: 31.5,
    platformFeePerPerson: 13.5,
    country: 'France',
    countryFlag: '🇫🇷',
    city: 'Paris',
    locationAddress: 'Marché Dejean & Rue des Poissonniers, 18ème',
    meetingPoint: 'Sortie du Métro Château Rouge (face à la boulangerie)',
    durationMinutes: 180,
    durationDisplay: '3h',
    maxGuests: 10,
    bookedGuestsCount: 6,
    availableDates: ['Samedi 3 Octobre - 14h00', 'Samedi 10 Octobre - 14h00', 'Samedi 24 Octobre - 14h00'],
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=900&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&auto=format&fit=crop&q=80'
    ],
    includedItems: [
      'Visite guidée immersive de 3h',
      '6 dégustations street food chaudes (Pastels, Alloco, Brochettes Suya, Patties)',
      'Boissons artisanales (Bissap menthe & Gingembre ananas)',
      'Sac cabas en tissu Wax réutilisable pour vos emplettes'
    ],
    language: 'Français, Anglais & Espagnol'
  },
  {
    id: 'exp-4',
    title: 'Masterclass Jerk Chicken au Feu de Pimentier & Cocktails au Rhum',
    description: 'Venez vivre la véritable expérience du Jerk pitmaster au sommet des collines d\'Ocho Rios. Vous préparerez la marinade traditionnelle avec les piments Scotch Bonnet du jardin et le bois de pimentier vert qui confère cette saveur fumée mythique.',
    category: 'cooking_workshop',
    categoryLabel: 'Atelier Culinaire',
    categoryEmoji: '🍳',
    hostId: 'user-marcus',
    hostName: 'Chef Marcus Sterling',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    hostRole: 'Pitmaster & Champion Caribéen de Grill',
    hostBio: 'Gardien de la méthode ancestrale marron de fumage. Élu meilleur Jerk de Jamaïque pendant 3 années consécutives.',
    hostRating: 5.0,
    reviewsCount: 52,
    pricePerPerson: 75,
    commissionRate: 0.30,
    hostNetPerPerson: 52.5,
    platformFeePerPerson: 22.5,
    country: 'Jamaïque',
    countryFlag: '🇯🇲',
    city: 'Ocho Rios',
    locationAddress: 'Smokey Ridge Terrace, White River Valley',
    meetingPoint: 'Entrée des cascades de White River',
    durationMinutes: 210,
    durationDisplay: '3h30',
    maxGuests: 6,
    bookedGuestsCount: 4,
    availableDates: ['Mardi 6 Octobre - 11h00', 'Dimanche 11 Octobre - 11h00', 'Vendredi 16 Octobre - 15h00'],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&auto=format&fit=crop&q=80'
    ],
    includedItems: [
      'Poulet fermier et épices fraîches du terroir',
      'Cocktail de bienvenue jamaïcain Rum Punch',
      'Bananes plantains et pains Festival cuits sur place',
      'Pot de marinade Jerk personnalisée à emporter'
    ],
    language: 'Anglais & Patois jamaïcain'
  },
  {
    id: 'exp-5',
    title: 'Food Tour Historique du Marché Dantokpa & Dégustation Vins de Palme',
    description: 'Explorez le plus grand marché à ciel ouvert d\'Afrique de l\'Ouest. Une aventure sensorielle à la découverte des fromages peuls wagashi dorés, du crabe farci et des vins de palme récoltés au lever du soleil.',
    category: 'market_tour',
    categoryLabel: 'Marché Gourmand & Food Tour',
    categoryEmoji: '🎒',
    hostId: 'user-justine',
    hostName: 'Mémé Justine & Chef Kossi',
    hostAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    hostRole: 'Toque d\'Honneur & Gardienne des Traditions',
    hostBio: 'Justine cuisine depuis plus de 40 ans pour les grandes cérémonies du Golfe de Guinée.',
    hostRating: 4.88,
    reviewsCount: 29,
    pricePerPerson: 40,
    commissionRate: 0.30,
    hostNetPerPerson: 28.0,
    platformFeePerPerson: 12.0,
    country: 'Bénin',
    countryFlag: '🇧🇯',
    city: 'Cotonou',
    locationAddress: 'Lagune de Dantokpa, Quartier Maro-Militaire',
    meetingPoint: 'Place de l\'Étoile Rouge (devant le monument central)',
    durationMinutes: 150,
    durationDisplay: '2h30',
    maxGuests: 10,
    bookedGuestsCount: 3,
    availableDates: ['Jeudi 8 Octobre - 09h00', 'Samedi 17 Octobre - 09h00'],
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80'
    ],
    includedItems: [
      'Balade guidée au cœur des ruelles gourmandes',
      'Dégustations de fromage Wagashi frit et Akassa au poisson',
      'Dégustation de vin de palme frais Sodabi artisanal',
      'Bouteille d\'eau minérale et lingettes rafraîchissantes'
    ],
    language: 'Français & Fon'
  },
  {
    id: 'exp-6',
    title: 'Soirée Braai Gastronomique & Vins de Stellenbosch',
    description: 'Passez une soirée inoubliable autour du feu au cœur des collines viticoles de Franschhoek. Vous dégusterez les pièces de viandes et poissons marinés grillés à la perfection, accompagnés des plus prestigieux crus sud-africains.',
    category: 'wine_tasting',
    categoryLabel: 'Dégustation de Vins & Braai',
    categoryEmoji: '🍷',
    hostId: 'user-tendai',
    hostName: 'Chef Tendai Machel',
    hostAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    hostRole: 'Chef Sommelier & Braai Master',
    hostBio: 'Formé dans les domaines viticoles du Cap, Tendai fusionne la cuisine au feu de bois et la haute sommellerie africaine.',
    hostRating: 4.97,
    reviewsCount: 41,
    pricePerPerson: 110,
    commissionRate: 0.30,
    hostNetPerPerson: 77.0,
    platformFeePerPerson: 33.0,
    country: 'Afrique du Sud',
    countryFlag: '🇿🇦',
    city: 'Le Cap (Franschhoek)',
    locationAddress: 'Estate Vineyard Pavilion, Franschhoek Valley',
    meetingPoint: 'Entrée principale du Pavillon des Vignes',
    durationMinutes: 240,
    durationDisplay: '4h',
    maxGuests: 10,
    bookedGuestsCount: 7,
    availableDates: ['Samedi 10 Octobre - 17h00', 'Samedi 24 Octobre - 17h00'],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&auto=format&fit=crop&q=80'
    ],
    includedItems: [
      'Menu Braai 4 services au barbecue traditionnel',
      'Accords avec 4 vins d\'exception de Franschhoek & Stellenbosch',
      'Dessert traditionnel Malva Pudding au caramel vanillé',
      'Navette retour vers le centre-ville du Cap comprise'
    ],
    language: 'Anglais & Afrikaans'
  }
];


