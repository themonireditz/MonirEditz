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
    <section id="home" className="relative min-h-screen min-h-[100dvh] flex flex-col items-center justify-center pt-20 sm:pt-28 pb-16 px-2 min-[360px]:px-3 sm:px-4 overflow-hidden text-center">
      {/* Background Video / Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {isYouTube ? (
          <iframe
            key={ytId}
            className="w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-70 filter brightness-100 contrast-105 object-cover scale-100 origin-center border-0 border-none outline-none"
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1&enablejsapi=1&disablekb=1&fs=0&modestbranding=1&iv_load_policy=3&rel=0&autohide=1&showinfo=0`}
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
            poster={hero.posterUrl || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80"}
            className="absolute inset-0 w-full h-full object-cover opacity-80 filter brightness-100 contrast-105 transition-opacity duration-1000 pointer-events-none select-none border-0 border-none outline-none"
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
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center space-y-8 gpu-accelerated"
      >
        
        {/* Available Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161A1E]/80 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-semibold shadow-lg"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]" />
          <span className="text-white badge-white-text font-semibold">{hero.badgeText}</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[2.5rem] min-[380px]:text-[2.85rem] min-[420px]:text-[3.15rem] sm:text-7xl md:text-8xl lg:text-[5.5rem] font-black tracking-[-0.03em] leading-[1.06] max-w-5xl"
        >
          <span className="block text-white !text-white hero-headline-light whitespace-nowrap">Crafting Stories</span>
          <span className="block whitespace-nowrap mt-0.5 sm:mt-0">
            <span className="text-white !text-white hero-headline-light">That </span>
            <span className="text-accent">Captivate.</span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm sm:text-base md:text-lg text-white/90 !text-white/90 font-medium max-w-xl leading-relaxed"
        >
          {hero.subheadline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 pt-2 w-full max-w-sm sm:max-w-none px-2 sm:px-0"
        >
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            href={hero.primaryCtaLink}
            onClick={(e) => handleCtaClick(e, hero.primaryCtaLink)}
            id="hero-see-my-work-btn"
            className="group flex-1 sm:flex-none px-4 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-accent text-white font-extrabold text-xs sm:text-base hover:brightness-110 transition-all shadow-[0_0_22px_var(--accent-glow)] hover:shadow-[0_0_32px_var(--accent-glow)] border border-white/20 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>{hero.primaryCtaText}</span>
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white group-hover:translate-x-1 transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            href={hero.secondaryCtaLink}
            onClick={(e) => handleCtaClick(e, hero.secondaryCtaLink)}
            id="hero-lets-work-btn"
            className="group flex-1 sm:flex-none px-4 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#181C21]/90 backdrop-blur-md text-white font-bold text-xs sm:text-base border border-white/15 hover:border-accent/60 hover:bg-[#22272E] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>{hero.secondaryCtaText}</span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent group-hover:translate-x-1 transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </motion.a>
        </motion.div>

        {/* Mouse Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8 flex justify-center"
        >
          <a
            href="#work"
            onClick={(e) => handleCtaClick(e, '#work')}
            aria-label="Scroll down"
            className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center p-1 hover:border-accent transition-colors duration-250"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full bg-accent"
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
