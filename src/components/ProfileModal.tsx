import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  ChefHat, 
  CheckCircle2, 
  MapPin, 
  Edit3, 
  LogOut, 
  UserCheck, 
  Plus, 
  Sparkles, 
  BookOpen, 
  Mail, 
  Lock, 
  Heart, 
  Crown, 
  Award, 
  ChevronRight,
  Gift,
  Copy,
  Check,
  Share2,
  HelpCircle,
  TrendingUp,
  Flame,
  Phone,
  ShieldCheck,
  FileText,
  Cookie,
  MessageSquareHeart,
  Truck,
  Clock,
  Package,
  DollarSign,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  ThumbsUp,
  ShoppingBag,
  ArrowUpRight,
  ArrowRight,
  Download,
  Users,
  Search,
  Rocket,
  LogIn,
  Eye,
  EyeOff,
  UserPlus,
  KeyRound, Loader2
} from 'lucide-react';
import { User, UserRole, Recipe } from '../types';
import { CHEF_RODRIGUE, MEMBER_MARIE_LINE } from '../data/initialData';
import { useAuth } from '../context/AuthContext';
import { toUserMessage } from '../lib/supabase';
import type { ProfileUpdate } from '../services/profileService';
import { CulinaryBadgeChip } from './CulinaryBadgeChip';
import { BadgesModal } from './BadgesModal';
import { ALL_WORLD_COUNTRIES, getCountryFlag } from '../data/allWorldCountries';
import { CHEF_AVATARS } from '../data/appImages';
import { calculateUserCulinaryStats } from '../utils/badgeSystem';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { LegalInformationModal, LegalTab } from './LegalInformationModal';
import { DeliveryOrder, OrderStatus, INITIAL_ORDERS } from '../data/deliveryData';
import { InvoiceModal } from './InvoiceModal';
import { generateDeliveryInvoicePdf } from '../utils/pdfInvoiceGenerator';
import { FollowButton } from './FollowButton';
import { ShareableItem } from './ShareModal';
import { INITIAL_ADMIN_USERS } from '../data/adminData';
import { safeOpenWindow } from '../utils/securitySanitizer';
import { AfrodeliciousLogo } from './AfrodeliciousLogo';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateCurrentUser: (user: User) => void;
  /** Persists profile fields to the database (rejects on failure). */
  onSaveProfile: (changes: ProfileUpdate) => Promise<void>;
  onSignOut: () => Promise<void>;
  recipes: Recipe[];
  onSelectRecipe: (recipeId: string) => void;
  onOpenCreateRecipe?: () => void;
  onOpenOnboarding?: () => void;
  language?: SupportedLanguage;
  orders?: DeliveryOrder[];
  onAddTipToDriver?: (orderId: string, tipAmount: number) => void;
  onSelectOrderForTracking?: (orderId: string) => void;
  onNavigateToDelivery?: () => void;
  followedUserIds?: string[];
  onToggleFollow?: (userId: string, userName?: string) => void;
  onOpenShare?: (item: ShareableItem) => void;
  initialTab?: 'profile' | 'feed' | 'orders' | 'referral' | 'following' | 'auth';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser,
  onSaveProfile,
  onSignOut,
  recipes,
  onSelectRecipe,
  onOpenCreateRecipe,
  onOpenOnboarding,
  language = 'fr',
  orders,
  onAddTipToDriver,
  onSelectOrderForTracking,
  onNavigateToDelivery,
  followedUserIds = [],
  onToggleFollow,
  onOpenShare,
  initialTab
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.fr;
  const [activeTab, setActiveTab] = useState<'profile' | 'feed' | 'orders' | 'referral' | 'following' | 'auth'>(initialTab || 'profile');

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  const [ordersList, setOrdersList] = useState<DeliveryOrder[]>(orders || INITIAL_ORDERS);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'in_progress' | 'delivered' | 'cancelled'>('all');
  const [tipSuccessMessage, setTipSuccessMessage] = useState<{ orderId: string; amount: number; driverName: string } | null>(null);
  const [customTipInput, setCustomTipInput] = useState<{ [orderId: string]: string }>({});
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser.bio);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const [followingSearchQuery, setFollowingSearchQuery] = useState('');
  const [followingFilterRole, setFollowingFilterRole] = useState<'all' | 'chef' | 'member'>('all');

  // Creators & authors catalog
  const allKnownCreators = useMemo(() => {
    const list: User[] = [
      CHEF_RODRIGUE,
      {
        id: 'user-marcus',
        name: 'Chef Marcus Garvey Jr',
        handle: '@marcus_cooks',
        email: 'marcus@afrokreyol.com',
        avatar: CHEF_AVATARS.marcus,
        role: 'chef',
        country: 'Jamaïque',
        countryFlag: '🇯🇲',
        bio: 'Spécialiste du Jerk authentique et des marinades pimentées au piment de la Jamaïque.',
        specialties: ['Jerk Chicken', 'Curry Goat', 'Rice and Peas'],
        followersCount: 18400,
        followingCount: 420,
        recipesCount: 15,
        isVerified: true
      },
      {
        id: 'user-aicha',
        name: 'Cheffe Aïcha Touré',
        handle: '@aicha_abidjan',
        email: 'aicha@afrokreyol.com',
        avatar: CHEF_AVATARS.aicha,
        role: 'chef',
        country: 'Côte d\'Ivoire',
        countryFlag: '🇨🇮',
        bio: 'Ambassadrice de la street-food ivoirienne. Du Garba croustillant à l\'Alloco caramélisé.',
        specialties: ['Attiéké Garba', 'Alloco', 'Sauce graine', 'Kédjénou'],
        followersCount: 12400,
        followingCount: 195,
        recipesCount: 14,
        isVerified: true
      },
      MEMBER_MARIE_LINE,
      ...INITIAL_ADMIN_USERS.map(u => ({
        id: u.id,
        name: u.name,
        handle: u.handle,
        email: u.email,
        avatar: u.avatar,
        role: u.role,
        country: u.country,
        countryFlag: u.countryFlag,
        bio: u.bio,
        specialties: u.specialties,
        followersCount: u.followersCount,
        followingCount: u.followingCount,
        recipesCount: u.recipesCount,
        isVerified: u.isVerified
      }))
    ];
    const map = new Map<string, User>();
    list.forEach(u => {
      if (u.id !== currentUser.id && !map.has(u.id)) {
        map.set(u.id, u);
      }
    });
    return Array.from(map.values());
  }, [currentUser.id]);

  const followedProfiles = useMemo(() => {
    return allKnownCreators.filter((u: User) => followedUserIds.includes(u.id));
  }, [allKnownCreators, followedUserIds]);

  const suggestedProfiles = useMemo(() => {
    return allKnownCreators.filter((u: User) => !followedUserIds.includes(u.id));
  }, [allKnownCreators, followedUserIds]);

  const filteredFollowedProfiles = useMemo(() => {
    let result = followedProfiles;
    if (followingFilterRole !== 'all') {
      result = result.filter((u: User) => u.role === followingFilterRole);
    }
    if (followingSearchQuery.trim()) {
      const q = followingSearchQuery.toLowerCase();
      result = result.filter((u: User) => 
        u.name.toLowerCase().includes(q) ||
        u.handle.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q) ||
        (u.specialties && u.specialties.some((s: string) => s.toLowerCase().includes(q)))
      );
    }
    return result;
  }, [followedProfiles, followingFilterRole, followingSearchQuery]);

  // Invoice state & download handlers
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<DeliveryOrder | null>(null);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);
  const [invoiceSuccessNotice, setInvoiceSuccessNotice] = useState<string | null>(null);

  const handleDownloadInvoice = (order: DeliveryOrder) => {
    setDownloadingOrderId(order.id);
    try {
      generateDeliveryInvoicePdf(order, currentUser);
      setInvoiceSuccessNotice(`Facture PDF de la commande #${order.id} téléchargée avec succès.`);
      setTimeout(() => setInvoiceSuccessNotice(null), 4500);
    } catch (err) {
      console.error('Error generating PDF invoice:', err);
    } finally {
      setTimeout(() => setDownloadingOrderId(null), 600);
    }
  };

  const handlePreviewInvoice = (order: DeliveryOrder) => {
    setSelectedOrderForInvoice(order);
  };

  // Referral Code calculation
  const cleanName = currentUser.name.replace(/[^A-Za-z]/g, '').slice(0, 6).toUpperCase() || 'CHEF';
  const referralCode = `AFRO-${cleanName}-2026`;
  const referralLink = `https://afrodelicious.app/join?ref=${referralCode}`;

  // Account & security (Supabase Auth)
  const { updatePassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdatingPassword) return;
    setPasswordFeedback(null);
    if (newPassword !== confirmNewPassword) {
      setPasswordFeedback({ type: 'error', message: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    setIsUpdatingPassword(true);
    try {
      await updatePassword(newPassword);
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordFeedback({ type: 'success', message: 'Mot de passe mis à jour avec succès.' });
    } catch (error) {
      setPasswordFeedback({ type: 'error', message: toUserMessage(error) });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSignOutClick = async () => {
    setIsSigningOut(true);
    try {
      await onSignOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  // Legal Information modal state
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalInitialTab, setLegalModalInitialTab] = useState<LegalTab>('terms');

  const openLegalTab = (tab: LegalTab) => {
    setLegalModalInitialTab(tab);
    setIsLegalModalOpen(true);
  };

  const userRecipes = useMemo(() => {
    return recipes.filter(r => 
      r.authorId === currentUser.id || 
      r.authorName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      (r.authorHandle && currentUser.handle && r.authorHandle.toLowerCase() === currentUser.handle.toLowerCase())
    );
  }, [recipes, currentUser]);

  const [feedCategoryFilter, setFeedCategoryFilter] = useState<string>('all');
  const [feedSortBy, setFeedSortBy] = useState<'newest' | 'likes' | 'comments'>('newest');
  const [likedRecipeIds, setLikedRecipeIds] = useState<Record<string, boolean>>({});
  const [localRecipeLikes, setLocalRecipeLikes] = useState<Record<string, number>>({});

  const handleToggleFeedLike = (e: React.MouseEvent, recipeId: string, currentCount: number) => {
    e.stopPropagation();
    const isLiked = !!likedRecipeIds[recipeId];
    setLikedRecipeIds(prev => ({ ...prev, [recipeId]: !isLiked }));
    setLocalRecipeLikes(prev => ({
      ...prev,
      [recipeId]: (prev[recipeId] !== undefined ? prev[recipeId] : currentCount) + (isLiked ? -1 : 1)
    }));
  };

  const filteredUserFeed = useMemo(() => {
    let list = [...userRecipes];
    if (feedCategoryFilter !== 'all') {
      list = list.filter(r => r.category === feedCategoryFilter);
    }
    if (feedSortBy === 'likes') {
      list.sort((a, b) => {
        const likesA = localRecipeLikes[a.id] !== undefined ? localRecipeLikes[a.id] : a.likesCount;
        const likesB = localRecipeLikes[b.id] !== undefined ? localRecipeLikes[b.id] : b.likesCount;
        return likesB - likesA;
      });
    } else if (feedSortBy === 'comments') {
      list.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    return list;
  }, [userRecipes, feedCategoryFilter, feedSortBy, localRecipeLikes]);

  const culinaryStats = calculateUserCulinaryStats(currentUser, recipes);
  const { currentBadge, nextBadge } = culinaryStats;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setHasCopiedCode(true);
    setTimeout(() => setHasCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Rejoins-moi sur Afrodelicious ! Utilise mon code de parrainage ${referralCode} pour profiter de -20% sur ta première Masterclass culinaire afro-caribéenne : ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Profile edits are persisted to Supabase (users can only update their own profile — enforced by RLS)
  const saveProfileChanges = async (changes: ProfileUpdate, successMessage: string): Promise<boolean> => {
    setIsSavingProfile(true);
    setProfileFeedback(null);
    try {
      await onSaveProfile(changes);
      setProfileFeedback({ type: 'success', message: successMessage });
      setTimeout(() => setProfileFeedback(null), 3000);
      return true;
    } catch (error) {
      setProfileFeedback({ type: 'error', message: toUserMessage(error, 'La modification n’a pas pu être enregistrée.') });
      return false;
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveName = async () => {
    if (await saveProfileChanges({ full_name: nameInput }, 'Nom mis à jour ✓')) {
      setIsEditingName(false);
    }
  };

  const handleSaveBio = async () => {
    if (await saveProfileChanges({ bio: bioInput }, 'Bio mise à jour ✓')) {
      setIsEditingBio(false);
    }
  };

  const handleAddSpecialty = async () => {
    const value = newSpecialty.trim();
    if (!value || isSavingProfile) return;
    if (value.length > 60) {
      setProfileFeedback({ type: 'error', message: 'Une spécialité ne peut pas dépasser 60 caractères.' });
      return;
    }
    if (await saveProfileChanges({ specialties: [...currentUser.specialties, value] }, 'Spécialité ajoutée ✓')) {
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = async (specialty: string) => {
    if (isSavingProfile) return;
    await saveProfileChanges({ specialties: currentUser.specialties.filter(s => s !== specialty) }, 'Spécialité retirée ✓');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header with 4 Navigation Tabs */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50 overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'profile' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Mon Profil
            </button>
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'feed' ? 'bg-[#00C9A7] text-slate-950 shadow-xs ring-1 ring-[#00C9A7]' : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#00C9A7]" />
              <span>Feed de mes Recettes ({userRecipes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'orders' ? 'bg-[#FF4E27] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Commandes ({ordersList.length})</span>
              {ordersList.some(o => o.status !== 'delivered' && o.status !== 'cancelled') && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('referral')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'referral' ? 'bg-[#FF4E27] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Parrainage & Gains</span>
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'following' ? 'bg-[#FF4E27] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Abonnements ({followedProfiles.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('auth')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'auth' 
                  ? 'bg-gradient-to-r from-[#FF4E27] to-[#FF7849] text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Compte</span>
            </button>
          </div>

          <div className="flex items-center gap-1 ml-2">
            {onOpenOnboarding && (
              <button
                onClick={() => {
                  onClose();
                  onOpenOnboarding();
                }}
                title="Revoir le guide d'accueil / Onboarding"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Profile View */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* User Hero Banner (Elevated with Warm Ambient Gradient & Welcome Back Kicker) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 p-5 sm:p-6 border border-orange-200/80 shadow-[0_8px_25px_rgba(255,78,39,0.08)]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                
                {/* Avatar with glossy gradient ring and status indicator */}
                <div className="relative shrink-0">
                  <div className="p-1 rounded-3xl bg-gradient-to-tr from-[#FF4E27] via-amber-400 to-[#FF7849] shadow-md shadow-[#FF4E27]/25">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover ring-2 ring-white"
                    />
                  </div>
                  {/* Status dot */}
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs animate-pulse" />
                  <span className="absolute -bottom-1 -right-1 text-2xl drop-shadow-md">
                    {currentUser.countryFlag}
                  </span>
                </div>

                {/* Profile Identity Details */}
                <div className="flex-1 text-center sm:text-left min-w-0 space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Welcome Back 👋
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {isEditingName ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={nameInput}
                          maxLength={120}
                          autoFocus
                          aria-label="Nom complet"
                          onChange={(e) => setNameInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveName();
                            if (e.key === 'Escape') setIsEditingName(false);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold focus:border-[#FF4E27] focus:outline-none w-48"
                        />
                        <button
                          type="button"
                          onClick={handleSaveName}
                          disabled={isSavingProfile}
                          className="px-3 py-1.5 rounded-xl bg-[#FF4E27] text-white text-xs font-bold disabled:opacity-60"
                        >
                          {isSavingProfile ? '…' : 'OK'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingName(false);
                            setNameInput(currentUser.name);
                          }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
                          aria-label="Annuler"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className="font-serif font-black text-2xl text-slate-900 tracking-tight">
                          {currentUser.name}
                        </h2>
                        <button
                          type="button"
                          onClick={() => {
                            setNameInput(currentUser.name);
                            setIsEditingName(true);
                          }}
                          title="Modifier mon nom"
                          aria-label="Modifier mon nom"
                          className="p-1 rounded-lg text-slate-400 hover:text-[#FF4E27] hover:bg-orange-50"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    {currentUser.role === 'chef' && (
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF4E27] to-[#FF7849] text-white text-[10px] font-black flex items-center gap-1 shadow-xs">
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Cheffe Certifiée</span>
                      </span>
                    )}
                    {currentUser.role === 'admin' && (
                      <span className="px-3 py-1 rounded-full bg-[#0F3E2E] text-white text-[10px] font-black flex items-center gap-1 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Administrateur</span>
                      </span>
                    )}
                    {/* Active Culinary Badge Chip */}
                    <CulinaryBadgeChip
                      badge={currentBadge}
                      size="sm"
                      showDetailsOnClick={() => setIsBadgesModalOpen(true)}
                    />
                  </div>

                  <p className="text-xs text-slate-500 font-mono">
                    {currentUser.handle} · {currentUser.country}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 pt-1 font-normal leading-relaxed">
                    {currentUser.bio}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={handleSignOutClick}
                      disabled={isSigningOut}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-white/90 hover:bg-orange-50 border border-slate-200 hover:border-[#FF4E27] text-slate-700 hover:text-[#FF4E27] transition-all shadow-2xs cursor-pointer disabled:opacity-60"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#FF4E27]" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>

                  {profileFeedback && (
                    <p
                      role={profileFeedback.type === 'error' ? 'alert' : 'status'}
                      className={`text-[11px] font-bold pt-1 ${profileFeedback.type === 'error' ? 'text-rose-600' : 'text-emerald-700'}`}
                    >
                      {profileFeedback.message}
                    </p>
                  )}
                </div>
              </div>

              {/* 4 GLOSSY STAT CARDS INSPIRED DIRECTLY BY REFERENCE IMAGES (Violet Flash, Amber Save, Coral Super Save, Blue VIP) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-orange-200/60">
                
                {/* 1. VIOLET GLOSSY STAT CARD */}
                <div className="relative overflow-hidden p-3 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white shadow-md shadow-purple-500/20 group hover:-translate-y-0.5 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent h-1/2 pointer-events-none" />
                  <div className="relative flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs font-bold">
                      FLASH CHEF
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  </div>
                  <div className="relative">
                    <span className="text-xl font-black block leading-none">
                      {culinaryStats.recipesCount}
                    </span>
                    <span className="text-[10px] text-purple-200 font-semibold block mt-1">
                      Recettes créées
                    </span>
                  </div>
                </div>

                {/* 2. AMBER GLOSSY STAT CARD */}
                <div className="relative overflow-hidden p-3 rounded-2xl bg-gradient-to-br from-[#F59E0B] via-[#F97316] to-[#EA580C] text-white shadow-md shadow-orange-500/20 group hover:-translate-y-0.5 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent h-1/2 pointer-events-none" />
                  <div className="relative flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                      SAVE UP
                    </span>
                    <Heart className="w-3.5 h-3.5 text-rose-200 fill-rose-200" />
                  </div>
                  <div className="relative">
                    <span className="text-xl font-black block leading-none">
                      {culinaryStats.totalLikesReceived.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-200 font-semibold block mt-1">
                      Likes reçus
                    </span>
                  </div>
                </div>

                {/* 3. CORAL GLOSSY STAT CARD */}
                <div className="relative overflow-hidden p-3 rounded-2xl bg-gradient-to-br from-[#FF4E27] via-[#E11D48] to-[#BE123C] text-white shadow-md shadow-rose-500/20 group hover:-translate-y-0.5 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent h-1/2 pointer-events-none" />
                  <div className="relative flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                      SUPER SAVE
                    </span>
                    <Rocket className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="relative">
                    <span className="text-xl font-black block leading-none">
                      {currentUser.followersCount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-rose-200 font-semibold block mt-1">
                      Abonnés
                    </span>
                  </div>
                </div>

                {/* 4. BLUE GLOSSY STAT CARD */}
                <button
                  type="button"
                  onClick={() => setActiveTab('following')}
                  className="relative overflow-hidden p-3 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#0284C7] to-[#0369A1] text-white shadow-md shadow-blue-500/20 text-left group hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent h-1/2 pointer-events-none" />
                  <div className="relative flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs font-bold">
                      VIP GOURMET
                    </span>
                    <Users className="w-3.5 h-3.5 text-cyan-200" />
                  </div>
                  <div className="relative">
                    <span className="text-xl font-black block leading-none">
                      {followedProfiles.length}
                    </span>
                    <span className="text-[10px] text-sky-200 font-semibold block mt-1 flex items-center gap-1">
                      <span>Abonnements</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </button>

              </div>

            </div>

            {/* Culinary Badge & Merits Showcase Card */}
            <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
              currentBadge.id === 'top_chef'
                ? 'bg-gradient-to-br from-orange-50/80 to-white border-orange-200 shadow-sm'
                : currentBadge.id === 'expert_culinaire'
                ? 'bg-gradient-to-br from-emerald-50/80 to-white border-emerald-200 shadow-sm'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                    currentBadge.id === 'top_chef' 
                      ? 'bg-gradient-to-br from-[#FF4E27] to-[#FF7849] text-white shadow-[#FF4E27]/30'
                      : currentBadge.id === 'expert_culinaire'
                      ? 'bg-gradient-to-br from-[#0F3E2E] to-[#15523E] text-white shadow-emerald-900/30'
                      : 'bg-white border border-slate-200'
                  }`}>
                    {currentBadge.emoji}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Distinction Culinaire
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-black/5 text-[10px] font-bold text-slate-900">
                        Rang Officiel
                      </span>
                    </div>

                    <h3 className="font-serif font-black text-base text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <span>Badge {currentBadge.title}</span>
                      <span className="text-sm">{currentBadge.emoji}</span>
                    </h3>

                    <p className="text-xs text-slate-600 mt-1 leading-snug font-normal">
                      {currentBadge.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBadgesModalOpen(true)}
                  className="shrink-0 p-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                  title="Voir tous les badges et privilèges"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Progress towards next badge */}
              {nextBadge ? (
                <div className="mt-4 pt-3.5 border-t border-black/5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF4E27]" />
                      <span>Prochain palier : <strong>{nextBadge.title} {nextBadge.emoji}</strong></span>
                    </span>
                    <span className="font-black text-[#FF4E27]">
                      {culinaryStats.overallProgressPercent}%
                    </span>
                  </div>

                  {/* Dual metric progress bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white/80 p-2.5 rounded-2xl border border-black/5 shadow-2xs">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-slate-600 font-medium">📖 Recettes</span>
                        <span className="font-bold text-slate-900">{culinaryStats.recipesCount} / {nextBadge.minRecipes}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-[#FF4E27] rounded-full"
                          style={{ width: `${Math.min(100, (culinaryStats.recipesCount / nextBadge.minRecipes) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-white/80 p-2.5 rounded-2xl border border-black/5 shadow-2xs">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-slate-600 font-medium">❤️ Likes reçus</span>
                        <span className="font-bold text-slate-900">{culinaryStats.totalLikesReceived} / {nextBadge.minLikes}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-[#FF4E27] rounded-full"
                          style={{ width: `${Math.min(100, (culinaryStats.totalLikesReceived / nextBadge.minLikes) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-amber-300/30 text-xs font-bold text-[#FF4E27] flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Niveau Suprême Atteint : Grand Chef AfroKréyol</span>
                </div>
              )}

              {/* Scale of badges link */}
              <div className="mt-3.5 flex items-center justify-between border-t border-black/5 pt-2">
                <button
                  onClick={() => setIsBadgesModalOpen(true)}
                  className="text-xs font-bold text-[#FF4E27] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Consulter l'échelle des badges & privilèges</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Biographie Culinaire
                </span>
                <button
                  onClick={() => setIsEditingBio(!isEditingBio)}
                  className="text-xs text-[#FF4E27] hover:underline font-bold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingBio ? 'Annuler' : 'Modifier'}</span>
                </button>
              </div>

              {isEditingBio ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                  />
                  <button
                    onClick={handleSaveBio}
                    disabled={isSavingProfile}
                    className="px-4 py-1.5 rounded-xl bg-[#FF4E27] text-white text-xs font-bold shadow-xs disabled:opacity-60"
                  >
                    {isSavingProfile ? 'Enregistrement…' : 'Enregistrer la bio'}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 font-normal">
                  {currentUser.bio || 'Présentez-vous en quelques mots : vos plats préférés, vos origines culinaires…'}
                </p>
              )}
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Spécialités & Plats Signatures
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 inline-flex items-center gap-1"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(spec)}
                      disabled={isSavingProfile}
                      aria-label={`Retirer ${spec}`}
                      className="text-slate-400 hover:text-rose-600 disabled:opacity-50"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  maxLength={60}
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSpecialty();
                    }
                  }}
                  placeholder="Ajouter une spécialité (ex: Diri ak Djon Djon)..."
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs flex-1 focus:border-[#FF4E27] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSpecialty}
                  disabled={isSavingProfile}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0F3E2E] text-white text-xs font-bold disabled:opacity-60"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* User Published Recipes list */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Mes Recettes Publiées ({userRecipes.length})
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Vos créations culinaires partagées sur Afrodelicious
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {onOpenCreateRecipe && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenCreateRecipe();
                      }}
                      className="px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF4E27] text-xs font-bold transition-all flex items-center gap-1 border border-orange-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Publier</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('feed')}
                    className="px-3 py-1 rounded-xl bg-teal-50 hover:bg-[#00C9A7] hover:text-slate-900 text-teal-800 text-xs font-bold transition-all flex items-center gap-1 border border-teal-200/80 shadow-2xs"
                  >
                    <span>Ouvrir mon feed</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {userRecipes.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <ChefHat className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">
                    Vous n'avez pas encore publié de recette.
                  </p>
                  {onOpenCreateRecipe && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenCreateRecipe();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#00C9A7] text-slate-950 text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Créer ma première recette</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userRecipes.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        onClose();
                        onSelectRecipe(r.id);
                      }}
                      className="p-3 rounded-2xl border border-slate-200 hover:border-[#00C9A7] cursor-pointer transition-all flex items-center gap-3 bg-slate-50 hover:bg-white hover:shadow-xs group"
                    >
                      <img
                        src={r.imageUrl}
                        alt={r.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                          {r.countryFlag} {r.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-0.5">
                          <span className="flex items-center gap-1 text-rose-600 font-semibold">
                            <Heart className="w-3 h-3 fill-rose-500" />
                            <span>{localRecipeLikes[r.id] !== undefined ? localRecipeLikes[r.id] : r.likesCount}</span>
                          </span>
                          <span>·</span>
                          <span>{r.category}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legal Information & Feedback Section */}
            <div className="pt-5 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0F3E2E]" />
                  <span>Legal Information & Conformité</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">RGPD · CGU v2.4</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => openLegalTab('terms')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-left transition-all text-xs font-semibold text-slate-700 flex items-center gap-2 group"
                >
                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-[#FF4E27]" />
                  <span className="truncate">Terms of use</span>
                </button>

                <button
                  type="button"
                  onClick={() => openLegalTab('privacy')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-left transition-all text-xs font-semibold text-slate-700 flex items-center gap-2 group"
                >
                  <Lock className="w-4 h-4 text-slate-400 group-hover:text-[#0F3E2E]" />
                  <span className="truncate">Private Policy</span>
                </button>

                <button
                  type="button"
                  onClick={() => openLegalTab('cgu')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-left transition-all text-xs font-semibold text-slate-700 flex items-center gap-2 group"
                >
                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                  <span className="truncate">CGU</span>
                </button>

                <button
                  type="button"
                  onClick={() => openLegalTab('rgpd')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-left transition-all text-xs font-semibold text-slate-700 flex items-center gap-2 group"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                  <span className="truncate">RGPD / GDPR</span>
                </button>

                <button
                  type="button"
                  onClick={() => openLegalTab('cookies')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-left transition-all text-xs font-semibold text-slate-700 flex items-center gap-2 group"
                >
                  <Cookie className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
                  <span className="truncate">COOKIEs</span>
                </button>

                <button
                  type="button"
                  onClick={() => openLegalTab('feedback')}
                  className="p-2.5 rounded-xl border border-orange-200 bg-orange-50/60 hover:bg-orange-100 text-left transition-all text-xs font-bold text-[#FF4E27] flex items-center gap-2 group"
                >
                  <MessageSquareHeart className="w-4 h-4 text-[#FF4E27]" />
                  <span className="truncate">Feedback & Avis</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Feed de mes Recettes Publiées */}
        {activeTab === 'feed' && (
          <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Feed Header Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-stone-900 to-[#0F3E2E] text-white border border-slate-700/60 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#00C9A7]"
                    />
                    <span className="absolute -bottom-1 -right-1 text-sm">
                      {currentUser.countryFlag}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#00C9A7] bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-500/40">
                        Mes Créations Culinaires
                      </span>
                    </div>
                    <h3 className="font-serif font-black text-lg sm:text-xl text-white mt-0.5">
                      Feed des Recettes de {currentUser.name}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {userRecipes.length} recette{userRecipes.length > 1 ? 's' : ''} publiée{userRecipes.length > 1 ? 's' : ''} · Transmettez les saveurs de vos terroirs
                    </p>
                  </div>
                </div>

                {onOpenCreateRecipe && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCreateRecipe();
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-[#00C9A7] hover:bg-[#00b093] text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Publier une recette</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter by Category & Sort Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'Toutes' },
                  { id: 'Plats Traditionnels', label: 'Traditionnels' },
                  { id: 'Street Food', label: 'Street Food' },
                  { id: 'Sauces & Marinades', label: 'Sauces' },
                  { id: 'Desserts & Douceurs', label: 'Desserts' },
                  { id: 'Boissons & Cocktails', label: 'Boissons' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFeedCategoryFilter(cat.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      feedCategoryFilter === cat.id
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 self-end sm:self-auto shrink-0">
                <span className="font-semibold text-slate-500">Trier :</span>
                <select
                  value={feedSortBy}
                  onChange={(e) => setFeedSortBy(e.target.value as any)}
                  className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-[#00C9A7]"
                >
                  <option value="newest">Plus récentes</option>
                  <option value="likes">Plus aimées (Likes)</option>
                  <option value="comments">Plus commentées</option>
                </select>
              </div>
            </div>

            {/* Feed Cards List */}
            {filteredUserFeed.length === 0 ? (
              <div className="py-12 px-4 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF4E27] flex items-center justify-center mx-auto">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-black text-base text-slate-900">
                  {userRecipes.length === 0 ? "Vous n'avez pas encore publié de recette" : "Aucune recette dans cette catégorie"}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {userRecipes.length === 0
                    ? "Partagez votre secret de famille, votre plat signature ou une street-food adorée pour inspirer la communauté."
                    : "Essayez de sélectionner 'Toutes' les catégories pour revoir l'ensemble de vos recettes publiées."}
                </p>
                {onOpenCreateRecipe && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCreateRecipe();
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-[#00C9A7] hover:bg-[#00b093] text-slate-950 text-xs font-black shadow-md inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Créer ma recette maintenant</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUserFeed.map((recipe) => {
                  const currentLikes = localRecipeLikes[recipe.id] !== undefined ? localRecipeLikes[recipe.id] : recipe.likesCount;
                  const isLikedByMe = !!likedRecipeIds[recipe.id] || recipe.isLiked;

                  return (
                    <div
                      key={recipe.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                    >
                      {/* Post Author Bar */}
                      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-900 block leading-tight">
                              {currentUser.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {currentUser.handle} · {recipe.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenShare) {
                                onOpenShare({
                                  id: recipe.id,
                                  type: 'recipe',
                                  title: recipe.title,
                                  description: recipe.description,
                                  image: recipe.imageUrl,
                                  authorName: currentUser.name,
                                  authorHandle: currentUser.handle,
                                  country: recipe.country,
                                  countryFlag: recipe.countryFlag,
                                  prepTime: `${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min`
                                });
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Partager cette recette"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Large Dish Image */}
                      <div 
                        onClick={() => {
                          onClose();
                          onSelectRecipe(recipe.id);
                        }}
                        className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100 cursor-pointer group"
                      >
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                        {/* Top Flag badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10 flex items-center gap-1">
                            <span>{recipe.countryFlag}</span>
                            <span>{recipe.country}</span>
                          </span>
                        </div>

                        {/* Top Time and Difficulty Badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#00C9A7]" />
                            <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                          </span>
                          <span className="px-2 py-1 rounded-full bg-[#00C9A7] text-slate-950 text-[10px] font-black">
                            {recipe.difficulty}
                          </span>
                        </div>

                        {/* Bottom Image Caption */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[10px] font-bold text-[#00C9A7] uppercase tracking-wider block">
                            {recipe.category}
                          </span>
                          <h4 className="font-serif font-black text-base sm:text-lg text-white drop-shadow-sm leading-snug">
                            {recipe.title}
                          </h4>
                        </div>
                      </div>

                      {/* Card Body & Details */}
                      <div className="p-4 space-y-3">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {recipe.description}
                        </p>

                        {/* Summary Badges */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                            🥣 {recipe.ingredients?.length || 0} ingrédients
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                            🔥 {recipe.steps?.length || 0} étapes de préparation
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                            🍽️ {recipe.servings} portions
                          </span>
                        </div>

                        {/* Interaction Bar & Action Button */}
                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <div className="flex items-center gap-4 text-xs font-semibold">
                            {/* Like Button */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleFeedLike(e, recipe.id, recipe.likesCount)}
                              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isLikedByMe ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-rose-600'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${isLikedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                              <span>{currentLikes}</span>
                            </button>

                            {/* Comments Count */}
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <MessageSquareHeart className="w-4 h-4" />
                              <span>{recipe.commentsCount || recipe.comments?.length || 0}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectRecipe(recipe.id);
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#00C9A7] hover:text-slate-950 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <span>Voir la recette</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Order History & Driver Tips */}
        {activeTab === 'orders' && (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Header Hero Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#0F3E2E] text-white border border-slate-700/60 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4E27] to-[#FF7849] text-white flex items-center justify-center font-black shadow-md shadow-[#FF4E27]/30 shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                        Afrodelicious Delivery Food
                      </span>
                    </div>
                    <h3 className="font-serif font-black text-lg sm:text-xl text-white mt-0.5">
                      Historique des Commandes & Pourboires
                    </h3>
                    <p className="text-xs text-slate-300">
                      Suivez l'état de vos livraisons en temps réel et récompensez directement vos coursiers dévoués.
                    </p>
                  </div>
                </div>

                {onNavigateToDelivery && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToDelivery();
                    }}
                    className="px-4 py-2 rounded-2xl bg-[#FF4E27] hover:bg-[#e03814] text-white text-xs font-black shadow-md flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Commander un plat</span>
                  </button>
                )}
              </div>

              {/* Quick Summary Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/80 text-center">
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Commandes</span>
                  <span className="text-sm font-black text-white">{ordersList.length}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">En Cours (Live)</span>
                  <span className="text-sm font-black text-amber-400">
                    {ordersList.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pourboires Versés</span>
                  <span className="text-sm font-black text-emerald-400">
                    {ordersList.reduce((acc, o) => acc + (o.driverTip || 0), 0).toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>

            {/* Tip Success Notification Toast */}
            {tipSuccessMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between gap-3 animate-fade-in shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    🎉 Pourboire de {tipSuccessMessage.amount.toFixed(2)} € versé avec succès à {tipSuccessMessage.driverName} (100% reversé, 0% de commission) !
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTipSuccessMessage(null)}
                  className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Invoice Download Notification Toast */}
            {invoiceSuccessNotice && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs font-bold flex items-center justify-between gap-3 animate-fade-in shadow-md">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>📄 {invoiceSuccessNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setInvoiceSuccessNotice(null)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 text-xs font-bold">
              {[
                { id: 'all', label: `Toutes (${ordersList.length})` },
                { 
                  id: 'in_progress', 
                  label: `En cours (${ordersList.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length})`,
                  color: 'text-amber-700'
                },
                { 
                  id: 'delivered', 
                  label: `Livrées (${ordersList.filter(o => o.status === 'delivered').length})`,
                  color: 'text-emerald-700'
                },
                { 
                  id: 'cancelled', 
                  label: `Annulées (${ordersList.filter(o => o.status === 'cancelled').length})`,
                  color: 'text-rose-700'
                }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setOrderStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    orderStatusFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders List */}
            {(() => {
              const filteredOrders = ordersList.filter(o => {
                if (orderStatusFilter === 'in_progress') return o.status !== 'delivered' && o.status !== 'cancelled';
                if (orderStatusFilter === 'delivered') return o.status === 'delivered';
                if (orderStatusFilter === 'cancelled') return o.status === 'cancelled';
                return true;
              });

              if (filteredOrders.length === 0) {
                return (
                  <div className="py-12 text-center bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-3">
                    <Package className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="font-serif font-black text-base text-slate-800">
                      Aucune commande dans cette catégorie
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Commandez de délicieux plats traditionnels chez nos restaurateurs partenaires et retrouvez l'historique ici.
                    </p>
                    {onNavigateToDelivery && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateToDelivery();
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all"
                      >
                        Explorer les restaurants
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filteredOrders.map(order => {
                    const isDelivered = order.status === 'delivered';
                    const isCancelled = order.status === 'cancelled';
                    const isInProgress = !isDelivered && !isCancelled;

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden space-y-4 p-5"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-xs text-slate-900">
                                #{order.id}
                              </span>
                              <span className="text-xs font-bold text-slate-500">
                                · {order.createdAt}
                              </span>
                            </div>
                            <h4 className="font-serif font-black text-base text-slate-900 mt-0.5">
                              {order.restaurantName}
                            </h4>
                          </div>

                          {/* Status Badge & Invoice Quick Action */}
                          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleDownloadInvoice(order)}
                              disabled={downloadingOrderId === order.id}
                              title="Télécharger la facture PDF détaillée pour cette commande"
                              className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 disabled:opacity-50"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#FF4E27]" />
                              <span>Facture PDF</span>
                              <Download className="w-3 h-3 text-slate-400" />
                            </button>

                            {isInProgress && (
                              <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-black flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                <span>En cours d'acheminement · ~{order.estimatedDeliveryMinutes || 12} min</span>
                              </span>
                            )}
                            {isDelivered && (
                              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Livrée avec succès {order.deliveryCompletedAt ? `· ${order.deliveryCompletedAt}` : ''}</span>
                              </span>
                            )}
                            {isCancelled && (
                              <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-rose-600" />
                                <span>Annulée · Intégralement remboursée</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Stepper Progression */}
                        {!isCancelled && (
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                              Progression de la livraison :
                            </span>
                            <div className="grid grid-cols-4 gap-2 relative">
                              {[
                                { step: 1, label: 'Confirmée', active: true },
                                { step: 2, label: 'En cuisine', active: order.status === 'in_kitchen' || order.status === 'out_for_delivery' || isDelivered },
                                { step: 3, label: 'En livraison', active: order.status === 'out_for_delivery' || isDelivered },
                                { step: 4, label: 'Livrée', active: isDelivered }
                              ].map(s => (
                                <div key={s.step} className="flex flex-col items-center text-center space-y-1">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                    s.active 
                                      ? 'bg-emerald-600 text-white shadow-xs' 
                                      : 'bg-slate-200 text-slate-400'
                                  }`}>
                                    {s.active ? '✓' : s.step}
                                  </div>
                                  <span className={`text-[10px] font-bold ${s.active ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {s.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Items in the Order */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            Détail des plats commandés ({order.items.reduce((s, i) => s + i.quantity, 0)}) :
                          </span>
                          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-2.5 bg-white">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {item.dish.imageUrl && (
                                    <img
                                      src={item.dish.imageUrl}
                                      alt={item.dish.name}
                                      className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                                    />
                                  )}
                                  <div className="min-w-0">
                                    <span className="font-bold text-slate-900 truncate block">
                                      {item.quantity}x {item.dish.name}
                                    </span>
                                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                                      <span className="text-[10px] text-slate-400 italic">
                                        Options : {item.selectedOptions.join(', ')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="font-black text-slate-800 shrink-0">
                                  {item.itemTotal.toFixed(2)} €
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Financial Price Breakdown */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                          <div className="flex justify-between text-slate-500">
                            <span>Sous-total plats</span>
                            <span>{order.subtotal.toFixed(2)} €</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>Frais de livraison coursier</span>
                            <span>{order.deliveryFee.toFixed(2)} €</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>Frais de commission & service Afrodelicious</span>
                            <span>{(order.platformCommissionFee || 1.20).toFixed(2)} €</span>
                          </div>
                          {order.driverTip && order.driverTip > 0 && (
                            <div className="flex justify-between text-emerald-700 font-bold">
                              <span>💙 Pourboire livreur (100% reversé)</span>
                              <span>+{order.driverTip.toFixed(2)} €</span>
                            </div>
                          )}
                          {order.discount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-bold">
                              <span>Réduction promo ({order.couponCodeApplied})</span>
                              <span>-{order.discount.toFixed(2)} €</span>
                            </div>
                          )}
                          <div className="flex justify-between font-black text-sm text-slate-900 pt-1.5 border-t border-slate-200">
                            <span>Total payé</span>
                            <span className="text-[#FF4E27]">{order.total.toFixed(2)} €</span>
                          </div>
                        </div>

                        {/* ============================================================ */}
                        {/* TIPS FOR DRIVERS (POURBOIRE LIVREUR)                         */}
                        {/* ============================================================ */}
                        {!isCancelled && order.driver && (
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-white border border-amber-200/80 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={order.driver.avatar}
                                  alt={order.driver.name}
                                  className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-sm ring-2 ring-amber-300"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h5 className="font-bold text-xs text-slate-900">
                                      {order.driver.name}
                                    </h5>
                                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px] font-black">
                                      {order.driver.vehicle} · 4.9⭐
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500">
                                    {isDelivered 
                                      ? 'Votre coursier pour cette commande.' 
                                      : 'En route vers votre adresse de livraison.'}
                                  </p>
                                </div>
                              </div>

                              {/* Current Tip Badge */}
                              {order.driverTip && order.driverTip > 0 ? (
                                <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1 self-start sm:self-auto shadow-2xs">
                                  <span>💙 Pourboire : {order.driverTip.toFixed(2)} €</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-amber-700 font-bold">
                                  Pas de pourboire versé pour le moment
                                </span>
                              )}
                            </div>

                            {/* Quick Tip Selection Buttons */}
                            <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold text-slate-700">
                                  Laisser un pourboire :
                                </span>
                                {[1, 2, 3, 5].map(amount => (
                                  <button
                                    key={amount}
                                    type="button"
                                    onClick={() => {
                                      const driverName = order.driver?.name || 'le coursier';
                                      setOrdersList(prev => prev.map(o => {
                                        if (o.id === order.id) {
                                          return {
                                            ...o,
                                            driverTip: (o.driverTip || 0) + amount,
                                            total: o.total + amount
                                          };
                                        }
                                        return o;
                                      }));
                                      onAddTipToDriver?.(order.id, amount);
                                      setTipSuccessMessage({
                                        orderId: order.id,
                                        amount,
                                        driverName
                                      });
                                    }}
                                    className="px-2.5 py-1 rounded-xl bg-white hover:bg-amber-500 hover:text-slate-950 border border-amber-300 text-xs font-black text-amber-900 shadow-2xs transition-all active:scale-95"
                                  >
                                    +{amount} €
                                  </button>
                                ))}
                              </div>

                              <p className="text-[10px] text-slate-400 italic">
                                100% du pourboire est directement versé à {order.driver.name.split(' ')[0]}.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Order Action Buttons */}
                        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>Paiement : {order.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                            <span>·</span>
                            <span>Livré à : {order.customerAddress.split(',')[0]}</span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Download PDF Invoice Button */}
                            <button
                              type="button"
                              onClick={() => handleDownloadInvoice(order)}
                              disabled={downloadingOrderId === order.id}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
                              title="Télécharger la facture PDF détaillée conforme (TVA, ventilation et mentions légales)"
                            >
                              <Download className="w-3.5 h-3.5 text-amber-400" />
                              <span>{downloadingOrderId === order.id ? 'Génération...' : 'Télécharger Facture PDF'}</span>
                            </button>

                            {/* Preview Invoice Button */}
                            <button
                              type="button"
                              onClick={() => handlePreviewInvoice(order)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                              title="Aperçu & impression de la facture"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-500" />
                              <span>Aperçu</span>
                            </button>

                            {isInProgress && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onSelectOrderForTracking?.(order.id);
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-[#FF4E27] hover:bg-[#e03814] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Suivi GPS</span>
                              </button>
                            )}
                            {isDelivered && onNavigateToDelivery && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onNavigateToDelivery();
                                }}
                                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                                <span>Commander à nouveau</span>
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </div>
        )}
        {activeTab === 'referral' && (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Hero Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50/60 to-white border-2 border-orange-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4E27] to-[#FF7849] text-white flex items-center justify-center shadow-md shadow-[#FF4E27]/25 shrink-0">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27]">
                      Programme Ambassadeur Culinaire
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#0F3E2E] text-[10px] font-bold">
                      Actif
                    </span>
                  </div>
                  <h3 className="font-serif font-black text-xl text-slate-900 mt-0.5">
                    {t.referralTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {t.referralSubtitle}
                  </p>
                </div>
              </div>

              {/* Unique Referral Code Block */}
              <div className="p-4 rounded-2xl bg-white border border-orange-200/80 shadow-2xs space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {t.referralYourCode}
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between font-mono font-black text-base sm:text-lg text-slate-900 tracking-wider">
                    <span>{referralCode}</span>
                    <button
                      onClick={handleCopyCode}
                      className="text-xs font-sans font-bold text-[#FF4E27] hover:underline flex items-center gap-1 ml-2"
                    >
                      {hasCopiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{hasCopiedCode ? t.referralCodeCopied : t.referralCopyCode}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleShareWhatsApp}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs shrink-0"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500 text-[11px] truncate">
                    {referralLink}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="text-[11px] font-bold text-slate-700 hover:text-slate-900 underline shrink-0 ml-2"
                  >
                    {hasCopiedLink ? 'Lien copié ✓' : 'Copier le lien'}
                  </button>
                </div>
              </div>

              {/* 3 Metric Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {t.referralFriendsCount}
                  </span>
                  <span className="font-mono font-black text-2xl text-slate-900 mt-1 block">5</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Amis actifs</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {t.referralEarnings}
                  </span>
                  <span className="font-mono font-black text-2xl text-[#FF4E27] mt-1 block">50 €</span>
                  <span className="text-[10px] text-slate-500 font-medium">À valoir sur masterclasses</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {t.referralNextReward}
                  </span>
                  <span className="font-mono font-black text-lg text-[#0F3E2E] mt-1 block">5 / 10</span>
                  <span className="text-[10px] text-slate-500 font-medium">5 restants pour cours offert</span>
                </div>
              </div>

              {/* Progress towards Next Reward */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.referralNextRewardDesc}</span>
                  </span>
                  <span className="text-[#FF4E27] font-mono">50%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#FF4E27] to-[#F59E0B]" style={{ width: '50%' }} />
                </div>
              </div>
            </div>

            {/* How It Works Steps */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                {t.referralHowItWorks}
              </span>
              <div className="space-y-2 text-xs text-slate-700">
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF4E27]/10 text-[#FF4E27] font-black flex items-center justify-center shrink-0">1</span>
                  <span>{t.referralStep1}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF4E27]/10 text-[#FF4E27] font-black flex items-center justify-center shrink-0">2</span>
                  <span>{t.referralStep2}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF4E27]/10 text-[#FF4E27] font-black flex items-center justify-center shrink-0">3</span>
                  <span>{t.referralStep3}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Following & Subscriptions */}
        {activeTab === 'following' && (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Header Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50/60 to-white border-2 border-orange-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4E27] to-[#FF7849] text-white flex items-center justify-center shadow-md shadow-[#FF4E27]/25 shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-xl text-slate-900 leading-tight">
                      Mes Abonnements ({followedProfiles.length})
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Les chefs, ambassadeurs et créateurs culinaires dont vous suivez l'actualité
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-[#FF4E27]">
                  {followedProfiles.length} abonnements
                </span>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-orange-100/80">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={followingSearchQuery}
                    onChange={(e) => setFollowingSearchQuery(e.target.value)}
                    placeholder="Rechercher un chef, pays, spécialité..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#FF4E27]"
                  />
                  {followingSearchQuery && (
                    <button
                      onClick={() => setFollowingSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                  <button
                    onClick={() => setFollowingFilterRole('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      followingFilterRole === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setFollowingFilterRole('chef')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      followingFilterRole === 'chef' ? 'bg-[#FF4E27] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Chefs
                  </button>
                  <button
                    onClick={() => setFollowingFilterRole('member')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      followingFilterRole === 'member' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Membres
                  </button>
                </div>
              </div>
            </div>

            {/* Followed Profiles List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Comptes suivis ({filteredFollowedProfiles.length})
              </span>

              {filteredFollowedProfiles.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <Users className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">
                    {followingSearchQuery ? 'Aucun résultat pour cette recherche' : 'Vous ne suivez aucun profil pour le moment'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {followingSearchQuery ? 'Essayez un autre mot-clé.' : 'Découvrez nos chefs recommandés ci-dessous et commencez à vous abonner !'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredFollowedProfiles.map((user: User) => (
                    <div
                      key={user.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200"
                          />
                          <span className="absolute -bottom-1 -right-1 text-base">
                            {user.countryFlag}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-serif font-black text-sm text-slate-900 truncate">
                              {user.name}
                            </span>
                            {user.isVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4E27]" />
                            )}
                            <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                              user.role === 'chef' ? 'bg-orange-100 text-[#FF4E27]' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {user.role === 'chef' ? 'Chef' : 'Gourmet'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 font-mono">
                            {user.handle} · {user.country}
                          </p>

                          {user.specialties && user.specialties.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 mt-1">
                              {user.specialties.slice(0, 3).map((spec: string, i: number) => (
                                <span key={i} className="px-1.5 py-0.2 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {onToggleFollow && (
                          <FollowButton
                            targetUserId={user.id}
                            targetUserName={user.name}
                            isFollowing={true}
                            onToggleFollow={onToggleFollow}
                            size="sm"
                            variant="solid"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Creators to Follow */}
            {suggestedProfiles.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Suggestions de Chefs à Suivre</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Découvrez leurs recettes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestedProfiles.slice(0, 4).map((sugg: User) => (
                    <div
                      key={sugg.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={sugg.avatar}
                          alt={sugg.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {sugg.name}
                            </span>
                            <span>{sugg.countryFlag}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {sugg.specialties?.[0] || 'Gastronomie'} · {sugg.followersCount.toLocaleString()} abonnés
                          </span>
                        </div>
                      </div>

                      {onToggleFollow && (
                        <FollowButton
                          targetUserId={sugg.id}
                          targetUserName={sugg.name}
                          isFollowing={false}
                          onToggleFollow={onToggleFollow}
                          size="xs"
                          variant="solid"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Account & security (Supabase Auth) */}
        {activeTab === 'auth' && (
          <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto bg-gradient-to-b from-orange-50/30 via-white to-amber-50/20">

            <div className="flex flex-col items-center justify-center text-center space-y-3 pt-1">
              <div className="relative flex items-center justify-center p-3 rounded-3xl bg-white/95 border border-orange-200/80 shadow-[0_8px_30px_rgba(255,78,39,0.12)]">
                <AfrodeliciousLogo size="md" showTagline variant="full" />
              </div>
              <h3 className="font-serif font-black text-2xl text-slate-900 tracking-tight">
                Compte & Sécurité
              </h3>
            </div>

            {/* Signed-in account */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Connecté en tant que</span>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Mail className="w-4 h-4 text-[#FF4E27]" />
                <span className="truncate">{currentUser.email}</span>
              </div>
              <span className="text-[11px] text-slate-500 block">
                Rôle : {currentUser.role === 'admin' ? 'Administrateur' : 'Membre'}
              </span>
            </div>

            {/* Change password */}
            <form onSubmit={handleChangePassword} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3" noValidate>
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#FF4E27]" />
                <span>Modifier mon mot de passe</span>
              </h4>

              {passwordFeedback && (
                <div
                  role={passwordFeedback.type === 'error' ? 'alert' : 'status'}
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    passwordFeedback.type === 'error' ? 'bg-rose-50 border border-rose-200 text-rose-800' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {passwordFeedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <span>{passwordFeedback.message}</span>
                </div>
              )}

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  aria-label="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none bg-slate-50/50 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  aria-label="Confirmer le nouveau mot de passe"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirmer le nouveau mot de passe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none bg-slate-50/50 font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-400">8 caractères minimum, avec au moins une lettre et un chiffre.</p>
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-black transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isUpdatingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Mettre à jour le mot de passe</span>
              </button>
            </form>

            {/* Sign out */}
            <button
              type="button"
              onClick={handleSignOutClick}
              disabled={isSigningOut}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] via-[#FF6036] to-[#F59E0B] hover:from-[#E03814] hover:to-[#FF4E27] text-white text-xs sm:text-sm font-black tracking-wide transition-all shadow-md shadow-[#FF4E27]/30 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSigningOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              <span>Se déconnecter</span>
            </button>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => openLegalTab('terms')}
                className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
              >
                Conditions Générales (CGU) et Politique de Confidentialité
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Badges Progression & Criteria Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        user={currentUser}
        recipes={recipes}
        onOpenCreateRecipe={() => {
          onClose();
          onOpenCreateRecipe?.();
        }}
      />

      {/* Legal Information & Feedback Modal */}
      <LegalInformationModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalInitialTab}
        language={language}
      />

      {/* Invoice Modal Preview & Download */}
      <InvoiceModal
        isOpen={Boolean(selectedOrderForInvoice)}
        onClose={() => setSelectedOrderForInvoice(null)}
        order={selectedOrderForInvoice}
        currentUser={currentUser}
      />
    </div>
  );
};
