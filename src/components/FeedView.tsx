import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Clock, 
  Flame, 
  ChefHat, 
  CheckCircle2, 
  Sparkles, 
  CalendarPlus, 
  ArrowRight, 
  TrendingUp, 
  MapPin, 
  Camera, 
  Plus,
  ChevronRight,
  ChevronLeft,
  Zap,
  Film,
  Layers,
  RefreshCw
} from 'lucide-react';
import { Recipe, User, Story } from '../types';
import { CulinaryBadgeChip } from './CulinaryBadgeChip';
import { getAuthorCulinaryBadge } from '../utils/badgeSystem';
import { StoriesBar } from './StoriesBar';
import { CategoriesBar } from './CategoriesBar';
import { VerticalRecipeSlides } from './VerticalRecipeSlides';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { AdBanner } from './AdBanner';
import { FollowButton } from './FollowButton';
import { ShareableItem } from './ShareModal';

interface FeedViewProps {
  recipes: Recipe[];
  currentUser: User;
  stories: Story[];
  /** False when an administrator switched the Stories module off. */
  showStories?: boolean;
  onOpenStory: (storyId: string) => void;
  /** Omitted when the Stories module is switched off. */
  onOpenCreateStory?: () => void;
  onSelectRecipe: (recipeId: string) => void;
  onToggleLike: (recipeId: string) => void;
  onToggleBookmark: (recipeId: string) => void;
  onAddToMealPlan: (recipe: Recipe) => void;
  onFilterCountry: (countryName: string) => void;
  onOpenCreateRecipe: () => void;
  onOpenImportUrl: () => void;
  /** Omitted when the AI photo-scan module is switched off. */
  onOpenScanPhoto?: () => void;
  followedUserIds?: string[];
  onToggleFollow?: (userId: string, userName?: string) => void;
  onOpenShare?: (item: ShareableItem) => void;
  language?: SupportedLanguage;
}

const REGION_STORIES = [
  { name: 'Sénégal', flag: '🇸🇳', dish: 'Ceebu Jën', count: 18 },
  { name: 'Côte d\'Ivoire', flag: '🇨🇮', dish: 'Attiéké Garba', count: 14 },
  { name: 'Haïti', flag: '🇭🇹', dish: 'Griot & Djon Djon', count: 12 },
  { name: 'Martinique', flag: '🇲🇶', dish: 'Colombo Cabri', count: 15 },
  { name: 'Guadeloupe', flag: '🇬🇵', dish: 'Bokit & Accras', count: 16 },
  { name: 'Jamaïque', flag: '🇯🇲', dish: 'Jerk Chicken', count: 10 },
  { name: 'Cameroun', flag: '🇨🇲', dish: 'Poulet DG', count: 9 },
  { name: 'Nigeria', flag: '🇳🇬', dish: 'Jollof Rice', count: 17 }
];

