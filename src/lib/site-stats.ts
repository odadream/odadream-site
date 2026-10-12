import { cases, recognitions, works, programmes } from '../data/catalogue';
import type { CaseEvent, Recognition, Work } from '../data/site';
import type { Programme } from '../data/programmes';
import { recognitionKinds } from './recognition-presentation';
import { eventGenres } from './case-presentation';
export const workStages = ['realized', 'prototype', 'concept', 'in-production'] as const;
const countBy = <T extends string>(items: T[], keys: readonly T[]) =>
  items.reduce<Record<T, number>>(
    (counts, item) => {
      counts[item] = (counts[item] ?? 0) + 1;
      return counts;
    },
    Object.fromEntries(keys.map((key) => [key, 0])) as Record<T, number>,
  );
/** Counting unit: one documented occasion/edition (or one documented recurring context).
 * Several contributions share event.id. Unknown dates never become invented calendar dates. */
export const heldEvents = <T extends Pick<CaseEvent, 'id' | 'participationStatus' | 'event'>>(
  items: readonly T[],
): T[] => [
  ...new Map(
    items
      .filter((item) => item.participationStatus === 'held')
      .map((item) => [item.event?.id ?? item.id, item]),
  ).values(),
];
export const selectHomepageEvents = <
  T extends Pick<
    CaseEvent,
    'id' | 'participationStatus' | 'event' | 'date' | 'dateMeaning' | 'featuredOnHome'
  >,
>(
  items: readonly T[],
): T[] => {
  const events = heldEvents(items)
    .filter((item) => item.dateMeaning !== 'reported-by' && /^\d{4}(?:-|$)/.test(item.date))
    .sort(
      (a, b) =>
        (a.date.length === 4
          ? a.date + '-99-99'
          : a.date.length === 7
            ? a.date + '-99'
            : a.date
        ).localeCompare(
          b.date.length === 4 ? b.date + '-99-99' : b.date.length === 7 ? b.date + '-99' : b.date,
        ) || a.id.localeCompare(b.id),
    );
  const years = new Set<string>();
  return events.filter((item) => {
    const year = item.date.slice(0, 4);
    const first = !years.has(year);
    years.add(year);
    return first || item.featuredOnHome;
  });
};
export const calculateSiteStats = (records: {
  works: readonly Pick<Work, 'stage' | 'bookable'>[];
  cases: readonly Pick<CaseEvent, 'id' | 'event' | 'participationStatus' | 'type' | 'date' | 'dateMeaning'>[];
  recognitions: readonly Pick<Recognition, 'kind' | 'featuredOnHome' | 'previewSrc'>[];
  programmes: readonly Pick<Programme, 'programmeType'>[];
}) => {
  const events = heldEvents(records.cases);
  const byStage = countBy(
    records.works.map((row) => row.stage),
    workStages,
  );
  return {
    education: {
      total: records.programmes.length,
      lectures: records.programmes.filter((row) => row.programmeType === 'lecture').length,
      workshops: records.programmes.filter((row) => row.programmeType === 'workshop').length,
      laboratories: records.programmes.filter((row) => row.programmeType === 'laboratory').length,
    },
    works: {
      total: records.works.length,
      realized: byStage.realized,
      research: records.works.length - byStage.realized,
      bookable: records.works.filter((row) => row.bookable).length,
      byStage,
    },
    cases: {
      total: events.length,
      contributions: records.cases.filter((row) => row.participationStatus === 'held').length,
      byGenre: countBy(
        events.map((row) => row.event?.genre ?? 'unknown'),
        eventGenres,
      ),
      byType: countBy(
        records.cases.filter((row) => row.participationStatus === 'held').map((row) => row.type),
        [],
      ),
      byStatus: countBy(
        records.cases.map((row) => row.participationStatus),
        [],
      ),
      unknownYear: events.filter((row) => row.dateMeaning === 'reported-by' || !/^\d{4}/.test(row.date))
        .length,
    },
    recognitions: {
      total: records.recognitions.length,
      featured: records.recognitions.filter((row) => row.featuredOnHome).length,
      withPreview: records.recognitions.filter((row) => row.previewSrc).length,
      byKind: countBy(
        records.recognitions.map((row) => row.kind),
        recognitionKinds,
      ),
    },
  };
};
export const siteStats = calculateSiteStats({ works, cases, recognitions, programmes });
