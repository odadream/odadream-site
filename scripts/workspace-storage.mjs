import { cp, lstat, mkdir, open, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { resolve, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const git = (cwd, args) =>
  execFileSync('git', args, {
    cwd,
    windowsHide: true,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trimEnd();
const digest = async (file) =>
  createHash('sha256')
    .update(await readFile(file))
    .digest('hex');

/** Validate the complete ancestor chain before following, copying or deleting anything. */
export async function safePath(base, name) {
  const boundary = resolve(base),
    target = resolve(boundary, name);
  const local = relative(boundary, target);
  if (!local || local === '..' || local.startsWith('..' + sep) || isAbsolute(local))
    throw Error('Path escapes its boundary');
  const parts = target.split(sep);
  let current = parts.shift() + sep;
  for (const part of parts) {
    current = resolve(current, part);
    const info = await lstat(current).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });
    if (info?.isSymbolicLink()) throw Error('Linked paths are not supported: ' + current);
  }
  return target;
}

export async function workspaceLock(project) {
  const folder = await safePath(project, '.local-server');
  await mkdir(folder, { recursive: true });
  const path = await safePath(project, '.local-server/maintenance.lock');
  let handle;
  try {
    handle = await open(path, 'wx');
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    throw Error(
      'Verification/storage operation already locked. If interrupted, check the PID in .local-server/maintenance.lock before removing that file.',
    );
  }
  await handle.writeFile(JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
  return async () => {
    await handle.close();
    await rm(path);
  };
}

async function filesBelow(folder) {
  const files = [];
  async function visit(path) {
    const info = await lstat(path);
    if (info.isSymbolicLink()) throw Error('Linked snapshot input: ' + path);
    if (info.isDirectory()) {
      for (const entry of (await readdir(path)).sort()) await visit(resolve(path, entry));
    } else if (info.isFile()) files.push(relative(folder, path).replaceAll('\\', '/'));
    else throw Error('Unsupported snapshot input: ' + path);
  }
  await visit(folder);
  return files.sort();
}
async function snapshotFiles(project) {
  const names = new Set(
    git(project, ['ls-files', '-z', '--cached', '--others', '--exclude-standard'])
      .split('\0')
      .filter(Boolean),
  );
  for (const name of await readdir(project)) if (/^\.env(?:\.|$)/.test(name)) names.add(name);
  for (const name of ['.local-server/media-cache', '.local-server/media-tools']) {
    const path = await safePath(project, name);
    if (
      await lstat(path).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      })
    )
      for (const file of await filesBelow(path)) names.add(name + '/' + file);
  }
  const records = [];
  for (const name of [...names].sort()) {
    const path = await safePath(project, name);
    const info = await lstat(path).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });
    if (!info) continue; // Tracked deletions are preserved by restoring without checkout.
    if (!info.isFile()) throw Error('Snapshot expects a regular file: ' + name);
    records.push({ path: name, bytes: info.size, sha256: await digest(path) });
  }
  return records;
}

