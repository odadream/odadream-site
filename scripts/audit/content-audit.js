// Phase F — content audit. Read-only. Produces three artifacts in content-keeper/:
//   PHASE-F-AUDIT.md   — human-readable report
//   PHASE-F-AUDIT.json — machine snapshot (for delta diffs across reruns)
//   PHASE-F-TODO.md    — list of stub entities to create + unresolved actions
//
// Single pass over src/content/*.md, _templates/*.md, data/registry/*.yaml,
// src/data/media.ts. Uses scripts/migrate/lib.js helpers.

import fs from "node:fs";
import path from "node:path";
import { ROOT, CONTENT_DIR, listContentFiles, readMd, readYaml } from "../migrate/lib.js";

const OUT_DIR = path.join(ROOT, "content-keeper");
const TEMPLATES_DIR = path.join(CONTENT_DIR, "_templates");
const MEDIA_TS = path.join(ROOT, "src/data/media.ts");

// ──────────────────────────────────────────────────────────────────
// Field requirements per kind. Derived from templates but pruned to
// fields that meaningfully MUST be set (vs template scaffolding).
// ──────────────────────────────────────────────────────────────────
const REQUIRED = {
  product:   ["kind", "subkind", "parent", "title_en", "title_ru"],
  event:     ["kind", "subkind", "parent", "title_en", "title_ru", "date_start"],
  organizer: ["kind", "subkind", "parent", "title_en", "title_ru"],
  proof:     ["kind", "subkind", "parent", "title_en", "title_ru", "proof_of"],
  media:     ["kind", "subkind", "parent", "title_en", "title_ru", "about"],
};

const REL_FIELDS = [
  "presented_at", "products", "organizer", "client",
  "proofs", "proof_of", "about", "issued_by",
];

const KIND_PREFIX = [
  [/^proof-/, "proof"],
  [/^org-/,   "organizer"],
  [/^event-/, "event"],
  [/^media-/, "media"],
  [/^hub-/,   "hub"],
];

function guessKindFromId(id) {
  for (const [re, k] of KIND_PREFIX) if (re.test(id)) return k;
  return "product";
}

// Mirror src/utils/frontmatter.ts: "[[id]]" → "id", "[[id|alias]]" → "id".
const unwrapWikilink = (s) => {
  if (typeof s !== "string") return s;
  const m = s.match(/^\[\[([^\]|]+)(?:\|[^\]]*)?\]\]$/);
  return m ? m[1].trim() : s;
};

const isEmpty = (v) =>
  v === undefined || v === null || v === "" ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);

// ──────────────────────────────────────────────────────────────────
// Pass 1 — load registry + media subjects
// ──────────────────────────────────────────────────────────────────
const files = listContentFiles().filter((f) => !f.file.startsWith("_"));
const nodes = new Map(); // id → { fm, body, file }
for (const { file, path: p } of files) {
  const md = readMd(p);
  if (!md?.fm?.id) continue;
  nodes.set(md.fm.id, { ...md, file });
}

// MEDIA subject reverse: id → asset count referencing it.
// Cheap regex parse — we only need subject keys.
const mediaText = fs.readFileSync(MEDIA_TS, "utf8");
const MEDIA_SUBJECTS = new Map(); // nodeId → Set<assetId>
{
  const ENTRY_RE = /^  "([\w-]+)": \{([\s\S]*?)^  \},/gm;
  let m;
  while ((m = ENTRY_RE.exec(mediaText))) {
    const aid = m[1];
    const block = m[2];
    const sm = block.match(/subject:\s*\[([^\]]*)\]/);
    if (!sm) continue;
    const ids = sm[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    for (const nid of ids) {
      if (!MEDIA_SUBJECTS.has(nid)) MEDIA_SUBJECTS.set(nid, new Set());
      MEDIA_SUBJECTS.get(nid).add(aid);
    }
  }
}

// Proofs registry
let proofsYaml = [];
try { proofsYaml = readYaml("proofs.yaml") ?? []; } catch { proofsYaml = []; }
const proofsYamlIds = new Set(
  proofsYaml.map((r) => r.site_node || (r.id ? `proof-${r.id}` : null)).filter(Boolean),
);
const proofMdIds = new Set([...nodes.values()].filter((n) => n.fm.kind === "proof").map((n) => n.fm.id));

