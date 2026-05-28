import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Layers, FileText, Zap, Film, AudioLines, Image as ImageIcon } from "lucide-react";

import { LotusNode } from "../types";
import { ROOT_NODE, LOTUS_GRID_LIMIT } from "../constants";
import { useNavigation } from "../context/NavigationContext";

const cn = (...inputs: (string | undefined | null | false)[]) =>
  twMerge(clsx(inputs));

// ---------------------------------------------------------------------------
//  Fractal geometry
// ---------------------------------------------------------------------------

const MAX_DEPTH = 4;
const LABEL_MAX_DEPTH = 3;

const LOTUS_SLOTS: ReadonlyArray<[number, number]> = [
  [0, 0], [1, 0], [2, 0],
  [0, 1],         [2, 1],
  [0, 2], [1, 2], [2, 2],
];

type Category = "art" | "education" | "tech" | "none";

const CATEGORY_BY_ID: Record<string, Category> = {
  "works-art": "art",
  "works-education": "education",
  "works-tech": "tech",
};

const TINT: Record<Category, { strong: string; soft: string }> = {
  art:       { strong: "bg-amber-500/[0.10]", soft: "bg-amber-500/[0.04]" },
  education: { strong: "bg-cyan-500/[0.10]",  soft: "bg-cyan-500/[0.04]" },
  tech:      { strong: "bg-sky-500/[0.10]",   soft: "bg-sky-500/[0.04]" },
  none:      { strong: "bg-surface",          soft: "bg-surface/60" },
};

interface Tile {
  node: LotusNode;
  depth: number;
  category: Category;
  x: number;
  y: number;
  size: number;
  isCenter: boolean;
  /** ID of the parent node that owns this tile's lotus group (center + 8 petals). */
  groupId: string;
}

interface Divider {
  depth: number;
  x1: number; y1: number; x2: number; y2: number;
}

function buildContentFractal(root: LotusNode, maxDepth: number) {
  const tiles: Tile[] = [];
  const dividers: Divider[] = [];

  const walk = (
    node: LotusNode,
    depth: number,
    cat: Category,
    x: number,
    y: number,
    size: number,
    groupId: string,
  ) => {
    const kids = (node.children ?? []).slice(0, LOTUS_GRID_LIMIT);
    const canSubdivide = depth < maxDepth && kids.length > 0;
    if (!canSubdivide) {
      tiles.push({ node, depth, category: cat, x, y, size, isCenter: false, groupId });
      return;
    }
    const s = size / 3;
    const dDepth = depth + 1;

    dividers.push({ depth: dDepth, x1: x + s,     y1: y,         x2: x + s,     y2: y + size });
    dividers.push({ depth: dDepth, x1: x + 2 * s, y1: y,         x2: x + 2 * s, y2: y + size });
    dividers.push({ depth: dDepth, x1: x,         y1: y + s,     x2: x + size,  y2: y + s });
    dividers.push({ depth: dDepth, x1: x,         y1: y + 2 * s, x2: x + size,  y2: y + 2 * s });

    for (let k = 0; k < kids.length; k++) {
      const [c, r] = LOTUS_SLOTS[k];
      const child = kids[k];
      const childCat = CATEGORY_BY_ID[child.id] ?? cat;
      walk(child, dDepth, childCat, x + c * s, y + r * s, s, node.id);
    }
    // Center tile: it IS the hub of this group.
    tiles.push({
      node, depth: dDepth, category: cat,
      x: x + s, y: y + s, size: s,
      isCenter: true, groupId: node.id,
    });
  };

  walk(root, 0, "none", 0, 0, 1, root.id);
  return { tiles, dividers };
}

const FRAME_STROKE = 2;
const strokeAt = (depth: number) => {
  if (depth <= 1) return 2;
  if (depth === 2) return 1;
  return 1;
};

// ---------------------------------------------------------------------------
//  Visual helpers
// ---------------------------------------------------------------------------

function typeIconOf(node: LotusNode) {
  if (node.type === "hub") return Layers;
  if (node.type === "action") return Zap;
  if (node.type === "media") {
    if (node.mediaType === "video") return Film;
    if (node.mediaType === "audio") return AudioLines;
    return ImageIcon;
  }
  return FileText;
}

function fontForDepth(depth: number): string {
  if (depth <= 1) return "text-[11px] leading-tight";
  if (depth === 2) return "text-[9px] leading-tight";
  if (depth === 3) return "text-[8px] leading-tight";
  return "text-[7px] leading-none";
}

function tintFor(node: LotusNode, cat: Category): string {
  const mature = node.status === "production" || node.status === "patent";
  return mature ? TINT[cat].strong : TINT[cat].soft;
}

const Label: React.FC<{
  node: LotusNode;
  depth: number;
  lang: "en" | "ru";
  isCenter?: boolean;
}> = ({ node, depth, lang, isCenter }) => {
  const label = node.shortTitle?.[lang] || node.title[lang] || node.id;
  return (
    <span
      className={cn(
        "font-mono uppercase tracking-tight text-center px-[2px]",
        "line-clamp-2 break-words pointer-events-none mix-blend-screen",
        fontForDepth(depth),
        isCenter ? "text-txt-muted" : "text-txt-muted/90",
      )}
    >
      {label}
    </span>
  );
};

