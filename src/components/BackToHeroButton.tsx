import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Sparkles } from 'lucide-react';

export const BackToHeroButton: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHero = () => {
    const heroEl = document.getElementById('home');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.85, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 16 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollToHero}
          aria-label="Return to top"
          title="Back to Hero Area"
          className="fixed bottom-6 right-6 z-[100] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#12161A]/90 backdrop-blur-xl border border-white/20 hover:border-accent text-white shadow-[0_8px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_0_25px_var(--accent-glow)] hover:bg-[#1A2027] transition-all flex items-center justify-center group cursor-pointer gpu-accelerated"
        >
          <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-250">
            <ArrowUp className="w-4 h-4 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
