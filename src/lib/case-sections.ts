/** Sparse event records have a real page without empty chapters or invented media. */
export function caseSectionIds(item: {
  story: readonly unknown[];
  media: readonly string[];
  organizationRoles: readonly unknown[];
  participants: readonly unknown[];
  limitations: readonly unknown[];
  evidence: readonly string[];
  sourceUrl?: string;
  work?: string;
  programme?: string;
  relatedWorks?: readonly string[];
  relatedProgrammes?: readonly string[];
}) {
  return [
    'case-contribution',
    ...(item.story.length || item.media.length > 1 ? ['case-story'] : []),
    ...(item.organizationRoles.length ||
    item.participants.length ||
    item.limitations.length ||
    item.relatedWorks?.some((id) => id !== item.work) ||
    item.relatedProgrammes?.some((id) => id !== item.programme)
      ? ['case-context']
      : []),
    ...(item.evidence.length || item.sourceUrl ? ['case-evidence'] : []),
  ];
}
