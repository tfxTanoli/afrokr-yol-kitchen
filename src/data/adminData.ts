import { 
  AdminCalendarEvent, 
  AdminConversation, 
  AdminInternalMessage, 
  PlatformFeatureFlags, 
  User 
} from '../types';
import { CHEF_AVATARS } from './appImages';

export const INITIAL_FEATURE_FLAGS: PlatformFeatureFlags = {
  delivery: true,
  recommended: true,
  masterclasses: true,
  experiences: true,
  stories: true,
  planner: true,
  grocery: true,
  savedRecipes: true,
  driverTips: true,
  pdfInvoices: true,
  foodCamera: true,
  referrals: true,
  tableBooking: true
};

export const INITIAL_ADMIN_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Aïssatou Diallo',
    handle: '@aissatou_admin',
    email: 'admin.diallo@afrodelicious.app',
    avatar: CHEF_AVATARS.fatou,
    role: 'super_admin',
    country: 'Sénégal',
    countryFlag: '🇸🇳',
    bio: 'Super Administrateur de la plateforme Afrodelicious. Gestion de l\'infrastructure, des accès et des partenariats stratégiques.',
    specialties: ['Gouvernance', 'Contrôle Qualité', 'Gestion Flotte'],
    followersCount: 24500,
    followingCount: 120,
    recipesCount: 0,
    isVerified: true
  },
  {
    id: 'user-chef-1',
    name: 'Chef Sekou Touré',
    handle: '@sekou_ivory',
    email: 'sekou.toure@abidjan-taste.ci',
    avatar: CHEF_AVATARS.rodrigue,
    role: 'chef',
    country: 'Côte d\'Ivoire',
    countryFlag: '🇨🇮',
    bio: 'Maître des grillades et sauces braisées ivoiriennes. Ambassadeur du Garba royal et des marinades d\'attiéké.',
    specialties: ['Garba Royal', 'Sauce Graine', 'Alloco'],
    followersCount: 16800,
    followingCount: 310,
    recipesCount: 24,
    isVerified: true
  },
  {
    id: 'user-chef-2',
    name: 'Marie-Line Hoarau',
    handle: '@marieline_kreyol',
    email: 'marieline@reunion-gourmet.re',
    avatar: CHEF_AVATARS.marieline,
    role: 'chef',
    country: 'Réunion',
    countryFlag: '🇷🇪',
    bio: 'Pâtissière & créatrice culinaire réunionnaise. Passionnée des caris traditionnels et rougails marmite.',
    specialties: ['Rougail Saucisses', 'Cari Poulet', 'Bonbons Piment'],
    followersCount: 12400,
    followingCount: 195,
    recipesCount: 19,
    isVerified: true
  },
  {
    id: 'user-vendor-1',
    name: 'Mamadou Kane (Le Baobab Royal)',
    handle: '@baobab_royal_paris',
    email: 'contact@lebaobabroyal.fr',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    role: 'vendor',
    country: 'Sénégal',
    countryFlag: '🇸🇳',
    bio: 'Restaurateur partenaire officiel Paris 18e. Spécialiste gastronomique de l\'Afrique de l\'Ouest.',
    specialties: ['Thiéboudienne', 'Pastels de Thon', 'Jus de Bissap'],
    followersCount: 8900,
    followingCount: 50,
    recipesCount: 8,
    isVerified: true
  },
  {
    id: 'user-vendor-2',
    name: 'Joséphine Baptiste (Bokit Ti Kréyol)',
    handle: '@bokit_tikreyol',
    email: 'commandes@tikreyol-paris.com',
    avatar: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80',
    role: 'vendor',
    country: 'Guadeloupe',
    countryFlag: '🇬🇵',
    bio: 'Boutique & street-food antillaise Paris Est Canal Saint-Martin.',
    specialties: ['Bokits', 'Accras de Morue', 'Sauce Chien'],
    followersCount: 6500,
    followingCount: 40,
    recipesCount: 6,
    isVerified: true
  },
  {
    id: 'user-driver-1',
    name: 'Moussa Traoré',
    handle: '@moussa_express',
    email: 'moussa.traore@driver.afrodelicious.app',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    role: 'driver',
    country: 'Mali',
    countryFlag: '🇲🇱',
    bio: 'Coursier Partenaire Élite · 4.9⭐ · Véhicule Électrique Scooter · 1,420 courses certifiées sans retard.',
    specialties: ['Livraison Express', 'Paris Centre & Nord'],
    followersCount: 420,
    followingCount: 30,
    recipesCount: 0,
    isVerified: true
  },
  {
    id: 'user-driver-2',
    name: 'Kévin Desroses',
    handle: '@kevin_coursier',
    email: 'kevin.desroses@driver.afrodelicious.app',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    role: 'driver',
    country: 'Martinique',
    countryFlag: '🇲🇶',
    bio: 'Livreur Vélo Cargo Isotherme · Spécialiste respect de la chaîne thermique pour repas chauds.',
    specialties: ['Livraison Éco', 'Paris Est & Sud'],
    followersCount: 310,
    followingCount: 25,
    recipesCount: 0,
    isVerified: true
  },
  {
    id: 'user-mod-1',
    name: 'Christian N\'Doye',
    handle: '@christian_mod',
    email: 'moderation@afrodelicious.app',
    avatar: CHEF_AVATARS.marcus,
    role: 'moderator',
    country: 'Cameroun',
    countryFlag: '🇨🇲',
    bio: 'Modérateur de la communauté et vérificateur de conformité des recettes traditionnelles.',
    specialties: ['Modération Contenu', 'Signalements', 'Validation Recettes'],
    followersCount: 3100,
    followingCount: 150,
    recipesCount: 4,
    isVerified: true
  },
  {
    id: 'user-member-1',
    name: 'Clara Dubois',
    handle: '@clara_gourmande',
    email: 'clara.dubois@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'member',
    country: 'France',
    countryFlag: '🇫🇷',
    bio: 'Passionnée de cuisine afro-caribéenne, abonnée au Food Delivery hebdomadaire et aux masterclasses.',
    specialties: ['Dégustation', 'Collection de Recettes'],
    followersCount: 1450,
    followingCount: 420,
    recipesCount: 2,
    isVerified: false
  }
];

