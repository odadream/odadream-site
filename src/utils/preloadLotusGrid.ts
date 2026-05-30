import { LotusNode, Language } from "../types";
import { parseContentAndExtractMedia } from "./contentProcessor";
import { getDefaultNodeImage } from "./mediaHelpers";

const preloadImage = (url?: string) => {
  if (!url) return;
  const img = new Image();
  img.decoding = "async";
  img.src = url;
};

const preloadNodeImage = (node: LotusNode) => {
  if (node.imageUrl) preloadImage(node.imageUrl);
  else preloadImage(getDefaultNodeImage(node.id));
};

/**
 * Warm-cache images for the next Lotus 3×3 view before navigation commits.
 * Mirrors useLotusLogic inputs: structural children + markdown mentions.
 */
export const preloadLotusGrid = (
  centerNode: LotusNode,
  registry: Map<string, LotusNode>,
  lang: Language = "en",
) => {
  preloadNodeImage(centerNode);

  const raw = centerNode.description[lang] || "";
  const { mediaNodes } = parseContentAndExtractMedia(raw, registry, lang);

  const seen = new Set<string>();
  const queue: LotusNode[] = [
    ...(centerNode.children || []),
    ...mediaNodes,
  ];

  for (const node of queue) {
    if (!node || seen.has(node.id)) continue;
    seen.add(node.id);
    preloadNodeImage(node);
  }
};
