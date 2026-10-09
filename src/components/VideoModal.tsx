import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { extractYouTubeId, isDirectVideoUrl, isKnownShort, checkYouTubeIsShort } from '../utils/youtube';

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

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
  const mins = Math.floor(timeInSeconds / 60);
  const secs = Math.floor(timeInSeconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const VideoModalContent: React.FC<VideoModalContentProps> = ({ videoData, onClose }) => {
  const { title, videoUrl, embedId, isShort: isShortProp } = videoData;

  const cleanVideoUrl = useMemo(() => {
    if (!videoUrl) return '';
    const trimmed = videoUrl.trim();
    try {
      return encodeURI(decodeURI(trimmed));
    } catch {
      return trimmed;
    }
  }, [videoUrl]);

  const cleanEmbedId = embedId && embedId !== 'L_LUpnjgPso' ? embedId : undefined;
  const ytId = extractYouTubeId(cleanVideoUrl) || cleanEmbedId;
  const isDirect = !ytId;

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerBoxRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isVertical, setIsVertical] = useState<boolean>(() => {
    return Boolean(
      isShortProp ||
      videoUrl?.includes('/shorts/') ||
      videoUrl?.includes('shorts') ||
      /#shorts\b|#short\b|\bshorts\b|\breels?\b/i.test(title || '') ||
      isKnownShort(cleanVideoUrl || cleanEmbedId || '', title)
    );
  });

  useEffect(() => {
    if (isShortProp !== undefined) {
      setIsVertical(isShortProp);
    }
  }, [isShortProp]);

  // Dynamically check whether the YouTube video is a Short (vertical) if not yet tagged
  useEffect(() => {
    if (isVertical) return;
    if (!ytId) return;

    let isMounted = true;
    checkYouTubeIsShort(ytId).then((detectedShort) => {
      if (isMounted && detectedShort) {
        setIsVertical(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [ytId, isVertical]);

  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    // Only auto-hide if playing
    const video = videoRef.current;
    if (video && !video.paused) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  useEffect(() => {
    if (isPaused) {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      resetControlsTimeout();
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPaused]);

  // Video Autoplay handling with fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isDirect) return;

    setShowControls(true);
    setIsPaused(true);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPaused(false);
          resetControlsTimeout();
        })
        .catch(() => {
          // Autoplay unmuted was blocked by browser policy
          // Fallback to muted playback so the video actually plays!
          video.muted = true;
          setIsMuted(true);
          video.play()
            .then(() => {
              setIsPaused(false);
              resetControlsTimeout();
            })
            .catch(() => {
              // Both blocked: keep paused with controls and big play button visible
              setIsPaused(true);
              setShowControls(true);
            });
        });
    }
  }, [cleanVideoUrl, isDirect]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    setShowControls(true);

    if (video.paused) {
      video.play()
        .then(() => {
          setIsPaused(false);
          setShowFeedback(true);
          resetControlsTimeout();
        })
        .catch(() => {
          // If audio play failed, try muted
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPaused(false)).catch(() => setIsPaused(true));
        });
    } else {
      video.pause();
      setIsPaused(true);
      setShowFeedback(true);
    }

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setShowFeedback(false), 700);
  };

  // Keyboard controls (Space = play/pause, M = mute, F = fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDirect) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        const video = videoRef.current;
        if (video) {
          video.muted = !video.muted;
          setIsMuted(video.muted);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirect, isPaused]);

  const handleUserActivity = () => {
    setShowControls(true);
    resetControlsTimeout();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newFraction = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = newFraction * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    resetControlsTimeout();
  };

  const handleTouchSeek = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !duration || e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const newFraction = Math.max(0, Math.min(1, touchX / rect.width));
    const newTime = newFraction * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    resetControlsTimeout();
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    resetControlsTimeout();
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const container = playerBoxRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl cursor-pointer ${
        isVertical ? 'p-0 sm:p-4' : 'p-2 sm:p-4'
      }`}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className={`video-modal-container relative bg-[#0F1318] shadow-2xl flex flex-col cursor-default w-full overflow-hidden ${
          isVertical
            ? 'h-[100dvh] sm:h-auto sm:max-h-[96vh] sm:max-w-[420px] lg:max-w-[460px] rounded-none sm:rounded-3xl border-0 sm:border border-white/20 my-0 sm:my-auto justify-between sm:justify-start'
            : 'my-auto max-h-[96vh] max-w-5xl rounded-2xl sm:rounded-3xl border border-white/20'
        }`}
      >
        
        {/* Header Bar */}
        <div className="video-modal-header px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-white/10 flex items-center justify-between gap-3 bg-gradient-to-r from-neutral-900 to-black shrink-0 z-20">
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shrink-0" />
            <h3 className="video-modal-title text-xs sm:text-sm font-extrabold text-white truncate">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="video-modal-close p-1.5 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all border border-white/10 shrink-0 cursor-pointer"
            title="Close Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Box - Fullscreen on mobile, Vertical 9:16 for Shorts / Lifestyle on desktop, 16:9 for long-form */}
        <div 
          ref={playerBoxRef}
          className={`relative w-full bg-black flex items-center justify-center overflow-hidden ${
            isVertical 
              ? 'flex-1 sm:flex-initial sm:aspect-[9/16] sm:max-h-[85vh] h-full min-h-0' 
              : 'aspect-video'
          }`}
        >
          {ytId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isDirect ? (
            <div 
              className="relative w-full h-full flex items-center justify-center select-none group bg-black cursor-pointer"
              onClick={togglePlayPause}
              onMouseMove={handleUserActivity}
              onTouchStart={handleUserActivity}
            >
              <video
                ref={videoRef}
                src={cleanVideoUrl}
                playsInline
                preload="auto"
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => {
                  const vid = e.currentTarget;
                  if (vid.duration) setDuration(vid.duration);
                  if (vid.videoHeight && vid.videoWidth) {
                    setIsVertical(vid.videoHeight > vid.videoWidth);
                  }
                }}
                onPlay={() => setIsPaused(false)}
                onPause={() => {
                  setIsPaused(true);
                  setShowControls(true);
                }}
                onEnded={() => {
                  setIsPaused(true);
                  setShowControls(true);
                }}
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Unmute pill if video autoplays muted */}
              {isMuted && !isPaused && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute(e);
                  }}
                  className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black/95 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xl cursor-pointer hover:scale-105 transition-all"
                  title="Unmute Video"
                >
                  <VolumeX className="w-3.5 h-3.5 text-accent animate-pulse" />
                  <span>Tap to unmute</span>
                </button>
              )}

              {/* Centered Play Button when paused */}
              {isPaused && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                  className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white shadow-2xl z-20 cursor-pointer hover:scale-110 active:scale-95 transition-all group/btn"
                  title="Play Video"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1 group-hover/btn:scale-105 transition-transform" />
                </button>
              )}

              {/* Transient feedback badge when pausing while playing */}
              <AnimatePresence>
                {showFeedback && !isPaused && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-none shadow-2xl z-20"
                  >
                    <Pause className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Custom Control Overlay Bar */}
              <div
                className={`absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 z-30 pointer-events-auto ${
                  showControls || isPaused ? 'opacity-100' : 'opacity-0 !pointer-events-none'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Progress Bar / Scrubber */}
                <div
                  className="w-full h-2.5 bg-white/25 hover:h-3 rounded-full cursor-pointer relative mb-3 transition-all group/scrubber"
                  onClick={handleSeek}
                  onTouchStart={handleTouchSeek}
                  onTouchMove={handleTouchSeek}
                >
                  <div
                    className="h-full bg-accent rounded-full relative"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow opacity-100 sm:opacity-0 group-hover/scrubber:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between text-white text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlayPause}
                      className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white"
                      title={isPaused ? 'Play' : 'Pause'}
                    >
                      {isPaused ? (
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
                      ) : (
                        <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => toggleMute(e)}
                      className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                      ) : (
                        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                      )}
                    </button>

                    <span className="text-white/80 font-mono text-[11px] sm:text-xs select-none">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => toggleFullscreen(e)}
                      className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white"
                      title="Toggle Fullscreen"
                    >
                      {isFullscreen ? (
                        <Minimize className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                      ) : (
                        <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              className="w-full h-full"
              src={cleanVideoUrl}
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
