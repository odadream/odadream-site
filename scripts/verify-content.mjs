import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadSiteModule } from './site-data.mjs';

const data = await loadSiteModule();
const legacy = JSON.parse(await readFile('src/data/legacy-map.json', 'utf8'));
const legacyIds = new Set(legacy.map((row) => row.id));
const files = new Set(legacy.map((row) => row.source));
const errors = [];
function checkCollection(name, rows) {
  const ids = new Set();
  for (const row of rows) {
    if (ids.has(row.id)) errors.push(`${name}: duplicate id ${row.id}`);
    ids.add(row.id);
    if (row.legacyId && !legacyIds.has(row.legacyId))
      errors.push(`${name} ${row.id}: unknown legacyId ${row.legacyId}`);
    if (row.publication && !['draft', 'review', 'published'].includes(row.publication))
      errors.push(`${name} ${row.id}: invalid publication`);
    for (const [key, value] of Object.entries(row))
      if (value && typeof value === 'object' && !Array.isArray(value) && 'en' in value && 'ru' in value) {
        if (
          typeof value.en === 'string' &&
          typeof value.ru === 'string' &&
          (!value.en.trim() || !value.ru.trim())
        )
          errors.push(`${name} ${row.id}: empty locale in ${key}`);
        if (Array.isArray(value.en) && Array.isArray(value.ru) && (!value.en.length || !value.ru.length))
          errors.push(`${name} ${row.id}: empty locale array in ${key}`);
      }
    for (const match of String(row.source || '').matchAll(/([\w-]+\.md)/g))
      if (!files.has(match[1])) errors.push(`${name} ${row.id}: missing source ${match[1]}`);
  }
}
for (const name of [
  'methods',
  'cooperationPages',
  'studioPages',
  'works',
  'formats',
  'cases',
  'evidence',
  'recognitions',
  'people',
  'organizations',
  'media',
])
  checkCollection(name, data[name]);
function checkLocales(value, label) {
  if (!value || typeof value !== 'object') return;
  if ('en' in value || 'ru' in value) {
    for (const lang of ['en', 'ru']) {
      const text = value[lang];
      if (
        typeof text === 'string'
          ? !text.trim()
          : !Array.isArray(text) || !text.length || text.some((row) => typeof row !== 'string' || !row.trim())
      )
        errors.push(`${label}: missing locale ${lang}`);
    }
  } else for (const [key, child] of Object.entries(value)) checkLocales(child, `${label}.${key}`);
}
const snapshots =
  JSON.parse(await readFile('docs/migration/INVENTORY-2026-10-05.json', 'utf8')).v2SourceSnapshots ?? {};
for (const [file, ref] of Object.entries(data.sourceSnapshots)) {
  if (
    !files.has(file) ||
    ref.file !== file ||
    !/^[a-f0-9]{64}$/.test(ref.sha256) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(ref.snapshot)
  )
    errors.push(`source snapshot ${file}: invalid provenance`);
  if (snapshots[file]?.sha256 !== ref.sha256) errors.push(`source snapshot ${file}: inventory drift`);
}
for (const row of [
  ...data.methods,
  ...data.cooperationPages,
  ...data.formats,
  ...data.works,
  ...data.studioPages,
  ...data.people.filter((row) => row.sourceRefs),
]) {
  checkLocales(row, row.id);
  if (
    !row.sourceRefs.length ||
    row.sourceRefs.some((ref) => data.sourceSnapshots[ref.file]?.sha256 !== ref.sha256)
  )
    errors.push(`${row.id}: missing or inconsistent source references`);
}
for (const format of data.formats) {
  if (!format.conditions.length || !format.story || !format.participation || !format.outcome)
    errors.push(`format ${format.id}: incomplete migrated detail`);
  const conditions = new Set();
  for (const condition of format.conditions) {
    if (conditions.has(condition.id) || !['historical', 'per-brief', 'conflict'].includes(condition.state))
      errors.push(`format ${format.id}: invalid or duplicate condition ${condition.id}`);
    conditions.add(condition.id);
  }
}
const ids = (rows) => new Set(rows.map((row) => row.id));
for (const studio of data.studioPages) {
  for (const id of studio.people) {
    const person = data.people.find((row) => row.id === id);
    if (!person?.biography || !person?.sourceRefs?.length)
      errors.push(`studio ${studio.id}: missing biography or source for ${id}`);
  }
  for (const item of studio.teaching)
    if (!Number.isInteger(item.year) || item.year < 1900 || item.year > 2100)
      errors.push(`studio ${studio.id}: invalid context year`);
  for (const item of studio.materials)
    if (!/^(works|technology|formats|cooperation)\/$/.test(item.path))
      errors.push(`studio ${studio.id}: invalid material destination ${item.path}`);
}
const workIds = ids(data.works),
  formatIds = ids(data.formats),
  caseIds = ids(data.cases),
  mediaIds = ids(data.media),
  orgIds = ids(data.organizations),
  evidenceIds = ids(data.evidence);
for (const method of data.methods) {
  for (const id of method.works) if (!workIds.has(id)) errors.push(`method ${method.id}: missing work ${id}`);
  for (const id of method.media)
    if (!mediaIds.has(id)) errors.push(`method ${method.id}: missing media ${id}`);
}
for (const page of data.cooperationPages)
  for (const scenario of page.scenarios)
    for (const id of scenario.formatIds)
      if (!formatIds.has(id)) errors.push(`cooperation ${scenario.id}: missing format ${id}`);
