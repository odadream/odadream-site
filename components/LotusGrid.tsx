import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Undo2,
  Maximize2,
  ChevronUp,
  GripHorizontal,
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
} from "lucide-react";
import { LotusNode, Language } from "../types";
import { THEME } from "../styles/theme";
import { Breadcrumbs } from "./Breadcrumbs";
import { CyberText } from "./CyberText";

// Workaround for TypeScript environment issues with framer-motion types
const MotionDiv = motion.div as any;

interface LotusGridProps {
  currentNode: LotusNode;
  displayChildren: LotusNode[];
  path: LotusNode[];
  onNavigate: (node: LotusNode) => void;
  onBack: () => void;
  onNavigateToLevel: (index: number) => void;
  canGoBack: boolean;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  isLandscape: boolean;
  lang: Language;
  highlightHeader?: boolean;
}

type GridNode = LotusNode & { isCenter: boolean };

const LotusIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 21V13" className="opacity-50" />
    <path d="M12 21C12 21 8 16 8 11C8 8.8 9.8 7 12 7C14.2 7 16 8.8 16 11C16 16 12 21 12 21Z" />
    <path d="M12 21C12 21 3 15 3 9C3 6 5 4 8 4C10 4 12 7 12 7" />
    <path d="M12 21C12 21 21 15 21 9C21 6 19 4 16 4C14 4 12 7 12 7" />
  </svg>
);

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

// --- VISUAL COMPONENTS ---

