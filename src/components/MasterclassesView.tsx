import React, { useState, useMemo } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ArrowRight, 
  X, 
  Award,
  Sparkles,
  ShoppingBag,
  Check,
  Key,
  Share2,
  Search,
  SlidersHorizontal,
  Plus,
  Calendar,
  LayoutGrid,
  List,
  Gift,
  CreditCard,
  Video,
  ChevronRight,
  Filter,
  DollarSign
} from 'lucide-react';
import { Course, Lesson, User } from '../types';
import { PaymentGatewayModal, DEFAULT_PAYMENT_CONFIG, PaymentGatewayConfig } from './PaymentGatewayModal';
import { AdBanner } from './AdBanner';
import { FollowButton } from './FollowButton';
import { ShareableItem } from './ShareModal';
import { getCountryFlag, formatCountryWithFlag } from '../utils/countryFlags';

interface MasterclassesViewProps {
  courses: Course[];
  currentUser: User;
  onEnrollCourse: (courseId: string) => void;
  onUpdateLessonProgress?: (courseId: string, lessonId: string) => void;
  followedUserIds?: string[];
  onToggleFollow?: (userId: string, userName?: string) => void;
  onOpenShare?: (item: ShareableItem) => void;
  onAddCourse?: (course: Course) => void;
}

export const COOKING_CLASS_CATEGORIES = [
  'All',
  'Main courses',
  'Entree',
  'Cuisine',
  'Dishes',
  'Deserts',
  'Baking',
  'Kids',
  'Beverages',
  'Appetizes',
  'Salad',
  'Breakfast',
  'Soups & Stews'
] as const;

export type CategoryTab = typeof COOKING_CLASS_CATEGORIES[number];
type PriceFilter = 'all' | 'free' | 'paid';
type ViewMode = 'grid' | 'list';

