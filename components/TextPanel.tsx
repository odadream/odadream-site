
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Image as ImageIcon, Hash, Film, AudioLines } from 'lucide-react';
import Markdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LotusNode, Language } from '../types';
import { THEME } from '../styles/theme';
import { SITE_VERSION } from '../constants';
import { stripH1 } from '../utils/contentProcessor';
import { getMediaType } from '../utils/mediaHelpers';
import { CyberText } from './CyberText';

// Casting to any for MotionDiv to bypass strict type checking issues in some environments
const MotionDiv = motion.div as any;

interface TextPanelProps {
  node: LotusNode;
  cleanDescription?: string;
  onLinkClick: (target: string) => void;
  onMediaClick: (url: string) => void;
  lang: Language;
}

const TextPanelBase: React.FC<TextPanelProps> = ({ 
    node, 
    cleanDescription, 
    onLinkClick, 
    onMediaClick, 
    lang 
}) => {
  
  const content = useMemo(() => {
    let text = stripH1(cleanDescription || node.description[lang] || '');
    
    // Support for [[id|Label]] syntax (Must be processed before [[id]])
    text = text.replace(/\[\[(.*?)\|(.*?)\]\]/g, '[$2](?internal=true&id=$1)');
    
    // Support for [[id]] syntax
    text = text.replace(/\[\[(.*?)\]\]/g, '[$1](?internal=true&id=$1)');
    
    // Support for ![[url]] syntax
    text = text.replace(/!\[\[(.*?)\]\]/g, '![$1]($1)');
    return text;
  }, [cleanDescription, node.description, lang]);

  const markdownComponents: Components = useMemo(() => ({
        h1: ({children}) => <h1 className="hidden">{children}</h1>, 
        h2: ({children}) => <h2 className={THEME.typography.h2}>{children}</h2>,
        h3: ({children}) => <h3 className={THEME.typography.h3}>{children}</h3>,
        
        blockquote: ({children}) => (
            <blockquote className="relative border-l-2 border-zinc-700 pl-4 py-1 my-6 text-zinc-500 text-sm italic">
                {children}
            </blockquote>
        ),

        ul: ({children}) => <ul className="list-disc list-outside pl-6 space-y-1 my-4 marker:text-zinc-600">{children}</ul>,
        ol: ({children}) => <ol className="list-decimal list-outside pl-6 space-y-1 my-4 marker:text-zinc-500 marker:font-mono marker:text-xs text-zinc-400">{children}</ol>,
        li: ({children}) => <li className="text-zinc-300 text-left leading-relaxed pl-1">{children}</li>,

        a: ({href, children}) => {
            if (href?.includes('?internal=true')) {
                // Handle potential query params or clean ID extraction
                const idMatch = href.match(/[?&]id=([^&]+)/);
                const id = idMatch ? idMatch[1] : href;
                return (
                    <button onClick={() => onLinkClick(id)} className={THEME.interactive.linkInternal}>
                        {children}
                    </button>
                );
            }
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" className={THEME.interactive.linkInternal}>
                    {children} <ExternalLink className="w-2.5 h-2.5 inline opacity-50 ml-0.5" />
                </a>
            );
        },

        img: ({src, alt}) => {
            if (!src || typeof src !== 'string') return null;
            const type = getMediaType(src);
            let displayLabel = alt;
            if (!alt || alt === src || alt.includes('http') || alt.includes('googleapis')) {
                displayLabel = type === 'video' ? (lang === 'ru' ? 'ВИДЕО' : 'VIDEO') : 
                               type === 'audio' ? (lang === 'ru' ? 'АУДИО' : 'AUDIO') : 
                               (lang === 'ru' ? 'ИЗОБРАЖЕНИЕ' : 'IMAGE');
            }
            const Icon = type === 'video' ? Film : type === 'audio' ? AudioLines : ImageIcon;
            return (
                <button 
                    onClick={() => onMediaClick(src)} 
                    className={THEME.interactive.linkMedia}
                    title="Open Media"
                >
                    <Icon className="w-2.5 h-2.5" />
                    <span>{displayLabel}</span>
                </button>
            );
        },

        code: ({children}) => (
            <code className="font-mono text-[0.8em] text-zinc-400 bg-zinc-900 px-1 rounded border border-zinc-800 mx-0.5">
                {children}
            </code>
        ),
        hr: () => <hr className="border-t border-zinc-800 my-8 opacity-30" />,
        strong: ({children}) => <strong className="text-zinc-100 font-bold">{children}</strong>,
        em: ({children}) => <em className="italic text-zinc-500 font-serif tracking-wide">{children}</em>,
        p: ({children}) => <p className="mb-4 text-left last:mb-0 leading-relaxed">{children}</p>
    }), [onLinkClick, onMediaClick, lang]);

  return (
    <div className={`relative flex-1 min-h-0 flex flex-col w-full`}>
      {/* Container with Unified Vertical Padding */}
      <div className={`${THEME.panel.scrollableText} ${THEME.layout.paddingX} ${THEME.layout.paddingY}`}>
        <AnimatePresence mode="wait">
            <MotionDiv
                key={node.id + lang} 
                layout 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="pb-36 md:pb-24 max-w-2xl w-full text-left"
            >
                {/* Header Row: Aligned with barHeight */}
                <div className="relative flex flex-col justify-end mb-6 border-b border-zinc-900 pb-4">
                    <div className="flex flex-row items-end justify-between min-h-[2rem]">
                        <h1 className={THEME.typography.h1}>
                            <CyberText text={node.title[lang]} triggerKey={node.id} />
                        </h1>
                        
                        <div className="flex flex-col items-end shrink-0 text-right opacity-50 ml-4 pb-1">
                            <span className={`${THEME.typography.micro} text-accent/80`}>{node.type}</span>
                            <span className={`${THEME.typography.micro} text-zinc-600 mt-0.5`}>
                                #{node.id.toUpperCase().substring(0, 4)}
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Content Body */}
                <div className={THEME.typography.body}>
                    <Markdown 
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {content}
                    </Markdown>
                </div>
                    
                {/* Tags Footer */}
                {node.tags && node.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t border-zinc-900 opacity-60 hover:opacity-100 transition-opacity justify-start">
                        <Hash className="w-3 h-3 text-zinc-700 mt-1" />
                        {node.tags.map(tag => <span key={tag} className={THEME.typography.tag}>{tag}</span>)}
                    </div>
                )}

                {/* Metadata Footer */}
                <div className={`${THEME.typography.contentFooter} ${THEME.typography.micro}`}>
                    <div className="flex flex-col items-start">
                        <span className="text-zinc-600 mb-1">LAST UPDATE</span>
                        <span className="text-zinc-500 font-bold">{node.lastModified || '2024.01.01'}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-zinc-600 mb-1">SYSTEM VER</span>
                        <span className="text-zinc-500 font-bold">{SITE_VERSION}</span>
                    </div>
                </div>

            </MotionDiv>
        </AnimatePresence>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none z-20 md:hidden" />
    </div>
  );
};

export const TextPanel = React.memo(TextPanelBase);