export const INITIAL_CALENDAR_EVENTS: AdminCalendarEvent[] = [
  {
    id: 'cal-event-1',
    title: 'Masterclass Live : Secrets du Thiéboudienne Rouge Penda Mbaye',
    type: 'masterclass',
    date: '2026-10-10',
    time: '18:00',
    hostName: 'Chef Fatou Ndiaye',
    hostAvatar: CHEF_AVATARS.fatou,
    location: 'Studio Live Paris & Zoom HD',
    attendeesCount: 48,
    maxCapacity: 60,
    status: 'scheduled',
    price: 29.99,
    notes: 'Ingrédients livrés la veille aux participants inscrits.'
  },
  {
    id: 'cal-event-2',
    title: 'Table d’Hôtes Privée : Dégustation 5 Terroirs & Rhums Arrangés',
    type: 'experience',
    date: '2026-10-12',
    time: '19:30',
    hostName: 'Chef Rodrigue Belfort',
    hostAvatar: CHEF_AVATARS.rodrigue,
    location: 'Loft Culinaire Afrodelicious Paris 11e',
    attendeesCount: 12,
    maxCapacity: 12,
    status: 'scheduled',
    price: 75.00,
    notes: 'Complet. Accord mets et nectars caribéens d\'exception.'
  },
  {
    id: 'cal-event-3',
    title: 'Atelier Cuisine & Street Food : Fabrication Bokits & Sauce Chien',
    type: 'workshop',
    date: '2026-10-15',
    time: '15:00',
    hostName: 'Joséphine Baptiste',
    hostAvatar: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80',
    location: 'Cuisine Partagée Le FoodLab Paris',
    attendeesCount: 18,
    maxCapacity: 25,
    status: 'scheduled',
    price: 45.00,
    notes: 'Pétrissage de la pâte traditionnelle et friture maîtrisée.'
  },
  {
    id: 'cal-event-4',
    title: 'Vague Spéciale de Livraison : Dîner Solidaire & Batch Yassa Royal',
    type: 'delivery_batch',
    date: '2026-10-17',
    time: '19:00',
    hostName: 'Mamadou Kane (Le Baobab)',
    hostAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    location: 'Rayon Paris 18e, 9e, 10e',
    attendeesCount: 95,
    maxCapacity: 120,
    status: 'scheduled',
    price: 22.50,
    notes: 'Pré-commandes groupées avec créneau express 30 min.'
  },
  {
    id: 'cal-event-5',
    title: 'Dégustation Épices Rares & Poivres de Penja du Cameroun',
    type: 'tasting',
    date: '2026-10-22',
    time: '17:30',
    hostName: 'Christian N\'Doye',
    hostAvatar: CHEF_AVATARS.marcus,
    location: 'Showroom Afrodelicious & Diffusion Vidéo',
    attendeesCount: 34,
    maxCapacity: 40,
    status: 'scheduled',
    price: 20.00,
    notes: 'Distribution d\'échantillons et fiches botaniques.'
  }
];

