import eventSummary from '../data/golem-event-summary.json';
import legacyRecognitionSummary from '../data/legacy-recognition-summary.json';
import {
  cases,
  recognitions,
  works,
  realizedWorks,
  researchWorks,
  type CaseEvent,
  type RecognitionKind,
  type WorkStage,
} from '../data/site';

const countBy = <T extends string>(items: T[]) =>
  items.reduce<Partial<Record<T, number>>>((counts, item) => {
    counts[item] = (counts[item] ?? 0) + 1;
    return counts;
  }, {});

export const siteStats = {
  works: {
    total: works.length,
    realized: realizedWorks.length,
    research: researchWorks.length,
    bookable: works.filter((work) => work.bookable).length,
    byStage: countBy<WorkStage>(works.map((work) => work.stage)),
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
