import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Video } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { YouTubePlayIcon } from './YouTubePlayIcon';
import { GalleryItem } from '../types/portfolio';
import { extractYouTubeId } from '../utils/youtube';

const isVideoMedia = (url?: string) => {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.m4v') ||
    clean.endsWith('.ogv') ||
    url.includes('supabase.co') && (clean.includes('.mp4') || clean.includes('.mov') || clean.includes('.webm') || !clean.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i))
  );
};

export const LifestyleGallery: React.FC = () => {
  const { config, setActiveVideoPlayer } = usePortfolio();
  const { lifestyleGallery } = config;
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const handleItemClick = (item: GalleryItem) => {
    if (item.type === 'video') {
      const targetVideoUrl = item.videoUrl || (isVideoMedia(item.url) ? item.url : '') || item.url || '';
      const ytId = extractYouTubeId(targetVideoUrl) || (item.embedId && item.embedId !== 'L_LUpnjgPso' ? item.embedId : undefined);
      setActiveVideoPlayer({
        id: item.id,
        title: item.title,
        videoUrl: targetVideoUrl,
        embedId: ytId,
        thumbnailUrl: !isVideoMedia(item.url) ? item.url : undefined,
      });
    } else {
      setLightboxItem(item);
    }
  };

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#090B0D] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title Centered */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-3 max-w-2xl mx-auto gpu-accelerated"
        >
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-center">
            My Lifestyle / <span className="text-accent">Gallery</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base font-normal">
            Behind-the-scenes moments, lifestyle shots, and creative process clips that show the person behind the edits.
          </p>
        </motion.div>

        {/* Dynamic Masonry/Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lifestyleGallery.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30, scale: 0.98, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => handleItemClick(item)}
              className={`group cursor-pointer relative rounded-2xl overflow-hidden bg-[#12161A] border border-white/10 hover:border-accent/60 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-xl hover:shadow-2xl hover:shadow-accent/10 ${
                idx === 0 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-square'
              } gpu-accelerated`}
            >
              {/* Image or Video Preview */}
              {item.type === 'video' && (isVideoMedia(item.url) || (!item.url && isVideoMedia(item.videoUrl))) ? (
                <video
                  src={isVideoMedia(item.url) ? item.url : item.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-85"
                />
              ) : (
                <img
                  src={item.url || (item.videoUrl && extractYouTubeId(item.videoUrl) ? `https://img.youtube.com/vi/${extractYouTubeId(item.videoUrl)}/hqdefault.jpg` : '')}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-85"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Video Badge / Play Button */}
              {item.type === 'video' ? (
                <>
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-md">
                    <Video className="w-3.5 h-3.5 text-accent" />
                    <span>VIDEO</span>
                  </div>
                  {/* Transparent Theme Accent Play Icon Centered */}
                  <div className="absolute inset-0 m-auto w-fit h-fit flex items-center justify-center z-10">
                    <YouTubePlayIcon size="md" variant="accent" />
                  </div>
                </>
              ) : (
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
              )}

              {/* Title & Pill at Bottom */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white font-extrabold text-xs">
                  {item.title}
                </span>

                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  item.type === 'video'
                    ? 'bg-[#FF0000]/20 text-[#FF4D4D] border-[#FF0000]/40'
                    : 'bg-white/10 text-gray-300 border-white/10'
                }`}>
                  {item.type === 'video' ? 'VIDEO CLIP' : 'PHOTO'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl cursor-pointer"
          >
            {/* Prominent Floating Fixed Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxItem(null);
              }}
              className="gallery-modal-fixed-close fixed top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-black/60 hover:bg-accent text-white transition-all border border-white/30 z-[60] shadow-2xl hover:scale-110 cursor-pointer"
              title="Close Image (Esc)"
              aria-label="Close photo"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="gallery-modal-container relative max-w-4xl w-full bg-[#12161A] rounded-2xl p-4 sm:p-6 border border-white/20 text-center space-y-4 shadow-2xl cursor-default my-auto max-h-[92vh] flex flex-col"
            >
              {/* Header / Title & Close */}
              <div className="gallery-modal-header flex items-center justify-between pb-3 border-b border-white/10">
                <div className="text-left pr-4">
                  <h3 className="gallery-modal-title text-base sm:text-xl font-extrabold text-white">{lightboxItem.title}</h3>
                  {lightboxItem.caption && (
                    <p className="gallery-modal-caption text-xs sm:text-sm text-gray-300 mt-0.5">{lightboxItem.caption}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="gallery-modal-close p-2.5 rounded-full bg-white/10 hover:bg-accent text-white transition-all border border-white/10 cursor-pointer flex items-center justify-center shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo or Video Box */}
              <div className="rounded-xl overflow-hidden bg-black max-h-[75vh] flex items-center justify-center relative border border-white/10">
                {lightboxItem.type === 'video' || isVideoMedia(lightboxItem.url) || isVideoMedia(lightboxItem.videoUrl) ? (
                  <video
                    src={lightboxItem.videoUrl || lightboxItem.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-auto max-h-[75vh] object-contain"
                  />
                ) : (
                  <img
                    src={lightboxItem.url}
                    alt={lightboxItem.title}
                    className="w-full h-auto max-h-[75vh] object-contain select-none"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
