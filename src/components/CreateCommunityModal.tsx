import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Sparkles, 
  Check, 
  Plus, 
  Image as ImageIcon, 
  Globe, 
  Lock, 
  Compass, 
  Flame, 
  UtensilsCrossed, 
  Leaf, 
  Cake, 
  Coffee, 
  Tag
} from 'lucide-react';
import { Community, CommunityInterestCategory, User } from '../types';
import { sanitizeText } from '../utils/securitySanitizer';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onCreateCommunity: (newCommunity: Community) => void;
}

export const COMMUNITY_INTEREST_OPTIONS: {
  id: CommunityInterestCategory;
  label: string;
  emoji: string;
  desc: string;
  defaultCover: string;
}[] = [
  {
    id: 'street_food',
    label: 'Street Food & Bouchées',
    emoji: '🍢',
    desc: 'Garba, Alloco, Bokit, Pastel, Suya, Beignets salés et snacks de rue.',
    defaultCover: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'traditional',
    label: 'Plats Traditionnels & Mijotés',
    emoji: '🍲',
    desc: 'Mafé, Yassa, Ndolé, Sauce Graine, Calalou, Colombo et sauces longues.',
    defaultCover: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'healthy_vegan',
    label: 'Afro-Vegan & Cuisine Saine',
    emoji: '🌿',
    desc: 'Cuisine Ital rastafari, légumineuses, gombo, manioc et super-aliments.',
    defaultCover: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'grills_bbq',
    label: 'Barbecue, Braisés & Jerk',
    emoji: '🥩',
    desc: 'Choukouya, Jerk chicken, poissons entiers braisés aux braises de bois.',
    defaultCover: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'pastry_sweets',
    label: 'Pâtisserie & Douceurs Tropicales',
    emoji: '🎂',
    desc: 'Tourments d\'amour, Thiacry, gâteaux coco, beignets et confitures exotiques.',
    defaultCover: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'spices_sauces',
    label: 'Piments, Épices & Condiments',
    emoji: '🌶️',
    desc: 'Piment végétarien, Shito, marinades créoles, bois d\'Inde et secrets de feu.',
    defaultCover: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'drinks_cocktails',
    label: 'Jus Naturels & Rhums Arrangés',
    emoji: '🍹',
    desc: 'Bissap, Gnamakoudji (gingembre), Ti-Punch, infusions et liqueurs des îles.',
    defaultCover: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'regional_terroirs',
    label: 'Terroirs & Régions Ciblées',
    emoji: '🌍',
    desc: 'Focalisé sur une région (Dakar, Abidjan, Douala, Fort-de-France, Haïti, Kingston...).',
    defaultCover: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80'
  }
];