// ──────────────────────────────────────────────────────────────────
// Pass 2 — per-node checks: conformance + body smells + relations
// ──────────────────────────────────────────────────────────────────
const report = {
  conformance: [],     // {id, file, missing[]}
  bodySmells: [],      // {id, file, smell, detail}
  missingRefs: new Map(), // missingId → {kind, referencedBy: Set<id>}
  orphans: [],         // {id, kind}
  duplicates: [],      // [{a, b, reason}]
  proofDrift: { mdOnly: [], yamlOnly: [], missingRelations: [] },
  gratitude: [],       // {id, file, hasLink}
  counts: { byKind: {}, total: nodes.size },
};

// Title normalization for duplicate detection
const norm = (s) => String(s ?? "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
const titleIndex = new Map(); // normTitle → [id]

// Inverse reference index
const inboundRefs = new Map(); // id → Set<sourceId>
const addRef = (target, source) => {
  if (!inboundRefs.has(target)) inboundRefs.set(target, new Set());
  inboundRefs.get(target).add(source);
};

for (const node of nodes.values()) {
  const { fm, body, file } = node;
  const id = fm.id;

  // counts
  const k = fm.kind || "(no kind)";
  report.counts.byKind[k] = (report.counts.byKind[k] || 0) + 1;

  // title index for duplicate detection (only same-kind comparisons matter)
  if (fm.title_en) {
    const key = `${fm.kind}::${norm(fm.title_en)}`;
    if (!titleIndex.has(key)) titleIndex.set(key, []);
    titleIndex.get(key).push(id);
  }

  // 1. Conformance
  const required = REQUIRED[fm.kind];
  if (required) {
    const missing = required.filter((f) => isEmpty(fm[f]));
    if (missing.length) report.conformance.push({ id, file, missing });
  }

  // 2. Inverse-reference + missing target collection
  for (const field of REL_FIELDS) {
    const arr = fm[field];
    if (!Array.isArray(arr)) continue;
    for (const raw of arr) {
      if (!raw || typeof raw !== "string") continue;
      const targetId = unwrapWikilink(raw);
      addRef(targetId, id);
      if (!nodes.has(targetId)) {
        if (!report.missingRefs.has(targetId)) {
          report.missingRefs.set(targetId, {
            kind: guessKindFromId(targetId),
            referencedBy: new Set(),
          });
        }
        report.missingRefs.get(targetId).referencedBy.add(`${id}.${field}`);
      }
    }
  }

  // 3. Body smells (post ---RU--- split: scan WHOLE body — duplication can be in either)
  const bodyStr = String(body ?? "");
  if (bodyStr) {
    // (a) consecutive `- [[…]]` lines
    const linkBlockMatches = bodyStr.match(/(?:^|\n)((?:[ \t]*-[ \t]*\[\[[^\]]+\]\][^\n]*\n){3,})/g);
    if (linkBlockMatches) {
      const count = linkBlockMatches.reduce((s, b) => s + (b.match(/-[ \t]*\[\[/g) || []).length, 0);
      report.bodySmells.push({ id, file, smell: "manual-link-list", detail: `${count} link bullets in ${linkBlockMatches.length} block(s)` });
    }
    // (b) provenance-duplicate headers (avoid generic "Media" which collides with press channels)
    const headerRe = /^##+\s+(Связи|Проекты|События(?!\s+ODA)|Материалы|Партн[её]ры|Организаторы|Пруфы|Proofs|Provenance)\b/gim;
    const hits = [...bodyStr.matchAll(headerRe)].map((m) => m[1]);
    if (hits.length) report.bodySmells.push({ id, file, smell: "provenance-header", detail: hits.join(", ") });
    // (c) gratitude letter mention — only flag when it's NOT a generic link to the
    // letters hub. Descriptive prose like "see [[letters | благодарств…]]" or the
    // hubs themselves (collab-*, world) are not actionable.
    const gratitudeRe = /благодарств|gratitude letter/i;
    const isGenericReference =
      id === "hub-host-events" || id === "hub-letters" ||
      id === "hub-world"       || id === "hub-press"   ||
      id === "hub-testimonials";
    if (gratitudeRe.test(bodyStr) && !isGenericReference) {
      const hasOwnProof = Array.isArray(fm.proofs) && fm.proofs.length > 0;
      const isProof = fm.kind === "proof";
      report.gratitude.push({ id, file, hasLink: hasOwnProof || isProof });
    }
  }
}

// 4. Duplicates from title index — only when the title is non-empty.
for (const [key, ids] of titleIndex) {
  if (ids.length <= 1) continue;
  const [, normTitle] = key.split("::");
  if (!normTitle) continue;
  report.duplicates.push({ ids, reason: `same title_en (${key.split("::")[0]})` });
}

// 5. Orphans: nodes with kind but no inbound references and not a top-level hub-child.
// Terminal nodes (proof with proof_of, media with about) are not orphans — they're
// documentation leaves anchored by their own outbound refs.
const isTerminalAnchored = (n) => {
  if (n.fm.kind === "proof"  && Array.isArray(n.fm.proof_of) && n.fm.proof_of.length) return true;
  if (n.fm.kind === "media"  && Array.isArray(n.fm.about)    && n.fm.about.length)    return true;
  return false;
};
for (const node of nodes.values()) {
  if (!node.fm.kind) continue;
  if (inboundRefs.has(node.fm.id)) continue;
  if (isTerminalAnchored(node)) continue;
  let hasChildren = false;
  for (const other of nodes.values()) {
    if (other.fm.parent === node.fm.id) { hasChildren = true; break; }
  }
  if (hasChildren) continue;
  report.orphans.push({ id: node.fm.id, kind: node.fm.kind, file: node.file });
}

// 6. Proof drift
for (const id of proofMdIds) if (!proofsYamlIds.has(id)) report.proofDrift.mdOnly.push(id);
for (const id of proofsYamlIds) if (!proofMdIds.has(id)) report.proofDrift.yamlOnly.push(id);
for (const node of nodes.values()) {
  if (node.fm.kind !== "proof") continue;
  const missing = [];
  if (isEmpty(node.fm.proof_of)) missing.push("proof_of");
  if (isEmpty(node.fm.issued_by)) missing.push("issued_by");
  if (missing.length) report.proofDrift.missingRelations.push({ id: node.fm.id, missing });
}

// ──────────────────────────────────────────────────────────────────
// Emit artifacts
// ──────────────────────────────────────────────────────────────────
fs.mkdirSync(OUT_DIR, { recursive: true });

const jsonReport = {
  generated_at: new Date().toISOString(),
  counts: report.counts,
  conformance_gaps: report.conformance.length,
  body_smells: report.bodySmells.length,
  missing_refs: report.missingRefs.size,
  orphans: report.orphans.length,
  duplicates: report.duplicates.length,
  proof_drift: {
    md_only: report.proofDrift.mdOnly.length,
    yaml_only: report.proofDrift.yamlOnly.length,
    missing_relations: report.proofDrift.missingRelations.length,
  },
  gratitude_mentions: report.gratitude.length,
  gratitude_without_link: report.gratitude.filter((g) => !g.hasLink).length,
  detail: {
    conformance: report.conformance,
    bodySmells: report.bodySmells,
    missingRefs: [...report.missingRefs.entries()].map(([id, v]) => ({
      id, kind_guess: v.kind, referenced_by: [...v.referencedBy],
    })),
    orphans: report.orphans,
    duplicates: report.duplicates,
    proofDrift: report.proofDrift,
    gratitude: report.gratitude,
  },
};

fs.writeFileSync(path.join(OUT_DIR, "PHASE-F-AUDIT.json"), JSON.stringify(jsonReport, null, 2), "utf8");

// Markdown report
const md = [];
md.push("# Phase F — Content audit");
md.push("");
md.push(`Generated: ${jsonReport.generated_at}`);
md.push("");
md.push("## Summary");
md.push("");
md.push(`- Total nodes: **${report.counts.total}**`);
for (const [k, c] of Object.entries(report.counts.byKind).sort()) md.push(`  - ${k}: ${c}`);
md.push(`- Conformance gaps: **${report.conformance.length}**`);
md.push(`- Body smells: **${report.bodySmells.length}**`);
md.push(`- Missing referenced ids: **${report.missingRefs.size}**`);
md.push(`- Orphan nodes: **${report.orphans.length}**`);
md.push(`- Duplicate candidates: **${report.duplicates.length}**`);
md.push(`- Proof drift — md-only / yaml-only / no-relations: **${report.proofDrift.mdOnly.length} / ${report.proofDrift.yamlOnly.length} / ${report.proofDrift.missingRelations.length}**`);
md.push(`- Gratitude mentions / without link: **${report.gratitude.length} / ${report.gratitude.filter((g) => !g.hasLink).length}**`);

md.push("\n## 1. Conformance gaps\n");
if (!report.conformance.length) md.push("_None — all kinded nodes have required fields._");
else for (const c of report.conformance) md.push(`- \`${c.file}\` (id: ${c.id}) — missing: ${c.missing.join(", ")}`);

md.push("\n## 2. Body smells\n");
if (!report.bodySmells.length) md.push("_None._");
else {
  const grouped = {};
  for (const s of report.bodySmells) (grouped[s.smell] ||= []).push(s);
  for (const [smell, list] of Object.entries(grouped)) {
    md.push(`### ${smell} (${list.length})`);
    for (const s of list) md.push(`- \`${s.file}\` — ${s.detail}`);
  }
}

md.push("\n## 3. Missing referenced ids (→ stubs)\n");
if (!report.missingRefs.size) md.push("_None — every wikilink resolves._");
else {
  md.push("| missing_id | kind_guess | referenced_by |");
  md.push("|---|---|---|");
  for (const [id, v] of [...report.missingRefs.entries()].sort()) {
    md.push(`| \`${id}\` | ${v.kind} | ${[...v.referencedBy].join(", ")} |`);
  }
}

md.push("\n## 4. Orphan nodes (no inbound refs, no children)\n");
if (!report.orphans.length) md.push("_None._");
else for (const o of report.orphans) md.push(`- \`${o.file}\` (kind: ${o.kind})`);

md.push("\n## 5. Duplicate candidates (same title_en within kind)\n");
if (!report.duplicates.length) md.push("_None._");
else for (const d of report.duplicates) md.push(`- ${d.ids.map((i) => `\`${i}\``).join(" ⇄ ")} — ${d.reason}`);

md.push("\n## 6. Proof drift\n");
md.push(`### Md-only (in src/content/ but not in proofs.yaml) — ${report.proofDrift.mdOnly.length}`);
for (const id of report.proofDrift.mdOnly) md.push(`- \`${id}\``);
md.push(`### Yaml-only (in proofs.yaml but no .md) — ${report.proofDrift.yamlOnly.length}`);
for (const id of report.proofDrift.yamlOnly) md.push(`- \`${id}\``);
md.push(`### Proofs missing required relations — ${report.proofDrift.missingRelations.length}`);
for (const r of report.proofDrift.missingRelations) md.push(`- \`${r.id}\` — missing: ${r.missing.join(", ")}`);

md.push("\n## 7. Gratitude-letter mentions\n");
if (!report.gratitude.length) md.push("_None._");
else for (const g of report.gratitude) md.push(`- \`${g.file}\` — has proof link: ${g.hasLink ? "yes" : "**NO**"}`);

fs.writeFileSync(path.join(OUT_DIR, "PHASE-F-AUDIT.md"), md.join("\n") + "\n", "utf8");

// TODO file — grouped by actor (script-fixable vs registry-data vs human-decision)
const todo = [];
todo.push("# Phase F — TODO");
todo.push("");
todo.push(`Generated: ${jsonReport.generated_at}`);
todo.push("");
todo.push("Items are grouped by **who fixes them** so non-trivial work isn't blocked on mechanical tasks.");
todo.push("");

todo.push("## A. Auto-fixable (run `node scripts/audit/fix-conformance.js --write`)");
todo.push("");
todo.push("Already applied at last fix run. Re-run if registry yamls change.");
todo.push("");

todo.push("## B. Registry data — add fields to `data/registry/proofs.yaml`");
todo.push("");
todo.push("These proofs lack `proof_of` / `issued_by` because the source YAML record has no `work` / `eng` / `org`. Add the missing keys to the YAML, then re-run the Phase C proof migrator.");
todo.push("");
for (const c of report.conformance) {
  todo.push(`- \`${c.id}\` — missing: ${c.missing.join(", ")}`);
}
for (const r of report.proofDrift.missingRelations) {
  todo.push(`- \`${r.id}\` — missing: ${r.missing.join(", ")}`);
}
todo.push("");

todo.push("## C. Phase B pilots not in registry");
todo.push("");
todo.push("Pilot proof .md files exist without a matching record in `proofs.yaml`. Either back-fill the YAML or accept them as content-authored:");
todo.push("");
for (const id of report.proofDrift.mdOnly) todo.push(`- \`${id}\``);
todo.push("");

todo.push("## D. Stubs to create");
todo.push("");
if (!report.missingRefs.size) todo.push("_None — every wikilink resolves._");
else {
  todo.push("| missing_id | kind_guess | referenced_by |");
  todo.push("|---|---|---|");
  for (const [id, v] of [...report.missingRefs.entries()].sort()) {
    todo.push(`| \`${id}\` | ${v.kind} | ${[...v.referencedBy].slice(0, 5).join("; ")} |`);
  }
}
todo.push("");

todo.push("## E. Human decision — duplicates");
todo.push("");
if (!report.duplicates.length) todo.push("_None._");
else for (const d of report.duplicates) todo.push(`- ${d.ids.map((i) => `\`${i}\``).join(" ⇄ ")} — ${d.reason}. Decide: rename, merge, or keep (different audiences).`);
todo.push("");

todo.push("## F. Human decision — body smells");
todo.push("");
todo.push("Hub pages contain bullet lists of `[[…]]`. These are navigation by hand. Decision per file:");
todo.push("- **keep** — list is the page (e.g. landing hubs `events.md`, `lectures.md`).");
todo.push("- **convert to `.base`** — large registries (`registry-expert.md` with 18 bullets, `collab-agents.md` with 40).");
todo.push("- **delete + render computed inverse** — when the same data is already on referenced nodes (e.g. `works-art.md`).");
todo.push("");
for (const s of report.bodySmells) todo.push(`- \`${s.file}\` — ${s.detail}`);
todo.push("");

