/**
 * One-off migration: reorganize Works into 3 artist categories (art/education/tech),
 * fix structural bugs (lectures type, objects visibility, practices parent), unhide all
 * works, and stamp maturity `status` on each work page.
 *
 * Idempotent frontmatter key upsert. Run: node scripts/apply-taxonomy.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, "..", "src", "content");

// file → { key: value } frontmatter changes
const CHANGES = {
  // --- hub re-homing under the 3 new category hubs ---
  "research.md": { parent: "works-art", title_ru: "Художественные исследования", title_en: "Art Research", order: 0 },
  "games.md": { parent: "works-art", order: 1 },
  "objects.md": { parent: "works-art", visible: true, order: 2 },
  "lectures.md": { parent: "works-education", type: "hub", status: "production", order: 0 },
  "practices.md": { parent: "works-education", status: "rnd", order: 1 },
  "neuromandala.md": { parent: "works-tech", status: "patent", order: 0 },

  // --- practices children: fix wrong parent + unhide; workshops → leaf ---
  "practices-workshops.md": { parent: "practices", type: "content", visible: true },
  "practices-coaching.md": { parent: "practices", visible: true },
  "practices-dance.md": { parent: "practices", visible: true },
  "practices-gong.md": { parent: "practices", visible: true },
  "practices-neurosync.md": { parent: "practices", visible: true },

  // --- unhide + status: art works (research line) ---
  "research-mindshow.md": { status: "production" },
  "research-schrodinger.md": { status: "rnd" },
  "research-sync-circle.md": { visible: true, status: "rnd" },
  "research-cultural-neuro-code.md": { status: "rnd" },
  "research-heritage.md": { visible: true, status: "rnd" },
  "research-posustoronniy.md": { visible: true, status: "rnd" },
  "research-dashran.md": { status: "concept" },

  // --- unhide + status: games ---
  "games-neurobattle.md": { status: "production" },
  "games-brain-hack.md": { visible: true, status: "concept" },
  "games-journey.md": { visible: true, status: "concept" },

  // --- unhide + status: objects ---
  "objects-emomandala.md": { visible: true, status: "rnd" },
  "objects-jewellery.md": { visible: true, status: "rnd" },
  "objects-mom-baby.md": { visible: true, status: "concept" },

  // --- unhide lecture topics ---
  "lectures-art-brain.md": { visible: true },
  "lectures-color-brain.md": { visible: true },
  "lectures-empathy.md": { visible: true },
  "lectures-neuroaesthetics.md": { visible: true },
  "lectures-sound-brain.md": { visible: true },
  "lectures-taste-brain.md": { visible: true },

  // --- interference is also an art work (lives under events) ---
  "events-interference.md": { status: "production" },
};

function upsertFrontmatter(file, changes) {
  const full = path.join(CONTENT, file);
  if (!fs.existsSync(full)) {
    console.warn(`  ⚠ missing: ${file}`);
    return;
  }
  let text = fs.readFileSync(full, "utf-8");
  const m = text.match(/^(---\s*\r?\n)([\s\S]*?)(\r?\n---\s*\r?\n)/);
  if (!m) {
    console.warn(`  ⚠ no frontmatter: ${file}`);
    return;
  }
  let fm = m[2];
  for (const [key, value] of Object.entries(changes)) {
    const line = `${key}: ${value}`;
    const re = new RegExp(`^${key}:.*$`, "m");
    if (re.test(fm)) {
      fm = fm.replace(re, line);
    } else {
      fm = `${fm}\n${line}`;
    }
  }
  const out = m[1] + fm + m[3] + text.slice(m[0].length);
  fs.writeFileSync(full, out);
  console.log(`  ✓ ${file}`);
}

console.log("\n🪷 APPLY TAXONOMY\n");
for (const [file, changes] of Object.entries(CHANGES)) {
  upsertFrontmatter(file, changes);
}
console.log("\n✨ TAXONOMY APPLIED\n");
