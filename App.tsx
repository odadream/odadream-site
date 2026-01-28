import React, { useState, useMemo, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// Types & Constants
import { LotusNode, Language } from "./types";
import { ROOT_NODE } from "./constants";
import { THEME, LAYOUT_VARS } from "./styles/theme";

// Utilities
import { parseContentAndExtractMedia } from "./utils/contentProcessor";
import { findPathToNode } from "./utils/nodeHelpers";

// Components
import { HeaderTabs } from "./components/HeaderTabs";
import { TextPanel } from "./components/TextPanel";
import { LotusGrid } from "./components/LotusGrid";
import { Lightbox } from "./components/Lightbox";

/**
 * Main Application Component
 * Orchestrates the "Blossoming Lotus" navigation methodology.
 *
 * Layout Strategy:
 * - Mobile: Stacked layout (Header -> Text -> Grid). Grid is collapsible and contains Breadcrumbs.
 * - Desktop/Landscape: Side-by-side (Text Panel | Grid Panel [includes Breadcrumbs]).
 */
const App: React.FC = () => {
  // --- URL SYNC HELPER ---
  const getPathFromUrl = (): LotusNode[] => {
    if (typeof window === "undefined") return [ROOT_NODE];
    // Guard against potential security errors accessing location in restricted environments
    try {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get("id");

      if (targetId) {
        const foundPath = findPathToNode(ROOT_NODE, targetId);
        if (foundPath) return foundPath;
      }
    } catch (e) {
      console.warn("Cannot read URL parameters:", e);
    }
    return [ROOT_NODE];
  };

  // --- STATE ---
  // Initialize path based on URL query param
  const [path, setPath] = useState<LotusNode[]>(getPathFromUrl);
  const currentNode = path[path.length - 1];

  // Localization (Default: Russian)
  const [lang, setLang] = useState<Language>("ru");

  // Media Overlay State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<LotusNode | null>(null);

  // Layout State
  const [isGridCollapsed, setIsGridCollapsed] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [navigatorHighlight, setNavigatorHighlight] = useState(false);

  // --- EFFECTS ---

  // 1. Handle Responsive Layout Switching
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 768px), (orientation: landscape)",
    );

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    // Initial check
    setIsDesktop(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 2. URL Synchronization (State -> URL)
  useEffect(() => {
    const currentId = currentNode.id;

    try {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get("id");

      // Only push state if the ID actually changed to avoid redundant history entries
      if (urlId !== currentId) {
        const newUrl =
          currentId === ROOT_NODE.id
            ? window.location.pathname
            : `${window.location.pathname}?id=${currentId}`;

        window.history.pushState({ id: currentId }, "", newUrl);
      }
    } catch (e) {
      // SecurityError can happen in Safari (rate limit) or iframes/file:// (permission)
      // We catch it silently to prevent app crash, as URL sync is progressive enhancement.
      console.warn("URL sync disabled due to environment restrictions:", e);
    }
  }, [currentNode]);

  // 3. Browser History Handling (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      // Re-calculate path from URL when user hits Back/Forward
      const newPath = getPathFromUrl();
      setPath(newPath);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // --- MEMOIZED DATA PROCESSING ---

  // Parse markdown content and extract embedded media for the grid
  const { displayChildren, cleanDescription } = useMemo(() => {
    const rawText = currentNode.description[lang] || "";
    const { cleanText, mediaNodes } = parseContentAndExtractMedia(rawText);

    const staticChildren = currentNode.children || [];

    // Merge static children (sub-pages) with extracted media nodes
    const allChildren = [...staticChildren, ...mediaNodes];

    return {
      displayChildren: allChildren.slice(0, 8), // Max 8 neighbors in 3x3 grid
      cleanDescription: cleanText,
    };
  }, [currentNode, lang]);

  // --- HANDLERS ---

  const handleNavigate = useCallback((node: LotusNode) => {
    if (node.type === "media") {
      setSelectedMedia(node);
      setLightboxOpen(true);
    } else {
      setPath((prev) => [...prev, node]);
    }
  }, []);

  // Stable callback for media clicks to prevent TextPanel re-renders
  const handleMediaClick = useCallback(
    (url: string) => {
      handleNavigate({
        id: "temp-media-viewer",
        title: { en: "Media", ru: "Медиа" },
        shortTitle: { en: "VIEW", ru: "ВИД" },
        type: "media",
        mediaUrl: url,
        description: { en: "", ru: "" },
        children: [],
      } as LotusNode);
    },
    [handleNavigate],
  );

  const handleBack = useCallback(() => {
    setPath((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const handleNavigateToLevel = useCallback((idx: number) => {
    setPath((prev) => prev.slice(0, idx + 1));
  }, []);

  // Deep linking / Jump handler
  const handleJump = useCallback(
    (targetId: string) => {
      if (!targetId) return;

      // Special Interaction: Open Navigator
      if (targetId.toLowerCase() === "navigator") {
        if (isDesktop) {
          // Blink animation on Desktop
          setNavigatorHighlight(true);
          setTimeout(() => setNavigatorHighlight(false), 1000);
        } else {
          // Open Grid on Mobile
          setIsGridCollapsed(false);
        }
        return;
      }

      if (["home", "root"].includes(targetId.toLowerCase())) {
        setPath([ROOT_NODE]);
        return;
      }

      const newPath = findPathToNode(ROOT_NODE, targetId);

      if (newPath) {
        setPath(newPath);
      } else {
        console.warn(`Target node "${targetId}" not found in graph.`);
      }
    },
    [isDesktop],
  );

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ru" : "en"));
  }, []);

  // --- RENDER ---

  return (
    <div className={THEME.layout.fullScreen} style={LAYOUT_VARS}>
      {/* LAYER 1: OVERLAYS (Lightbox) */}
      <AnimatePresence>
        {lightboxOpen && selectedMedia && (
          <Lightbox
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            mediaUrl={selectedMedia.mediaUrl}
            title={selectedMedia.title[lang]}
          />
        )}
      </AnimatePresence>

      {/* LAYER 2: GLOBAL NAVIGATION (Top Bar) */}
      <HeaderTabs
        onNavigate={(n) => handleJump(n.id)}
        currentId={currentNode.id}
        lang={lang}
        onToggleLang={toggleLang}
      />

      {/* LAYER 3: MAIN WORKSPACE (Split View) */}
      <main className={THEME.layout.mainContent}>
        {/* LEFT/TOP: TEXT CONTEXT */}
        <section className={THEME.layout.textSection}>
          <TextPanel
            node={currentNode}
            cleanDescription={cleanDescription}
            onLinkClick={handleJump}
            onMediaClick={handleMediaClick}
            lang={lang}
          />
        </section>

        {/* RIGHT/BOTTOM: NEURAL GRID (Visual Navigation + Breadcrumbs) */}
        <LotusGrid
          currentNode={currentNode}
          displayChildren={displayChildren}
          path={path}
          onNavigate={handleNavigate}
          onBack={handleBack}
          onNavigateToLevel={handleNavigateToLevel}
          canGoBack={path.length > 1}
          isCollapsed={isGridCollapsed}
          onToggleCollapse={setIsGridCollapsed}
          isLandscape={isDesktop}
          lang={lang}
          highlightHeader={navigatorHighlight}
        />
      </main>
    </div>
  );
};

export default App;