todo.push("## G. Orphans (informational)");
todo.push("");
todo.push(`Total: ${report.orphans.length}. These are leaf nodes nobody points at and that anchor nothing themselves. Many are legitimate (standalone lectures, untouched practices). Audit list:`);
todo.push("");
for (const o of report.orphans) todo.push(`- \`${o.file}\` (kind: ${o.kind})`);

fs.writeFileSync(path.join(OUT_DIR, "PHASE-F-TODO.md"), todo.join("\n") + "\n", "utf8");

// stdout summary
console.log("\n══ Phase F audit ══════════════════════════════");
console.log(`  Total nodes:       ${report.counts.total}`);
console.log(`  Conformance gaps:  ${report.conformance.length}`);
console.log(`  Body smells:       ${report.bodySmells.length}`);
console.log(`  Missing refs:      ${report.missingRefs.size}`);
console.log(`  Orphans:           ${report.orphans.length}`);
console.log(`  Duplicates:        ${report.duplicates.length}`);
console.log(`  Proof drift:       ${report.proofDrift.mdOnly.length} md-only / ${report.proofDrift.yamlOnly.length} yaml-only / ${report.proofDrift.missingRelations.length} no-rel`);
console.log(`  Gratitude:         ${report.gratitude.length} total / ${report.gratitude.filter((g) => !g.hasLink).length} unlinked`);
console.log("\n  Wrote: content-keeper/PHASE-F-AUDIT.{md,json} + PHASE-F-TODO.md");
