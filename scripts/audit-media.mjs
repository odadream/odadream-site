import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSiteModule } from './site-data.mjs';

export function resourceRole(path) {
  if (['/CNAME', '/robots.txt', '/sitemap.xml'].includes(path)) return 'site-service';
  if (path.startsWith('/images/nodes/') && path.endsWith('.svg')) return 'lotus-generated-ui';
  const extension = extname(path).toLowerCase();
  if (extension === '.pdf') return 'document';
  if (['.mp4', '.m4v', '.webm'].includes(extension)) return 'video';
  if (extension === '.svg') return 'vector-image';
  if (['.webp', '.png', '.jpg', '.jpeg', '.gif'].includes(extension)) return 'image';
  return 'other-resource';
}

export async function collectLegacyResources(oldRoot, newRoot, publicPaths = new Set()) {
  const records = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const full = resolve(directory, entry.name);
      if (entry.isDirectory()) await visit(full);
      else if (entry.isFile()) {
        const path = '/' + relative(oldRoot, full).split(sep).join('/');
        const bytes = await readFile(full);
        const sha256 = createHash('sha256').update(bytes).digest('hex');
        const editorialBytes = await readFile(resolve(newRoot, path.slice(1))).catch((error) => {
          if (error.code === 'ENOENT') return undefined;
          throw error;
        });
        const role = resourceRole(path),
          retained = !!editorialBytes;
        records.push({
          path,
          bytes: bytes.length,
          sha256,
          role,
          retained,
          identicalAtSamePath:
            retained && createHash('sha256').update(editorialBytes).digest('hex') === sha256,
          publicPacketIncludesPath: publicPaths.has(path),
          publicPathPresent: retained && publicPaths.has(path),
          requiresCompatibilityDecision: !['lotus-generated-ui', 'site-service'].includes(role),
          scopeReason:
            role === 'lotus-generated-ui'
              ? 'Generated Lotus UI node; recorded for inbound review, excluded from the V2 content packet by AGENTS.md.'
              : role === 'site-service'
                ? 'Site service metadata; handled by V2 routing/build rather than the historical-media publication gate.'
                : 'Historical content resource; a staged copy alone does not preserve its public URL.',
          decision: 'not-reviewed',
        });
      }
    }
  }
  await visit(resolve(oldRoot));
  return records.sort((a, b) => a.path.localeCompare(b.path, 'en'));
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const oldRoot = resolve(process.argv[2] || '../odadream-site-archive-2026-09-21/public');
  const { catalogue } = await loadSiteModule('src/data/catalogue.ts');
  const rows = await collectLegacyResources(oldRoot, resolve('public'), catalogue.assetPaths);
  await writeFile('docs/media-audit.json', JSON.stringify(rows, null, 2) + '\n');
  const inventoryPath = 'docs/migration/INVENTORY-2026-10-05.json';
  const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
  inventory.currentResourceAudit = {
    asOf: '2026-10-06',
    source: relative(process.cwd(), oldRoot).split(sep).join('/'),
    total: rows.length,
    byRole: rows.reduce((counts, row) => ({ ...counts, [row.role]: (counts[row.role] ?? 0) + 1 }), {}),
    editorialSamePath: rows.filter((row) => row.retained).length,
    publicSamePath: rows.filter((row) => row.publicPathPresent).length,
    requiresCompatibilityDecision: rows.filter((row) => row.requiresCompatibilityDecision).length,
    detail: 'docs/media-audit.json',
    note: 'Full resource coverage. Baseline assets and the initial 179-URL audit are not publication decisions. Generated UI and service metadata remain separately accounted for.',
  };
  await writeFile(inventoryPath, JSON.stringify(inventory, null, 2) + '\n');
  console.log(
    `${rows.length} historical resources; ${inventory.currentResourceAudit.requiresCompatibilityDecision} content URLs need preservation/retirement review. No resources copied and no retirement approvals invented.`,
  );
}
