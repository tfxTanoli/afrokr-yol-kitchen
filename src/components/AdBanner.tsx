import React, { useState } from 'react';
import { Sparkles, X, ExternalLink, Info, Smartphone, Monitor } from 'lucide-react';

export type AdNetwork = 'adsense' | 'admob' | 'afro_sponsor';

interface AdBannerProps {
  format?: 'leaderboard' | 'rectangle' | 'banner' | 'feed_native';
  network?: AdNetwork;
  slotId?: string;
  className?: string;
  isPlusMember?: boolean;
}

const AFRO_SPONSORS = [
  {
    title: 'Épicerie Terroirs d’Afrique & Caraïbes',
    description: 'Commandez vos épices rares, farine de manioc et huile de palme rouge bio en ligne. Livraison express 24h !',
    cta: 'Profiter de -15%',
    tag: 'Sponsorisé · Terroirs d’Afrique',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    link: '#'
  },
  {
    title: 'Pilon & Mortier Artisanal en Bois Noble',
    description: 'L’ustensile indispensable pour piler vos bananes plantains, fufu et marinades secrètes comme au village.',
    cta: 'Découvrir la collection',
    tag: 'Sponsorisé · Artisanat Culinaire',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    link: '#'
  },
  {
    title: 'Sauces Pimentées Créoles « Scotch & Honey »',
    description: 'L’équilibre parfait entre la puissance du piment habanero et la douceur du miel sauvage. Élu saveur de l’année.',
    cta: 'Goûter le feu doux',
    tag: 'Sponsorisé · Épices & Sauces',
    image: 'https://images.unsplash.com/photo-1588276552401-30058a0fe57b?auto=format&fit=crop&w=600&q=80',
    link: '#'
  }
];

export const AdBanner: React.FC<AdBannerProps> = ({
  format = 'feed_native',
  network: defaultNetwork = 'adsense',
  slotId = 'ca-pub-afrodelicious-99412',
  className = '',
  isPlusMember = false
}) => {
  const [network, setNetwork] = useState<AdNetwork>(defaultNetwork);
  const [isDismissed, setIsDismissed] = useState(false);
  const [sponsorIndex] = useState(() => Math.floor(Math.random() * AFRO_SPONSORS.length));

  if (isPlusMember || isDismissed) return null;

  const sponsor = AFRO_SPONSORS[sponsorIndex];

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all shadow-xs ${className}`}>
      {/* Network Switcher Toolbar (AdSense vs AdMob vs Sponsor) */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider font-bold text-slate-400">Annonce</span>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setNetwork('adsense')}
              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition-colors flex items-center gap-1 ${
                network === 'adsense' ? 'bg-[#FF4E27] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Format Google AdSense (Web Responsive)"
            >
              <Monitor className="w-2.5 h-2.5" />
              <span>AdSense</span>
            </button>
            <button
              type="button"
              onClick={() => setNetwork('admob')}
              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition-colors flex items-center gap-1 ${
                network === 'admob' ? 'bg-[#0F3E2E] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Format Google AdMob (Mobile In-App)"
            >
              <Smartphone className="w-2.5 h-2.5" />
              <span>AdMob</span>
            </button>
            <button
              type="button"
              onClick={() => setNetwork('afro_sponsor')}
              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition-colors flex items-center gap-1 ${
                network === 'afro_sponsor' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Sponsor Gastronomique Partenaire"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Sponsor Afro</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-slate-400">ID: {slotId}</span>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            title="Masquer l'annonce"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Network Content Display */}
      {network === 'adsense' && (
        <div className="p-4 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              AdSense
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded">
                  Google AdSense Display
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Format Responsive 728x90</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                {sponsor.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {sponsor.description}
              </p>
            </div>
          </div>

          <a
            href="#ad"
            onClick={(e) => e.preventDefault()}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>{sponsor.cta}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {network === 'admob' && (
        <div className="p-3 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0F3E2E] text-[#F59E0B] font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
              AdMob
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-900/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  Google AdMob Smart Banner
                </span>
                <span className="text-[9px] text-slate-400">Mobile Banner 320x50</span>
              </div>
              <p className="text-xs font-semibold text-white truncate max-w-sm mt-0.5">
                {sponsor.title} — {sponsor.description}
              </p>
            </div>
          </div>

          <a
            href="#ad"
            onClick={(e) => e.preventDefault()}
            className="shrink-0 px-3 py-1 rounded-lg bg-[#FF4E27] hover:bg-[#FF4E27]/90 text-white text-xs font-bold transition-all shadow-xs"
          >
            Installer
          </a>
        </div>
      )}

      {network === 'afro_sponsor' && (
        <div className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-orange-50/60 via-amber-50/30 to-white">
          <img
            src={sponsor.image}
            alt={sponsor.title}
            className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs border border-orange-200"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-[#FF4E27] uppercase tracking-wider">
              {sponsor.tag}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
              {sponsor.title}
            </h4>
            <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
              {sponsor.description}
            </p>
          </div>
          <a
            href="#sponsor"
            onClick={(e) => e.preventDefault()}
            className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF4E27] to-amber-500 text-white text-xs font-bold transition-all shadow-sm hover:scale-[1.02]"
          >
            {sponsor.cta}
          </a>
        </div>
      )}
    </div>
  );
};
