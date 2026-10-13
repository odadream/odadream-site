import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

test('Pages release activates the isolated validated V2 providers and publishes only verified output', () => {
  const workflow = parse(readFileSync('.github/workflows/deploy.yml', 'utf8'));
  const validation = JSON.parse(
    readFileSync('docs/migration/INVENTORY-2026-10-05.json', 'utf8'),
  ).currentAnalyticsValidation;
  const job = workflow.jobs.deploy;
  assert.deepEqual(workflow.on.push.branches, ['main']);
  assert.equal(job.env.PUBLIC_ANALYTICS_ENABLED, 'true');
  assert.equal(job.env.PUBLIC_ANALYTICS_DEBUG, 'false');
  assert.equal(job.env.PUBLIC_ANALYTICS_AUTO_EVENTS_DISABLED, 'true');
  assert.equal(job.env.PUBLIC_GA_MEASUREMENT_ID, validation.google.measurementId);
  assert.equal(job.env.PUBLIC_YANDEX_METRICA_ID, String(validation.metrica.counterId));
  assert.equal(
    Object.keys(job.env).some((key) => key.startsWith('VITE_')),
    false,
  );
  const gate = job.steps.findIndex((step) => step.run === 'npm run verify:release');
  const upload = job.steps.findIndex((step) => step.uses?.startsWith('actions/upload-pages-artifact@'));
  const deploy = job.steps.findIndex((step) => step.uses?.startsWith('actions/deploy-pages@'));
  assert.ok(gate >= 0 && upload > gate && deploy > upload);
  assert.equal(job.steps[upload].with.path, 'dist/');
  assert.equal(workflow.concurrency.group, 'github-pages');
});
