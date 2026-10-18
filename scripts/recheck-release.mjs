import { execFileSync } from 'node:child_process';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { runChecks } from './checks.mjs';

const browserFiles = [
  'e2e/media-gallery.spec.ts',
  'e2e/evidence-migration.spec.ts',
  'e2e/home-statistics.spec.ts',
];
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

/** Reuse a full run only for test-only fixes; production changes always require the full matrix. */
export function validateRecheck(report, run, changed, browserLog) {
  if (run.path !== '.github/workflows/deploy.yml' || run.head_sha !== report.head)
    throw Error('Baseline is not this release workflow and source commit.');
  if (
    report.requested !== 'release' ||
    report.browserFiles?.length ||
    report.error !== 'Check failed: browser'
  )
    throw Error('Baseline must be a completed full release with only a browser failure.');
  for (const name of ['format', 'metadata', 'unit', 'content', 'types', 'build', 'artifact'])
    if (!report.jobs.some((job) => job.name === name && job.code === 0))
      throw Error('Missing passed baseline check: ' + name);
  if (report.jobs.some((job) => job.code !== 0 && job.name !== 'browser'))
    throw Error('Non-browser failure cannot be reused.');
  if (!report.artifact?.sha256) throw Error('Missing baseline artifact fingerprint.');
  const failures = [...browserLog.matchAll(/^\s+\d+\) \[(?:desktop|mobile)\] › (e2e\/[^:]+\.spec\.ts):/gm)];
  if (!failures.length || failures.some((match) => !browserFiles.includes(match[1])))
    throw Error('Every failed test must be covered by the dependent recheck.');
  if (
    !changed.length ||
    changed.some(
      (file) =>
        !(
          browserFiles.includes(file) ||
          /^docs\/.*\.(?:md|yaml)$/.test(file) ||
          [
            '.github/workflows/deploy.yml',
            'scripts/recheck-release.mjs',
            'tests/recheck-release.test.mjs',
            'tests/deployment-contract.test.mjs',
          ].includes(file)
        ),
    )
  )
    throw Error('Production or unrelated sources changed; use the full release workflow.');
}

async function main() {
  const id = process.env.ODA_RECHECK_RUN;
  if (!/^\d+$/.test(id ?? '')) throw Error('A numeric baseline run is required.');
  const run = JSON.parse(
    execFileSync('gh', ['api', `repos/${process.env.GITHUB_REPOSITORY}/actions/runs/${id}`], {
      encoding: 'utf8',
    }),
  );
  if (run.status !== 'completed' || run.conclusion !== 'failure')
    throw Error('Baseline run is not a completed failure.');
  const folder = resolve('.local-server/release-baseline', id);
  await mkdir(folder, { recursive: true });
  execFileSync('gh', ['run', 'download', id, '--name', 'oda-v2-release-check-results', '--dir', folder], {
    stdio: 'inherit',
  });
  const entries = await readdir(folder, { recursive: true });
  const reports = entries.filter((name) => name.endsWith('report.json'));
  if (reports.length !== 1) throw Error('Expected one full baseline report.');
  const report = JSON.parse(await readFile(resolve(folder, reports[0]), 'utf8'));
  const browserLog = await readFile(
    resolve(folder, reports[0].replace(/report\.json$/, 'browser.log')),
    'utf8',
  );
  if (git('merge-base', report.head, 'HEAD') !== report.head) throw Error('Baseline is not an ancestor.');
  const changed = git('diff', '--name-only', report.head, 'HEAD').split('\n').filter(Boolean);
  validateRecheck(report, run, changed, browserLog);
  console.log(
    `Reusing passed full-matrix results from ${id}; repeating viewer, recognition and homepage dependencies.`,
  );
  const result = await runChecks({
    requested: 'release',
    effective: 'release',
    changed,
    reasons: [],
    docsOnly: false,
    browserFiles,
    readingFamilies: [],
  });
  if (result.artifact.sha256 !== report.artifact.sha256)
    throw Error('Rebuilt production artifact differs from the baseline; full verification is required.');
  await writeFile(
    '.local-server/checks/recheck-provenance.json',
    JSON.stringify(
      {
        baselineRun: id,
        baselineHead: report.head,
        head: git('rev-parse', 'HEAD'),
        artifactSha256: result.artifact.sha256,
        browserFiles,
        success: true,
      },
      null,
      2,
    ),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