export const INITIAL_ADMIN_CONVERSATIONS: AdminConversation[] = [
  {
    id: 'conv-1',
    contactName: 'Service Client & Commandes Express',
    contactRole: 'support' as any,
    contactAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    category: 'support',
    lastMessage: 'Client #AFRO-2941 a demandé une modification d\'adresse à Paris 10e.',
    lastMessageTime: 'Il y a 5 min',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: 'conv-2',
    contactName: 'Chef Sekou Touré (Partenaire)',
    contactRole: 'chef',
    contactAvatar: CHEF_AVATARS.rodrigue,
    category: 'chefs',
    lastMessage: 'Le menu spécial fête de l\'indépendance est prêt pour validation.',
    lastMessageTime: 'Il y a 22 min',
    unreadCount: 1,
    isOnline: true
  },
  {
    id: 'conv-3',
    contactName: 'Moussa Traoré (Flotte Livreurs)',
    contactRole: 'driver',
    contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    category: 'drivers',
    lastMessage: 'Toutes les livraisons du midi ont été clôturées avec 100% de succès !',
    lastMessageTime: 'Il y a 1h',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: 'conv-4',
    contactName: 'Modération & Équipe Sécurité',
    contactRole: 'moderator',
    contactAvatar: CHEF_AVATARS.fatou,
    category: 'staff',
    lastMessage: '3 nouvelles recettes de chefs soumises et vérifiées conformes aux CGU.',
    lastMessageTime: 'Il y a 3h',
    unreadCount: 0,
    isOnline: true
  }
];

export const INITIAL_ADMIN_MESSAGES: Record<string, AdminInternalMessage[]> = {
  'conv-1': [
    {
      id: 'msg-1-1',
      conversationId: 'conv-1',
      senderId: 'agent-sophie',
      senderName: 'Sophie (Support Client)',
      senderRole: 'admin',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      content: 'Bonjour l\'équipe Admin, nous avons une demande urgente pour la commande #AFRO-2941.',
      timestamp: '14:20',
      isRead: true
    },
    {
      id: 'msg-1-2',
      conversationId: 'conv-1',
      senderId: 'agent-sophie',
      senderName: 'Sophie (Support Client)',
      senderRole: 'admin',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      content: 'Le client souhaite ajuster son étage et a laissé un pourboire de 5€ supplémentaire au livreur.',
      timestamp: '14:22',
      isRead: false
    },
    {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: 'agent-sophie',
      senderName: 'Sophie (Support Client)',
      senderRole: 'admin',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      content: 'Client #AFRO-2941 a demandé une modification d\'adresse à Paris 10e.',
      timestamp: '14:25',
      isRead: false
    }
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      conversationId: 'conv-2',
      senderId: 'user-chef-1',
      senderName: 'Chef Sekou Touré',
      senderRole: 'chef',
      senderAvatar: CHEF_AVATARS.rodrigue,
      content: 'Bonjour Aïssatou, j\'ai terminé la rédaction du programme pour la Masterclass Yassa et Alloco.',
      timestamp: '11:15',
      isRead: true
    },
    {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: 'user-chef-1',
      senderName: 'Chef Sekou Touré',
      senderRole: 'chef',
      senderAvatar: CHEF_AVATARS.rodrigue,
      content: 'Le menu spécial fête de l\'indépendance est prêt pour validation.',
      timestamp: '13:58',
      isRead: false,
      attachmentName: 'Programme_Masterclass_Garba_Sekou.pdf'
    }
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      conversationId: 'conv-3',
      senderId: 'user-driver-1',
      senderName: 'Moussa Traoré',
      senderRole: 'driver',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      content: 'Toutes les livraisons du midi ont été clôturées avec 100% de succès ! Les clients étaient ravis de la rapidité.',
      timestamp: '13:10',
      isRead: true
    }
  ],
  'conv-4': [
    {
      id: 'msg-4-1',
      conversationId: 'conv-4',
      senderId: 'user-mod-1',
      senderName: 'Christian N\'Doye',
      senderRole: 'moderator',
      senderAvatar: CHEF_AVATARS.marcus,
      content: '3 nouvelles recettes de chefs soumises et vérifiées conformes aux CGU. Tout est en ordre pour publication sur le Feed.',
      timestamp: '11:30',
      isRead: true
    }
  ]
};

