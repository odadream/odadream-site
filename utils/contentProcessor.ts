import { LotusNode } from '../types';

// Simple string hash for deterministic IDs
const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
};

// Helper to generate a media node from a URL
// NOW DETERMINISTIC to prevent Framer Motion re-mounting issues
const createMediaNode = (url: string, index: number): LotusNode => {
  const filename = url.split('/').pop() || `Media ${index + 1}`;
  const hash = simpleHash(url);
  
  return {
    id: `media-${index}-${hash}`, // Deterministic ID
    title: filename,
    shortTitle: 'PREVIEW',
    description: 'Media preview',
    type: 'media',
    imageUrl: url, 
    mediaUrl: url,
    visible: true,
    children: []
  };
};

export const parseContentAndExtractMedia = (rawMarkdown: string): { cleanText: string; mediaNodes: LotusNode[] } => {
  if (!rawMarkdown) return { cleanText: '', mediaNodes: [] };

  const mediaNodes: LotusNode[] = [];
  
  // Regex for ![[url]] syntax
  const wikiImageRegex = /!\[\[(.*?)\]\]/g;
  
  // Regex for standard markdown ![alt](url)
  const stdImageRegex = /!\[(.*?)\]\((.*?)\)/g;

  let counter = 0;
  let match;

  // 1. Extract Media Nodes from Wiki Style ![[url]]
  while ((match = wikiImageRegex.exec(rawMarkdown)) !== null) {
    if (match[1]) {
        mediaNodes.push(createMediaNode(match[1], counter++));
    }
  }

  // 2. Extract Media Nodes from Standard Style ![alt](url)
  while ((match = stdImageRegex.exec(rawMarkdown)) !== null) {
    if (match[2]) {
        const node = createMediaNode(match[2], counter++);
        node.title = match[1] || node.title;
        mediaNodes.push(node);
    }
  }

  return { cleanText: rawMarkdown, mediaNodes };
};

/**
 * Removes lines starting with '# ' (H1) from text because the UI renders the H1 title separately.
 */
export const stripH1 = (text: string): string => {
    return text.split('\n').filter(line => !line.trim().startsWith('# ')).join('\n');
};