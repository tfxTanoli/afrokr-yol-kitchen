import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Wine, 
  Utensils, 
  Compass, 
  Heart,
  ChevronRight,
  DollarSign,
  Globe2,
  Ticket,
  Share2
} from 'lucide-react';
import { CulinaryExperience, ExperienceCategory, ExperienceBooking, User } from '../types';
import { ExperienceDetailModal } from './ExperienceDetailModal';
import { CreateExperienceModal } from './CreateExperienceModal';
import { SupportedLanguage } from '../i18n/translations';
import { FollowButton } from './FollowButton';
import { ShareableItem } from './ShareModal';

interface ExperiencesViewProps {
  experiences: CulinaryExperience[];
  currentUser: User;
  onBookExperience: (booking: ExperienceBooking) => void;
  onCreateExperience: (experience: CulinaryExperience) => void;
  followedUserIds?: string[];
  onToggleFollow?: (userId: string, userName?: string) => void;
  onOpenShare?: (item: ShareableItem) => void;
  language?: SupportedLanguage;
}

export const ExperiencesView: React.FC<ExperiencesViewProps> = ({
  experiences,
  currentUser,
  onBookExperience,
  onCreateExperience,
  followedUserIds = [],
  onToggleFollow,
  onOpenShare,
  language = 'fr'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');
  
  // Modals state
  const [selectedExperience, setSelectedExperience] = useState<CulinaryExperience | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [likedExperiences, setLikedExperiences] = useState<Record<string, boolean>>({});

  const handleShareExperience = (exp: CulinaryExperience) => {
    if (onOpenShare) {
      onOpenShare({
        id: exp.id,
        type: 'experience',
        title: exp.title,
        description: exp.description,
        image: exp.imageUrl,
        authorName: exp.hostName,
        authorHandle: exp.hostRole,
        country: exp.country,
        countryFlag: exp.countryFlag,
        prepTime: exp.durationDisplay,
        price: exp.pricePerPerson,
        location: `${exp.city}, ${exp.country}`,
        date: exp.availableDates[0],
      });
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
    }
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedExperiences(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter logic
  const filteredExperiences = experiences.filter(exp => {
    // Category filter
    if (selectedCategory !== 'all' && exp.category !== selectedCategory) {
      return false;
    }
    // Country filter
    if (selectedCountryFilter !== 'all' && exp.country !== selectedCountryFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = exp.title.toLowerCase().includes(q);
      const matchCity = exp.city.toLowerCase().includes(q);
      const matchCountry = exp.country.toLowerCase().includes(q);
      const matchHost = exp.hostName.toLowerCase().includes(q);
      const matchDesc = exp.description.toLowerCase().includes(q);
      return matchTitle || matchCity || matchCountry || matchHost || matchDesc;
    }
    return true;
  });

  // Unique countries list
  const uniqueCountries = Array.from(new Set(experiences.map(e => e.country)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white border border-slate-800 shadow-2xl p-6 sm:p-10 lg:p-12">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80"
            alt="Culinary background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF4E27]/20 border border-[#FF4E27]/40 text-[#FF7849] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Expériences Afrodelicious dans le monde</span>
          </div>

          <h1 className="font-serif font-black text-2xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Ateliers Culinaires, Dégustations & Balades Gourmandes
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Rencontrez des hôtes et des chefs passionnés, cuisinez des recettes emblématiques, dégustez des cépages et rhums rares ou partez en safari street food à travers les terroirs du monde.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] text-white text-xs font-black shadow-lg shadow-[#FF4E27]/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Devenir Hôte & Proposer un Atelier</span>
            </button>

            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200 font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Commission 30% · Assurance & Paiements Sécurisés</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Platform Value & Commission Transparency Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF4E27] flex items-center justify-center shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 block">{experiences.length} Expériences actives</span>
            <span className="text-[11px] text-slate-500 font-medium">Dans 6 pays du monde</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0F3E2E] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 block">Commission 30% claire</span>
            <span className="text-[11px] text-slate-500 font-medium">Assurance RC & support 24/7</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 block">4.94 / 5 Note moyenne</span>
            <span className="text-[11px] text-slate-500 font-medium">Hôtes certifiés & vérifiés</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 block">Petits groupes intimes</span>
            <span className="text-[11px] text-slate-500 font-medium">6 à 12 personnes max</span>
          </div>
        </div>
      </div>

      {/* 3. Search and Category Filter Bar */}
      <div className="space-y-4">
        
        {/* Search bar & Country dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          
          <div className="flex items-center flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher ville, pays, plat ou hôte (Dakar, Rhum, Jerk, Paris...)"
              className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-[#FF4E27] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCountryFilter}
              onChange={(e) => setSelectedCountryFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 font-bold focus:border-[#FF4E27] focus:outline-none shrink-0"
            >
              <option value="all">🌍 Tous les pays</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF4E27]" />
              <span>Proposer</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Toutes les expériences</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px] font-mono">
              {experiences.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('cooking_workshop')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'cooking_workshop'
                ? 'bg-[#FF4E27] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>🍳 Ateliers Culinaires & Cours</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
              {experiences.filter(e => e.category === 'cooking_workshop').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('wine_tasting')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'wine_tasting'
                ? 'bg-[#FF4E27] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>🍷 Dégustations de Vins & Rhums</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
              {experiences.filter(e => e.category === 'wine_tasting').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('market_tour')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'market_tour'
                ? 'bg-[#FF4E27] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>🎒 Marchés Gourmands & Food Tours</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
              {experiences.filter(e => e.category === 'market_tour').length}
            </span>
          </button>
        </div>

      </div>

      {/* 4. Experience Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {filteredExperiences.length} expérience(s) disponible(s)
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Tarifs fixés par les hôtes · Commission Afrodelicious 30% incluse
          </span>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Utensils className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-serif font-black text-lg text-slate-900">
              Aucune expérience ne correspond à votre recherche
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Essayez de modifier vos filtres ou soyez le premier à proposer un atelier culinaire dans cette ville !
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCountryFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((exp) => {
              const isLiked = likedExperiences[exp.id];

              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExperience(exp)}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-[#FF4E27]/40 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  {/* Card Cover with Badges */}
                  <div className="relative h-52 sm:h-56 overflow-hidden">
                    <img
                      src={exp.imageUrl}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-xl bg-[#FF4E27] text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <span>{exp.categoryEmoji}</span>
                        <span>{exp.categoryLabel}</span>
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareExperience(exp);
                        }}
                        className="p-2 rounded-xl backdrop-blur-md bg-black/50 text-white hover:bg-black/75 transition-colors shadow-2xs"
                        title="Partager cet atelier / cours de cuisine"
                      >
                        <Share2 className="w-3.5 h-3.5 text-white" />
                      </button>
                      <button
                        onClick={(e) => toggleLike(e, exp.id)}
                        className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                          isLiked ? 'bg-[#FF4E27] text-white' : 'bg-black/50 text-white hover:bg-black/70'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Location & Duration pill on image bottom */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                      <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1">
                        <span>{exp.countryFlag}</span>
                        <span>{exp.city}, {exp.country}</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#F59E0B]" />
                        <span>{exp.durationDisplay}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                          <Users className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Max {exp.maxGuests} pers.</span>
                        </div>

                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{exp.hostRating} ({exp.reviewsCount})</span>
                        </div>
                      </div>

                      <h3 className="font-serif font-black text-base text-slate-900 group-hover:text-[#FF4E27] transition-colors line-clamp-2">
                        {exp.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>

                    {/* Host & Price Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={exp.hostAvatar}
                          alt={exp.hostName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-slate-800 block truncate max-w-[95px]">
                              {exp.hostName}
                            </span>
                            {onToggleFollow && exp.hostId !== currentUser.id && (
                              <FollowButton
                                targetUserId={exp.hostId}
                                targetUserName={exp.hostName}
                                isFollowing={followedUserIds.includes(exp.hostId)}
                                onToggleFollow={onToggleFollow}
                                size="xs"
                                variant="subtle"
                              />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                            Hôte vérifié
                          </span>
                        </div>
                      </div>

                      {/* Pricing Tag */}
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="font-serif font-black text-lg text-slate-900">
                            {exp.pricePerPerson} €
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">/ pers.</span>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Comm. 30% incluse
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Bottom Host Callout Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-50 via-amber-50/70 to-emerald-50/50 border-2 border-orange-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#0F3E2E] text-[10px] font-black uppercase tracking-wider">
              Programme Hôte Afrodelicious
            </span>
            <span className="text-xs text-slate-500 font-mono">Commission 30%</span>
          </div>

          <h3 className="font-serif font-black text-xl text-slate-900">
            Vous avez une passion culinaire, une cave de rhums ou un marché fétiche ?
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Ouvrez votre cuisine, fixez votre prix, la durée et votre nombre de convives. Afrodelicious gère le calendrier, les réservations internationales et l'assurance avec une commission fixe de 30%.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] text-white text-xs font-black shadow-lg shadow-[#FF4E27]/30 transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Créer mon Expérience d'Hôte</span>
        </button>
      </div>

      {/* Detail & Booking Modal */}
      <ExperienceDetailModal
        experience={selectedExperience}
        onClose={() => setSelectedExperience(null)}
        currentUser={currentUser}
        onBookExperience={onBookExperience}
        followedUserIds={followedUserIds}
        onToggleFollow={onToggleFollow}
        onOpenShare={onOpenShare}
      />

      {/* Host Creation Modal */}
      <CreateExperienceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        onCreateExperience={onCreateExperience}
      />

    </div>
  );
};