export interface AdminStatsSnapshot {
  period: string;
  totalRevenue: number;
  commissionsEarned: number;
  deliveryOrdersCount: number;
  averageOrderValue: number;
  activeUsers: number;
  registeredChefs: number;
  recipesCount: number;
  masterclassesEnrolled: number;
  customerSatisfactionPercent: number;
  driverTipsTotal: number;
  salesByTerroir: { terroir: string; percentage: number; revenue: number }[];
  monthlyTrend: { month: string; orders: number; revenue: number; commissions: number }[];
}

export const ADMIN_STATS_DATA: AdminStatsSnapshot = {
  period: 'Octobre 2026',
  totalRevenue: 64850.00,
  commissionsEarned: 7782.00,
  deliveryOrdersCount: 1845,
  averageOrderValue: 35.15,
  activeUsers: 28450,
  registeredChefs: 142,
  recipesCount: 3892,
  masterclassesEnrolled: 1240,
  customerSatisfactionPercent: 98.4,
  driverTipsTotal: 3420.50,
  salesByTerroir: [
    { terroir: 'Afrique de l’Ouest (Sénégal, Côte d\'Ivoire, Mali)', percentage: 42, revenue: 27237 },
    { terroir: 'Antilles & Caraïbes (Guadeloupe, Martinique, Haïti)', percentage: 28, revenue: 18158 },
    { terroir: 'Afrique Centrale (Cameroun, Congo)', percentage: 16, revenue: 10376 },
    { terroir: 'Océan Indien (Réunion, Madagascar)', percentage: 9, revenue: 5836 },
    { terroir: 'Afrique de l’Est (Éthiopie, Kenya)', percentage: 5, revenue: 3243 }
  ],
  monthlyTrend: [
    { month: 'Mai 2026', orders: 1120, revenue: 38200, commissions: 4584 },
    { month: 'Juin 2026', orders: 1340, revenue: 46100, commissions: 5532 },
    { month: 'Juil 2026', orders: 1560, revenue: 53800, commissions: 6456 },
    { month: 'Août 2026', orders: 1490, revenue: 51200, commissions: 6144 },
    { month: 'Sept 2026', orders: 1720, revenue: 59800, commissions: 7176 },
    { month: 'Oct 2026', orders: 1845, revenue: 64850, commissions: 7782 }
  ]
};

// ==========================================
// EXPORT UTILITIES: CSV, JSON, PDF
// ==========================================

export function downloadCsvStats(): void {
  const rows = [
    ['METRIQUE', 'VALEUR', 'UNITE / NOTE'],
    ['Période', ADMIN_STATS_DATA.period, 'Calendrier'],
    ['Chiffre d\'Affaires Total', ADMIN_STATS_DATA.totalRevenue.toFixed(2), 'EUR'],
    ['Commissions de Livraison Prélevées', ADMIN_STATS_DATA.commissionsEarned.toFixed(2), 'EUR'],
    ['Nombre de Commandes de Repas', ADMIN_STATS_DATA.deliveryOrdersCount.toString(), 'Commandes'],
    ['Panier Moyen Client', ADMIN_STATS_DATA.averageOrderValue.toFixed(2), 'EUR'],
    ['Utilisateurs Inscrits', ADMIN_STATS_DATA.activeUsers.toString(), 'Membres'],
    ['Chefs Partenaires Certifiés', ADMIN_STATS_DATA.registeredChefs.toString(), 'Chefs'],
    ['Recettes Publiées', ADMIN_STATS_DATA.recipesCount.toString(), 'Recettes'],
    ['Inscriptions Masterclasses', ADMIN_STATS_DATA.masterclassesEnrolled.toString(), 'Élèves'],
    ['Satisfaction Client', `${ADMIN_STATS_DATA.customerSatisfactionPercent}%`, 'Avis positifs'],
    ['Pourboires Versés aux Coursiers', ADMIN_STATS_DATA.driverTipsTotal.toFixed(2), 'EUR (100% reversé)'],
    [],
    ['REPARTITION PAR TERROIR', 'PART %', 'REVENUS (EUR)'],
    ...ADMIN_STATS_DATA.salesByTerroir.map(t => [t.terroir, `${t.percentage}%`, t.revenue.toFixed(2)]),
    [],
    ['TENDANCE MENSUELLE', 'COMMANDES', 'REVENUS (EUR)', 'COMMISSIONS (EUR)'],
    ...ADMIN_STATS_DATA.monthlyTrend.map(m => [m.month, m.orders.toString(), m.revenue.toFixed(2), m.commissions.toFixed(2)])
  ];

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.map(val => `"${val}"`).join(';')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Extraction_Stats_Afrodelicious_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadJsonStats(): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ADMIN_STATS_DATA, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `Extraction_Stats_Afrodelicious_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
