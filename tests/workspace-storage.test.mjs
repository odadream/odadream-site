import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  createBackup,
  restoreBackup,
  verifyBackup,
  safePath,
  pruneChecks,
  workspaceLock,
} from '../scripts/workspace-storage.mjs';

async function fixture(run) {
  const folder = await mkdtemp(resolve(tmpdir(), 'oda-storage-test-'));
  try {
    await run(folder);
  } finally {
    assert.match(folder, /oda-storage-test-/);
    await rm(folder, { recursive: true, force: true });
  }
}
const git = (cwd, ...args) => execFileSync('git', args, { cwd, windowsHide: true, encoding: 'utf8' });

test('independent backup restores history, changed/deleted/untracked files and private cache; corruption blocks restore', async () =>
  fixture(async (folder) => {
    const project = resolve(folder, 'workspace', 'site');
    await mkdir(project, { recursive: true });
    git(project, 'init', '-b', 'codex/test');
    await writeFile(resolve(project, '.gitignore'), '.local-server/\n.env\n');
    await writeFile(resolve(project, 'content.txt'), 'original');
    await writeFile(resolve(project, 'deleted.txt'), 'deleted later');
    git(project, 'add', '.');
    git(
      project,
      '-c',
      'user.name=Storage Test',
      '-c',
      'user.email=test@example.invalid',
      'commit',
      '-m',
      'fixture',
    );
    await writeFile(resolve(project, 'content.txt'), 'changed');
    await rm(resolve(project, 'deleted.txt'));
    await writeFile(resolve(project, 'new.txt'), 'untracked');
    await writeFile(resolve(project, '.env'), 'FAKE_TEST_VALUE=private');
    await mkdir(resolve(project, '.local-server/media-cache'), { recursive: true });
    await writeFile(resolve(project, '.local-server/media-cache/document.txt'), 'extracted text');
    await writeFile(resolve(project, '.local-server/log.txt'), 'excluded log');
    const backup = resolve(folder, 'backup');
    await createBackup(project, backup);
    const restored = resolve(folder, 'restored');
    await restoreBackup(backup, restored);
    assert.equal(git(project, 'rev-parse', 'HEAD'), git(restored, 'rev-parse', 'HEAD'));
    for (const name of ['content.txt', 'new.txt', '.env', '.local-server/media-cache/document.txt'])
      assert.equal(
        await readFile(resolve(project, name), 'utf8'),
        await readFile(resolve(restored, name), 'utf8'),
      );
    await assert.rejects(access(resolve(restored, 'deleted.txt')));
    await assert.rejects(access(resolve(restored, '.local-server/log.txt')));
    await assert.rejects(restoreBackup(backup, restored), { code: 'EEXIST' });
    await writeFile(resolve(backup, 'files/new.txt'), 'corrupted');
    await assert.rejects(verifyBackup(backup), /checksum/);
    await assert.rejects(restoreBackup(backup, resolve(folder, 'corrupt-restore')), /checksum/);
    await assert.rejects(access(resolve(folder, 'corrupt-restore')));
  }));

test('storage boundaries reject traversal and linked ancestors; operations cannot share a lock', async () =>
  fixture(async (folder) => {
    await assert.rejects(safePath(folder, '../elsewhere'), /boundary/);
    await assert.rejects(safePath(folder, '.'), /boundary/);
    const external = resolve(folder, 'external');
    await mkdir(external);
    await symlink(external, resolve(folder, 'link'), process.platform === 'win32' ? 'junction' : 'dir');
    await assert.rejects(safePath(folder, 'link/packet'), /Linked/);
    const unlock = await workspaceLock(folder);
    await assert.rejects(workspaceLock(folder), /locked/);
    await unlock();
    await (
      await workspaceLock(folder)
    )();
  }));

test('retention protects unfinished/unknown packets, newest successes/failure and all reports/private cache', async () =>
  fixture(async (folder) => {
    for (const [name, report] of [
      ['1', { success: true }],
      ['2', { success: false }],
      ['3', { success: true }],
      ['4', { success: false }],
      ['5', { success: true }],
      ['6', { current: 'browser' }],
      ['7', null],
    ]) {
      const packet = resolve(folder, '.local-server/checks', name);
      await mkdir(resolve(packet, 'dist'), { recursive: true });
      await writeFile(resolve(packet, 'dist/index.html'), name);
      if (report)
        await writeFile(
          resolve(packet, 'report.json'),
          JSON.stringify({ ...report, ...(name !== '6' && { finishedAt: '2026-10-13' }) }),
        );
    }
    await mkdir(resolve(folder, '.local-server/media-cache'), { recursive: true });
    await writeFile(resolve(folder, '.local-server/media-cache/document.txt'), 'keep');
    const plan = await pruneChecks(folder);
    assert.deepEqual(
      plan.packets.map((packet) => packet.path),
      ['.local-server/checks/2/dist', '.local-server/checks/1/dist'],
    );
    await access(resolve(folder, '.local-server/checks/1/dist/index.html'));
    const applied = await pruneChecks(folder, true);
    assert.equal(applied.bytes, 2);
    for (const name of ['3', '4', '5', '6', '7'])
      await access(resolve(folder, '.local-server/checks', name, 'dist/index.html'));
    for (const name of ['1', '2']) {
      await assert.rejects(access(resolve(folder, '.local-server/checks', name, 'dist')));
      await access(resolve(folder, '.local-server/checks', name, 'report.json'));
    }
    await access(resolve(folder, '.local-server/media-cache/document.txt'));
  }));
