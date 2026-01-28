
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Film, AudioLines, Image as ImageIcon } from 'lucide-react';
import { getMediaType } from '../utils/mediaHelpers';

// Workaround for TypeScript environment issues with framer-motion types
const MotionDiv = motion.div as any;

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl?: string;
  title?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({ isOpen, onClose, mediaUrl, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Clean up media sources on unmount to prevent browser errors
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

  const type = getMediaType(mediaUrl);
  
  // Icon Resolution based on type
  const TypeIcon = type === 'video' ? Film : type === 'audio' ? AudioLines : ImageIcon;

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
      onClick={onClose}
    >
      {/* Styled Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-accent bg-black border border-zinc-800 hover:border-accent hover:bg-zinc-900 transition-all duration-300 z-50 group"
        aria-label="Close"
      >
        <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      <MotionDiv
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-full max-h-full flex flex-col items-center justify-center w-full h-full"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Content Container */}
        <div className="relative flex-1 flex items-center justify-center w-full min-h-0 overflow-hidden">
            {type === 'video' ? (
                <video 
                    ref={videoRef}
                    src={mediaUrl} 
                    controls 
                    autoPlay 
                    className="max-w-full max-h-[75vh] md:max-h-[85vh] rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-zinc-800"
                />
            ) : type === 'audio' ? (
                <div className="w-full max-w-md bg-zinc-900/50 p-8 rounded border border-white/10 flex flex-col items-center gap-6 backdrop-blur-sm">
                    <div className="w-24 h-24 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center animate-pulse-slow">
                        <AudioLines className="w-10 h-10 text-accent opacity-80" />
                    </div>
                    <audio 
                        ref={audioRef}
                        src={mediaUrl} 
                        controls 
                        autoPlay 
                        className="w-full invert hue-rotate-180" 
                    />
                </div>
            ) : (
                <img
                    src={mediaUrl}
                    alt={title || 'Media Preview'}
                    className="max-w-full max-h-[75vh] md:max-h-[85vh] object-contain rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-zinc-800"
                />
            )}
        </div>
        
        {/* Footer Caption */}
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
