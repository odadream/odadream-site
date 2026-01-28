import { LotusNode } from '../types';

/**
 * Recursively searches for a node within a tree.
 * Matches against ID (exact) or Title (case-insensitive).
 */
export const findNode = (root: LotusNode, query: string): LotusNode | null => {
  const q = query.toLowerCase();
  
  if (
    root.id.toLowerCase() === q || 
    root.title.en.toLowerCase() === q || 
    root.title.ru.toLowerCase() === q
  ) {
    return root;
  }

  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, query);
      if (found) return found;
    }
  }

  return null;
};

/**
 * Finds the full lineage path from root to the target node.
 * Essential for preserving breadcrumbs and "Back" functionality when deep-linking.
 * Returns null if node not found.
 */
export const findPathToNode = (root: LotusNode, targetIdOrTitle: string): LotusNode[] | null => {
    const q = targetIdOrTitle.toLowerCase();
    
    // Check current node
    if (
        root.id.toLowerCase() === q || 
        root.title.en.toLowerCase() === q || 
        root.title.ru.toLowerCase() === q
    ) {
        return [root];
    }

    // Check children
    if (root.children) {
        for (const child of root.children) {
            const pathFromChild = findPathToNode(child, targetIdOrTitle);
            if (pathFromChild) {
                return [root, ...pathFromChild];
            }
        }
    }

    return null;
};