for (const hero of data.heroVisuals) {
  if (!mediaIds.has(hero.mediaId)) errors.push(`hero ${hero.id}: missing media`);
  if (hero.target.kind === 'method' && !data.methods.some((row) => row.id === hero.target.methodId))
    errors.push(`hero ${hero.id}: missing method`);
  if (hero.target.kind === 'work' && !workIds.has(hero.target.workId))
    errors.push(`hero ${hero.id}: missing work`);
}
for (const work of data.works) {
  if (!work.story?.length || !work.credits?.length || !work.reviewNotes?.length)
    errors.push(`work ${work.id}: narrative, credits or interpretation boundaries missing`);
  const storyIds = new Set();
  for (const section of work.story ?? []) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id) || storyIds.has(section.id))
      errors.push(`work ${work.id}: invalid or duplicate story anchor ${section.id}`);
    storyIds.add(section.id);
  }
  for (const id of work.relatedWorks ?? [])
    if (
      !workIds.has(id) ||
      id === work.id ||
      work.basedOn.includes(id) ||
      data.works.some((related) => related.id === id && related.basedOn.includes(work.id))
    )
      errors.push(`work ${work.id}: invalid or duplicate related work ${id}`);
  for (const field of ['title', 'category', 'summary', 'experience', 'question', 'availability']) {
    for (const lang of ['en', 'ru']) {
      if (typeof work[field]?.[lang] !== 'string' || !work[field][lang].trim())
        errors.push(`work ${work.id}: missing ${field}.${lang}`);
    }
  }
  if (!work.media.length) errors.push(`work ${work.id}: card preview missing`);
  if (work.year !== null && (!Number.isInteger(work.year) || work.year < 1000 || work.year > 2100))
    errors.push(`work ${work.id}: year must be a documented integer or explicit null`);
  if (
    !['performance', 'installation', 'game', 'object', 'participatory-practice', 'interactive-work'].includes(
      work.workType,
    )
  )
    errors.push(`work ${work.id}: invalid work type`);
  if (!['concept', 'prototype', 'in-production', 'realized'].includes(work.stage))
    errors.push(`work ${work.id}: invalid stage`);
  if (work.featuredOnHome && work.stage !== 'realized')
    errors.push(`work ${work.id}: development work featured on home`);
  for (const id of work.basedOn)
    if (!workIds.has(id) || id === work.id) errors.push(`work ${work.id}: invalid basedOn ${id}`);
  if (work.stage !== 'realized' && work.bookable) errors.push(`work ${work.id}: R&D marked bookable`);
  if (work.inRepertoire && work.stage !== 'realized')
    errors.push(`work ${work.id}: repertoire without realization`);
  for (const id of work.media) if (!mediaIds.has(id)) errors.push(`work ${work.id}: missing media ${id}`);
  for (const id of work.cases) if (!caseIds.has(id)) errors.push(`work ${work.id}: missing case ${id}`);
  for (const id of work.formats) if (!formatIds.has(id)) errors.push(`work ${work.id}: missing format ${id}`);
}
for (const format of data.formats)
  for (const id of format.works) if (!workIds.has(id)) errors.push(`format ${format.id}: missing work ${id}`);
for (const item of data.cases) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) errors.push(`case ${item.id}: invalid date`);
  if (!['performance', 'presentation', 'participatory-format'].includes(item.type))
    errors.push(`case ${item.id}: invalid event type`);
  if (!workIds.has(item.work)) errors.push(`case ${item.id}: missing work ${item.work}`);
  for (const id of item.organizations)
    if (!orgIds.has(id)) errors.push(`case ${item.id}: missing organization ${id}`);
  for (const id of item.evidence)
    if (!evidenceIds.has(id)) errors.push(`case ${item.id}: missing evidence ${id}`);
  for (const id of item.media) if (!mediaIds.has(id)) errors.push(`case ${item.id}: missing media ${id}`);
}
for (const item of data.recognitions) {
  if (item.previewSrc)
    await stat(resolve('public', item.previewSrc.slice(1))).catch(() =>
      errors.push(`recognition ${item.id}: preview asset missing`),
    );
}
const golem = JSON.parse(await readFile('src/data/golem-event-summary.json', 'utf8'));
if (golem.total !== Object.values(golem.connectionQuality).reduce((sum, n) => sum + n, 0))
  errors.push('Golem event summary: categories do not sum to total');
const recognitionSummary = JSON.parse(await readFile('src/data/legacy-recognition-summary.json', 'utf8'));
if (recognitionSummary.total !== Object.values(recognitionSummary.byKind).reduce((sum, n) => sum + n, 0))
  errors.push('Legacy recognition summary: categories do not sum to total');
if (recognitionSummary.total < data.recognitions.length)
  errors.push('Legacy recognition summary: fewer listed items than structured records');
for (const item of data.media) {
  if (!['cleared', 'review', 'restricted'].includes(item.rights))
    errors.push(`media ${item.id}: invalid rights`);
  if (item.kind === 'video' && !item.poster) errors.push(`media ${item.id}: video poster missing`);
  if (!item.src.startsWith('/')) errors.push(`media ${item.id}: source is not local`);
  else
    await stat(resolve('public', item.src.slice(1))).catch(() =>
      errors.push(`media ${item.id}: local asset missing`),
    );
  if (item.mobileSrc)
    await stat(resolve('public', item.mobileSrc.slice(1))).catch(() =>
      errors.push(`media ${item.id}: mobile asset missing`),
    );
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Verified ${data.works.length} works, ${data.formats.length} formats, ${data.cases.length} cases, ${data.media.length} media and relationships.`,
  );
