import { readFile } from 'node:fs/promises';
import { unresolvedLegacyMedia, preservedLegacyPaths } from './legacy-media-check.mjs';
import { loadSiteModule } from './site-data.mjs';
import { resolve } from 'node:path';

const { catalogue } = await loadSiteModule('src/data/catalogue.ts');
const failures = [...catalogue.errors];
if (!catalogue.works.length)
  failures.push('Public packet has no approved works; editorial selection is not ready');
const audit = JSON.parse(await readFile('docs/media-audit.json', 'utf8'));
const decisions = JSON.parse(await readFile('docs/media-decisions.json', 'utf8'));
const publicPaths = await preservedLegacyPaths(audit, resolve('public'), catalogue.assetPaths);
const unresolved = unresolvedLegacyMedia(audit, decisions, publicPaths);
if (unresolved.length)
  failures.push(
    `${unresolved.length} old public media URLs still require an approved preserve/retire decision`,
  );
if (failures.length) {
  console.error('Release blocked:\n' + failures.map((x) => `- ${x}`).join('\n'));
  process.exitCode = 1;
} else console.log('Editorial, media rights and legacy media gates cleared.');
