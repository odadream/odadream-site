import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const data = await loadSiteModule();
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { buildHeroLibrary } = await loadSiteModule('src/lib/hero-library.ts');
test('hero contains every prepared public video with an owner, including labelled research material', () => {
  const scope = createPublicationScope(data, publicationPlan);
  const library = buildHeroLibrary(scope);
  assert.equal(library.length, 7);
  assert.equal(new Set(library.map((row) => row.mediaId)).size, library.length);
  assert.ok(library.some((row) => row.target.kind === 'work' && row.target.workId === 'lighthouse'));
  assert.ok(library.some((row) => row.target.kind === 'work' && row.target.workId === 'cultural-neuro-code'));
  assert.ok(library.some((row) => row.target.kind === 'method'));
  for (const row of library) {
    const media = scope.media.find((media) => media.id === row.mediaId);
    assert.ok(scope.assetPaths.has(media.previewSrc));
    assert.ok(scope.assetPaths.has(media.poster));
  }
});
test('deferred owners, restricted clips, missing previews and unowned media cannot enter hero', () => {
  const source = { ...data, works: structuredClone(data.works), media: structuredClone(data.media) };
  source.works.find((work) => work.id === 'lighthouse').publication = 'draft';
  source.media.find((media) => media.id === 'neuromandala-cultural-code').rights = 'restricted';
  const scope = createPublicationScope(source, publicationPlan);
  scope.media.push({ id: 'unowned', rights: 'cleared', previewSrc: '/x.mp4', poster: '/x.webp' });
  scope.media.push({ id: 'no-poster', rights: 'cleared', previewSrc: '/x.mp4' });
  const library = buildHeroLibrary(scope);
  assert.ok(
    !library.some((row) => ['unowned', 'no-poster', 'neuromandala-cultural-code'].includes(row.mediaId)),
  );
  assert.ok(!library.some((row) => row.target.kind === 'work' && row.target.workId === 'lighthouse'));
  assert.deepEqual(buildHeroLibrary({ media: [], works: [], methods: [], cases: [], heroVisuals: [] }), []);
});
