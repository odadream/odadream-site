import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile('src/data/site.ts', 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const data = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
const failures = [];
for (const item of data.heroVisuals ?? []) {
  if (!data.media.some((media) => media.id === item.mediaId))
    failures.push(`hero ${item.id}: media ${item.mediaId} is missing`);
  if (item.target.kind === 'unmapped') failures.push(`hero ${item.id}: work/case link is not curated`);
  if (item.target.kind === 'work') {
    const work = data.works.find((row) => row.id === item.target.workId);
    if (!work) failures.push(`hero ${item.id}: work ${item.target.workId} is missing`);
    if (item.target.caseId) {
      const linkedCase = data.cases.find((row) => row.id === item.target.caseId);
      if (!linkedCase) failures.push(`hero ${item.id}: case ${item.target.caseId} is missing`);
      else if (linkedCase.work !== item.target.workId)
        failures.push(`hero ${item.id}: case ${item.target.caseId} describes a different work`);
    }
  }
}
for (const [name, records] of [
  ['work', data.works],
  ['format', data.formats],
  ['case', data.cases],
  ['person', data.people],
])
  for (const row of records)
    if (row.publication !== 'published') failures.push(`${name} ${row.id}: ${row.publication}`);
for (const row of data.media)
  if (row.rights !== 'cleared') failures.push(`media ${row.id}: rights ${row.rights}`);
for (const row of data.media)
  if (row.kind === 'video' && !row.poster) failures.push(`media ${row.id}: video poster missing`);
for (const row of data.evidence)
  if (row.permission !== 'cleared') failures.push(`evidence ${row.id}: permission ${row.permission}`);
for (const row of data.recognitions ?? [])
  if (row.publication !== 'published' || row.documentRights !== 'cleared')
    failures.push(`recognition ${row.id}: publication or document rights not cleared`);
if (
  data.minddbSnapshot &&
  (data.minddbSnapshot.publication !== 'published' || data.minddbSnapshot.privacyReview !== 'published')
)
  failures.push('MindDB aggregate: publication and privacy reviews not cleared');
const audit = JSON.parse(await readFile('docs/media-audit.json', 'utf8'));
const decisions = JSON.parse(await readFile('docs/media-decisions.json', 'utf8'));
const unresolved = audit.filter((row) => {
  if (row.retained) return false;
  const decision = decisions[row.path];
  return (
    !decision ||
    !['retire', 'redirect'].includes(decision.action) ||
    !decision.approvedBy ||
    !decision.approvedOn ||
    !decision.reason ||
    (decision.action === 'redirect' && (!decision.target || decision.httpLayerVerified !== true))
  );
});
if (unresolved.length)
  failures.push(
    `${unresolved.length} old public media URLs still require an approved preserve/retire decision`,
  );
if (failures.length) {
  console.error('Release blocked:\n' + failures.map((x) => `- ${x}`).join('\n'));
  process.exitCode = 1;
} else console.log('Editorial, media rights and legacy media gates cleared.');
