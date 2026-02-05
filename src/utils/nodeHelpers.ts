
import { LotusNode } from '../types';

/**
 * Recursively searches for a node within a tree.
 * Matches against ID (exact) or Title (case-insensitive).
 * 
 * SECURITY: Includes visited set to prevent infinite recursion in cyclic graphs.
 */
export const findNode = (
    root: LotusNode, 
    query: string, 
    visited = new Set<string>()
): LotusNode | null => {
  if (visited.has(root.id)) return null;
  visited.add(root.id);

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
      const found = findNode(child, query, visited);
      if (found) return found;
    }
  }

  return null;
};

/**
 * Finds the full lineage path from root to the target node.
 * Essential for preserving breadcrumbs and "Back" functionality when deep-linking.
 * Returns null if node not found.
 * 
 * SECURITY: Includes visited set to prevent infinite recursion.
 */
export const findPathToNode = (
    root: LotusNode, 
    targetIdOrTitle: string,
    visited = new Set<string>()
): LotusNode[] | null => {
    if (visited.has(root.id)) return null;
    visited.add(root.id);

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
            const pathFromChild = findPathToNode(child, targetIdOrTitle, visited);
            if (pathFromChild) {
                return [root, ...pathFromChild];
            }
        }
    }

    return null;
};
