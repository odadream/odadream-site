import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { loadSiteModule } from '../scripts/site-data.mjs';
import { technicalOverviewInput } from '../scripts/document-input.mjs';

const original = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
function fixture() {
  const source = structuredClone(
    Object.fromEntries(Object.entries(original).filter(([, value]) => typeof value !== 'function')),
  );
  source.referenceDocuments = source.referenceDocuments.filter((row) => row.kind === 'technical-overview');
  for (const key of ['works', 'formats', 'methods', 'cooperationPages', 'studioPages', 'people', 'cases'])
    source[key] = source[key].map((row) => ({ ...row, publication: 'published' }));
  return source;
}

test('current PDFs require their published owner, every referenced format and independent rights', () => {
  const source = fixture();
  const paths = source.referenceDocuments.map((row) => row.href);
  let scope = createPublicationScope(source, publicationPlan, false);
  assert.equal(scope.referenceDocuments.length, 2);
  for (const path of paths) assert.ok(scope.assetPaths.has(path));
  source.cooperationPages[0].publication = 'review';
  scope = createPublicationScope(source, publicationPlan, false);
  assert.equal(scope.referenceDocuments.length, 0);
  for (const path of paths) assert.ok(!scope.assetPaths.has(path));
  source.cooperationPages[0].publication = 'published';
  source.formats[0].publication = 'review';
  assert.equal(createPublicationScope(source, publicationPlan, false).referenceDocuments.length, 0);
  source.formats[0].publication = 'published';
  source.referenceDocuments[0].rights = 'restricted';
  scope = createPublicationScope(source, publicationPlan, false);
  assert.ok(!scope.assetPaths.has(paths[0]));
  source.referenceDocuments[0].rights = 'cleared';
  source.referenceDocuments[0].href = '/documents/../private.pdf';
  scope = createPublicationScope(source, publicationPlan, false);
  assert.ok(!scope.assetPaths.has(source.referenceDocuments[0].href));
});

test('document fingerprints and internal future fields stay outside the public projection', () => {
  const source = fixture();
  source.referenceDocuments[0].privateNote = 'DO-NOT-EXPORT';
  source.referenceDocuments[0].owner.privateNote = 'DO-NOT-EXPORT';
  const scope = createPublicationScope(source, publicationPlan, false);
  const output = JSON.stringify(scope.referenceDocuments);
  assert.ok(!output.includes('DO-NOT-EXPORT'));
  for (const key of ['sha256', 'sourceRefs', 'contentFingerprint', 'requiredFormats', 'requiredPeople'])
    assert.ok(!output.includes(`"${key}"`));
});

test('prepared overview bytes and editorial facts agree; a changed condition requires a new PDF', async () => {
  const source = fixture();
  for (const row of source.referenceDocuments) {
    const fingerprint = createHash('sha256')
      .update(JSON.stringify(technicalOverviewInput(source, row.asOf)))
      .digest('hex');
    assert.equal(fingerprint, row.contentFingerprint);
    const bytes = await readFile('public' + row.href);
    assert.equal(bytes.length, row.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), row.sha256);
  }
  source.formats[0].conditions[0].value.en = 'Changed venue requirement';
  const row = source.referenceDocuments[0];
  assert.notEqual(
    createHash('sha256')
      .update(JSON.stringify(technicalOverviewInput(source, row.asOf)))
      .digest('hex'),
    row.contentFingerprint,
  );
});
