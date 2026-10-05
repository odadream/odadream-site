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

export const createPages = (records: Pick<typeof catalogue, 'works' | 'cases'>): Page[] =>
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
    ...(
      ['works', 'formats', 'cooperation', 'studio', 'cases', 'contact', 'technology', 'recognition'] as const
    ).map((kind) => ({
      lang,
      kind,
      family: familyByKind[kind],
      path: `/${lang}/${kind}/`,
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
    })),
    ...records.cases.map((item) => ({
      lang,
      kind: 'case' as const,
      family: familyByKind.case,
      slug: item.slug,
      path: `/${lang}/cases/${item.slug}/`,
      title: `${item.title[lang]} — ODA.dream`,
      description: item.summary[lang],
    })),
  ]);

export const pages = createPages(catalogue);

export const pairedPath = (path: string, lang: Lang) => path.replace(/^\/(en|ru)\//, `/${lang}/`);
export const pageForPath = (path: string) => pages.find((page) => page.path === path);
export const url = (lang: Lang, path = '') => `/${lang}/${path}`;
export const workUrl = (lang: Lang, id: string) =>
  `/${lang}/works/${works.find((x) => x.id === id)?.slug ?? ''}/`;
export const caseUrl = (lang: Lang, id: string) =>
  `/${lang}/cases/${cases.find((x) => x.id === id)?.slug ?? ''}/`;
export const formatUrl = (lang: Lang, id: string) =>
  `/${lang}/formats/#${formats.find((x) => x.id === id)?.slug ?? ''}`;
