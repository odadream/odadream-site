import React, { useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Layers, ChevronUp, GripHorizontal } from "lucide-react";
import { THEME } from "../styles/theme";
import { CyberText } from "./CyberText";
import { MotionDiv, DRAWER } from "../styles/animations";

const cn = (...inputs: (string | undefined | null | false)[]) =>
  twMerge(clsx(inputs));

interface LotusSidebarProps {
  lang: "en" | "ru";
  isDesktop: boolean;
  isGridCollapsed: boolean;
  toggleGrid: (collapsed: boolean) => void;
  navigatorHighlight: boolean;
  /** Called during drag with current drag offset (px, positive = dragging down) */
  onDragOffset?: (offset: number) => void;
}

export const LotusSidebar: React.FC<LotusSidebarProps> = ({
  lang,
  isDesktop,
  isGridCollapsed,
  toggleGrid,
  navigatorHighlight,
  onDragOffset,
}) => {
  const layoutKey = isDesktop ? "desktop" : "mobile";

  // --- SWIPE STATE ---
  const dragStart = useRef<{ y: number; time: number } | null>(null);
  const currentOffset = useRef(0);
  const wasDrag = useRef(false);

  const getPanelHeight = useCallback((): number => {
    // Read from CSS variable at runtime
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--lotus-panel-height")
      .trim();
    // Parse dvh/vh values against window height
    const match = raw.match(/([\d.]+)(dvh|vh)/);
    if (match) return (parseFloat(match[1]) / 100) * window.innerHeight;
    // Fallback: parse px
    return parseFloat(raw) || window.innerHeight * 0.49;
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isDesktop) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragStart.current = { y: e.clientY, time: Date.now() };
      currentOffset.current = 0;
      wasDrag.current = false;
    },
    [isDesktop],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDesktop || !dragStart.current) return;
      const dy = e.clientY - dragStart.current.y;
      if (Math.abs(dy) > 5) wasDrag.current = true;

      // Constrain: can't drag above open position or too far below closed
      const panelH = getPanelHeight();
      const barH = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--lotus-bar-height",
        ) || "44",
      );
      const maxDown = panelH - barH;

      // When open: drag down closes (positive dy), clamp 0..maxDown
      // When closed: drag up opens (negative dy), clamp -maxDown..0
      if (isGridCollapsed) {
        currentOffset.current = Math.max(-maxDown, Math.min(0, dy));
      } else {
        currentOffset.current = Math.max(0, Math.min(maxDown, dy));
      }

      onDragOffset?.(currentOffset.current);
    },
    [isDesktop, isGridCollapsed, getPanelHeight, onDragOffset],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDesktop || !dragStart.current) return;

      const dy = e.clientY - dragStart.current.y;
      const dt = Date.now() - dragStart.current.time;
      const velocity = Math.abs(dy) / dt; // px/ms
      const panelH = getPanelHeight();
      const threshold = panelH * DRAWER.snapThreshold;

      let shouldOpen: boolean;

      if (velocity >= DRAWER.velocityThreshold) {
        // Fast flick: direction decides
        shouldOpen = dy < 0; // dragging up = open
      } else {
        // Slow drag: distance decides
        if (isGridCollapsed) {
          shouldOpen = Math.abs(dy) >= threshold && dy < 0;
        } else {
          shouldOpen = !(Math.abs(dy) >= threshold && dy > 0);
        }
      }

      dragStart.current = null;
      onDragOffset?.(0); // reset drag offset — spring snaps
      toggleGrid(!shouldOpen); // toggleGrid(true) = collapsed
    },
    [isDesktop, isGridCollapsed, getPanelHeight, toggleGrid, onDragOffset],
  );

  const handlePointerCancel = useCallback(() => {
    if (!dragStart.current) return;
    dragStart.current = null;
    onDragOffset?.(0);
    // Don't change state — snap back to current position
  }, [onDragOffset]);

  return (
    <div
      className={cn(
        "relative flex-shrink-0 z-30 select-none overflow-hidden group transition-colors duration-300",
        THEME.panel.navigatorSlab,
        THEME.layout.barHeight,
        "w-full cursor-pointer px-[var(--layout-gutter)]",
        "md:h-full md:w-[var(--layout-gutter)] md:py-8 md:border-b-0 md:px-0 md:cursor-default md:bg-canvas md:shadow-none",
        "landscape:h-full landscape:w-[var(--layout-gutter)] landscape:py-8 landscape:border-b-0 landscape:px-0 landscape:cursor-default landscape:bg-canvas",
      )}
      onClick={() => {
        if (isDesktop) return;
        // Skip if pointer was a drag — pointerUp already called toggleGrid
        if (wasDrag.current) {
          wasDrag.current = false;
          return;
        }
        toggleGrid(!isGridCollapsed);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{ touchAction: "none" }}
    >
      <AnimatePresence mode="wait">
        <MotionDiv
          key={layoutKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "w-full h-full flex items-center justify-between",
            "md:flex-col md:justify-center",
            "landscape:flex-col landscape:justify-center",
          )}
        >
          <div
            className={cn(
              "text-xs md:text-sm font-bold font-mono uppercase tracking-widest flex items-center gap-3 relative z-20",
              "md:[writing-mode:vertical-rl] md:rotate-180 md:justify-center md:flex-1",
              "landscape:[writing-mode:vertical-rl] landscape:rotate-180 landscape:justify-center landscape:flex-1",
              "mix-blend-screen",
            )}
          >
            <span
              className={cn(
                "transition-all duration-500",
                "md:rotate-90 landscape:rotate-90",
                navigatorHighlight
                  ? "text-accent drop-shadow-laser scale-110"
                  : "text-accent drop-shadow-none scale-100",
              )}
            >
              <Layers className="w-4 h-4 md:w-4 md:h-4" />
            </span>
            <span
              className={cn(
                "tracking-[0.35em] transition-all duration-500",
                navigatorHighlight
                  ? THEME.navigation.text.active
                  : THEME.navigation.text.base,
              )}
            >
              <CyberText
                text={lang === "ru" ? "НАВИГАТОР" : "NAVIGATOR"}
                triggerKey={navigatorHighlight ? Date.now() : "static"}
              />
            </span>
          </div>

          {!isDesktop && (
            <div className="md:hidden landscape:hidden text-zinc-500 flex items-center justify-center w-8 h-8 rounded-full active:bg-white/5 transition-colors relative z-20">
              {isGridCollapsed ? (
                <ChevronUp className="w-4 h-4 animate-pulse-slow" />
              ) : (
                <GripHorizontal className="w-4 h-4 opacity-70" />
              )}
            </div>
          )}
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
};
