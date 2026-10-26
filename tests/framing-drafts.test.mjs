import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const { parseFramingDrafts, canonicalFocus } = await loadSiteModule('src/lib/framing-drafts.ts');
test('framing storage tolerates corruption, rejects invalid rows and preserves valid records', () => {
  for (const raw of [null, '{broken', 'null', '[]', '{"schemaVersion":1,"media":{}}'])
    assert.equal(Object.keys(parseFramingDrafts(raw)).length, 0);
  const rows = parseFramingDrafts(
    JSON.stringify({
      schemaVersion: 2,
      media: {
        good: { x: 0, y: 100, fit: 'contain' },
        bad: null,
        overflow: { x: 101, y: 0, fit: 'cover' },
        wrong: { x: '50', y: 50, fit: 'cover' },
        constructor: { x: 20, y: 30, fit: 'cover' },
      },
    }),
  );
  assert.equal(Object.getPrototypeOf(rows), null);
  assert.deepEqual(Object.keys(rows).sort(), ['constructor', 'good']);
  assert.deepEqual(rows.good, { x: 0, y: 100, fit: 'contain' });
});
test('source focal coordinates take priority over names and retain their precision', () => {
  assert.deepEqual(canonicalFocus('{"x":0.12345,"y":0.6789}', 'bottom'), { x: 12.345, y: 67.89 });
  assert.deepEqual(canonicalFocus(undefined, 'top-left'), { x: 0, y: 0 });
  assert.deepEqual(canonicalFocus('{broken', 'bottom-right'), { x: 100, y: 100 });
  assert.deepEqual(canonicalFocus(undefined, 'constructor'), { x: 50, y: 50 });
});
