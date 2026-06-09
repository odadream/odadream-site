/**
 * Sync & enrich frontmatter across src/content from data/registry/*.yaml.
 *
 *   npm run sync:fields          # apply
 *   npm run sync:fields -- --dry-run
 *
 * Then run: npm run registry:sync
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  ROOT,
  CONTENT_DIR,
  readMd,
  writeMd,
  readYamlFile,
} from "./migrate/lib.js";
import { normalizeRegistryDate } from "./sync/registry-date.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(ROOT, "data", "registry");
const DRY_RUN = process.argv.includes("--dry-run");

const wl = (id) => `[[${id}]]`;
const hasLink = (arr, id) =>
  (arr ?? []).some(
    (s) => typeof s === "string" && (s === id || s === wl(id) || s.includes(id)),
  );

const PROOF_YAML_ALIASES = {};

const EVENT_DATE_HINTS = {
  "pleinair-bashkiria": "2025-01-01",
  "pleinair-metro": "2024-01-01",
  "unique-russia": "2026-01-01",
  "event-bitva-milliard-2024": "2024-01-01",
  "event-techweek": "2024-01-01",
  "event-portal-2024": "2024-01-01",
  "event-gong-fest-2024": "2024-01-01",
  "event-gong-fest-2025": "2025-01-01",
  "event-brics-plus": "2024-10-01",
};

const stats = {
  eventDates: 0,
  eventOrganizer: 0,
  registryCity: 0,
  registryVenueStripped: 0,
  proofSync: 0,
  eventProofs: 0,
};

function loadProofRegistry() {
  const rows = readYamlFile(path.join(DATA_DIR, "proofs.yaml")) ?? [];
  const byNodeId = new Map();
  for (const r of rows) {
    if (!r.id) continue;
    const nodeId = r.site_node || `proof-${r.id}`;
    byNodeId.set(nodeId, r);
    if (PROOF_YAML_ALIASES[nodeId]) byNodeId.set(nodeId, r);
  }
  for (const [alias, yamlId] of Object.entries(PROOF_YAML_ALIASES)) {
    const rec = rows.find((r) => r.id === yamlId);
    if (rec) byNodeId.set(alias, rec);
  }
  for (const r of rows) {
    if (!r.alias_of || !r.site_node) continue;
    const parent = rows.find((x) => x.id === r.alias_of);
    if (parent) byNodeId.set(r.site_node, { ...parent, ...r });
  }
  return { rows, byNodeId };
}

function proofTargets(rec) {
  const ids = [];
  if (rec.work) ids.push(rec.work);
  if (rec.eng) ids.push(rec.eng);
  if (rec.subject) ids.push(rec.subject);
  return ids;
}

function syncEventDates(engDateHints) {
  for (const file of fs.readdirSync(CONTENT_DIR)) {
    if (!file.endsWith(".md") || file.startsWith("_")) continue;
    const p = path.join(CONTENT_DIR, file);
    const md = readMd(p);
    if (!md?.fm?.id || md.fm.kind !== "event") continue;

    const { fm, body } = md;
    let iso =
      normalizeRegistryDate(fm.date_start) ||
      normalizeRegistryDate(fm.date) ||
      engDateHints.get(fm.id) ||
      EVENT_DATE_HINTS[fm.id] ||
      "";

    if (!iso) continue;

    const dotDate = iso.replace(/-/g, ".");
    const changed =
      normalizeRegistryDate(fm.date_start) !== iso ||
      normalizeRegistryDate(fm.date) !== iso;

    if (!changed && fm.date === dotDate) continue;

    fm.date_start = iso;
    fm.date = dotDate;
    stats.eventDates++;
    writeMd(p, fm, body, { dryRun: DRY_RUN });
    log("date", fm.id, iso);
  }
}

function syncRegistryEventCards() {
  for (const file of fs.readdirSync(CONTENT_DIR)) {
    if (!file.endsWith(".md")) continue;
    const p = path.join(CONTENT_DIR, file);
    const md = readMd(p);
    if (!md?.fm?.id) continue;

    const tags = Array.isArray(md.fm.tags)
      ? md.fm.tags
      : md.fm.tags
        ? [md.fm.tags]
        : [];
    const isRegistry =
      tags.includes("hub-registry") ||
      (file.startsWith("eng-") && md.fm.kind === "event");
    if (!isRegistry) continue;

    const { fm, body } = md;
    let touched = false;

    const iso = normalizeRegistryDate(fm.date_start ?? fm.date);
    if (iso) {
      if (fm.date_start !== iso) {
        fm.date_start = iso;
        touched = true;
      }
      const dot = iso.replace(/-/g, ".");
      if (fm.date !== dot) {
        fm.date = dot;
        touched = true;
      }
    }

    const orgIds = [
      ...(Array.isArray(fm.orgs) ? fm.orgs : []),
      ...(Array.isArray(fm.venues) ? fm.venues : []),
    ].map((x) => String(x).replace(/^\[\[|\]\]$/g, "").split("|")[0].trim());

    if (orgIds.length) {
      const organizer = orgIds.map(wl);
      const same =
        JSON.stringify(fm.organizer ?? []) === JSON.stringify(organizer);
      if (!same) {
        fm.organizer = organizer;
        touched = true;
        stats.eventOrganizer++;
      }
    }

    if (fm.city_en && !fm.city_ru && fm.city_en === "Moscow") {
      fm.city_ru = "Москва";
      touched = true;
      stats.registryCity++;
    }
    if (fm.city_en && !fm.city_ru && fm.city_en === "Kaluga") {
      fm.city_ru = "Калуга";
      touched = true;
      stats.registryCity++;
    }
    if (fm.city_en && !fm.city_ru && fm.city_en === "Nizhny Novgorod") {
      fm.city_ru = "Нижний Новгород";
      touched = true;
      stats.registryCity++;
    }

    if (fm.venue && (fm.city_en || fm.city_ru)) {
      delete fm.venue;
      touched = true;
      stats.registryVenueStripped++;
    }

    if (touched) {
      writeMd(p, fm, body, { dryRun: DRY_RUN });
      log("registry", fm.id);
    }
  }
}

function syncProofsFromYaml(byNodeId) {
  for (const file of fs.readdirSync(CONTENT_DIR)) {
    if (!file.endsWith(".md") || !file.startsWith("proof-")) continue;
    const p = path.join(CONTENT_DIR, file);
    const md = readMd(p);
    if (!md?.fm?.id || md.fm.kind !== "proof") continue;

    const rec = byNodeId.get(md.fm.id);
    if (!rec) continue;

    const { fm, body } = md;
    let touched = false;

    const proofOf = Array.isArray(fm.proof_of) ? [...fm.proof_of] : [];
    for (const id of proofTargets(rec)) {
      if (!hasLink(proofOf, id)) {
        proofOf.push(wl(id));
        touched = true;
      }
    }
    if (touched) fm.proof_of = proofOf;

    const issuedBy = Array.isArray(fm.issued_by)
      ? fm.issued_by.filter((x) => String(x).trim())
      : [];
    if (rec.org) {
      if (!hasLink(issuedBy, rec.org)) {
        issuedBy.push(wl(rec.org));
        fm.issued_by = issuedBy;
        touched = true;
      }
    } else if (!issuedBy.length) {
      const issuer =
        rec.source_ru || rec.source_en || fm.publication || "";
      if (issuer) {
        fm.issued_by = [issuer];
        touched = true;
      }
    }

    const pub = rec.source_en || rec.source_ru;
    if (pub && !fm.publication) {
      fm.publication = pub;
      touched = true;
    }

    const iso = normalizeRegistryDate(rec.date);
    if (iso) {
      if (!fm.publication_date) fm.publication_date = iso;
      if (!fm.date) fm.date = iso.replace(/-/g, ".");
      touched = true;
    }

    if (rec.media) {
      const asset = Array.isArray(rec.media) ? rec.media[0] : rec.media;
      if (asset && fm.asset !== asset) {
        fm.asset = asset;
        touched = true;
      }
    }

    if (rec.url && !fm.external_link) {
      fm.external_link = rec.url;
      touched = true;
    }

    if (touched) {
      stats.proofSync++;
      writeMd(p, fm, body, { dryRun: DRY_RUN });
      log("proof", md.fm.id);
    }
  }
}

function attachEventProofs(proofRows) {
  const byEng = new Map();
  for (const p of proofRows) {
    if (!p.eng) continue;
    const nodeId = p.site_node || `proof-${p.id}`;
    if (!byEng.has(p.eng)) byEng.set(p.eng, []);
    byEng.get(p.eng).push(wl(nodeId));
  }

  for (const [engId, proofLinks] of byEng) {
    const file = `${engId}.md`;
    const p = path.join(CONTENT_DIR, file);
    if (!fs.existsSync(p)) continue;
    const md = readMd(p);
    if (!md) continue;

    const proofs = Array.isArray(md.fm.proofs) ? [...md.fm.proofs] : [];
    let touched = false;
    for (const link of proofLinks) {
      const id = link.replace(/^\[\[|\]\]$/g, "").split("|")[0];
      if (!hasLink(proofs, id)) {
        proofs.push(link);
        touched = true;
      }
    }
    if (touched) {
      md.fm.proofs = proofs;
      stats.eventProofs++;
      writeMd(p, md.fm, md.body, { dryRun: DRY_RUN });
      log("event-proofs", engId, `+${proofLinks.length}`);
    }
  }
}

function log(kind, id, extra = "") {
  console.log(`  ✓ ${kind}: ${id}${extra ? ` — ${extra}` : ""}`);
}

console.log(`\n🔄 SYNC FIELDS${DRY_RUN ? " (dry-run)" : ""}\n`);

const { rows: proofRows, byNodeId } = loadProofRegistry();

const engDateHints = new Map();
for (const p of proofRows) {
  if (p.eng && p.date) engDateHints.set(p.eng, normalizeRegistryDate(p.date));
}

syncEventDates(engDateHints);
syncRegistryEventCards();
syncProofsFromYaml(byNodeId);
attachEventProofs(proofRows);

console.log("\n══ SUMMARY ══════════════════════════════════");
console.log(`  event date_start:     ${stats.eventDates}`);
console.log(`  registry organizer:   ${stats.eventOrganizer}`);
console.log(`  registry city_ru:     ${stats.registryCity}`);
console.log(`  registry venue drop:  ${stats.registryVenueStripped}`);
console.log(`  proof yaml → md:      ${stats.proofSync}`);
console.log(`  event proofs[]:       ${stats.eventProofs}`);
if (DRY_RUN) console.log("\n→ Run without --dry-run to apply, then npm run registry:sync");
else console.log("\n→ Run npm run registry:sync to refresh hub-registry");
console.log();
