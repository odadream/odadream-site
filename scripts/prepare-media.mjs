import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadSiteModule } from './site-data.mjs';

// Only typed, cleared records enter public. Archive preparation is strictly private.
const data = await loadSiteModule();
const requests = new Map();
function addRequest(request, ownerId) {
  const previous = requests.get(request.href);
  requests.set(request.href, {
    ...request,
    publish: request.publish || previous?.publish || false,
    profile: previous?.profile === 'document' ? 'document' : request.profile,
    owners: [...new Set([...(previous?.owners ?? []), ownerId])],
  });
}
for (const row of [...data.workDocuments, ...data.referenceDocuments]) {
  addRequest(
    {
      href: row.href,
      source: resolve('public', row.href.slice(1)),
      kind: 'pdf',
      publish: row.rights === 'cleared',
    },
    row.id,
  );
}
for (const row of data.media.filter((row) => row.kind === 'image')) {
  for (const href of [row.src, row.mobileSrc].filter(Boolean)) {
    addRequest(
      {
        href,
        source: resolve('public', href.slice(1)),
        kind: 'image',
        profile: ['document', 'diagram', 'poster', 'screenshot'].includes(row.representation)
          ? 'document'
          : 'photograph',
        publish: row.rights === 'cleared',
      },
      row.id,
    );
  }
}
if (process.argv.includes('--archive')) {
  const audit = JSON.parse(await readFile('docs/media-audit.json', 'utf8'));
  for (const row of audit.filter((row) => ['document', 'image'].includes(row.role))) {
    if (!requests.has(row.path))
      requests.set(row.path, {
        href: row.path,
        source: resolve('../odadream-site-archive-2026-09-21/public', row.path.slice(1)),
        kind: row.role === 'document' ? 'pdf' : 'image',
        publish: false,
      });
  }
}
await mkdir('.local-server', { recursive: true });
const input = resolve('.local-server/media-preparation-input.json');
await writeFile(input, JSON.stringify([...requests.values()]));
const result = spawnSync(
  process.env.ODA_MEDIA_PYTHON ?? 'python',
  ['-X', 'utf8', 'scripts/prepare-media.py', input],
  { stdio: 'inherit' },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
