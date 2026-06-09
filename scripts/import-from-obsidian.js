/**
 * Import engagements from Obsidian vault (Chudodeystvo/События) into data/registry/engagements.yaml
 *
 * Usage:
 *   node scripts/import-from-obsidian.js [--dry-run] [--merge] [--vault PATH]
 *
 * Env:
 *   OBSIDIAN_EVENTS — path to События folder (default: D:/Obsidian/Chudodeystvo/События)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { readMd } from "./migrate/lib.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ENG_PATH = path.join(ROOT, "data", "registry", "engagements.yaml");

const DEFAULT_VAULT =
  process.env.OBSIDIAN_EVENTS ||
  "D:/Obsidian/Chudodeystvo/События";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const merge = args.includes("--merge");
const vaultIdx = args.indexOf("--vault");
const vaultPath =
  vaultIdx >= 0 && args[vaultIdx + 1] ? args[vaultIdx + 1] : DEFAULT_VAULT;

const REL_VALUES = new Set([
  "commercial",
  "invited",
  "award",
  "competition",
  "internal",
]);

function walkMd(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkMd(full, out);
    else if (name.endsWith(".md")) out.push(full);
  }
  return out;
}

function asIdList(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];
  return list
    .map((s) => {
      if (typeof s !== "string") return "";
      const m = s.match(/^\[\[([^\]|]+)/);
      return m ? m[1].trim() : s.trim();
    })
    .filter(Boolean);
}

function noteToEngagement(fm, filePath) {
  const id =
    fm.site_id ||
    fm.registry_id ||
    (fm.id && String(fm.id).startsWith("eng-") ? fm.id : null);
  if (!id) return null;

  const relationship = String(fm.relationship || fm.type || "invited").toLowerCase();
  if (!REL_VALUES.has(relationship)) return null;

  const orgs = Array.isArray(fm.orgs)
    ? fm.orgs
    : fm.orgs
      ? [fm.orgs]
      : [];
  const venues = Array.isArray(fm.venues)
    ? fm.venues
    : fm.venues
      ? [fm.venues]
      : [];

  return {
    id,
    date: fm.date || fm.event_date || "",
    city: fm.city || "",
    relationship,
    products: asIdList(fm.products),
    orgs,
    venues,
    title_ru: fm.title_ru || fm.title || path.basename(filePath, ".md"),
    title_en: fm.title_en || fm.title_en || fm.title_ru || fm.title || id,
    card: Boolean(fm.card),
    showcase: Boolean(fm.showcase),
    letter: Boolean(fm.letter),
    links: {
      obsidian: path.relative(vaultPath, filePath).replace(/\\/g, "/"),
    },
    registry_overwrite: Boolean(fm.registry_overwrite),
  };
}

function mergeEngagements(existing, imported) {
  const byId = new Map(existing.map((e) => [e.id, { ...e }]));
  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of imported) {
    const prev = byId.get(row.id);
    if (!prev) {
      byId.set(row.id, row);
      added++;
      continue;
    }
    if (merge && !row.registry_overwrite) {
      const merged = { ...prev };
      for (const [k, v] of Object.entries(row)) {
        if (k === "registry_overwrite") continue;
        if (v === "" || v === undefined || (Array.isArray(v) && !v.length)) continue;
        if (merged[k] === undefined || merged[k] === "" || merged[k] === false) {
          merged[k] = v;
        }
      }
      byId.set(row.id, merged);
      updated++;
    } else if (row.registry_overwrite) {
      byId.set(row.id, { ...prev, ...row });
      updated++;
    } else {
      skipped++;
    }
  }

  return {
    list: [...byId.values()].sort((a, b) =>
      String(b.date || "").localeCompare(String(a.date || "")),
    ),
    added,
    updated,
    skipped,
  };
}

console.log("\n📥 OBSIDIAN → REGISTRY IMPORT\n");
console.log(`  Vault: ${vaultPath}`);

if (!fs.existsSync(vaultPath)) {
  console.error(`  ✗ Folder not found. Set OBSIDIAN_EVENTS or use --vault PATH`);
  process.exit(1);
}

const files = walkMd(vaultPath);
const imported = [];

for (const f of files) {
  const md = readMd(f);
  if (!md) continue;
  const eng = noteToEngagement(md.fm, f);
  if (eng) imported.push(eng);
}

console.log(`  Notes scanned: ${files.length}`);
console.log(`  With site_id / registry_id: ${imported.length}`);

if (!imported.length) {
  console.log("\n  Nothing to import. Add frontmatter site_id: eng-… to Obsidian notes.\n");
  process.exit(0);
}

const existing = fs.existsSync(ENG_PATH)
  ? parseYaml(fs.readFileSync(ENG_PATH, "utf-8")) || []
  : [];

const { list, added, updated, skipped } = mergeEngagements(existing, imported);

console.log(`  Added: ${added}, Updated: ${updated}, Skipped: ${skipped}`);

if (dryRun) {
  console.log("\n  --dry-run: no files written.\n");
  process.exit(0);
}

const header = `# ODA.dream engagements — one row per participation
# relationship: commercial | invited | award | competition | internal
# card: true → generate src/content/eng-*.md detail page
# Imported notes must set site_id (eng-…) in Obsidian frontmatter

`;

fs.writeFileSync(ENG_PATH, header + stringifyYaml(list));
console.log(`  ✅ Wrote ${ENG_PATH}`);
console.log("\n  Next: npm run registry:sync && npm run assets:generate\n");
