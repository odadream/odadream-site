import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Layers, FileText, Zap, Film, AudioLines, Image as ImageIcon } from "lucide-react";

import { LotusNode } from "../types";
import { MAP_ATOMIC_DEBUG, ROOT_NODE } from "../constants";
import { useNavigation } from "../context/NavigationContext";
import { findPathToNode } from "../utils/nodeHelpers";
import { getDefaultNodeImage } from "../utils/mediaHelpers";
import {
  AtomBudget,
  CATEGORY_BY_ID,
  MapCategory,
  MapViewNode,
  PyramidLevel,
  buildPyramidChildren,
  chooseAtomicSide,
  compactLabelFor,
  computeAtomBudget,
  countCollapsedInTree,
  createLotusSlots,
} from "../utils/mapPyramid";

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

const SHOW_ATOMIC_DEBUG = import.meta.env.DEV && MAP_ATOMIC_DEBUG;

const TINT: Record<MapCategory, { strong: string; soft: string }> = {
  art: { strong: "bg-amber-500/[0.10]", soft: "bg-amber-500/[0.04]" },
  education: { strong: "bg-cyan-500/[0.10]", soft: "bg-cyan-500/[0.04]" },
  tech: { strong: "bg-sky-500/[0.10]", soft: "bg-sky-500/[0.04]" },
  none: { strong: "bg-surface", soft: "bg-surface/70" },
};

const allChildren = (node: LotusNode): LotusNode[] => node.children || [];

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

function tintFor(node: LotusNode, category: MapCategory): string {
  const mature = node.status === "production" || node.status === "patent";
  return mature ? TINT[category].strong : TINT[category].soft;
}

function fontForLevel(level: PyramidLevel): string {
  if (level <= 0) return "text-[11px] leading-tight";
  if (level === 1) return "text-[9px] leading-tight";
  if (level === 2) return "text-[8px] leading-tight";
  return "text-[7px] leading-none";
}

function useMapCellActions(
  node: LotusNode,
  canZoom: boolean,
  onNavigate: (node: LotusNode) => void,
  onToggleZoom: (node: LotusNode) => void,
) {
  const clickTimer = React.useRef<number | null>(null);
  const lastTouchTs = React.useRef(0);

  React.useEffect(() => {
    return () => {
      if (clickTimer.current !== null) window.clearTimeout(clickTimer.current);
    };
  }, []);

  const handleSingleNavigate = () => {
    if (clickTimer.current !== null) window.clearTimeout(clickTimer.current);
    clickTimer.current = window.setTimeout(() => {
      onNavigate(node);
      clickTimer.current = null;
    }, 220);
  };

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canZoom && e.detail === 2) {
      if (clickTimer.current !== null) window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
      onToggleZoom(node);
      return;
    }
    handleSingleNavigate();
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const isDoubleTap = now - lastTouchTs.current < 280;
    lastTouchTs.current = now;
    if (canZoom && isDoubleTap) {
      if (clickTimer.current !== null) window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
      onToggleZoom(node);
      return;
    }
    handleSingleNavigate();
  };

  return { onClick, onTouchEnd };
}

function cellHighlightClass(isSelected: boolean, isZoomRoot: boolean, isAncestor: boolean): string {
  return cn(
    isSelected || isZoomRoot
      ? "shadow-[inset_0_0_0_1px_rgb(var(--color-accent)/0.7),0_0_14px_rgb(var(--color-accent)/0.35)] z-10"
      : undefined,
    isAncestor && "shadow-[inset_0_0_0_1px_rgb(var(--color-accent)/0.4)]",
  );
}

interface ViewCellProps {
  item: MapViewNode;
  lang: "en" | "ru";
  selectedId: string;
  zoomRootId: string;
  ancestorIds: Set<string>;
  atomBudget: AtomBudget;
  onNavigate: (node: LotusNode) => void;
  onToggleZoom: (node: LotusNode) => void;
  onHover: (label: string | null) => void;
}

