export function unresolvedLegacyMedia(audit, decisions, publicPaths) {
  return audit.filter((row) => {
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
