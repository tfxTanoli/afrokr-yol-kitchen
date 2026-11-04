import React, { useState } from 'react';
import { 
  X, 
  Link2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Instagram, 
  Youtube, 
  Globe, 
  Utensils
} from 'lucide-react';
import { Recipe, User } from '../types';
import { getCountryFlag } from '../utils/countryFlags';

interface ImportUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onRecipeImported: (recipe: Recipe) => void;
}

interface PresetDemoLink {
  title: string;
  source: 'Instagram' | 'YouTube' | 'Blog Culinaire';
  url: string;
  extractedRecipe: Partial<Recipe>;
}

const PRESET_DEMO_LINKS: PresetDemoLink[] = [
  {
    title: 'Poulet DG Camerounais croustillant aux plantains',
    source: 'Instagram',
    url: 'https://instagram.com/reel/C89xZafroKitchen/poulet-dg',
    extractedRecipe: {
      title: 'Poulet DG Camerounais aux Plantains Mûrs Dorés',
      description: 'Le mythique "Directeur Général" : poulet mariné aux herbes fraîches, rondelles de plantains dorés à souhait, carottes, haricots verts et poivrons croquants.',
      country: 'Cameroun',
      countryFlag: '🇨🇲',
      category: 'Plats Traditionnels',
      difficulty: 'Moyen',
      prepTimeMinutes: 30,
      cookTimeMinutes: 45,
      servings: 4,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      heritageStory: 'Dans les années 1980 à Yaoundé, ce plat riche était traditionnellement réservé aux Directeurs Généraux et personnalités d\'honneur.',
      ingredients: [
        { id: 'dg1', name: 'Poulet fermier coupé en morceaux', amount: 1.2, unit: 'kg', aisle: 'Boucherie & Poissons' },
        { id: 'dg2', name: 'Bananes plantains mûres tranchées', amount: 3, unit: 'pièces', aisle: 'Féculents & Racines' },
        { id: 'dg3', name: 'Carottes, haricots verts et poivrons', amount: 400, unit: 'g', aisle: 'Marché Frais & Légumes' },
        { id: 'dg4', name: 'Herbes de base : persil, poivre blanc de Penja', amount: 2, unit: 'c. à soupe', aisle: 'Épicerie & Épices Afro' }
      ],
      steps: [
        { stepNumber: 1, title: 'Marinade au poivre de Penja', instruction: 'Faire mariner le poulet avec persil, ail, gingembre et poivre blanc de Penja.', durationMinutes: 15 },
        { stepNumber: 2, title: 'Friture des plantains', instruction: 'Dorer les rondelles de plantain dans l\'huile chaude jusqu\'à belle caramélisation.', durationMinutes: 10 },
        { stepNumber: 3, title: 'Mijotage de la poêlée royale', instruction: 'Sauter les légumes croquants avec le poulet doré et assembler avec les plantains fondants.', durationMinutes: 20 }
      ]
    }
  },
  {
    title: 'Accras de Morue Croustillants à la Cive',
    source: 'YouTube',
    url: 'https://youtube.com/watch?v=kreyol_accras_morue',
    extractedRecipe: {
      title: 'Accras de Morue Antillais Croustillants & Cives Fraîches',
      description: 'Beignets légers et aériens à la morue dessalée, relevés de piment végétarien et d\'herbes du jardin créole.',
      country: 'Guadeloupe',
      countryFlag: '🇬🇵',
      category: 'Street Food',
      difficulty: 'Facile',
      prepTimeMinutes: 25,
      cookTimeMinutes: 15,
      servings: 6,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      heritageStory: 'Le roi incontournable de l\'apéritif antillais du dimanche et du Vendredi Saint.',
      ingredients: [
        { id: 'ac1', name: 'Morue séchée dessalée et émiettée', amount: 300, unit: 'g', aisle: 'Boucherie & Poissons' },
        { id: 'ac2', name: 'Farine de blé', amount: 250, unit: 'g', aisle: 'Féculents & Racines' },
        { id: 'ac3', name: 'Cives, persil pays, piment végétarien', amount: 1, unit: 'botte', aisle: 'Marché Frais & Légumes' },
        { id: 'ac4', name: 'Bicarbonate ou levure chimique', amount: 1, unit: 'c. à café', aisle: 'Épicerie & Épices Afro' }
      ],
      steps: [
        { stepNumber: 1, title: 'Appareil à accras', instruction: 'Mélanger la farine, l\'eau froide, la morue émiettée et le hachis d\'herbes aromatiques.', durationMinutes: 15 },
        { stepNumber: 2, title: 'Cuisson en bain d\'huile', instruction: 'Déposer des petites cuillères de pâte dans l\'huile à 180°C. Les accras remontent et dorent en 4 minutes.', durationMinutes: 10 }
      ]
    }
  },
  {
    title: 'Diri ak Djon Djon (Riz aux champignons noirs d\'Haïti)',
    source: 'Blog Culinaire',
    url: 'https://haitianflavor.com/recettes/diri-ak-djon-djon',
    extractedRecipe: {
      title: 'Diri ak Djon Djon & Pois du Cap Haïtiens',
      description: 'Riz noir emblématique parfumé à l\'infusion de champignons noirs séchés du Nord d\'Haïti, petits pois lima et crevettes séchées.',
      country: 'Haïti',
      countryFlag: '🇭🇹',
      category: 'Plats Traditionnels',
      difficulty: 'Moyen',
      prepTimeMinutes: 20,
      cookTimeMinutes: 35,
      servings: 4,
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
      heritageStory: 'Le Djon Djon est un champignon sauvage poussant sur les troncs d\'arbres morts dans la région du Cap-Haïtien.',
      ingredients: [
        { id: 'dj1', name: 'Champignons séchés Djon Djon', amount: 50, unit: 'g', aisle: 'Épicerie & Épices Afro' },
        { id: 'dj2', name: 'Riz jasmin ou long grain', amount: 400, unit: 'g', aisle: 'Féculents & Racines' },
        { id: 'dj3', name: 'Pois du cap (Lima beans)', amount: 150, unit: 'g', aisle: 'Marché Frais & Légumes' },
        { id: 'dj4', name: 'Piment habanero entier et clous de girofle', amount: 2, unit: 'pièces', aisle: 'Épicerie & Épices Afro' }
      ],
      steps: [
        { stepNumber: 1, title: 'Infusion du Djon Djon', instruction: 'Faire bouillir les champignons dans 1 litre d\'eau pendant 10 minutes puis filtrer le jus noir parfumé.', durationMinutes: 15 },
        { stepNumber: 2, title: 'Cuisson du riz parfumé', instruction: 'Faire revenir les pois et le riz dans l\'huile, mouiller avec le bouillon noir et cuire à couvert.', durationMinutes: 20 }
      ]
    }
  }
];

