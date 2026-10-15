import { resolve } from 'node:path';

// Recognize private Windows originals even when CI runs on Linux without those drives.
export function externalMediaInput(row) {
  const path = row.archiveSource?.inputPath;
  return path && /^[A-Za-z]:[\\/]|^\\\\/.test(path) ? path : undefined;
}

export function mediaInputPath(row, href = row.src) {
  return externalMediaInput(row) ? resolve(externalMediaInput(row)) : resolve('public', href.slice(1));
}
