import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const data = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { createPages } = await loadSiteModule('src/lib/routes.ts');
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const clone = () =>
  structuredClone(
    Object.fromEntries(Object.entries(data).filter(([, value]) => typeof value !== 'function')),
  );

test('work configurations cannot exist publicly without their owner work', () => {
  const source = clone();
  const scope = createPublicationScope(source, {
    ...publicationPlan,
    works: [],
    heroVisuals: [],
    cases: [],
    studioPages: [],
  });
  assert.equal(scope.configurations.length, 0);
  assert.ok(scope.errors.some((error) => error.includes('owner work')));
  assert.ok(scope.programmes.length > 0, 'Education does not need an invented artwork owner');
});

test('programme publication and dependencies are filtered without exporting source references', () => {
  const source = clone();
  source.programmes[0].publication = 'review';
  source.programmes[1].privateNote = 'PRIVATE';
  source.programmes[1].works = ['rings'];
  source.programmes[1].cases = ['dano-2025'];
  source.programmes[1].media = ['neuromandala-terra'];
  source.media.find((row) => row.id === 'neuromandala-terra').rights = 'restricted';
  const scope = createPublicationScope(source, {
    ...publicationPlan,
    works: [],
    cases: [],
    heroVisuals: [],
    methods: [],
    studioPages: [],
  });
  assert.equal(
    scope.programmes.some((row) => row.id === source.programmes[0].id),
    false,
  );
  const row = scope.programmes.find((row) => row.id === source.programmes[1].id);
  assert.deepEqual(row.works, []);
  assert.deepEqual(row.cases, []);
  assert.deepEqual(row.media, []);
  assert.ok(!JSON.stringify(scope.programmes).includes('sourceRefs'));
  assert.ok(!JSON.stringify(scope.programmes).includes('PRIVATE'));
  assert.ok(scope.errors.some((error) => error.includes('restricted')));
});

test('programme detail routes stay in education and absent framework never claims an anchor', () => {
  const scope = createPublicationScope(data, { ...publicationPlan, educationOverview: false });
  const pages = createPages(scope);
  assert.equal(pages.filter((row) => row.kind === 'programme').length, data.programmes.length * 2);
  for (const lang of ['en', 'ru']) {
    assert.ok(
      !pages.find((row) => row.path === `/${lang}/education/`).anchors.includes('education-conditions'),
    );
    assert.ok(!pages.some((row) => row.path === `/${lang}/formats/`));
    assert.ok(
      pages.find((row) => row.path === `/${lang}/works/mindshow/`).anchors.includes('mindshow-installation'),
    );
  }
  assert.equal(data.programmes.find((row) => row.id === 'neuro-laboratory').deliveryStatus, 'proposed');
});
