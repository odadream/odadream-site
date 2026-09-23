import { readFile, writeFile } from 'node:fs/promises';

const input = process.argv[2] || process.env.GOLEM_EVENT_REGISTRY;
if (!input) {
  console.error('Usage: npm run stats:golem -- <absolute path to event_registry.json>');
  process.exit(2);
}

const registry = JSON.parse(await readFile(input, 'utf8'));
if (!Array.isArray(registry.events) || !registry.generated_at)
  throw new Error('Unexpected Golem event registry format');

const connectionQuality = { connected: 0, ambiguous: 0, isolated: 0 };
for (const event of registry.events) {
  if (event.kind !== 'event_folder' || !(event.registry_category in connectionQuality))
    throw new Error('Unexpected Golem event kind or category');
  connectionQuality[event.registry_category] += 1;
}
const summary = {
  source: 'Golem Data Base / knowledge-base/reports/event-registry/event_registry.json',
  generatedAt: registry.generated_at,
  unit: 'event_folder',
  total: registry.events.length,
  connectionQuality,
  note: 'Aggregate of archival event folders, not a count of reviewed public cases. No personal or per-event data is exported.',
};
await writeFile('src/data/golem-event-summary.json', JSON.stringify(summary, null, 2) + '\n');
console.log(`Wrote aggregate for ${summary.total} event folders; no event rows exported.`);
