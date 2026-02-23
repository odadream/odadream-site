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
import {
  TRANSITIONS,
  DRAWER,
  MotionDiv,
  CELL_VARIANTS,
} from "../styles/animations";
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
  >(({ cell, index, className }, ref) => {
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
                "will-change-[opacity,filter]",
                // Apply grayscale and opacity effects based on cell type (transitions included in classes)
                cell.isCenter
                  ? THEME.lotus.image.center + " mix-blend-normal"
                  : isVisualNode
                    ? THEME.lotus.image.visual +
                      " mix-blend-luminosity group-hover:mix-blend-normal"
                    : THEME.lotus.image.default +
                      " mix-blend-luminosity group-hover:mix-blend-normal",
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

  // Live drag offset from swipe gesture (px). 0 = snapped to state position.
  // Positive = dragged toward closed, negative = dragged toward open.
  const [dragOffset, setDragOffset] = React.useState(0);

  // On mobile: panel is absolutely positioned, slides via translateY
  // translateY(0) = fully open, translateY(closedY) = only bar visible
  // --lotus-closed-y is set in CSS: calc(panel-height - bar-height)
  const mobileStyle: React.CSSProperties = !isDesktop
    ? {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "var(--lotus-panel-height)",
        // translateY: closed = slide down by closedY, open = 0
        // dragOffset adjusts the snap position during drag
        transform: isGridCollapsed
          ? `translateY(calc(var(--lotus-closed-y) + ${dragOffset}px))`
          : `translateY(${Math.max(0, dragOffset)}px)`,
        // Use spring transition only when not dragging
        transition: dragOffset !== 0 ? "none" : undefined,
        willChange: "transform",
        zIndex: 30,
      }
    : {};

  return (
    <MotionDiv
      className={cn(
        THEME.layout.gridSection,
        // Desktop: normal flow. Mobile: taken out of flow (absolute).
        isDesktop ? "shrink-0 overflow-hidden" : "overflow-hidden",
      )}
      // Desktop uses framer for layout, mobile uses CSS transform above
      animate={isDesktop ? { height: "100%" } : undefined}
      transition={isDesktop ? TRANSITIONS.layout : TRANSITIONS.drawer}
      style={{
        touchAction: "none",
        ...mobileStyle,
        // When drag is active, override framer transition with instant response
        ...(dragOffset !== 0 && !isDesktop ? { transition: "none" } : {}),
      }}
    >
      <div className="flex flex-col md:flex-row landscape:flex-row w-full h-full">
        <LotusSidebar
          lang={lang}
          isDesktop={isDesktop}
          isGridCollapsed={isGridCollapsed}
          toggleGrid={toggleGrid}
          navigatorHighlight={navigatorHighlight}
          onDragOffset={setDragOffset}
        />
        <div
          className={cn(
            "flex-1 relative min-h-0 flex flex-col",
            // Grid content is always rendered (drawer pattern).
            // On mobile collapsed: pointer-events off so taps pass through to text.
            // Opacity: fade out slightly when collapsed but keep rendered for perf.
            !isDesktop && isGridCollapsed
              ? "opacity-0 pointer-events-none"
              : "opacity-100 transition-opacity duration-200",
          )}
        >
          <div className={cn(THEME.lotus.frame, "flex-1 min-h-0")}>
            <div className={THEME.lotus.gridWrapper}>
              {/* 
                        FIX: AnimatePresence moved inside the map loop. 
                        This allows the cell content to cross-dissolve within the static grid slot.
                        'popLayout' combined with 'absolute inset-0' on the cell ensures they stack.
                        Added 'bg-surface' to parent slot to prevent transparency during transitions.
                    */}
              {gridCells.map((cell, index) => (
                <div
                  key={index}
                  className="relative w-full h-full isolate overflow-hidden bg-surface"
                >
                  <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    // Optimized for smooth cross-dissolve transitions
                  >
                    <GridCell
                      key={cell ? cell.id : `empty-${index}`}
                      cell={cell}
                      index={index}
                      className="absolute inset-0" // Force absolute to allow overlap during transition
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
  );
};
