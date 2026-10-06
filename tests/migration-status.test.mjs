import test from 'node:test';
import assert from 'node:assert/strict';
import { migrationStatus } from '../scripts/migration-status.mjs';

const fixture = () => ({
  status_values: ['planned', 'in_progress', 'blocked', 'done'],
  items: [{ id: 'source' }, { id: 'content' }],
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
  assert.equal(migrationStatus(data).percent, 100);
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
