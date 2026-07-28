import React from 'react';

interface YouTubePlayIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const YouTubePlayIcon: React.FC<YouTubePlayIconProps> = ({ className = '', size = 'md' }) => {
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
    <div className={`relative inline-flex items-center justify-center bg-gradient-to-tr from-[#CC0000] via-[#FF0000] to-[#FF3333] text-white shadow-[0_6px_20px_rgba(255,0,0,0.5)] group-hover:shadow-[0_10px_30px_rgba(255,0,0,0.8)] group-hover:scale-110 transition-all duration-300 border border-white/20 overflow-hidden ${sizeClasses[size]} ${className}`}>
      {/* Top subtle gloss highlight */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
      
      {/* YouTube White Play Triangle */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${playSizes[size]} text-white ml-0.5 filter drop-shadow-sm relative z-10`}
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
};
