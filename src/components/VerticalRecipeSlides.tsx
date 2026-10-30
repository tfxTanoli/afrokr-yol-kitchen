import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Clock, 
  Flame, 
  ChefHat, 
  CalendarPlus, 
  ArrowUp, 
  ArrowDown, 
  Volume2, 
  VolumeX, 
  Utensils, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Recipe, User } from '../types';
import { CulinaryBadgeChip } from './CulinaryBadgeChip';
import { getAuthorCulinaryBadge } from '../utils/badgeSystem';
import { FollowButton } from './FollowButton';

interface VerticalRecipeSlidesProps {
  recipes: Recipe[];
  currentUser: User;
  onSelectRecipe: (recipeId: string) => void;
  onToggleLike: (recipeId: string) => void;
  onToggleBookmark: (recipeId: string) => void;
  onAddToMealPlan?: (recipe: Recipe) => void;
  onShareRecipe?: (recipe: Recipe) => void;
  followedUserIds?: string[];
  onToggleFollow?: (userId: string, userName?: string) => void;
  className?: string;
  isCompact?: boolean;
}

export const VerticalRecipeSlides: React.FC<VerticalRecipeSlidesProps> = ({
  recipes,
  currentUser,
  onSelectRecipe,
  onToggleLike,
  onToggleBookmark,
  onAddToMealPlan,
  onShareRecipe,
  followedUserIds = [],
  onToggleFollow,
  className = '',
  isCompact = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToNext = () => {
    if (currentIndex < recipes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(recipes.length - 1);
    }
  };

  // Keyboard navigation when in slides view
  useEffect(() => {
    if (!recipes || recipes.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, recipes.length]);

  // Early return must come after all hooks: the list size changes as recipes load from the backend.
  if (!recipes || recipes.length === 0) return null;

  const currentRecipe = recipes[currentIndex] || recipes[0];
  const authorBadge = getAuthorCulinaryBadge(currentRecipe.authorId);

  const handleDoubleTapLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(currentRecipe.id);
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 800);
  };

  return (
    <div className={`relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl ${className}`}>
      
      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-[#FF4E27] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <Flame className="w-3 h-3 fill-white" />
            <span>Slide Vertical · Reel</span>
          </span>
          <span className="text-xs font-mono font-bold text-slate-300">
            {currentIndex + 1} / {recipes.length}
          </span>
        </div>

        {/* Navigation Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-black/40 backdrop-blur-md hover:bg-black/60 text-white/90 transition-all border border-white/10"
            title={isMuted ? 'Activer ambiance sonore' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          
          <div className="flex items-center bg-black/40 backdrop-blur-md rounded-xl p-1 border border-white/10">
            <button
              onClick={goToPrev}
              disabled={recipes.length <= 1}
              className="p-1 rounded-lg hover:bg-white/20 text-white/90 disabled:opacity-30 transition-all"
              title="Recette précédente (Flèche haut)"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              disabled={recipes.length <= 1}
              className="p-1 rounded-lg hover:bg-white/20 text-white/90 disabled:opacity-30 transition-all"
              title="Recette suivante (Flèche bas)"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Card Area */}
      <div 
        ref={containerRef}
        onDoubleClick={handleDoubleTapLike}
        className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] overflow-hidden flex items-center justify-center cursor-pointer select-none group"
      >
        {/* Background Image with smooth fade effect */}
        <img
          key={currentRecipe.id}
          src={currentRecipe.imageUrl}
          alt={currentRecipe.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/60 pointer-events-none" />

        {/* Double Tap Heart Animation */}
        {likeAnimation && (
          <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none animate-in zoom-in-50 fade-in duration-300">
            <div className="p-5 rounded-full bg-white/20 backdrop-blur-md">
              <Heart className="w-20 h-20 text-[#FF4E27] fill-[#FF4E27] drop-shadow-xl animate-pulse" />
            </div>
          </div>
        )}

        {/* Right Floating Actions (TikTok/Reel style) */}
        <div className="absolute right-3 sm:right-4 bottom-24 sm:bottom-28 z-30 flex flex-col items-center gap-3.5">
          {/* Chef Avatar */}
          <div className="relative group/author mb-1">
            <img
              src={currentRecipe.authorAvatar}
              alt={currentRecipe.authorName}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#FF4E27] text-white">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Like Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(currentRecipe.id);
              }}
              className={`p-3 rounded-2xl backdrop-blur-md transition-all shadow-md active:scale-90 ${
                currentRecipe.isLiked
                  ? 'bg-[#FF4E27] text-white shadow-[#FF4E27]/30'
                  : 'bg-black/50 text-white hover:bg-black/70 border border-white/10'
              }`}
            >
              <Heart className={`w-5 h-5 ${currentRecipe.isLiked ? 'fill-white' : ''}`} />
            </button>
            <span className="text-[11px] font-bold text-white mt-1 drop-shadow-md">
              {currentRecipe.likesCount}
            </span>
          </div>

          {/* Bookmark Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(currentRecipe.id);
              }}
              className={`p-3 rounded-2xl backdrop-blur-md transition-all shadow-md active:scale-90 ${
                currentRecipe.isBookmarked
                  ? 'bg-amber-500 text-white shadow-amber-500/30'
                  : 'bg-black/50 text-white hover:bg-black/70 border border-white/10'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${currentRecipe.isBookmarked ? 'fill-white' : ''}`} />
            </button>
            <span className="text-[10px] font-bold text-white mt-1 drop-shadow-md">
              {currentRecipe.isBookmarked ? 'Sauvé' : 'Garder'}
            </span>
          </div>

          {/* Add to Meal Plan */}
          {onAddToMealPlan && (
            <div className="flex flex-col items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToMealPlan(currentRecipe);
                }}
                className="p-3 rounded-2xl bg-black/50 hover:bg-[#0F3E2E] text-white backdrop-blur-md transition-all border border-white/10 shadow-md active:scale-90"
                title="Ajouter au Planificateur"
              >
                <CalendarPlus className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-bold text-white mt-1 drop-shadow-md">
                Menu
              </span>
            </div>
          )}

          {/* Share */}
          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onShareRecipe) {
                  onShareRecipe(currentRecipe);
                } else {
                  navigator.clipboard?.writeText?.(window.location.href);
                }
              }}
              className="p-3 rounded-2xl bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all border border-white/10 shadow-md active:scale-90"
              title="Partager le slide"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-white mt-1 drop-shadow-md">
              Partage
            </span>
          </div>
        </div>

        {/* Bottom Recipe Info Card */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-20 text-white space-y-3 max-w-2xl">
          
          {/* Author & Origin Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-black border border-white/20 flex items-center gap-1.5 shadow-sm">
              <span className="text-base">{currentRecipe.countryFlag}</span>
              <span>{currentRecipe.country}</span>
            </span>

            <span className="px-2.5 py-1 rounded-xl bg-[#F59E0B]/30 backdrop-blur-md text-[#F59E0B] text-xs font-bold border border-[#F59E0B]/40">
              {currentRecipe.category}
            </span>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
              <span className="text-xs font-bold text-slate-200">{currentRecipe.authorName}</span>
              {authorBadge && <CulinaryBadgeChip badge={authorBadge} size="xs" />}
            </div>

            {onToggleFollow && currentRecipe.authorId !== currentUser.id && (
              <FollowButton
                targetUserId={currentRecipe.authorId}
                targetUserName={currentRecipe.authorName}
                isFollowing={followedUserIds.includes(currentRecipe.authorId)}
                onToggleFollow={onToggleFollow}
                size="xs"
                variant="solid"
              />
            )}
          </div>

          {/* Title */}
          <h2 className="font-serif font-black text-xl sm:text-2xl lg:text-3xl text-white leading-tight drop-shadow-md">
            {currentRecipe.title}
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow-sm font-medium">
            {currentRecipe.description}
          </p>

          {/* Quick Metrics & CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#F59E0B]" />
                <span>{currentRecipe.prepTimeMinutes + currentRecipe.cookTimeMinutes} min</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-emerald-400" />
                <span>{currentRecipe.servings} portions</span>
              </span>
              <span>·</span>
              <span className="capitalize text-slate-300">
                {currentRecipe.difficulty}
              </span>
            </div>

            {/* Cook Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectRecipe(currentRecipe.id);
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] via-[#FF6239] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-[#FF4E27]/40 transition-all hover:scale-105 active:scale-95"
            >
              <Utensils className="w-4 h-4" />
              <span>Cuisiner pas-à-pas</span>
            </button>
          </div>
        </div>

        {/* Left / Right Screen Edge Quick Slide Tap Zones */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className="absolute left-0 inset-y-16 w-16 opacity-0 hover:opacity-100 flex items-center justify-start pl-2 z-20 text-white/50 hover:text-white transition-all"
          title="Recette précédente"
        >
          <div className="p-2 rounded-full bg-black/40 backdrop-blur-md">
            <ArrowUp className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-0 inset-y-16 w-16 opacity-0 hover:opacity-100 flex items-center justify-end pr-2 z-20 text-white/50 hover:text-white transition-all"
          title="Recette suivante"
        >
          <div className="p-2 rounded-full bg-black/40 backdrop-blur-md">
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Slide Progress Indicator Bar */}
      <div className="h-1.5 w-full bg-slate-900 flex">
        {recipes.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-full flex-1 cursor-pointer transition-all ${
              idx === currentIndex
                ? 'bg-gradient-to-r from-[#FF4E27] to-[#F59E0B]'
                : idx < currentIndex
                ? 'bg-slate-700'
                : 'bg-slate-900'
            }`}
          />
        ))}
      </div>

    </div>
  );
};
