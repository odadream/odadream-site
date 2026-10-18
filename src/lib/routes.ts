import { caseSectionIds } from './case-sections';
import { cases, configurations, programmes, works, catalogue } from '../data/catalogue';
import type { Lang } from '../data/site';
import { familyByKind, type PageFamily } from './page-codes';

export type PageKind =
  | 'home'
  | 'works'
  | 'work'
  | 'education'
  | 'programme'
  | 'cooperation'
  | 'studio'
  | 'cases'
  | 'case'
  | 'contact'
  | 'technology'
  | 'recognition';
export interface Page {
  lang: Lang;
  kind: PageKind;
  path: string;
  slug?: string;
  title: string;
  description: string;
  family: PageFamily;
  anchors?: string[];
}
const copy = {
  works: {
    en: [
      'Works',
      'Works by ODA.dream: performances, stage works, installations, objects, concepts and prototypes.',
    ],
    ru: ['Работы', 'Работы ODA.dream: перформансы, спектакли, инсталляции, объекты, концепции и прототипы.'],
  },
  education: {
    en: ['Education', 'Lectures, workshops and educational laboratories by ODA.dream.'],
    ru: ['Образование', 'Лекции, практикумы и образовательные лаборатории ODA.dream.'],
  },
  cooperation: {
    en: ['Cooperation', 'How to commission, present or develop a project with ODA.dream.'],
    ru: ['Сотрудничество', 'Как заказать, показать или разработать проект вместе с ODA.dream.'],
  },
  studio: {
    en: ['Studio', 'ODA.dream is an art–science studio founded by Olga and Daler Arabov.'],
    ru: ['Студия', 'ODA.dream — художественно-научная студия Ольги и Далера Арабовых.'],
  },
  cases: {
    en: [
      'Cases',
      'Presentations, educational encounters, laboratories and competition submissions in the ODA.dream chronology.',
    ],
    ru: ['Кейсы', 'Показы, образовательные встречи, лаборатории и конкурсные заявки в хронологии ODA.dream.'],
  },
  contact: {
    en: ['Contact', 'Contact ODA.dream about presentations, commissions and development.'],
    ru: ['Контакт', 'Связаться с ODA.dream по вопросам показов, заказов и совместной разработки.'],
  },
  technology: {
    en: [
      'Neuromandala',
      'How ODA.dream turns biosignals into material for participatory art — and what those signals cannot tell us.',
    ],
    ru: [
      'Нейромандала',
      'Как ODA.dream превращает биосигналы в материал партисипаторного искусства — и чего эти сигналы не могут рассказать о человеке.',
    ],
  },
  recognition: {
    en: ['Recognition', 'ODA.dream awards, certificates, grants and letters of appreciation.'],
    ru: ['Признания', 'Награды, дипломы, гранты и благодарственные письма ODA.dream.'],
  },
} as const;

const overviewKinds = [
  'works',
  'education',
  'cooperation',
  'studio',
  'cases',
  'technology',
  'recognition',
  'contact',
] as const;

