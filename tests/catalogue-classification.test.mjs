import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const source = await loadSiteModule();
const { catalogue } = await loadSiteModule('src/data/catalogue.ts');
const { calculateSiteStats } = await loadSiteModule('src/lib/site-stats.ts');
const { caseSectionIds } = await loadSiteModule('src/lib/case-sections.ts');
const { pages } = await loadSiteModule('src/lib/routes.ts');
const { localizedCatalogueRedirects } = await loadSiteModule('src/data/catalogue-redirects.mjs');

test('owner corrections change canonical entities, reciprocal event links and counters together', () => {
  for (const data of [source, catalogue]) {
    for (const id of ['theatre-my-name', 'brain-hack', 'journey']) {
      assert.ok(!data.works.some((row) => row.id === id));
      const programme = data.programmes.find((row) => row.id === id);
      assert.equal(programme.programmeType, 'workshop');
      assert.ok(programme.modules.length);
      if (data === source) assert.ok(programme.sourceRefs.length);
    }
    assert.ok(!data.programmes.some((row) => row.id === 'gong'));
    assert.equal(data.works.find((row) => row.id === 'gong').stage, 'realized');
    assert.equal(data.works.find((row) => row.id === 'cultural-neuro-code').stage, 'realized');
    for (const event of data.cases) {
      assert.ok(event.detailPage);
      if (event.work)
        assert.ok(
          data.works.some((row) => row.id === event.work),
          event.id,
        );
      if (event.programme)
        assert.ok(
          data.programmes.some((row) => row.id === event.programme),
          event.id,
        );
    }
  }
  const stats = calculateSiteStats(catalogue);
  assert.equal(stats.works.total, 21);
  assert.equal(stats.education.total, 17);
  assert.equal(stats.education.workshops, 5);
});

test('MindGrid belongs to Neuromandala and the connected group recording leads Neurosynchronization', () => {
  const work = catalogue.works.find((row) => row.id === 'neurosync');
  assert.equal(work.media[0], 'neurosync-lab-recording');
  assert.ok(!work.media.includes('neurosync-session'));
  assert.ok(catalogue.works.find((row) => row.id === 'neuromandala').media.includes('neurosync-session'));
  assert.match(catalogue.media.find((row) => row.id === 'neurosync-session').caption.ru, /MindGrid/);
});

test('curated event images are subsets of the event gallery and keep a valid work relationship', () => {
  assert.ok(catalogue.cases.some((row) => row.workSelections?.length));
  for (const event of catalogue.cases)
    for (const selection of event.workSelections ?? []) {
      assert.ok(event.work === selection.workId || event.relatedWorks?.includes(selection.workId));
      for (const id of selection.media) assert.ok(event.media.includes(id));
    }
});

test('every event is reachable in both languages, sparse records omit empty chapters, moved V2 routes resolve', () => {
  for (const event of catalogue.cases)
    for (const lang of ['ru', 'en']) {
      const page = pages.find((row) => row.path === `/${lang}/cases/${event.slug}/`);
      assert.ok(page, event.id);
      for (const id of caseSectionIds(event)) assert.ok(page.anchors.includes(id));
    }
  assert.deepEqual(
    caseSectionIds({
      story: [],
      media: [],
      organizationRoles: [],
      participants: [],
      limitations: [],
      evidence: [],
    }),
    ['case-contribution'],
  );
  for (const to of Object.values(localizedCatalogueRedirects))
    assert.ok(
      pages.some((row) => row.path === to),
      to,
    );
});
