import eventSummary from '../data/golem-event-summary.json';
import legacyRecognitionSummary from '../data/legacy-recognition-summary.json';
import { cases, recognitions, works, realizedWorks, researchWorks, programmes } from '../data/catalogue';
import type { CaseEvent, RecognitionKind, WorkStage } from '../data/site';

const countBy = <T extends string>(items: T[]) =>
  items.reduce<Partial<Record<T, number>>>((counts, item) => {
    counts[item] = (counts[item] ?? 0) + 1;
    return counts;
  }, {});

export const siteStats = {
  education: {
    total: programmes.length,
    lectures: programmes.filter((row) => row.programmeType === 'lecture').length,
    workshops: programmes.filter((row) => row.programmeType === 'workshop').length,
    laboratories: programmes.filter((row) => row.programmeType === 'laboratory').length,
  },
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
    byStatus: countBy<CaseEvent['participationStatus']>(cases.map((item) => item.participationStatus)),
    scope: 'curated-site-records',
  },
  recognitions: {
    total: recognitions.length,
    featured: recognitions.filter((item) => item.featuredOnHome).length,
    withPreview: recognitions.filter((item) => item.previewSrc).length,
    byKind: countBy<RecognitionKind>(recognitions.map((item) => item.kind)),
    scope: 'curated-source-backed-records',
  },
  golemEvents: eventSummary,
  legacyRecognition: legacyRecognitionSummary,
};
