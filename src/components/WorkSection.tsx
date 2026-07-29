import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronLeft, ChevronRight, ExternalLink, Maximize2, X, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { NicheSubpageModal } from './NicheSubpageModal';
import { ThumbnailItem } from '../types/portfolio';
import { YouTubePlayIcon } from './YouTubePlayIcon';
import { extractYouTubeId, getYouTubeThumbnail } from '../utils/youtube';

export const WorkSection: React.FC = () => {
  const { config, setActiveVideoPlayer, activeNicheModal, setActiveNicheModal, theme } = usePortfolio();
  const { niches, shorts, thumbnails } = config;

  // Active index for Shorts CoverFlow carousel
  const [activeShortIndex, setActiveShortIndex] = useState(0);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<ThumbnailItem | null>(null);

  // Touch swipe gesture states with requestAnimationFrame throttling for 60fps smoothness
  const [shortTouchStart, setShortTouchStart] = useState<number | null>(null);
  const [shortDragX, setShortDragX] = useState<number>(0);
  const [isDraggingShort, setIsDraggingShort] = useState<boolean>(false);

  const [thumbTouchStart, setThumbTouchStart] = useState<number | null>(null);
  const [thumbDragX, setThumbDragX] = useState<number>(0);
  const [isDraggingThumb, setIsDraggingThumb] = useState<boolean>(false);

  const shortAnimFrameRef = React.useRef<number | null>(null);
  const thumbAnimFrameRef = React.useRef<number | null>(null);

  const handleShortTouchStart = (e: React.TouchEvent) => {
    setShortTouchStart(e.touches[0].clientX);
    setIsDraggingShort(true);
    setShortDragX(0);
  };

  const handleShortTouchMove = (e: React.TouchEvent) => {
    if (shortTouchStart === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - shortTouchStart;
    if (shortAnimFrameRef.current) cancelAnimationFrame(shortAnimFrameRef.current);
    shortAnimFrameRef.current = requestAnimationFrame(() => {
      setShortDragX(diff);
    });
  };

  const handleShortTouchEnd = () => {
    if (shortAnimFrameRef.current) cancelAnimationFrame(shortAnimFrameRef.current);
    if (shortTouchStart !== null) {
      if (shortDragX < -35) {
        nextShort();
      } else if (shortDragX > 35) {
        prevShort();
      }
    }
    setShortTouchStart(null);
    setIsDraggingShort(false);
    setShortDragX(0);
  };

  const handleThumbTouchStart = (e: React.TouchEvent) => {
    setThumbTouchStart(e.touches[0].clientX);
    setIsDraggingThumb(true);
    setThumbDragX(0);
  };

  const handleThumbTouchMove = (e: React.TouchEvent) => {
    if (thumbTouchStart === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - thumbTouchStart;
    if (thumbAnimFrameRef.current) cancelAnimationFrame(thumbAnimFrameRef.current);
    thumbAnimFrameRef.current = requestAnimationFrame(() => {
      setThumbDragX(diff);
    });
  };

  const handleThumbTouchEnd = () => {
    if (thumbAnimFrameRef.current) cancelAnimationFrame(thumbAnimFrameRef.current);
    if (thumbTouchStart !== null) {
      if (thumbDragX < -35) {
        nextThumb();
      } else if (thumbDragX > 35) {
        prevThumb();
      }
    }
    setThumbTouchStart(null);
    setIsDraggingThumb(false);
    setThumbDragX(0);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedThumbnail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const prevShort = () => {
    setActiveShortIndex((prev) => (prev === 0 ? shorts.length - 1 : prev - 1));
  };

  const nextShort = () => {
    setActiveShortIndex((prev) => (prev === shorts.length - 1 ? 0 : prev + 1));
  };

  const visibleThumbCount = isMobile ? 1 : 2;
  const maxThumbIndex = Math.max(0, thumbnails.length - visibleThumbCount);

  const prevThumb = () => {
    setActiveThumbIndex((prev) => (prev === 0 ? maxThumbIndex : prev - 1));
  };

  const nextThumb = () => {
    setActiveThumbIndex((prev) => (prev >= maxThumbIndex ? 0 : prev + 1));
  };

  return (
    <section id="work" className="py-20 lg:py-28 bg-[#090B0D] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Main Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-2"
        >
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-center">
            My <span className="text-[#FF6A00]">Work</span>
          </h2>
        </motion.div>

        {/* ========================================================================= */}
        {/* SUB-SECTION 1: LONG CONTENT (2x2 GRID) */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          <motion.h3
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`work-subsection-title text-2xl sm:text-3xl font-extrabold text-center ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            Long Content
          </motion.h3>

          {/* 2x2 Grid */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {niches.map((niche, idx) => (
              <motion.div
                key={niche.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, scale: 1.01 }}
                onClick={() => setActiveNicheModal(niche)}
                className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl ${
                  theme === 'light'
                    ? 'bg-white border-slate-200/90 hover:border-[#FF6A00]'
                    : 'bg-[#12161A] border-white/10 hover:border-[#FF6A00]/50'
                }`}
              >
                {/* Thumbnail Container - Flush to Top, Left, and Right (No padding around video) */}
                <div className="relative aspect-video w-full rounded-t-2xl overflow-hidden bg-black">
                  <img
                    src={niche.coverImage || niche.featuredVideo.thumbnailUrl || getYouTubeThumbnail(niche.featuredVideo.videoUrl, niche.featuredVideo.embedId) || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'}
                    alt={niche.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Glossy YouTube Play Icon */}
                  <div className="absolute inset-0 m-auto w-fit h-fit flex items-center justify-center">
                    <YouTubePlayIcon size="md" />
                  </div>
                </div>

                {/* Text Details with Padding */}
                <div className="p-4 sm:p-5 space-y-1.5 text-left flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className={`niche-card-title text-lg sm:text-xl font-extrabold flex items-center gap-2 flex-wrap ${
                      theme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}>
                      <span className={theme === 'light' ? 'text-slate-900 font-extrabold' : 'text-white font-extrabold'}>{niche.title}</span>
                      <span className="text-[#FF6A00] font-semibold text-sm sm:text-base">(Click here)</span>
                      <ExternalLink className={`w-4 h-4 inline ml-0.5 ${theme === 'light' ? 'text-slate-700' : 'text-white/80'}`} />
                    </h4>
                    <p className={`text-xs sm:text-sm font-normal leading-relaxed ${
                      theme === 'light' ? 'text-slate-600' : 'text-gray-300'
                    }`}>
                      {niche.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUB-SECTION 2: SHORTS / REELS (3D CAROUSEL MATCHING IMAGE.PNG) */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          <motion.h3
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`work-subsection-title text-2xl sm:text-3xl font-extrabold text-center ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            Shorts / Reels
          </motion.h3>

          {/* Cover Flow Carousel Container with Touch Swipe & Live Finger Drag */}
          <div
            onTouchStart={handleShortTouchStart}
            onTouchMove={handleShortTouchMove}
            onTouchEnd={handleShortTouchEnd}
            className="relative overflow-hidden py-8 px-4 flex items-center justify-center min-h-[480px] touch-pan-y"
          >
            <div className="relative w-full max-w-4xl flex items-center justify-center">
              {shorts.map((item, idx) => {
                const totalShorts = shorts.length;
                // Circular offset calculation so 2 items show on the left and 2 on the right at all times
                let baseOffset = idx - activeShortIndex;
                if (totalShorts > 0) {
                  while (baseOffset > totalShorts / 2) baseOffset -= totalShorts;
                  while (baseOffset < -totalShorts / 2) baseOffset += totalShorts;
                }

                const dragRatio = shortDragX / (isMobile ? 140 : 180);
                const effectiveOffset = baseOffset + dragRatio;

                // Visibility check (keep 2 on left, 1 center, 2 on right visible)
                if (Math.abs(effectiveOffset) > 2.6) return null;

                const isCenter = Math.abs(effectiveOffset) < 0.3;

                const computedEmbedId = item.embedId || extractYouTubeId(item.videoUrl) || undefined;
                const computedThumbnail = item.thumbnailUrl || getYouTubeThumbnail(item.videoUrl, computedEmbedId) || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80';

                const translateX = effectiveOffset * (isMobile ? 135 : 175);
                const rotateY = effectiveOffset * -12;
                const scale = Math.max(0.72, 1.05 - Math.abs(effectiveOffset) * 0.12);
                const opacity = Math.max(0.25, 1 - Math.abs(effectiveOffset) * 0.28);
                const zIndex = Math.round(30 - Math.abs(effectiveOffset) * 10);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (Math.abs(shortDragX) > 10) return; // Ignore click if dragging
                      if (isCenter) {
                        setActiveVideoPlayer({
                          id: item.id,
                          title: item.title,
                          videoUrl: item.videoUrl,
                          embedId: computedEmbedId,
                          thumbnailUrl: computedThumbnail,
                          client: item.creator
                        });
                      } else {
                        setActiveShortIndex(idx);
                      }
                    }}
                    style={{
                      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                      zIndex,
                      opacity,
                      transition: isDraggingShort ? 'none' : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease-out, z-index 0.45s ease-out'
                    }}
                    className={`absolute cursor-pointer rounded-2xl overflow-hidden shadow-2xl border ${
                      isCenter ? 'border-[#FF6A00]/60 ring-2 ring-[#FF6A00]/30' : 'border-white/10'
                    }`}
                  >
                    {/* Vertical Card Frame */}
                    <div className="w-56 sm:w-64 h-[380px] sm:h-[420px] relative bg-[#12161A] overflow-hidden flex flex-col justify-between p-4 group">
                      <img
                        src={computedThumbnail}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

                      {/* Top Overlay Title */}
                      <div className="relative z-10 text-left">
                        <span className="text-sm font-bold text-white drop-shadow-md">
                          {item.title}
                        </span>
                      </div>

                      {/* Bottom Left Floating ▶ Play Button */}
                      <div className="relative z-10 self-start">
                        <button className="px-3.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg group-hover:bg-[#FF6A00] group-hover:border-[#FF6A00] transition-all">
                          <Play className="w-3.5 h-3.5 fill-white text-white" />
                          <span>Play</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Floating Orange Nav Buttons attached to active center card */}
              <button
                onClick={prevShort}
                className="absolute left-[20%] sm:left-[26%] z-40 w-11 h-11 rounded-full bg-[#FF6A00] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.6)] hover:scale-110 active:scale-95 transition-all"
                aria-label="Previous reel"
              >
                <ChevronLeft className="w-6 h-6 stroke-[3]" />
              </button>

              <button
                onClick={nextShort}
                className="absolute right-[20%] sm:right-[26%] z-40 w-11 h-11 rounded-full bg-[#FF6A00] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.6)] hover:scale-110 active:scale-95 transition-all"
                aria-label="Next reel"
              >
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUB-SECTION 3: THUMBNAILS (CAROUSEL SHOWING 2 AT A TIME WITH PREV/NEXT) */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          <motion.h3
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`work-subsection-title text-2xl sm:text-3xl font-extrabold text-center ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            Thumbnails
          </motion.h3>

          {/* Carousel Container */}
          <div className="relative max-w-5xl mx-auto px-4 sm:px-8">
            {/* Previous Arrow Button - Vertically centered on the thumbnail images */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevThumb}
              id="thumb-prev-btn"
              className="absolute -left-2 sm:-left-4 top-[40%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#FF6A00] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.5)] hover:bg-[#e55f00] transition-all cursor-pointer"
              aria-label="Previous thumbnails"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
            </motion.button>

            {/* Next Arrow Button - Vertically centered on the thumbnail images */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextThumb}
              id="thumb-next-btn"
              className="absolute -right-2 sm:-right-4 top-[40%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#FF6A00] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.5)] hover:bg-[#e55f00] transition-all cursor-pointer"
              aria-label="Next thumbnails"
            >
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </motion.button>

            {/* Sliding Track Viewport with Touch Swipe & Live Finger Drag */}
            <div
              onTouchStart={handleThumbTouchStart}
              onTouchMove={handleThumbTouchMove}
              onTouchEnd={handleThumbTouchEnd}
              className="overflow-hidden rounded-2xl p-1 touch-pan-y"
            >
              <div
                className="flex gap-6"
                style={{
                  transform: `translateX(calc(-${isMobile ? activeThumbIndex * 100 : activeThumbIndex * 50}% - ${activeThumbIndex * (isMobile ? 1.5 : 0.75)}rem + ${thumbDragX}px))`,
                  transition: isDraggingThumb ? 'none' : 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              >
                {thumbnails.map((thumb) => (
                  <div
                    key={thumb.id}
                    onClick={() => {
                      if (Math.abs(thumbDragX) > 10) return;
                      setSelectedThumbnail(thumb);
                    }}
                    className={`w-full md:w-[calc(50%-0.75rem)] flex-shrink-0 group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl ${
                      theme === 'light'
                        ? 'bg-white border-slate-200 hover:border-[#FF6A00]'
                        : 'bg-[#12161A] border-white/10 hover:border-[#FF6A00]/50'
                    }`}
                  >
                    {/* Thumbnail Image Container - Flush Top, Left, and Right */}
                    <div className="relative aspect-video w-full rounded-t-2xl overflow-hidden bg-black">
                      <img
                        src={thumb.afterImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                        alt={thumb.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      
                      {/* Sleek Hover Expand Pill - NO Youtube Red Play Button */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 px-4 py-2 rounded-full bg-black/90 backdrop-blur-md border border-white/30 text-white font-bold text-xs flex items-center gap-2 shadow-2xl">
                          <Maximize2 className="w-4 h-4 text-[#FF6A00]" />
                          <span className="!text-white font-extrabold">View Fullscreen</span>
                        </div>
                      </div>
                    </div>

                    {/* Title & CTR Tag with Padding */}
                    <div className="p-4 sm:p-5 text-left flex items-center justify-between gap-2">
                      <h4 className={`text-lg sm:text-xl font-bold group-hover:text-[#FF6A00] transition-colors ${
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}>
                        {thumb.title}
                      </h4>
                      {thumb.ctrIncrease && (
                        <span className="px-2.5 py-1 rounded-full bg-[#FF6A00]/15 text-[#FF6A00] text-xs font-bold border border-[#FF6A00]/30 whitespace-nowrap">
                          {thumb.ctrIncrease}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center justify-center gap-2 pt-6">
              {Array.from({ length: maxThumbIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumbIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeThumbIndex === i
                      ? 'w-8 bg-[#FF6A00]'
                      : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal for Selected Thumbnail */}
      <AnimatePresence>
        {selectedThumbnail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedThumbnail(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="thumb-modal-container relative max-w-5xl w-[94vw] sm:w-[90vw] max-h-[92vh] flex flex-col bg-[#101418] border border-white/20 rounded-2xl overflow-hidden shadow-2xl cursor-default"
            >
              {/* Header Bar */}
              <div className="thumb-modal-header p-3 sm:p-4 border-b border-white/10 bg-black/80 flex items-center justify-between gap-4">
                <div>
                  <h3 className="thumb-modal-title text-base sm:text-lg font-black text-white">
                    {selectedThumbnail.title}
                  </h3>
                  {(selectedThumbnail.category || selectedThumbnail.clientName) && (
                    <p className="thumb-modal-subtitle text-xs text-gray-400 font-medium">
                      {selectedThumbnail.category} {selectedThumbnail.clientName ? `• ${selectedThumbnail.clientName}` : ''}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setSelectedThumbnail(null)}
                  className="thumb-modal-close p-2 rounded-full bg-white/10 hover:bg-[#FF6A00] text-white transition-all shadow-lg hover:rotate-90 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fullscreen Image Container - Minimum padding around thumbnail */}
              <div className="relative flex-1 bg-black p-1 sm:p-2.5 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedThumbnail.afterImageUrl}
                  alt={selectedThumbnail.title}
                  className="max-h-[82vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render Niche Subpage Modal if active */}
      <AnimatePresence>
        {activeNicheModal && (
          <NicheSubpageModal
            niche={niches.find((n) => n.id === activeNicheModal.id) || activeNicheModal}
            onClose={() => setActiveNicheModal(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
