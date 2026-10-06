import test from 'node:test';
import assert from 'node:assert/strict';
import { unresolvedLegacyMedia } from '../scripts/legacy-media-check.mjs';
import { loadSiteModule } from '../scripts/site-data.mjs';

const original = await loadSiteModule();
const { createPublicationScope } = await loadSiteModule('src/lib/publication-scope.ts');
const { createPages } = await loadSiteModule('src/lib/routes.ts');
const { resolveLegacyRoutes } = await loadSiteModule('src/lib/legacy-routes.ts');

function fixture() {
  const source = structuredClone({
    works: original.works,
    formats: original.formats,
    cases: original.cases,
    people: original.people,
    organizations: original.organizations,
    evidence: original.evidence,
    media: original.media,
    recognitions: original.recognitions,
    heroVisuals: original.heroVisuals,
    minddbSnapshot: original.minddbSnapshot,
  });
  source.works[0].publication = 'published';
  const plan = {
    version: 'fixture',
    asOf: '2026-10-06',
    works: [source.works[0].id],
    formats: [],
    cases: [],
    people: [],
    recognitions: [],
    heroVisuals: [],
    minddb: false,
  };
  return { source, plan };
}

test('deferred review records and MindDB do not block an approved packet or leak assets', () => {
  const { source, plan } = fixture();
  const scope = createPublicationScope(source, plan);
  assert.deepEqual(scope.errors, []);
  assert.equal(scope.works.length, 1);
  assert.equal(scope.recognitions.length, 0);
  assert.equal(scope.minddbSnapshot, undefined);
  assert.ok(!scope.assetPaths.has(source.recognitions[0].previewSrc));
  const deferredMediaId = source.works.find((row) => row.id === 'ancestors').media[0];
  assert.ok(!scope.assetPaths.has(source.media.find((row) => row.id === deferredMediaId).src));
  const pages = createPages(scope);
  assert.ok(pages.some((page) => page.path === '/ru/works/interference-of-realities/'));
  assert.ok(!pages.some((page) => page.path === '/ru/works/ancestors-in-the-noise/'));
});

test('selected pending record blocks release and has no public page', () => {
  const { source, plan } = fixture();
  source.works[0].publication = 'review';
  const scope = createPublicationScope(source, plan);
  assert.ok(scope.errors.some((error) => error.includes('interference: review')));
  assert.equal(scope.works.length, 0);
  assert.ok(!createPages(scope).some((page) => page.kind === 'work'));
});

test('selected MindDB with unresolved privacy blocks release and stays out of output', () => {
  const { source, plan } = fixture();
  source.minddbSnapshot.publication = 'published';
  plan.minddb = true;
  const scope = createPublicationScope(source, plan);
  assert.ok(scope.errors.some((error) => error.includes('MindDB')));
  assert.equal(scope.minddbSnapshot, undefined);
});

test('selected document and media permissions are checked, not bypassed by selection', () => {
  const { source, plan } = fixture();
  const recognition = source.recognitions[0];
  recognition.publication = 'published';
  plan.recognitions = [recognition.id];
  const media = source.media.find((row) => row.id === source.works[0].media[0]);
  media.rights = 'restricted';
  const scope = createPublicationScope(source, plan);
  assert.ok(scope.errors.some((error) => error.includes('document rights')));
  assert.ok(scope.errors.some((error) => error.includes('rights restricted')));
  assert.equal(scope.recognitions.length, 0);
  assert.ok(!scope.assetPaths.has(recognition.previewSrc));
  assert.ok(!scope.assetPaths.has(media.src));
});

test('case dependencies must be public; permitted evidence is not inferred from a published case', () => {
  const { source, plan } = fixture();
  const oneCase = source.cases.find((row) => row.work === source.works[0].id);
  oneCase.publication = 'published';
  plan.cases = [oneCase.id];
  const evidence = source.evidence.find((row) => row.id === oneCase.evidence[0]);
  evidence.permission = 'review';
  const scope = createPublicationScope(source, plan);
  assert.ok(scope.errors.some((error) => error.includes(`evidence ${evidence.id}`)));
  assert.ok(!scope.cases[0].evidence.includes(evidence.id));
  source.works[0].publication = 'review';
  assert.equal(createPublicationScope(source, plan).cases.length, 0);
});

test('public projection strips internal locators and future fields without mutating editorial data', () => {
  const { source, plan } = fixture();
  source.works[0].source = 'D:/private/archive.md';
  source.works[0].internalNotes = 'trusted_internal';
  const scope = createPublicationScope(source, plan);
  const output = JSON.stringify(scope);
  assert.ok(!output.includes('D:/private'));
  assert.ok(!output.includes('trusted_internal'));
  assert.equal(source.works[0].source, 'D:/private/archive.md');
  assert.equal(source.works[0].cases.length, original.works[0].cases.length);
  assert.equal(scope.works[0].cases.length, 0);
});

test('unmapped hero is deferred independently and preview retains the editorial catalogue', () => {
  const { source, plan } = fixture();
  assert.deepEqual(createPublicationScope(source, plan).errors, []);
  source.heroVisuals.push({
    id: 'unmapped-fixture',
    mediaId: source.media[0].id,
    target: { kind: 'unmapped' },
  });
  plan.heroVisuals = ['unmapped-fixture'];
  assert.ok(createPublicationScope(source, plan).errors.some((error) => error.includes('unmapped')));
  const preview = createPublicationScope(source, plan, true);
  assert.equal(preview.works.length, original.works.length);
  assert.ok(preview.minddbSnapshot);
  assert.equal(preview.recognitions.length, original.recognitions.length);
});

test('legacy resolver preserves both languages and provides an explicit fallback for deferred pages', () => {
  const { source, plan } = fixture();
  const pages = createPages(createPublicationScope(source, plan));
  const rows = [
    {
      id: 'interference',
      targetEn: '/en/works/interference-of-realities/',
      targetRu: '/ru/works/interference-of-realities/',
    },
    {
      id: 'ancestors',
      targetEn: '/en/works/ancestors-in-the-noise/',
      targetRu: '/ru/works/ancestors-in-the-noise/',
    },
  ];
  const routes = resolveLegacyRoutes(rows, pages);
  assert.deepEqual(routes.interference, [rows[0].targetEn, rows[0].targetRu]);
  assert.deepEqual(routes.ancestors, [
    '/legacy/unavailable/?id=ancestors&lang=en',
    '/legacy/unavailable/?id=ancestors&lang=ru',
  ]);
});

test('editorial retained flags never substitute for a physically published legacy file', () => {
  const audit = [{ path: '/old.webp', retained: true }];
  assert.equal(unresolvedLegacyMedia(audit, {}, new Set()).length, 1);
  assert.equal(unresolvedLegacyMedia(audit, {}, new Set(['/old.webp'])).length, 0);
  const redirect = {
    action: 'redirect',
    approvedBy: 'owner',
    approvedOn: '2026-10-06',
    reason: 'replacement',
    target: '/new.webp',
  };
  assert.equal(unresolvedLegacyMedia(audit, { '/old.webp': redirect }, new Set()).length, 1);
  assert.equal(
    unresolvedLegacyMedia(audit, { '/old.webp': { ...redirect, httpLayerVerified: true } }, new Set()).length,
    0,
  );
});
