import React from 'react';
import { Crown, Award, Medal, ChefHat, Sparkles, Sprout } from 'lucide-react';
import { CulinaryBadge, BadgeTier } from '../types';
import { CULINARY_BADGES } from '../utils/badgeSystem';

interface CulinaryBadgeChipProps {
  badge?: CulinaryBadge | BadgeTier | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showDetailsOnClick?: () => void;
  className?: string;
  showIconOnly?: boolean;
}

export const CulinaryBadgeChip: React.FC<CulinaryBadgeChipProps> = ({
  badge,
  size = 'sm',
  showDetailsOnClick,
  className = '',
  showIconOnly = false
}) => {
  // Resolve badge object
  let resolvedBadge: CulinaryBadge = CULINARY_BADGES.gourmet_novice;
  if (typeof badge === 'string') {
    resolvedBadge = CULINARY_BADGES[badge] || (badge.toLowerCase().includes('top') ? CULINARY_BADGES.top_chef : CULINARY_BADGES.expert_culinaire);
  } else if (badge && typeof badge === 'object') {
    resolvedBadge = badge;
  }

  const renderIcon = () => {
    const iconProps = {
      className: size === 'xs' ? 'w-2.5 h-2.5' : size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4'
    };

    switch (resolvedBadge.iconName) {
      case 'crown':
        return <Crown {...iconProps} className={`${iconProps.className} text-amber-200 fill-amber-300`} />;
      case 'award':
        return <Award {...iconProps} className={`${iconProps.className} text-emerald-200 fill-emerald-300`} />;
      case 'medal':
        return <Medal {...iconProps} className={`${iconProps.className} text-orange-200`} />;
      case 'chef-hat':
        return <ChefHat {...iconProps} className={`${iconProps.className} text-amber-100`} />;
      case 'sprout':
        return <Sprout {...iconProps} className={`${iconProps.className} text-emerald-300`} />;
      default:
        return <Sparkles {...iconProps} className={`${iconProps.className} text-amber-200`} />;
    }
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[9px] gap-1 rounded-md font-bold tracking-tight',
    sm: 'px-2 py-0.5 text-[10px] sm:text-[11px] gap-1.5 rounded-lg font-bold tracking-wide',
    md: 'px-3 py-1 text-xs gap-2 rounded-xl font-bold tracking-wide shadow-xs',
    lg: 'px-3.5 py-1.5 text-sm gap-2.5 rounded-2xl font-black shadow-sm'
  };

  const isTopChef = resolvedBadge.id === 'top_chef';
  const isExpert = resolvedBadge.id === 'expert_culinaire';

  // Custom visual treatment based on tier
  const bgStyle = isTopChef
    ? 'bg-gradient-to-r from-[#B83E1D] via-[#D9532F] to-[#E76F51] text-white shadow-xs shadow-[#D9532F]/25 border border-amber-300/40 ring-1 ring-amber-400/20'
    : isExpert
    ? 'bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#40916C] text-white shadow-xs shadow-[#1B4332]/25 border border-emerald-300/40 ring-1 ring-emerald-400/20'
    : resolvedBadge.id === 'cordon_bleu'
    ? 'bg-gradient-to-r from-[#C44927] to-[#E76F51] text-white border border-orange-300/30'
    : resolvedBadge.id === 'toque_montante'
    ? 'bg-[#9E6C38] text-white border border-amber-200/30'
    : 'bg-slate-100 text-slate-700 border border-slate-200';

  return (
    <span
      role={showDetailsOnClick ? 'button' : undefined}
      tabIndex={showDetailsOnClick ? 0 : undefined}
      onClick={(e) => {
        if (showDetailsOnClick) {
          e.stopPropagation();
          showDetailsOnClick();
        }
      }}
      onKeyDown={(e) => {
        if (showDetailsOnClick && (e.key === 'Enter' || e.key === ' ')) {
          e.stopPropagation();
          showDetailsOnClick();
        }
      }}
      title={`${resolvedBadge.title} : ${resolvedBadge.description} (Cliquez pour voir la progression)`}
      className={`inline-flex items-center select-none transition-all duration-200 ${
        showDetailsOnClick ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'
      } ${sizeClasses[size]} ${bgStyle} ${className}`}
    >
      <span className="shrink-0 flex items-center">
        {renderIcon()}
      </span>
      {!showIconOnly && (
        <span className="whitespace-nowrap flex items-center gap-1">
          <span>{resolvedBadge.title}</span>
          <span className="text-[10px] leading-none opacity-90">{resolvedBadge.emoji}</span>
        </span>
      )}
    </span>
  );
};