export const FeedView: React.FC<FeedViewProps> = ({
  recipes,
  currentUser,
  stories,
  showStories = true,
  onOpenStory,
  onOpenCreateStory,
  onSelectRecipe,
  onToggleLike,
  onToggleBookmark,
  onAddToMealPlan,
  onFilterCountry,
  onOpenCreateRecipe,
  onOpenImportUrl,
  onOpenScanPhoto,
  followedUserIds = [],
  onToggleFollow,
  onOpenShare,
  language = 'fr'
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedToast, setCopiedToast] = useState(false);
  const trendingSliderRef = useRef<HTMLDivElement>(null);
  const quickSliderRef = useRef<HTMLDivElement>(null);
  const chefsSliderRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.fr;

  const handleShare = (recipe: Recipe) => {
    if (onOpenShare) {
      onOpenShare({
        id: recipe.id,
        type: 'recipe',
        title: recipe.title,
        description: recipe.description,
        image: recipe.imageUrl,
        authorName: recipe.authorName,
        authorHandle: recipe.authorHandle,
        country: recipe.country,
        countryFlag: recipe.countryFlag,
        prepTime: `${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min`,
        difficulty: recipe.difficulty,
        ingredientsCount: recipe.ingredients.length,
      });
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const scrollTrending = (dir: 'left' | 'right') => {
    if (trendingSliderRef.current) {
      trendingSliderRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  const scrollQuick = (dir: 'left' | 'right') => {
    if (quickSliderRef.current) {
      quickSliderRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  const scrollChefs = (dir: 'left' | 'right') => {
    if (chefsSliderRef.current) {
      chefsSliderRef.current.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });
    }
  };

  // Filter recipes by selected category
  const filteredRecipes = recipes.filter(r => {
    if (!selectedCategory || selectedCategory === 'all') return true;
    const catLower = selectedCategory.toLowerCase();
    const recipeCatLower = r.category.toLowerCase();
    const recipeTitleLower = r.title.toLowerCase();
    const recipeDescLower = r.description.toLowerCase();
    return (
      recipeCatLower.includes(catLower) ||
      recipeTitleLower.includes(catLower) ||
      recipeDescLower.includes(catLower)
    );
  });

  // Infinite Scroll on feed
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const feedSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoadingMore && visibleCount < filteredRecipes.length) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount(prev => Math.min(prev + 3, filteredRecipes.length));
          setIsLoadingMore(false);
        }, 550);
      }
    }, { rootMargin: '200px' });

    if (feedSentinelRef.current) {
      observer.observe(feedSentinelRef.current);
    }
    return () => observer.disconnect();
  }, [visibleCount, isLoadingMore, filteredRecipes.length]);

  // Fast recipes for horizontal slide 2
  const quickRecipes = recipes.filter(r => (r.prepTimeMinutes + r.cookTimeMinutes) <= 35);
  const displayQuickRecipes = quickRecipes.length >= 3 ? quickRecipes : recipes.slice(2, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Lien de la recette copié dans le presse-papiers !</span>
        </div>
      )}

      {/* Feed Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <span>Afrodelicious Feed</span>
            <span className="text-xl">✨</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Plongez au cœur des saveurs d’Afrique et des Caraïbes · Recettes, histoires & partages
          </p>
        </div>
      </div>

      {/* Main Feed Content */}
      <div className="space-y-8">
        {/* 1. Live Stories Tray */}
          {showStories && onOpenCreateStory && (
            <StoriesBar
              stories={stories}
              currentUser={currentUser}
              onOpenStory={onOpenStory}
              onOpenCreateStory={onOpenCreateStory}
            />
          )}

          {/* 2. Horizontal Categories Carousel (14 requested categories with icons) */}
          <div className="space-y-1">
            <CategoriesBar
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              language={language}
            />
          </div>

          {/* 3. Horizontal Slide 1: Tendances Afro-Caribéennes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FF4E27]" />
                <h2 className="font-serif font-black text-lg sm:text-xl text-slate-900">
                  {t.trending}
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollTrending('left')}
                  className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-all"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollTrending('right')}
                  className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-all"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Slides Track 1 */}
            <div
              ref={trendingSliderRef}
              className="flex items-stretch gap-4 overflow-x-auto scroll-smooth no-scrollbar py-1 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {recipes.slice(0, 6).map((recipe) => (
                <div
                  key={`trending-${recipe.id}`}
                  onClick={() => onSelectRecipe(recipe.id)}
                  className="w-72 sm:w-80 shrink-0 bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-[#FF4E27]/50 transition-all cursor-pointer group flex flex-col justify-between snap-start"
                >
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Country and Category tags */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                        {recipe.countryFlag} {recipe.country}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(recipe.id);
                        }}
                        className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                          recipe.isBookmarked ? 'bg-[#FF4E27] text-white' : 'bg-black/50 text-white hover:bg-black/70'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${recipe.isBookmarked ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom title on image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#F59E0B] block">
                        {recipe.category}
                      </span>
                      <h3 className="font-serif font-black text-sm sm:text-base leading-tight truncate">
                        {recipe.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Footer info */}
                  <div className="p-3.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <img
                        src={recipe.authorAvatar}
                        alt={recipe.authorName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-bold text-slate-800 text-[11px] truncate max-w-[110px]">
                        {recipe.authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <Clock className="w-3 h-3 text-[#F59E0B]" />
                        <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</span>
                      </span>
                      <span className="flex items-center gap-1 text-[#FF4E27] font-bold">
                        <Heart className="w-3 h-3 fill-[#FF4E27]" />
                        <span>{recipe.likesCount}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal Slide 2: Recettes Express & Faciles (< 35 min) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h2 className="font-serif font-black text-lg sm:text-xl text-slate-900">
                  {t.quickRecipes || 'Recettes Express (< 30 min)'}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                  Street food & Rapide
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollQuick('left')}
                  className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-all"
                  aria-label="Previous quick slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollQuick('right')}
                  className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-all"
                  aria-label="Next quick slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Slides Track 2 */}
            <div
              ref={quickSliderRef}
              className="flex items-stretch gap-4 overflow-x-auto scroll-smooth no-scrollbar py-1 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayQuickRecipes.map((recipe) => (
                <div
                  key={`quick-${recipe.id}`}
                  onClick={() => onSelectRecipe(recipe.id)}
                  className="w-72 sm:w-80 shrink-0 bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between snap-start"
                >
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                        {recipe.countryFlag} {recipe.country}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <span className="px-2 py-0.8 rounded-lg bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                        ⚡ {recipe.prepTimeMinutes + recipe.cookTimeMinutes}m
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                        {recipe.category}
                      </span>
                      <h3 className="font-serif font-black text-sm sm:text-base leading-tight truncate">
                        {recipe.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <img
                        src={recipe.authorAvatar}
                        alt={recipe.authorName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-bold text-slate-800 text-[11px] truncate max-w-[110px]">
                        {recipe.authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[#FF4E27] font-bold">
                        <Heart className="w-3 h-3 fill-[#FF4E27]" />
                        <span>{recipe.likesCount}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Terroirs & Régions Culinaires Filters */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF4E27]" />
                <span>Terroirs Gourmands d'Afrique & des Caraïbes</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Filtrer par tradition
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {REGION_STORIES.map((region, idx) => (
                <button
                  key={idx}
                  onClick={() => onFilterCountry(region.name)}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#FF4E27] hover:shadow-sm transition-all shrink-0 min-w-[100px] group shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {region.flag}
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#FF4E27] transition-colors">
                    {region.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium truncate max-w-[85px]">
                    {region.dish}
                  </span>
                </button>
              ))}
            </div>
          </div>

      {/* 5. Main Grid: Feed Stream (Left 2 cols) + Discovery Sidebar (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Social Feed */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Create Bar */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF4E27] shrink-0">
                <ChefHat className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block">
                  Une idée de plat ou un secret de grand-mère ?
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Partagez une recette ou diffusez une story avec vos abonnés
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {onOpenCreateStory && (
                <button
                  onClick={onOpenCreateStory}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF4E27] text-xs font-bold border border-orange-200/60 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Story</span>
                </button>
              )}
              <button
                onClick={onOpenImportUrl}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                Importer URL
              </button>
              <button
                onClick={onOpenCreateRecipe}
                className="px-4 py-2 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publier</span>
              </button>
            </div>
          </div>

          {/* Vertical Slides / Reels Spotlight directly in Feed */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#FF4E27] text-white">
                  <Film className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif font-black text-sm sm:text-base text-white">
                    {t.verticalSlidesSpotlight || 'Découverte en Slides Verticaux (Reels)'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Glissez de haut en bas ou naviguez avec les flèches pour zapper entre les créations
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectRecipe(recipes[0]?.id || '')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 shrink-0 cursor-pointer"
              >
                Découvrir ↗
              </button>
            </div>

            {/* Embedded Vertical Slide Player */}
            <VerticalRecipeSlides
              recipes={filteredRecipes.length > 0 ? filteredRecipes.slice(0, 8) : recipes.slice(0, 8)}
              currentUser={currentUser}
              onSelectRecipe={onSelectRecipe}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
              onAddToMealPlan={onAddToMealPlan}
              onShareRecipe={handleShare}
              isCompact
            />
          </div>

          {/* Social Recipe Cards */}
          <div className="space-y-6">
            {filteredRecipes.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                <ChefHat className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-serif font-black text-lg text-slate-900">
                  Aucune recette trouvée dans cette catégorie
                </h3>
                <p className="text-xs text-slate-500">
                  Soyez le premier à partager une création gourmande dans cette catégorie !
                </p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Voir toutes les recettes
                </button>
              </div>
            ) : (
              <>
                {filteredRecipes.slice(0, visibleCount).map((recipe, index) => (
                  <React.Fragment key={recipe.id}>
                    <article 
                      className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-[0_2px_14px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-all"
                    >
                      {/* Card Header: Author info */}
                      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={recipe.authorAvatar}
                            alt={recipe.authorName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">
                                {recipe.authorName}
                              </span>
                              {recipe.authorRole === 'chef' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4E27]" />
                              )}
                              <CulinaryBadgeChip
                                badge={getAuthorCulinaryBadge(recipe.authorName, recipe.authorId, recipes)}
                                size="xs"
                              />
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                              <span>{recipe.authorHandle}</span>
                              <span>·</span>
                              <span>{recipe.countryFlag} {recipe.country}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {onToggleFollow && recipe.authorId !== currentUser.id && (
                            <FollowButton
                              targetUserId={recipe.authorId}
                              targetUserName={recipe.authorName}
                              isFollowing={followedUserIds.includes(recipe.authorId)}
                              onToggleFollow={onToggleFollow}
                              size="xs"
                              variant="subtle"
                            />
                          )}
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#FF4E27] block">
                              {recipe.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Niveau {recipe.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Recipe Cover Image */}
                      <div 
                        onClick={() => onSelectRecipe(recipe.id)}
                        className="relative h-64 sm:h-80 w-full cursor-pointer overflow-hidden group"
                      >
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                          <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl">
                            <span>{t.viewRecipe}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      {/* Card Content & Story */}
                      <div className="p-5 space-y-3">
                        <div 
                          onClick={() => onSelectRecipe(recipe.id)}
                          className="cursor-pointer"
                        >
                          <h2 className="font-serif font-black text-lg sm:text-xl text-slate-900 hover:text-[#FF4E27] transition-colors leading-snug">
                            {recipe.title}
                          </h2>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                            {recipe.description}
                          </p>
                        </div>

                        {/* Quick Metadata */}
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                          <span className="flex items-center gap-1 text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                          </span>
                          <span>·</span>
                          <span>{recipe.ingredients.length} ingrédients</span>
                          <span>·</span>
                          <span>{recipe.servings} convives</span>
                        </div>

                        {/* Actions Bar */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => onToggleLike(recipe.id)}
                              className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                                recipe.isLiked ? 'text-[#FF4E27]' : 'text-slate-500 hover:text-[#FF4E27]'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${recipe.isLiked ? 'fill-[#FF4E27]' : ''}`} />
                              <span>{recipe.likesCount}</span>
                            </button>

                            <button
                              onClick={() => onSelectRecipe(recipe.id)}
                              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{recipe.commentsCount}</span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(recipe);
                              }}
                              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#FF4E27] transition-colors p-1 rounded-lg hover:bg-orange-50/60"
                              title="Partager sur WhatsApp, Signal & tous les réseaux"
                            >
                              <Share2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Partager</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onAddToMealPlan(recipe)}
                              title="Ajouter au menu de la semaine"
                              className="p-2 rounded-xl text-[#0F3E2E] hover:bg-emerald-50 transition-colors"
                            >
                              <CalendarPlus className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => onToggleBookmark(recipe.id)}
                              title="Sauvegarder la recette"
                              className={`p-2 rounded-xl transition-colors ${
                                recipe.isBookmarked 
                                  ? 'text-[#FF4E27] bg-orange-50' 
                                  : 'text-slate-500 hover:bg-slate-100'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${recipe.isBookmarked ? 'fill-[#FF4E27]' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>

                    {/* Intersperse AdSense / AdMob banner every 3 items (suppressed if Afrodelicious+ Plus) */}
                    {(index + 1) % 3 === 0 && (
                      <AdBanner format="feed_native" className="my-4" isPlusMember={currentUser.isPlusMember} />
                    )}
                  </React.Fragment>
                ))}

                {/* Infinite Scroll Trigger Sentinel */}
                <div ref={feedSentinelRef} className="py-6 text-center">
                  {isLoadingMore ? (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs inline-flex items-center gap-2 text-xs font-bold text-slate-700 animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#FF4E27]" />
                      <span>Chargement de nouvelles pépites culinaires...</span>
                    </div>
                  ) : visibleCount >= filteredRecipes.length ? (
                    <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 text-xs font-semibold text-slate-600 inline-block">
                      ✨ Vous avez exploré toutes les recettes du fil d'actualité !
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400">
                      Faites défiler vers le bas pour charger automatiquement d'autres recettes...
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Spotlight Masterclass banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0F3E2E] text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Masterclass en Vedette</span>
              </span>
              <h3 className="font-serif font-black text-base text-white leading-snug">
                L'Art Secret du Ceebu Jën Royal & des Sauces Bissap
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Par Cheffe Fatou Ndiaye. 4 leçons vidéo complètes pour réussir la croûte dorée Xonx.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onSelectRecipe('rec-thieb')}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-bold text-center transition-colors shadow-xs"
                >
                  Voir la masterclass (29.99 €)
                </button>
              </div>
            </div>
          </div>

          {/* Trending Spices & Ingredients */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-[#FF4E27]" />
              <span>Épices & Saveurs Tendance</span>
            </div>
            
            <div className="space-y-2.5">
              {[
                { name: 'Piment Scotch Bonnet', origin: 'Caraïbes', note: 'Chaleur fruitée intense' },
                { name: 'Guedj & Yet fermenté', origin: 'Sénégal', note: 'L\'umami marin par excellence' },
                { name: 'Poudre de Colombo artisanal', origin: 'Antilles', note: 'Moutarde torréfiée & coriandre' },
                { name: 'Poivre blanc de Penja', origin: 'Cameroun', note: 'Grand cru volcanique certifié' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-none">
                  <div>
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-[10px] text-slate-500">{item.note}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">{item.origin}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Chef tip */}
          <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <span className="text-[10px] font-bold text-[#0F3E2E] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Le Conseil du Jour</span>
            </span>
            <h4 className="font-serif font-black text-xs text-slate-900">
              Pour des bananes plantains fondantes :
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choisissez des peaux bien tachetées de noir ! Le plantain jaune est plus ferme et moins sucré, idéal pour les frites salées ou les bananes pesées haïtiennes.
            </p>
          </div>

        </div>

      </div>
    </div>
  </div>
  );
};
