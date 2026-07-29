import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { extractYouTubeId } from '../utils/youtube';

export const VideoModal: React.FC = () => {
  const { activeVideoPlayer, setActiveVideoPlayer } = usePortfolio();

  return (
    <AnimatePresence>
      {activeVideoPlayer && (
        <VideoModalContent />
      )}
    </AnimatePresence>
  );
};

const VideoModalContent: React.FC = () => {
  const { activeVideoPlayer, setActiveVideoPlayer } = usePortfolio();
  if (!activeVideoPlayer) return null;

  const { title, videoUrl, embedId } = activeVideoPlayer;
  const ytId = extractYouTubeId(videoUrl) || embedId;
  const isMp4 = videoUrl && (videoUrl.endsWith('.mp4') || videoUrl.includes('mixkit') || videoUrl.includes('cloudflare'));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={() => setActiveVideoPlayer(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-2xl cursor-pointer"
    >
      {/* Prominent Floating Fixed Close Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActiveVideoPlayer(null);
        }}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/20 hover:bg-[#FF6A00] text-white transition-all border border-white/30 z-[60] shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:scale-110 cursor-pointer"
        title="Close Video"
        aria-label="Close video player"
      >
        <X className="w-6 h-6 stroke-[2.5]" />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="video-modal-container relative w-full max-w-5xl bg-[#0F1318] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh] cursor-default"
      >
        
        {/* Header Bar */}
        <div className="video-modal-header p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-4 bg-gradient-to-r from-neutral-900 to-black">
          <div className="flex items-center gap-3 truncate">
            <span className="w-3 h-3 rounded-full bg-[#FF6A00] animate-pulse" />
            <h3 className="video-modal-title text-sm sm:text-base font-extrabold text-white truncate">
              {title}
            </h3>
          </div>

          <button
            onClick={() => setActiveVideoPlayer(null)}
            className="video-modal-close p-2 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all border border-white/10 shrink-0 cursor-pointer"
            title="Close Player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {ytId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isMp4 ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe
              className="w-full h-full"
              src={videoUrl}
              title={title}
              allowFullScreen
            />
          )}
        </div>

      </motion.div>
    </motion.div>
  );
};
