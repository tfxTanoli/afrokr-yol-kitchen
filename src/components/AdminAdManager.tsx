import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Video, 
  Tag, 
  ShoppingBag, 
  Layers, 
  CheckCircle2, 
  X, 
  Eye, 
  MousePointerClick, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  BarChart2, 
  Image as ImageIcon,
  Play,
  Copy,
  Check,
  Search,
  Volume2
} from 'lucide-react';
import { 
  AdminAdCampaign, 
  AdFormat, 
  AdMediaType, 
  AppFeatureTarget, 
  getStoredAdCampaigns, 
  saveAdCampaigns, 
  ShoppableProduct, 
  CollectionItem 
} from '../data/adManagerStore';

interface AdminAdManagerProps {
  onNotify?: (message: string) => void;
}

const ALL_FEATURES_LIST: { id: AppFeatureTarget; label: string }[] = [
  { id: 'all', label: 'Toutes les fonctionnalités' },
  { id: 'feed', label: 'Feed Principal (Accueil)' },
  { id: 'explore', label: 'Explorer & Terroirs' },
  { id: 'masterclasses', label: 'Online Cooking Classes' },
  { id: 'experiences', label: 'Expériences Culinaires' },
  { id: 'delivery', label: 'Delivery Food' },
  { id: 'planner', label: 'Meal Planner' },
  { id: 'communities', label: 'Cercles & Communautés' },
  { id: 'grocery', label: 'Liste de Courses' }
];

const AD_FORMATS_LIST: { id: AdFormat; label: string; icon: string; desc: string }[] = [
  { id: 'native', label: 'Native Feed', icon: '📰', desc: 'Encart naturel in-feed parfaitement intégré' },
  { id: 'video', label: 'Vidéo Sponsorisée', icon: '🎬', desc: 'Capsule vidéo engageante (max 30s) avec CTA' },
  { id: 'sponsored_recipe', label: 'Recette Sponsorisée', icon: '👨‍🍳', desc: 'Plat signature mis en avant avec badge marque' },
  { id: 'collection', label: 'Collection Partenaire', icon: '🍱', desc: 'Carrousel de produits et ingrédients du terroir' },
  { id: 'coupon', label: 'Coupon & Bon d’achat', icon: '🎟️', desc: 'Code promo avec bouton copier en 1 clic' },
  { id: 'shoppable_ads', label: 'Shoppable Ads', icon: '🛒', desc: 'Achat direct Amazon, Walmart, Instacart' }
];

