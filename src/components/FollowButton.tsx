import React, { useState } from 'react';
import { UserPlus, UserCheck, UserMinus } from 'lucide-react';
import { securityRateLimiter } from '../utils/securitySanitizer';

interface FollowButtonProps {
  targetUserId: string;
  targetUserName?: string;
  isFollowing: boolean;
  onToggleFollow: (targetUserId: string, targetUserName?: string) => void;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'solid' | 'outline' | 'subtle';
  className?: string;
  showCount?: boolean;
  followersCount?: number;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  targetUserName,
  isFollowing,
  onToggleFollow,
  size = 'sm',
  variant = 'solid',
  className = '',
  showCount = false,
  followersCount
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Security rate-limit: max 15 follow actions per minute
    const rateCheck = securityRateLimiter.checkLimit('follow_action', 15, 60000);
    if (!rateCheck.allowed) {
      console.warn('[Security Guard] Follow action rate limit exceeded.');
      return;
    }

    onToggleFollow(targetUserId, targetUserName);
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[11px] gap-1 rounded-full font-medium',
    sm: 'px-3 py-1 text-xs gap-1.5 rounded-full font-semibold',
    md: 'px-4 py-2 text-sm gap-2 rounded-full font-bold'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4'
  };

  // Following state styling
  if (isFollowing) {
    return (
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`inline-flex items-center justify-center transition-all duration-200 select-none ${sizeClasses[size]} ${
          isHovered
            ? 'bg-rose-50 text-rose-700 border border-rose-300 shadow-sm'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm'
        } ${className}`}
        title={isHovered ? `Ne plus suivre ${targetUserName || ''}` : `Abonné à ${targetUserName || ''}`}
        aria-label={isHovered ? `Ne plus suivre ${targetUserName || ''}` : `Abonné à ${targetUserName || ''}`}
      >
        {isHovered ? (
          <>
            <UserMinus className={`${iconSizes[size]} text-rose-600 shrink-0`} />
            <span>Ne plus suivre</span>
          </>
        ) : (
          <>
            <UserCheck className={`${iconSizes[size]} text-emerald-600 shrink-0`} />
            <span>Abonné(e)</span>
          </>
        )}
        {showCount && followersCount !== undefined && (
          <span className="ml-1 opacity-75 font-normal">
            ({followersCount.toLocaleString()})
          </span>
        )}
      </button>
    );
  }

  // Not following state styling
  const variantStyles = {
    solid: 'bg-gradient-to-r from-[#FF4E27] to-[#F59E0B] text-white hover:opacity-95 shadow-sm shadow-[#FF4E27]/20 active:scale-95',
    outline: 'border border-[#FF4E27] text-[#FF4E27] hover:bg-[#FF4E27]/10 active:scale-95',
    subtle: 'bg-orange-100 text-[#FF4E27] hover:bg-orange-200 active:scale-95'
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center transition-all duration-200 select-none ${sizeClasses[size]} ${variantStyles[variant]} ${className}`}
      title={`Suivre ${targetUserName || 'cet auteur'}`}
      aria-label={`Suivre ${targetUserName || 'cet auteur'}`}
    >
      <UserPlus className={`${iconSizes[size]} shrink-0`} />
      <span>Suivre</span>
      {showCount && followersCount !== undefined && (
        <span className="ml-1 opacity-90 font-normal">
          ({followersCount.toLocaleString()})
        </span>
      )}
    </button>
  );
};
