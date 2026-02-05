
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { THEME } from './styles/theme';
import { ErrorBoundary } from './components/ErrorBoundary';

// Components
import { HeaderTabs } from './components/HeaderTabs'; 
import { TextPanel } from './components/TextPanel';
import { LotusGrid } from './components/LotusGrid';
import { Lightbox } from './components/Lightbox';

const Layout: React.FC = () => {
  const { 
    lang, lightboxMedia, closeLightbox 
  } = useNavigation();

  return (
    <div className={THEME.layout.fullScreen}>
      <AnimatePresence>
        {lightboxMedia && (
            <Lightbox 
                isOpen={!!lightboxMedia} 
                onClose={closeLightbox} 
                mediaUrl={lightboxMedia.mediaUrl}
                title={lightboxMedia.title[lang]}
            />
        )}
      </AnimatePresence>

      <HeaderTabs />

      <main className={THEME.layout.mainContent}>
        <section className={THEME.layout.textSection}>
            <TextPanel />
        </section>

        <LotusGrid />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
        <NavigationProvider>
           <Layout />
        </NavigationProvider>
    </ErrorBoundary>
  );
};

export default App;
