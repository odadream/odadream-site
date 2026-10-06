import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, dirname, basename } from 'node:path';
import { collectLegacyResources, resourceRole, annotateResourceReferences } from '../scripts/audit-media.mjs';
import { unresolvedLegacyMedia, preservedLegacyPaths } from '../scripts/legacy-media-check.mjs';

test('resource associations distinguish selected candidates without mistaking prefixes or query strings for another resource', () => {
  const rows = [
    '/images/art.webp',
    '/images/art.webp-thumb.webp',
    '/documents/old.pdf',
    '/video/unreferenced.m4v',
  ].map((path) => ({
    path,
    requiresCompatibilityDecision: true,
    identicalAtSamePath: path === '/documents/old.pdf',
  }));
  const source = [
    {
      id: 'work',
      file: 'work.md',
      access: 'public',
      raw: 'image: /images/art.webp-thumb.webp\n[PDF](https://odadream.art/documents/old.pdf?download=1)',
    },
  ];
  const annotated = annotateResourceReferences(
    rows,
    source,
    new Set(['work.md']),
    new Set(['/documents/old.pdf']),
  );
  assert.equal(annotated[0].sourceReferences.length, 0);
  assert.equal(annotated[1].compatibilityGroup, 'selected-source-candidate');
  assert.equal(annotated[2].compatibilityGroup, 'prepared-selected-resource');
  assert.equal(annotated[3].compatibilityGroup, 'no-direct-markdown-reference');
  assert.equal(unresolvedLegacyMedia(annotated, {}, new Set()).length, 4);
});

test('audit covers PDF and M4V; staging never substitutes for public preservation', async () => {
  const root = await mkdtemp(join(tmpdir(), 'oda-media-audit-'));
  try {
    const old = join(root, 'old'),
      current = join(root, 'current');
    for (const directory of [old, current]) await mkdir(join(directory, 'documents'), { recursive: true });
    await mkdir(join(old, 'images/nodes'), { recursive: true });
    await mkdir(join(old, 'images/content'), { recursive: true });
    await writeFile(join(old, 'documents/deck.pdf'), 'document');
    await writeFile(join(current, 'documents/deck.pdf'), 'document');
    await writeFile(join(old, 'film.m4v'), 'video');
    await writeFile(join(old, 'images/nodes/hub.svg'), 'generated');
    await writeFile(join(old, 'images/content/art.svg'), 'artwork');
    const rows = await collectLegacyResources(old, current);
    assert.equal(rows.length, 4);
    assert.equal(rows.find((row) => row.path === '/documents/deck.pdf').identicalAtSamePath, true);
    assert.equal(rows.find((row) => row.path === '/documents/deck.pdf').publicPathPresent, false);
    assert.equal(rows.find((row) => row.path === '/film.m4v').role, 'video');
    assert.equal(unresolvedLegacyMedia(rows, {}, new Set()).length, 3);
    assert.equal(
      rows.find((row) => row.path === '/images/content/art.svg').requiresCompatibilityDecision,
      true,
    );
    assert.equal(resourceRole('/images/nodes/hub.svg'), 'lotus-generated-ui');
    const published = await collectLegacyResources(old, current, new Set(['/documents/deck.pdf']));
    assert.equal(published.find((row) => row.path === '/documents/deck.pdf').publicPathPresent, true);
    assert.equal(unresolvedLegacyMedia(published, {}, new Set(['/documents/deck.pdf'])).length, 2);
    const allowed = new Set(['/documents/deck.pdf']);
    assert.ok((await preservedLegacyPaths(rows, current, allowed)).has('/documents/deck.pdf'));
    // A replaced or damaged PDF at the same path is not preservation of the old document.
    await writeFile(join(current, 'documents/deck.pdf'), 'different document');
    assert.equal((await preservedLegacyPaths(rows, current, allowed)).size, 0);
    // A planned preservation record cannot override absence from the public packet.
    assert.equal(
      unresolvedLegacyMedia(
        rows,
        {
          '/documents/deck.pdf': { action: 'preserve', mediaId: 'fixture' },
        },
        new Set(),
      ).length,
      3,
    );
  } finally {
    const absolute = resolve(root);
    assert.equal(dirname(absolute), resolve(tmpdir()));
    assert.ok(basename(absolute).startsWith('oda-media-audit-'));
    await rm(absolute, { recursive: true, force: true });
  }
});
