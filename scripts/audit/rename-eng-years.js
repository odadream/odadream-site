// Phase F+ — move year from leading position to trailing position in eng-* ids.
//   eng-2025-mipt-terraforming → eng-mipt-terraforming-2025
// Actions per renamed id:
//   1. git mv src/content/<old>.md → <new>.md
//   2. Update `id:` field inside the file.
//   3. Textual replace of every occurrence across:
//        src/content/*.md, data/registry/*.yaml, src/data/media.ts.
// Idempotent: skip files whose stem already follows the new convention.
// Dry-run by default; --write to apply.

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { ROOT, CONTENT_DIR, log } from "../migrate/lib.js";

const WRITE = process.argv.includes("--write");

const REGISTRY_DIR = path.join(ROOT, "data/registry");
const MEDIA_TS = path.join(ROOT, "src/data/media.ts");
const ENG_RE = /^eng-(\d{4})-(.+)$/;

// ── 1. Build rename map from current content/. ──
const renames = new Map(); // oldId → newId
for (const file of fs.readdirSync(CONTENT_DIR)) {
  if (!file.endsWith(".md") || file.startsWith("_")) continue;
  const stem = file.replace(/\.md$/, "");
  const m = stem.match(ENG_RE);
  if (!m) continue;
  const [, year, rest] = m;
  const newId = `eng-${rest}-${year}`;
  if (newId !== stem) renames.set(stem, newId);
}

console.log(`Planned renames: ${renames.size}`);
for (const [a, b] of renames) console.log(`  ${a}  →  ${b}`);

// ── 2. git mv files. ──
for (const [oldId, newId] of renames) {
  const oldP = path.join(CONTENT_DIR, `${oldId}.md`);
  const newP = path.join(CONTENT_DIR, `${newId}.md`);
  if (fs.existsSync(newP)) {
    log("warn", oldId, `target ${newId}.md exists — skipping mv`);
    continue;
  }
  if (WRITE) {
    const rel = (p) => path.relative(process.cwd(), p).replace(/\\/g, "/");
    execSync(`git mv "${rel(oldP)}" "${rel(newP)}"`, { stdio: "pipe" });
  }
  log("ok", `${oldId}.md → ${newId}.md`);
}

// ── 3. Build one global regex replacing all old ids → new ids
//      with negative lookarounds so adjacent word-chars don't match.
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const replaceAll = (text) => {
  let out = text;
  for (const [oldId, newId] of renames) {
    const re = new RegExp(`(?<![\\w-])${escapeRe(oldId)}(?![\\w-])`, "g");
    out = out.replace(re, newId);
  }
  return out;
};

// ── 4. Walk and patch every relevant file. ──
function patchFile(filePath, opts = {}) {
  if (!fs.existsSync(filePath)) return false;
  const raw = fs.readFileSync(filePath, "utf8");
  const out = replaceAll(raw);
  if (out === raw) return false;
  if (WRITE) fs.writeFileSync(filePath, out, "utf8");
  log("ok", path.relative(ROOT, filePath).replace(/\\/g, "/"), `${opts.label ?? "patched"}`);
  return true;
}

const stats = { mdPatched: 0, yamlPatched: 0, tsPatched: 0 };

for (const file of fs.readdirSync(CONTENT_DIR)) {
  if (!file.endsWith(".md")) continue;
  if (patchFile(path.join(CONTENT_DIR, file), { label: "content" })) stats.mdPatched++;
}
for (const file of fs.readdirSync(REGISTRY_DIR)) {
  if (!file.endsWith(".yaml")) continue;
  if (patchFile(path.join(REGISTRY_DIR, file), { label: "registry" })) stats.yamlPatched++;
}
if (patchFile(MEDIA_TS, { label: "media.ts" })) stats.tsPatched++;

console.log("\n══ SUMMARY ══════════════════════════════════");
console.log(`  ${WRITE ? "✏️  [WRITE]" : "🔍 [DRY RUN]"}`);
console.log(`  files renamed:     ${renames.size}`);
console.log(`  content .md fixes: ${stats.mdPatched}`);
console.log(`  yaml fixes:        ${stats.yamlPatched}`);
console.log(`  media.ts fixed:    ${stats.tsPatched}`);
if (!WRITE) console.log("\n→ Run with --write to apply.");
