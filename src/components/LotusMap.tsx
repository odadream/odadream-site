import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Layers, FileText, Zap, Film, AudioLines, Image as ImageIcon } from "lucide-react";

import { LotusNode } from "../types";
import { ROOT_NODE } from "../constants";
import { useNavigation } from "../context/NavigationContext";

const cn = (...inputs: (string | undefined | null | false)[]) =>
  twMerge(clsx(inputs));

type Category = "art" | "education" | "tech" | "none";

const CATEGORY_BY_ID: Record<string, Category> = {
  "works-art": "art",
  "works-education": "education",
  "works-tech": "tech",
};

// Two intensity steps so concept/rnd cells read as "less mature" automatically.
const TINT: Record<Category, { strong: string; soft: string }> = {
  art:       { strong: "bg-amber-500/[0.10]", soft: "bg-amber-500/[0.04]" },
  education: { strong: "bg-cyan-500/[0.10]",  soft: "bg-cyan-500/[0.04]" },
  tech:      { strong: "bg-sky-500/[0.10]",   soft: "bg-sky-500/[0.04]" },
  none:      { strong: "bg-surface",          soft: "bg-surface/60" },
};

const RING: Record<Category, string> = {
  art:       "ring-amber-500/30",
  education: "ring-cyan-500/30",
  tech:      "ring-sky-500/30",
  none:      "ring-border/40",
};

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
  if (depth <= 0) return "text-[11px] leading-tight";
  if (depth === 1) return "text-[9px] leading-tight";
  if (depth === 2) return "text-[8px] leading-tight";
  return "text-[7px] leading-none";
}

const allChildren = (node: LotusNode) => node.children || [];

// Mature works get the strong tint; "concept" / "rnd" / undefined-with-no-children get the soft tint.
function tintFor(node: LotusNode, category: Category): string {
  const mature = node.status === "production" || node.status === "patent";
  return mature ? TINT[category].strong : TINT[category].soft;
}

// ---------------------------------------------------------------------------
//  Cell
// ---------------------------------------------------------------------------

interface CellProps {
  node: LotusNode;
  category: Category;
  depth: number;
  lang: "en" | "ru";
  selectedId: string;
  ancestorIds: Set<string>;
  onNavigate: (n: LotusNode) => void;
  onHover: (n: LotusNode | null) => void;
}

const Label: React.FC<{ node: LotusNode; depth: number; lang: "en" | "ru"; isCenter?: boolean }> = ({
  node,
  depth,
  lang,
  isCenter,
}) => {
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

const MapCell: React.FC<CellProps> = React.memo(
  ({ node, category, depth, lang, selectedId, ancestorIds, onNavigate, onHover }) => {
    const Icon = typeIconOf(node);
    const isSelected = node.id === selectedId;
    const isAncestor = !isSelected && ancestorIds.has(node.id);
    const children = allChildren(node);
    const hasChildren = children.length > 0;

    return (
      <button
        type="button"
        title={node.title[lang]}
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(node);
        }}
        onMouseEnter={() => onHover(node)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(node)}
        onBlur={() => onHover(null)}
        className={cn(
          "relative w-full h-full overflow-hidden ring-1 transition-all duration-200 group",
          tintFor(node, category),
          RING[category],
          isSelected &&
            "ring-2 ring-accent shadow-[0_0_0_1px_rgb(var(--color-accent)/0.6),0_0_18px_rgb(var(--color-accent)/0.35)] z-10",
          isAncestor && "ring-accent/40",
          !isSelected && "hover:ring-accent/60 hover:brightness-110",
        )}
      >
        <Icon
          className={cn(
            "absolute top-[2px] left-[2px] w-2 h-2 stroke-[1.5px] opacity-50 pointer-events-none",
            isSelected ? "text-accent" : "text-txt-muted",
          )}
        />

        {hasChildren ? (
          <NestedGrid
            node={node}
            category={category}
            depth={depth}
            lang={lang}
            selectedId={selectedId}
            ancestorIds={ancestorIds}
            onNavigate={onNavigate}
            onHover={onHover}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-[2px]">
            <Label node={node} depth={depth} lang={lang} />
          </div>
        )}
      </button>
    );
  },
);

