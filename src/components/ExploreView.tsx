import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  Flame, 
  Heart, 
  ChefHat, 
  X,
  Compass,
  ArrowUpDown,
  ShoppingBag,
  Check,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  PanelLeft,
  RefreshCw,
  Share2,
  SlidersHorizontal,
  Zap,
  Sparkles,
  Plus,
  Rocket,
  Gift,
  Leaf,
  UtensilsCrossed,
  ChevronRight
} from 'lucide-react';
import { Recipe, User } from '../types';
import { CulinaryBadgeChip } from './CulinaryBadgeChip';
import { getAuthorCulinaryBadge } from '../utils/badgeSystem';
import { FollowButton } from './FollowButton';
import { ShareableItem } from './ShareModal';
import { 
  searchAfroIngredients, 
  normalizeText,
  AfroIngredientCategory,
  getRecipeIngredientCategories
} from '../data/afroCaribbeanIngredients';
import { AdBanner } from './AdBanner';
import { getCountryFlag, formatCountryWithFlag } from '../utils/countryFlags';

interface ExploreViewProps {
  recipes: Recipe[];
  onSelectRecipe: (recipeId: string) => void;
  onToggleLike: (recipeId: string) => void;
  selectedCountryFilter?: string;
  onClearCountryFilter?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser?: User;
  followedUserIds?: string[];
  onToggleFollow?: (userId: string, userName?: string) => void;
  onOpenShare?: (item: ShareableItem) => void;
}

const COUNTRIES = [
  'Tous les pays',
  'Sénégal',
  'Côte d\'Ivoire',
  'Haïti',
  'Martinique',
  'Guadeloupe',
  'Jamaïque',
  'Cameroun',
  'Nigeria'
];

const CATEGORIES = [
  'Toutes les catégories',
  'Plats Traditionnels',
  'Street Food',
  'Desserts & Douceurs',
  'Sauces & Marinades',
  'Boissons & Cocktails',
  'Végétarien & Vegan'
];

const DIFFICULTIES = ['Toutes', 'Facile', 'Moyen', 'Expert'];

