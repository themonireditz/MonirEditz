import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Film, Sparkles, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';

export const Navbar: React.FC = () => {
  const { config, setIsAdminOpen, isAdminAuthenticated, theme } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['home', 'work', 'about', 'contact', 'gallery', 'youtube'];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'My Work', href: '#work', id: 'work' },
    { name: 'About Me', href: '#about', id: 'about' },
    { name: 'Contact', href: '#contact', id: 'contact' },
    { name: 'Lifestyle', href: '#gallery', id: 'gallery' },
    { name: 'YouTube', href: '#youtube', id: 'youtube' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-none outline-none"
    >
      {/* Navbar Top Bar */}
      <div
        className={`relative z-50 w-full transition-all duration-300 border-none outline-none ${
          scrolled
            ? theme === 'light'
              ? 'bg-white/90 backdrop-blur-md py-3 shadow-md border-b-0'
              : 'glass-nav py-3 shadow-2xl shadow-black/80 border-b-0'
            : 'bg-transparent py-3 sm:py-5 border-b-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Branding Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group font-extrabold text-xl sm:text-2xl tracking-tight"
            id="logo-brand-link"
          >
            {config.logoImageUrl ? (
              <img
                src={config.logoImageUrl}
                alt={config.logoText}
                className="h-9 w-auto object-contain rounded-md border border-white/10"
              />
            ) : (
              <span className="text-xl sm:text-2xl font-black tracking-tight">
                <span className={`transition-colors duration-200 ${theme === 'light' && scrolled ? 'text-black' : 'text-white'}`}>Monir</span>
                <span className="text-accent">Editz</span>
              </span>
            )}
          </a>

          {/* Desktop Navigation Links (7 items including CTA) */}
          <nav className={`hidden lg:flex items-center gap-1 xl:gap-2 px-4 py-1.5 rounded-full border transition-all ${
            theme === 'light'
              ? 'bg-white/90 border-slate-300/80 shadow-md backdrop-blur-md'
              : 'glass-panel border-white/10'
          }`}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-black font-semibold'
                      : theme === 'light'
                      ? 'text-slate-800 hover:text-black'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-full bg-accent shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Contact CTA */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              id="nav-cta-btn"
              className="group flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-accent text-black font-bold text-xs sm:text-sm hover:brightness-110 transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] glow-accent-sm active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <span>Book Edit</span>
            </a>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg border transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                  : 'bg-white/5 text-gray-300 hover:text-white border-white/10'
              }`}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Compact Floating Floating Card relative to Header) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay to catch click outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ type: 'spring', damping: 25, stiffness: 380 }}
              className={`absolute top-full right-4 mt-2 z-50 lg:hidden w-[270px] sm:w-[290px] p-2.5 rounded-2xl border backdrop-blur-2xl ${
                theme === 'light'
                  ? 'bg-white/98 border-slate-200 text-slate-900 shadow-2xl shadow-slate-900/20'
                  : 'bg-[#12161A]/95 border-white/15 text-gray-200 shadow-[0_15px_40px_rgba(0,0,0,0.9)]'
              }`}
              style={{ transformOrigin: 'top right' }}
            >
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
                  closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } }
                }}
                className="flex flex-col gap-1.5"
              >
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <motion.a
                      key={link.id}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      variants={{
                        open: { opacity: 1, x: 0, scale: 1 },
                        closed: { opacity: 0, x: 12, scale: 0.96 }
                      }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ x: 3, scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-accent text-black font-extrabold shadow-sm'
                          : theme === 'light'
                          ? 'mobile-nav-link-inactive text-slate-800 hover:bg-slate-100 hover:text-black'
                          : 'text-gray-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{link.name}</span>
                      <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-black opacity-90' : theme === 'light' ? 'text-slate-500' : 'opacity-70'}`} />
                    </motion.a>
                  );
                })}
                <motion.div
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: 8 }
                  }}
                  transition={{ duration: 0.2 }}
                  className={`pt-2 mt-1 border-t ${theme === 'light' ? 'border-slate-200' : 'border-white/10'} flex flex-col gap-1.5`}
                >
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, '#contact')}
                    className="w-full py-2.5 px-3 rounded-xl bg-accent text-black font-bold text-xs text-center glow-accent flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Book a Discovery Call
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
