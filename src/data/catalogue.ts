import * as source from './site';
import { publicationPlan } from './publication-plan';
import { createPublicationScope, isRealizedWork } from '../lib/publication-scope';

export const preview = import.meta.env?.DEV === true;
export const catalogue = createPublicationScope(source, publicationPlan, preview);
export const {
  methods,
  cooperationPages,
  studioPages,
  works,
  cases,
  formats,
  people,
  organizations,
  media,
  evidence,
  recognitions,
  minddbSnapshot,
} = catalogue;
export const publicHeroVisuals = catalogue.heroVisuals;
export const realizedWorks = works.filter(isRealizedWork);
export const researchWorks = works.filter((work) => !isRealizedWork(work));
export const selectedWorks = realizedWorks.filter((work) => work.featuredOnHome);
export const mediaById = (id: string) => media.find((row) => row.id === id);
export const workById = (id: string) => works.find((row) => row.id === id);
