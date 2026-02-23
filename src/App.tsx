import React from "react";
import { AnimatePresence } from "framer-motion";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import { THEME } from "./styles/theme";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Components
import { HeaderTabs } from "./components/HeaderTabs";
import { TextPanel } from "./components/TextPanel";
import { LotusGrid } from "./components/LotusGrid";
import { Lightbox } from "./components/Lightbox";

const Layout: React.FC = () => {
  const { lang, lightboxMedia, closeLightbox, isDesktop } = useNavigation();

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
        <section
          className={THEME.layout.textSection}
          style={
            // On mobile: paddingBottom tracks drawer position via CSS var
            // Updated frame-by-frame by LotusGrid effect, so animation is in sync
            !isDesktop
              ? {
                  paddingBottom: "var(--drawer-open-px, 0px)",
                  transition:
                    "padding-bottom 380ms cubic-bezier(0.32, 0.72, 0, 1)",
                }
              : undefined
          }
        >
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
