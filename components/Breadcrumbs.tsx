
import React, { useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Home, Layers, FileText, Film, AudioLines, Image as ImageIcon, Zap } from 'lucide-react';
import { LotusNode, Language } from '../types';
import { useScrollOverflow } from '../hooks/useScrollOverflow';
import { THEME } from '../styles/theme';

interface BreadcrumbsProps {
  path: LotusNode[];
  onNavigateToLevel: (index: number) => void;
  lang: Language;
}

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

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onNavigateToLevel, lang }) => {
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
    <footer className={`${THEME.layout.barHeight} w-full bg-black border-t border-white/10 flex items-center relative shrink-0 z-30 justify-between select-none`}>
      
      <div className="relative flex-1 h-full overflow-hidden mr-2 flex items-center">
          <button 
            onClick={() => scroll('left', 150)}
            className={`
                absolute left-0 top-0 bottom-0 z-20 w-8 flex items-center justify-center
                bg-black/90 backdrop-blur-sm transition-opacity duration-300
                ${canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
          >
            <ChevronLeft className="w-3 h-3 text-zinc-500" />
          </button>

          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className={`flex items-center h-full ${THEME.layout.paddingX} overflow-x-auto scrollbar-hide whitespace-nowrap scroll-smooth`}
          >
             <div className={`shrink-0 transition-all ${canScrollLeft ? 'w-4' : 'w-0'}`} />

            <div className={`flex items-center ${THEME.typography.uiLabel}`}>
                {path.map((node, index) => {
                const isLast = index === path.length - 1;
                const Icon = index === 0 ? Home : getNodeIcon(node);

                return (
                    <React.Fragment key={node.id}>
                    <button
                        onClick={() => onNavigateToLevel(index)}
                        className={`
                        flex items-center transition-colors gap-1.5
                        ${isLast ? 'text-zinc-200 font-bold' : 'text-zinc-500 hover:text-zinc-300'}
                        `}
                    >
                        <Icon className={`w-3 h-3 ${isLast ? 'text-accent' : 'opacity-70'}`} />
                        <span>
                            {index === 0 ? '' : (node.shortTitle?.[lang] || node.title[lang])}
                        </span>
                    </button>
                    
                    {!isLast && (
                        <span className="text-zinc-600 mx-2 font-light opacity-50">/</span>
                    )}
                    </React.Fragment>
                );
                })}
                 <div className={`shrink-0 transition-all ${canScrollRight ? 'w-4' : 'w-0'}`} />
            </div>
          </div>
          
          <button 
            onClick={() => scroll('right', 150)}
            className={`
                absolute right-0 top-0 bottom-0 z-20 w-8 flex items-center justify-center
                bg-black/90 backdrop-blur-sm transition-opacity duration-300
                ${canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
          >
            <ChevronRight className="w-3 h-3 text-zinc-500" />
          </button>
      </div>

      <div className="shrink-0 pr-4 pl-4 h-full flex items-center bg-black z-20 border-l border-white/10">
         <span className={`${THEME.typography.micro} text-zinc-600 hidden sm:block`}>
            ODA.DREAM © {currentYear}
         </span>
         <span className={`${THEME.typography.micro} text-zinc-600 sm:hidden`}>
            © {currentYear}
         </span>
      </div>
    </footer>
  );
};
