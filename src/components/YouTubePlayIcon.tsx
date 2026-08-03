import React, { useId } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

interface YouTubePlayIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'accent' | 'youtube';
}

const getAccentShades = (hex: string) => {
  let color = (hex || '#FF6A00').replace('#', '');
  if (color.length === 3) {
    color = color.split('').map((c) => c + c).join('');
  }
  const num = parseInt(color, 16);
  if (isNaN(num)) {
    return {
      light: '#FFA366',
      main: '#FF6A00',
      deep: '#CC5200',
      rgb: '255, 106, 0'
    };
  }

  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  const lightR = Math.min(255, Math.round(r + (255 - r) * 0.45));
  const lightG = Math.min(255, Math.round(g + (255 - g) * 0.45));
  const lightB = Math.min(255, Math.round(b + (255 - b) * 0.45));

  const deepR = Math.max(0, Math.round(r * 0.65));
  const deepG = Math.max(0, Math.round(g * 0.65));
  const deepB = Math.max(0, Math.round(b * 0.65));

  const toHex = (red: number, green: number, blue: number) =>
    '#' + [red, green, blue].map((x) => x.toString(16).padStart(2, '0')).join('');

  return {
    light: toHex(lightR, lightG, lightB),
    main: `#${color}`,
    deep: toHex(deepR, deepG, deepB),
    rgb: `${r}, ${g}, ${b}`
  };
};

export const YouTubePlayIcon: React.FC<YouTubePlayIconProps> = ({
  className = '',
  size = 'md',
  variant = 'accent'
}) => {
  const uniqueId = useId ? useId().replace(/:/g, '_') : `play-${Math.random().toString(36).substring(2, 8)}`;
  const { config } = usePortfolio();

  if (variant === 'youtube') {
    const sizeClasses = {
      sm: 'w-10 h-7 rounded-lg',
      md: 'w-12 h-8 sm:w-14 sm:h-9 rounded-xl',
      lg: 'w-16 h-11 sm:w-20 sm:h-13 rounded-2xl'
    };

    const playSizes = {
      sm: 'w-3.5 h-3.5',
      md: 'w-5 h-5',
      lg: 'w-7 h-7'
    };

    return (
      <div
        className={`relative inline-flex items-center justify-center bg-gradient-to-tr from-[#CC0000] via-[#FF0000] to-[#FF3333] text-white shadow-[0_6px_20px_rgba(255,0,0,0.5)] group-hover:shadow-[0_10px_30px_rgba(255,0,0,0.8)] group-hover:scale-110 transition-all duration-300 border border-white/20 overflow-hidden ${sizeClasses[size]} ${className}`}
      >
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${playSizes[size]} text-white ml-0.5 filter drop-shadow-sm relative z-10`}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    );
  }

  const accentHex = config?.accentColor || '#FF6A00';
  const shades = getAccentShades(accentHex);

  const containerSizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12 sm:w-16 sm:h-16',
    lg: 'w-16 h-16 sm:w-20 sm:h-20'
  };

  const svgSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-16 h-16 sm:w-18 sm:h-18'
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center group-hover:scale-115 transition-transform duration-300 ${containerSizes[size]} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${svgSizes[size]} relative z-10 ml-0.5 filter drop-shadow-[0_4px_16px_var(--accent-glow)]`}
      >
        <defs>
          <linearGradient id={`accent-grad-${uniqueId}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={shades.deep} />
            <stop offset="50%" stopColor={shades.main} />
            <stop offset="100%" stopColor={shades.light} />
          </linearGradient>
        </defs>

        <path
          d="M 8 5.5 C 8 4.3 9.3 3.5 10.4 4.2 L 19.3 10.7 C 20.4 11.4 20.4 12.6 19.3 13.3 L 10.4 19.8 C 9.3 20.5 8 19.7 8 18.5 Z"
          fill={`rgba(${shades.rgb}, 0.15)`}
          stroke={`url(#accent-grad-${uniqueId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const InstagramPlayIcon = YouTubePlayIcon;
export const AccentPlayIcon = YouTubePlayIcon;



