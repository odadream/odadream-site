import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';

const { media } = await loadSiteModule('src/data/catalogue.ts');
const { galleryMetadata } = await loadSiteModule('src/lib/gallery-metadata.ts');

test('public media separates frame description, accessible alt and event context in both languages', () => {
  const item = media.find((row) => row.id === 'archive-interference-interference-2026-05');
  for (const lang of ['ru', 'en']) {
    assert.ok(item.description[lang]);
    assert.notEqual(item.description[lang], item.caption[lang]);
    assert.notEqual(item.description[lang], item.alt[lang]);
    const outside = galleryMetadata(item, lang);
    const inside = galleryMetadata(item, lang, 'tsiolkovsky-2026');
    assert.equal(outside.title, item.description[lang]);
    assert.equal(outside.event.id, 'tsiolkovsky-2026');
    assert.equal(outside.event.date, '2026');
    assert.equal(inside.title, outside.title);
    assert.equal(inside.event, undefined);
    assert.ok(item.caption[lang].includes('2026'));
  }
});

test('legacy photograph descriptions use real alt without inventing dates or rewriting originals', () => {
  const item = {
    id: 'unrelated-test-photo',
    kind: 'image',
    representation: 'photograph',
    alt: { ru: 'Зритель у экрана', en: 'Visitor by a screen' },
    caption: { ru: 'Архив события', en: 'Event archive' },
  };
  assert.equal(galleryMetadata(item, 'ru').title, item.alt.ru);
  assert.equal(galleryMetadata(item, 'en').event, undefined);
  assert.equal(item.caption.ru, 'Архив события');
});

test('an event presentation subset does not erase the provenance of its other photos', () => {
  const item = media.find((row) => row.id === 'archive-interference-interference-2026-03');
  assert.equal(galleryMetadata(item, 'ru').event.id, 'tsiolkovsky-2026');
  assert.equal(galleryMetadata(item, 'ru', 'tsiolkovsky-2026').event, undefined);
});
