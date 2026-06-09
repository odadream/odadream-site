/**
 * Sync frontmatter `updated` with file mtime (page revision date).
 *
 *   npm run dates:sync
 *   npm run dates:sync -- --dry-run
 *
 * Format: YYYY.MM.DD — not event date (use date_start on events).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CONTENT_DIR } from "./migrate/lib.js";

const DRY_RUN = process.argv.includes("--dry-run");

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.trim().split(".");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return new Date(year, month, day);
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const readFrontmatterField = (content, key) => {
  const fmMatch = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
  if (!fmMatch) return null;
  const re = new RegExp(`^${key}:\\s*(.+)$`, "m");
  const m = fmMatch[1].match(re);
  return m ? m[1].trim() : null;
};

const setFrontmatterField = (content, key, value) => {
  const fmMatch = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
  if (!fmMatch) {
    return `---\n${key}: ${value}\n---\n\n${content}`;
  }
  const fullBlock = fmMatch[0];
  const fmBody = fmMatch[1];
  const re = new RegExp(`^${key}:\\s*.*$`, "m");
  const updatedBody = re.test(fmBody)
    ? fmBody.replace(re, `${key}: ${value}`)
    : `${fmBody}\n${key}: ${value}`;
  return content.replace(fullBlock, `---\n${updatedBody}\n---`);
};

const run = () => {
  const mode = DRY_RUN ? " [DRY RUN]" : "";
  console.log(`\n=== SYNC updated (page revision)${mode} ===\n`);

  const files = fs.readdirSync(CONTENT_DIR).filter(
    (f) => f.endsWith(".md") && !f.startsWith("_"),
  );

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const fileName of files) {
    const filePath = path.join(CONTENT_DIR, fileName);
    try {
      const stats = fs.statSync(filePath);
      const fileDate = new Date(stats.mtime);
      const newDateStr = formatDate(fileDate);
      const content = fs.readFileSync(filePath, "utf-8");
      const currentStr =
        readFrontmatterField(content, "updated") ||
        readFrontmatterField(content, "date");
      const currentDate = parseDate(currentStr);

      if (currentDate && isSameDay(currentDate, fileDate)) {
        skipped++;
        continue;
      }

      let next = setFrontmatterField(content, "updated", newDateStr);
      if (readFrontmatterField(content, "date")) {
        next = next.replace(/^date:\s*.*$/m, "");
      }

      if (!DRY_RUN) fs.writeFileSync(filePath, next, "utf-8");
      console.log(`  ✓ ${fileName} → ${newDateStr}`);
      updated++;
    } catch (err) {
      console.error(`  ✗ ${fileName}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nUpdated: ${updated} · Skipped: ${skipped} · Errors: ${errors}\n`);
};

run();
