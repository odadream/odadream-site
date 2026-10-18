import { readFile, readdir, mkdir, writeFile, rm, cp, lstat } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import { resolve, dirname, relative, delimiter } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createConnection } from 'node:net';
import { workspaceLock } from './workspace-storage.mjs';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const scopedComponents = {
  'src/components/WorkCard.astro': ['work-card-layout', 'works-model', 'reading-profile'],
  'src/components/ProgrammeCard.astro': ['full-education-migration', 'reading-profile', 'design-pilot'],
  'src/components/RecognitionCard.astro': ['evidence-migration', 'home-statistics', 'design-pilot'],
  'src/components/CollectiveFeedback.astro': ['feedback-crop'],
  'src/components/MediaCropEditor.astro': ['feedback-crop', 'editorial-workspace'],
  'src/components/MediaCropTrigger.astro': ['feedback-crop', 'media-gallery'],
};

/** Conservative allowlist: unknown/shared changes retain the complete browser matrix. */
export function planChecks(files, requested = 'quick') {
  if (!['quick', 'full', 'release', 'browser'].includes(requested)) throw Error('Unknown check mode');
  const changed = [...new Set(files.map((file) => file.replaceAll('\\', '/')))].sort();
  const browsers = new Set();
  const readingFamilies = new Set();
  const familyByComponent = {
    'src/components/WorkCard.astro': 'works/',
    'src/components/ProgrammeCard.astro': 'education/',
    'src/components/RecognitionCard.astro': 'recognition/',
  };
  const reasons = [];
  let docsOnly = true;
  for (const file of changed) {
    if (
      /^(README|AGENTS)\.md$/.test(file) ||
      /^docs\/.*\.md$/.test(file) ||
      file === 'docs/PROJECT-BACKLOG.yaml'
    )
      continue;
    docsOnly = false;
    if (scopedComponents[file]) scopedComponents[file].forEach((name) => browsers.add(`e2e/${name}.spec.ts`));
    else reasons.push('Shared or unmapped change: ' + file);
    if (familyByComponent[file]) readingFamilies.add(familyByComponent[file]);
  }
  const effective = requested === 'quick' && reasons.length ? 'full' : requested;
  return {
    requested,
    effective,
    changed,
    reasons,
    docsOnly: effective === 'quick' && docsOnly,
    browserFiles: effective === 'quick' ? [...browsers].sort() : [],
    readingFamilies: effective === 'quick' ? [...readingFamilies].sort() : [],
  };
}

export function supportedNode(version) {
  const parts = version.replace(/^v/, '').split('.').map(Number);
  return parts[0] > 22 || (parts[0] === 22 && parts[1] >= 19);
}
const sameRoot = (left, right) => {
  const normalize = (value) => {
    const normalized = resolve(value);
    return process.platform === 'win32' ? normalized.toLowerCase() : normalized;
  };
  return normalize(left) === normalize(right);
};
export function assertProjectIdentity(identity, root = projectRoot) {
  if (!identity?.project || !sameRoot(identity.project, root))
    throw Error('DEV port belongs to another project or has no verified identity.');
}
const git = (args) =>
  execFileSync('git', args, { cwd: projectRoot, windowsHide: true, encoding: 'utf8' }).trimEnd();
export function changedFiles(since) {
  const diffs = [
    git(['diff', '--name-only', '-z', 'HEAD']),
    git(['ls-files', '--others', '--exclude-standard', '-z']),
  ];
  if (since) {
    const commit = git(['rev-parse', '--verify', '--end-of-options', `${since}^{commit}`]);
    diffs.push(git(['diff', '--name-only', '-z', commit, 'HEAD']));
  }
  return [...new Set(diffs.flatMap((value) => value.split('\0').filter(Boolean)))];
}

