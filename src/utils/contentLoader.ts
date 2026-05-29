
import { LotusNode } from '../types';
import { fileToNode } from './frontmatter';
import { getMediaType, getDefaultNodeImage } from './mediaHelpers';

/**
 * Loads all .md files from ../content/ using Vite's import.meta.glob
 */
const loadFileNodes = (): LotusNode[] => {
    // @ts-ignore - Vite specific API
    const modules = import.meta.glob('../content/*.md', { query: '?raw', eager: true });
    
    const nodes: LotusNode[] = [];

    for (const path in modules) {
        // @ts-ignore
        const rawContent = modules[path].default;
        const filename = path.split('/').pop() || path;
        
        const partialNode = fileToNode(rawContent, filename);
        if (partialNode && partialNode.id) {
            
            // Resolve media URL: Explicit -> Generated Default
            const resolvedMediaUrl = partialNode.mediaUrl || getDefaultNodeImage(partialNode.id);

            // Apply defaults for fields required by TS but optional in YAML
            const node: LotusNode = {
                id: partialNode.id,
                parentId: partialNode.parentId,
                title: partialNode.title!,
                shortTitle: partialNode.shortTitle,
                description: partialNode.description!,
                type: partialNode.type as any || 'content',
                tags: partialNode.tags,
                imageUrl: partialNode.imageUrl || (getMediaType(resolvedMediaUrl) === 'image' ? resolvedMediaUrl : undefined),
                mediaUrl: resolvedMediaUrl,
                mediaType: getMediaType(resolvedMediaUrl),
                externalLink: partialNode.externalLink,
                visible: partialNode.visible !== undefined ? partialNode.visible : true,
                status: partialNode.status,
                children: [],
                lastModified: partialNode.lastModified,
                order: partialNode.order,
                // Provenance model passthrough — all optional
                kind: partialNode.kind,
                subkind: partialNode.subkind,
                presented_at: partialNode.presented_at,
                products: partialNode.products,
                organizer: partialNode.organizer,
                client: partialNode.client,
                proofs: partialNode.proofs,
                proof_of: partialNode.proof_of,
                about: partialNode.about,
                issued_by: partialNode.issued_by,
                media: partialNode.media,
                attendance: partialNode.attendance,
                date_start: partialNode.date_start,
                date_end: partialNode.date_end,
                venue: partialNode.venue,
                publication: partialNode.publication,
                publication_date: partialNode.publication_date,
                asset: partialNode.asset,
                quote: partialNode.quote,
                website: partialNode.website,
                external_site: partialNode.external_site,
                external_site_label: partialNode.external_site_label,
                access: partialNode.access,
                for_sale: partialNode.for_sale,
                purchase_url: partialNode.purchase_url,
                preview_media: partialNode.preview_media,
            };
            nodes.push(node);
        }
    }
    return nodes;
};

/**
 * Merges the file-based nodes into the static tree.
 * - If a file has the same ID as a static node, the file overrides it.
 * - If a file has a 'parent' field, it is inserted into that parent's children.
 */
export const buildUnifiedGraph = (staticRoot: LotusNode): LotusNode => {
    const fileNodes = loadFileNodes();
    
    // 1. Flatten static tree into a Map for easy access
    const nodeMap = new Map<string, LotusNode>();
    
    const flatten = (node: LotusNode) => {
        nodeMap.set(node.id, node);
        if (node.children) {
            node.children.forEach(flatten);
        }
    };
    flatten(staticRoot);

    // 2. Process File Nodes (Override or Add)
    const orphanedNodes: LotusNode[] = [];

    fileNodes.forEach(fNode => {
        if (nodeMap.has(fNode.id)) {
            // MERGE: Existing node (keep children from static if not defined in file, but override props)
            const existing = nodeMap.get(fNode.id)!;
            const merged: LotusNode = {
                ...existing,
                ...fNode,
                // Preserve children from static tree unless strictly replaced?
                // We keep existing children and append new ones later.
                children: existing.children || [] 
            };
            nodeMap.set(fNode.id, merged);
        } else {
            // NEW: Add to map
            nodeMap.set(fNode.id, fNode);
            if (fNode.parentId) {
                orphanedNodes.push(fNode);
            }
        }
    });

    // 3. Re-link Hierarchy for File Nodes
    fileNodes.forEach(fNode => {
        if (fNode.parentId && nodeMap.has(fNode.parentId)) {
            const parent = nodeMap.get(fNode.parentId)!;
            
            // Check if this child is already in the parent's children list (by ID)
            const existsIndex = parent.children?.findIndex(c => c.id === fNode.id) ?? -1;
            
            if (existsIndex === -1) {
                // Add new child
                if (!parent.children) parent.children = [];
                parent.children.push(nodeMap.get(fNode.id)!);
            } else {
                // It's already there (merged), ensure reference in parent array is updated to the merged version
                if (parent.children) {
                    parent.children[existsIndex] = nodeMap.get(fNode.id)!;
                }
            }
        }
    });

    // 4. Sort children by 'order' if present
    nodeMap.forEach(node => {
        if (node.children && node.children.length > 0) {
            node.children.sort((a, b) => {
                const orderA = a.order ?? 999;
                const orderB = b.order ?? 999;
                return orderA - orderB;
            });
        }
    });

    // Return the updated root
    return nodeMap.get(staticRoot.id) || staticRoot;
};