export const ImportUrlModal: React.FC<ImportUrlModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRecipeImported,
}) => {
  if (!isOpen) return null;

  const [inputUrl, setInputUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<Recipe> | null>(null);

  const handleSimulateExtraction = (targetUrl?: string, preset?: Partial<Recipe>) => {
    const url = targetUrl || inputUrl;
    if (!url.trim()) return;

    setIsExtracting(true);
    setExtractedData(null);

    setTimeout(() => {
      setIsExtracting(false);
      if (preset) {
        setExtractedData(preset);
      } else {
        // Fallback generic extraction
        setExtractedData({
          title: 'Alloco Croustillant & Sauce Piment Doux',
          description: 'Recette extraite automatiquement : bananes plantains frites aux épices afro avec sauce tomate acidulée.',
          country: 'Côte d\'Ivoire',
          countryFlag: '🇨🇮',
          category: 'Street Food',
          difficulty: 'Facile',
          prepTimeMinutes: 15,
          cookTimeMinutes: 15,
          servings: 2,
          imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
          heritageStory: 'Street food populaire ouest-africaine par excellence.',
          ingredients: [
            { id: 'al1', name: 'Bananes plantains mûres tachetées', amount: 3, unit: 'pièces', aisle: 'Féculents & Racines' },
            { id: 'al2', name: 'Huile de friture', amount: 300, unit: 'ml', aisle: 'Condiments & Huiles' },
            { id: 'al3', name: 'Piment en poudre et sel', amount: 1, unit: 'c. à café', aisle: 'Épicerie & Épices Afro' }
          ],
          steps: [
            { stepNumber: 1, title: 'Découpe des cubes', instruction: 'Couper les plantains en cubes réguliers et saler légèrement.' },
            { stepNumber: 2, title: 'Dorure à l\'huile', instruction: 'Frire jusqu\'à ce que les bords soient bien dorés et croustillants.' }
          ]
        });
      }
    }, 1200);
  };

  const handleConfirmSave = () => {
    if (!extractedData) return;

    const countryName = extractedData.country || 'Sénégal';
    const flag = extractedData.countryFlag || getCountryFlag(countryName);

    const newRecipe: Recipe = {
      id: `imported-${Date.now()}`,
      title: extractedData.title || 'Recette importée',
      description: extractedData.description || 'Recette extraite du web et publiée par la communauté.',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorHandle: currentUser.handle || `@${currentUser.name.toLowerCase().replace(/\s+/g, '_')}`,
      authorRole: currentUser.role,
      country: countryName,
      countryFlag: flag,
      category: (extractedData.category as any) || 'Plats Traditionnels',
      difficulty: (extractedData.difficulty as any) || 'Moyen',
      prepTimeMinutes: extractedData.prepTimeMinutes || 25,
      cookTimeMinutes: extractedData.cookTimeMinutes || 30,
      servings: extractedData.servings || 4,
      imageUrl: extractedData.imageUrl || 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800',
      heritageStory: extractedData.heritageStory || 'Recette importée depuis un lien web/social et partagée sur le feed Afrodelicious.',
      likesCount: 1,
      commentsCount: 0,
      bookmarksCount: 0,
      isLiked: true,
      isBookmarked: false,
      ingredients: extractedData.ingredients || [],
      steps: extractedData.steps || [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    onRecipeImported(newRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-[#0F3E2E]">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-black text-xl text-slate-900">
                Importer depuis un lien
              </h2>
              <p className="text-xs text-slate-500">
                Extraction automatique depuis Instagram, TikTok, YouTube ou blog culinaire
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Supported sources indicator */}
          <div className="flex items-center gap-4 text-xs text-slate-500 pb-2 border-b border-slate-200">
            <span className="font-medium">Sources compatibles :</span>
            <span className="flex items-center gap-1 text-[#E1306C]"><Instagram className="w-3.5 h-3.5" /> Instagram Reels</span>
            <span className="flex items-center gap-1 text-[#FF0000]"><Youtube className="w-3.5 h-3.5" /> YouTube</span>
            <span className="flex items-center gap-1 text-[#0F3E2E] font-medium"><Globe className="w-3.5 h-3.5" /> Tous sites web</span>
          </div>

          {/* URL Input Form */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              Collez l'URL de la recette ou vidéo
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/... ou https://youtube.com/..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#0F3E2E] focus:outline-none"
              />
              <button
                type="button"
                disabled={isExtracting || !inputUrl.trim()}
                onClick={() => handleSimulateExtraction()}
                className="px-4 py-2.5 rounded-xl bg-[#0F3E2E] text-white text-xs font-bold hover:bg-[#15523E] disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-xs"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extraction...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extraire</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preset Demos for instant 1-click test */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Ou essayez un exemple afro-caribéen en 1 clic :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_DEMO_LINKS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputUrl(preset.url);
                    handleSimulateExtraction(preset.url, preset.extractedRecipe);
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-[#0F3E2E] hover:bg-slate-50 text-left transition-all group"
                >
                  <span className="text-[10px] font-bold text-[#0F3E2E] block">
                    {preset.source}
                  </span>
                  <p className="text-xs font-semibold text-slate-900 group-hover:text-[#0F3E2E] line-clamp-2 mt-0.5">
                    {preset.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Extracted Recipe Result Preview */}
          {extractedData && (
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F3E2E]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Recette extraite avec succès !</span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={extractedData.imageUrl}
                  alt={extractedData.title}
                  className="w-20 h-20 rounded-xl object-cover border border-white shadow-xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span>{extractedData.countryFlag}</span>
                    <span>{extractedData.country}</span>
                    <span>·</span>
                    <span>{extractedData.prepTimeMinutes} min prép</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 truncate">
                    {extractedData.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {extractedData.description}
                  </p>
                  <p className="text-[11px] text-[#0F3E2E] font-semibold mt-1">
                    {extractedData.ingredients?.length} ingrédients & {extractedData.steps?.length} étapes identifiés
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={() => setExtractedData(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-white"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enregistrer & Publier (Feed & Profil Instagram)</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