export async function treeFingerprint(paths) {
  const hash = createHash('sha256');
  async function visit(file, key) {
    const absolute = resolve(projectRoot, file);
    let entries;
    try {
      entries = await readdir(absolute, { withFileTypes: true });
    } catch (error) {
      if (error.code !== 'ENOTDIR') throw error;
      hash.update(key + '\0');
      hash.update(await readFile(absolute));
      hash.update('\0');
      return;
    }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name === '__pycache__') continue;
      if (entry.isSymbolicLink()) throw Error('Unexpected symlink in verification input: ' + file);
      await visit(file + '/' + entry.name, key + '/' + entry.name);
    }
  }
  let index = 0;
  for (const path of [...paths].sort()) await visit(path, String(index++));
  return hash.digest('hex');
}
const inputPaths = [
  'src',
  'scripts',
  'public',
  'tests',
  'e2e',
  'package.json',
  'package-lock.json',
  'astro.config.mjs',
  'playwright.config.ts',
  'tsconfig.json',
  'docs/media-audit.json',
  'docs/media-decisions.json',
  'docs/migration/INVENTORY-2026-10-05.json',
  'docs/EDITORIAL-REGISTER.yaml',
];
async function devIdentity() {
  try {
    const response = await fetch('http://127.0.0.1:5177/__editorial/identity', {
      signal: AbortSignal.timeout(2000),
    });
    if (response.ok) {
      const identity = await response.json();
      assertProjectIdentity(identity);
      return { state: 'verified', project: identity.project };
    }
  } catch (error) {
    if (error.message.includes('another project')) throw error;
  }
  const listening = await new Promise((resolveProbe) => {
    const socket = createConnection({ host: '127.0.0.1', port: 5177 });
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.destroy();
      resolveProbe(true);
    });
    socket.once('error', () => {
      socket.destroy();
      resolveProbe(false);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolveProbe(true);
    });
  });
  if (listening) throw Error('DEV port is occupied by an unidentified service. It was not stopped.');
  return { state: 'absent', action: 'Playwright will start this project.' };
}
export async function diagnose() {
  const packageInfo = JSON.parse(await readFile(resolve(projectRoot, 'package.json'), 'utf8'));
  if (
    packageInfo.name !== 'oda-dream-site-v2' ||
    !sameRoot(git(['rev-parse', '--show-toplevel']), projectRoot)
  )
    throw Error('Wrong project root; expected the V2 checkout.');
  if (!supportedNode(process.version)) throw Error('Node >=22.19 required. Use check-v2.cmd or Node 24.');
  await readFile(resolve(projectRoot, 'node_modules/astro/package.json'));
  const development = await devIdentity();
  let publicPreview = { state: 'absent' };
  try {
    const identity = await fetch('http://127.0.0.1:5178/__editorial/identity', {
      signal: AbortSignal.timeout(1000),
    });
    assertProjectIdentity(await identity.json());
    const response = await fetch('http://127.0.0.1:5178/__editorial/status', {
      signal: AbortSignal.timeout(1000),
    });
    const status = await response.json();
    publicPreview = {
      state: status.ready ? 'ready' : 'not-ready',
      building: status.building,
      builtAt: status.builtAt,
      error: status.error,
    };
  } catch (error) {
    if (error.message.includes('another project')) throw error;
  }
  return {
    root: projectRoot,
    node: process.version,
    executable: process.execPath,
    development,
    publicPreview,
  };
}

