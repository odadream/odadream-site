import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, CornerLeftUp, Maximize2, Image as ImageIcon } from 'lucide-react';
import { LotusNode } from '../types';
import { THEME } from '../styles/theme';

interface LotusGridProps {
  currentNode: LotusNode;
  displayChildren: LotusNode[]; 
  onNavigate: (node: LotusNode) => void;
  onBack: () => void;
  canGoBack: boolean;
}

// Helper: Calculate rotation to point towards center (cell 4)
const getArrowRotation = (index: number) => {
    const rotations = [
        'rotate-[135deg]', 'rotate-180', 'rotate-[-135deg]',
        'rotate-90',       'rotate-0',   'rotate-[-90deg]',
        'rotate-45',       'rotate-0',   'rotate-[-45deg]'
    ];
    return rotations[index] || 'rotate-0';
};

export const LotusGrid: React.FC<LotusGridProps> = ({ currentNode, displayChildren, onNavigate, onBack, canGoBack }) => {
  
  const gridCells = Array(9).fill(null).map((_, index) => {
    if (index === 4) return { ...currentNode, isCenter: true };
    
    let childIndex = -1;
    if (index < 4) childIndex = index;
    else if (index > 4) childIndex = index - 1;
    
    return displayChildren[childIndex] ? { ...displayChildren[childIndex], isCenter: false } : null;
  });

  return (
    <div className="relative aspect-square h-full max-h-full w-full max-w-full shadow-2xl shadow-black">
      
      <div className={`${THEME.lotus.gridWrapper} w-full h-full`}>
        {gridCells.map((cell, index) => (
          <motion.div
            key={cell ? cell.id : `empty-${index}`}
            layoutId={cell ? `lotus-cell-${cell.id}` : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={`
                ${THEME.lotus.cell}
                ${cell?.isCenter ? THEME.lotus.cellActive : ''}
                ${cell && !cell.isCenter ? THEME.lotus.cellInteractive : ''}
                ${!cell ? THEME.lotus.cellEmpty : ''}
            `}
            onClick={() => {
              if (cell?.isCenter && canGoBack) onBack();
              else if (cell && !cell.isCenter) onNavigate(cell);
            }}
          >
            {/* --- CONTENT LAYER --- */}
            {cell ? (
              <>
                {/* 1. Background Image Logic */}
                {cell.imageUrl && (
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* The Image Itself */}
                    <img 
                        src={cell.imageUrl} 
                        className={`
                            w-full h-full object-cover transition-transform duration-700 ease-out
                            ${cell.isCenter 
                                ? 'opacity-20 grayscale scale-100' // Center is subtle
                                : 'opacity-90 grayscale-0 group-hover:scale-110' // Children are full color & lively
                            }
                        `} 
                        alt="" 
                    />
                    
                    {/* Contrast Overlay: Crucial for visibility of icons on top of full-color images */}
                    {!cell.isCenter && (
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
                    )}
                  </div>
                )}

                {/* 2. Foreground Elements (Icons & Text) */}
                <div className="relative z-20 flex flex-col items-center justify-center w-full h-full p-2">
                  
                  {/* Icon / Indicator */}
                  <div className={`mb-2 ${cell.isCenter ? 'text-accent/80' : 'text-white drop-shadow-md'}`}>
                    {cell.isCenter ? (
                        canGoBack ? (
                           <CornerLeftUp className="w-4 h-4 hover:scale-125 transition-transform" />
                        ) : (
                           <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        )
                    ) : cell.type === 'media' ? (
                        <Maximize2 className="w-4 h-4 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-lg" />
                    ) : (
                        <ArrowUp className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all drop-shadow-lg ${getArrowRotation(index)}`} />
                    )}
                  </div>

                  {/* Label */}
                  <span className={`
                    text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-medium text-center leading-tight
                    ${cell.isCenter ? 'text-accent-text' : 'text-zinc-300 group-hover:text-white drop-shadow-md'}
                  `}>
                    {cell.shortTitle || cell.title}
                  </span>

                </div>

                {/* 3. Media Type Badge */}
                {cell.type === 'media' && !cell.isCenter && (
                    <div className="absolute top-2 right-2 z-20">
                        <ImageIcon className="w-3 h-3 text-white/70 drop-shadow-md" />
                    </div>
                )}
              </>
            ) : (
               // --- EMPTY SLOT STATE ---
               <div className="w-0.5 h-0.5 bg-white/5 rounded-full" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};