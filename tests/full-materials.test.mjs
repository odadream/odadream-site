import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadSiteModule } from '../scripts/site-data.mjs';
const data = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const scope = createPublicationScope(data, publicationPlan);
const inventory = JSON.parse(await readFile('docs/migration/INVENTORY-2026-10-05.json'));

test('all 198 historical resources have checked outcomes tied to real records or explicit exclusions', () => {
  const items = inventory.currentFullMediaReassessment.items;
  assert.equal(items.length, 198);
  for (const row of items) {
    assert.ok(row.application?.reason, row.path);
    const outcome = row.application;
    if (outcome.mediaId)
      assert.ok(
        data.media.some((item) => item.id === outcome.mediaId),
        row.path,
      );
    if (outcome.workDocumentId)
      assert.ok(
        data.workDocuments.some((item) => item.id === outcome.workDocumentId),
        row.path,
      );
    if (outcome.recognitionId)
      assert.ok(
        data.recognitions.some((item) => item.id === outcome.recognitionId),
        row.path,
      );
    assert.notEqual(outcome.action, 'evidence-review', row.path);
  }
});

test('English addressed budget page stays out of public assets and original downloads', () => {
  const original = data.workDocuments.find((row) => row.id === 'other-people-en');
  const visible = scope.workDocuments.find((row) => row.id === original.id);
  assert.deepEqual(
    visible.pageImages.map((row) => row.pageNumber),
    [1, 2, 3, 4],
  );
  assert.equal(visible.pages, 5);
  assert.equal(visible.href, undefined);
  assert.ok(!scope.assetPaths.has(original.href));
  const budgetPath = visible.pageImages[0].src.replace('page-001', 'page-005');
  assert.ok(!scope.assetPaths.has(budgetPath));
  assert.ok(!JSON.stringify(visible).includes('selectedPages'));
});

test('recognition archive distinguishes 13 scans and one unverified reference without rights bypass', () => {
  assert.equal(scope.recognitions.length, 14);
  assert.equal(scope.recognitions.filter((row) => row.previewSrc).length, 13);
  const missing = scope.recognitions.find((row) => row.id === 'mipt-letter-2025');
  assert.equal(missing.documentState, 'missing');
  assert.equal(missing.documentRights, 'review');
  assert.equal(missing.previewSrc, undefined);
  assert.ok(!scope.assetPaths.has('/images/proofs/proof-mipt-letter.svg'));
  for (const row of scope.recognitions.filter((row) => row.previewSrc)) {
    assert.ok(scope.assetPaths.has(row.previewSrc));
    assert.ok(row.width > 0 && row.height > 0);
  }
});

test('both archived renders retain complete players, first frames and separate previews inside Lighthouse', () => {
  const work = scope.works.find((row) => row.id === 'lighthouse');
  for (const id of ['lighthouse-blended-spin', 'lighthouse-spin-twist']) {
    assert.ok(work.media.includes(id));
    const video = scope.media.find((row) => row.id === id);
    assert.equal(video.representation, 'render');
    assert.notEqual(video.src, video.previewSrc);
    for (const path of [video.src, video.previewSrc, video.poster]) assert.ok(scope.assetPaths.has(path));
    const original = data.media.find((row) => row.id === id);
    assert.ok(!scope.assetPaths.has(original.archiveSource.inputPath));
    assert.ok(!JSON.stringify(video).includes('archiveSource'));
  }
});
