
import { LotusNode, LocalizedString } from './types';
import { getDefaultNodeImage } from './utils/mediaHelpers';
import { buildUnifiedGraph } from './utils/contentLoader';

// --- CONFIGURATION ---

export const SITE_VERSION = "v1.0.0-gold";

// --- ROOT SKELETON ---
// The skeleton provides the entry point ('home'). 
// All other nodes are attached via 'parent' fields in their .md files.
// The buildUnifiedGraph function merges the files into this structure.

const createSkeleton = (id: string, titleEn: string, titleRu: string): LotusNode => {
    return {
        id,
        title: { en: titleEn, ru: titleRu },
        shortTitle: { en: titleEn, ru: titleRu },
        description: { en: 'Loading...', ru: 'Загрузка...' },
        type: 'hub',
        mediaUrl: getDefaultNodeImage(id),
        children: [] // Children are populated by contentLoader
    };
};

const STATIC_ROOT = createSkeleton('home', 'oda.dream', 'oda.dream');

// --- UNIFIED GRAPH ---
// Merges static skeleton with file-based nodes from src/content/*.md
export const ROOT_NODE = buildUnifiedGraph(STATIC_ROOT);

// --- QUICK ACCESS ---
// Expose the root and its immediate children (populated after buildUnifiedGraph runs)
// Note: Since buildUnifiedGraph is synchronous (using import.meta.glob eager),
// ROOT_NODE.children is populated immediately.
export const QUICK_ACCESS = [
    ROOT_NODE,
    ...(ROOT_NODE.children || [])
];
