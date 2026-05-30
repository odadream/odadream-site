// Dump the current navigation tree (parent → children) into a markdown
// document for review / hand-editing.
// Usage:  npm run audit:structure
// Output: content-keeper/STRUCTURE-CURRENT.md

import fs from "node:fs";
import path from "node:path";
import { ROOT, CONTENT_DIR, listContentFiles, readMd } from "../migrate/lib.js";

const OUT = path.join(ROOT, "content-keeper", "STRUCTURE-CURRENT.md");

const nodes = new Map();
for (const { file, path: p } of listContentFiles()) {
  if (file.startsWith("_")) continue;
  const md = readMd(p);
  if (!md?.fm?.id) continue;
  nodes.set(md.fm.id, md.fm);
}

const childrenOf = new Map();
const orphans = [];
for (const [id, fm] of nodes) {
  if (!fm.parent) { orphans.push(id); continue; }
  if (!nodes.has(fm.parent)) { orphans.push(id); continue; }
  if (!childrenOf.has(fm.parent)) childrenOf.set(fm.parent, []);
  childrenOf.get(fm.parent).push(id);
}
for (const arr of childrenOf.values()) {
  arr.sort((a, b) => {
    const oa = nodes.get(a).order ?? 999;
    const ob = nodes.get(b).order ?? 999;
    if (oa !== ob) return oa - ob;
    return a.localeCompare(b);
  });
}

const rootCandidates = [...nodes.keys()].filter(
  (id) => !nodes.get(id).parent && childrenOf.has(id),
);

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

const lines = [];
const visited = new Set();
const walk = (id, depth) => {
  if (visited.has(id)) return;
  visited.add(id);
  const fm = nodes.get(id);
  lines.push(`${"  ".repeat(depth)}- **\`${id}\`** — ${titleOf(fm)}${metaOf(fm)}`);
  const kids = childrenOf.get(id);
  if (kids) for (const k of kids) walk(k, depth + 1);
};

lines.push("# Current content hierarchy", "");
lines.push(`Generated: ${new Date().toISOString()}`, "");
lines.push("Authoritative snapshot of `parent` relationships across all nodes in `src/content/`.", "");
for (const root of rootCandidates) {
  lines.push(`## Root: \`${root}\``, "");
  walk(root, 0);
  lines.push("");
}

const unreached = [...nodes.keys()].filter((id) => !visited.has(id));
if (unreached.length) {
  lines.push("## Unreached from any root", "");
  for (const id of unreached.sort()) {
    const fm = nodes.get(id);
    lines.push(`- **\`${id}\`** — ${titleOf(fm)}${metaOf(fm)}  ← parent: \`${fm.parent ?? "(none)"}\``);
  }
  lines.push("");
}

lines.push("## Cap diagnostics (LOTUS_GRID_LIMIT = 8)", "");
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

lines.push("", "## Summary", "");
lines.push(`- Total nodes: ${nodes.size}`);
lines.push(`- Reached from root: ${visited.size}`);
lines.push(`- Orphans / unreached: ${unreached.length}`);
lines.push(`- Branches ≥ 8 children: ${overCap.length}`);

fs.writeFileSync(OUT, lines.join("\n") + "\n", "utf8");
console.log(`Wrote ${OUT}`);
console.log(`  nodes: ${nodes.size}, reached: ${visited.size}, orphans: ${unreached.length}, overCap: ${overCap.length}`);
