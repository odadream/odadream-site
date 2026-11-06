import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const data = await loadSiteModule();
test('Neuromandala names, historical media and hero entrances keep distinct artwork identities', () => {
  const show = data.works.find((work) => work.id === 'mindshow');
  const grid = data.works.find((work) => work.id === 'neuromandala');
  assert.equal(show.title.en, 'Neuromandala: MindShow');
  assert.equal(grid.title.en, 'Neuromandala: MindGrid');
  assert.ok(!show.aliases.some((alias) => /mind\s?grid/i.test(alias)));
  assert.equal(data.heroVisuals.find((visual) => visual.id === 'frequencies').target.workId, grid.id);
  for (const id of ['archive-mindshow-byob-2019-mindgrid', 'abrau-2026-157']) {
    assert.ok(!show.media.includes(id));
    assert.ok(grid.media.includes(id));
  }
  assert.equal(data.cases.find((event) => event.id === 'byob-2019').work, grid.id);
  assert.equal(data.cases.find((event) => event.id === 'byob-2020').work, 'neurosync');
});

test('editorial and publication catalogues share the owner work hierarchy', async () => {
  const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
  const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
  const expected = [
    'interference',
    'mindshow',
    'neuromandala',
    'schrodinger',
    'neurobattle',
    'cultural-neuro-code',
    'neurosync',
  ];
  for (const catalogue of [data, createPublicationScope(data, publicationPlan)])
    assert.deepEqual(
      catalogue.works.slice(0, 7).map((work) => work.id),
      expected,
    );
});
