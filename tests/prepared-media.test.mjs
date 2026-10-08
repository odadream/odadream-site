import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
import { verifyPreparedMedia } from '../scripts/verify-prepared-media.mjs';

const data = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const { preparedMedia } = await loadSiteModule('src/data/prepared-media.ts');

test('prepared pages and photographs match their original and derivative fingerprints', async () => {
  assert.deepEqual(await verifyPreparedMedia(data), []);
  const modified = { ...data, workDocuments: data.workDocuments.map((row) => ({ ...row })) };
  modified.workDocuments[0].sha256 = 'stale';
  assert.ok((await verifyPreparedMedia(modified)).some((error) => error.includes('stale')));
});

test('document page galleries inherit owner and rights gates without leaking extracted text', () => {
  const source = structuredClone(
    Object.fromEntries(Object.entries(data).filter(([, row]) => typeof row !== 'function')),
  );
  const scope = createPublicationScope(source, publicationPlan);
  const drawing = scope.workDocuments.find((row) => row.id === 'oda-rings-drawings');
  assert.equal(drawing.pageImages.length, drawing.pages);
  assert.ok(scope.assetPaths.has(drawing.pageImages[0].src));
  assert.ok(!/sha256|cacheDirectory|textStatus|sourceSha256|\.txt/.test(JSON.stringify(drawing)));
  source.workDocuments.find((row) => row.id === drawing.id).rights = 'restricted';
  const restricted = createPublicationScope(source, publicationPlan);
  assert.ok(!restricted.workDocuments.some((row) => row.id === drawing.id));
  assert.ok(!restricted.assetPaths.has(drawing.pageImages[0].src));
});

test('public and preview media use the same compressed image dimensions and paths', () => {
  for (const preview of [false, true]) {
    const scope = createPublicationScope(data, publicationPlan, preview);
    for (const original of data.media.filter((row) => row.kind === 'image')) {
      const visible = scope.media.find((row) => row.id === original.id);
      if (!visible) continue;
      const derivative = preparedMedia[original.src].images[0];
      assert.equal(visible.src, derivative.src);
      assert.equal(visible.width, derivative.width);
      assert.equal(visible.height, derivative.height);
      assert.ok(scope.assetPaths.has(visible.src));
    }
  }
});
