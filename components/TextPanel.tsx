import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { LotusNode } from '../types';
import { THEME } from '../styles/theme';
import { stripH1 } from '../utils/contentProcessor';

interface TextPanelProps {
  node: LotusNode;
  cleanDescription?: string;
  hasOverflow?: boolean;
  onLinkClick: (target: string) => void;
  onMediaClick: (url: string) => void;
}

const InlineRenderer: React.FC<{ text: string; onLinkClick: any; onMediaClick: any }> = ({ text, onLinkClick, onMediaClick }) => {
    // Regex matches: 1. ![[url]], 2. [[link]], 3. **bold**, 4. _italic_
    const parts = text.split(/(!?\[\[.*?\]\]|\*\*.*?\*\*|_.*?_)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (!part) return null;
                
                // Image/Media Link: ![[url]]
                const mediaMatch = part.match(/^!\[\[(.*?)\]\]$/);
                if (mediaMatch) {
                    const url = mediaMatch[1];
                    const name = "View Media";
                    return (
                        <button key={i} onClick={() => onMediaClick(url)} className={THEME.interactive.linkMedia} title="View Media">
                            <ImageIcon className="w-3 h-3" /> <span>{name}</span>
                        </button>
                    );
                }
                
                // Internal Jump Link: [[Target]]
                const linkMatch = part.match(/^\[\[(.*?)\]\]$/);
                if (linkMatch) {
                    return (
                        <button key={i} onClick={() => onLinkClick(linkMatch[1])} className={THEME.interactive.linkInternal}>
                            {linkMatch[1]}<ExternalLink className="w-2.5 h-2.5 opacity-50" />
                        </button>
                    );
                }
                
                // Bold: **text**
                const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
                if (boldMatch) return <strong key={i} className="text-white font-semibold">{boldMatch[1]}</strong>;
                
                // Italic: _text_
                const italicMatch = part.match(/^_(.*?)_$/);
                if (italicMatch) return <em key={i} className="italic text-accent-text/90">{italicMatch[1]}</em>;

                return <span key={i}>{part}</span>;
            })}
        </>
    );
};

export const TextPanel: React.FC<TextPanelProps> = ({ node, cleanDescription, hasOverflow, onLinkClick, onMediaClick }) => {
  const content = useMemo(() => stripH1(cleanDescription || node.description), [cleanDescription, node.description]);
  const lines = useMemo(() => content.split('\n'), [content]);

  return (
    <div className={THEME.panel.scrollableText}>
      <AnimatePresence mode="wait">
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="pb-20" /* Extra padding at bottom for comfortable scrolling */
        >
          {/* Main Header */}
          <h1 className={THEME.typography.h1}>{node.title}</h1>
          
          {/* Decorative Divider */}
          <div className="flex items-center gap-2 mb-8">
             <div className="w-12 h-0.5 bg-accent" />
             <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Content Body */}
          <div className={THEME.typography.body}>
             {lines.map((line, i) => {
                const trimmed = line.trim();
                
                // Headers
                if (line.startsWith('## ')) 
                    return <h2 key={i} className={THEME.typography.h2}>{line.replace('## ', '')}</h2>;
                
                if (line.startsWith('### ')) 
                    return <h3 key={i} className="text-white/80 font-bold mt-6 mb-2 uppercase text-xs tracking-wider border-l-2 border-accent/20 pl-2">{line.replace('### ', '')}</h3>;
                
                // Blockquotes
                if (line.startsWith('> ')) 
                    return <blockquote key={i} className="border-l-2 border-accent pl-4 py-2 my-6 italic text-txt-dim bg-white/5 pr-2"><InlineRenderer text={line.replace('> ', '')} onLinkClick={onLinkClick} onMediaClick={onMediaClick} /></blockquote>;
                
                // Lists
                if (trimmed.startsWith('- ')) 
                    return <li key={i} className="list-none relative pl-4 my-1 before:content-['•'] before:absolute before:left-0 before:text-accent"><InlineRenderer text={line.replace('- ', '')} onLinkClick={onLinkClick} onMediaClick={onMediaClick} /></li>;
                
                // Empty lines
                if (trimmed === '') 
                    return <div key={i} className="h-3" />;
                
                // Standard Paragraph
                return <p key={i} className="mb-3 leading-7"><InlineRenderer text={line} onLinkClick={onLinkClick} onMediaClick={onMediaClick} /></p>;
             })}
          </div>
            
          {/* Tags Footer */}
          {node.tags && node.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-white/5">
              {node.tags.map(tag => <span key={tag} className={THEME.typography.tag}>#{tag}</span>)}
            </div>
          )}

          {/* Overflow Warning */}
          {hasOverflow && (
            <div className="mt-8 p-3 border border-dashed border-white/10 rounded flex items-center gap-3 bg-black/20">
                <AlertTriangle className="w-4 h-4 text-accent/50" />
                <span className="text-[10px] text-txt-dim font-mono uppercase tracking-wider">Explore grid for more content</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};