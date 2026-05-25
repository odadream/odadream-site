import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Undo2,
  ArrowLeft,
  Maximize2,
  ArrowUp,
  ExternalLink,
  Film,
  AudioLines,
  Image as ImageIcon,
  Layers,
  Zap,
  FileText,
  Disc,
  Plus,
  AlertTriangle,
} from "lucide-react";

import { LotusNode } from "../types";
import { THEME } from "../styles/theme";
import { TRANSITIONS, MotionDiv, CELL_VARIANTS } from "../styles/animations";
import { Breadcrumbs } from "./Breadcrumbs";
import { CyberText } from "./CyberText";
import { LotusSidebar } from "./LotusSidebar";
import { useNavigation } from "../context/NavigationContext";
import { useImageFallback } from "../hooks/useImageFallback";
import { useLotusLogic } from "../hooks/useLotusLogic";

const cn = (...inputs: (string | undefined | null | false)[]) =>
  twMerge(clsx(inputs));

type GridNode = LotusNode & { isCenter: boolean };

const ARROW_ROTATIONS = [
  "rotate-[-45deg]",
  "rotate-0",
  "rotate-45",
  "rotate-[-90deg]",
  "scale-0",
  "rotate-90",
  "rotate-[-135deg]",
  "rotate-180",
  "rotate-[135deg]",
];

// Using centralized CELL_VARIANTS from animations.ts

const CornerBrackets = React.memo(
  ({ show, accent }: { show: boolean; accent: boolean }) => {
    const borderColor = accent ? "border-accent" : "border-txt-dim";
    const opacityClass = accent
      ? "opacity-100"
      : show
        ? "opacity-30 group-hover:opacity-100 transition-opacity duration-300"
        : "opacity-0";

    return (
      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-30 mix-blend-screen",
          opacityClass,
        )}
      >
        <div
          className={cn(
            "absolute top-0 left-0 border-t-[1px] border-l-[1px] w-1.5 h-1.5 md:w-2 md:h-2 transition-colors duration-300",
            borderColor,
          )}
        />
        <div
          className={cn(
            "absolute top-0 right-0 border-t-[1px] border-r-[1px] w-1.5 h-1.5 md:w-2 md:h-2 transition-colors duration-300",
            borderColor,
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 border-b-[1px] border-l-[1px] w-1.5 h-1.5 md:w-2 md:h-2 transition-colors duration-300",
            borderColor,
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 right-0 border-b-[1px] border-r-[1px] w-1.5 h-1.5 md:w-2 md:h-2 transition-colors duration-300",
            borderColor,
          )}
        />
      </div>
    );
  },
);

const NoSignal = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent overflow-hidden mix-blend-screen pointer-events-none">
    <div className="absolute inset-0 opacity-10 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover grayscale" />
    <AlertTriangle
      className="w-8 h-8 text-red-900 mb-2 animate-pulse relative z-10 opacity-70"
      strokeWidth={1}
    />
    <span className="text-[10px] font-mono tracking-[0.2em] text-red-900 font-bold relative z-10 opacity-70">
      NO SIGNAL
    </span>
  </div>
);

