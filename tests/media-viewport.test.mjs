import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const { mediaFitScale, mediaZoomPosition, mediaSwipeDirection } =
  await loadSiteModule('src/lib/media-viewport.ts');

test('swipe requires a deliberate horizontal movement within the configured duration', () => {
  const swipe = (dx, dy, ms) => mediaSwipeDirection(dx, dy, ms, 44, 700, 1.25);
  assert.equal(swipe(-80, 12, 250), 1);
  assert.equal(swipe(80, -12, 250), -1);
  assert.equal(swipe(43, 0, 200), 0);
  assert.equal(swipe(50, 40, 200), 0);
  assert.equal(swipe(10, 100, 200), 0);
  assert.equal(swipe(-80, 0, 701), 0);
  assert.equal(swipe(-80, 0, -1), 0);
});

test('portrait, landscape and small sources fit both dimensions without unnecessary upscaling', () => {
  assert.equal(mediaFitScale(1000, 2000, 400, 600), 0.3);
  assert.equal(mediaFitScale(2000, 1000, 400, 600), 0.2);
  assert.equal(mediaFitScale(100, 100, 400, 600), 1);
  assert.equal(mediaFitScale(0, 0, 400, 600), 1);
});
test('zoom keeps the centre of a fitted portrait under the same point', () => {
  assert.deepEqual(
    mediaZoomPosition({
      width: 1000,
      height: 2000,
      viewportWidth: 400,
      viewportHeight: 600,
      scale: 0.3,
      nextScale: 1,
      left: 0,
      top: 0,
      anchorX: 200,
      anchorY: 300,
    }),
    { left: 300, top: 700 },
  );
});
test('pinch centroid movement pans the same point while scaling', () => {
  assert.deepEqual(
    mediaZoomPosition({
      width: 1000,
      height: 1000,
      viewportWidth: 400,
      viewportHeight: 400,
      scale: 1,
      nextScale: 2,
      left: 100,
      top: 100,
      previousX: 200,
      previousY: 200,
      anchorX: 240,
      anchorY: 220,
    }),
    { left: 360, top: 380 },
  );
});
test('edges clamp and returning to fit removes all scroll offsets', () => {
  const base = {
    width: 1000,
    height: 1000,
    viewportWidth: 400,
    viewportHeight: 400,
    scale: 1,
    nextScale: 0.4,
    left: 600,
    top: 600,
    anchorX: 0,
    anchorY: 0,
  };
  assert.deepEqual(mediaZoomPosition(base), { left: 0, top: 0 });
  assert.deepEqual(mediaZoomPosition({ ...base, nextScale: 2, left: 10000, top: 10000 }), {
    left: 1600,
    top: 1600,
  });
});
test('scrollbar viewport changes do not shift the point under the gesture', () => {
  assert.deepEqual(
    mediaZoomPosition({
      width: 1000,
      height: 2000,
      viewportWidth: 385,
      viewportHeight: 585,
      previousViewportWidth: 400,
      previousViewportHeight: 600,
      scale: 0.3,
      nextScale: 1,
      left: 0,
      top: 0,
      anchorX: 200,
      anchorY: 300,
    }),
    { left: 300, top: 700 },
  );
});
