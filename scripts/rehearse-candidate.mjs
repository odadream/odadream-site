import { cp, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';

const root = process.cwd();
const sandboxRoot = resolve(root, '.local-server');
const { mkdir } = await import('node:fs/promises');
await mkdir(sandboxRoot, { recursive: true });
const directory = await mkdtemp(join(sandboxRoot, 'candidate-rehearsal-'));
if (!directory.startsWith(sandboxRoot + sep)) throw new Error('Rehearsal outside private workspace');
const original = await readFile('src/data/catalogue.ts', 'utf8');
const fingerprint = createHash('sha256').update(original).digest('hex');
if (
  !original.includes('export const catalogue = createPublicationScope(source, publicationPlan, preview);') ||
  !original.includes('export const preview = import.meta.env?.DEV === true;')
)
  throw new Error('Catalogue contract changed; update the isolated rehearsal explicitly');
for (const path of ['src', 'scripts', 'public'])
  await cp(resolve(root, path), join(directory, path), { recursive: true });
for (const file of ['astro.config.mjs', 'package.json', 'tsconfig.json'])
  await cp(resolve(root, file), join(directory, file));
// Build the real publication projection in an isolated copy without changing approvals.
await writeFile(
  join(directory, 'REHEARSAL-NOT-FOR-DEPLOYMENT.txt'),
  'Isolated QA copy of the current publication projection; not authorized for deployment.\n',
);
async function run(args) {
  await new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: directory,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, PUBLIC_ANALYTICS_ENABLED: 'false', PUBLIC_ANALYTICS_DEBUG: 'false' },
    });
    let output = '';
    child.stdout.on('data', (chunk) => {
      output += chunk;
    });
    child.stderr.on('data', (chunk) => {
      output += chunk;
    });
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolvePromise() : reject(new Error(output))));
  });
}
await run([resolve(root, 'node_modules/astro/astro.js'), 'build']);
await run(['scripts/verify-build.mjs']);
await writeFile(
  join(directory, 'dist/REHEARSAL-NOT-FOR-DEPLOYMENT.txt'),
  'Isolated QA artifact; do not deploy.\n',
);
if (
  createHash('sha256')
    .update(await readFile(resolve(root, 'src/data/catalogue.ts')))
    .digest('hex') !== fingerprint
)
  throw new Error('Working catalogue changed during rehearsal');
// Run the loader in a fresh process for the private copy, avoiding the original module cache.
let summary;
await new Promise((resolvePromise, reject) => {
  const child = spawn(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
    import{loadSiteModule}from'./scripts/site-data.mjs';
    const{catalogue}=await loadSiteModule('src/data/catalogue.ts');const{pages}=await loadSiteModule('src/lib/routes.ts');
    console.log(JSON.stringify({pages:pages.map(({path,anchors})=>({path,anchors})),assets:[...catalogue.assetPaths],works:catalogue.works.length,programmes:catalogue.programmes.length,media:catalogue.media.length,cases:catalogue.cases.length,documents:catalogue.workDocuments.length,recognitions:catalogue.recognitions.length,minddb:!!catalogue.minddbSnapshot}));
  `,
    ],
    { cwd: directory, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  let text = '';
  child.stdout.on('data', (chunk) => (text += chunk));
  child.on('error', reject);
  child.on('exit', (code) => {
    if (code !== 0) reject(new Error('Rehearsal scope inspection failed'));
    else {
      summary = JSON.parse(text);
      resolvePromise();
    }
  });
});
await writeFile(join(directory, 'scope.json'), JSON.stringify(summary, null, 2) + '\n');
await writeFile(
  resolve(root, '.local-server/candidate-rehearsal.json'),
  JSON.stringify(
    { directory, dist: join(directory, 'dist'), isolated: true, fixture: false, summary },
    null,
    2,
  ) + '\n',
);
console.log(
  `Private candidate rehearsal verified: ${summary.pages.length} localized pages, ${summary.works} works, ${summary.cases} events, ${summary.documents} work PDFs. Real publication statuses unchanged. Pointer: .local-server/candidate-rehearsal.json`,
);
