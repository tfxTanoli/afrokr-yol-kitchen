import React, { useState, useEffect } from 'react';
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
  Star,
  AlertTriangle,
  Scale,
  Mail,
  Info,
  Check,
  Sliders
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
  
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug' | 'appreciation' | 'autre'>('appreciation');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Cookie preferences state with persistence
  const [cookieConsent, setCookieConsent] = useState(() => {
    try {
      const stored = localStorage.getItem('afrodelicious_cookie_preferences');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: false
    };
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
    try {
      localStorage.setItem('afrodelicious_cookie_preferences', JSON.stringify(cookieConsent));
    } catch {}
    setCookieSavedToast(true);
    setTimeout(() => setCookieSavedToast(false), 2800);
  };

  const handleAcceptAllCookies = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setCookieConsent(allAccepted);
    try {
      localStorage.setItem('afrodelicious_cookie_preferences', JSON.stringify(allAccepted));
    } catch {}
    setCookieSavedToast(true);
    setTimeout(() => setCookieSavedToast(false), 2800);
  };

  const handleRejectNonEssentialCookies = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    setCookieConsent(onlyNecessary);
    try {
      localStorage.setItem('afrodelicious_cookie_preferences', JSON.stringify(onlyNecessary));
    } catch {}
    setCookieSavedToast(true);
    setTimeout(() => setCookieSavedToast(false), 2800);
  };

  const handleExportData = () => {
    setRgpdToast(true);
    setTimeout(() => setRgpdToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-[36px] shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-6 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0F3E2E] text-white shadow-md shadow-[#0F3E2E]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-black text-lg sm:text-xl text-slate-900 tracking-tight">
                Informations Légales, Conformité & Feedback
              </h2>
              <p className="text-xs text-slate-500">
                Afrodelicious · Transparence, protection des données et respect de la communauté
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 px-4 sm:px-8 py-2.5 bg-slate-100/80 border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: 'terms', label: 'Terms of Service', icon: FileText, badge: 'Updated' },
            { id: 'cookies', label: 'Politique de Cookies', icon: Cookie, badge: '3 Nov 2026' },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'cgu', label: 'CGV & Vente', icon: Scale },
            { id: 'rgpd', label: 'RGPD / GDPR', icon: ShieldCheck },
            { id: 'feedback', label: '💬 Feedback & Avis', icon: MessageSquareHeart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LegalTab)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#FF4E27] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Body Content */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* ========================================================== */}
          {/* TAB 1: TERMS OF SERVICE (COOKING CLASS & AFRODELICIOUS)    */}
          {/* ========================================================== */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header Title */}
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                    Official Agreement
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Last Updated: September 27, 2026</span>
                </div>
                <h3 className="font-serif font-black text-2xl text-slate-900 mt-1 tracking-tight">
                  Terms of Service — Cooking Class & Afrodelicious Platform
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Governing your access to and use of the Cooking Class website, Application, and all associated culinary services.
                </p>
              </div>

              {/* Arbitration & Class Action Waiver Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Important Legal Notice: Arbitration & Class Action Waiver</span>
                </div>
                <p className="text-xs text-amber-800/90 leading-relaxed">
                  Please read these Terms of Service carefully as they contain important information about your legal rights, remedies and obligations. By accessing or using the Cooking Class Platform, you agree to comply with and be bound by these Terms of Service. By accepting these Terms of Service, you agree to be bound by this arbitration clause and class action waiver. Please read it carefully.
                </p>
              </div>

              {/* Intro preamble */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">Thank you for using Cooking Class!</p>
                <p>
                  These Terms of Service ("Terms") constitute a legally binding agreement ("Agreement") between you and Cooking Class (as defined below) governing your access to and use of the Cooking Class website, including any subdomains thereof, and any other websites through which Cooking Class makes its services available (collectively, "Site"), our mobile, tablet and other smart device applications, and application program interfaces (collectively, "Application") and all associated services (collectively, "Cooking Class Services"). The Site, Application and Cooking Class Services together are hereinafter collectively referred to as the “Cooking Class Platform”.
                </p>
                <p>
                  When these Terms mention “Cooking Class,” “we,” “us,” or “our,” it refers to the Cooking Class company you are contracting with. Our collection and use of personal information in connection with your access to and use of the Cooking Class Platform is described in our Privacy Policy.
                </p>
              </div>

              {/* Sections Breakdown */}
              <div className="space-y-5">
                
                {/* 1. Scope of Cooking Class Services */}
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FF4E27]/10 text-[#FF4E27] flex items-center justify-center text-xs font-bold">1</span>
                    <span>Scope of Cooking Class Services</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-8 leading-relaxed">
                    <p>
                      <strong>1.1</strong> The Cooking Class Platform is an online marketplace that enables registered users (“Members”) and certain third parties who offer services (Members and third parties who offer services are “Hosts” and the services they offer are “Host Services”) to publish such Host Services on the Cooking Class Platform (“Listings”) and to communicate and transact directly with Members that are seeking to book such Host Services (Members using Host Services are “Guests”). Host Services may include the offering of vacation or other properties for use ("Accommodations"), single or multi-day activities in various categories (“Experiences”), access to unique events and locations (“Events”), and a variety of other travel and non-travel related services.
                    </p>
                    <p>
                      <strong>1.2</strong> As the provider of the Cooking Class Platform, Cooking Class does not own, create, sell, resell, provide, control, manage, offer, deliver, or supply any Listings or Host Services, nor is Cooking Class an organiser or retailer of travel packages. Hosts alone are responsible for their Listings and Host Services. When Members make or accept a booking, they are entering into a contract directly with each other. Cooking Class is not and does not become a party to or other participant in any contractual relationship between Members, nor is Cooking Class a real estate broker or insurer. Cooking Class is not acting as an agent in any capacity for any Member, except as specified in the Payments Terms.
                    </p>
                    <p>
                      <strong>1.3</strong> While we may help facilitate the resolution of disputes, Cooking Class has no control over and does not guarantee (i) the existence, quality, safety, suitability, or legality of any Listings or Host Services, (ii) the truth or accuracy of any Listing descriptions, Ratings, Reviews, or other Member Content, or (iii) the performance or conduct of any Member or third party. Cooking Class does not endorse any Member, Listing or Host Services. Any references to a Member being "verified" only indicate that the Member has completed a relevant verification or identification process. Verified Images are intended only to indicate a photographic representation of a Listing at the time the photograph was taken.
                    </p>
                    <p>
                      <strong>1.4</strong> If you choose to use the Cooking Class Platform as a Host or Co-Host, your relationship with Cooking Class is limited to being an independent, third-party contractor, and not an employee, agent, joint venturer or partner of Cooking Class. You act exclusively on your own behalf and for your own benefit.
                    </p>
                    <p>
                      <strong>1.5</strong> To promote the Cooking Class Platform and to increase exposure of Listings, Member Content may be displayed on other websites, within emails, and in advertisements. The Cooking Class Platform may contain translations powered by Google; Google disclaims all warranties related to translations.
                    </p>
                    <p>
                      <strong>1.6</strong> The Cooking Class Platform may contain links to third-party websites or resources (“Third-Party Services”). Cooking Class is not responsible or liable for the availability or accuracy of such Third-Party Services.
                    </p>
                    <p>
                      <strong>1.7</strong> Cooking Class may restrict the availability of the Platform or certain areas if necessary in view of capacity limits, security, server integrity, or maintenance.
                    </p>
                  </div>
                </div>

                {/* 2. Eligibility & Verification */}
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FF4E27]/10 text-[#FF4E27] flex items-center justify-center text-xs font-bold">2</span>
                    <span>Eligibility, Using the Platform, Member Verification</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-8 leading-relaxed">
                    <p>
                      <strong>2.1</strong> You must be at least 18 years old and able to enter into legally binding contracts to access and use the Cooking Class Platform or register an Account.
                    </p>
                    <p>
                      <strong>2.3</strong> Cooking Class may make access to and use of certain features subject to conditions such as completing a verification process, meeting specific quality or eligibility criteria, ratings thresholds, or booking history.
                    </p>
                    <p>
                      <strong>2.4</strong> User verification on the Internet is difficult and we do not assume any responsibility for the confirmation of any Member’s identity.
                    </p>
                    <p>
                      <strong>2.5</strong> Separate policies, standards or guidelines may apply to specific areas of the Platform.
                    </p>
                    <p>
                      <strong>2.6</strong> If you access or download the Application from the Apple App Store, you agree to Apple’s Licensed Application End User License Agreement. Use of Google Maps/Earth mapping services is subject to the Google Maps/Google Earth Additional Terms of Service.
                    </p>
                  </div>
                </div>

                {/* 3. Modification of these Terms */}
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FF4E27]/10 text-[#FF4E27] flex items-center justify-center text-xs font-bold">3</span>
                    <span>Modification of these Terms</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-8 leading-relaxed">
                    <p>
                      Cooking Class reserves the right to modify these Terms at any time. If we make changes to these Terms, we will post the revised Terms on the Platform and update the “Last Updated” date at the top. We will also provide you with notice of the modifications by email at least thirty (30) days before the date they become effective. If you disagree with the revised Terms, you may terminate this Agreement with immediate effect.
                    </p>
                  </div>
                </div>

                {/* 4. Account Registration */}
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FF4E27]/10 text-[#FF4E27] flex items-center justify-center text-xs font-bold">4</span>
                    <span>Account Registration</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-8 leading-relaxed">
                    <p>
                      <strong>4.1</strong> You must register an account to access and use certain features. If registering for an entity, you warrant that you have authority to legally bind that entity.
                    </p>
                    <p>
                      <strong>4.2</strong> You can register using an email address and password, or through third-party social networking services (Google, Facebook).
                    </p>
                    <p>
                      <strong>4.3 & 4.4</strong> You must provide accurate and complete information and maintain only one (1) account unless authorized. You may not assign or transfer your account.
                    </p>
                    <p>
                      <strong>4.5 & 4.6</strong> You are responsible for maintaining the confidentiality and security of your credentials and are liable for activities conducted through your account.
                    </p>
                  </div>
                </div>

                {/* 5. Content */}
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FF4E27]/10 text-[#FF4E27] flex items-center justify-center text-xs font-bold">5</span>
                    <span>Content & Proprietary Rights</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-8 leading-relaxed">
                    <p>
                      <strong>5.1</strong> Members may create, upload, post, and share Member Content (text, photos, video). Cooking Class makes available proprietary content.
                    </p>
                    <p>
                      <strong>5.2</strong> Cooking Class grants you a limited, non-exclusive, non-sublicensable, revocable, non-transferable license to download and use the Application on your personal devices for personal, non-commercial use.
                    </p>
                  </div>
                </div>

                {/* 6. Service Fees */}
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FF4E27]/10 text-[#FF4E27] flex items-center justify-center text-xs font-bold">6</span>
                    <span>Service Fees</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-8 leading-relaxed">
                    <p>
                      <strong>6.1 & 6.2</strong> Cooking Class may charge fees to Hosts ("Host Fees") and/or Guests ("Guest Fees"). Applicable Service Fees and Taxes are displayed prior to publishing or booking.
                    </p>
                    <p>
                      <strong>6.3</strong> You are responsible for paying all Service Fees owed. Applicable fees are collected by Cooking Class Payments and are generally non-refundable.
                    </p>
                  </div>
                </div>

                {/* 8. Booking Accommodations, Experiences & Travel Credits */}
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FF4E27]/10 text-[#FF4E27] flex items-center justify-center text-xs font-bold">8</span>
                    <span>Bookings, Experiences & Travel Credits</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-8 leading-relaxed">
                    <p>
                      <strong>8.2 Booking Accommodations:</strong> A confirmed booking is a limited license granted by the Host. Guests agree to leave by checkout time. Overstaying past checkout entitles the Host to make the Guest leave and charge Overstay Fees of up to two (2) times the average nightly fee plus expenses.
                    </p>
                    <p>
                      <strong>8.3 Booking Experiences, Events and Host Services:</strong> Guests must carefully review age, proficiency, fitness, or minimum legal drinking age requirements. Guests must adhere to Hosts' instructions at all times and may not bring additional individuals unless officially added during booking.
                    </p>
                    <p>
                      <strong>8.4 Travel Credits:</strong> May be redeemed for eligible bookings via the Platform as specified in terms provided with the credit.
                    </p>
                  </div>
                </div>

                {/* 9. Modifications, Cancellations & Refunds */}
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FF4E27]/10 text-[#FF4E27] flex items-center justify-center text-xs font-bold">9</span>
                    <span>Modifications, Cancellations, Refunds & Resolution Center</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-8 leading-relaxed">
                    <p>
                      <strong>9.1 & 9.2</strong> Guests can cancel a confirmed booking pursuant to the Listing’s cancellation policy.
                    </p>
                    <p>
                      <strong>9.3</strong> If a Host cancels a confirmed booking, the Guest will receive a full refund or rebooking credit, and Cooking Class may publish an automated cancellation review or impose cancellation penalties.
                    </p>
                    <p>
                      <strong>9.4</strong> For Experiences, inclement weather creating unsafe conditions allows Hosts to modify or cancel with appropriate alternative dates or refunds.
                    </p>
                    <p>
                      <strong>9.5, 9.6 & 9.7</strong> Cooking Class may cancel bookings for extenuating circumstances or pursuant to the Guest Refund Policy, with recovery from future Host payouts if applicable.
                    </p>
                    <p>
                      <strong>9.8</strong> Members may use the Resolution Center to send or request money for refunds, damages, or claims.
                    </p>
                  </div>
                </div>

                {/* 10. Ratings & Reviews */}
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FF4E27]/10 text-[#FF4E27] flex items-center justify-center text-xs font-bold">10</span>
                    <span>Ratings and Reviews</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-8 leading-relaxed">
                    <p>
                      <strong>10.1 & 10.2</strong> Guests and Hosts can leave public Reviews and star Ratings. Ratings reflect opinions of individual Members and are not verified by Cooking Class. Manipulation of reviews is strictly prohibited.
                    </p>
                    <p>
                      <strong>10.3</strong> Ratings and Reviews form part of a Member's public profile across the Platform.
                    </p>
                  </div>
                </div>

                {/* 11. Damage to Accommodations & Disputes */}
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FF4E27]/10 text-[#FF4E27] flex items-center justify-center text-xs font-bold">11</span>
                    <span>Damage to Accommodations & Member Disputes</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 pl-8 leading-relaxed">
                    <p>
                      As a Guest, you are responsible for leaving the Accommodation (including any personal or other property located at the Accommodation) in the condition it was in when you arrived. You are responsible for your own acts and omissions and are also responsible for the acts and omissions of any individuals whom you invite to, or otherwise provide access to, the Accommodation.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 5: POLITIQUE DE COOKIES – AFRODELICIOUS (OFFICIAL)     */}
          {/* ========================================================== */}
          {activeTab === 'cookies' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Header Title with Date */}
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    Traceurs & Vie Privée
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-bold">
                    Date de mise à jour : 3 novembre 2026
                  </span>
                </div>
                <h3 className="font-serif font-black text-2xl text-slate-900 mt-1 tracking-tight">
                  POLITIQUE DE COOKIES – AFRODELICIOUS
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Transparence totale sur l'utilisation des traceurs, technologies de stockage local et gestion de votre consentement.
                </p>
              </div>

              {/* Toast Feedback */}
              {cookieSavedToast && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Vos préférences relatives aux cookies et traceurs ont été enregistrées avec succès !</span>
                </div>
              )}

              {/* INTERACTIVE PREFERENCE CONTROL CENTER (ARTICLE 6) */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-50 border border-amber-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27] flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Gestionnaire de Préférences en Direct</span>
                    </span>
                    <h4 className="font-serif font-black text-base text-slate-900 mt-0.5">
                      Gérer mes choix de cookies & traceurs
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAcceptAllCookies}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0F3E2E] hover:bg-[#15523E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      ✓ Tout accepter
                    </button>
                    <button
                      type="button"
                      onClick={handleRejectNonEssentialCookies}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                    >
                      Refuser non-nécessaires
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Strictement nécessaires */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">3.1. Strictement nécessaires</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Indispensable (Actif)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Connexions sécurisées, authentification, sessions, mémorisation du consentement et prévention des fraudes.
                    </p>
                  </div>

                  {/* Préférences */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">3.2. Préférences</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookieConsent.functional}
                          onChange={(e) => setCookieConsent({ ...cookieConsent, functional: e.target.checked })}
                          className="w-4 h-4 accent-[#FF4E27] rounded cursor-pointer"
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Mémorisation de la langue sélectionnée (FR, EN, ES...), préférences d'affichage et de navigation culinaire.
                    </p>
                  </div>

                  {/* Analytiques */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">3.3. Analytiques et statistiques</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookieConsent.analytics}
                          onChange={(e) => setCookieConsent({ ...cookieConsent, analytics: e.target.checked })}
                          className="w-4 h-4 accent-[#FF4E27] rounded cursor-pointer"
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Nombre de visites, recettes les plus consultées, fonctionnalités utilisées et mesure anonyme des performances.
                    </p>
                  </div>

                  {/* Publicitaires */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">3.4. Publicitaires & marketing</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookieConsent.marketing}
                          onChange={(e) => setCookieConsent({ ...cookieConsent, marketing: e.target.checked })}
                          className="w-4 h-4 accent-[#FF4E27] rounded cursor-pointer"
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Mesure de performance des campagnes FNB, personnalisation, limitation de répétition publicitaire (ad frequency).
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Modifiable à tout moment depuis <strong>Paramètres → Confidentialité → Gestion des cookies</strong> ou votre <strong>User Profil</strong>.
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveCookies}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Enregistrer mes préférences
                  </button>
                </div>
              </div>

              {/* ARTICLE-BY-ARTICLE OFFICIAL TEXT */}
              <div className="space-y-5 pt-2">
                
                {/* ARTICLE 1 */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-sm text-slate-900 text-amber-800">
                    ARTICLE 1 – OBJET
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    La présente politique explique comment Afrodelicious utilise les cookies et autres traceurs dans le cadre de son application mobile et, le cas échéant, de son site Internet.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Elle permet aux utilisateurs de comprendre les finalités des traceurs utilisés et de gérer leurs préférences.
                  </p>
                </div>

                {/* ARTICLE 2 */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-sm text-slate-900 text-amber-800">
                    ARTICLE 2 – QU'EST-CE QU'UN COOKIE ?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Un cookie est un petit fichier texte déposé sur le terminal de l'utilisateur lors de la consultation d'un site Internet.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    D'autres technologies peuvent également être utilisées, notamment les SDK, identifiants publicitaires, pixels et technologies de stockage local.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ces dispositifs permettent notamment d'assurer le fonctionnement des services, de mémoriser certaines préférences ou de mesurer l'utilisation de l'Application.
                  </p>
                </div>

                {/* ARTICLE 3 */}
                <div className="space-y-3 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-sm text-slate-900 text-amber-800">
                    ARTICLE 3 – CATÉGORIES DE COOKIES
                  </h4>
                  <p className="text-xs text-slate-600">
                    Afrodelicious peut utiliser les catégories de traceurs suivantes, sous réserve de leur activation effective :
                  </p>
                  
                  <div className="space-y-2 text-xs text-slate-600 pl-4 border-l-2 border-amber-300">
                    <div>
                      <strong className="text-slate-900">3.1. Cookies strictement nécessaires :</strong>
                      <p className="mt-0.5">Ces traceurs sont indispensables au fonctionnement de l'Application ou du site. Ils peuvent notamment permettre :</p>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                        <li>La sécurisation des connexions ;</li>
                        <li>L'authentification des utilisateurs ;</li>
                        <li>La gestion des sessions ;</li>
                        <li>La mémorisation du choix de consentement ;</li>
                        <li>La prévention des activités frauduleuses.</li>
                      </ul>
                      <p className="mt-1 text-[11px] text-slate-500 italic">Ces traceurs ne nécessitent pas de consentement préalable lorsqu'ils répondent effectivement aux critères d'exemption légale.</p>
                    </div>

                    <div className="pt-2">
                      <strong className="text-slate-900">3.2. Cookies de préférences :</strong>
                      <p className="mt-0.5">Ils permettent de mémoriser certaines préférences de l'utilisateur, par exemple :</p>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                        <li>La langue sélectionnée ;</li>
                        <li>Les préférences d'affichage ;</li>
                        <li>Certaines préférences de navigation.</li>
                      </ul>
                      <p className="mt-1 text-[11px] text-slate-500 italic">Leur utilisation est soumise aux règles applicables selon leur finalité.</p>
                    </div>

                    <div className="pt-2">
                      <strong className="text-slate-900">3.3. Cookies analytiques et statistiques :</strong>
                      <p className="mt-0.5">Ces traceurs peuvent permettre de comprendre comment les utilisateurs utilisent Afrodelicious. Ils peuvent servir à mesurer :</p>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                        <li>Le nombre de visites ;</li>
                        <li>Les recettes les plus consultées ;</li>
                        <li>Les fonctionnalités utilisées ;</li>
                        <li>Les éventuelles difficultés de navigation ;</li>
                        <li>Les performances techniques de l'Application.</li>
                      </ul>
                      <p className="mt-1 text-[11px] text-slate-500 italic">Lorsqu'ils ne bénéficient pas d'une exemption légale, ces traceurs sont activés uniquement après consentement.</p>
                    </div>

                    <div className="pt-2">
                      <strong className="text-slate-900">3.4. Cookies publicitaires et marketing :</strong>
                      <p className="mt-0.5">Si Afrodelicious intègre des fonctionnalités publicitaires, des traceurs peuvent être utilisés pour :</p>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                        <li>Mesurer les performances des campagnes ;</li>
                        <li>Personnaliser certaines publicités ;</li>
                        <li>Limiter la répétition d'une publicité ;</li>
                        <li>Établir des statistiques publicitaires.</li>
                      </ul>
                      <p className="mt-1 text-[11px] text-slate-500 italic">Ces traceurs nécessitent un consentement préalable lorsqu'il est requis par la réglementation.</p>
                    </div>
                  </div>
                </div>

                {/* ARTICLE 4 */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-sm text-slate-900 text-amber-800">
                    ARTICLE 4 – CONSENTEMENT
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Lors de sa première visite sur le site ou lors de l'utilisation d'une interface intégrant des traceurs soumis à consentement, l'utilisateur peut :
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5 pl-2">
                    <li>Accepter tous les cookies ;</li>
                    <li>Refuser les cookies non nécessaires ;</li>
                    <li>Personnaliser ses préférences.</li>
                  </ul>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    Le refus doit être aussi simple que l'acceptation. Aucun cookie nécessitant un consentement ne doit être déposé ou lu avant que l'utilisateur ait exprimé son accord. L'acceptation des CGV ou de la politique de confidentialité ne vaut pas consentement aux cookies.
                  </p>
                </div>

                {/* ARTICLE 5 */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-sm text-slate-900 text-amber-800">
                    ARTICLE 5 – DURÉE DU CONSENTEMENT
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Le choix de l'utilisateur est conservé pendant une durée adaptée à la réglementation et aux recommandations applicables.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Le consentement doit pouvoir être retiré à tout moment. Afrodelicious pourra solliciter un nouveau choix en cas de modification substantielle des finalités ou des traceurs utilisés.
                  </p>
                </div>

                {/* ARTICLE 6 */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-sm text-slate-900 text-amber-800">
                    ARTICLE 6 – GESTION DES PRÉFÉRENCES
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    L'utilisateur peut modifier ou retirer son consentement à tout moment depuis la rubrique :
                  </p>
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs">
                    Paramètres → Confidentialité → Gestion des cookies / User Profil
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    L'utilisateur peut également configurer son navigateur pour bloquer ou supprimer certains cookies. Toutefois, le blocage de certains traceurs strictement nécessaires peut perturber le fonctionnement du service.
                  </p>
                </div>

                {/* ARTICLE 7 */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-sm text-slate-900 text-amber-800">
                    ARTICLE 7 – COOKIES TIERS
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Certains traceurs peuvent être déposés ou utilisés par des prestataires externes, notamment :
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5 pl-2">
                    <li>Les outils d'analyse statistique ;</li>
                    <li>Les plateformes publicitaires ;</li>
                    <li>Les services de paiement ;</li>
                    <li>Les outils de mesure de performance ;</li>
                    <li>Les plateformes de diffusion de contenus.</li>
                  </ul>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    Leur présence effective, leur finalité, leur durée de conservation et leurs responsables sont précisés dans le tableau des traceurs ci-dessous.
                  </p>
                </div>

                {/* ARTICLE 8: TABLEAU DES TRACEURS */}
                <div className="space-y-2 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-sm text-slate-900 text-amber-800">
                    ARTICLE 8 – TABLEAU DES TRACEURS
                  </h4>
                  <p className="text-xs text-slate-600">
                    Tableau technique des traceurs et technologies de stockage utilisés au sein de l'Application et de la Plateforme Afrodelicious :
                  </p>

                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                      <thead className="bg-slate-100 text-slate-800 font-black">
                        <tr>
                          <th className="p-2.5 border-b border-slate-200">Nom du traceur</th>
                          <th className="p-2.5 border-b border-slate-200">Fournisseur</th>
                          <th className="p-2.5 border-b border-slate-200">Finalité</th>
                          <th className="p-2.5 border-b border-slate-200">Durée</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-slate-900">afrodelicious_session</td>
                          <td className="p-2.5 text-slate-700">Afrodelicious</td>
                          <td className="p-2.5 text-slate-600">Fonctionnement (Authentification & session)</td>
                          <td className="p-2.5 text-slate-500 font-mono">Session</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-slate-900">afrodelicious_cookie_consent</td>
                          <td className="p-2.5 text-slate-700">Afrodelicious</td>
                          <td className="p-2.5 text-slate-600">Fonctionnement (Mémorisation du consentement)</td>
                          <td className="p-2.5 text-slate-500 font-mono">6 mois</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-slate-900">afrodelicious_lang</td>
                          <td className="p-2.5 text-slate-700">Afrodelicious</td>
                          <td className="p-2.5 text-slate-600">Préférences (Langue sélectionnée FR/EN/ES)</td>
                          <td className="p-2.5 text-slate-500 font-mono">12 mois</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-slate-900">afrodelicious_stats_anon</td>
                          <td className="p-2.5 text-slate-700">Afrodelicious Internal</td>
                          <td className="p-2.5 text-slate-600">Statistiques (Visites & recettes les plus vues)</td>
                          <td className="p-2.5 text-slate-500 font-mono">13 mois</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-slate-900">stripe_token_sec</td>
                          <td className="p-2.5 text-slate-700">Stripe Payments</td>
                          <td className="p-2.5 text-slate-600">Fonctionnement & Sécurité (Anti-fraude bancaire)</td>
                          <td className="p-2.5 text-slate-500 font-mono">30 jours</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-slate-900">ad_cap_frequency</td>
                          <td className="p-2.5 text-slate-700">Afrodelicious Ads</td>
                          <td className="p-2.5 text-slate-600">Publicité (Limitation de répétition / capping)</td>
                          <td className="p-2.5 text-slate-500 font-mono">30 jours</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ARTICLE 9 */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-sm text-slate-900 text-amber-800">
                    ARTICLE 9 – CONTACT
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pour toute question relative aux cookies et traceurs :
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Mail className="w-4 h-4 text-[#FF4E27]" />
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      E-mail : <a href="mailto:Info@afrodelicious.com" className="text-[#FF4E27] underline">Info@afrodelicious.com</a>
                    </span>
                  </div>
                </div>

                {/* ARTICLE 10 */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200/80">
                  <h4 className="font-serif font-black text-sm text-slate-900 text-amber-800">
                    ARTICLE 10 – MODIFICATION
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Afrodelicious peut modifier la présente politique pour tenir compte de l'évolution des technologies, des services et de la réglementation.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    La dernière date de mise à jour figure en haut du document (3 novembre 2026).
                  </p>
                </div>

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
                  Vos données permettent de personnaliser votre fil de recettes, générer votre liste de courses intelligente, sécuriser vos achats de cours et vous notifier en cas d'interaction sur vos créations culinaires.
                </p>

                <h4 className="font-bold text-slate-900">3. Non-revente des données</h4>
                <p>
                  Afrodelicious ne vend, ne loue et ne cède aucune donnée personnelle à des courtiers de données tiers. Pour toute demande : <a href="mailto:Info@afrodelicious.com" className="text-[#FF4E27] underline">Info@afrodelicious.com</a>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CGU & CGV */}
          {activeTab === 'cgu' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                  Conditions Contractuelles & Vente
                </span>
                <h3 className="font-serif font-black text-xl text-slate-900 mt-1">
                  Conditions Générales de Vente & d'Utilisation (CGV / CGU)
                </h3>
                <span className="text-xs text-slate-400">Régissant l'accès aux cours, ateliers, expériences et commandes</span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Article 1 — Accès et Inscription</h4>
                <p>
                  L'accès à Afrodelicious est ouvert à toute personne physique majeure. L'inscription peut s'effectuer gratuitement via Google OAuth, adresse e-mail ou par numéro de téléphone sécurisé.
                </p>

                <h4 className="font-bold text-slate-900">Article 2 — Masterclasses Payantes et Rétractation</h4>
                <p>
                  Les Online Cooking Classes proposées par les chefs certifiés sont accessibles à l'achat unitaire ou via l'abonnement Afrodelicious+. Dès le début du visionnage d'un cours vidéo, le droit de rétractation s'éteint conformément aux dispositions applicables aux contenus numériques immédiatement fournis.
                </p>

                <h4 className="font-bold text-slate-900">Article 3 — Expériences & Ateliers en Présentiel</h4>
                <p>
                  Les conditions d'annulation, de remboursement et de force majeure météorologique pour les safari street-food et ateliers sont régies par les Sections 8 et 9 des Terms of Service.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('terms')}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Consulter les Terms of Service intégraux →
                  </button>
                </div>
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
                    className="mt-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#FF4E27] text-white text-xs font-bold transition-colors cursor-pointer"
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
                    Suppression définitive de votre compte, de vos badges de chef et anonymisation de vos créations.
                  </p>
                  <button
                    onClick={() => alert("Pour des raisons de sécurité, confirmez la suppression définitive en écrivant à Info@afrodelicious.com")}
                    className="mt-2 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Demander la suppression
                  </button>
                </div>
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
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
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
                          className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            feedbackType === t.id
                              ? 'bg-[#FF4E27] text-white border-[#FF4E27] shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                      Votre message détaillé
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Partagez-nous vos impressions, vos recettes préférées ou les améliorations souhaitées..."
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:border-[#FF4E27] focus:ring-2 focus:ring-[#FF4E27]/20"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-2xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-black shadow-md shadow-[#FF4E27]/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Envoyer mon avis</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer with Support Link */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Afrodelicious Platform © 2026 · Tous droits réservés</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:Info@afrodelicious.com" className="text-slate-600 hover:text-[#FF4E27] font-semibold transition-colors">
              Contact : Info@afrodelicious.com
            </a>
            <button
              onClick={onClose}
              className="px-3.5 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
