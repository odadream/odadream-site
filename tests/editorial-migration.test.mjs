import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadSiteModule } from '../scripts/site-data.mjs';

const data = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { createPages } = await loadSiteModule('src/lib/routes.ts');
const { resolveLegacyRoutes } = await loadSiteModule('src/lib/legacy-routes.ts');
const inventory = JSON.parse(await readFile('docs/migration/INVENTORY-2026-10-05.json', 'utf8'));
const plan = {
  version: 'fixture',
  asOf: '2026-10-06',
  works: [],
  formats: [],
  cases: [],
  people: [],
  recognitions: [],
  heroVisuals: [],
  minddb: false,
  methods: ['neuromandala'],
  cooperationPages: ['cooperation'],
};

test('selected editorial sources retain exact dated provenance and coverage in the inventory', () => {
  assert.deepEqual(Object.keys(data.sourceSnapshots).sort(), Object.keys(inventory.v2SourceSnapshots).sort());
  for (const [file, snapshot] of Object.entries(data.sourceSnapshots)) {
    assert.deepEqual(snapshot, inventory.v2SourceSnapshots[file]);
    const row =
      inventory.entries.find((entry) => entry.sourceFile === file) ??
      inventory.externalSourceSnapshots?.[file];
    assert.ok(row, `Unregistered editorial source ${file}`);
    if (inventory.externalSourceSnapshots?.[file]) assert.equal(row.kind, 'external-editorial');
    assert.equal(row.v2Migration.sourceSha256, snapshot.sha256);
    assert.ok(row.v2Migration.targets.length);
  }
});

test('conflicting timing and historical throughput remain distinct from current guarantees', () => {
  const mindshow = data.formats.find((row) => row.id === 'mindshow-installation');
  assert.equal(mindshow.conditions.find((row) => row.id === 'session').state, 'conflict');
  assert.match(mindshow.conditions.find((row) => row.id === 'session').value.ru, /7 ± 2/);
  assert.match(mindshow.conditions.find((row) => row.id === 'session').value.ru, /1,5/);
  const game = data.formats.find((row) => row.id === 'neurobattle-game');
  assert.match(game.title.ru, /Парадокс Успеха/);
  assert.equal(game.conditions.find((row) => row.id === 'flow').state, 'historical');
  assert.equal(
    data.formats
      .find((row) => row.id === 'talk-workshop')
      .conditions.find((row) => row.id === 'talk-duration').state,
    'conflict',
  );
});

test('method and cooperation stay out of public projection until editorial approval', () => {
  const scope = createPublicationScope(data, plan);
  assert.equal(scope.methods.length, 0);
  assert.equal(scope.cooperationPages.length, 0);
  assert.ok(scope.errors.some((error) => error.includes('neuromandala: review')));
  assert.ok(scope.errors.some((error) => error.includes('cooperation: review')));
});

test('work narratives retain owner decisions, real roles and source coverage', () => {
  for (const work of data.works) {
    assert.ok(work.story.length >= 2, work.id);
    assert.ok(work.credits.length, work.id);
    assert.ok(
      work.sourceRefs.some((ref) => ref.file === `${work.legacyId}.md`),
      work.id,
    );
    assert.equal(new Set(work.story.map((row) => row.id)).size, work.story.length, work.id);
  }
  assert.equal(data.works.find((w) => w.id === 'sync').stage, 'concept');
  assert.equal(data.works.find((w) => w.id === 'ancestors').stage, 'prototype');
  assert.match(
    data.works.find((w) => w.id === 'schrodinger').story[1].body.ru,
    /четыре канала.*четыре пульсоканала/,
  );
  assert.ok(data.works.find((w) => w.id === 'mindshow').aliases.includes('MindGrid'));
  assert.equal(data.works.filter((w) => w.legacyId === 'emomandala-os').length, 0);
});

