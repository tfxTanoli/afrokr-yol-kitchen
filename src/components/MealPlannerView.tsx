import React, { useState } from 'react';
import { 
  CalendarDays, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Check, 
  Copy, 
  CheckCircle2, 
  Share2, 
  Utensils, 
  X,
  Sparkles
} from 'lucide-react';
import { DayPlan, Recipe, Ingredient } from '../types';

interface MealPlannerViewProps {
  mealPlan: DayPlan[];
  allRecipes: Recipe[];
  onUpdateMealPlan: (newPlan: DayPlan[]) => void;
  onSelectRecipe: (recipeId: string) => void;
}

export const MealPlannerView: React.FC<MealPlannerViewProps> = ({
  mealPlan,
  allRecipes,
  onUpdateMealPlan,
  onSelectRecipe,
}) => {
  const [activeDayModal, setActiveDayModal] = useState<{ dayIndex: number; slot: 'lunch' | 'dinner' } | null>(null);
  const [checkedGroceries, setCheckedGroceries] = useState<Record<string, boolean>>({});
  const [copiedListToast, setCopiedListToast] = useState(false);

  // Collect and consolidate all ingredients from planned recipes
  const consolidatedGroceries: Record<string, { name: string; totalAmount: number; unit: string; aisle: string }> = {};

  mealPlan.forEach(day => {
    [day.lunch, day.dinner].forEach(recipe => {
      if (recipe && recipe.ingredients) {
        recipe.ingredients.forEach(ing => {
          const key = `${ing.name.toLowerCase().trim()}_${ing.unit.toLowerCase()}`;
          if (consolidatedGroceries[key]) {
            consolidatedGroceries[key].totalAmount += ing.amount;
          } else {
            consolidatedGroceries[key] = {
              name: ing.name,
              totalAmount: ing.amount,
              unit: ing.unit,
              aisle: ing.aisle || 'Épicerie & Épices Afro'
            };
          }
        });
      }
    });
  });

  // Group by aisle
  const groceriesByAisle: Record<string, typeof consolidatedGroceries[string][]> = {};
  Object.values(consolidatedGroceries).forEach(item => {
    if (!groceriesByAisle[item.aisle]) {
      groceriesByAisle[item.aisle] = [];
    }
    groceriesByAisle[item.aisle].push(item);
  });

  const handleAssignRecipe = (recipe: Recipe) => {
    if (!activeDayModal) return;
    const updated = [...mealPlan];
    const { dayIndex, slot } = activeDayModal;
    if (slot === 'lunch') {
      updated[dayIndex].lunch = recipe;
    } else {
      updated[dayIndex].dinner = recipe;
    }
    onUpdateMealPlan(updated);
    setActiveDayModal(null);
  };

  const handleRemoveMeal = (dayIndex: number, slot: 'lunch' | 'dinner') => {
    const updated = [...mealPlan];
    if (slot === 'lunch') {
      updated[dayIndex].lunch = undefined;
    } else {
      updated[dayIndex].dinner = undefined;
    }
    onUpdateMealPlan(updated);
  };

  const handleClearWeek = () => {
    const cleared = mealPlan.map(d => ({ ...d, lunch: undefined, dinner: undefined }));
    onUpdateMealPlan(cleared);
  };

  const handleCopyList = () => {
    let text = "🛒 AfroKréyol Kitchen — Ma Liste de Courses de la Semaine :\n\n";
    Object.entries(groceriesByAisle).forEach(([aisle, items]) => {
      text += `📍 ${aisle.toUpperCase()} :\n`;
      items.forEach(i => {
        text += `  • ${Math.round(i.totalAmount * 10) / 10} ${i.unit} — ${i.name}\n`;
      });
      text += "\n";
    });

    navigator.clipboard?.writeText?.(text);
    setCopiedListToast(true);
    setTimeout(() => setCopiedListToast(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Toast Notification */}
      {copiedListToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0F3E2E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
          <span>Liste de courses copiée ! Prête à envoyer sur WhatsApp.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#FF4E27]" />
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
              Planificateur de Repas & Menus de la Semaine
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Composez vos déjeuners et dîners afro-caribéens, la liste de courses se génère automatiquement
          </p>
        </div>

        <button
          onClick={handleClearWeek}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-bold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Vider la semaine</span>
        </button>
      </div>

      {/* 7-Days Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {mealPlan.map((day, idx) => (
          <div
            key={day.dayName}
            className="p-3.5 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-3"
          >
            {/* Day Title */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-serif font-bold text-sm text-slate-900">
                {day.dayName}
              </span>
              <span className="text-[10px] text-slate-400">
                Semaine
              </span>
            </div>

            {/* Lunch Slot */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#FF4E27] uppercase tracking-wider block">
                Déjeuner
              </span>
              {day.lunch ? (
                <div className="group relative p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div 
                    onClick={() => onSelectRecipe(day.lunch!.id)}
                    className="cursor-pointer"
                  >
                    <span className="font-bold text-slate-900 block truncate hover:text-[#FF4E27]">
                      {day.lunch.countryFlag} {day.lunch.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {day.lunch.prepTimeMinutes + day.lunch.cookTimeMinutes} min
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveMeal(idx, 'lunch')}
                    className="absolute top-1.5 right-1.5 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveDayModal({ dayIndex: idx, slot: 'lunch' })}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-200 hover:border-[#FF4E27] text-[11px] text-slate-400 hover:text-[#FF4E27] flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Ajouter</span>
                </button>
              )}
            </div>

            {/* Dinner Slot */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0F3E2E] uppercase tracking-wider block">
                Dîner
              </span>
              {day.dinner ? (
                <div className="group relative p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div 
                    onClick={() => onSelectRecipe(day.dinner!.id)}
                    className="cursor-pointer"
                  >
                    <span className="font-bold text-slate-900 block truncate hover:text-[#0F3E2E]">
                      {day.dinner.countryFlag} {day.dinner.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {day.dinner.prepTimeMinutes + day.dinner.cookTimeMinutes} min
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveMeal(idx, 'dinner')}
                    className="absolute top-1.5 right-1.5 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveDayModal({ dayIndex: idx, slot: 'dinner' })}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-200 hover:border-[#0F3E2E] text-[11px] text-slate-400 hover:text-[#0F3E2E] flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Ajouter</span>
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Smart Grocery List Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#0F3E2E]" />
              <h2 className="font-serif font-bold text-xl text-slate-900">
                Liste de Courses Intelligente & Consolidée
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tous les ingrédients de votre semaine regroupés par rayons d'épicerie spécialisée
            </p>
          </div>

          <button
            onClick={handleCopyList}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F3E2E] hover:bg-[#15523E] text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copier la liste (WhatsApp)</span>
          </button>
        </div>

        {Object.keys(groceriesByAisle).length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            Aucun ingrédient pour l'instant. Ajoutez des recettes à votre menu de la semaine ci-dessus !
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groceriesByAisle).map(([aisle, items]) => (
              <div key={aisle} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF4E27] block">
                  {aisle} ({items.length})
                </span>

                <div className="space-y-1.5">
                  {items.map((item, idx) => {
                    const itemKey = `${aisle}_${item.name}`;
                    const isChecked = !!checkedGroceries[itemKey];

                    return (
                      <div
                        key={idx}
                        onClick={() => setCheckedGroceries(prev => ({ ...prev, [itemKey]: !prev[itemKey] }))}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                          isChecked 
                            ? 'bg-emerald-50 text-emerald-800 line-through opacity-70' 
                            : 'bg-white text-slate-900 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="truncate">{item.name}</span>
                        </div>

                        <span className="font-mono font-bold text-[11px] shrink-0 ml-2">
                          {Math.round(item.totalAmount * 10) / 10} {item.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Select Recipe Modal when clicking + */}
      {activeDayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-serif font-bold text-base text-slate-900">
                Choisir une recette pour {mealPlan[activeDayModal.dayIndex].dayName} ({activeDayModal.slot === 'lunch' ? 'Déjeuner' : 'Dîner'})
              </h3>
              <button onClick={() => setActiveDayModal(null)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
              {allRecipes.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleAssignRecipe(r)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-[#FF4E27] hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={r.imageUrl}
                      alt={r.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        {r.countryFlag} {r.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {r.category} · {r.prepTimeMinutes + r.cookTimeMinutes} min
                      </span>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg bg-orange-50 text-[#FF4E27] text-xs font-bold hover:bg-[#FF4E27] hover:text-white transition-colors">
                    Sélectionner
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
