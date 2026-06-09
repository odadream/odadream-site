/**
 * One-shot: rename frontmatter `date` → `updated` (page revision date).
 * Skips date_start, date_end, publication_date.
 *
 *   node scripts/migrate/rename-updated-field.js
 *   node scripts/migrate/rename-updated-field.js --dry-run
 */
import fs from "fs";
import path from "path";
import { CONTENT_DIR } from "../migrate/lib.js";

const DRY_RUN = process.argv.includes("--dry-run");

function migrateFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return false;

  const body = m[1];
  if (!/^date:\s/m.test(body)) return false;

  const nextBody = body.replace(/^date:\s/gm, "updated: ");
  const next = raw.replace(m[0], `---\n${nextBody}\n---`);
  if (!DRY_RUN) fs.writeFileSync(filePath, next, "utf8");
  return true;
}

let n = 0;
for (const name of fs.readdirSync(CONTENT_DIR)) {
  if (!name.endsWith(".md") || name.startsWith("_")) continue;
  if (migrateFile(path.join(CONTENT_DIR, name))) {
    console.log(`  ${DRY_RUN ? "~" : "✓"} ${name}`);
    n++;
  }
}
console.log(`\n${DRY_RUN ? "Would update" : "Updated"}: ${n} files`);
