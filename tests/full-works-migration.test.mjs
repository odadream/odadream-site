import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const source = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { createPages } = await loadSiteModule('src/lib/routes.ts');
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');

test('remaining substantive artworks have paired direct routes, source-backed narratives and honest stage fields', () => {
  const ids = [
    'another-people',
    'dashran',
    'fourth-dimension',
    'mom-baby',
    'happiness',
    'voronka',
    'lighthouse',
    'potustoronniy',
    'honors',
    'theatre-my-name',
    'cultural-neuro-code',
    'neuromandala',
    'brain-hack',
    'journey',
  ];
  const publicData = createPublicationScope(source, publicationPlan);
  assert.deepEqual(publicData.errors, []);
  const routes = createPages(publicData);
  for (const id of ids) {
    const work = source.works.find((row) => row.id === id);
    assert.ok(work, id);
    assert.ok(
      work.sourceRefs.some((ref) => ref.file === work.legacyId + '.md'),
      id,
    );
    assert.ok(work.story.length >= 2, id);
    for (const lang of ['en', 'ru'])
      assert.ok(
        routes.some((row) => row.path === `/${lang}/works/${work.slug}/`),
        id,
      );
    assert.equal(work.featuredOnHome, false, id);
  }
  assert.equal(source.works.find((row) => row.id === 'potustoronniy').year, null);
  assert.equal(source.works.find((row) => row.id === 'honors').stage, 'concept');
  assert.equal(source.works.find((row) => row.id === 'dashran').stage, 'prototype');
  assert.equal(source.works.find((row) => row.id === 'lighthouse').stage, 'prototype');
  assert.equal(source.works.find((row) => row.id === 'happiness').workType, 'object');
  assert.ok(
    !publicData.heroVisuals.some((row) => row.id === 'cultural-code'),
    'R&D does not enter the homepage reel',
  );
});

test('meaningful written concepts declare media absence without fabricated image dependencies', () => {
  for (const id of ['brain-hack', 'journey']) {
    const work = source.works.find((row) => row.id === id);
    assert.deepEqual(work.media, []);
    assert.ok(work.mediaNote.ru && work.mediaNote.en);
    assert.equal(work.stage, 'concept');
  }
});

test('artwork-method relationships depend on the published method while retaining a distinct artwork', () => {
  const scope = createPublicationScope(source, { ...publicationPlan, methods: [] });
  const work = scope.works.find((row) => row.id === 'neuromandala');
  assert.ok(work);
  assert.equal(work.methodId, undefined);
  assert.ok(!JSON.stringify(scope.works).includes('Golem_Work_Roles.json'));
  assert.ok(!JSON.stringify(scope.works).includes('sourceRefs'));
});
