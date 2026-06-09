import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { LotusNode, Language, Theme } from "../types";
import { ROOT_NODE, NODE_REGISTRY } from "../constants";
import { findPathToNode } from "../utils/nodeHelpers";
import { getDefaultNodeImage } from "../utils/mediaHelpers";
import { preloadLotusGrid } from "../utils/preloadLotusGrid";
import { updateMetaTags } from "../utils/metaTags";

interface NavigationContextType {
  path: LotusNode[];
  currentNode: LotusNode;
  lang: Language;
  theme: Theme;
  isDesktop: boolean;
  isGridCollapsed: boolean;
  /** Lotus panel display mode: contextual 3x3 navigation vs full fractal sitemap. */
  lotusMode: "grid" | "map";
  navigatorHighlight: boolean;
  nodeRegistry: Map<string, LotusNode>;
  /** Nodes to return to after embedded (![[nodeId]]) navigation */
  historyStack: LotusNode[];

  // Actions
  navigate: (node: LotusNode) => void;
  /** Navigate to embedded node, pushing current onto historyStack */
  navigateHistory: (node: LotusNode) => void;
  /** Return to previous node in historyStack */
  goBackHistory: () => void;
  goBack: () => void;
  jumpToId: (id: string) => void;
  jumpToLevel: (index: number) => void;
  toggleLang: () => void;
  cycleTheme: () => void;
  toggleGrid: (collapsed: boolean) => void;
  triggerNavigatorHighlight: () => void;
  toggleLotusMode: () => void;
}

// Lightbox lives in a separate context so opening/closing it doesn't
// re-render every GridCell + sidebar subscribed to NavigationContext.
interface LightboxContextType {
  lightboxMedia: LotusNode | null;
  openLightbox: (mediaNode: LotusNode) => void;
  closeLightbox: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);
const LightboxContext = createContext<LightboxContextType | undefined>(
  undefined,
);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const useLightbox = () => {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a NavigationProvider");
  }
  return context;
};

// --- HELPER: PRELOADER ---
const preloadImage = (url: string) => {
  if (!url) return;
  const img = new Image();
  img.src = url;
};

const preloadNodeAssets = (node: LotusNode) => {
  // 1. Preload node's own main image (if not loaded)
  if (node.imageUrl) preloadImage(node.imageUrl);
  if (node.mediaUrl && !node.mediaUrl.endsWith(".mp4"))
    preloadImage(node.mediaUrl);

  // 2. Preload children images (The "Next Step" prediction)
  if (node.children) {
    node.children.forEach((child) => {
      if (child.imageUrl) preloadImage(child.imageUrl);
      // Also preload default generated assets if direct image missing
      else preloadImage(getDefaultNodeImage(child.id));
    });
  }
};

// --- HELPER: URL SYNC ---
const getPathFromUrl = (): LotusNode[] => {
  if (typeof window === "undefined") return [ROOT_NODE];
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

/** Serialized into history.pushState for browser back/forward sync. */
type NavHistoryState = { id: string; history: string[] };

const historyIds = (stack: LotusNode[]): string[] =>
  stack.map((n) => n.id);

const historyFromIds = (
  ids: string[],
  registry: Map<string, LotusNode>,
): LotusNode[] =>
  ids
    .map((id) => registry.get(id))
    .filter((n): n is LotusNode => n !== undefined);

const buildUrl = (nodeId: string, lang: Language): string => {
  const p = new URLSearchParams();
  if (nodeId !== ROOT_NODE.id) p.set("id", nodeId);
  p.set("lang", lang);
  return `${window.location.pathname}?${p.toString()}`;
};

// --- HELPER: LANG DETECTION ---
const getInitialLang = (): Language => {
  if (typeof window === "undefined") return "en";
  try {
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang === "en" || urlLang === "ru") return urlLang as Language;
  } catch (e) {}
  try {
    const saved = localStorage.getItem("oda_lang");
    if (saved === "en" || saved === "ru") return saved as Language;
  } catch (e) {}
  try {
    const nav = window.navigator;
    const browserLang =
      nav.language ||
      (nav.languages && nav.languages.length > 0 ? nav.languages[0] : null);
    if (browserLang && browserLang.toLowerCase().startsWith("ru")) return "ru";
  } catch (e) {}
  return "en";
};

