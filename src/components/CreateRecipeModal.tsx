import React, { useState, useMemo } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Plus, 
  Trash2, 
  Clock, 
  Flame, 
  Users, 
  Globe2, 
  UtensilsCrossed, 
  Sparkles,
  Check,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { Recipe, Ingredient, RecipeStep, User } from '../types';
import { AfroIngredientsPicker } from './AfroIngredientsPicker';
import { AfroIngredient, searchAfroIngredients } from '../data/afroCaribbeanIngredients';
import { RecipeInput, uploadRecipeImage, uploadRecipeStepMedia, MAX_STEP_VIDEO_SECONDS } from '../services/recipeService';
import { toUserMessage } from '../lib/supabase';

const SAMPLE_STEP_MEDIA = [
  { type: 'video' as const, label: 'Vidéo Éminçage (18s)', url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-chef-cutting-onion-43091-large.mp4', duration: 18 },
  { type: 'video' as const, label: 'Vidéo Saisie au Wok (24s)', url: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-vegetables-in-a-pan-43093-large.mp4', duration: 24 },
  { type: 'photo' as const, label: 'Photo Marinade épicée', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
  { type: 'photo' as const, label: 'Photo Cuisson feu vif', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80' }
];

/** Reads a local video's length (seconds) before uploading it; NaN when the browser cannot tell. */
const readVideoDuration = (file: File) =>
  new Promise<number>((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(NaN);
    };
    video.src = url;
  });

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  /** When provided, the form edits this recipe instead of creating a new one. */
  initialRecipe?: Recipe | null;
  /** Persists the recipe; rejects with an error to display in the form. */
  onSubmitRecipe: (input: RecipeInput) => Promise<void>;
}

const PRESET_DISH_IMAGES = [
  { label: 'Thiéboudienne / Riz au poisson', url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80' },
  { label: 'Colombo / Mijoté créole', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80' },
  { label: 'Griot / Porc croustillant', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80' },
  { label: 'Attiéké / Poisson braisé', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80' },
  { label: 'Jerk Chicken fumé', url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80' },
  { label: 'Bokit Guadeloupéen', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80' }
];

const COUNTRY_OPTIONS = [
  { name: 'Sénégal', flag: '🇸🇳' },
  { name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { name: 'Haïti', flag: '🇭🇹' },
  { name: 'Martinique', flag: '🇲🇶' },
  { name: 'Guadeloupe', flag: '🇬🇵' },
  { name: 'Jamaïque', flag: '🇯🇲' },
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'Cameroun', flag: '🇨🇲' },
  { name: 'Mali', flag: '🇲🇱' },
  { name: 'Guinée', flag: '🇬🇳' },
  { name: 'Congo-Brazzaville', flag: '🇨🇬' },
  { name: 'RDC (Congo-Kinshasa)', flag: '🇨🇩' },
  { name: 'Ghana', flag: '🇬🇭' },
  { name: 'Bénin', flag: '🇧🇯' },
  { name: 'Togo', flag: '🇹🇬' },
  { name: 'Gabon', flag: '🇬🇦' },
  { name: 'Kenya', flag: '🇰🇪' },
  { name: 'Tanzanie', flag: '🇹🇿' },
  { name: 'Angola', flag: '🇦🇴' },
  { name: 'Cap-Vert', flag: '🇨🇻' },
  { name: 'Madagascar', flag: '🇲🇬' },
  { name: 'Guyane', flag: '🇬🇫' },
  { name: 'La Réunion', flag: '🇷🇪' },
  { name: 'Trinité-et-Tobago', flag: '🇹🇹' },
  { name: 'Barbade', flag: '🇧🇧' },
  { name: 'Autre (Terroir personnalisé)', flag: '🌍' }
];

export const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialRecipe,
  onSubmitRecipe,
}) => {
  if (!isOpen) return null;

  const isEditMode = Boolean(initialRecipe);
  const [title, setTitle] = useState(initialRecipe?.title ?? '');
  const [description, setDescription] = useState(initialRecipe?.description ?? '');
  const [country, setCountry] = useState(initialRecipe?.country || currentUser.country || 'Sénégal');
  const [countryFlag, setCountryFlag] = useState(initialRecipe?.countryFlag || currentUser.countryFlag || '🇸🇳');
  const [category, setCategory] = useState<Recipe['category']>(initialRecipe?.category ?? 'Plats Traditionnels');
  const [difficulty, setDifficulty] = useState<Recipe['difficulty']>(initialRecipe?.difficulty ?? 'Moyen');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(initialRecipe?.prepTimeMinutes ?? 30);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(initialRecipe?.cookTimeMinutes ?? 45);
  const [servings, setServings] = useState(initialRecipe?.servings ?? 4);
  const [imageUrl, setImageUrl] = useState(initialRecipe?.imageUrl ?? PRESET_DISH_IMAGES[0].url);
  const [heritageStory, setHeritageStory] = useState(initialRecipe?.heritageStory ?? '');
  const [isPublished, setIsPublished] = useState(initialRecipe?.isPublished ?? true);

  // Backend submission state
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Step photo / video (max 30 s) uploads
  const [uploadingStepIdx, setUploadingStepIdx] = useState<number | null>(null);
  const [stepMediaError, setStepMediaError] = useState<{ idx: number; message: string } | null>(null);

  // Dynamic ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialRecipe?.ingredients.length ? initialRecipe.ingredients : [
    { id: '1', name: 'Riz brisé ou Maniocs', amount: 500, unit: 'g', aisle: 'Féculents & Racines' },
    { id: '2', name: 'Oignons cives et ail frais', amount: 3, unit: 'pièces', aisle: 'Marché Frais & Légumes' },
    { id: '3', name: 'Épices créoles ou colombo', amount: 2, unit: 'c. à soupe', aisle: 'Épicerie & Épices Afro' }
  ]);

  const [showCatalog, setShowCatalog] = useState(true);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number | null>(null);

  const handleSelectAfroIngredient = (item: AfroIngredient) => {
    // Si le dernier ingrédient a un nom vide, on le remplit, sinon on en ajoute un
    const lastIdx = ingredients.length - 1;
    if (lastIdx >= 0 && !ingredients[lastIdx].name.trim()) {
      const updated = [...ingredients];
      updated[lastIdx] = {
        ...updated[lastIdx],
        name: item.name,
        amount: item.defaultAmount,
        unit: item.defaultUnit,
        aisle: item.aisle
      };
      setIngredients(updated);
    } else {
      setIngredients([
        ...ingredients,
        {
          id: `ing-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: item.name,
          amount: item.defaultAmount,
          unit: item.defaultUnit,
          aisle: item.aisle
        }
      ]);
    }
  };

  const handleRemoveIngredientByName = (name: string) => {
    const nameLower = name.toLowerCase();
    const updated = ingredients.filter(
      i => !i.name.toLowerCase().includes(nameLower) && !nameLower.includes(i.name.toLowerCase())
    );
    if (updated.length === 0) {
      setIngredients([{ id: Date.now().toString(), name: '', amount: 100, unit: 'g', aisle: 'Féculents & Racines' }]);
    } else {
      setIngredients(updated);
    }
  };

  // Dynamic steps
  const [steps, setSteps] = useState<RecipeStep[]>(initialRecipe?.steps.length ? initialRecipe.steps : [
    { stepNumber: 1, title: 'Marinade et découpe', instruction: 'Nettoyer soigneusement les pièces et faire mariner avec ail, citron et épices pendant au moins 1 heure.', tip: 'Une marinade au frais renforce les saveurs.' },
    { stepNumber: 2, title: 'Saisie et mijotage', instruction: 'Faire dorer à feu vif puis baisser le feu et laisser mijoter avec la garniture aromatique.', tip: 'Remuer régulièrement.' }
  ]);

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: '', amount: 100, unit: 'g', aisle: 'Épicerie & Épices Afro' }
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    setSteps([
      ...steps,
      { stepNumber: steps.length + 1, title: '', instruction: '', tip: '' }
    ]);
  };

  const handleRemoveStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index).map((s, idx) => ({
      ...s,
      stepNumber: idx + 1
    }));
    setSteps(updated);
  };

  const updateStepMedia = (stepIdx: number, media: Pick<RecipeStep, 'mediaType' | 'mediaUrl' | 'videoDurationSeconds'>) => {
    setSteps(prev => prev.map((s, i) => (i === stepIdx ? { ...s, ...media } : s)));
  };

  // Step media are uploaded to Supabase Storage right away, like the main photo
  const handleStepMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, stepIdx: number) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || uploadingStepIdx !== null) return;
    setStepMediaError(null);

    let duration: number | undefined;
    if (file.type.startsWith('video')) {
      const seconds = await readVideoDuration(file);
      if (Number.isFinite(seconds) && seconds > MAX_STEP_VIDEO_SECONDS + 0.5) {
        setStepMediaError({
          idx: stepIdx,
          message: `Cette vidéo dure ${Math.round(seconds)} s : les vidéos de préparation sont limitées à ${MAX_STEP_VIDEO_SECONDS} secondes.`
        });
        return;
      }
      duration = Number.isFinite(seconds) ? Math.max(1, Math.round(seconds)) : undefined;
    }

    setUploadingStepIdx(stepIdx);
    try {
      const { mediaType, url } = await uploadRecipeStepMedia(file);
      updateStepMedia(stepIdx, {
        mediaType,
        mediaUrl: url,
        videoDurationSeconds: mediaType === 'video' ? duration : undefined
      });
    } catch (error) {
      setStepMediaError({ idx: stepIdx, message: toUserMessage(error, 'Le téléversement du média a échoué.') });
    } finally {
      setUploadingStepIdx(null);
    }
  };

  const handleSelectPresetStepMedia = (stepIdx: number, sample: typeof SAMPLE_STEP_MEDIA[number]) => {
    setStepMediaError(null);
    updateStepMedia(stepIdx, {
      mediaType: sample.type,
      mediaUrl: sample.url,
      videoDurationSeconds: 'duration' in sample ? sample.duration : undefined
    });
  };

  const handleRemoveStepMedia = (stepIdx: number) => {
    updateStepMedia(stepIdx, { mediaType: undefined, mediaUrl: undefined, videoDurationSeconds: undefined });
  };

  // Photos are uploaded to Supabase Storage right away; the form stores the public URL
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setImageError(null);
    setImagePreviewUrl(URL.createObjectURL(file));
    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadRecipeImage(file);
      setImageUrl(publicUrl);
    } catch (error) {
      setImagePreviewUrl(null);
      setImageError(toUserMessage(error, 'Le téléversement de la photo a échoué.'));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isUploadingImage || uploadingStepIdx !== null) return;
    setSubmitError(null);

    if (title.trim().length < 3) {
      setSubmitError('Le nom du plat doit contenir au moins 3 caractères.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRecipe({
        title,
        description: description.trim() || 'Une délicieuse recette authentique afro-caribéenne partagée avec passion.',
        country,
        countryFlag,
        category,
        difficulty,
        prepTimeMinutes,
        cookTimeMinutes,
        servings,
        imageUrl,
        heritageStory,
        ingredients,
        steps,
        isPublished
      });
      onClose();
    } catch (error) {
      setSubmitError(toUserMessage(error, 'La recette n’a pas pu être enregistrée.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center-safe justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 text-[#FF4E27]">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-slate-900">
                {isEditMode ? 'Modifier la recette' : 'Créer une nouvelle recette'}
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Partagez vos secrets et perpétuez la tradition culinaire
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Nom du plat *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Poulet DG aux Plantains Dorés, Yassa au Feu de Bois..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#FF4E27] focus:ring-1 focus:ring-[#FF4E27] focus:outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Description & saveurs
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Racontez la texture, les parfums et la convivialité de ce plat..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#FF4E27] focus:ring-1 focus:ring-[#FF4E27] focus:outline-none text-sm font-normal"
              />
            </div>
          </div>

          {/* Photo Picker: Camera / Upload / Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Photo du plat (depuis votre appareil ou sélection)
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="relative shrink-0">
                <img
                  src={imagePreviewUrl || imageUrl}
                  alt="Aperçu plat"
                  className="w-32 h-24 rounded-xl object-cover border border-white shadow-sm"
                />
                {isUploadingImage && (
                  <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" aria-label="Téléversement en cours" />
                  </div>
                )}
              </div>
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#FF4E27] text-[#FF4E27] hover:bg-orange-50 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Téléverser photo</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#0F3E2E] text-[#0F3E2E] hover:bg-emerald-50 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Caméra directe</span>
                    <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {imageError && (
                  <p role="alert" className="text-[11px] font-bold text-rose-600">{imageError}</p>
                )}
                <p className="text-[11px] text-slate-500">
                  JPEG, PNG ou WebP · 5 Mo maximum. Ou sélectionnez un visuel haute fidélité ci-dessous :
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_DISH_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImageUrl(preset.url);
                        setImagePreviewUrl(null);
                        setImageError(null);
                      }}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${
                        imageUrl === preset.url
                          ? 'bg-[#FF4E27] text-white border-[#FF4E27]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enforced Country & Flag Banner Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50/80 to-amber-50/60 border-2 border-[#FF4E27]/30 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                <Globe2 className="w-4 h-4 text-[#FF4E27]" />
                <span>Pays & Drapeau d'Origine * (Obligatoire)</span>
              </label>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#FF4E27]/40 shadow-xs">
                <span className="text-lg">{countryFlag}</span>
                <span className="text-xs font-bold text-slate-900">{country}</span>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-snug">
              Chaque créateur doit obligatoirement rattacher sa recette à son pays ou terroir d'inspiration afin de préserver l'héritage gastronomique.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Sélectionnez le pays d'origine :
                </span>
                <select
                  required
                  value={country}
                  onChange={(e) => {
                    const selected = COUNTRY_OPTIONS.find(c => c.name === e.target.value);
                    if (selected) {
                      setCountry(selected.name);
                      setCountryFlag(selected.flag);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-bold focus:border-[#FF4E27] focus:ring-1 focus:ring-[#FF4E27] focus:outline-none shadow-2xs"
                >
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Drapeau personnalisé ou ajustement :
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={countryFlag}
                    onChange={(e) => setCountryFlag(e.target.value)}
                    placeholder="Drapeau (ex: 🇸🇳, 🇭🇹, 🇨🇮...)"
                    className="w-20 px-3 py-2 rounded-xl border border-slate-300 bg-white text-center text-base focus:border-[#FF4E27] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Nom du pays / terroir"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:border-[#FF4E27] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Row: Category, Difficulty, Times, Servings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 font-medium focus:border-[#FF4E27] focus:outline-none"
              >
                <option value="Rice">🍚 Rice (Riz & Céréales)</option>
                <option value="Chicken">🍗 Chicken (Poulet & Volailles)</option>
                <option value="Soup">🍲 Soup (Soupes & Bouillons)</option>
                <option value="Shrimp">🦐 Shrimp (Crevettes & Crustacés)</option>
                <option value="Breakfast">🥐 Breakfast (Petit-déjeuner)</option>
                <option value="Salmon">🍣 Salmon (Saumon)</option>
                <option value="Drinks">🍹 Drinks (Boissons & Jus)</option>
                <option value="Lunch">🍱 Lunch (Déjeuner express)</option>
                <option value="Healthy">🥗 Healthy (Équilibré & Vitalité)</option>
                <option value="Afro Vegan">🌱 Afro Vegan (100% végétal)</option>
                <option value="Salad">🥑 Salad (Salades & Fraîcheur)</option>
                <option value="Fish">🐟 Fish (Poissons & Poissons braisés)</option>
                <option value="Kids">🧒 Kids (Pour les enfants)</option>
                <option value="Vegetarian">🥕 Vegetarian (Végétarien)</option>
                <option value="Plats Traditionnels">🥘 Plats Traditionnels</option>
                <option value="Street Food">🌮 Street Food & Bokits</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                Difficulté
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:border-[#FF4E27] focus:outline-none"
              >
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                Préparation (min)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                Cuisson (min)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={cookTimeMinutes}
                onChange={(e) => setCookTimeMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                Portions (convives)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic Ingredients Section */}
          <div className="space-y-4">
            
            {/* Header with Catalog Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Ingrédients & Rayons d'épicerie *
                </label>
                <p className="text-[11px] text-slate-500">
                  Choisissez parmi le catalogue traditionnel afro-caribéen ou saisissez vos propres ingrédients.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCatalog(!showCatalog)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    showCatalog
                      ? 'bg-orange-50 text-[#FF4E27] border-orange-200 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#FF4E27]" />
                  <span>Catalogue Terroir (120+ Ingrédients)</span>
                  {showCatalog ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ligne libre</span>
                </button>
              </div>
            </div>

            {/* Expandable Afro-Caribbean Ingredients Catalog */}
            {showCatalog && (
              <AfroIngredientsPicker
                currentIngredients={ingredients}
                onSelectIngredient={handleSelectAfroIngredient}
                onRemoveIngredientByName={handleRemoveIngredientByName}
              />
            )}

            {/* Ingrédients List with In-Line Autocomplete */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
                <span>Ingrédients sélectionnés ({ingredients.filter(i => i.name.trim()).length}) :</span>
                <span>Unité · Quantité · Rayon</span>
              </div>

              {ingredients.map((ing, idx) => {
                const queryText = ing.name.trim();
                const showSuggestions = activeSuggestionIndex === idx && queryText.length >= 2;
                const rowSuggestions = showSuggestions ? searchAfroIngredients(queryText).slice(0, 6) : [];

                return (
                  <div key={ing.id} className="relative">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={ing.name}
                          onFocus={() => setActiveSuggestionIndex(idx)}
                          onChange={(e) => {
                            const updated = [...ingredients];
                            updated[idx].name = e.target.value;
                            setIngredients(updated);
                            setActiveSuggestionIndex(idx);
                          }}
                          placeholder="Nom ingrédient (ex: Manioc, Haricots rouges, Plantain, Gombo...)"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#FF4E27] focus:ring-1 focus:ring-[#FF4E27] focus:outline-none"
                        />

                        {/* In-Line Autocomplete Dropdown */}
                        {showSuggestions && rowSuggestions.length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white rounded-xl shadow-xl border border-orange-200 overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
                            <div className="px-3 py-1.5 bg-orange-50 text-[10px] font-bold text-orange-800 flex items-center justify-between">
                              <span>Suggestions du terroir afro-caribéen :</span>
                              <button
                                type="button"
                                onClick={() => setActiveSuggestionIndex(null)}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            {rowSuggestions.map((sug) => (
                              <button
                                key={sug.id}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault(); // Prevent input blur before click
                                  const updated = [...ingredients];
                                  updated[idx] = {
                                    ...updated[idx],
                                    name: sug.name,
                                    amount: sug.defaultAmount,
                                    unit: sug.defaultUnit,
                                    aisle: sug.aisle
                                  };
                                  setIngredients(updated);
                                  setActiveSuggestionIndex(null);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-orange-50/70 flex items-center justify-between text-xs transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{sug.icon}</span>
                                  <div>
                                    <div className="font-bold text-slate-900">{sug.name}</div>
                                    {sug.aliases.length > 0 && (
                                      <div className="text-[10px] text-slate-500">
                                        Alias : {sug.aliases.slice(0, 3).join(', ')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] font-semibold text-[#FF4E27] block">
                                    {sug.defaultAmount} {sug.defaultUnit}
                                  </span>
                                  <span className="text-[9px] text-slate-400">
                                    {sug.aisle}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={ing.amount}
                        onChange={(e) => {
                          const updated = [...ingredients];
                          updated[idx].amount = Number(e.target.value);
                          setIngredients(updated);
                        }}
                        className="w-20 px-2 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none font-mono text-center font-bold text-slate-900"
                      />

                      <input
                        type="text"
                        value={ing.unit}
                        onChange={(e) => {
                          const updated = [...ingredients];
                          updated[idx].unit = e.target.value;
                          setIngredients(updated);
                        }}
                        placeholder="g, ml, c.s"
                        className="w-20 px-2 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none text-center font-medium"
                      />

                      <select
                        value={ing.aisle}
                        onChange={(e) => {
                          const updated = [...ingredients];
                          updated[idx].aisle = e.target.value as any;
                          setIngredients(updated);
                        }}
                        className="w-36 px-2 py-2 rounded-xl border border-slate-200 text-[11px] bg-white focus:border-[#FF4E27] focus:outline-none font-medium"
                      >
                        <option value="Marché Frais & Légumes">Marché Frais & Légumes</option>
                        <option value="Boucherie & Poissons">Boucherie & Poissons</option>
                        <option value="Épicerie & Épices Afro">Épicerie & Épices Afro</option>
                        <option value="Féculents & Racines">Féculents & Racines</option>
                        <option value="Condiments & Huiles">Condiments & Huiles</option>
                        <option value="Rayon Frais">Rayon Frais</option>
                      </select>

                      {ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(idx)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                          title="Supprimer cet ingrédient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Étapes de préparation & Cuisson
              </label>
              <button
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-1 text-xs font-semibold text-[#FF4E27] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une étape</span>
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((st, idx) => (
                <div key={st.stepNumber} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF4E27]">
                      Étape {st.stepNumber}
                    </span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-[11px] text-rose-600 hover:underline font-semibold"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[idx].title = e.target.value;
                      setSteps(updated);
                    }}
                    placeholder="Titre de l'étape (ex: Préparation de la sauce tomate)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={st.instruction}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[idx].instruction = e.target.value;
                      setSteps(updated);
                    }}
                    placeholder="Instructions détaillées..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={st.tip || ''}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[idx].tip = e.target.value;
                      setSteps(updated);
                    }}
                    placeholder="Astuce de grand-mère ou du chef (optionnel)"
                    className="w-full px-3 py-1 rounded-lg border border-slate-200 focus:border-[#FF4E27] text-[11px] italic bg-white"
                  />

                  {/* Step Photo or Video (Max 30s) */}
                  <div className="pt-2 border-t border-slate-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-[#FF4E27]" />
                        <span>Média de préparation (Photo ou Vidéo max 30 sec)</span>
                      </span>
                      {st.mediaUrl && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStepMedia(idx)}
                          className="text-[10px] text-rose-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Retirer média</span>
                        </button>
                      )}
                    </div>

                    {st.mediaUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 p-1.5">
                        {st.mediaType === 'video' ? (
                          <div className="space-y-1">
                            <video
                              src={st.mediaUrl}
                              controls
                              playsInline
                              className="w-full max-h-48 rounded-lg object-contain bg-black"
                            />
                            <div className="flex items-center justify-between px-2 py-0.5 text-[10px] text-slate-300">
                              <span className="flex items-center gap-1 font-bold text-emerald-400">
                                <Check className="w-3 h-3" />
                                Vidéo de l'étape ({st.videoDurationSeconds || MAX_STEP_VIDEO_SECONDS}s max)
                              </span>
                              <span className="font-mono text-slate-400">Max 30s respecté</span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative h-36 w-full rounded-lg overflow-hidden">
                            <img
                              src={st.mediaUrl}
                              alt={`Étape ${st.stepNumber}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-emerald-400" />
                              <span>Photo de l'étape</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-[#FF4E27] text-slate-700 text-xs font-semibold transition-all shadow-2xs ${
                            uploadingStepIdx !== null ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                          }`}>
                            {uploadingStepIdx === idx
                              ? <Loader2 className="w-3.5 h-3.5 text-[#FF4E27] animate-spin" />
                              : <Camera className="w-3.5 h-3.5 text-[#FF4E27]" />}
                            <span>{uploadingStepIdx === idx ? 'Téléversement…' : 'Ajouter Photo ou Vidéo'}</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                              onChange={(e) => handleStepMediaUpload(e, idx)}
                              disabled={uploadingStepIdx !== null}
                              className="hidden"
                            />
                          </label>
                          <span className="text-[10px] text-slate-500 font-medium">
                            Photos (5 Mo) ou courtes vidéos de 30s maximum (25 Mo)
                          </span>
                        </div>

                        {/* Presets library */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-semibold text-slate-400">Exemples rapides :</span>
                          {SAMPLE_STEP_MEDIA.map((smp, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleSelectPresetStepMedia(idx, smp)}
                              className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-[#FF4E27] text-[10px] font-medium text-slate-600 hover:text-[#FF4E27] transition-colors cursor-pointer"
                            >
                              {smp.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {stepMediaError?.idx === idx && (
                      <p role="alert" className="text-[11px] font-bold text-rose-600">{stepMediaError.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Heritage Story */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Histoire & Origine culturelle (Héritage)
            </label>
            <textarea
              rows={2}
              value={heritageStory}
              onChange={(e) => setHeritageStory(e.target.value)}
              placeholder="Racontez la légende ou la signification de ce plat dans votre famille ou votre pays..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none font-normal"
            />
          </div>

          {/* Publication status */}
          <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="mt-0.5 rounded text-[#FF4E27] focus:ring-[#FF4E27] w-4 h-4"
            />
            <span>
              <span className="block text-xs font-bold text-slate-900">Publier immédiatement</span>
              <span className="block text-[11px] text-slate-500">
                Décochez pour enregistrer en brouillon : la recette ne sera visible que par les administrateurs.
              </span>
            </span>
          </label>

          {submitError && (
            <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage || uploadingStepIdx !== null}
              className="px-6 py-2.5 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-bold shadow-md shadow-[#FF4E27]/25 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:hover:scale-100 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {isEditMode
                  ? 'Enregistrer les modifications'
                  : isPublished ? 'Publier la recette' : 'Enregistrer le brouillon'}
              </span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
