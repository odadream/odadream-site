import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadSiteModule } from '../scripts/site-data.mjs';

const data = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const { intellectualProperty } = await loadSiteModule('src/data/editorial.ts');
const scope = createPublicationScope(data, publicationPlan);

test('personal letters belong to CVs and do not inflate the studio recognition archive', () => {
  for (const id of ['province-code-letter-2024', 'techweek-letter-2024', 'moscow2030-letter-2025'])
    assert.ok(!scope.recognitions.some((row) => row.id === id));
  for (const id of ['daler', 'olga']) {
    const cv = scope.people.find((row) => row.id === id).cv;
    assert.match(cv.sections.find((row) => row.id === 'personal-credits').body.en, /Tech Week/);
  }
  assert.match(
    data.people.find((row) => row.id === 'olga').cv.sections.find((row) => row.id === 'documented-training')
      .body.en,
    /not an ICF ACC credential/,
  );
});

test('source documents have real event links without inventing work associations or extra awards', () => {
  for (const row of scope.recognitions.filter((row) => row.event)) {
    const event = scope.cases.find((event) => event.id === row.event);
    assert.ok(event, row.id);
    assert.equal(row.contextPath, `cases/${event.slug}/`);
  }
  const award = scope.recognitions.find((row) => row.id === 'skolkovo-arttech-2026');
  assert.match(award.recipient.en, /Olga/);
  assert.match(award.recipient.en, /Anastasia Mitina/);
  assert.equal(scope.recognitions.filter((row) => row.kind === 'award').length, 2);
  const business = scope.recognitions.find((row) => row.id === 'business-awards-letter-2025');
  assert.equal(business.event, 'national-business-awards-2025');
  assert.deepEqual(business.relatedWorks, []);
  assert.ok(scope.cases.some((row) => row.id === 'rukami-2020'));
});

test('legal publication uses the inspected redacted derivative, separate from recognition counts', async () => {
  const legal = scope.referenceDocuments.find((row) => row.kind === 'legal');
  assert.ok(legal.href.endsWith('-redacted.pdf'));
  const source = data.referenceDocuments.find((row) => row.id === legal.id);
  const bytes = await readFile('public' + legal.href);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), source.sha256);
  assert.ok(scope.assetPaths.has(legal.href));
  assert.ok(![...scope.assetPaths].some((path) => /1237624\.eod|1237624\.00001|2026113457-091/.test(path)));
  assert.ok(!scope.recognitions.some((row) => /trademark|patent/.test(row.id)));
  assert.equal(intellectualProperty.trademark.registeredOn, '2026-07-02');
  assert.equal(intellectualProperty.trademark.priorityOn, '2026-02-25');
  assert.equal(intellectualProperty.inventionApplication.status, 'substantive-examination');
});

test('studio has no parallel teaching catalogue, while Tavrida credit does not assert a final presentation', () => {
  assert.ok(!('teaching' in scope.studioPages[0]));
  assert.ok(scope.studioPages[0].materials.some((row) => row.path === 'cases/'));
  const tavrida = scope.cases.find((row) => row.id === 'tavrida-ai-2025');
  assert.equal(tavrida.participationStatus, 'submitted');
  assert.ok(scope.recognitions.some((row) => row.id === 'tavrida-letter-2025'));
  assert.doesNotMatch(tavrida.summary.en, /final presentation|was declined|did not participate/);
});

test('the plein-air certificate does not assign a work absent from the inspected document', () => {
  assert.deepEqual(
    data.recognitions.find((row) => row.id === 'digital-pleinair-certificate-2025').relatedWorks,
    [],
  );
});
