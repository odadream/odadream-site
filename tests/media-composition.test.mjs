import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const { defaultComposition, validComposition, readCompositionDraft, compositionTransform } =
  await loadSiteModule('src/lib/media-composition.ts');
test('normalized compositions reject invalid/outside regions and malicious draft keys', () => {
  assert.ok(validComposition(defaultComposition()));
  for (const c of [
    { ...defaultComposition(), point: { x: NaN, y: 0.5 } },
    { ...defaultComposition(), region: { x: 0.9, y: 0, width: 0.5, height: 1 } },
    { ...defaultComposition(), region: { x: 0, y: 0, width: 0, height: 1 } },
  ])
    assert.equal(validComposition(c), false);
  assert.deepEqual(readCompositionDraft('not-json'), { schemaVersion: 1, media: {} });
  const c = defaultComposition();
  const draft = readCompositionDraft(
    JSON.stringify({
      schemaVersion: 1,
      media: {
        photo: { card: { desktop: c } },
        constructor: { hero: { desktop: c } },
        other: { unexpected: { desktop: c } },
      },
    }),
  );
  assert.deepEqual(Object.keys(draft.media), ['photo']);
  assert.deepEqual(draft.media.photo.card.desktop, c);
  assert.equal(Object.hasOwn(Object, 'hero'), false);
});
test('point fills a frame while explicit region keeps the chosen area whole', () => {
  const c = defaultComposition();
  c.point = { x: 0, y: 1 };
  const p = compositionTransform(2000, 1000, 400, 400, c);
  assert.equal(p.imageWidth, 800);
  assert.equal(Math.abs(p.left), 0);
  assert.equal(p.top, 0);
  c.mode = 'region';
  c.region = { x: 0.25, y: 0.25, width: 0.5, height: 0.5 };
  const r = compositionTransform(2000, 1000, 400, 400, c);
  assert.equal(r.windowWidth, 400);
  assert.equal(r.windowHeight, 200);
  assert.equal(r.left, -200);
  assert.equal(r.top, -100);
  assert.throws(() => compositionTransform(0, 100, 20, 20, c));
});
