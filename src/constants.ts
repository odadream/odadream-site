import { LotusNode } from "./types";
import { getDefaultNodeImage } from "./utils/mediaHelpers";
import { buildUnifiedGraph } from "./utils/contentLoader";
import { findNode } from "./utils/nodeHelpers";

// --- CONFIGURATION ---

export const SITE_VERSION = "v1.2.0";

/**
 * Global feature flags.
 * Set to 'false' to hide the theme toggle while themes are under construction.
 */
export const ENABLE_THEME_SWITCHER = false;

// --- LOTUS GRID CONFIGURATION ---

/**
 * Sort mode for nodes displayed in the Lotus Grid.
 *
 * 'by-type':
 *   1. Static children (structural hierarchy) — sorted by frontmatter `order`
 *   2. Embedded nodes (![[nodeId]]) — sorted by frontmatter `order`
 *   3. Media files (![[url]]) — in order of appearance in text
 *   Use when you want the grid to always show structural children first.
 *
 * 'by-mention':
 *   1. Static children (structural hierarchy) — sorted by frontmatter `order`, always first
 *   2. Embedded nodes + media files — interleaved in order of appearance in text
 *   Use when the narrative flow of the page should drive what appears in the grid.
 *
 * Future: this value may be exposed as a UI toggle per-node or globally.
 */
export const LOTUS_SORT_MODE: "by-type" | "by-mention" = "by-mention";

/**
 * Maximum number of nodes displayed in the Lotus Grid (excluding center cell).
 * The grid is 3x3, center is always current node, so max surrounding = 8.
 * If resolved nodes exceed this limit:
 *   - A console event is fired (future: UI notification system)
 *   - The list is trimmed to the first LOTUS_GRID_LIMIT nodes (respecting sort order)
 */
export const LOTUS_GRID_LIMIT = 8;

/**
 * When true (and import.meta.env.DEV), Lotus Map shows atomic grid calibration UI.
 */
export const MAP_ATOMIC_DEBUG = false;

// --- ROOT SKELETON ---
// The skeleton provides the entry point ('home').
// All other nodes are attached via 'parent' fields in their .md files.
// The buildUnifiedGraph function merges the files into this structure.

const createSkeleton = (
  id: string,
  titleEn: string,
  titleRu: string,
): LotusNode => {
  return {
    id,
    title: { en: titleEn, ru: titleRu },
    shortTitle: { en: titleEn, ru: titleRu },
    description: { en: "Loading...", ru: "Загрузка..." },
    type: "hub",
    mediaUrl: getDefaultNodeImage(id),
    children: [], // Children are populated by contentLoader
  };
};

/** Id of the root hub. Hard-coded because the static skeleton anchors here. */
export const ROOT_ID = "hub-home";

const STATIC_ROOT = createSkeleton(ROOT_ID, "oda.dream", "oda.dream");

// --- UNIFIED GRAPH ---
// Merges static skeleton with file-based nodes from src/content/*.md
export const ROOT_NODE = buildUnifiedGraph(STATIC_ROOT);

// Flat id → node map computed once at module load. Stable reference identity
// across re-renders, which is what provenance.ts uses as its cache key.
export const NODE_REGISTRY: ReadonlyMap<string, LotusNode> = (() => {
  const map = new Map<string, LotusNode>();
  const walk = (n: LotusNode) => {
    map.set(n.id, n);
    n.children?.forEach(walk);
  };
  walk(ROOT_NODE);
  return map;
})();

// --- HEADER TABS CONFIGURATION (FAVORITES) ---
// Define the IDs of the nodes you want to appear in the top navigation bar.
// You can include deep links (children of children) here.
// The order in this array determines the display order.
const HEADER_TABS_ORDER = [
  "hub-home",
  "hub-works",
  "hub-collab",
  "hub-events",
  "hub-world",
  "hub-contacts",
];

// --- QUICK ACCESS ---
// Resolves the IDs from HEADER_TABS_ORDER to actual node objects.
export const QUICK_ACCESS = HEADER_TABS_ORDER.map((id) =>
  findNode(ROOT_NODE, id),
).filter((node): node is LotusNode => !!node);
