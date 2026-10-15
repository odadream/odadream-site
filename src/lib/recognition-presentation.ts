import type { Lang, Recognition, RecognitionKind } from '../data/site';
export const recognitionKindLabels: Record<RecognitionKind, Record<Lang, string>> = {
  award: { ru: 'Награды', en: 'Awards' },
  grant: { ru: 'Гранты', en: 'Grants' },
  selection: { ru: 'Отборы', en: 'Selections' },
  certificate: { ru: 'Дипломы и свидетельства', en: 'Certificates' },
  'acknowledgement-letter': { ru: 'Благодарности', en: 'Acknowledgements' },
};
export const recognitionKinds: RecognitionKind[] = [
  'award',
  'grant',
  'selection',
  'certificate',
  'acknowledgement-letter',
];
export const sortRecognitions = <T extends Pick<Recognition, 'id' | 'kind' | 'year'>>(
  items: readonly T[],
): T[] =>
  [...items].sort(
    (a, b) =>
      recognitionKinds.indexOf(a.kind) - recognitionKinds.indexOf(b.kind) ||
      b.year - a.year ||
      a.id.localeCompare(b.id),
  );

export const recognitionKindLabel = {
  award: { ru: 'Награда', en: 'Award' },
  grant: { ru: 'Грант', en: 'Grant' },
  selection: { ru: 'Отбор', en: 'Selection' },
  certificate: { ru: 'Диплом / сертификат', en: 'Certificate' },
  'acknowledgement-letter': { ru: 'Благодарность', en: 'Acknowledgement' },
};
