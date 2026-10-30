import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Sparkles, 
  ThumbsUp, 
  Star, 
  Heart, 
  Store, 
  Truck, 
  Clock, 
  MapPin, 
  Compass, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight, 
  X,
  Plus,
  Flame,
  Gift,
  Building,
  Zap
} from 'lucide-react';
import { RestaurantStore, MenuItem } from '../data/deliveryData';
import { User } from '../types';

interface RecommendedRestaurantsViewProps {
  restaurants: RestaurantStore[];
  currentUser: User;
  onSelectRestaurantForOrder: (restaurant: RestaurantStore) => void;
  onOpenMapForRestaurant: (restaurant: RestaurantStore) => void;
  onUpdateRestaurantSponsorship: (restaurantId: string, plan: 'starter' | 'pro' | 'prestige') => void;
  onIncrementRecommendation: (restaurantId: string) => void;
}

export const RecommendedRestaurantsView: React.FC<RecommendedRestaurantsViewProps> = ({
  restaurants,
  currentUser,
  onSelectRestaurantForOrder,
  onOpenMapForRestaurant,
  onUpdateRestaurantSponsorship,
  onIncrementRecommendation
}) => {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [votedRestaurantIds, setVotedRestaurantIds] = useState<string[]>([]);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [selectedRestToSponsor, setSelectedRestToSponsor] = useState<string>(restaurants[0]?.id || 'rest-1');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'prestige'>('pro');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccessRest, setPaymentSuccessRest] = useState<string | null>(null);

  // Filter only sponsored recommended restaurants for the main public showcase
  const sponsoredRecommendedList = useMemo(() => {
    return restaurants.filter(r => {
      // Must have paid sponsorship to appear publicly in this featured menu section
      if (!r.hasPaidSponsorship) return false;
      if (selectedCuisine !== 'all' && !r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase())) return false;
      if (selectedCity !== 'all' && !r.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
      return true;
    }).sort((a, b) => (b.recommendationCount || 0) - (a.recommendationCount || 0));
  }, [restaurants, selectedCuisine, selectedCity]);

  // Restaurants waiting for paid sponsorship
  const pendingSponsorshipList = useMemo(() => {
    return restaurants.filter(r => !r.hasPaidSponsorship);
  }, [restaurants]);

  const handleVoteRecommendation = (restaurantId: string) => {
    if (votedRestaurantIds.includes(restaurantId)) return;
    setVotedRestaurantIds(prev => [...prev, restaurantId]);
    onIncrementRecommendation(restaurantId);
  };

  const handleConfirmSponsorshipPayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      onUpdateRestaurantSponsorship(selectedRestToSponsor, selectedPlan);
      const rest = restaurants.find(r => r.id === selectedRestToSponsor);
      setPaymentProcessing(false);
      setPaymentSuccessRest(rest?.name || 'Votre restaurant');
      setTimeout(() => {
        setIsSponsorModalOpen(false);
        setPaymentSuccessRest(null);
      }, 2500);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-[#0F3E2E] text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-[#FF4E27]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Sélection Officielle Recommandée par les Utilisateurs</span>
          </div>

          <h1 className="font-serif font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            Les Meilleurs Restaurants Afro-Caribéens Recommandés
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Plébiscités par nos membres gourmets et vérifiés par la communauté Afrodelicious.
            Découvrez nos partenaires certifiés, leurs plats signatures et leur périmètre de livraison sur la carte.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              100% Avis & Votes Utilisateurs
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-4 h-4" />
              Partenaires Certifiés Afrodelicious
            </span>
            <span className="flex items-center gap-1.5 text-orange-400">
              <Truck className="w-4 h-4" />
              Livraison dans le Périmètre Délimité
            </span>
          </div>
        </div>

        {/* Call to action for restaurants */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Vous êtes restaurateur ou traiteur ?</h4>
              <p className="text-[11px] text-slate-400">
                Les restaurants doivent activer leur formule de sponsoring payante pour apparaître dans ce menu recommandé (+300% de commandes).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSponsorModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#e03d16] hover:to-[#e66334] text-white text-xs font-black shadow-lg shadow-[#FF4E27]/30 transition-all flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Mettre mon restaurant en avant (Payant)</span>
          </button>
        </div>
      </div>

      {/* Filter and City Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1">Cuisine :</span>
          {[
            { id: 'all', label: 'Toutes les spécialités' },
            { id: 'sénégal', label: '🇸🇳 Sénégalaise' },
            { id: 'créole', label: '🇬🇵 Créole & Antillaise' },
            { id: 'jamaï', label: '🇯🇲 Jamaïquaine' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCuisine(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCuisine === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className="px-3 py-1 rounded-xl bg-orange-50 text-[#FF4E27] font-black">
            {sponsoredRecommendedList.length} restaurants recommandés & sponsorisés
          </span>
        </div>
      </div>

      {/* Featured Sponsored Recommended Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsoredRecommendedList.map((restaurant, index) => {
          const isVoted = votedRestaurantIds.includes(restaurant.id);
          return (
            <div
              key={restaurant.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Cover Image & Badges */}
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <img
                  src={restaurant.coverImage}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Top Badges: Rank & Sponsoring Status */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Award className="w-3.5 h-3.5 fill-current" />
                    <span>Top #{index + 1} Recommandé</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-amber-400/30">
                    Sponsorisé
                  </span>
                </div>

                {/* Recommendation Counter on top right */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 text-xs font-black shadow-md">
                  <ThumbsUp className="w-3.5 h-3.5 text-[#FF4E27] fill-current" />
                  <span>{restaurant.recommendationCount || 250}</span>
                </div>

                {/* Bottom Cover Info */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-0.5">
                    <span>{restaurant.countryFlag}</span>
                    <span>{restaurant.cuisine}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-white">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {restaurant.rating} ({restaurant.reviewsCount})
                    </span>
                  </div>
                  <h3 className="font-serif font-black text-lg text-white drop-shadow-md">
                    {restaurant.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Community Quote / Testimonial */}
                {restaurant.communityReviews && restaurant.communityReviews.length > 0 && (
                  <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/60 text-xs text-slate-700 italic relative">
                    <p className="line-clamp-2">
                      « {restaurant.communityReviews[0].comment} »
                    </p>
                    <span className="text-[10px] text-slate-500 font-bold block mt-1 not-italic">
                      — {restaurant.communityReviews[0].userName} (Membre vérifié)
                    </span>
                  </div>
                )}

                {/* Highlights Dishes */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Plats signatures recommandés :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {restaurant.menu.slice(0, 2).map(dish => (
                      <span
                        key={dish.id}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-medium"
                      >
                        🍽️ {dish.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Delivery Perimeter Info */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1 text-slate-700 font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#FF4E27]" />
                    <span>{restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-bold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Livraison {restaurant.deliveryFee.toFixed(2)} €</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Rayon ~{restaurant.deliveryRadiusKm || 3.5} km
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    {/* User Vote Button */}
                    <button
                      type="button"
                      onClick={() => handleVoteRecommendation(restaurant.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                        isVoted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isVoted ? 'fill-emerald-600 text-emerald-600' : 'text-slate-400'}`} />
                      <span>{isVoted ? 'Recommandé par vous !' : 'Recommander (+1)'}</span>
                    </button>

                    {/* View Perimeter Polygon on Google Maps */}
                    <button
                      type="button"
                      onClick={() => onOpenMapForRestaurant(restaurant)}
                      title="Voir le périmètre de livraison sur la carte Google Maps"
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-[#FF4E27]" />
                    </button>
                  </div>

                  {/* Order Button */}
                  <button
                    type="button"
                    onClick={() => onSelectRestaurantForOrder(restaurant)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:bg-[#FF4E27]"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Commander chez ce restaurant</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Non-Sponsored / Pending Restaurants Section (Restaurateur Call-to-Action) */}
      {pendingSponsorshipList.length > 0 && (
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-slate-700" />
                <h3 className="font-serif font-black text-lg text-slate-900">
                  Établissements en attente d'activation de sponsoring ({pendingSponsorshipList.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ces restaurants ont reçu des votes d'utilisateurs mais doivent activer leur pass payant pour être affichés dans la sélection principale du menu.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsSponsorModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all self-start sm:self-auto shrink-0 flex items-center gap-1.5"
            >
              <span>Activer un Pass Restaurateur</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {pendingSponsorshipList.map(r => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={r.logo}
                    alt={r.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{r.name}</h4>
                    <p className="text-[11px] text-amber-700 font-medium">
                      👍 {r.recommendationCount || 94} recommandations reçues
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRestToSponsor(r.id);
                    setIsSponsorModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-[#FF4E27] hover:text-white text-[#FF4E27] text-xs font-bold transition-all shrink-0"
                >
                  Sponsoriser
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* RESTAURANT SPONSORSHIP PAYMENT MODAL                         */}
      {/* ============================================================ */}
      {isSponsorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setIsSponsorModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-[#FF4E27] text-white flex items-center justify-center mx-auto shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-black text-xl text-slate-900">
                Mise en Avant « Recommandés »
              </h3>
              <p className="text-xs text-slate-500">
                Paiement sécurisé de visibilité sponsorisée dans le menu principal Afrodelicious
              </p>
            </div>

            {/* Restaurant Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Sélectionnez le restaurant à sponsoriser :
              </label>
              <select
                value={selectedRestToSponsor}
                onChange={(e) => setSelectedRestToSponsor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 rounded-xl p-2.5 focus:outline-none focus:border-[#FF4E27]"
              >
                {restaurants.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.countryFlag} {r.name} ({r.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Pricing Plans */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 block">
                Choisissez votre formule de visibilité :
              </label>
              
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    id: 'starter',
                    title: 'Pass Découverte Booster (7 jours)',
                    price: '19 €',
                    desc: 'Affichage garanti dans le menu Recommandés, badge Recommandé Bronze, statistiques de base.'
                  },
                  {
                    id: 'pro',
                    title: 'Pass Croissance Pro (30 jours)',
                    price: '49 € / mois',
                    badge: 'Recommandé',
                    desc: 'Placement prioritaire en tête de liste, badge Recommandé Or, -5% sur les commissions de livraison, analytics complets.'
                  },
                  {
                    id: 'prestige',
                    title: 'Pass Annuel Prestige (12 mois)',
                    price: '399 € / an',
                    badge: '-32%',
                    desc: 'Placement permanent en vedette, shooting photo pro offert, mise en avant dans la newsletter culinaire.'
                  }
                ].map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedPlan === plan.id
                        ? 'bg-orange-50 border-[#FF4E27] ring-1 ring-[#FF4E27]'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{plan.title}</span>
                        {plan.badge && (
                          <span className="px-1.5 py-0.2 rounded-md bg-[#FF4E27] text-white text-[9px] font-black uppercase">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{plan.desc}</p>
                    </div>

                    <span className="text-sm font-black text-slate-900 shrink-0">
                      {plan.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Badges */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Moyens de paiement acceptés :</span>
              <span className="font-bold text-slate-800">CB · Wave · Orange Money · Apple Pay</span>
            </div>

            {paymentSuccessRest ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-800 animate-fade-in flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Paiement validé ! {paymentSuccessRest} est désormais visible dans le menu Recommandés.</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirmSponsorshipPayment}
                disabled={paymentProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#e03d16] hover:to-[#e66334] text-white text-xs sm:text-sm font-black shadow-lg shadow-[#FF4E27]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {paymentProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Validation du paiement en cours...
                  </span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>
                      Confirmer et Payer ({selectedPlan === 'starter' ? '19,00 €' : selectedPlan === 'pro' ? '49,00 €' : '399,00 €'})
                    </span>
                  </>
                )}
              </button>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
