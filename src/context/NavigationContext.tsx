
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { LotusNode, Language } from '../types';
import { ROOT_NODE } from '../constants';
import { findPathToNode } from '../utils/nodeHelpers';

interface NavigationContextType {
  path: LotusNode[];
  currentNode: LotusNode;
  lang: Language;
  isDesktop: boolean;
  isGridCollapsed: boolean;
  lightboxMedia: LotusNode | null;
  navigatorHighlight: boolean;
  
  // Actions
  navigate: (node: LotusNode) => void;
  goBack: () => void;
  jumpToId: (id: string) => void;
  jumpToLevel: (index: number) => void;
  toggleLang: () => void;
  toggleGrid: (collapsed: boolean) => void;
  openLightbox: (mediaNode: LotusNode) => void;
  closeLightbox: () => void;
  triggerNavigatorHighlight: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// --- HELPER: URL SYNC ---
const getPathFromUrl = (): LotusNode[] => {
    if (typeof window === 'undefined') return [ROOT_NODE];
    try {
        const params = new URLSearchParams(window.location.search);
        const targetId = params.get('id');
        if (targetId) {
            const foundPath = findPathToNode(ROOT_NODE, targetId);
            if (foundPath) return foundPath;
        }
    } catch (e) {
        console.warn('Cannot read URL parameters:', e);
    }
    return [ROOT_NODE];
};

// --- HELPER: LANG DETECTION ---
const getInitialLang = (): Language => {
    if (typeof window === 'undefined') return 'en'; // Default fallback

    // 1. Check LocalStorage (User Preference)
    try {
        const saved = localStorage.getItem('oda_lang');
        if (saved === 'en' || saved === 'ru') return saved;
    } catch (e) {
        // LocalStorage is unavailable (Private mode or restricted)
    }

    // 2. Check Browser Settings
    try {
        // Safe access to navigator properties
        const nav = window.navigator;
        const browserLang = nav.language || (nav.languages && nav.languages.length > 0 ? nav.languages[0] : null);
        
        if (browserLang && browserLang.toLowerCase().startsWith('ru')) {
            return 'ru';
        }
    } catch (e) {
        // Ignore errors
    }

    // 3. Default
    return 'en';
};

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [path, setPath] = useState<LotusNode[]>(getPathFromUrl);
  const [lang, setLang] = useState<Language>(getInitialLang);
  const [isGridCollapsed, setIsGridCollapsed] = useState(true);
  const [lightboxMedia, setLightboxMedia] = useState<LotusNode | null>(null);
  const [navigatorHighlight, setNavigatorHighlight] = useState(false);
  
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
        return window.matchMedia('(min-width: 768px), (orientation: landscape)').matches;
    }
    return false;
  });

  const currentNode = path[path.length - 1];

  // --- ACTIONS ---

  const navigate = useCallback((node: LotusNode) => {
    if (node.type === 'media') {
        setLightboxMedia(node);
    } else {
        // Calculate the canonical path from the root to the target node
        // This prevents infinite appending of breadcrumbs when navigating between siblings
        const canonicalPath = findPathToNode(ROOT_NODE, node.id);
        
        if (canonicalPath) {
            setPath(canonicalPath);
        } else {
            // Fallback: If not found in tree (e.g. detached node), append to current path
            // Check if node is already in path to prevent duplicates
            setPath(prev => {
                if (prev.some(n => n.id === node.id)) {
                    // If cycling, just cut to that node
                    const idx = prev.findIndex(n => n.id === node.id);
                    return prev.slice(0, idx + 1);
                }
                return [...prev, node];
            });
        }
    }
  }, []);

  const goBack = useCallback(() => {
    setPath(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const jumpToLevel = useCallback((index: number) => {
    setPath(prev => prev.slice(0, index + 1));
  }, []);

  const triggerNavigatorHighlight = useCallback(() => {
      setNavigatorHighlight(true);
      setTimeout(() => setNavigatorHighlight(false), 1000);
  }, []);

  const jumpToId = useCallback((targetId: string) => {
     if (!targetId) return;
     if (targetId.toLowerCase() === 'navigator') {
         triggerNavigatorHighlight();
         if (!isDesktop) setIsGridCollapsed(false);
         return;
     }
     if (['home', 'root'].includes(targetId.toLowerCase())) {
         setPath([ROOT_NODE]);
         return;
     }
     const newPath = findPathToNode(ROOT_NODE, targetId);
     if (newPath) setPath(newPath);
  }, [isDesktop, triggerNavigatorHighlight]);

  const toggleLang = useCallback(() => {
    setLang(prev => {
        const next = prev === 'en' ? 'ru' : 'en';
        try {
            localStorage.setItem('oda_lang', next); // Persist preference
        } catch (e) {
            // Ignore storage errors
        }
        return next;
    });
  }, []);

  // --- EFFECTS ---

  // 1. Layout Listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px), (orientation: landscape)');
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 2. URL Sync
  useEffect(() => {
    const currentId = currentNode.id;
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('id') !== currentId) {
            const newUrl = currentId === ROOT_NODE.id 
                ? window.location.pathname 
                : `${window.location.pathname}?id=${currentId}`;
            window.history.pushState({ id: currentId }, '', newUrl);
        }
    } catch (e) { /* ignore */ }
  }, [currentNode]);

  // 3. Document Title Sync (SEO/UX)
  useEffect(() => {
      const title = currentNode.title[lang];
      // Keep "oda.dream" clean if on home, otherwise append context
      document.title = currentNode.id === 'home' 
          ? 'oda.dream | Neural Art Interface' 
          : `${title} | oda.dream`;
  }, [currentNode, lang]);

  // 4. Browser Back Button
  useEffect(() => {
    const handlePopState = () => setPath(getPathFromUrl());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <NavigationContext.Provider value={{
      path, currentNode, lang, isDesktop, isGridCollapsed, lightboxMedia, navigatorHighlight,
      navigate, goBack, jumpToId, jumpToLevel, toggleLang, toggleGrid: setIsGridCollapsed,
      openLightbox: setLightboxMedia, closeLightbox: () => setLightboxMedia(null), triggerNavigatorHighlight
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
