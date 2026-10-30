import { CHEF_AVATARS, RECIPE_DISH_IMAGES } from './appImages';

export interface DishCustomization {
  id: string;
  name: string;
  options: { name: string; extraPrice: number }[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  spicyLevel?: number;
  isPopular?: boolean;
  isAvailable: boolean;
  customizations?: DishCustomization[];
}

export interface RestaurantStore {
  id: string;
  name: string;
  type: 'restaurant' | 'store';
  cuisine: string;
  rating: number;
  reviewsCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  minOrder: number;
  address: string;
  city: string;
  country: string;
  countryFlag: string;
  lat: number;
  lng: number;
  phone: string;
  coverImage: string;
  logo: string;
  promoBadge?: string;
  isOpen: boolean;
  menu: MenuItem[];
  // Delivery perimeter & polygon
  deliveryPolygon?: { lat: number; lng: number }[];
  deliveryZoneName?: string;
  deliveryRadiusKm?: number;
  // Delivery Commission & Platform Fees
  deliveryCommissionRate?: number; // e.g. 0.12 for 12%
  deliveryCommissionFixed?: number; // e.g. 1.20 € fixed platform commission
  freeDeliveryThreshold?: number; // e.g. 35 €
  // User Recommendations & Paid Sponsorship
  isRecommended?: boolean;
  recommendationCount?: number;
  hasPaidSponsorship?: boolean;
  sponsorshipPlan?: 'starter' | 'pro' | 'prestige';
  sponsorshipExpiresAt?: string;
  communityReviews?: { userName: string; comment: string; rating: number; date: string }[];
}

export interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  vehicle: 'Scooter' | 'Vélo électrique' | 'Moto' | 'Voiture';
  rating: number;
  totalDeliveries: number;
  isOnline: boolean;
  lat: number;
  lng: number;
  assignedOrderId?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  city: string;
  baseFee: number;
  estMinutes: number;
  isActive: boolean;
  center: { lat: number; lng: number };
  radius: number; // radius in meters
  color: string;
}

export interface CouponCode {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrder: number;
  description: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'in_kitchen' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface CartItem {
  dish: MenuItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  selectedOptions?: string[];
  itemTotal: number;
}

export interface DeliveryOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLatLng: { lat: number; lng: number };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  platformCommissionFee?: number; // Frais de commission de livraison plateforme Afrodelicious
  driverPayout?: number; // Rémunération nette livreur
  restaurantPayout?: number; // Rémunération nette restaurateur
  driverTip?: number; // Pourboire versé au livreur
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryMinutes: number;
  driver?: DeliveryDriver;
  paymentMethod: 'card' | 'mobile_money' | 'apple_pay' | 'cash';
  paymentStatus: 'paid' | 'pending';
  couponCodeApplied?: string;
  rating?: number;
  review?: string;
  deliveryCompletedAt?: string;
  cancellationReason?: string;
}

export interface TableBooking {
  id: string;
  restaurantId: string;
  restaurantName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  guestsCount: number;
  date: string;
  time: string;
  notes?: string;
  status: 'confirmed' | 'pending';
}

