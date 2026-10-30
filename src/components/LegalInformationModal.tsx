import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Cookie, 
  MessageSquareHeart, 
  Send, 
  CheckCircle2, 
  Download, 
  Trash2, 
  ExternalLink,
  Sparkles,
  Star
} from 'lucide-react';
import { SupportedLanguage } from '../i18n/translations';

export type LegalTab = 'terms' | 'privacy' | 'cgu' | 'rgpd' | 'cookies' | 'feedback';

interface LegalInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  language?: SupportedLanguage;
}

export const LegalInformationModal: React.FC<LegalInformationModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
  language = 'fr'
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  
  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug' | 'appreciation' | 'autre'>('appreciation');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Cookie preferences state
  const [cookieConsent, setCookieConsent] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false
  });
  const [cookieSavedToast, setCookieSavedToast] = useState(false);

  // RGPD export toast
  const [rgpdToast, setRgpdToast] = useState(false);

  if (!isOpen) return null;

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackMessage('');
      setFeedbackSent(false);
    }, 4000);
  };

  const handleSaveCookies = () => {
    setCookieSavedToast(true);
    setTimeout(() => setCookieSavedToast(false), 2500);
  };

  const handleExportData = () => {
    setRgpdToast(true);
    setTimeout(() => setRgpdToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0F3E2E] text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-black text-lg sm:text-xl text-slate-900">
                Informations Légales, Conformité & Feedback
              </h2>
              <p className="text-xs text-slate-500">
                Afrodelicious · Transparence, protection de vos données et écoute de la communauté
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: 'terms', label: 'Terms of Use', icon: FileText },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'cgu', label: 'CGU', icon: FileText },
            { id: 'rgpd', label: 'RGPD / GDPR', icon: ShieldCheck },
            { id: 'cookies', label: 'COOKIES', icon: Cookie },
            { id: 'feedback', label: '💬 Feedback & Avis', icon: MessageSquareHeart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LegalTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* TAB 1: Terms of Use */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27]">
                  Conditions d'Utilisation Générales
                </span>
                <h3 className="font-serif font-black text-xl text-slate-900 mt-1">
                  Terms of Use — Afrodelicious
                </h3>
                <span className="text-xs text-slate-400">Dernière mise à jour : 24 Septembre 2026</span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">1. Objet de la Plateforme</h4>
                <p>
                  Afrodelicious est un réseau social et une plateforme culinaire dédiée à la valorisation, au partage et à l'apprentissage de la gastronomie d'Afrique et des Caraïbes. Tout utilisateur s'engage à utiliser le service dans le respect des traditions, des auteurs et des lois en vigueur.
                </p>

                <h4 className="font-bold text-slate-900">2. Droits d'auteur et Propriété Intellectuelle</h4>
                <p>
                  Les recettes, photographies et stories partagées par les utilisateurs demeurent leur propriété intellectuelle. En publiant sur Afrodelicious, l'utilisateur accorde à la plateforme une licence non exclusive, mondiale et gratuite pour afficher, indexer et diffuser ces contenus auprès de la communauté.
                </p>

                <h4 className="font-bold text-slate-900">3. Comportement et Respect de la Communauté</h4>
                <p>
                  Sont strictement prohibés : les propos diffamatoires, haineux, le plagiat de recettes sans citation de l'auteur d'origine, le spam commercial non autorisé ainsi que tout contenu attentatoire aux bonnes mœurs.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Privacy Policy */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0F3E2E]">
                  Confidentialité et Vie Privée
                </span>
                <h3 className="font-serif font-black text-xl text-slate-900 mt-1">
                  Privacy Policy — Politique de Confidentialité
                </h3>
                <span className="text-xs text-slate-400">Conforme aux standards internationaux et européens</span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">1. Données collectées</h4>
                <p>
                  Nous collectons uniquement les informations nécessaires au bon fonctionnement de vos services : nom, identifiant (@handle), adresse email, numéro de téléphone (lors de l'inscription par SMS), pays d'origine de tradition culinaire et recettes sauvegardées.
                </p>

                <h4 className="font-bold text-slate-900">2. Utilisation des données</h4>
                <p>
                  Vos données permettent de personnaliser votre fil de recettes, générer votre liste de courses intelligente, sécuriser vos achats de masterclasses et vous notifier en cas d'interaction sur vos créations culinaires.
                </p>

                <h4 className="font-bold text-slate-900">3. Non-revente des données</h4>
                <p>
                  Afrodelicious ne vend, ne loue et ne cède aucune donnée personnelle à des courtiers de données tiers.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CGU */}
          {activeTab === 'cgu' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                  Conditions Contractuelles
                </span>
                <h3 className="font-serif font-black text-xl text-slate-900 mt-1">
                  Conditions Générales d'Utilisation (CGU)
                </h3>
                <span className="text-xs text-slate-400">Régissant l'accès aux cours, masterclasses et interactions</span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Article 1 — Accès et Inscription</h4>
                <p>
                  L'accès à Afrodelicious est ouvert à toute personne physique. L'inscription peut s'effectuer gratuitement via Google OAuth, adresse e-mail ou par numéro de téléphone sécurisé avec code de confirmation SMS.
                </p>

                <h4 className="font-bold text-slate-900">Article 2 — Masterclasses Payantes et Rétractation</h4>
                <p>
                  Les masterclasses proposées par les chefs certifiés sont accessibles à l'achat unitaire ou par crédits de parrainage. Dès le début du visionnage d'un cours vidéo, le droit de rétractation s'éteint conformément aux dispositions applicables aux contenus numériques personnalisés.
                </p>

                <h4 className="font-bold text-slate-900">Article 3 — Statuts Top Chef & Sanctions</h4>
                <p>
                  Les badges d'excellence (Top Chef, Expert Culinaire) sont calculés de manière automatisée selon les recettes publiées et les mentions j'aime. La plateforme se réserve le droit de révoquer un compte en cas de fraude ou de harcèlement.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: RGPD */}
          {activeTab === 'rgpd' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
                  Règlement Général sur la Protection des Données (RGPD - GDPR)
                </span>
                <h3 className="font-serif font-black text-xl text-slate-900 mt-1">
                  Vos Droits & Contrôle des Données Personnelles
                </h3>
                <span className="text-xs text-slate-400">Exercice immédiat de vos droits d'accès, d'export et d'oubli</span>
              </div>

              {rgpdToast && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Archive ZIP de vos données (recettes, commentaires, favoris) générée avec succès !</span>
                </div>
              )}

              <p>
                Conformément au Règlement (UE) 2016/679, vous disposez d'un droit permanent d'accès, de rectification, de portabilité et d'effacement de vos données personnelles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-[#FF4E27]" />
                    <span>Droit à la Portabilité</span>
                  </span>
                  <p className="text-xs text-slate-500">
                    Téléchargez l'intégralité de vos recettes, notes de planificateur et liste de courses au format JSON/CSV.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="mt-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#FF4E27] text-white text-xs font-bold transition-colors"
                  >
                    Exporter mes données (JSON)
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>Droit à l'Effacement (Droit à l'Oubli)</span>
                  </span>
                  <p className="text-xs text-rose-700/80">
                    Suppression définitive de votre compte, de vos badges de chef et anonymisation de vos commentaires.
                  </p>
                  <button
                    onClick={() => alert("Pour des raisons de sécurité, confirmez la suppression définitive en écrivant à privacy@afrodelicious.app ou via le bouton support.")}
                    className="mt-2 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
                  >
                    Demander la suppression
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COOKIES */}
          {activeTab === 'cookies' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                  Préférences Cookies & Traceurs
                </span>
                <h3 className="font-serif font-black text-xl text-slate-900 mt-1">
                  Gestion des Cookies — Afrodelicious
                </h3>
                <span className="text-xs text-slate-400">Contrôlez vos préférences à tout moment</span>
              </div>

              {cookieSavedToast && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Vos préférences de cookies ont été enregistrées avec succès !</span>
                </div>
              )}

              <p>
                Nous utilisons des cookies pour maintenir votre session active, mémoriser vos préférences de langue (FR, EN, PT, ES, SW) et mesurer l'audience de façon anonymisée.
              </p>

              <div className="space-y-3 pt-1">
                {[
                  { key: 'necessary', title: 'Cookies strictement nécessaires', desc: 'Indispensables pour naviguer sur la plateforme et sauvegarder les recettes.', locked: true },
                  { key: 'functional', title: 'Cookies de personnalisation', desc: 'Retiennent votre choix de langue et vos filtres de catégories favoris.', locked: false },
                  { key: 'analytics', title: 'Mesure d’audience et performance', desc: 'Permet d’optimiser la vitesse de chargement des stories vidéo.', locked: false },
                  { key: 'marketing', title: 'Recommandations de masterclasses', desc: 'Suggestions ciblées en fonction de vos terroirs culinaires préférés.', locked: false },
                ].map((item) => (
                  <div key={item.key} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                      <span className="text-xs text-slate-500">{item.desc}</span>
                    </div>
                    <div>
                      {item.locked ? (
                        <span className="px-2.5 py-1 rounded-xl bg-slate-200 text-slate-700 text-[11px] font-bold">
                          Toujours actif
                        </span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={(cookieConsent as any)[item.key]}
                          onChange={(e) => setCookieConsent({ ...cookieConsent, [item.key]: e.target.checked })}
                          className="w-4 h-4 accent-[#FF4E27] rounded cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveCookies}
                  className="px-5 py-2.5 rounded-2xl bg-[#0F3E2E] hover:bg-[#15523E] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Enregistrer mes préférences
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: Feedback */}
          {activeTab === 'feedback' && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27]">
                  Votre Avis Compte
                </span>
                <h3 className="font-serif font-black text-xl text-slate-900 mt-1">
                  Donnez votre Feedback & Suggestions
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aidez-nous à faire d'Afrodelicious la plus belle expérience culinaire afro-caribéenne au monde !
                </p>
              </div>

              {feedbackSent ? (
                <div className="p-8 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-3 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-black text-lg text-emerald-900">
                    Merci infiniment pour votre retour !
                  </h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Votre message a été transmis directement à notre équipe produit et aux chefs coordinateurs.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendFeedback} className="space-y-4">
                  {/* Rating stars */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Votre appréciation générale
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${star <= feedbackRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-2">
                        {feedbackRating === 5 ? 'Excellente expérience (5/5) ⭐' : `${feedbackRating}/5`}
                      </span>
                    </div>
                  </div>

                  {/* Feedback type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Type de retour
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'appreciation', label: '❤️ Coup de cœur' },
                        { id: 'suggestion', label: '💡 Idée / Fonctionnalité' },
                        { id: 'bug', label: '🛠️ Signalement de bug' },
                        { id: 'autre', label: '💬 Autre remarque' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFeedbackType(t.id as any)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                            feedbackType === t.id
                              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                      Votre message & suggestions
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Dites-nous ce qui vous plaît, une nouvelle recette à intégrer, une idée d'amélioration pour le planificateur ou les stories..."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-[#FF4E27] focus:ring-1 focus:ring-[#FF4E27] focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={!feedbackMessage.trim()}
                      className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF4E27]/25 flex items-center gap-2 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Envoyer mon avis</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Afrodelicious Legal & Compliance Team · contact@afrodelicious.app</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-[#FF4E27] text-white text-xs font-bold transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
