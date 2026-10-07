import type { PageKind } from './routes';

/** Stable page families used by the visible hierarchy code and section palette. */
export const familyByKind: Record<PageKind, PageFamily> = {
  home: 'H',
  works: 'W',
  work: 'W',
  education: 'E',
  programme: 'E',
  cooperation: 'C',
  studio: 'S',
  cases: 'K',
  case: 'K',
  contact: 'N',
  technology: 'M',
  recognition: 'R',
};

export type PageFamily = 'H' | 'W' | 'E' | 'C' | 'S' | 'K' | 'N' | 'M' | 'R' | 'D';

export function makePageCode(family: PageFamily, section = 0) {
  if (!Number.isInteger(section) || section < 0 || section > 99)
    throw new RangeError(`Page section must be an integer from 0 to 99: ${section}`);
  if (section === 0) return family;
  return `${family}.${String(section).padStart(2, '0')}`;
}
