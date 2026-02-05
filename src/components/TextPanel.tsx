
import React, { useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Image as ImageIcon, Film, AudioLines } from 'lucide-react';
import Markdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { THEME } from '../styles/theme';
import { FADE_UP_VARIANTS } from '../styles/animations';
import { SITE_VERSION } from '../constants';
import { stripH1, transformWikiLinks } from '../utils/contentProcessor';
import { getMediaType, detachPosterFromUrl } from '../utils/mediaHelpers';
import { CyberText } from './CyberText';
import { useNavigation } from '../context/NavigationContext';

const MotionDiv = motion.div as any;

interface TextPanelProps {}

// SECURITY: Allow only safe protocols
const isSafeUrl = (url?: string) => {
    if (!url) return false;
    // Allow http, https, mailto, tel, and relative paths (/) or anchors (#)
    return /^(https?:\/\/|mailto:|tel:|\/|#)/.test(url);
};

export const TextPanel: React.FC<TextPanelProps> = () => {
  const { currentNode, lang, jumpToId, openLightbox } = useNavigation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll on ID change
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
    }
  }, [currentNode.id]);

  const rawDescription = currentNode.description[lang] || "";

  const content = useMemo(() => {
    const noH1 = stripH1(rawDescription);
    return transformWikiLinks(noH1);
  }, [rawDescription]);

  const handleMediaClick = (srcWithParams: string, label: string) => {
     if (!srcWithParams) return;
     const { cleanUrl } = detachPosterFromUrl(srcWithParams);
     const safeUrl = cleanUrl.trim();
     if (!safeUrl || safeUrl === '') return;

     openLightbox({
         id: 'temp-media',
         title: { en: label, ru: label },
         description: { en: '', ru: '' },
         type: 'media',
         mediaUrl: safeUrl,
         mediaType: getMediaType(safeUrl)
     } as any);
  };

  const markdownComponents: Components = useMemo(() => ({
        h1: ({children}) => <h1 className="hidden">{children}</h1>, 
        h2: ({children}) => <h2 className={THEME.typography.h2}>{children}</h2>,
        h3: ({children}) => <h3 className={THEME.typography.h3}>{children}</h3>,
        // UPDATED: 
        // [&>p]:!my-0 -> CRITICAL: Forces inner paragraph margins to 0. This removes the "Prose" default margins.
        // py-3 -> Explicit vertical padding handles the centering perfectly now.
        // leading-snug -> Tighter line height for the quote text.
        blockquote: ({children}) => <blockquote className="relative border-l-2 border-zinc-700 pl-4 py-3 my-8 text-zinc-500 text-sm italic [&>p]:!my-0 [&>p]:leading-snug">{children}</blockquote>,
        ul: ({children}) => <ul className="list-disc list-outside pl-6 space-y-1 my-4 marker:text-zinc-600">{children}</ul>,
        ol: ({children}) => <ol className="list-decimal list-outside pl-6 space-y-1 my-4 marker:text-zinc-500 marker:font-mono marker:text-xs text-zinc-400">{children}</ol>,
        li: ({children}) => <li className="text-zinc-400 text-left leading-relaxed pl-1">{children}</li>,
        a: ({href, children}) => {
            if (href?.includes('?internal=true')) {
                const idMatch = href.match(/[?&]id=([^&]+)/);
                const id = idMatch ? idMatch[1] : href;
                return <button onClick={() => jumpToId(id)} className={THEME.interactive.linkInternal}>{children}</button>;
            }
            
            // SECURITY: Sanitize external link
            if (!isSafeUrl(href)) {
                return <span className="text-red-500/50 cursor-not-allowed" title="Unsafe Link">{children}</span>;
            }

            // Removed 'inline' class from ExternalLink to let flex items-center handle alignment strictly
            return <a href={href} target="_blank" rel="noopener noreferrer" className={THEME.interactive.linkInternal}>{children} <ExternalLink className="w-2.5 h-2.5 opacity-50 ml-0.5" /></a>;
        },
        img: ({src, alt}) => {
            if (!src || typeof src !== 'string') return null;
            
            const { cleanUrl } = detachPosterFromUrl(src);
            const type = getMediaType(cleanUrl);
            
            let displayLabel = alt;
            if (displayLabel && displayLabel.includes('|')) {
                displayLabel = displayLabel.split('|')[0].trim();
            }
            if (!displayLabel || displayLabel === src || displayLabel.includes('http')) {
                displayLabel = type === 'video' ? (lang === 'ru' ? 'ВИДЕО' : 'VIDEO') : type === 'audio' ? (lang === 'ru' ? 'АУДИО' : 'AUDIO') : (lang === 'ru' ? 'ИЗОБРАЖЕНИЕ' : 'IMAGE');
            }

            const Icon = type === 'video' ? Film : type === 'audio' ? AudioLines : ImageIcon;
            
            return (
                <button 
                    onClick={() => handleMediaClick(src, displayLabel || 'Media')} 
                    className={THEME.interactive.linkMedia} 
                    title={lang === 'ru' ? 'Открыть' : 'Open'}
                >
                    <Icon className="w-2.5 h-2.5" />
                    <span>{displayLabel}</span>
                </button>
            );
        },
        code: ({children}) => <code className="font-mono text-[0.8em] text-zinc-400 bg-zinc-900 px-1 rounded border border-zinc-800 mx-0.5">{children}</code>,
        hr: () => <hr className="border-t border-zinc-800 my-8 opacity-30" />,
        strong: ({children}) => <strong className="text-zinc-200 font-bold">{children}</strong>,
        em: ({children}) => <em className="italic text-zinc-500 font-serif tracking-wide">{children}</em>,
        p: ({children}) => <p className="mb-4 text-left last:mb-0 leading-relaxed">{children}</p>
    }), [jumpToId, lang]);

  return (
    <div className={`relative flex-1 min-h-0 flex flex-col w-full`}>
      <div ref={scrollRef} className={`${THEME.panel.scrollableText} ${THEME.layout.paddingX} ${THEME.layout.paddingY}`}>
        <AnimatePresence mode="wait">
            <MotionDiv
                key={currentNode.id + lang} 
                variants={FADE_UP_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                // UPDATED: Added pl-3.
                // Rationale: The Header Tabs above have 'px-5 md:px-10' on the container, 
                // BUT the specific tab buttons have 'px-3'.
                // So text starts at Offset + 12px.
                // We add pl-3 (12px) here so the H1 and Content align perfectly with the Tab Text.
                className="pb-24 md:pb-24 max-w-2xl w-full text-left pl-3"
            >
                <div className="relative flex flex-col justify-end mb-6 border-b border-zinc-900 pb-4">
                    <div className="flex flex-row items-end justify-between min-h-[2rem]">
                        <h1 className={THEME.typography.h1}>
                            <CyberText text={currentNode.title[lang]} triggerKey={currentNode.id} />
                        </h1>
                        <div className="flex flex-col items-end shrink-0 text-right opacity-50 ml-4 pb-1">
                            <span className={`${THEME.typography.meta} text-accent/80`}>{currentNode.type}</span>
                            <span className={`${THEME.typography.meta} text-zinc-600 mt-0.5`}>#{currentNode.id.toUpperCase().substring(0, 4)}</span>
                        </div>
                    </div>
                </div>
                
                <div className={THEME.typography.body}>
                    <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{content}</Markdown>
                </div>
                    
                <div className={THEME.typography.contentFooter}>
                    <div className="flex flex-wrap justify-between gap-y-8 gap-x-12 items-start">
                        
                        <div className="flex flex-col gap-2 min-w-[200px] flex-1">
                            <span className={`${THEME.typography.meta} text-zinc-600 select-none`}>KEYWORDS</span>
                            {currentNode.tags && currentNode.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-x-3 gap-y-2 leading-relaxed">
                                    {currentNode.tags.map(tag => (
                                        <span key={tag} className={`${THEME.typography.meta} text-zinc-400`}>
                                            <span className="text-zinc-600 mr-px">#</span>{tag}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className={`${THEME.typography.meta} text-zinc-800 tracking-widest`}>// VOID</span>
                            )}
                        </div>

                        <div className="flex gap-8 md:gap-12 shrink-0">
                            <div className="flex flex-col gap-2 md:text-right">
                                <span className={`${THEME.typography.meta} text-zinc-600 select-none`}>LAST UPDATE</span>
                                <span className={`${THEME.typography.meta} text-zinc-400`}>{currentNode.lastModified || '2024.01.01'}</span>
                            </div>

                            <div className="flex flex-col gap-2 md:text-right">
                                <span className={`${THEME.typography.meta} text-zinc-600 select-none`}>SYSTEM VER</span>
                                <span className={`${THEME.typography.meta} text-accent/80`}>{SITE_VERSION}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </MotionDiv>
        </AnimatePresence>
      </div>
    </div>
  );
};
