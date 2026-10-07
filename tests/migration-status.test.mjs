import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import YAML from 'yaml';
import { migrationStatus } from '../scripts/migration-status.mjs';

const fixture = () => ({
  status_values: ['planned', 'in_progress', 'blocked', 'done'],
  items: [
    { id: 'source', status: 'done' },
    { id: 'content', status: 'in_progress' },
  ],
  migration_progress: {
    scope_version: 'fixture',
    checkpoints: [
      { id: 'sources', title: 'Sources', weight: 15, status: 'done', tasks: ['source'] },
      { id: 'content', title: 'Content', weight: 85, status: 'in_progress', tasks: ['content'] },
    ],
  },
});
test('progress counts only completed weighted deliverables', () => {
  const data = fixture();
  assert.equal(migrationStatus(data).percent, 15);
  data.migration_progress.checkpoints[1].status = 'done';
  data.items[1].status = 'done';
  assert.equal(migrationStatus(data).percent, 100);
});
test('completed subresults count inside the original budget, with no credit for unfinished tasks', () => {
  const data = fixture();
  data.items.push({ id: 'remaining', status: 'planned' });
  data.migration_progress.checkpoints[1].tasks.push('remaining');
  data.items[1].status = 'done';
  data.migration_progress.checkpoints[1].parts = [
    { id: 'prepared', weight: 25, tasks: ['content'] },
    { id: 'release', weight: 60, tasks: ['remaining'] },
  ];
  assert.equal(migrationStatus(data).percent, 40);
  assert.equal(migrationStatus(data).closedStagePercent, 15);
  data.migration_progress.checkpoints[1].parts[1].tasks = ['source'];
  assert.throws(() => migrationStatus(data), /outside checkpoint/);
  data.migration_progress.checkpoints[1].parts[1].tasks = ['content'];
  assert.throws(() => migrationStatus(data), /counted twice/);
  data.migration_progress.checkpoints[1].parts[1].tasks = ['remaining'];
  data.migration_progress.checkpoints[1].parts[1].weight = 59;
  assert.throws(() => migrationStatus(data), /match checkpoint budget/);
  data.migration_progress.checkpoints[1].parts[1].weight = 60;
  data.migration_progress.checkpoints[1].status = 'done';
  assert.throws(() => migrationStatus(data), /unfinished parts/);
});
test('invalid total, duplicate checkpoint and unknown task cannot inflate progress', () => {
  const total = fixture();
  total.migration_progress.checkpoints[1].weight = 84;
  assert.throws(() => migrationStatus(total), /total 100/);
  const duplicate = fixture();
  duplicate.migration_progress.checkpoints[1].id = 'sources';
  assert.throws(() => migrationStatus(duplicate), /Duplicate/);
  const task = fixture();
  task.migration_progress.checkpoints[1].tasks = ['missing'];
  assert.throws(() => migrationStatus(task), /Unknown task/);
});

test('one completed task cannot earn weight in two checkpoints or shadow another backlog ID', () => {
  const repeated = fixture();
  repeated.migration_progress.checkpoints[1].tasks = ['source'];
  repeated.migration_progress.checkpoints[1].status = 'done';
  assert.throws(() => migrationStatus(repeated), /across checkpoints/);
  const duplicate = fixture();
  duplicate.items.push({ id: 'content', status: 'done' });
  assert.throws(() => migrationStatus(duplicate), /Duplicate backlog task/);
  const invalid = fixture();
  invalid.items[1].status = 'nearly-done';
  assert.throws(() => migrationStatus(invalid), /Invalid task status/);
});

test('a frozen earlier scope does not contribute to current completion', () => {
  const data = {
    ...fixture(),
    migration_progress_history: [
      { scope_version: 'earlier', percent: 95, frozen: true, recorded_on: '2026-10-07' },
    ],
  };
  const report = migrationStatus(data);
  assert.equal(report.percent, 15);
  assert.equal(report.previousScopes[0].percent, 95);
  data.migration_progress_history[0].scope_version = 'fixture';
  assert.throws(() => migrationStatus(data), /Invalid frozen/);
});

test('the real expanded scope retains completed work, schedules every source and withdraws unapproved retirements', async () => {
  const backlog = YAML.parse(
    await readFile(new URL('../docs/PROJECT-BACKLOG.yaml', import.meta.url), 'utf8'),
  );
  const inventory = JSON.parse(
    await readFile(new URL('../docs/migration/INVENTORY-2026-10-05.json', import.meta.url), 'utf8'),
  );
  const decisions = JSON.parse(
    await readFile(new URL('../docs/media-decisions.json', import.meta.url), 'utf8'),
  );
  const report = migrationStatus(backlog);
  assert.equal(report.scope, inventory.currentCourseRevision.scopeVersion);
  assert.equal(report.previousScopes[0].percent, 95);
  assert.equal(report.previousScopes[0].scope, inventory.currentCourseRevision.previousScope.version);
  assert.ok(report.percent >= inventory.currentCourseRevision.baselinePercent);
  const ids = new Set(backlog.items.map((task) => task.id));
  for (const task of backlog.items) {
    assert.ok(
      task.acceptance.every((criterion) => typeof criterion === 'string' && criterion.trim()),
      task.id,
    );
    for (const dependency of task.depends_on ?? []) assert.ok(ids.has(dependency), dependency);
  }
  assert.equal(inventory.entries.length, 238);
  for (const entry of inventory.entries) {
    assert.equal(entry.scopeRebase.scopeVersion, report.scope);
    assert.ok(
      entry.scopeRebase.plannedUse && entry.scopeRebase.batch && entry.scopeRebase.targetRoles.length,
    );
    assert.ok(entry.sourceHashes.mapping, entry.id);
  }
  const reviews = Object.values(decisions).filter((row) => row.action === 'review');
  for (const row of reviews) {
    assert.equal(row.approvalStatus, 'pending-reassessment');
    assert.equal(row.previousProposal.action, 'retire');
    assert.equal(row.expectedHttpAfterCutover, undefined);
    assert.equal(row.approvedBy, undefined);
  }
  for (const row of Object.values(decisions).filter((row) => row.action === 'retire')) {
    assert.ok(row.approvedBy && row.approvedOn, 'retirement requires an actual owner decision');
  }
});
