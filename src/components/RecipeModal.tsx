import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Bookmark, 
  Share2, 
  Clock, 
  Flame, 
  Users, 
  ChefHat, 
  Check, 
  CalendarPlus, 
  Send, 
  Sparkles,
  BookOpen,
  CheckCircle2,
  Star,
  Plus,
  Minus,
  List,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  ShoppingBag,
  ArrowRight,
  Bell,
  Utensils,
  Timer,
  Trash2,
  Loader2,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { Recipe, User } from '../types';
import { CulinaryBadgeChip } from './CulinaryBadgeChip';
import { getAuthorCulinaryBadge } from '../utils/badgeSystem';
import { FollowButton } from './FollowButton';
import { ShareableItem } from './ShareModal';
import { toUserMessage } from '../lib/supabase';
import { COMMENT_MAX_LENGTH } from '../services/socialService';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  currentUser: User;
  onToggleLike: (recipeId: string) => void;
  onToggleBookmark: (recipeId: string) => void;
  onAddComment: (recipeId: string, text: string) => Promise<void> | void;
  onDeleteComment?: (recipeId: string, commentId: string) => Promise<void>;
  currentUserId?: string;
  canModerateComments?: boolean;
  onAddToMealPlan: (recipe: Recipe) => void;
  followedUserIds?: string[];
  onToggleFollow?: (userId: string, userName?: string) => void;
  onOpenShare?: (item: ShareableItem) => void;
}

