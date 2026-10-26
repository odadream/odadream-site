import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadSiteModule } from '../scripts/site-data.mjs';

const data = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { createPages } = await loadSiteModule('src/lib/routes.ts');
const { resolveLegacyRoutes } = await loadSiteModule('src/lib/legacy-routes.ts');
const inventory = JSON.parse(await readFile('docs/migration/INVENTORY-2026-10-05.json', 'utf8'));
const ownerInventory = JSON.parse(await readFile('docs/RECOGNITION-SOURCE-INVENTORY.json', 'utf8'));
const allSnapshots = { ...inventory.v2SourceSnapshots, ...ownerInventory.sourceSnapshots };
test('dedicated project handoff survives the public projection and publishes only real chapter anchors', () => {
  const source = { ...data, works: structuredClone(data.works) };
  const scope = createPublicationScope(source, { ...plan, works: ['interference'] });
  const work = scope.works.find((row) => row.id === 'interference');
  assert.equal(work.projectSite.href, 'https://interference.odadream.art/');
  assert.equal(work.media[0], 'archive-interference-interference-2026-02');
  for (const lang of ['ru', 'en']) {
    const page = createPages(scope).find((row) => row.lang === lang && row.slug === work.slug);
    assert.ok(page.anchors.includes('work-project-site'));
    assert.ok(page.anchors.includes('work-context'));
    assert.ok(!page.anchors.includes('work-story'));
    assert.ok(page.anchors.includes('work-credits'));
  }
});
test('event page selection preserves only approved owned media while leaving the source archive intact', () => {
  const source = { ...data, cases: structuredClone(data.cases) };
  const event = source.cases.find((row) => row.id === 'tsiolkovsky-2026');
  event.presentationMedia.push('private-unselected-file');
  const scope = createPublicationScope(source, {
    ...plan,
    works: ['interference'],
    cases: ['tsiolkovsky-2026'],
  });
  const shown = scope.cases.find((row) => row.id === event.id);
  assert.equal(shown.presentationMedia.length, 4);
  assert.equal(shown.presentationMedia[0], 'archive-interference-interference-2026-poster');
  assert.ok(shown.presentationMedia.every((id) => shown.media.includes(id)));
  assert.ok(shown.media.length > shown.presentationMedia.length);
});
const plan = {
  version: 'fixture',
  asOf: '2026-10-06',
  works: [],
  configurations: [],
  cases: [],
  people: [],
  recognitions: [],
  heroVisuals: [],
  minddb: false,
  methods: ['neuromandala'],
  cooperationPages: ['cooperation'],
};

test('selected editorial sources retain exact dated provenance and coverage in the inventory', () => {
  assert.deepEqual(Object.keys(data.sourceSnapshots).sort(), Object.keys(allSnapshots).sort());
  for (const [file, snapshot] of Object.entries(data.sourceSnapshots)) {
    assert.deepEqual(snapshot, allSnapshots[file]);
    if (ownerInventory.sourceSnapshots[file]) {
      assert.match(file, /^OwnerRecognition\//);
      assert.match(snapshot.sha256, /^[a-f0-9]{64}$/);
      continue;
    }
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
  const mindshow = data.configurations.find((row) => row.id === 'mindshow-installation');
  assert.equal(mindshow.conditions.find((row) => row.id === 'session').state, 'conflict');
  assert.match(mindshow.conditions.find((row) => row.id === 'session').value.ru, /соглас/);
  assert.match(mindshow.conditions.find((row) => row.id === 'session').value.en, /agree/);
  const game = data.configurations.find((row) => row.id === 'neurobattle-game');
  assert.match(game.title.ru, /Парадокс Успеха/);
  assert.equal(game.conditions.find((row) => row.id === 'flow').state, 'historical');
  assert.equal(data.educationOverview.conditions.find((row) => row.id === 'talk-duration').state, 'conflict');
});

test('method and cooperation stay out of public projection until editorial approval', () => {
  const pending = {
    ...data,
    methods: structuredClone(data.methods),
    cooperationPages: structuredClone(data.cooperationPages),
  };
  pending.methods.forEach((row) => (row.publication = 'review'));
  pending.cooperationPages.forEach((row) => (row.publication = 'review'));
  const scope = createPublicationScope(pending, plan);
  assert.equal(scope.methods.length, 0);
  assert.equal(scope.cooperationPages.length, 0);
  assert.ok(scope.errors.some((error) => error.includes('neuromandala: review')));
  assert.ok(scope.errors.some((error) => error.includes('cooperation: review')));
});

test('work narratives retain owner decisions, real roles and source coverage', () => {
  for (const work of data.works) {
    assert.ok(work.story.length >= 1, work.id); // Sparse sourced work must not gain invented filler chapters.
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
    /четыре ЭЭГ-канала.*четыре пульсоканала/,
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
  source.people.forEach((row) => (row.publication = 'review'));
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
  assert.equal('teaching' in scope.studioPages[0], false);
  const routes = createPages(scope);
  assert.ok(routes.find((row) => row.path === '/ru/studio/').anchors.includes('legal'));
  const deferredRoutes = createPages(createPublicationScope({ ...data, people: [] }, packet));
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
  const publicRoutes = resolveLegacyRoutes(
    rows,
    createPages(createPublicationScope(data, { ...plan, cooperationPages: [] })),
  );
  assert.equal(publicRoutes['hub-education'][1], '/legacy/unavailable/?id=hub-education&lang=ru');
});
