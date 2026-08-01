import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = usePortfolio();
  const [isHovered, setIsHovered] = useState(false);

  const isLight = theme === 'light';

  return (
    <div className="fixed right-3 sm:right-5 top-20 sm:top-24 z-[100] flex items-center group">
      {/* Label Tooltip on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#12161A] text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-white/10 pointer-events-none hidden sm:block"
          >
            {isLight ? 'Switch to Dark Mode 🌙' : 'Switch to Light Mode ☀️'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Animated Wrapper */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* Subtle Ambient Glow Ring */}
        <div
          className={`absolute -inset-1 rounded-2xl blur-md transition-opacity duration-300 pointer-events-none ${
            isLight
              ? 'bg-amber-400/25 opacity-60 group-hover:opacity-100'
              : 'bg-accent/30 opacity-60 group-hover:opacity-100'
          }`}
        />

        {/* Floating Toggle Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08, rotate: 6 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleTheme}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Toggle Night and Light mode"
          className={`relative p-2 sm:p-2.5 rounded-xl shadow-xl backdrop-blur-xl border transition-all duration-300 cursor-pointer flex items-center justify-center ${
            isLight
              ? 'bg-white/95 border-amber-300/80 text-amber-600 shadow-amber-500/25 hover:border-amber-500 hover:shadow-amber-500/40'
              : 'bg-[#12161A]/95 border-white/20 text-accent shadow-[0_0_20px_var(--accent-glow)] hover:border-accent hover:shadow-[0_0_25px_var(--accent-glow)]'
          }`}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {isLight ? (
              <Sun className="w-4 h-4 sm:w-4 sm:h-4 fill-amber-400 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 sm:w-4 sm:h-4 fill-[var(--accent-color)] text-accent" />
            )}
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
};
