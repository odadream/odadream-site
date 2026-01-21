import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl?: string;
  title?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({ isOpen, onClose, mediaUrl, title }) => {
  if (!isOpen || !mediaUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose} // Close on backdrop click
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 p-2 text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 rounded-full transition-colors z-50"
      >
        <X className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-full max-h-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
      >
        <img
          src={mediaUrl}
          alt={title || 'Media Preview'}
          className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl border border-zinc-800"
        />
        {title && (
          <p className="mt-4 text-zinc-400 font-mono text-sm uppercase tracking-widest">
            {title}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};