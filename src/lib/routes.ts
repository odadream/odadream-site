import { cases, formats, works, catalogue } from '../data/catalogue';
import type { Lang } from '../data/site';
import { familyByKind, type PageFamily } from './page-codes';

export type PageKind =
  | 'home'
  | 'works'
  | 'work'
  | 'formats'
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
    en: ['Works', 'Selected works by ODA.dream: participatory performance, media art and art-research.'],
    ru: [
      'Работы',
      'Избранные работы ODA.dream: партисипаторный спектакль, медиаискусство и художественное исследование.',
    ],
  },
  formats: {
    en: ['Formats', 'Adaptable formats for exhibitions, public programmes and events.'],
    ru: ['Форматы', 'Адаптируемые форматы для выставок, публичных программ и событий.'],
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
    en: ['Cases', 'Selected events and verifiable context for ODA.dream works.'],
    ru: ['Кейсы', 'Избранные события и проверяемый контекст работ ODA.dream.'],
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
    en: [
      'Recognition',
      'An archive of awards, certificates and letters of appreciation, published with source and permission context.',
    ],
    ru: [
      'Признания',
      'Архив наград, сертификатов и благодарственных писем с указанием источников и разрешений на публикацию.',
    ],
  },
} as const;

const overviewKinds = [
  'works',
  'formats',
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
        | 'formats'
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
        kind === 'formats'
          ? (records.formats ?? []).map((row) => row.slug)
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
                    'milestones',
                    'method',
                    'evidence',
                    ...(records.studioPages?.length
                      ? [
                          'teaching',
                          'materials',
                          ...records.studioPages[0].teaching.map((row) => `teaching-${row.id}`),
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
                  ? records.cases.map((row) => `case-${row.slug}`)
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
        ...work.story.map((row) => `work-story-${row.id}`),
        ...(records.workDocuments ?? [])
          .filter((row) => row.workId === work.id)
          .map((row) => `document-${row.id}`),
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
        anchors: ['case-contribution', 'case-story', 'case-context', 'case-evidence'],
      })),
  ]);

export const pages = createPages(catalogue);

/** The menu follows the same overview registry as static routes; detail pages stay within their section. */
export const navigationFor = (lang: Lang) =>
  pages
    .filter((page) => page.lang === lang && page.kind !== 'work' && page.kind !== 'case')
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
export const caseTargetUrl = (lang: Lang, item: { work?: string; method?: string }) =>
  item.work ? workUrl(lang, item.work) : `/${lang}/technology/`;
export const formatUrl = (lang: Lang, id: string) =>
  `/${lang}/formats/#${formats.find((x) => x.id === id)?.slug ?? ''}`;
