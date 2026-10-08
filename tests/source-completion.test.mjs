import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSiteModule } from '../scripts/site-data.mjs';
import { readFile } from 'node:fs/promises';
import { verifySourceCoverage } from '../scripts/verify-source-coverage.mjs';

const data = await loadSiteModule();
const { publicationPlan } = await loadSiteModule('src/data/publication-plan.ts');
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const scope = createPublicationScope(data, publicationPlan);

test('every original source has a versioned disposition and a real public target or reasoned exclusion', async () => {
  const inventory = JSON.parse(await readFile('docs/migration/INVENTORY-2026-10-05.json', 'utf8'));
  const { pages } = await loadSiteModule('src/lib/routes.ts');
  assert.equal(verifySourceCoverage(inventory, scope, pages).sourceIds, 238);
  const broken = structuredClone(inventory);
  const row = broken.entries.find((entry) => entry.currentCanonicalApplication.targets.length);
  row.currentCanonicalApplication.targets = ['Work:unmigrated-placeholder'];
  assert.throws(() => verifySourceCoverage(broken, scope, pages), /Target outside the public corpus/);
});

test('the meditation report preserves the actual contribution without inventing a venue, event day or quote', () => {
  const event = scope.cases.find((row) => row.id === 'meditation-day-2026');
  assert.equal(event.dateMeaning, 'reported-by');
  assert.equal(event.date, '2026-05-24');
  assert.equal(event.place.en, 'Venue unspecified');
  assert.equal(event.work, 'neuromandala');
  assert.equal(event.source, 'https://t.me/odadream/760');
  assert.match(event.limitations[0].en, /not a confirmed event day/);
  assert.equal(event.evidence.length, 0);
});

test('competition, school grant and reserve selection remain distinct from realized exhibitions', () => {
  const find = (id) => scope.recognitions.find((row) => row.id === id);
  assert.equal(find('skolkovo-arttech-2026').kind, 'award');
  assert.equal(find('culttech-school-grant-2026').kind, 'grant');
  assert.equal(find('cyens-reserve-2026').kind, 'selection');
  assert.match(find('cyens-reserve-2026').limitations.en, /not selected: participation did not take place/);
  assert.match(find('culttech-school-grant-2026').claim.en, /full School Phase fee/);
  assert.equal(scope.works.find((row) => row.id === 'honors').stage, 'concept');
  assert.equal(scope.works.find((row) => row.id === 'ancestors').stage, 'prototype');
  for (const row of ['skolkovo-arttech-2026', 'culttech-school-grant-2026', 'cyens-reserve-2026'].map(find)) {
    assert.equal(row.previewSrc, undefined);
    assert.equal(row.documentRights, 'review');
  }
});

test('a metadata record does not grant permission to publish an attached document', () => {
  const source = { ...data, recognitions: structuredClone(data.recognitions) };
  const grant = source.recognitions.find((row) => row.id === 'culttech-school-grant-2026');
  grant.documentState = 'available';
  grant.previewSrc = '/images/private-grant.webp';
  const result = createPublicationScope(source, publicationPlan);
  assert.ok(!result.recognitions.some((row) => row.id === grant.id));
  assert.ok(!result.assetPaths.has(grant.previewSrc));
  assert.ok(result.errors.some((error) => error.includes(grant.id) && error.includes('rights review')));
});

test('archival recordings follow semantic owners while general lecture recordings stay on the overview', () => {
  assert.equal(scope.educationOverview.materials[0].links.length, 4);
  assert.ok(scope.programmes.every((row) => !row.materials));
  const sync = scope.works.find((row) => row.id === 'sync');
  assert.equal(sync.stage, 'concept');
  assert.match(sync.story.find((row) => row.links).body.en, /do not establish fabrication/);
  const game = scope.works.find((row) => row.id === 'neurobattle');
  assert.match(game.story.find((row) => row.links).links[0].title.ru, /Парадокс Успеха/);
  const stories = [...scope.works.flatMap((row) => row.story), ...scope.educationOverview.materials];
  for (const link of stories.flatMap((row) => row.links ?? [])) {
    const url = new URL(link.href);
    assert.equal(url.protocol, 'https:');
    if (url.hostname === 'dzen.ru' && url.pathname.startsWith('/embed/'))
      assert.equal(url.searchParams.get('autoplay'), '0');
  }
  assert.ok(!JSON.stringify(scope).includes('V1_Media_Registry.ts'));
});
