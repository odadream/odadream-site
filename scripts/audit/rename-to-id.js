// Phase F+ — rename .md files so filename === id, then strip the now-redundant
// `aliases: [<id>]` line that add-aliases.js wrote.
// Uses `git mv` to preserve history. Dry-run by default; --write to apply.
// Skips files where filename already matches id, where id is missing, and where
// the target <id>.md already exists (collision — flagged).

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { CONTENT_DIR, readMd, writeMd, log } from "../migrate/lib.js";

const WRITE = process.argv.includes("--write");

const stats = { renamed: 0, aliasStripped: 0, sameStem: 0, noId: 0, collisions: [] };
const plan = []; // {oldPath, newPath, fm, body}

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));

// ── Pass 1: build rename plan, detect collisions ──
for (const file of files) {
  const oldPath = path.join(CONTENT_DIR, file);
  const md = readMd(oldPath);
  if (!md?.fm?.id) { stats.noId++; continue; }
  const stem = file.replace(/\.md$/, "");
  if (md.fm.id === stem) { stats.sameStem++; continue; }
  const newName = `${md.fm.id}.md`;
  const newPath = path.join(CONTENT_DIR, newName);
  if (fs.existsSync(newPath)) {
    stats.collisions.push({ old: file, target: newName });
    log("warn", file, `target ${newName} already exists — skipping`);
    continue;
  }
  plan.push({ oldPath, newPath, oldFile: file, newFile: newName, md });
}

// ── Pass 2: apply ──
for (const item of plan) {
  if (WRITE) {
    // git mv preserves history; relative paths for portability
    const rel = (p) => path.relative(process.cwd(), p).replace(/\\/g, "/");
    execSync(`git mv "${rel(item.oldPath)}" "${rel(item.newPath)}"`, { stdio: "pipe" });
  }
  stats.renamed++;
  log("ok", `${item.oldFile} → ${item.newFile}`);

  // Strip redundant alias entry
  const fm = { ...item.md.fm };
  if (Array.isArray(fm.aliases)) {
    const next = fm.aliases.filter((a) => a !== fm.id);
    if (next.length === 0) delete fm.aliases;
    else if (next.length !== fm.aliases.length) fm.aliases = next;
    else continue;
    if (WRITE) writeMd(item.newPath, fm, item.md.body, { dryRun: false });
    stats.aliasStripped++;
  }
}

console.log("\n══ SUMMARY ══════════════════════════════════");
console.log(`  ${WRITE ? "✏️  [WRITE]" : "🔍 [DRY RUN]"}`);
console.log(`  files renamed:        ${stats.renamed}`);
console.log(`  aliases stripped:     ${stats.aliasStripped}`);
console.log(`  filename === id:      ${stats.sameStem}`);
console.log(`  no id:                ${stats.noId}`);
console.log(`  collisions (skipped): ${stats.collisions.length}`);
for (const c of stats.collisions) console.log(`    - ${c.old} → ${c.target}`);
if (!WRITE) console.log("\n→ Run with --write to apply.");
