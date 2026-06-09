/**
 * One-time: remove deprecated `format` from event frontmatter;
 * ensure `products` is set from format / event-specific map.
 *
 *   node scripts/migrate/remove-format-field.js
 *   node scripts/migrate/remove-format-field.js --dry-run
 */
import fs from "fs";
import path from "path";
import { CONTENT_DIR, readMd, writeMd } from "./lib.js";

const DRY_RUN = process.argv.includes("--dry-run");

const FORMAT_TO_PRODUCT = {
  mindshow: "mindshow",
  neurobattle: "neurobattle",
  performance: "interference",
  multisync: "multisync",
  lecture: "neuroaesthetics-lec",
  installation: "neuromandala",
};

/** Override generic format→product mapping per event id */
const EVENT_PRODUCT = {
  "event-hse-beautiful-brain-2025": ["beautiful-brain"],
  "event-sber-lecture-2025": ["neuroaesthetics-lec"],
  "event-bauman-moscow2030-2025": ["brain-hack"],
  "event-merck-corporate": ["neuroaesthetics-lec"],
  "event-gonchar-private-2024": ["mindshow"],
  "event-mipt-terraforming-2025": ["neuromandala"],
  "event-tavrida-ai-2025": ["cultural-neuro-code"],
  "event-pleinair-metro-2024": ["neuromandala"],
  "event-pleinair-bashkiria-2025": ["neuromandala"],
  "event-audi-brand-2024": ["mindshow"],
  "event-lamborghini-brand-2024": ["mindshow"],
};

const wl = (id) => `[[${id}]]`;

function unwrapList(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((s) => {
      if (typeof s !== "string") return "";
      const m = s.match(/^\[\[([^\]|]+)/);
      return m ? m[1].trim() : s.trim();
    })
    .filter(Boolean);
}

let changed = 0;

for (const name of fs.readdirSync(CONTENT_DIR)) {
  if (!name.startsWith("event-") || !name.endsWith(".md")) continue;
  const filePath = path.join(CONTENT_DIR, name);
  const md = readMd(filePath);
  if (!md?.fm) continue;

  const { fm, body } = md;
  if (!fm.format && !EVENT_PRODUCT[fm.id]) continue;

  const next = { ...fm };
  delete next.format;

  const existing = unwrapList(next.products);
  if (!existing.length) {
    const fromMap = EVENT_PRODUCT[fm.id];
    const fromFormat = fm.format ? FORMAT_TO_PRODUCT[fm.format] : null;
    const ids = fromMap || (fromFormat ? [fromFormat] : []);
    if (ids.length) next.products = ids.map(wl);
  }

  if (DRY_RUN) {
    console.log(`  would update ${name}: format=${fm.format ?? "—"} → products=${unwrapList(next.products).join(",") || "—"}`);
  } else {
    writeMd(filePath, next, body, {});
    console.log(`  ✓ ${name}`);
  }
  changed++;
}

console.log(`\n${DRY_RUN ? "Would change" : "Changed"}: ${changed} event file(s)`);
