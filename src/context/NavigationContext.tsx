import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { LotusNode, Language, Theme } from "../types";
import { ROOT_NODE } from "../constants";
import { findPathToNode } from "../utils/nodeHelpers";
import { getDefaultNodeImage } from "../utils/mediaHelpers";

interface NavigationContextType {
  path: LotusNode[];
  currentNode: LotusNode;
  lang: Language;
  theme: Theme;
  isDesktop: boolean;
  isGridCollapsed: boolean;
  lightboxMedia: LotusNode | null;
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
  openLightbox: (mediaNode: LotusNode) => void;
  closeLightbox: () => void;
  triggerNavigatorHighlight: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
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

// --- HELPER: LANG DETECTION ---
const getInitialLang = (): Language => {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem("oda_lang");
    if (saved === "en" || saved === "ru") return saved;
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
  const [isGridCollapsed, setIsGridCollapsed] = useState(true);
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

  const currentNode = path[path.length - 1];

  // Flat registry of all nodes by ID for O(1) lookup
  const nodeRegistry = useMemo<Map<string, LotusNode>>(() => {
    const map = new Map<string, LotusNode>();
    const walk = (node: LotusNode) => {
      map.set(node.id, node);
      node.children?.forEach(walk);
    };
    walk(ROOT_NODE);
    return map;
  }, []);

  // --- ACTIONS ---

  const navigate = useCallback((node: LotusNode) => {
    if (node.type === "media") {
      setLightboxMedia(node);
    } else {
      const canonicalPath = findPathToNode(ROOT_NODE, node.id);
      setPath((prev) => {
        if (canonicalPath) return canonicalPath;
        // Fallback for orphaned nodes
        if (prev.some((n) => n.id === node.id)) {
          const idx = prev.findIndex((n) => n.id === node.id);
          return prev.slice(0, idx + 1);
        }
        return [...prev, node];
      });
    }
  }, []);

  /**
   * Embedded navigation: records the node we are leaving in historyStack,
   * then navigates to target. Center cell becomes "back to origin".
   */
  const navigateHistory = useCallback((node: LotusNode) => {
    if (node.type === "media") {
      setLightboxMedia(node);
      return;
    }
    setPath((prevPath) => {
      const origin = prevPath[prevPath.length - 1];
      setHistoryStack((prev) => [...prev, origin]);
      const canonicalPath = findPathToNode(ROOT_NODE, node.id);
      if (canonicalPath) return canonicalPath;
      return [...prevPath, node];
    });
  }, []);

  const goBackHistory = useCallback(() => {
    setHistoryStack((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      const origin = prevHistory[prevHistory.length - 1];
      const canonicalPath = findPathToNode(ROOT_NODE, origin.id);
      if (canonicalPath) setPath(canonicalPath);
      return prevHistory.slice(0, -1);
    });
  }, []);

  const goBack = useCallback(() => {
    setPath((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const jumpToLevel = useCallback((index: number) => {
    setHistoryStack([]); // Hierarchy jump resets context history
    setPath((prev) => prev.slice(0, index + 1));
  }, []);

  const triggerNavigatorHighlight = useCallback(() => {
    setNavigatorHighlight(true);
    setTimeout(() => setNavigatorHighlight(false), 1000);
  }, []);

  const jumpToId = useCallback(
    (targetId: string) => {
      if (!targetId) return;
      const id = targetId.toLowerCase();

      if (id === "navigator") {
        triggerNavigatorHighlight();
        if (!isDesktop) setIsGridCollapsed(false);
        return;
      }
      if (id === "home" || id === "root") {
        setPath([ROOT_NODE]);
        return;
      }
      const newPath = findPathToNode(ROOT_NODE, targetId);
      if (newPath) {
        setHistoryStack([]); // Direct jump resets context history
        setPath(newPath);
      }
    },
    [isDesktop, triggerNavigatorHighlight],
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

  useEffect(() => {
    const currentId = currentNode.id;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("id") !== currentId) {
        const newUrl =
          currentId === ROOT_NODE.id
            ? window.location.pathname
            : `${window.location.pathname}?id=${currentId}`;
        window.history.pushState({ id: currentId }, "", newUrl);
      }
    } catch (e) {
      /* ignore */
    }
  }, [currentNode]);

  useEffect(() => {
    const title = currentNode.title[lang];
    document.title =
      currentNode.id === "home"
        ? "ODA.dream | Wellness Art Tech"
        : `${title} | ODA.dream`;
  }, [currentNode, lang]);

  useEffect(() => {
    const handlePopState = () => setPath(getPathFromUrl());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // --- MEMOIZED CONTEXT VALUE ---
  const contextValue = useMemo(
    () => ({
      path,
      currentNode,
      lang,
      theme,
      isDesktop,
      isGridCollapsed,
      lightboxMedia,
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
      toggleGrid: setIsGridCollapsed,
      openLightbox: setLightboxMedia,
      closeLightbox: () => setLightboxMedia(null),
      triggerNavigatorHighlight,
    }),
    [
      path,
      currentNode,
      lang,
      theme,
      isDesktop,
      isGridCollapsed,
      lightboxMedia,
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
      setIsGridCollapsed,
      setLightboxMedia,
      triggerNavigatorHighlight,
    ],
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};
