import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { loadSiteModule } from './site-data.mjs';

export async function verifyPreparedMedia(data) {
  const { preparedMedia } = await loadSiteModule('src/data/prepared-media.ts');
  const errors = [];
  const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
  const documents = [...data.workDocuments, ...data.referenceDocuments];
  for (const document of documents) {
    if (document.rights !== 'cleared') continue;
    const proof = preparedMedia[document.href];
    if (!proof || proof.sourceSha256 !== document.sha256 || proof.images.length !== document.pages)
      errors.push(`document ${document.id}: page derivatives missing or stale; run media:prepare`);
    if (document.pageImages?.length !== document.pages)
      errors.push(`document ${document.id}: incomplete page gallery`);
    const expected = proof?.images.map(({ src, width, height, bytes }) => ({ src, width, height, bytes }));
    if (JSON.stringify(document.pageImages) !== JSON.stringify(expected))
      errors.push(`document ${document.id}: gallery disagrees with preparation record`);
  }
  const sourcePaths = new Set([
    ...documents.map((row) => row.href),
    ...data.media
      .filter((row) => row.kind === 'image')
      .flatMap((row) => [row.src, row.mobileSrc].filter(Boolean)),
  ]);
  for (const row of data.media.filter((row) => row.kind === 'image' && row.rights === 'cleared'))
    for (const path of [row.src, row.mobileSrc].filter(Boolean))
      if (!preparedMedia[path]) errors.push(`media ${row.id}: missing prepared image ${path}`);
  for (const [path, proof] of Object.entries(preparedMedia)) {
    if (!sourcePaths.has(path)) errors.push(`prepared media ${path}: no typed owner`);
    const original = await readFile(resolve('public', path.slice(1))).catch(() => undefined);
    if (!original || original.length !== proof.sourceBytes || hash(original) !== proof.sourceSha256)
      errors.push(`prepared media ${path}: original changed; run media:prepare`);
    for (const image of proof.images) {
      if (
        !/^\/images\/prepared\/[a-f0-9]{24}\/(?:page-\d{3}|image)\.webp$/.test(image.src) ||
        !Number.isInteger(image.width) ||
        !Number.isInteger(image.height) ||
        image.width < 1 ||
        image.height < 1 ||
        Math.max(image.width, image.height) > 2600
      ) {
        errors.push(`prepared media ${path}: invalid derivative`);
        continue;
      }
      const bytes = await readFile(resolve('public', image.src.slice(1))).catch(() => undefined);
      if (
        !bytes ||
        bytes.length !== image.bytes ||
        hash(bytes) !== image.sha256 ||
        bytes.subarray(0, 4).toString() !== 'RIFF' ||
        bytes.subarray(8, 12).toString() !== 'WEBP'
      )
        errors.push(`prepared media ${path}: derivative missing or changed ${image.src}`);
    }
  }
  return errors;
}
