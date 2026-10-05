import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';

const data = await loadSiteModule();
const { pages } = await loadSiteModule('src/lib/routes.ts');

test('stage determines realization independently of booking and repertoire', () => {
  const work = data.works[0];
  assert.equal(
    data.isRealizedWork({ ...work, stage: 'realized', bookable: false, inRepertoire: false }),
    true,
  );
  for (const stage of ['concept', 'prototype', 'in-production'])
    assert.equal(data.isRealizedWork({ ...work, stage }), false);
  assert.equal(data.realizedWorks.length + data.researchWorks.length, data.works.length);
  assert.ok(data.selectedWorks.every((item) => item.featuredOnHome && data.isRealizedWork(item)));
  assert.ok(
    data.publicHeroVisuals.every(
      (item) => item.target.kind !== 'work' || data.isRealizedWork(data.workById(item.target.workId)),
    ),
  );
});

test('route registry gives each curated work and case exactly one page per language', () => {
  assert.equal(new Set(pages.map((page) => page.path)).size, pages.length);
  for (const lang of ['en', 'ru'])
    for (const [kind, collection] of [
      ['work', data.works],
      ['case', data.cases],
    ])
      for (const item of collection)
        assert.equal(
          pages.filter((page) => page.lang === lang && page.kind === kind && page.slug === item.slug).length,
          1,
        );
});
