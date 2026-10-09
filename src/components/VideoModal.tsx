import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { extractYouTubeId } from '../utils/youtube';

interface VideoModalContentProps {
  videoData: {
    title: string;
    videoUrl: string;
    embedId?: string;
    isShort?: boolean;
  };
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: [0.32, 0, 0.67, 0] }
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.88,
    y: 24,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 26,
      stiffness: 320,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    y: 28,
    filter: 'blur(12px)',
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const isDirectVideoUrl = (url?: string) => {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.m4v') ||
    clean.endsWith('.ogv') ||
    url.includes('supabase.co') ||
    url.includes('mixkit') ||
    url.includes('cloudflare') ||
    url.startsWith('blob:')
  );
};

const VideoModalContent: React.FC<VideoModalContentProps> = ({ videoData, onClose }) => {
  const { title, videoUrl, embedId, isShort: isShortProp } = videoData;
  const isDirect = isDirectVideoUrl(videoUrl);
  const cleanEmbedId = embedId && embedId !== 'L_LUpnjgPso' && !videoUrl?.includes('supabase.co') ? embedId : undefined;
  const ytId = extractYouTubeId(videoUrl) || cleanEmbedId;
  const isShort = Boolean(isShortProp || videoUrl?.includes('/shorts/') || videoUrl?.includes('shorts'));

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl cursor-pointer"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className={`video-modal-container relative bg-[#0F1318] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[96vh] cursor-default ${
          isShort
            ? 'w-[94vw] max-w-[440px] sm:max-w-[480px] lg:max-w-[500px]'
            : 'w-full max-w-5xl'
        }`}
      >
        
        {/* Header Bar - Compact padding */}
        <div className="video-modal-header px-3.5 py-2 sm:px-4 sm:py-2.5 border-b border-white/10 flex items-center justify-between gap-3 bg-gradient-to-r from-neutral-900 to-black">
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shrink-0" />
            <h3 className="video-modal-title text-xs sm:text-sm font-extrabold text-white truncate">
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="video-modal-close p-1.5 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all border border-white/10 shrink-0 cursor-pointer"
            title="Close Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Box - Vertical 9:16 for Shorts, 16:9 for long-form */}
        <div className={`relative w-full bg-black flex items-center justify-center overflow-hidden ${
          isShort ? 'aspect-[9/16] max-h-[85vh]' : 'aspect-video'
        }`}>
          {ytId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isDirect ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
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

export const VideoModal: React.FC = () => {
  const { activeVideoPlayer, setActiveVideoPlayer } = usePortfolio();

  return (
    <AnimatePresence>
      {activeVideoPlayer && (
        <VideoModalContent
          key={activeVideoPlayer.videoUrl || activeVideoPlayer.title}
          videoData={activeVideoPlayer}
          onClose={() => setActiveVideoPlayer(null)}
        />
      )}
    </AnimatePresence>
  );
};