export const AdminAdManager: React.FC<AdminAdManagerProps> = ({ onNotify }) => {
  const [campaigns, setCampaigns] = useState<AdminAdCampaign[]>(() => getStoredAdCampaigns());
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>('all');
  const [selectedFeatureFilter, setSelectedFeatureFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [brandName, setBrandName] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [format, setFormat] = useState<AdFormat>('native');
  const [mediaType, setMediaType] = useState<AdMediaType>('image');
  const [targetFeatures, setTargetFeatures] = useState<AppFeatureTarget[]>(['all']);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ctaText, setCtaText] = useState('En savoir plus');
  const [ctaLink, setCtaLink] = useState('https://afrodelicious.app');
  const [badgeLabel, setBadgeLabel] = useState('Sponsorisé');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80');
  const [videoUrl, setVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-vegetables-in-a-pan-43093-large.mp4');
  const [videoDurationSeconds, setVideoDurationSeconds] = useState(28);
  const [couponCode, setCouponCode] = useState('AFRO2026');
  const [discountPercentage, setDiscountPercentage] = useState('-25% Exclusif');
  
  // Shoppable state
  const [shoppableProducts, setShoppableProducts] = useState<ShoppableProduct[]>([
    { name: 'Huile de Palme Rouge Bio', price: '4.90 €', retailer: 'Amazon', link: 'https://amazon.com' },
    { name: 'Attiéké Frais de Côte d’Ivoire', price: '2.50 €', retailer: 'Instacart', link: 'https://instacart.com' }
  ]);

  const handleToggleStatus = (id: string) => {
    const updated = campaigns.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'active' ? 'paused' : 'active';
        return { ...c, status: nextStatus as 'active' | 'paused' };
      }
      return c;
    });
    setCampaigns(updated);
    saveAdCampaigns(updated);
    onNotify?.('Statut de la campagne publicitaire mis à jour avec succès.');
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce publicitaire ?')) {
      const updated = campaigns.filter(c => c.id !== id);
      setCampaigns(updated);
      saveAdCampaigns(updated);
      onNotify?.('Annonce publicitaire supprimée.');
    }
  };

  const handleToggleFeature = (feat: AppFeatureTarget) => {
    if (feat === 'all') {
      setTargetFeatures(['all']);
      return;
    }
    let updated: AppFeatureTarget[] = targetFeatures.filter(f => f !== 'all');
    if (updated.includes(feat)) {
      updated = updated.filter(f => f !== feat);
      if (updated.length === 0) updated = ['all'];
    } else {
      updated.push(feat);
    }
    setTargetFeatures(updated);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !brandName.trim()) return;

    const newAd: AdminAdCampaign = {
      id: `ad-${Date.now()}`,
      brandName: brandName.trim(),
      campaignName: campaignName.trim() || `${brandName} - ${format}`,
      format,
      mediaType,
      targetFeatures,
      title: title.trim(),
      description: description.trim(),
      ctaText: ctaText.trim() || 'En savoir plus',
      ctaLink: ctaLink.trim() || '#',
      badgeLabel: badgeLabel.trim() || 'Sponsorisé',
      imageUrl: mediaType === 'image' || format === 'native' || format === 'shoppable_ads' ? imageUrl : undefined,
      videoUrl: mediaType === 'video' || format === 'video' ? videoUrl : undefined,
      videoDurationSeconds: format === 'video' ? videoDurationSeconds : undefined,
      couponCode: format === 'coupon' ? couponCode : undefined,
      discountPercentage: format === 'coupon' ? discountPercentage : undefined,
      shoppableProducts: format === 'shoppable_ads' ? shoppableProducts : undefined,
      status: 'active',
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newAd, ...campaigns];
    setCampaigns(updated);
    saveAdCampaigns(updated);
    setIsCreateModalOpen(false);
    onNotify?.(`Campagne "${newAd.title}" créée et déployée avec succès sur ${targetFeatures.join(', ')} !`);
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (selectedFormatFilter !== 'all' && c.format !== selectedFormatFilter) return false;
    if (selectedFeatureFilter !== 'all' && !c.targetFeatures.includes('all') && !c.targetFeatures.includes(selectedFeatureFilter as any)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Creation Action */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gestionnaire Médias & Campagnes Publicitaires</span>
          </div>
          <h2 className="font-serif font-black text-xl sm:text-2xl text-white">
            Publicités Multi-Formats sur Toutes les Fonctionnalités
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Pilotez et diffusez des annonces natives, vidéos (max 30s), recettes sponsorisées, collections partenaires, coupons de réduction et shoppable ads à travers toute la plateforme.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-black shadow-lg shadow-[#FF4E27]/30 transition-all flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Créer une Publicité</span>
        </button>
      </div>

      {/* KPI Overview Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Campagnes Actives</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {campaigns.filter(c => c.status === 'active').length} <span className="text-xs font-normal text-emerald-600">en ligne</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Impressions Totales</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {campaigns.reduce((acc, c) => acc + c.impressions, 0).toLocaleString('fr-FR')}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clics & Redirections</span>
          <div className="text-xl font-black text-[#FF4E27] mt-1">
            {campaigns.reduce((acc, c) => acc + c.clicks, 0).toLocaleString('fr-FR')}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Formats Déployés</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            6 <span className="text-xs font-normal text-slate-400">formats natifs</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Format Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Format :</span>
          <button
            onClick={() => setSelectedFormatFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedFormatFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tous les formats ({campaigns.length})
          </button>
          {AD_FORMATS_LIST.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFormatFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedFormatFilter === f.id ? 'bg-[#FF4E27] text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Feature Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Emplacement :</span>
          <select
            value={selectedFeatureFilter}
            onChange={(e) => setSelectedFeatureFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-[#FF4E27]"
          >
            {ALL_FEATURES_LIST.map(feat => (
              <option key={feat.id} value={feat.id}>{feat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCampaigns.map(c => (
          <div key={c.id} className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-orange-100 text-[#FF4E27] text-[10px] font-black uppercase tracking-wider">
                    {c.format}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {c.brandName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(c.id)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer transition-colors ${
                      c.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.status === 'active' ? '● En Ligne' : '○ En Pause'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCampaign(c.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Supprimer la campagne"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-serif font-black text-base text-slate-900 leading-snug">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              </div>

              {/* Target Features Badges */}
              <div className="flex flex-wrap gap-1">
                {c.targetFeatures.map((f, fIdx) => (
                  <span key={fIdx} className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    📍 {f}
                  </span>
                ))}
              </div>

              {/* Media Thumbnail Preview */}
              {c.imageUrl && (
                <div className="relative h-32 rounded-xl overflow-hidden border border-slate-100">
                  <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold">
                    Média: Image
                  </span>
                </div>
              )}

              {c.videoUrl && (
                <div className="relative h-36 rounded-xl overflow-hidden bg-black">
                  <video src={c.videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-bold flex items-center gap-1">
                    <Video className="w-3 h-3 text-orange-400" />
                    Vidéo ({c.videoDurationSeconds || 30}s max)
                  </span>
                </div>
              )}

              {c.couponCode && (
                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-mono font-bold text-orange-900 flex items-center justify-between">
                  <span>Code : {c.couponCode}</span>
                  <span className="text-emerald-700">{c.discountPercentage}</span>
                </div>
              )}
            </div>

            {/* Performance Stats Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.impressions.toLocaleString()} vues</span>
                </span>
                <span className="flex items-center gap-1">
                  <MousePointerClick className="w-3.5 h-3.5 text-[#FF4E27]" />
                  <span>{c.clicks.toLocaleString()} clics</span>
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                CTR : {c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* CREATION MODAL FOR MULTI-FORMAT CAMPAIGNS                                 */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-100 text-[#FF4E27]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-slate-900">
                    Créer une Publicité Multi-Formats
                  </h3>
                  <p className="text-xs text-slate-500">
                    Déployez instantanément sur les fonctionnalités de l'application
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateCampaign} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Brand & Campaign Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nom de la Marque ou du Sponsor *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Ex: Épices de Penja, Carrefour Afro, Wave..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Badge de l'Annonce
                  </label>
                  <input
                    type="text"
                    value={badgeLabel}
                    onChange={(e) => setBadgeLabel(e.target.value)}
                    placeholder="Ex: Sponsorisé, Partenaire Exclusif..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Format Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Format Publicitaire *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AD_FORMATS_LIST.map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormat(f.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        format === f.id
                          ? 'border-[#FF4E27] bg-orange-50/70 text-[#FF4E27] shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <span>{f.icon}</span>
                        <span>{f.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {f.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Type de Média Créatif
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      checked={mediaType === 'image'}
                      onChange={() => setMediaType('image')}
                    />
                    <span>Images (Visuel HD)</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      checked={mediaType === 'video'}
                      onChange={() => setMediaType('video')}
                    />
                    <span>Vidéos (Max 30s)</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      checked={mediaType === 'text'}
                      onChange={() => setMediaType('text')}
                    />
                    <span>Textes / Coupons</span>
                  </label>
                </div>
              </div>

              {/* Target Features Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Fonctionnalités ciblées dans l'application *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_FEATURES_LIST.map(feat => {
                    const isSelected = targetFeatures.includes(feat.id);
                    return (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => handleToggleFeature(feat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {feat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Titre de la Publicité *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Découvrez le Poivre Blanc de Penja IGP"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Description ou Message Publicitaire
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Détails de l'offre ou de la marque..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none font-normal"
                  />
                </div>
              </div>

              {/* Format-Specific Custom Fields */}
              {mediaType === 'image' && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    URL de l'Image HD
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none font-mono"
                  />
                </div>
              )}

              {mediaType === 'video' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      URL de la Vidéo (MP4)
                    </label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Durée (Max 30s)
                    </label>
                    <input
                      type="number"
                      max={30}
                      min={1}
                      value={videoDurationSeconds}
                      onChange={(e) => setVideoDurationSeconds(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none font-bold"
                    />
                  </div>
                </div>
              )}

              {format === 'coupon' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Code Promo
                    </label>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Ex: AFRO2026"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Mention Réduction
                    </label>
                    <input
                      type="text"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(e.target.value)}
                      placeholder="Ex: -30% sur votre panier"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Call to Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Texte du Bouton CTA
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Ex: Commander, Découvrir..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Lien de Redirection (URL)
                  </label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-black shadow-md cursor-pointer"
                >
                  Activer & Publier la Publicité
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
