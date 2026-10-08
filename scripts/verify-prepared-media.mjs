import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { loadSiteModule } from './site-data.mjs';

export async function verifyPreparedMedia(data) {
  const { preparedMedia } = await loadSiteModule('src/data/prepared-media.ts');
  const errors = [];
  const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
  const { preparedVideos } = await loadSiteModule('src/data/prepared-videos.ts');
  for (const video of data.media.filter((row) => row.kind === 'video' && row.archiveSource?.inputPath)) {
    const proof = preparedVideos[video.id];
    if (!proof || proof.sourceSha256 !== video.archiveSource.sha256 || proof.files.length !== 3)
      errors.push(`video ${video.id}: derivatives missing or stale`);
    for (const file of proof?.files ?? []) {
      if (![video.src, video.previewSrc, video.poster].includes(file.src))
        errors.push(`video ${video.id}: unexpected output`);
      const bytes = await readFile(resolve('public', file.src.slice(1))).catch(() => undefined);
      if (!bytes || bytes.length !== file.bytes || hash(bytes) !== file.sha256)
        errors.push(`video ${video.id}: derivative changed ${file.src}`);
    }
  }
  const documents = [...data.workDocuments, ...data.referenceDocuments];
  for (const document of documents) {
    if (document.rights !== 'cleared') continue;
    const proof = preparedMedia[document.href];
    if (
      !proof ||
      proof.sourceSha256 !== document.sha256 ||
      (proof.sourcePages ?? proof.images.length) !== document.pages ||
      proof.images.length !== (document.selectedPages?.length ?? document.pages)
    )
      errors.push(`document ${document.id}: page derivatives missing or stale; run media:prepare`);
    if (document.pageImages?.length !== (document.selectedPages?.length ?? document.pages))
      errors.push(`document ${document.id}: incomplete page gallery`);
    const expected = proof?.images.map(({ src, width, height, bytes, pageNumber }) => ({
      src,
      width,
      height,
      bytes,
      ...(pageNumber ? { pageNumber } : {}),
    }));
    if (JSON.stringify(document.pageImages) !== JSON.stringify(expected))
      errors.push(`document ${document.id}: gallery disagrees with preparation record`);
  }
  const sourcePaths = new Set([
    ...documents.map((row) => row.href),
    ...data.recognitions.flatMap((row) => (row.previewSrc ? [row.previewSrc] : [])),
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
