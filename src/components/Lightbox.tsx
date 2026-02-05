
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, AudioLines, Image as ImageIcon, Loader2, AlertTriangle } from 'lucide-react';
import { getMediaType } from '../utils/mediaHelpers';
import { useImageFallback } from '../hooks/useImageFallback';
import { SCALE_FADE_VARIANTS } from '../styles/animations';

// NOTE: Framer Motion types can be strict with React 19 / Vite.
// Casting to 'any' here is a stable workaround for production builds to avoid type mismatches.
const MotionDiv = motion.div as any;

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl?: string;
  title?: string;
}

const LoadingOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm pointer-events-none">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
);

const NoSignal = () => (
    <div className="flex flex-col items-center justify-center text-red-500 w-full h-full bg-black/50 border border-red-500/20 p-8 rounded backdrop-blur-sm">
         <div className="relative">
            <AlertTriangle className="w-16 h-16 mb-4 opacity-80" strokeWidth={1} />
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
         </div>
        <span className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase font-bold opacity-80">Signal Lost</span>
        <span className="font-mono text-[10px] text-red-500/50 mt-2">Asset Not Found</span>
    </div>
);

export const Lightbox: React.FC<LightboxProps> = ({ isOpen, onClose, mediaUrl, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cleanUrl = mediaUrl?.trim() || '';
  const type = getMediaType(cleanUrl);

  // Use fallback hook only for images. 
  // We don't pass nodeId here, so it falls back to Local SVG -> Dead.
  const { src: imageSrc, handleError: onImageError, isDead } = useImageFallback(
      type === 'image' ? cleanUrl : undefined
  );

  // Reset loading state when media changes
  useEffect(() => {
      setIsLoading(true);
  }, [mediaUrl]);

  // Clean up media sources on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
    };
  }, []);

  if (!isOpen || !mediaUrl) return null;

  const TypeIcon = type === 'video' ? Film : type === 'audio' ? AudioLines : ImageIcon;
  
  // Detect if it's a direct file or an embed page. 
  // Improved regex: Allows query params after extension (e.g. video.mp4?token=123)
  const isDirectFile = cleanUrl.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i);
  const isExternalVideo = type === 'video' && !isDirectFile;
  
  // Logic Check: Is this an invalid embed that we block?
  const isInvalidEmbed = isExternalVideo && !cleanUrl.startsWith('http');

  const handleLoaded = () => setIsLoading(false);
  const handleError = () => {
      console.warn("Lightbox failed to load media:", cleanUrl);
      setIsLoading(false);
  };

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-accent bg-black border border-zinc-800 hover:border-accent hover:bg-zinc-900 transition-all duration-300 z-50 group"
        aria-label="Close"
      >
        <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      <MotionDiv
        variants={SCALE_FADE_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative max-w-full max-h-full flex flex-col items-center justify-center w-full h-full"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="relative flex-1 flex items-center justify-center w-full min-h-0 overflow-hidden">
            
            <AnimatePresence>
                {/* Hide loader if we are logically blocking the render (isInvalidEmbed) or if dead */}
                {isLoading && !isInvalidEmbed && !isDead && <LoadingOverlay />}
            </AnimatePresence>

            {type === 'video' ? (
                isExternalVideo ? (
                    !isInvalidEmbed ? (
                        <div className="w-full h-full max-w-[90vw] max-h-[85vh] aspect-video relative rounded-sm overflow-hidden border border-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <iframe 
                                src={cleanUrl} 
                                onLoad={handleLoaded}
                                onError={handleError}
                                className="w-full h-full absolute inset-0" 
                                allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; encrypted-media" 
                                frameBorder="0" 
                                allowFullScreen
                                sandbox="allow-scripts allow-same-origin allow-presentation"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    ) : (
                        <div className="p-8 border border-red-500/50 bg-black/80 text-red-500 font-mono text-sm z-20 backdrop-blur-md">
                            <p className="mb-2 font-bold">INVALID EMBED URL</p>
                            <p className="opacity-70 break-all">{cleanUrl}</p>
                        </div>
                    )
                ) : (
                    <video 
                        ref={videoRef}
                        src={cleanUrl} 
                        onCanPlay={handleLoaded}
                        onError={handleError}
                        onWaiting={() => setIsLoading(true)}
                        controls 
                        autoPlay
                        playsInline
                        className="max-w-full max-h-[75vh] md:max-h-[85vh] rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-zinc-800"
                    />
                )
            ) : type === 'audio' ? (
                <div className="w-full max-w-md bg-zinc-900/50 p-8 rounded border border-white/10 flex flex-col items-center gap-6 backdrop-blur-sm">
                    <div className="w-24 h-24 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center animate-pulse-slow">
                        <AudioLines className="w-10 h-10 text-accent opacity-80" />
                    </div>
                    <audio 
                        ref={audioRef}
                        src={cleanUrl} 
                        onCanPlay={handleLoaded}
                        onError={handleError}
                        controls 
                        autoPlay 
                        className="w-full invert hue-rotate-180" 
                    />
                </div>
            ) : (
                isDead ? (
                    <NoSignal />
                ) : (
                    <img
                        src={imageSrc || cleanUrl}
                        onLoad={handleLoaded}
                        onError={onImageError}
                        alt={title || 'Media Preview'}
                        className={`max-w-full max-h-[75vh] md:max-h-[85vh] object-contain rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-zinc-800 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    />
                )
            )}
        </div>
        
        {title && (
          <div className="mt-6 flex items-center gap-3 bg-black/80 border border-white/10 px-4 py-2 rounded-sm backdrop-blur-sm">
            <TypeIcon className="w-3 h-3 text-accent" />
            <span className="text-zinc-300 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
              {title}
            </span>
          </div>
        )}
      </MotionDiv>
    </MotionDiv>
  );
};
