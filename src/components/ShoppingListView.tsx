import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Check, 
  Copy, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Filter,
  CheckCheck
} from 'lucide-react';
import { DayPlan, Recipe, Ingredient } from '../types';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';

interface ShoppingListViewProps {
  mealPlan: DayPlan[];
  language?: SupportedLanguage;
}

interface CustomItem {
  id: string;
  name: string;
  aisle: string;
  isCompleted: boolean;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  mealPlan,
  language = 'fr'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr;
  const [newItemName, setNewItemName] = useState('');
  const [newItemAisle, setNewItemAisle] = useState('Épicerie & Épices Afro');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copiedToast, setCopiedToast] = useState(false);
  const [customItems, setCustomItems] = useState<CustomItem[]>([
    { id: 'c1', name: 'Piment végétarien frais', aisle: 'Marché Frais & Légumes', isCompleted: false },
    { id: 'c2', name: 'Huile de palme rouge pure', aisle: 'Épicerie & Épices Afro', isCompleted: false },
    { id: 'c3', name: 'Attiéké de Grand-Bassam sous vide', aisle: 'Féculents & Racines', isCompleted: true }
  ]);

  // Consolidate meal plan ingredients
  const consolidatedGroceries: Record<string, { id: string; name: string; totalAmount: number; unit: string; aisle: string }> = {};

  mealPlan.forEach(day => {
    [day.lunch, day.dinner].forEach(recipe => {
      if (recipe && recipe.ingredients) {
        recipe.ingredients.forEach(ing => {
          const key = `${ing.name.toLowerCase().trim()}_${ing.unit.toLowerCase()}`;
          if (consolidatedGroceries[key]) {
            consolidatedGroceries[key].totalAmount += ing.amount;
          } else {
            consolidatedGroceries[key] = {
              id: key,
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

  // Add custom items
  customItems.forEach(item => {
    if (!groceriesByAisle[item.aisle]) {
      groceriesByAisle[item.aisle] = [];
    }
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setCustomItems(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: newItemName.trim(),
        aisle: newItemAisle,
        isCompleted: false
      }
    ]);
    setNewItemName('');
  };

  const handleClearChecked = () => {
    setCheckedItems({});
    setCustomItems(prev => prev.filter(item => !item.isCompleted));
  };

  const handleCopy = () => {
    let text = `🛒 Afrodelicious — ${t.listTitle} :\n\n`;
    Object.entries(groceriesByAisle).forEach(([aisle, items]) => {
      text += `📍 ${aisle.toUpperCase()} :\n`;
      items.forEach(i => {
        text += `  • ${Math.round(i.totalAmount * 10) / 10} ${i.unit} ${i.name}\n`;
      });
      const customInAisle = customItems.filter(c => c.aisle === aisle);
      customInAisle.forEach(c => {
        text += `  • [ ] ${c.name}\n`;
      });
      text += '\n';
    });
    navigator.clipboard?.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleShareWhatsApp = () => {
    let text = `🛒 Afrodelicious — Ma liste de courses :\n`;
    Object.entries(groceriesByAisle).forEach(([aisle, items]) => {
      text += `\n*${aisle}* :\n`;
      items.forEach(i => {
        text += `• ${Math.round(i.totalAmount * 10) / 10} ${i.unit} ${i.name}\n`;
      });
      const customInAisle = customItems.filter(c => c.aisle === aisle);
      customInAisle.forEach(c => {
        text += `• ${c.name}\n`;
      });
    });
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const allAisles = Array.from(
    new Set([...Object.keys(groceriesByAisle), ...customItems.map(c => c.aisle), 'Épicerie & Épices Afro', 'Marché Frais & Légumes', 'Boucherie & Poissons'])
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0F3E2E] text-white flex items-center justify-center shadow-xs">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
              {t.listTitle}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.listSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
          >
            {copiedToast ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedToast ? 'Copié !' : 'Copier'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleClearChecked}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Effacer les articles cochés"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Custom Item Input Bar */}
      <form onSubmit={handleAddCustomItem} className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Ajouter un ingrédient ou article (ex: Gombo frais, Piment Scotch Bonnet, Plantains...)"
          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
        />

        <select
          value={newItemAisle}
          onChange={(e) => setNewItemAisle(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium focus:border-[#FF4E27] focus:outline-none"
        >
          <option value="Épicerie & Épices Afro">Épicerie & Épices Afro</option>
          <option value="Marché Frais & Légumes">Marché Frais & Légumes</option>
          <option value="Boucherie & Poissons">Boucherie & Poissons</option>
          <option value="Féculents & Racines">Féculents & Racines</option>
          <option value="Condiments & Huiles">Condiments & Huiles</option>
          <option value="Boissons & Douceurs">Boissons & Douceurs</option>
        </select>

        <button
          type="submit"
          disabled={!newItemName.trim()}
          className="px-4 py-2 rounded-xl bg-[#0F3E2E] hover:bg-[#15523E] disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.listAddItem}</span>
        </button>
      </form>

      {/* Aisle Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allAisles.map((aisle) => {
          const mealItems = groceriesByAisle[aisle] || [];
          const customInAisle = customItems.filter(c => c.aisle === aisle);
          
          if (mealItems.length === 0 && customInAisle.length === 0) return null;

          return (
            <div
              key={aisle}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black text-[#0F3E2E] uppercase tracking-wider">
                  📍 {aisle}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {mealItems.length + customInAisle.length} articles
                </span>
              </div>

              <div className="space-y-1.5 divide-y divide-slate-50">
                {/* Plan ingredients */}
                {mealItems.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                        isChecked ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-3" />}
                        </div>
                        <span className={`text-xs font-medium text-slate-800 truncate ${isChecked ? 'line-through text-slate-400' : ''}`}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0 ml-2">
                        {Math.round(item.totalAmount * 10) / 10} {item.unit}
                      </span>
                    </div>
                  );
                })}

                {/* Custom items in this aisle */}
                {customInAisle.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCustomItems(prev => prev.map(c => c.id === item.id ? { ...c, isCompleted: !c.isCompleted } : c));
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                      item.isCompleted ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        item.isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {item.isCompleted && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                      <span className={`text-xs font-medium text-slate-800 truncate ${item.isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {item.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomItems(prev => prev.filter(c => c.id !== item.id));
                      }}
                      className="text-slate-300 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
