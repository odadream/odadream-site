
import { LotusNode } from '../types';
import { getMediaType } from './mediaHelpers';

/**
 * Generates a deterministic short hash from a string.
 * Used to ensure media node IDs are consistent across re-renders without random UUIDs.
 * 
 * @param str Input string
 * @returns Base36 hash string
 */
const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
};

/**
 * Helper to generate a temporary "Media Node" from a URL extracted from markdown.
 * These nodes are displayed in the Lotus Grid but are not part of the static graph.
 */
const createMediaNode = (url: string, index: number, title?: string): LotusNode => {
  const filename = title || url.split('/').pop() || `Media ${index + 1}`;
  const hash = simpleHash(url);
  const mediaType = getMediaType(url);
  
  return {
    id: `media-${index}-${hash}`, 
    title: { en: filename, ru: filename },
    shortTitle: { en: 'DATA', ru: 'ДАННЫЕ' },
    description: { en: 'Media preview', ru: 'Превью медиа' },
    type: 'media',
    imageUrl: mediaType === 'image' ? url : undefined, // Only set imageUrl if it is explicitly an image
    mediaUrl: url,
    mediaType: mediaType,
    visible: true,
    children: []
  };
};

/**
 * Parses raw Markdown text to extract custom media syntax for visual grid population.
 * 
 * Supports two syntaxes:
 * 1. Wiki-style: ![[url]] - Often used in tools like Obsidian
 * 2. Standard Markdown: ![alt](url)
 * 
 * @param rawMarkdown The full markdown string from content.ts
 * @returns Object containing the clean text (original) and an array of extracted Media Nodes
 */
export const parseContentAndExtractMedia = (rawMarkdown: string): { cleanText: string; mediaNodes: LotusNode[] } => {
  if (!rawMarkdown) return { cleanText: '', mediaNodes: [] };

  const mediaNodes: LotusNode[] = [];
  
  // Regex for ![[url]] syntax
  const wikiImageRegex = /!\[\[(.*?)\]\]/g;
  
  // Regex for standard markdown ![alt](url)
  const stdImageRegex = /!\[(.*?)\]\((.*?)\)/g;

  let counter = 0;
  let match;

  // 1. Extract Media Nodes from Wiki Style
  while ((match = wikiImageRegex.exec(rawMarkdown)) !== null) {
    if (match[1]) {
        mediaNodes.push(createMediaNode(match[1], counter++));
    }
  }

  // 2. Extract Media Nodes from Standard Style
  while ((match = stdImageRegex.exec(rawMarkdown)) !== null) {
    if (match[2]) {
        mediaNodes.push(createMediaNode(match[2], counter++, match[1]));
    }
  }

  // We return the original text as 'cleanText' because we want to preserve the 
  // inline images in the text panel, while also showing them in the grid.
  return { cleanText: rawMarkdown, mediaNodes };
};

/**
 * Removes lines starting with '# ' (H1) from text.
 * Improved to handle different newline formats (\n, \r\n).
 * 
 * @param text Markdown text
 * @returns Text without H1 lines
 */
export const stripH1 = (text: string): string => {
    if (!text) return '';
    // Split by any newline sequence to handle cross-platform content safely
    return text.split(/\r?\n/).filter(line => !line.trim().startsWith('# ')).join('\n');
};
