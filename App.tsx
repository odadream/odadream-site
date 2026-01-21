import React, { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LotusNode } from './types';
import { ROOT_NODE } from './constants';
import { parseContentAndExtractMedia } from './utils/contentProcessor';
import { findPathToNode } from './utils/nodeHelpers';
import { Breadcrumbs } from './components/Breadcrumbs';
import { FooterNav } from './components/FooterNav';
import { TextPanel } from './components/TextPanel';
import { LotusGrid } from './components/LotusGrid';
import { Lightbox } from './components/Lightbox';
import { THEME } from './styles/theme';

const App: React.FC = () => {
  const [path, setPath] = useState<LotusNode[]>([ROOT_NODE]);
  const currentNode = path[path.length - 1];
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<LotusNode | null>(null);

  // Data Processing
  const { displayChildren, cleanDescription, hasOverflow } = useMemo(() => {
    const { cleanText, mediaNodes } = parseContentAndExtractMedia(currentNode.description);
    const staticChildren = currentNode.children || [];
    const allChildren = [...staticChildren, ...mediaNodes];
    return { 
        displayChildren: allChildren.slice(0, 8), 
        cleanDescription: cleanText, 
        hasOverflow: allChildren.length > 8 
    };
  }, [currentNode]);

  // Actions
  const handleNavigate = useCallback((node: LotusNode) => {
    if (node.type === 'media') {
        setSelectedMedia(node);
        setLightboxOpen(true);
    } else {
        setPath(prev => [...prev, node]);
    }
  }, []);

  const handleBack = useCallback(() => {
    setPath(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const handleJump = useCallback((targetId: string) => {
     if (['home', 'root'].includes(targetId.toLowerCase())) {
         setPath([ROOT_NODE]);
         return;
     }
     const newPath = findPathToNode(ROOT_NODE, targetId);
     if (newPath) setPath(newPath);
  }, []);

  return (
    <div className={THEME.layout.fullScreen}>
      
      {/* --- LAYER 1: OVERLAYS --- */}
      <AnimatePresence>
        {lightboxOpen && selectedMedia && (
            <Lightbox 
                isOpen={lightboxOpen} 
                onClose={() => setLightboxOpen(false)} 
                mediaUrl={selectedMedia.mediaUrl}
                title={selectedMedia.title}
            />
        )}
      </AnimatePresence>

      {/* --- LAYER 2: TOP BAR --- */}
      <Breadcrumbs 
        path={path} 
        onNavigateToLevel={(idx) => setPath(p => p.slice(0, idx + 1))} 
      />

      {/* --- LAYER 3: MAIN WORKSPACE --- */}
      <main className={THEME.layout.mainContent}>
        
        {/* LEFT/TOP: TEXT CONTEXT */}
        <section className={THEME.layout.textSection}>
            <TextPanel 
                node={currentNode} 
                cleanDescription={cleanDescription}
                hasOverflow={hasOverflow}
                onLinkClick={handleJump}
                onMediaClick={(url) => handleNavigate({ 
                    id: 'temp', title: 'Media', type: 'media', 
                    mediaUrl: url, description: '' 
                } as LotusNode)}
            />
        </section>

        {/* RIGHT/BOTTOM: NEURAL GRID */}
        <section className={THEME.layout.gridSection}>
            <LotusGrid 
                currentNode={currentNode} 
                displayChildren={displayChildren}
                onNavigate={handleNavigate} 
                onBack={handleBack}
                canGoBack={path.length > 1}
            />
        </section>
      </main>

      {/* --- LAYER 4: QUICK NAV --- */}
      <FooterNav 
        onNavigate={(n) => handleJump(n.id)} 
        currentId={currentNode.id} 
      />
    </div>
  );
};

export default App;