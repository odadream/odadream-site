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

// Top-level category hubs whose subtree shares a tint.
const CATEGORY_BY_ID: Record<string, Category> = {
  "works-art": "art",
  "works-education": "education",
  "works-tech": "tech",
};

const TINT: Record<Category, string> = {
  art:       "bg-amber-500/[0.08]",
  education: "bg-cyan-500/[0.08]",
  tech:      "bg-sky-500/[0.08]",
  none:      "bg-surface",
};

const RING: Record<Category, string> = {
  art:       "ring-amber-500/25",
  education: "ring-cyan-500/25",
  tech:      "ring-sky-500/25",
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

// Visible-only children, kept in the same ordered slice the 3×3 grid would show.
function visibleChildren(node: LotusNode): LotusNode[] {
  const all = (node.children || []).filter((c) => c.visible !== false);
  return all.slice(0, 8);
}

interface CellProps {
  node: LotusNode;
  category: Category;
  /** Approximate side of this cell in px — used to decide whether to recurse. */
  size: number;
  isCenter?: boolean;
}

const MIN_RECURSE_SIZE = 56; // below this side length, render as a leaf

const MapCell: React.FC<CellProps> = ({ node, category, size, isCenter }) => {
  const { navigate, lang, currentNode } = useNavigation();
  const Icon = typeIconOf(node);
  const isSelected = node.id === currentNode.id;
  const children = visibleChildren(node);
  const canRecurse = !isCenter && children.length > 0 && size >= MIN_RECURSE_SIZE;

  return (
    <button
      type="button"
      title={node.title[lang]}
      onClick={(e) => {
        e.stopPropagation();
        navigate(node);
      }}
      className={cn(
        "relative w-full h-full overflow-hidden ring-1 transition-all duration-200",
        TINT[category],
        RING[category],
        isSelected
          ? "ring-2 ring-accent shadow-[0_0_0_1px_rgb(var(--color-accent)/0.6),0_0_18px_rgb(var(--color-accent)/0.35)] z-10"
          : "hover:ring-accent/60 hover:brightness-110",
      )}
    >
      {/* Corner type indicator — pictogram, not a label */}
      <Icon
        className={cn(
          "absolute top-[3px] left-[3px] w-2.5 h-2.5 stroke-[1.5px] opacity-50",
          isSelected ? "text-accent" : "text-txt-muted",
        )}
      />

      {canRecurse && (
        <Recursion node={node} category={category} size={size} />
      )}
    </button>
  );
};

const Recursion: React.FC<{ node: LotusNode; category: Category; size: number }> = ({
  node,
  category,
  size,
}) => {
  const children = visibleChildren(node);
  // 3x3 layout: center slot = self, surrounding 8 = children in order.
  const cellSize = size / 3;
  const slots: (LotusNode | null)[] = new Array(9).fill(null);
  let ci = 0;
  for (let i = 0; i < 9; i++) {
    if (i === 4) continue; // center reserved
    if (ci < children.length) {
      slots[i] = children[ci++];
    }
  }

  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-px p-px pointer-events-none">
      {slots.map((child, i) => {
        if (i === 4) {
          // Visual marker that this cell IS a hub: a subtle inner dot
          return (
            <div key="center" className="flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-accent/40" />
            </div>
          );
        }
        if (!child) {
          return <div key={i} className="bg-transparent" />;
        }
        const childCat = CATEGORY_BY_ID[child.id] ?? category;
        return (
          <div key={child.id} className="relative pointer-events-auto">
            <MapCell node={child} category={childCat} size={cellSize} />
          </div>
        );
      })}
    </div>
  );
};

export const LotusMap: React.FC = () => {
  // Root container: render ROOT_NODE's children directly in a 3×3 (no center self for the very top).
  // This makes the map fill the panel from the top-level hubs outward.
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [side, setSide] = React.useState(360);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSide(Math.min(width, height));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const topChildren = visibleChildren(ROOT_NODE);
  const cellSize = side / 3;
  const slots: (LotusNode | null)[] = new Array(9).fill(null);
  let ci = 0;
  for (let i = 0; i < 9; i++) {
    if (i === 4) continue;
    if (ci < topChildren.length) slots[i] = topChildren[ci++];
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div
        ref={containerRef}
        className="relative aspect-square w-full max-w-full max-h-full grid grid-cols-3 grid-rows-3 gap-[2px] bg-canvas"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      >
        {slots.map((child, i) => {
          if (i === 4) {
            // Center of root: ODA.dream identity glyph (subtle).
            return (
              <div
                key="root"
                className="flex items-center justify-center bg-surface ring-1 ring-border/40"
                title={ROOT_NODE.title["en"]}
              >
                <span className="text-[10px] tracking-[0.3em] font-mono text-txt-dim">
                  ODA
                </span>
              </div>
            );
          }
          if (!child) {
            return (
              <div key={i} className="bg-surface/40 ring-1 ring-border/20" />
            );
          }
          const cat = CATEGORY_BY_ID[child.id] ?? "none";
          return (
            <div key={child.id} className="relative">
              <MapCell node={child} category={cat} size={cellSize} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
