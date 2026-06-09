/**
 * Repair dates on registry event cards (src/content, tag hub-registry).
 * - normalize date_start to YYYY-MM-DD (Obsidian Date property)
 *
 * Usage: node scripts/repair-engagement-dates.js [--dry-run]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readMd, writeMd, CONTENT_DIR } from "./migrate/lib.js";
import {
  normalizeRegistryDate,
  isBrokenRegistryDate,
} from "./sync/registry-date.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes("--dry-run");

function isRegistryCard(fm, filename) {
  const tags = Array.isArray(fm.tags) ? fm.tags : fm.tags ? [fm.tags] : [];
  if (tags.includes("hub-registry")) return true;
  if (filename.startsWith("eng-") && fm.kind === "event") return true;
  return false;
}

function repairCard(filePath) {
  const parsed = readMd(filePath);
  if (!parsed) return null;

  const name = path.basename(filePath);
  if (!isRegistryCard(parsed.fm, name)) return null;

  const id = parsed.fm.id || path.basename(filePath, ".md");
  const current = parsed.fm.date_start ?? parsed.fm.date;
  let next = normalizeRegistryDate(current);

  if (!next || isBrokenRegistryDate(current)) {
    next = normalizeRegistryDate(parsed.fm.date);
  }

  if (!next) return null;

  const prevNorm = normalizeRegistryDate(current);
  const raw = String(current ?? "").trim();
  const alreadyIso = /^\d{4}-\d{2}-\d{2}$/.test(raw);
  if (prevNorm === next && alreadyIso) return null;

  const fm = {
    ...parsed.fm,
    date_start: next,
    date: next.replace(/-/g, "."),
  };
  if (!dryRun) writeMd(filePath, fm, parsed.body, {});
  return { id, from: current, to: next };
}

console.log(`\n📅 REPAIR REGISTRY EVENT DATES${dryRun ? " (dry-run)" : ""}\n`);

let fixed = 0;
for (const name of fs.readdirSync(CONTENT_DIR)) {
  if (!name.endsWith(".md")) continue;
  if (!name.startsWith("event-") && !name.startsWith("eng-")) continue;
  const result = repairCard(path.join(CONTENT_DIR, name));
  if (result) {
    console.log(`  ✓ ${result.id}: ${JSON.stringify(result.from)} → ${result.to}`);
    fixed++;
  }
}

console.log(`\n${fixed ? `✨ Fixed ${fixed} card(s)` : "· All dates OK"}\n`);