const NestedLotus: React.FC<{
  parentNode: LotusNode;
  parentItem: Extract<MapViewNode, { kind: "node" }>;
  slots: (MapViewNode | null)[];
  cellProps: Omit<ViewCellProps, "item">;
}> = ({ parentNode, parentItem, slots, cellProps }) => (
  <div
    className="absolute inset-0 grid gap-[1px] p-[1px] pointer-events-none bg-border/35"
    style={{
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gridTemplateRows: "repeat(3, minmax(0, 1fr))",
    }}
  >
    {slots.map((slot, idx) => {
      if (!slot) return <div key={`empty-${idx}`} className="bg-surface/70" />;
      if (slot.kind === "aggregate") {
        return (
          <div key={`agg-${slot.node.id}-${idx}`} className="relative pointer-events-auto min-h-0 min-w-0">
            <AggregateCell item={slot} {...cellProps} />
          </div>
        );
      }
      if (slot.node.id === parentNode.id) {
        const l3Nest = parentItem.children?.every((c) => c.kind === "node" && c.displayMode === "density");
        return (
          <div
            key={`center-${idx}`}
            className={cn(
              "flex items-center justify-center min-h-0 min-w-0",
              l3Nest ? tintFor(parentNode, parentItem.category) : "bg-surface/90",
            )}
          >
            {l3Nest && parentNode.type === "hub" ? (
              <span className="w-[3px] h-[3px] rounded-full bg-overlay/80 pointer-events-none" />
            ) : (
              <NodeLabel node={parentNode} level={parentItem.level} lang={cellProps.lang} isCenter singleChar={false} />
            )}
          </div>
        );
      }
      return (
        <div key={`${slot.node.id}-${idx}`} className="relative pointer-events-auto min-h-0 min-w-0">
          <MapCellRouter item={slot} {...cellProps} />
        </div>
      );
    })}
  </div>
);

const NodeLabel: React.FC<{
  node: LotusNode;
  level: PyramidLevel;
  lang: "en" | "ru";
  isCenter?: boolean;
  singleChar?: boolean;
}> = ({ node, level, lang, isCenter, singleChar = false }) => {
  const useCompact = level >= 2 || singleChar;
  const label = useCompact
    ? compactLabelFor(node, lang, singleChar || level >= 3)
    : node.shortTitle?.[lang] || node.title[lang] || node.id;
  return (
    <span
      className={cn(
        "font-mono uppercase text-center pointer-events-none mix-blend-screen",
        useCompact ? "truncate whitespace-nowrap max-w-full px-[2px] tracking-tight" : "line-clamp-2 break-words px-[2px] tracking-tight",
        fontForLevel(level),
        isCenter ? "text-txt-muted" : "text-txt-muted/90",
      )}
    >
      {label}
    </span>
  );
};

const AggregateCell: React.FC<ViewCellProps & { item: Extract<MapViewNode, { kind: "aggregate" }> }> = ({
  item,
  lang,
  selectedId,
  zoomRootId,
  ancestorIds,
  onNavigate,
  onToggleZoom,
  onHover,
}) => {
  const node = item.node;
  const isSelected = node.id === selectedId;
  const isZoomRoot = node.id === zoomRootId;
  const isAncestor = !isSelected && ancestorIds.has(node.id);
  const hasChildren = allChildren(node).length > 0;
  const canZoom = node.type === "hub" && hasChildren;
  const { onClick, onTouchEnd } = useMapCellActions(node, canZoom, onNavigate, onToggleZoom);

  return (
    <button
      type="button"
      title={node.title[lang]}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => onHover(`${node.title[lang]} · +${item.count} · ${item.depthBadge}`)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(`${node.title[lang]} · +${item.count} · ${item.depthBadge}`)}
      onBlur={() => onHover(null)}
      className={cn(
        "relative w-full h-full bg-surface/92 transition-all duration-150",
        "flex items-center justify-center overflow-hidden",
        cellHighlightClass(isSelected, isZoomRoot, isAncestor),
      )}
    >
      <div className="absolute top-[3px] left-[4px] text-[7px] font-mono uppercase text-txt-dim">{item.depthBadge}</div>
      <div className="absolute top-[3px] right-[4px] text-[8px] font-mono text-txt-muted">+{item.count}</div>
      <span className="w-[7px] h-[7px] border border-overlay/75" />
    </button>
  );
};

