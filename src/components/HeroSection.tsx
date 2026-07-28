import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const HeroSection: React.FC = () => {
  const { config } = usePortfolio();
  const { hero } = config;

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(href.replace('#', ''));
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const videoUrl = hero?.videoBgUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-editing-video-41549-large.mp4';
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const ytId = getYouTubeId(videoUrl);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.volume = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }

    // Reset Media Session if supported so browser doesn't trigger media hub overlay
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = 'none';
        navigator.mediaSession.metadata = null;
        ['play', 'pause', 'previoustrack', 'nexttrack', 'seekbackward', 'seekforward'].forEach((action) => {
          try {
            navigator.mediaSession.setActionHandler(action as MediaSessionAction, null);
          } catch (e) {
            // Ignore
          }
        });
      } catch (e) {
        // Ignore
      }
    }
  }, [videoUrl]);

  return (
    <section id="home" className="relative min-h-screen min-h-[100dvh] flex flex-col items-center justify-center pt-20 sm:pt-28 pb-16 px-4 overflow-hidden text-center">
      {/* Background Video / Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {isYouTube ? (
          <iframe
            key={ytId}
            className="w-[400%] h-[400%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60 filter brightness-105 contrast-110 object-cover"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1&enablejsapi=1&disablekb=1&fs=0&modestbranding=1&iv_load_policy=3&rel=0`}
            title="Hero Background Video"
            allow="autoplay; encrypted-media"
          />
        ) : (
          <video
            ref={videoRef}
            key={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            tabIndex={-1}
            aria-hidden="true"
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload no remoteplayback noplaybackrate"
            poster="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80"
            className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover opacity-80 scale-105 filter brightness-100 contrast-105 transition-opacity duration-1000 pointer-events-none select-none"
          >
            {videoUrl && <source src={videoUrl} type="video/mp4" />}
            <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-video-editing-software-41551-large.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-working-on-a-video-editing-timeline-41552-large.mp4" type="video/mp4" />
          </video>
        )}
        
        {/* Dark warm ambient overlay matching reference - translucent to let video show clearly */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090B0D]/30 via-transparent to-[#090B0D]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/15 via-transparent to-transparent pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center space-y-8"
      >
        
        {/* Available Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161A1E]/80 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-semibold shadow-lg"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]" />
          <span className="text-white badge-white-text font-semibold">{hero.badgeText}</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] max-w-4xl"
        >
          <span className="text-white !text-white hero-headline-light">Crafting Stories<br />That </span><span className="text-[#FF6A00]">Captivate.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="text-base sm:text-lg md:text-xl text-white !text-white font-medium max-w-2xl leading-relaxed"
        >
          {hero.subheadline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 pt-2 w-full max-w-sm sm:max-w-none px-2 sm:px-0"
        >
          <motion.a
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            href={hero.primaryCtaLink}
            onClick={(e) => handleCtaClick(e, hero.primaryCtaLink)}
            id="hero-see-my-work-btn"
            className="flex-1 sm:flex-none px-4 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF8800] text-white font-extrabold text-xs sm:text-base hover:brightness-110 transition-all shadow-[0_0_22px_rgba(255,106,0,0.45)] hover:shadow-[0_0_32px_rgba(255,106,0,0.7)] border border-amber-300/30 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>{hero.primaryCtaText}</span>
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            href={hero.secondaryCtaLink}
            onClick={(e) => handleCtaClick(e, hero.secondaryCtaLink)}
            id="hero-lets-work-btn"
            className="flex-1 sm:flex-none px-4 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#181C21]/90 backdrop-blur-md text-white font-bold text-xs sm:text-base border border-white/15 hover:border-[#FF6A00]/50 hover:bg-[#22272E] transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>{hero.secondaryCtaText}</span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6A00]" />
          </motion.a>
        </motion.div>

        {/* Mouse Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.65, ease: 'easeOut' }}
          className="pt-8 flex justify-center"
        >
          <a
            href="#work"
            onClick={(e) => handleCtaClick(e, '#work')}
            aria-label="Scroll down"
            className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center p-1 hover:border-[#FF6A00] transition-colors"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full bg-[#FF6A00]"
            />
          </a>
        </motion.div>

      </motion.div>
    </section>
  );
};

function getYouTubeId(url: string): string {
  if (!url) return 'L_LUpnjgPso';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : 'L_LUpnjgPso';
}