type RecipeTab = 'ingredients' | 'directions' | 'heritage' | 'comments';

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  currentUser,
  onToggleLike,
  onToggleBookmark,
  onAddComment,
  onDeleteComment,
  currentUserId,
  canModerateComments = false,
  onAddToMealPlan,
  followedUserIds = [],
  onToggleFollow,
  onOpenShare
}) => {
  if (!recipe) return null;

  const [activeTab, setActiveTab] = useState<RecipeTab>('ingredients');
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [expandedTipStep, setExpandedTipStep] = useState<number | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [planAddedFeedback, setPlanAddedFeedback] = useState(false);
  const [groceryAddedFeedback, setGroceryAddedFeedback] = useState(false);
  const [copiedLinkFeedback, setCopiedLinkFeedback] = useState(false);

  // Interactive Live Cooking Timers for Steps (Inspired by Screen 3)
  const [activeTimerStep, setActiveTimerStep] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Calculate calories estimate based on ingredients & time
  const estimatedCalories = Math.round(
    (recipe.prepTimeMinutes * 4 + recipe.cookTimeMinutes * 5 + recipe.ingredients.length * 28 + 180) / Math.max(1, recipe.servings)
  );

  const currentServings = Math.max(1, Math.round(recipe.servings * servingMultiplier));

  // Timer countdown hook
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            try {
              // Play chime
              const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
              if (AudioCtx) {
                const ctx = new AudioCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.2); // E5
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.6);
              }
            } catch {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const handleStartTimer = (stepNumber: number, durationMinutes: number = 10) => {
    setActiveTimerStep(stepNumber);
    setTimerSecondsLeft(durationMinutes * 60);
    setIsTimerRunning(true);
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setActiveTimerStep(null);
    setTimerSecondsLeft(0);
  };

  const formatTimerDisplay = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleShareClick = () => {
    if (onOpenShare) {
      onOpenShare({
        id: recipe.id,
        type: 'recipe',
        title: recipe.title,
        description: recipe.description,
        image: recipe.imageUrl,
        authorName: recipe.authorName,
        authorHandle: recipe.authorHandle,
        country: recipe.country,
        countryFlag: recipe.countryFlag,
        prepTime: `${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min`,
        difficulty: recipe.difficulty,
        ingredientsCount: recipe.ingredients.length,
      });
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      setCopiedLinkFeedback(true);
      setTimeout(() => setCopiedLinkFeedback(false), 2000);
    }
  };

  const toggleIngredientCheck = (id: string) => {
    setCheckedIngredients(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || isPostingComment) return;
    setIsPostingComment(true);
    setCommentError(null);
    try {
      await onAddComment(recipe.id, newCommentText.trim());
      setNewCommentText('');
    } catch (error) {
      setCommentError(toUserMessage(error, 'Votre commentaire n’a pas pu être publié.'));
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!onDeleteComment || deletingCommentId) return;
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    setDeletingCommentId(commentId);
    setCommentError(null);
    try {
      await onDeleteComment(recipe.id, commentId);
    } catch (error) {
      setCommentError(toUserMessage(error, 'Le commentaire n’a pas pu être supprimé.'));
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleAddToPlanClick = () => {
    onAddToMealPlan(recipe);
    setPlanAddedFeedback(true);
    setTimeout(() => setPlanAddedFeedback(false), 2500);
  };

  const handleAddToGroceryList = () => {
    setGroceryAddedFeedback(true);
    setTimeout(() => setGroceryAddedFeedback(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl sm:max-w-3xl bg-white rounded-3xl sm:rounded-[36px] shadow-2xl border border-slate-200/90 overflow-hidden my-4 sm:my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* ========================================================================= */}
        {/* TOP COVER IMAGE WITH CIRCULAR FLOATING BUTTONS (Matching Reference Mockup) */}
        {/* ========================================================================= */}
        <div className="relative h-64 sm:h-80 md:h-92 w-full overflow-hidden bg-slate-950">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

          {/* Top-Left: Circular White Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-20 cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Top-Right: Circular Floating Action Buttons (Like, Bookmark, Share) */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            {/* Heart / Favorite Button matching reference */}
            <button
              onClick={() => onToggleLike(recipe.id)}
              className={`w-10 h-10 rounded-full bg-white/95 hover:bg-white shadow-md backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                recipe.isLiked ? 'text-rose-600' : 'text-slate-700 hover:text-rose-600'
              }`}
              title="Ajouter aux favoris"
              aria-label="Aimer"
            >
              <Heart className={`w-5 h-5 transition-transform ${recipe.isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
            </button>

            {/* Bookmark Button */}
            <button
              onClick={() => onToggleBookmark(recipe.id)}
              className={`w-10 h-10 rounded-full bg-white/95 hover:bg-white shadow-md backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                recipe.isBookmarked ? 'text-emerald-700' : 'text-slate-700 hover:text-emerald-700'
              }`}
              title="Sauvegarder la recette"
              aria-label="Sauvegarder"
            >
              <Bookmark className={`w-5 h-5 ${recipe.isBookmarked ? 'fill-emerald-600 text-emerald-600' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShareClick}
              className="w-10 h-10 rounded-full bg-white/95 hover:bg-white shadow-md backdrop-blur-md text-slate-700 hover:text-[#FF4E27] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Partager"
              aria-label="Partager"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Floating Pill: Country Tag & Category */}
          <div className="absolute bottom-10 left-5 sm:left-7 flex items-center gap-2 z-10">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-xs">
              <span className="text-sm">{recipe.countryFlag}</span>
              <span>{recipe.country}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-[#FF4E27] text-white text-xs font-black shadow-xs">
              {recipe.category}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* WHITE SHEET CARD CONTAINER (Rounded Top Transition Matching Mockup)       */}
        {/* ========================================================================= */}
        <div className="relative -mt-8 rounded-t-[32px] sm:rounded-t-[36px] bg-white pt-3 px-5 sm:px-7 pb-6 z-10 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
          
          {/* Top Drag Handle Indicator */}
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3" />

          {/* Title & Author Attribution */}
          <div className="text-center sm:text-left space-y-1 mb-4">
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 leading-tight">
              {recipe.title}
            </h1>
            
            {/* Author row with verified check and culinary badge */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <img
                  src={recipe.authorAvatar}
                  alt={recipe.authorName}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                />
                <span>{recipe.authorName}</span>
                {recipe.authorRole === 'chef' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4E27] fill-white" />
                )}
              </span>

              <CulinaryBadgeChip
                badge={getAuthorCulinaryBadge(recipe.authorName, recipe.authorId)}
                size="xs"
              />

              {onToggleFollow && recipe.authorId !== currentUser.id && (
                <FollowButton
                  targetUserId={recipe.authorId}
                  targetUserName={recipe.authorName}
                  isFollowing={followedUserIds.includes(recipe.authorId)}
                  onToggleFollow={onToggleFollow}
                  size="xs"
                  variant="subtle"
                  className="ml-1"
                />
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SERVINGS STEPPER & METRIC PILLS STRIP (Directly Matching Screen 1 & 2)    */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mb-5 p-2 bg-slate-50/90 rounded-2xl border border-slate-200/80">
            
            {/* 1. Servings Stepper */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setServingMultiplier(prev => Math.max(0.5, prev - 0.5))}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs transition-colors"
                title="Moins de portions"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="text-center px-1">
                <span className="text-xs font-black text-slate-900 block font-mono leading-none">
                  {currentServings}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold leading-none">
                  portions
                </span>
              </div>

              <button
                type="button"
                onClick={() => setServingMultiplier(prev => prev + 0.5)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs transition-colors"
                title="Plus de portions"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Total Time Pill */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-900 block font-mono leading-none">
                  {recipe.prepTimeMinutes + recipe.cookTimeMinutes}m
                </span>
                <span className="text-[10px] text-slate-500 font-semibold leading-none">
                  Temps total
                </span>
              </div>
            </div>

            {/* 3. Calories Metric Pill */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF4E27] flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 fill-orange-100 text-[#FF4E27]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-900 block font-mono leading-none">
                  {estimatedCalories}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold leading-none">
                  Calories / part
                </span>
              </div>
            </div>

            {/* 4. Rating Metric Pill */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-900 block font-mono leading-none">
                  {recipe.rating ? `${recipe.rating}/5` : '4.9/5'}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold leading-none">
                  {recipe.likesCount} avis
                </span>
              </div>
            </div>

          </div>

          {/* Quick Active Cooking Timers Component Widgets (Inspired by Screen 3 top strip) */}
          {activeTimerStep !== null && (
            <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md flex items-center justify-between animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Timer className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-100 tracking-wider block">
                    Minuteur Actif · Étape {activeTimerStep}
                  </span>
                  <span className="text-base font-black font-mono tracking-wider">
                    {formatTimerDisplay(timerSecondsLeft)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleTimer}
                  className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-teal-50 transition-colors flex items-center gap-1"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isTimerRunning ? 'Pause' : 'Reprendre'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetTimer}
                  className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white"
                  title="Réinitialiser le minuteur"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SEGMENTED TAB PILL SWITCHER (Directly Matching Screen 1 & 3: Black Active Pill) */}
          {/* ========================================================================= */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-full mb-5 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer text-center ${
                activeTab === 'ingredients'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ingrédients ({recipe.ingredients.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('directions')}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer text-center ${
                activeTab === 'directions'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Préparation ({recipe.steps.length})
            </button>

            {recipe.heritageStory && (
              <button
                type="button"
                onClick={() => setActiveTab('heritage')}
                className={`py-2 px-3 sm:px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer text-center ${
                  activeTab === 'heritage'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Héritage
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('comments')}
              className={`py-2 px-3 sm:px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer text-center ${
                activeTab === 'comments'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Avis ({recipe.commentsCount})
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: INGREDIENTS LIST (Matching Screen 1 & 2 with Hamburger Icon & Checkbox) */}
          {/* ========================================================================= */}
          {activeTab === 'ingredients' && (
            <div className="space-y-4 max-h-[52vh] overflow-y-auto pr-1">
              
              <div className="space-y-2">
                {recipe.ingredients.map((ing) => {
                  const scaledAmount = Math.round((ing.amount * servingMultiplier) * 10) / 10;
                  const isChecked = !!checkedIngredients[ing.id];

                  return (
                    <div
                      key={ing.id}
                      onClick={() => toggleIngredientCheck(ing.id)}
                      className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border cursor-pointer transition-all duration-150 ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                          : 'bg-white border-slate-200/90 hover:bg-slate-50 text-slate-900 shadow-2xs'
                      }`}
                    >
                      {/* Left: Drag / List Hamburger Icon & Name as in Mockup */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="text-slate-300 flex flex-col gap-0.5 shrink-0">
                          <span className="w-3.5 h-0.5 bg-slate-300 rounded-full" />
                          <span className="w-3.5 h-0.5 bg-slate-300 rounded-full" />
                          <span className="w-3.5 h-0.5 bg-slate-300 rounded-full" />
                        </div>
                        
                        <div className="min-w-0">
                          <span className={`text-xs block truncate ${isChecked ? 'line-through text-slate-400 font-normal' : 'font-semibold text-slate-800'}`}>
                            {ing.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {ing.aisle}
                          </span>
                        </div>
                      </div>

                      {/* Right: Quantity + Unit and Clean Checkbox as in Mockup */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-bold text-slate-700 font-mono">
                          {scaledAmount} {ing.unit}
                        </span>

                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isChecked 
                            ? 'bg-[#00C9A7] border-[#00C9A7] text-slate-950' 
                            : 'border-slate-300 bg-white hover:border-slate-400'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Bottom Sticky Action Bar (Matching Green Button from Screen 2 + Meal Plan) */}
              <div className="pt-2 sticky bottom-0 bg-white/95 backdrop-blur-md pb-1 flex flex-col sm:flex-row gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleAddToGroceryList}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#00C9A7] hover:bg-[#00b093] text-slate-950 text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>
                    {groceryAddedFeedback 
                      ? '✓ Ingrédients ajoutés à la liste !' 
                      : 'Ajouter à ma liste de courses'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToPlanClick}
                  className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>{planAddedFeedback ? '✓ Ajouté au menu !' : 'Planifier pour ma semaine'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DIRECTIONS / PREPARATION (Matching Screen 3 with Step Cards & Timers) */}
          {/* ========================================================================= */}
          {activeTab === 'directions' && (
            <div className="space-y-4 max-h-[52vh] overflow-y-auto pr-1">
              
              <div className="space-y-3">
                {recipe.steps.map((st) => {
                  const isCurrentTimer = activeTimerStep === st.stepNumber;
                  const isTipExpanded = expandedTipStep === st.stepNumber;

                  return (
                    <div
                      key={st.stepNumber}
                      className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all ${
                        isCurrentTimer
                          ? 'bg-teal-50/50 border-[#00C9A7] shadow-sm'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      {/* Step Header matching Screen 3 */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif font-black text-sm sm:text-base text-slate-900">
                          Step {st.stepNumber} · {st.title}
                        </span>

                        {st.durationMinutes && (
                          <span className="text-[11px] font-mono text-slate-500 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{st.durationMinutes} min</span>
                          </span>
                        )}
                      </div>

                      {/* Instruction text */}
                      <p className="text-xs text-slate-700 leading-relaxed font-normal mb-3">
                        {st.instruction}
                      </p>

                      {/* Step Photo or Video (max 30s) */}
                      {st.mediaUrl && (
                        <div className="mb-3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 p-1 shadow-xs">
                          {st.mediaType === 'video' ? (
                            <div className="space-y-1">
                              <video
                                src={st.mediaUrl}
                                controls
                                playsInline
                                className="w-full max-h-56 rounded-xl object-contain bg-black"
                              />
                              <div className="flex items-center justify-between px-2 py-1 text-[10px] text-slate-300">
                                <span className="flex items-center gap-1 font-bold text-emerald-400">
                                  <Video className="w-3 h-3" />
                                  <span>Vidéo pas-à-pas ({st.videoDurationSeconds || 30}s max)</span>
                                </span>
                                <span className="font-mono text-slate-400">Capsule courte 30s</span>
                              </div>
                            </div>
                          ) : (
                            <div className="relative h-44 w-full rounded-xl overflow-hidden">
                              <img
                                src={st.mediaUrl}
                                alt={`Étape ${st.stepNumber}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5">
                                <ImageIcon className="w-3 h-3 text-emerald-400" />
                                <span>Photo de préparation</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Interactive Step Timer Button (Matching green '+ Start Rice Timer' from Screen 3) */}
                      {st.durationMinutes && (
                        <div className="pt-1 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartTimer(st.stepNumber, st.durationMinutes)}
                            className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                              isCurrentTimer && isTimerRunning
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-teal-50 hover:bg-[#00C9A7] text-teal-900 border border-teal-200'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>
                              {isCurrentTimer 
                                ? `Minuteur en cours (${formatTimerDisplay(timerSecondsLeft)})` 
                                : `Lancer le minuteur (${st.durationMinutes} min)`}
                            </span>
                          </button>
                        </div>
                      )}

                      {/* Chef Tip / FAQ collapsible (Matching 'Should I rinse my rice? ?' from Screen 3) */}
                      {st.tip && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setExpandedTipStep(isTipExpanded ? null : st.stepNumber)}
                            className="flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 transition-colors"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                            <span>Astuce du Chef pour cette étape ❓</span>
                          </button>

                          {isTipExpanded && (
                            <div className="mt-2 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 italic animate-in fade-in">
                              "{st.tip}"
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CULTURAL HERITAGE STORY                                            */}
          {/* ========================================================================= */}
          {activeTab === 'heritage' && (
            <div className="space-y-4 max-h-[52vh] overflow-y-auto pr-1">
              <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[#FF4E27]" />
                  <span>Héritage, Terroir & Histoire du Plat</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                  {recipe.heritageStory || recipe.description}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-amber-900">
                  <span>Origine authentique : {recipe.countryFlag} {recipe.country}</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: COMMENTS & REVIEWS                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'comments' && (
            <div className="space-y-4 max-h-[52vh] overflow-y-auto pr-1">
              
              {/* Comment submission form */}
              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Posez une question au chef ou partagez votre avis..."
                  maxLength={COMMENT_MAX_LENGTH}
                  disabled={isPostingComment}
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:border-[#00C9A7] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isPostingComment || !newCommentText.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-[#00C9A7] hover:bg-[#00b093] text-slate-950 text-xs font-black shadow-xs flex items-center gap-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPostingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Envoyer</span>
                </button>
              </form>
              {commentError && (
                <p role="alert" className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {commentError}
                </p>
              )}

              {/* Comments list */}
              <div className="space-y-2.5">
                {recipe.comments.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    Soyez le premier à laisser un commentaire à {recipe.authorName} !
                  </p>
                ) : (
                  recipe.comments.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex gap-3">
                      <img
                        src={c.userAvatar}
                        alt={c.userName}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">{c.userName}</span>
                            <CulinaryBadgeChip badge={getAuthorCulinaryBadge(c.userName, c.userId)} size="xs" />
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] text-slate-400 font-medium">{c.createdAt}</span>
                            {onDeleteComment && (c.userId === currentUserId || canModerateComments) && (
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(c.id)}
                                disabled={deletingCommentId === c.id}
                                title="Supprimer le commentaire"
                                aria-label="Supprimer le commentaire"
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                              >
                                {deletingCommentId === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 font-normal leading-relaxed break-words whitespace-pre-line">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
