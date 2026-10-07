import { loadSiteModule } from './site-data.mjs';
import { loadEnv } from 'vite';

const { catalogue } = await loadSiteModule('src/data/catalogue.ts');
const failures = [...catalogue.errors];
const { analyticsConfigFrom, analyticsConfigIssues } = await loadSiteModule('src/lib/analytics-contract.ts');
failures.push(
  ...analyticsConfigIssues(
    analyticsConfigFrom({ ...loadEnv('production', process.cwd(), 'PUBLIC_'), ...process.env }),
  ),
);
if (!catalogue.works.length)
  failures.push('Public packet has no approved works; editorial selection is not ready');
// Owner decision 2026-10-07: obsolete V1 addresses show a notice and return home.
// Old URL preservation is not a release requirement. Actual selected media rights
// remain enforced by createPublicationScope and the physical build allowlist.
if (failures.length) {
  console.error('Release blocked:\n' + failures.map((x) => `- ${x}`).join('\n'));
  process.exitCode = 1;
} else
  console.log('Selected content and media rights gates cleared. Migration completion is tracked separately.');
