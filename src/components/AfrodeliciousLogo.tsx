import React from 'react';

interface AfrodeliciousLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
  variant?: 'full' | 'emblem';
}

export const AfrodeliciousEmblemSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Logo Afrodelicious"
  >
    <defs>
      <linearGradient id="afroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF4E27" />
        <stop offset="50%" stopColor="#FF7849" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>

    {/* Background Emblem Rounded Hexagon / Shield */}
    <rect width="100" height="100" rx="26" fill="url(#afroGrad)" />

    {/* Subtle African continent stylized contour background */}
    <path
      d="M36 24C44 23 54 26 58 31C62 35 68 37 66 43C64 49 60 52 57 58C54 64 51 72 47 77C44 80 41 81 40 76C39 70 37 65 34 60C31 55 28 50 29 44C30 38 31 34 33 29C34 26 35 24 36 24Z"
      fill="rgba(255, 255, 255, 0.16)"
    />

    {/* Chef Toque Plumes (Artisanal culinary hat) */}
    <path
      d="M32 46C26 46 22 41 24 34C26 27 34 26 38 29C40 21 50 18 57 23C64 19 74 23 75 30C80 29 86 34 84 41C82 48 76 49 71 48"
      stroke="white"
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="rgba(255,255,255,0.3)"
    />

    {/* Toque Base Band */}
    <path
      d="M28 50H74C76 50 78 52 77 55L73 66C72.5 68 70.5 69 68.5 69H33.5C31.5 69 29.5 68 29 66L25 55C24 52 26 50 28 50Z"
      fill="white"
    />

    {/* Toque Band accent line (African pattern touch) */}
    <line x1="32" y1="60" x2="70" y2="60" stroke="#FF4E27" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />

    {/* Gourmet Flame / Chili Accent in Center */}
    <path
      d="M51 32C53 37 57 41 57 45C57 49 53.5 52 50 52C46.5 52 43 49 43 45C43 42 45 39 48 37C48.5 35 49.5 33 51 32Z"
      fill="#FF4E27"
    />

    {/* Warm Golden Star Sparkles & Spices */}
    <circle cx="68" cy="22" r="4" fill="url(#sunGrad)" />
    <circle cx="28" cy="24" r="3" fill="url(#sunGrad)" />
    <circle cx="76" cy="44" r="2.5" fill="white" />
  </svg>
);

export const AfroDeliciousOfficialBadge: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24 sm:w-28 sm:h-28'
}) => {
  // 24 decorative tribal segments around the circular border
  const segments = Array.from({ length: 24 });

  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo Afro Delicious Food & Drinks"
    >
      <defs>
        <radialGradient id="badgeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#FFFDF7" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </radialGradient>
        <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#EA580C" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Background Soft Disc */}
      <circle cx="150" cy="150" r="145" fill="url(#badgeGlow)" filter="url(#badgeShadow)" />

      {/* Outer Golden/Warm Orange Border Rings (as in reference image) */}
      <circle cx="150" cy="150" r="140" stroke="#EFA226" strokeWidth="5.5" />
      <circle cx="150" cy="150" r="114" stroke="#EFA226" strokeWidth="3" />

      {/* Tribal Pattern Ring with alternating burgundy & amber triangles and dots */}
      <g>
        {segments.map((_, i) => {
          const angle = i * 15;
          const isEven = i % 2 === 0;
          return (
            <g key={i} transform={`rotate(${angle} 150 150)`}>
              {/* Outer Triangle */}
              <polygon
                points="150,15 144,28 156,28"
                fill={isEven ? '#6E1D2A' : '#EFA226'}
              />
              {/* Mid Dot */}
              <circle
                cx="150"
                cy="33"
                r="2.2"
                fill={isEven ? '#EFA226' : '#6E1D2A'}
              />
            </g>
          );
        })}
      </g>

      {/* Top Cutlery: Stylized Fork in warm amber/orange */}
      <g stroke="#EFA226" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Fork Prongs */}
        <path d="M 100 118 L 118 118" />
        <path d="M 100 124 L 118 124" />
        <path d="M 100 130 L 118 130" />
        {/* Fork Base & Extended Line */}
        <path d="M 118 118 L 122 124 L 118 130" />
        <path d="M 122 124 L 205 124" />
      </g>

      {/* Center Brand Name Typography: 'Afro Delicious' in rich burgundy script & 'Food & Drinks' */}
      <g textAnchor="middle" style={{ userSelect: 'none' }}>
        {/* Afro Delicious script */}
        <text
          x="150"
          y="156"
          fill="#6E1D2A"
          style={{
            fontFamily: '"Brush Script MT", "Caveat", "Great Vibes", "Playfair Display", cursive, serif',
            fontSize: '44px',
            fontWeight: 'bold',
            fontStyle: 'italic',
            letterSpacing: '0.5px'
          }}
        >
          Afro Delicious
        </text>

        {/* Food & Drinks sub-text */}
        <text
          x="150"
          y="172"
          fill="#6E1D2A"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}
        >
          Food &amp; Drinks
        </text>
      </g>

      {/* Bottom Cutlery: Stylized Knife & Spoon in warm amber/orange */}
      <g stroke="#EFA226" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Knife line with curved blade on bottom right */}
        <path d="M 85 186 L 195 186 C 205 186 210 182 205 178" />

        {/* Spoon line with oval bowl on bottom left */}
        <path d="M 130 198 L 215 198" />
        <ellipse cx="118" cy="198" rx="12" ry="7" fill="none" stroke="#EFA226" strokeWidth="3" />
      </g>

      {/* Decorative accent dots inside emblem */}
      <circle cx="80" cy="188" r="2.5" fill="#EFA226" />
      <circle cx="225" cy="124" r="2.5" fill="#EFA226" />
    </svg>
  );
};

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
    return (
      <div className={`relative ${iconSizes[size]} shrink-0 shadow-md shadow-[#FF4E27]/25 rounded-2xl overflow-hidden ${className}`}>
        <AfrodeliciousEmblemSvg />
      </div>
    );
  }

  if ((variant as any) === 'badge') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <AfroDeliciousOfficialBadge className={iconSizes[size]} />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Brand Icon SVG Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 shadow-md shadow-[#FF4E27]/25 rounded-2xl overflow-hidden transition-transform duration-200 hover:scale-105 hover:rotate-2`}>
        <AfrodeliciousEmblemSvg />
      </div>

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
