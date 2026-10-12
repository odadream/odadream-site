import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, mkdir, writeFile, rm, cp } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import {
  planChecks,
  supportedNode,
  assertProjectIdentity,
  projectRoot,
  jobsFor,
  treeFingerprint,
} from '../scripts/checks.mjs';
import { validateBacklog, taskCard, readBacklog } from '../scripts/task-context.mjs';

test('shared, infrastructure and unknown changes cannot receive a narrow green result', () => {
  for (const file of [
    'src/styles/tokens.css',
    'src/lib/routes.ts',
    'src/lib/publication-scope.ts',
    'scripts/checks.mjs',
    'new-widget.ts',
    'docs/media-decisions.json',
  ]) {
    const plan = planChecks(['src/components/WorkCard.astro', file]);
    assert.equal(plan.effective, 'full');
    assert.equal(plan.docsOnly, false);
    assert.deepEqual(plan.browserFiles, []);
    assert.deepEqual(plan.readingFamilies, []);
  }
});
test('document changes do not require a runtime matrix; explicit full/release never narrow', () => {
  const docs = ['README.md', 'docs/PROJECT-BACKLOG.yaml', 'docs/DESIGN-GUIDE.md'];
  assert.equal(planChecks(docs).docsOnly, true);
  for (const mode of ['full', 'release', 'browser']) {
    assert.equal(planChecks(docs, mode).effective, mode);
    assert.equal(planChecks(docs, mode).docsOnly, false);
  }
  assert.throws(() => planChecks([], 'invalid'));
});
test('scoped coverage combines dependent tests and every selected test exists', async () => {
  const files = [
    'WorkCard',
    'ProgrammeCard',
    'RecognitionCard',
    'CollectiveFeedback',
    'MediaCropEditor',
    'MediaCropTrigger',
  ].map((name) => 'src/components/' + name + '.astro');
  const plan = planChecks(files);
  assert.equal(plan.effective, 'quick');
  assert.ok(plan.browserFiles.includes('e2e/work-card-layout.spec.ts'));
  assert.ok(plan.browserFiles.includes('e2e/editorial-workspace.spec.ts'));
  assert.equal(new Set(plan.browserFiles).size, plan.browserFiles.length);
  assert.deepEqual(plan.readingFamilies, ['education/', 'recognition/', 'works/']);
  for (const file of plan.browserFiles) await access(resolve(projectRoot, file));
  assert.deepEqual(
    planChecks(['src\\components\\WorkCard.astro']).browserFiles,
    planChecks([files[0]]).browserFiles,
  );
});
test('full and release keep every gate and build before testing the public artifact', () => {
  for (const mode of ['full', 'release']) {
    const names = jobsFor(planChecks([], mode)).map((job) => job[0]);
    for (const gate of ['metadata', 'format', 'unit', 'content', 'types', 'build', 'artifact', 'browser'])
      assert.ok(names.includes(gate));
    assert.ok(names.indexOf('build') < names.indexOf('artifact'));
    assert.ok(names.indexOf('artifact') < names.indexOf('browser'));
    assert.equal(names.includes('release'), mode === 'release');
    assert.equal(names.filter((name) => name === 'build').length, 1);
  }
  assert.deepEqual(
    jobsFor(planChecks([])).map((job) => job[0]),
    ['metadata'],
  );
});
test('fingerprint detects nested source changes rather than relying on a build timestamp', async (t) => {
  const cacheRoot = resolve(projectRoot, '.local-server');
  await mkdir(cacheRoot, { recursive: true });
  const folder = await mkdtemp(resolve(cacheRoot, 'fingerprint-test-'));
  t.after(async () => {
    if (!folder.startsWith(cacheRoot + sep)) throw Error('Unsafe test cleanup');
    await rm(folder, { recursive: true, force: true });
  });
  const nested = resolve(folder, 'nested');
  await mkdir(nested);
  const file = resolve(nested, 'source.txt');
  await writeFile(file, 'first');
  const paths = [relative(projectRoot, nested)];
  const before = await treeFingerprint(paths);
  assert.equal(await treeFingerprint(paths), before);
  await writeFile(file, 'second');
  assert.notEqual(await treeFingerprint(paths), before);
  const copied = resolve(folder, 'copied');
  await cp(nested, copied, { recursive: true });
  assert.equal(await treeFingerprint([relative(projectRoot, copied)]), await treeFingerprint(paths));
  await rm(resolve(copied, 'source.txt'));
  assert.notEqual(await treeFingerprint([relative(projectRoot, copied)]), await treeFingerprint(paths));
});
test('runtime and identity checks reject the old checkout and unsupported Node', () => {
  assert.equal(supportedNode('v22.17.0'), false);
  assert.equal(supportedNode('v22.19.0'), true);
  assert.equal(supportedNode('v24.19.0'), true);
  assert.equal(supportedNode('not-a-version'), false);
  assert.doesNotThrow(() => assertProjectIdentity({ project: projectRoot }));
  assert.throws(() => assertProjectIdentity({ project: resolve(projectRoot, '../odadream-site') }));
  assert.throws(() => assertProjectIdentity({}));
});
const sample = () => ({
  status_values: ['planned', 'done'],
  priority_values: ['P0'],
  items: [
    {
      id: 'ROOT-01',
      area: 'maintenance',
      title: 'First',
      status: 'planned',
      priority: 'P0',
      depends_on: ['DEP-01'],
      source: 'docs/MAINTENANCE-AUDIT.md',
    },
    { id: 'DEP-01', title: 'Dependency', status: 'done', priority: 'P0' },
  ],
});
test('context rejects misleading duplicate IDs, missing dependencies and cycles', () => {
  const duplicate = sample();
  duplicate.items.push(duplicate.items[0]);
  assert.throws(() => validateBacklog(duplicate), /Duplicate/);
  const missing = sample();
  missing.items[0].depends_on = ['UNKNOWN'];
  assert.throws(() => validateBacklog(missing), /Unknown/);
  const cycle = sample();
  cycle.items[1].depends_on = ['ROOT-01'];
  assert.throws(() => validateBacklog(cycle), /cycle/);
  const state = sample();
  state.items[0].status = 'accepted';
  assert.throws(() => validateBacklog(state), /Invalid/);
});
test('task card uses actual canonical status and selected contracts, with no separate state', async () => {
  const card = taskCard(sample(), 'ROOT-01');
  assert.equal(card.task.status, 'planned');
  assert.deepEqual(card.dependencies, [{ id: 'DEP-01', status: 'done' }]);
  assert.equal(card.read.filter((file) => file === 'docs/MAINTENANCE-AUDIT.md').length, 1);
  assert.throws(() => taskCard(sample(), 'UNKNOWN'), /Unknown task/);
  const backlog = await readBacklog();
  for (const task of backlog.items.filter((row) => row.id.startsWith('MAINT-'))) {
    const actual = taskCard(backlog, task.id);
    assert.equal(actual.task.status, task.status);
    for (const file of actual.read) await access(resolve(projectRoot, file));
  }
});
