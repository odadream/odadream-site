import React, { Suspense, lazy, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { NavigationProvider, useNavigation, useLightbox } from "./context/NavigationContext";
import { THEME } from "./styles/theme";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Components
import { HeaderTabs } from "./components/HeaderTabs";

// Heavy tree-shaken panels are code-split so markdown/framer runtime only
// loads when needed and the initial bundle stays under the 500 KB budget.
const TextPanel = lazy(() =>
  import("./components/TextPanel").then((m) => ({ default: m.TextPanel })),
);
const LotusGrid = lazy(() =>
  import("./components/LotusGrid").then((m) => ({ default: m.LotusGrid })),
);
const Lightbox = lazy(() =>
  import("./components/Lightbox").then((m) => ({ default: m.Lightbox })),
);

const PanelFallback: React.FC = () => (
  <div className={THEME.layout.mainContent} aria-hidden="true" />
);

const Layout: React.FC = () => {
  const { lang } = useNavigation();
  const { lightboxMedia, closeLightbox } = useLightbox();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className={THEME.layout.fullScreen}>
      <HeaderTabs />

      <Suspense fallback={<PanelFallback />}>
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

        <main className={THEME.layout.mainContent}>
          <section className={THEME.layout.textSection}>
            <TextPanel />
          </section>

          <LotusGrid />
        </main>
      </Suspense>
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
