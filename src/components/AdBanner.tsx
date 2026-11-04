import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ExternalLink, 
  Info, 
  Smartphone, 
  Monitor, 
  Tag, 
  ShoppingBag, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Layers, 
  Flame, 
  Award,
  Video
} from 'lucide-react';
import { 
  AdminAdCampaign, 
  AppFeatureTarget, 
  AdFormat, 
  getAdsForFeature 
} from '../data/adManagerStore';

export type AdNetwork = 'adsense' | 'admob' | 'afro_sponsor' | 'admin_campaign';

interface AdBannerProps {
  format?: 'leaderboard' | 'rectangle' | 'banner' | 'feed_native';
  network?: AdNetwork;
  feature?: AppFeatureTarget;
  customCampaign?: AdminAdCampaign;
  slotId?: string;
  className?: string;
  isPlusMember?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format = 'feed_native',
  network: defaultNetwork = 'admin_campaign',
  feature = 'feed',
  customCampaign,
  slotId = 'ca-pub-afrodelicious-99412',
  className = '',
  isPlusMember = false
}) => {
  const [network, setNetwork] = useState<AdNetwork>(defaultNetwork);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Pick matching active campaign from store or customCampaign
  const activeCampaigns = getAdsForFeature(feature);
  const campaign: AdminAdCampaign = customCampaign || (activeCampaigns.length > 0 ? activeCampaigns[0] : null) as any;

  if (isPlusMember || isDismissed) return null;

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white transition-all shadow-sm ${className}`}>
      
      {/* Network Switcher Toolbar (AdSense vs AdMob vs Sponsor vs Admin Campagnes) */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider font-bold text-slate-400">Annonce Sponsorisée</span>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setNetwork('admin_campaign')}
              className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-colors flex items-center gap-1 ${
                network === 'admin_campaign' ? 'bg-[#FF4E27] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Campagne Personnalisée Admin Multi-Formats"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Admin Multi-Formats</span>
            </button>
            <button
              type="button"
              onClick={() => setNetwork('adsense')}
              className={`px-1.5 py-0.5 rounded-md text-[9px] font-semibold transition-colors flex items-center gap-1 ${
                network === 'adsense' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Format Google AdSense (Web Responsive)"
            >
              <Monitor className="w-2.5 h-2.5" />
              <span>AdSense</span>
            </button>
            <button
              type="button"
              onClick={() => setNetwork('admob')}
              className={`px-1.5 py-0.5 rounded-md text-[9px] font-semibold transition-colors flex items-center gap-1 ${
                network === 'admob' ? 'bg-[#0F3E2E] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Format Google AdMob (Mobile In-App)"
            >
              <Smartphone className="w-2.5 h-2.5" />
              <span>AdMob</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {campaign && (
            <span className="hidden sm:inline font-mono text-[9px] text-orange-600 font-bold uppercase bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
              Format: {campaign.format}
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            title="Masquer l'annonce"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ADMIN MULTI-FORMAT CAMPAIGN RENDERING                                  */}
      {/* ========================================================================= */}
      {network === 'admin_campaign' && campaign && (
        <div className="p-4 sm:p-5">
          
          {/* FORMAT 1: NATIVE IN-FEED CARD */}
          {campaign.format === 'native' && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {campaign.imageUrl && (
                <div className="relative w-full sm:w-48 h-36 rounded-2xl overflow-hidden shrink-0 shadow-xs">
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                    {campaign.brandName}
                  </div>
                </div>
              )}
              <div className="flex-1 space-y-2 text-left w-full">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF4E27] text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>{campaign.badgeLabel || 'Sponsorisé'}</span>
                </div>
                <h4 className="font-serif font-black text-base sm:text-lg text-slate-900 leading-snug">
                  {campaign.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {campaign.description}
                </p>
                <div className="pt-1">
                  <a
                    href={campaign.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    <span>{campaign.ctaText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* FORMAT 2: VIDÉO CAMPAIGN */}
          {campaign.format === 'video' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-orange-100 text-[#FF4E27]">
                    <Video className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27] block">
                      {campaign.badgeLabel || 'Vidéo Sponsorisée'} · {campaign.brandName}
                    </span>
                    <h4 className="font-serif font-black text-sm sm:text-base text-slate-900">
                      {campaign.title}
                    </h4>
                  </div>
                </div>
                {campaign.videoDurationSeconds && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                    ⏱️ {campaign.videoDurationSeconds}s max
                  </span>
                )}
              </div>

              {/* Video Player */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-72 w-full shadow-inner group">
                <video
                  src={campaign.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-vegetables-in-a-pan-43093-large.mp4'}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Video Controls Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer"
                      title={isMuted ? 'Activer le son' : 'Couper le son'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                    <span className="text-[11px] text-white/90 font-medium drop-shadow-xs">
                      {campaign.description}
                    </span>
                  </div>

                  <a
                    href={campaign.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span>{campaign.ctaText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* FORMAT 3: RECETTE SPONSORISÉE */}
          {campaign.format === 'sponsored_recipe' && (
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-orange-50/40 p-3 sm:p-4 rounded-2xl border border-orange-200/70">
              {campaign.imageUrl && (
                <div className="relative w-full sm:w-44 h-32 rounded-xl overflow-hidden shrink-0 shadow-xs">
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-bold">
                    👨‍🍳 Recette Partenaire
                  </span>
                </div>
              )}
              <div className="flex-1 space-y-1.5 text-left w-full">
                <span className="text-[10px] font-bold text-[#FF4E27] uppercase tracking-wider block">
                  {campaign.badgeLabel || 'Recette Sponsorisée'}
                </span>
                <h4 className="font-serif font-black text-base text-slate-900">
                  {campaign.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {campaign.description}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <a
                    href={campaign.ctaLink}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1"
                  >
                    <span>{campaign.ctaText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* FORMAT 4: COLLECTION SPONSORISÉE */}
          {campaign.format === 'collection' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27] block">
                    {campaign.badgeLabel || 'Collection Partenaire'} · {campaign.brandName}
                  </span>
                  <h4 className="font-serif font-black text-base text-slate-900">
                    {campaign.title}
                  </h4>
                </div>
                <a
                  href={campaign.ctaLink}
                  className="text-xs font-bold text-[#FF4E27] hover:underline flex items-center gap-1"
                >
                  <span>{campaign.ctaText}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {campaign.collectionItems && campaign.collectionItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {campaign.collectionItems.map((item, idx) => (
                    <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs hover:shadow-md transition-all">
                      <div className="h-28 w-full overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-2.5">
                        <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider block">
                          {item.tag}
                        </span>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FORMAT 5: COUPON & BON DE RÉDUCTION */}
          {campaign.format === 'coupon' && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-[#FF4E27] p-4 text-white shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider">
                    <Tag className="w-3 h-3" />
                    <span>{campaign.discountPercentage || 'Offre Spéciale'}</span>
                  </div>
                  <h4 className="font-serif font-black text-base sm:text-lg text-white">
                    {campaign.title}
                  </h4>
                  <p className="text-xs text-amber-100 max-w-lg">
                    {campaign.description}
                  </p>
                </div>

                {campaign.couponCode && (
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl shadow-lg border-2 border-dashed border-orange-300">
                      <span className="font-mono font-black text-slate-900 px-3 text-sm tracking-wider">
                        {campaign.couponCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCoupon(campaign.couponCode!)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          copiedCoupon
                            ? 'bg-emerald-500 text-white'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                      >
                        {copiedCoupon ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCoupon ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-amber-100 font-medium">
                      Valable sur votre prochain panier
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FORMAT 6: SHOPPABLE ADS */}
          {campaign.format === 'shoppable_ads' && (
            <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                    <ShoppingBag className="w-3 h-3" />
                    <span>{campaign.badgeLabel || 'Shoppable Ad'} · {campaign.brandName}</span>
                  </div>
                  <h4 className="font-serif font-black text-sm sm:text-base text-slate-900 mt-1">
                    {campaign.title}
                  </h4>
                </div>
                <a
                  href={campaign.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                >
                  <span>{campaign.ctaText}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {campaign.shoppableProducts && campaign.shoppableProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {campaign.shoppableProducts.map((prod, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Partenaire: {prod.retailer}
                        </span>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {prod.name}
                        </div>
                        <div className="text-xs font-black text-emerald-600 mt-0.5">
                          {prod.price}
                        </div>
                      </div>
                      <a
                        href={prod.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors shrink-0"
                        title={`Acheter sur ${prod.retailer}`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FALLBACK ADSENSE / ADMOB DISPLAY                                       */}
      {/* ========================================================================= */}
      {network === 'adsense' && (
        <div className="p-4 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              AdSense
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Épicerie Bio d'Afrique & Caraïbes</span>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">Annonce</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                Ingrédients frais, manioc, piments doux et épices importées directement des producteurs.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            Commander en ligne
          </button>
        </div>
      )}

      {network === 'admob' && (
        <div className="p-4 bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0F3E2E] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              AdMob
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">App Mobile Afrodelicious Food</span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">Mobile App</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                Installez l'application mobile pour commander vos plats préférés avec géolocalisation live.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-[#0F3E2E] hover:bg-[#09261c] text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            Télécharger l'App
          </button>
        </div>
      )}

      {network === 'afro_sponsor' && (
        <div className="p-4 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              Sponsor
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Pilon & Mortier Artisanal en Bois Noble</span>
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">Artisanat</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                L’ustensile indispensable pour piler vos bananes plantains, fufu et marinades secrètes.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            Découvrir la collection
          </button>
        </div>
      )}

    </div>
  );
};