const NestedGrid: React.FC<CellProps> = ({
  node,
  category,
  depth,
  lang,
  selectedId,
  ancestorIds,
  onNavigate,
  onHover,
}) => {
  const children = allChildren(node);
  const size = Math.max(3, Math.ceil(Math.sqrt(children.length + 1)));
  const centerIdx = Math.floor((size * size) / 2);

  const slots: (LotusNode | null)[] = new Array(size * size).fill(null);
  let ci = 0;
  for (let i = 0; i < slots.length; i++) {
    if (i === centerIdx) continue;
    if (ci < children.length) slots[i] = children[ci++];
  }

  return (
    <div
      className="absolute inset-0 grid gap-px p-px pointer-events-none"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
      }}
    >
      {slots.map((child, i) => {
        if (i === centerIdx) {
          return (
            <div key="center" className="flex items-center justify-center bg-transparent">
              <Label node={node} depth={depth} lang={lang} isCenter />
            </div>
          );
        }
        if (!child) return <div key={i} className="bg-transparent" />;
        const childCat = CATEGORY_BY_ID[child.id] ?? category;
        return (
          <div key={child.id} className="relative pointer-events-auto">
            <MapCell
              node={child}
              category={childCat}
              depth={depth + 1}
              lang={lang}
              selectedId={selectedId}
              ancestorIds={ancestorIds}
              onNavigate={onNavigate}
              onHover={onHover}
            />
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
//  Root
// ---------------------------------------------------------------------------

export const LotusMap: React.FC = () => {
  // Consume navigation context ONCE here. Children receive primitives via props,
  // so changing currentNode no longer cascades a full re-render of the tree.
  const { navigate, lang, currentNode, path } = useNavigation();
  const ancestorIds = React.useMemo(() => new Set(path.map((n) => n.id)), [path]);
  const [hovered, setHovered] = React.useState<LotusNode | null>(null);

  const topChildren = allChildren(ROOT_NODE);
  const size = Math.max(3, Math.ceil(Math.sqrt(topChildren.length + 1)));
  const centerIdx = Math.floor((size * size) / 2);

  const slots: (LotusNode | null)[] = new Array(size * size).fill(null);
  let ci = 0;
  for (let i = 0; i < slots.length; i++) {
    if (i === centerIdx) continue;
    if (ci < topChildren.length) slots[i] = topChildren[ci++];
  }

  const hoverLabel = hovered ? hovered.title[lang] : currentNode.title[lang];

  return (
    <div className="w-full h-full flex flex-col items-center p-2 gap-1.5">
      <div
        className="relative aspect-square w-full max-w-full grid gap-[2px] bg-canvas"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
        }}
      >
        {slots.map((child, i) => {
          if (i === centerIdx) {
            return (
              <div
                key="root"
                className="flex items-center justify-center bg-surface ring-1 ring-border/40"
                title={ROOT_NODE.title[lang]}
              >
                <span className="text-[10px] tracking-[0.3em] font-mono text-txt-dim">ODA</span>
              </div>
            );
          }
          if (!child) return <div key={i} className="bg-surface/40 ring-1 ring-border/20" />;
          const cat = CATEGORY_BY_ID[child.id] ?? "none";
          return (
            <div key={child.id} className="relative">
              <MapCell
                node={child}
                category={cat}
                depth={0}
                lang={lang}
                selectedId={currentNode.id}
                ancestorIds={ancestorIds}
                onNavigate={navigate}
                onHover={setHovered}
              />
            </div>
          );
        })}
      </div>

      {/* Hover info bar — shows the label of the currently hovered/focused cell.
          On touch devices where native title tooltips don't appear, tap-to-focus
          updates this strip. Falls back to the current node title when idle. */}
      <div
        className={cn(
          "shrink-0 w-full max-w-full text-center font-mono text-[10px] uppercase tracking-widest",
          "px-2 py-1 truncate transition-colors duration-200",
          hovered ? "text-accent" : "text-txt-dim",
        )}
        aria-live="polite"
      >
        {hoverLabel}
      </div>
    </div>
  );
};
