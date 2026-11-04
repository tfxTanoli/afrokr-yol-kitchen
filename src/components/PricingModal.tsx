import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Truck, 
  HeartHandshake,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { User } from '../types';
import { PricingPlan, getStoredPricingPlans } from '../data/pricingPlansStore';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateCurrentUser: (user: User) => void;
  onNotify?: (msg: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser,
  onNotify
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');
  const [plans, setPlans] = useState<PricingPlan[]>(() => getStoredPricingPlans().filter(p => p.status === 'active'));
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPlans(getStoredPricingPlans().filter(p => p.status === 'active'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.slug === 'free') {
      const updatedUser: User = {
        ...currentUser,
        isPlusMember: false,
        subscriptionTier: 'basic'
      };
      onUpdateCurrentUser(updatedUser);
      onNotify?.('Formule Découverte sélectionnée.');
      onClose();
      return;
    }

    setSubscribingPlanId(plan.id);

    setTimeout(() => {
      const updatedUser: User = {
        ...currentUser,
        isPlusMember: true,
        subscriptionTier: 'plus',
        subscriptionRenewalDate: billingCycle === 'annually' ? '03/11/2027' : '03/12/2026'
      };
      onUpdateCurrentUser(updatedUser);
      setSubscribingPlanId(null);
      onNotify?.(`🎉 Félicitations ! Votre abonnement ${plan.name} est activé avec succès.`);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-[36px] shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-br from-[#0B3B24] via-emerald-950 to-slate-950 text-white p-6 sm:p-8 shrink-0 overflow-hidden">
          {/* Subtle geometric circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-[#FF4E27]/10 pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-10"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl text-center mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF4E27]/30 to-amber-500/30 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Abonnements Afrodelicious+</span>
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Célébrez l'Excellence Culinaire Afro-Caribéenne
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Zéro publicité, masterclasses illimitées et nos magazines papier d’exception expédiés chez vous chaque saison.
            </p>

            {/* Billing Cycle Switch */}
            <div className="pt-2 flex items-center justify-center">
              <div className="p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Paiement Mensuel
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annually')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === 'annually'
                      ? 'bg-[#FF4E27] text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>Paiement Annuel</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                    -20%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid (Scrollable on small mobile screens) */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-stretch">
            {plans.map((plan) => {
              const isCurrent = (currentUser.isPlusMember && (plan.slug === 'gourmet_plus' || plan.slug === 'club_vip')) ||
                (!currentUser.isPlusMember && plan.slug === 'free');
              const price = billingCycle === 'annually'
                ? (plan.priceAnnually === 0 ? 0 : (plan.priceAnnually / 12))
                : plan.priceMonthly;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all relative ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-orange-50/90 via-white to-amber-50/40 border-2 border-[#FF4E27] shadow-xl shadow-orange-500/10 md:-translate-y-1'
                      : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black shadow-xs ${plan.badgeColor || 'bg-slate-900 text-white'}`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif font-black text-lg text-slate-900">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-500 min-h-[32px] mt-1 leading-snug">
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="pt-2 pb-3 border-y border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono font-black text-3xl sm:text-4xl text-slate-900">
                          {price === 0 ? 'Gratuit' : `${price.toFixed(2)} €`}
                        </span>
                        {price > 0 && (
                          <span className="text-xs text-slate-500 font-medium">
                            / mois
                          </span>
                        )}
                      </div>
                      {billingCycle === 'annually' && plan.priceAnnually > 0 && (
                        <p className="text-[11px] text-[#FF4E27] font-semibold mt-0.5">
                          Facturé {plan.priceAnnually} € par an (soit 2 mois offerts)
                        </p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-2.5 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Ce qui est inclus :
                      </span>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            plan.highlighted ? 'bg-[#FF4E27]/10 text-[#FF4E27]' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isCurrent || subscribingPlanId === plan.id}
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3 px-4 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-400 cursor-default'
                          : plan.highlighted
                          ? 'bg-[#FF4E27] hover:bg-[#E03814] text-white shadow-md shadow-[#FF4E27]/30 hover:scale-[1.02] active:scale-95'
                          : plan.slug === 'club_vip'
                          ? 'bg-slate-900 hover:bg-black text-white shadow-md hover:scale-[1.02] active:scale-95'
                          : 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-800'
                      }`}
                    >
                      {subscribingPlanId === plan.id ? (
                        <span>Activation en cours...</span>
                      ) : isCurrent ? (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Formule Actuelle</span>
                        </span>
                      ) : (
                        <span>{plan.buttonText}</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Guarantees */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-around gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Garantie 14 jours satisfait ou remboursé</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FF4E27] shrink-0" />
              <span>Paiement chiffré SSL 256-bit (Stripe & Wave)</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Sans engagement · Résiliation en 1 clic</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
