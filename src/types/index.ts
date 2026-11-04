export type UserRole = 'super_admin' | 'admin' | 'chef' | 'vendor' | 'driver' | 'member' | 'moderator';

export type BadgeTier = 'top_chef' | 'expert_culinaire' | 'cordon_bleu' | 'toque_montante' | 'gourmet_novice';

export interface PlatformFeatureFlags {
  delivery: boolean; // Afrodelicious Delivery Food (commandes & géolocalisation)
  recommended: boolean; // Restaurants Recommandés & Sponsoring Payant
  masterclasses: boolean; // Masterclasses & Formations Chefs
  experiences: boolean; // Expériences Culinaires & Tables d'hôtes
  stories: boolean; // Stories Vidéo en direct
  planner: boolean; // Planificateur de Repas (Meal Planner)
  grocery: boolean; // Liste de Courses Automatique
  savedRecipes: boolean; // Recettes Sauvegardées
  driverTips: boolean; // Pourboires Livreurs (Tips for drivers)
  pdfInvoices: boolean; // Facturation PDF Téléchargeable
  foodCamera: boolean; // Scan Photo IA (Food Camera)
  referrals: boolean; // Programme Parrainage & Gains
  tableBooking: boolean; // Réservation de Tables
}

export interface AdminCalendarEvent {
  id: string;
  title: string;
  type: 'masterclass' | 'tasting' | 'experience' | 'delivery_batch' | 'workshop';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  hostName: string;
  hostAvatar?: string;
  location: string;
  attendeesCount: number;
  maxCapacity: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  price?: number;
  notes?: string;
}

export interface AdminInternalMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachmentName?: string;
}

