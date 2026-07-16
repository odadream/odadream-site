import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { NavigationProvider, useNavigation, useLightbox } from "./context/NavigationContext";
import { THEME } from "./styles/theme";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Components
import { HeaderTabs } from "./components/HeaderTabs";
import { TextPanel } from "./components/TextPanel";
import { LotusGrid } from "./components/LotusGrid";
import { Lightbox } from "./components/Lightbox";

const Layout: React.FC = () => {
  const { lang } = useNavigation();
  const { lightboxMedia, closeLightbox } = useLightbox();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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

const AppContent: React.FC = () => {
  return <Layout />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </ErrorBoundary>
  );
};

export default App;
