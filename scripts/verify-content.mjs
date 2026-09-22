import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';

const source = await readFile('src/data/site.ts', 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const data = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
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
for (const name of ['works', 'formats', 'cases', 'evidence', 'people', 'organizations', 'media'])
  checkCollection(name, data[name]);
const ids = (rows) => new Set(rows.map((row) => row.id));
const workIds = ids(data.works),
  formatIds = ids(data.formats),
  caseIds = ids(data.cases),
  mediaIds = ids(data.media),
  orgIds = ids(data.organizations),
  evidenceIds = ids(data.evidence);
for (const work of data.works) {
  if (work.rnd && work.bookable) errors.push(`work ${work.id}: R&D marked bookable`);
  if (work.inRepertoire && !work.realized) errors.push(`work ${work.id}: repertoire without realization`);
  for (const id of work.media) if (!mediaIds.has(id)) errors.push(`work ${work.id}: missing media ${id}`);
  for (const id of work.cases) if (!caseIds.has(id)) errors.push(`work ${work.id}: missing case ${id}`);
  for (const id of work.formats) if (!formatIds.has(id)) errors.push(`work ${work.id}: missing format ${id}`);
}
for (const format of data.formats)
  for (const id of format.works) if (!workIds.has(id)) errors.push(`format ${format.id}: missing work ${id}`);
for (const item of data.cases) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) errors.push(`case ${item.id}: invalid date`);
  if (!workIds.has(item.work)) errors.push(`case ${item.id}: missing work ${item.work}`);
  for (const id of item.organizations)
    if (!orgIds.has(id)) errors.push(`case ${item.id}: missing organization ${id}`);
  for (const id of item.evidence)
    if (!evidenceIds.has(id)) errors.push(`case ${item.id}: missing evidence ${id}`);
  for (const id of item.media) if (!mediaIds.has(id)) errors.push(`case ${item.id}: missing media ${id}`);
}
for (const item of data.media) {
  if (!['cleared', 'review', 'restricted'].includes(item.rights))
    errors.push(`media ${item.id}: invalid rights`);
  if (item.kind === 'video' && !item.poster) errors.push(`media ${item.id}: video poster missing`);
  if (!item.src.startsWith('/')) errors.push(`media ${item.id}: source is not local`);
  else
    await stat(resolve('public', item.src.slice(1))).catch(() =>
      errors.push(`media ${item.id}: local asset missing`),
    );
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Verified ${data.works.length} works, ${data.formats.length} formats, ${data.cases.length} cases, ${data.media.length} media and relationships.`,
  );
