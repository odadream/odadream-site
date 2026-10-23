import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRecheck } from '../scripts/recheck-release.mjs';

const report = {
  requested: 'release',
  browserFiles: [],
  head: 'baseline',
  error: 'Check failed: browser',
  artifact: { sha256: 'checked-artifact' },
  jobs: ['format', 'metadata', 'unit', 'content', 'types', 'build', 'artifact'].map((name) => ({
    name,
    code: 0,
  })),
};
const run = { path: '.github/workflows/deploy.yml', head_sha: 'baseline' };
const log = '  1) [mobile] › e2e/media-gallery.spec.ts:54:1 › native zoom\n';
test('release recheck accepts a test-only correction with passed complete baseline checks', () => {
  assert.doesNotThrow(() => validateRecheck(report, run, ['e2e/media-gallery.spec.ts'], log));
});
test('production, unrelated, incomplete and uncovered failures cannot use a focused release', () => {
  for (const file of ['src/scripts/media-viewer.ts', 'public/documents/private.pdf', 'package-lock.json'])
    assert.throws(() => validateRecheck(report, run, [file], log));
  assert.throws(() => validateRecheck({ ...report, jobs: [] }, run, ['e2e/media-gallery.spec.ts'], log));
  assert.throws(() =>
    validateRecheck(report, { ...run, head_sha: 'other' }, ['e2e/media-gallery.spec.ts'], log),
  );
  assert.throws(() =>
    validateRecheck(report, run, ['e2e/media-gallery.spec.ts'], log.replace('media-gallery', 'analytics')),
  );
  assert.throws(() =>
    validateRecheck(
      { ...report, browserFiles: ['e2e/media-gallery.spec.ts'] },
      run,
      ['e2e/media-gallery.spec.ts'],
      log,
    ),
  );
});

test('gateway and homepage media expectations can reuse the exact unchanged production artifact', () => {
  const gatewayLog = '  1) [desktop] › e2e/site.spec.ts:132:1 › selected cover opens viewer\n';
  assert.doesNotThrow(() =>
    validateRecheck(report, run, ['e2e/site.spec.ts', 'scripts/recheck-release.mjs'], gatewayLog),
  );
  assert.throws(() =>
    validateRecheck(report, run, ['e2e/site.spec.ts', 'src/components/WorkCard.astro'], gatewayLog),
  );
});

test('recognition grouped-page expectations reuse only the unchanged full baseline artifact', () => {
  const groupedLog = '  1) [desktop] › e2e/full-materials.spec.ts:26:1 › grouped recognition pages\n';
  assert.doesNotThrow(() =>
    validateRecheck(report, run, ['e2e/full-materials.spec.ts', 'scripts/recheck-release.mjs'], groupedLog),
  );
  assert.throws(() =>
    validateRecheck(report, run, ['e2e/full-materials.spec.ts', 'src/data/site.ts'], groupedLog),
  );
});