export function jobsFor(plan) {
  const metadata = ['metadata', 'scripts/task-context.mjs', ['--validate']];
  const format = [
    'format',
    'node_modules/prettier/bin/prettier.cjs',
    ['--check', 'src', 'scripts', 'tests', 'e2e', 'astro.config.mjs', 'playwright.config.ts'],
  ];
  const build = [
    ['build', 'node_modules/astro/astro.js', ['build']],
    ['artifact', 'scripts/verify-build.mjs', []],
  ];
  if (plan.docsOnly) return [metadata];
  const browser = [
    'browser',
    'node_modules/@playwright/test/cli.js',
    ['test', ...plan.browserFiles, '--reporter=line'],
  ];
  if (plan.effective === 'browser') return [metadata, ...build, browser];
  const jobs = [
    format,
    metadata,
    ['unit', null, []],
    ['content', 'scripts/verify-content.mjs', []],
    ['types', 'node_modules/astro/astro.js', ['check']],
    ...build,
    browser,
  ];
  if (plan.effective === 'release') jobs.push(['release', 'scripts/release-gate.mjs', []]);
  return jobs;
}
async function runJob([name, entry, args], folder, plan) {
  if (!entry)
    args = [
      '--test',
      '--test-concurrency=2', // Each isolated test loads the TypeScript catalogue; bound peak memory.
      ...(await readdir(resolve(projectRoot, 'tests')))
        .filter((file) => file.endsWith('.test.mjs'))
        .sort()
        .map((file) => 'tests/' + file),
    ];
  const logPath = resolve(folder, name + '.log');
  const log = createWriteStream(logPath);
  const started = performance.now();
  console.log('Checking ' + name + '…');
  const child = spawn(process.execPath, entry ? [entry, ...args] : args, {
    cwd: projectRoot,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      PATH: dirname(process.execPath) + delimiter + process.env.PATH,
      ODA_BUILD_DIR: resolve(folder, 'dist'),
      ODA_E2E_READING_FAMILIES: plan.effective === 'quick' ? plan.readingFamilies.join(',') : '',
    },
  });
  let tail = '';
  const record = (chunk) => {
    log.write(chunk);
    tail = (tail + chunk.toString('utf8')).slice(-6000);
  };
  child.stdout.on('data', record);
  child.stderr.on('data', record);
  const timer = setInterval(
    () => console.log(name + ': ' + Math.round((performance.now() - started) / 1000) + 's · ' + logPath),
    30000,
  );
  let code;
  try {
    code = await new Promise((resolveJob, reject) => {
      child.once('error', reject);
      child.once('close', resolveJob);
    });
  } finally {
    clearInterval(timer);
    await new Promise((resolveLog) => log.end(resolveLog));
  }
  const result = {
    name,
    code,
    seconds: Math.round((performance.now() - started) / 10) / 100,
    log: relative(projectRoot, logPath).replaceAll('\\', '/'),
  };
  console.log(name + ': ' + (code === 0 ? 'OK' : 'FAILED') + ' · ' + result.seconds + 's');
  if (code !== 0) console.error(tail);
  return result;
}
export async function runChecks(plan) {
  const unlock = await workspaceLock(projectRoot);
  try {
    return await runChecksUnlocked(plan);
  } finally {
    await unlock();
  }
}
async function runChecksUnlocked(plan) {
  const environment = await diagnose();
  if (process.env.ODA_E2E_BASE_URL)
    throw Error('Managed checks require the verified local DEV server; unset ODA_E2E_BASE_URL.');
  const folder = resolve(projectRoot, '.local-server/checks', String(Date.now()));
  const buildDirectory = relative(projectRoot, resolve(folder, 'dist')).replaceAll('\\', '/');
  await mkdir(folder, { recursive: true });
  const report = {
    ...plan,
    environment,
    head: git(['rev-parse', 'HEAD']),
    startedAt: new Date().toISOString(),
    jobs: [],
    success: false,
  };
  const save = () => writeFile(resolve(folder, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  const started = performance.now();
  await save();
  console.log('Mode: ' + plan.effective + (plan.docsOnly ? ' · documents and task metadata' : ''));
  for (const reason of plan.reasons) console.log(reason);
  try {
    const fingerprintInputs = async () =>
      treeFingerprint([
        ...inputPaths,
        ...(await readdir(projectRoot)).filter((name) => /^\.env(?:\.|$)/.test(name)),
      ]);
    const before = plan.docsOnly ? undefined : await fingerprintInputs();
    for (const job of jobsFor(plan)) {
      report.current = job[0];
      await save();
      if (job[0] === 'browser') await devIdentity();
      const result = await runJob(job, folder, plan);
      report.jobs.push(result);
      await save();
      if (result.code !== 0) throw Error('Check failed: ' + result.name);
      if (result.name === 'artifact')
        report.artifact = {
          path: buildDirectory,
          sha256: await treeFingerprint([buildDirectory]),
          inputSha256: before,
        };
    }
    if (before && before !== (await fingerprintInputs()))
      throw Error('Inputs changed during verification; rerun before acceptance.');
    if (report.artifact && report.artifact.sha256 !== (await treeFingerprint([buildDirectory])))
      throw Error('Artifact changed during verification.');
    if (report.artifact) {
      const destination = resolve(projectRoot, 'dist');
      if (relative(projectRoot, destination) !== 'dist') throw Error('Unsafe artifact destination');
      const existing = await lstat(destination).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      });
      if (existing?.isSymbolicLink()) throw Error('Refusing to replace a linked dist directory.');
      await rm(destination, { recursive: true, force: true });
      await cp(resolve(projectRoot, buildDirectory), destination, { recursive: true });
      if ((await treeFingerprint(['dist'])) !== report.artifact.sha256)
        throw Error('Installed dist does not match the verified artifact.');
      report.installedArtifact = { path: 'dist', sha256: report.artifact.sha256 };
    }
    report.success = true;
  } catch (error) {
    report.error = error.message;
    throw error;
  } finally {
    report.current = null;
    report.finishedAt = new Date().toISOString();
    report.seconds = Math.round((performance.now() - started) / 10) / 100;
    await save();
    console.log('Report: ' + resolve(folder, 'report.json'));
  }
  return report;
}
async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log(
      'checks.mjs [--mode quick|full|release|browser] [--since REF] [--files PATH ...] [--plan] [--doctor]\nExplicit files add to actual Git changes; they never hide them.',
    );
    return;
  }
  if (args.includes('--doctor')) {
    console.log(JSON.stringify(await diagnose(), null, 2));
    return;
  }
  let mode = 'quick',
    since;
  const extra = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--mode' || arg === '--since') {
      const value = args[++index];
      if (!value || value.startsWith('--')) throw Error('Missing argument: ' + arg);
      if (arg === '--mode') mode = value;
      else since = value;
    } else if (arg === '--files') {
      while (args[index + 1] && !args[index + 1].startsWith('--')) extra.push(args[++index]);
    } else if (arg !== '--plan') throw Error('Unknown option: ' + arg);
  }
  const plan = planChecks([...changedFiles(since), ...extra], mode);
  if (args.includes('--plan')) {
    console.log(JSON.stringify(plan, null, 2));
    return;
  }
  await runChecks(plan);
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
