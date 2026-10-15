import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { loadSiteModule } from './site-data.mjs';
import { externalMediaInput, mediaInputPath } from './media-input.mjs';
import { prepareArchiveVideos } from './prepare-archive-videos.mjs';

// Only typed, cleared records enter public. Archive preparation is strictly private.
const data = await loadSiteModule();
await prepareArchiveVideos(data.media);
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
      selectedPages: 'selectedPages' in row ? row.selectedPages : undefined,
      publish: row.rights === 'cleared',
    },
    row.id,
  );
}
for (const row of data.recognitions.filter((row) => row.previewSrc)) {
  addRequest(
    {
      href: row.previewSrc,
      source: resolve('public', row.previewSrc.slice(1)),
      kind: 'image',
      profile: 'document',
      extractText: true,
      publish: row.documentRights === 'cleared',
    },
    row.id,
  );
}
for (const row of data.media.filter((row) => row.kind === 'image')) {
  if (
    externalMediaInput(row) &&
    createHash('sha256')
      .update(await readFile(mediaInputPath(row)))
      .digest('hex') !== row.archiveSource.sha256
  )
    throw Error(`Image source changed: ${row.id}`);
  for (const href of [row.src, row.mobileSrc].filter(Boolean)) {
    addRequest(
      {
        href,
        source: mediaInputPath(row, href),
        kind: 'image',
        extractText: row.representation === 'document',
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
        extractText: row.path.includes('/proofs/'),
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
if (process.exitCode === 0) {
  const { format, resolveConfig } = await import('prettier');
  for (const path of ['src/data/prepared-media.ts', 'src/data/prepared-videos.ts']) {
    const config = await resolveConfig(path);
    await writeFile(path, await format(await readFile(path, 'utf8'), { ...config, filepath: path }));
  }
}
