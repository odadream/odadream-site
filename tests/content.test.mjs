import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const rows = JSON.parse(await readFile(new URL('../src/data/legacy-map.json', import.meta.url)));
test('all unique old IDs have explicit, sorted mappings', () => {
  assert.equal(rows.length, 238);
  assert.equal(new Set(rows.map((x) => x.id)).size, rows.length);
  assert.deepEqual(
    rows.map((x) => x.id),
    [...rows.map((x) => x.id)].sort((a, b) => a.localeCompare(b, 'en')),
  );
  assert.equal(rows.find((x) => x.id === 'event-pleinair-metro-2024').duplicateSources.length, 0);
});
test('all target destinations are paired and safe', () => {
  for (const row of rows) {
    assert.ok(['page', 'anchor', 'not-transferred'].includes(row.disposition));
    assert.ok(row.source.endsWith('.md'));
    assert.ok(row.hash.length === 64);
    if (row.disposition === 'not-transferred') {
      assert.equal(row.targetEn, '/legacy/unavailable/');
      assert.equal(row.targetRu, '/legacy/unavailable/');
    } else {
      assert.equal(row.targetEn.replace(/^\/en/, ''), row.targetRu.replace(/^\/ru/, ''));
    }
  }
});
test('restricted media never points to a raw asset', () => {
  const recording = rows.find((x) => x.id === 'media-interference-recording');
  assert.equal(recording.access, 'restricted');
  assert.equal(recording.disposition, 'not-transferred');
});
test('curated work and case IDs have direct pages', () => {
  for (const id of [
    'interference',
    'mindshow',
    'neurobattle',
    'schrodinger',
    'oda-rings',
    'sync-circle',
    'emomandala',
    'neurosync',
    'ancestors',
    'event-tsiolkovsky-2026',
    'event-tsiolkovsky-2025',
    'event-dano-ekoniva-2025',
    'event-byob-2026',
  ]) {
    assert.equal(rows.find((x) => x.id === id)?.disposition, 'page');
  }
});
