import * as source from './site';
import { publicationPlan } from './publication-plan';
import { buildHeroLibrary } from '../lib/hero-library';
import { createPublicationScope, isRealizedWork, buildPublicRecordIds } from '../lib/publication-scope';

export const preview = import.meta.env?.DEV === true;
export const catalogue = createPublicationScope(source, publicationPlan, preview);
export const {
  methods,
  cooperationPages,
  studioPages,
  works,
  workDocuments,
  referenceDocuments,
  cases,
  eventSeries,
  configurations,
  programmes,
  educationOverview,
  people,
  organizations,
  media,
  evidence,
  recognitions,
  minddbSnapshot,
} = catalogue;
const publicProjection = preview ? createPublicationScope(source, publicationPlan, false) : catalogue;
export const publicHeroVisuals = buildHeroLibrary(publicProjection);
export const realizedWorks = works.filter(isRealizedWork);
export const researchWorks = works.filter((work) => !isRealizedWork(work));
export const selectedWorks = realizedWorks.filter((work) => work.featuredOnHome);
export const mediaById = (id: string) => media.find((row) => row.id === id);
export const workById = (id: string) => works.find((row) => row.id === id);

// Only local editorial markers use this set; no internal records are rendered in public.
export const publicRecordIds = preview ? buildPublicRecordIds(publicProjection) : undefined;
