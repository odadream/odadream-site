import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
const { calculateSiteStats, heldEvents, selectHomepageEvents } =
  await loadSiteModule('src/lib/site-stats.ts');
const { sortRecognitions } = await loadSiteModule('src/lib/recognition-presentation.ts');
const source = await loadSiteModule();
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
test('statistics count event editions once and exclude unheld contributions without mixing genre and role', () => {
  const sample = (id, status, genre = 'festival', date = '2025') => ({
    id,
    participationStatus: status,
    date,
    dateMeaning: 'participation',
    type: 'lecture',
    event: { id: 'one-edition', genre },
  });
  const stats = calculateSiteStats({
    works: [],
    programmes: [],
    recognitions: [],
    cases: [
      sample('lecture', 'held'),
      sample('performance', 'held'),
      sample('invite', 'invited'),
      { ...sample('unknown', 'held', undefined), event: undefined },
    ],
  });
  assert.equal(stats.cases.total, 2);
  assert.equal(stats.cases.contributions, 3);
  assert.equal(stats.cases.byGenre.festival, 1);
  assert.equal(stats.cases.byGenre.unknown, 1);
  assert.equal(stats.cases.byType.lecture, 3);
  assert.deepEqual(stats.works.byStage, { realized: 0, prototype: 0, concept: 0, 'in-production': 0 });
  assert.equal(stats.cases.byGenre.school, 0);
  assert.equal(stats.recognitions.byKind.award, 0);
});
test('the public event projection carries sourced identities and work histories contain held events only', () => {
  const data = createPublicationScope(source, publicationPlan, false);
  for (const row of data.cases) {
    assert.ok(row.event?.id, row.id);
    assert.ok(row.event.title.ru && row.event.title.en, row.id);
  }
  for (const work of data.works)
    for (const id of work.cases)
      assert.equal(data.cases.find((row) => row.id === id).participationStatus, 'held', work.id);
  const stats = calculateSiteStats(data);
  assert.equal(stats.cases.total, heldEvents(data.cases).length);
  assert.equal(
    Object.values(stats.cases.byGenre).reduce((a, b) => a + b, 0),
    stats.cases.total,
  );
  assert.equal(
    Object.values(stats.recognitions.byKind).reduce((a, b) => a + b, 0),
    data.recognitions.length,
  );
  const reduced = createPublicationScope(
    source,
    { ...publicationPlan, cases: publicationPlan.cases.filter((id) => id !== 'oktava-2021') },
    false,
  );
  assert.equal(calculateSiteStats(reduced).cases.total, stats.cases.total - 1);
});
test('homepage contains only marked held events in reverse chronology, without padding missing years', () => {
  const rows = selectHomepageEvents(source.cases);
  assert.deepEqual(
    new Set(rows.map((row) => row.id)),
    new Set(
      source.cases
        .filter((row) => row.featuredOnHome && row.participationStatus === 'held')
        .map((row) => row.id),
    ),
  );
  assert.equal(rows[0].id, 'tsiolkovsky-2026');
  assert.equal(rows.at(-1).id, 'byob-2019');
  assert.ok(!rows.some((row) => row.id === 'oktava-2021' || row.id === 'dano-2025'));
  assert.ok(rows.every((row) => row.participationStatus === 'held'));
  assert.equal(
    selectHomepageEvents([
      {
        ...source.cases[0],
        id: 'report-only',
        date: '2027-01-01',
        dateMeaning: 'reported-by',
        event: undefined,
        featuredOnHome: true,
      },
    ]).length,
    0,
  );
  const base = { ...source.cases[0], event: undefined, featuredOnHome: true };
  const mixed = [
    { ...base, id: 'year-only', date: '2025' },
    { ...base, id: 'latest', date: '2026-05-16' },
    { ...base, id: 'month-only', date: '2025-07' },
    { ...base, id: 'known-day', date: '2025-07-13' },
    { ...base, id: 'hidden', date: '2027-05-16', featuredOnHome: false },
    { ...base, id: 'not-held', date: '2027-05-16', participationStatus: 'declined' },
  ];
  assert.deepEqual(
    selectHomepageEvents(mixed).map((row) => row.id),
    ['latest', 'known-day', 'month-only', 'year-only'],
  );
  assert.equal(mixed[0].date, '2025');
});
test('recognition prioritizes outcomes, then dates, and leaves selection distinct from winning', () => {
  const rows = sortRecognitions(source.recognitions);
  assert.deepEqual(
    rows.slice(0, 4).map((row) => row.kind),
    ['award', 'award', 'grant', 'selection'],
  );
  assert.equal(rows[0].year, 2026);
  assert.equal(rows[1].year, 2025);
  assert.equal(rows[3].id, 'cyens-reserve-2026');
  assert.match(rows[3].overviewClaim.en, /neither entered/);
});
test('recognition statistics count a multi-document credit once, by credit kind', () => {
  const stats = calculateSiteStats({
    works: [],
    cases: [],
    programmes: [],
    recognitions: [
      {
        kind: 'acknowledgement-letter',
        featuredOnHome: true,
        previewSrc: '/images/first-page.webp',
        documents: [{ id: 'daler-letter' }, { id: 'olga-letter' }],
      },
    ],
  });
  assert.equal(stats.recognitions.total, 1);
  assert.equal(stats.recognitions.withPreview, 1);
  assert.equal(stats.recognitions.byKind['acknowledgement-letter'], 1);
});
