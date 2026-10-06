import test from 'node:test';
import assert from 'node:assert/strict';
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
