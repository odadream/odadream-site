import type { WorkDocument } from './work-details';
import type { Rights, Localized } from './site';
import type { SourceReference } from './editorial';
import { sourceSnapshots } from './editorial';
import { documentPages } from '../lib/prepared-media';
const refs = (...files: string[]) => files.map((file) => sourceSnapshots[file]);

export type DocumentMetadata = Pick<
  WorkDocument,
  'id' | 'title' | 'description' | 'year' | 'language' | 'pages' | 'bytes' | 'pageImages' | 'originalAccess'
> & { href?: string; downloadLabel?: Localized };
export interface ReferenceDocument extends DocumentMetadata {
  href: string;
  kind: 'technical-overview' | 'cv' | 'legal';
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
    id: 'trademark-1237624',
    kind: 'legal',
    owner: { kind: 'studio', id: 'studio' },
    title: {
      ru: 'Свидетельство на товарный знак №1237624',
      en: 'Trademark registration certificate No. 1237624',
    },
    description: {
      ru: 'Знак «odadream», правообладатель — Далер Арабов. Приоритет: 25 февраля 2026 года; регистрация: 2 июля 2026 года; срок действия: до 25 февраля 2036 года. Публичная копия с удалённым адресом регистрации.',
      en: 'The odadream mark, owned by Daler Arabov. Priority: 25 February 2026; registration: 2 July 2026; expiry: 25 February 2036. Public copy with the registration address removed.',
    },
    downloadLabel: { ru: 'PDF со скрытым адресом', en: 'PDF with address removed' },
    href: '/documents/oda-dream-trademark-1237624-redacted.pdf',
    year: 2026,
    language: 'ru',
    pages: 1,
    bytes: 669399,
    rights: 'cleared',
    originalAccess: 'public',
    sha256: '45ed6cfb314e3e42551cd0943e190042f1f74149ad8114df67eb8e96c9cd7333',
    contentFingerprint: '45ed6cfb314e3e42551cd0943e190042f1f74149ad8114df67eb8e96c9cd7333',
    sourceRefs: [
      {
        file: 'OwnerRecognition/Товарный знак/1237624.eod.pdf',
        sha256: '2b21a9912fcc004f7744374d5f8e7eb3a1ad3a6aebe66457090a3d9c4e1c94fd',
        snapshot: '2026-10-16',
      },
    ],
    source:
      'Owner-provided certificate; public raster-only derivative with irreversible address removal, inspected 2026-10-16.',
    asOf: '2026-10-16',
    requiredConfigurations: [],
    requiredPeople: ['daler'],
  },
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
      ru: 'Обзор трёх вариантов участия: базовые параметры, задачи студии и площадки, данные для подготовки предложения. Версия от 27 октября 2026 года.',
      en: 'An overview of three participation options: baseline parameters, studio and venue responsibilities, and information for preparing a proposal. Version dated 27 October 2026.',
    },
    href: '/documents/oda-dream-technical-overview-ru.pdf',
    year: 2026,
    language: 'ru',
    pages: 2,
    bytes: 28655,
    requiredConfigurations: ['mindshow-installation', 'neurobattle-game'],
    requiredEducationOverview: true,
    requiredPeople: [],
    asOf: '2026-10-27',
    rights: 'cleared',
    sha256: '5bffa7abbb4d643b940d686eacc4033a03d19760891ac54da1978cbf4e3f59b4',
    contentFingerprint: '20f16b8cdd7c5b8475d6ba9cf21fb4a06c8e04473bb406f04b3f170014cd1281',
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
      ru: 'Обзор трёх вариантов участия: базовые параметры, задачи студии и площадки, данные для подготовки предложения. Версия от 27 октября 2026 года.',
      en: 'An overview of three participation options: baseline parameters, studio and venue responsibilities, and information for preparing a proposal. Version dated 27 October 2026.',
    },
    href: '/documents/oda-dream-technical-overview-en.pdf',
    year: 2026,
    language: 'en',
    pages: 2,
    bytes: 23192,
    requiredConfigurations: ['mindshow-installation', 'neurobattle-game'],
    requiredEducationOverview: true,
    requiredPeople: [],
    asOf: '2026-10-27',
    rights: 'cleared',
    sha256: '571da5022c4e404cfe4c797252ba875fc9309418965206c771cf39bb7e0a95ed',
    contentFingerprint: '20f16b8cdd7c5b8475d6ba9cf21fb4a06c8e04473bb406f04b3f170014cd1281',
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
    asOf: '2026-10-27',
    language: 'ru',
    title: {
      ru: 'CV · Ольга Арабова',
      en: 'CV · Olga Arabova',
    },
    description: {
      ru: 'Биография, образование и профессиональный опыт, выбранные проекты и события студии. Версия от 27 октября 2026.',
      en: 'Biography, education and professional background, selected studio projects and engagements. Version dated 27 October 2026.',
    },
    href: '/documents/oda-dream-cv-olga-ru.pdf',
    year: 2026,
    pages: 1,
    bytes: 26031,
    rights: 'cleared',
    sha256: '6a13a716c01833280d931e21d1b8fd0740109bdb9ecd81f55380377b89fae51e',
    contentFingerprint: '4d22b702728593b9b12c465058c381c385b04090402554b4112f8b6ad1ad1cb0',
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
    asOf: '2026-10-27',
    language: 'en',
    title: {
      ru: 'CV · Ольга Арабова',
      en: 'CV · Olga Arabova',
    },
    description: {
      ru: 'Биография, образование и профессиональный опыт, выбранные проекты и события студии. Версия от 27 октября 2026.',
      en: 'Biography, education and professional background, selected studio projects and engagements. Version dated 27 October 2026.',
    },
    href: '/documents/oda-dream-cv-olga-en.pdf',
    year: 2026,
    pages: 1,
    bytes: 21283,
    rights: 'cleared',
    sha256: 'e67395a9be707eafc42b1eac8754d8e54e42371c769ec2da67e3cc962adad1cb',
    contentFingerprint: '4d22b702728593b9b12c465058c381c385b04090402554b4112f8b6ad1ad1cb0',
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
    asOf: '2026-10-27',
    language: 'ru',
    title: {
      ru: 'CV · Далер Арабов',
      en: 'CV · Daler Arabov',
    },
    description: {
      ru: 'Биография, образование и профессиональный опыт, выбранные проекты и события студии. Версия от 27 октября 2026.',
      en: 'Biography, education and professional background, selected studio projects and engagements. Version dated 27 October 2026.',
    },
    href: '/documents/oda-dream-cv-daler-ru.pdf',
    year: 2026,
    pages: 1,
    bytes: 26636,
    rights: 'cleared',
    sha256: 'ac48b50ad8e605f900dc3cff7d4d04e90ef2d92594977c6abc903c362db3f75d',
    contentFingerprint: 'abf3f0f124cbd200616ba61493de73b168d5693b1d6fa8dfb52f775668b1dbc5',
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
    asOf: '2026-10-27',
    language: 'en',
    title: {
      ru: 'CV · Далер Арабов',
      en: 'CV · Daler Arabov',
    },
    description: {
      ru: 'Биография, образование и профессиональный опыт, выбранные проекты и события студии. Версия от 27 октября 2026.',
      en: 'Biography, education and professional background, selected studio projects and engagements. Version dated 27 October 2026.',
    },
    href: '/documents/oda-dream-cv-daler-en.pdf',
    year: 2026,
    pages: 1,
    bytes: 21681,
    rights: 'cleared',
    sha256: '8e91a294f495bd630dbba8be76bc07f83e8df5a11624992f109d2484a914b3e3',
    contentFingerprint: 'abf3f0f124cbd200616ba61493de73b168d5693b1d6fa8dfb52f775668b1dbc5',
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
