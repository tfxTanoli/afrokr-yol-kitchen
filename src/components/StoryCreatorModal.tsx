import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  Sparkles, 
  MapPin, 
  Link as LinkIcon, 
  Vote, 
  Lightbulb, 
  Check, 
  Image as ImageIcon,
  Flame,
  Send
} from 'lucide-react';
import { Story, StorySlide, User, Recipe } from '../types';

interface StoryCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  recipes: Recipe[];
  onStoryCreated: (newStory: Story) => void;
}

const PRESET_MEDIA = [
  {
    label: 'Mijotage en Cocotte',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80',
    caption: 'La réduction des sucs à feu doux... Rien ne vaut la patience en cuisine traditionnelle.'
  },
  {
    label: 'Marché aux Épices',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&auto=format&fit=crop&q=80',
    caption: 'Arrivage de curcuma frais, graines à colombo et poivre de Penja ce matin au marché !'
  },
  {
    label: 'Braisé & Grillades',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&auto=format&fit=crop&q=80',
    caption: 'La braise crépite, marinade au piment végétarien et citron vert prête pour les dorades.'
  },
  {
    label: 'Dressage Moderne',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80',
    caption: 'Quand la tradition rencontre la gastronomie contemporaine : le dressage du jour.'
  },
  {
    label: 'Aloco & Fritures',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80',
    caption: 'Plantains bien mûrs et caramélisés. Qui en veut pour le goûter ?'
  }
];

