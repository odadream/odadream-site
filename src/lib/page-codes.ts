import type { PageKind } from './routes';

/** Stable page families used by the visible hierarchy code and section palette. */
export const familyByKind: Record<PageKind, PageFamily> = {
  home: 'H',
  works: 'W',
  work: 'W',
  formats: 'F',
  cooperation: 'C',
  studio: 'S',
  cases: 'K',
  case: 'K',
  contact: 'N',
  technology: 'M',
  recognition: 'R',
};

export type PageFamily = 'H' | 'W' | 'F' | 'C' | 'S' | 'K' | 'N' | 'M' | 'R' | 'D';

export function makePageCode(family: PageFamily, section = 0, item?: number) {
  if (item !== undefined && section === 0)
    throw new RangeError('Page code items must belong to a numbered section');
  for (const value of [section, ...(item === undefined ? [] : [item])])
    if (!Number.isInteger(value) || value < 0 || value > 99)
      throw new RangeError(`Page code segment must be an integer from 0 to 99: ${value}`);
  if (section === 0 && item === undefined) return family;
  const sectionCode = String(section).padStart(2, '0');
  return `${family}.${sectionCode}${item === undefined ? '' : String(item).padStart(2, '0')}`;
}
