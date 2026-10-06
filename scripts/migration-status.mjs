import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import YAML from 'yaml';

export function migrationStatus(backlog) {
  const progress = backlog.migration_progress;
  if (!progress?.scope_version || !progress.checkpoints?.length)
    throw new Error('Migration scope/checkpoints are not defined');
  const ids = new Set();
  const tasks = new Map(backlog.items.map((row) => [row.id, row]));
  const taskIds = new Set(tasks.keys());
  let total = 0;
  let completed = 0;
  let closedStages = 0;
  const breakdown = [];
  for (const checkpoint of progress.checkpoints) {
    if (ids.has(checkpoint.id)) throw new Error(`Duplicate checkpoint ${checkpoint.id}`);
    ids.add(checkpoint.id);
    if (!Number.isInteger(checkpoint.weight) || checkpoint.weight <= 0)
      throw new Error(`Invalid weight ${checkpoint.id}`);
    if (!backlog.status_values.includes(checkpoint.status))
      throw new Error(`Invalid status ${checkpoint.id}`);
    for (const task of checkpoint.tasks) if (!taskIds.has(task)) throw new Error(`Unknown task ${task}`);
    total += checkpoint.weight;
    if (checkpoint.status === 'done') closedStages += checkpoint.weight;
    let earned = 0;
    const parts = checkpoint.parts ?? [];
    if (parts.length) {
      const partIds = new Set();
      const assignedTasks = new Set();
      let budget = 0;
      for (const part of parts) {
        if (!part.id || partIds.has(part.id))
          throw new Error(`Duplicate/missing part ${checkpoint.id}/${part.id}`);
        partIds.add(part.id);
        if (!Number.isInteger(part.weight) || part.weight <= 0)
          throw new Error(`Invalid part weight ${part.id}`);
        if (!part.tasks?.length || new Set(part.tasks).size !== part.tasks.length)
          throw new Error(`Missing/duplicate part tasks ${part.id}`);
        for (const task of part.tasks) {
          if (!taskIds.has(task)) throw new Error(`Unknown task ${task}`);
          if (!checkpoint.tasks.includes(task)) throw new Error(`Task outside checkpoint ${task}`);
          if (assignedTasks.has(task)) throw new Error(`Task counted twice ${task}`);
          assignedTasks.add(task);
        }
        budget += part.weight;
        if (part.tasks.every((task) => tasks.get(task).status === 'done')) earned += part.weight;
      }
      if (budget !== checkpoint.weight)
        throw new Error(`Parts must match checkpoint budget ${checkpoint.id}`);
      if (assignedTasks.size !== checkpoint.tasks.length)
        throw new Error(`Checkpoint tasks missing from parts ${checkpoint.id}`);
      if (checkpoint.status === 'done' && earned !== budget)
        throw new Error(`Closed checkpoint has unfinished parts ${checkpoint.id}`);
    } else if (checkpoint.status === 'done') {
      if (!checkpoint.tasks.every((task) => tasks.get(task).status === 'done'))
        throw new Error(`Closed checkpoint has unfinished tasks ${checkpoint.id}`);
      earned = checkpoint.weight;
    }
    completed += earned;
    breakdown.push({ ...checkpoint, earned });
  }
  if (total !== 100) throw new Error(`Migration weights must total 100, got ${total}`);
  return {
    scope: progress.scope_version,
    measurement: progress.method,
    percent: completed,
    closedStagePercent: closedStages,
    checkpoints: breakdown,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const report = migrationStatus(
    YAML.parse(await readFile(new URL('../docs/PROJECT-BACKLOG.yaml', import.meta.url), 'utf8')),
  );
  console.log(`Migration ${report.scope}: ${report.percent}%`);
  console.log(`Closed stages: ${report.closedStagePercent}%; method: ${report.measurement}`);
  for (const row of report.checkpoints)
    console.log(
      `${row.status === 'done' ? '+' : '-'} ${row.id} (${row.earned}/${row.weight}%) — ${row.title}`,
    );
}
