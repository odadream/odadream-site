import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, extname, sep, dirname } from 'node:path';
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

/** Associations are evidence for selection, never permission or an inbound-traffic estimate. */
export function annotateResourceReferences(rows, sources, selectedFiles, plannedPaths) {
  return rows.map((row) => {
    const paths = [...new Set([row.path, encodeURI(row.path)])];
    const patterns = paths.map(
      (path) => new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=[\\s"\'<>|)\\]?#]|$)'),
    );
    const references = sources
      .filter((source) => patterns.some((pattern) => pattern.test(source.raw)))
      .map(({ id, file, access }) => ({ id, file, access, selectedSource: selectedFiles.has(file) }));
    return {
      ...row,
      sourceReferences: references,
      compatibilityGroup: !row.requiresCompatibilityDecision
        ? 'separate-ui-or-service'
        : plannedPaths.has(row.path) && row.identicalAtSamePath
          ? 'prepared-selected-resource'
          : references.some((ref) => ref.selectedSource)
            ? 'selected-source-candidate'
            : references.length
              ? 'other-archive-source'
              : 'no-direct-markdown-reference',
    };
  });
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const oldRoot = resolve(process.argv[2] || '../odadream-site-archive-2026-09-21/public');
  const { catalogue } = await loadSiteModule('src/data/catalogue.ts');
  const inventoryPath = 'docs/migration/INVENTORY-2026-10-05.json';
  const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
  const legacy = JSON.parse(await readFile('src/data/legacy-map.json', 'utf8'));
  const sourceRoot = resolve(dirname(oldRoot), 'src/content');
  const sources = await Promise.all(
    legacy.map(async (row) => ({
      id: row.id,
      file: row.source,
      access: row.access,
      raw: await readFile(resolve(sourceRoot, row.source), 'utf8'),
    })),
  );
  const site = await loadSiteModule();
  const prepared = new Set(
    [
      ...site.media.flatMap((row) => [row.src, ...(row.legacyPaths ?? [])]),
      ...site.workDocuments.map((row) => row.href),
      ...(site.legacyWorkResources ?? []).map((row) => row.path),
      ...site.recognitions.flatMap((row) => [
        row.previewSrc,
        row.documentState === 'available' ? row.documentSource : undefined,
      ]),
    ].filter(Boolean),
  );
  const rows = annotateResourceReferences(
    await collectLegacyResources(oldRoot, resolve('public'), catalogue.assetPaths),
    sources,
    new Set(Object.keys(inventory.v2SourceSnapshots)),
    prepared,
  );
  await writeFile('docs/media-audit.json', JSON.stringify(rows, null, 2) + '\n');
  inventory.currentResourceAudit = {
    asOf: '2026-10-06',
    source: relative(process.cwd(), oldRoot).split(sep).join('/'),
    total: rows.length,
    byRole: rows.reduce((counts, row) => ({ ...counts, [row.role]: (counts[row.role] ?? 0) + 1 }), {}),
    editorialSamePath: rows.filter((row) => row.retained).length,
    publicSamePath: rows.filter((row) => row.publicPathPresent).length,
    requiresCompatibilityDecision: rows.filter((row) => row.requiresCompatibilityDecision).length,
    byCompatibilityGroup: rows.reduce(
      (counts, row) => ({ ...counts, [row.compatibilityGroup]: (counts[row.compatibilityGroup] ?? 0) + 1 }),
      {},
    ),
    detail: 'docs/media-audit.json',
    note: 'Full coverage with exact direct Markdown associations. Prepared selection, further candidates, other archive references and absent direct references differ. Absence of a reference does not prove absence of inbound traffic or authorize retirement. Rights and public preservation remain separate.',
  };
  const clearedPaths = new Set(
    [
      ...site.media
        .filter((row) => row.rights === 'cleared')
        .flatMap((row) => [row.src, row.mobileSrc, row.poster, row.previewSrc, ...(row.legacyPaths ?? [])]),
      ...site.workDocuments.filter((row) => row.rights === 'cleared').map((row) => row.href),
      ...(site.legacyWorkResources ?? []).filter((row) => row.rights === 'cleared').map((row) => row.path),
    ].filter(Boolean),
  );
  const groups = [
    {
      id: 'prepared-cleared-content',
      proposal:
        'Preserve exact originals with the corresponding published dependency; permission does not approve editorial publication.',
      paths: [],
    },
    {
      id: 'prepared-rights-review',
      proposal:
        'Keep staged original under rights review; resolve document permission before allowing its public URL.',
      paths: [],
    },
    {
      id: 'selected-rights-review',
      proposal:
        'Selected sources include third-party letters or event photography; inspect attribution and permission separately, without automatic publication.',
      paths: [],
    },
    {
      id: 'source-placeholder',
      proposal:
        'Exclude the ASSET placeholder from method content. Retain source archive; the old URL still needs an explicit release disposition.',
      paths: [],
    },
    {
      id: 'deferred-archive',
      proposal:
        'Retain read-only sources outside the selected packet. Preserve, redirect or retire each old URL only after its inbound need and permission are resolved.',
      paths: [],
    },
    {
      id: 'unreferenced-review',
      proposal:
        'No direct Markdown reference found. Check PDF/dossier/external uses before choosing a resource disposition; this is not permission to retire.',
      paths: [],
    },
  ];
  for (const row of rows.filter((row) => row.requiresCompatibilityDecision)) {
    const group =
      row.compatibilityGroup === 'prepared-selected-resource'
        ? clearedPaths.has(row.path)
          ? 0
          : 1
        : row.compatibilityGroup === 'selected-source-candidate'
          ? row.path === '/images/content/neuromandala-cover.webp'
            ? 3
            : 2
          : row.compatibilityGroup === 'other-archive-source'
            ? 4
            : 5;
    groups[group].paths.push(row.path);
  }
  inventory.currentResourceDispositionReview = {
    asOf: '2026-10-06',
    status: 'proposals-only',
    groups,
    note: 'Review queue for every content URL; not retirement/redirect approval. The actual public packet and verified files determine preservation. Source placeholder was visually inspected on 2026-10-06.',
  };
  await writeFile(inventoryPath, JSON.stringify(inventory, null, 2) + '\n');
  console.log(
    `${rows.length} historical resources; ${inventory.currentResourceAudit.requiresCompatibilityDecision} content URLs need preservation/retirement review. No resources copied and no retirement approvals invented.`,
  );
}
