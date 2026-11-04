import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  CheckCircle2,
  Share2,
  PlusCircle,
  Users,
  UtensilsCrossed,
  DollarSign,
  TrendingUp,
  Award,
  Globe,
  Camera,
  Heart,
  Flame,
  Check,
  Link as LinkIcon,
  BookOpen
} from 'lucide-react';
import { AfrodeliciousLogo } from './AfrodeliciousLogo';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { RECIPE_DISH_IMAGES, CHEF_AVATARS } from '../data/appImages';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onComplete?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  language = 'fr',
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Screen 1: Video state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Screen 2: Import recipe simulator state
  const [selectedSocial, setSelectedSocial] = useState<'instagram' | 'tiktok' | 'facebook' | 'web' | 'chrome'>('instagram');
  const [importUrl, setImportUrl] = useState('https://www.instagram.com/reel/C3x9_thieboudienne_dakar');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  // Screen 3: Stories reactions state
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [storyProgress, setStoryProgress] = useState(65);

  // Screen 4: Masterclass monetization simulator
  const [studentsCount, setStudentsCount] = useState(35);
  const pricePerStudent = 25;
  const chefShare = 0.70;
  const estimatedEarnings = Math.round(studentsCount * pricePerStudent * chefShare);

  // Screen 5: Active pillar selection
  const [activePillar, setActivePillar] = useState<'share' | 'community'>('community');

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish();
      } else if (e.key === 'ArrowRight') {
        if (currentStep < 4) setCurrentStep(prev => prev + 1);
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  // Story progress bar ticker
  useEffect(() => {
    if (!isOpen || currentStep !== 2) return;
    const timer = setInterval(() => {
      setStoryProgress(prev => (prev >= 100 ? 10 : prev + 2));
    }, 150);
    return () => clearInterval(timer);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.fr;

  const handleFinish = () => {
    try {
      localStorage.setItem('afrodelicious_has_seen_onboarding_v2', 'true');
    } catch {
      // localStorage may fail in restricted iframes
    }
    if (onComplete) onComplete();
    onClose();
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Screen 1: Toggle video play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Screen 1: Toggle video mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Screen 2: Test import simulation
  const handleTestImport = () => {
    setIsImporting(true);
    setImportResult(null);
    setTimeout(() => {
      setIsImporting(false);
      setImportResult('✅ Recette extraite : "Thiéboudienne Rouge Penda Mbaye" (45 min · 4 pers. · 12 ingrédients détectés)');
    }, 900);
  };

  // Screen 3: Add flying emoji reaction
  const handleSendReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = Math.floor(Math.random() * 60) + 20; // 20% to 80%
    setFloatingEmojis(prev => [...prev.slice(-8), { id, emoji, x }]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(item => item.id !== id));
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] border border-slate-200 overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
        
        {/* Top bar header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <AfrodeliciousLogo size="sm" />
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#FF4E27]" />
            <span className="hidden sm:inline-block text-xs font-bold text-slate-500">
              Guide d'accueil
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleFinish}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Passer
            </button>
          </div>
        </div>

        {/* Modal Body / Active Screen View */}
        <div className="flex-1 overflow-y-auto">
          
          {/* ======================================================== */}
          {/* ÉCRAN 1 : VIDÉO ANIMÉE D'UN PLAT AFRICAIN & BIENVENUE     */}
          {/* ======================================================== */}
          {currentStep === 0 && (
            <div className="relative flex flex-col">
              {/* Animated African Dish Video Canvas */}
              <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                {/* HTML5 Video with authentic dish video */}
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  poster={RECIPE_DISH_IMAGES.thieboudienne}
                  className="w-full h-full object-cover scale-105"
                  src="/assets/aistudio/africanfoood-___CKOT3VrHGVL___-3_7e93fba9.mp4"
                />

                {/* Rich Gradient Vignette for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

                {/* Sizzling steam & spice particle simulation */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
                  <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-16 right-1/4 w-40 h-40 bg-[#FF4E27]/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                  {/* Floating spice embers */}
                  <div className="absolute bottom-6 left-1/3 text-lg animate-bounce" style={{ animationDuration: '3s' }}>🌶️</div>
                  <div className="absolute bottom-12 right-1/3 text-base animate-bounce" style={{ animationDuration: '2.4s', animationDelay: '0.8s' }}>🌿</div>
                  <div className="absolute bottom-8 right-1/5 text-sm animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '1.2s' }}>✨</div>
                </div>

                {/* Top Overlay Badge & Video Controls */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-[#FF4E27] animate-ping" />
                    <span>Vidéo en direct · Saveurs d'Afrique</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors border border-white/20"
                      title={isPlaying ? 'Pause' : 'Lecture'}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors border border-white/20"
                      title={isMuted ? 'Activer le son' : 'Couper le son'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Center Content Floating on Hero */}
                <div className="absolute bottom-6 left-6 right-6 z-10 space-y-2 text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4E27]/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Réseau Social Culinaire Collaboratif</span>
                  </div>
                  <h1 className="font-serif font-black text-2xl sm:text-4xl text-white tracking-tight drop-shadow-md">
                    Bienvenue sur Afrodelicious
                  </h1>
                </div>
              </div>

              {/* Text Description requested */}
              <div className="p-6 sm:p-8 space-y-4 bg-white">
                <p className="font-serif text-lg sm:text-xl text-slate-800 leading-relaxed font-semibold">
                  Le réseau social culinaire de recettes de cuisine collaboratif d’Afrique et des Caraïbes. Partagez, découvrez et cocréez des milliers de recettes transmises avec passion et authenticité.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#FF4E27] text-white shrink-0 shadow-xs">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block">3 400+ Recettes</span>
                      <span className="text-[11px] text-slate-500">Du Thiébou au Colombo</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-xs">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block">32 Pays Représentés</span>
                      <span className="text-[11px] text-slate-500">Afrique de l'Ouest, Centrale & Îles</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 shadow-xs">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block">Secrets de Chefs</span>
                      <span className="text-[11px] text-slate-500">Pas-à-pas & astuces inédites</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ÉCRAN 2 : IMPORTER DES RECETTES (ORBITE RÉSEAUX SOCIAUX)  */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#FF4E27] text-xs font-black uppercase tracking-wider">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Importation Universelle</span>
                </div>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
                  Importer des recettes
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Importez n'importe quelle recette depuis les réseaux sociaux et le Web en 1 clic au milieu de votre univers Afrodelicious.
                </p>
              </div>

              {/* Visual: Facebook, Instagram, TikTok, Web, Chrome in a circle with Afrodelicious Homepage at the center */}
              <div className="relative py-8 flex items-center justify-center">
                {/* Orbital Background Rings */}
                <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
                  
                  {/* Concentric dashed orbit circles */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-300/40 animate-[spin_60s_linear_infinite]" />
                  <div className="absolute inset-6 rounded-full border border-slate-200/80" />
                  
                  {/* Pulsing Aura Rings radiating from center */}
                  <div className="absolute inset-16 rounded-full bg-orange-500/10 animate-ping opacity-30 pointer-events-none" />

                  {/* -------------------------------------------------- */}
                  {/* CENTER: Afrodelicious Homepage Card Mockup        */}
                  {/* -------------------------------------------------- */}
                  <div className="relative z-10 w-32 sm:w-36 p-2.5 rounded-2xl bg-white border-2 border-[#FF4E27] shadow-[0_10px_30px_rgba(255,78,39,0.25)] flex flex-col items-center text-center space-y-1.5 transition-transform hover:scale-105">
                    <div className="w-full flex items-center justify-between pb-1 border-b border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#FF4E27]">Afrodelicious</span>
                      <div className="w-2 h-2 rounded-full bg-orange-400" />
                    </div>

                    <div className="relative w-full h-14 rounded-xl overflow-hidden bg-slate-900">
                      <img
                        src={RECIPE_DISH_IMAGES.thieboudienne}
                        alt="Afrodelicious Homepage"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1">
                        <span className="text-[8px] font-bold text-white leading-tight">Homepage 🏠</span>
                      </div>
                    </div>

                    <div className="w-full bg-orange-50 py-0.5 rounded-md">
                      <span className="text-[8px] font-black text-[#FF4E27]">Plateforme Centrale</span>
                    </div>
                  </div>

                  {/* -------------------------------------------------- */}
                  {/* CIRCLE OF 5 LOGOS: Instagram, TikTok, Chrome, Facebook, Web */}
                  {/* Positioned around center via angles: -90°, -18°, 54°, 126°, 198° */}
                  {/* -------------------------------------------------- */}

                  {/* 1. INSTAGRAM (Top: angle -90°) */}
                  <button
                    onClick={() => {
                      setSelectedSocial('instagram');
                      setImportUrl('https://www.instagram.com/reel/C3x9_alloco_sauce_abidjan');
                    }}
                    className={`absolute -top-1 sm:top-1 left-1/2 -translate-x-1/2 p-2 sm:p-2.5 rounded-2xl shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center group ${
                      selectedSocial === 'instagram' ? 'scale-115 ring-3 ring-[#E1306C] shadow-xl' : 'hover:scale-110'
                    }`}
                    style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                    title="Instagram Reel"
                  >
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="text-[8px] font-black text-white mt-0.5">Instagram</span>
                  </button>

                  {/* 2. TIKTOK (Top-Right: angle ~ -18°) */}
                  <button
                    onClick={() => {
                      setSelectedSocial('tiktok');
                      setImportUrl('https://www.tiktok.com/@chef_kofi/video/729103829102');
                    }}
                    className={`absolute top-12 sm:top-14 right-0 sm:right-2 p-2 sm:p-2.5 rounded-2xl bg-black border border-slate-700 shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center group ${
                      selectedSocial === 'tiktok' ? 'scale-115 ring-3 ring-cyan-400 shadow-xl' : 'hover:scale-110'
                    }`}
                    title="TikTok Video"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.94-4.52V8.92a8.28 8.28 0 0 0 4.83 1.54V7.02c-.34.004-.68-.11-1-.33z" fill="#00F2FE"/>
                      <path d="M18.59 5.69a4.83 4.83 0 0 1-3.77-4.25V1h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V8.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 2 14.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.94-4.52V7.92a8.28 8.28 0 0 0 4.83 1.54V6.02c-.34.004-.68-.11-1-.33z" fill="#FE2C55"/>
                      <path d="M19 6.19a4.83 4.83 0 0 1-3.77-4.25V1.5h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V8.9a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 2.5 15.16a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.94-4.52V8.42a8.28 8.28 0 0 0 4.83 1.54V6.52c-.34.004-.68-.11-1-.33z" fill="#FFFFFF"/>
                    </svg>
                    <span className="text-[8px] font-black text-white mt-0.5">TikTok</span>
                  </button>

                  {/* 3. FACEBOOK (Bottom-Right: angle ~ 54°) */}
                  <button
                    onClick={() => {
                      setSelectedSocial('facebook');
                      setImportUrl('https://www.facebook.com/groups/afrocuisine/posts/9482018');
                    }}
                    className={`absolute bottom-6 sm:bottom-8 right-2 sm:right-6 p-2 sm:p-2.5 rounded-2xl bg-[#1877F2] text-white shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center group ${
                      selectedSocial === 'facebook' ? 'scale-115 ring-3 ring-blue-300 shadow-xl' : 'hover:scale-110'
                    }`}
                    title="Facebook Post & Groupes"
                  >
                    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-[8px] font-black text-white mt-0.5">Facebook</span>
                  </button>

                  {/* 4. GOOGLE CHROME (Bottom-Left: angle ~ 126°) */}
                  <button
                    onClick={() => {
                      setSelectedSocial('chrome');
                      setImportUrl('https://www.marmiton.org/recettes/recette_ndole-camerounais');
                    }}
                    className={`absolute bottom-6 sm:bottom-8 left-2 sm:left-6 p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200 shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center group ${
                      selectedSocial === 'chrome' ? 'scale-115 ring-3 ring-amber-400 shadow-xl' : 'hover:scale-110'
                    }`}
                    title="Google Chrome Extension & Mobile"
                  >
                    {/* Authentic 4-color Chrome logo */}
                    <div className="w-6 h-6 rounded-full relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#34A853] via-[#FBBC05] to-[#EA4335]" />
                      <div className="w-3 h-3 rounded-full bg-white z-10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#4285F4]" />
                      </div>
                    </div>
                    <span className="text-[8px] font-black text-slate-800 mt-0.5">Chrome</span>
                  </button>

                  {/* 5. WEB / NAVIGATEUR (Top-Left: angle ~ 198°) */}
                  <button
                    onClick={() => {
                      setSelectedSocial('web');
                      setImportUrl('https://afrik-cuisine.com/recettes/colombo-de-cabri-antillais');
                    }}
                    className={`absolute top-12 sm:top-14 left-0 sm:left-2 p-2 sm:p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center group ${
                      selectedSocial === 'web' ? 'scale-115 ring-3 ring-emerald-300 shadow-xl' : 'hover:scale-110'
                    }`}
                    title="Web & Tous les sites de cuisine"
                  >
                    <Globe className="w-6 h-6 text-white stroke-[2.2]" />
                    <span className="text-[8px] font-black text-white mt-0.5">Web</span>
                  </button>

                </div>
              </div>

              {/* Interactive link tester */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FF4E27]" />
                    <span>Testez l'importation instantanée :</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Exemple {selectedSocial.toUpperCase()}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#FF4E27]"
                  />
                  <button
                    onClick={handleTestImport}
                    disabled={isImporting}
                    className="px-4 py-2 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isImporting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Extraction...</span>
                      </>
                    ) : (
                      <>
                        <span>Importer en 1 clic</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {importResult && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                    {importResult}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ÉCRAN 3 : AJOUTER DES STORIES ÉPHÉMÈRES                   */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-wider">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Stories Culinaires</span>
                </div>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
                  Ajouter des Stories
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Partagez vos coulisses culinaires en direct et vos secrets de famille en vidéos courtes.
                </p>
              </div>

              {/* Interactive Phone Frame with Active Story */}
              <div className="relative max-w-xs mx-auto rounded-[32px] p-2.5 bg-slate-900 border-4 border-slate-800 shadow-2xl">
                <div className="relative rounded-[24px] overflow-hidden bg-slate-950 aspect-[9/14] flex flex-col justify-between">
                  
                  {/* Story Background Image */}
                  <img
                    src={RECIPE_DISH_IMAGES.allocoIvoirien}
                    alt="Story culinaire en direct"
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

                  {/* Top Segmented Progress Bars */}
                  <div className="relative z-10 p-3 pb-0 space-y-2.5">
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="h-1 rounded-full bg-white" />
                      <div className="h-1 rounded-full bg-white/30 overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-150"
                          style={{ width: `${storyProgress}%` }}
                        />
                      </div>
                      <div className="h-1 rounded-full bg-white/30" />
                    </div>

                    {/* Author bar */}
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#FF4E27] to-amber-400">
                          <img
                            src={CHEF_AVATARS.fatou}
                            alt="Chef Fatou"
                            className="w-7 h-7 rounded-full object-cover border border-white"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-black">Chef Fatou Diop</span>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          </div>
                          <span className="text-[9px] text-white/70 block">Marché de Sandaga · il y a 2h</span>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md font-bold">
                        24h
                      </span>
                    </div>
                  </div>

                  {/* Floating emoji reactions that user triggered */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                    {floatingEmojis.map((item) => (
                      <div
                        key={item.id}
                        className="absolute text-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out"
                        style={{
                          left: `${item.x}%`,
                          bottom: '80px',
                          animationFillMode: 'forwards'
                        }}
                      >
                        {item.emoji}
                      </div>
                    ))}
                  </div>

                  {/* Story Bottom Interactive Controls */}
                  <div className="relative z-10 p-3 space-y-2">
                    {/* Caption badge */}
                    <div className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-medium space-y-0.5">
                      <span className="text-[10px] text-amber-300 font-bold block">✨ Tour de main du jour</span>
                      <p className="line-clamp-2 text-[11px] leading-snug">
                        "Toujours faire dorer les bananes plantains dans une huile bien chaude à 180°C pour un croustillant parfait !"
                      </p>
                    </div>

                    {/* Interactive reactions strip */}
                    <div className="flex items-center justify-between gap-1 pt-1">
                      <span className="text-[10px] font-bold text-white/80">Réagir en direct :</span>
                      <div className="flex items-center gap-1">
                        {['🔥', '😋', '❤️', '👏', '🤤'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleSendReaction(emoji)}
                            className="p-1 rounded-full bg-white/20 hover:bg-white/40 text-base transition-transform active:scale-125 cursor-pointer"
                            title={`Envoyer ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ÉCRAN 4 : MASTERCLASSES & MONÉTISATION DU TALENT          */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Masterclasses & Monétisation</span>
                </div>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
                  Masterclasses & Revenus Cuisinière
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                  Monetiser votre talent de cuisiniere en publiant vos videos de cuisine & Suivez la préparation pas-à-pas des Chefs en vidéo courte, apprenez leurs tours de main secrets et progressez en direct.
                </p>
              </div>

              {/* Two Column Layout: Student Perspective vs Chef Creator Monetization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Perspective Apprenant : Suivre pas-à-pas en vidéo */}
                <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Play className="w-3 h-3 fill-amber-400" />
                        Apprentissage Pas-à-Pas
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">12 leçons vidéo</span>
                    </div>

                    <h3 className="font-serif font-black text-base text-white">
                      Masterclass : Le Tiep Bou Dien Royal
                    </h3>
                    <p className="text-xs text-slate-300">
                      Par Chef Fatou Diop · Accompagnement pas-à-pas, fiches dosages et certification officielle.
                    </p>
                  </div>

                  {/* Video scrubber preview */}
                  <div className="space-y-2 bg-white/10 p-3 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Chapitre 2 : Rissolage du mérou</span>
                      <span className="font-mono text-amber-300">04:30 / 12:45</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF4E27] w-1/3 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
                      <span>✓ Ingrédients pesés</span>
                      <span>·</span>
                      <span>✓ Fiche PDF incluse</span>
                      <span>·</span>
                      <span>✓ Certificat Chef</span>
                    </div>
                  </div>
                </div>

                {/* 2. Perspective Créateur : Monétisation de talent */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 text-slate-900 space-y-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27] flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Monétisez votre talent
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FF4E27] text-white font-black shadow-xs">
                        70% Reversés
                      </span>
                    </div>

                    <h3 className="font-serif font-black text-base text-slate-900">
                      Simulateur de revenus créateur
                    </h3>
                    <p className="text-xs text-slate-600">
                      Partagez vos recettes exclusives en masterclasses vidéo et touchez des revenus directs chaque semaine.
                    </p>
                  </div>

                  {/* Interactive revenue estimator */}
                  <div className="p-3.5 rounded-2xl bg-white border border-orange-200/80 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Élèves inscrits ce mois-ci :</span>
                      <span className="text-xs font-black text-[#FF4E27]">{studentsCount} élèves</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {[10, 35, 75, 120].map((count) => (
                        <button
                          key={count}
                          onClick={() => setStudentsCount(count)}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            studentsCount === count 
                              ? 'bg-[#FF4E27] text-white shadow-xs' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Revenu net estimé :</span>
                      <span className="text-base font-black text-emerald-700 font-mono">
                        {estimatedEarnings} € / mois
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Summary note */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-100 text-[#FF4E27]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-900">Pas de matériel complexe requis :</strong> Votre smartphone suffit. Notre équipe éditoriale vous accompagne dans l'habillage et la mise en ligne de votre première masterclass.
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ÉCRAN 5 : SHARE RECIPE & BUILD COMMUNITY (FOND CÉLÉBRATION) */}
          {/* ======================================================== */}
          {currentStep === 4 && (
            <div className="relative min-h-[460px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              {/* Background celebration image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
                style={{ backgroundImage: "url('/assets/aistudio/Onbiarding_Afrodelicious_0ff7cf86.png')" }}
              />
              {/* Dark Gradient Vignette for high contrast and readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />

              {/* Content overlay */}
              <div className="relative z-10 space-y-6">
                <div className="text-center space-y-2 max-w-xl mx-auto text-white">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-white/20 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>L'Esprit Afrodelicious</span>
                  </div>
                  <h2 className="font-serif font-black text-2xl sm:text-3xl text-white drop-shadow-md">
                    Share recipe, build community
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 drop-shadow">
                    Tout ce dont vous avez besoin pour transmettre et célébrer la gastronomie panafricaine & caribéenne au quotidien.
                  </p>
                </div>

                {/* Compact Pillars Selector: Share & Community (Taille réduite) */}
                <div className="flex items-center justify-center gap-2.5 max-w-sm mx-auto">
                  <button
                    type="button"
                    onClick={() => setActivePillar('share')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border backdrop-blur-md flex items-center gap-1.5 ${
                      activePillar === 'share'
                        ? 'bg-emerald-600 text-white border-white/40 shadow-md ring-2 ring-emerald-400/40'
                        : 'bg-black/50 hover:bg-black/70 text-white/80 border-white/15'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>1. Share Recipe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePillar('community')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border backdrop-blur-md flex items-center gap-1.5 ${
                      activePillar === 'community'
                        ? 'bg-purple-600 text-white border-white/40 shadow-md ring-2 ring-purple-400/40'
                        : 'bg-black/50 hover:bg-black/70 text-white/80 border-white/15'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-purple-300" />
                    <span>2. Build Community</span>
                  </button>
                </div>

                {/* Dynamic Pillar Card Showcase (frosted glass) */}

                {activePillar === 'community' && (
                  <div className="p-5 sm:p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/20 text-white space-y-3 animate-in fade-in duration-200 shadow-2xl max-w-2xl mx-auto">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>Build Community</span>
                      </span>
                    </div>
                    <h3 className="font-serif font-black text-lg text-white">
                      Cercles thématiques & entraide gourmande
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Rejoignez les cercles passionnés (Yassa Lovers, Végé & Vegan Afro, Pâtisseries caribéennes), suivez vos chefs préférés, échangez des astuces sur les marchés et débloquez des récompenses exclusives de parrainage.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 shadow-2xs">
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        15 000+ Gourmets actifs
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 shadow-2xs">
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        Badges de Chef & Parrainage
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between sticky bottom-0 z-20">
          {/* Back button */}
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
          ) : (
            <div className="w-16" />
          )}

          {/* Stepper Dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 transition-all rounded-full cursor-pointer ${
                  idx === currentStep
                    ? 'w-7 bg-[#FF4E27]'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Aller à l'écran ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next / Final button */}
          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-2xl text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
              currentStep === 4
                ? 'bg-gradient-to-r from-emerald-600 via-[#FF4E27] to-[#FF7849] hover:opacity-95 shadow-[#FF4E27]/30 scale-105'
                : 'bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] shadow-[#FF4E27]/25 hover:scale-[1.02]'
            }`}
          >
            <span>{currentStep === 4 ? 'Commencer l’aventure Afrodelicious 🚀' : 'Suivant'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
