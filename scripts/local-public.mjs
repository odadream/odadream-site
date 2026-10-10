import { createServer } from 'node:http';
import { readFile, readdir, stat, mkdir, rm } from 'node:fs/promises';
import { watch } from 'node:fs';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const buildRoot = resolve(root, '.local-server/public-builds');
const port = 5178;
const allowedOrigins = new Set(['http://127.0.0.1:5177', 'http://127.0.0.1:5178']);
let activeRoot;
let previousRoot;
let state = { building: false, ready: false, builtAt: null, routes: [], error: null };
let dirty = true;
let acceptedFingerprint;
let forceBuild = false;
let timer;
let child;
const watched = ['src', 'scripts', 'public', 'astro.config.mjs', 'package.json', 'package-lock.json'];
async function fingerprint() {
  const hash = createHash('sha256');
  async function walk(path) {
    const meta = await stat(path);
    if (meta.isDirectory()) {
      for (const name of (await readdir(path)).sort()) await walk(resolve(path, name));
    } else {
      hash.update(path.slice(root.length));
      // File metadata keeps large media out of the watcher's memory.
      hash.update(String(meta.size) + ':' + String(meta.mtimeMs));
    }
  }
  for (const name of watched) await walk(resolve(root, name));
  return hash.digest('hex');
}
function run(args, env) {
  return new Promise((resolveRun, reject) => {
    child = spawn(process.execPath, args, { cwd: root, env, windowsHide: true, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code) =>
      code === 0 ? resolveRun() : reject(new Error('Build/check failed: ' + code)),
    );
  });
}
async function routesIn(directory) {
  const routes = [];
  async function walk(path, route) {
    for (const item of await readdir(path, { withFileTypes: true })) {
      if (item.isDirectory()) await walk(resolve(path, item.name), route + item.name + '/');
      else if (item.name === 'index.html') routes.push(route);
    }
  }
  for (const lang of ['ru', 'en']) await walk(resolve(directory, lang), '/' + lang + '/');
  return routes;
}
async function discard(directory) {
  const absolute = resolve(directory);
  if (!absolute.startsWith(buildRoot + sep)) throw new Error('Unsafe build cleanup');
  await rm(absolute, { recursive: true, force: true });
}
async function rebuild() {
  if (state.building || !dirty) return;
  dirty = false;
  state = { ...state, building: true, error: null };
  const target = resolve(buildRoot, String(Date.now()));
  try {
    const before = await fingerprint();
    if (!forceBuild && before === acceptedFingerprint) return;
    forceBuild = false;
    const env = { ...process.env, ODA_BUILD_DIR: target, PUBLIC_ANALYTICS_ENABLED: 'false' };
    await run(['node_modules/astro/astro.js', 'build'], env);
    await run(['scripts/verify-build.mjs'], env);
    const after = await fingerprint();
    if (before !== after) {
      dirty = true;
      await discard(target);
    } else {
      acceptedFingerprint = after;
      const former = activeRoot;
      activeRoot = target;
      state = {
        building: true,
        ready: true,
        builtAt: new Date().toISOString(),
        routes: await routesIn(target),
        error: null,
      };
      const retired = previousRoot;
      previousRoot = former;
      // Keep a previous version for requests already reading it. Cleanup cannot invalidate an activated build.
      if (retired)
        await discard(retired).catch((error) => console.warn('Local cache cleanup:', error.message));
      console.log('Local PUBLIC ready: http://127.0.0.1:5178/ru/');
    }
  } catch (error) {
    state.error = 'Сборка не прошла проверку. Показана предыдущая версия, если она есть.';
    console.error(error);
    await discard(target).catch(console.error);
  } finally {
    state.building = false;
    if (dirty) void rebuild();
  }
}
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = createServer(async (req, res) => {
  try {
    if (req.headers.host !== '127.0.0.1:' + port) {
      res.writeHead(403).end();
      return;
    }
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.has(origin)) {
      res.writeHead(403).end();
      return;
    }
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const url = new URL(req.url, 'http://127.0.0.1:' + port);
    if (url.pathname === '/__editorial/rebuild' && req.method === 'POST') {
      forceBuild = true;
      dirty = true;
      void rebuild();
      res.writeHead(202).end();
      return;
    }
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405).end();
      return;
    }
    if (url.pathname === '/__editorial/identity') {
      res.setHeader('Content-Type', types['.json']);
      res.end(
        JSON.stringify({
          project: root,
          pid: process.pid,
          builderPid: state.building ? child?.pid : undefined,
        }),
      );
      return;
    }
    if (url.pathname === '/__editorial/status') {
      res.setHeader('Content-Type', types['.json']);
      res.end(JSON.stringify(state));
      return;
    }
    const servedBuild = state.builtAt;
    let file;
    if (url.pathname === '/__editorial/client.js') file = resolve(root, 'scripts/editorial-client.js');
    else if (url.pathname === '/__editorial/style.css') file = resolve(root, 'src/styles/editorial.css');
    else {
      if (!activeRoot) {
        res
          .writeHead(503, { 'Content-Type': types['.html'] })
          .end(
            '<!doctype html><html lang="ru"><meta charset="utf-8"><meta http-equiv="refresh" content="3"><title>PUBLIC готовится</title><p>Публичная сборка готовится. Страница обновится автоматически.</p><a href="http://127.0.0.1:5177/ru/">Вернуться в DEV</a></html>',
          );
        return;
      }
      const path = decodeURIComponent(url.pathname);
      file = resolve(activeRoot, '.' + path);
      if (file !== activeRoot && !file.startsWith(activeRoot + sep)) {
        res.writeHead(403).end();
        return;
      }
      const meta = await stat(file).catch(() => undefined);
      if (meta?.isDirectory()) file = resolve(file, 'index.html');
      if (!meta || (!meta.isFile() && !meta.isDirectory())) {
        res.statusCode = 404;
        if (!extname(path)) file = resolve(activeRoot, '404.html');
        else {
          res.end();
          return;
        }
      }
    }
    const type = types[extname(file)] || 'application/octet-stream';
    res.setHeader('Content-Type', type);
    let bytes = await readFile(file);
    if (type.startsWith('text/html'))
      bytes = Buffer.from(
        bytes
          .toString()
          .replace(
            '</body>',
            '<script type="module" src="/__editorial/client.js" data-public-built-at="' +
              servedBuild +
              '"></script></body>',
          ),
      );
    const range = req.headers.range;
    if (range && !type.startsWith('text/')) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      const start = match ? Number(match[1]) : -1;
      const end = match?.[2] ? Math.min(Number(match[2]), bytes.length - 1) : bytes.length - 1;
      if (start < 0 || start > end || start >= bytes.length) {
        res.writeHead(416, { 'Content-Range': 'bytes */' + bytes.length }).end();
        return;
      }
      res.writeHead(206, {
        'Content-Range': 'bytes ' + start + '-' + end + '/' + bytes.length,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
      });
      res.end(req.method === 'HEAD' ? undefined : bytes.subarray(start, end + 1));
      return;
    }
    res.setHeader('Content-Length', bytes.length);
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
});
await mkdir(buildRoot, { recursive: true });
server.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
server.listen(port, '127.0.0.1', () => {
  void rebuild();
});
for (const name of watched) {
  watch(resolve(root, name), { recursive: true }, () => {
    dirty = true;
    clearTimeout(timer);
    timer = setTimeout(() => void rebuild(), 500);
  });
}
process.on('SIGTERM', () => {
  child?.kill();
  server.close(() => process.exit(0));
});
