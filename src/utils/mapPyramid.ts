import { LOTUS_GRID_LIMIT } from "../constants";
import { LotusNode } from "../types";

export type MapCategory = "art" | "education" | "tech" | "none";
export type PyramidLevel = 0 | 1 | 2 | 3;
export type CellDisplayMode = "full" | "micro" | "density" | "aggregate";

export const CATEGORY_BY_ID: Record<string, MapCategory> = {
  "works-art": "art",
  "works-education": "education",
  "works-tech": "tech",
};

export interface AtomBudget {
  usableSizePx: number;
  minAtomPx: number;
  atomPxL1: number;
  atomPxL2: number;
  atomPxL3: number;
  canShowL2: boolean;
  canShowL3: boolean;
}

export type MapViewNode =
  | {
      kind: "node";
      node: LotusNode;
      level: PyramidLevel;
      category: MapCategory;
      displayMode: CellDisplayMode;
      children?: MapViewNode[];
      aggregateCount?: number;
      aggregateDepth?: number;
    }
  | {
      kind: "aggregate";
      node: LotusNode;
      level: PyramidLevel;
      category: MapCategory;
      count: number;
      depthBadge: string;
    };

export interface LotusSlotGrid<T> {
  slots: (T | null)[];
  size: 3;
  centerIdx: 4;
}

const allChildren = (node: LotusNode): LotusNode[] => node.children || [];

export function hasMediaSignals(node: LotusNode): boolean {
  if (node.type === "media" || node.mediaUrl) return true;
  const en = node.description?.en ?? "";
  const ru = node.description?.ru ?? "";
  return en.includes("![[") || ru.includes("![[");
}

export function needsDensityBranch(node: LotusNode): boolean {
  if (hasMediaSignals(node)) return true;
  return allChildren(node).some((child) => allChildren(child).length > 0);
}

export function isTerminalAtL2(node: LotusNode): boolean {
  if (needsDensityBranch(node)) return false;
  const children = allChildren(node);
  if (children.length === 0) return true;
  return children.every((child) => allChildren(child).length === 0 && !hasMediaSignals(child));
}

export function getCellMode(node: LotusNode, level: PyramidLevel): CellDisplayMode {
  if (level <= 1) return "full";
  if (level === 2) return isTerminalAtL2(node) ? "micro" : "full";
  return "density";
}

export function computeAtomBudget(usableSizePx: number, minAtomPx: number): AtomBudget {
  const atomPxL1 = Math.max(1, Math.floor(usableSizePx / 9));
  const atomPxL2 = Math.max(1, Math.floor(usableSizePx / 27));
  const atomPxL3 = Math.max(1, Math.floor(usableSizePx / 81));
  return {
    usableSizePx,
    minAtomPx,
    atomPxL1,
    atomPxL2,
    atomPxL3,
    canShowL2: atomPxL2 >= minAtomPx,
    canShowL3: atomPxL3 >= minAtomPx,
  };
}

export function chooseAtomicSide(usableSizePx: number, minAtomPx: number): 9 | 27 | 81 {
  if (Math.floor(usableSizePx / 81) >= minAtomPx) return 81;
  if (Math.floor(usableSizePx / 27) >= minAtomPx) return 27;
  return 9;
}

export function countDescendants(node: LotusNode): number {
  const children = allChildren(node);
  if (children.length === 0) return 0;
  return children.reduce((sum, child) => sum + 1 + countDescendants(child), 0);
}

function maxDepthFrom(node: LotusNode): number {
  const children = allChildren(node);
  if (children.length === 0) return 0;
  return 1 + Math.max(...children.map(maxDepthFrom));
}

function toAggregate(node: LotusNode, level: PyramidLevel, category: MapCategory): MapViewNode {
  const count = Math.max(1, countDescendants(node));
  const maxDepth = level + maxDepthFrom(node);
  return {
    kind: "aggregate",
    node,
    level,
    category,
    count,
    depthBadge: `d${maxDepth}+`,
  };
}

