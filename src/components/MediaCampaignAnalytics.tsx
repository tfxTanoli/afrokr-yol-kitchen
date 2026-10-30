import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Globe2, 
  TrendingUp, 
  BarChart3, 
  Video, 
  ShoppingBag, 
  Eye, 
  Clock, 
  Sparkles, 
  Share2, 
  Bookmark, 
  Download, 
  FileText, 
  Layers, 
  Tv, 
  Smartphone, 
  Play, 
  CheckCircle2, 
  DollarSign, 
  SlidersHorizontal, 
  Filter, 
  ArrowUpRight, 
  Flame, 
  RotateCcw, 
  Percent, 
  Check, 
  ChevronRight,
  Info,
  ExternalLink,
  Target,
  MousePointer,
  PieChart,
  Megaphone,
  Monitor,
  Zap,
  ShoppingCart,
  QrCode,
  Search,
  Plus,
  Pause,
  Trash2,
  Tag,
  Building2,
  Calendar,
  X
} from 'lucide-react';
import { 
  MEDIA_CAMPAIGN_ANALYTICS, 
  INITIAL_MEDIA_CAMPAIGNS,
  MediaCampaign,
  AdFormatMetrics, 
  downloadMediaReportCsv, 
  downloadMediaReportJson 
} from '../data/mediaCampaignData';

interface MediaCampaignAnalyticsProps {
  onExportPdf?: () => void;
  standalone?: boolean;
}

type MediaSubTab = 
  | 'overview' 
  | 'campaigns' 
  | 'intent' 
  | 'audience' 
  | 'context' 
  | 'formats' 
  | 'video' 
  | 'rates';

