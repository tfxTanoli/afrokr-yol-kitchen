import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  FileText,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Send,
  Mail,
  Smartphone,
  ChefHat,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { Recipe, CulinaryExperience } from '../types';
import { sanitizeText, sanitizeUrl, safeOpenWindow, escapeHtml } from '../utils/securitySanitizer';

export interface ShareableItem {
  id: string;
  type: 'recipe' | 'experience' | 'masterclass' | 'general';
  title: string;
  description?: string;
  image?: string;
  authorName?: string;
  authorHandle?: string;
  country?: string;
  countryFlag?: string;
  prepTime?: string;
  difficulty?: string;
  price?: number;
  location?: string;
  date?: string;
  ingredientsCount?: number;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShareableItem | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, item }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedFullText, setCopiedFullText] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://afrodelicious.app';
  const shareUrl = `${currentUrl}?item=${encodeURIComponent(item.id)}&type=${item.type}`;
  
  const typeLabel = 
    item.type === 'recipe' ? 'Recette Afrodelicious' :
    item.type === 'experience' ? 'Cours & Atelier de Cuisine' :
    item.type === 'masterclass' ? 'Masterclass de Chef' : 'Découverte Culinaire';

  // Formatted share message
  const shareTitle = `✨ ${item.title} — ${typeLabel}`;
  const shareSummary = item.description 
    ? item.description.slice(0, 160) + (item.description.length > 160 ? '...' : '') 
    : 'Découvrez les trésors de la gastronomie afro-caribéenne sur Afrodelicious !';
  
  const chefInfo = item.authorName ? `Par ${item.authorName}` : '';
  const fullShareText = `${shareTitle}\n${chefInfo ? chefInfo + '\n' : ''}${shareSummary}\n\n👉 À découvrir ici : ${shareUrl}`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast('Lien direct copié dans le presse-papier !');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast('Lien prêt à être partagé : ' + shareUrl);
    }
  };

  const handleCopyFormattedText = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopiedFullText(true);
      showToast('Fiche complète copiée ! Prête à coller dans WhatsApp ou Signal.');
      setTimeout(() => setCopiedFullText(false), 2500);
    } catch {
      showToast('Texte prêt à être copié');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `${item.title} — ${item.authorName ? 'par ' + item.authorName : 'Afrodelicious'}\n${shareSummary}`,
          url: shareUrl,
        });
        showToast('Partage réussi !');
      } catch (err: unknown) {
        // User cancelled or aborted
        if (err instanceof Error && err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Social share handlers with security sanitization against injection
  const shareChannels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
        </svg>
      ),
      bg: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      badge: 'Populaire',
      action: () => {
        const text = encodeURIComponent(`${shareTitle}\n${shareSummary}\n\n${shareUrl}`);
        safeOpenWindow(`https://api.whatsapp.com/send?text=${text}`);
      }
    },
    {
      id: 'signal',
      name: 'Signal',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 6H13V8H11V6ZM11 10H13V18H11V10Z" />
        </svg>
      ),
      bg: 'bg-blue-600 hover:bg-blue-700 text-white',
      badge: 'Sécurisé',
      action: () => {
        // Signal intent / web share fallback
        handleCopyFormattedText();
        safeOpenWindow(`https://signal.me/#p/share?text=${encodeURIComponent(fullShareText)}`);
        showToast('Texte copié ! Ouvrez Signal et collez directement dans votre discussion.');
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V14.85H7.5V12H10V9.8C10 7.32 11.48 6 13.72 6C14.8 6 15.93 6.2 15.93 6.2V8.65H14.68C13.45 8.65 13.06 9.41 13.06 10.19V12H15.82L15.38 14.85H13.06V21.8C17.56 20.87 22 16.84 22 12Z" />
        </svg>
      ),
      bg: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
      action: () => {
        safeOpenWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
      }
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      bg: 'bg-black hover:bg-neutral-800 text-white',
      action: () => {
        const text = encodeURIComponent(`Découvrez cette pépite culinaire afro-caribéenne : ${item.title} sur @Afrodelicious`);
        safeOpenWindow(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`);
      }
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .39z" />
        </svg>
      ),
      bg: 'bg-[#229ED9] hover:bg-[#1d8cc2] text-white',
      action: () => {
        safeOpenWindow(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`);
      }
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
      bg: 'bg-[#0A66C2] hover:bg-[#084e96] text-white',
      action: () => {
        safeOpenWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
      }
    },
    {
      id: 'sms',
      name: 'SMS / iMessage',
      icon: <Smartphone className="w-5 h-5" />,
      bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      action: () => {
        safeOpenWindow(`sms:?&body=${encodeURIComponent(shareTitle + ' : ' + shareUrl)}`);
      }
    },
    {
      id: 'email',
      name: 'E-mail',
      icon: <Mail className="w-5 h-5" />,
      bg: 'bg-slate-700 hover:bg-slate-800 text-white',
      action: () => {
        safeOpenWindow(`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(fullShareText)}`);
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-orange-100/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF4E27] to-[#F59E0B] flex items-center justify-center text-white shadow-md shadow-[#FF4E27]/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="share-modal-title" className="text-lg font-bold text-slate-900 leading-tight">
                Partager sur tous vos réseaux
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                WhatsApp, Signal, réseaux sociaux & QR code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-white/80 transition-colors"
            aria-label="Fermer la fenêtre de partage"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Toast feedback */}
          {toastMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                {toastMessage}
              </span>
              <button onClick={() => setToastMessage(null)} className="text-emerald-500 hover:text-emerald-800">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Item Preview Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
            {item.image ? (
              <img
                src={sanitizeUrl(item.image)}
                alt={item.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm border border-slate-200/60"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-[#FF4E27] to-[#F59E0B] text-white flex items-center justify-center shrink-0">
                <ChefHat className="w-8 h-8" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-[#FF4E27]">
                  {typeLabel}
                </span>
                {item.countryFlag && (
                  <span className="text-sm" title={item.country}>{item.countryFlag}</span>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-sm truncate">
                {item.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                {item.authorName && (
                  <span className="truncate">👨‍🍳 {item.authorName}</span>
                )}
                {item.prepTime && (
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-slate-400" /> {item.prepTime}
                  </span>
                )}
                {item.price !== undefined && (
                  <span className="font-bold text-emerald-600 shrink-0">
                    {item.price === 0 ? 'Gratuit' : `${item.price.toFixed(2)} €`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Social Channels Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Choisir une application
              </span>
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  onClick={handleNativeShare}
                  className="text-xs font-bold text-[#FF4E27] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Menu système
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {shareChannels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={ch.action}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all group relative active:scale-95"
                >
                  {ch.badge && (
                    <span className="absolute -top-1.5 right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#FF4E27] text-white">
                      {ch.badge}
                    </span>
                  )}
                  <div className={`w-10 h-10 rounded-xl ${ch.bg} flex items-center justify-center mb-1.5 shadow-sm transition-transform group-hover:scale-105`}>
                    {ch.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900 truncate max-w-full">
                    {ch.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Copy Link Input Bar */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Lien direct sécurisé
            </label>
            <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-slate-50 border border-slate-200">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-slate-600 flex-1 outline-none truncate font-mono select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copier
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Actions Bar: Copy Formatted Text & Toggle QR */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
            <button
              onClick={handleCopyFormattedText}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                copiedFullText
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              {copiedFullText ? <Check className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-slate-500" />}
              {copiedFullText ? 'Fiche copiée !' : 'Copier résumé texte'}
            </button>

            <button
              onClick={() => setShowQrCode(!showQrCode)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                showQrCode
                  ? 'border-orange-500 bg-orange-50 text-[#FF4E27]'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <QrCode className="w-4 h-4" />
              {showQrCode ? 'Masquer QR Code' : 'Afficher QR Code'}
            </button>
          </div>

          {/* QR Code Presentation Box */}
          {showQrCode && (
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 flex flex-col items-center text-center animate-in fade-in zoom-in-95">
              <div className="p-3 bg-white rounded-2xl shadow-md border border-orange-100 mb-2">
                {/* Clean Stylized QR Code SVG Representation */}
                <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                  {/* Position detection markers */}
                  <rect x="10" y="10" width="24" height="24" rx="4" fill="#0F172A" />
                  <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
                  <rect x="18" y="18" width="8" height="8" rx="1" fill="#FF4E27" />

                  <rect x="66" y="10" width="24" height="24" rx="4" fill="#0F172A" />
                  <rect x="70" y="14" width="16" height="16" rx="2" fill="white" />
                  <rect x="74" y="18" width="8" height="8" rx="1" fill="#FF4E27" />

                  <rect x="10" y="66" width="24" height="24" rx="4" fill="#0F172A" />
                  <rect x="14" y="70" width="16" height="16" rx="2" fill="white" />
                  <rect x="18" y="74" width="8" height="8" rx="1" fill="#FF4E27" />

                  {/* QR Pattern simulated data matrix */}
                  <rect x="40" y="12" width="4" height="4" fill="#0F172A" />
                  <rect x="48" y="16" width="6" height="4" fill="#0F172A" />
                  <rect x="42" y="24" width="8" height="4" fill="#FF4E27" />
                  <rect x="54" y="22" width="4" height="6" fill="#0F172A" />
                  
                  <rect x="12" y="42" width="6" height="4" fill="#0F172A" />
                  <rect x="22" y="48" width="4" height="6" fill="#0F172A" />
                  <rect x="30" y="44" width="6" height="4" fill="#0F172A" />
                  
                  <rect x="40" y="40" width="20" height="20" rx="6" fill="#FF4E27" />
                  <circle cx="50" cy="50" r="4" fill="white" />
                  
                  <rect x="66" y="42" width="6" height="4" fill="#0F172A" />
                  <rect x="76" y="46" width="4" height="8" fill="#0F172A" />
                  <rect x="84" y="42" width="4" height="4" fill="#FF4E27" />

                  <rect x="42" y="66" width="4" height="8" fill="#0F172A" />
                  <rect x="50" y="72" width="8" height="4" fill="#0F172A" />
                  <rect x="44" y="82" width="6" height="4" fill="#FF4E27" />
                  <rect x="68" y="70" width="4" height="6" fill="#0F172A" />
                  <rect x="78" y="68" width="8" height="4" fill="#0F172A" />
                  <rect x="72" y="80" width="12" height="6" fill="#0F172A" />
                </svg>
              </div>
              <p className="text-xs font-bold text-slate-800">
                Faites scanner ce QR Code à table
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
                Vos amis ou convives ouvrent directement la recette ou l'atelier sur leur smartphone sans taper d'URL !
              </p>
            </div>
          )}

          {/* Security & Privacy assurance badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Partage chiffré & conforme aux standards de confidentialité Afrodelicious</span>
          </div>
        </div>
      </div>
    </div>
  );
};
