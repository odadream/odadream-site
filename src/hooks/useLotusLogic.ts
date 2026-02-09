import { useMemo } from "react";
import { LotusNode } from "../types";
import {
  parseContentAndExtractMedia,
  generateMediaNode,
} from "../utils/contentProcessor";

export const useLotusLogic = (currentNode: LotusNode, lang: "en" | "ru") => {
  // Extract display children (static children + media nodes parsed from text)
  const displayChildren = useMemo(() => {
    const rawText = currentNode.description[lang] || "";

    // 1. Get media from Text (Deduplicated inside parser)
    const { mediaNodes } = parseContentAndExtractMedia(rawText);

    // 2. Get static children from graph
    const staticChildren = currentNode.children || [];

    // 3. Smart Merge: Check if Frontmatter Media should be included as a petal
    const mergedMedia = [...mediaNodes];

    // if (currentNode.mediaUrl) {
    //     // Is this a default generated asset? (e.g., /images/nodes/home.svg)
    //     // If so, we don't want it as a clickable petal.
    //     const isDefaultAsset = currentNode.mediaUrl.includes('/nodes/') && currentNode.mediaUrl.endsWith('.svg');

    //     if (!isDefaultAsset) {
    //         // DEDUPLICATION:
    //         // Check if the Frontmatter media is ALREADY used in the text.
    //         const existsInText = mediaNodes.some(n =>
    //             n.mediaUrl === currentNode.mediaUrl ||
    //             n.imageUrl === currentNode.mediaUrl
    //         );

    //         if (!existsInText) {
    //             const frontmatterNode = generateMediaNode(currentNode.mediaUrl, -1, 'COVER');
    //             mergedMedia.unshift(frontmatterNode);
    //         }
    //     }
    // }

    const allChildren = [...staticChildren, ...mergedMedia];
    return allChildren.slice(0, 8); // Max 8 neighbors
  }, [currentNode, lang]);

  // Map to 3x3 Grid
  // [0, 1, 2]
  // [3, C, 5]  <-- C is Center (Index 4)
  // [6, 7, 8]
  const gridCells = useMemo(() => {
    return Array(9)
      .fill(null)
      .map((_, index) => {
        if (index === 4) return { ...currentNode, isCenter: true };
        // Adjust index to skip center for children
        let childIndex = index < 4 ? index : index - 1;
        return displayChildren[childIndex]
          ? { ...displayChildren[childIndex], isCenter: false }
          : null;
      });
  }, [currentNode, displayChildren]);

  return { gridCells };
};
