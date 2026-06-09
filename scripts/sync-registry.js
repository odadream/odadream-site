/**
 * Sync event registry from data/registry/*.yaml to Lotus CMS content files.
 * Run: npm run registry:sync
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";
import { readYamlFile } from "./migrate/lib.js";
import {
  buildDossier,
  buildAwardsTable,
  listAwards,
  listPress,
  listTestimonials,
  listLetters,
} from "./sync/proof-builders.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data", "registry");
const CONTENT_DIR = path.join(ROOT, "src", "content");

const ORGS_PATH = path.join(DATA_DIR, "organizations.yaml");
const ENG_PATH = path.join(DATA_DIR, "engagements.yaml");
const WORKS_PATH = path.join(DATA_DIR, "works.yaml");
const PROOFS_PATH = path.join(DATA_DIR, "proofs.yaml");

const REL_LABELS = {
  commercial: { en: "Commercial", ru: "Коммерческий заказ" },
  invited: { en: "Expert invitation", ru: "Экспертное приглашение" },
  award: { en: "Award / competition", ru: "Награда / конкурс" },
  competition: { en: "Competition / festival", ru: "Конкурс / фестиваль" },
  internal: { en: "Internal", ru: "Внутреннее" },
};

const ORG_KIND = {
  client: { en: "Client", ru: "Клиент" },
  venue: { en: "Venue", ru: "Площадка" },
  institution: { en: "Institution", ru: "Институция" },
  partner: { en: "Partner", ru: "Партнёр" },
};

const REGISTRY_ID = "hub-registry";
const REGISTRY_ORGS_ID = "hub-registry-orgs";
const MARKER_NS = "hub-registry";

const loadYaml = (filePath) => readYamlFile(filePath) ?? [];

function orgMap(orgs) {
  const m = new Map();
  for (const o of orgs) m.set(o.id, o);
  return m;
}

function orgNames(ids, map, lang) {
  if (!ids?.length) return "—";
  return ids
    .map((id) => {
      const o = map.get(id);
      if (!o) return id;
      return lang === "ru" ? o.name_ru : o.name_en;
    })
    .join(", ");
}

function formatDate(d) {
  if (!d) return "";
  return String(d).replace(/-/g, ".");
}

function engTableRow(eng, omap, lang) {
  const title = lang === "ru" ? eng.title_ru : eng.title_en;
  const rel =
    REL_LABELS[eng.relationship]?.[lang] || eng.relationship;
  const orgs = orgNames(eng.orgs, omap, lang);
  const venues = orgNames(eng.venues, omap, lang);
  const city = eng.city || "—";
  const date = formatDate(eng.date) || "—";
  const link = `[[${eng.id}|${title}]]`;
  return `| ${date} | ${link} | ${rel} | ${orgs} | ${venues} | ${city} |`;
}

function sortEngagements(engagements) {
  return [...engagements].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function buildRegistryTables(engagements, omap) {
  const commercial = engagements.filter((e) => e.relationship === "commercial");
  const expert = engagements.filter((e) =>
    ["invited", "award", "competition"].includes(e.relationship),
  );
  const all = sortEngagements(engagements);

  const headerEn =
    "| Date | Engagement | Type | Client / org | Venue | City |\n|------|------------|------|--------------|-------|------|";
  const headerRu =
    "| Дата | Участие | Тип | Заказчик / орг. | Площадка | Город |\n|------|---------|-----|-----------------|----------|-------|";

  const enAll = all.map((e) => engTableRow(e, omap, "en")).join("\n");
  const ruAll = all.map((e) => engTableRow(e, omap, "ru")).join("\n");
  const enCommercial = commercial.map((e) => engTableRow(e, omap, "en")).join("\n");
  const enExpert = expert.map((e) => engTableRow(e, omap, "en")).join("\n");
  const ruCommercial = commercial.map((e) => engTableRow(e, omap, "ru")).join("\n");
  const ruExpert = expert.map((e) => engTableRow(e, omap, "ru")).join("\n");

  return {
    commercial,
    expert,
    enAll,
    ruAll,
    enCommercial,
    enExpert,
    ruCommercial,
    ruExpert,
    headerEn,
    headerRu,
  };
}

function writeOrgNode(org, engagements, omap) {
  const filePath = path.join(CONTENT_DIR, `${org.id}.md`);
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    if (raw.includes("kind: organizer")) {
      return false;
    }
  }

  const related = engagements.filter(
    (e) => e.orgs?.includes(org.id) || e.venues?.includes(org.id),
  );
  const listEn = related
    .map((e) => `- [[${e.id}|${e.title_en}]] (${formatDate(e.date)})`)
    .join("\n");
  const listRu = related
    .map((e) => `- [[${e.id}|${e.title_ru}]] (${formatDate(e.date)})`)
    .join("\n");

  const kindEn =
    org.kind === "client"
      ? "Client"
      : org.kind === "venue"
        ? "Venue"
        : org.kind === "institution"
          ? "Institution"
          : "Partner";

  const body = `---
id: ${org.id}
parent: ${REGISTRY_ORGS_ID}
title_en: ${org.name_en}
title_ru: ${org.name_ru}
type: content
tags: [registry, ${org.kind}]
visible: false
date: 2026.05.25
---

## ${org.name_en}

**Type:** ${kindEn}

Related engagements in the ODA.dream registry:

${listEn || "_No linked engagements yet._"}

---RU---

## ${org.name_ru}

Связанные участия в реестре ODA.dream:

${listRu || "_Пока нет связанных записей._"}
`;

  fs.writeFileSync(path.join(CONTENT_DIR, `${org.id}.md`), body);
  return true;
}

function writeEngNode(eng, omap) {
  const filePath = path.join(CONTENT_DIR, `${eng.id}.md`);
  if (fs.existsSync(filePath)) {
    return false;
  }

  const relEn = REL_LABELS[eng.relationship]?.en || eng.relationship;
  const relRu = REL_LABELS[eng.relationship]?.ru || eng.relationship;
  const parent =
    eng.relationship === "commercial"
      ? "hub-registry-commercial"
      : "hub-registry-expert";

  const mediaBlock =
    eng.site_media?.length && eng.site_media[0]
      ? `\n![[${eng.site_media[0]}]]\n`
      : "";

  const body = `---
id: ${eng.id}
parent: ${parent}
title_en: ${eng.title_en}
title_ru: ${eng.title_ru}
type: content
tags: [registry, ${eng.format || "event"}]
visible: true
date: ${formatDate(eng.date) || "2026.05.25"}
order: 0
---

## ${eng.title_en}

**Type:** ${relEn}  
**Date:** ${formatDate(eng.date) || "—"}  
**City:** ${eng.city || "—"}  
**Format:** ${eng.format || "—"}  
**Organizations:** ${orgNames(eng.orgs, omap, "en")}  
**Venues:** ${orgNames(eng.venues, omap, "en")}
${mediaBlock}
---RU---

## ${eng.title_ru}

**Тип:** ${relRu}  
**Дата:** ${formatDate(eng.date) || "—"}  
**Город:** ${eng.city || "—"}  
**Формат:** ${eng.format || "—"}  
**Организации:** ${orgNames(eng.orgs, omap, "ru")}  
**Площадки:** ${orgNames(eng.venues, omap, "ru")}
${mediaBlock}
`;

  fs.writeFileSync(path.join(CONTENT_DIR, `${eng.id}.md`), body);
  return true;
}

function orgKindLabel(kind, lang) {
  return ORG_KIND[kind]?.[lang] || kind || "—";
}

function writeRegistryHub(tables, omap, orgs, awardsEn, awardsRu) {
  const orgTableEn = orgs
    .map((o) => `| [[${o.id}|${o.name_en}]] | ${orgKindLabel(o.kind, "en")} |`)
    .join("\n");
  const orgTableRu = orgs
    .map((o) => `| [[${o.id}|${o.name_ru}]] | ${orgKindLabel(o.kind, "ru")} |`)
    .join("\n");

  const body = `---
id: ${REGISTRY_ID}
parent: hub-world
title_en: Experience Registry
title_ru: Реестр опыта
type: content
tags: [registry, network]
order: 7
visible: true
date: 2026.05.25
---

## EXPERIENCE REGISTRY

Single ledger of ODA.dream public footprint: **every recorded engagement**, **organizations we worked with**, and **awards & recognition**.

Narrative case studies live in [[hub-events|Events]]; scans of diplomas and letters → [[hub-letters|Recognition & Awards]].

Drill-down: [[hub-registry-commercial|Commercial]] · [[hub-registry-expert|Expert appearances]] · [[hub-registry-orgs|Organizations]]

Source of truth: \`data/registry/*.yaml\` — update YAML, then \`npm run registry:sync\`.

## All engagements

${tables.headerEn}
${tables.enAll || "| — | — | — | — | — | — |"}

## Awards & recognition

${awardsEn.header}
${awardsEn.rows || "| — | — | — | — | — | — |"}

Letters and diploma scans → [[hub-letters|Recognition & Awards]]

## Organizations

| Organization | Role |
|--------------|------|
${orgTableEn}

Full org index → [[hub-registry-orgs|Organizations]]

---RU---

## РЕЕСТР ОПЫТА

Единый журнал публичного следа ODA.dream: **все зафиксированные участия**, **организации**, **награды и признание**.

Нарративные кейсы — в [[hub-events|События]]; сканы дипломов и писем → [[hub-letters|Признание и награды]].

Детализация: [[hub-registry-commercial|Коммерция]] · [[hub-registry-expert|Экспертные приглашения]] · [[hub-registry-orgs|Организации]]

Источник правды: \`data/registry/*.yaml\` — правки в YAML, затем \`npm run registry:sync\`.

## Все участия

${tables.headerRu}
${tables.ruAll || "| — | — | — | — | — | — |"}

## Награды и признание

${awardsRu.header}
${awardsRu.rows || "| — | — | — | — | — | — |"}

Письма и сканы дипломов → [[hub-letters|Признание и награды]]

## Организации

| Организация | Роль |
|-------------|------|
${orgTableRu}

Полный индекс → [[hub-registry-orgs|Организации]]
`;

  fs.writeFileSync(path.join(CONTENT_DIR, "hub-registry.md"), body);
}

function writeSubHub(id, titleEn, titleRu, parent, introEn, introRu, linksEn, linksRu) {
  const body = `---
id: ${id}
parent: ${parent}
title_en: ${titleEn}
title_ru: ${titleRu}
type: hub
tags: [registry]
order: ${id === "hub-registry-commercial" ? 0 : 1}
visible: true
date: 2026.05.25
---

${introEn}

${linksEn}

Full tables → [[${REGISTRY_ID}|Experience Registry]]

---RU---

${introRu}

${linksRu}

Полные таблицы → [[${REGISTRY_ID}|Реестр опыта]]
`;

  fs.writeFileSync(path.join(CONTENT_DIR, `${id}.md`), body);
}

function writeRegistryOrgsHub(orgs, omap) {
  const orgListEn = orgs
    .map((o) => `- [[${o.id}|${o.name_en}]] — ${orgKindLabel(o.kind, "en")}`)
    .join("\n");
  const orgListRu = orgs
    .map((o) => `- [[${o.id}|${o.name_ru}]] — ${orgKindLabel(o.kind, "ru")}`)
    .join("\n");

  const body = `---
id: ${REGISTRY_ORGS_ID}
parent: ${REGISTRY_ID}
title_en: Organizations
title_ru: Организации
type: content
tags: [registry]
order: 2
visible: true
date: 2026.05.25
---

## ORGANIZATIONS

Clients, venues, and institutions linked to engagements in the registry. Each \`[[org-…]]\` node can be wiki-linked from event and product cards.

Full table → [[${REGISTRY_ID}|Experience Registry]]

${orgListEn}

---RU---

## ОРГАНИЗАЦИИ

Заказчики, площадки и институции из реестра участий. Каждая \`[[org-…]]\` — скрытая карточка для wiki-ссылок.

Полная таблица → [[${REGISTRY_ID}|Реестр опыта]]

${orgListRu}
`;

  fs.writeFileSync(path.join(CONTENT_DIR, "hub-registry-orgs.md"), body);
}

function buildCommercialList(engagements, omap, lang) {
  return engagements
    .filter((e) => e.relationship === "commercial")
    .map((e) => {
      const t = lang === "ru" ? e.title_ru : e.title_en;
      return `- [[${e.id}|${t}]] — ${orgNames(e.orgs, omap, lang)}`;
    })
    .join("\n");
}

function buildExpertList(engagements, omap, lang) {
  return engagements
    .filter((e) => ["invited", "award", "competition"].includes(e.relationship))
    .slice(0, 12)
    .map((e) => {
      const t = lang === "ru" ? e.title_ru : e.title_en;
      return `- [[${e.id}|${t}]]`;
    })
    .join("\n");
}

// Resolve content file by its frontmatter `id` (filenames are often prefixed,
// e.g. work id `neurobattle` lives in `games-neurobattle.md`).
function buildIdToFileMap() {
  const map = new Map();
  for (const f of fs.readdirSync(CONTENT_DIR)) {
    if (!f.endsWith(".md")) continue;
    const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
    const m = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
    if (!m) continue;
    const idm = m[1].match(/^id:\s*(.+)$/m);
    if (idm) map.set(idm[1].trim(), f);
  }
  return map;
}

function fileHasMarker(filePath, markerId) {
  if (!fs.existsSync(filePath)) return false;
  return fs.readFileSync(filePath, "utf-8").includes(`<!-- ${MARKER_NS}:${markerId} -->`);
}

function patchMarkers(filePath, markerId, content) {
  if (!fs.existsSync(filePath)) return;
  let text = fs.readFileSync(filePath, "utf-8");
  const start = `<!-- ${MARKER_NS}:${markerId} -->`;
  const end = `<!-- /${MARKER_NS}:${markerId} -->`;
  const block = `${start}\n${content}\n${end}`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`, "m");
  if (re.test(text)) {
    text = text.replace(re, block);
  } else {
    console.warn(`  ⚠ Marker ${markerId} not found in ${path.basename(filePath)}`);
  }
  fs.writeFileSync(filePath, text);
}

function cleanupOldGenerated() {
  const files = fs.readdirSync(CONTENT_DIR);
  for (const f of files) {
    if (
      (f.startsWith("org-") && f.endsWith(".md")) ||
      (f.startsWith("eng-") && f.endsWith(".md"))
    ) {
      const full = path.join(CONTENT_DIR, f);
      const raw = fs.readFileSync(full, "utf-8");
      if (raw.includes("tags: [registry") || raw.includes("parent: registry")) {
        fs.unlinkSync(full);
        console.log(`  - Removed stale ${f}`);
      }
    }
  }
}

// Proof-ledger builders (awards/press/testimonials/letters + dossier) live in
// ./sync/proof-builders.js — imported above to keep this orchestrator focused.

console.log("\n🔄 REGISTRY SYNC\n");

const orgs = loadYaml(ORGS_PATH);
const engagements = loadYaml(ENG_PATH);
const works = fs.existsSync(WORKS_PATH) ? loadYaml(WORKS_PATH) : [];
const proofs = fs.existsSync(PROOFS_PATH) ? loadYaml(PROOFS_PATH) : [];
const omap = orgMap(orgs);
const engById = new Map(engagements.map((e) => [e.id, e]));
const tables = buildRegistryTables(engagements, omap);

cleanupOldGenerated();

const awardsEn = buildAwardsTable(proofs, omap, engById, "en");
const awardsRu = buildAwardsTable(proofs, omap, engById, "ru");

writeRegistryHub(tables, omap, orgs, awardsEn, awardsRu);
writeRegistryOrgsHub(orgs, omap);

const commercialCards = engagements.filter(
  (e) => e.relationship === "commercial" && e.card,
);
const expertCards = engagements.filter(
  (e) => ["invited", "award", "competition"].includes(e.relationship) && e.card,
);

const commLinksEn = commercialCards
  .map((e) => `- [[${e.id}|${e.title_en}]]`)
  .join("\n");
const commLinksRu = commercialCards
  .map((e) => `- [[${e.id}|${e.title_ru}]]`)
  .join("\n");
const expLinksEn = expertCards
  .map((e) => `- [[${e.id}|${e.title_en}]]`)
  .join("\n");
const expLinksRu = expertCards
  .map((e) => `- [[${e.id}|${e.title_ru}]]`)
  .join("\n");

writeSubHub(
  "hub-registry-commercial",
  "Commercial",
  "Коммерция",
  REGISTRY_ID,
  "## COMMERCIAL ENGAGEMENTS\n\nPaid commissions — brand and private productions.",
  "## КОММЕРЧЕСКИЕ ЗАКАЗЫ\n\nПлатные заказы — брендовые и частные продакшены.",
  commLinksEn,
  commLinksRu,
);

writeSubHub(
  "hub-registry-expert",
  "Expert Appearances",
  "Экспертные приглашения",
  REGISTRY_ID,
  "## EXPERT APPEARANCES\n\nForums, universities, festivals — invited as speakers or artists.",
  "## ЭКСПЕРТНЫЕ ПРИГЛАШЕНИЯ\n\nФорумы, вузы, фестивали — приглашённые спикеры и художники.",
  expLinksEn,
  expLinksRu,
);

for (const org of orgs) {
  if (writeOrgNode(org, engagements, omap)) {
    console.log(`  ✅ ${org.id}.md`);
  }
}

for (const eng of engagements) {
  if (eng.card && writeEngNode(eng, omap)) {
    console.log(`  ✅ ${eng.id}.md`);
  }
}

const commListEn = buildCommercialList(engagements, omap, "en");
const commListRu = buildCommercialList(engagements, omap, "ru");
const expListEn = buildExpertList(engagements, omap, "en");
const expListRu = buildExpertList(engagements, omap, "ru");

patchMarkers(path.join(CONTENT_DIR, "hub-business.md"), "commercial-list", commListEn);
patchMarkers(path.join(CONTENT_DIR, "hub-business.md"), "commercial-list-ru", commListRu);
patchMarkers(path.join(CONTENT_DIR, "hub-event-agencies.md"), "commercial-list", commListEn);
patchMarkers(path.join(CONTENT_DIR, "hub-event-agencies.md"), "commercial-list-ru", commListRu);
patchMarkers(path.join(CONTENT_DIR, "hub-event-agencies.md"), "expert-list", expListEn);
patchMarkers(path.join(CONTENT_DIR, "hub-event-agencies.md"), "expert-list-ru", expListRu);

// --- Per-work dossier injection (one cohesive footprint module per work) ---
const idToFile = buildIdToFileMap();
for (const work of works) {
  const fname = idToFile.get(work.id);
  if (!fname) continue;
  const file = path.join(CONTENT_DIR, fname);
  let touched = false;
  const variants = [
    [`dossier:${work.id}`, buildDossier(work, proofs, engagements, omap, engById, "en")],
    [`dossier:${work.id}-ru`, buildDossier(work, proofs, engagements, omap, engById, "ru")],
  ];
  for (const [markerId, content] of variants) {
    if (fileHasMarker(file, markerId)) {
      patchMarkers(file, markerId, content);
      touched = true;
    }
  }
  if (touched) console.log(`  🎨 dossier → ${fname}`);
}

// --- World pages: full corpus generated from the proof ledger ---
const worldBlocks = [
  ["hub-press.md", "press-all", listPress(proofs, omap, engById, "en"), listPress(proofs, omap, engById, "ru")],
  ["hub-testimonials.md", "testimonials-all", listTestimonials(proofs, omap, engById, "en"), listTestimonials(proofs, omap, engById, "ru")],
  ["hub-letters.md", "letters-all", listLetters(proofs, omap, engById, "en"), listLetters(proofs, omap, engById, "ru")],
];
for (const [page, marker, en, ru] of worldBlocks) {
  const file = path.join(CONTENT_DIR, page);
  if (fileHasMarker(file, marker)) patchMarkers(file, marker, en);
  if (fileHasMarker(file, `${marker}-ru`)) patchMarkers(file, `${marker}-ru`, ru);
}

// --- Studio credentials dedup (single source: proofs.yaml, kind=award) ---
const credEn = listAwards(proofs, "en");
const credRu = listAwards(proofs, "ru");
for (const page of ["hub-institutions.md", "hub-business.md", "hub-event-agencies.md"]) {
  const file = path.join(CONTENT_DIR, page);
  if (fileHasMarker(file, "credentials")) patchMarkers(file, "credentials", credEn);
  if (fileHasMarker(file, "credentials-ru")) patchMarkers(file, "credentials-ru", credRu);
}

console.log("\n✨ REGISTRY SYNC COMPLETE\n");
