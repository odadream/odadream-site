import { LotusNode } from "../types";
import { getMediaType, attachPosterToUrl } from "./mediaHelpers";
import { MEDIA } from "../data/media";
import { CONTACTS, CONTACTS_CTA } from "../data/contacts";

type Lang = "en" | "ru";

/**
 * Resolve registry tokens into plain markdown/embed syntax BEFORE the existing
 * wiki/embed regexes run. Single source for media (src/data/media.ts) and
 * contacts (src/data/contacts.ts); change once → propagates site-wide.
 *
 *  - `![[media:<id>]]` or `![[media:<id> | Label]]` or `![[media:<id> | Label | Poster]]`
 *      → `![[<url> | <label> | <poster>]]` (label/poster default to the registry)
 *  - `{{contacts-cta}}`               → the bilingual outreach block
 *  - `{{telegram}}`/`{{email}}`/…    → `[label](href)`
 */
const resolveTokens = (text: string, lang: Lang = "en"): string => {
  if (!text) return text;

  // Media tokens — expand to standard wiki embed (caught by existing regex below).
  let out = text.replace(
    /!\[\[\s*media:([a-z0-9][a-z0-9_-]*)\s*(?:\|\s*([^|\]]+?)\s*)?(?:\|\s*([^\]]+?)\s*)?\]\]/gi,
    (match, id, labelOverride, posterOverride) => {
      const asset = MEDIA[id];
      if (!asset) return match; // unknown id — leave token untouched for visibility
      const label = (labelOverride || asset.title?.[lang] || id).trim();
      const poster = (posterOverride || asset.poster || "").trim();
      return poster
        ? `![[${asset.url} | ${label} | ${poster}]]`
        : `![[${asset.url} | ${label}]]`;
    },
  );

  // Contact CTA block (full outreach paragraph).
  out = out.replace(/\{\{\s*contacts-cta\s*\}\}/g, () => CONTACTS_CTA[lang] || CONTACTS_CTA.en);

  // Atomic contact tokens → markdown link.
  out = out.replace(/\{\{\s*([a-z][a-z0-9-]*)\s*\}\}/gi, (match, key) => {
    const c = CONTACTS[key.toLowerCase()];
    return c ? `[${c.label}](${c.href})` : match;
  });

  return out;
};

const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
};

// --- CODE BLOCK MASKING ---

