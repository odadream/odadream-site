import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { loadSiteModule } from '../scripts/site-data.mjs';
import { cvInput } from '../scripts/document-input.mjs';

const original = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
function fixture() {
  const source = structuredClone(
    Object.fromEntries(Object.entries(original).filter(([, value]) => typeof value !== 'function')),
  );
  for (const key of [
    'works',
    'configurations',
    'cases',
    'people',
    'methods',
    'cooperationPages',
    'studioPages',
  ])
    source[key] = source[key].map((row) => ({ ...row, publication: 'published' }));
  return source;
}
test('a CV requires its studio, subject and every referenced work/case, and keeps independent rights', () => {
  const source = fixture();
  const cv = source.referenceDocuments.find((row) => row.id === 'cv-olga-en');
  assert.ok(createPublicationScope(source, publicationPlan, false).assetPaths.has(cv.href));
  for (const [key, id] of [
    ['studioPages', 'studio'],
    ['people', 'olga'],
    ['works', cv.requiredWorks[0]],
    ['cases', cv.requiredCases[0]],
  ]) {
    source[key].find((row) => row.id === id).publication = 'review';
    assert.ok(!createPublicationScope(source, publicationPlan, false).assetPaths.has(cv.href));
    source[key].find((row) => row.id === id).publication = 'published';
  }
  cv.rights = 'restricted';
  assert.ok(!createPublicationScope(source, publicationPlan, false).assetPaths.has(cv.href));
});
test('prepared CV bytes and facts agree; changing personal education invalidates the old export', async () => {
  const source = fixture();
  for (const cv of source.referenceDocuments.filter((row) => row.kind === 'cv')) {
    assert.equal(cv.pages, 1);
    assert.equal(
      createHash('sha256')
        .update(JSON.stringify(cvInput(source, cv)))
        .digest('hex'),
      cv.contentFingerprint,
    );
    const bytes = await readFile('public' + cv.href);
    assert.equal(bytes.length, cv.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), cv.sha256);
  }
  const cv = source.referenceDocuments.find((row) => row.id === 'cv-olga-en');
  source.people.find((row) => row.id === 'olga').cv.sections[1].body.en = 'Changed education';
  assert.notEqual(
    createHash('sha256')
      .update(JSON.stringify(cvInput(source, cv)))
      .digest('hex'),
    cv.contentFingerprint,
  );
});
test('nested CV editorial fields and references to deferred projects cannot enter the public projection', () => {
  const source = fixture();
  const person = source.people.find((row) => row.id === 'daler');
  person.cv.privatePath = 'DO-NOT-EXPORT';
  person.cv.sections[0].privatePath = 'DO-NOT-EXPORT';
  source.works.find((row) => row.id === person.cv.workIds[0]).publication = 'review';
  const scope = createPublicationScope(source, publicationPlan, false);
  const publicPerson = scope.people.find((row) => row.id === 'daler');
  assert.ok(!publicPerson.cv.workIds.includes(person.cv.workIds[0]));
  assert.ok(!JSON.stringify(publicPerson).includes('DO-NOT-EXPORT'));
  assert.ok(!JSON.stringify(publicPerson).includes('sourceRefs'));
  for (const row of scope.referenceDocuments) assert.ok(!('contentFingerprint' in row));
});