export const INITIAL_RESTAURANTS: RestaurantStore[] = [
  {
    id: 'rest-1',
    name: 'Le Baobab Royal',
    type: 'restaurant',
    cuisine: 'Sénégalaise & Ouest-Africaine',
    rating: 4.9,
    reviewsCount: 342,
    deliveryTimeMin: 25,
    deliveryTimeMax: 40,
    deliveryFee: 2.50,
    minOrder: 15,
    address: '28 Rue de la Fraternité',
    city: 'Paris 18e / Île-de-France',
    country: 'Sénégal',
    countryFlag: '🇸🇳',
    lat: 48.891,
    lng: 2.348,
    phone: '+33 1 42 55 98 12',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80',
    promoBadge: '-15% dès 25€ avec AFRO15',
    isOpen: true,
    deliveryZoneName: 'Zone Paris Nord & 18e/9e/10e (Périmètre Certifié)',
    deliveryRadiusKm: 3.8,
    deliveryCommissionRate: 0.12, // 12% commission livraison plateforme
    deliveryCommissionFixed: 1.20, // 1.20 € frais fixes commission
    freeDeliveryThreshold: 35,
    isRecommended: true,
    recommendationCount: 438,
    hasPaidSponsorship: true,
    sponsorshipPlan: 'pro',
    sponsorshipExpiresAt: '2026-12-31',
    communityReviews: [
      { userName: 'Amina Ndiaye', comment: 'Le Thiéboudienne le plus authentique de Paris ! Portions ultra généreuses et rof au piment vert incroyable.', rating: 5, date: 'Hier' },
      { userName: 'Marc-André G.', comment: 'Mafé d’agneau fondant comme à Dakar, livraison rapide et soignée.', rating: 5, date: 'Il y a 3 jours' }
    ],
    deliveryPolygon: [
      { lat: 48.908, lng: 2.332 },
      { lat: 48.904, lng: 2.365 },
      { lat: 48.889, lng: 2.378 },
      { lat: 48.874, lng: 2.362 },
      { lat: 48.876, lng: 2.330 },
      { lat: 48.895, lng: 2.324 }
    ],
    menu: [
      {
        id: 'dish-1',
        name: 'Thiéboudienne Penda Mbaye Royal',
        description: 'Riz rouge cuisiné au mérou frais, légumes du soleil (manioc, chou, carotte), piment antillais et sauce nététou.',
        price: 16.50,
        imageUrl: RECIPE_DISH_IMAGES.thieboudienne,
        category: 'Plats Phares',
        spicyLevel: 2,
        isPopular: true,
        isAvailable: true,
        customizations: [
          {
            id: 'c1',
            name: 'Choix du poisson / viande',
            options: [
              { name: 'Mérou Blanc Frais (Traditionnel)', extraPrice: 0 },
              { name: 'Dorade Royale Entière', extraPrice: 2.50 },
              { name: 'Poulet Fermier Grillé', extraPrice: 0 }
            ]
          },
          {
            id: 'c2',
            name: 'Extra Terroir',
            options: [
              { name: 'Supplément Alloco Croustillant', extraPrice: 3.50 },
              { name: 'Piment Scotch Bonnet Frais', extraPrice: 0.50 }
            ]
          }
        ]
      },
      {
        id: 'dish-2',
        name: 'Mafé d’Agneau Fondant aux Arachides',
        description: 'Mijoté onctueux d’agneau braisé dans une sauce aux arachides grillées, servi avec riz blanc parfumé.',
        price: 15.00,
        imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
        category: 'Plats Phares',
        spicyLevel: 1,
        isPopular: true,
        isAvailable: true
      },
      {
        id: 'dish-3',
        name: 'Alloco & Sauce Piment Tomate',
        description: 'Bananes plantains frites dorées, servies avec un dip pimenté aux oignons rissolés.',
        price: 5.50,
        imageUrl: RECIPE_DISH_IMAGES.allocoIvoirien,
        category: 'Entrées & Accompagnements',
        spicyLevel: 2,
        isAvailable: true
      },
      {
        id: 'dish-4',
        name: 'Jus de Bissap Maison à la Menthe',
        description: 'Infusion de fleurs d’hibiscus bio fraîches, menthe sauvage et pointe de vanille bourbon.',
        price: 3.50,
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
        category: 'Boissons Artisanales',
        spicyLevel: 0,
        isAvailable: true
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'Bokit & Ti Kréyol Paradise',
    type: 'restaurant',
    cuisine: 'Créole & Antillaise',
    rating: 4.8,
    reviewsCount: 289,
    deliveryTimeMin: 20,
    deliveryTimeMax: 35,
    deliveryFee: 1.99,
    minOrder: 12,
    address: '14 Boulevard des Îles',
    city: 'Paris 10e',
    country: 'Guadeloupe',
    countryFlag: '🇬🇵',
    lat: 48.872,
    lng: 2.361,
    phone: '+33 1 48 03 44 20',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=150&q=80',
    promoBadge: 'Livraison Gratuite avec FREESHIP',
    isOpen: true,
    deliveryZoneName: 'Zone Paris Est & Canal Saint-Martin (10e/11e/3e)',
    deliveryRadiusKm: 3.2,
    deliveryCommissionRate: 0.12, // 12% commission plateforme
    deliveryCommissionFixed: 0.99, // 0.99 € commission fixe
    freeDeliveryThreshold: 30,
    isRecommended: true,
    recommendationCount: 312,
    hasPaidSponsorship: true,
    sponsorshipPlan: 'pro',
    sponsorshipExpiresAt: '2026-11-30',
    communityReviews: [
      { userName: 'Rodrigue Belfort', comment: 'Le bokit est doré comme en Guadeloupe, pâte croustillante et chiktay de morue bien relevé !', rating: 5, date: 'Hier' }
    ],
    deliveryPolygon: [
      { lat: 48.885, lng: 2.350 },
      { lat: 48.880, lng: 2.385 },
      { lat: 48.862, lng: 2.390 },
      { lat: 48.858, lng: 2.355 },
      { lat: 48.868, lng: 2.340 }
    ],
    menu: [
      {
        id: 'dish-5',
        name: 'Bokit Morue & Sauce Chien Authentique',
        description: 'Pain antillais frit croustillant garni de chiktay de morue marinée, cive, ail et piment doux.',
        price: 8.50,
        imageUrl: RECIPE_DISH_IMAGES.bokitGuadeloupe,
        category: 'Bokits Traditionnels',
        spicyLevel: 2,
        isPopular: true,
        isAvailable: true
      },
      {
        id: 'dish-6',
        name: 'Colombo de Cabri aux Épices Douces',
        description: 'Viande de cabri marinée et mijotée aux graines à roussir, massalé antillais, aubergines et pommes de terre.',
        price: 17.00,
        imageUrl: RECIPE_DISH_IMAGES.colomboCabri,
        category: 'Plats Phares',
        spicyLevel: 1,
        isPopular: true,
        isAvailable: true
      },
      {
        id: 'dish-7',
        name: 'Accras de Morue Dorés (8 pcs)',
        description: 'Beignets croustillants traditionnels à la morue séchée et herbes créoles, sauce tartare épicée.',
        price: 6.90,
        imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
        category: 'Entrées & Accompagnements',
        spicyLevel: 1,
        isAvailable: true
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Kingston Jerk Shack',
    type: 'restaurant',
    cuisine: 'Jamaïquaine & Caribéenne',
    rating: 4.9,
    reviewsCount: 410,
    deliveryTimeMin: 30,
    deliveryTimeMax: 45,
    deliveryFee: 2.99,
    minOrder: 15,
    address: '9 Rue Bob Marley',
    city: 'Paris 11e',
    country: 'Jamaïque',
    countryFlag: '🇯🇲',
    lat: 48.855,
    lng: 2.378,
    phone: '+33 1 43 71 88 09',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=150&q=80',
    promoBadge: 'Plat signature Jerk à tester absolument',
    isOpen: true,
    deliveryZoneName: 'Zone Paris 11e/12e & Nation (Périmètre Certifié)',
    deliveryRadiusKm: 3.5,
    deliveryCommissionRate: 0.10, // 10% commission plateforme
    deliveryCommissionFixed: 1.50, // 1.50 € commission fixe
    freeDeliveryThreshold: 40,
    isRecommended: true,
    recommendationCount: 276,
    hasPaidSponsorship: true,
    sponsorshipPlan: 'starter',
    sponsorshipExpiresAt: '2026-10-30',
    communityReviews: [
      { userName: 'Chef Marcus', comment: 'Le jerk chicken est fumé comme à Kingston, vrai goût pimenté et riz aux haricots rouges parfait.', rating: 5, date: 'Il y a 5 jours' }
    ],
    deliveryPolygon: [
      { lat: 48.868, lng: 2.365 },
      { lat: 48.865, lng: 2.400 },
      { lat: 48.845, lng: 2.405 },
      { lat: 48.842, lng: 2.360 },
      { lat: 48.855, lng: 2.350 }
    ],
    menu: [
      {
        id: 'dish-8',
        name: 'Authentic Jerk Chicken Smokehouse',
        description: 'Poulet fumé au bois de pimentier jamaïquain, mariné 24h au piment Scotch bonnet et bois d’inde.',
        price: 15.50,
        imageUrl: RECIPE_DISH_IMAGES.jerkChicken,
        category: 'Plats Phares',
        spicyLevel: 3,
        isPopular: true,
        isAvailable: true
      },
      {
        id: 'dish-9',
        name: 'Oxtail Stew & Rice and Peas',
        description: 'Queue de bœuf mijotée des heures dans un jus riche aux haricots rouges et lait de coco crémeux.',
        price: 18.00,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        category: 'Plats Phares',
        spicyLevel: 1,
        isPopular: true,
        isAvailable: true
      },
      {
        id: 'dish-10',
        name: 'Patties Jamaïcains Bœuf Épicé (2 pcs)',
        description: 'Chaussons dorés à pâte feuilletée curcuma garnis de bœuf haché parfumé.',
        price: 6.00,
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
        category: 'Entrées & Accompagnements',
        spicyLevel: 2,
        isAvailable: true
      }
    ]
  },
  {
    id: 'rest-4',
    name: 'Épicerie Afro-Exotique Terroirs d’Or',
    type: 'store',
    cuisine: 'Épicerie, Épices & Produits Frais',
    rating: 4.7,
    reviewsCount: 156,
    deliveryTimeMin: 35,
    deliveryTimeMax: 50,
    deliveryFee: 3.50,
    minOrder: 20,
    address: '45 Rue de la Goutte d’Or',
    city: 'Paris 18e',
    country: 'Multi-terroirs',
    countryFlag: '🌍',
    lat: 48.887,
    lng: 2.353,
    phone: '+33 1 46 06 77 33',
    coverImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
    promoBadge: 'Boutique du Terroir · Ingrédients Rares',
    isOpen: true,
    deliveryZoneName: 'Zone Terroir Goutte d’Or & Barbès (Périmètre Certifié)',
    deliveryRadiusKm: 2.8,
    deliveryCommissionRate: 0.08, // 8% commission épicerie
    deliveryCommissionFixed: 0.80, // 0.80 € commission fixe
    freeDeliveryThreshold: 45,
    isRecommended: false,
    recommendationCount: 94,
    hasPaidSponsorship: false, // Inactive sponsorship - needs to pay to appear in Recommended!
    communityReviews: [
      { userName: 'Marie-Line G.', comment: 'Très bonne sélection d’attiéké frais et d’huile de palme pure rouge.', rating: 4, date: 'Il y a 1 semaine' }
    ],
    deliveryPolygon: [
      { lat: 48.898, lng: 2.345 },
      { lat: 48.895, lng: 2.365 },
      { lat: 48.880, lng: 2.368 },
      { lat: 48.878, lng: 2.342 }
    ],
    menu: [
      {
        id: 'store-1',
        name: 'Huile de Palme Rouge Pure Non Raffinée (1L)',
        description: 'Origine Côte d’Ivoire, première pression à froid, riche en caroténoïdes naturels.',
        price: 6.80,
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
        category: 'Huiles & Condiments',
        isPopular: true,
        isAvailable: true
      },
      {
        id: 'store-2',
        name: 'Attiéké Frais de Grand-Bassam (500g)',
        description: 'Semoule de manioc fermentée sous vide, prête à être réchauffée à la vapeur.',
        price: 3.90,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        category: 'Féculents & Racines',
        isPopular: true,
        isAvailable: true
      },
      {
        id: 'store-3',
        name: 'Bananes Plantains Mûres Extra (Botte de 5)',
        description: 'Plantains mûrs à point pour un alloco fondant et sucré.',
        price: 4.50,
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
        category: 'Fruits & Légumes Frais',
        isAvailable: true
      }
    ]
  }
];

export const INITIAL_DRIVERS: DeliveryDriver[] = [
  {
    id: 'driver-1',
    name: 'Moussa Diop',
    phone: '+33 6 12 34 56 78',
    avatar: CHEF_AVATARS.driverMoussa,
    vehicle: 'Scooter',
    rating: 4.9,
    totalDeliveries: 1240,
    isOnline: true,
    lat: 48.882,
    lng: 2.355
  },
  {
    id: 'driver-2',
    name: 'Koffi Jean-Luc',
    phone: '+33 6 98 76 54 32',
    avatar: CHEF_AVATARS.driverKoffi,
    vehicle: 'Vélo électrique',
    rating: 4.8,
    totalDeliveries: 890,
    isOnline: true,
    lat: 48.875,
    lng: 2.358
  },
  {
    id: 'driver-3',
    name: 'Sarah Benali',
    phone: '+33 6 45 67 89 01',
    avatar: CHEF_AVATARS.driverSarah,
    vehicle: 'Moto',
    rating: 4.95,
    totalDeliveries: 1650,
    isOnline: true,
    lat: 48.865,
    lng: 2.370
  }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  { 
    id: 'zone-1', 
    name: 'Paris Nord & Centre (1er, 2e, 9e, 10e, 18e)', 
    city: 'Paris', 
    baseFee: 2.50, 
    estMinutes: 25, 
    isActive: true,
    center: { lat: 48.883, lng: 2.348 },
    radius: 3000,
    color: '#FF4E27'
  },
  { 
    id: 'zone-2', 
    name: 'Paris Est (11e, 12e, 19e, 20e)', 
    city: 'Paris', 
    baseFee: 2.99, 
    estMinutes: 30, 
    isActive: true,
    center: { lat: 48.860, lng: 2.385 },
    radius: 3200,
    color: '#10B981'
  },
  { 
    id: 'zone-3', 
    name: 'Petite Couronne Nord (Saint-Denis, Pantin, Aubervilliers)', 
    city: 'Île-de-France', 
    baseFee: 3.99, 
    estMinutes: 40, 
    isActive: true,
    center: { lat: 48.918, lng: 2.365 },
    radius: 4000,
    color: '#F59E0B'
  },
  { 
    id: 'zone-4', 
    name: 'Dakar Centre & Plateau', 
    city: 'Dakar', 
    baseFee: 1500, 
    estMinutes: 30, 
    isActive: true,
    center: { lat: 14.693, lng: -17.444 },
    radius: 4500,
    color: '#3B82F6'
  },
  { 
    id: 'zone-5', 
    name: 'Abidjan Cocody & Plateau', 
    city: 'Abidjan', 
    baseFee: 1500, 
    estMinutes: 35, 
    isActive: true,
    center: { lat: 5.348, lng: -4.015 },
    radius: 5000,
    color: '#8B5CF6'
  }
];

export const INITIAL_COUPONS: CouponCode[] = [
  { code: 'AFRO15', discountPercent: 15, minOrder: 25, description: '-15% sur toute la commande dès 25€' },
  { code: 'FREESHIP', discountAmount: 2.99, minOrder: 15, description: 'Frais de livraison offerts dès 15€' },
  { code: 'TIKREYOL', discountAmount: 5.00, minOrder: 30, description: '5€ de réduction immédiate dès 30€' }
];

export const INITIAL_ORDERS: DeliveryOrder[] = [
  {
    id: 'AFRO-9021',
    restaurantId: 'rest-1',
    restaurantName: 'Le Baobab Royal',
    customerName: 'Amina Ndiaye',
    customerPhone: '+33 6 44 22 11 00',
    customerAddress: '18 Rue Custine, 75018 Paris',
    customerLatLng: { lat: 48.889, lng: 2.349 },
    items: [
      {
        dish: INITIAL_RESTAURANTS[0].menu[0],
        restaurantId: 'rest-1',
        restaurantName: 'Le Baobab Royal',
        quantity: 2,
        itemTotal: 33.00
      },
      {
        dish: INITIAL_RESTAURANTS[0].menu[2],
        restaurantId: 'rest-1',
        restaurantName: 'Le Baobab Royal',
        quantity: 1,
        itemTotal: 5.50
      }
    ],
    subtotal: 38.50,
    deliveryFee: 2.50,
    platformCommissionFee: 1.20,
    driverPayout: 2.10,
    restaurantPayout: 32.50,
    driverTip: 2.00,
    discount: 5.77,
    total: 38.43,
    status: 'out_for_delivery',
    createdAt: 'Aujourd\'hui à 19:35',
    estimatedDeliveryMinutes: 12,
    driver: INITIAL_DRIVERS[0],
    paymentMethod: 'card',
    paymentStatus: 'paid',
    couponCodeApplied: 'AFRO15'
  },
  {
    id: 'AFRO-8842',
    restaurantId: 'rest-2',
    restaurantName: 'Bokit & Ti Kréyol Paradise',
    customerName: 'Amina Ndiaye',
    customerPhone: '+33 6 44 22 11 00',
    customerAddress: '18 Rue Custine, 75018 Paris',
    customerLatLng: { lat: 48.889, lng: 2.349 },
    items: [
      {
        dish: INITIAL_RESTAURANTS[1].menu[0],
        restaurantId: 'rest-2',
        restaurantName: 'Bokit & Ti Kréyol Paradise',
        quantity: 2,
        itemTotal: 17.00
      },
      {
        dish: INITIAL_RESTAURANTS[1].menu[1],
        restaurantId: 'rest-2',
        restaurantName: 'Bokit & Ti Kréyol Paradise',
        quantity: 1,
        itemTotal: 17.00
      },
      {
        dish: INITIAL_RESTAURANTS[1].menu[2],
        restaurantId: 'rest-2',
        restaurantName: 'Bokit & Ti Kréyol Paradise',
        quantity: 1,
        itemTotal: 6.90
      }
    ],
    subtotal: 40.90,
    deliveryFee: 1.99,
    platformCommissionFee: 0.99,
    driverPayout: 2.80,
    restaurantPayout: 36.00,
    driverTip: 3.00,
    discount: 0,
    total: 46.88,
    status: 'delivered',
    createdAt: 'Hier à 20:15',
    deliveryCompletedAt: 'Hier à 20:47',
    estimatedDeliveryMinutes: 0,
    driver: INITIAL_DRIVERS[1],
    paymentMethod: 'apple_pay',
    paymentStatus: 'paid',
    rating: 5,
    review: 'Bokit chaud et croustillant, livreur très courtois et ponctuel !'
  },
  {
    id: 'AFRO-8104',
    restaurantId: 'rest-3',
    restaurantName: 'Kingston Jerk Shack',
    customerName: 'Amina Ndiaye',
    customerPhone: '+33 6 44 22 11 00',
    customerAddress: '18 Rue Custine, 75018 Paris',
    customerLatLng: { lat: 48.889, lng: 2.349 },
    items: [
      {
        dish: INITIAL_RESTAURANTS[2].menu[0],
        restaurantId: 'rest-3',
        restaurantName: 'Kingston Jerk Shack',
        quantity: 1,
        itemTotal: 15.50
      },
      {
        dish: INITIAL_RESTAURANTS[2].menu[2],
        restaurantId: 'rest-3',
        restaurantName: 'Kingston Jerk Shack',
        quantity: 2,
        itemTotal: 12.00
      }
    ],
    subtotal: 27.50,
    deliveryFee: 2.99,
    platformCommissionFee: 1.50,
    driverPayout: 0,
    restaurantPayout: 0,
    driverTip: 0,
    discount: 0,
    total: 31.99,
    status: 'cancelled',
    createdAt: 'Il y a 3 jours à 21:10',
    estimatedDeliveryMinutes: 0,
    paymentMethod: 'card',
    paymentStatus: 'pending',
    cancellationReason: 'Rupture de stock sur le poulet fumé bois de pimentier jamaïquain (commande intégralement remboursée).'
  }
];
