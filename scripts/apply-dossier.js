/**
 * One-off migration: replace the legacy split proof sections (work-cases / work-awards
 * headings + markers) on work pages with a single unified `dossier` marker block.
 * Run: node scripts/apply-dossier.js   (then `npm run registry:sync` fills the markers)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, "..", "src", "content");

// work id → content filename
const WORK_FILES = {
  neurobattle: "games-neurobattle.md",
  mindshow: "research-mindshow.md",
  lectures: "lectures.md",
  neuromandala: "neuromandala.md",
  interference: "events-interference.md",
  multisync: "multisync.md",
};

const HEAD = { en: "Track record", ru: "Признание и след" };

function stripLegacy(text, id) {
  // Remove an optional "## Heading" line immediately followed by a work-cases/awards marker block.
  const kinds = ["work-cases", "work-awards"];
  for (const k of kinds) {
    for (const suffix of ["", "-ru"]) {
      const re = new RegExp(
        `(?:\\n#{2,4} [^\\n]*)?\\n+<!-- registry:${k}:${id}${suffix} -->[\\s\\S]*?<!-- /registry:${k}:${id}${suffix} -->`,
        "g",
      );
      text = text.replace(re, "");
    }
  }
  return text;
}

function dossierBlock(id, lang) {
  const suffix = lang === "ru" ? "-ru" : "";
  return `\n\n## ${HEAD[lang]}\n\n<!-- registry:dossier:${id}${suffix} -->\n<!-- /registry:dossier:${id}${suffix} -->`;
}

console.log("\n🗂  APPLY DOSSIER\n");
for (const [id, file] of Object.entries(WORK_FILES)) {
  const full = path.join(CONTENT, file);
  if (!fs.existsSync(full)) {
    console.warn(`  ⚠ missing: ${file}`);
    continue;
  }
  let text = fs.readFileSync(full, "utf-8");
  if (text.includes(`registry:dossier:${id}`)) {
    console.log(`  • already has dossier: ${file}`);
    continue;
  }
  text = stripLegacy(text, id);

  const parts = text.split("---RU---");
  if (parts.length === 2) {
    parts[0] = parts[0].replace(/\s+$/, "") + dossierBlock(id, "en") + "\n\n";
    parts[1] = parts[1].replace(/\s+$/, "") + dossierBlock(id, "ru") + "\n";
    text = parts.join("---RU---");
  } else {
    text = text.replace(/\s+$/, "") + dossierBlock(id, "en") + "\n";
  }
  fs.writeFileSync(full, text);
  console.log(`  ✓ ${file}`);
}
console.log("\n✨ DOSSIER MARKERS APPLIED\n");
