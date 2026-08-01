import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';

interface FullWidthBannerVideoProps {
  customVideoUrl?: string;
}

export const FullWidthBannerVideo: React.FC<FullWidthBannerVideoProps> = ({ customVideoUrl }) => {
  const { config } = usePortfolio();
  const pcVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // PC & Tablet Banner Video URL (under About Me)
  const pcVideoUrl =
    customVideoUrl ||
    config?.about?.bannerVideoUrl ||
    config?.hero?.showcaseVideoUrl ||
    'https://assets.mixkit.co/videos/preview/mixkit-working-on-a-video-editing-timeline-41552-large.mp4';

  // Mobile Banner Video URL (under About Me)
  const mobileVideoUrl =
    config?.about?.bannerVideoMobileUrl ||
    config?.hero?.showcaseVideoMobileUrl ||
    pcVideoUrl;

  useEffect(() => {
    [pcVideoRef, mobileVideoRef].forEach((ref) => {
      if (ref.current) {
        ref.current.muted = true;
        ref.current.defaultMuted = true;
        const playPromise = ref.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (ref.current) {
              ref.current.muted = true;
              ref.current.play().catch(() => {});
            }
          });
        }
      }
    });
  }, [pcVideoUrl, mobileVideoUrl]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full mt-2 sm:mt-3 mb-16 sm:mb-24 lg:mb-28"
    >
      {/* Outer container: full-width edge-to-edge on mobile, constrained with padding & rounded corners on tablet & desktop */}
      <div className="w-full sm:max-w-6xl sm:mx-auto sm:px-6 lg:px-8">
        <div className="relative w-full aspect-video sm:aspect-auto sm:h-[180px] lg:h-[210px] overflow-hidden sm:rounded-2xl lg:rounded-3xl border-0 border-none shadow-2xl bg-black/90 group">
          
          {/* PC & Tablet View Video (Hidden on Mobile) */}
          <video
            ref={pcVideoRef}
            src={pcVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controls={false}
            onEnded={(e) => {
              e.currentTarget.currentTime = 0;
              e.currentTarget.play().catch(() => {});
            }}
            className="hidden sm:block w-full h-full object-cover select-none pointer-events-none"
          >
            <source src={pcVideoUrl} type="video/mp4" />
          </video>

          {/* Mobile View Video (Shown on Mobile only) */}
          <video
            ref={mobileVideoRef}
            src={mobileVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controls={false}
            onEnded={(e) => {
              e.currentTarget.currentTime = 0;
              e.currentTarget.play().catch(() => {});
            }}
            className="block sm:hidden w-full h-full object-cover select-none pointer-events-none"
          >
            <source src={mobileVideoUrl} type="video/mp4" />
          </video>

          {/* Subtle vignette dark gradients for top & bottom blending */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.section>
  );
};

