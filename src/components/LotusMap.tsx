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
  art:       "bg-amber-500/[0.10]",
  education: "bg-cyan-500/[0.10]",
  tech:      "bg-sky-500/[0.10]",
  none:      "bg-surface",
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

// All children (full map) — including those hidden from the regular grid.
function allChildren(node: LotusNode): LotusNode[] {
  return node.children || [];
}

// Font size scales down with depth so labels still appear in deep cells.
function fontForDepth(depth: number): string {
  if (depth <= 0) return "text-[11px] leading-tight";
  if (depth === 1) return "text-[9px] leading-tight";
  if (depth === 2) return "text-[8px] leading-tight";
  return "text-[7px] leading-none";
}

interface CellProps {
  node: LotusNode;
  category: Category;
  depth: number;
}

const Label: React.FC<{ node: LotusNode; depth: number; isCenter?: boolean }> = ({
  node,
  depth,
  isCenter,
}) => {
  const { lang } = useNavigation();
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

const MapCell: React.FC<CellProps> = ({ node, category, depth }) => {
  const { navigate, lang, currentNode } = useNavigation();
  const Icon = typeIconOf(node);
  const isSelected = node.id === currentNode.id;
  const children = allChildren(node);
  const hasChildren = children.length > 0;

  return (
    <button
      type="button"
      title={node.title[lang]}
      onClick={(e) => {
        e.stopPropagation();
        navigate(node);
      }}
      className={cn(
        "relative w-full h-full overflow-hidden ring-1 transition-all duration-200 group",
        TINT[category],
        RING[category],
        isSelected
          ? "ring-2 ring-accent shadow-[0_0_0_1px_rgb(var(--color-accent)/0.6),0_0_18px_rgb(var(--color-accent)/0.35)] z-10"
          : "hover:ring-accent/60 hover:brightness-110",
      )}
    >
      {/* Tiny corner type pictogram (always present) */}
      <Icon
        className={cn(
          "absolute top-[2px] left-[2px] w-2 h-2 stroke-[1.5px] opacity-50 pointer-events-none",
          isSelected ? "text-accent" : "text-txt-muted",
        )}
      />

      {hasChildren ? (
        <NestedGrid node={node} category={category} depth={depth} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-[2px]">
          <Label node={node} depth={depth} />
        </div>
      )}
    </button>
  );
};

const NestedGrid: React.FC<{ node: LotusNode; category: Category; depth: number }> = ({
  node,
  category,
  depth,
}) => {
  const children = allChildren(node);
  // Adaptive subdivision: lotus-3×3 by default; grows to 4×4 / 5×5 when children > 8.
  // +1 reserves the central slot for the parent node's own label.
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
            <div
              key="center"
              className="flex items-center justify-center bg-transparent"
            >
              <Label node={node} depth={depth} isCenter />
            </div>
          );
        }
        if (!child) {
          return <div key={i} className="bg-transparent" />;
        }
        const childCat = CATEGORY_BY_ID[child.id] ?? category;
        return (
          <div key={child.id} className="relative pointer-events-auto">
            <MapCell node={child} category={childCat} depth={depth + 1} />
          </div>
        );
      })}
    </div>
  );
};

export const LotusMap: React.FC = () => {
  // Root: render ROOT_NODE's children directly so the map fills the panel from
  // the top-level hubs outward; the center holds the ODA identity glyph.
  const topChildren = allChildren(ROOT_NODE);
  const size = Math.max(3, Math.ceil(Math.sqrt(topChildren.length + 1)));
  const centerIdx = Math.floor((size * size) / 2);

  const slots: (LotusNode | null)[] = new Array(size * size).fill(null);
  let ci = 0;
  for (let i = 0; i < slots.length; i++) {
    if (i === centerIdx) continue;
    if (ci < topChildren.length) slots[i] = topChildren[ci++];
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div
        className="relative aspect-square w-full max-w-full max-h-full grid gap-[2px] bg-canvas"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        {slots.map((child, i) => {
          if (i === centerIdx) {
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
              <MapCell node={child} category={cat} depth={0} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
