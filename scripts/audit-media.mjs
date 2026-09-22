import { readdir, stat, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';

const oldRoot = resolve(process.argv[2] || '../odadream-site-archive-2026-09-21/public');
const newRoot = resolve('public');
const records = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.isFile()) {
      const path = '/' + relative(oldRoot, full).replaceAll('\\', '/');
      if (!path.startsWith('/images/content/')) continue;
      const retained = await stat(resolve(newRoot, path.slice(1))).then(
        () => true,
        () => false,
      );
      records.push({
        path,
        retained,
        decision: retained
          ? 'curated — rights review'
          : 'not copied — rights and inbound URL review required',
      });
    }
  }
}
await walk(resolve(oldRoot, 'images/content'));
records.sort((a, b) => a.path.localeCompare(b.path, 'en'));
await writeFile(resolve('docs/media-audit.json'), JSON.stringify(records, null, 2) + '\n');
console.log(
  `${records.length} old content-media URLs: ${records.filter((x) => x.retained).length} retained, ${records.filter((x) => !x.retained).length} pending decision.`,
);
