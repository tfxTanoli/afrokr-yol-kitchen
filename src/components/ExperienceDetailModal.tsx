import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Check, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Share2, 
  Heart, 
  Sparkles,
  Ticket,
  ChevronRight,
  Phone,
  Mail,
  User as UserIcon,
  Wine,
  Utensils,
  Compass
} from 'lucide-react';
import { CulinaryExperience, ExperienceBooking, User } from '../types';
import { FollowButton } from './FollowButton';
import { ShareableItem } from './ShareModal';

interface ExperienceDetailModalProps {
  experience: CulinaryExperience | null;
  onClose: () => void;
  currentUser: User;
  onBookExperience: (booking: ExperienceBooking) => void;
  followedUserIds?: string[];
  onToggleFollow?: (userId: string, userName?: string) => void;
  onOpenShare?: (item: ShareableItem) => void;
}

export const ExperienceDetailModal: React.FC<ExperienceDetailModalProps> = ({
  experience,
  onClose,
  currentUser,
  onBookExperience,
  followedUserIds = [],
  onToggleFollow,
  onOpenShare
}) => {
  if (!experience) return null;

  const [selectedDate, setSelectedDate] = useState<string>(experience.availableDates[0] || '');
  const [ticketsCount, setTicketsCount] = useState<number>(1);
  const [guestName, setGuestName] = useState<string>(currentUser.name || '');
  const [guestEmail, setGuestEmail] = useState<string>(currentUser.email || '');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string>(experience.imageUrl);

  const handleShareClick = () => {
    if (onOpenShare) {
      onOpenShare({
        id: experience.id,
        type: 'experience',
        title: experience.title,
        description: experience.description,
        image: experience.imageUrl,
        authorName: experience.hostName,
        authorHandle: experience.hostRole,
        country: experience.country,
        countryFlag: experience.countryFlag,
        prepTime: experience.durationDisplay,
        price: experience.pricePerPerson,
        location: `${experience.city}, ${experience.country}`,
        date: experience.availableDates[0]
      });
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
    }
  };

  // Financial calculations with 30% platform commission
  const pricePerPerson = experience.pricePerPerson;
  const totalPrice = pricePerPerson * ticketsCount;
  const platformFee = Math.round(totalPrice * 0.30 * 100) / 100;
  const hostNetEarnings = Math.round(totalPrice * 0.70 * 100) / 100;

  const remainingSpots = Math.max(1, experience.maxGuests - experience.bookedGuestsCount);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) return;

    const newBooking: ExperienceBooking = {
      id: `booking-${Date.now()}`,
      experienceId: experience.id,
      experienceTitle: experience.title,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim() || undefined,
      ticketsCount,
      pricePerPerson,
      totalPricePaid: totalPrice,
      platformCommission: platformFee,
      hostNetEarnings,
      date: selectedDate,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    onBookExperience(newBooking);
    setBookingSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Top Floating Header */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShareClick}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#FF4E27] shadow-md backdrop-blur-sm transition-all"
            title="Partager cet atelier sur WhatsApp, Signal & réseaux"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md backdrop-blur-sm transition-all"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-0">
          
          {/* Hero Gallery */}
          <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-slate-900 overflow-hidden">
            <img
              src={activeImage}
              alt={experience.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

            {/* Badges on Hero */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-[#FF4E27] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <span>{experience.categoryEmoji}</span>
                <span>{experience.categoryLabel}</span>
              </span>

              <span className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5">
                <span className="text-base">{experience.countryFlag}</span>
                <span>{experience.city}, {experience.country}</span>
              </span>
            </div>

            {/* Gallery Mini Previews */}
            {experience.galleryImages && experience.galleryImages.length > 1 && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                {experience.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === img ? 'border-[#FF4E27] scale-105 shadow-md' : 'border-white/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Quick Stats on bottom of Hero */}
            <div className="absolute bottom-4 left-4 right-20 text-white space-y-1">
              <h1 className="font-serif font-black text-xl sm:text-2xl lg:text-3xl text-white leading-tight drop-shadow-md">
                {experience.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Durée : {experience.durationDisplay}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Groupe intime de {experience.maxGuests} pers. max</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{experience.hostRating} ({experience.reviewsCount} avis)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Layout: Details (Left) + Booking Sticky Card (Right) */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Description, Host, Inclusions, Location */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Host presentation */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={experience.hostAvatar}
                    alt={experience.hostName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-orange-200 shadow-xs"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27] block">
                      Expérience organisée par
                    </span>
                    <h3 className="font-serif font-black text-base text-slate-900">
                      {experience.hostName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {experience.hostRole} · {experience.countryFlag} {experience.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {onToggleFollow && experience.hostId !== currentUser.id && (
                    <FollowButton
                      targetUserId={experience.hostId}
                      targetUserName={experience.hostName}
                      isFollowing={followedUserIds.includes(experience.hostId)}
                      onToggleFollow={onToggleFollow}
                      size="sm"
                      variant="solid"
                    />
                  )}
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-[#0F3E2E] text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F3E2E]" />
                    <span>Hôte Vérifié</span>
                  </span>
                </div>
              </div>

              {/* Host Bio */}
              <div className="space-y-2">
                <h3 className="font-serif font-black text-lg text-slate-900">
                  À propos de votre hôte
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {experience.hostBio}
                </p>
              </div>

              {/* Experience Description */}
              <div className="space-y-3">
                <h3 className="font-serif font-black text-lg text-slate-900">
                  Ce que vous allez vivre
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {experience.description}
                </p>
              </div>

              {/* What's Included */}
              <div className="space-y-3">
                <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF4E27]" />
                  <span>Ce qui est inclus dans l'atelier</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {experience.includedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-orange-50/50 border border-orange-200/60 flex items-start gap-2.5"
                    >
                      <Check className="w-4 h-4 text-[#FF4E27] shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-800 leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location & Meeting Point */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF4E27]" />
                  <span>Lieu & Point de rendez-vous</span>
                </h3>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <p>
                    <strong className="text-slate-900">Adresse de l'expérience :</strong> {experience.locationAddress}
                  </p>
                  <p>
                    <strong className="text-slate-900">Point de rencontre exact :</strong> {experience.meetingPoint}
                  </p>
                  <p>
                    <strong className="text-slate-900">Langues parlées :</strong> {experience.language}
                  </p>
                </div>
              </div>

              {/* Transparent Commission Disclosure */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#0F3E2E]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Garantie Afrodelicious & Commission Plateforme (30%)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Afrodelicious prélève une commission de <strong>30%</strong> sur chaque réservation. Celle-ci couvre l'assurance responsabilité civile des ateliers, la vérification des hôtes, la gestion du calendrier et la sécurisation bancaire internationale.
                </p>
              </div>

            </div>

            {/* Right Column: Booking Box */}
            <div className="lg:col-span-1">
              <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-orange-200/80 shadow-xl space-y-5 sticky top-6">
                
                {/* Price Tag */}
                <div className="pb-4 border-b border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Tarif par personne
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-serif font-black text-3xl text-slate-900">
                      {experience.pricePerPerson} €
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ invité</span>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-[#0F3E2E] text-[10px] font-bold">
                    {remainingSpots} places disponibles
                  </span>
                </div>

                {bookingSuccess ? (
                  /* Success View */
                  <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#0F3E2E] flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-lg text-slate-900">
                        Réservation confirmée !
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Un pass d'accès avec le point de rencontre a été envoyé à <strong>{guestEmail}</strong>.
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1 font-mono">
                      <div>Date : {selectedDate}</div>
                      <div>Invités : {ticketsCount} pers.</div>
                      <div className="font-bold text-slate-900">Montant réglé : {totalPrice} €</div>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                    >
                      Terminer & Fermer
                    </button>
                  </div>
                ) : (
                  /* Booking Form */
                  <form onSubmit={handleConfirmBooking} className="space-y-4">
                    
                    {/* Date select */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                        Créneau & Date
                      </label>
                      <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-semibold focus:border-[#FF4E27] focus:outline-none"
                      >
                        {experience.availableDates.map((d, i) => (
                          <option key={i} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Guests count */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                        Nombre d'invités
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setTicketsCount(Math.max(1, ticketsCount - 1))}
                          className="w-9 h-9 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="flex-1 py-2 text-center font-serif font-black text-base text-slate-900 border border-slate-200 rounded-xl bg-slate-50">
                          {ticketsCount} {ticketsCount > 1 ? 'personnes' : 'personne'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setTicketsCount(Math.min(remainingSpots, ticketsCount + 1))}
                          className="w-9 h-9 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Guest Contact info */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Votre nom"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">
                          Email de confirmation
                        </label>
                        <input
                          type="email"
                          required
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="votre@email.com"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">
                          Téléphone pour SMS de rappel
                        </label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+33 6 12 34 56 78"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Price Breakdown Calculation */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>{experience.pricePerPerson} € × {ticketsCount} invité(s)</span>
                        <span className="font-semibold">{totalPrice} €</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Revenu reversé à l'hôte (70%)</span>
                        <span>{hostNetEarnings} €</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Commission Afrodelicious (30%)</span>
                        <span>{platformFee} €</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900 text-sm">
                        <span>Total à régler</span>
                        <span className="text-[#FF4E27]">{totalPrice} €</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] text-white text-xs font-black shadow-md shadow-[#FF4E27]/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Réserver ma place ({totalPrice} €)</span>
                    </button>

                    <p className="text-[10px] text-center text-slate-400">
                      Paiement sécurisé · Annulation gratuite jusqu'à 48h avant l'atelier
                    </p>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
