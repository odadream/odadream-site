import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import YAML from 'yaml';

export function migrationStatus(backlog) {
  const progress = backlog.migration_progress;
  if (!progress?.scope_version || !progress.checkpoints?.length)
    throw new Error('Migration scope/checkpoints are not defined');
  const ids = new Set();
  const taskIds = new Set(backlog.items.map((row) => row.id));
  let total = 0;
  let completed = 0;
  for (const checkpoint of progress.checkpoints) {
    if (ids.has(checkpoint.id)) throw new Error(`Duplicate checkpoint ${checkpoint.id}`);
    ids.add(checkpoint.id);
    if (!Number.isInteger(checkpoint.weight) || checkpoint.weight <= 0)
      throw new Error(`Invalid weight ${checkpoint.id}`);
    if (!backlog.status_values.includes(checkpoint.status))
      throw new Error(`Invalid status ${checkpoint.id}`);
    for (const task of checkpoint.tasks) if (!taskIds.has(task)) throw new Error(`Unknown task ${task}`);
    total += checkpoint.weight;
    if (checkpoint.status === 'done') completed += checkpoint.weight;
  }
  if (total !== 100) throw new Error(`Migration weights must total 100, got ${total}`);
  return { scope: progress.scope_version, percent: completed, checkpoints: progress.checkpoints };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const report = migrationStatus(
    YAML.parse(await readFile(new URL('../docs/PROJECT-BACKLOG.yaml', import.meta.url), 'utf8')),
  );
  console.log(`Migration ${report.scope}: ${report.percent}%`);
  for (const row of report.checkpoints)
    console.log(`${row.status === 'done' ? '+' : '-'} ${row.id} (${row.weight}%) — ${row.title}`);
}
