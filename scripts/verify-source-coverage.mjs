export function verifySourceCoverage(inventory, scope, pages) {
  const report = inventory.currentSourceCoverage;
  if (!report) return;
  const collections = {
    Work: 'works',
    Programme: 'programmes',
    CaseEvent: 'cases',
    EventSeries: 'eventSeries',
    StudioPage: 'studioPages',
    Method: 'methods',
    CooperationPage: 'cooperationPages',
    Person: 'people',
    Organization: 'organizations',
    Media: 'media',
    Recognition: 'recognitions',
    WorkDocument: 'workDocuments',
    ReferenceDocument: 'referenceDocuments',
  };
  const errors = [];
  const ids = new Set();
  const counts = { applied: 0, merged: 0, excluded: 0 };
  if (inventory.entries.length !== 238) errors.push('Expected all 238 original source IDs');
  for (const entry of inventory.entries) {
    const use = entry.currentCanonicalApplication;
    if (ids.has(entry.id)) errors.push(`Duplicate source ID ${entry.id}`);
    ids.add(entry.id);
    if (!use || !Object.hasOwn(counts, use.state) || !use.reason?.trim()) {
      errors.push(`Unresolved source disposition ${entry.id}`);
      continue;
    }
    counts[use.state]++;
    if (use.scopeVersion !== report.scopeVersion || use.sourceSha256 !== entry.sourceHashes.mapping)
      errors.push(`Source version/fingerprint mismatch ${entry.id}`);
    if (use.state !== 'excluded' && !use.targets?.length) errors.push(`No actual target for ${entry.id}`);
    for (const target of use.targets ?? []) {
      const [kind, id] = target.split(':');
      const exists =
        kind === 'SiteSection'
          ? pages.some((page) => page.kind === id)
          : kind === 'EducationOverview'
            ? scope.educationOverview?.id === id
            : (scope[collections[kind]] ?? []).some((row) => row.id === id);
      if (!exists) errors.push(`Target outside the public corpus: ${entry.id} -> ${target}`);
    }
  }
  for (const [state, count] of Object.entries(counts))
    if (report.counts[state] !== count) errors.push(`Coverage count mismatch ${state}`);
  if (errors.length) throw Error(errors.join('\n'));
  return { sourceIds: ids.size, ...counts };
}