export const createPages = (
  records: Pick<typeof catalogue, 'works' | 'cases'> &
    Partial<
      Pick<
        typeof catalogue,
        | 'configurations'
        | 'programmes'
        | 'educationOverview'
        | 'methods'
        | 'cooperationPages'
        | 'studioPages'
        | 'recognitions'
        | 'workDocuments'
        | 'referenceDocuments'
      >
    >,
): Page[] =>
  (['en', 'ru'] as Lang[]).flatMap((lang) => [
    {
      lang,
      kind: 'home',
      family: familyByKind.home,
      path: `/${lang}/`,
      title:
        lang === 'en'
          ? 'ODA.dream — Human state as artistic material'
          : 'ODA.dream — Состояние человека как художественный материал',
      description:
        lang === 'en'
          ? 'ODA.dream creates participatory works at the intersection of art, perception and technology.'
          : 'ODA.dream создаёт партисипаторные работы на пересечении искусства, восприятия и технологий.',
    },
    ...overviewKinds.map((kind) => ({
      lang,
      kind,
      family: familyByKind[kind],
      path: `/${lang}/${kind}/`,
      anchors:
        kind === 'education'
          ? [
              'education-programmes',
              ...(records.educationOverview
                ? [
                    'education-conditions',
                    ...(records.educationOverview.materials ?? []).map(
                      (section) => `education-material-${section.id}`,
                    ),
                    ...(records.educationOverview.media.length
                      ? ['education-gallery', 'education-media']
                      : []),
                  ]
                : []),
            ]
          : kind === 'technology'
            ? records.methods?.length
              ? [
                  ...records.methods[0].sections.map((row) => row.id),
                  'signal-process',
                  'participation',
                  'method-boundaries',
                ]
              : []
            : kind === 'cooperation'
              ? [
                  'project-brief',
                  ...(records.cooperationPages?.length
                    ? [
                        'cooperation-scenarios',
                        'cooperation-modes',
                        'production-overview',
                        'cooperation-process',
                        ...records.cooperationPages[0].scenarios.map((row) => `for-${row.id}`),
                        ...(records.referenceDocuments ?? [])
                          .filter(
                            (row) =>
                              row.owner.kind === 'cooperation' &&
                              row.owner.id === records.cooperationPages![0].id &&
                              row.language === lang,
                          )
                          .map((row) => `document-${row.id}`),
                      ]
                    : []),
                ]
              : kind === 'studio'
                ? [
                    'people',
                    'method',
                    'legal',
                    ...(records.studioPages?.length
                      ? [
                          'materials',
                          ...records.studioPages[0].people.map((id) => `person-${id}`),
                          ...(records.referenceDocuments ?? [])
                            .filter(
                              (row) =>
                                row.owner.kind === 'studio' &&
                                row.owner.id === records.studioPages![0].id &&
                                row.language === lang,
                            )
                            .map((row) => `document-${row.id}`),
                        ]
                      : []),
                  ]
                : kind === 'cases'
                  ? ['case-events', 'case-series', ...records.cases.map((row) => `case-${row.slug}`)]
                  : kind === 'recognition'
                    ? (records.recognitions ?? []).map((row) => `recognition-${row.id}`)
                    : [],
      title: `${copy[kind][lang][0]} — ODA.dream`,
      description: copy[kind][lang][1],
    })),
    ...records.works.map((work) => ({
      lang,
      kind: 'work' as const,
      family: familyByKind.work,
      slug: work.slug,
      path: `/${lang}/works/${work.slug}/`,
      title: `${work.title[lang]} — ODA.dream`,
      description: work.summary[lang],
      anchors: [
        'work-context',
        'work-story',
        'work-credits',
        'work-availability',
        ...(records.configurations ?? []).filter((row) => row.workId === work.id).map((row) => row.slug),
        ...work.story.map((row) => `work-story-${row.id}`),
        ...(records.workDocuments ?? [])
          .filter((row) => row.workId === work.id)
          .map((row) => `document-${row.id}`),
      ],
    })),
    ...(records.programmes ?? []).map((programme) => ({
      lang,
      kind: 'programme' as const,
      family: familyByKind.programme,
      slug: programme.slug,
      path: `/${lang}/education/${programme.slug}/`,
      title: `${programme.title[lang]} — ODA.dream`,
      description: programme.summary[lang],
      anchors: [
        'programme-content',
        'programme-participation',
        'programme-conditions',
        ...(programme.modules ?? []).map((item) => `programme-${programme.id}-${item.id}`),
      ],
    })),
    ...records.cases
      .filter((item) => item.detailPage)
      .map((item) => ({
        lang,
        kind: 'case' as const,
        family: familyByKind.case,
        slug: item.slug,
        path: `/${lang}/cases/${item.slug}/`,
        title: `${item.title[lang]} — ODA.dream`,
        description: item.summary[lang],
        anchors: [...caseSectionIds(item), ...(item.media.length > 1 ? ['case-gallery'] : [])],
      })),
  ]);

export const pages = createPages(catalogue);

/** The menu follows the same overview registry as static routes; detail pages stay within their section. */
export const navigationFor = (lang: Lang) =>
  pages
    .filter(
      (page) =>
        page.lang === lang && page.kind !== 'work' && page.kind !== 'case' && page.kind !== 'programme',
    )
    .map((page) => ({
      route: page.kind,
      href: page.path,
      family: page.family,
      label:
        page.kind === 'home' ? (lang === 'ru' ? 'Главная' : 'Home') : page.title.replace(/ — ODA.dream$/, ''),
    }));

export const pairedPath = (path: string, lang: Lang) => path.replace(/^\/(en|ru)\//, `/${lang}/`);
export const pageForPath = (path: string) => pages.find((page) => page.path === path);
export const url = (lang: Lang, path = '') => `/${lang}/${path}`;
export const workUrl = (lang: Lang, id: string) =>
  `/${lang}/works/${works.find((x) => x.id === id)?.slug ?? ''}/`;
export const caseUrl = (lang: Lang, id: string) =>
  cases.find((row) => row.id === id)?.detailPage
    ? `/${lang}/cases/${cases.find((row) => row.id === id)!.slug}/`
    : `/${lang}/cases/#case-${cases.find((row) => row.id === id)?.slug ?? ''}`;
export const caseTargetUrl = (lang: Lang, item: { work?: string; method?: string; programme?: string }) =>
  item.work
    ? workUrl(lang, item.work)
    : item.programme
      ? programmeUrl(lang, item.programme)
      : `/${lang}/technology/`;
export const configurationUrl = (lang: Lang, id: string) => {
  const configuration = configurations.find((row) => row.id === id);
  return configuration
    ? workUrl(lang, configuration.workId) + '#' + configuration.slug
    : `/${lang}/cooperation/`;
};
export const programmeUrl = (lang: Lang, id: string) =>
  `/${lang}/education/${programmes.find((row) => row.id === id)?.slug ?? ''}/`;
