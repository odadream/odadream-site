import { readFile, mkdir, open, unlink, writeFile } from 'node:fs/promises';
import { openSync, closeSync } from 'node:fs';
import { createServer } from 'node:net';
import { resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
const stateRoot = resolve(root, '.local-server');
await mkdir(stateRoot, { recursive: true });
const lockPath = resolve(stateRoot, 'workspace-start.lock');
let lock;
try {
  lock = await open(lockPath, 'wx');
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  const prior = Number(await readFile(lockPath, 'utf8').catch(() => ''));
  try {
    process.kill(prior, 0);
    console.log('Workspace launch already running.');
    process.exit(0);
  } catch {
    await unlink(lockPath);
    lock = await open(lockPath, 'wx');
  }
}
await lock.writeFile(String(process.pid));
async function identity(port) {
  try {
    const response = await fetch('http://127.0.0.1:' + port + '/__editorial/identity', {
      signal: AbortSignal.timeout(1500),
    });
    return response.ok ? response.json() : undefined;
  } catch {
    return undefined;
  }
}
async function free(port) {
  return new Promise((resolveFree) => {
    const probe = createServer();
    probe.once('error', () => resolveFree(false));
    probe.listen(port, '127.0.0.1', () => probe.close(() => resolveFree(true)));
  });
}
const servers = [];
try {
  // Inspect both ports before stopping anything. Never stop an unrelated service.
  const identities = await Promise.all([5177, 5178].map(identity));
  for (let i = 0; i < identities.length; i++) {
    const value = identities[i];
    if (
      !(await free(5177 + i)) &&
      (!value || normalize(value.project).toLowerCase() !== normalize(root).toLowerCase())
    )
      throw new Error('Port ' + (5177 + i) + ' belongs to another/unidentified process. It was not stopped.');
  }
  for (const value of identities) {
    if (!value) continue;
    if (value.builderPid) {
      try {
        process.kill(value.builderPid);
      } catch {}
    }
    try {
      process.kill(value.pid);
    } catch {}
  }
  const deadline = Date.now() + 10000;
  while (!(await free(5177)) || !(await free(5178))) {
    if (Date.now() > deadline) throw new Error('Workspace ports did not become available.');
    await new Promise((r) => setTimeout(r, 200));
  }
  function start(args, name) {
    const out = openSync(resolve(stateRoot, name + '.log'), 'a');
    const err = openSync(resolve(stateRoot, name + '-error.log'), 'a');
    const server = spawn(process.execPath, args, {
      cwd: root,
      env: { ...process.env, PUBLIC_ANALYTICS_ENABLED: 'false' },
      windowsHide: true,
      detached: true,
      stdio: ['ignore', out, err],
    });
    closeSync(out);
    closeSync(err);
    servers.push(server);
    server.unref();
    return server;
  }
  start([resolve(root, 'scripts/local-public.mjs')], 'public-server');
  start([resolve(root, 'scripts/astro-cli.mjs'), 'dev', '--host', '127.0.0.1', '--port', '5177'], 'server');
  const readyDeadline = Date.now() + 45000;
  while (true) {
    const values = await Promise.all([5177, 5178].map(identity));
    if (values.every(Boolean)) break;
    if (Date.now() > readyDeadline) throw new Error('Workspace startup timed out. See .local-server logs.');
    await new Promise((r) => setTimeout(r, 250));
  }
  console.log(
    'DEV http://127.0.0.1:5177/ru/ · PUBLIC http://127.0.0.1:5178/ru/ · texts http://127.0.0.1:5177/editorial/',
  );
  await writeFile(
    resolve(stateRoot, 'launcher.log'),
    new Date().toISOString() + ' DEV/PUBLIC started successfully.\n',
  );
  if (!process.argv.includes('--no-browser'))
    spawn('explorer.exe', ['http://127.0.0.1:5177/ru/'], {
      windowsHide: true,
      detached: true,
      stdio: 'ignore',
    }).unref();
} catch (error) {
  for (const server of servers) server.kill();
  await writeFile(resolve(stateRoot, 'launcher.log'), new Date().toISOString() + ' ' + error.message + '\n');
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await lock.close();
  await unlink(lockPath).catch(() => {});
}
