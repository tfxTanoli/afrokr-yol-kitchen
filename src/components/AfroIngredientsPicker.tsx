import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Plus, 
  Check, 
  X, 
  BookOpen,
  Filter,
  Info
} from 'lucide-react';
import { 
  AFRO_CARIBBEAN_INGREDIENTS, 
  AFRO_INGREDIENT_CATEGORIES, 
  AfroIngredient, 
  AfroIngredientCategory,
  searchAfroIngredients 
} from '../data/afroCaribbeanIngredients';
import { Ingredient } from '../types';

interface AfroIngredientsPickerProps {
  currentIngredients: Ingredient[];
  onSelectIngredient: (ingredient: AfroIngredient) => void;
  onRemoveIngredientByName?: (name: string) => void;
}

export const AfroIngredientsPicker: React.FC<AfroIngredientsPickerProps> = ({
  currentIngredients,
  onSelectIngredient,
  onRemoveIngredientByName
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AfroIngredientCategory | 'all'>('all');
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);
  const [selectedIngredientDetail, setSelectedIngredientDetail] = useState<AfroIngredient | null>(null);

  // Set of lowercase names currently in the recipe for quick lookup
  const currentIngredientNames = useMemo(() => {
    return new Set(currentIngredients.map(i => i.name.toLowerCase().trim()));
  }, [currentIngredients]);

  const isIngredientAdded = (item: AfroIngredient) => {
    const itemLower = item.name.toLowerCase();
    if (currentIngredientNames.has(itemLower)) return true;
    // Check if any existing ingredient contains the item name or vice versa
    return Array.from(currentIngredientNames).some(
      curr => curr.includes(itemLower) || itemLower.includes(curr)
    );
  };

  // Filtered ingredients list
  const filteredIngredients = useMemo(() => {
    let list = searchAfroIngredients(searchQuery, selectedCategory);
    if (showOnlyPopular) {
      list = list.filter(i => i.popular);
    }
    return list;
  }, [searchQuery, selectedCategory, showOnlyPopular]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: AFRO_CARIBBEAN_INGREDIENTS.length };
    AFRO_CARIBBEAN_INGREDIENTS.forEach(ing => {
      counts[ing.category] = (counts[ing.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-emerald-50/50 border border-orange-200/80 p-4 sm:p-5 shadow-xs">
      
      {/* Header with Title and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-200/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#FF4E27] text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-black text-slate-900 text-sm tracking-wide">
                Ingrédients & Terroirs Afro-Caribéens
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF4E27]/10 text-[#FF4E27] font-bold">
                120+ Ingrédients & Alias
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Cliquez pour ajouter instantanément un ingrédient avec son unité, quantité et rayon d’épicerie.
            </p>
          </div>
        </div>

        {/* Quick Quick-Add Count */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs text-slate-600">
          <span className="font-bold text-[#FF4E27]">{currentIngredients.length}</span>
          <span>dans la recette</span>
        </div>
      </div>

      {/* Search Input with Clear Button */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom, alias (yuca, niébé, scotch bonnet, gari, fufu...) ou tag..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-orange-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF4E27] focus:ring-1 focus:ring-[#FF4E27] shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin text-xs">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#FF4E27] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50/60'
          }`}
        >
          <span>✨ Tout</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {categoryCounts.all}
          </span>
        </button>

        {AFRO_INGREDIENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#0F3E2E] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50/50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {categoryCounts[cat.id] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Chips: Popular only */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button
          type="button"
          onClick={() => setShowOnlyPopular(!showOnlyPopular)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
            showOnlyPopular 
              ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Filter className="w-3 h-3 text-amber-600" />
          <span>Incontournables uniquement</span>
        </button>

        <span className="text-[11px] text-slate-500">
          {filteredIngredients.length} résultat{filteredIngredients.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Ingredients Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredIngredients.map((item) => {
          const added = isIngredientAdded(item);
          return (
            <div
              key={item.id}
              className={`group flex items-start justify-between p-2.5 rounded-xl border transition-all text-left ${
                added
                  ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-xs'
              }`}
            >
              <div className="flex-1 min-w-0 mr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base select-none">{item.icon}</span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.name}
                  </h4>
                  {item.popular && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-semibold shrink-0">
                      Top
                    </span>
                  )}
                </div>

                {/* Aliases pill */}
                {item.aliases.length > 0 && (
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    <span className="font-semibold text-slate-600">Alias:</span> {item.aliases.slice(0, 3).join(', ')}
                  </p>
                )}

                {/* Tags and Aisle */}
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                    {item.defaultAmount} {item.defaultUnit}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-50 text-orange-700 font-medium truncate max-w-[120px]">
                    {item.aisle}
                  </span>
                </div>

                {/* Cultural note or tip */}
                {item.culturalNote && (
                  <p className="text-[9px] text-slate-500 italic mt-1 line-clamp-1">
                    💡 {item.culturalNote}
                  </p>
                )}
              </div>

              {/* Action Button: Add or Check */}
              <div className="shrink-0 flex items-center gap-1">
                {item.culturalNote && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIngredientDetail(item);
                    }}
                    title="Voir l’histoire et les alias"
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                )}

                {added ? (
                  <button
                    type="button"
                    onClick={() => onRemoveIngredientByName && onRemoveIngredientByName(item.name)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow-2xs hover:bg-emerald-700 transition-colors"
                    title="Déjà présent dans la recette (cliquez pour retirer)"
                  >
                    <Check className="w-3 h-3" />
                    <span>Ajouté</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectIngredient(item)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#FF4E27] text-[#FF4E27] hover:bg-[#FF4E27] hover:text-white text-[10px] font-bold shadow-2xs transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Ajouter</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredIngredients.length === 0 && (
          <div className="col-span-full py-8 text-center text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">Aucun ingrédient correspondant à "{searchQuery}"</p>
            <p className="text-[11px] text-slate-400">
              Vous pouvez néanmoins créer un ingrédient libre directement dans la liste ci-dessous.
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal / Tooltip */}
      {selectedIngredientDetail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-3">
            <button
              onClick={() => setSelectedIngredientDetail(null)}
              className="absolute right-3.5 top-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedIngredientDetail.icon}</span>
              <div>
                <h4 className="font-serif font-black text-slate-900 text-base">
                  {selectedIngredientDetail.name}
                </h4>
                <span className="text-[11px] text-[#FF4E27] font-semibold">
                  {selectedIngredientDetail.category} · {selectedIngredientDetail.aisle}
                </span>
              </div>
            </div>

            {selectedIngredientDetail.culturalNote && (
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-[#FF4E27] block mb-1">Tradition & Terroir :</span>
                {selectedIngredientDetail.culturalNote}
              </div>
            )}

            <div>
              <span className="text-[11px] font-bold text-slate-900 block mb-1">
                Alias & Noms régionaux :
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedIngredientDetail.aliases.map((alias, idx) => (
                  <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    {alias}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-900 block mb-1">
                Tags culinaires :
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedIngredientDetail.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedIngredientDetail(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectIngredient(selectedIngredientDetail);
                  setSelectedIngredientDetail(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-[#FF4E27] text-white text-xs font-bold hover:bg-[#e03d16] transition-colors shadow-2xs"
              >
                Ajouter à la recette ({selectedIngredientDetail.defaultAmount} {selectedIngredientDetail.defaultUnit})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