function subtreeNeedsDeepNest(node: LotusNode): boolean {
  return allChildren(node).some((c) => allChildren(c).length > 0 || needsDensityBranch(c));
}

function buildPyramidNode(
  node: LotusNode,
  level: PyramidLevel,
  atomBudget: AtomBudget,
  inheritedCategory: MapCategory,
): MapViewNode {
  const category = CATEGORY_BY_ID[node.id] ?? inheritedCategory;

  if (level > 3) return toAggregate(node, level, category);

  const children = allChildren(node).slice(0, LOTUS_GRID_LIMIT);
  const displayMode = getCellMode(node, level);

  if (level === 3) {
    if (needsDensityBranch(node)) {
      return toAggregate(node, level, category);
    }
    return { kind: "node", node, level, category, displayMode: "density" };
  }

  if (children.length === 0) {
    return { kind: "node", node, level, category, displayMode };
  }

  if (level === 1 && !atomBudget.canShowL2 && subtreeNeedsDeepNest(node)) {
    return {
      kind: "node",
      node,
      level,
      category,
      displayMode,
      aggregateCount: countDescendants(node),
      aggregateDepth: level + maxDepthFrom(node),
    };
  }

  if (level === 2 && needsDensityBranch(node) && !atomBudget.canShowL3) {
    return {
      kind: "node",
      node,
      level,
      category,
      displayMode: isTerminalAtL2(node) ? "micro" : "full",
      aggregateCount: countDescendants(node),
      aggregateDepth: level + maxDepthFrom(node),
    };
  }

  const nextLevel = (level + 1) as PyramidLevel;
  const builtChildren = children.map((child) => {
    if (nextLevel === 3 && needsDensityBranch(child)) {
      return toAggregate(child, 3, category);
    }
    if (nextLevel === 3) {
      return buildPyramidNode(child, 3, atomBudget, category);
    }
    if (nextLevel === 2 && !atomBudget.canShowL2 && subtreeNeedsDeepNest(child)) {
      return toAggregate(child, 2, category);
    }
    return buildPyramidNode(child, nextLevel, atomBudget, category);
  });

  return {
    kind: "node",
    node,
    level,
    category,
    displayMode,
    children: builtChildren,
  };
}

/** Build view trees for zoom root's direct children (pyramid level 0). */
export function buildPyramidChildren(
  zoomRoot: LotusNode,
  atomBudget: AtomBudget,
  inheritedCategory: MapCategory,
): MapViewNode[] {
  return allChildren(zoomRoot)
    .slice(0, LOTUS_GRID_LIMIT)
    .map((child) => buildPyramidNode(child, 0, atomBudget, inheritedCategory));
}

export function createLotusSlots<T>(items: T[], center: T): LotusSlotGrid<T> {
  const slots: (T | null)[] = Array(9).fill(null);
  slots[4] = center;
  let ci = 0;
  for (let i = 0; i < 9; i++) {
    if (i === 4) continue;
    if (ci < items.length) slots[i] = items[ci++];
  }
  return { slots, size: 3, centerIdx: 4 };
}

export function countCollapsedInTree(nodes: MapViewNode[]): number {
  let n = 0;
  const walk = (item: MapViewNode) => {
    if (item.kind === "aggregate") {
      n += 1;
      return;
    }
    if (typeof item.aggregateCount === "number" && item.aggregateCount > 0) n += 1;
    item.children?.forEach(walk);
  };
  nodes.forEach(walk);
  return n;
}

export function compactLabelFor(node: LotusNode, lang: "en" | "ru", singleChar: boolean): string {
  const source = (node.shortTitle?.[lang] || node.title[lang] || node.id).trim();
  if (singleChar) {
    const ch = source.replace(/\s+/g, "")[0] || "?";
    return ch.toUpperCase();
  }
  const firstToken = source.split(/\s+/)[0] || source;
  return firstToken.slice(0, 6).toUpperCase();
}
