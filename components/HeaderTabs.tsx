
import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft, Globe } from 'lucide-react';
import { QUICK_ACCESS } from '../constants';
import { LotusNode, Language } from '../types';
import { useScrollOverflow } from '../hooks/useScrollOverflow';
import { THEME } from '../styles/theme';

interface HeaderTabsProps {
  onNavigate: (node: LotusNode) => void;
  currentId: string;
  lang: Language;
  onToggleLang: () => void;
}

export const HeaderTabs: React.FC<HeaderTabsProps> = ({ onNavigate, currentId, lang, onToggleLang }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight, scroll, checkScroll } = useScrollOverflow(scrollRef);

  return (
    <header className={`${THEME.layout.barHeight} w-full bg-canvas/90 backdrop-blur-md flex items-center relative shrink-0 z-50 group justify-between select-none border-b border-white/10`}>
      
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        
        {/* Left Scroll Indicator */}
        <button 
            onClick={() => scroll('left', 200)}
            className={`
                absolute left-0 top-0 bottom-0 z-20 w-12 pl-1 flex items-center justify-start
                bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent transition-opacity duration-300
                ${canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
        >
            <ChevronLeft className="w-4 h-4 text-accent drop-shadow-neon" />
        </button>

        {/* Scroll Area with Adjusted Padding for Text Alignment */}
        <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className={`flex items-center ${THEME.layout.headerPaddingX} overflow-x-auto scrollbar-hide w-full h-full gap-1 scroll-smooth`}
        >
            <div className={`shrink-0 transition-all duration-300 ${canScrollLeft ? 'w-4' : 'w-0'}`} />

            {QUICK_ACCESS.map((node) => {
            const isActive = currentId === node.id;
            return (
                <button
                    key={node.id}
                    onClick={() => onNavigate(node)}
                    className={`
                    ${THEME.typography.uiLabel}
                    relative px-3 py-2 transition-all duration-300 whitespace-nowrap rounded-sm group/tab
                    ${isActive 
                        ? 'text-accent font-bold' 
                        : 'text-zinc-500 hover:text-zinc-200'} 
                    `}
                >
                    <span className="relative z-10">{node.shortTitle?.[lang] || node.title[lang]}</span>
                    {!isActive && (
                        <span className="absolute inset-0 bg-white/5 opacity-0 group-hover/tab:opacity-100 transition-opacity rounded-sm" />
                    )}
                </button>
            );
            })}
            
            <div className={`shrink-0 transition-all duration-300 ${canScrollRight ? 'w-4' : 'w-0'}`} />
        </div>

        {/* Right Scroll Indicator */}
        <button 
            onClick={() => scroll('right', 200)}
            className={`
                absolute right-0 top-0 bottom-0 z-20 w-12 pr-1 flex items-center justify-end
                bg-gradient-to-l from-[#050505] via-[#050505]/90 to-transparent transition-opacity duration-300
                ${canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
        >
            <ChevronRight className="w-4 h-4 text-accent drop-shadow-neon" />
        </button>
      </div>

      <div className="flex items-center h-full pl-2 pr-4 bg-transparent z-40">
          <button 
            onClick={onToggleLang}
            className={`flex items-center gap-2 px-2 py-1 ${THEME.typography.uiLabel} text-zinc-500 hover:text-white transition-all hover:bg-white/5 rounded`}
          >
             <Globe className="w-3 h-3 transition-transform duration-500 hover:rotate-180" />
             <span>{lang}</span>
          </button>
      </div>
    </header>
  );
};
