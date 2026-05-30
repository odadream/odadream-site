// Phase F+ — align all kind-prefixes with the 5 entity model and unify hubs.
//   eng-*    → event-*
//   byob-*   → event-byob-*  (series of events under hub-events)
//   work-*   → media-*
//   for-*    → hub-*
//   kindless → hub-* (only those without an existing recognized prefix)
//
// For each rename:
//   1. git mv (fallback to fs.renameSync for untracked files).
//   2. Textual replace of the id across src/content/*.md, data/registry/*.yaml,
//      src/data/media.ts (negative lookarounds for hyphens to avoid partial matches).
// Dry-run by default; --write to apply.

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { ROOT, CONTENT_DIR, readMd, log } from "../migrate/lib.js";

const WRITE = process.argv.includes("--write");
const REGISTRY_DIR = path.join(ROOT, "data/registry");
const MEDIA_TS = path.join(ROOT, "src/data/media.ts");

const RECOGNIZED_PREFIXES = ["event-", "org-", "media-", "proof-", "hub-"];

// ── 1. Build rename plan ──
const renames = new Map(); // oldId → newId

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));

for (const file of files) {
  const stem = file.replace(/\.md$/, "");
  const md = readMd(path.join(CONTENT_DIR, file));
  if (!md?.fm?.id) continue;
  const id = md.fm.id;
  let newId = null;

  if (id.startsWith("eng-")) {
    // Drop eng-, swap year to the end if year is in second position.
    const rest = id.slice(4);
    const m = rest.match(/^(\d{4})-(.+)$/);
    newId = m ? `event-${m[2]}-${m[1]}` : `event-${rest}`;
  } else if (id.startsWith("byob-")) {
    newId = "event-" + id; // event-byob-2019
  } else if (id.startsWith("work-")) {
    newId = "media-" + id.slice(5);
  } else if (id.startsWith("for-")) {
    // Avoid collision with `events` registry hub — landing becomes hub-host-events.
    newId = id === "for-events" ? "hub-host-events" : "hub-" + id.slice(4);
  } else if (md.fm.kind === undefined && md.fm.kind === null ? true : !md.fm.kind) {
    // kindless hub — prefix unless already prefixed
    const isAlreadyPrefixed = RECOGNIZED_PREFIXES.some((p) => id.startsWith(p));
    if (!isAlreadyPrefixed) newId = "hub-" + id;
  }

  if (newId && newId !== id) renames.set(id, newId);
}

console.log(`Planned renames: ${renames.size}`);
for (const [a, b] of [...renames].sort()) console.log(`  ${a}  →  ${b}`);

// ── 2. Apply renames (git mv → fallback fs.renameSync) ──
function safeMv(oldP, newP) {
  if (!WRITE) return;
  const rel = (p) => path.relative(process.cwd(), p).replace(/\\/g, "/");
  try {
    execSync(`git mv "${rel(oldP)}" "${rel(newP)}"`, { stdio: "pipe" });
  } catch {
    fs.renameSync(oldP, newP);
  }
}

let mvCount = 0, mvSkipped = 0;
for (const [oldId, newId] of renames) {
  const oldP = path.join(CONTENT_DIR, `${oldId}.md`);
  const newP = path.join(CONTENT_DIR, `${newId}.md`);
  if (!fs.existsSync(oldP)) { mvSkipped++; continue; }
  if (fs.existsSync(newP)) {
    log("warn", oldId, `target ${newId}.md exists — skipping`);
    mvSkipped++;
    continue;
  }
  safeMv(oldP, newP);
  mvCount++;
}

// ── 3. Textual replace across content + registry + media.ts ──
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const replaceAll = (text) => {
  let out = text;
  for (const [oldId, newId] of renames) {
    const re = new RegExp(`(?<![\\w-])${escapeRe(oldId)}(?![\\w-])`, "g");
    out = out.replace(re, newId);
  }
  return out;
};

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const raw = fs.readFileSync(filePath, "utf8");
  const out = replaceAll(raw);
  if (out === raw) return false;
  if (WRITE) fs.writeFileSync(filePath, out, "utf8");
  return true;
}

let patchedCount = 0;
const walkDir = (dir, ext) => fs.readdirSync(dir).filter((f) => f.endsWith(ext)).map((f) => path.join(dir, f));
for (const p of walkDir(CONTENT_DIR, ".md")) if (patchFile(p)) patchedCount++;
for (const p of walkDir(REGISTRY_DIR, ".yaml")) if (patchFile(p)) patchedCount++;
if (patchFile(MEDIA_TS)) patchedCount++;

console.log("\n══ SUMMARY ══════════════════════════════════");
console.log(`  ${WRITE ? "✏️  [WRITE]" : "🔍 [DRY RUN]"}`);
console.log(`  files renamed:   ${mvCount}`);
console.log(`  mv skipped:      ${mvSkipped}`);
console.log(`  files patched:   ${patchedCount}`);
if (!WRITE) console.log("\n→ Run with --write to apply.");
