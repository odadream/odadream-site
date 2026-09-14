
import { LotusNode } from '../types';
import { fileToNode } from './frontmatter';
import { MEDIA } from '../data/media';
import { REAL_IMAGE_CATALOG } from '../data/realImageCatalog';
import { getMediaType } from './mediaHelpers';

const isNodeType = (t: unknown): t is LotusNode['type'] =>
    t === 'hub' || t === 'content' || t === 'action' || t === 'media';

const isGeneratedNodeImage = (url?: string): boolean =>
    !!url && /\/images\/nodes\//i.test(url);

const isRealImage = (url?: string): url is string =>
    !!url && getMediaType(url) === 'image' && !isGeneratedNodeImage(url);

const relationFields: Array<keyof LotusNode> = [
    'presented_at', 'products', 'orgs', 'venues', 'partners', 'organizer',
    'client', 'collaborators', 'related_org', 'collab_events', 'proofs',
    'proof_of', 'about', 'issued_by',
];

type ImageCandidate = { url: string; score: number };

const getInlineVisualUrls = (node: LotusNode): Set<string> => {
    const blocked = new Set<string>();
    const body = `${node.description.en}\n${node.description.ru}`;

    for (const match of body.matchAll(/!\[\[\s*media:([a-z0-9][a-z0-9_-]*)/gi)) {
        const asset = MEDIA[match[1]];
        if (!asset) continue;
        if (asset.url) blocked.add(asset.url);
        if (asset.poster) blocked.add(asset.poster);
    }

    for (const match of body.matchAll(/!\[\[\s*(\/(?:images|media)\/[^|\]\r\n]+)/gi)) {
        blocked.add(match[1].trim());
    }
    for (const match of body.matchAll(/!\[[^\]]*\]\((\/(?:images|media)\/[^)\s]+)/gi)) {
        blocked.add(match[1].trim());
    }

    return blocked;
};

const pushCandidate = (out: ImageCandidate[], url: unknown, score: number) => {
    if (typeof url !== 'string' || !isRealImage(url)) return;
    if (!out.some((candidate) => candidate.url === url)) out.push({ url, score });
};

/**
 * Build and apply a real-image index for the whole graph.
 *
 * The old behaviour made every missing image resolve to /images/nodes/*.svg.
 * That was useful during prototyping, but it made the public portfolio look
 * like a generated demo. We now resolve in this order:
 * authored cover/document → attached MediaAsset → curated catalog → related
 * node/child. A URL is reserved after assignment, so two Lotus nodes do not
 * silently receive the same visual while an unused real candidate exists.
 */
const assignRealImages = (nodeMap: Map<string, LotusNode>) => {
    const nodes = [...nodeMap.values()];
    const direct = new Map<string, ImageCandidate[]>();

    for (const node of nodes) {
        const candidates: ImageCandidate[] = [];
        const inlineVisuals = getInlineVisualUrls(node);
        const isMediaEntity = node.kind === 'media' || node.type === 'media';
        const pushNodeCandidate = (url: unknown, score: number) => {
            if (
                !isMediaEntity &&
                typeof url === 'string' &&
                inlineVisuals.has(url)
            ) return;
            pushCandidate(candidates, url, score);
        };

        pushNodeCandidate(node.imageUrl, 0);
        pushNodeCandidate(node.asset, 0);
        pushNodeCandidate(node.mediaUrl, 1);

        for (const mediaId of node.media ?? []) {
            const asset = MEDIA[mediaId];
            if (!asset) continue;
            pushNodeCandidate(asset.url, 1);
            pushNodeCandidate(asset.poster, 1);
        }

        for (const [mediaId, asset] of Object.entries(MEDIA)) {
            if (!(asset.subject ?? []).includes(node.id)) continue;
            pushNodeCandidate(asset.url, 1);
            pushNodeCandidate(asset.poster, 1);
            // Keep the media id discoverable in the debug report without
            // changing the node schema or rendering path.
            void mediaId;
        }

        for (const record of REAL_IMAGE_CATALOG) {
            if (record.subjects.includes(node.id)) pushNodeCandidate(record.url, 2);
        }
        direct.set(node.id, candidates.sort((a, b) => a.score - b.score));
    }

    const collect = (node: LotusNode, seen = new Set<string>()): ImageCandidate[] => {
        if (seen.has(node.id)) return [];
        seen.add(node.id);
        const out = [...(direct.get(node.id) ?? [])];

        for (const field of relationFields) {
            const ids = node[field];
            if (!Array.isArray(ids)) continue;
            for (const id of ids) {
                const related = typeof id === 'string' ? nodeMap.get(id) : undefined;
                if (!related) continue;
                for (const candidate of collect(related, new Set(seen))) {
                    pushCandidate(out, candidate.url, candidate.score + 3);
                }
            }
        }

        for (const child of node.children ?? []) {
            for (const candidate of collect(child, new Set(seen))) {
                pushCandidate(out, candidate.url, candidate.score + 3);
            }
        }
        return out.sort((a, b) => a.score - b.score);
    };

    const rank = (node: LotusNode) => {
        const kindRank: Record<string, number> = {
            // Media nodes with a concrete inline image reserve it first;
            // parent products/events then select a different real visual.
            media: 0, product: 1, event: 2, proof: 3, collaboration: 4,
        };
        if (node.type === 'hub') return 5;
        return kindRank[node.kind ?? ''] ?? 2;
    };

    const used = new Set<string>();
    for (const node of nodes.sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id))) {
        const inlineVisuals = getInlineVisualUrls(node);
        // A persisted media node represents its own inline image, so it may
        // reserve that image. All other nodes must not claim a visual already
        // embedded in their own body (the embed will render it once).
        const candidates = collect(node).filter(
            (candidate) => node.kind === 'media' || node.type === 'media' || !inlineVisuals.has(candidate.url),
        );
        const selected = candidates.find((candidate) => !used.has(candidate.url));

        if (selected) {
            used.add(selected.url);
            node.imageUrl = selected.url;
            const mediaType = getMediaType(node.mediaUrl);
            if (!node.mediaUrl || mediaType === 'image' || isGeneratedNodeImage(node.mediaUrl)) {
                node.mediaUrl = selected.url;
            }
        } else if (isGeneratedNodeImage(node.imageUrl) || inlineVisuals.has(node.imageUrl ?? '')) {
            // No fake replacement: a genuinely unillustrated node gets the
            // normal icon/no-signal state instead of another generated tile.
            node.imageUrl = undefined;
            if (
                isGeneratedNodeImage(node.mediaUrl) ||
                inlineVisuals.has(node.mediaUrl ?? '')
            ) node.mediaUrl = undefined;
        }
    }
};

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
            
            // Resolve media only from authored content. Generated SVG tiles are
            // intentionally no longer injected into the public graph.
            const resolvedMediaUrl = partialNode.mediaUrl;

            // Apply defaults for fields required by TS but optional in YAML
            const node: LotusNode = {
                id: partialNode.id,
                parentId: partialNode.parentId,
                title: partialNode.title!,
                shortTitle: partialNode.shortTitle,
                description: partialNode.description!,
                type: isNodeType(partialNode.type) ? partialNode.type : 'content',
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
                orgs: partialNode.orgs,
                venues: partialNode.venues,
                partners: partialNode.partners,
                organizer: partialNode.organizer,
                client: partialNode.client,
                collaborators: partialNode.collaborators,
                related_org: partialNode.related_org,
                collab_events: partialNode.collab_events,
                proofs: partialNode.proofs,
                proof_of: partialNode.proof_of,
                about: partialNode.about,
                issued_by: partialNode.issued_by,
                media: partialNode.media,
                attendance: partialNode.attendance,
                date_start: partialNode.date_start,
                date_end: partialNode.date_end,
                city: partialNode.city,
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

    assignRealImages(nodeMap);

    // Return the updated root
    return nodeMap.get(staticRoot.id) || staticRoot;
};
