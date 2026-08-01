import React from 'react';
import { motion } from 'motion/react';
import { X, Award, Clock } from 'lucide-react';
import { NicheCategory, VideoItem } from '../types/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import { getYouTubeThumbnail } from '../utils/youtube';
import { YouTubePlayIcon } from './YouTubePlayIcon';

interface NicheSubpageModalProps {
  niche: NicheCategory;
  onClose: () => void;
}

export const NicheSubpageModal: React.FC<NicheSubpageModalProps> = ({ niche, onClose }) => {
  const { setActiveVideoPlayer, theme } = usePortfolio();

  const getSubVideoThumb = (video: VideoItem) => {
    return (
      video.thumbnailUrl ||
      getYouTubeThumbnail(video.videoUrl, video.embedId) ||
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
    );
  };

  const isLight = theme === 'light';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl cursor-pointer"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className={`niche-modal-container relative w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border transition-colors cursor-default ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#0F1318] border-white/15 text-white'
        }`}
      >
        
        {/* Modal Header */}
        <div className={`niche-modal-header relative px-4 py-3 sm:px-6 sm:py-4 border-b flex items-center justify-between gap-4 ${
          isLight
            ? 'bg-slate-100/80 border-slate-200'
            : 'bg-gradient-to-r from-neutral-900 via-neutral-900 to-black border-white/10'
        }`}>
          <div className="space-y-0.5">
            <h2 className={`niche-modal-title text-xl sm:text-2xl font-extrabold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {niche.title}
            </h2>
            <p className={`niche-modal-subtitle text-xs sm:text-sm font-normal leading-snug ${
              isLight ? 'text-slate-600' : 'text-gray-300'
            }`}>
              {niche.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className={`niche-modal-close p-2 rounded-full transition-all border cursor-pointer shrink-0 ${
              isLight
                ? 'bg-slate-200/80 text-slate-700 hover:text-black hover:bg-slate-300 border-slate-300'
                : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 border-white/10'
            }`}
            title="Close Sub-Page"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">

          {/* Videos Grid - One by one responsive cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {niche.subpageItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveVideoPlayer(item)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-xl ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 hover:border-accent hover:shadow-2xl'
                    : 'bg-[#12161A] border-white/10 hover:border-accent/60 hover:shadow-2xl'
                }`}
              >
                {/* Video Thumbnail with YouTube Red Play Button */}
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <img
                    src={getSubVideoThumb(item)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    onError={(e) => {
                      const fallback = getYouTubeThumbnail(item.videoUrl, item.embedId);
                      if (fallback && (e.target as HTMLImageElement).src !== fallback) {
                        (e.target as HTMLImageElement).src = fallback;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                  {/* YouTube Red Play Icon Centered */}
                  <div className="absolute inset-0 m-auto w-fit h-fit flex items-center justify-center">
                    <YouTubePlayIcon size="md" />
                  </div>

                  {/* Duration Pill */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono text-white flex items-center gap-1 shadow-md">
                    <Clock className="w-3 h-3 text-accent" />
                    <span>{item.duration || '12:00'}</span>
                  </div>
                </div>

                {/* Card Text */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5 text-left">
                    <h4 className={`text-base sm:text-lg font-extrabold group-hover:text-accent transition-colors line-clamp-2 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-gray-300'
                      }`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial / Value Prop Footer */}
          <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isLight
              ? 'bg-amber-500/10 border-amber-500/20'
              : 'bg-gradient-to-r from-accent/15 via-white/5 to-transparent border-accent/20'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-black shrink-0 shadow-md">
                <Award className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Need a Custom {niche.title} Edit?
                </h4>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                  MonirEditz delivers high retention cuts within 48-72 hours.
                </p>
              </div>
            </div>

            <a
              href="#contact"
              onClick={() => onClose()}
              className="px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-extrabold hover:brightness-110 transition-all shrink-0 cursor-pointer shadow-md"
            >
              <span className="!text-white font-extrabold">Request Quote</span>
            </a>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};
