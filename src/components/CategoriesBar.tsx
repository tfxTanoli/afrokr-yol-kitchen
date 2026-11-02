import React, { useRef } from 'react';
import { 
  UtensilsCrossed, 
  Flame, 
  Soup, 
  Fish, 
  Coffee, 
  Wine, 
  Utensils, 
  Heart, 
  Sprout, 
  Carrot, 
  Smile, 
  ChevronRight, 
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import type { Recipe } from '../types';

export interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
  icon: React.ElementType;
  gradient: string;
}

export const CULINARY_CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'Toutes', emoji: '✨', icon: Sparkles, gradient: 'from-slate-700 to-slate-900' },
  { id: 'Rice', name: 'Rice', emoji: '🍚', icon: UtensilsCrossed, gradient: 'from-amber-600 to-amber-700' },
  { id: 'Chicken', name: 'Chicken', emoji: '🍗', icon: Flame, gradient: 'from-orange-500 to-[#FF4E27]' },
  { id: 'Soup', name: 'Soup', emoji: '🍲', icon: Soup, gradient: 'from-rose-500 to-orange-600' },
  { id: 'Shrimp', name: 'Shrimp', emoji: '🦐', icon: Fish, gradient: 'from-red-400 to-pink-600' },
  { id: 'Breakfast', name: 'Breakfast', emoji: '🥐', icon: Coffee, gradient: 'from-amber-400 to-amber-600' },
  { id: 'Salmon', name: 'Salmon', emoji: '🍣', icon: Fish, gradient: 'from-pink-500 to-rose-600' },
  { id: 'Drinks', name: 'Drinks', emoji: '🍹', icon: Wine, gradient: 'from-purple-500 to-indigo-600' },
  { id: 'Lunch', name: 'Lunch', emoji: '🍱', icon: Utensils, gradient: 'from-emerald-600 to-teal-700' },
  { id: 'Healthy', name: 'Healthy', emoji: '🥗', icon: Heart, gradient: 'from-teal-500 to-emerald-600' },
  { id: 'Afro Vegan', name: 'Afro Vegan', emoji: '🌱', icon: Sprout, gradient: 'from-green-600 to-emerald-700' },
  { id: 'Salad', name: 'Salad', emoji: '🥑', icon: Carrot, gradient: 'from-lime-600 to-green-700' },
  { id: 'Fish', name: 'Fish', emoji: '🐟', icon: Fish, gradient: 'from-cyan-600 to-blue-700' },
  { id: 'Kids', name: 'Kids', emoji: '🧒', icon: Smile, gradient: 'from-yellow-500 to-orange-500' },
  { id: 'Vegetarian', name: 'Vegetarian', emoji: '🥕', icon: Carrot, gradient: 'from-emerald-500 to-green-600' },
];

/**
 * How each chip finds its recipes. Recipes are written in French while the chip ids are
 * English, so every chip lists French and English words (accents removed, matched at the
 * start of a word in the title, description and category) and/or whole recipe categories.
 */
const CATEGORY_RULES: Record<string, { keywords: string[]; recipeCategories?: Recipe['category'][] }> = {
  Rice: { keywords: ['riz', 'rice', 'jollof', 'ceebu', 'thiebou', 'thieb', 'waakye', 'pilaf'] },
  Chicken: { keywords: ['poulet', 'chicken', 'yassa', 'volaille', 'poule'] },
  Soup: { keywords: ['soupe', 'soup', 'veloute', 'potage', 'calalou', 'callaloo', 'consomme', 'pepper soup'] },
  Shrimp: { keywords: ['crevette', 'shrimp', 'gambas', 'ecrevisse', 'ouassou', 'prawn'] },
  Breakfast: { keywords: ['petit-dejeuner', 'petit dejeuner', 'breakfast', 'brunch', 'bouillie', 'porridge', 'beignet', 'pancake', 'omelette'] },
  Salmon: { keywords: ['saumon', 'salmon'] },
  Drinks: {
    keywords: ['boisson', 'drink', 'cocktail', 'jus', 'juice', 'bissap', 'punch', 'smoothie', 'sirop', 'limonade', 'planteur'],
    recipeCategories: ['Boissons & Cocktails']
  },
  Lunch: { keywords: ['lunch', 'repas du midi'], recipeCategories: ['Plats Traditionnels'] },
  Healthy: {
    keywords: ['healthy', 'leger', 'legere', 'salade', 'salad', 'quinoa', 'fonio'],
    recipeCategories: ['Végétarien & Vegan']
  },
  'Afro Vegan': { keywords: ['vegan', 'vegetalien', 'plant-based'], recipeCategories: ['Végétarien & Vegan'] },
  Salad: { keywords: ['salade', 'salad', 'coleslaw'] },
  Fish: {
    keywords: ['poisson', 'fish', 'thon', 'thiof', 'merou', 'dorade', 'morue', 'cabillaud', 'saumon', 'tilapia', 'sardine', 'maquereau', 'hareng', 'chiquetaille']
  },
  Kids: { keywords: ['enfant', 'kid', 'famille', 'gouter'], recipeCategories: ['Desserts & Douceurs'] },
  Vegetarian: { keywords: ['vegetarien', 'vegetarian', 'veggie', 'sans viande', 'vegan'], recipeCategories: ['Végétarien & Vegan'] }
};

const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** True when the recipe belongs to the chip ('all' matches everything). */
export function recipeMatchesCategory(recipe: Recipe, categoryId: string): boolean {
  if (!categoryId || categoryId === 'all') return true;
  const rule = CATEGORY_RULES[categoryId] ?? { keywords: [categoryId] };
  if (rule.recipeCategories?.includes(recipe.category)) return true;
  const text = normalize(`${recipe.title} ${recipe.description} ${recipe.category}`);
  return rule.keywords.some(keyword => new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalize(keyword))}`).test(text));
}

interface CategoriesBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  language?: SupportedLanguage;
}

export const CategoriesBar: React.FC<CategoriesBarProps> = ({
  selectedCategory,
  onSelectCategory,
  language = 'fr'
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -240 : 240;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const getCategoryLabel = (id: string, defaultName: string) => {
    if (id === 'all') return t.catAll || 'Toutes';
    const key = `cat${id.replace(/\s+/g, '')}`;
    return t[key] || defaultName;
  };

  return (
    <div className="relative py-2">
      {/* Scroll controls */}
      <button
        onClick={() => scroll('left')}
        aria-label="Previous categories"
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/95 border border-slate-200/80 shadow-md items-center justify-center text-slate-700 hover:text-[#FF4E27] hover:scale-110 active:scale-95 transition-all -ml-3"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => scroll('right')}
        aria-label="Next categories"
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/95 border border-slate-200/80 shadow-md items-center justify-center text-slate-700 hover:text-[#FF4E27] hover:scale-110 active:scale-95 transition-all -mr-3"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Categories track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2.5 overflow-x-auto scroll-smooth no-scrollbar px-1 py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CULINARY_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id || (cat.id === 'all' && (!selectedCategory || selectedCategory === 'all'));
          
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl whitespace-nowrap text-xs font-bold transition-all duration-200 shrink-0 select-none ${
                isSelected
                  ? 'bg-gradient-to-r from-[#FF4E27] to-[#FF7849] text-white shadow-md shadow-[#FF4E27]/25 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <span className="text-sm shrink-0 leading-none">
                {cat.emoji}
              </span>
              <span>{getCategoryLabel(cat.id, cat.name)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
