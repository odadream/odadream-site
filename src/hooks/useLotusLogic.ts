import { useMemo } from "react";
import { LotusNode } from "../types";
import { parseContentAndExtractMedia } from "../utils/contentProcessor";
import { useNavigation } from "../context/NavigationContext";
import { LOTUS_SORT_MODE, LOTUS_GRID_LIMIT } from "../constants";

/**
 * Comparator for structural (static) nodes — sorts by frontmatter `order`, then by id.
 */
const nodeComparator = (a: LotusNode, b: LotusNode): number => {
  const orderA = a.order ?? Infinity;
  const orderB = b.order ?? Infinity;
  if (orderA !== orderB) return orderA - orderB;
  return a.id.localeCompare(b.id);
};

/**
 * Fires when resolved grid nodes exceed LOTUS_GRID_LIMIT.
 * Placeholder for a future UI notification system.
 * Currently logs a structured warning to the console.
 */
const onGridOverflow = (nodeId: string, total: number, limit: number): void => {
  console.warn(
    `[LotusGrid] Overflow on node "${nodeId}": ` +
      `${total} nodes resolved, trimmed to ${limit}. ` +
      `Consider reducing children or embedded links on this page.`,
  );
  // Future hook: dispatch a custom DOM event for UI notifications
  // window.dispatchEvent(new CustomEvent('lotus:overflow', { detail: { nodeId, total, limit } }));
};

/**
 * Custom hook that processes the current LotusNode and prepares a 3x3 grid layout.
 *
 * Sort modes (configured via LOTUS_SORT_MODE in constants.ts):
 *
 * 'by-type' — three distinct groups in fixed order:
 *   1. Static children (structural hierarchy), sorted by `order`
 *   2. Embedded nodes from ![[nodeId]], sorted by `order`
 *   3. Media nodes from ![[url]], in order of appearance in text
 *
 * 'by-mention' — two groups:
 *   1. Static children (structural hierarchy), sorted by `order` — always first
 *   2. Embedded nodes + media files interleaved in order of appearance in text
 *
 * If total nodes exceed LOTUS_GRID_LIMIT (8), an overflow event is fired
 * and the list is trimmed to the first LOTUS_GRID_LIMIT items.
 */
export const useLotusLogic = (currentNode: LotusNode, lang: "en" | "ru") => {
  const { nodeRegistry } = useNavigation();

  const displayChildren = useMemo(() => {
    const rawText = currentNode.description[lang] || "";
    const { mediaNodes } = parseContentAndExtractMedia(rawText, nodeRegistry);

    // --- STATIC CHILDREN (structural hierarchy) ---
    const staticChildren = (currentNode.children || [])
      .filter((child) => child.visible !== false)
      .sort(nodeComparator);

    // --- PARSED NODES from markdown ---
    // Split into embedded graph nodes and raw media files
    const embeddedNodes: LotusNode[] = [];
    const mediaFiles: LotusNode[] = [];

    mediaNodes
      .filter((n) => n.visible !== false)
      .forEach((n) => {
        if (n._isEmbedded) {
          embeddedNodes.push(n);
        } else {
          mediaFiles.push(n);
        }
      });

    // --- SORT & MERGE by configured mode ---
    let resolved: LotusNode[];

    if (LOTUS_SORT_MODE === "by-type") {
      // Group 1: static children (by order)
      // Group 2: embedded nodes (by order)
      // Group 3: media files (by appearance — already in text order from parser)
      const sortedEmbedded = [...embeddedNodes].sort(nodeComparator);
      resolved = [...staticChildren, ...sortedEmbedded, ...mediaFiles];
    } else {
      // 'by-mention'
      // Group 1: static children (by order) — always anchored first
      // Group 2: embedded + media interleaved in text appearance order
      // mediaNodes preserves text order (parser emits in encounter order)
      // mediaNodes already have _isEmbedded set correctly by contentProcessor
      const mentionOrdered = mediaNodes.filter((n) => n.visible !== false);
      resolved = [...staticChildren, ...mentionOrdered];
    }

    // --- OVERFLOW CHECK ---
    if (resolved.length > LOTUS_GRID_LIMIT) {
      onGridOverflow(currentNode.id, resolved.length, LOTUS_GRID_LIMIT);
      resolved = resolved.slice(0, LOTUS_GRID_LIMIT);
    }

    return resolved;
  }, [currentNode, lang, nodeRegistry]);

  // Map to 3x3 Grid
  // [0, 1, 2]
  // [3, C, 5]  <-- C is Center (Index 4)
  // [6, 7, 8]

  const gridCells = useMemo(() => {
    return Array(9)
      .fill(null)
      .map((_, gridIndex) => {
        if (gridIndex === 4) {
          return { ...currentNode, isCenter: true };
        }
        const childIndex = gridIndex < 4 ? gridIndex : gridIndex - 1;
        const child = displayChildren[childIndex];
        return child ? { ...child, isCenter: false } : null;
      });
  }, [currentNode, displayChildren]);

  return { gridCells };
};