const INGREDIENT_CATEGORY_METAS: {
  id: AfroIngredientCategory;
  label: string;
  icon: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
}[] = [
  {
    id: 'Bases & Féculents',
    label: 'Bases & Féculents',
    icon: '🌾',
    activeBg: 'bg-amber-600',
    activeBorder: 'border-amber-700',
    activeText: 'text-white'
  },
  {
    id: 'Légumineuses',
    label: 'Légumineuses',
    icon: '🫘',
    activeBg: 'bg-emerald-600',
    activeBorder: 'border-emerald-700',
    activeText: 'text-white'
  },
  {
    id: 'Légumes & Racines',
    label: 'Légumes & Feuilles',
    icon: '🥬',
    activeBg: 'bg-green-600',
    activeBorder: 'border-green-700',
    activeText: 'text-white'
  },
  {
    id: 'Fruits Tropicaux',
    label: 'Fruits Tropicaux',
    icon: '🥭',
    activeBg: 'bg-orange-500',
    activeBorder: 'border-orange-600',
    activeText: 'text-white'
  },
  {
    id: 'Protéines',
    label: 'Protéines',
    icon: '🥩',
    activeBg: 'bg-rose-600',
    activeBorder: 'border-rose-700',
    activeText: 'text-white'
  },
  {
    id: 'Épices & Aromates',
    label: 'Épices & Aromates',
    icon: '🌿',
    activeBg: 'bg-teal-600',
    activeBorder: 'border-teal-700',
    activeText: 'text-white'
  },
  {
    id: 'Matières Grasses & Liquides',
    label: 'Huiles, Laits & Matières grasses',
    icon: '🛢️',
    activeBg: 'bg-amber-700',
    activeBorder: 'border-amber-800',
    activeText: 'text-white'
  },
  {
    id: 'Condiments & Sauces',
    label: 'Condiments & Sauces',
    icon: '🥫',
    activeBg: 'bg-purple-600',
    activeBorder: 'border-purple-700',
    activeText: 'text-white'
  }
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  recipes,
  onSelectRecipe,
  onToggleLike,
  selectedCountryFilter = 'Tous les pays',
  onClearCountryFilter,
  searchQuery,
  setSearchQuery,
  currentUser,
  followedUserIds = [],
  onToggleFollow,
  onOpenShare
}) => {
  const [selectedCountry, setSelectedCountry] = useState(selectedCountryFilter || 'Tous les pays');
  const [selectedCategory, setSelectedCategory] = useState('Toutes les catégories');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Toutes');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'time'>('popular');
  const [selectedIngredientCategories, setSelectedIngredientCategories] = useState<AfroIngredientCategory[]>([]);
  const [ingredientMatchMode, setIngredientMatchMode] = useState<'any' | 'all'>('any');
  const [isIngredientPanelExpanded, setIsIngredientPanelExpanded] = useState(true);
  const [filterLayoutMode, setFilterLayoutMode] = useState<'horizontal' | 'sidebar'>('horizontal');

  const handleShareRecipe = (recipe: Recipe) => {
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
    }
  };

  // Infinite Scroll State for Explore recipes
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const exploreSentinelRef = useRef<HTMLDivElement>(null);

  // Pre-calculate recipe categories mapping
  const recipeCategoryMap = useMemo(() => {
    const map = new Map<string, Set<AfroIngredientCategory>>();
    recipes.forEach(r => {
      map.set(r.id, getRecipeIngredientCategories(r.ingredients));
    });
    return map;
  }, [recipes]);

  // Count recipes per ingredient category
  const categoryCounts = useMemo(() => {
    const counts: Record<AfroIngredientCategory, number> = {
      'Bases & Féculents': 0,
      'Légumineuses': 0,
      'Légumes & Racines': 0,
      'Fruits Tropicaux': 0,
      'Protéines': 0,
      'Épices & Aromates': 0,
      'Matières Grasses & Liquides': 0,
      'Condiments & Sauces': 0
    };
    recipes.forEach(r => {
      const cats = recipeCategoryMap.get(r.id);
      if (cats) {
        cats.forEach(c => {
          if (counts[c] !== undefined) counts[c]++;
        });
      }
    });
    return counts;
  }, [recipes, recipeCategoryMap]);

  const toggleIngredientCategory = (cat: AfroIngredientCategory) => {
    setSelectedIngredientCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Filter recipes
  const filteredRecipes = recipes.filter((r) => {
    // Search query with ingredient alias resolution
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const normQ = normalizeText(searchQuery);
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchCountry = r.country.toLowerCase().includes(q);

      // Direct match in ingredients
      let matchIngredients = r.ingredients.some(i => i.name.toLowerCase().includes(q));

      // Alias-aware match: e.g. searching "yuca" matches recipes with "Manioc"
      if (!matchIngredients) {
        const matchedAfroItems = searchAfroIngredients(normQ);
        if (matchedAfroItems.length > 0) {
          matchIngredients = r.ingredients.some(ing => {
            const ingNorm = normalizeText(ing.name);
            return matchedAfroItems.some(item => {
              const itemNameNorm = normalizeText(item.name);
              return ingNorm.includes(itemNameNorm) || 
                     item.aliases.some(alias => ingNorm.includes(normalizeText(alias)));
            });
          });
        }
      }

      if (!matchTitle && !matchDesc && !matchCountry && !matchIngredients) return false;
    }

    // Country filter
    if (selectedCountry !== 'Tous les pays' && r.country !== selectedCountry) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'Toutes les catégories' && r.category !== selectedCategory) {
      return false;
    }

    // Difficulty
    if (selectedDifficulty !== 'Toutes' && r.difficulty !== selectedDifficulty) {
      return false;
    }

    // Ingredient categories filter
    if (selectedIngredientCategories.length > 0) {
      const cats = recipeCategoryMap.get(r.id);
      if (!cats) return false;
      if (ingredientMatchMode === 'all') {
        const hasAll = selectedIngredientCategories.every(c => cats.has(c));
        if (!hasAll) return false;
      } else {
        const hasAny = selectedIngredientCategories.some(c => cats.has(c));
        if (!hasAny) return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.likesCount - a.likesCount;
    if (sortBy === 'time') return (a.prepTimeMinutes + a.cookTimeMinutes) - (b.prepTimeMinutes + b.cookTimeMinutes);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Infinite Scroll Observer for Explore recipes
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoadingMore && visibleCount < filteredRecipes.length) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount(prev => Math.min(prev + 6, filteredRecipes.length));
          setIsLoadingMore(false);
        }, 500);
      }
    }, { rootMargin: '250px' });

    if (exploreSentinelRef.current) {
      observer.observe(exploreSentinelRef.current);
    }
    return () => observer.disconnect();
  }, [visibleCount, isLoadingMore, filteredRecipes.length]);

  // Reusable Filter Content (used in both Horizontal and Sidebar layouts)
  const renderFilterControls = (isSidebar: boolean = false) => (
    <div className={`p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] space-y-4 ${
      isSidebar ? 'sticky top-24' : ''
    }`}>
      {/* Ingredient Categories Filter Panel (Garde-Manger) */}
      <div className="rounded-2xl border border-orange-200/90 bg-gradient-to-br from-orange-50/60 via-white to-amber-50/40 p-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#FF4E27]/10 text-[#FF4E27] shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-900">
                  Garde-Manger & Terroir
                </span>
                {selectedIngredientCategories.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FF4E27] text-white text-[10px] font-bold shadow-2xs">
                    {selectedIngredientCategories.length} actif{selectedIngredientCategories.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {!isSidebar && (
                <p className="text-[11px] text-slate-500">
                  Filtrez les recettes selon vos ingrédients en stock
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Match Mode Toggle */}
            {selectedIngredientCategories.length > 1 && (
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 text-[9px] font-semibold">
                <button
                  type="button"
                  onClick={() => setIngredientMatchMode('any')}
                  className={`px-2 py-0.5 rounded-lg transition-colors ${
                    ingredientMatchMode === 'any'
                      ? 'bg-[#FF4E27] text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  OU
                </button>
                <button
                  type="button"
                  onClick={() => setIngredientMatchMode('all')}
                  className={`px-2 py-0.5 rounded-lg transition-colors ${
                    ingredientMatchMode === 'all'
                      ? 'bg-[#FF4E27] text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ET
                </button>
              </div>
            )}

            {selectedIngredientCategories.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIngredientCategories([])}
                className="text-[10px] font-bold text-[#FF4E27] hover:underline flex items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-orange-100/60"
              >
                <X className="w-3 h-3" />
                <span>Effacer</span>
              </button>
            )}

            {!isSidebar && (
              <button
                type="button"
                onClick={() => setIsIngredientPanelExpanded(!isIngredientPanelExpanded)}
                className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-white"
              >
                {isIngredientPanelExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Category Chips */}
        {(isIngredientPanelExpanded || isSidebar) && (
          <div className={`flex flex-wrap items-center gap-1.5 pt-1 border-t border-orange-100/80 ${isSidebar ? 'flex-col items-stretch' : ''}`}>
            {INGREDIENT_CATEGORY_METAS.map((cat) => {
              const isSelected = selectedIngredientCategories.includes(cat.id);
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleIngredientCategory(cat.id)}
                  className={`group inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? `${cat.activeBg} ${cat.activeBorder} ${cat.activeText} shadow-xs font-bold scale-[1.01]`
                      : 'bg-white border-slate-200/90 text-slate-700 hover:border-orange-300 hover:bg-orange-50/50 shadow-2xs'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="text-sm shrink-0">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-700'
                      }`}
                    >
                      {count}
                    </span>
                    {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Countries Filter */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Terroirs & Pays :
        </span>
        <div className={`flex items-center gap-1.5 ${isSidebar ? 'flex-wrap' : 'overflow-x-auto pb-1 scrollbar-none'}`}>
          {COUNTRIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCountry === c
                  ? 'bg-[#FF4E27] text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              {c === 'Tous les pays' ? '🌍 Tous les pays' : formatCountryWithFlag(c)}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Type de Plat :
        </span>
        <div className={`flex items-center gap-1.5 ${isSidebar ? 'flex-wrap' : 'overflow-x-auto pb-1 scrollbar-none'}`}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#FF4E27] to-[#FF7849] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulties */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">
            Difficulté :
          </span>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedDifficulty === d
                  ? 'bg-[#0F3E2E] text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Reset all filters button */}
        {(selectedCountry !== 'Tous les pays' || 
          selectedCategory !== 'Toutes les catégories' || 
          selectedDifficulty !== 'Toutes' || 
          selectedIngredientCategories.length > 0 || 
          searchQuery) && (
          <button
            onClick={() => {
              setSelectedCountry('Tous les pays');
              setSelectedCategory('Toutes les catégories');
              setSelectedDifficulty('Toutes');
              setSelectedIngredientCategories([]);
              setSearchQuery('');
              onClearCountryFilter?.();
            }}
            className="text-xs text-[#FF4E27] hover:underline font-bold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. HERO SEARCH BAR & GLOSSY PROMO CARDS (DIRECT HOMAGE TO USER'S REFERENCE IMAGES) */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-orange-50/40 to-amber-50/30 p-4 sm:p-6 border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
        
        {/* Header Greeting Kicker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF4E27] bg-orange-100/80 px-2.5 py-0.5 rounded-full">
                Explore Afrodelicious 🌍
              </span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 mt-1">
              Explorer la Gastronomie Afro-Caribéenne
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Trouvez des recettes authentiques, terroirs, marinades et secrets de chefs
            </p>
          </div>
        </div>

        {/* The Signature Search Bar (Styled after the uploaded reference image mockup) */}
        <div className="relative flex items-center bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm hover:shadow-md focus-within:border-[#FF4E27] focus-within:shadow-[0_8px_30px_rgba(255,78,39,0.18)] transition-all p-2 sm:p-2.5 gap-2 group">
          {/* Left: Search Icon Bubble */}
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF4E27] flex items-center justify-center shrink-0 shadow-2xs group-focus-within:bg-[#FF4E27] group-focus-within:text-white transition-colors">
            <Search className="w-5 h-5" />
          </div>

          {/* Middle: Text input with "Search for | your query..." signature separator */}
          <div className="flex-1 flex items-center min-w-0">
            <span className="text-slate-400 text-xs sm:text-sm font-medium hidden sm:inline mr-1 select-none shrink-0">
              Search for
            </span>
            <span className="text-[#FF4E27] font-black text-base sm:text-lg select-none animate-pulse mr-1 shrink-0">
              |
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="yassa, mafé, plantain, alloco, bokit, jerk chicken..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Right: Clear + Slider Filter Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Effacer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Filter Toggle Button with slider icon matching the image */}
            <button
              onClick={() => setFilterLayoutMode(filterLayoutMode === 'sidebar' ? 'horizontal' : 'sidebar')}
              className="p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Changer le mode d'affichage des filtres"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">
                {filterLayoutMode === 'sidebar' ? 'Barre en haut' : 'Filtres'}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Header Controls Bar (Layout Mode Toggle and Sort) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Compass className="w-4 h-4 text-[#FF4E27]" />
          <span>Affichage & Filtres par terroir</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Layout Mode Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-0.5 text-xs font-semibold shadow-2xs">
            <button
              type="button"
              onClick={() => setFilterLayoutMode('horizontal')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                filterLayoutMode === 'horizontal' ? 'bg-[#FF4E27] text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Barre en haut"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Barre en haut</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterLayoutMode('sidebar')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                filterLayoutMode === 'sidebar' ? 'bg-[#FF4E27] text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Panneau latéral"
            >
              <PanelLeft className="w-3.5 h-3.5" />
              <span>Panneau latéral</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF4E27] cursor-pointer shadow-2xs"
            >
              <option value="popular">Les plus populaires (Likes)</option>
              <option value="recent">Plus récentes</option>
              <option value="time">Temps le plus court</option>
            </select>
          </div>
        </div>
      </div>

      {/* AdSense Placement */}
      <AdBanner format="leaderboard" />

      {/* Filter Mode 1: Horizontal Bar at Top */}
      {filterLayoutMode === 'horizontal' && renderFilterControls(false)}

      {/* Content Container (Grid or Sidebar + Grid) */}
      <div className={filterLayoutMode === 'sidebar' ? 'flex flex-col lg:flex-row gap-6 items-start' : 'space-y-4'}>
        
        {/* Filter Mode 2: Left Sidebar Panel */}
        {filterLayoutMode === 'sidebar' && (
          <aside className="w-full lg:w-72 shrink-0">
            {renderFilterControls(true)}
          </aside>
        )}

        {/* Recipes Grid & Infinite Scroll Section */}
        <div className="flex-1 space-y-4 w-full">
          {/* Results Count & Current active filters summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>{filteredRecipes.length} recettes trouvées</span>
            <span className="text-[11px] text-slate-400 font-mono">
              Affichage de {Math.min(visibleCount, filteredRecipes.length)} sur {filteredRecipes.length}
            </span>
          </div>

          {/* Grid */}
          {filteredRecipes.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Compass className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Aucune recette ne correspond à ces critères
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Essayez de modifier votre recherche ou explorez nos délicieux classiques ouest-africains et antillais.
              </p>
              <button
                onClick={() => {
                  setSelectedCountry('Tous les pays');
                  setSelectedCategory('Toutes les catégories');
                  setSelectedDifficulty('Toutes');
                  setSelectedIngredientCategories([]);
                  setSearchQuery('');
                  onClearCountryFilter?.();
                }}
                className="px-4 py-2 rounded-2xl bg-[#FF4E27] text-white text-xs font-bold shadow-md shadow-[#FF4E27]/20 cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.slice(0, visibleCount).map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => onSelectRecipe(recipe.id)}
                    className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    {/* Image & Dark Glass Floating Badges (Reference image style) */}
                    <div className="relative h-56 w-full overflow-hidden">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Top Left: Location badge styled like 'Right Bite, Al Quoz' in reference image */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-bold border border-white/15 shadow-lg flex items-center gap-1.5">
                          <span>{recipe.countryFlag || getCountryFlag(recipe.country)}</span>
                          <span>{recipe.country}</span>
                        </span>
                      </div>

                      {/* Top Right: Share & Like Badges */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareRecipe(recipe);
                          }}
                          className="p-2 rounded-full backdrop-blur-md bg-black/55 text-white hover:bg-black/80 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
                          title="Partager"
                        >
                          <Share2 className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLike(recipe.id);
                          }}
                          className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
                            recipe.isLiked ? 'bg-[#FF4E27] text-white shadow-[#FF4E27]/40' : 'bg-black/55 text-white hover:bg-black/80'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${recipe.isLiked ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom Image Badge: Cook time and difficulty in dark glass pill like price tag in reference image */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                        <span className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/15 text-white text-[11px] font-black flex items-center gap-1 shadow-lg font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27] block">
                          {recipe.category}
                        </span>
                        <h3 className="font-serif font-black text-base text-slate-900 group-hover:text-[#FF4E27] transition-colors line-clamp-1 mt-0.5">
                          {recipe.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-normal leading-relaxed">
                          {recipe.description}
                        </p>

                        {/* Ingredient category tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2.5">
                          {Array.from(recipeCategoryMap.get(recipe.id) || []).slice(0, 3).map((catId) => {
                            const meta = INGREDIENT_CATEGORY_METAS.find((m) => m.id === catId);
                            if (!meta) return null;
                            const isFiltered = selectedIngredientCategories.includes(catId);
                            return (
                              <span
                                key={catId}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-[10px] font-bold transition-colors ${
                                  isFiltered
                                    ? 'bg-orange-100 text-[#FF4E27] border border-orange-300'
                                    : 'bg-slate-100/80 text-slate-600'
                                }`}
                              >
                                <span>{meta.icon}</span>
                                <span className="truncate max-w-[85px]">{meta.label}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer Actions with Signature '+' Button & 'See More' Pill from Reference Images */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {/* Author info */}
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={recipe.authorAvatar}
                            alt={recipe.authorName}
                            className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                          />
                          <div className="min-w-0">
                            <span className="truncate max-w-[90px] font-bold text-xs text-slate-900 block leading-none">
                              {recipe.authorName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {recipe.likesCount} j'aime
                            </span>
                          </div>
                        </div>

                        {/* Action buttons matching reference image buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* "See More" orange button (replacing dark button) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRecipe(recipe.id);
                            }}
                            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(255,78,39,0.3)] hover:shadow-[0_6px_20px_rgba(255,78,39,0.45)] hover:scale-105 cursor-pointer flex items-center gap-1 active:scale-95"
                          >
                            <span>See More</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {/* THE CIRCULAR CORAL '+' BUTTON FROM THE REFERENCE IMAGE */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLike(recipe.id);
                            }}
                            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B4A] to-[#FF4E27] hover:from-[#FF4E27] hover:to-[#E03814] text-white flex items-center justify-center shadow-[0_6px_18px_rgba(255,78,39,0.38)] hover:shadow-[0_8px_22px_rgba(255,78,39,0.5)] hover:scale-110 active:scale-90 transition-all shrink-0 cursor-pointer"
                            title="Ajouter aux favoris (+)"
                          >
                            <Plus className="w-5 h-5 text-white stroke-[2.5]" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Infinite Scroll Trigger Sentinel */}
              <div ref={exploreSentinelRef} className="py-6 text-center">
                {isLoadingMore ? (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs inline-flex items-center gap-2 text-xs font-bold text-slate-700 animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#FF4E27]" />
                    <span>Chargement de nouvelles recettes...</span>
                  </div>
                ) : visibleCount >= filteredRecipes.length ? (
                  <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 text-xs font-semibold text-slate-600 inline-block">
                    ✨ Toutes les {filteredRecipes.length} recettes ont été affichées !
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400">
                    Faites défiler pour afficher plus de recettes automatiquement...
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
