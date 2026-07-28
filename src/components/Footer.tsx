import React from 'react';
import { Instagram } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

// Custom WhatsApp Icon
const WhatsappIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="currentColor">
    <path d="M16 2A13.93 13.93 0 0 0 3.86 22.84L2 29.6l6.98-1.81A13.92 13.92 0 1 0 16 2zm0 25.5a11.52 11.52 0 0 1-5.88-1.61l-.42-.25-4.37 1.13 1.16-4.24-.28-.44a11.53 11.53 0 1 1 9.79 5.41zm6.33-8.62c-.35-.17-2.05-1.01-2.37-1.13s-.55-.17-.78.17-.9 1.13-1.1 1.36-.41.26-.75.09a9.52 9.52 0 0 1-2.8-1.73 10.48 10.48 0 0 1-1.94-2.42c-.21-.35-.02-.54.15-.71.15-.15.35-.41.52-.61a2.36 2.36 0 0 0 .35-.58.64.64 0 0 0-.03-.61c-.09-.17-.78-1.89-1.08-2.58-.29-.68-.58-.59-.79-.6h-.68a1.3 1.3 0 0 0-.94.44A3.92 3.92 0 0 0 9 12.31a6.83 6.83 0 0 0 1.43 3.62 15.68 15.68 0 0 0 6.01 5.31c.84.36 1.5.58 2.01.74a4.83 4.83 0 0 0 2.22.14 3.63 3.63 0 0 0 2.38-1.68 2.94 2.94 0 0 0 .21-1.68c-.08-.13-.3-.21-.65-.38z" />
  </svg>
);

// Custom Iconic YouTube Play Vector Icon
const YoutubePlayIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const Footer: React.FC = () => {
  const { config } = usePortfolio();
  const { socialLinks } = config;

  return (
    <footer className="bg-[#090B0D] py-16 text-center text-white border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Brand Name */}
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          <span className="text-white footer-monir-text">Monir</span><span className="text-[#FF6A00]">Editz</span>
        </h3>

        {/* 3 Social Icon Circles: WhatsApp, Instagram, YouTube */}
        <div className="flex items-center justify-center gap-4">
          {/* WhatsApp */}
          <a
            href={socialLinks.whatsapp || 'https://wa.me/1234567890'}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#25D366]/25"
          >
            <WhatsappIcon className="w-6 h-6 fill-white" />
          </a>

          {/* Instagram */}
          <a
            href={socialLinks.instagram || 'https://instagram.com/MonirEditz'}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-purple-500/20"
          >
            <Instagram className="w-5 h-5" />
          </a>

          {/* YouTube */}
          <a
            href={socialLinks.youtube || 'https://youtube.com/@MonirEditz'}
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="w-12 h-12 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-red-600/25"
          >
            <YoutubePlayIcon className="w-6 h-6 fill-white" />
          </a>
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg font-black tracking-tight text-white footer-tagline">
          Disciplined. Creative. Reliable.
        </p>

        {/* Navigation Menu */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-bold text-gray-300 pt-2">
          <a href="#home" className="hover:text-[#FF6A00] transition-colors">Home</a>
          <a href="#work" className="hover:text-[#FF6A00] transition-colors">Works</a>
          <a href="#about" className="hover:text-[#FF6A00] transition-colors">About</a>
          <a href="#gallery" className="hover:text-[#FF6A00] transition-colors">Lifestyle</a>
          <a href="#contact" className="hover:text-[#FF6A00] transition-colors">Contact</a>
        </div>

        {/* Copyright */}
        <p
          className="text-xs text-gray-500 font-medium pt-2 selection:bg-transparent"
        >
          © 2026 MonirEditz. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
};
