import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { YouTubePlayIcon } from './YouTubePlayIcon';
import { getYouTubeThumbnail } from '../utils/youtube';

export const YouTubeFeedSection: React.FC = () => {
  const { config, setActiveVideoPlayer, theme } = usePortfolio();
  const { youtubeConfig } = config;
  const videos = youtubeConfig.customVideos || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Touch gesture state for mobile touch drag & swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDragX, setTouchDragX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!videos || videos.length === 0) return null;

  const maxIndex = isMobile ? videos.length - 1 : Math.max(0, videos.length - 3);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
    setTouchDragX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentX = e.touches[0].clientX;
    setTouchDragX(currentX - touchStart);
  };

  const handleTouchEnd = () => {
    if (touchStart !== null) {
      if (touchDragX < -40) {
        handleNext();
      } else if (touchDragX > 40) {
        handlePrev();
      }
    }
    setTouchStart(null);
    setIsDragging(false);
    setTouchDragX(0);
  };

  const percentShift = isMobile ? currentIndex * 100 : currentIndex * (100 / 3);
  const remShift = isMobile ? currentIndex * 1.5 : currentIndex * 0.5;

  return (
    <section id="youtube" className="py-20 lg:py-28 bg-[#090B0D] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2 className={`youtube-feed-section-title text-4xl sm:text-6xl font-black tracking-tight text-center ${
            theme === 'light' ? 'text-slate-900' : 'text-white'
          }`}>
            Latest <span className="text-[#FF6A00]">YouTube Videos</span>
          </h2>
        </motion.div>

        {/* Carousel Outer Container */}
        <div className="space-y-6">
          {/* Main Cards Grid & Navigation Arrows Container */}
          <div className="relative px-3 sm:px-10">
            {/* Previous Arrow Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              id="youtube-prev-btn"
              className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#FF6A00] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.5)] hover:bg-[#e55f00] transition-all cursor-pointer"
              aria-label="Previous videos"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
            </motion.button>

            {/* Next Arrow Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              id="youtube-next-btn"
              className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#FF6A00] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.5)] hover:bg-[#e55f00] transition-all cursor-pointer"
              aria-label="Next videos"
            >
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </motion.button>

            {/* Sliding Track Viewport Container with touch gesture */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="overflow-hidden p-1 rounded-2xl touch-pan-y"
            >
              <div
                className="flex gap-6"
                style={{
                  transform: `translateX(calc(-${percentShift}% - ${remShift}rem + ${touchDragX}px))`,
                  transition: isDragging ? 'none' : 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              >
                {videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      if (Math.abs(touchDragX) > 10) return;
                      setActiveVideoPlayer(video);
                    }}
                    className={`w-full md:w-[calc(33.333%-1rem)] flex-shrink-0 group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl ${
                      theme === 'light'
                        ? 'bg-white border-slate-200 hover:border-[#FF6A00]'
                        : 'bg-[#12161A] border-white/10 hover:border-[#FF6A00]/60'
                    }`}
                  >
                    {/* Video Thumbnail - Flush to top, left, right */}
                    <div className="relative aspect-video w-full rounded-t-2xl overflow-hidden bg-black">
                      <img
                        src={video.thumbnailUrl || getYouTubeThumbnail(video.videoUrl, video.embedId) || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                        onError={(e) => {
                          const fallback = getYouTubeThumbnail(video.videoUrl, video.embedId);
                          if (fallback && (e.target as HTMLImageElement).src !== fallback) {
                            (e.target as HTMLImageElement).src = fallback;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                      {/* YouTube Play Icon */}
                      <div className="absolute inset-0 m-auto w-fit h-fit flex items-center justify-center">
                        <YouTubePlayIcon size="md" />
                      </div>
                    </div>

                    {/* Video Title Container with padding */}
                    <div className="p-4 sm:p-5 text-left">
                      <h4 className={`youtube-card-title text-base sm:text-lg font-bold group-hover:text-[#FF6A00] transition-colors leading-snug line-clamp-2 ${
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}>
                        {video.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === i
                    ? 'w-8 bg-[#FF6A00]'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to video ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
