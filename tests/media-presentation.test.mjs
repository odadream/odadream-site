import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const { mediaFit } = await loadSiteModule('src/lib/media-presentation.ts');
const source = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');

test('cropping requires an explicit important area and never clips documentary content', () => {
  assert.equal(mediaFit({}, 'crop'), 'natural');
  assert.equal(mediaFit({ focalPoint: 'top' }, 'crop'), 'crop');
  for (const representation of ['diagram', 'poster', 'document'])
    assert.equal(mediaFit({ representation, focalPoint: 'center' }, 'crop'), 'natural');
});

test('a gallery does not grant publication to review media outside its published work', () => {
  const publicData = createPublicationScope(source, {
    ...publicationPlan,
    works: publicationPlan.works.filter((id) => id !== 'honors'),
  });
  assert.ok(publicData.assetPaths.has('/images/content/works/schrodinger-2025-poster.webp'));
  assert.ok(!publicData.assetPaths.has('/images/content/works/honors-skolkovo/honors-skolkovo-scheme.webp'));
  const poster = publicData.media.find((row) => row.id === 'schrodinger-poster');
  assert.equal(poster.representation, 'poster');
  assert.ok(poster.credit.ru.includes('Арабовы'));
  assert.ok(!JSON.stringify(poster).includes('sourceRefs'));
});