// Updated Prop Interface to accept className for positioning
// forwardRef required for AnimatePresence popLayout mode in React 19
const GridCell = React.memo(
  React.forwardRef<
    HTMLDivElement,
    {
      cell: GridNode | null;
      index: number;
      className?: string;
    }
  >(({ cell, index, className }, _ref) => {
    const {
      navigate,
      navigateHistory,
      goBack,
      goBackHistory,
      lang,
      path,
      historyStack,
    } = useNavigation();
    const [isHovered, setIsHovered] = useState(false);

    // --- DISPLAY DATA ---
    // Computed before hooks and early returns (React rules).
    // In history mode the center cell shows origin node data (where to return).
    // We preserve isCenter:true for LED/elevation styles.
    const hasHistory = historyStack.length > 0;
    const canGoBack = path.length > 1;
    const originNode =
      cell && hasHistory && cell.isCenter
        ? historyStack[historyStack.length - 1]
        : null;
    // When cell is null (empty slot), displayCell is also null.
    // After the empty-cell early return below, displayCell is always non-null.
    const displayCell = originNode
      ? { ...originNode, isCenter: true as const }
      : cell;

    // TypeScript helper: non-null assertion safe after empty-cell guard below
    const dc = displayCell!;

    // Hook must be called unconditionally (React rules of hooks)
    const {
      src: activeSrc,
      handleError,
      isDead,
    } = useImageFallback(displayCell?.imageUrl, displayCell?.id);

    // Empty Cell State
    if (!cell) {
      return (
        <MotionDiv
          variants={CELL_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            THEME.lotus.cellEmpty,
            "group w-full h-full bg-surface",
            className,
          )}
          aria-hidden="true"
        >
          <Plus
            className="w-3 h-3 text-txt-dim transition-all duration-500 group-hover:text-txt-muted group-hover:rotate-90 group-hover:scale-125"
            strokeWidth={1.5}
          />
        </MotionDiv>
      );
    }

    const isHub = cell.type === "hub";
    const isAction = cell.type === "action";
    const isMedia = cell.type === "media";
    const isVisualNode = isMedia || !!cell.imageUrl;

    let ActionIcon = ArrowUp;
    let actionRotation = ARROW_ROTATIONS[index] || "rotate-0";

    if (cell.isCenter) {
      // ArrowLeft = "back to origin context", Undo2 = "up in hierarchy", Disc = root
      ActionIcon = hasHistory ? ArrowLeft : canGoBack ? Undo2 : Disc;
      actionRotation = "rotate-0";
    } else if (isAction && cell.externalLink) {
      ActionIcon = ExternalLink;
      actionRotation = "rotate-0";
    } else if (isMedia && !isHub) {
      ActionIcon = Maximize2;
      actionRotation = "rotate-0";
    }

    let TypeIcon = FileText;
    const displayType = dc.type;
    const displayIsHub = displayType === "hub";
    const displayIsAction = displayType === "action";
    const displayIsMedia = displayType === "media";
    if (displayIsHub) TypeIcon = Layers;
    else if (displayIsAction) TypeIcon = Zap;
    else if (displayIsMedia) {
      TypeIcon =
        dc.mediaType === "video"
          ? Film
          : dc.mediaType === "audio"
            ? AudioLines
            : ImageIcon;
    }

    const handleClick = () => {
      if (cell.isCenter) {
        if (hasHistory) {
          goBackHistory();
        } else if (canGoBack) {
          goBack();
        }
      } else if (isAction && cell.externalLink) {
        window.open(cell.externalLink, "_blank");
      } else if (cell._isEmbedded) {
        // Embedded node from ![[nodeId]] — use history navigation
        navigateHistory(cell);
      } else {
        navigate(cell);
      }
    };

    const displayTitle = dc.shortTitle?.[lang] || dc.title[lang];

    // Check if this cell is adjacent to center (indices 1, 3, 5, 7 in 3x3 grid)
    const isAdjacentToCenter = !cell.isCenter && [1, 3, 5, 7].includes(index);
    // Shadow/glow gradient position: edge of THIS cell that faces center gets darker (1=bottom, 3=right, 5=left, 7=top)
    const shadowFromCenter =
      index === 1
        ? "50% 100%"
        : index === 3
          ? "100% 50%"
          : index === 5
            ? "0% 50%"
            : index === 7
              ? "50% 0%"
              : "50% 50%";

    return (
      <MotionDiv
        key={cell.id}
        variants={CELL_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        // Center cell: outward shadow so it appears raised; LED glow is outward only
        style={
          cell.isCenter
            ? {
                boxShadow: `0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 var(--center-shadow-blur) var(--center-shadow-spread) rgba(0, 0, 0, var(--center-shadow-opacity))`,
              }
            : undefined
        }
        className={cn(
          THEME.lotus.cell,
          "bg-surface will-change-transform",
          cell.isCenter ? THEME.lotus.cellActive : THEME.lotus.cellInteractive,
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <CornerBrackets show={true} accent={cell.isCenter} />

        {/* LED strip effect - subtle glow around the perimeter of center cell */}
        {/* Simulates LED strip in the gap behind the raised panel, emitting faint light OUTWARD */}
        {cell.isCenter && (
          <div
            className="absolute inset-0 pointer-events-none z-[35]"
            style={{
              boxShadow: `
                /* Outer glow spreading OUTWARD from LED strip around perimeter */
                0 0 var(--led-strip-blur) var(--led-strip-spread) rgb(var(--color-accent) / var(--led-strip-opacity)),
                0 0 calc(var(--led-strip-blur) * 2) var(--led-strip-spread) rgb(var(--color-accent) / calc(var(--led-strip-opacity) * 0.5))
              `,
            }}
          />
        )}

        {/* Shadow cast OUTWARD by raised center cell onto adjacent cells + subtle LED glow spillover */}
        {isAdjacentToCenter && (
          <>
            {/* Soft shadow falling FROM center ONTO this cell - darker at edge facing center */}
            <div
              className="absolute inset-0 pointer-events-none z-[5]"
              style={{
                background: `radial-gradient(circle at ${shadowFromCenter}, rgba(0, 0, 0, var(--center-shadow-opacity)) 0%, transparent 55%)`,
              }}
            />
            {/* Subtle LED glow spillover OUTWARD from center cell's LED strip - very faint */}
            <div
              className="absolute inset-0 pointer-events-none z-[6] transition-opacity duration-700 ease-out"
              style={{
                background: `radial-gradient(circle at ${shadowFromCenter}, rgb(var(--color-accent) / var(--led-strip-opacity)) 0%, transparent 55%)`,
                opacity: 0.4,
              }}
            />
          </>
        )}

        {/* BACKGROUND LAYER */}
        <div
          className={cn(
            "absolute inset-0 z-0 overflow-hidden bg-surface",
            // Ensure a base color is always present behind the image
          )}
        >
          {activeSrc && !isDead && (
            <img
              src={activeSrc}
              onError={handleError}
              // CRITICAL FIX: 'eager' loading prevents blank flash during navigation
              loading="eager"
              draggable={false}
              className={cn(
                "w-full h-full object-cover pointer-events-none select-none",
                // NOTE: will-change-[opacity,filter] removed — causes Firefox compositing-layer
                // repaints when combined with mix-blend-mode, producing visible cell flicker.
                // NOTE: mix-blend-luminosity removed — blend-mode switching triggers expensive
                // stacking-context recomposition in Firefox. grayscale() filter (in theme classes)
                // already achieves the desaturation effect without blend-mode changes.
                cell.isCenter
                  ? THEME.lotus.image.center
                  : isVisualNode
                    ? THEME.lotus.image.visual
                    : THEME.lotus.image.default,
              )}
              alt=""
            />
          )}
          {isDead && <NoSignal />}

          {/* Fallback Icon if no image and no signal */}
          {isMedia && (!activeSrc || isDead) && (
            <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-multiply pointer-events-none">
              <TypeIcon className="w-16 h-16 text-txt-muted stroke-[0.5px]" />
            </div>
          )}

          {/* Vignette - Kept subtle */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_120%)] pointer-events-none z-10" />
        </div>

        {/* SCRIM LAYER - Added for readability contrast behind text */}
        <div className={cn(THEME.lotus.scrim, "z-10")} />

        {/* HUD LAYER */}
        <div
          className={cn(
            "relative z-20 flex flex-col items-center justify-between w-full h-full p-2 md:p-4 text-center pointer-events-none transition-opacity duration-300",
            cell.isCenter || isHovered
              ? THEME.navigation.opacity.active
              : THEME.navigation.opacity.inactive,
          )}
        >
          <div className="flex-1" />
          <div
            className={cn(
              "flex-shrink-0 mb-1 md:mb-2 transition-all duration-300 transform mix-blend-screen",
              actionRotation,
              cell.isCenter
                ? THEME.navigation.icon.active + " group-hover:scale-110"
                : THEME.navigation.icon.base + " group-hover:scale-110",
            )}
          >
            <ActionIcon
              strokeWidth={1.5}
              className="w-4 h-4 md:w-6 md:h-6 transition-all"
            />
          </div>
          <div className="flex-1 flex flex-col justify-end w-full">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 w-full">
              {/* Icons keep mix-blend-screen for glowing effect */}
              <TypeIcon
                strokeWidth={1}
                className={cn(
                  "w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0 mix-blend-screen",
                  cell.isCenter
                    ? THEME.navigation.icon.active
                    : THEME.navigation.icon.base,
                )}
              />

              {/* UPDATED: Uses THEME.typography.hud for bigger text */}
              <span
                className={cn(
                  THEME.typography.hud,
                  "transition-all duration-300 line-clamp-1 break-all",
                  cell.isCenter
                    ? THEME.navigation.text.active
                    : THEME.navigation.text.base,
                )}
              >
                <CyberText
                  text={displayTitle}
                  triggerKey={cell.id + (isHovered ? "hover" : "")}
                />
              </span>
            </div>
          </div>
        </div>
      </MotionDiv>
    );
  }),
);

export const LotusGrid: React.FC = () => {
  const {
    currentNode,
    lang,
    isDesktop,
    isGridCollapsed,
    toggleGrid,
    navigatorHighlight,
  } = useNavigation();
  const { gridCells } = useLotusLogic(currentNode, lang);

  // --- SINGLE SOURCE OF TRUTH: drawerY ---
  // On mobile, this is the ONLY thing that controls the panel position.
  // 0 = fully open. closedOffset = only bar visible.
  // During drag: set instantly (no transition).
  // On snap: spring animates to 0 or closedOffset.
  const closedOffsetRef = React.useRef(0);
  const [drawerY, setDrawerY] = React.useState<number | null>(null); // null = not yet measured

  // Ref to the panel DOM element — used for reliable pixel measurement
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Measure panel height via getBoundingClientRect (reliable on all browsers/devices)
  // Called on mount, resize, and orientation change
  const measure = React.useCallback(() => {
    if (isDesktop) return;

    // Use the actual rendered height of the panel element if available
    // Fallback: compute from CSS var via window.innerHeight
    let panelH = 0;
    if (panelRef.current) {
      panelH = panelRef.current.getBoundingClientRect().height;
    }
    // If element not yet rendered or has 0 height, fall back to CSS var
    if (panelH === 0) {
      panelH = window.innerHeight * 0.49; // matches --lotus-panel-height: 49dvh
    }

    const barRaw = getComputedStyle(document.documentElement)
      .getPropertyValue("--lotus-bar-height")
      .trim();
    // bar height is a fixed rem value — safe to parse
    const barH = parseFloat(barRaw) * 16 || 44;

    const newOffset = panelH - barH;

    // On orientation change: reposition drawer to correct snap point
    const wasOpen =
      closedOffsetRef.current > 0 && drawerY !== null
        ? drawerY < closedOffsetRef.current * 0.5
        : !isGridCollapsed;

    closedOffsetRef.current = newOffset;

    // Snap to correct position immediately (no animation on remeasure)
    setDrawerY(wasOpen ? 0 : newOffset);
  }, [isDesktop, isGridCollapsed, drawerY]);

  React.useEffect(() => {
    if (isDesktop) return;
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [isDesktop, measure]);

  // Sync drawerY when isGridCollapsed changes (click/tap toggle)
  // Uses spring via CSS transition (not instant)
  const isSnapping = React.useRef(false);
  const snapDebounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  React.useEffect(() => {
    if (isDesktop || closedOffsetRef.current === 0) return;
    // Debounce: ignore rapid double-taps during animation
    if (isSnapping.current) return;
    isSnapping.current = true;
    isDragging.current = false; // ensure transition applies
    const target = isGridCollapsed ? closedOffsetRef.current : 0;
    setDrawerY(target);
    // Update CSS var for text padding
    const openPx = isGridCollapsed ? 0 : closedOffsetRef.current;
    document.documentElement.style.setProperty(
      "--drawer-open-px",
      `${openPx}px`,
    );
    // Clear snapping after transition + buffer
    if (snapDebounceRef.current) clearTimeout(snapDebounceRef.current);
    snapDebounceRef.current = setTimeout(() => {
      isSnapping.current = false;
    }, 500);
  }, [isGridCollapsed, isDesktop]);

  // Init --drawer-open-px on first mount (drag and snap set it directly for perf)
  React.useEffect(() => {
    if (isDesktop) return;
    document.documentElement.style.setProperty("--drawer-open-px", "0px");
    return () => {
      // Cleanup on unmount
      document.documentElement.style.removeProperty("--drawer-open-px");
    };
  }, [isDesktop]);

  // --- NATIVE POINTER EVENTS (no React event system) ---
  // Attached directly to the LotusSidebar handle via handleRef.
  // Zero overhead: no useCallback, no synthetic events, no re-renders during drag.
  const handleRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);
  const dragYRef = React.useRef(0);
  const dragStartRef = React.useRef<{ y: number; time: number } | null>(null);
  const wasDragRef = React.useRef(false);

  // Keep a ref to current isGridCollapsed for use inside native event handlers
  // (closures capture the ref, not the stale state value)
  const isCollapsedRef = React.useRef(isGridCollapsed);
  React.useEffect(() => {
    isCollapsedRef.current = isGridCollapsed;
  }, [isGridCollapsed]);

  const toggleGridRef = React.useRef(toggleGrid);
  React.useEffect(() => {
    toggleGridRef.current = toggleGrid;
  }, [toggleGrid]);

  React.useEffect(() => {
    const handle = handleRef.current;
    const panel = panelRef.current;
    if (!handle || !panel || isDesktop) return;

    const SNAP_TRANSITION = "transform 380ms cubic-bezier(0.32, 0.72, 0, 1)";

    const onDown = (e: PointerEvent) => {
      if (isSnapping.current) return;
      handle.setPointerCapture(e.pointerId);
      dragStartRef.current = { y: e.clientY, time: Date.now() };
      dragYRef.current =
        closedOffsetRef.current > 0 && isCollapsedRef.current
          ? closedOffsetRef.current
          : 0;
      wasDragRef.current = false;
      isDragging.current = false;
    };

    const onMove = (e: PointerEvent) => {
      if (!dragStartRef.current || isSnapping.current) return;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dy) < 4) return; // dead zone — ignore micro-jitter

      isDragging.current = true;
      wasDragRef.current = true;

      const closed = closedOffsetRef.current;
      const base = isCollapsedRef.current ? closed : 0;
      const clamped = Math.max(0, Math.min(closed, base + dy));
      dragYRef.current = clamped;

      // ONLY move the panel — pure compositor transform, zero reflow.
      // --drawer-open-px is NOT updated here: padding-bottom causes layout
      // reflow on every frame which is the source of jitter.
      // It will be updated once on snap (pointerup).
      panel.style.transition = "none";
      panel.style.transform = `translateY(${clamped}px)`;
    };

    const onUp = (e: PointerEvent) => {
      if (!dragStartRef.current) return;
      const dy = e.clientY - dragStartRef.current.y;
      const dt = Date.now() - dragStartRef.current.time;
      const velocity = Math.abs(dy) / Math.max(dt, 1);
      dragStartRef.current = null;

      if (!wasDragRef.current) {
        // Pure tap — toggle
        toggleGridRef.current(!isCollapsedRef.current);
        return;
      }

      isDragging.current = false;
      const closed = closedOffsetRef.current;
      const threshold = closed * 0.3;

      let shouldOpen: boolean;
      if (velocity >= 0.5) {
        shouldOpen = dy < 0;
      } else {
        shouldOpen = isCollapsedRef.current
          ? Math.abs(dy) >= threshold && dy < 0
          : !(Math.abs(dy) >= threshold && dy > 0);
      }

      // Re-enable transition before snap
      panel.style.transition = SNAP_TRANSITION;

      // Snap panel to final position
      const snapY = shouldOpen ? 0 : closed;
      panel.style.transform = `translateY(${snapY}px)`;

      // Update padding ONCE to final value — animates via CSS transition in App.tsx.
      // Single layout reflow on snap, not on every drag frame.
      document.documentElement.style.setProperty(
        "--drawer-open-px",
        `${shouldOpen ? closed : 0}px`,
      );

      // Sync React state (updates isGridCollapsed for rest of app)
      toggleGridRef.current(!shouldOpen);
    };

    const onCancel = () => {
      if (!dragStartRef.current) return;
      dragStartRef.current = null;
      isDragging.current = false;
      // Snap back to current logical state
      const closed = closedOffsetRef.current;
      const isCollapsed = isCollapsedRef.current;
      panel.style.transition = SNAP_TRANSITION;
      panel.style.transform = `translateY(${isCollapsed ? closed : 0}px)`;
      // Restore padding to match logical state
      document.documentElement.style.setProperty(
        "--drawer-open-px",
        `${isCollapsed ? 0 : closed}px`,
      );
    };

    handle.addEventListener("pointerdown", onDown, { passive: false });
    handle.addEventListener("pointermove", onMove, { passive: false });
    handle.addEventListener("pointerup", onUp, { passive: false });
    handle.addEventListener("pointercancel", onCancel, { passive: false });

    return () => {
      handle.removeEventListener("pointerdown", onDown);
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onCancel);
    };
    // Intentionally minimal deps — handlers read live values via refs
  }, [isDesktop]);

  // ── ATTENTION: PEEK + HANDLE PULSE ─────────────────────────────────────────
  // After 4s of inactivity (panel closed, user hasn't interacted):
  //   1. Panel peeks up ~28% of its height, then springs back. One time only.
  //   2. Handle pulses until first open interaction.
  // Both stop immediately if user opens the panel themselves.
  // ──────────────────────────────────────────────────────────────────────────
  const [handlePulse, setHandlePulse] = React.useState(false);
  const peekFiredRef = React.useRef(false);
  const peekTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    // Only on mobile, only when collapsed, only once per session
    if (isDesktop || !isGridCollapsed) {
      // User opened the panel — cancel pending peek, stop pulse
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
      setHandlePulse(false);
      return;
    }

    // Already fired this session — don't repeat
    if (peekFiredRef.current) return;

    peekTimerRef.current = setTimeout(() => {
      const panel = panelRef.current;
      if (!panel || !isCollapsedRef.current) return; // user may have opened meanwhile

      peekFiredRef.current = true;
      const closed = closedOffsetRef.current;
      // Peek distance: 30% of panel height (enough to show top row of cells)
      const peekY = closed * 0.3;

      // PEEK IN — fast ease-out (feels like a knock)
      panel.style.transition = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
      panel.style.transform = `translateY(${closed - peekY}px)`;

      // PEEK OUT — spring back after 600ms pause
      const backTimer = setTimeout(() => {
        if (!isCollapsedRef.current) return; // user opened it during peek
        panel.style.transition =
          "transform 500ms cubic-bezier(0.32, 0.72, 0, 1)";
        panel.style.transform = `translateY(${closed}px)`;

        // Start handle pulse after peek completes
        const pulseTimer = setTimeout(() => {
          if (isCollapsedRef.current) setHandlePulse(true);
        }, 520);
        peekTimerRef.current = pulseTimer;
      }, 700);

      peekTimerRef.current = backTimer;
    }, 4000);

    return () => {
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
    };
  }, [isDesktop, isGridCollapsed]);

  // Mobile style: absolute overlay, GPU-only transform.
  // Transition is always "on" here — during drag it gets disabled
  // directly on panelRef.style, bypassing React entirely for zero-lag response.
  const mobileStyle: React.CSSProperties =
    !isDesktop && drawerY !== null
      ? {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "var(--lotus-panel-height)",
          transform: `translateY(${drawerY}px)`,
          transition: "transform 380ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
          zIndex: 30,
        }
      : {};

  // Content opacity: always 1 — content is ALWAYS rendered
  // We rely on the panel being off-screen when closed, not on hiding content
  // This is what makes the "physical body" feel correct during drag
  const contentStyle: React.CSSProperties = !isDesktop
    ? {
        opacity: 1,
        pointerEvents: isGridCollapsed && !isDragging.current ? "none" : "auto",
      }
    : {};

  return (
    <>
      <MotionDiv
        ref={panelRef}
        className={cn(
          THEME.layout.gridSection,
          isDesktop ? "shrink-0 overflow-hidden" : "overflow-hidden",
        )}
        // Desktop: framer manages layout height
        animate={isDesktop ? { height: "100%" } : undefined}
        transition={isDesktop ? TRANSITIONS.layout : undefined}
        style={{
          touchAction: "none",
          ...mobileStyle,
        }}
      >
        <div className="flex flex-col md:flex-row landscape:flex-row w-full h-full">
          <LotusSidebar
            lang={lang}
            isDesktop={isDesktop}
            isGridCollapsed={isGridCollapsed}
            toggleGrid={toggleGrid}
            navigatorHighlight={navigatorHighlight}
            handleRef={handleRef}
            handlePulse={handlePulse}
          />
          <div
            className="flex-1 relative min-h-0 flex flex-col"
            style={contentStyle}
          >
            <div className={cn(THEME.lotus.frame, "flex-1 min-h-0")}>
              <div className={THEME.lotus.gridWrapper}>
                {gridCells.map((cell, index) => (
                  <div
                    key={index}
                    className="relative w-full h-full isolate overflow-hidden bg-surface"
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <GridCell
                        key={cell ? cell.id : `empty-${index}`}
                        cell={cell}
                        index={index}
                        className="absolute inset-0"
                      />
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
            <div className="shrink-0 z-50 w-full bg-transparent">
              <Breadcrumbs />
            </div>
          </div>
        </div>
      </MotionDiv>
    </>
  );
};
