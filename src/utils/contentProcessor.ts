
import { LotusNode } from '../types';
import { getMediaType, attachPosterToUrl } from './mediaHelpers';

const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
};

// --- CODE BLOCK MASKING ---

const maskCodeBlocks = (text: string): { masked: string; placeholders: string[] } => {
    const placeholders: string[] = [];
    
    // We use a randomized-looking prefix to avoid collision with user content
    const placeholderPrefix = '%%__LOTUS_CODE_BLOCK_';
    
    // Store code content and return placeholder
    const store = (match: string) => {
        const key = `${placeholderPrefix}${placeholders.length}__%%`;
        placeholders.push(match);
        return key;
    };

    // 1. Mask Multiline Code Blocks (``` ... ```)
    // [\s\S]*? ensures we match newlines and match non-greedily
    let masked = text.replace(/```[\s\S]*?```/g, store);

    // 2. Mask Inline Code (` ... `)
    // We avoid matching backticks inside the already masked blocks because they are gone now.
    // [^`]* matches anything that isn't a backtick
    masked = masked.replace(/`[^`]+`/g, store);

    return { masked, placeholders };
};

const restoreCodeBlocks = (text: string, placeholders: string[]): string => {
    return text.replace(/%%__LOTUS_CODE_BLOCK_(\d+)__%%/g, (match, index) => {
        return placeholders[Number(index)] || match;
    });
};

// --- NODE GENERATION ---

export const generateMediaNode = (url: string, index: number, title?: string, posterUrl?: string): LotusNode => {
  const filename = title || url.split('/').pop() || `Media ${index + 1}`;
  const hash = simpleHash(url);
  const mediaType = getMediaType(url);
  
  let cleanTitle = filename;
  
  if (!title) {
      if (filename.includes('http') || filename.length > 30) {
          cleanTitle = mediaType === 'video' ? 'VIDEO' : mediaType === 'audio' ? 'AUDIO' : 'IMAGE';
      }
  }

  const localizedTitle = { en: cleanTitle, ru: cleanTitle };
  const localizedShort = { 
      en: cleanTitle.toUpperCase(), 
      ru: cleanTitle.toUpperCase() 
  };

  // Logic: Explicit Poster -> Video/Audio Thumbnail -> Image URL itself
  const resolvedImageUrl = posterUrl?.trim() || (mediaType === 'image' ? url : undefined);

  return {
    id: `media-${index}-${hash}`, 
    title: localizedTitle,
    shortTitle: localizedShort,
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
 * PARSER FOR GRID: Extracts nodes but leaves text alone (used for calculating neighbors).
 * Ignores media/links inside code blocks.
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
      if (!processedUrls.has(cleanUrl)) {
          processedUrls.add(cleanUrl);
          mediaNodes.push(generateMediaNode(cleanUrl, counter++, title?.trim(), poster?.trim()));
      }
  };

  // 1. Wiki Style ![[...]]
  const wikiGlobalRegex = /!\[\[(.*?)\]\]/g;
  while ((match = wikiGlobalRegex.exec(textToScan)) !== null) {
    const content = match[1];
    if (!content) continue;

    const parts = content.split('|').map(s => s.trim());
    const url = parts[0];
    const title = parts.length > 1 ? parts[1] : undefined;
    const poster = parts.length > 2 ? parts[2] : undefined;

    if (url) addNode(url, title, poster);
  }

  // 2. Standard Style ![Alt](Url)
  const stdImageRegex = /!\[(.*?)\]\((.*?)\)/g;
  while ((match = stdImageRegex.exec(textToScan)) !== null) {
    if (match[2]) addNode(match[2], match[1]);
  }

  return { cleanText: rawMarkdown, mediaNodes };
};

/**
 * TRANSFORMER FOR TEXT PANEL: Converts custom syntax to Standard Markdown.
 * Uses `attachPosterToUrl` to preserve the poster for the Lightbox.
 * Preserves code blocks from modification.
 */
export const transformWikiLinks = (text: string): string => {
    if (!text) return '';

    // 1. Mask code blocks to protect them from regex replacement
    const { masked, placeholders } = maskCodeBlocks(text);
    let processed = masked;

    // 2. Media Embeds ![[ Url | Label | Poster ]] -> ![Label](Url + params)
    // CRITICAL: Must be processed BEFORE internal links to avoid "[[...]]" regex matching the inside of "![[...]]"
    processed = processed.replace(/!\[\[(.*?)\]\]/g, (match, content) => {
        // Split by pipe and trim each part immediately
        const parts = content.split('|').map(p => p.trim());
        
        const url = parts[0];
        // Use second part as label if exists, else url
        const label = parts.length > 1 && parts[1] ? parts[1] : url; 
        // Use third part as poster if exists
        const poster = parts.length > 2 ? parts[2] : undefined;

        if (!url) return match; 

        // Attach poster as a safe query param so standard markdown parsers keep it in the URL
        const finalUrl = attachPosterToUrl(url, poster);
        
        return `![${label}](${finalUrl})`;
    });

    // 3. Internal Links [[id|Label]] -> [Label](?internal=true&id=id)
    processed = processed.replace(/\[\[\s*(.*?)\s*\|\s*(.*?)\s*\]\]/g, '[$2](?internal=true&id=$1)');
    processed = processed.replace(/\[\[\s*(.*?)\s*\]\]/g, '[$1](?internal=true&id=$1)');
    
    // 4. Restore code blocks
    return restoreCodeBlocks(processed, placeholders);
};

export const stripH1 = (text: string): string => {
    if (!text) return '';
    return text.split(/\r?\n/).filter(line => !line.trim().startsWith('# ')).join('\n');
};
