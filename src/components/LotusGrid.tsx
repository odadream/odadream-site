import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Undo2,
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
import { TRANSITIONS, MotionDiv } from "../styles/animations";
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

const cellVariants = {
  initial: {
    opacity: 0,
    zIndex: 10, // Incoming sits ON TOP
  },
  animate: {
    opacity: 1,
    zIndex: 10,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    zIndex: 0, // Outgoing sits BELOW
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

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
const GridCell = React.memo(
  ({
    cell,
    index,
    className,
  }: {
    cell: GridNode | null;
    index: number;
    className?: string;
  }) => {
    const { navigate, goBack, lang, path } = useNavigation();
    const [isHovered, setIsHovered] = useState(false);
    const {
      src: activeSrc,
      handleError,
      isDead,
    } = useImageFallback(cell?.imageUrl, cell?.id);

    // Empty Cell State
    if (!cell) {
      return (
        <MotionDiv
          variants={cellVariants}
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
    const canGoBack = path.length > 1;

    let ActionIcon = ArrowUp;
    let actionRotation = ARROW_ROTATIONS[index] || "rotate-0";

    if (cell.isCenter) {
      ActionIcon = canGoBack ? Undo2 : Disc;
      actionRotation = "rotate-0";
    } else if (isAction && cell.externalLink) {
      ActionIcon = ExternalLink;
      actionRotation = "rotate-0";
    } else if (isMedia && !isHub) {
      ActionIcon = Maximize2;
      actionRotation = "rotate-0";
    }

    let TypeIcon = FileText;
    if (isHub) TypeIcon = Layers;
    else if (isAction) TypeIcon = Zap;
    else if (isMedia) {
      TypeIcon =
        cell.mediaType === "video"
          ? Film
          : cell.mediaType === "audio"
            ? AudioLines
            : ImageIcon;
    }

    const handleClick = () => {
      if (cell.isCenter) {
        if (canGoBack) goBack();
      } else if (isAction && cell.externalLink) {
        window.open(cell.externalLink, "_blank");
      } else {
        navigate(cell);
      }
    };

    const displayTitle = cell.shortTitle?.[lang] || cell.title[lang];

    return (
      <MotionDiv
        key={cell.id}
        variants={cellVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        // ADDED: bg-surface to prevent seeing through to body during cross-dissolve
        className={cn(
          THEME.lotus.cell,
          "bg-surface",
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

        {/* BACKGROUND LAYER */}
        <div
          className={cn(
            "absolute inset-0 z-0 overflow-hidden transition-all duration-700 ease-out",
            // Ensure a base color is always present behind the image
            "bg-surface",
            cell.isCenter
              ? "opacity-100 grayscale-0"
              : isVisualNode
                ? "opacity-60 hover:opacity-90 grayscale hover:grayscale-0"
                : "opacity-30 hover:opacity-80 grayscale hover:grayscale-0",
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
                "w-full h-full object-cover transition-transform duration-1000 pointer-events-none select-none",
                cell.isCenter
                  ? "mix-blend-normal"
                  : "mix-blend-luminosity hover:mix-blend-normal",
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
  },
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

  const currentState = isDesktop
    ? "desktop"
    : isGridCollapsed
      ? "mobileCollapsed"
      : "mobileExpanded";

  return (
    <MotionDiv
      className={cn(THEME.layout.gridSection, "shrink-0 overflow-hidden")}
      initial={currentState}
      animate={currentState}
      variants={{
        desktop: { height: "100%" },
        mobileExpanded: {
          height: "var(--mobile-grid-height)",
          transition: TRANSITIONS.layout,
        },
        mobileCollapsed: {
          height: "var(--bar-height)",
          transition: TRANSITIONS.layout,
        },
      }}
      style={{ touchAction: "none" }}
    >
      <div className="flex flex-col md:flex-row landscape:flex-row w-full h-full">
        <LotusSidebar
          lang={lang}
          isDesktop={isDesktop}
          isGridCollapsed={isGridCollapsed}
          toggleGrid={toggleGrid}
          navigatorHighlight={navigatorHighlight}
        />
        <div
          className={cn(
            "flex-1 relative transition-opacity duration-300 min-h-0 flex flex-col",
            !isDesktop && isGridCollapsed
              ? "opacity-0 pointer-events-none"
              : "opacity-100",
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
                  <AnimatePresence mode="popLayout" initial={false}>
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
