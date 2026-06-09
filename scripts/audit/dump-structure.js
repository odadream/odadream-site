// Dump the current navigation tree (parent → children) into a markdown
// document, so it can be edited by hand as a reorganization brief.
// Usage:  npm run audit:structure
// Output: content-keeper/STRUCTURE-CURRENT.md

import fs from "node:fs";
import path from "node:path";
import { ROOT, CONTENT_DIR, listContentFiles, readMd } from "../migrate/lib.js";

const OUT = path.join(ROOT, "content-keeper", "STRUCTURE-CURRENT.md");

// ── 1. Load all nodes ──
const nodes = new Map(); // id → { fm }
for (const { file, path: p } of listContentFiles()) {
  if (file.startsWith("_")) continue;
  const md = readMd(p);
  if (!md?.fm?.id) continue;
  nodes.set(md.fm.id, md.fm);
}

// ── 2. Build parent → children index ──
const childrenOf = new Map(); // parentId → [id...]
const orphans = []; // ids whose parent does not resolve
for (const [id, fm] of nodes) {
  if (!fm.parent) { orphans.push(id); continue; }
  if (!nodes.has(fm.parent)) { orphans.push(id); continue; }
  if (!childrenOf.has(fm.parent)) childrenOf.set(fm.parent, []);
  childrenOf.get(fm.parent).push(id);
}

// Sort each siblings list by `order` (if set) then by id.
for (const arr of childrenOf.values()) {
  arr.sort((a, b) => {
    const oa = nodes.get(a).order ?? 999;
    const ob = nodes.get(b).order ?? 999;
    if (oa !== ob) return oa - ob;
    return a.localeCompare(b);
  });
}

// ── 3. Find the root ──
// Convention: nodes that have no parent OR whose parent is missing AND who
// themselves have children are roots. In practice there's one root: hub-home.
const rootCandidates = [...nodes.keys()].filter(
  (id) => !nodes.get(id).parent && childrenOf.has(id),
);

// ── 4. Walk + render ──
const lines = [];
const visited = new Set();

const titleOf = (fm) => {
  const en = fm.title_en ?? fm.title?.en ?? "";
  const ru = fm.title_ru ?? fm.title?.ru ?? "";
  if (en && ru && en !== ru) return `${en} / ${ru}`;
  return en || ru || "(no title)";
};

const metaOf = (fm) => {
  const parts = [];
  if (fm.kind) parts.push(`kind: ${fm.kind}`);
  if (fm.subkind) parts.push(`subkind: ${fm.subkind}`);
  if (fm.type && fm.type !== "content") parts.push(`type: ${fm.type}`);
  return parts.length ? ` _[${parts.join(", ")}]_` : "";
};

const walk = (id, depth) => {
  if (visited.has(id)) return;
  visited.add(id);
  const fm = nodes.get(id);
  const indent = "  ".repeat(depth);
  lines.push(`${indent}- **\`${id}\`** — ${titleOf(fm)}${metaOf(fm)}`);
  const kids = childrenOf.get(id);
  if (kids) for (const k of kids) walk(k, depth + 1);
};

lines.push("# Current content hierarchy");
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");
lines.push("Authoritative snapshot of `parent` relationships across all 154 nodes in `src/content/`. Each line: id — title_en / title_ru, with kind/subkind in brackets. Indent = nesting depth.");
lines.push("");
lines.push("Use this as the editing surface to design the new tree. Move/group lines manually, then a migration script can apply the changes.");
lines.push("");

for (const root of rootCandidates) {
  lines.push(`## Root: \`${root}\``);
  lines.push("");
  walk(root, 0);
  lines.push("");
}

// ── 5. Orphans + unreached ──
const unreached = [...nodes.keys()].filter((id) => !visited.has(id));
if (unreached.length) {
  lines.push("## Unreached from any root (orphans)");
  lines.push("");
  for (const id of unreached.sort()) {
    const fm = nodes.get(id);
    lines.push(`- **\`${id}\`** — ${titleOf(fm)}${metaOf(fm)}  ← parent: \`${fm.parent ?? "(none)"}\``);
  }
  lines.push("");
}

// ── 6. Cap diagnostics ──
lines.push("## Cap diagnostics (LOTUS_GRID_LIMIT = 8)");
lines.push("");
lines.push("Branches where direct child count is at or beyond cap, requiring restructuring:");
lines.push("");
const overCap = [];
for (const [parentId, kids] of childrenOf) {
  if (kids.length >= 8) overCap.push({ parentId, count: kids.length });
}
overCap.sort((a, b) => b.count - a.count);
if (!overCap.length) lines.push("_None — every branch ≤ 7 children._");
else for (const o of overCap) {
  const fm = nodes.get(o.parentId);
  lines.push(`- **\`${o.parentId}\`** — ${titleOf(fm)} → **${o.count}** children${o.count > 8 ? " ❌" : " ⚠"}`);
}

lines.push("");
lines.push("## Summary");
lines.push("");
lines.push(`- Total nodes: ${nodes.size}`);
lines.push(`- Reached from root: ${visited.size}`);
lines.push(`- Orphans / unreached: ${unreached.length}`);
lines.push(`- Branches ≥ 8 children: ${overCap.length}`);

fs.writeFileSync(OUT, lines.join("\n") + "\n", "utf8");
console.log(`Wrote ${OUT}`);
console.log(`  nodes: ${nodes.size}, reached: ${visited.size}, orphans: ${unreached.length}, overCap: ${overCap.length}`);
