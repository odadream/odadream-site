import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const original = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { createPages, navigationFor } = await loadSiteModule('src/lib/routes.ts');
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');

test('every overview route has one menu entrance in its language, including method and recognition', () => {
  for (const lang of ['en', 'ru']) {
    const nav = navigationFor(lang);
    const overview = createPages(original).filter(
      (page) => page.lang === lang && !['work', 'case'].includes(page.kind),
    );
    assert.equal(new Set(nav.map((row) => row.href)).size, overview.length);
    assert.deepEqual(nav.map((row) => row.href).sort(), overview.map((row) => row.path).sort());
    assert.equal(nav.find((row) => row.route === 'recognition').family, 'R');
    assert.equal(nav.find((row) => row.route === 'technology').family, 'M');
    assert.ok(nav.every((row) => row.href.startsWith(`/${lang}/`)));
  }
});

test('historical PDFs require their published work and independent cleared rights; internal fingerprints stay private', () => {
  const source = structuredClone(
    Object.fromEntries(Object.entries(original).filter(([, value]) => typeof value !== 'function')),
  );
  const plan = {
    ...publicationPlan,
    works: ['rings'],
    methods: [],
    formats: [],
    cases: [],
    people: [],
    studioPages: [],
    cooperationPages: [],
    heroVisuals: [],
  };
  let scope = createPublicationScope(source, plan);
  assert.equal(scope.workDocuments.length, 0);
  for (const row of source.workDocuments) assert.ok(!scope.assetPaths.has(row.href));
  source.works.find((row) => row.id === 'rings').publication = 'published';
  scope = createPublicationScope(source, plan);
  assert.equal(scope.workDocuments.length, 2);
  assert.ok(!JSON.stringify(scope.workDocuments).includes('sha256'));
  assert.ok(!JSON.stringify(scope.workDocuments).includes('sourceRefs'));
  for (const row of source.workDocuments) {
    assert.ok(scope.assetPaths.has(row.href));
    assert.ok(
      createPages(scope)
        .find((page) => page.path === '/ru/works/oda-rings/')
        .anchors.includes(`document-${row.id}`),
    );
  }
  source.workDocuments[0].rights = 'restricted';
  scope = createPublicationScope(source, plan);
  assert.equal(scope.workDocuments.length, 1);
  assert.ok(!scope.assetPaths.has(source.workDocuments[0].href));
  assert.ok(scope.errors.some((error) => error.includes('rights restricted')));
});