export const MasterclassesView: React.FC<MasterclassesViewProps> = ({
  courses: initialCourses,
  currentUser,
  onEnrollCourse,
  onUpdateLessonProgress,
  followedUserIds = [],
  onToggleFollow,
  onOpenShare,
  onAddCourse
}) => {
  // Local state for courses so newly created courses appear immediately
  const [localCourses, setLocalCourses] = useState<Course[]>(initialCourses);

  // Sync when prop changes
  React.useEffect(() => {
    setLocalCourses(initialCourses);
  }, [initialCourses]);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({
    'l1': true,
    'l2': true,
    'l-fu1': true,
    'l-fu2': true
  });
  const [purchaseSuccessToast, setPurchaseSuccessToast] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartToast, setCartToast] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('All');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modal Create Course (Free or Paid)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<Exclude<CategoryTab, 'All'>>('Main courses');
  const [newCountry, setNewCountry] = useState('Cameroun');
  const [newCountryFlag, setNewCountryFlag] = useState('🇨🇲');
  const [newDurationLabel, setNewDurationLabel] = useState('01 Week');
  const [newScheduleDate, setNewScheduleDate] = useState('18 April 2026');
  const [newScheduleTime, setNewScheduleTime] = useState('07:00 - 10:30');
  const [newIsFree, setNewIsFree] = useState<boolean>(true);
  const [newPrice, setNewPrice] = useState<number>(29);
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80');

  // Payment Gateway Modal State
  const [paymentCourse, setPaymentCourse] = useState<Course | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [gatewayConfig, setGatewayConfig] = useState<PaymentGatewayConfig>(DEFAULT_PAYMENT_CONFIG);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return localCourses.filter((course) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          course.title.toLowerCase().includes(q) ||
          course.subtitle.toLowerCase().includes(q) ||
          course.chefName.toLowerCase().includes(q) ||
          (course.country && course.country.toLowerCase().includes(q)) ||
          (course.chefCountry && course.chefCountry.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Category filter (Exact or content match)
      if (activeCategory !== 'All') {
        const cat = (course.category || '').toLowerCase();
        const target = activeCategory.toLowerCase();
        const matchesCategory = 
          cat === target ||
          cat.includes(target) ||
          target.includes(cat) ||
          course.title.toLowerCase().includes(target) ||
          course.subtitle.toLowerCase().includes(target) ||
          (course.description && course.description.toLowerCase().includes(target)) ||
          (course.learningOutcomes && course.learningOutcomes.some(o => o.toLowerCase().includes(target)));
        if (!matchesCategory) return false;
      }

      // Price filter (Free vs Paid)
      if (priceFilter === 'free') {
        if (course.price > 0 && !course.isFree) return false;
      } else if (priceFilter === 'paid') {
        if (course.price === 0 || course.isFree) return false;
      }

      return true;
    });
  }, [localCourses, searchQuery, activeCategory, priceFilter]);

  const handleEnroll = (course: Course) => {
    if (course.price > 0 && !course.isFree) {
      setPaymentCourse(course);
      setIsPaymentModalOpen(true);
    } else {
      onEnrollCourse(course.id);
      setLocalCourses(prev => prev.map(c => c.id === course.id ? { ...c, isEnrolled: true } : c));
      setPurchaseSuccessToast(`Félicitations ! Vous êtes inscrit(e) gratuitement au cours "${course.title}".`);
      setTimeout(() => setPurchaseSuccessToast(null), 3500);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    setCartCount(prev => prev + 1);
    setCartToast(`"${course.title}" a été ajouté à votre panier (${course.price === 0 ? 'Gratuit' : `$${course.price}`}).`);
    setTimeout(() => setCartToast(null), 3000);
  };

  const handlePaymentSuccess = (courseId: string, transactionId: string) => {
    onEnrollCourse(courseId);
    setLocalCourses(prev => prev.map(c => c.id === courseId ? { ...c, isEnrolled: true } : c));
    setPurchaseSuccessToast('Paiement validé avec succès ! Accès complet débloqué.');
    setTimeout(() => setPurchaseSuccessToast(null), 3500);
  };

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
    if (selectedCourse && onUpdateLessonProgress) {
      onUpdateLessonProgress(selectedCourse.id, lessonId);
    }
  };

  const handleShareCourse = (course: Course) => {
    if (onOpenShare) {
      onOpenShare({
        id: course.id,
        type: 'masterclass',
        title: course.title,
        description: course.description || course.subtitle,
        image: course.thumbnail,
        authorName: course.chefName,
        authorHandle: course.chefTitle,
        country: course.country || course.chefCountry,
        countryFlag: course.countryFlag || '🌍',
        prepTime: course.durationHours,
        price: course.price,
        location: course.chefCountry,
      });
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
    }
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourseObj: Course = {
      id: `course-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || `Cours de cuisine en direct avec ${currentUser.name}.`,
      chefId: currentUser.id,
      chefName: currentUser.name,
      chefAvatar: currentUser.avatar,
      chefCountry: `${newCountry} ${newCountryFlag}`,
      chefTitle: currentUser.role === 'chef' ? 'Cheffe Certifiée Afrodelicious' : 'Passionnée de Cuisine & Formatrice',
      price: newIsFree ? 0 : Number(newPrice) || 0,
      currency: 'USD',
      level: 'Tous niveaux',
      durationHours: '2h 00min',
      durationLabel: newDurationLabel,
      rating: 5.0,
      reviewsCount: 1,
      thumbnail: newImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      description: newSubtitle.trim() || `Rejoignez notre session de cuisine en ligne interactive pour apprendre à cuisiner pas-à-pas.`,
      category: newCategory,
      country: newCountry,
      countryFlag: newCountryFlag,
      scheduleDate: newScheduleDate,
      scheduleTime: newScheduleTime,
      isFree: newIsFree,
      learningOutcomes: [
        'Maîtriser les étapes clés de préparation et de cuisson',
        'Apprendre les secrets des épices et marinades traditionnelles',
        'Poser vos questions en direct pendant la session vidéo'
      ],
      lessons: [
        { id: `l-${Date.now()}-1`, title: '1. Ingrédients, découpe et mise en place', duration: '20 min', description: 'Préparation optimale des ingrédients frais.', isFreePreview: true },
        { id: `l-${Date.now()}-2`, title: '2. Cuisson guidée pas-à-pas & astuces de chef', duration: '40 min', description: 'Technique pas-à-pas en direct.', isFreePreview: true }
      ],
      enrolledStudentsCount: 1,
      isEnrolled: true,
      progressPercent: 0
    };

    setLocalCourses(prev => [newCourseObj, ...prev]);
    if (onAddCourse) {
      onAddCourse(newCourseObj);
    }

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    setPurchaseSuccessToast(`Votre cours "${newCourseObj.title}" (${newIsFree ? 'Gratuit 🎁' : `$${newPrice} 💳`}) a été publié avec succès !`);
    setTimeout(() => setPurchaseSuccessToast(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Toast Notification */}
      {purchaseSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0F3E2E] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#00C9A7]" />
          <span>{purchaseSuccessToast}</span>
        </div>
      )}

      {cartToast && (
        <div className="fixed top-20 left-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-2">
          <ShoppingBag className="w-4 h-4 text-[#00C9A7]" />
          <span>{cartToast}</span>
        </div>
      )}

      {/* TOP HERO BANNER (Directly matching the reference image kitchen banner) */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-200/80 bg-stone-900">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          {/* Kitchen photo background matching user attachment */}
          <img
            src="/assets/aistudio/OYH_cooking-classes_a7f97752.jpg"
            alt="Online Cooking Classes - Ateliers Culinaires, Dégustations & Balades Gourmandes"
            className="w-full h-full object-cover object-center brightness-95"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&auto=format&fit=crop&q=80';
            }}
          />
          {/* Warm luminous gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-black/20" />

          {/* Top Bar inside Hero */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5 shadow-xs">
                <Video className="w-3.5 h-3.5 text-[#00C9A7]" />
                <span>Cours en Direct & Replay HD</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3.5 py-1.5 rounded-2xl bg-[#00C9A7] hover:bg-[#00b093] text-slate-900 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Créer un cours (Gratuit ou Payant)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentCourse(localCourses[0]);
                  setIsPaymentModalOpen(true);
                }}
                className="hidden sm:flex px-3 py-1.5 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold items-center gap-1.5 transition-all"
                title="Configuration de la passerelle de paiement"
              >
                <Key className="w-3.5 h-3.5 text-[#00C9A7]" />
                <span className="text-[11px]">Passerelle API</span>
              </button>
            </div>
          </div>

          {/* Hero Content Bottom */}
          <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 text-white space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00C9A7] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Online Cooking Classes · Ateliers Culinaires En Ligne</span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-4xl text-white leading-tight drop-shadow-md">
              Ateliers Culinaires, Dégustations & Balades Gourmandes
            </h1>
            <p className="text-xs sm:text-sm text-slate-100 line-clamp-2 font-normal max-w-xl drop-shadow-xs">
              Rencontrez des hôtes et des chefs passionnés, cuisinez des recettes emblématiques, dégustez des cépages et rhums rares ou partez en safari street food à travers les terroirs du monde.
            </p>
          </div>
        </div>
      </div>

      {/* FLOATING SEARCH BAR & CATEGORY TABS (Directly matching reference mockups) */}
      <div className="space-y-4">
        
        {/* Search Input Row with Filter and View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xs">
          
          {/* Search class Input matching mockups */}
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search class, dish, chef (ex: Ndolè, Fumbwa, Jollof Rice)..."
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 border border-transparent focus:border-[#00C9A7] focus:bg-white focus:outline-none text-xs text-slate-900 placeholder:text-slate-400 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters: Price & View Mode */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            
            {/* Free vs Paid Toggle (User Decision Requirement) */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPriceFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  priceFilter === 'all' 
                    ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setPriceFilter('free')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  priceFilter === 'free' 
                    ? 'bg-[#00C9A7] text-slate-900 shadow-2xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Afficher uniquement les cours gratuits"
              >
                <Gift className="w-3 h-3" />
                <span>Gratuit</span>
              </button>
              <button
                type="button"
                onClick={() => setPriceFilter('paid')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  priceFilter === 'paid' 
                    ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Afficher uniquement les cours payants"
              >
                <CreditCard className="w-3 h-3 text-slate-500" />
                <span>Payant</span>
              </button>
            </div>

            {/* View Mode Toggle: Grid vs List (From Photo 2 vs Photo 1) */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vue Grille (2 colonnes comme dans la maquette)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vue Liste (Horizontale avec date et bouton +)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Category Tabs: All, Main courses, Entree, Cuisine, Dishes, Deserts, Baking, Kids, Beverages, Appetizes, Salad, Breakfast, Soups & Stews */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {COOKING_CLASS_CATEGORIES.map((tab) => {
            const isActive = activeCategory === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCategory(tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#00C9A7] text-slate-900 shadow-sm shadow-[#00C9A7]/20 ring-1 ring-[#00C9A7]'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab === 'All' ? 'All (Tous)' : tab}
              </button>
            );
          })}

          <div className="ml-auto text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">
            {filteredCourses.length} classe{filteredCourses.length > 1 ? 's' : ''} disponible{filteredCourses.length > 1 ? 's' : ''}
          </div>
        </div>

      </div>

      {/* AdSense Placement */}
      <AdBanner format="leaderboard" />

      {/* COURSE LISTINGS: DUAL VIEW (GRID OR LIST) */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00C9A7] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-slate-900">Aucun cours trouvé</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Essayez de réinitialiser vos critères de recherche ou proposez votre propre masterclass culinaire.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
              setPriceFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* ---------------------------------------------------- */
        /* VIEW 1: GRID MODE (2 COLUMNS MATCHING PHOTO 2)      */
        /* ---------------------------------------------------- */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredCourses.map((course) => {
            const isCourseFree = course.price === 0 || course.isFree;
            return (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setActiveLesson(course.lessons[0]);
                }}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                {/* Top Dish Image */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Free or Paid Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                      isCourseFree
                        ? 'bg-[#00C9A7] text-slate-950'
                        : 'bg-black/70 backdrop-blur-md text-white border border-white/20'
                    }`}>
                      {isCourseFree ? 'GRATUIT / FREE' : `$${course.price}`}
                    </span>
                  </div>

                  {/* Level & Schedule Date Tag */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
                      {course.durationLabel || course.durationHours}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 font-bold">
                      <span>{course.countryFlag || getCountryFlag(course.country || course.chefCountry)}</span>
                      <span>{course.country || course.chefCountry}</span>
                    </div>
                    {course.scheduleDate && (
                      <div className="flex items-center gap-1 text-[11px] font-mono text-white/90">
                        <Calendar className="w-3 h-3 text-[#00C9A7]" />
                        <span>{course.scheduleDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Header: Title and Price in Teal matching Photo 2 */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-black text-lg text-slate-900 group-hover:text-teal-700 transition-colors leading-tight">
                        {course.title}
                      </h3>
                      <span className="font-black text-base text-[#00C9A7] shrink-0">
                        {isCourseFree ? 'Gratuit' : `$${course.price}`}
                      </span>
                    </div>

                    {/* Country & Duration line as in Photo 2 */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                      <span>{course.country || course.chefCountry}</span>
                      <span>·</span>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.durationLabel || course.durationHours}</span>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {course.subtitle || course.description}
                    </p>
                  </div>

                  {/* Chef row */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.chefAvatar}
                        alt={course.chefName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="text-xs font-bold text-slate-800">{course.chefName}</span>
                    </div>

                    {onToggleFollow && (
                      <FollowButton
                        targetUserId={course.chefId || `chef-${course.id}`}
                        targetUserName={course.chefName}
                        isFollowing={followedUserIds.includes(course.chefId || `chef-${course.id}`)}
                        onToggleFollow={onToggleFollow}
                        size="xs"
                        variant="subtle"
                      />
                    )}
                  </div>

                  {/* Action Buttons: Cart Button + Buy Button matching Photo 2 */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, course)}
                      className="p-2.5 rounded-xl bg-teal-50 hover:bg-[#00C9A7] hover:text-slate-900 text-teal-800 border border-teal-200/80 transition-all flex items-center justify-center shrink-0"
                      title="Ajouter au panier"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnroll(course);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#00C9A7] hover:bg-[#00b093] text-slate-950 text-xs font-black transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      {course.isEnrolled ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Inscrit(e)</span>
                        </>
                      ) : isCourseFree ? (
                        <>
                          <Gift className="w-3.5 h-3.5" />
                          <span>Rejoindre Gratuitement</span>
                        </>
                      ) : (
                        <>
                          <span>Buy · ${course.price}</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        
        /* ---------------------------------------------------- */
        /* VIEW 2: LIST MODE (MATCHING PHOTO 1 WITH + BUTTON)  */
        /* ---------------------------------------------------- */
        <div className="space-y-3">
          {filteredCourses.map((course) => {
            const isCourseFree = course.price === 0 || course.isFree;
            return (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setActiveLesson(course.lessons[0]);
                }}
                className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-3 sm:gap-4 group cursor-pointer"
              >
                {/* Left: Rounded Square Dish Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isCourseFree && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-[#00C9A7] text-slate-900 text-[9px] font-black">
                      FREE
                    </span>
                  )}
                </div>

                {/* Center: Title & Schedule Details (07:00 - 10:30, 12 April 2026) */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                      {course.category || 'Dishes'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {course.countryFlag || getCountryFlag(course.country || course.chefCountry)} {course.country || course.chefCountry}
                    </span>
                  </div>

                  <h3 className="font-serif font-black text-sm sm:text-base text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                    {course.title}
                  </h3>

                  {/* Schedule Time & Calendar Date matching Photo 1 */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.scheduleTime || '07:00 - 10:30'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.scheduleDate || '12 April 2026'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                    <span>Par {course.chefName}</span>
                    <span>·</span>
                    <span className="font-bold text-[#00C9A7]">
                      {isCourseFree ? 'Gratuit / Free 🎁' : `$${course.price}`}
                    </span>
                  </div>
                </div>

                {/* Right: Prominent Teal Rounded [+] Button as in Photo 1 */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnroll(course);
                    }}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                      course.isEnrolled
                        ? 'bg-slate-900 text-white'
                        : 'bg-[#00C9A7] hover:bg-[#00b093] text-slate-950 hover:scale-105 active:scale-95'
                    }`}
                    title={course.isEnrolled ? 'Déjà inscrit' : isCourseFree ? 'Rejoindre gratuitement' : `Acheter pour $${course.price}`}
                  >
                    {course.isEnrolled ? (
                      <Check className="w-5 h-5 text-[#00C9A7]" />
                    ) : (
                      <Plus className="w-6 h-6 stroke-[3]" />
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CREATE COOKING CLASS MODAL (Free vs Paid User Choice) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00C9A7] text-slate-950 flex items-center justify-center font-black">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    Publier un Cours de Cuisine en Ligne
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Choisissez de partager gratuitement ou de monétiser votre savoir-faire
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCourseSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Free vs Paid Toggle (Mandatory User Choice) */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-2">
                <label className="font-bold text-slate-900 block text-xs">
                  Modèle de Tarif : Gratuit ou Payant ?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewIsFree(true)}
                    className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      newIsFree
                        ? 'bg-[#00C9A7] text-slate-950 shadow-xs ring-1 ring-[#00C9A7]'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    <span>100% Gratuit (Free 🎁)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewIsFree(false)}
                    className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      !newIsFree
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Payant / Monétisé 💳</span>
                  </button>
                </div>

                {!newIsFree && (
                  <div className="pt-2 flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Prix du cours ($ USD) :</span>
                    <input
                      type="number"
                      min="5"
                      max="200"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 text-sm focus:outline-none focus:border-[#00C9A7]"
                    />
                    <span className="text-[11px] text-slate-500 font-normal">
                      (Vous conservez 70% des gains · 30% commission plateforme)
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900">
                  Titre du cours (ex: Make Ndolè Dish) *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Make Ndolè Dish, Make Fumbwa Dish..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00C9A7] text-xs"
                />
              </div>

              {/* Description / Subtitle */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900">
                  Description / Points clés
                </label>
                <textarea
                  rows={2}
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="Ce que les élèves vont apprendre pas-à-pas..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00C9A7] text-xs"
                />
              </div>

              {/* Category & Country */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900">Catégorie</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#00C9A7]"
                  >
                    {COOKING_CLASS_CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900">Pays / Terroir</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newCountry}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewCountry(val);
                        setNewCountryFlag(getCountryFlag(val));
                      }}
                      placeholder="Cameroun"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00C9A7]"
                    />
                    <input
                      type="text"
                      value={newCountryFlag}
                      onChange={(e) => setNewCountryFlag(e.target.value)}
                      placeholder="🇨🇲"
                      className="w-12 text-center px-1 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#00C9A7]"
                      title="Drapeau du pays"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900">Date de la session</label>
                  <input
                    type="text"
                    value={newScheduleDate}
                    onChange={(e) => setNewScheduleDate(e.target.value)}
                    placeholder="12 April 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00C9A7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900">Horaires (Time)</label>
                  <input
                    type="text"
                    value={newScheduleTime}
                    onChange={(e) => setNewScheduleTime(e.target.value)}
                    placeholder="07:00 - 10:30"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00C9A7]"
                  />
                </div>
              </div>

              {/* Duration Label */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900">Durée affichée (ex: 01 Week, 3 Days, 2h 30min)</label>
                <input
                  type="text"
                  value={newDurationLabel}
                  onChange={(e) => setNewDurationLabel(e.target.value)}
                  placeholder="01 Week"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00C9A7]"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900">Photo du plat (URL)</label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00C9A7]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00C9A7] hover:bg-[#00b093] text-slate-950 font-black shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Publier la classe ({newIsFree ? 'Gratuit' : `$${newPrice}`})</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* COURSE DETAIL & LESSON PLAYER MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCourse.chefAvatar}
                  alt={selectedCourse.chefName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00C9A7]"
                />
                <div>
                  <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                    {selectedCourse.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-slate-500">
                      Par {selectedCourse.chefName} · {selectedCourse.chefCountry}
                    </p>
                    {onToggleFollow && (
                      <FollowButton
                        targetUserId={selectedCourse.chefId || `chef-${selectedCourse.id}`}
                        targetUserName={selectedCourse.chefName}
                        isFollowing={followedUserIds.includes(selectedCourse.chefId || `chef-${selectedCourse.id}`)}
                        onToggleFollow={onToggleFollow}
                        size="xs"
                        variant="subtle"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShareCourse(selectedCourse)}
                  className="p-2.5 rounded-xl bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Partager ce cours"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Partager</span>
                </button>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Simulator */}
            <div className="relative h-64 sm:h-80 bg-black flex items-center justify-center">
              <img
                src={selectedCourse.thumbnail}
                alt="Lecture vidéo"
                className="w-full h-full object-cover opacity-60"
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#00C9A7] text-slate-950 flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer mb-3">
                  <Play className="w-7 h-7 fill-slate-950 ml-1" />
                </div>
                <h4 className="font-serif font-bold text-base sm:text-xl">
                  {activeLesson?.title || selectedCourse.lessons[0]?.title || selectedCourse.title}
                </h4>
                <p className="text-xs text-slate-300 max-w-md mt-1">
                  {activeLesson?.description}
                </p>
                <span className="text-[11px] text-[#00C9A7] font-mono mt-1 font-bold">
                  Durée de la leçon : {activeLesson?.duration || selectedCourse.durationHours}
                </span>
              </div>
            </div>

            {/* Curriculum & Enrollment Actions */}
            <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
              
              {/* If not enrolled: Buy / Enroll Banner */}
              {!selectedCourse.isEnrolled && (
                <div className="p-4 rounded-2xl bg-teal-50/90 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                      {selectedCourse.price === 0 || selectedCourse.isFree ? 'Accès Gratuit Offert' : 'Accès Complet Monétisé'}
                    </span>
                    <h3 className="font-serif font-bold text-base text-slate-900">
                      {selectedCourse.price === 0 || selectedCourse.isFree 
                        ? '100% Gratuit pour la communauté' 
                        : `$${selectedCourse.price} USD (Paiement Unique)`}
                    </h3>
                    <p className="text-xs text-slate-600 font-normal">
                      Inclus le direct HD, les fiches recettes PDF et l'accès direct aux questions du Chef.
                    </p>
                  </div>

                  <button
                    onClick={() => handleEnroll(selectedCourse)}
                    className="px-6 py-3 rounded-xl bg-[#00C9A7] hover:bg-[#00b093] text-slate-950 text-xs font-black shadow-md shadow-[#00C9A7]/25 shrink-0 flex items-center justify-center gap-2 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {selectedCourse.price === 0 || selectedCourse.isFree 
                        ? "S'inscrire Gratuitement" 
                        : `Acheter ($${selectedCourse.price})`}
                    </span>
                  </button>
                </div>
              )}

              {/* What you will learn */}
              <div>
                <h3 className="font-serif font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                  Objectifs pédagogiques
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCourse.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lessons Curriculum List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-slate-900 uppercase tracking-wider">
                    Programme des leçons ({selectedCourse.lessons.length})
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {selectedCourse.durationHours} au total
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedCourse.lessons.map((lesson) => {
                    const isUnlocked = selectedCourse.isEnrolled || lesson.isFreePreview;
                    const isCompleted = !!completedLessons[lesson.id];
                    const isCurrent = activeLesson?.id === lesson.id;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => {
                          if (isUnlocked) setActiveLesson(lesson);
                        }}
                        className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                          isCurrent
                            ? 'bg-teal-50/80 border-[#00C9A7] shadow-xs'
                            : isUnlocked
                            ? 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 cursor-pointer'
                            : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isUnlocked ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLessonComplete(lesson.id);
                              }}
                              className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                                isCompleted
                                  ? 'bg-[#00C9A7] border-[#00C9A7] text-slate-950 font-black'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                          ) : (
                            <Lock className="w-5 h-5 text-gray-400" />
                          )}

                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {lesson.title}
                            </span>
                            <span className="text-[11px] text-slate-500 font-normal">
                              {lesson.description}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono text-slate-400 block">
                            {lesson.duration}
                          </span>
                          {lesson.isFreePreview && !selectedCourse.isEnrolled && (
                            <span className="text-[10px] font-bold text-emerald-600">
                              Aperçu gratuit
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* API Payment Gateway Modal for Paid Courses */}
      <PaymentGatewayModal
        course={paymentCourse}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        config={gatewayConfig}
        onUpdateConfig={setGatewayConfig}
      />

    </div>
  );
};
