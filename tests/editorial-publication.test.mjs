import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const source = await loadSiteModule();
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const { createPublicationScope, buildPublicRecordIds } = await loadSiteModule('src/lib/publication-scope.ts');

test('document images inherit publication only from their checked parent document', () => {
  const publicScope = createPublicationScope(source, publicationPlan);
  const ids = buildPublicRecordIds(publicScope);
  const documents = [...publicScope.workDocuments, ...publicScope.referenceDocuments];
  assert.ok(documents.length > 0);
  for (const document of documents)
    (document.pageImages ?? []).forEach((_, index) =>
      assert.ok(ids.media.has(document.id + '-page-' + (index + 1))),
    );
  const restricted = createPublicationScope(source, { ...publicationPlan, works: [] });
  const restrictedIds = buildPublicRecordIds(restricted);
  for (const document of publicScope.workDocuments)
    assert.ok(!restrictedIds.media.has(document.id + '-page-1'));
  assert.throws(
    () => buildPublicRecordIds(createPublicationScope(source, publicationPlan, true)),
    /public projection/,
  );
});
