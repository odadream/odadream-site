/**
 * Sync Experience Registry to Lotus CMS.
 * Editable source: src/content/event-*.md (tag hub-registry) via events.base
 * Run: npm run registry:sync  (after npm run sync:fields when yaml/proofs change)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";
import { readYamlFile } from "./migrate/lib.js";
import { resolveEngagements } from "./sync/engagements-from-notes.js";
import { formatRegistryDateForSite } from "./sync/registry-date.js";
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

// Event subkind labels — mirrors src/data/taxonomy.ts (event kind)
const EVENT_SUBKIND = {
  series: { en: "Event series", ru: "Серия событий" },
  festival: { en: "Festival", ru: "Фестиваль" },
  lab: { en: "Lab", ru: "Лаборатория" },
  exhibition: { en: "Exhibition", ru: "Выставка" },
  forum: { en: "Forum", ru: "Форум" },
  lecture: { en: "Lecture", ru: "Лекция" },
  school: { en: "School", ru: "Школа" },
  olympiad: { en: "Olympiad", ru: "Олимпиада" },
  private_show: { en: "Private show", ru: "Закрытый показ" },
  workshop: { en: "Workshop", ru: "Воркшоп" },
  conference: { en: "Conference", ru: "Конференция" },
  competition: { en: "Competition", ru: "Конкурс" },
};

const ORG_KIND = {
  client: { en: "Client", ru: "Клиент" },
  venue: { en: "Venue", ru: "Площадка" },
  institution: { en: "Institution", ru: "Институция" },
  partner: { en: "Partner", ru: "Партнёр" },
};

const REGISTRY_ID = "hub-registry";
const MARKER_NS = "hub-registry";
const ORG_PARENT = "hub-world";

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
  return formatRegistryDateForSite(d) === "—" ? "" : formatRegistryDateForSite(d);
}

function cityLabel(eng, lang) {
  const en = eng.city_en ?? eng.city ?? "";
  const ru = eng.city_ru ?? "";
  const val = lang === "ru" ? ru || en : en || ru;
  return val || "—";
}

function subkindLabel(subkind, lang) {
  if (!subkind) return "—";
  const meta = EVENT_SUBKIND[subkind];
  if (meta) return meta[lang];
  const pretty = subkind.replace(/_/g, " ");
  return pretty.charAt(0).toUpperCase() + pretty.slice(1);
}

function engTitleCell(eng, lang, publicCardIds) {
  const title = lang === "ru" ? eng.title_ru : eng.title_en;
  return publicCardIds.has(eng.id) ? `[[${eng.id}|${title}]]` : title;
}

function resolveSubkind(eng, contentMeta) {
  if (eng.subkind) return eng.subkind;
  const fromContent = contentMeta.get(eng.id)?.subkind;
  if (fromContent) return fromContent;
  const byFormat = {
    neurobattle: "competition",
    mindshow: "festival",
    lecture: "lecture",
    installation: "exhibition",
    performance: "festival",
  };
  return byFormat[eng.format] || "";
}

function engTableRow(eng, omap, lang, publicCardIds, contentMeta) {
  const orgs = orgNames(eng.orgs, omap, lang);
  const venues = orgNames(eng.venues, omap, lang);
  const city = cityLabel(eng, lang);
  const date = formatDate(eng.date) || "—";
  const type = subkindLabel(resolveSubkind(eng, contentMeta), lang);
  const title = engTitleCell(eng, lang, publicCardIds);
  return `| ${date} | ${title} | ${type} | ${orgs} | ${venues} | ${city} |`;
}

function sortEngagements(engagements) {
  return [...engagements].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function buildContentMetaMap() {
  const meta = new Map();
  const publicCardIds = new Set();
  for (const f of fs.readdirSync(CONTENT_DIR)) {
    if (!f.endsWith(".md")) continue;
    const raw = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
    const fm = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    const body = fm[1];
    const idm = body.match(/^id:\s*(.+)$/m);
    if (!idm) continue;
    const id = idm[1].trim();
    const subm = body.match(/^subkind:\s*(.+)$/m);
    const kindm = body.match(/^kind:\s*event\s*$/m);
    const vism = body.match(/^visible:\s*(.+)$/m);
    const visible = !vism || vism[1].trim() !== "false";
    if (subm) meta.set(id, { subkind: subm[1].trim() });
    if (kindm && visible) publicCardIds.add(id);
  }
  return { meta, publicCardIds };
}

function buildRegistryTables(engagements, omap, publicCardIds, contentMeta) {
  const commercial = engagements.filter((e) => e.relationship === "commercial");
  const expert = engagements.filter((e) =>
    ["invited", "award", "competition"].includes(e.relationship),
  );
  const all = sortEngagements(engagements);

  const headerEn =
    "| Date | Title | Type | Organizer | Venue | City |\n|------|-------|------|-----------|-------|------|";
  const headerRu =
    "| Дата | Название | Тип | Организатор | Площадка | Город |\n|------|----------|-----|-------------|----------|------|";

  const row = (e, lang) => engTableRow(e, omap, lang, publicCardIds, contentMeta);
  const enAll = all.map((e) => row(e, "en")).join("\n");
  const ruAll = all.map((e) => row(e, "ru")).join("\n");
  const enCommercial = commercial.map((e) => row(e, "en")).join("\n");
  const enExpert = expert.map((e) => row(e, "en")).join("\n");
  const ruCommercial = commercial.map((e) => row(e, "ru")).join("\n");
  const ruExpert = expert.map((e) => row(e, "ru")).join("\n");

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
parent: ${ORG_PARENT}
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

function orgKindLabel(kind, lang) {
  return ORG_KIND[kind]?.[lang] || kind || "—";
}

function writeRegistryHub(tables, orgs, awardsEn, awardsRu) {
  const orgTableEn = orgs
    .map((o) => `| ${o.name_en} | ${orgKindLabel(o.kind, "en")} |`)
    .join("\n");
  const orgTableRu = orgs
    .map((o) => `| ${o.name_ru} | ${orgKindLabel(o.kind, "ru")} |`)
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

Public record of ODA.dream footprint: **engagements**, **partner organizations**, and **awards & recognition**.

Narrative case studies → [[hub-events|Events]]. Diplomas and letters of appreciation → [[hub-letters|Recognition & Awards]].

## Engagements

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

---RU---

## РЕЕСТР ОПЫТА

Публичный журнал следа ODA.dream: **участия**, **организации-партнёры**, **награды и признание**.

Нарративные кейсы → [[hub-events|События]]. Дипломы и благодарственные письма → [[hub-letters|Признание и награды]].

## Участия

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
`;

  fs.writeFileSync(path.join(CONTENT_DIR, "hub-registry.md"), body);
}

function patchOrgParents() {
  for (const f of fs.readdirSync(CONTENT_DIR)) {
    if (!f.startsWith("org-") || !f.endsWith(".md")) continue;
    const full = path.join(CONTENT_DIR, f);
    let raw = fs.readFileSync(full, "utf-8");
    if (!raw.includes("tags: [registry") && !raw.includes("parent: hub-registry-orgs")) continue;
    if (!raw.includes("parent: hub-registry-orgs")) continue;
    raw = raw.replace(/^parent:\s*hub-registry-orgs\s*$/m, `parent: ${ORG_PARENT}`);
    fs.writeFileSync(full, raw);
  }
}

function removeRegistrySubHubs() {
  for (const id of ["hub-registry-commercial", "hub-registry-expert", "hub-registry-orgs"]) {
    const file = path.join(CONTENT_DIR, `${id}.md`);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`  - Removed ${id}.md`);
    }
  }
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
const engagements = resolveEngagements(DATA_DIR);
const works = fs.existsSync(WORKS_PATH) ? loadYaml(WORKS_PATH) : [];
const proofs = fs.existsSync(PROOFS_PATH) ? loadYaml(PROOFS_PATH) : [];
const omap = orgMap(orgs);
const engById = new Map(engagements.map((e) => [e.id, e]));
const { meta: contentMeta, publicCardIds } = buildContentMetaMap();
const tables = buildRegistryTables(engagements, omap, publicCardIds, contentMeta);

cleanupOldGenerated();
removeRegistrySubHubs();
patchOrgParents();

const awardsEn = buildAwardsTable(proofs, omap, engById, "en");
const awardsRu = buildAwardsTable(proofs, omap, engById, "ru");

writeRegistryHub(tables, orgs, awardsEn, awardsRu);

for (const org of orgs) {
  if (writeOrgNode(org, engagements, omap)) {
    console.log(`  ✅ ${org.id}.md`);
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