export const StoryCreatorModal: React.FC<StoryCreatorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  recipes,
  onStoryCreated,
}) => {
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(PRESET_MEDIA[0].url);
  const [customMediaUrl, setCustomMediaUrl] = useState('');
  const [caption, setCaption] = useState(PRESET_MEDIA[0].caption);
  const [location, setLocation] = useState(`${currentUser.country} ${currentUser.countryFlag}`);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
  
  // Sticker type
  const [stickerType, setStickerType] = useState<'none' | 'poll' | 'tip'>('poll');
  const [pollQuestion, setPollQuestion] = useState('Votre avis de gourmet sur cette cuisson ?');
  const [pollOption1, setPollOption1] = useState('🔥 Parfaitement caramélisé');
  const [pollOption2, setPollOption2] = useState('👌 Moins piquant');
  const [tipTitle, setTipTitle] = useState('Secret du Chef 💡');
  const [tipContent, setTipContent] = useState('Toujours laisser reposer 5 minutes avant de servir pour détendre les arômes.');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_MEDIA[0]) => {
    setSelectedMediaUrl(preset.url);
    setCaption(preset.caption);
  };

  const handlePublishStory = (e: React.FormEvent) => {
    e.preventDefault();

    const chosenMedia = customMediaUrl.trim() || selectedMediaUrl;
    const linkedRecipe = recipes.find(r => r.id === selectedRecipeId);

    let stickerData: StorySlide['sticker'] = undefined;
    if (stickerType === 'poll' && pollQuestion.trim()) {
      stickerData = {
        type: 'poll',
        question: pollQuestion.trim(),
        options: [
          { label: pollOption1 || 'Option 1', votes: 1 },
          { label: pollOption2 || 'Option 2', votes: 0 }
        ]
      };
    } else if (stickerType === 'tip' && tipContent.trim()) {
      stickerData = {
        type: 'tip',
        tipTitle: tipTitle.trim() || 'Astuce de Chef',
        tipContent: tipContent.trim()
      };
    }

    const newSlide: StorySlide = {
      id: `slide-${Date.now()}`,
      mediaUrl: chosenMedia,
      mediaType: 'image',
      caption: caption.trim() || undefined,
      location: location.trim() || undefined,
      tagRecipeId: linkedRecipe?.id,
      tagRecipeTitle: linkedRecipe?.title,
      tagRecipeImage: linkedRecipe?.imageUrl,
      sticker: stickerData,
      likesCount: 0,
      durationSeconds: 5
    };

    const newStory: Story = {
      id: `story-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userHandle: currentUser.handle,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      userCountry: currentUser.country,
      userCountryFlag: currentUser.countryFlag,
      isVerified: currentUser.isVerified,
      isCurrentUser: true,
      createdAt: 'À l\'instant',
      isViewed: false,
      slides: [newSlide]
    };

    onStoryCreated(newStory);
    onClose();
  };

  const activeMedia = customMediaUrl.trim() || selectedMediaUrl;
  const activeRecipe = recipes.find(r => r.id === selectedRecipeId);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center-safe justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row my-auto max-h-[92vh]">
        
        {/* Left Column: Live Interactive Story Preview */}
        <div className="w-full md:w-[360px] bg-slate-950 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
          <div className="text-center mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Aperçu en direct pour vos abonnés
            </span>
          </div>

          {/* Smartphone mockup */}
          <div className="relative w-full max-w-[270px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 flex flex-col justify-between p-3.5">
            {/* Background Image */}
            <img
              src={activeMedia}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85 pointer-events-none" />

            {/* Top Preview Bar */}
            <div className="relative z-10 space-y-2">
              <div className="h-1 bg-white/40 rounded-full w-full overflow-hidden">
                <div className="h-full bg-white w-2/3" />
              </div>

              <div className="flex items-center gap-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-[#FF4E27]"
                />
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-white block truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-white/80 block truncate">
                    {location}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Content Preview */}
            <div className="relative z-10 space-y-2">
              {/* Poll sticker preview */}
              {stickerType === 'poll' && (
                <div className="bg-white/95 rounded-xl p-2 text-slate-900 text-[10px] space-y-1 shadow-md">
                  <div className="font-bold flex items-center gap-1">
                    <span>📊</span>
                    <span className="truncate">{pollQuestion || 'Votre avis ?'}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="bg-slate-100 p-1.5 rounded-lg font-semibold truncate border border-slate-200">
                      {pollOption1}
                    </div>
                    <div className="bg-slate-100 p-1.5 rounded-lg font-semibold truncate border border-slate-200">
                      {pollOption2}
                    </div>
                  </div>
                </div>
              )}

              {/* Tip sticker preview */}
              {stickerType === 'tip' && (
                <div className="bg-[#0F3E2E]/95 text-white rounded-xl p-2 text-[10px] space-y-0.5 border border-white/20 shadow-md">
                  <div className="font-bold text-[#F59E0B] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{tipTitle}</span>
                  </div>
                  <p className="line-clamp-2 text-white/90">
                    {tipContent}
                  </p>
                </div>
              )}

              {/* Linked Recipe preview */}
              {activeRecipe && (
                <div className="bg-white/95 rounded-xl p-1.5 flex items-center gap-2 text-slate-900 shadow-md">
                  <img
                    src={activeRecipe.imageUrl}
                    alt={activeRecipe.title}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[8px] font-bold uppercase text-[#FF4E27] block">Recette</span>
                    <span className="text-[10px] font-bold truncate block">{activeRecipe.title}</span>
                  </div>
                </div>
              )}

              {/* Caption */}
              {caption && (
                <p className="text-[10px] text-white bg-black/60 backdrop-blur-md p-2 rounded-xl line-clamp-3">
                  {caption}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Story Configuration Controls */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#FF4E27]" />
                  <span>Diffuser une Story Culinaire</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Partagez vos préparations, coulisses et astuces en direct avec la communauté.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form id="storyForm" onSubmit={handlePublishStory} className="space-y-5">
              
              {/* 1. Media Presets / Custom URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  1. Visuel de la Story
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PRESET_MEDIA.map((preset, idx) => {
                    const isSelected = selectedMediaUrl === preset.url && !customMediaUrl;
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setCustomMediaUrl('');
                          handleSelectPreset(preset);
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all text-left ${
                          isSelected ? 'border-[#FF4E27] ring-2 ring-[#FF4E27]/30 scale-105' : 'border-transparent hover:opacity-90'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[9px] font-bold p-1 truncate">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <ImageIcon className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="url"
                    value={customMediaUrl}
                    onChange={(e) => setCustomMediaUrl(e.target.value)}
                    placeholder="Ou collez l'URL d'une photo personnalisée..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#FF4E27] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Caption Text */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    2. Légende & Message aux abonnés
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {caption.length}/180
                  </span>
                </div>
                <textarea
                  value={caption}
                  maxLength={180}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={2}
                  placeholder="Racontez votre secret ou l'odeur qui s'échappe de la marmite..."
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#FF4E27] focus:bg-white focus:outline-none resize-none"
                />
              </div>

              {/* 3. Location & Recipe Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF4E27]" />
                    <span>Lieu / Terroir</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Dakar, Haïti, Abidjan, Paris..."
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#FF4E27] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-[#FF4E27]" />
                    <span>Lier à une Recette</span>
                  </label>
                  <select
                    value={selectedRecipeId}
                    onChange={(e) => setSelectedRecipeId(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#FF4E27] focus:bg-white focus:outline-none"
                  >
                    <option value="">Aucune recette liée</option>
                    {recipes.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.countryFlag} {r.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. Interactive Sticker: Poll or Tip */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  3. Sticker Interactif (Engagement)
                </label>
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setStickerType('poll')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      stickerType === 'poll' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Vote className="w-3.5 h-3.5 text-[#FF4E27]" />
                    <span>Sondage communautaire</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStickerType('tip')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      stickerType === 'tip' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Conseil de Chef</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStickerType('none')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      stickerType === 'none' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Aucun
                  </button>
                </div>

                {stickerType === 'poll' && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <input
                      type="text"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      placeholder="Question du sondage..."
                      className="w-full text-xs font-bold px-3 py-2 bg-white rounded-lg border border-slate-200"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={pollOption1}
                        onChange={(e) => setPollOption1(e.target.value)}
                        placeholder="Option 1"
                        className="text-xs px-2.5 py-1.5 bg-white rounded-lg border border-slate-200"
                      />
                      <input
                        type="text"
                        value={pollOption2}
                        onChange={(e) => setPollOption2(e.target.value)}
                        placeholder="Option 2"
                        className="text-xs px-2.5 py-1.5 bg-white rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>
                )}

                {stickerType === 'tip' && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <input
                      type="text"
                      value={tipTitle}
                      onChange={(e) => setTipTitle(e.target.value)}
                      placeholder="Titre de l'astuce..."
                      className="w-full text-xs font-bold px-3 py-2 bg-white rounded-lg border border-slate-200"
                    />
                    <textarea
                      value={tipContent}
                      onChange={(e) => setTipContent(e.target.value)}
                      rows={2}
                      placeholder="Détaillez votre secret culinaire..."
                      className="w-full text-xs p-2.5 bg-white rounded-lg border border-slate-200 resize-none"
                    />
                  </div>
                )}
              </div>

            </form>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Visible 24 heures par vos abonnés</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="storyForm"
                className="px-5 py-2.5 bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>Diffuser la Story</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
