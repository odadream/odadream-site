// Phase H — per-branch content readiness checklist.
// Walks subtree from a given hub id, scores each node against the per-kind
// shape defined in content-keeper/PHASE-H-PLAN.md, writes a markdown table.
//
// Usage:
//   npm run audit:checklist hub-works
//   npm run audit:checklist hub-events
//   npm run audit:checklist --all

import fs from "node:fs";
import path from "node:path";
import { ROOT, CONTENT_DIR, listContentFiles, readMd } from "../migrate/lib.js";

const args = process.argv.slice(2);
const ALL = args.includes("--all");
const ROOT_ID = args.find((a) => !a.startsWith("--")) || "hub-home";
const OUT = path.join(ROOT, "content-keeper", ALL
  ? "PHASE-H-CHECKLIST-ALL.md"
  : `PHASE-H-CHECKLIST-${ROOT_ID}.md`);

// ── Load nodes ──
const nodes = new Map();
for (const { file, path: p } of listContentFiles()) {
  if (file.startsWith("_")) continue;
  const md = readMd(p);
  if (!md?.fm?.id) continue;
  nodes.set(md.fm.id, { fm: md.fm, body: md.body, file });
}

if (!nodes.has(ROOT_ID)) {
  console.error(`unknown root: ${ROOT_ID}`);
  process.exit(1);
}

// ── Build child index ──
const childrenOf = new Map();
for (const [id, { fm }] of nodes) {
  if (!fm.parent) continue;
  if (!childrenOf.has(fm.parent)) childrenOf.set(fm.parent, []);
  childrenOf.get(fm.parent).push(id);
}

// ── Walk subtree from ROOT_ID ──
const inScope = [];
const walk = (id, depth = 0) => {
  inScope.push({ id, depth });
  for (const k of childrenOf.get(id) ?? []) walk(k, depth + 1);
};
walk(ROOT_ID);

// ── Per-kind required fields ──
const REQUIRED_BY_KIND = {
  hub:       ["title_en", "title_ru"],
  product:   ["title_en", "title_ru", "kind", "subkind", "presented_at", "media"],
  event:     ["title_en", "title_ru", "kind", "subkind", "date_start", "organizer", "products"],
  organizer: ["title_en", "title_ru", "kind", "subkind", "website"],
  proof:     ["title_en", "title_ru", "kind", "subkind", "proof_of", "issued_by"],
  media:     ["title_en", "title_ru", "kind", "subkind", "about"],
};

// Words count in EN body (anything before ---RU--- separator, after first H1/H2).
function bodySplit(body) {
  if (!body) return { en: "", ru: "" };
  const idx = body.indexOf("---RU---");
  if (idx < 0) return { en: body, ru: "" };
  return { en: body.slice(0, idx), ru: body.slice(idx + 8) };
}

const wordCount = (s) => (s.trim().match(/\b\w+\b/g) ?? []).length;

const isPlaceholder = (s) =>
  !s || /^stub|TBD|TODO|placeholder|^Loading/i.test(String(s)) || /заглушка/i.test(String(s));

function isEmptyField(v) {
  if (v === undefined || v === null || v === "") return true;
  if (Array.isArray(v) && v.length === 0) return true;
  if (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0) return true;
  return false;
}

function gradeNode({ fm, body }) {
  const kind = fm.kind ?? (fm.type === "hub" ? "hub" : null);
  const required = REQUIRED_BY_KIND[kind] ?? REQUIRED_BY_KIND.hub;

  const missing = [];
  for (const f of required) {
    if (isEmptyField(fm[f])) missing.push(f);
  }
  if (isPlaceholder(fm.title_en)) missing.push("title_en(placeholder)");
  if (isPlaceholder(fm.title_ru)) missing.push("title_ru(placeholder)");

  const { en, ru } = bodySplit(body);
  const wEn = wordCount(en);
  const wRu = wordCount(ru);
  const stubLike = /Stub|Заглушка/i.test(body ?? "");

  let status;
  if (stubLike || (wEn + wRu < 30)) status = "🔴";
  else if (missing.length > 0 || (wEn < 60) || (wRu < 60)) status = "🟡";
  else status = "🟢";

  return { kind: kind ?? "(none)", status, missing, wEn, wRu };
}

// ── Emit ──
const rows = [];
const summary = { "🔴": 0, "🟡": 0, "🟢": 0 };
for (const { id, depth } of inScope) {
  const n = nodes.get(id);
  if (!n) continue;
  const g = gradeNode(n);
  summary[g.status]++;
  const title = n.fm.title_ru || n.fm.title_en || "(no title)";
  rows.push({
    id, depth, kind: g.kind, status: g.status, missing: g.missing,
    title, wEn: g.wEn, wRu: g.wRu,
  });
}

const lines = [];
lines.push(`# Phase H — content checklist  \`${ROOT_ID}\``);
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");
lines.push(`Scope: ${inScope.length} nodes from \`${ROOT_ID}\` subtree.`);
lines.push("");
lines.push(`**Summary**: 🟢 done: **${summary["🟢"]}** · 🟡 partial: **${summary["🟡"]}** · 🔴 stub: **${summary["🔴"]}**`);
lines.push("");
lines.push("Status:");
lines.push("- 🟢 — все обязательные поля + body ≥ 60 слов EN и RU");
lines.push("- 🟡 — есть body, но не все поля ИЛИ короткий");
lines.push("- 🔴 — stub (< 30 слов суммарно) или текст-заглушка");
lines.push("");
lines.push("| Status | ID | Kind | Title | EN words | RU words | Missing |");
lines.push("|---|---|---|---|---|---|---|");
for (const r of rows) {
  const indent = "  ".repeat(r.depth);
  const miss = r.missing.length ? "`" + r.missing.join("`, `") + "`" : "—";
  lines.push(`| ${r.status} | ${indent}\`${r.id}\` | ${r.kind} | ${r.title} | ${r.wEn} | ${r.wRu} | ${miss} |`);
}

fs.writeFileSync(OUT, lines.join("\n") + "\n", "utf8");
console.log(`Wrote ${OUT}`);
console.log(`  total: ${inScope.length} · 🟢 ${summary["🟢"]} · 🟡 ${summary["🟡"]} · 🔴 ${summary["🔴"]}`);
