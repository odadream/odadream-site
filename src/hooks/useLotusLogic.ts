import { useMemo } from "react";
import { LotusNode } from "../types";
import { parseContentAndExtractMedia } from "../utils/contentProcessor";

/**
 * Comparator function for sorting LotusNode objects with fallback logic
 *
 * @param a - First node to compare
 * @param b - Second node to compare
 * @returns Negative if a comes before b, positive if after, zero if equal
 */
const createNodeComparator =
  () =>
  (a: LotusNode, b: LotusNode): number => {
    const orderA = a.order ?? Infinity;
    const orderB = b.order ?? Infinity;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return a.id.localeCompare(b.id);
  };

/**
 * Custom hook that processes the current LotusNode and prepares a 3x3 grid layout
 *
 * @remarks
 * This hook is responsible for:
 * - Filtering nodes by visibility (`visible !== false`)
 * - Sorting nodes using order → id priority
 * - Parsing media nodes from markdown content
 * - Limiting display to 8 neighboring cells
 * - Preventing frontmatter media duplication
 *
 * @param currentNode - The currently active/focused node
 * @param lang - Current interface language ('en' or 'ru')
 * @returns Object containing `gridCells` array for 3x3 grid rendering
 *
 * @example
 * ```tsx
 * const { gridCells } = useLotusLogic(currentNode, 'en');
 * // gridCells[4] is always the center cell with currentNode
 * ```
 */
export const useLotusLogic = (currentNode: LotusNode, lang: "en" | "ru") => {
  const nodeComparator = useMemo(createNodeComparator, []);

  const displayChildren = useMemo(() => {
    const rawText = currentNode.description[lang] || "";
    const { mediaNodes } = parseContentAndExtractMedia(rawText);

    const staticChildren = (currentNode.children || [])
      .filter((child) => child.visible !== false)
      .sort(nodeComparator);

    const filteredMediaNodes = mediaNodes
      .filter((media) => media.visible !== false)
      .sort(nodeComparator);

    return [...staticChildren, ...filteredMediaNodes].slice(0, 8);
  }, [currentNode, lang, nodeComparator]);

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