const maskCodeBlocks = (
  text: string,
): { masked: string; placeholders: string[] } => {
  const placeholders: string[] = [];
  const placeholderPrefix = "%%_L_CODE_";

  const store = (match: string) => {
    const key = `${placeholderPrefix}${placeholders.length}_%%`;
    placeholders.push(match);
    return key;
  };

  // iOS Safari compatibility: use (?:.|\r?\n) instead of [\s\S]
  let masked = text.replace(/```(?:.|\r?\n)*?```/g, store);
  masked = masked.replace(/`[^`]+`/g, store);

  return { masked, placeholders };
};

const restoreCodeBlocks = (text: string, placeholders: string[]): string => {
  if (placeholders.length === 0) return text;
  return text.replace(
    /%%_L_CODE_(\d+)_%%/g,
    (_, index) => placeholders[Number(index)] || "",
  );
};

// --- NODE GENERATION ---

export const generateMediaNode = (
  url: string,
  index: number,
  title?: string,
  posterUrl?: string,
): LotusNode => {
  const hash = simpleHash(url);
  const mediaType = getMediaType(url);
  const cleanTitle =
    title ||
    (mediaType === "video"
      ? "VIDEO"
      : mediaType === "audio"
        ? "AUDIO"
        : "IMAGE");

  const resolvedImageUrl =
    posterUrl?.trim() || (mediaType === "image" ? url : undefined);

  return {
    id: `media-${index}-${hash}`,
    title: { en: cleanTitle, ru: cleanTitle },
    shortTitle: { en: cleanTitle.toUpperCase(), ru: cleanTitle.toUpperCase() },
    description: { en: "Media preview", ru: "Превью медиа" },
    type: "media",
    imageUrl: resolvedImageUrl,
    mediaUrl: url,
    mediaType: mediaType,
    visible: true,
    children: [],
  };
};

/**
 * PARSER FOR GRID
 *
 * @param rawMarkdown - Raw markdown content to parse
 * @param nodeRegistry - Optional map of all nodes by ID. When provided,
 *   ![[nodeId|Label]] syntax will resolve to the actual node from the graph
 *   instead of generating a media node. This enables Obsidian-style page embeds.
 */
export const parseContentAndExtractMedia = (
  rawMarkdown: string,
  nodeRegistry?: Map<string, LotusNode>,
  lang: Lang = "en",
): { cleanText: string; mediaNodes: LotusNode[] } => {
  if (!rawMarkdown) return { cleanText: "", mediaNodes: [] };

  const resolved = resolveTokens(rawMarkdown, lang);
  const { masked: textToScan, placeholders } = maskCodeBlocks(resolved);
  const mediaNodes: LotusNode[] = [];
  const processedKeys = new Set<string>();
  let counter = 0;
  let match;

  const addNode = (value: string, title?: string, poster?: string) => {
    const cleanValue = value.trim();
    if (!cleanValue || processedKeys.has(cleanValue)) return;
    processedKeys.add(cleanValue);

    // Check registry first: if value matches a known node ID — use that node
    if (nodeRegistry && nodeRegistry.has(cleanValue)) {
      const registryNode = nodeRegistry.get(cleanValue)!;
      // Mark as embedded so useLotusLogic can distinguish from media files
      // and apply correct sort group + history navigation
      const node: LotusNode = {
        ...(title
          ? {
              ...registryNode,
              title: { ...registryNode.title },
              shortTitle: { en: title, ru: title },
            }
          : registryNode),
        _isEmbedded: true,
      };
      mediaNodes.push(node);
      return;
    }

    // Fallback: treat as media URL — explicitly NOT embedded
    mediaNodes.push({
      ...generateMediaNode(
        cleanValue,
        counter++,
        title?.trim(),
        poster?.trim(),
      ),
      _isEmbedded: false,
    });
  };

  // 1. Wiki Style ![[Value|Title|Poster]]
  const wikiRegex =
    /!\[\[\s*([^|\]]+?)(?:\s*\|\s*([^|\]]+?))?(?:\s*\|\s*([^\]]+?))?\s*\]\]/g;
  while ((match = wikiRegex.exec(textToScan)) !== null) {
    addNode(match[1], match[2], match[3]);
  }

  // 2. Standard Style ![Alt](Url)
  const stdRegex = /!\[(.*?)\]\((.*?)\)/g;
  while ((match = stdRegex.exec(textToScan)) !== null) {
    addNode(match[2], match[1]);
  }

  // Strip embed syntax from cleanText so callers get plain prose without tokens
  const cleanMasked = textToScan
    .replace(/!\[\[\s*[^|\]]+?(?:\s*\|[^\]]+?)?\s*\]\]/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "");
  const cleanText = restoreCodeBlocks(cleanMasked, placeholders).trim();

  return { cleanText, mediaNodes };
};

/**
 * TRANSFORMER FOR TEXT PANEL
 *
 * @param text - Markdown text to transform
 * @param nodeRegistry - Optional map of all nodes by ID. When provided,
 *   ![[nodeId|Label]] will render as an internal navigation link instead of
 *   a media embed button — matching Obsidian's embedded page link behavior.
 */
export const transformWikiLinks = (
  text: string,
  nodeRegistry?: Map<string, LotusNode>,
  lang: Lang = "en",
): string => {
  if (!text) return "";

  const resolved = resolveTokens(text, lang);
  const { masked, placeholders } = maskCodeBlocks(resolved);
  let processed = masked;

  // 1. Media/Node Embeds: ![[Value|Label|Poster]]
  processed = processed.replace(
    /!\[\[\s*([^|\]]+?)(?:\s*\|\s*([^|\]]+?))?(?:\s*\|\s*([^\]]+?))?\s*\]\]/g,
    (_, value, label, poster) => {
      const cleanValue = value.trim();
      const finalLabel = label ? label.trim() : cleanValue;

      // If value is a known node ID → render as internal navigation link
      if (nodeRegistry && nodeRegistry.has(cleanValue)) {
        return `[${finalLabel}](?internal=true&id=${cleanValue})`;
      }

      // Otherwise → render as media embed (original behavior)
      const finalUrl = attachPosterToUrl(
        cleanValue,
        poster ? poster.trim() : undefined,
      );
      return `![${finalLabel}](${finalUrl})`;
    },
  );

  // 2. Internal Links: [[Id|Label]] -> [Label](?internal=true&id=Id)
  processed = processed.replace(
    /\[\[\s*([^|\]]+?)\s*\|\s*([^\]]+?)\s*\]\]/g,
    "[$2](?internal=true&id=$1)",
  );
  // [[Id]] -> [Id](?internal=true&id=Id)
  processed = processed.replace(
    /\[\[\s*([^\]]+?)\s*\]\]/g,
    "[$1](?internal=true&id=$1)",
  );

  return restoreCodeBlocks(processed, placeholders);
};

export const stripH1 = (text: string): string => {
  if (!text) return "";
  return text.replace(/^#\s+.*$/gm, "").trim();
};
