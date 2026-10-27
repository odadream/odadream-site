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

test('ODA-prefixed files stay in ODA credits, personal-prefix achievements stay in CVs, and same-form letters group as pages', async () => {
  const addresseeIds = [
    'techweek-letter-2024',
    'province-code-letter-2024',
    'moscow2030-letter-2025',
    'frequencies-daler-certificate-2026',
  ];
  for (const id of addresseeIds) {
    const row = scope.recognitions.find((item) => item.id === id);
    assert.ok(row, `${id} should be included`);
    assert.ok(
      data.recognitions
        .find((item) => item.id === id)
        .sourceRefs.every((ref) => ref.file.startsWith('OwnerRecognition/ODA -')),
    );
  }
  assert.equal(scope.recognitions.length, 19);
  assert.equal(scope.recognitions.filter((row) => row.previewSrc).length, 17);
  assert.equal(
    scope.recognitions.reduce((count, row) => count + (row.documents?.length ?? (row.previewSrc ? 1 : 0)), 0),
    26,
  );
  for (const id of [
    ...addresseeIds,
    'battle-billion-certificate-2024',
    'hse-letter-2025',
    'ossetia-letter-2025',
    'rukami-neurosync-2020',
    'skolkovo-arttech-2026',
  ]) {
    const row = scope.recognitions.find((item) => item.id === id);
    assert.equal(row.documents.length, 2, `${id} should expose two pages`);
    assert.equal(new Set(row.documents.map((page) => page.id)).size, 2);
    assert.ok(row.documents.every((page) => page.src.startsWith('/images/prepared/')));
    assert.ok(row.documents.every((page) => !('sourcePath' in page) && !('sourceSha256' in page)));
  }
  for (const id of [
    'techweek-daler-letter-2024',
    'province-code-olga-letter-2024',
    'moscow2030-daler-letter-2025',
    'frequencies-olga-certificate-2026',
    'hse-illustrated-2025',
    'ossetia-communication-letter-2025',
    'battle-billion-letter-2024',
    'rukami-daler-certificate-2020',
  ])
    assert.ok(!scope.recognitions.some((item) => item.id === id), `${id} was absorbed into its credit group`);
  assert.ok(
    data.recognitions.every((row) =>
      row.sourceRefs.every((ref) => !/^OwnerRecognition\/(?:Далер|Оля) -/.test(ref.file)),
    ),
  );
  const inventory = JSON.parse(
    await readFile('docs/RECOGNITION-SOURCE-INVENTORY.json', 'utf8'),
  ).sourceSnapshots;
  for (const ref of data.recognitions.flatMap((row) => row.sourceRefs))
    if (ref.file.startsWith('OwnerRecognition/ODA -')) assert.deepEqual(inventory[ref.file], ref);
  for (const id of ['daler', 'olga']) {
    const cv = scope.people.find((row) => row.id === id).cv;
    assert.match(
      cv.sections.find((row) => row.id === 'personal-credits').body.en,
      /Tech Week.*Code of the Province.*Moscow 2030.*Commission for the Year Three Thousand/,
    );
  }
  assert.match(
    data.people.find((row) => row.id === 'olga').cv.sections.find((row) => row.id === 'documented-training')
      .body.en,
    /preparation for ICF ACC certification/,
  );
});

test('source documents have real event links without inventing work associations or extra awards', () => {
  for (const row of scope.recognitions.filter((row) => row.event)) {
    const event = scope.cases.find((event) => event.id === row.event);
    assert.ok(event, row.id);
    assert.equal(row.contextPath, `cases/${event.slug}/`);
  }
  const award = scope.recognitions.find((row) => row.id === 'skolkovo-arttech-2026');
  assert.equal(award.documents.length, 2);
  assert.deepEqual(
    data.recognitions.find((row) => row.id === award.id).sourceRefs.map((ref) => ref.file),
    ['OwnerRecognition/ODA - 2026 Cколково.jpg', 'OwnerRecognition/ODA - 2026 Cколково - письмо.pdf'],
  );
  assert.match(award.recipient.en, /Olga/);
  assert.match(award.recipient.en, /Anastasia Mitina/);
  assert.equal(scope.recognitions.filter((row) => row.kind === 'award').length, 2);
  const business = scope.recognitions.find((row) => row.id === 'business-awards-letter-2025');
  assert.equal(business.event, 'national-business-awards-2025');
  assert.deepEqual(business.relatedWorks, []);
  assert.ok(scope.cases.some((row) => row.id === 'rukami-2020'));
  const rukami = scope.recognitions.find((row) => row.id === 'rukami-neurosync-2020');
  assert.equal(rukami.documents.length, 2);
  assert.equal(rukami.limitations, undefined);
  assert.deepEqual(
    data.recognitions.find((row) => row.id === rukami.id).sourceRefs.map((ref) => ref.file),
    ['OwnerRecognition/ODA - 2020 Руками - NeuroSync.pdf', 'OwnerRecognition/ODA - 2020 Руками - Далер.pdf'],
  );
  const portalAward = scope.recognitions.find((row) => row.id === 'portal-2030-2025');
  const portalAcknowledgement = scope.recognitions.find((row) => row.id === 'moscow2030-letter-2025');
  assert.equal(portalAward.event, portalAcknowledgement.event);
  assert.notEqual(portalAward.kind, portalAcknowledgement.kind);
  assert.notEqual(portalAward.id, portalAcknowledgement.id);
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
