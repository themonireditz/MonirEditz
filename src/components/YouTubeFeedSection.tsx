import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { YouTubePlayIcon } from './YouTubePlayIcon';
import { getYouTubeThumbnail, fetchYouTubeVideos } from '../utils/youtube';
import { VideoItem } from '../types/portfolio';

export const YouTubeFeedSection: React.FC = () => {
  const { config, setActiveVideoPlayer, theme } = usePortfolio();
  const { youtubeConfig } = config;
  
  const [liveVideos, setLiveVideos] = useState<VideoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
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

  useEffect(() => {
    let isMounted = true;
    const loadVideos = async () => {
      if (youtubeConfig.channelId) {
        const fetched = await fetchYouTubeVideos(youtubeConfig.apiKey || '', youtubeConfig.channelId);
        if (isMounted && fetched && fetched.length > 0) {
          const mapped: VideoItem[] = fetched.map((v) => ({
            id: v.id,
            title: v.title,
            videoUrl: v.url,
            embedId: v.id,
            thumbnailUrl: v.thumbnail,
            client: 'MonirEditz'
          }));
          setLiveVideos(mapped);
        }
      }
    };
    loadVideos();
    return () => { isMounted = false; };
  }, [youtubeConfig.channelId, youtubeConfig.apiKey]);

  const videos = liveVideos.length > 0 ? liveVideos : (youtubeConfig.customVideos || []);

  const displayVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    return [...videos, ...videos];
  }, [videos]);

  if (!videos || videos.length === 0) return null;

  const handlePrev = () => {
    const total = videos.length;
    if (!total) return;

    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(total);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setCurrentIndex(total - 1);
        });
      });
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  // Reset seamless loop when currentIndex reaches or exceeds original videos count
  useEffect(() => {
    if (!videos || videos.length === 0) return;
    const total = videos.length;

    if (currentIndex >= total) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex((prev) => prev % total);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, videos]);

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

  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const isAutoplayEnabled = config?.youtubeFeedAutoplay !== undefined ? config.youtubeFeedAutoplay : config?.carouselAutoplay !== false;
    if (!isAutoplayEnabled) return;
    if (!videos || videos.length <= (isMobile ? 1 : 3)) return;
    if (isHovered || isDragging) return;

    const interval = setInterval(() => {
      handleNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [config?.youtubeFeedAutoplay, config?.carouselAutoplay, videos, isMobile, isHovered, isDragging]);

  const percentShift = isMobile ? currentIndex * 100 : currentIndex * (100 / 3);
  const remShift = isMobile ? currentIndex * 1.25 : currentIndex * 0.5833;

  return (
    <section id="youtube" className="py-20 lg:py-28 bg-[#090B0D] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center gpu-accelerated"
        >
          <h2 className={`youtube-feed-section-title text-4xl sm:text-6xl font-black tracking-tight text-center ${
            theme === 'light' ? 'text-slate-900' : 'text-white'
          }`}>
            Latest <span className="text-accent">YouTube Videos</span>
          </h2>
        </motion.div>

        {/* Carousel Outer Container */}
        <div className="space-y-6">
          {/* Main Cards Grid & Navigation Arrows Container */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative max-w-6xl mx-auto px-1 sm:px-4 lg:px-6"
          >
            {/* Previous Arrow Button */}
            <motion.button
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              id="youtube-prev-btn"
              className="absolute left-1 sm:left-2 lg:-left-5 top-[42%] -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-transparent text-accent flex items-center justify-center transition-all cursor-pointer filter drop-shadow-[0_2px_8px_var(--accent-glow)]"
              aria-label="Previous videos"
            >
              <ChevronLeft className="w-8 h-8 stroke-[3]" />
            </motion.button>

            {/* Next Arrow Button */}
            <motion.button
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              id="youtube-next-btn"
              className="absolute right-1 sm:right-2 lg:-right-5 top-[42%] -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-transparent text-accent flex items-center justify-center transition-all cursor-pointer filter drop-shadow-[0_2px_8px_var(--accent-glow)]"
              aria-label="Next videos"
            >
              <ChevronRight className="w-8 h-8 stroke-[3]" />
            </motion.button>

            {/* Sliding Track Viewport Container with touch gesture */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="overflow-hidden p-1 rounded-2xl touch-pan-y"
            >
              <div
                className="flex gap-5 sm:gap-7"
                style={{
                  transform: `translateX(calc(-${percentShift}% - ${remShift}rem + ${touchDragX}px))`,
                  transition: isDragging || !isTransitioning ? 'none' : 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              >
                {displayVideos.map((video, idx) => {
                  const rawThumb = video.thumbnailUrl || getYouTubeThumbnail(video.videoUrl, video.embedId) || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80';
                  // Prefer maxresdefault for 16:9 full-width resolution without YouTube pillarboxes
                  const hdThumb = rawThumb.replace('/hqdefault.jpg', '/maxresdefault.jpg').replace('/mqdefault.jpg', '/maxresdefault.jpg');

                  return (
                    <div
                      key={`${video.id}-${idx}`}
                      onClick={() => {
                        if (Math.abs(touchDragX) > 10) return;
                        setActiveVideoPlayer(video);
                      }}
                      className={`w-full md:w-[calc(33.333%-1.166rem)] flex-shrink-0 group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl ${
                        theme === 'light'
                          ? 'bg-white border-slate-200 hover:border-accent hover:shadow-2xl'
                          : 'bg-[#12161A] border-white/10 hover:border-accent/60 hover:shadow-2xl'
                      }`}
                    >
                      {/* Video Thumbnail - Flush to top, left, right */}
                      <div className="relative aspect-video w-full rounded-t-2xl overflow-hidden bg-black">
                        <img
                          src={hdThumb}
                          alt={video.title}
                          className="w-full h-full object-cover scale-[1.12] group-hover:scale-[1.16] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-90"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src.includes('maxresdefault.jpg')) {
                              target.src = target.src.replace('/maxresdefault.jpg', '/hqdefault.jpg');
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                        {/* YouTube Play Icon */}
                        <div className="absolute inset-0 m-auto w-fit h-fit flex items-center justify-center">
                          <YouTubePlayIcon size="md" variant="youtube" />
                        </div>
                      </div>

                      {/* Video Title Container */}
                      <div className="px-3.5 py-3 sm:px-4 sm:py-3.5 text-left">
                        <h4 className={`youtube-card-title text-xs sm:text-sm font-bold group-hover:text-accent transition-colors leading-snug line-clamp-2 ${
                          theme === 'light' ? 'text-slate-900' : 'text-white'
                        }`}>
                          {video.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {videos.map((_, i) => {
              const isActive = (currentIndex % videos.length) === i;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentIndex(i);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-8 bg-accent'
                      : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to video ${i + 1}`}
                />
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
