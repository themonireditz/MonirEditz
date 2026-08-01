import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ShowcaseVideoSection: React.FC = () => {
  const { config } = usePortfolio();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Showcase Video URL from config or fallback loop video
  const videoUrl =
    config.hero?.showcaseVideoUrl ||
    'https://assets.mixkit.co/videos/preview/mixkit-working-on-a-video-editing-timeline-41552-large.mp4';

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.volume = 1;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay attempt failed, try again muted
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
          });
      }
    }
  }, [videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="hidden sm:block relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8"
    >
      {/* Container with strict 16:9 aspect ratio (aspect-video) */}
      <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-black/90 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          controls={false}
          onEnded={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(() => {});
            }
          }}
          className="w-full h-full object-cover select-none pointer-events-none"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-editing-video-41549-large.mp4" type="video/mp4" />
        </video>

        {/* Subtle ambient gradient overlay at bottom for pill visibility */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Floating Controls Pill Overlay (Bottom Left Overlay) */}
        <div className="absolute bottom-2 left-2 sm:bottom-6 sm:left-6 z-20 flex items-center gap-1.5 sm:gap-2.5">
          {/* Pause / Play Pill Button */}
          <button
            onClick={togglePlay}
            id="showcase-video-toggle-play"
            className="flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/10 text-[10px] sm:text-sm font-medium text-white shadow-xl transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 cursor-pointer hover:border-white/25"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white text-white shrink-0" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white text-white shrink-0" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Sound Mute / Unmute Pill Button */}
          <button
            onClick={toggleMute}
            id="showcase-video-toggle-sound"
            className="flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/10 text-[10px] sm:text-sm font-medium text-white shadow-xl transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 cursor-pointer hover:border-white/25"
            aria-label={isMuted ? 'Enable sound' : 'Disable sound'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-gray-300 shrink-0" />
                <span>Sound Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-accent shrink-0" />
                <span>Sound On</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.section>
  );
};
