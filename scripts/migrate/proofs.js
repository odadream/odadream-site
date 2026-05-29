// Generate proof-*.md from data/registry/proofs.yaml.
// proofs.yaml id → file proof-<id>.md (or use site_node override).
// Skips records whose file already has `kind: proof` (pilot/manual).

import path from "node:path";
import fs from "node:fs";
import {
  CONTENT_DIR, writeMd, readYaml,
  isoDate, wikilink, nonEmptyList, log,
} from "./lib.js";

const SUBKIND_PARENT = {
  award: "letters",
  letter: "letters",
  testimonial: "testimonials",
  press: "press",
};

export function runProofs({ dryRun }) {
  const proofs = readYaml("proofs.yaml") ?? [];
  let created = 0, updated = 0, skipped = 0, malformed = 0;

  for (const p of proofs) {
    if (!p?.id || !p?.kind) { malformed++; continue; }
    const subkind = p.kind;
    if (!SUBKIND_PARENT[subkind]) { malformed++; continue; }

    const id = p.site_node || `proof-${p.id}`;
    const filePath = path.join(CONTENT_DIR, `${id}.md`);

    // Idempotency: skip if file already has kind: proof
    if (fs.existsSync(filePath)) {
      const existing = fs.readFileSync(filePath, "utf8");
      if (/^kind:\s*proof\b/m.test(existing)) {
        skipped++;
        continue;
      }
    }

    const titleEn = p.title_en || p.id;
    const titleRu = p.title_ru || p.id;

    const fm = {
      id,
      parent: SUBKIND_PARENT[subkind],
      title_en: titleEn,
      title_ru: titleRu,
      type: "content",
      visible: true,
      date: p.date,
      kind: "proof",
      subkind,
    };

    const proofOf = nonEmptyList([
      p.work ? wikilink(p.work) : null,
      p.eng ? wikilink(p.eng) : null,
    ]);
    if (proofOf) fm.proof_of = proofOf;

    if (p.org) fm.issued_by = [wikilink(p.org)];

    const publication = p.source_en || p.source_ru;
    if (publication) fm.publication = publication;
    if (p.date) fm.publication_date = isoDate(p.date);

    if (p.media) fm.asset = Array.isArray(p.media) ? p.media[0] : p.media;
    if (p.url) fm.external_link = p.url;

    if (subkind === "testimonial" || subkind === "letter") {
      const qEn = p.quote_en || p.note_en;
      const qRu = p.quote_ru || p.note_ru;
      if (qEn) fm.quote_en = qEn;
      if (qRu) fm.quote_ru = qRu;
    }

    const descEn = p.note_en || (subkind === "press" ? p.title_en : "") || "";
    const descRu = p.note_ru || (subkind === "press" ? p.title_ru : "") || "";
    const body =
      `## ${titleEn}\n\n${descEn || titleEn}\n\n` +
      `---RU---\n\n` +
      `## ${titleRu}\n\n${descRu || titleRu}\n`;

    const existed = fs.existsSync(filePath);
    writeMd(filePath, fm, body, { dryRun });
    if (existed) updated++;
    else created++;
    log("ok", `${id}.md`, `→ proof/${subkind} (${existed ? "rewritten" : "created"})`);
  }
  return { name: "proofs", created, updated, skipped, malformed };
}
