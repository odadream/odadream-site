// Phase F — bulk fix of structural conformance gaps.
//   1. Fill proof.proof_of / proof.issued_by from proofs.yaml (work / eng / org).
//   2. Fill event.subkind from manual heuristic table.
//   3. Create stub for `eng-2025-wildmint` (referenced by proof-let-wildmint).
// Idempotent: skips fields that are already non-empty.
// Default dry-run; --write to apply.

import fs from "node:fs";
import path from "node:path";
import { ROOT, CONTENT_DIR, readMd, writeMd, readYaml, log } from "../migrate/lib.js";

const WRITE = process.argv.includes("--write");

// ── 1. Event subkind heuristic table (file-id → subkind). ──
// Decisions justified by event format in engagements.yaml.
const EVENT_SUBKIND = {
  "eng-2025-mipt-terraforming":  "workshop",       // university performance
  "eng-2025-moscow2030-portal":  "forum",          // Moscow 2030 forum
  "eng-2025-bauman-moscow2030":  "forum",          // Bauman / Moscow 2030
  "eng-2025-tpp-mindshow":       "forum",          // CCI RF forum
  "eng-2026-cipr-mindshow":      "forum",          // CIPR conference
  "eng-2025-dano-ekoniva":       "competition",    // olympiad
  "eng-2025-tavrida-ai":         "festival",       // AI festival
  "eng-2025-hse-beautiful-brain":"conference",     // university conference
  "eng-2025-sber-lecture":       "workshop",       // corporate lecture/workshop
  "eng-merck-corporate":         "workshop",       // corporate workshop
  "eng-2024-ashram-birthday":    "private_show",   // private celebration
  "eng-2024-gonchar-private":    "private_show",   // private neuro-show
};

// ── 2. Build proof lookup from registry. ──
const proofYaml = readYaml("proofs.yaml") ?? [];
const PROOF_REG = new Map();
for (const r of proofYaml) {
  if (!r.id) continue;
  const id = r.site_node || `proof-${r.id}`;
  PROOF_REG.set(id, r);
}

const wl = (s) => `[[${s}]]`;

const stats = { eventSubkind: 0, proofProofOf: 0, proofIssuedBy: 0, stubsCreated: 0, skipped: 0 };

// ── 3. Walk all content files. ──
const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));

for (const file of files) {
  const p = path.join(CONTENT_DIR, file);
  const md = readMd(p);
  if (!md?.fm?.id) continue;
  const { fm, body } = md;
  let touched = false;

  // Event subkind
  if (fm.kind === "event" && !fm.subkind && EVENT_SUBKIND[fm.id]) {
    fm.subkind = EVENT_SUBKIND[fm.id];
    stats.eventSubkind++;
    touched = true;
    log("ok", fm.id, `subkind → ${fm.subkind}`);
  }

  // Proof relations from registry
  if (fm.kind === "proof") {
    const rec = PROOF_REG.get(fm.id);
    if (rec) {
      const proofOf = Array.isArray(fm.proof_of) ? [...fm.proof_of] : [];
      const issuedBy = Array.isArray(fm.issued_by) ? [...fm.issued_by] : [];
      const has = (arr, id) => arr.some((s) => typeof s === "string" && (s === id || s === wl(id)));

      let changed = false;
      if (rec.work && !has(proofOf, rec.work)) {
        proofOf.push(wl(rec.work));
        changed = true;
        stats.proofProofOf++;
      }
      if (rec.eng && !has(proofOf, rec.eng)) {
        proofOf.push(wl(rec.eng));
        changed = true;
        stats.proofProofOf++;
      }
      if (rec.org && !has(issuedBy, rec.org)) {
        issuedBy.push(wl(rec.org));
        changed = true;
        stats.proofIssuedBy++;
      }
      if (changed) {
        fm.proof_of = proofOf;
        fm.issued_by = issuedBy;
        touched = true;
        log("ok", fm.id, "proof_of/issued_by from registry");
      }
    }
  }

  if (touched) writeMd(p, fm, body, { dryRun: !WRITE });
  else stats.skipped++;
}

// ── 4. Stub for eng-2025-wildmint (referenced by proof-let-wildmint). ──
const stubPath = path.join(CONTENT_DIR, "eng-2025-wildmint.md");
if (!fs.existsSync(stubPath)) {
  const stubFm = {
    id: "eng-2025-wildmint",
    parent: "events",
    title_en: "Wild Mint festival — neuromandala installation",
    title_ru: "Дикая Мята — инсталляция Нейромандала",
    type: "content",
    tags: [],
    date: "2025.01.01",
    kind: "event",
    subkind: "festival",
    date_start: "2025-06-01",
    venue: "",
    organizer: ["[[org-wildmint]]"],
    products: ["[[neuromandala]]"],
    proofs: ["[[proof-let-wildmint]]"],
    media: [],
  };
  const stubBody = `## Wild Mint festival — neuromandala installation\n\nStub — created by Phase F audit. Fill in details.\n\n---RU---\n\n## Дикая Мята — инсталляция Нейромандала\n\nЗаглушка — создана аудитом Phase F. Дополнить описанием.\n`;
  writeMd(stubPath, stubFm, stubBody, { dryRun: !WRITE });
  stats.stubsCreated++;
  log("ok", "eng-2025-wildmint", "stub created");
}

console.log("\n══ SUMMARY ══════════════════════════════════");
console.log(`  ${WRITE ? "✏️  [WRITE]" : "🔍 [DRY RUN]"}`);
console.log(`  event subkind filled: ${stats.eventSubkind}`);
console.log(`  proof.proof_of added: ${stats.proofProofOf}`);
console.log(`  proof.issued_by added: ${stats.proofIssuedBy}`);
console.log(`  stubs created:        ${stats.stubsCreated}`);
console.log(`  files untouched:      ${stats.skipped}`);
if (!WRITE) console.log("\n→ Run with --write to apply.");
