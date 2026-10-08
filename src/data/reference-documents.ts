import type { WorkDocument } from './work-details';
import type { Rights } from './site';
import type { SourceReference } from './editorial';
import { sourceSnapshots } from './editorial';
import { documentPages } from '../lib/prepared-media';
const refs = (...files: string[]) => files.map((file) => sourceSnapshots[file]);

export type DocumentMetadata = Pick<
  WorkDocument,
  'id' | 'title' | 'description' | 'year' | 'language' | 'pages' | 'bytes' | 'pageImages' | 'originalAccess'
> & { href?: string };
export interface ReferenceDocument extends DocumentMetadata {
  href: string;
  kind: 'technical-overview' | 'cv';
  personId?: string;
  owner: { kind: 'cooperation' | 'studio'; id: string };
  requiredConfigurations: string[];
  requiredEducationOverview?: boolean;
  requiredPeople: string[];
  requiredWorks?: string[];
  requiredCases?: string[];
  asOf: string;
  rights: Rights;
  sha256: string;
  contentFingerprint: string;
  sourceRefs: SourceReference[];
  source: string;
}

// Prepared from the same typed editorial facts as the HTML. Publication follows
// the owner and all dependencies; authorship of this overview does not publish them.
const documentRecords: ReferenceDocument[] = [
  {
    id: 'technical-overview-ru',
    kind: 'technical-overview',
    owner: {
      kind: 'cooperation',
      id: 'cooperation',
    },
    title: {
      ru: 'Технический обзор ODA.dream',
      en: 'ODA.dream technical overview',
    },
    description: {
      ru: 'Две страницы: три конфигурации участия, архивные параметры, распределение обязанностей и данные для брифа. Это обзор для обсуждения, не оферта и не согласованный райдер.',
      en: 'Two pages: three participation configurations, archival parameters, responsibilities and briefing inputs. An overview for discussion, not an offer or an agreed rider.',
    },
    href: '/documents/oda-dream-technical-overview-ru.pdf',
    year: 2026,
    language: 'ru',
    pages: 2,
    bytes: 28464,
    requiredConfigurations: ['mindshow-installation', 'neurobattle-game'],
    requiredEducationOverview: true,
    requiredPeople: [],
    asOf: '2026-10-06',
    rights: 'cleared',
    sha256: '93be5b48e1fc658fd60c8d4503772a12f63db9fed0ab15e29517dd70361bae76',
    contentFingerprint: '5882f6f6ccda6e01e17be58626558a9024fa41667af0d2683f97cc13cd2f4310',
    sourceRefs: refs(
      'mindshow.md',
      'hub-host-events.md',
      'hub-collab.md',
      'neurobattle.md',
      'hub-lectures.md',
      'hub-education.md',
      'hub-institutions.md',
      'hub-galleries.md',
      'hub-event-agencies.md',
      'hub-business.md',
      'hub-creators.md',
    ),
    source:
      'Typed V2 format conditions and cooperation scope; source snapshots recorded in sourceRefs. Authored overview, 2026-10-06.',
  },
  {
    id: 'technical-overview-en',
    kind: 'technical-overview',
    owner: {
      kind: 'cooperation',
      id: 'cooperation',
    },
    title: {
      ru: 'Технический обзор ODA.dream',
      en: 'ODA.dream technical overview',
    },
    description: {
      ru: 'Две страницы: три конфигурации участия, архивные параметры, распределение обязанностей и данные для брифа. Это обзор для обсуждения, не оферта и не согласованный райдер.',
      en: 'Two pages: three participation configurations, archival parameters, responsibilities and briefing inputs. An overview for discussion, not an offer or an agreed rider.',
    },
    href: '/documents/oda-dream-technical-overview-en.pdf',
    year: 2026,
    language: 'en',
    pages: 2,
    bytes: 23109,
    requiredConfigurations: ['mindshow-installation', 'neurobattle-game'],
    requiredEducationOverview: true,
    requiredPeople: [],
    asOf: '2026-10-06',
    rights: 'cleared',
    sha256: 'f51b66a6d2584fa2e5629a1a31b144b66e0c222a8cff58a2c1391b07b0b2f7fd',
    contentFingerprint: '5882f6f6ccda6e01e17be58626558a9024fa41667af0d2683f97cc13cd2f4310',
    sourceRefs: refs(
      'mindshow.md',
      'hub-host-events.md',
      'hub-collab.md',
      'neurobattle.md',
      'hub-lectures.md',
      'hub-education.md',
      'hub-institutions.md',
      'hub-galleries.md',
      'hub-event-agencies.md',
      'hub-business.md',
      'hub-creators.md',
    ),
    source:
      'Typed V2 format conditions and cooperation scope; source snapshots recorded in sourceRefs. Authored overview, 2026-10-06.',
  },

  {
    id: 'cv-olga-ru',
    kind: 'cv',
    personId: 'olga',
    owner: {
      kind: 'studio',
      id: 'studio',
    },
    requiredPeople: ['olga'],
    requiredConfigurations: [],
    requiredWorks: ['mindshow', 'neurobattle', 'interference'],
    requiredCases: ['tsiolkovsky-2026', 'cipr-2026'],
    asOf: '2026-10-06',
    language: 'ru',
    title: {
      ru: 'CV · Ольга Арабова',
      en: 'CV · Olga Arabova',
    },
    description: {
      ru: 'Биография, образование и профессиональный опыт, выбранные проекты и события студии. Версия от 6 октября 2026.',
      en: 'Biography, education and professional background, selected studio projects and engagements. Version dated 6 October 2026.',
    },
    href: '/documents/oda-dream-cv-olga-ru.pdf',
    year: 2026,
    pages: 1,
    bytes: 24960,
    rights: 'cleared',
    sha256: '0f0a644f495ca2a71632f7f76c7cc346627c7eb6c50eb87e8c23870f26bb4ece',
    contentFingerprint: '081539b21bf3f9d63a36e620096413fad99e7e3835117d1c038d3122d2b031ac',
    sourceRefs: refs(
      'hub-cv.md',
      'Olga_Arabova_CV.md',
      'interference.md',
      'schrodinger.md',
      'mindshow.md',
      'neurobattle.md',
      'event-tsiolkovsky-2026.md',
      'event-cipr-mindshow-2026.md',
      'proof-tst-cipr-techfriendly.md',
      'org-ashram.md',
    ),
    source:
      'Curated V2 biography and selected studio projects; owner-provided CYENS profile snapshot recorded in sourceRefs. Current CV export, 2026-10-06.',
  },
  {
    id: 'cv-olga-en',
    kind: 'cv',
    personId: 'olga',
    owner: {
      kind: 'studio',
      id: 'studio',
    },
    requiredPeople: ['olga'],
    requiredConfigurations: [],
    requiredWorks: ['mindshow', 'neurobattle', 'interference'],
    requiredCases: ['tsiolkovsky-2026', 'cipr-2026'],
    asOf: '2026-10-06',
    language: 'en',
    title: {
      ru: 'CV · Ольга Арабова',
      en: 'CV · Olga Arabova',
    },
    description: {
      ru: 'Биография, образование и профессиональный опыт, выбранные проекты и события студии. Версия от 6 октября 2026.',
      en: 'Biography, education and professional background, selected studio projects and engagements. Version dated 6 October 2026.',
    },
    href: '/documents/oda-dream-cv-olga-en.pdf',
    year: 2026,
    pages: 1,
    bytes: 20964,
    rights: 'cleared',
    sha256: 'a5a59cdf1dacda230cb72254707efcd02dcd839a2c56d2c6d716b4dfa6ed933e',
    contentFingerprint: '081539b21bf3f9d63a36e620096413fad99e7e3835117d1c038d3122d2b031ac',
    sourceRefs: refs(
      'hub-cv.md',
      'Olga_Arabova_CV.md',
      'interference.md',
      'schrodinger.md',
      'mindshow.md',
      'neurobattle.md',
      'event-tsiolkovsky-2026.md',
      'event-cipr-mindshow-2026.md',
      'proof-tst-cipr-techfriendly.md',
      'org-ashram.md',
    ),
    source:
      'Curated V2 biography and selected studio projects; owner-provided CYENS profile snapshot recorded in sourceRefs. Current CV export, 2026-10-06.',
  },
  {
    id: 'cv-daler-ru',
    kind: 'cv',
    personId: 'daler',
    owner: {
      kind: 'studio',
      id: 'studio',
    },
    requiredPeople: ['daler'],
    requiredConfigurations: [],
    requiredWorks: ['mindshow', 'neurobattle', 'interference'],
    requiredCases: ['tsiolkovsky-2026', 'cipr-2026'],
    asOf: '2026-10-06',
    language: 'ru',
    title: {
      ru: 'CV · Далер Арабов',
      en: 'CV · Daler Arabov',
    },
    description: {
      ru: 'Биография, образование и профессиональный опыт, выбранные проекты и события студии. Версия от 6 октября 2026.',
      en: 'Biography, education and professional background, selected studio projects and engagements. Version dated 6 October 2026.',
    },
    href: '/documents/oda-dream-cv-daler-ru.pdf',
    year: 2026,
    pages: 1,
    bytes: 25365,
    rights: 'cleared',
    sha256: '0d392fd86422dd3cf01688075cbc3ae9986607ea8f4dc1ab40ba944af4db2df8',
    contentFingerprint: '029f41f81513d8b3d89d30f871d5424c0d0aa66fd02f6265539863177a5d39b0',
    sourceRefs: refs(
      'hub-cv.md',
      'Daler_Arabov_CV.md',
      'interference.md',
      'schrodinger.md',
      'mindshow.md',
      'neurobattle.md',
      'event-tsiolkovsky-2026.md',
      'event-cipr-mindshow-2026.md',
      'proof-tst-cipr-techfriendly.md',
      'org-ashram.md',
    ),
    source:
      'Curated V2 biography and selected studio projects; owner-provided CYENS profile snapshot recorded in sourceRefs. Current CV export, 2026-10-06.',
  },
  {
    id: 'cv-daler-en',
    kind: 'cv',
    personId: 'daler',
    owner: {
      kind: 'studio',
      id: 'studio',
    },
    requiredPeople: ['daler'],
    requiredConfigurations: [],
    requiredWorks: ['mindshow', 'neurobattle', 'interference'],
    requiredCases: ['tsiolkovsky-2026', 'cipr-2026'],
    asOf: '2026-10-06',
    language: 'en',
    title: {
      ru: 'CV · Далер Арабов',
      en: 'CV · Daler Arabov',
    },
    description: {
      ru: 'Биография, образование и профессиональный опыт, выбранные проекты и события студии. Версия от 6 октября 2026.',
      en: 'Biography, education and professional background, selected studio projects and engagements. Version dated 6 October 2026.',
    },
    href: '/documents/oda-dream-cv-daler-en.pdf',
    year: 2026,
    pages: 1,
    bytes: 20995,
    rights: 'cleared',
    sha256: 'a8827265adce52a3731d14cf937445fab5add2a29c18c9a30da8028b55b4ac1b',
    contentFingerprint: '029f41f81513d8b3d89d30f871d5424c0d0aa66fd02f6265539863177a5d39b0',
    sourceRefs: refs(
      'hub-cv.md',
      'Daler_Arabov_CV.md',
      'interference.md',
      'schrodinger.md',
      'mindshow.md',
      'neurobattle.md',
      'event-tsiolkovsky-2026.md',
      'event-cipr-mindshow-2026.md',
      'proof-tst-cipr-techfriendly.md',
      'org-ashram.md',
    ),
    source:
      'Curated V2 biography and selected studio projects; owner-provided CYENS profile snapshot recorded in sourceRefs. Current CV export, 2026-10-06.',
  },
];

export const referenceDocuments: ReferenceDocument[] = documentRecords.map((row) => ({
  ...row,
  pageImages: documentPages(row.href),
}));
