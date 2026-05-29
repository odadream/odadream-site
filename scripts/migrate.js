// Phase C migration entry point.
//
//   node scripts/migrate.js                 # dry-run, prints what would change
//   node scripts/migrate.js --write         # apply
//   node scripts/migrate.js --only=proofs   # one stage only
//
// Stages run in dependency order: products → organizers → engagements → proofs
// (so back-references in proof YAML resolve to migrated targets).

import { runProducts } from "./migrate/products.js";
import { runOrganizers } from "./migrate/organizers.js";
import { runEngagements } from "./migrate/engagements.js";
import { runProofs } from "./migrate/proofs.js";

const STAGES = [
  ["products", runProducts],
  ["organizers", runOrganizers],
  ["engagements", runEngagements],
  ["proofs", runProofs],
];

const args = process.argv.slice(2);
const dryRun = !args.includes("--write");
const only = args.find((a) => a.startsWith("--only="))?.split("=")[1];

console.log(`\n${dryRun ? "🔍 [DRY RUN]" : "✏️  [WRITE]"} Phase C migration\n`);

const results = [];
for (const [name, fn] of STAGES) {
  if (only && only !== name) continue;
  console.log(`\n── ${name.toUpperCase()} ──────────────────────────`);
  results.push(fn({ dryRun }));
}

console.log("\n══ SUMMARY ══════════════════════════════════");
for (const r of results) {
  console.log("  " + JSON.stringify(r));
}
if (dryRun) {
  console.log("\n→ Run with --write to apply.");
}
