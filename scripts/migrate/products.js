// Mark all product nodes with kind+subkind.
// Source of truth (priority order):
//   1. data/registry/works.yaml — node.id + category → subkind
//   2. parent heuristic — for products not in works.yaml
//
// Skips: hub nodes (works-art, works-tech, etc), already-migrated (kind present),
// non-product files (proofs, orgs, events).

import { listContentFiles, readMd, writeMd, readYaml, log } from "./lib.js";

const PARENT_SUBKIND = {
  research: "art",
  lectures: "education",
  practices: "education",
  games: "game",
  objects: "art",
  "works-tech": "tech",
  "works-education": "education",
};

const HUB_IDS = new Set([
  "works", "works-art", "works-education", "works-tech",
  "lectures", "practices", "games", "objects", "research",
]);

const WORKS_CATEGORY = {
  art: "art",
  education: "education",
  tech: "tech",
};

export function runProducts({ dryRun }) {
  const works = readYaml("works.yaml") ?? [];
  // node id → category
  const nodeToCat = new Map();
  for (const w of works) {
    if (w.node && w.category) nodeToCat.set(w.node, WORKS_CATEGORY[w.category]);
  }

  let updated = 0, skipped = 0, unknown = 0;
  for (const { file, path: p } of listContentFiles()) {
    if (file.startsWith("_")) continue;
    const md = readMd(p);
    if (!md?.fm?.id) continue;
    const id = md.fm.id;
    if (HUB_IDS.has(id)) continue;
    if (id.startsWith("org-")) continue;
    if (id.startsWith("eng-")) continue;
    if (id.startsWith("proof-")) continue;
    if (id.startsWith("work-")) continue;
    if (id.startsWith("byob-")) continue;
    if (id.startsWith("collab")) continue;
    if (id.startsWith("debug")) continue;
    if (md.fm.parent === "collab") continue;
    // Curated event hubs (parent: events) that aren't in works.yaml — skip.
    if (md.fm.parent === "events" && !nodeToCat.has(id)) continue;
    if (["home", "changelog", "contacts", "manifesto", "cv", "team",
         "press", "testimonials", "letters", "world", "registry",
         "registry-orgs", "registry-commercial", "registry-expert",
         "events", "byob", "navigator", "for-business", "for-institutions",
         "for-galleries", "for-artists", "for-agents", "for-events",
         "for-education"].includes(id)) continue;

    // Subkind resolution
    let subkind = nodeToCat.get(id) ?? PARENT_SUBKIND[md.fm.parent];

    if (md.fm.kind) {
      skipped++;
      continue;
    }
    if (!subkind) {
      // Try parent of parent? Skip for now with warning.
      unknown++;
      log("warn", file, `no subkind (parent=${md.fm.parent})`);
      continue;
    }

    md.fm.kind = "product";
    md.fm.subkind = subkind;
    writeMd(p, md.fm, md.body, { dryRun });
    updated++;
    log("ok", file, `→ product/${subkind}`);
  }
  return { name: "products", updated, skipped, unknown };
}