test('approved work exports its story but hides source locators and links to deferred works', () => {
  const source = { ...data, works: structuredClone(data.works) };
  source.works.find((w) => w.id === 'rings').publication = 'published';
  const packet = { ...plan, methods: [], cooperationPages: [], works: ['rings'] };
  const scope = createPublicationScope(source, packet);
  assert.deepEqual(scope.errors, []);
  assert.equal(scope.works[0].story.length, 3);
  assert.equal(scope.works[0].credits.length, 1);
  assert.deepEqual(scope.works[0].relatedWorks, []);
  assert.ok(!JSON.stringify(scope.works).includes('sourceRefs'));
  assert.ok(!JSON.stringify(scope.works).includes('sourceSnapshots'));
  assert.ok(
    createPages(scope)
      .find((row) => row.path === '/ru/works/oda-rings/')
      .anchors.includes('work-story-history'),
  );
});

test('studio biographies require published people and public data never includes internal source references', () => {
  const source = {
    ...data,
    studioPages: structuredClone(data.studioPages),
    people: structuredClone(data.people),
  };
  source.studioPages[0].publication = 'published';
  const packet = {
    ...plan,
    methods: [],
    cooperationPages: [],
    studioPages: ['studio'],
    people: ['olga', 'daler'],
  };
  const pending = createPublicationScope(source, packet);
  assert.equal(pending.studioPages.length, 0);
  assert.ok(pending.errors.some((error) => error.includes('outside the published packet')));
  source.people
    .filter((row) => packet.people.includes(row.id))
    .forEach((row) => (row.publication = 'published'));
  const scope = createPublicationScope(source, packet);
  assert.deepEqual(scope.errors, []);
  assert.equal(scope.studioPages.length, 1);
  assert.equal(scope.people.length, 2);
  assert.ok(!JSON.stringify(scope.studioPages).includes('sourceRefs'));
  assert.ok(!JSON.stringify(scope.people).includes('sourceRefs'));
  assert.ok(scope.people.every((row) => row.biography.en && row.biography.ru));
  assert.ok(scope.studioPages[0].teaching.every((row) => row.year === 2025 && !('date' in row)));
  const routes = createPages(scope);
  assert.ok(routes.find((row) => row.path === '/ru/studio/').anchors.includes('teaching-sber'));
  const deferredRoutes = createPages(createPublicationScope(data, packet));
  const old = [
    {
      id: 'event-sber-lecture-2025',
      targetEn: '/en/studio/#teaching-sber',
      targetRu: '/ru/studio/#teaching-sber',
    },
  ];
  assert.match(resolveLegacyRoutes(old, deferredRoutes)['event-sber-lecture-2025'][1], /legacy\/unavailable/);
});

test('approved method hero depends on that method and cleared media, not a fabricated artwork', () => {
  const source = { ...data, methods: structuredClone(data.methods), media: structuredClone(data.media) };
  source.methods[0].publication = 'published';
  const packet = { ...plan, cooperationPages: [], heroVisuals: ['terra'] };
  const scope = createPublicationScope(source, packet);
  assert.deepEqual(scope.errors, []);
  assert.equal(scope.works.length, 0);
  assert.equal(scope.heroVisuals[0].target.kind, 'method');
  assert.ok(scope.assetPaths.has('/video/hero/terra-preview.mp4'));
  assert.ok(!JSON.stringify(scope.methods).includes('sourceRefs'));
  source.media.find((row) => row.id === 'neuromandala-terra').rights = 'restricted';
  const restricted = createPublicationScope(source, packet);
  assert.equal(restricted.heroVisuals.length, 0);
  assert.ok(restricted.errors.some((error) => error.includes('restricted')));
});

test('legacy section links are exact in preview and fall back safely when the public section is deferred', () => {
  const rows = [
    {
      id: 'hub-education',
      targetEn: '/en/cooperation/#for-education',
      targetRu: '/ru/cooperation/#for-education',
    },
  ];
  const preview = createPublicationScope(data, plan, true);
  const previewRoutes = resolveLegacyRoutes(rows, createPages(preview));
  assert.equal(previewRoutes['hub-education'][1], rows[0].targetRu);
  const publicRoutes = resolveLegacyRoutes(rows, createPages(createPublicationScope(data, plan)));
  assert.equal(publicRoutes['hub-education'][1], '/legacy/unavailable/?id=hub-education&lang=ru');
});