export interface AdminConversation {
  id: string;
  contactName: string;
  contactRole: UserRole;
  contactAvatar: string;
  category: 'support' | 'chefs' | 'drivers' | 'staff';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface CulinaryBadge {
  id: BadgeTier;
  title: string;
  shortTitle: string;
  iconName: 'crown' | 'award' | 'medal' | 'chef-hat' | 'sparkles' | 'sprout';
  emoji: string;
  description: string;
  minRecipes: number;
  minLikes: number;
  gradientClass: string;
  borderClass: string;
  badgeBgLight: string;
  textColor: string;
  tagColor: string;
  perks: string[];
}

export interface UserCulinaryStats {
  recipesCount: number;
  totalLikesReceived: number;
  currentBadge: CulinaryBadge;
  nextBadge: CulinaryBadge | null;
  recipesProgressPercent: number;
  likesProgressPercent: number;
  overallProgressPercent: number;
  allBadges: {
    badge: CulinaryBadge;
    isUnlocked: boolean;
    recipesCurrent: number;
    likesCurrent: number;
    recipesProgress: number;
    likesProgress: number;
  }[];
}

export interface User {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  role: UserRole;
  country: string;
  countryFlag: string;
  bio: string;
  specialties: string[];
  followersCount: number;
  followingCount: number;
  recipesCount: number;
  isVerified?: boolean;
  isCurrentUser?: boolean;
  phone?: string;
  followingIds?: string[];
  isPlusMember?: boolean;
  subscriptionTier?: 'basic' | 'plus';
  subscriptionRenewalDate?: string;
  shippingAddress?: {
    recipientName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  preferences?: {
    favoriteCuisines?: string[];
    dietaryRestrictions?: string[];
  };
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  aisle: 'Marché Frais & Légumes' | 'Boucherie & Poissons' | 'Épicerie & Épices Afro' | 'Féculents & Racines' | 'Condiments & Huiles' | 'Rayon Frais';
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationMinutes?: number;
  tip?: string;
  mediaType?: 'photo' | 'video' | 'none';
  mediaUrl?: string;
  videoDurationSeconds?: number; // max 30 seconds
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  text: string;
  createdAt: string;
  likesCount: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  authorRole: UserRole;
  country: string;
  countryFlag: string;
  category: 'Plats Traditionnels' | 'Street Food' | 'Desserts & Douceurs' | 'Sauces & Marinades' | 'Boissons & Cocktails' | 'Végétarien & Vegan';
  difficulty: 'Facile' | 'Moyen' | 'Expert';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  imageUrl: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  comments: Comment[];
  heritageStory?: string;
  createdAt: string;
  rating?: number;
  // Backend fields (Supabase)
  slug?: string | null;
  isPublished?: boolean;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl?: string;
  isFreePreview?: boolean;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  chefId: string;
  chefName: string;
  chefAvatar: string;
  chefCountry: string;
  chefTitle: string;
  price: number; // in EUR (0 for free)
  currency: string;
  level: 'Tous niveaux' | 'Intermédiaire' | 'Master Chef';
  durationHours: string;
  rating: number;
  reviewsCount: number;
  thumbnail: string;
  description: string;
  learningOutcomes: string[];
  lessons: Lesson[];
  enrolledStudentsCount: number;
  isEnrolled?: boolean;
  progressPercent?: number;
  category?: 'All' | 'Main courses' | 'Entree' | 'Cuisine' | 'Dishes' | 'Deserts' | 'Baking' | 'Kids' | 'Beverages' | 'Appetizes' | 'Salad' | 'Breakfast' | 'Soups & Stews' | string;
  country?: string;
  countryFlag?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  durationLabel?: string;
  isFree?: boolean;
}

export interface MealSlot {
  recipeId?: string;
  customDish?: string;
  notes?: string;
}

export interface DayPlan {
  dayName: string;
  lunch?: Recipe;
  dinner?: Recipe;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorCountry: string;
  content: string;
  timestamp: string;
  likes: number;
  repliesCount: number;
  recipeRefTitle?: string;
}

export type CommunityInterestCategory =
  | 'street_food'
  | 'traditional'
  | 'healthy_vegan'
  | 'pastry_sweets'
  | 'spices_sauces'
  | 'grills_bbq'
  | 'drinks_cocktails'
  | 'regional_terroirs'
  | 'general';

export interface Community {
  id: string;
  name: string;
  description: string;
  tagline: string;
  coverImage: string;
  membersCount: number;
  region: string;
  interestCategory?: CommunityInterestCategory;
  interestLabel?: string;
  tags?: string[];
  creatorId?: string;
  creatorName?: string;
  creatorAvatar?: string;
  createdAt?: string;
  privacy?: 'public' | 'private';
  isJoined?: boolean;
  posts: CommunityPost[];
}

export type NotificationType = 'like' | 'comment' | 'enrollment' | 'story_reaction' | 'story_reply' | 'system';

export interface InAppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actorName?: string;
  actorAvatar?: string;
  actorHandle?: string;
  targetId?: string; // recipeId or courseId or storyId
  targetTitle?: string;
  targetImage?: string;
  createdAt: string;
  isRead: boolean;
  amountEarned?: number; // for enrollment
}

export interface StorySlide {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  location?: string;
  tagRecipeId?: string;
  tagRecipeTitle?: string;
  tagRecipeImage?: string;
  sticker?: {
    type: 'poll' | 'tip' | 'question' | 'reaction';
    question?: string;
    options?: { label: string; votes: number }[];
    tipTitle?: string;
    tipContent?: string;
    userVote?: number;
  };
  likesCount: number;
  isLiked?: boolean;
  durationSeconds: number;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  userRole: UserRole;
  userCountry?: string;
  userCountryFlag?: string;
  isVerified?: boolean;
  isCurrentUser?: boolean;
  createdAt: string;
  isViewed: boolean;
  slides: StorySlide[];
}

export type ExperienceCategory = 'cooking_workshop' | 'wine_tasting' | 'market_tour';

export interface ExperienceBooking {
  id: string;
  experienceId: string;
  experienceTitle: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  ticketsCount: number;
  pricePerPerson: number;
  totalPricePaid: number;
  platformCommission: number; // 30%
  hostNetEarnings: number; // 70%
  date: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
}

export interface CulinaryExperience {
  id: string;
  title: string;
  description: string;
  category: ExperienceCategory; // 'cooking_workshop' | 'wine_tasting' | 'market_tour'
  categoryLabel: string;
  categoryEmoji: string;
  
  // Host details
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostRole: string;
  hostBio: string;
  hostRating: number;
  reviewsCount: number;
  
  // Pricing & 30% Commission
  pricePerPerson: number;
  commissionRate: number; // 0.30
  hostNetPerPerson: number; // pricePerPerson * 0.70
  platformFeePerPerson: number; // pricePerPerson * 0.30
  
  // Location
  country: string;
  countryFlag: string;
  city: string;
  locationAddress: string;
  meetingPoint: string;
  
  // Logistics
  durationMinutes: number;
  durationDisplay: string; // e.g. "3h30"
  maxGuests: number;
  bookedGuestsCount: number;
  availableDates: string[];
  
  // Media & Perks
  imageUrl: string;
  galleryImages: string[];
  includedItems: string[];
  language: string;
  isFeatured?: boolean;
}

