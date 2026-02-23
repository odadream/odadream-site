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
  const { lang, lightboxMedia, closeLightbox, isDesktop, isGridCollapsed } =
    useNavigation();

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

      {/* 
        main is `relative` so LotusGrid (absolute on mobile) positions against it.
        On desktop: normal flex-row layout unchanged.
        On mobile: TextPanel fills full height, LotusGrid overlays from bottom.
      */}
      <main className={THEME.layout.mainContent}>
        <section
          className={THEME.layout.textSection}
          style={
            // When drawer is open on mobile, add padding so text is scrollable
            // past the drawer. CSS var matches --lotus-panel-height.
            !isDesktop && !isGridCollapsed
              ? { paddingBottom: "var(--lotus-panel-height)" }
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