// ---------------------------------------------------------------------------
//  Tile
// ---------------------------------------------------------------------------

interface TileProps {
  tile: Tile;
  side: number;
  lang: "en" | "ru";
  selectedId: string;
  ancestorIds: Set<string>;
  hoveredGroupId: string | null;
  zoomRootId: string;
  onNavigate: (n: LotusNode) => void;
  onHover: (n: LotusNode | null) => void;
  onHoverGroup: (groupId: string | null) => void;
  onZoom: (n: LotusNode) => void;
}

const FractalTile: React.FC<TileProps> = React.memo(
  ({
    tile, side, lang, selectedId, ancestorIds,
    hoveredGroupId, zoomRootId,
    onNavigate, onHover, onHoverGroup, onZoom,
  }) => {
    const style: React.CSSProperties = {
      left: tile.x * side,
      top: tile.y * side,
      width: tile.size * side,
      height: tile.size * side,
    };

    const isGroupHovered = hoveredGroupId === tile.groupId;

    // ── Center tile (hub label) ────────────────────────────────────────────
    if (tile.isCenter) {
      const isZoomRoot = tile.node.id === zoomRootId;
      const canZoomIn = !isZoomRoot && (tile.node.children?.length ?? 0) > 0;
      return (
        <button
          type="button"
          title={isZoomRoot
            ? (tile.node.id === ROOT_NODE.id ? "ODA" : tile.node.title[lang])
            : tile.node.title[lang]}
          onClick={(e) => {
            e.stopPropagation();
            if (!isZoomRoot) onNavigate(tile.node);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onZoom(tile.node);
          }}
          onMouseEnter={() => { onHoverGroup(tile.groupId); onHover(tile.node); }}
          onMouseLeave={() => { onHoverGroup(null); onHover(null); }}
          onFocus={() => { onHoverGroup(tile.groupId); onHover(tile.node); }}
          onBlur={() => { onHoverGroup(null); onHover(null); }}
          style={style}
          className={cn(
            "absolute flex items-center justify-center transition-all duration-150",
            isZoomRoot
              ? "bg-surface/40 cursor-zoom-out"
              : canZoomIn
                ? "bg-surface/25 cursor-zoom-in hover:bg-accent/10"
                : "bg-surface/25 cursor-pointer hover:bg-surface/40",
            isGroupHovered && "bg-accent/[0.08]",
          )}
        >
          {tile.node.id === ROOT_NODE.id && isZoomRoot ? (
            <span className="text-[10px] tracking-[0.3em] font-mono text-txt-dim pointer-events-none">ODA</span>
          ) : tile.depth <= LABEL_MAX_DEPTH ? (
            <Label node={tile.node} depth={tile.depth} lang={lang} isCenter />
          ) : null}
        </button>
      );
    }

    // ── Leaf tile ──────────────────────────────────────────────────────────
    const Icon = typeIconOf(tile.node);
    const isSelected = tile.node.id === selectedId;
    const isAncestor = !isSelected && ancestorIds.has(tile.node.id);
    const hasChildren = (tile.node.children?.length ?? 0) > 0;

    return (
      <button
        type="button"
        title={tile.node.title[lang]}
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(tile.node);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (hasChildren) onZoom(tile.node);
        }}
        onMouseEnter={() => { onHoverGroup(tile.groupId); onHover(tile.node); }}
        onMouseLeave={() => { onHoverGroup(null); onHover(null); }}
        onFocus={() => { onHoverGroup(tile.groupId); onHover(tile.node); }}
        onBlur={() => { onHoverGroup(null); onHover(null); }}
        style={style}
        className={cn(
          "absolute overflow-hidden transition-all duration-150 group",
          tintFor(tile.node, tile.category),
          isGroupHovered && !isSelected && "brightness-110 ring-1 ring-inset ring-hud/15",
          !isSelected && !isGroupHovered && "hover:ring-1 hover:ring-inset hover:ring-accent/50",
          isSelected &&
            "ring-2 ring-inset ring-accent shadow-[0_0_14px_rgb(var(--color-accent)/0.3)] z-10",
          isAncestor && "ring-1 ring-inset ring-accent/40",
          hasChildren && "cursor-zoom-in",
        )}
      >
        {tile.depth <= LABEL_MAX_DEPTH && (
          <>
            <Icon
              className={cn(
                "absolute top-[2px] left-[2px] w-2 h-2 stroke-[1.5px] opacity-50 pointer-events-none",
                isSelected ? "text-accent" : "text-txt-muted",
              )}
            />
            <div className="absolute inset-0 flex items-center justify-center p-[2px]">
              <Label node={tile.node} depth={tile.depth} lang={lang} />
            </div>
          </>
        )}
      </button>
    );
  },
);

// ---------------------------------------------------------------------------
//  Root
// ---------------------------------------------------------------------------

