// Phase F+ — bridge filename-based Obsidian links with id-based site routing.
// For every .md whose `id` differs from its filename stem, ensure `aliases`
// includes that id so `[[<id>]]` resolves natively in Obsidian.
// Idempotent: skips files where the alias is already present.
// Dry-run by default; --write to apply.

import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR, readMd, writeMd, log } from "../migrate/lib.js";

const WRITE = process.argv.includes("--write");

const stats = { added: 0, alreadyOk: 0, sameStem: 0, noId: 0 };

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));

for (const file of files) {
  const p = path.join(CONTENT_DIR, file);
  const md = readMd(p);
  if (!md?.fm?.id) { stats.noId++; continue; }
  const { fm, body } = md;
  const stem = file.replace(/\.md$/, "");
  if (fm.id === stem) { stats.sameStem++; continue; }

  const current = Array.isArray(fm.aliases) ? [...fm.aliases]
                : typeof fm.aliases === "string" ? [fm.aliases]
                : [];
  if (current.includes(fm.id)) { stats.alreadyOk++; continue; }

  current.push(fm.id);
  fm.aliases = current;
  writeMd(p, fm, body, { dryRun: !WRITE });
  stats.added++;
  log("ok", file, `alias += "${fm.id}"`);
}

console.log("\n══ SUMMARY ══════════════════════════════════");
console.log(`  ${WRITE ? "✏️  [WRITE]" : "🔍 [DRY RUN]"}`);
console.log(`  aliases added:        ${stats.added}`);
console.log(`  already had alias:    ${stats.alreadyOk}`);
console.log(`  filename === id:      ${stats.sameStem}`);
console.log(`  no id (hub/index):    ${stats.noId}`);
if (!WRITE) console.log("\n→ Run with --write to apply.");
