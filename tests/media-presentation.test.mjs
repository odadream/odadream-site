import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const { mediaFit } = await loadSiteModule('src/lib/media-presentation.ts');
const source = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');

test('owner-approved covers, featured selection and supplied certificates reach PUBLIC', async () => {
  const scope = createPublicationScope(source, publicationPlan);
  for (const [work, cover] of [
    ['mindshow', 'portal-2024-recording'],
    ['neurobattle', 'dano-game-recording'],
    ['schrodinger', 'archive-schrodinger-schrodinger-2025-06'],
    ['mom-baby', 'archive-mom-baby-photo-with-statuette'],
  ])
    assert.equal(scope.works.find((row) => row.id === work).media[0], cover);
  assert.equal(scope.works.find((row) => row.id === 'mom-baby').featuredOnHome, true);
  assert.equal(scope.works.find((row) => row.id === 'emomandala').featuredOnHome, false);
  for (const id of ['skolkovo-arttech-2026', 'mipt-letter-2025']) {
    const row = scope.recognitions.find((row) => row.id === id);
    assert.equal(row.documentState, 'available');
    assert.equal(row.documentRights, 'cleared');
    assert.ok(row.previewSrc);
  }
  const { mediaPositionStyle } = await loadSiteModule('src/lib/media-presentation.ts');
  const pendant = scope.media.find((row) => row.id === 'archive-mom-baby-photo-with-statuette');
  assert.ok(pendant.focalPosition.desktop.y > 0.58);
  assert.match(mediaPositionStyle(pendant), /--media-position-mobile:/);
  assert.throws(() => mediaPositionStyle({ ...pendant, focalPosition: { desktop: { x: 2, y: 0.5 } } }));
});

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

test('compact document geometry is available before lazy image decoding', async () => {
  const { mediaPositionStyle } = await loadSiteModule('src/lib/media-presentation.ts');
  assert.equal(mediaPositionStyle({ width: 600, height: 900 }), '--media-ratio:0.6666666666666666;');
  assert.equal(mediaPositionStyle(undefined), undefined);
});