// --- HELPER: THEME DETECTION ---
const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = localStorage.getItem("oda_theme");
    if (saved && ["dark", "light", "ocean", "matrix"].includes(saved)) {
      return saved as Theme;
    }
  } catch (e) {}
  return "dark";
};

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // State
  const [path, setPath] = useState<LotusNode[]>(getPathFromUrl);
  const [lang, setLang] = useState<Language>(getInitialLang);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [isGridCollapsed, setIsGridCollapsed] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem("oda_drawer_collapsed");
      if (saved === null) return false; // first visit: show the grid
      return saved === "true";
    } catch (e) {
      return true;
    }
  });
  const [lotusMode, setLotusMode] = useState<"grid" | "map">(() => {
    if (typeof window === "undefined") return "grid";
    try {
      const saved = localStorage.getItem("oda_lotus_mode");
      if (saved === "map" || saved === "grid") return saved;
    } catch (e) {
      /* ignore */
    }
    return "grid";
  });
  const toggleLotusMode = useCallback(() => {
    setLotusMode((m) => {
      const next = m === "grid" ? "map" : "grid";
      try {
        localStorage.setItem("oda_lotus_mode", next);
      } catch (e) {
        /* ignore */
      }
      return next;
    });
  }, []);
  const [lightboxMedia, setLightboxMedia] = useState<LotusNode | null>(null);
  const [navigatorHighlight, setNavigatorHighlight] = useState(false);
  /**
   * History stack for context-aware back navigation from embedded nodes.
   * Separate from path (structural hierarchy). Stores the node we LEFT FROM.
   */
  const [historyStack, setHistoryStack] = useState<LotusNode[]>([]);

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(min-width: 768px), (orientation: landscape)")
        .matches;
    }
    return false;
  });

  // Refs for side-effect management outside of updater functions
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPopStateRef = useRef(false);

  const currentNode = path[path.length - 1];

  // Flat registry of all nodes by ID — built once at module load in constants.ts.
  // Stable reference identity, which is what provenance.ts uses as its cache key.
  const nodeRegistry = NODE_REGISTRY as Map<string, LotusNode>;

  // --- ACTIONS ---

  const navigate = useCallback(
    (node: LotusNode) => {
      if (node.type === "media") {
        setLightboxMedia(node);
        return;
      }
      const origin = path[path.length - 1];
      const canonicalPath = findPathToNode(ROOT_NODE, node.id);
      const target = canonicalPath?.[canonicalPath.length - 1] ?? node;
      const isGridChild =
        origin.children?.some((c) => c.id === node.id) ?? false;
      // Cross-branch hops (tabs, map, etc.) remember origin; grid children stay hierarchical.
      if (origin.id !== node.id && !isGridChild) {
        setHistoryStack((prev) => [...prev, origin]);
      }
      preloadLotusGrid(target, nodeRegistry, lang);
      if (canonicalPath) {
        setPath(canonicalPath);
      } else {
        setPath((prev) => {
          if (prev.some((n) => n.id === node.id)) {
            const idx = prev.findIndex((n) => n.id === node.id);
            return prev.slice(0, idx + 1);
          }
          return [...prev, node];
        });
      }
    },
    [path, nodeRegistry, lang],
  );

  /**
   * Embedded navigation: records the node we are leaving in historyStack,
   * then navigates to target. Center cell becomes "back to origin".
   */
  const navigateHistory = useCallback(
    (node: LotusNode) => {
      if (node.type === "media") {
        setLightboxMedia(node);
        return;
      }
      const canonicalPath = findPathToNode(ROOT_NODE, node.id);
      const target = canonicalPath?.[canonicalPath.length - 1] ?? node;
      preloadLotusGrid(target, nodeRegistry, lang);
      // Read origin from current path closure — setHistoryStack must not be
      // called inside a setPath updater (updaters run twice in StrictMode).
      const origin = path[path.length - 1];
      setHistoryStack((prev) => [...prev, origin]);
      setPath(canonicalPath ?? [...path, node]);
    },
    [path, nodeRegistry, lang],
  );

  const goBackHistory = useCallback(() => {
    if (historyStack.length === 0) return;
    const origin = historyStack[historyStack.length - 1];
    const canonicalPath = findPathToNode(ROOT_NODE, origin.id);
    if (canonicalPath) {
      const target = canonicalPath[canonicalPath.length - 1];
      preloadLotusGrid(target, nodeRegistry, lang);
      setPath(canonicalPath);
    }
    // setPath must not be called inside a setHistoryStack updater (StrictMode
    // double-invokes updaters, which would push duplicate pushState entries).
    setHistoryStack((prev) => prev.slice(0, -1));
  }, [historyStack, nodeRegistry, lang]);

  const goBack = useCallback(() => {
    if (path.length <= 1) return;
    const next = path.slice(0, -1);
    preloadLotusGrid(next[next.length - 1], nodeRegistry, lang);
    setPath(next);
  }, [path, nodeRegistry, lang]);

  const jumpToLevel = useCallback(
    (index: number) => {
      setHistoryStack([]);
      const next = path.slice(0, index + 1);
      const target = next[next.length - 1];
      if (target) preloadLotusGrid(target, nodeRegistry, lang);
      setPath(next);
    },
    [path, nodeRegistry, lang],
  );

  const triggerNavigatorHighlight = useCallback(() => {
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    setNavigatorHighlight(true);
    highlightTimerRef.current = setTimeout(() => setNavigatorHighlight(false), 1000);
  }, []);

  const jumpToId = useCallback(
    (targetId: string) => {
      if (!targetId) return;
      const id = targetId.toLowerCase();
      const origin = path[path.length - 1];

      const rememberOrigin = (nextId: string) => {
        if (origin.id !== nextId) {
          setHistoryStack((prev) => [...prev, origin]);
        }
      };

      if (id === "navigator") {
        triggerNavigatorHighlight();
        if (!isDesktop) setIsGridCollapsed(false);
        return;
      }
      if (id === "home" || id === "root" || id === "hub-home") {
        rememberOrigin(ROOT_NODE.id);
        preloadLotusGrid(ROOT_NODE, nodeRegistry, lang);
        setPath([ROOT_NODE]);
        return;
      }
      const newPath = findPathToNode(ROOT_NODE, targetId);
      if (newPath) {
        const target = newPath[newPath.length - 1];
        rememberOrigin(target.id);
        preloadLotusGrid(target, nodeRegistry, lang);
        setPath(newPath);
        return;
      }
      const node = nodeRegistry.get(targetId) ?? nodeRegistry.get(id);
      if (node) {
        rememberOrigin(node.id);
        preloadLotusGrid(node, nodeRegistry, lang);
        setPath((prev) => {
          if (prev.some((n) => n.id === node.id)) {
            const idx = prev.findIndex((n) => n.id === node.id);
            return prev.slice(0, idx + 1);
          }
          return [...prev, node];
        });
      }
    },
    [path, isDesktop, triggerNavigatorHighlight, nodeRegistry, lang],
  );

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "ru" : "en";
      try {
        localStorage.setItem("oda_lang", next);
      } catch (e) {}
      return next;
    });
  }, []);

  const cycleTheme = useCallback(() => {
    setTheme((prev) => {
      const sequence: Theme[] = ["dark", "light", "ocean", "matrix"];
      const nextIndex = (sequence.indexOf(prev) + 1) % sequence.length;
      const next = sequence[nextIndex];
      try {
        localStorage.setItem("oda_theme", next);
      } catch (e) {}
      return next;
    });
  }, []);

  // --- EFFECTS ---

  // Image Preloading Effect
  useEffect(() => {
    // Defer until browser is idle (or after animations settle at 500ms).
    // 100ms was too close to the render/transition cycle — in Firefox it caused
    // visible compositing repaints while grid transitions were still in progress.
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
        .requestIdleCallback(() => preloadNodeAssets(currentNode), { timeout: 500 });
      return () => (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
    }
    const t = setTimeout(() => {
      preloadNodeAssets(currentNode);
    }, 500);
    return () => clearTimeout(t);
  }, [currentNode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 768px), (orientation: landscape)",
    );
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Seed the current entry so popstate can restore context stack on first back.
  useEffect(() => {
    try {
      window.history.replaceState(
        { id: currentNode.id, history: historyIds(historyStack) },
        "",
        buildUrl(currentNode.id, lang),
      );
    } catch (e) {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  useEffect(() => {
    // Skip pushState when navigation was triggered by browser back/forward (popstate).
    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      return;
    }
    const currentId = currentNode.id;
    try {
      const params = new URLSearchParams(window.location.search);
      const expectedId = currentId !== ROOT_NODE.id ? currentId : null;
      if (params.get("id") !== expectedId || params.get("lang") !== lang) {
        window.history.pushState(
          { id: currentId, history: historyIds(historyStack) },
          "",
          buildUrl(currentId, lang),
        );
      }
    } catch (e) {
      /* ignore */
    }
  }, [currentNode, lang, historyStack]);

  useEffect(() => {
    updateMetaTags(currentNode, lang, ROOT_NODE.id);
  }, [currentNode, lang]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      isPopStateRef.current = true;
      const nextPath = getPathFromUrl();
      const target = nextPath[nextPath.length - 1];
      if (target) preloadLotusGrid(target, nodeRegistry, lang);
      setPath(nextPath);
      const state = event.state as NavHistoryState | null;
      setHistoryStack(
        state?.history
          ? historyFromIds(state.history, nodeRegistry)
          : [],
      );
      try {
        const urlLang = new URLSearchParams(window.location.search).get("lang");
        if (urlLang === "en" || urlLang === "ru") {
          setLang(urlLang as Language);
          localStorage.setItem("oda_lang", urlLang);
        }
      } catch (e) {
        /* ignore */
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [nodeRegistry, lang]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // --- MEMOIZED CONTEXT VALUES ---
  // Split: navigation slice changes on most interactions; lightbox slice changes
  // only when the lightbox opens/closes — keeping it separate stops media toggles
  // from re-rendering every grid cell / sidebar consumer.
  const closeLightbox = useCallback(() => setLightboxMedia(null), []);

  const navValue = useMemo<NavigationContextType>(
    () => ({
      path,
      currentNode,
      lang,
      theme,
      isDesktop,
      isGridCollapsed,
      lotusMode,
      navigatorHighlight,
      nodeRegistry,
      historyStack,
      navigate,
      navigateHistory,
      goBackHistory,
      goBack,
      jumpToId,
      jumpToLevel,
      toggleLang,
      cycleTheme,
      toggleGrid: (collapsed: boolean) => {
        setIsGridCollapsed(collapsed);
        try { localStorage.setItem("oda_drawer_collapsed", String(collapsed)); } catch (e) {}
      },
      triggerNavigatorHighlight,
      toggleLotusMode,
    }),
    [
      path,
      currentNode,
      lang,
      theme,
      isDesktop,
      isGridCollapsed,
      lotusMode,
      navigatorHighlight,
      nodeRegistry,
      historyStack,
      navigate,
      navigateHistory,
      goBackHistory,
      goBack,
      jumpToId,
      jumpToLevel,
      toggleLang,
      cycleTheme,
      triggerNavigatorHighlight,
      toggleLotusMode,
    ],
  );

  const lightboxValue = useMemo<LightboxContextType>(
    () => ({
      lightboxMedia,
      openLightbox: setLightboxMedia,
      closeLightbox,
    }),
    [lightboxMedia, closeLightbox],
  );

  return (
    <NavigationContext.Provider value={navValue}>
      <LightboxContext.Provider value={lightboxValue}>
        {children}
      </LightboxContext.Provider>
    </NavigationContext.Provider>
  );
};
