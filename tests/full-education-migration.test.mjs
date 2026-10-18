import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadSiteModule } from '../scripts/site-data.mjs';
const source = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { createPages } = await loadSiteModule('src/lib/routes.ts');
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const inventory = JSON.parse(readFileSync('docs/migration/INVENTORY-2026-10-05.json', 'utf8'));

test('the complete programme catalogue has source-backed curricula, distinct outcomes and paired routes', () => {
  const data = createPublicationScope(source, publicationPlan);
  assert.deepEqual(data.errors, []);
  assert.equal(data.programmes.length, 17);
  const pages = createPages(data);
  assert.equal(pages.filter((row) => row.kind === 'programme').length, 34);
  for (const item of source.programmes) {
    assert.ok(item.topics.length && item.conditions.length && item.sourceRefs.length, item.id);
    for (const lang of ['ru', 'en']) {
      assert.ok(item.outcome[lang].length > 40, item.id);
      const page = pages.find((row) => row.path === `/${lang}/education/${item.slug}/`);
      assert.ok(page, item.id);
      for (const module of item.modules ?? [])
        assert.ok(page.anchors.includes(`programme-${item.id}-${module.id}`));
    }
  }
  assert.equal(source.programmes.find((row) => row.id === 'dance-feedback').programmeType, 'workshop');
  assert.ok(source.programmes.find((row) => row.id === 'dance-feedback').works.includes('neurosync'));
  assert.equal(source.works.find((row) => row.id === 'neurosync').workType, 'participatory-practice');
  assert.deepEqual(source.programmes.find((row) => row.id === 'daler-art-path').authorIds, ['daler']);
});

test('all located Obsidian variants have an explicit application without promoting empty or external reference files', () => {
  assert.equal(inventory.currentEducationSourceApplications.length, 51);
  const rows = inventory.currentEducationSourceApplications;
  assert.equal(new Set(rows.map((row) => row.sourceKey)).size, 44);
  for (const row of rows) {
    assert.ok(row.role && row.targets.length && row.transfer, row.sourcePath);
    assert.equal(source.sourceSnapshots[row.sourceKey].sha256, row.sha256);
    for (const target of row.targets.filter((value) => value.startsWith('Programme:')))
      assert.ok(source.programmes.some((item) => `Programme:${item.id}` === target));
    if (row.replicaOf)
      assert.ok(rows.some((other) => other.sourcePath === row.replicaOf && other.sha256 === row.sha256));
  }
  assert.ok(rows.some((row) => row.role.startsWith('empty-source')));
  assert.ok(rows.some((row) => row.role.startsWith('external-reference')));
  assert.ok(!source.programmes.some((row) => /Цитлин|Сопilot|Gemini/.test(row.title.ru)));
  assert.ok(
    !JSON.stringify(createPublicationScope(source, publicationPlan).programmes).includes('D:/Obsidian'),
  );
});

test('named author links respect publication and educational event dates follow primary cards', () => {
  const noPeople = createPublicationScope(source, { ...publicationPlan, people: [], studioPages: [] });
  assert.ok(noPeople.programmes.every((row) => row.authorIds.length === 0));
  const hse = source.cases.find((row) => row.id === 'hse-2025');
  assert.equal(hse.date, '2025-03-25');
  assert.equal(hse.datePrecision, 'day');
  assert.equal(source.cases.find((row) => row.id === 'almaz-lecture-2026').participationStatus, 'planned');
  assert.equal(source.cases.find((row) => row.id === 'tskhr-lecture-2025').participationStatus, 'planned');
  assert.equal(source.cases.find((row) => row.id === 'green-door-2024').participationStatus, 'held');
  assert.ok(
    source.programmes.find((row) => row.id === 'beautiful-brain').cases.includes('ashram-lecture-2025'),
  );
});
