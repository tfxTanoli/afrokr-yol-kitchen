import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  Plus, 
  Trash2, 
  Check, 
  Info, 
  Camera, 
  HelpCircle,
  Wine,
  Utensils,
  Compass,
  Percent
} from 'lucide-react';
import { CulinaryExperience, ExperienceCategory, User } from '../types';

interface CreateExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onCreateExperience: (experience: CulinaryExperience) => void;
}

const PRESET_PHOTOS = [
  { label: 'Atelier cuisine & mijoté', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80' },
  { label: 'Dégustation vin & verres', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&auto=format&fit=crop&q=80' },
  { label: 'Marché aux épices & herbes', url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=900&auto=format&fit=crop&q=80' },
  { label: 'Barbecue braai & grillades', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80' },
  { label: 'Pâtisserie & douceurs', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80' },
];

const POPULAR_COUNTRIES = [
  { name: 'Sénégal', flag: '🇸🇳' },
  { name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { name: 'Martinique', flag: '🇲🇶' },
  { name: 'Guadeloupe', flag: '🇬🇵' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Haïti', flag: '🇭🇹' },
  { name: 'Jamaïque', flag: '🇯🇲' },
  { name: 'Cameroun', flag: '🇨🇲' },
  { name: 'Afrique du Sud', flag: '🇿🇦' },
  { name: 'Bénin', flag: '🇧🇯' },
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'Kenya', flag: '🇰🇪' },
  { name: 'Royaume-Uni', flag: '🇬🇧' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'États-Unis', flag: '🇺🇸' }
];

export const CreateExperienceModal: React.FC<CreateExperienceModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreateExperience
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<ExperienceCategory>('cooking_workshop');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState(currentUser.country || 'Sénégal');
  const [city, setCity] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('');
  
  // Logistics
  const [durationHours, setDurationHours] = useState<number>(3);
  const [maxGuests, setMaxGuests] = useState<number>(8);
  const [pricePerPerson, setPricePerPerson] = useState<number>(60);
  const [initialDate, setInitialDate] = useState('Samedi 10 Octobre - 10h00');
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTOS[0].url);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  // Included items
  const [includedList, setIncludedList] = useState<string[]>([
    'Ingrédients frais et bio fournis',
    'Dégustation complète du plat préparé',
    'Boissons traditionnelles & rafraîchissements',
    'Fiche recette souvenir'
  ]);
  const [newInclusion, setNewInclusion] = useState('');

  // 30% commission calculation
  const currentPrice = Number(pricePerPerson) || 0;
  const platformFee = Math.round(currentPrice * 0.30 * 100) / 100;
  const hostNet = Math.round(currentPrice * 0.70 * 100) / 100;
  const potentialTotalNet = Math.round(hostNet * maxGuests * 100) / 100;

  const handleAddInclusion = () => {
    if (!newInclusion.trim()) return;
    setIncludedList([...includedList, newInclusion.trim()]);
    setNewInclusion('');
  };

  const handleRemoveInclusion = (idx: number) => {
    setIncludedList(includedList.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !city.trim() || currentPrice <= 0) return;

    const countryObj = POPULAR_COUNTRIES.find(c => c.name === country) || { name: country, flag: '🌍' };
    const finalImageUrl = customPhotoUrl.trim() || selectedPhoto;

    let categoryLabel = 'Atelier Culinaire';
    let categoryEmoji = '🍳';
    if (category === 'wine_tasting') {
      categoryLabel = 'Dégustation de Vins & Rhums';
      categoryEmoji = '🍷';
    } else if (category === 'market_tour') {
      categoryLabel = 'Marché Gourmand & Food Tour';
      categoryEmoji = '🎒';
    }

    const newExperience: CulinaryExperience = {
      id: `exp-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      categoryLabel,
      categoryEmoji,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
      hostRole: currentUser.role === 'chef' ? 'Chef(fe) Hôte Certifié(e)' : 'Hôte Passionné(e)',
      hostBio: currentUser.bio || 'Hôte gourmet sur la plateforme Afrodelicious.',
      hostRating: 5.0,
      reviewsCount: 1,
      pricePerPerson: currentPrice,
      commissionRate: 0.30,
      hostNetPerPerson: hostNet,
      platformFeePerPerson: platformFee,
      country: countryObj.name,
      countryFlag: countryObj.flag,
      city: city.trim(),
      locationAddress: locationAddress.trim() || `${city.trim()}, ${countryObj.name}`,
      meetingPoint: meetingPoint.trim() || 'Précisé après réservation par l\'hôte',
      durationMinutes: durationHours * 60,
      durationDisplay: `${durationHours}h`,
      maxGuests: Number(maxGuests) || 8,
      bookedGuestsCount: 0,
      availableDates: [initialDate, 'Samedi suivant - 14h00'],
      imageUrl: finalImageUrl,
      galleryImages: [finalImageUrl],
      includedItems: includedList,
      language: 'Français & Langues locales',
      isFeatured: true
    };

    onCreateExperience(newExperience);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF4E27] to-[#FF7849] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-black text-lg text-slate-900">
                Proposer une Expérience Gourmande
              </h2>
              <p className="text-xs text-slate-500">
                Devenez hôte : accueillez des voyageurs et animez votre atelier culinaire
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          
          {/* Step 1: Category Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Type d'expérience proposée *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setCategory('cooking_workshop')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  category === 'cooking_workshop'
                    ? 'border-[#FF4E27] bg-orange-50/70 ring-1 ring-[#FF4E27]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="text-2xl mb-1">🍳</div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Atelier Culinaire</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Cours de cuisine & préparation pas-à-pas</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCategory('wine_tasting')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  category === 'wine_tasting'
                    ? 'border-[#FF4E27] bg-orange-50/70 ring-1 ring-[#FF4E27]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="text-2xl mb-1">🍷</div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Dégustation de Vin & Rhum</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Accords mets & vins, spiritueux du terroir</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCategory('market_tour')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  category === 'market_tour'
                    ? 'border-[#FF4E27] bg-orange-50/70 ring-1 ring-[#FF4E27]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="text-2xl mb-1">🎒</div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Marché Gourmand</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Visite de marchés locaux & street food safari</p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                2. Titre de votre expérience *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Atelier Pastels Croustillants & Dégustation de Vin de Palme"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none bg-slate-50/50 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Description immersive & déroulé de l'atelier *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez ce que vos invités vont apprendre, sentir, goûter, et l'ambiance chaleureuse de votre atelier..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none bg-slate-50/50 leading-relaxed"
              />
            </div>
          </div>

          {/* Step 3: Location (Country, City, Exact Place) */}
          <div className="space-y-3 p-4 rounded-3xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF4E27]" />
              <span>3. Localisation de l'expérience dans le monde *</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Pays
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none"
                >
                  {POPULAR_COUNTRIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Dakar, Fort-de-France, Paris, Kingston..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Lieu de l'expérience (Cuisine / Domaine / Marché)
                </label>
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="Ex: Villa des Almadies / Marché Kermel"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Point de rendez-vous exact
                </label>
                <input
                  type="text"
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  placeholder="Ex: Entrée principale face à la fontaine"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Duration, Max Guests & Pricing with 30% Commission Breakdown */}
          <div className="space-y-4 p-5 rounded-3xl bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-white border-2 border-orange-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#FF4E27]" />
              <span>4. Tarification & Commission Afrodelicious (30%)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Duration */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Durée</span>
                </label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none font-bold"
                >
                  <option value={1.5}>1 heure 30</option>
                  <option value={2}>2 heures</option>
                  <option value={2.5}>2 heures 30</option>
                  <option value={3}>3 heures</option>
                  <option value={3.5}>3 heures 30</option>
                  <option value={4}>4 heures</option>
                  <option value={5}>5 heures (Journée complète)</option>
                </select>
              </div>

              {/* Max Guests */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Capacité max</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  required
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none font-bold"
                />
              </div>

              {/* Price per person */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#FF4E27]" />
                  <span>Prix par invité (€) *</span>
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  required
                  value={pricePerPerson}
                  onChange={(e) => setPricePerPerson(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none font-bold font-mono text-[#FF4E27]"
                />
              </div>
            </div>

            {/* Dynamic 30% Commission Breakdown Calculator */}
            <div className="p-4 rounded-2xl bg-white border border-orange-200 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-700">Prix public facturé aux invités :</span>
                <span className="font-mono font-black text-sm text-slate-900">{currentPrice} € / pers.</span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1">
                  <span>Commission Afrodelicious (30%) :</span>
                  <span className="text-[10px] text-slate-400 font-mono">(Assurance & mise en relation)</span>
                </span>
                <span className="font-mono text-red-500 font-semibold">- {platformFee} €</span>
              </div>

              <div className="flex items-center justify-between text-[#0F3E2E] font-bold pt-1">
                <span>Votre gain net reversé par invité (70%) :</span>
                <span className="font-mono text-sm bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  + {hostNet} € / pers.
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/80 text-[11px] text-slate-700 flex items-center justify-between">
                <span>✨ Pour un atelier complet de <strong>{maxGuests} invités</strong> :</span>
                <span className="font-black text-xs text-[#FF4E27] font-mono">
                  {potentialTotalNet} € nets dans votre poche
                </span>
              </div>
            </div>

          </div>

          {/* Step 5: What's Included & First Available Date */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              5. Éléments inclus & créneau de lancement
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                placeholder="Ex: Tablier brodé offert, Dégustation de vin..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddInclusion}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Ajouter
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {includedList.map((inc, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-xs text-slate-800 font-medium flex items-center gap-1.5"
                >
                  <Check className="w-3 h-3 text-[#FF4E27]" />
                  <span>{inc}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInclusion(i)}
                    className="ml-1 text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Premier créneau disponible
              </label>
              <input
                type="text"
                value={initialDate}
                onChange={(e) => setInitialDate(e.target.value)}
                placeholder="Ex: Samedi 10 Octobre - 10h00"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
              />
            </div>
          </div>

          {/* Step 6: Cover Photo Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              6. Photo de couverture
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRESET_PHOTOS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPhoto(p.url);
                    setCustomPhotoUrl('');
                  }}
                  className={`relative rounded-2xl overflow-hidden aspect-video sm:aspect-square border-2 transition-all ${
                    selectedPhoto === p.url && !customPhotoUrl
                      ? 'border-[#FF4E27] scale-102 shadow-md'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 p-1 bg-black/60 text-white text-[9px] truncate text-center font-bold">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Ou lien URL de votre propre photo :
              </label>
              <input
                type="url"
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] text-white text-xs font-black shadow-lg shadow-[#FF4E27]/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publier mon Expérience ({currentPrice} € / invité · 30% comm. incluse)</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Votre expérience sera instantanément réservable par les membres de la communauté Afrodelicious
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
