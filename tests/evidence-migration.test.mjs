import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const data = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { createPages } = await loadSiteModule('src/lib/routes.ts');
const empty = {
  version: 'fixture',
  asOf: '2026-10-06',
  works: [],
  configurations: [],
  cases: [],
  people: [],
  recognitions: [],
  heroVisuals: [],
  minddb: false,
};

test('the original core retains four detailed cases and three bounded contexts with honest date precision', () => {
  assert.equal(data.cases.filter((row) => row.detailPage).length, 4);
  const baseline = data.cases.filter((row) => ['portal-2025', 'wildmint-2025', 'cipr-2026'].includes(row.id));
  assert.equal(baseline.length, 3);
  for (const row of baseline) {
    assert.equal(row.datePrecision, 'year');
    assert.match(row.date, /^\d{4}$/);
    assert.equal(row.featuredOnHome, false);
  }
  const dano = data.cases.find((row) => row.id === 'dano-2025');
  assert.equal(dano.organizationRoles.find((row) => row.organizationId === 'ekoniva').role, 'client');
  assert.equal(dano.organizationRoles.find((row) => row.organizationId === 'hse').role, 'organizer');
  const wild = data.cases.find((row) => row.id === 'wildmint-2025');
  assert.equal(wild.method, 'neuromandala');
  assert.equal(wild.work, undefined);
});

test('inspecting a prize image neither approves document rights nor exposes internal provenance', () => {
  const source = { ...data, recognitions: structuredClone(data.recognitions) };
  const prize = source.recognitions.find((row) => row.id === 'portal-2030-2025');
  assert.equal(prize.kind, 'award');
  assert.match(prize.claim.ru, /первое место/);
  assert.match(prize.documentSha256, /^[a-f0-9]{64}$/);
  prize.publication = 'published';
  prize.documentRights = 'review';
  const plan = { ...empty, recognitions: [prize.id] };
  const pending = createPublicationScope(source, plan);
  assert.equal(pending.recognitions.length, 0);
  assert.ok(!pending.assetPaths.has(prize.documentSource));
  prize.documentRights = 'cleared';
  const publicData = createPublicationScope(source, plan);
  assert.equal(publicData.recognitions.length, 1);
  assert.ok(publicData.assetPaths.has(publicData.recognitions[0].documentSource));
  assert.ok(publicData.assetPaths.has(publicData.recognitions[0].previewSrc));
  assert.ok(!publicData.assetPaths.has(prize.previewSrc));
  assert.ok(!JSON.stringify(publicData.recognitions).includes('documentSha256'));
  assert.ok(!JSON.stringify(publicData.recognitions).includes('sourceRefs'));
  assert.equal(publicData.recognitions[0].contextPath, undefined);
});

test('a method context requires the published method and never creates a fictional work or standalone page', () => {
  const source = { ...data, methods: structuredClone(data.methods), cases: structuredClone(data.cases) };
  source.cases.find((row) => row.id === 'wildmint-2025').publication = 'published';
  source.methods[0].publication = 'review';
  const plan = { ...empty, cases: ['wildmint-2025'], methods: ['neuromandala'] };
  assert.equal(createPublicationScope(source, plan).cases.length, 0);
  source.methods[0].publication = 'published';
  const scope = createPublicationScope(source, plan);
  assert.deepEqual(scope.errors, []);
  assert.equal(scope.works.length, 0);
  const pages = createPages(scope);
  assert.ok(!pages.some((row) => row.path.includes('/cases/wildmint-2025/')));
  assert.ok(pages.find((row) => row.path === '/ru/cases/').anchors.includes('case-wildmint-2025'));
  assert.ok(!JSON.stringify(scope.cases).includes('sourceRefs'));
});
