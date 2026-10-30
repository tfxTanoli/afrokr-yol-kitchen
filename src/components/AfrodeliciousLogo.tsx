import React from 'react';

interface AfrodeliciousLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
  variant?: 'full' | 'emblem';
}

/** Official Afro Delicious logo (supplied by the client), served from /public/brand. */
export const BRAND_LOGO_SRC = '/brand/afrodelicious-logo-512.png';

/** The round official logo on its native white background. */
export const AfrodeliciousEmblem: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative shrink-0 rounded-full bg-white ring-1 ring-orange-200/80 shadow-sm overflow-hidden ${className}`}>
    <img
      src={BRAND_LOGO_SRC}
      alt="Logo Afro Delicious"
      className="w-full h-full object-contain"
      draggable={false}
    />
  </div>
);

export const AfrodeliciousLogo: React.FC<AfrodeliciousLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  theme = 'light',
  variant = 'full'
}) => {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20'
  };

  const titleSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl'
  };

  if (variant === 'emblem') {
    return <AfrodeliciousEmblem className={`${iconSizes[size]} ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Official brand logo */}
      <AfrodeliciousEmblem className={`${iconSizes[size]} transition-transform duration-200 hover:scale-105`} />

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <div className={`font-serif font-black tracking-tight flex items-baseline ${titleSizes[size]}`}>
          <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
            Afro
          </span>
          <span className="bg-gradient-to-r from-[#FF4E27] via-[#FF7849] to-[#F59E0B] bg-clip-text text-transparent italic font-serif font-black ml-0.5">
            delicious
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-wide truncate">
            Afrique & Caraïbes · Saveurs d'exception
          </span>
        )}
      </div>
    </div>
  );
};
