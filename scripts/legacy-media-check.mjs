export function unresolvedLegacyMedia(audit, decisions, publicPaths) {
  return audit.filter((row) => {
    // Generated Lotus UI and service metadata have separate routing/build treatment.
    if (row.requiresCompatibilityDecision === false) return false;
    // A file present in editorial public/ is not preserved if excluded from the public packet.
    if (publicPaths.has(row.path)) return false;
    const decision = decisions[row.path];
    return (
      !decision ||
      !['retire', 'redirect'].includes(decision.action) ||
      !decision.approvedBy ||
      !decision.approvedOn ||
      !decision.reason ||
      (decision.action === 'redirect' && (!decision.target || decision.httpLayerVerified !== true))
    );
  });
}
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, sep } from 'node:path';

/** An allowlist and a file's existence alone do not prove preservation of the original resource. */
export async function preservedLegacyPaths(audit, publicRoot, allowedPaths) {
  const root = resolve(publicRoot);
  const preserved = new Set();
  for (const row of audit) {
    if (!allowedPaths.has(row.path)) continue;
    const path = resolve(root, row.path.slice(1));
    if (!path.startsWith(root + sep)) throw new Error(`Legacy resource outside public root: ${row.path}`);
    const bytes = await readFile(path).catch((error) => {
      if (error.code === 'ENOENT') return undefined;
      throw error;
    });
    if (bytes && createHash('sha256').update(bytes).digest('hex') === row.sha256) preserved.add(row.path);
  }
  return preserved;
}
