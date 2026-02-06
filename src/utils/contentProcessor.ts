
import { LotusNode } from '../types';
import { getMediaType, attachPosterToUrl } from './mediaHelpers';

const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0; // Force 32-bit integer
    }
    return Math.abs(hash).toString(36);
};

// --- CODE BLOCK MASKING ---

const maskCodeBlocks = (text: string): { masked: string; placeholders: string[] } => {
    const placeholders: string[] = [];
    const placeholderPrefix = '%%_L_CODE_';
    
    // Store code content and return placeholder
    const store = (match: string) => {
        const key = `${placeholderPrefix}${placeholders.length}_%%`;
        placeholders.push(match);
        return key;
    };

    // 1. Mask Multiline (```...```) then Inline (`...`)
    // Uses non-greedy matching [\s\S]*? for multiline
    let masked = text.replace(/```[\s\S]*?```/g, store);
    masked = masked.replace(/`[^`]+`/g, store);

    return { masked, placeholders };
};

const restoreCodeBlocks = (text: string, placeholders: string[]): string => {
    if (placeholders.length === 0) return text;
    return text.replace(/%%_L_CODE_(\d+)_%%/g, (_, index) => placeholders[Number(index)] || '');
};

// --- NODE GENERATION ---

export const generateMediaNode = (url: string, index: number, title?: string, posterUrl?: string): LotusNode => {
  const hash = simpleHash(url);
  const mediaType = getMediaType(url);
  const cleanTitle = title || (mediaType === 'video' ? 'VIDEO' : mediaType === 'audio' ? 'AUDIO' : 'IMAGE');

  const resolvedImageUrl = posterUrl?.trim() || (mediaType === 'image' ? url : undefined);

  return {
    id: `media-${index}-${hash}`, 
    title: { en: cleanTitle, ru: cleanTitle },
    shortTitle: { en: cleanTitle.toUpperCase(), ru: cleanTitle.toUpperCase() },
    description: { en: 'Media preview', ru: 'Превью медиа' },
    type: 'media',
    imageUrl: resolvedImageUrl,
    mediaUrl: url,
    mediaType: mediaType,
    visible: true,
    children: []
  };
};

/**
 * PARSER FOR GRID
 */
export const parseContentAndExtractMedia = (rawMarkdown: string): { cleanText: string; mediaNodes: LotusNode[] } => {
  if (!rawMarkdown) return { cleanText: '', mediaNodes: [] };

  const { masked: textToScan } = maskCodeBlocks(rawMarkdown);
  const mediaNodes: LotusNode[] = [];
  const processedUrls = new Set<string>();
  let counter = 0;
  let match;

  const addNode = (url: string, title?: string, poster?: string) => {
      const cleanUrl = url.trim();
      if (cleanUrl && !processedUrls.has(cleanUrl)) {
          processedUrls.add(cleanUrl);
          mediaNodes.push(generateMediaNode(cleanUrl, counter++, title?.trim(), poster?.trim()));
      }
  };

  // 1. Wiki Style ![[Url|Title|Poster]]
  // Improved regex: handles optional spaces around pipe
  const wikiRegex = /!\[\[\s*([^|\]]+?)(?:\s*\|\s*([^|\]]+?))?(?:\s*\|\s*([^\]]+?))?\s*\]\]/g;
  while ((match = wikiRegex.exec(textToScan)) !== null) {
      addNode(match[1], match[2], match[3]);
  }

  // 2. Standard Style ![Alt](Url)
  const stdRegex = /!\[(.*?)\]\((.*?)\)/g;
  while ((match = stdRegex.exec(textToScan)) !== null) {
      addNode(match[2], match[1]);
  }

  return { cleanText: rawMarkdown, mediaNodes };
};

/**
 * TRANSFORMER FOR TEXT PANEL
 */
export const transformWikiLinks = (text: string): string => {
    if (!text) return '';

    const { masked, placeholders } = maskCodeBlocks(text);
    let processed = masked;

    // 1. Media Embeds: ![[Url|Label|Poster]] -> ![Label](Url?__poster=Poster)
    processed = processed.replace(
        /!\[\[\s*([^|\]]+?)(?:\s*\|\s*([^|\]]+?))?(?:\s*\|\s*([^\]]+?))?\s*\]\]/g, 
        (_, url, label, poster) => {
            const finalUrl = attachPosterToUrl(url.trim(), poster ? poster.trim() : undefined);
            const finalLabel = label ? label.trim() : 'Media';
            return `![${finalLabel}](${finalUrl})`;
        }
    );

    // 2. Internal Links: [[Id|Label]] -> [Label](?internal=true&id=Id)
    // First: [[Id|Label]]
    processed = processed.replace(
        /\[\[\s*([^|\]]+?)\s*\|\s*([^\]]+?)\s*\]\]/g, 
        '[$2](?internal=true&id=$1)'
    );
    // Second: [[Id]]
    processed = processed.replace(
        /\[\[\s*([^\]]+?)\s*\]\]/g, 
        '[$1](?internal=true&id=$1)'
    );
    
    return restoreCodeBlocks(processed, placeholders);
};

export const stripH1 = (text: string): string => {
    if (!text) return '';
    // Regex replace is much faster than split/filter/join for large strings
    return text.replace(/^#\s+.*$/gm, '').trim();
};
