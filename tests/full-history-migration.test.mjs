import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadSiteModule } from '../scripts/site-data.mjs';
const source = await loadSiteModule();
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { createPages } = await loadSiteModule('src/lib/routes.ts');
const { formatCaseDate } = await loadSiteModule('src/lib/case-presentation.ts');
const inventory = JSON.parse(readFileSync('docs/migration/INVENTORY-2026-10-05.json', 'utf8'));

test('all 37 V1 event sources have an implemented event, merged series or evidenced empty-stub exclusion', () => {
  const events = inventory.entries.filter((row) => row.oldKind === 'event');
  assert.equal(events.length, 37);
  assert.equal(source.cases.length, 42);
  assert.equal(source.eventSeries.length, 4);
  for (const entry of events) {
    const use = entry.currentCanonicalApplication;
    assert.ok(use?.reason, entry.id);
    if (use.role === 'CaseEvent')
      assert.ok(
        source.cases.some((row) => row.legacyId === entry.id),
        entry.id,
      );
    else if (use.role === 'EventSeries')
      assert.ok(
        source.eventSeries.some((row) => row.legacyId === entry.id),
        entry.id,
      );
    else {
      assert.equal(entry.id, 'event-brics-plus');
      assert.equal(use.role, 'excluded-empty-stub');
      assert.equal(use.targets.length, 0);
      assert.match(use.reason, /Obsidian/);
    }
  }
});

test('applications, festival windows and publication dates cannot masquerade as completed presentations', () => {
  const poster = source.media.find((row) => row.id === 'ashram-neuro-art-dance-poster');
  assert.equal(poster.representation, 'poster');
  assert.ok(!source.cases.find((row) => row.id === 'ashram-birthday-2024').media.includes(poster.id));
  assert.ok(source.cases.find((row) => row.id === 'ashram-tim').media.includes(poster.id));
  const audi = source.cases.find((row) => row.id === 'audi-application-2020');
  assert.equal(audi.date, '2020-07-12');
  assert.equal(audi.participationStatus, 'submitted');
  assert.equal(source.cases.find((row) => row.id === 'tavrida-ai-2025').participationStatus, 'declined');
  const lamborghini = source.cases.find((row) => row.id === 'lamborghini-tea');
  assert.equal(lamborghini.dateMeaning, 'reported-by');
  assert.match(formatCaseDate(lamborghini, 'en'), /^Reported by /);
  assert.ok(!lamborghini.organizations.includes('lamborghini'));
  const gong = source.cases.find((row) => row.id === 'gong-fest-2025');
  assert.equal(gong.dateMeaning, 'event-window');
  assert.equal(gong.dateEnd, '2025-07-06');
  assert.match(formatCaseDate(gong, 'ru'), /^Период события: /);
  for (const row of source.cases) assert.notEqual(row.date.slice(4), '-01-01', row.id);
});

test('event relationships are reciprocal and public programmes and series respect publication dependencies', () => {
  for (const item of source.cases) {
    for (const id of [item.work, ...(item.relatedWorks ?? [])].filter(Boolean))
      assert.ok(source.works.find((row) => row.id === id).cases.includes(item.id), `${item.id} → ${id}`);
    for (const id of [item.programme, ...(item.relatedProgrammes ?? [])].filter(Boolean))
      assert.ok(source.programmes.find((row) => row.id === id).cases.includes(item.id), `${item.id} → ${id}`);
  }
  const publicData = createPublicationScope(source, publicationPlan);
  assert.deepEqual(publicData.errors, []);
  assert.equal(publicData.cases.length, 42);
  assert.equal(publicData.eventSeries.length, 4);
  assert.ok(!JSON.stringify(publicData.eventSeries).includes('sourceRefs'));
  const withoutEducation = createPublicationScope(source, { ...publicationPlan, programmes: [] });
  assert.ok(!withoutEducation.cases.some((row) => row.programme));
  assert.ok(withoutEducation.cases.every((row) => row.relatedProgrammes.length === 0));
  const emptyHistory = createPublicationScope(source, { ...publicationPlan, cases: [] });
  assert.equal(emptyHistory.eventSeries.length, 0);
  assert.ok(emptyHistory.works.every((row) => row.cases.length === 0));
  const overview = createPages(publicData).find((row) => row.path === '/ru/cases/');
  for (const item of publicData.cases) assert.ok(overview.anchors.includes(`case-${item.slug}`));
});

test('event organization descriptions do not inherit the studio participation role', () => {
  for (const event of source.cases) {
    for (const organization of event.organizationRoles) {
      assert.notDeepEqual(
        organization.description,
        event.role,
        event.id + ': ' + organization.organizationId,
      );
    }
  }
});