const SUGGESTED_TAGS = [
  'Garba', 'Mafé', 'Alloco', 'Bokit', 'Colombo', 'Vegan', 'Suya', 'Pastel', 
  'Jerk', 'Piment', 'Attiéké', 'Manioc', 'Plantain', 'Accras', 'Ndolé'
];

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreateCommunity
}) => {
  const [name, setName] = useState('');
  const [selectedInterest, setSelectedInterest] = useState<CommunityInterestCategory>('street_food');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('Panafricain & Diaspora');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [coverImage, setCoverImage] = useState(COMMUNITY_INTEREST_OPTIONS[0].defaultCover);
  const [customImageMode, setCustomImageMode] = useState(false);
  const [tags, setTags] = useState<string[]>(['StreetFood', 'Garba', 'Partage']);
  const [newTagInput, setNewTagInput] = useState('');
  const [initialPostText, setInitialPostText] = useState('');

  if (!isOpen) return null;

  const currentInterestObj = COMMUNITY_INTEREST_OPTIONS.find(o => o.id === selectedInterest) || COMMUNITY_INTEREST_OPTIONS[0];

  const handleSelectInterest = (cat: CommunityInterestCategory) => {
    setSelectedInterest(cat);
    const found = COMMUNITY_INTEREST_OPTIONS.find(o => o.id === cat);
    if (found && !customImageMode) {
      setCoverImage(found.defaultCover);
    }
  };

  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const interestLabel = currentInterestObj.label;

    const newCommunity: Community = {
      id: `comm-custom-${Date.now()}`,
      name: sanitizeText(name.trim(), 80),
      tagline: sanitizeText(tagline.trim() || `Le cercle des passionnés de ${interestLabel}`, 120),
      description: sanitizeText(description.trim() || `Bienvenue dans la communauté ${name.trim()} ! Ici, nous partageons nos secrets de cuisine, astuces de cuisson et variantes familiales.`, 500),
      coverImage: coverImage.trim() || currentInterestObj.defaultCover,
      membersCount: 1, // The creator is the first member
      region: sanitizeText(region, 50),
      interestCategory: selectedInterest,
      interestLabel,
      tags: tags.length > 0 ? tags : [selectedInterest],
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      createdAt: 'À l\'instant',
      privacy,
      isJoined: true, // Creator is joined by default
      posts: [
        {
          id: `cp-init-${Date.now()}`,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          authorCountry: `${currentUser.country} ${currentUser.countryFlag || '🌍'}`,
          content: sanitizeText(
            initialPostText.trim() || 
            `🎉 Bienvenue à tous dans le cercle "${name.trim()}" ! N'hésitez pas à poser vos questions, partager vos photos de plats et vos meilleures astuces de ${interestLabel}. À vos fourneaux !`,
            400
          ),
          timestamp: 'À l\'instant',
          likes: 1,
          repliesCount: 0
        }
      ]
    };

    onCreateCommunity(newCommunity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 bg-gradient-to-r from-orange-50/70 via-white to-amber-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF4E27] to-[#FF7849] text-white flex items-center justify-center shadow-md shadow-[#FF4E27]/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-black text-lg sm:text-xl text-slate-900">
                  Créer un Cercle Culinaire
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#FF4E27]/10 text-[#FF4E27] text-[10px] font-bold">
                  Par centres d'intérêt
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Fédérez des passionnés autour de vos spécialités afro-caribéennes favorites
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Step 1: Select Interest Category */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4E27]" />
                <span>1. Centre d'intérêt principal</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {currentInterestObj.label} {currentInterestObj.emoji}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {COMMUNITY_INTEREST_OPTIONS.map((item) => {
                const isSelected = selectedInterest === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectInterest(item.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[90px] relative ${
                      isSelected
                        ? 'border-[#FF4E27] bg-orange-50/60 ring-2 ring-[#FF4E27]/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{item.emoji}</span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#FF4E27] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block leading-tight mt-1">
                        {item.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 italic">
              {currentInterestObj.desc}
            </p>
          </div>

          {/* Step 2: Name & Tagline */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Nom du Cercle / Communauté <span className="text-[#FF4E27]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Les Mordus de Garba au Thon, Accras & Sauces Créoles..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#FF4E27] focus:outline-none transition-colors"
                maxLength={80}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Accroche courte (Punchline)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ex : Pour l'amour des marinades bien relevées et du plantain caramélisé."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#FF4E27] focus:outline-none transition-colors"
                maxLength={120}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Description & Charte du groupe
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez les sujets abordés, l'état d'esprit du cercle et ce que les membres vont y découvrir..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#FF4E27] focus:outline-none transition-colors resize-none"
                maxLength={500}
              />
            </div>
          </div>

          {/* Step 3: Region & Privacy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Région / Territoire culturel
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#FF4E27] focus:outline-none bg-white font-medium"
              >
                <option value="Panafricain & Diaspora">🌍 Panafricain & Diaspora</option>
                <option value="Afrique de l'Ouest">🇸🇳 🇨🇮 Afrique de l'Ouest</option>
                <option value="Afrique Centrale">🇨🇲 🇨🇬 Afrique Centrale</option>
                <option value="Caraïbes & Antilles">🇲🇶 🇬🇵 🇭🇹 Caraïbes & Antilles</option>
                <option value="Océan Indien & Réunion">🇷🇪 🇲🇬 Océan Indien</option>
                <option value="International">🌐 International</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Visibilité
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPrivacy('public')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    privacy === 'public'
                      ? 'border-[#0F3E2E] bg-emerald-50 text-[#0F3E2E]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrivacy('private')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    privacy === 'private'
                      ? 'border-amber-600 bg-amber-50 text-amber-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sur invitation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 4: Tags of interest */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-900">
              Tags & Mots-clés ({tags.length})
            </label>
            
            {/* Active Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium flex items-center gap-1.5 group"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-[#FF4E27]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Input tag */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTagInput);
                  }
                }}
                placeholder="Ajouter un tag (ex: Plantain, Alloco, Ital...)"
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-[#FF4E27] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddTag(newTagInput)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors"
              >
                Ajouter
              </button>
            </div>

            {/* Suggested Tags chips */}
            <div className="flex flex-wrap items-center gap-1 pt-1">
              <span className="text-[10px] text-slate-400 mr-1">Suggestions :</span>
              {SUGGESTED_TAGS.filter(st => !tags.includes(st)).slice(0, 6).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleAddTag(st)}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-orange-50 text-[#FF4E27] font-semibold hover:bg-orange-100 transition-colors"
                >
                  +{st}
                </button>
              ))}
            </div>
          </div>

          {/* Step 5: Visual Cover Banner */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">
                Bannière de couverture
              </label>
              <button
                type="button"
                onClick={() => setCustomImageMode(!customImageMode)}
                className="text-xs font-bold text-[#FF4E27] hover:underline"
              >
                {customImageMode ? 'Choisir une photo thématique' : 'Entrer une URL personnalisée'}
              </button>
            </div>

            {/* Live Preview */}
            <div className="relative h-28 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <img
                src={coverImage}
                alt="Aperçu"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
                  {currentInterestObj.emoji} {currentInterestObj.label} · {region}
                </span>
                <span className="font-serif font-bold text-sm text-white truncate">
                  {name || 'Nom de votre communauté'}
                </span>
              </div>
            </div>

            {customImageMode ? (
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#FF4E27] focus:outline-none"
              />
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {COMMUNITY_INTEREST_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCoverImage(item.defaultCover);
                      setSelectedInterest(item.id);
                    }}
                    className={`relative h-12 rounded-xl overflow-hidden border-2 transition-all ${
                      coverImage === item.defaultCover ? 'border-[#FF4E27] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={item.defaultCover} alt={item.label} className="w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs">
                      {item.emoji}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 6: Initial Welcome Post */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-900">
              Premier mot de bienvenue (publié par {currentUser.name})
            </label>
            <textarea
              rows={2}
              value={initialPostText}
              onChange={(e) => setInitialPostText(e.target.value)}
              placeholder="Ex : Bienvenue à tous les mordus de bonne cuisine ! Hâte de voir vos recettes préférées..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#FF4E27] focus:outline-none resize-none"
              maxLength={400}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] text-white text-xs font-black shadow-md shadow-[#FF4E27]/25 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Users className="w-4 h-4" />
              <span>Créer et lancer le cercle</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