const DensityCell: React.FC<ViewCellProps & { item: Extract<MapViewNode, { kind: "node" }> }> = ({
  item,
  lang,
  selectedId,
  zoomRootId,
  ancestorIds,
  onNavigate,
  onToggleZoom,
  onHover,
}) => {
  const node = item.node;
  const isSelected = node.id === selectedId;
  const isZoomRoot = node.id === zoomRootId;
  const isAncestor = !isSelected && ancestorIds.has(node.id);
  const canZoom = node.type === "hub" && allChildren(node).length > 0;
  const { onClick, onTouchEnd } = useMapCellActions(node, canZoom, onNavigate, onToggleZoom);

  return (
    <button
      type="button"
      title={node.title[lang]}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => onHover(node.title[lang])}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.title[lang])}
      onBlur={() => onHover(null)}
      className={cn(
        "relative w-full h-full overflow-hidden transition-all duration-150",
        tintFor(node, item.category),
        cellHighlightClass(isSelected, isZoomRoot, isAncestor),
        !isSelected && !isZoomRoot && "hover:brightness-110",
      )}
    >
    </button>
  );
};

const MicroCell: React.FC<ViewCellProps & { item: Extract<MapViewNode, { kind: "node" }> }> = ({
  item,
  lang,
  selectedId,
  zoomRootId,
  ancestorIds,
  atomBudget,
  onNavigate,
  onToggleZoom,
  onHover,
}) => {
  const node = item.node;
  const isSelected = node.id === selectedId;
  const isZoomRoot = node.id === zoomRootId;
  const isAncestor = !isSelected && ancestorIds.has(node.id);
  const hasChildren = allChildren(node).length > 0;
  const canZoom = node.type === "hub" && hasChildren;
  const bgImage = node.imageUrl || getDefaultNodeImage(node.id);
  const { onClick, onTouchEnd } = useMapCellActions(node, canZoom, onNavigate, onToggleZoom);
  const singleChar = atomBudget.atomPxL2 < 9;
  const children = item.children || [];
  const nested =
    children.length > 0
      ? createLotusSlots(children, item)
      : null;

  return (
    <button
      type="button"
      title={node.title[lang]}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => onHover(node.title[lang])}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.title[lang])}
      onBlur={() => onHover(null)}
      className={cn(
        "relative w-full h-full overflow-hidden transition-all duration-200 group",
        tintFor(node, item.category),
        cellHighlightClass(isSelected, isZoomRoot, isAncestor),
        !isSelected && !isZoomRoot && "hover:brightness-110",
      )}
    >
      <div
        className="absolute inset-0 bg-center bg-cover opacity-55 transition-opacity duration-300 group-hover:opacity-75"
        style={{ backgroundImage: `url("${bgImage}")` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-canvas/55 pointer-events-none" aria-hidden />

      {nested ? (
        <NestedLotus
          parentNode={node}
          parentItem={item}
          slots={nested.slots}
          cellProps={{
            lang,
            selectedId,
            zoomRootId,
            ancestorIds,
            atomBudget,
            onNavigate,
            onToggleZoom,
            onHover,
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-[1px] z-[2]">
          <NodeLabel node={node} level={item.level} lang={lang} singleChar={singleChar} />
        </div>
      )}

      {typeof item.aggregateCount === "number" && item.aggregateCount > 0 && (
        <div className="absolute right-[3px] bottom-[1px] text-[7px] font-mono text-txt-dim z-[3]">
          +{item.aggregateCount}
        </div>
      )}
    </button>
  );
};

const FullCell: React.FC<ViewCellProps & { item: Extract<MapViewNode, { kind: "node" }> }> = ({
  item,
  lang,
  selectedId,
  zoomRootId,
  ancestorIds,
  atomBudget,
  onNavigate,
  onToggleZoom,
  onHover,
}) => {
  const node = item.node;
  const isSelected = node.id === selectedId;
  const isZoomRoot = node.id === zoomRootId;
  const isAncestor = !isSelected && ancestorIds.has(node.id);
  const hasChildren = allChildren(node).length > 0;
  const canZoom = node.type === "hub" && hasChildren;
  const bgImage = node.imageUrl || getDefaultNodeImage(node.id);
  const Icon = typeIconOf(node);
  const { onClick, onTouchEnd } = useMapCellActions(node, canZoom, onNavigate, onToggleZoom);
  const children = item.children || [];
  const nested = children.length > 0 ? createLotusSlots(children, item) : null;

  return (
    <button
      type="button"
      title={node.title[lang]}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => onHover(node.title[lang])}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.title[lang])}
      onBlur={() => onHover(null)}
      className={cn(
        "relative w-full h-full overflow-hidden transition-all duration-200 group",
        tintFor(node, item.category),
        cellHighlightClass(isSelected, isZoomRoot, isAncestor),
        !isSelected && !isZoomRoot && "hover:brightness-110",
      )}
    >
      <div
        className="absolute inset-0 bg-center bg-cover opacity-45 transition-opacity duration-300 group-hover:opacity-65"
        style={{ backgroundImage: `url("${bgImage}")` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-canvas/50 pointer-events-none" aria-hidden />

      <Icon
        className={cn(
          "absolute top-[2px] left-[2px] w-2 h-2 stroke-[1.5px] opacity-70 pointer-events-none z-[2]",
          isSelected || isZoomRoot ? "text-accent" : "text-txt-muted",
        )}
      />

      {nested ? (
        <NestedLotus
          parentNode={node}
          parentItem={item}
          slots={nested.slots}
          cellProps={{
            lang,
            selectedId,
            zoomRootId,
            ancestorIds,
            atomBudget,
            onNavigate,
            onToggleZoom,
            onHover,
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-[2px] z-[2]">
          <NodeLabel node={node} level={item.level} lang={lang} />
        </div>
      )}

      {typeof item.aggregateCount === "number" && item.aggregateCount > 0 && (
        <div className="absolute right-[4px] bottom-[2px] text-[8px] font-mono text-txt-dim z-[3]">
          +{item.aggregateCount}
        </div>
      )}
    </button>
  );
};

const MapCellRouter: React.FC<ViewCellProps> = (props) => {
  const { item } = props;
  if (item.kind === "aggregate") return <AggregateCell {...props} item={item} />;
  if (item.displayMode === "density") return <DensityCell {...props} item={item} />;
  if (item.displayMode === "micro") return <MicroCell {...props} item={item} />;
  return <FullCell {...props} item={item} />;
};

interface AtomicGridConfig {
  side: 9 | 27 | 81;
  atomPx: number;
  usableSizePx: number;
  minAtomPx: number;
  snappedSizePx: number;
  gapPx: number;
  paddingPx: number;
}

export const LotusMap: React.FC = () => {
  const { navigate, lang, currentNode, path, nodeRegistry } = useNavigation();
  const [hoveredLabel, setHoveredLabel] = React.useState<string | null>(null);
  const [zoomRootId, setZoomRootId] = React.useState(ROOT_NODE.id);
  const [atomicOnly, setAtomicOnly] = React.useState(false);
  const [forcedSide, setForcedSide] = React.useState<9 | 27 | 81 | null>(null);
  const [showAtomicSymbols, setShowAtomicSymbols] = React.useState(false);
  const [minAtomPx, setMinAtomPx] = React.useState<number>(() => {
    if (typeof window === "undefined") return 10;
    const saved = Number(window.localStorage.getItem("oda_map_min_atom_px"));
    return [8, 10, 12, 14].includes(saved) ? saved : 10;
  });
  const [usableSizePx, setUsableSizePx] = React.useState(270);
  const [gridConfig, setGridConfig] = React.useState<AtomicGridConfig>({
    side: 27,
    atomPx: 10,
    usableSizePx: 270,
    minAtomPx: 10,
    snappedSizePx: 270,
    gapPx: 1,
    paddingPx: 1,
  });
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const ancestorIds = React.useMemo(() => new Set(path.map((n) => n.id)), [path]);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      const size = Math.max(0, Math.floor(Math.min(width, height)));
      setUsableSizePx(size);

      if (SHOW_ATOMIC_DEBUG) {
        const side = forcedSide ?? chooseAtomicSide(size, minAtomPx);
        const gapPx = 1;
        const paddingPx = 1;
        const totalGap = (side - 1) * gapPx + paddingPx * 2;
        const atomPx = Math.max(1, Math.floor((size - totalGap) / side));
        const snappedSizePx = side * atomPx + totalGap;
        setGridConfig({ side, atomPx, usableSizePx: size, minAtomPx, snappedSizePx, gapPx, paddingPx });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [minAtomPx, forcedSide]);

  const atomBudget = React.useMemo(
    () => computeAtomBudget(usableSizePx, minAtomPx),
    [usableSizePx, minAtomPx],
  );

  const zoomRoot = nodeRegistry.get(zoomRootId) ?? ROOT_NODE;
  const topCategory: MapCategory = CATEGORY_BY_ID[zoomRoot.id] ?? "none";

  const topViewChildren = React.useMemo(
    () => buildPyramidChildren(zoomRoot, atomBudget, topCategory),
    [zoomRoot, atomBudget, topCategory],
  );

  const collapsedCount = React.useMemo(() => countCollapsedInTree(topViewChildren), [topViewChildren]);

  const rootCenterItem: MapViewNode = React.useMemo(
    () => ({
      kind: "node",
      node: zoomRoot,
      level: 0,
      category: topCategory,
      displayMode: "full",
    }),
    [zoomRoot, topCategory],
  );

  const rootSlots = React.useMemo(
    () => createLotusSlots(topViewChildren, rootCenterItem),
    [topViewChildren, rootCenterItem],
  );

  React.useEffect(() => {
    const pathToZoom = findPathToNode(ROOT_NODE, zoomRootId);
    if (!pathToZoom) return;
    const inSubtree = pathToZoom.some((n) => n.id === currentNode.id);
    if (!inSubtree) {
      setZoomRootId(currentNode.id);
    }
  }, [currentNode.id, zoomRootId]);

  const toggleZoom = React.useCallback((node: LotusNode) => {
    if (node.type !== "hub" || allChildren(node).length === 0) return;
    setZoomRootId((prev) => {
      if (prev === node.id) {
        const parentPath = findPathToNode(ROOT_NODE, node.id);
        if (!parentPath || parentPath.length <= 1) return ROOT_NODE.id;
        return parentPath[parentPath.length - 2].id;
      }
      return node.id;
    });
  }, []);

  const cellProps = {
    lang,
    selectedId: currentNode.id,
    zoomRootId,
    ancestorIds,
    atomBudget,
    onNavigate: navigate,
    onToggleZoom: toggleZoom,
    onHover: setHoveredLabel,
  };

  const infoLabel = atomicOnly
    ? lang === "ru"
      ? "РЕЖИМ АТОМАРНОЙ СЕТКИ"
      : "ATOMIC GRID MODE"
    : hoveredLabel || currentNode.title[lang];

  const glyphFitOk = atomBudget.atomPxL2 >= 9;

  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center p-2 gap-1.5">
      <div ref={containerRef} className="relative w-full h-full min-h-0 flex items-center justify-center">
        <div
          className="relative grid bg-border/35"
          style={{
            width: atomicOnly && SHOW_ATOMIC_DEBUG ? `${gridConfig.snappedSizePx}px` : undefined,
            height: atomicOnly && SHOW_ATOMIC_DEBUG ? `${gridConfig.snappedSizePx}px` : undefined,
            maxWidth: "100%",
            maxHeight: "100%",
            aspectRatio: atomicOnly && SHOW_ATOMIC_DEBUG ? undefined : "1 / 1",
            gridTemplateColumns:
              atomicOnly && SHOW_ATOMIC_DEBUG
                ? `repeat(${gridConfig.side}, ${gridConfig.atomPx}px)`
                : "repeat(3, minmax(0, 1fr))",
            gridTemplateRows:
              atomicOnly && SHOW_ATOMIC_DEBUG
                ? `repeat(${gridConfig.side}, ${gridConfig.atomPx}px)`
                : "repeat(3, minmax(0, 1fr))",
            gap: atomicOnly && SHOW_ATOMIC_DEBUG ? `${gridConfig.gapPx}px` : "1px",
            padding: atomicOnly && SHOW_ATOMIC_DEBUG ? `${gridConfig.paddingPx}px` : "1px",
          }}
        >
          {atomicOnly && SHOW_ATOMIC_DEBUG
            ? Array.from({ length: gridConfig.side * gridConfig.side }, (_, idx) => {
                const col = idx % gridConfig.side;
                const row = Math.floor(idx / gridConfig.side);
                const majorLine = row % 3 === 0 || col % 3 === 0;
                return (
                  <div
                    key={`atom-${idx}`}
                    className={cn("bg-surface/85", majorLine && "bg-surface/95")}
                    title={`${row}:${col}`}
                  >
                    {showAtomicSymbols && (
                      <span
                        className="w-full h-full flex items-center justify-center font-mono leading-none text-txt-dim/85 select-none"
                        style={{ fontSize: `${Math.max(6, Math.floor(gridConfig.atomPx * 0.55))}px` }}
                      >
                        A
                      </span>
                    )}
                  </div>
                );
              })
            : rootSlots.slots.map((slot, idx) => {
                if (!slot) return <div key={`empty-${idx}`} className="bg-surface/70" />;
                if (slot.kind === "aggregate") {
                  return <AggregateCell key={`root-agg-${slot.node.id}-${idx}`} item={slot} {...cellProps} />;
                }
                if (slot.node.id === zoomRoot.id) {
                  return (
                    <div
                      key="root-center"
                      className="flex items-center justify-center bg-surface/95 min-h-0"
                      title={zoomRoot.title[lang]}
                    >
                      <span className="text-[10px] tracking-[0.3em] font-mono text-txt-dim">
                        {zoomRoot.id === ROOT_NODE.id ? "ODA" : zoomRoot.shortTitle?.[lang] || zoomRoot.title[lang]}
                      </span>
                    </div>
                  );
                }
                return <MapCellRouter key={`root-${slot.node.id}-${idx}`} item={slot} {...cellProps} />;
              })}
        </div>

        <div className="absolute top-1 left-1 text-[9px] font-mono text-txt-dim bg-canvas/70 px-1.5 py-0.5 border border-border/30">
          L0–L3 · a1:{atomBudget.atomPxL1}px · a2:{atomBudget.atomPxL2}px · a3:{atomBudget.atomPxL3}px
          {collapsedCount > 0 && ` · collapsed:${collapsedCount}`}
          {atomicOnly && SHOW_ATOMIC_DEBUG && ` · fit:${glyphFitOk ? "ok" : "warn"}`}
        </div>

        {SHOW_ATOMIC_DEBUG && (
          <>
            <button
              type="button"
              onClick={() => {
                const sequence = [8, 10, 12, 14];
                const idx = sequence.indexOf(minAtomPx);
                const next = sequence[(idx + 1) % sequence.length];
                setMinAtomPx(next);
                try {
                  window.localStorage.setItem("oda_map_min_atom_px", String(next));
                } catch {
                  // ignore
                }
              }}
              className="absolute top-1 right-1 text-[9px] font-mono text-txt-dim bg-canvas/70 px-1.5 py-0.5 border border-border/30 hover:text-accent transition-colors"
              title={lang === "ru" ? "Порог атомарной клетки" : "Atomic cell threshold"}
            >
              min:{minAtomPx}px
            </button>
            <div className="absolute right-1 top-8 flex gap-1">
              <button
                type="button"
                onClick={() => setAtomicOnly((v) => !v)}
                className={cn(
                  "text-[9px] font-mono px-1.5 py-0.5 border border-border/30 bg-canvas/70 transition-colors",
                  atomicOnly ? "text-accent" : "text-txt-dim hover:text-accent",
                )}
              >
                {atomicOnly ? "ATOM ON" : "ATOM OFF"}
              </button>
              {[9, 27, 81].map((side) => (
                <button
                  key={side}
                  type="button"
                  onClick={() => {
                    setForcedSide(side as 9 | 27 | 81);
                    setAtomicOnly(true);
                  }}
                  className={cn(
                    "text-[9px] font-mono px-1.5 py-0.5 border border-border/30 bg-canvas/70 transition-colors",
                    gridConfig.side === side ? "text-accent" : "text-txt-dim hover:text-accent",
                  )}
                >
                  {side}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowAtomicSymbols((v) => !v)}
                className={cn(
                  "text-[9px] font-mono px-1.5 py-0.5 border border-border/30 bg-canvas/70 transition-colors",
                  showAtomicSymbols ? "text-accent" : "text-txt-dim hover:text-accent",
                )}
                title={lang === "ru" ? "Тест символа в клетке" : "Symbol-fit test"}
              >
                SYM
              </button>
            </div>
          </>
        )}
      </div>

      <div className="shrink-0 w-full max-w-full flex items-center justify-between gap-2 px-1">
        <div
          className={cn(
            "text-center font-mono text-[10px] uppercase tracking-widest truncate transition-colors duration-200 flex-1",
            hoveredLabel ? "text-accent" : "text-txt-dim",
          )}
          aria-live="polite"
        >
          {infoLabel}
        </div>

        {zoomRootId !== ROOT_NODE.id && (
          <button
            type="button"
            onClick={() => {
              const pathToZoom = findPathToNode(ROOT_NODE, zoomRootId);
              if (!pathToZoom || pathToZoom.length <= 1) {
                setZoomRootId(ROOT_NODE.id);
                return;
              }
              setZoomRootId(pathToZoom[pathToZoom.length - 2].id);
            }}
            className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-surface/80 text-txt-muted hover:text-accent transition-colors"
          >
            {lang === "ru" ? "Назад" : "Zoom out"}
          </button>
        )}
      </div>
    </div>
  );
};