const CornerBrackets = ({
  show,
  accent,
}: {
  show: boolean;
  accent: boolean;
}) => {
  // 1. Artifact Fix: Replaced 'shadow-...' (box-shadow) with 'drop-shadow' (filter).
  // Box-shadow creates a square glow around the div. Drop-shadow adheres to the border lines only.
  const borderColor = accent ? "border-accent" : "border-zinc-500";
  const glowClass = accent ? "drop-shadow-[0_0_2px_rgba(16,185,129,0.8)]" : "";

  // 2. Brightness Logic:
  // Accent (Center): Always 100% opacity.
  // Neighbors (Show): 30% opacity by default (dim), jumps to 100% on group-hover.
  const opacityClass = accent
    ? "opacity-100"
    : show
      ? "opacity-30 group-hover:opacity-100 transition-opacity duration-300"
      : "opacity-0";

  const length = "w-1.5 h-1.5 md:w-2 md:h-2";

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-30 ${opacityClass}`}
    >
      <div
        className={`absolute top-0 left-0 ${length} border-t border-l transition-colors duration-300 ${borderColor} ${glowClass}`}
      />
      <div
        className={`absolute top-0 right-0 ${length} border-t border-r transition-colors duration-300 ${borderColor} ${glowClass}`}
      />
      <div
        className={`absolute bottom-0 left-0 ${length} border-b border-l transition-colors duration-300 ${borderColor} ${glowClass}`}
      />
      <div
        className={`absolute bottom-0 right-0 ${length} border-b border-r transition-colors duration-300 ${borderColor} ${glowClass}`}
      />
    </div>
  );
};

// Local Noise Texture to ensure consistent grain across all cell types (images vs gradients)
const CellNoise = React.memo(() => (
  <div
    className="absolute inset-0 z-[2] opacity-[0.08] pointer-events-none mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
));

const CSSFallbackPattern = React.memo(
  ({ id, isCenter }: { id: string; isCenter: boolean }) => {
    const seed = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = (seed * 137) % 360;
    const centerOpacity = isCenter ? 0.22 : 0.15;

    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#080808]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, hsla(${hue}, 70%, 15%, 0.6) 0%, transparent 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
        <div
          className="absolute w-[150%] h-[150%] -left-[25%] -top-[25%] bg-[radial-gradient(circle_at_center,theme('colors.accent.DEFAULT'),transparent)] blur-3xl"
          style={{ opacity: centerOpacity }}
        />
      </div>
    );
  },
);

const AudioVisualizer = React.memo(() => (
  <div className="flex gap-0.5 md:gap-1 items-end justify-center h-8 md:h-12 w-full opacity-60">
    {[...Array(7)].map((_, i) => (
      <div
        key={i}
        className="w-1 md:w-1.5 bg-accent/60 rounded-t-sm animate-pulse"
        style={{
          height: `${30 + Math.random() * 70}%`,
          animationDuration: `${0.4 + Math.random() * 0.5}s`,
          animationDelay: `${Math.random() * 0.5}s`,
        }}
      />
    ))}
  </div>
));

const GridCell = React.memo(
  ({
    cell,
    index,
    canGoBack,
    onNavigate,
    onBack,
    lang,
  }: {
    cell: GridNode | null;
    index: number;
    canGoBack: boolean;
    onNavigate: (n: LotusNode) => void;
    onBack: () => void;
    lang: Language;
  }) => {
    const [imgError, setImgError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      setImgError(false);
    }, [cell?.id]);

    if (!cell) {
      return (
        <div className={`${THEME.lotus.cellEmpty} group`}>
          <Plus
            strokeWidth={1.5}
            className="w-4 h-4 text-zinc-800 opacity-60 transition-all duration-500 group-hover:rotate-90 group-hover:text-zinc-600"
          />
        </div>
      );
    }

    const isHub = cell.type === "hub";
    const isAction = cell.type === "action";
    const isMedia = cell.type === "media";
    const mediaType = cell.mediaType || "unknown";

    // Treat nodes with videos as visual nodes too, so they don't get the 'dim' treatment of opacity-40
    // This now applies to Hub/Content nodes that happen to have a video URL attached.
    const hasVideo = mediaType === "video" && !!cell.mediaUrl;
    const isVisualNode = cell.type === "media" || !!cell.imageUrl || hasVideo;

    const opacityClass = cell.isCenter
      ? "opacity-100"
      : isVisualNode
        ? "opacity-80 hover:opacity-100"
        : "opacity-40 hover:opacity-100";

    const grayscaleClass = cell.isCenter
      ? "grayscale-0"
      : "grayscale hover:grayscale-0";

    let ActionIcon;
    let actionRotation = "rotate-0";

    if (cell.isCenter) {
      ActionIcon = canGoBack ? Undo2 : Disc;
    } else if (isAction && cell.externalLink) {
      ActionIcon = ExternalLink;
    } else if (isMedia && !isHub) {
      ActionIcon = Maximize2;
    } else {
      ActionIcon = ArrowUp;
      actionRotation = ARROW_ROTATIONS[index] || "rotate-0";
    }

    let TypeIcon;
    switch (cell.type) {
      case "hub":
        TypeIcon = Layers;
        break;
      case "action":
        TypeIcon = Zap;
        break;
      case "media":
        switch (mediaType) {
          case "video":
            TypeIcon = Film;
            break;
          case "audio":
            TypeIcon = AudioLines;
            break;
          case "image":
            TypeIcon = ImageIcon;
            break;
          default:
            TypeIcon = ImageIcon;
        }
        break;
      default:
        TypeIcon = FileText;
    }

    const contentOpacity =
      cell.isCenter || isHovered ? "opacity-100" : "opacity-70";

    const handleClick = () => {
      if (cell.isCenter) {
        if (canGoBack) onBack();
      } else if (isAction && cell.externalLink) {
        window.open(cell.externalLink, "_blank");
      } else {
        onNavigate(cell);
      }
    };

    return (
      <div
        className={`
                ${THEME.lotus.cell}
                ${cell.isCenter ? `${THEME.lotus.cellActive}` : ""} 
                ${!cell.isCenter ? THEME.lotus.cellInteractive : ""}
            `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <CornerBrackets show={true} accent={cell.isCenter} />

        {/* BACKGROUND LAYER */}
        <div
          className={`absolute inset-[2px] z-0 overflow-hidden bg-black transition-all duration-700 ease-out ${opacityClass} ${grayscaleClass}`}
        >
          {/* 1. RENDER MEDIA (IMAGE OR VIDEO FRAME) */}
          {/* If it's a video, we prioritize showing the video frame/preview over the image url if the image fails, 
                    BUT if there is an explicit image URL (poster), we try that first. 
                    However, the logic below falls back to video if image is missing/broken. 
                */}

          {cell.imageUrl && !imgError ? (
            <img
              src={cell.imageUrl}
              onError={() => setImgError(true)}
              loading={cell.isCenter ? "eager" : "lazy"}
              className={`
                            w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105
                            ${cell.isCenter ? "mix-blend-normal" : "mix-blend-screen"}
                        `}
              alt=""
            />
          ) : hasVideo ? (
            // STATIC VIDEO FRAME (for when not hovering, or as base layer)
            // Added scale-105 group-hover to match the zoom effect of images
            <video
              src={`${cell.mediaUrl}#t=0.1`}
              muted
              playsInline
              preload="metadata"
              className={`
                            w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105
                            ${cell.isCenter ? "mix-blend-normal" : "mix-blend-screen"}
                        `}
              onLoadedData={(e) => {
                e.currentTarget.currentTime = 0.1;
              }}
            />
          ) : (
            <CSSFallbackPattern id={cell.id} isCenter={cell.isCenter} />
          )}

          {/* 2. NOISE TEXTURE */}
          <CellNoise />

          {/* 3. AUDIO VISUALIZER */}
          {isMedia && mediaType === "audio" && !isHub && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm z-10">
              <AudioVisualizer />
            </div>
          )}

          {/* 4. ACTIVE VIDEO PREVIEW (Autoplays on Hover for ANY node with video) */}
          {hasVideo && isHovered && !cell.isCenter && (
            <video
              src={cell.mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover mix-blend-normal z-10 animate-in fade-in duration-500 transition-transform duration-1000 group-hover:scale-105"
            />
          )}

          {/* 5. OVERLAYS & GRADIENTS */}
          {cell.isCenter && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent z-10 pointer-events-none mix-blend-overlay" />
              <div className="absolute inset-0 bg-[length:4px_4px] bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] z-10 opacity-30 pointer-events-none" />
            </>
          )}

          {isVisualNode ? (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] pointer-events-none z-10" />
          )}
        </div>

        {/* FOREGROUND CONTENT */}
        <div
          className={`relative z-20 flex flex-col items-center justify-between w-full h-full p-2 md:p-4 text-center pointer-events-none transition-opacity duration-300 ${contentOpacity}`}
        >
          <div className="flex-1" />

          <div
            className={`
                    flex-shrink-0 mb-1 md:mb-2 transition-all duration-300 transform
                    ${actionRotation}
                    ${cell.isCenter ? "text-accent drop-shadow-neon group-hover:scale-110" : "text-zinc-400 group-hover:text-zinc-200 group-hover:scale-110"}
                `}
          >
            <ActionIcon
              strokeWidth={1.5}
              className={`w-4 h-4 md:w-6 md:h-6 opacity-90 group-hover:opacity-100 transition-all`}
            />
          </div>

          <div className="flex-1 flex flex-col justify-end w-full">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 w-full">
              <TypeIcon
                className={`
                            w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0 
                            ${cell.isCenter ? "text-accent" : "text-zinc-400 group-hover:text-zinc-300"}
                        `}
              />

              <span
                className={`
                            ${THEME.typography.uiLabel}
                            transition-all duration-300 line-clamp-1 break-all
                            ${cell.isCenter ? "text-zinc-100 drop-shadow-md" : "text-zinc-400 group-hover:text-zinc-200"}
                        `}
              >
                <CyberText
                  text={cell.shortTitle?.[lang] || cell.title[lang]}
                  triggerKey={cell.id + (isHovered ? "hover" : "")}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export const LotusGrid: React.FC<LotusGridProps> = ({
  currentNode,
  displayChildren,
  path,
  onNavigate,
  onBack,
  onNavigateToLevel,
  canGoBack,
  isCollapsed,
  onToggleCollapse,
  isLandscape,
  lang,
  highlightHeader,
}) => {
  const handleDragEnd = (event: any, info: any) => {
    void event;
    if (!isLandscape) {
      const threshold = 30;
      if (info.offset.y > threshold && !isCollapsed) {
        onToggleCollapse(true);
      } else if (info.offset.y < -threshold && isCollapsed) {
        onToggleCollapse(false);
      }
    }
  };

  const gridCells = useMemo(() => {
    return Array(9)
      .fill(null)
      .map((_, index) => {
        if (index === 4) return { ...currentNode, isCenter: true };

        let childIndex = -1;
        if (index < 4) childIndex = index;
        else if (index > 4) childIndex = index - 1;

        return displayChildren[childIndex]
          ? { ...displayChildren[childIndex], isCenter: false }
          : null;
      });
  }, [currentNode, displayChildren]);

  const variants = {
    desktop: { height: "100%" },
    mobileExpanded: { height: "var(--mobile-grid-height)" },
    mobileCollapsed: { height: "var(--bar-height)" },
  };

  return (
    <MotionDiv
      className={`${THEME.layout.gridSection} shrink-0`}
      initial={false}
      animate={
        isLandscape
          ? "desktop"
          : isCollapsed
            ? "mobileCollapsed"
            : "mobileExpanded"
      }
      variants={variants}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
      style={{ touchAction: "none" }}
    >
      <div className="flex flex-col md:flex-row landscape:flex-row w-full h-full">
        <div
          className={`
                relative flex-shrink-0 flex items-center justify-between z-30 bg-[#080808] border-white/10 select-none overflow-hidden group
                ${THEME.layout.barHeight} w-full px-5 border-b border-t border-zinc-900 mobile:cursor-grab mobile:active:cursor-grabbing cursor-pointer
                shadow-[0_-8px_30px_-5px_rgba(0,0,0,1)]
                md:h-full md:w-12 md:flex-col md:py-8 md:border-b-0 md:border-t-0 md:border-r md:px-0 md:cursor-default md:shadow-none
                landscape:h-full landscape:w-12 landscape:flex-col landscape:py-8 landscape:border-b-0 landscape:border-t-0 landscape:border-r landscape:px-0 landscape:cursor-default landscape:shadow-none
            `}
          onClick={() => !isLandscape && onToggleCollapse(!isCollapsed)}
        >
          {highlightHeader && (
            <div className="absolute -inset-[100%] z-50 pointer-events-none">
              <div className="w-[300%] h-[300%] bg-gradient-to-br from-transparent via-white/10 to-transparent animate-shine-45" />
            </div>
          )}

          <div
            className={`
                ${THEME.typography.sectionHeader}
                flex items-center gap-3 relative z-20
                md:[writing-mode:vertical-rl] md:rotate-180 md:justify-center md:flex-1
                landscape:[writing-mode:vertical-rl] landscape:rotate-180 landscape:justify-center landscape:flex-1
             `}
          >
            <span className={`text-accent drop-shadow-neon`}>
              <LotusIcon className="w-5 h-5 md:w-6 md:h-6 rotate-0" />
            </span>
            <span
              className={`
                    tracking-[0.35em] transition-all duration-300 
                    ${highlightHeader ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}
                 `}
            >
              <CyberText
                text={lang === "ru" ? "НАВИГАТОР" : "NAVIGATOR"}
                triggerKey={highlightHeader ? Date.now() : "static"}
              />
            </span>
          </div>

          <div className="md:hidden landscape:hidden text-zinc-500 flex items-center justify-center w-8 h-8 rounded-full active:bg-zinc-800 transition-colors relative z-20">
            <MotionDiv
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              whileTap={{ scale: 1.2 }}
            >
              {isCollapsed ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <GripHorizontal className="w-4 h-4 opacity-70" />
              )}
            </MotionDiv>
          </div>
        </div>

        <div className="flex flex-col flex-1 w-full h-full bg-black min-w-0 min-h-0">
          {/* Unified vertical padding with TextPanel */}
          <div className={`relative ${THEME.lotus.frame}`}>
            <div
              className={`
                    w-full h-full transition-all duration-300 ease-out z-10 relative
                    ${!isLandscape && isCollapsed ? "opacity-0 scale-[0.98] pointer-events-none" : "opacity-100 scale-100 pointer-events-auto"}
                `}
            >
              <div className={`${THEME.lotus.gridWrapper}`}>
                {gridCells.map((cell, index) => (
                  <GridCell
                    key={cell ? cell.id : `empty-${index}`}
                    cell={cell}
                    index={index}
                    canGoBack={canGoBack}
                    onNavigate={onNavigate}
                    onBack={onBack}
                    lang={lang}
                  />
                ))}
              </div>
            </div>
          </div>

          <Breadcrumbs
            path={path}
            onNavigateToLevel={onNavigateToLevel}
            lang={lang}
          />
        </div>
      </div>
    </MotionDiv>
  );
};
