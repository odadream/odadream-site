import eventSummary from '../data/golem-event-summary.json';
import legacyRecognitionSummary from '../data/legacy-recognition-summary.json';
import { cases, recognitions, works, type CaseEvent, type RecognitionKind, type WorkStatus } from '../data/site';

const countBy = <T extends string>(items: T[]) =>
  items.reduce<Partial<Record<T, number>>>((counts, item) => {
    counts[item] = (counts[item] ?? 0) + 1;
    return counts;
  }, {});

export const siteStats = {
  works: {
    total: works.length,
    realized: works.filter((work) => work.realized).length,
    research: works.filter((work) => work.rnd).length,
    bookable: works.filter((work) => work.bookable).length,
    byStatus: countBy<WorkStatus>(works.map((work) => work.status)),
    scope: 'curated-site-records',
  },
  cases: {
    total: cases.length,
    byType: countBy<CaseEvent['type']>(cases.map((item) => item.type)),
    scope: 'curated-site-records',
  },
  recognitions: {
    total: recognitions.length,
    featured: recognitions.filter((item) => item.featuredOnHome).length,
    withPreview: recognitions.filter((item) => item.previewSrc).length,
    byKind: countBy<RecognitionKind>(recognitions.map((item) => item.kind)),
    scope: 'transcribed-legacy-records',
  },
  golemEvents: eventSummary,
  legacyRecognition: legacyRecognitionSummary,
};
