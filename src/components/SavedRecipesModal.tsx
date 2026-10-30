import React, { useState, useMemo } from 'react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  Clock, 
  Heart, 
  Utensils, 
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  ChefHat,
  Flame,
  Check,
  RotateCcw
} from 'lucide-react';
import { Recipe } from '../types';

interface SavedRecipesModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  onSelectRecipe: (recipeId: string) => void;
  onToggleBookmark: (recipeId: string) => void;
}

interface CategoryFilterOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({
  isOpen,
  onClose,
  recipes,
  onSelectRecipe,
  onToggleBookmark,
}) => {
  // Selected category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // Optional search query inside bookmarks
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const bookmarkedRecipes = recipes.filter(r => r.isBookmarked);

  // Available categories defined with user-requested examples:
  // 'Plat signature', 'Entrée rapide', 'Dessert tropical'
  const CATEGORY_OPTIONS: CategoryFilterOption[] = [
    {
      id: 'all',
      label: 'Toutes',
      emoji: '✨',
      description: 'Toutes les recettes'
    },
    {
      id: 'Plat signature',
      label: 'Plat signature',
      emoji: '👑',
      description: 'Plats traditionnels & mijotés emblématiques'
    },
    {
      id: 'Entrée rapide',
      label: 'Entrée rapide',
      emoji: '⚡',
      description: 'Street food, entrées & bouchées express'
    },
    {
      id: 'Dessert tropical',
      label: 'Dessert tropical',
      emoji: '🥭',
      description: 'Douceurs, pâtisseries & fruits du soleil'
    },
    {
      id: 'Sauces & Marinades',
      label: 'Sauces & Marinades',
      emoji: '🌶️',
      description: 'Condiments, piments & marinades parfumées'
    },
    {
      id: 'Boissons & Cocktails',
      label: 'Boissons & Cocktails',
      emoji: '🍹',
      description: 'Jus exotiques, bissap & cocktails'
    },
    {
      id: 'Végétarien & Vegan',
      label: 'Afro Végan',
      emoji: '🌱',
      description: 'Recettes 100% végétales & saines'
    }
  ];

  // Smart matching helper to align standard categories with custom category aliases
  const matchesCategory = (recipe: Recipe, filterId: string): boolean => {
    if (filterId === 'all') return true;
    const cat = (recipe.category || '').toLowerCase().trim();
    const filter = filterId.toLowerCase().trim();

    if (cat === filter) return true;

    // Matches for "Plat signature" (Plats traditionnels, plats mijotés, signatures)
    if (filter === 'plat signature' || filter === 'plats traditionnels') {
      return cat.includes('plat') || cat.includes('tradition') || cat.includes('signature');
    }

    // Matches for "Entrée rapide" (Street Food, snacks, apéritifs ou temps rapide <= 35 min)
    if (filter === 'entrée rapide' || filter === 'entree rapide' || filter === 'street food') {
      return (
        cat.includes('street') || 
        cat.includes('entrée') || 
        cat.includes('entree') || 
        cat.includes('rapide') || 
        (recipe.prepTimeMinutes + recipe.cookTimeMinutes <= 35 && !cat.includes('dessert'))
      );
    }

    // Matches for "Dessert tropical" (Desserts & Douceurs, pâtisseries afro)
    if (filter === 'dessert tropical' || filter === 'desserts & douceurs') {
      return cat.includes('dessert') || cat.includes('douceur') || cat.includes('tropical') || cat.includes('gâteau') || cat.includes('sucré');
    }

    // Matches for "Sauces & Marinades"
    if (filter.includes('sauce') || filter.includes('marinade')) {
      return cat.includes('sauce') || cat.includes('marinade') || cat.includes('condiment');
    }

    // Matches for "Boissons & Cocktails"
    if (filter.includes('boisson') || filter.includes('cocktail')) {
      return cat.includes('boisson') || cat.includes('cocktail') || cat.includes('jus');
    }

    // Matches for "Végétarien & Vegan"
    if (filter.includes('vegan') || filter.includes('végé') || filter.includes('vege')) {
      return cat.includes('vegan') || cat.includes('végé') || cat.includes('vege');
    }

    return false;
  };

  // Compute recipe counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: bookmarkedRecipes.length
    };
    CATEGORY_OPTIONS.forEach(opt => {
      if (opt.id !== 'all') {
        counts[opt.id] = bookmarkedRecipes.filter(r => matchesCategory(r, opt.id)).length;
      }
    });
    return counts;
  }, [bookmarkedRecipes]);

  // Filtered recipes based on selected category and search input
  const filteredRecipes = useMemo(() => {
    return bookmarkedRecipes.filter(recipe => {
      // 1. Category filter
      const matchesCat = matchesCategory(recipe, selectedCategory);
      if (!matchesCat) return false;

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = recipe.title.toLowerCase().includes(query);
        const matchesAuthor = recipe.authorName.toLowerCase().includes(query);
        const matchesCountry = recipe.country.toLowerCase().includes(query);
        const matchesCategoryName = recipe.category.toLowerCase().includes(query);
        const matchesIngredients = recipe.ingredients.some(i => i.name.toLowerCase().includes(query));

        return matchesTitle || matchesAuthor || matchesCountry || matchesCategoryName || matchesIngredients;
      }

      return true;
    });
  }, [bookmarkedRecipes, selectedCategory, searchQuery]);

  // Helper to get formatted category label and badge style for a recipe card
  const getRecipeCategoryBadge = (category: string) => {
    const lower = (category || '').toLowerCase();
    if (lower.includes('plat') || lower.includes('tradition')) {
      return { label: 'Plat signature', emoji: '👑', color: 'bg-amber-100 text-amber-900 border-amber-200' };
    }
    if (lower.includes('street') || lower.includes('rapide')) {
      return { label: 'Entrée rapide', emoji: '⚡', color: 'bg-orange-100 text-[#FF4E27] border-orange-200' };
    }
    if (lower.includes('dessert') || lower.includes('douceur')) {
      return { label: 'Dessert tropical', emoji: '🥭', color: 'bg-purple-100 text-purple-900 border-purple-200' };
    }
    if (lower.includes('sauce') || lower.includes('marinade')) {
      return { label: 'Sauce & Épices', emoji: '🌶️', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    }
    if (lower.includes('boisson') || lower.includes('cocktail')) {
      return { label: 'Boisson', emoji: '🍹', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' };
    }
    if (lower.includes('vegan') || lower.includes('végé')) {
      return { label: 'Afro Végan', emoji: '🌱', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
    return { label: category, emoji: '🍲', color: 'bg-slate-100 text-slate-800 border-slate-200' };
  };

  const activeCategoryObj = CATEGORY_OPTIONS.find(c => c.id === selectedCategory) || CATEGORY_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#FF4E27] to-amber-500 text-white shadow-md shadow-orange-500/20">
              <Bookmark className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-black text-lg sm:text-xl text-slate-900">
                  Mes Recettes Sauvegardées
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#FF4E27] text-xs font-bold">
                  {bookmarkedRecipes.length}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Organisez et retrouvez vos coups de cœur culinaires par catégorie
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar Section */}
        {bookmarkedRecipes.length > 0 && (
          <div className="px-5 sm:px-6 pt-3 pb-3 border-b border-slate-100 bg-white space-y-3 shrink-0">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom de plat, pays, chef ou ingrédient..."
                className="w-full pl-9 pr-8 py-2 rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF4E27] focus:ring-2 focus:ring-orange-100 transition-all bg-slate-50/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills (Horizontal Scrollable) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-0.5">
                <span className="flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#FF4E27]" />
                  <span>Filtrer par catégorie :</span>
                </span>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-[#FF4E27] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Réinitialiser</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const count = categoryCounts[cat.id] || 0;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-500 to-[#FF4E27] text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-200 scale-[1.02]'
                          : count > 0
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-400 border border-slate-200/50 opacity-70'
                      }`}
                    >
                      <span className="text-sm">{cat.emoji}</span>
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                          isSelected
                            ? 'bg-white/25 text-white'
                            : count > 0
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-slate-200/60 text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Content list */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {bookmarkedRecipes.length === 0 ? (
            /* Empty State: No bookmarks at all */
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#FF4E27] mx-auto flex items-center justify-center border border-orange-200 shadow-xs">
                <Bookmark className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-black text-lg text-slate-900">
                  Votre carnet de recettes est vide
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Ajoutez vos recettes préférées en favoris en cliquant sur l'icône marque-page pour les classer par catégorie (Plats signatures, Entrées express, Desserts tropicaux...).
                </p>
              </div>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
              >
                <span>Découvrir les recettes du fil</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : filteredRecipes.length === 0 ? (
            /* Empty State for current filter / search */
            <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200/80 p-6">
              <div className="text-3xl">{activeCategoryObj.emoji}</div>
              <div className="space-y-1">
                <h4 className="font-serif font-black text-base text-slate-900">
                  Aucun favori dans « {activeCategoryObj.label} »
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `Aucune recette ne correspond à votre recherche "${searchQuery}" dans cette catégorie.`
                    : `Vous n'avez pas encore sauvegardé de recette dans cette catégorie.`}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    Effacer la recherche
                  </button>
                )}
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FF4E27] text-white text-xs font-bold hover:bg-[#e03d16] cursor-pointer shadow-xs transition-colors"
                  >
                    Voir tous les favoris ({bookmarkedRecipes.length})
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Recipe Cards List */
            <div className="space-y-2.5">
              {filteredRecipes.map((r) => {
                const categoryBadge = getRecipeCategoryBadge(r.category);
                const totalTime = r.prepTimeMinutes + r.cookTimeMinutes;

                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      onClose();
                      onSelectRecipe(r.id);
                    }}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#FF4E27] hover:shadow-md cursor-pointer transition-all flex items-center justify-between group gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Dish Thumbnail */}
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shrink-0 bg-slate-100 shadow-xs">
                        <img
                          src={r.imageUrl}
                          alt={r.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1 right-1 text-sm drop-shadow">
                          {r.countryFlag}
                        </span>
                      </div>

                      {/* Recipe Info */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Categorized Pill Badge */}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${categoryBadge.color}`}
                          >
                            <span>{categoryBadge.emoji}</span>
                            <span>{categoryBadge.label}</span>
                          </span>

                          {/* Country */}
                          <span className="text-[10px] font-medium text-slate-500">
                            {r.country}
                          </span>
                        </div>

                        <h4 className="font-serif font-black text-xs sm:text-sm text-slate-900 group-hover:text-[#FF4E27] transition-colors line-clamp-1">
                          {r.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          <span className="truncate text-slate-600 font-medium">
                            Par {r.authorName}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <Clock className="w-3 h-3 text-[#F59E0B]" />
                            <span>{totalTime} min</span>
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <Utensils className="w-3 h-3 text-slate-400" />
                            <span>{r.ingredients.length} ingr.</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(r.id);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Retirer des favoris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-orange-50 text-slate-400 group-hover:text-[#FF4E27] transition-colors">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        {bookmarkedRecipes.length > 0 && (
          <div className="px-5 sm:px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span>
              Affichage de <strong>{filteredRecipes.length}</strong> sur <strong>{bookmarkedRecipes.length}</strong> favoris
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer transition-colors"
            >
              Fermer
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
