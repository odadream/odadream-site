
import React, { useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Home, Layers, FileText, Film, AudioLines, Image as ImageIcon, Zap } from 'lucide-react';
import { LotusNode } from '../types';
import { useScrollOverflow } from '../hooks/useScrollOverflow';
import { THEME } from '../styles/theme';
import { useNavigation } from '../context/NavigationContext';

const getNodeIcon = (node: LotusNode) => {
    switch (node.type) {
        case 'hub': return Layers;
        case 'action': return Zap;
        case 'media':
            switch (node.mediaType) {
                case 'video': return Film;
                case 'audio': return AudioLines;
                case 'image': return ImageIcon;
                default: return ImageIcon;
            }
        case 'content': return FileText;
        default: return FileText;
    }
};

export const Breadcrumbs: React.FC = () => {
  const { path, jumpToLevel, lang } = useNavigation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();
  const { canScrollLeft, canScrollRight, scroll, checkScroll } = useScrollOverflow(scrollRef, [path]);

  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
          checkScroll();
      }
  }, [path, checkScroll]);

  return (
    // Removed border-t border-white/5
    <footer className={`${THEME.layout.barHeight} w-full bg-transparent flex items-center relative shrink-0 z-30 justify-between select-none`}>
      <div className="relative flex-1 h-full overflow-hidden mr-2 flex items-center">
          <button onClick={() => scroll('left', 150)} className={`absolute left-0 top-0 bottom-0 z-20 w-8 flex items-center justify-center bg-canvas/90 backdrop-blur-[1px] transition-opacity duration-300 ${canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
             <ChevronLeft className="w-3 h-3 text-accent" />
          </button>

          {/* UPDATED: Container px-1 matches Grid Frame p-1. */}
          <div ref={scrollRef} onScroll={checkScroll} className={`flex items-center px-1 h-full overflow-x-auto scrollbar-hide gap-1 scroll-smooth mix-blend-screen`}>
              <div className={`shrink-0 transition-all duration-300 ${canScrollLeft ? 'w-4' : 'w-0'}`} />
              
              {path.map((node, index) => {
                  const isLast = index === path.length - 1;
                  const Icon = index === 0 ? Home : getNodeIcon(node);

                  return (
                      <React.Fragment key={node.id}>
                          {index > 0 && (
                              <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" strokeWidth={1} />
                          )}
                          <button 
                              onClick={() => jumpToLevel(index)}
                              // Updated padding to px-2 py-1.5 to fill vertical space better and align horizontally with grid cell starts.
                              className={`
                                  group flex items-center gap-2 px-2 py-1.5 rounded-sm transition-all duration-300 shrink-0
                                  ${isLast ? 'cursor-default' : THEME.navigation.text.base}
                              `}
                          >
                              {/* Added strokeWidth={1.5} for better weight balance with text */}
                              <Icon className={`w-3 h-3 ${isLast ? THEME.navigation.icon.active : THEME.navigation.icon.base}`} strokeWidth={1.5} />
                              
                              {/* Added leading-none to remove vertical line-height offsets */}
                              <span className={`${THEME.typography.meta} leading-none ${isLast ? 'text-zinc-100' : ''}`}>
                                  {node.shortTitle?.[lang] || node.title[lang]}
                              </span>
                          </button>
                      </React.Fragment>
                  );
              })}
              
              <div className={`shrink-0 transition-all duration-300 ${canScrollRight ? 'w-4' : 'w-0'}`} />
          </div>

          <button onClick={() => scroll('right', 150)} className={`absolute right-0 top-0 bottom-0 z-20 w-8 flex items-center justify-center bg-canvas/90 backdrop-blur-[1px] transition-opacity duration-300 ${canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
             <ChevronRight className="w-3 h-3 text-accent" />
          </button>
      </div>

      {/* Removed border-l border-white/5 */}
      <div className={`hidden md:flex items-center px-6 gap-6 h-full bg-transparent z-40 relative`}>
          <span className={`${THEME.typography.meta} text-zinc-700`}>
             oda.dream © {currentYear}
          </span>
      </div>
    </footer>
  );
};
