import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Eye, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Layers, 
  AlertCircle,
  CheckCircle2,
  Lock,
  Tag
} from 'lucide-react';
import { 
  PricingPlan, 
  getStoredPricingPlans, 
  savePricingPlans, 
  resetPricingPlans 
} from '../data/pricingPlansStore';

interface AdminPricingManagerProps {
  onNotify?: (message: string) => void;
  onPreviewPricing?: () => void;
}

export const AdminPricingManager: React.FC<AdminPricingManagerProps> = ({
  onNotify,
  onPreviewPricing
}) => {
  const [plans, setPlans] = useState<PricingPlan[]>(() => getStoredPricingPlans());
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [newFeatureInput, setNewFeatureInput] = useState<string>('');
  const [selectedPlanForFeature, setSelectedPlanForFeature] = useState<string>('plan-gourmet-plus');
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);

  // Key metrics calculation
  const totalSubscribers = plans.reduce((sum, p) => sum + (p.slug !== 'free' ? p.subscribersCount : 0), 0);
  const estimatedMrr = plans.reduce((sum, p) => {
    if (p.slug === 'free') return sum;
    // Estimated 60% annual, 40% monthly
    const monthlyPortion = (p.subscribersCount * 0.4) * p.priceMonthly;
    const annualPortion = (p.subscribersCount * 0.6) * (p.priceAnnually / 12);
    return sum + monthlyPortion + annualPortion;
  }, 0);

  const handleUpdateField = (planId: string, field: keyof PricingPlan, value: any) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const handleSaveAll = () => {
    savePricingPlans(plans);
    setIsSavedFeedback(true);
    onNotify?.('✓ Grille tarifaire Afrodelicious+ enregistrée et publiée en direct.');
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Voulez-vous rétablir la grille tarifaire par défaut ?')) {
      const reset = resetPricingPlans();
      setPlans(reset);
      onNotify?.('Grille tarifaire réinitialisée aux valeurs recommandées.');
    }
  };

  const handleAddFeature = (planId: string) => {
    if (!newFeatureInput.trim()) return;
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          features: [...p.features, newFeatureInput.trim()]
        };
      }
      return p;
    }));
    setNewFeatureInput('');
    onNotify?.('Nouvel avantage ajouté au plan.');
  };

  const handleRemoveFeature = (planId: string, indexToRemove: number) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          features: p.features.filter((_, idx) => idx !== indexToRemove)
        };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Metrics */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B3B24] via-emerald-950 to-slate-950 text-white shadow-xl border border-emerald-900/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Gestionnaire Commercial Super Admin</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight">
              Tarifs, Abonnements & Pass VIP Afrodelicious+
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Configurez en direct les formules d'adhésion, les tarifs mensuels et annuels, les badges marketing et les avantages inclus dans chaque offre.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onPreviewPricing && (
              <button
                type="button"
                onClick={onPreviewPricing}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Aperçu de la Pricing Page</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-amber-500 hover:from-[#e03814] hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-[#FF4E27]/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {isSavedFeedback ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Enregistré !</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les Tarifs</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6 mt-6 border-t border-emerald-900/60">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
              <span>Abonnés Payants</span>
              <Users className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-mono font-black text-xl text-white">
              {totalSubscribers.toLocaleString('fr-FR')}
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">+14.2% ce mois</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
              <span>MRR Estimé</span>
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="font-mono font-black text-xl text-amber-300">
              {Math.round(estimatedMrr).toLocaleString('fr-FR')} €
            </div>
            <span className="text-[10px] text-amber-400/90 font-mono">~{(Math.round(estimatedMrr * 12 / 1000) / 10).toFixed(1)}k ARR</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
              <span>ARPU Moyen</span>
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="font-mono font-black text-xl text-white">
              11.20 € <span className="text-xs font-normal text-slate-400">/mois</span>
            </div>
            <span className="text-[10px] text-sky-400 font-bold">Stable</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
              <span>Taux d'Évaporation (Churn)</span>
              <AlertCircle className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-mono font-black text-xl text-emerald-400">
              1.8%
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">Excellent (&lt; 2.5%)</span>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const isGourmet = plan.slug === 'gourmet_plus';
          const isVip = plan.slug === 'club_vip';
          const isFree = plan.slug === 'free';

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-5 sm:p-6 bg-white border flex flex-col justify-between transition-all ${
                plan.highlighted 
                  ? 'border-[#FF4E27] shadow-xl ring-2 ring-[#FF4E27]/20' 
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Status & Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      plan.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`} />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {plan.status === 'active' ? 'En ligne' : 'En pause'}
                    </span>
                  </div>

                  <select
                    value={plan.status}
                    onChange={(e) => handleUpdateField(plan.id, 'status', e.target.value)}
                    className="text-[10px] font-bold p-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                  >
                    <option value="active">Actif (Visible)</option>
                    <option value="paused">En pause (Masqué)</option>
                  </select>
                </div>

                {/* Plan Name & Tagline Inputs */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Nom de l'offre
                  </label>
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => handleUpdateField(plan.id, 'name', e.target.value)}
                    className="w-full font-serif font-black text-lg text-slate-900 border border-slate-200 rounded-xl px-3 py-1.5 focus:border-[#FF4E27] focus:outline-none"
                  />
                  
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block pt-1">
                    Sous-titre explicatif
                  </label>
                  <textarea
                    rows={2}
                    value={plan.tagline}
                    onChange={(e) => handleUpdateField(plan.id, 'tagline', e.target.value)}
                    className="w-full text-xs text-slate-600 border border-slate-200 rounded-xl p-2 focus:border-[#FF4E27] focus:outline-none resize-none"
                  />
                </div>

                {/* Badge promotionnel */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#FF4E27]" />
                    <span>Badge Marketing (ex: Le Plus Populaire ⭐)</span>
                  </label>
                  <input
                    type="text"
                    value={plan.badge || ''}
                    placeholder="Ex: Le Plus Populaire ⭐"
                    onChange={(e) => handleUpdateField(plan.id, 'badge', e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 border border-slate-200 rounded-xl px-3 py-1.5 focus:border-[#FF4E27] focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Pricing Inputs */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Grille Tarifaire</span>
                    <span className="text-[10px] font-mono text-slate-400">Devise : EUR (€)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 block">
                        Mensuel (€/mois)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        disabled={isFree}
                        value={plan.priceMonthly}
                        onChange={(e) => handleUpdateField(plan.id, 'priceMonthly', parseFloat(e.target.value) || 0)}
                        className={`w-full font-mono font-black text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#FF4E27] focus:outline-none ${
                          isFree ? 'opacity-60 bg-slate-100 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 block">
                        Annuel total (€/an)
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        disabled={isFree}
                        value={plan.priceAnnually}
                        onChange={(e) => handleUpdateField(plan.id, 'priceAnnually', parseFloat(e.target.value) || 0)}
                        className={`w-full font-mono font-black text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#FF4E27] focus:outline-none ${
                          isFree ? 'opacity-60 bg-slate-100 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {!isFree && plan.priceAnnually > 0 && (
                    <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg flex items-center justify-between">
                      <span>Équivalent mensuel annuel :</span>
                      <span className="font-mono">{(plan.priceAnnually / 12).toFixed(2)} €/mois</span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Avantages Inclus ({plan.features.length})
                    </span>
                    <span className="text-[10px] text-slate-400">Visible sur le comparateur</span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {plan.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="group flex items-start gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="flex-1 text-slate-700 leading-snug font-medium">
                          {feat}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(plan.id, idx)}
                          title="Supprimer cet avantage"
                          className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 p-0.5 transition-opacity cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Feature input */}
                  <div className="pt-1 flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Ajouter un avantage..."
                      value={selectedPlanForFeature === plan.id ? newFeatureInput : ''}
                      onFocus={() => setSelectedPlanForFeature(plan.id)}
                      onChange={(e) => {
                        setSelectedPlanForFeature(plan.id);
                        setNewFeatureInput(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature(plan.id);
                        }
                      }}
                      className="flex-1 text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 focus:border-[#FF4E27] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddFeature(plan.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#0B3B24] hover:bg-emerald-900 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subscribers count badge */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Abonnés actuels :</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {plan.subscribersCount.toLocaleString('fr-FR')} membres
                  </span>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer ce plan</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Controls & Reset */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Toutes les modifications sont synchronisées avec la boutique et le modal Pricing.</span>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Rétablir les valeurs par défaut</span>
        </button>
      </div>

    </div>
  );
};