export const LotusMap: React.FC = () => {
  const { navigate, lang, currentNode, path } = useNavigation();
  const ancestorIds = React.useMemo(
    () => new Set(path.map((n) => n.id)),
    [path],
  );
  const [hovered, setHovered] = React.useState<LotusNode | null>(null);
  const [hoveredGroupId, setHoveredGroupId] = React.useState<string | null>(null);

  // Zoom state: zoomRoot is the node whose subtree we're viewing.
  // zoomStack holds ancestors so we can zoom back out.
  const [zoomRoot, setZoomRoot] = React.useState<LotusNode>(ROOT_NODE);
  const [zoomStack, setZoomStack] = React.useState<LotusNode[]>([]);

  const { tiles, dividers } = React.useMemo(
    () => buildContentFractal(zoomRoot, MAX_DEPTH),
    [zoomRoot],
  );

  const zoomIn = React.useCallback((node: LotusNode) => {
    if (!(node.children?.length)) return;
    setZoomStack(prev => [...prev, zoomRoot]);
    setZoomRoot(node);
  }, [zoomRoot]);

  const zoomOut = React.useCallback(() => {
    setZoomStack(prev => {
      if (prev.length === 0) return prev;
      setZoomRoot(prev[prev.length - 1]);
      return prev.slice(0, -1);
    });
  }, []);

  const handleZoom = React.useCallback((node: LotusNode) => {
    if (node.id === zoomRoot.id) zoomOut();
    else zoomIn(node);
  }, [zoomRoot, zoomIn, zoomOut]);

  // Escape → zoom out
  React.useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") zoomOut(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [zoomOut]);

  // Fit a square into the available space.
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [side, setSide] = React.useState(0);
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setSide(Math.max(0, Math.floor(Math.min(r.width, r.height))));
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hoverLabel = hovered ? hovered.title[lang] : currentNode.title[lang];

  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center p-2 gap-1">

      {/* Zoom breadcrumb — only visible when zoomed in */}
      {zoomStack.length > 0 && (
        <div className="shrink-0 flex items-center gap-1 w-full px-1 overflow-x-auto">
          {zoomStack.map((n, i) => (
            <React.Fragment key={n.id}>
              <button
                type="button"
                onClick={() => {
                  setZoomRoot(n);
                  setZoomStack(prev => prev.slice(0, i));
                }}
                className="shrink-0 text-[9px] font-mono text-txt-dim hover:text-accent transition-colors truncate max-w-[80px]"
              >
                {n.shortTitle?.[lang] || n.title[lang]}
              </button>
              <span className="shrink-0 text-[9px] font-mono text-border/60">›</span>
            </React.Fragment>
          ))}
          <span className="shrink-0 text-[9px] font-mono text-accent truncate max-w-[80px]">
            {zoomRoot.shortTitle?.[lang] || zoomRoot.title[lang]}
          </span>
          <button
            type="button"
            onClick={zoomOut}
            className="ml-auto shrink-0 text-[9px] font-mono text-txt-dim hover:text-accent transition-colors px-1"
            title="Zoom out (Esc)"
          >
            ↩
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative flex-1 w-full min-h-0 flex items-center justify-center"
      >
        {side > 0 && (
          <div
            className="relative bg-canvas"
            style={{ width: side, height: side }}
          >
            {tiles.map((t) => (
              <FractalTile
                key={`${t.node.id}:${t.depth}:${t.isCenter ? "c" : "l"}:${t.x},${t.y}`}
                tile={t}
                side={side}
                lang={lang}
                selectedId={currentNode.id}
                ancestorIds={ancestorIds}
                hoveredGroupId={hoveredGroupId}
                zoomRootId={zoomRoot.id}
                onNavigate={navigate}
                onHover={setHovered}
                onHoverGroup={setHoveredGroupId}
                onZoom={handleZoom}
              />
            ))}

            {/* SVG dividers + outer frame in pixel coordinates */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={side}
              height={side}
              viewBox={`0 0 ${side} ${side}`}
              shapeRendering="crispEdges"
            >
              <g stroke="rgb(var(--color-border) / 0.55)" strokeLinecap="square" fill="none">
                {dividers.map((d, i) => (
                  <line
                    key={i}
                    x1={Math.round(d.x1 * side)}
                    y1={Math.round(d.y1 * side)}
                    x2={Math.round(d.x2 * side)}
                    y2={Math.round(d.y2 * side)}
                    strokeWidth={strokeAt(d.depth)}
                  />
                ))}
              </g>
              <rect
                x={FRAME_STROKE / 2}
                y={FRAME_STROKE / 2}
                width={side - FRAME_STROKE}
                height={side - FRAME_STROKE}
                fill="none"
                stroke="rgb(var(--color-border) / 0.9)"
                strokeWidth={FRAME_STROKE}
              />
            </svg>
          </div>
        )}
      </div>

      {/* Hover info strip */}
      <div
        className={cn(
          "shrink-0 w-full max-w-full text-center font-mono text-[10px] uppercase tracking-widest",
          "px-2 py-0.5 truncate transition-colors duration-200",
          hovered ? "text-accent" : "text-txt-dim",
        )}
        aria-live="polite"
      >
        {hoverLabel}
      </div>
    </div>
  );
};
