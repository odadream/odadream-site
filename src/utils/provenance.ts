import { LotusNode } from "../types";
import { MEDIA, MediaAsset } from "../data/media";

/**
 * Provenance derived for a single node.
 *
 * Direct fields mirror what's in the node's frontmatter — resolved to actual
 * LotusNode instances. Inverse fields are computed by scanning the whole
 * registry once per build (cached in module scope) and looking up the index
 * for the current node.
 */
export interface Provenance {
  // Direct (from this node's frontmatter)
  presented_at: LotusNode[];
  products: LotusNode[];
  organizer: LotusNode[];
  client: LotusNode[];
  proofs: LotusNode[];
  proof_of: LotusNode[];
  about: LotusNode[];
  issued_by: LotusNode[];
  media: Array<{ id: string; asset: MediaAsset }>;

  // Inverse (computed: who points back to this node)
  inverse: {
    /** Events that listed this product in `products` (inverse of event → product). */
    presented_here: LotusNode[];
    /** Products that listed this event in `presented_at` (inverse of product → event). */
    shown_in: LotusNode[];
    /** Nodes that listed this node in their `organizer` (= events organized by this org). */
    organized_events: LotusNode[];
    /** Events that listed this node in `client` (= engagements where this org was the client). */
    client_events: LotusNode[];
    /** Products listed on events this organizer hosted (rollup). */
    products_from_events: LotusNode[];
    /** Nodes that listed this node in their `proofs` (= subjects this proof attests). */
    proves: LotusNode[];
    /** Nodes that listed this node in their `proof_of` (= proofs about this subject). */
    proofs_about: LotusNode[];
    /** Media works that listed this node in `about` (= artifacts documenting this subject). */
    works_about: LotusNode[];
    /** Nodes that listed this node in their `issued_by` (= proofs issued by this org). */
    proofs_issued: LotusNode[];
  };
}

interface InverseIndex {
  presented_here: Map<string, LotusNode[]>;
  shown_in: Map<string, LotusNode[]>;
  organized_events: Map<string, LotusNode[]>;
  client_events: Map<string, LotusNode[]>;
  proves: Map<string, LotusNode[]>;
  proofs_about: Map<string, LotusNode[]>;
  works_about: Map<string, LotusNode[]>;
  proofs_issued: Map<string, LotusNode[]>;
}

const pushTo = (map: Map<string, LotusNode[]>, key: string, value: LotusNode) => {
  const arr = map.get(key);
  if (arr) arr.push(value);
  else map.set(key, [value]);
};

let cached: { registry: Map<string, LotusNode>; index: InverseIndex } | null = null;

/**
 * Build the reverse index over a node registry. Cached by reference identity.
 * If you call with a different registry, the index is rebuilt.
 */
function getIndex(registry: Map<string, LotusNode>): InverseIndex {
  if (cached && cached.registry === registry) return cached.index;

  const index: InverseIndex = {
    presented_here: new Map(),
    shown_in: new Map(),
    organized_events: new Map(),
    client_events: new Map(),
    proves: new Map(),
    proofs_about: new Map(),
    works_about: new Map(),
    proofs_issued: new Map(),
  };

  registry.forEach((node) => {
    node.presented_at?.forEach((id) => pushTo(index.shown_in, id, node));
    node.products?.forEach((id) => pushTo(index.presented_here, id, node));
    node.organizer?.forEach((id) => pushTo(index.organized_events, id, node));
    node.client?.forEach((id) => pushTo(index.client_events, id, node));
    node.proofs?.forEach((id) => pushTo(index.proves, id, node));
    node.proof_of?.forEach((id) => pushTo(index.proofs_about, id, node));
    node.about?.forEach((id) => pushTo(index.works_about, id, node));
    node.issued_by?.forEach((id) => pushTo(index.proofs_issued, id, node));
  });

  cached = { registry, index };
  return index;
}

const resolveAll = (
  ids: string[] | undefined,
  registry: Map<string, LotusNode>,
): LotusNode[] => {
  if (!ids) return [];
  const out: LotusNode[] = [];
  for (const id of ids) {
    const n = registry.get(id);
    if (n) out.push(n);
  }
  return out;
};

const resolveMedia = (ids?: string[]) => {
  if (!ids) return [];
  return ids
    .map((id) => ({ id, asset: MEDIA[id] }))
    .filter((m): m is { id: string; asset: MediaAsset } => !!m.asset);
};

/** Collect unique products from events this organizer is linked to. */
const productsFromOrganizedEvents = (
  organizerId: string,
  registry: Map<string, LotusNode>,
  index: InverseIndex,
): LotusNode[] => {
  const events = index.organized_events.get(organizerId) ?? [];
  const seen = new Set<string>();
  const out: LotusNode[] = [];
  for (const ev of events) {
    for (const productId of ev.products ?? []) {
      if (seen.has(productId)) continue;
      const p = registry.get(productId);
      if (p) {
        seen.add(productId);
        out.push(p);
      }
    }
  }
  return out;
};

/**
 * Resolve direct + inverse provenance for a node.
 * Returns a fully-populated Provenance object — empty arrays where nothing matches.
 */
export function getProvenance(
  node: LotusNode,
  registry: Map<string, LotusNode>,
): Provenance {
  const idx = getIndex(registry);
  return {
    presented_at: resolveAll(node.presented_at, registry),
    products: resolveAll(node.products, registry),
    organizer: resolveAll(node.organizer, registry),
    client: resolveAll(node.client, registry),
    proofs: resolveAll(node.proofs, registry),
    proof_of: resolveAll(node.proof_of, registry),
    about: resolveAll(node.about, registry),
    issued_by: resolveAll(node.issued_by, registry),
    media: resolveMedia(node.media),
    inverse: {
      presented_here: idx.presented_here.get(node.id) ?? [],
      shown_in: idx.shown_in.get(node.id) ?? [],
      organized_events: idx.organized_events.get(node.id) ?? [],
      client_events: idx.client_events.get(node.id) ?? [],
      products_from_events:
        node.kind === "organizer"
          ? productsFromOrganizedEvents(node.id, registry, idx)
          : [],
      proves: idx.proves.get(node.id) ?? [],
      proofs_about: idx.proofs_about.get(node.id) ?? [],
      works_about: idx.works_about.get(node.id) ?? [],
      proofs_issued: idx.proofs_issued.get(node.id) ?? [],
    },
  };
}

/**
 * Quick check: does this node have ANY provenance data worth rendering?
 * Used by ProvenancePanel to decide whether to mount.
 */
export function hasAnyProvenance(p: Provenance): boolean {
  return (
    p.presented_at.length > 0 ||
    p.products.length > 0 ||
    p.organizer.length > 0 ||
    p.client.length > 0 ||
    p.proofs.length > 0 ||
    p.proof_of.length > 0 ||
    p.about.length > 0 ||
    p.issued_by.length > 0 ||
    p.media.length > 0 ||
    p.inverse.presented_here.length > 0 ||
    p.inverse.shown_in.length > 0 ||
    p.inverse.organized_events.length > 0 ||
    p.inverse.client_events.length > 0 ||
    p.inverse.products_from_events.length > 0 ||
    p.inverse.proves.length > 0 ||
    p.inverse.proofs_about.length > 0 ||
    p.inverse.works_about.length > 0 ||
    p.inverse.proofs_issued.length > 0
  );
}