export const MediaCampaignAnalytics: React.FC<MediaCampaignAnalyticsProps> = ({
  onExportPdf,
  standalone = false
}) => {
  const [activeSubTab, setActiveSubTab] = useState<MediaSubTab>('overview');
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');
  const [selectedFormatId, setSelectedFormatId] = useState<string>('all');
  
  // Multi-Campaign Management State
  const [campaignsList, setCampaignsList] = useState<MediaCampaign[]>(INITIAL_MEDIA_CAMPAIGNS);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all');
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<'all' | 'active' | 'scheduled' | 'paused' | 'completed'>('all');
  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);

  // New Campaign Form State
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newCategory, setNewCategory] = useState('Condiments & Épices');
  const [newBudget, setNewBudget] = useState<number>(7500);
  const [newRetailers, setNewRetailers] = useState<string[]>(['Amazon Fresh', 'Walmart', 'Instacart']);
  const [newFormats, setNewFormats] = useState<string[]>(['Recette Sponsorisée', 'Shoppable Ads']);
  const [newTargetGeo, setNewTargetGeo] = useState('USA & France');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [newEndDate, setNewEndDate] = useState(
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  // Interactive Campaign Simulator State
  const [simBudget, setSimBudget] = useState<number>(5000);
  const [simFormat, setSimFormat] = useState<'native' | 'video' | 'sponsored_recipe' | 'shoppable_ads'>('sponsored_recipe');
  const [simTargetGeo, setSimTargetGeo] = useState<'all' | 'us' | 'france'>('all');

  const data = MEDIA_CAMPAIGN_ANALYTICS;
  const currSymbol = currency === 'EUR' ? '€' : '$';

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaignsList.filter(c => {
      if (campaignStatusFilter !== 'all' && c.status !== campaignStatusFilter) return false;
      return true;
    });
  }, [campaignsList, campaignStatusFilter]);

  // Selected Campaign details (or aggregated)
  const currentCampaign = useMemo(() => {
    if (selectedCampaignId === 'all') return null;
    return campaignsList.find(c => c.id === selectedCampaignId) || null;
  }, [campaignsList, selectedCampaignId]);

  // Filtered formats for the 90-day comparison table
  const displayedFormats = useMemo(() => {
    if (selectedFormatId === 'all') return data.formatsKPIs;
    return data.formatsKPIs.filter(f => f.formatId === selectedFormatId);
  }, [selectedFormatId, data.formatsKPIs]);

  // Toggle Campaign Status (Active <-> Paused)
  const handleToggleCampaignStatus = (id: string) => {
    setCampaignsList(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'active' ? 'paused' : c.status === 'paused' ? 'active' : c.status;
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Delete Campaign
  const handleDeleteCampaign = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette campagne ?')) {
      setCampaignsList(prev => prev.filter(c => c.id !== id));
      if (selectedCampaignId === id) setSelectedCampaignId('all');
    }
  };

  // Create Campaign Submit
  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim() || !newBrandName.trim()) return;

    const estImpressions = Math.round((newBudget / 22) * 1000);
    const estClicks = Math.round(estImpressions * 0.071);
    const estConversions = Math.round(estClicks * 0.088);

    const created: MediaCampaign = {
      id: `camp-${Date.now()}`,
      name: newCampaignName.trim(),
      brandName: newBrandName.trim(),
      brandCategory: newCategory,
      status: 'active',
      startDate: newStartDate,
      endDate: newEndDate,
      budgetTotalEur: newBudget,
      budgetSpentEur: 0,
      retailersTargeted: newRetailers,
      formatsUsed: newFormats,
      targetGeography: newTargetGeo,
      impressions: estImpressions,
      clicks: estClicks,
      ctrPercent: 7.1,
      productAndRetailerClicks: Math.round(estClicks * 0.77),
      retailerOutboundRatePercent: 76.8,
      cartAdditions: Math.round(estClicks * 0.26),
      couponScans: Math.round(estClicks * 0.16),
      groceryListAdds: Math.round(estClicks * 0.31),
      searchLiftPercent: 44.0,
      conversions: estConversions,
      conversionRatePercent: 8.8,
      cpaEur: Number((newBudget / Math.max(estConversions, 1)).toFixed(2)),
      roas: 4.7
    };

    setCampaignsList(prev => [created, ...prev]);
    setIsCreateCampaignModalOpen(false);
    setSelectedCampaignId(created.id);
    setActiveSubTab('campaigns');

    // Reset Form
    setNewCampaignName('');
    setNewBrandName('');
  };

  // Simulator Calculations
  const simulationResults = useMemo(() => {
    const formatData = data.formatsKPIs.find(f => f.formatId === simFormat) || data.formatsKPIs[0];
    const cpm = currency === 'EUR' ? formatData.cpmEur : formatData.cpmUsd;
    const cpc = currency === 'EUR' ? formatData.cpcEur : formatData.cpcUsd;
    
    // Geo multiplier
    const geoMultiplier = simTargetGeo === 'us' ? 1.05 : simTargetGeo === 'france' ? 1.02 : 1.0;
    const adjustedCpm = cpm * geoMultiplier;

    const estimatedImpressions = Math.round((simBudget / adjustedCpm) * 1000);
    const estimatedClicks = Math.round(estimatedImpressions * (formatData.ctrPercent / 100));
    const estimatedGroceryAdds = Math.round(estimatedClicks * (formatData.interactionRatePercent / 100) * 0.45);
    const estimatedSaves = Math.round(estimatedClicks * (formatData.recipeSaveRatePercent / 100));
    const estimatedVideoCompletions = simFormat === 'video' 
      ? Math.round(estimatedImpressions * 0.65 * (data.videoKPIs.vcrCompletionRatePercent / 100))
      : 0;

    return {
      impressions: estimatedImpressions,
      clicks: estimatedClicks,
      groceryAdds: estimatedGroceryAdds,
      saves: estimatedSaves,
      videoCompletions: estimatedVideoCompletions,
      effectiveCpm: adjustedCpm,
      effectiveCpc: cpc
    };
  }, [simBudget, simFormat, simTargetGeo, currency, data]);

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* ================================================================ */}
      {/* HEADER BANNER & MEDIA SUITE CONTROLS                            */}
      {/* ================================================================ */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#142d20] text-white shadow-xl relative overflow-hidden">
        {/* Decorative soft glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4E27]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF4E27] bg-[#FF4E27]/20 px-2.5 py-0.5 rounded-full border border-[#FF4E27]/30">
                Media Kit & Brand Solutions 2026
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Moyenne 90 derniers jours · Intention d'Achat FNB & Multi-Campagnes
              </span>
            </div>

            <h1 className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-white">
              Analyses Médias des Campagnes Publicitaires
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Mesure de l'impact auprès de la diaspora et des passionnés afro-culinaires (USA 38%, France, Canada).
              KPIs d’intention d'achat certifiés vers <strong>Amazon, Walmart, Instacart, Target et Kroger</strong>, 
              suivi du search lift post-exposition et gestion multi-campagnes en direct.
            </p>
          </div>

          {/* Quick Action Tools & Currency Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Currency Switcher */}
            <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setCurrency('EUR')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  currency === 'EUR' ? 'bg-[#FF4E27] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                € EUR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  currency === 'USD' ? 'bg-[#FF4E27] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                $ USD
              </button>
            </div>

            {/* Launch Campaign Button */}
            <button
              type="button"
              onClick={() => setIsCreateCampaignModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Créer une nouvelle campagne sponsorisée"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nouvelle Campagne</span>
            </button>

            {/* CSV Export */}
            <button
              type="button"
              onClick={downloadMediaReportCsv}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Extraire en CSV complet"
            >
              <FileDownIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            {/* JSON Export */}
            <button
              type="button"
              onClick={downloadMediaReportJson}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Données brutes JSON"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Export JSON</span>
            </button>

            {/* PDF Export */}
            {onExportPdf && (
              <button
                type="button"
                onClick={onExportPdf}
                className="px-4 py-2 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-black shadow-md shadow-[#FF4E27]/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                title="Générer Rapport Média PDF officiel"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Rapport PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Vue d’Ensemble & Preuve de Valeur', icon: TrendingUp },
            { id: 'campaigns', label: 'Gestion Multi-Campagnes', icon: Megaphone, badge: `${campaignsList.length} Campagnes` },
            { id: 'intent', label: 'KPIs Intention d’Achat (FNB)', icon: ShoppingCart, badge: 'Crucial F&B' },
            { id: 'audience', label: 'Audience & Habitudes de Courses', icon: Users, badge: '38% USA' },
            { id: 'context', label: 'Contexte Culinaires & Ingrédients', icon: Sparkles },
            { id: 'formats', label: 'KPIs par Format (Moyenne 90j)', icon: Layers, badge: '6 Formats' },
            { id: 'video', label: 'Indicateurs Vidéo & VCR', icon: Video, badge: '68.4% VCR' },
            { id: 'rates', label: 'Tarifs, CPM/CPC & Simulateur', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as MediaSubTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF4E27]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                    isActive ? 'bg-orange-100 text-[#FF4E27]' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* SUB-TAB: GESTION MULTI-CAMPAGNES (MULTI-CAMPAIGN HUB)            */}
      {/* ================================================================ */}
      {activeSubTab === 'campaigns' && (
        <div className="space-y-6">
          
          {/* Top Bar with Filter & Add Button */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Console Multi-Campagnes Parallèles
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-semibold text-slate-700">
                  {campaignsList.filter(c => c.status === 'active').length} campagnes actives simultanément
                </span>
              </div>
              <h2 className="font-serif font-black text-xl text-slate-900 mt-1">
                Supervision des Campagnes Publicitaires en Direct
              </h2>
              <p className="text-xs text-slate-500">
                Gérez plusieurs marques en même temps, activez/mettez en pause les diffusions et comparez les résultats retailers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filters */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs">
                {(['all', 'active', 'paused', 'scheduled'] as const).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setCampaignStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      campaignStatusFilter === st 
                        ? 'bg-white text-slate-900 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {st === 'all' && 'Toutes'}
                    {st === 'active' && 'Actives'}
                    {st === 'paused' && 'En pause'}
                    {st === 'scheduled' && 'Programmées'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsCreateCampaignModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Créer une Campagne</span>
              </button>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCampaigns.map((camp) => {
              const isActive = camp.status === 'active';
              const isPaused = camp.status === 'paused';
              const isScheduled = camp.status === 'scheduled';
              const isSelected = selectedCampaignId === camp.id;

              return (
                <div
                  key={camp.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 bg-white ${
                    isSelected 
                      ? 'border-[#FF4E27] shadow-md ring-2 ring-[#FF4E27]/20' 
                      : 'border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Top Status & Brand Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isActive ? 'bg-emerald-100 text-emerald-800' :
                            isPaused ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {isActive ? '● En diffusion' : isPaused ? '⏸ En pause' : '🕒 Programmée'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {camp.targetGeography}
                          </span>
                        </div>
                        <h3 className="font-serif font-black text-base text-slate-900 mt-1">
                          {camp.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {camp.brandName} · {camp.brandCategory}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleCampaignStatus(camp.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title={isActive ? 'Mettre en pause' : 'Activer'}
                        >
                          {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCampaign(camp.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors"
                          title="Supprimer la campagne"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Retailers Targeted Badges */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Retailers Partenaires Ciblés :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {camp.retailersTargeted.map((ret, idx) => (
                          <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {ret}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Performance Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Clics FNB</span>
                        <span className="text-xs font-black font-mono text-slate-900 block mt-0.5">
                          {camp.productAndRetailerClicks.toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <div className="p-2 bg-emerald-50/70 rounded-xl">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase block">Ajouts Panier</span>
                        <span className="text-xs font-black font-mono text-emerald-700 block mt-0.5">
                          {camp.cartAdditions.toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <div className="p-2 bg-purple-50/70 rounded-xl">
                        <span className="text-[10px] font-bold text-purple-700 uppercase block">Search Lift</span>
                        <span className="text-xs font-black font-mono text-purple-700 block mt-0.5">
                          +{camp.searchLiftPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Budget & Dates */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Budget Alloué</span>
                        <span className="font-bold font-mono text-slate-900">
                          {camp.budgetTotalEur.toLocaleString('fr-FR')} € ({currSymbol}{Math.round(camp.budgetTotalEur * (currency === 'EUR' ? 1 : 1.09)).toLocaleString('fr-FR')})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">ROAS Mesuré</span>
                        <span className="font-black font-mono text-emerald-600">
                          {camp.roas > 0 ? `${camp.roas}x` : 'En attente'}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Actions CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCampaignId(camp.id);
                        setActiveSubTab('intent');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-[#FF4E27] hover:text-white text-slate-800 text-xs font-bold transition-all text-center cursor-pointer"
                    >
                      Voir KPIs Intention d'Achat
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ================================================================ */}
      {/* SUB-TAB: PURCHASE INTENT KPIS (LA SECTION CRUCIALE POUR MARQUES) */}
      {/* ================================================================ */}
      {activeSubTab === 'intent' && (
        <div className="space-y-6">
          
          {/* Header Callout & Explanatory Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white border border-emerald-900/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  Section Prioritaire Marques FNB & CPG
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-amber-300 font-semibold">
                  Intention d'achat concrète et conversions
                </span>
              </div>
              <h2 className="font-serif font-black text-2xl text-white">
                Indicateurs Clés d'Intention d'Achat Culinaires (Retailers & Drive)
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Mesurez le passage à l'acte direct vers les enseignes partenaires : clics sortants vers 
                <strong> Amazon Fresh, Walmart, Instacart, Target et Kroger</strong>, ajouts directs aux paniers d'achat, 
                utilisations de coupons, ajouts à la liste de courses et augmentation des recherches de marque (Search Lift).
              </p>
            </div>

            {/* ROAS Summary Box */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center shrink-0 min-w-[160px]">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                ROAS Moyen (Return on Ad Spend)
              </span>
              <span className="text-3xl font-black font-mono text-white block mt-1">
                {data.purchaseIntent.roasMultiplier}x
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                4,80 € de ventes / 1 € investi
              </span>
            </div>
          </div>

          {/* 6 Core Purchase Intent KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            
            {/* 1. Clics vers produit / retailer */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clics Sortants Retailers</span>
              <span className="text-xl font-black text-slate-900 block font-mono">
                {data.purchaseIntent.totalProductAndBrandClicks.toLocaleString('fr-FR')}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">{data.purchaseIntent.retailerOutboundClickRatePercent}% taux sortant</span>
            </div>

            {/* 2. Ajouts au panier partenaire */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ajouts Panier Marchand</span>
              <span className="text-xl font-black text-emerald-600 block font-mono">
                {data.purchaseIntent.partnerCartAdditionsCount.toLocaleString('fr-FR')}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">{data.purchaseIntent.partnerCartAdditionRatePercent}% des clics sortants</span>
            </div>

            {/* 3. Utilisations coupons & scans QR */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coupons & Scans QR</span>
              <span className="text-xl font-black text-blue-600 block font-mono">
                {data.purchaseIntent.couponRedemptionsAndQrScans.toLocaleString('fr-FR')}
              </span>
              <span className="text-[10px] text-blue-700 font-semibold">{data.purchaseIntent.couponRedemptionRatePercent}% taux d'utilisation</span>
            </div>

            {/* 4. Ajouts liste de courses in-app */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ajouts Liste Courses</span>
              <span className="text-xl font-black text-[#FF4E27] block font-mono">
                {data.purchaseIntent.groceryListAdditionsCount.toLocaleString('fr-FR')}
              </span>
              <span className="text-[10px] text-orange-600 font-bold">Intention d'achat</span>
            </div>

            {/* 5. Search Lift (Recherches post-exposition) */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Search Lift Marque</span>
              <span className="text-xl font-black text-purple-600 block font-mono">
                +{data.purchaseIntent.brandSearchLiftPercent}%
              </span>
              <span className="text-[10px] text-purple-700 font-semibold">Recherches in-app post-ad</span>
            </div>

            {/* 6. Taux de conversion & CPA */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Taux Conversion / CPA</span>
              <span className="text-xl font-black text-slate-900 block font-mono">
                {data.purchaseIntent.conversionRatePercent}%
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">
                CPA: {currSymbol}{currency === 'EUR' ? data.purchaseIntent.cpaEur : data.purchaseIntent.cpaUsd}
              </span>
            </div>

          </div>

          {/* Deep Dive: Retailer Breakdown (Amazon, Walmart, Instacart, Target, Kroger) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  Performances et Clics Sortants par Enseigne / Retailer Partenaire
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Taux de redirection, ajouts au panier marchands et conversion par circuit de distribution.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold">
                148 200 clics marchands
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.purchaseIntent.retailers.map((ret, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500/50 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-900 font-black text-xs flex items-center justify-center shadow-2xs">
                        {ret.logoText.slice(0, 3)}
                      </div>
                      <div>
                        <span className="font-serif font-black text-sm text-slate-900 block">
                          {ret.retailerName}
                        </span>
                        <span className="text-[10px] text-slate-400">Part du volume sortant</span>
                      </div>
                    </div>
                    <span className="text-sm font-black font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      {ret.sharePercent}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Clics</span>
                      <span className="font-bold font-mono text-slate-900 block mt-0.5">
                        {ret.clicksCount.toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Ajout Panier</span>
                      <span className="font-bold font-mono text-emerald-600 block mt-0.5">
                        {ret.directCartAddsCount.toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Conversion</span>
                      <span className="font-bold font-mono text-slate-900 block mt-0.5">
                        {ret.conversionRatePercent}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Dive: Search Lift & Coupon Redemptions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Search Lift Insight */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-600" />
                  Search Lift Post-Exposition (+42.6%)
                </h3>
                <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded">
                  Impact Mémoriel Mesuré
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Le <strong>Search Lift</strong> mesure le volume de recherches spontanées de votre marque ou ingrédient 
                dans la barre de recherche globale de l'application Afrodelicious dans les 14 jours suivant l'exposition à la campagne.
              </p>

              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-800 font-bold">
                  <span>Recherches avant exposition (base témoin) :</span>
                  <span className="font-mono text-slate-600">100 base</span>
                </div>
                <div className="flex items-center justify-between text-purple-900 font-black">
                  <span>Recherches après exposition publicitaire :</span>
                  <span className="font-mono text-purple-700 text-sm">142.6 (+42.6%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-purple-200 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-600" style={{ width: '85%' }} />
                </div>
              </div>

              <div className="text-[11px] text-slate-500">
                ✓ Preuve que l'utilisateur retient le nom de la marque et revient activement le chercher pour réaliser sa recette.
              </div>
            </div>

            {/* Coupons & QR Code In-Store Scans */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  Coupons Promotionnels & Scans QR en Magasin
                </h3>
                <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  Drive-to-Store
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Les coupons et bons de réduction in-app permettent aux marques agroalimentaires de générer du 
                <strong> trafic physique et des passages en caisse</strong> immédiats en supermarchés ou épiceries fines.
              </p>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Coupons Téléchargés</span>
                  <span className="text-base font-black font-mono text-slate-900 mt-1 block">79 430</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Scannés / Utilisés</span>
                  <span className="text-base font-black font-mono text-emerald-700 mt-1 block">22 640 (28.5%)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
                <strong>Tracking omnicanal :</strong> Chaque QR code généré est unique et sécurisé, compatible avec 
                les lecteurs code-barres GS1 et applications de fidélité des distributeurs.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================================================================ */}
      {/* SUB-TAB 1: OVERVIEW & VALUE PROOF (Preuve de Valeur)             */}
      {/* ================================================================ */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          
          {/* 5 Core Value Proof Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            
            {/* 1. Taux d'engagement */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Taux d'Engagement</span>
                <Flame className="w-4 h-4 text-[#FF4E27]" />
              </div>
              <span className="text-2xl font-black text-slate-900 block font-mono">
                {data.valueProof.overallEngagementRatePercent}%
              </span>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>3.7x vs benchmark food ({data.valueProof.benchmarkFoodIndustryPercent}%)</span>
              </div>
            </div>

            {/* 2. Temps passé */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temps Passé Moyen</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-2xl font-black text-slate-900 block font-mono">
                {data.valueProof.avgTimeSpentOnSponsoredContent}
              </span>
              <span className="text-[11px] text-slate-500">Par recette sponsorisée consultée</span>
            </div>

            {/* 3. Clics qualifiés */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clics Qualifiés</span>
                <MousePointer className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl font-black text-slate-900 block font-mono">
                {data.valueProof.totalQualifiedClicks90d.toLocaleString('fr-FR')}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold">100% trafic direct vérifié</span>
            </div>

            {/* 4. Ajouts liste de courses */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ajouts Liste Courses</span>
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-black text-slate-900 block font-mono">
                {data.valueProof.totalGroceryAdditions90d.toLocaleString('fr-FR')}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold">Intention d'achat immédiate</span>
            </div>

            {/* 5. Taux de complétion vidéo */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complétion Vidéo (VCR)</span>
                <Video className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-2xl font-black text-slate-900 block font-mono">
                {data.valueProof.avgVideoCompletionRatePercent}%
              </span>
              <span className="text-[11px] text-purple-600 font-bold">+18 pts vs standard social</span>
            </div>

          </div>

          {/* Value Proof Executive Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Pourquoi communiquer sur Afrodelicious ? */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Target className="w-4 h-4 text-[#FF4E27]" />
                <h3 className="font-serif font-black text-sm text-slate-900">
                  Puissance Culinaro-Média & Intention Réelle
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contrairement aux réseaux sociaux généralistes où l'attention est volatile, 
                les utilisateurs d'Afrodelicious ouvrent l'application avec un objectif concret : 
                <strong> cuisiner, acheter des ingrédients du terroir et commander des repas</strong>.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>76% de passage à l'acte :</strong> ajout direct des ingrédients sponsorisés dans la liste de courses intégrée.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>3 min 48s d'immersion :</strong> temps moyen d'exposition à une marque sur nos recettes de chefs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>34.2% de taux de retour :</strong> les cuisiniers reviennent consulter et refaire la recette sponsorisée sous 14 jours.</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Intention d'Achat & Retailers Shortcut */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  Intention d'Achat Retailers FNB
                </h3>
                <span className="text-[11px] text-emerald-600 font-bold font-mono">4.8x ROAS</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Redirections sortantes vers les grandes enseignes américaines et européennes.
              </p>
              <div className="space-y-2">
                {[
                  { name: 'Amazon Fresh & Pantry', share: '36%', color: 'bg-amber-500' },
                  { name: 'Walmart Grocery', share: '25%', color: 'bg-blue-500' },
                  { name: 'Instacart Delivery', share: '18%', color: 'bg-emerald-500' },
                  { name: 'Target Market', share: '11%', color: 'bg-rose-500' },
                  { name: 'Kroger Pickup', share: '6%', color: 'bg-indigo-500' }
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{r.name}</span>
                    <span className="font-mono font-bold text-slate-900">{r.share}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('intent')}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Consulter les KPIs d'Intention d'Achat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Accès Rapide & Modèles Tarifaires */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  Tarifs de Référence (Rate Card)
                </h3>
                <span className="text-[11px] text-slate-500 font-bold">{currency}</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">CPM Moyen</span>
                    <span className="text-[10px] text-slate-500">Coût pour 1 000 impressions</span>
                  </div>
                  <span className="text-sm font-black font-mono text-slate-900">
                    {currency === 'EUR' ? `${data.rates.cpmBaselineEur.toFixed(2)} €` : `$${data.rates.cpmBaselineUsd.toFixed(2)}`}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">CPC Moyen</span>
                    <span className="text-[10px] text-slate-500">Coût par clic qualifié</span>
                  </div>
                  <span className="text-sm font-black font-mono text-emerald-600">
                    {currency === 'EUR' ? `${data.rates.cpcBaselineEur.toFixed(2)} €` : `$${data.rates.cpcBaselineUsd.toFixed(2)}`}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Sponsoring Collection</span>
                    <span className="text-[10px] text-slate-500">Exclusivité mensuelle thématique</span>
                  </div>
                  <span className="text-sm font-black font-mono text-[#FF4E27]">
                    {currency === 'EUR' ? `${data.rates.collectionSponsorshipMonthlyEur} €/mois` : `$${data.rates.collectionSponsorshipMonthlyUsd}/mo`}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveSubTab('rates')}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Accéder au Simulateur de Campagne</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ================================================================ */}
      {/* SUB-TAB 2: AUDIENCE & GROCERY HABITS                            */}
      {/* ================================================================ */}
      {activeSubTab === 'audience' && (
        <div className="space-y-6">
          
          {/* Top Audience KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Utilisateurs Actifs Mensuels</span>
              <span className="text-2xl font-black text-slate-900 block font-mono">
                {data.audience.totalActiveUsersMonthly.toLocaleString('fr-FR')}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold">+16.4% sur 90 jours</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Part Marché États-Unis (USA)</span>
              <span className="text-2xl font-black text-[#FF4E27] block font-mono">
                {data.audience.usAudience.percentage}%
              </span>
              <span className="text-[11px] text-slate-500">{data.audience.usAudience.totalUsers.toLocaleString('fr-FR')} cuisiniers aux USA</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Panier Moyen Épicerie</span>
              <span className="text-2xl font-black text-slate-900 block font-mono">
                {currency === 'EUR' ? `${data.audience.groceryHabits.avgBasketSpendEur.toFixed(2)} €` : `$${data.audience.groceryHabits.avgBasketSpendUsd.toFixed(2)}`}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold">Produits exotiques & terroir</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cuisine Maison Régulière</span>
              <span className="text-2xl font-black text-emerald-600 block font-mono">
                {data.audience.groceryHabits.cookAtHomeFrequentlyPercent}%
              </span>
              <span className="text-[11px] text-slate-500">≥ 4 repas préparés / semaine</span>
            </div>
          </div>

          {/* Deep Dive: USA Focus & International Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Focus USA & Top Metros */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                    <span className="text-base">🇺🇸</span>
                    Focus États-Unis : Répartition par Grandes Métropoles
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Diaspora afro-américaine, caribéenne et expatriés africains à fort pouvoir d'achat.
                  </p>
                </div>
                <span className="text-xs font-mono font-black text-[#FF4E27]">
                  54 283 membres
                </span>
              </div>

              <div className="space-y-3">
                {data.audience.usAudience.topMetros.map((metro, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>{metro.city}</span>
                      <span className="font-mono text-slate-600">
                        {metro.users.toLocaleString('fr-FR')} ({metro.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-[#FF4E27] to-amber-500" 
                        style={{ width: `${metro.percentage * 2.8}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-orange-50 border border-orange-100 text-xs text-orange-950 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#FF4E27] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Ciblage publicitaire géolocalisé :</strong> vos campagnes peuvent cibler exclusivement 
                  les États-Unis (villes spécifiques ou national) pour promouvoir vos produits distribués dans les 
                  enseignes américaines (Target, H-Mart, épiceries africaines locales).
                </p>
              </div>
            </div>

            {/* Répartition Internationale Globale */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-emerald-600" />
                  Empreinte Géographique Globale
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">142 850 membres</span>
              </div>

              <div className="space-y-3">
                {data.audience.internationalBreakdown.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{item.flag}</span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{item.region}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.users.toLocaleString('fr-FR')} utilisateurs</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 font-mono">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gender Split */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Répartition Hommes / Femmes
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {data.audience.genderSplit.map((g, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 text-center">
                      <span className="text-xs font-bold text-slate-700 block">{g.gender}</span>
                      <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">{g.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Âge & Habitudes de Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Tranches d'Âge */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Démographie par Tranches d'Âge
                </h3>
                <span className="text-[11px] text-emerald-600 font-bold">67% entre 18 et 34 ans</span>
              </div>

              <div className="space-y-3">
                {data.audience.ageDistribution.map((age, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>{age.range}</span>
                      <span className="font-mono text-slate-900">{age.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-purple-600" 
                        style={{ width: `${age.percentage * 2}%` }} 
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">{age.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Habitudes de Courses & Circuits Préférés */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  Habitudes d'Achat & Circuits de Courses
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Comportements déclarés</span>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Circuits d'approvisionnement préférés
                </span>
                {data.audience.groceryHabits.preferredShoppingChannels.map((channel, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span className="truncate pr-2">{channel.channel}</span>
                      <span className="font-mono text-emerald-600">{channel.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-emerald-600" 
                        style={{ width: `${channel.percentage}%` }} 
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Fréquence de courses hebdomadaire :</span>
                  <span className="font-bold text-slate-900 font-mono">71% (1 à 2 fois par semaine)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================================================================ */}
      {/* SUB-TAB 3: CONTEXT & CULINARY INSIGHTS                          */}
      {/* ================================================================ */}
      {activeSubTab === 'context' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Recettes Consultées */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FF4E27]" />
                    Recettes les Plus Consultées dans l'Application
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Moments de consultation idéaux pour l'insertion de recettes sponsorisées et bannières natives.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {data.context.topConsultedRecipes.map((r, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{r.recipe}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span>{r.country}</span>
                        <span>·</span>
                        <span className="text-[#FF4E27] font-semibold">{r.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-slate-900 block">
                        {r.monthlyViews.toLocaleString('fr-FR')} vues
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold">/ mois</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingrédients & Épices les Plus Recherchés */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Top Ingrédients & Épices Recherchés (90j)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mots-clés à haute valeur pour le ciblage contextuel et le placement de produits sponsorisés.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {data.context.topSearchedIngredients.map((ing, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span>{ing.name}</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">
                        {ing.searchCount90d.toLocaleString('fr-FR')} requêtes
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-amber-500" 
                        style={{ width: `${(ing.searchCount90d / 64200) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Régimes Alimentaires & Appareils Utilisés */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Régimes Alimentaires */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Régimes Alimentaires & Préférences
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Filtres actifs</span>
              </div>

              <div className="space-y-3">
                {data.context.dietaryRegimes.map((diet, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{diet.regime}</span>
                      <span className="text-[10px] text-slate-500">{diet.description}</span>
                    </div>
                    <span className="text-sm font-black text-emerald-700 font-mono pl-3">{diet.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Appareils Utilisés */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  Parc d'Appareils & Systèmes Utilisés
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Mobile First 97%</span>
              </div>

              <div className="space-y-3">
                {data.context.devicesUsed.map((dev, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {dev.device.includes('iOS') ? 'iOS' : dev.device.includes('Android') ? 'AND' : 'WEB'}
                      </div>
                      <span className="text-xs font-bold text-slate-900">{dev.device}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900 font-mono">{dev.percentage}%</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 text-xs text-slate-600">
                <strong>Format optimisé :</strong> Les vidéos verticales (9:16) et bannières in-feed sont testées 
                sur les derniers écrans Retina iOS et AMOLED Android pour un rendu haute définition sans latence.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================================================================ */}
      {/* SUB-TAB 4: FORMATS & 90-DAY ENGAGEMENT KPIS                     */}
      {/* ================================================================ */}
      {activeSubTab === 'formats' && (
        <div className="space-y-6">
          
          {/* Format Selector Filter */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filtrer par format publicitaire :</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedFormatId('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedFormatId === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tous les formats ({data.formatsKPIs.length})
              </button>
              {data.formatsKPIs.map(f => (
                <button
                  key={f.formatId}
                  type="button"
                  onClick={() => setSelectedFormatId(f.formatId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedFormatId === f.formatId
                      ? 'bg-[#FF4E27] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.formatName.split(' ')[0]} {f.formatName.split(' ')[1] || ''}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Formats KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedFormats.map((format) => {
              const cpm = currency === 'EUR' ? format.cpmEur : format.cpmUsd;
              const cpc = currency === 'EUR' ? format.cpcEur : format.cpcUsd;
              const minutes = Math.floor(format.avgTimeSpentSeconds / 60);
              const seconds = format.avgTimeSpentSeconds % 60;

              return (
                <div 
                  key={format.formatId}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-[#FF4E27]/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27] bg-orange-50 px-2 py-0.5 rounded">
                          {format.formatId.replace('_', ' ')}
                        </span>
                        <h4 className="font-serif font-black text-base text-slate-900 mt-1">
                          {format.formatName}
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg shrink-0">
                        CPM {currSymbol}{cpm.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                      {format.formatDescription}
                    </p>
                  </div>

                  {/* 6 Core KPIs on 90-day average */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    
                    {/* 1. CTR */}
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">CTR (Clics/Imp.)</span>
                      <span className="text-sm font-black font-mono text-emerald-600 block mt-0.5">
                        {format.ctrPercent}%
                      </span>
                    </div>

                    {/* 2. Taux d'interaction */}
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Taux d'Interaction</span>
                      <span className="text-sm font-black font-mono text-blue-600 block mt-0.5">
                        {format.interactionRatePercent}%
                      </span>
                    </div>

                    {/* 3. Temps passé */}
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Temps Passé</span>
                      <span className="text-sm font-black font-mono text-amber-600 block mt-0.5">
                        {minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}
                      </span>
                    </div>

                    {/* 4. Taux de sauvegarde */}
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Taux Sauvegarde</span>
                      <span className="text-sm font-black font-mono text-[#FF4E27] block mt-0.5">
                        {format.recipeSaveRatePercent}%
                      </span>
                    </div>

                    {/* 5. Taux de partage */}
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Taux de Partage</span>
                      <span className="text-sm font-black font-mono text-purple-600 block mt-0.5">
                        {format.recipeShareRatePercent}%
                      </span>
                    </div>

                    {/* 6. Taux de retour */}
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Retour Marque</span>
                      <span className="text-sm font-black font-mono text-slate-900 block mt-0.5">
                        {format.brandReturnRatePercent}%
                      </span>
                    </div>

                  </div>

                  {/* Volume 90j stats */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{format.totalImpressions90d.toLocaleString('fr-FR')} impressions</span>
                    <span className="text-emerald-600 font-bold">{format.totalClicks90d.toLocaleString('fr-FR')} clics</span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Consolidated Comparative Table */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-serif font-black text-sm text-slate-900">
                  Tableau Synthétique des KPIs d'Engagement par Format (Moyenne 90 Jours)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Swipes, agrandissements, ouvertures de recettes, ajouts liste de courses et retours vers la marque.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">Base 90 jours consolidée</span>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Format</th>
                    <th className="py-2.5 px-3">Tarif CPM</th>
                    <th className="py-2.5 px-3">Tarif CPC</th>
                    <th className="py-2.5 px-3">CTR</th>
                    <th className="py-2.5 px-3">Taux d'Interaction</th>
                    <th className="py-2.5 px-3">Temps Passé</th>
                    <th className="py-2.5 px-3">Sauvegarde</th>
                    <th className="py-2.5 px-3">Partage</th>
                    <th className="py-2.5 px-3">Retour Marque</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {data.formatsKPIs.map((f) => {
                    const cpm = currency === 'EUR' ? f.cpmEur : f.cpmUsd;
                    const cpc = currency === 'EUR' ? f.cpcEur : f.cpcUsd;
                    return (
                      <tr key={f.formatId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900">{f.formatName}</td>
                        <td className="py-3 px-3 font-mono text-slate-900">{currSymbol}{cpm.toFixed(2)}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{currSymbol}{cpc.toFixed(2)}</td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-600">{f.ctrPercent}%</td>
                        <td className="py-3 px-3 font-mono font-bold text-blue-600">{f.interactionRatePercent}%</td>
                        <td className="py-3 px-3 font-mono text-amber-600">{Math.floor(f.avgTimeSpentSeconds / 60)}m {f.avgTimeSpentSeconds % 60}s</td>
                        <td className="py-3 px-3 font-mono font-bold text-[#FF4E27]">{f.recipeSaveRatePercent}%</td>
                        <td className="py-3 px-3 font-mono text-purple-600">{f.recipeShareRatePercent}%</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{f.brandReturnRatePercent}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ================================================================ */}
      {/* SUB-TAB 5: VIDEO SPECIFIC KPIS & VCR                            */}
      {/* ================================================================ */}
      {activeSubTab === 'video' && (
        <div className="space-y-6">
          
          {/* Video Hero VCR Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white border border-purple-900/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-400/20 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                Indicateurs Vidéo & Stories Indispensables
              </span>
              <h2 className="font-serif font-black text-2xl text-white">
                Performance Vidéo & Rétention des Spectateurs
              </h2>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Mesure certifiée de la rétention seconde par seconde, du taux d'accroche (Hook Rate 3s), 
                du taux de complétion (VCR) et des conversions post-vidéo.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center shrink-0">
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                Taux de Complétion Vidéo (VCR)
              </span>
              <span className="text-3xl sm:text-4xl font-black font-mono text-white block mt-1">
                {data.videoKPIs.vcrCompletionRatePercent}%
              </span>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">
                Vidéos vues jusqu’à la fin / Vidéos démarrées
              </span>
            </div>
          </div>

          {/* 4 Quartiles Completion Funnel Visualizer */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-serif font-black text-sm text-slate-900 flex items-center gap-2">
                  <Play className="w-4 h-4 text-purple-600" />
                  Funnel de Rétention Vidéo par Quartiles (25%, 50%, 75%, 100%)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Perte minimale d'audience tout au long de la capsule publicitaire.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold">
                {data.videoKPIs.totalVideoStarts90d.toLocaleString('fr-FR')} démarrages
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              {[
                { label: 'Complétion à 25%', pct: data.videoKPIs.completionQuartiles.q25, desc: '92% continuent après l\'introduction', color: 'from-blue-500 to-indigo-600' },
                { label: 'Complétion à 50%', pct: data.videoKPIs.completionQuartiles.q50, desc: '81% dépassent la moitié de la recette', color: 'from-indigo-600 to-purple-600' },
                { label: 'Complétion à 75%', pct: data.videoKPIs.completionQuartiles.q75, desc: '74% découvrent l\'ingrédient vedette', color: 'from-purple-600 to-pink-600' },
                { label: 'Complétion à 100%', pct: data.videoKPIs.completionQuartiles.q100, desc: '68% voient la call-to-action finale', color: 'from-pink-600 to-[#FF4E27]' }
              ].map((quartile, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">{quartile.label}</span>
                  <span className="text-2xl font-black font-mono text-slate-900 block">{quartile.pct}%</span>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${quartile.color}`}
                      style={{ width: `${quartile.pct}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">{quartile.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Video Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Durée moyenne de visionnage */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Durée Moyenne</span>
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-2xl font-black font-mono text-slate-900 block">
                {data.videoKPIs.avgWatchDurationSeconds} sec
              </span>
              <span className="text-[11px] text-emerald-600 font-bold">
                82% du temps de la vidéo (base 30s)
              </span>
            </div>

            {/* 2. Taux après 3 secondes */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Hook Rate (3s)</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-2xl font-black font-mono text-[#FF4E27] block">
                {data.videoKPIs.threeSecondsViewRatePercent}%
              </span>
              <span className="text-[11px] text-slate-500">
                Spectateurs captés dès les 3 premières sec.
              </span>
            </div>

            {/* 3. Taux de clic post-vidéo */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Clic Post-Vidéo</span>
                <MousePointer className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-2xl font-black font-mono text-blue-600 block">
                {data.videoKPIs.postVideoClickRatePercent}%
              </span>
              <span className="text-[11px] text-slate-500">
                Clic sur l'End-Card CTA finale
              </span>
            </div>

            {/* 4. Taux de replay */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Taux de Replay</span>
                <RotateCcw className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-black font-mono text-emerald-600 block">
                {data.videoKPIs.replayRatePercent}%
              </span>
              <span className="text-[11px] text-slate-500">
                Relecture spontanée sans skip
              </span>
            </div>

          </div>

          {/* Operational Best Practices for Video Ads */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#FF4E27]" />
              Spécifications Techniques et Recommandations Créatives Vidéo Afrodelicious
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-700">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Format Vertical 9:16</strong>
                Résolution recommandée : 1080x1920 px (H.264 / AAC). Compatible flux stories plein écran.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Durée Idéale : 15s à 30s</strong>
                Les vidéos de 20-30 secondes obtiennent le meilleur équilibre entre VCR (68.4%) et mémorisation.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Sous-Titrage Intégré</strong>
                82% des vidéos sont regardées son désactivé en premier contact : sous-titres dynamiques inclus.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================================================================ */}
      {/* SUB-TAB 6: RATES & INTERACTIVE CAMPAIGN SIMULATOR               */}
      {/* ================================================================ */}
      {activeSubTab === 'rates' && (
        <div className="space-y-6">
          
          {/* Interactive ROI & Campaign Simulator */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#FF4E27]" />
                  Simulateur de Campagne & Estimateur d'Impact
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculez en direct les impressions, clics qualifiés et ajouts à la liste de courses selon votre budget.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Devise :</span>
                <span className="text-xs font-mono font-black text-[#FF4E27] bg-orange-50 px-2 py-0.5 rounded">
                  {currency}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* 1. Budget Slider */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Budget Prévisionnel</span>
                  <span className="font-mono text-[#FF4E27] text-sm">
                    {simBudget.toLocaleString('fr-FR')} {currSymbol}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={30000}
                  step={500}
                  value={simBudget}
                  onChange={(e) => setSimBudget(Number(e.target.value))}
                  className="w-full accent-[#FF4E27] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 000 {currSymbol}</span>
                  <span>15 000 {currSymbol}</span>
                  <span>30 000 {currSymbol}</span>
                </div>
              </div>

              {/* 2. Format Selector */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="text-xs font-bold text-slate-800 block">
                  Format Publicitaire Ciblé
                </label>
                <select
                  value={simFormat}
                  onChange={(e) => setSimFormat(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF4E27] cursor-pointer"
                >
                  <option value="sponsored_recipe">Recette Sponsorisée de Chef (Recommandé)</option>
                  <option value="shoppable_ads">Shoppable Ads (Ajout Panier 1-Clic)</option>
                  <option value="video">Vidéo In-Feed & Stories</option>
                  <option value="native">Native Display In-Feed</option>
                </select>
                <span className="text-[10px] text-slate-500 block">
                  CPM appliqué : {currSymbol}{simulationResults.effectiveCpm.toFixed(2)}
                </span>
              </div>

              {/* 3. Geographic Targeting */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="text-xs font-bold text-slate-800 block">
                  Ciblage Géographique
                </label>
                <select
                  value={simTargetGeo}
                  onChange={(e) => setSimTargetGeo(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF4E27] cursor-pointer"
                >
                  <option value="all">Global (Tous les continents)</option>
                  <option value="us">États-Unis (USA - Focus 34%)</option>
                  <option value="africa">Afrique (Côte d'Ivoire, Sénégal, Cameroun, Nigéria)</option>
                  <option value="central_america">Amérique Centrale (Panama, Costa Rica, Caraïbes)</option>
                  <option value="latin_america">Amérique Latine (Brésil / Bahia, Colombie)</option>
                  <option value="southeast_asia">Asie du Sud-Est (Singapour, Thaïlande, Malaisie)</option>
                  <option value="france">France & Europe Francophone</option>
                </select>
                <span className="text-[10px] text-slate-500 block">
                  Audience garantie 100% qualifiée
                </span>
              </div>

            </div>

            {/* Simulator Output Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Impressions Estimées
                </span>
                <span className="text-xl font-black font-mono text-white block">
                  {simulationResults.impressions.toLocaleString('fr-FR')}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">100% vues réelles</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-100 space-y-1">
                <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider block">
                  Clics Qualifiés
                </span>
                <span className="text-xl font-black font-mono text-[#FF4E27] block">
                  {simulationResults.clicks.toLocaleString('fr-FR')}
                </span>
                <span className="text-[10px] text-orange-950 font-semibold">
                  CPC moyen : {currSymbol}{simulationResults.effectiveCpc.toFixed(2)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Ajouts Liste Courses
                </span>
                <span className="text-xl font-black font-mono text-emerald-700 block">
                  {simulationResults.groceryAdds.toLocaleString('fr-FR')}
                </span>
                <span className="text-[10px] text-emerald-900 font-semibold">Intention d'achat</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
                <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">
                  Sauvegardes Recette
                </span>
                <span className="text-xl font-black font-mono text-purple-700 block">
                  {simulationResults.saves.toLocaleString('fr-FR')}
                </span>
                <span className="text-[10px] text-purple-950 font-semibold">Cuisinées sous 14j</span>
              </div>

            </div>

          </div>

          {/* 3 Turnkey Campaign Packages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-black text-base text-slate-900">
                Forfaits Clés en Main (Packages de Campagne)
              </h3>
              <span className="text-xs text-slate-500">Accompagnement éditorial et chefs certifiés inclus</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.rates.packages.map((pkg) => {
                const price = currency === 'EUR' ? pkg.priceEur : pkg.priceUsd;
                const isPopular = pkg.id === 'pack-impact-360';

                return (
                  <div
                    key={pkg.id}
                    className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-5 relative ${
                      isPopular
                        ? 'bg-gradient-to-b from-white to-orange-50/50 border-[#FF4E27] shadow-lg shadow-[#FF4E27]/10'
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FF4E27] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                        Le Plus Populaire
                      </span>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-serif font-black text-lg text-slate-900">{pkg.name}</h4>
                        <span className="text-xs text-slate-500 font-medium">{pkg.durationDays} jours de diffusion active</span>
                      </div>

                      <div className="py-2 border-y border-slate-100 flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                          {price.toLocaleString('fr-FR')} {currSymbol}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">HT forfaitaire</span>
                      </div>

                      <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                        ✓ {pkg.guaranteedImpressions.toLocaleString('fr-FR')} impressions garanties
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Formats Inclus :
                        </span>
                        {pkg.formatsIncluded.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                            <Check className="w-3.5 h-3.5 text-[#FF4E27] shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1 pt-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Points Clés :
                        </span>
                        {pkg.keyHighlights.map((h, i) => (
                          <div key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                            <span className="text-slate-400">·</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <p className="text-[10px] text-slate-500 italic">
                        Recommandé pour : {pkg.recommendedFor}
                      </p>
                      <button
                        type="button"
                        onClick={() => alert(`Réservation du ${pkg.name} enregistrée pour devis média.`)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isPopular
                            ? 'bg-[#FF4E27] hover:bg-[#E03814] text-white shadow-md shadow-[#FF4E27]/25'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        Sélectionner ce Forfait
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL: CREATE NEW CAMPAIGN (MULTI-CAMPAIGN MANAGER)              */}
      {/* ================================================================ */}
      {isCreateCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-5 h-5 text-[#FF4E27]" />
                <h3 className="font-serif font-black text-base text-white">
                  Créer & Programmer une Campagne Média
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsCreateCampaignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Nom de la Campagne *
                </label>
                <input
                  type="text"
                  required
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="Ex: Campagne Piment Habanero & Miel Créole - Q4 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Marque Annonceur *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Ex: Terroirs d'Origine"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Catégorie FNB
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none"
                  >
                    <option value="Condiments & Épices">Condiments & Épices</option>
                    <option value="Sauces Pimentées">Sauces Pimentées</option>
                    <option value="Féculents & Semoules">Féculents & Semoules</option>
                    <option value="Huiles & Farines Bio">Huiles & Farines Bio</option>
                    <option value="Boissons & Nectars">Boissons & Nectars</option>
                    <option value="Traiteur & Épicerie">Traiteur & Épicerie</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Budget Campagne (€ HT)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={250}
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Ciblage Géographique
                  </label>
                  <select
                    value={newTargetGeo}
                    onChange={(e) => setNewTargetGeo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none"
                  >
                    <option value="USA & France">États-Unis & France (Recommandé)</option>
                    <option value="États-Unis (USA 34%)">États-Unis (New York, Atlanta, Houston, Chicago)</option>
                    <option value="Afrique (Afrique de l'Ouest, Centrale, Est & Australe)">Afrique (Abidjan, Dakar, Douala, Lagos, Nairobi)</option>
                    <option value="Amérique Centrale (Panama, Costa Rica & Caraïbes)">Amérique Centrale (Panama, Costa Rica, Caraïbes)</option>
                    <option value="Amérique Latine (Brésil / Bahia, Colombie)">Amérique Latine (Brésil / Salvador da Bahia, Colombie)</option>
                    <option value="Asie du Sud-Est (Singapour, Thaïlande, Malaisie)">Asie du Sud-Est (Singapour, Thaïlande, Malaisie)</option>
                    <option value="France & Europe">France & Europe</option>
                    <option value="Canada (Montréal, Toronto)">Canada (Montréal, Toronto)</option>
                    <option value="Global">Global (Multi-continents)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Retailers Marchands Partenaires (Redirections Sortantes)
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['Amazon Fresh', 'Walmart', 'Instacart', 'Target', 'Kroger', 'Épiceries Afro locales'].map((ret) => {
                    const isChecked = newRetailers.includes(ret);
                    return (
                      <button
                        key={ret}
                        type="button"
                        onClick={() => {
                          setNewRetailers(prev => 
                            isChecked ? prev.filter(r => r !== ret) : [...prev, ret]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isChecked ? '✓ ' : '+ '}{ret}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateCampaignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-black shadow-md shadow-[#FF4E27]/30 transition-all cursor-pointer"
                >
                  Lancer la Campagne
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

function FileDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
