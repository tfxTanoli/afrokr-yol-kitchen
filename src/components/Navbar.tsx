import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  CalendarDays, 
  Bookmark, 
  Bell, 
  Search, 
  CheckCircle2, 
  Menu, 
  X, 
  PlusCircle, 
  Globe2, 
  ShieldCheck, 
  ShoppingCart, 
  Home, 
  Sparkles,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  UtensilsCrossed,
  Truck,
  Award,
  Layers,
  Users,
  Star,
  User as UserIcon,
  LogIn,
  Wallet,
  Camera,
  Link as LinkIcon,
  Plus,
  Crown,
  Clock,
  Trash2,
  History
} from 'lucide-react';
import { User, Recipe, PlatformFeatureFlags } from '../types';
import { CulinaryBadgeChip } from './CulinaryBadgeChip';
import { getAuthorCulinaryBadge } from '../utils/badgeSystem';
import { AfrodeliciousLogo } from './AfrodeliciousLogo';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';
import { useRecentSearches } from '../utils/recentSearches';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onOpenAuth: (tab?: 'profile' | 'feed' | 'orders' | 'referral' | 'following' | 'auth') => void;
  onOpenBookmarks: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  bookmarkedCount?: number;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onOpenCreateStory?: () => void;
  onOpenAdminDashboard?: () => void;
  recipes?: Recipe[];
  language?: SupportedLanguage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
  featureFlags?: PlatformFeatureFlags;
  onOpenOnboarding?: () => void;
  onOpenCreateRecipe?: () => void;
  onOpenImportUrl?: () => void;
  onOpenScanPhoto?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenBookmarks,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  bookmarkedCount = 0,
  searchQuery = '',
  setSearchQuery = () => {},
  onOpenCreateStory,
  onOpenAdminDashboard,
  onOpenOnboarding,
  onOpenCreateRecipe,
  onOpenImportUrl,
  onOpenScanPhoto,
  recipes = [],
  language = 'fr',
  onSelectLanguage = () => {},
  featureFlags
}) => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [hubDropdownOpen, setHubDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const hubRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Recent searches hook (persisted in localStorage)
  const { recentSearches, addSearch, removeSearch, clearSearches, trendingSearches } = useRecentSearches();

  const t = TRANSLATIONS[language] || TRANSLATIONS.fr;
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Close Hub dropdown, Language dropdown, and Search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hubRef.current && !hubRef.current.contains(event.target as Node)) {
        setHubDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close drawers and dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSideMenuOpen(false);
        setLangDropdownOpen(false);
        setHubDropdownOpen(false);
        setIsSearchDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. Primary Navigation Bar Items: Home, Explore, Saved, List, Planner
  const primaryNavItems = [
    { id: 'feed', label: 'Home', icon: Home, visible: true },
    { id: 'explore', label: 'Explore', icon: Compass, visible: true },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: bookmarkedCount, visible: featureFlags?.savedRecipes !== false },
    { id: 'list', label: 'List', icon: ShoppingCart, visible: featureFlags?.grocery !== false },
    { id: 'planner', label: 'Planner', icon: CalendarDays, visible: featureFlags?.planner !== false },
  ].filter(item => item.visible);

  // 2. Hub items requested: MasterClass, Experiences, Recommander un restaurant, Afrodelicious delivery food + Communautés
  const hubNavItems = [
    {
      id: 'masterclasses',
      label: 'MasterClass',
      subtitle: 'Cours & masterclasses en vidéo pas-à-pas',
      icon: GraduationCap,
      badge: 'Vidéos',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      visible: featureFlags?.masterclasses !== false
    },
    {
      id: 'experiences',
      label: 'Experiences',
      subtitle: 'Ateliers culinaires, cours & dégustations',
      icon: UtensilsCrossed,
      badge: 'Ateliers',
      badgeColor: 'bg-orange-100 text-orange-800',
      visible: featureFlags?.experiences !== false
    },
    {
      id: 'recommended',
      label: 'Recommander un restaurant',
      subtitle: 'Sélection officielle & votes gourmets',
      icon: Award,
      badge: 'Top ⭐',
      badgeColor: 'bg-amber-100 text-amber-800',
      visible: featureFlags?.recommended !== false
    },
    {
      id: 'delivery',
      label: 'Afrodelicious delivery food',
      subtitle: 'Livraison express de plats authentiques',
      icon: Truck,
      badge: 'Live 🚀',
      badgeColor: 'bg-[#FF4E27] text-white',
      visible: featureFlags?.delivery !== false
    },
    {
      id: 'communities',
      label: 'Cercles & Communautés',
      subtitle: 'Groupes thématiques par centres d\'intérêt',
      icon: Users,
      badge: 'Nouveau',
      badgeColor: 'bg-purple-100 text-purple-800',
      visible: true
    }
  ].filter(item => item.visible);

  // Check if active tab belongs to the Hub
  const isHubActive = hubNavItems.some(item => item.id === activeTab);
  const activeHubItem = hubNavItems.find(item => item.id === activeTab);

  return (
    <>
      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all">
        
        {/* Row 1: Brand Logo, Search Bar & The 4 Harmonized Controls */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            
            {/* Left: Official Afrodelicious Brand Logo */}
            <div 
              onClick={() => setActiveTab('feed')} 
              className="cursor-pointer shrink-0 transition-transform active:scale-95 flex items-center"
              title="Afrodelicious - Accueil"
            >
              <AfrodeliciousLogo size="md" showTagline />
            </div>

            {/* Center: Global Search Bar with Search History */}
            <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-6 relative" ref={searchContainerRef}>
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchDropdownOpen(true)}
                  onClick={() => setIsSearchDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!isSearchDropdownOpen) setIsSearchDropdownOpen(true);
                    if (activeTab !== 'explore' && activeTab !== 'feed') {
                      setActiveTab('explore');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (searchQuery.trim()) {
                        addSearch(searchQuery.trim());
                      }
                      setIsSearchDropdownOpen(false);
                      if (activeTab !== 'explore') {
                        setActiveTab('explore');
                      }
                    }
                  }}
                  placeholder={t.navSearchPlaceholder}
                  className="w-full bg-slate-100/90 hover:bg-slate-100 text-xs text-slate-900 placeholder-slate-400 pl-9 pr-8 py-2 rounded-xl border border-transparent focus:border-[#FF4E27] focus:bg-white focus:outline-none transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery('');
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
                    title="Effacer"
                    aria-label="Effacer la recherche"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dropdown: Recent Searches & Suggestions */}
              {isSearchDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 px-3 z-50 text-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Recent Searches Header */}
                  <div className="flex items-center justify-between px-1.5 pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-[#FF4E27]" />
                      Recherches récentes
                    </span>
                    {recentSearches.length > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSearches();
                        }}
                        className="text-[11px] text-slate-400 hover:text-red-500 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        title="Effacer tout l'historique"
                      >
                        <Trash2 className="w-3 h-3" />
                        Effacer tout
                      </button>
                    )}
                  </div>

                  {/* List of Recent Searches */}
                  {recentSearches.length > 0 ? (
                    <div className="py-1.5 max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-orange-50/70 transition-colors group"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery(term);
                              addSearch(term);
                              setIsSearchDropdownOpen(false);
                              if (activeTab !== 'explore') {
                                setActiveTab('explore');
                              }
                            }}
                            className="flex-1 flex items-center gap-2 text-left text-xs font-medium text-slate-700 group-hover:text-[#FF4E27] truncate cursor-pointer"
                          >
                            <History className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF4E27] shrink-0" />
                            <span className="truncate">{term}</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSearch(term);
                            }}
                            className="text-slate-300 hover:text-red-500 p-1 rounded-md hover:bg-white/80 transition-colors shrink-0 cursor-pointer"
                            title="Supprimer cette recherche"
                            aria-label={`Supprimer ${term}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-3 px-2 text-center text-xs text-slate-400">
                      <History className="w-4 h-4 mx-auto mb-1 text-slate-300 opacity-80" />
                      Aucune recherche récente
                    </div>
                  )}

                  {/* Trending / Popular Suggestions */}
                  {trendingSearches.length > 0 && (
                    <div className="mt-1 pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1.5 mb-1.5">
                        Tendances afro-culinaires
                      </p>
                      <div className="flex flex-wrap gap-1.5 px-1 pb-1">
                        {trendingSearches.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setSearchQuery(item);
                              addSearch(item);
                              setIsSearchDropdownOpen(false);
                              if (activeTab !== 'explore') {
                                setActiveTab('explore');
                              }
                            }}
                            className="text-[11px] font-medium px-2 py-1 bg-slate-100 hover:bg-orange-100 hover:text-[#FF4E27] text-slate-600 rounded-lg transition-colors cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: The 4 Core Harmonized Controls (Langue, Notification, Profil, Bouton à 3 traits) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* 1. Bouton Langue */}
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className={`h-10 sm:h-11 px-2.5 sm:px-3 rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-xs flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4E27]/30 ${
                    langDropdownOpen 
                      ? 'border-[#FF4E27] bg-orange-50 text-[#FF4E27]' 
                      : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                  title="Changer de langue / Select language"
                  aria-label="Changer de langue"
                >
                  <span className="text-base leading-none select-none">{currentLangObj.flag}</span>
                  <span className="uppercase text-[11px] font-black tracking-wider font-mono hidden sm:inline">
                    {currentLangObj.code}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180 text-[#FF4E27]' : ''}`} />
                </button>

                {/* Dropdown Langue */}
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      Langues / Languages
                    </div>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onSelectLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-left transition-colors cursor-pointer ${
                          language === lang.code ? 'bg-orange-50 text-[#FF4E27] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </span>
                        {language === lang.code && <CheckCircle2 className="w-4 h-4 text-[#FF4E27]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Cloche de Notification */}
              <button
                type="button"
                onClick={onOpenNotifications}
                title="Notifications in-app"
                aria-label="Notifications"
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-2xs hover:shadow-xs flex items-center justify-center relative transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4E27]/30"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 group-hover:text-[#FF4E27] group-hover:rotate-12 transition-all duration-200" />
                {unreadNotificationsCount > 0 ? (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-gradient-to-r from-[#DC2626] to-[#FF4E27] text-[9px] font-black text-white shadow-md shadow-[#FF4E27]/40 ring-2 ring-white animate-pulse">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                ) : (
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#FF4E27] opacity-60 ring-1 ring-white" />
                )}
              </button>

              {/* 3. Profil Utilisateur */}
              <button
                type="button"
                onClick={() => onOpenAuth('profile')}
                title={`Profil de ${currentUser.name}`}
                aria-label="Profil utilisateur"
                className="h-10 sm:h-11 p-1 sm:pl-1.5 sm:pr-3 rounded-2xl border border-slate-200/90 hover:border-orange-300 bg-white hover:bg-orange-50/50 shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#FF4E27]/30"
              >
                <div className="relative shrink-0">
                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#FF4E27] via-amber-400 to-[#FF7849] group-hover:scale-105 transition-transform duration-200">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-white"
                    />
                  </div>
                  {/* Active online dot */}
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  <span className="absolute -bottom-1 -right-1 text-[10px] select-none">
                    {currentUser.countryFlag}
                  </span>
                </div>

                <div className="hidden lg:block text-left">
                  <div className="flex items-center gap-1 leading-tight">
                    <span className="text-xs font-black text-slate-900 max-w-[105px] truncate group-hover:text-[#FF4E27] transition-colors">
                      {currentUser.name}
                    </span>
                    {currentUser.role === 'chef' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4E27] shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <CulinaryBadgeChip badge={getAuthorCulinaryBadge(currentUser.name, currentUser.id, recipes)} size="xs" />
                  </div>
                </div>
              </button>

              {/* 4. Bouton à 3 traits du menu (Hamburger Menu) */}
              <button
                type="button"
                onClick={() => setSideMenuOpen(!sideMenuOpen)}
                title="Menu Afrodelicious (3 traits)"
                aria-label="Menu principal"
                className={`h-10 w-10 sm:h-11 sm:w-11 rounded-2xl border shadow-2xs hover:shadow-xs flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#FF4E27]/30 ${
                  sideMenuOpen
                    ? 'border-[#FF4E27] bg-orange-50 text-[#FF4E27]'
                    : 'border-slate-200/90 bg-white hover:bg-orange-50/70 hover:border-orange-300 text-slate-800 hover:text-[#FF4E27]'
                }`}
              >
                {/* 3 traits horizontaux avec animation douce */}
                <span className={`block h-[2.5px] w-5 rounded-full transition-all duration-300 origin-center ${
                  sideMenuOpen ? 'rotate-45 translate-y-[6.5px] bg-[#FF4E27]' : 'bg-slate-700 group-hover:bg-[#FF4E27]'
                }`} />
                <span className={`block h-[2.5px] w-5 rounded-full transition-all duration-200 ${
                  sideMenuOpen ? 'opacity-0 scale-x-0' : 'bg-slate-700 group-hover:bg-[#FF4E27]'
                }`} />
                <span className={`block h-[2.5px] w-5 rounded-full transition-all duration-300 origin-center ${
                  sideMenuOpen ? '-rotate-45 -translate-y-[6.5px] bg-[#FF4E27]' : 'bg-slate-700 group-hover:bg-[#FF4E27]'
                }`} />
              </button>

            </div>

          </div>
        </div>

      </header>

      {/* Slide-over Menu Drawer (Activé par le bouton à 3 traits) */}
      {sideMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop avec flou */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setSideMenuOpen(false)}
          />

          {/* Panneau coulissant */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] max-w-full bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200/80">
            
            {/* Header du Drawer */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div 
                onClick={() => {
                  setActiveTab('feed');
                  setSideMenuOpen(false);
                }} 
                className="cursor-pointer"
              >
                <AfrodeliciousLogo size="sm" showTagline />
              </div>
              <button
                type="button"
                onClick={() => setSideMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu Scrollable du Menu */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              
              {/* Carte Profil Utilisateur */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50/30 border border-orange-200/80 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FF4E27]"
                    />
                    <span className="absolute -bottom-1 -right-1 text-sm">
                      {currentUser.countryFlag}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-slate-900 truncate">{currentUser.name}</span>
                      {currentUser.role === 'chef' && <CheckCircle2 className="w-4 h-4 text-[#FF4E27] shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email || 'Membre Gourmet'}</p>
                    <div className="mt-1">
                      <CulinaryBadgeChip badge={getAuthorCulinaryBadge(currentUser.name, currentUser.id, recipes)} size="xs" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-orange-200/60">
                  <button
                    onClick={() => {
                      onOpenAuth('profile');
                      setSideMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white hover:bg-orange-100/60 border border-orange-200 text-[#FF4E27] text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Mon Profil</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth('auth');
                      setSideMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#FF4E27] hover:bg-[#e03d16] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Compte & Sécurité</span>
                  </button>
                </div>
              </div>


              {/* Navigation Principale */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
                  Navigation Principale
                </span>
                <div className="grid grid-cols-1 gap-1">
                  {primaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSideMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#DC2626] to-[#FF4E27] text-white shadow-xs'
                            : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-white text-red-600' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Le Hub Afrodelicious (5 Services Exclusifs) */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27] block px-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Hub Afrodelicious (5 Services)
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {hubNavItems.map((hubItem) => {
                    const Icon = hubItem.icon;
                    const isItemActive = activeTab === hubItem.id;
                    return (
                      <button
                        key={hubItem.id}
                        onClick={() => {
                          setActiveTab(hubItem.id);
                          setSideMenuOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left text-xs font-bold transition-all cursor-pointer ${
                          isItemActive
                            ? 'bg-gradient-to-r from-orange-500 to-[#FF4E27] text-white shadow-xs'
                            : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{hubItem.label}</span>
                        </div>
                        {hubItem.badge && (
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            isItemActive ? 'bg-white text-orange-600' : hubItem.badgeColor
                          }`}>
                            {hubItem.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Outils Créateurs & Partage */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
                  Outils Créateurs & Cuisine
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {onOpenCreateRecipe && (
                    <button
                      onClick={() => {
                        onOpenCreateRecipe();
                        setSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-orange-50/80 hover:bg-orange-100/80 border border-orange-200/80 text-left transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#FF4E27] mb-1" />
                      <div className="text-xs font-bold text-slate-900">Publier Recette</div>
                      <div className="text-[10px] text-slate-500">Ajouter ma recette</div>
                    </button>
                  )}

                  {onOpenCreateStory && (
                    <button
                      onClick={() => {
                        onOpenCreateStory();
                        setSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200/80 text-left transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-purple-600 mb-1" />
                      <div className="text-xs font-bold text-slate-900">Diffuser Story</div>
                      <div className="text-[10px] text-slate-500">Story éphémère 24h</div>
                    </button>
                  )}

                  {onOpenScanPhoto && (
                    <button
                      onClick={() => {
                        onOpenScanPhoto();
                        setSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-left transition-all cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-emerald-600 mb-1" />
                      <div className="text-xs font-bold text-slate-900">Scanner un plat</div>
                      <div className="text-[10px] text-slate-500">Food Camera IA</div>
                    </button>
                  )}

                  {onOpenImportUrl && (
                    <button
                      onClick={() => {
                        onOpenImportUrl();
                        setSideMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200/80 text-left transition-all cursor-pointer"
                    >
                      <LinkIcon className="w-4 h-4 text-sky-600 mb-1" />
                      <div className="text-xs font-bold text-slate-900">Importer URL</div>
                      <div className="text-[10px] text-slate-500">TikTok, Insta, Web</div>
                    </button>
                  )}
                </div>
              </div>

              {/* Portefeuille E-Wallet & Monétisation (70% créateur / 30% plateforme) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Wallet className="w-4 h-4" />
                    <span>AfroWallet & Monétisation</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 font-bold">
                    70% Créateur
                  </span>
                </div>
                <div className="text-lg font-black tracking-tight">145.50 € <span className="text-xs font-normal text-emerald-100">disponible</span></div>
                <p className="text-[10px] text-emerald-100 leading-snug">
                  Vous conservez 70% de vos gains MasterClasses & Ateliers. Retrait direct via Wave ou E-Wallet.
                </p>
              </div>

              {/* Guide d'accueil & Administration */}
              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                {onOpenOnboarding && (
                  <button
                    onClick={() => {
                      onOpenOnboarding();
                      setSideMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-amber-950">Guide d'accueil Afrodelicious</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-white/80 px-2 py-0.5 rounded-full">
                      5 Étapes
                    </span>
                  </button>
                )}

                {onOpenAdminDashboard && (
                  <button
                    onClick={() => {
                      onOpenAdminDashboard();
                      setSideMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-slate-700" />
                      <span className="text-xs font-bold text-slate-900">Tableau de bord Admin</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded-full font-bold">
                      KPIs
                    </span>
                  </button>
                )}
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
              <p className="text-[10px] font-medium text-slate-400">
                Afrodelicious v2.4 · Célébration des saveurs africaines & caribéennes ❤️
              </p>
            </div>

          </div>
        </div>
      )}

      {/* THE OFFICIAL DOCKED / FLOATING MAIN NAVBAR */}
      {/* Replaces the plain bottom navbar with the elevated, animated pill navbar featuring the Hub & its 5 elements */}
      <nav 
        className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.14)] rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 flex items-center gap-1 sm:gap-2 max-w-[96vw] transition-all"
        aria-label="Navigation principale"
      >
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setHubDropdownOpen(false);
              }}
              className={`group relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#DC2626] via-[#FF4E27] to-[#DC2626] text-white shadow-[0_4px_18px_rgba(255,78,39,0.45)] ring-2 ring-red-400/30 scale-[1.02] -translate-y-0.5'
                  : 'text-slate-600 hover:text-[#DC2626] hover:bg-red-50/80 hover:scale-105 active:scale-95 bg-transparent'
              }`}
              title={item.label}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                isActive ? 'text-white scale-110 drop-shadow-xs' : 'text-slate-400 group-hover:text-[#DC2626] group-hover:-translate-y-0.5'
              }`} />
              <span className="hidden xs:inline sm:inline">{item.label}</span>
              
              {/* Active glowing indicator dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4E27] shadow-[0_0_8px_#FF4E27] animate-pulse ml-0.5" />
              )}

              {item.badge !== undefined && item.badge > 0 && (
                <span className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#FF4E27] to-[#FF7849] text-white shadow-xs' 
                    : 'bg-orange-100 text-[#FF4E27] group-hover:bg-[#FF4E27] group-hover:text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Hub Dropdown Button (MasterClass, Experiences, Recommander un restaurant, Afrodelicious delivery food, Cercles & communautés) */}
        <div className="relative shrink-0" ref={hubRef}>
          <button
            type="button"
            onClick={() => setHubDropdownOpen(!hubDropdownOpen)}
            className={`group relative flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer ${
              isHubActive
                ? 'bg-gradient-to-r from-[#FF4E27] via-[#FF5E3A] to-[#FF7849] text-white shadow-[0_6px_20px_rgba(255,78,39,0.35)] ring-1 ring-white/30 scale-[1.02] -translate-y-0.5'
                : 'text-slate-700 hover:text-[#FF4E27] hover:bg-white bg-white/80 border border-slate-200/80 shadow-2xs hover:shadow-sm hover:scale-105 active:scale-95'
            }`}
            title="Hub Afrodelicious : MasterClass, Experiences, Recommander, Delivery & Communautés"
          >
            <Layers className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:rotate-12 ${
              isHubActive ? 'text-white' : 'text-[#FF4E27]'
            }`} />
            <span>Hub</span>
            {isHubActive && activeHubItem ? (
              <span className="hidden lg:inline text-[10px] text-orange-100 font-bold max-w-[110px] truncate">
                · {activeHubItem.label}
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4E27] animate-pulse" />
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${hubDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Upward Glassmorphic Hub Popover */}
          {hubDropdownOpen && (
            <div className="absolute bottom-full mb-3 right-0 sm:left-1/2 sm:-translate-x-1/2 w-80 sm:w-96 rounded-3xl bg-white/98 backdrop-blur-2xl border border-orange-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-3 z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Le Hub Afrodelicious
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-[#FF4E27] text-white font-black shadow-xs">
                    5 Services
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                  MasterClass, Expériences, Recommandations, Livraison & Cercles
                </span>
              </div>

              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
                {hubNavItems.map((hubItem) => {
                  const Icon = hubItem.icon;
                  const isItemActive = activeTab === hubItem.id;

                  return (
                    <button
                      key={hubItem.id}
                      onClick={() => {
                        setActiveTab(hubItem.id);
                        setHubDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-2xl flex items-start gap-3 text-left transition-all duration-150 cursor-pointer group ${
                        isItemActive
                          ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-slate-900 shadow-sm'
                          : 'hover:bg-slate-50/90 hover:translate-x-0.5 text-slate-700 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <div className={`p-2 rounded-xl mt-0.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isItemActive
                          ? 'bg-gradient-to-tr from-[#FF4E27] to-[#FF7849] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-[#FF4E27]/10 group-hover:text-[#FF4E27]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs font-black truncate ${isItemActive ? 'text-[#FF4E27]' : ''}`}>
                            {hubItem.label}
                          </span>
                          {hubItem.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${hubItem.badgeColor}`}>
                              {hubItem.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {hubItem.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

