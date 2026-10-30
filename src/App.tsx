import React, { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_CURRENT_USER,
  INITIAL_COURSES,
  INITIAL_COMMUNITIES, 
  INITIAL_MEAL_PLAN,
  INITIAL_NOTIFICATIONS,
  INITIAL_STORIES,
  INITIAL_EXPERIENCES
} from './data/initialData';
import { Recipe, Course, Community, DayPlan, User, InAppNotification, NotificationType, Story, StorySlide, CulinaryExperience, ExperienceBooking } from './types';
import { CHEF_AVATARS } from './data/appImages';

// Components
import { Navbar } from './components/Navbar';
import { FeedView } from './components/FeedView';
import { ExploreView } from './components/ExploreView';
import { MasterclassesView } from './components/MasterclassesView';
import { ExperiencesView } from './components/ExperiencesView';
import { MealPlannerView } from './components/MealPlannerView';
import { CommunitiesView } from './components/CommunitiesView';
import { ChefDashboard } from './components/ChefDashboard';
import { SamsungFoodFab } from './components/SamsungFoodFab';
import { DeliveryFoodView } from './components/DeliveryFoodView';
import { RecommendedRestaurantsView } from './components/RecommendedRestaurantsView';
import { INITIAL_RESTAURANTS, INITIAL_ORDERS, RestaurantStore, DeliveryOrder } from './data/deliveryData';
import { RecipeModal } from './components/RecipeModal';
import { CreateRecipeModal } from './components/CreateRecipeModal';
import { ImportUrlModal } from './components/ImportUrlModal';
import { FoodCameraModal } from './components/FoodCameraModal';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { ProfileModal } from './components/ProfileModal';
import { SavedRecipesModal } from './components/SavedRecipesModal';
import { NotificationsModal } from './components/NotificationsModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { StoryCreatorModal } from './components/StoryCreatorModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { ShoppingListView } from './components/ShoppingListView';
import { ShareModal, ShareableItem } from './components/ShareModal';
import { AfrodeliciousLogo } from './components/AfrodeliciousLogo';
import { SupportedLanguage } from './i18n/translations';
import { PlatformFeatureFlags } from './types';
import { FEATURE_FLAG_DEFAULTS, FEATURE_FLAG_LABELS, fetchFeatureFlags, setAllFeatureFlags, setFeatureFlag } from './services/featureFlagService';
import { Heart, MessageSquare, GraduationCap, X, ArrowRight, DollarSign, Crown, Award, Camera, Sparkles, Bookmark as BookmarkIcon, Utensils, Truck, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { profileToUser, ProfileUpdate } from './services/profileService';
import { createRecipe, deleteRecipe, fetchRecipes, RecipeInput, setRecipePublished, updateRecipe } from './services/recipeService';
import { toUserMessage } from './lib/supabase';

// Tabs that belong to a module an administrator can switch off (feature_flags)
const TAB_FLAGS: Partial<Record<string, keyof PlatformFeatureFlags>> = {
  delivery: 'delivery',
  recommended: 'recommended',
  experiences: 'experiences',
  masterclasses: 'masterclasses',
  saved: 'savedRecipes',
  planner: 'planner',
  list: 'grocery'
};

const FOOTER_LINKS: { tab: string; label: string; className?: string }[] = [
  { tab: 'feed', label: 'Homepage & Stories' },
  { tab: 'explore', label: 'Explore' },
  { tab: 'delivery', label: 'Delivery Food' },
  { tab: 'recommended', label: '⭐ Restaurants Recommandés', className: 'text-amber-600 font-bold' },
  { tab: 'experiences', label: 'Expériences' },
  { tab: 'masterclasses', label: 'Masterclasses' },
  { tab: 'saved', label: 'Saved' },
  { tab: 'planner', label: 'Planner' },
  { tab: 'list', label: 'List' }
];

export default function App() {
  const { profile, role, isAdmin, signOut, updateProfile } = useAuth();

  // Navigation & Tabs
  // Admins land on their dashboard after login; members land on the feed
  const [activeTab, setActiveTab] = useState<string>(() => (isAdmin ? 'admin' : 'feed'));

  // Route guard: the admin page is never available to non-admins (e.g. after a role change)
  useEffect(() => {
    if (activeTab === 'admin' && !isAdmin) setActiveTab('feed');
  }, [activeTab, isAdmin]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('Tous les pays');

  // Application Data State — the signed-in user comes from the Supabase profile (AuthGate guarantees it is loaded)
  const [currentUser, setCurrentUser] = useState<User>(() => profileToUser(profile!, role ?? 'user'));

  useEffect(() => {
    if (!profile) return;
    const fromDb = profileToUser(profile, role ?? 'user');
    setCurrentUser(prev => ({
      ...prev,
      id: fromDb.id,
      name: fromDb.name,
      handle: fromDb.handle,
      email: fromDb.email,
      avatar: fromDb.avatar,
      role: fromDb.role,
      country: fromDb.country,
      countryFlag: fromDb.countryFlag,
      bio: fromDb.bio,
      specialties: fromDb.specialties,
      isVerified: fromDb.isVerified
    }));
  }, [profile, role]);

  // Persists profile changes (name, bio, specialties…) to the database
  const handleSaveProfile = async (changes: ProfileUpdate) => {
    await updateProfile(changes);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    if (updatedUser.isPlusMember) {
      pushNotification({
        id: `plus-${Date.now()}`,
        type: 'system',
        title: 'Bienvenue dans Afrodelicious+ Plus ⭐',
        message: 'Vos 4 magazines papier annuels, guides PDF saisonniers, suppression des pubs et accès VIP sont activés !',
        actorName: 'Club Afrodelicious+',
        actorAvatar: updatedUser.avatar,
        createdAt: "À l'instant",
        isRead: false
      });
    }
  };

  // Recipes are loaded from Supabase. RLS returns published recipes to users and every recipe to admins.
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [recipesStatus, setRecipesStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [recipesError, setRecipesError] = useState<string | null>(null);

  // Public views only ever show published recipes (admins manage drafts from the dashboard)
  const recipes = allRecipes.filter(r => r.isPublished !== false);
  const setRecipes = (updater: (prev: Recipe[]) => Recipe[]) => setAllRecipes(updater);

  const loadRecipes = useCallback(async () => {
    setRecipesStatus(prev => (prev === 'ready' ? 'ready' : 'loading'));
    setRecipesError(null);
    try {
      const fresh = await fetchRecipes();
      // Keep client-side social state (likes / bookmarks) across reloads
      setAllRecipes(prev => fresh.map(r => {
        const existing = prev.find(p => p.id === r.id);
        return existing
          ? { ...r, isLiked: existing.isLiked, likesCount: existing.likesCount, isBookmarked: existing.isBookmarked, bookmarksCount: existing.bookmarksCount, comments: existing.comments, commentsCount: existing.commentsCount }
          : r;
      }));
      setRecipesStatus('ready');
    } catch (error) {
      setRecipesError(toUserMessage(error, 'Impossible de charger les recettes.'));
      setRecipesStatus('error');
    }
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes, isAdmin]);

  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [mealPlan, setMealPlan] = useState<DayPlan[]>(INITIAL_MEAL_PLAN);
  const [experiences, setExperiences] = useState<CulinaryExperience[]>(INITIAL_EXPERIENCES);
  const [deliveryRestaurants, setDeliveryRestaurants] = useState<RestaurantStore[]>(INITIAL_RESTAURANTS);
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>(INITIAL_ORDERS);
  // Module switches are stored in Supabase (`feature_flags`): everyone reads them, only admins change them
  const [featureFlags, setFeatureFlags] = useState<PlatformFeatureFlags>(FEATURE_FLAG_DEFAULTS);

  const loadFeatureFlags = useCallback(async () => {
    try {
      setFeatureFlags(await fetchFeatureFlags());
    } catch {
      // Keep the current (safe) values; disabled modules stay hidden
    }
  }, []);

  useEffect(() => {
    loadFeatureFlags();
    // Pick up an administrator's changes when the user comes back to the tab
    const onVisible = () => {
      if (document.visibilityState === 'visible') loadFeatureFlags();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [loadFeatureFlags]);

  const handleToggleFeatureFlag = async (featureId: keyof PlatformFeatureFlags, enabled: boolean) => {
    const previous = featureFlags[featureId];
    setFeatureFlags(prev => ({ ...prev, [featureId]: enabled }));
    try {
      await setFeatureFlag(featureId, enabled);
      notifySystem(
        `Module ${enabled ? 'activé' : 'désactivé'} ⚙️`,
        `« ${FEATURE_FLAG_LABELS[featureId]} » est maintenant ${enabled ? 'visible' : 'masqué'} pour tous les utilisateurs.`
      );
    } catch (error) {
      setFeatureFlags(prev => ({ ...prev, [featureId]: previous }));
      notifySystem('Modification impossible', toUserMessage(error, 'Le module n’a pas pu être modifié.'));
      throw error;
    }
  };

  const handleResetFeatureFlags = async () => {
    try {
      await setAllFeatureFlags(true);
      await loadFeatureFlags();
      notifySystem('Tous les modules activés ✓', 'L’ensemble des modules de la plateforme est visible pour tous les utilisateurs.');
    } catch (error) {
      notifySystem('Modification impossible', toUserMessage(error, 'Les modules n’ont pas pu être modifiés.'));
    }
  };

  const isTabEnabled = (tab: string) => {
    const flag = TAB_FLAGS[tab];
    return !flag || featureFlags[flag] !== false;
  };

  // Modals & Drawers
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isCreateRecipeOpen, setIsCreateRecipeOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isImportUrlOpen, setIsImportUrlOpen] = useState(false);
  const [isFoodCameraOpen, setIsFoodCameraOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'profile' | 'feed' | 'orders' | 'referral' | 'following' | 'auth'>('profile');
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('fr');

  // Stories State & Drawers
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);

  // In-App Notifications State
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);
  const [toastNotification, setToastNotification] = useState<InAppNotification | null>(null);

  // Follow & Unfollow Accounts State (with persistence)
  const [followedUserIds, setFollowedUserIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('afrodelicious_followed_users');
      return stored ? JSON.parse(stored) : (INITIAL_CURRENT_USER.followingIds || ['user-rodrigue', 'user-marcus', 'user-aicha']);
    } catch {
      return INITIAL_CURRENT_USER.followingIds || ['user-rodrigue', 'user-marcus', 'user-aicha'];
    }
  });

  // Universal Multi-Channel Share Modal State (WhatsApp, Signal, Socials)
  const [shareModalItem, setShareModalItem] = useState<ShareableItem | null>(null);

  // Auto-launch onboarding for first-time visitors
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem('afrodelicious_has_seen_onboarding_v2');
      if (!hasSeen) {
        setIsOnboardingOpen(true);
      }
    } catch {
      // restricted iframe or storage unavailable
    }
  }, []);

  // Computed
  // Seeded recipes keep their legacy ids as slugs, so stories / meal plans still resolve them
  const activeRecipe = selectedRecipeId
    ? allRecipes.find(r => r.id === selectedRecipeId || r.slug === selectedRecipeId) || null
    : null;
  const bookmarkedRecipesCount = recipes.filter(r => r.isBookmarked).length;
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const playNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio autoplay restrictions or not supported
    }
  };

  const pushNotification = (notif: InAppNotification) => {
    setNotifications(prev => [notif, ...prev]);
    setToastNotification(notif);
    playNotificationSound();
    setTimeout(() => {
      setToastNotification(prev => (prev?.id === notif.id ? null : prev));
    }, 4500);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNavigateToNotificationTarget = (notif: InAppNotification) => {
    setIsNotificationsOpen(false);
    if (notif.targetId) {
      if (notif.type === 'enrollment' || notif.targetId.startsWith('course-')) {
        setActiveTab('masterclasses');
      } else {
        setSelectedRecipeId(notif.targetId);
      }
    }
  };

  const handleSimulateNotification = (type: NotificationType) => {
    if ((type === 'like' || type === 'comment') && recipes.length === 0) return;
    if (type === 'like') {
      const targetRecipe = recipes[0];
      pushNotification({
        id: `sim-like-${Date.now()}`,
        type: 'like',
        title: 'Nouveau coup de cœur sur votre recette !',
        message: 'Kévin Desroses (@kevin_caribbean) a aimé votre recette "' + targetRecipe.title + '".',
        actorName: 'Kévin Desroses',
        actorAvatar: CHEF_AVATARS.marcus,
        actorHandle: '@kevin_caribbean',
        targetId: targetRecipe.id,
        targetTitle: targetRecipe.title,
        targetImage: targetRecipe.imageUrl,
        createdAt: "À l'instant",
        isRead: false
      });
    } else if (type === 'comment') {
      const targetRecipe = recipes[1] || recipes[0];
      pushNotification({
        id: `sim-comment-${Date.now()}`,
        type: 'comment',
        title: 'Nouveau commentaire de Chef reçu !',
        message: 'Chef Rodrigue Belfort : « J\'ai testé avec du piment végétarien et du bois d\'Inde, la liaison est parfaite ! »',
        actorName: 'Chef Rodrigue Belfort',
        actorAvatar: CHEF_AVATARS.rodrigue,
        actorHandle: '@rodrigue_kreyol',
        targetId: targetRecipe.id,
        targetTitle: targetRecipe.title,
        targetImage: targetRecipe.imageUrl,
        createdAt: "À l'instant",
        isRead: false
      });
    } else if (type === 'enrollment') {
      const targetCourse = courses[0];
      const earned = targetCourse.price > 0 ? targetCourse.price * 0.70 : 25.49;
      pushNotification({
        id: `sim-enroll-${Date.now()}`,
        type: 'enrollment',
        title: 'Nouvel élève inscrit à votre Masterclass !',
        message: 'Moussa Traoré vient de s\'inscrire à "' + targetCourse.title + '". Félicitations Cheffe !',
        actorName: 'Moussa Traoré',
        actorAvatar: CHEF_AVATARS.fatou,
        actorHandle: '@moussa_gastronomie',
        targetId: targetCourse.id,
        targetTitle: targetCourse.title,
        targetImage: targetCourse.thumbnail,
        createdAt: "À l'instant",
        isRead: false,
        amountEarned: earned
      });
    }
  };

  // Handlers for Story Broadcasting & Interaction
  const handleOpenStory = (storyId: string) => {
    setActiveStoryId(storyId);
  };

  const handleMarkStoryViewed = (storyId: string) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, isViewed: true } : s));
  };

  const handleStoryCreated = (newStory: Story) => {
    setStories(prev => [newStory, ...prev]);
    pushNotification({
      id: `story-pub-${Date.now()}`,
      type: 'story_reaction',
      title: 'Story culinaire diffusée en direct ! 🎉',
      message: 'Votre story est maintenant visible pendant 24h par toute la communauté.',
      actorName: currentUser.name,
      actorAvatar: currentUser.avatar,
      actorHandle: currentUser.handle,
      targetId: newStory.id,
      targetTitle: newStory.slides[0]?.caption || 'Story',
      targetImage: newStory.slides[0]?.mediaUrl,
      createdAt: "À l'instant",
      isRead: false
    });
  };

  const handleSendStoryReaction = (story: Story, slide: StorySlide, emoji: string) => {
    if (story.userId !== currentUser.id) {
      pushNotification({
        id: `story-react-${Date.now()}`,
        type: 'story_reaction',
        title: `Réaction ${emoji} envoyée !`,
        message: `Vous avez réagi à la story de ${story.userName}.`,
        actorName: currentUser.name,
        actorAvatar: currentUser.avatar,
        actorHandle: currentUser.handle,
        targetId: story.id,
        targetTitle: slide.caption || 'Story',
        targetImage: slide.mediaUrl,
        createdAt: "À l'instant",
        isRead: false
      });
    }
  };

  const handleSendStoryReply = (story: Story, slide: StorySlide, message: string) => {
    pushNotification({
      id: `story-reply-${Date.now()}`,
      type: 'story_reply',
      title: `Message transmis à ${story.userName}`,
      message: `« ${message} »`,
      actorName: currentUser.name,
      actorAvatar: currentUser.avatar,
      actorHandle: currentUser.handle,
      targetId: story.id,
      targetTitle: slide.caption || 'Story',
      targetImage: slide.mediaUrl,
      createdAt: "À l'instant",
      isRead: false
    });
  };

  // Handlers for Social Interactions
  const handleToggleLike = (recipeId: string) => {
    const targetRecipe = recipes.find(r => r.id === recipeId);
    setRecipes(prev => prev.map(r => {
      if (r.id === recipeId) {
        const isLiked = !r.isLiked;
        return {
          ...r,
          isLiked,
          likesCount: isLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1)
        };
      }
      return r;
    }));

    if (targetRecipe && !targetRecipe.isLiked) {
      pushNotification({
        id: `notif-like-${Date.now()}`,
        type: 'like',
        title: 'Coup de cœur enregistré !',
        message: `Vous avez aimé "${targetRecipe.title}". L'auteur (${targetRecipe.authorName}) a été notifié.`,
        actorName: currentUser.name,
        actorAvatar: currentUser.avatar,
        actorHandle: currentUser.handle,
        targetId: targetRecipe.id,
        targetTitle: targetRecipe.title,
        targetImage: targetRecipe.imageUrl,
        createdAt: "À l'instant",
        isRead: false
      });
    }
  };

  // Follow & Unfollow Handler
  const handleToggleFollow = (targetUserId: string, targetUserName?: string) => {
    if (targetUserId === currentUser.id) return;
    setFollowedUserIds(prev => {
      const isCurrentlyFollowing = prev.includes(targetUserId);
      const next = isCurrentlyFollowing
        ? prev.filter(id => id !== targetUserId)
        : [...prev, targetUserId];
      
      try {
        localStorage.setItem('afrodelicious_followed_users', JSON.stringify(next));
      } catch {
        // Fallback for private browsing environments
      }

      const name = targetUserName || 'ce créateur';
      pushNotification({
        id: `follow-${Date.now()}`,
        type: isCurrentlyFollowing ? 'system' : 'like',
        title: isCurrentlyFollowing ? 'Abonnement retiré' : 'Nouvel abonnement culinaire ! ✨',
        message: isCurrentlyFollowing
          ? `Vous ne suivez plus ${name}. Ses publications apparaîtront de manière standard.`
          : `Vous êtes désormais abonné(e) à ${name} ! Vous recevrez ses nouveautés, cours et ateliers.`,
        actorName: name,
        actorAvatar: currentUser.avatar,
        createdAt: "À l'instant",
        isRead: false
      });

      setCurrentUser(userPrev => ({
        ...userPrev,
        followingCount: next.length,
        followingIds: next
      }));

      return next;
    });
  };

  const handleToggleBookmark = (recipeId: string) => {
    setRecipes(prev => prev.map(r => {
      if (r.id === recipeId) {
        const isBookmarked = !r.isBookmarked;
        return {
          ...r,
          isBookmarked,
          bookmarksCount: isBookmarked ? r.bookmarksCount + 1 : Math.max(0, r.bookmarksCount - 1)
        };
      }
      return r;
    }));
  };

  const handleAddComment = (recipeId: string, text: string) => {
    const targetRecipe = recipes.find(r => r.id === recipeId);
    const newComment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userHandle: currentUser.handle,
      text,
      createdAt: "À l'instant",
      likesCount: 0
    };
    setRecipes(prev => prev.map(r => {
      if (r.id === recipeId) {
        return {
          ...r,
          commentsCount: r.commentsCount + 1,
          comments: [newComment, ...r.comments]
        };
      }
      return r;
    }));

    if (targetRecipe) {
      pushNotification({
        id: `notif-comment-${Date.now()}`,
        type: 'comment',
        title: 'Nouveau commentaire publié !',
        message: `${currentUser.name} a commenté : « ${text.slice(0, 75)}${text.length > 75 ? '...' : ''} » sur "${targetRecipe.title}".`,
        actorName: currentUser.name,
        actorAvatar: currentUser.avatar,
        actorHandle: currentUser.handle,
        targetId: targetRecipe.id,
        targetTitle: targetRecipe.title,
        targetImage: targetRecipe.imageUrl,
        createdAt: "À l'instant",
        isRead: false
      });
    }
  };

  // ---- Recipe management (admin only; enforced again by database RLS) ----
  const notifySystem = (title: string, message: string, recipe?: Recipe) => {
    pushNotification({
      id: `sys-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'system',
      title,
      message,
      actorName: 'Afrodelicious',
      actorAvatar: currentUser.avatar,
      targetId: recipe?.isPublished ? recipe.id : undefined,
      targetTitle: recipe?.title,
      targetImage: recipe?.imageUrl,
      createdAt: "À l'instant",
      isRead: false
    });
  };

  const requireAdmin = (): boolean => {
    if (isAdmin) return true;
    notifySystem('Accès réservé aux administrateurs 🔒', 'La création et la gestion des recettes sont réservées aux administrateurs Afrodelicious.');
    return false;
  };

  const openCreateRecipe = () => {
    if (!requireAdmin()) return;
    setEditingRecipe(null);
    setIsCreateRecipeOpen(true);
  };

  const openEditRecipe = (recipe: Recipe) => {
    if (!requireAdmin()) return;
    setEditingRecipe(recipe);
    setIsCreateRecipeOpen(true);
  };

  const openImportUrl = () => {
    if (!requireAdmin()) return;
    setIsImportUrlOpen(true);
  };

  // Merge a freshly saved recipe while keeping the client-side social counters
  const upsertRecipe = (saved: Recipe) => {
    setAllRecipes(prev => {
      const existing = prev.find(r => r.id === saved.id);
      if (!existing) return [saved, ...prev];
      return prev.map(r => r.id === saved.id
        ? { ...saved, isLiked: r.isLiked, likesCount: r.likesCount, isBookmarked: r.isBookmarked, bookmarksCount: r.bookmarksCount, comments: r.comments, commentsCount: r.commentsCount }
        : r);
    });
  };

  // Throws on failure so the form can display the error
  const handleSubmitRecipe = async (input: RecipeInput) => {
    const isEdit = Boolean(editingRecipe);
    const saved = editingRecipe ? await updateRecipe(editingRecipe.id, input) : await createRecipe(input);
    upsertRecipe(saved);
    if (!isEdit && saved.isPublished) setSelectedRecipeId(saved.id);
    notifySystem(
      isEdit ? 'Recette mise à jour ✓' : saved.isPublished ? '✨ Recette publiée !' : 'Brouillon enregistré ✓',
      isEdit
        ? `"${saved.title}" a été enregistrée.`
        : saved.isPublished
          ? `"${saved.title}" est maintenant visible par tous les membres.`
          : `"${saved.title}" est enregistrée en brouillon (non visible par les membres).`,
      saved
    );
  };

  // URL imports are saved as drafts so an administrator can review them before publishing
  const handleRecipeImported = async (imported: Recipe) => {
    if (!requireAdmin()) return;
    try {
      const saved = await createRecipe({
        title: imported.title,
        description: imported.description,
        country: imported.country,
        countryFlag: imported.countryFlag,
        category: imported.category,
        difficulty: imported.difficulty,
        prepTimeMinutes: imported.prepTimeMinutes,
        cookTimeMinutes: imported.cookTimeMinutes,
        servings: imported.servings,
        imageUrl: imported.imageUrl,
        heritageStory: imported.heritageStory || '',
        ingredients: imported.ingredients,
        steps: imported.steps,
        isPublished: false
      });
      upsertRecipe(saved);
      notifySystem('Recette importée en brouillon ✓', `"${saved.title}" est à relire puis publier depuis le Dashboard Admin.`, saved);
    } catch (error) {
      notifySystem('Échec de l’import', toUserMessage(error, 'La recette importée n’a pas pu être enregistrée.'));
    }
  };

  const handleTogglePublishRecipe = async (recipe: Recipe) => {
    const saved = await setRecipePublished(recipe.id, !recipe.isPublished);
    upsertRecipe(saved);
    notifySystem(
      saved.isPublished ? 'Recette publiée ✓' : 'Recette dépubliée',
      saved.isPublished ? `"${saved.title}" est visible par les membres.` : `"${saved.title}" n’est plus visible par les membres.`,
      saved
    );
  };

  const handleDeleteRecipe = async (recipe: Recipe) => {
    await deleteRecipe(recipe.id);
    setAllRecipes(prev => prev.filter(r => r.id !== recipe.id));
    if (selectedRecipeId === recipe.id || selectedRecipeId === recipe.slug) setSelectedRecipeId(null);
    notifySystem('Recette supprimée', `"${recipe.title}" a été définitivement supprimée.`);
  };

  // Add recipe to current meal plan (auto-assign to first free slot)
  const handleAddToMealPlan = (recipe: Recipe) => {
    setMealPlan(prev => {
      const updated = [...prev];
      const targetDay = updated.find(d => !d.lunch || !d.dinner) || updated[0];
      if (!targetDay.lunch) {
        targetDay.lunch = recipe;
      } else {
        targetDay.dinner = recipe;
      }
      return updated;
    });
  };

  // Masterclasses interactions
  const handleEnrollCourse = (courseId: string) => {
    const targetCourse = courses.find(c => c.id === courseId);
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          isEnrolled: true,
          enrolledStudentsCount: c.enrolledStudentsCount + 1,
          progressPercent: c.progressPercent || 15
        };
      }
      return c;
    }));

    if (targetCourse) {
      const earned = targetCourse.price > 0 ? targetCourse.price * 0.70 : 0;
      pushNotification({
        id: `notif-enroll-${Date.now()}`,
        type: 'enrollment',
        title: 'Nouvelle inscription Masterclass !',
        message: `Inscription confirmée pour "${targetCourse.title}". ${earned > 0 ? `+${earned.toFixed(2)} € crédités au Chef (70%).` : 'Accès gratuit accordé.'}`,
        actorName: currentUser.name,
        actorAvatar: currentUser.avatar,
        actorHandle: currentUser.handle,
        targetId: targetCourse.id,
        targetTitle: targetCourse.title,
        targetImage: targetCourse.thumbnail,
        createdAt: "À l'instant",
        isRead: false,
        amountEarned: earned
      });
    }
  };

  const handleAddNewCourse = (newCourse: Course) => {
    setCourses([newCourse, ...courses]);
  };

  // Community interactions
  const handleToggleJoinCommunity = (communityId: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        const isJoined = !c.isJoined;
        return {
          ...c,
          isJoined,
          membersCount: isJoined ? c.membersCount + 1 : Math.max(0, c.membersCount - 1)
        };
      }
      return c;
    }));
  };

  const handleAddCommunityPost = (communityId: string, content: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        const newPost = {
          id: `post-${Date.now()}`,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          authorCountry: `${currentUser.country} ${currentUser.countryFlag}`,
          content,
          timestamp: "À l'instant",
          likes: 1,
          repliesCount: 0
        };
        return {
          ...c,
          posts: [newPost, ...c.posts]
        };
      }
      return c;
    }));
  };

  const handleCreateCommunity = (newCommunity: Community) => {
    setCommunities(prev => [newCommunity, ...prev]);
    pushNotification({
      id: `comm-created-${Date.now()}`,
      type: 'system',
      title: 'Nouveau Cercle Culinaire Créé ! 🎉',
      message: `Votre communauté "${newCommunity.name}" (${newCommunity.interestLabel || 'Cercle Culinaire'}) est officiellement ouverte. Vous en êtes le fondateur !`,
      actorName: currentUser.name,
      actorAvatar: currentUser.avatar,
      createdAt: "À l'instant",
      isRead: false
    });
  };

  const handleBookExperience = (booking: ExperienceBooking) => {
    // Update booked count on experience
    setExperiences(prev => prev.map(exp => {
      if (exp.id === booking.experienceId) {
        return {
          ...exp,
          bookedGuestsCount: exp.bookedGuestsCount + booking.ticketsCount
        };
      }
      return exp;
    }));

    // Trigger confirmation notification
    pushNotification({
      id: `notif-${Date.now()}`,
      type: 'enrollment',
      title: 'Réservation d’Expérience confirmée ! 🎟️',
      message: `Vous êtes inscrit à "${booking.experienceTitle}" pour ${booking.ticketsCount} invité(s). Montant : ${booking.totalPricePaid} € (Commission Afrodelicious 30% : ${booking.platformCommission} €).`,
      actorName: booking.guestName,
      actorAvatar: currentUser.avatar,
      createdAt: 'À l’instant',
      isRead: false,
      amountEarned: booking.hostNetEarnings
    });
  };

  const handleCreateExperience = (newExp: CulinaryExperience) => {
    setExperiences(prev => [newExp, ...prev]);
    pushNotification({
      id: `notif-${Date.now()}`,
      type: 'story_reply',
      title: 'Votre Expérience a été publiée ! ✨',
      message: `"${newExp.title}" est désormais disponible pour les voyageurs du monde entier (${newExp.pricePerPerson} € / invité · 30% comm. incluse).`,
      actorName: 'Afrodelicious Expériences',
      actorAvatar: currentUser.avatar,
      createdAt: 'À l’instant',
      isRead: false
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'docs') {
            setIsDocsOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        currentUser={currentUser}
        recipes={recipes}
        bookmarkedCount={bookmarkedRecipesCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenBookmarks={() => setIsSavedOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={(tab) => {
          setProfileInitialTab(tab || 'profile');
          setIsProfileOpen(true);
        }}
        onOpenCreateStory={featureFlags.stories ? () => setIsCreateStoryOpen(true) : undefined}
        onOpenAdminDashboard={isAdmin ? () => setActiveTab('admin') : undefined}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenCreateRecipe={openCreateRecipe}
        onOpenImportUrl={openImportUrl}
        onOpenScanPhoto={featureFlags.foodCamera ? () => setIsFoodCameraOpen(true) : undefined}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        language={language}
        onSelectLanguage={setLanguage}
        featureFlags={featureFlags}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-24">
        {/* Recipe loading / error / empty states (backend-driven views) */}
        {(activeTab === 'feed' || activeTab === 'explore' || activeTab === 'saved') && recipesStatus !== 'ready' && (
          <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
            {recipesStatus === 'loading' ? (
              <>
                <Loader2 className="w-8 h-8 text-[#FF4E27] animate-spin mx-auto" aria-label="Chargement" />
                <p className="text-xs text-slate-500">Chargement des recettes…</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="font-serif font-black text-xl text-slate-900">{recipesError}</h2>
                <button
                  onClick={loadRecipes}
                  className="px-4 py-2 rounded-xl bg-[#FF4E27] text-white text-xs font-bold hover:bg-[#E03814] inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Réessayer</span>
                </button>
              </>
            )}
          </div>
        )}

        {(activeTab === 'feed' || activeTab === 'explore') && recipesStatus === 'ready' && recipes.length === 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="py-10 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-serif font-black text-lg text-slate-900">Aucune recette publiée pour le moment</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isAdmin
                  ? 'Créez ou publiez une recette depuis le Dashboard Admin pour qu’elle apparaisse ici.'
                  : 'Nos chefs préparent de nouvelles recettes. Revenez très bientôt !'}
              </p>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] text-white text-xs font-bold shadow-md shadow-[#FF4E27]/25"
                >
                  Ouvrir le Dashboard Admin
                </button>
              )}
            </div>
          </div>
        )}

        {['experiences', 'masterclasses', 'saved', 'planner', 'list'].includes(activeTab) && !isTabEnabled(activeTab) && (
          <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-black text-2xl text-slate-900">Module bientôt disponible</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ce module a été mis en pause par l'Administrateur de la plateforme.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setActiveTab('feed')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
              >
                Retour à l'accueil
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-4 py-2 rounded-xl bg-[#FF4E27] text-white text-xs font-bold hover:bg-[#E03814]"
                >
                  Ouvrir l'Admin
                </button>
              )}
            </div>
          </div>
        )}

        {/* Admin dashboard page (only ever rendered for administrators) */}
        {activeTab === 'admin' && isAdmin && (
          <AdminDashboardView
            currentUser={currentUser}
            recipes={allRecipes}
            recipesStatus={recipesStatus}
            onReloadRecipes={loadRecipes}
            onCreateRecipe={openCreateRecipe}
            onEditRecipe={openEditRecipe}
            onPreviewRecipe={(id) => setSelectedRecipeId(id)}
            onTogglePublishRecipe={handleTogglePublishRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            onOpenAdvancedPortal={() => setIsAdminDashboardOpen(true)}
            featureFlags={featureFlags}
            onToggleFeatureFlag={handleToggleFeatureFlag}
          />
        )}

        {activeTab === 'feed' && recipesStatus === 'ready' && (
          <FeedView
            recipes={recipes}
            currentUser={currentUser}
            stories={stories}
            showStories={featureFlags.stories}
            onOpenStory={handleOpenStory}
            onOpenCreateStory={featureFlags.stories ? () => setIsCreateStoryOpen(true) : undefined}
            onSelectRecipe={(id) => setSelectedRecipeId(id)}
            onToggleLike={handleToggleLike}
            onToggleBookmark={handleToggleBookmark}
            onAddToMealPlan={handleAddToMealPlan}
            onFilterCountry={(country) => {
              setCountryFilter(country);
              setActiveTab('explore');
            }}
            onOpenCreateRecipe={openCreateRecipe}
            onOpenImportUrl={openImportUrl}
            onOpenScanPhoto={featureFlags.foodCamera ? () => setIsFoodCameraOpen(true) : undefined}
            followedUserIds={followedUserIds}
            onToggleFollow={handleToggleFollow}
            onOpenShare={(item) => setShareModalItem(item)}
            language={language}
          />
        )}

        {activeTab === 'explore' && recipesStatus === 'ready' && (
          <ExploreView
            recipes={recipes}
            currentUser={currentUser}
            onSelectRecipe={(id) => setSelectedRecipeId(id)}
            onToggleLike={handleToggleLike}
            selectedCountryFilter={countryFilter}
            onClearCountryFilter={() => setCountryFilter('Tous les pays')}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            followedUserIds={followedUserIds}
            onToggleFollow={handleToggleFollow}
            onOpenShare={(item) => setShareModalItem(item)}
          />
        )}

        {/* Tab: Afrodelicious delivery food */}
        {activeTab === 'delivery' && (
          featureFlags.delivery === false ? (
            <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md">
                <Truck className="w-8 h-8" />
              </div>
              <h2 className="font-serif font-black text-2xl text-slate-900">Module Livraison Actuellement Désactivé</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ce service a été désactivé via le panneau de contrôle de l'Administrateur Afrodelicious.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setActiveTab('feed')}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
                >
                  Retour à l'accueil
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="px-4 py-2 rounded-xl bg-[#FF4E27] text-white text-xs font-bold hover:bg-[#E03814]"
                  >
                    Ouvrir l'Admin
                  </button>
                )}
              </div>
            </div>
          ) : (
            <DeliveryFoodView
              currentUser={currentUser}
              onOpenRecipe={(id) => setSelectedRecipeId(id)}
              restaurants={deliveryRestaurants}
              onUpdateRestaurants={setDeliveryRestaurants}
              orders={deliveryOrders}
              onUpdateOrders={setDeliveryOrders}
            />
          )
        )}

        {/* Tab: Restaurants Recommandés (Sélection payante & recommandée par les users) */}
        {activeTab === 'recommended' && (
          featureFlags.recommended === false ? (
            <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="font-serif font-black text-2xl text-slate-900">Module Recommandés Désactivé</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ce module a été mis en pause par l'Administrateur de la plateforme.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setActiveTab('feed')}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
                >
                  Retour à l'accueil
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="px-4 py-2 rounded-xl bg-[#FF4E27] text-white text-xs font-bold hover:bg-[#E03814]"
                  >
                    Ouvrir l'Admin
                  </button>
                )}
              </div>
            </div>
          ) : (
            <RecommendedRestaurantsView
              restaurants={deliveryRestaurants}
              currentUser={currentUser}
              onSelectRestaurantForOrder={() => {
                setActiveTab('delivery');
              }}
              onOpenMapForRestaurant={() => {
                setActiveTab('delivery');
              }}
              onUpdateRestaurantSponsorship={(restaurantId, plan) => {
                setDeliveryRestaurants(prev => prev.map(r => {
                  if (r.id === restaurantId) {
                    return {
                      ...r,
                      hasPaidSponsorship: true,
                      isRecommended: true,
                      sponsorshipPlan: plan,
                      recommendationCount: (r.recommendationCount || 120) + 1
                    };
                  }
                  return r;
                }));
                pushNotification({
                  id: `notif-sponsor-${Date.now()}`,
                  type: 'system',
                  title: 'Sponsoring Recommandé Activé ! ⭐',
                  message: `Le restaurant est maintenant affiché dans la sélection officielle Recommandés visible dans le menu principal.`,
                  actorName: 'Afrodelicious',
                  actorAvatar: currentUser.avatar,
                  createdAt: "À l'instant",
                  isRead: false
                });
              }}
              onIncrementRecommendation={(restaurantId) => {
                setDeliveryRestaurants(prev => prev.map(r => {
                  if (r.id === restaurantId) {
                    return {
                      ...r,
                      recommendationCount: (r.recommendationCount || 0) + 1
                    };
                  }
                  return r;
                }));
                pushNotification({
                  id: `notif-rec-${Date.now()}`,
                  type: 'like',
                  title: 'Recommandation Enregistrée ! 👍',
                  message: `Votre vote de recommandation a été pris en compte pour ce restaurant partenaire.`,
                  actorName: currentUser.name,
                  actorAvatar: currentUser.avatar,
                  createdAt: "À l'instant",
                  isRead: false
                });
              }}
            />
          )
        )}

        {/* Tab: Saved Recipes View */}
        {activeTab === 'saved' && isTabEnabled('saved') && recipesStatus === 'ready' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-orange-100 text-[#FF4E27]">
                  <BookmarkIcon className="w-6 h-6 fill-[#FF4E27]" />
                </div>
                <div>
                  <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
                    Mes Recettes Sauvegardées ({recipes.filter(r => r.isBookmarked).length})
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Votre carnet personnel de saveurs afro-caribéennes
                  </p>
                </div>
              </div>
            </div>

            {recipes.filter(r => r.isBookmarked).length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                <BookmarkIcon className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-serif font-black text-lg text-slate-900">
                  Aucune recette sauvegardée
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Parcourez le fil d'actualité et cliquez sur l'icône marque-page pour retrouver vos recettes préférées ici.
                </p>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] text-white text-xs font-bold shadow-md shadow-[#FF4E27]/25"
                >
                  Découvrir les recettes du jour
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.filter(r => r.isBookmarked).map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                          {recipe.countryFlag} {recipe.country}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(recipe.id);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-[#FF4E27] text-white shadow-xs"
                      >
                        <BookmarkIcon className="w-4 h-4 fill-white" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold text-[#FF4E27] uppercase tracking-wider block">
                        {recipe.category}
                      </span>
                      <h3 className="font-serif font-black text-base text-slate-900 line-clamp-1 group-hover:text-[#FF4E27] transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 font-medium">
                        <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                        <span>{recipe.likesCount} j'aime</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Dedicated Shopping List View */}
        {activeTab === 'list' && isTabEnabled('list') && (
          <ShoppingListView
            mealPlan={mealPlan}
            language={language}
          />
        )}

        {activeTab === 'experiences' && isTabEnabled('experiences') && (
          <ExperiencesView
            experiences={experiences}
            currentUser={currentUser}
            onBookExperience={handleBookExperience}
            onCreateExperience={handleCreateExperience}
            followedUserIds={followedUserIds}
            onToggleFollow={handleToggleFollow}
            onOpenShare={(item) => setShareModalItem(item)}
            language={language}
          />
        )}

        {activeTab === 'masterclasses' && isTabEnabled('masterclasses') && (
          <MasterclassesView
            courses={courses}
            currentUser={currentUser}
            onEnrollCourse={handleEnrollCourse}
            onUpdateLessonProgress={(courseId, lessonId) => {}}
            followedUserIds={followedUserIds}
            onToggleFollow={handleToggleFollow}
            onOpenShare={(item) => setShareModalItem(item)}
            onAddCourse={(newCourse) => {
              setCourses(prev => [newCourse, ...prev]);
              pushNotification({
                id: `notif-course-${Date.now()}`,
                type: 'system',
                title: 'Nouveau cours publié en direct ! 🍳',
                message: `Votre cours "${newCourse.title}" (${newCourse.isFree ? 'Gratuit' : `$${newCourse.price}`}) est maintenant en ligne.`,
                actorName: currentUser.name,
                actorAvatar: currentUser.avatar,
                createdAt: "À l'instant",
                isRead: false
              });
            }}
          />
        )}

        {activeTab === 'planner' && isTabEnabled('planner') && (
          <MealPlannerView
            mealPlan={mealPlan}
            allRecipes={recipes}
            onUpdateMealPlan={setMealPlan}
            onSelectRecipe={(id) => setSelectedRecipeId(id)}
          />
        )}

        {activeTab === 'communities' && (
          <CommunitiesView
            communities={communities}
            currentUser={currentUser}
            onToggleJoin={handleToggleJoinCommunity}
            onAddPost={handleAddCommunityPost}
            onCreateCommunity={handleCreateCommunity}
          />
        )}

        {activeTab === 'dashboard' && (
          <ChefDashboard
            currentUser={currentUser}
            courses={courses}
            recipes={recipes}
            onSelectRecipe={(id) => setSelectedRecipeId(id)}
            onOpenCreateRecipe={openCreateRecipe}
            onAddNewCourse={handleAddNewCourse}
            onSwitchToChef={() => {
              setCurrentUser({
                ...currentUser,
                role: 'chef',
                isVerified: true
              });
            }}
          />
        )}
      </main>

      {/* Samsung Food-Inspired Floating Action Button (FAB) */}
      <SamsungFoodFab
        onCreateRecipe={openCreateRecipe}
        onImportUrl={openImportUrl}
        onScanPhoto={featureFlags.foodCamera ? () => setIsFoodCameraOpen(true) : undefined}
        onOpenCreateStory={featureFlags.stories ? () => setIsCreateStoryOpen(true) : undefined}
      />

      {/* Modern High-End Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 px-4 text-center text-xs text-slate-500 space-y-4">
        <div className="flex justify-center pb-2">
          <AfrodeliciousLogo size="md" showTagline />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-slate-700">
          {FOOTER_LINKS.filter(link => isTabEnabled(link.tab)).map((link, idx) => (
            <React.Fragment key={link.tab}>
              {idx > 0 && <span>·</span>}
              <button onClick={() => setActiveTab(link.tab)} className={`hover:text-[#FF4E27] transition-colors ${link.className ?? ''}`}>{link.label}</button>
            </React.Fragment>
          ))}
          {isAdmin && (
            <>
              <span>·</span>
              <button onClick={() => setActiveTab('admin')} className="text-[#0F3E2E] font-bold hover:underline">
                📊 Dashboard Admin & KPI's
              </button>
            </>
          )}
          <span>·</span>
          <button onClick={() => setIsOnboardingOpen(true)} className="text-[#FF4E27] font-bold hover:underline">
            ✨ Guide d'accueil
          </button>
        </div>
        <p className="max-w-xl mx-auto text-[11px] text-slate-400">
          Afrodelicious — Réseau culinaire et gastronomique panafricain & caribéen. Recettes authentiques, ateliers de chefs, livraison express et partage multi-réseaux.
        </p>
      </footer>

      {/* Modals & Overlays */}
      <StoryViewerModal
        isOpen={!!activeStoryId}
        onClose={() => setActiveStoryId(null)}
        stories={stories}
        initialStoryId={activeStoryId}
        currentUser={currentUser}
        onSelectRecipe={(id) => {
          setActiveStoryId(null);
          setSelectedRecipeId(id);
        }}
        onSendStoryReply={handleSendStoryReply}
        onSendStoryReaction={handleSendStoryReaction}
        onMarkStoryViewed={handleMarkStoryViewed}
      />

      <StoryCreatorModal
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
        currentUser={currentUser}
        recipes={recipes}
        onStoryCreated={handleStoryCreated}
      />

      {/* Mounted only with a recipe: the modal declares hooks after its `!recipe` guard */}
      {activeRecipe && (
        <RecipeModal
          key={activeRecipe.id}
          recipe={activeRecipe}
          onClose={() => setSelectedRecipeId(null)}
          currentUser={currentUser}
          onToggleLike={handleToggleLike}
          onToggleBookmark={handleToggleBookmark}
          onAddComment={handleAddComment}
          onAddToMealPlan={handleAddToMealPlan}
          followedUserIds={followedUserIds}
          onToggleFollow={handleToggleFollow}
          onOpenShare={(item) => setShareModalItem(item)}
        />
      )}

      {isAdmin && isCreateRecipeOpen && (
        <CreateRecipeModal
          key={editingRecipe?.id || 'new-recipe'}
          isOpen={isCreateRecipeOpen}
          onClose={() => {
            setIsCreateRecipeOpen(false);
            setEditingRecipe(null);
          }}
          currentUser={currentUser}
          initialRecipe={editingRecipe}
          onSubmitRecipe={handleSubmitRecipe}
        />
      )}

      {isAdmin && (
        <ImportUrlModal
          isOpen={isImportUrlOpen}
          onClose={() => setIsImportUrlOpen(false)}
          currentUser={currentUser}
          onRecipeImported={handleRecipeImported}
        />
      )}

      <FoodCameraModal
        isOpen={isFoodCameraOpen && featureFlags.foodCamera}
        onClose={() => setIsFoodCameraOpen(false)}
        onSelectRecipe={(id) => setSelectedRecipeId(id)}
      />

      <ArchitectureDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* Mounted only while open: the modal declares hooks after its `isOpen` guard */}
      {isProfileOpen && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentUser={currentUser}
          initialTab={profileInitialTab}
          showOrders={featureFlags.delivery}
          showReferrals={featureFlags.referrals}
          onUpdateCurrentUser={handleUpdateUser}
          onSaveProfile={handleSaveProfile}
          onSignOut={handleSignOut}
          recipes={recipes}
          onSelectRecipe={(id) => setSelectedRecipeId(id)}
          onOpenCreateRecipe={openCreateRecipe}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          language={language}
          orders={deliveryOrders}
          followedUserIds={followedUserIds}
          onToggleFollow={handleToggleFollow}
          onOpenShare={(item) => setShareModalItem(item)}
          onAddTipToDriver={(orderId, tipAmount) => {
            setDeliveryOrders(prev => prev.map(o => {
              if (o.id === orderId) {
                return {
                  ...o,
                  driverTip: (o.driverTip || 0) + tipAmount,
                  total: o.total + tipAmount
                };
              }
              return o;
            }));
            pushNotification({
              id: `tip-notif-${Date.now()}`,
              type: 'system',
              title: 'Pourboire envoyé au coursier ! 💙',
              message: `Merci pour votre générosité : ${tipAmount.toFixed(2)} € reversés à 100% au coursier.`,
              actorName: currentUser.name,
              actorAvatar: currentUser.avatar,
              createdAt: "À l'instant",
              isRead: false
            });
          }}
          onNavigateToDelivery={() => {
            setActiveTab('delivery');
          }}
        />
      )}

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        language={language}
      />

      {/* Admin dashboard is only mounted for administrators (database RLS enforces the same rule) */}
      {isAdmin && isAdminDashboardOpen && (
        <AdminDashboardModal
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          currentUser={currentUser}
          recipes={allRecipes}
          recipesStatus={recipesStatus}
          onReloadRecipes={loadRecipes}
          onEditRecipe={openEditRecipe}
          onTogglePublishRecipe={handleTogglePublishRecipe}
          onDeleteRecipe={handleDeleteRecipe}
          onPreviewRecipe={(id) => {
            setIsAdminDashboardOpen(false);
            setSelectedRecipeId(id);
          }}
          deliveryOrders={deliveryOrders}
          deliveryRestaurants={deliveryRestaurants}
          featureFlags={featureFlags}
          onToggleFeatureFlag={(key, enabled) => {
            // Failure is already reported by a notification
            handleToggleFeatureFlag(key, enabled).catch(() => {});
          }}
          onResetFeatureFlags={handleResetFeatureFlags}
          onNavigateToTab={(tabId) => setActiveTab(tabId)}
          onOpenCreateRecipe={openCreateRecipe}
          language={language}
        />
      )}

      <SavedRecipesModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        recipes={recipes}
        onSelectRecipe={(id) => setSelectedRecipeId(id)}
        onToggleBookmark={handleToggleBookmark}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAllNotifications}
        onNavigateToTarget={handleNavigateToNotificationTarget}
        onSimulateNotification={handleSimulateNotification}
      />

      {/* Universal Multi-Channel Share Modal */}
      <ShareModal
        isOpen={!!shareModalItem}
        onClose={() => setShareModalItem(null)}
        item={shareModalItem}
      />

      {/* Floating Real-Time Notification Toast */}
      {toastNotification && (
        <div 
          onClick={() => {
            handleMarkAsRead(toastNotification.id);
            handleNavigateToNotificationTarget(toastNotification);
            setToastNotification(null);
          }}
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-white rounded-2xl p-4 shadow-2xl border border-slate-200/80 ring-1 ring-slate-900/5 cursor-pointer animate-in fade-in slide-in-from-top-4 duration-300 group hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <img
                src={toastNotification.actorAvatar}
                alt={toastNotification.actorName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                {toastNotification.type === 'like' && <Heart className="w-3 h-3 fill-[#FF4E27] text-[#FF4E27]" />}
                {toastNotification.type === 'comment' && <MessageSquare className="w-3 h-3 text-[#FF7849]" />}
                {toastNotification.type === 'enrollment' && <GraduationCap className="w-3 h-3 text-[#0F3E2E]" />}
                {toastNotification.type === 'story_reaction' && <Sparkles className="w-3 h-3 text-[#F59E0B]" />}
                {toastNotification.type === 'story_reply' && <MessageSquare className="w-3 h-3 text-[#FF4E27]" />}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {toastNotification.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setToastNotification(null);
                  }}
                  className="text-slate-400 hover:text-slate-700 p-0.5 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-snug font-medium">
                {toastNotification.message}
              </p>

              {toastNotification.amountEarned && toastNotification.amountEarned > 0 && (
                <div className="mt-1 text-[11px] font-bold text-[#0F3E2E] font-mono">
                  +{toastNotification.amountEarned.toFixed(2)} € crédités
                </div>
              )}

              <div className="mt-1.5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">À l'instant</span>
                <span className="font-bold text-[#FF4E27] group-hover:underline flex items-center gap-0.5">
                  <span>Consulter</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