/** Full current-branch history + working files, never a copy of a managed worktree's .git pointer. */
export async function createBackup(project, destination) {
  const folder = resolve(destination);
  const local = relative(resolve(project, '..'), folder);
  if (!local || (!local.startsWith('..' + sep) && !isAbsolute(local)))
    throw Error('Backup must be outside the site workspace parent');
  await safePath(resolve(folder, '..'), folder.split(sep).at(-1));
  await mkdir(folder); // Fail instead of overwriting an existing backup.
  const branch = git(project, ['symbolic-ref', '--short', 'HEAD']);
  const head = git(project, ['rev-parse', 'HEAD']);
  const records = await snapshotFiles(project);
  const bundle = resolve(folder, 'history.bundle');
  git(project, ['bundle', 'create', bundle, 'refs/heads/' + branch]);
  git(project, ['bundle', 'verify', bundle]);
  const snapshot = resolve(folder, 'files');
  await mkdir(snapshot);
  for (const row of records) {
    const destinationFile = await safePath(snapshot, row.path);
    await mkdir(resolve(destinationFile, '..'), { recursive: true });
    await cp(await safePath(project, row.path), destinationFile, { errorOnExist: true, force: false });
    if ((await digest(destinationFile)) !== row.sha256)
      throw Error('Input changed while copying: ' + row.path);
  }
  if (
    git(project, ['rev-parse', 'HEAD']) !== head ||
    JSON.stringify(await snapshotFiles(project)) !== JSON.stringify(records)
  )
    throw Error('Workspace changed during backup; incomplete backup has no manifest.');
  const manifest = {
    version: 1,
    createdAt: new Date().toISOString(),
    branch,
    head,
    bundleSha256: await digest(bundle),
    files: records,
    scope:
      'Current branch history and working files, root environment files, media cache and OCR models. External originals, other branches, staging state, dependencies and build/log artifacts are excluded.',
  };
  await writeFile(resolve(folder, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  await verifyBackup(folder);
  return {
    path: folder,
    head,
    files: records.length,
    bytes: records.reduce((sum, row) => sum + row.bytes, 0) + (await lstat(bundle)).size,
  };
}
export async function verifyBackup(folder) {
  const manifest = JSON.parse(await readFile(await safePath(folder, 'manifest.json'), 'utf8'));
  if (manifest.version !== 1 || !/^[\da-f]{40}$/.test(manifest.head) || !Array.isArray(manifest.files))
    throw Error('Invalid backup manifest');
  const bundle = await safePath(folder, 'history.bundle');
  if ((await digest(bundle)) !== manifest.bundleSha256) throw Error('Backup history checksum mismatch');
  const expected = manifest.files.map((row) => row.path).sort();
  if (new Set(expected).size !== expected.length) throw Error('Duplicate backup path');
  const snapshot = await safePath(folder, 'files');
  if (JSON.stringify(await filesBelow(snapshot)) !== JSON.stringify(expected))
    throw Error('Backup file set mismatch');
  for (const row of manifest.files) {
    const path = await safePath(snapshot, row.path);
    if ((await lstat(path)).size !== row.bytes || (await digest(path)) !== row.sha256)
      throw Error('Backup file checksum mismatch: ' + row.path);
  }
  return manifest;
}
export async function restoreBackup(folder, target) {
  const manifest = await verifyBackup(folder);
  await safePath(resolve(target, '..'), resolve(target).split(sep).at(-1));
  await mkdir(target); // Existing directories are never modified.
  git(target, [
    'clone',
    '--no-checkout',
    '--branch',
    manifest.branch,
    resolve(folder, 'history.bundle'),
    '.',
  ]);
  if (git(target, ['rev-parse', 'HEAD']) !== manifest.head) throw Error('Restored history mismatch');
  git(target, ['read-tree', 'HEAD']); // Populate index only; preserve working changes and deletions.
  for (const row of manifest.files) {
    const path = await safePath(target, row.path);
    if (relative(resolve(target), path).split(sep)[0] === '.git')
      throw Error('Snapshot cannot overwrite Git metadata');
    await mkdir(resolve(path, '..'), { recursive: true });
    await cp(await safePath(resolve(folder, 'files'), row.path), path, { errorOnExist: true, force: false });
    if ((await digest(path)) !== row.sha256) throw Error('Restoration checksum mismatch: ' + row.path);
  }
  git(target, ['fsck', '--full', '--no-reflogs']);
  return { path: resolve(target), head: manifest.head, files: manifest.files.length };
}

/** Retain two successful build packets and the latest failed packet; all reports/logs remain. */
export async function pruneChecks(project, apply = false) {
  const base = await safePath(project, '.local-server/checks');
  const runs = [];
  for (const name of await readdir(base).catch((error) => {
    if (error.code === 'ENOENT') return [];
    throw error;
  })) {
    if (!/^\d+$/.test(name)) continue;
    const folder = await safePath(base, name);
    const reportPath = await safePath(folder, 'report.json');
    let report;
    try {
      report = JSON.parse(await readFile(reportPath, 'utf8'));
    } catch {
      continue;
    } // Unknown and unfinished packets are protected.
    if (!report.finishedAt) continue;
    const packet = await safePath(folder, 'dist');
    if (
      !(await lstat(packet).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      }))
    )
      continue;
    runs.push({ name, report, packet });
  }
  runs.sort((a, b) => Number(b.name) - Number(a.name));
  const retained = new Set(
    [
      ...runs.filter((run) => run.report.success === true).slice(0, 2),
      ...runs.filter((run) => run.report.success !== true).slice(0, 1),
    ].map((run) => run.name),
  );
  const removed = [];
  for (const run of runs.filter((run) => !retained.has(run.name))) {
    let bytes = 0;
    for (const file of await filesBelow(run.packet))
      bytes += (await lstat(await safePath(run.packet, file))).size;
    if (apply) await rm(run.packet, { recursive: true });
    removed.push({ path: relative(project, run.packet).replaceAll('\\', '/'), bytes });
  }
  return {
    apply,
    retained: [...retained],
    packets: removed,
    bytes: removed.reduce((sum, row) => sum + row.bytes, 0),
  };
}
async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'verify' && args.length === 1) {
    const manifest = await verifyBackup(resolve(args[0]));
    console.log(JSON.stringify({ head: manifest.head, files: manifest.files.length, verified: true }));
    return;
  }
  if (command === 'restore' && args.length === 2) {
    console.log(JSON.stringify(await restoreBackup(resolve(args[0]), resolve(args[1])), null, 2));
    return;
  }
  if (command === 'backup' && args.length <= 1) {
    const parent = resolve(process.env.LOCALAPPDATA || process.env.HOME, 'ODA.dream', 'site-v2-backups');
    await mkdir(parent, { recursive: true });
    const destination = args[0]
      ? resolve(args[0])
      : resolve(parent, new Date().toISOString().replaceAll(/[:.]/g, '-') + '-' + randomUUID().slice(0, 8));
    const unlock = await workspaceLock(root);
    try {
      console.log(JSON.stringify(await createBackup(root, destination), null, 2));
    } finally {
      await unlock();
    }
    return;
  }
  if (command === 'prune-checks' && (args.length === 0 || (args.length === 1 && args[0] === '--apply'))) {
    const unlock = await workspaceLock(root);
    try {
      console.log(JSON.stringify(await pruneChecks(root, args[0] === '--apply'), null, 2));
    } finally {
      await unlock();
    }
    return;
  }
  throw Error(
    'Usage: workspace-storage.mjs backup [NEW_FOLDER] | verify BACKUP | restore BACKUP NEW_FOLDER | prune-checks [--apply]',
  );
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
