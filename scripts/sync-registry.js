/**
 * Sync event registry from data/registry/*.yaml to Lotus CMS content files.
 * Run: npm run registry:sync
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";

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

function loadYaml(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return parseYaml(raw) || [];
}

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

function buildRegistryTables(engagements, omap) {
  const commercial = engagements.filter((e) => e.relationship === "commercial");
  const expert = engagements.filter((e) =>
    ["invited", "award", "competition"].includes(e.relationship),
  );

  const headerEn =
    "| Date | Engagement | Type | Client / org | Venue | City |\n|------|------------|------|--------------|-------|------|";
  const headerRu =
    "| Дата | Участие | Тип | Заказчик / орг. | Площадка | Город |\n|------|---------|-----|-----------------|----------|-------|";

  const enCommercial = commercial.map((e) => engTableRow(e, omap, "en")).join("\n");
  const enExpert = expert.map((e) => engTableRow(e, omap, "en")).join("\n");
  const ruCommercial = commercial.map((e) => engTableRow(e, omap, "ru")).join("\n");
  const ruExpert = expert.map((e) => engTableRow(e, omap, "ru")).join("\n");

  return { commercial, expert, enCommercial, enExpert, ruCommercial, ruExpert, headerEn, headerRu };
}

function writeOrgNode(org, engagements, omap) {
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
parent: registry-orgs
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
}

function writeEngNode(eng, omap) {
  const relEn = REL_LABELS[eng.relationship]?.en || eng.relationship;
  const relRu = REL_LABELS[eng.relationship]?.ru || eng.relationship;
  const parent =
    eng.relationship === "commercial" ? "registry-commercial" : "registry-expert";

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
}

function writeRegistryHub(tables, omap, orgs) {
  const orgTableEn = orgs
    .map((o) => `| [[${o.id}|${o.name_en}]] | ${o.kind} |`)
    .join("\n");
  const orgTableRu = orgs
    .map((o) => `| [[${o.id}|${o.name_ru}]] | ${o.kind} |`)
    .join("\n");

  const body = `---
id: registry
parent: world
title_en: Experience Registry
title_ru: Реестр опыта
type: hub
tags: [registry, network]
order: 6
visible: true
date: 2026.05.25
---

## EXPERIENCE REGISTRY

Single source of truth for ODA.dream engagements: who commissioned the work, where we appeared as experts, and what formats were delivered.

**Do not duplicate brand lists** on other pages — link here: [[registry-commercial|Commercial]] · [[registry-expert|Expert appearances]] · [[registry-orgs|Organizations]]

Data lives in \`data/registry/\` in git. Update YAML, then run \`npm run registry:sync\`.

## Commercial engagements

${tables.headerEn}
${tables.enCommercial || "| — | — | — | — | — | — |"}

## Expert appearances & awards

${tables.headerEn}
${tables.enExpert || "| — | — | — | — | — | — |"}

## Organizations

| Organization | Kind |
|--------------|------|
${orgTableEn}

---RU---

## РЕЕСТР ОПЫТА

Единый источник правды об участиях ODA.dream: коммерческие заказы, экспертные приглашения и форматы.

**Не дублируйте списки брендов** на других страницах — ссылайтесь сюда: [[registry-commercial|Коммерция]] · [[registry-expert|Экспертные приглашения]] · [[registry-orgs|Организации]]

Данные в \`data/registry/\`. Обновите YAML, затем \`npm run registry:sync\`.

## Коммерческие заказы

${tables.headerRu}
${tables.ruCommercial || "| — | — | — | — | — | — |"}

## Экспертные приглашения и награды

${tables.headerRu}
${tables.ruExpert || "| — | — | — | — | — | — |"}

## Организации

| Организация | Тип |
|-------------|-----|
${orgTableRu}
`;

  fs.writeFileSync(path.join(CONTENT_DIR, "registry.md"), body);
}

function writeSubHub(id, titleEn, titleRu, parent, introEn, introRu, linksEn, linksRu) {
  const body = `---
id: ${id}
parent: ${parent}
title_en: ${titleEn}
title_ru: ${titleRu}
type: hub
tags: [registry]
order: ${id === "registry-commercial" ? 0 : 1}
visible: true
date: 2026.05.25
---

${introEn}

${linksEn}

Full tables → [[registry|Experience Registry]]

---RU---

${introRu}

${linksRu}

Полные таблицы → [[registry|Реестр опыта]]
`;

  fs.writeFileSync(path.join(CONTENT_DIR, `${id}.md`), body);
}

function writeRegistryOrgsHub() {
  const body = `---
id: registry-orgs
parent: registry
title_en: Organizations
title_ru: Организации
type: content
tags: [registry]
order: 2
visible: true
date: 2026.05.25
---

## ORGANIZATIONS

Index of clients, venues, and institutions. Each org has a hidden detail page for wiki-links (\`[[org-…]]\`).

See the full table on [[registry|Experience Registry]].

---RU---

## ОРГАНИЗАЦИИ

Индекс заказчиков, площадок и институций. У каждой организации есть скрытая карточка для wiki-ссылок (\`[[org-…]]\`).

Полная таблица — на [[registry|Реестре опыта]].
`;

  fs.writeFileSync(path.join(CONTENT_DIR, "registry-orgs.md"), body);
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
  return fs.readFileSync(filePath, "utf-8").includes(`<!-- registry:${markerId} -->`);
}

function patchMarkers(filePath, markerId, content) {
  if (!fs.existsSync(filePath)) return;
  let text = fs.readFileSync(filePath, "utf-8");
  const start = `<!-- registry:${markerId} -->`;
  const end = `<!-- /registry:${markerId} -->`;
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

// --- PROOF LEDGER (digital footprint: awards, press, testimonials, letters) ---

const TIER_RANK = { flagship: 0, strong: 1, standard: 2 };
const L = {
  shown: { en: "Shown at", ru: "Показывали" },
  awards: { en: "Recognition", ru: "Награды" },
  press: { en: "Press", ru: "Пресса" },
  voices: { en: "Voices", ru: "Отзывы" },
  lead: { en: "Track record at a glance:", ru: "След и признание вкратце:" },
  full: { en: "Full footprint", ru: "Весь след" },
};

function pYear(p) {
  return String(p.date || "").slice(0, 4);
}
function sortProofs(a, b) {
  const t = (TIER_RANK[a.tier] ?? 9) - (TIER_RANK[b.tier] ?? 9);
  return t !== 0 ? t : String(b.date).localeCompare(String(a.date));
}
// Issuer / outlet name: prefer linked org, else free-text source, else eng's org.
function proofSource(p, omap, engById, lang) {
  if (p.org && omap.get(p.org)) return lang === "ru" ? omap.get(p.org).name_ru : omap.get(p.org).name_en;
  const s = lang === "ru" ? p.source_ru : p.source_en;
  if (s) return s;
  if (p.eng && engById.get(p.eng)) {
    const o = orgNames(engById.get(p.eng).orgs, omap, lang);
    if (o && o !== "—") return o;
  }
  return "";
}
function txt(p, key, lang) {
  return lang === "ru" ? p[`${key}_ru`] : p[`${key}_en`];
}

function proofsOf(proofs, kind, workId) {
  return proofs
    .filter((p) => p.kind === kind && (workId ? p.work === workId : true))
    .sort(sortProofs);
}

// Inline, ` · `-joined highlight strings (compact, reads as a dossier, not a long list).
function casesInline(work, engagements, omap, lang, limit) {
  const keys = work.format_keys || [];
  if (!keys.length) return "";
  return engagements
    .filter((e) => keys.includes(e.format))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, limit)
    .map((e) => {
      const t = lang === "ru" ? e.title_ru : e.title_en;
      const org = orgNames(e.orgs, omap, lang);
      const tail = org && org !== "—" ? ` (${org}, ${pYear(e)})` : ` (${pYear(e)})`;
      return `[[${e.id}|${t}]]${tail}`;
    })
    .join(" · ");
}
function awardsInline(proofs, workId, lang, limit) {
  return proofsOf(proofs, "award", workId)
    .slice(0, limit)
    .map((p) => `${txt(p, "title", lang)} (${pYear(p)})`)
    .join(" · ");
}
function pressInline(proofs, omap, engById, workId, lang, limit) {
  return proofsOf(proofs, "press", workId)
    .slice(0, limit)
    .map((p) => {
      const src = proofSource(p, omap, engById, lang) || txt(p, "title", lang);
      return p.url ? `[${src}](${p.url})` : src;
    })
    .join(" · ");
}
function topTestimonial(proofs, omap, engById, workId, lang) {
  const p = proofsOf(proofs, "testimonial", workId)[0];
  if (!p) return "";
  const src = proofSource(p, omap, engById, lang);
  return `> «${txt(p, "quote", lang)}»${src ? ` — ${src} (${pYear(p)})` : ""}`;
}

// One cohesive "dossier" module per work: framed, weighted highlights — not a raw dump.
function buildDossier(work, proofs, engagements, omap, engById, lang) {
  const lines = [];
  const cases = casesInline(work, engagements, omap, lang, 3);
  const aw = awardsInline(proofs, work.id, lang, 2);
  const pr = pressInline(proofs, omap, engById, work.id, lang, 3);
  const voice = topTestimonial(proofs, omap, engById, work.id, lang);
  if (cases) lines.push(`**${L.shown[lang]}:** ${cases}`);
  if (aw) lines.push(`**${L.awards[lang]}:** ${aw}`);
  if (pr) lines.push(`**${L.press[lang]}:** ${pr}`);
  if (!lines.length && !voice) return "";
  const segs = [`*${L.lead[lang]}*`];
  if (lines.length) segs.push(lines.join("\n\n"));
  if (voice) segs.push(voice);
  segs.push(
    `${L.full[lang]} → [[press|${lang === "ru" ? "Пресса" : "Press"}]] · [[testimonials|${lang === "ru" ? "Отзывы" : "Testimonials"}]] · [[letters|${lang === "ru" ? "Признание" : "Recognition"}]]`,
  );
  return segs.join("\n\n");
}

// --- STUDIO-LEVEL LISTS (full corpus for world pages) ---
function listAwards(proofs, lang) {
  return proofsOf(proofs, "award").map((p) => {
    const note = txt(p, "note", lang);
    return `- **${txt(p, "title", lang)}** (${pYear(p)})${note ? ` — ${note}` : ""}`;
  }).join("\n");
}
function listPress(proofs, omap, engById, lang) {
  return proofsOf(proofs, "press").map((p) => {
    const src = proofSource(p, omap, engById, lang);
    const title = txt(p, "title", lang);
    const head = p.url ? `[${title}](${p.url})` : title;
    return `- **${src || title}** — ${head} (${pYear(p)})`;
  }).join("\n");
}
function listTestimonials(proofs, omap, engById, lang) {
  return proofsOf(proofs, "testimonial").map((p) => {
    const src = proofSource(p, omap, engById, lang);
    return `> «${txt(p, "quote", lang)}»\n>\n> — ${src} (${pYear(p)})`;
  }).join("\n\n");
}
function listLetters(proofs, omap, engById, lang) {
  return proofsOf(proofs, "letter").map((p) => {
    const src = proofSource(p, omap, engById, lang) || "";
    const title = txt(p, "title", lang);
    const media = p.media ? ` ![[${p.media} | ${title}]]` : "";
    return `- **${title}**${src ? ` — ${src}` : ""} (${pYear(p)})${media}`;
  }).join("\n");
}

console.log("\n🔄 REGISTRY SYNC\n");

const orgs = loadYaml(ORGS_PATH);
const engagements = loadYaml(ENG_PATH);
const works = fs.existsSync(WORKS_PATH) ? loadYaml(WORKS_PATH) : [];
const proofs = fs.existsSync(PROOFS_PATH) ? loadYaml(PROOFS_PATH) : [];
const omap = orgMap(orgs);
const engById = new Map(engagements.map((e) => [e.id, e]));
const tables = buildRegistryTables(engagements, omap);

cleanupOldGenerated();

writeRegistryHub(tables, omap, orgs);
writeRegistryOrgsHub();

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
  "registry-commercial",
  "Commercial",
  "Коммерция",
  "registry",
  "## COMMERCIAL ENGAGEMENTS\n\nPaid commissions — brand and private productions.",
  "## КОММЕРЧЕСКИЕ ЗАКАЗЫ\n\nПлатные заказы — брендовые и частные продакшены.",
  commLinksEn,
  commLinksRu,
);

writeSubHub(
  "registry-expert",
  "Expert Appearances",
  "Экспертные приглашения",
  "registry",
  "## EXPERT APPEARANCES\n\nForums, universities, festivals — invited as speakers or artists.",
  "## ЭКСПЕРТНЫЕ ПРИГЛАШЕНИЯ\n\nФорумы, вузы, фестивали — приглашённые спикеры и художники.",
  expLinksEn,
  expLinksRu,
);

for (const org of orgs) {
  writeOrgNode(org, engagements, omap);
  console.log(`  ✅ ${org.id}.md`);
}

for (const eng of engagements) {
  if (eng.card) {
    writeEngNode(eng, omap);
    console.log(`  ✅ ${eng.id}.md`);
  }
}

const commListEn = buildCommercialList(engagements, omap, "en");
const commListRu = buildCommercialList(engagements, omap, "ru");
const expListEn = buildExpertList(engagements, omap, "en");
const expListRu = buildExpertList(engagements, omap, "ru");

patchMarkers(path.join(CONTENT_DIR, "collab-business.md"), "commercial-list", commListEn);
patchMarkers(path.join(CONTENT_DIR, "collab-business.md"), "commercial-list-ru", commListRu);
patchMarkers(path.join(CONTENT_DIR, "collab-agents.md"), "commercial-list", commListEn);
patchMarkers(path.join(CONTENT_DIR, "collab-agents.md"), "commercial-list-ru", commListRu);
patchMarkers(path.join(CONTENT_DIR, "collab-agents.md"), "expert-list", expListEn);
patchMarkers(path.join(CONTENT_DIR, "collab-agents.md"), "expert-list-ru", expListRu);

// --- Per-work dossier injection (one cohesive footprint module per work) ---
const idToFile = buildIdToFileMap();
for (const work of works) {
  const fname = idToFile.get(work.id);
  if (!fname) continue;
  const file = path.join(CONTENT_DIR, fname);
  let touched = false;
  const variants = [
    // Legacy split markers (still filled if a page uses them)
    [`work-cases:${work.id}`, casesInline(work, engagements, omap, "en", 8).split(" · ").map((s) => `- ${s}`).join("\n")],
    [`work-cases:${work.id}-ru`, casesInline(work, engagements, omap, "ru", 8).split(" · ").map((s) => `- ${s}`).join("\n")],
    // Unified dossier
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
  ["world-press.md", "press-all", listPress(proofs, omap, engById, "en"), listPress(proofs, omap, engById, "ru")],
  ["world-testimonials.md", "testimonials-all", listTestimonials(proofs, omap, engById, "en"), listTestimonials(proofs, omap, engById, "ru")],
  ["collab-letters.md", "letters-all", listLetters(proofs, omap, engById, "en"), listLetters(proofs, omap, engById, "ru")],
];
for (const [page, marker, en, ru] of worldBlocks) {
  const file = path.join(CONTENT_DIR, page);
  if (fileHasMarker(file, marker)) patchMarkers(file, marker, en);
  if (fileHasMarker(file, `${marker}-ru`)) patchMarkers(file, `${marker}-ru`, ru);
}

// --- Studio credentials dedup (single source: proofs.yaml, kind=award) ---
const credEn = listAwards(proofs, "en");
const credRu = listAwards(proofs, "ru");
for (const page of ["world-cv.md", "collab-institutions.md", "collab-business.md", "collab-agents.md"]) {
  const file = path.join(CONTENT_DIR, page);
  if (fileHasMarker(file, "credentials")) patchMarkers(file, "credentials", credEn);
  if (fileHasMarker(file, "credentials-ru")) patchMarkers(file, "credentials-ru", credRu);
}

console.log("\n✨ REGISTRY SYNC COMPLETE\n");
