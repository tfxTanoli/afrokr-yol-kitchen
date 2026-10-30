import React from 'react';
import { 
  X, 
  Crown, 
  Award, 
  Medal, 
  ChefHat, 
  Sparkles, 
  Sprout, 
  Check, 
  Lock, 
  Heart, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  Flame
} from 'lucide-react';
import { User, Recipe } from '../types';
import { calculateUserCulinaryStats } from '../utils/badgeSystem';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  recipes: Recipe[];
  onOpenCreateRecipe?: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  user,
  recipes,
  onOpenCreateRecipe
}) => {
  if (!isOpen) return null;

  const stats = calculateUserCulinaryStats(user, recipes);
  const { currentBadge, nextBadge, recipesCount, totalLikesReceived, allBadges } = stats;

  const renderBadgeIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'crown':
        return <Crown className={`${className} text-amber-500 fill-amber-400`} />;
      case 'award':
        return <Award className={`${className} text-emerald-600 fill-emerald-400`} />;
      case 'medal':
        return <Medal className={`${className} text-orange-500`} />;
      case 'chef-hat':
        return <ChefHat className={`${className} text-amber-600`} />;
      case 'sprout':
        return <Sprout className={`${className} text-emerald-600`} />;
      default:
        return <Sparkles className={`${className} text-amber-500`} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with decorative afro-kréyol banner */}
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-[#0F3E2E] text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Système de Mérite & Distinction Culinaire</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
                Palmarès de {user.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-md font-normal">
                Les badges sont attribués dynamiquement en fonction du nombre de recettes publiées et des mentions j'aime récoltées auprès de la communauté.
              </p>
            </div>

            {/* Current main badge visual medal */}
            <div className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border ${
              currentBadge.id === 'top_chef'
                ? 'bg-gradient-to-r from-[#FF4E27] to-[#FF7849] border-amber-300/40 shadow-lg shadow-[#FF4E27]/30 ring-2 ring-amber-400/30'
                : currentBadge.id === 'expert_culinaire'
                ? 'bg-gradient-to-r from-[#0F3E2E] to-[#15523E] border-emerald-300/40 shadow-lg shadow-[#0F3E2E]/30 ring-2 ring-emerald-400/30'
                : 'bg-white/10 border-white/20'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl">
                {currentBadge.emoji}
              </div>
              <div>
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">
                  Badge Actuel
                </span>
                <span className="font-serif font-bold text-sm text-white">
                  {currentBadge.title}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Counters: Recipes & Likes */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 pt-4 border-t border-white/15">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#FF4E27]/30 flex items-center justify-center text-[#F59E0B]">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-lg font-black text-white leading-tight block">
                  {recipesCount}
                </span>
                <span className="text-[11px] text-white/70 font-medium">
                  Recettes publiées
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-300">
                <Heart className="w-4 h-4 fill-pink-400" />
              </div>
              <div>
                <span className="text-lg font-black text-white leading-tight block">
                  {totalLikesReceived.toLocaleString()}
                </span>
                <span className="text-[11px] text-white/70 font-medium">
                  Likes reçus au total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Next Badge Progression Bar (if not at top level) */}
          {nextBadge ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-base shadow-2xs">
                    {nextBadge.emoji}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Objectif : Débloquer le badge « {nextBadge.title} »
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Nécessite {nextBadge.minRecipes} recettes et {nextBadge.minLikes} mentions j'aime
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#FF4E27]">
                  {stats.overallProgressPercent}%
                </span>
              </div>

              {/* Progress bars: Recipes and Likes */}
              <div className="space-y-2.5">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#FF4E27]" />
                      <span>Recettes : {recipesCount} / {nextBadge.minRecipes}</span>
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {recipesCount >= nextBadge.minRecipes ? 'Atteint ✓' : `${nextBadge.minRecipes - recipesCount} manquante(s)`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF4E27] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (recipesCount / nextBadge.minRecipes) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium flex items-center gap-1">
                      <Heart className="w-3 h-3 text-pink-500 fill-pink-400" />
                      <span>Likes reçus : {totalLikesReceived} / {nextBadge.minLikes}</span>
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {totalLikesReceived >= nextBadge.minLikes ? 'Atteint ✓' : `${nextBadge.minLikes - totalLikesReceived} restant(s)`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-[#FF4E27] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalLikesReceived / nextBadge.minLikes) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {onOpenCreateRecipe && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCreateRecipe();
                    }}
                    className="text-xs font-bold text-[#FF4E27] hover:underline flex items-center gap-1"
                  >
                    <span>Publier une nouvelle recette maintenant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF4E27] text-white flex items-center justify-center text-xl shadow-sm shrink-0">
                👑
              </div>
              <div>
                <span className="font-bold text-xs text-[#FF4E27] block">
                  Niveau Maximal Atteint : Grand Maître Top Chef !
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Félicitations, vous détenez la plus haute distinction de la communauté AfroKréyol Kitchen.
                </p>
              </div>
            </div>
          )}

          {/* All Badges Hierarchy Overview */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Échelle des Badges Culinaires AfroKréyol
            </span>

            <div className="space-y-3">
              {allBadges.map(({ badge, isUnlocked, recipesCurrent, likesCurrent }) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isUnlocked
                      ? badge.id === 'top_chef'
                        ? 'bg-orange-50/70 border-orange-300 ring-1 ring-[#FF4E27]/20'
                        : badge.id === 'expert_culinaire'
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-[#0F3E2E]/20'
                        : 'bg-white border-slate-200'
                      : 'bg-slate-50 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        isUnlocked ? 'bg-white shadow-xs border border-slate-200' : 'bg-slate-200 grayscale'
                      }`}>
                        {badge.emoji}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-slate-900">
                            {badge.title}
                          </h4>
                          {isUnlocked ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Débloqué</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              <span>Verrouillé</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                          {badge.description}
                        </p>

                        {/* Criteria pills */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            recipesCurrent >= badge.minRecipes ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white text-slate-600 border border-slate-200'
                          }`}>
                            📖 {badge.minRecipes > 0 ? `${badge.minRecipes} recettes requises` : 'Aucun prérequis'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            likesCurrent >= badge.minLikes ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white text-slate-600 border border-slate-200'
                          }`}>
                            ❤️ {badge.minLikes > 0 ? `${badge.minLikes} likes requis` : 'Aucun prérequis'}
                          </span>
                        </div>

                        {/* Perks */}
                        <div className="mt-3 pt-2.5 border-t border-slate-200">
                          <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider block mb-1">
                            Privilèges accordés :
                          </span>
                          <ul className="text-[11px] text-slate-600 space-y-1 font-normal">
                            {badge.perks.map((perk, pIdx) => (
                              <li key={pIdx} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[#FF4E27]" />
                                <span>{perk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Vos likes et recettes sont mis à jour en temps réel à chaque interaction.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
