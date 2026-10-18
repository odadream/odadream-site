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
      ru: 'Знак «odadream», правообладатель — Далер Арабов. Приоритет 25.02.2026, регистрация 02.07.2026, срок до 25.02.2036. Публичная копия: адрес регистрации удалён, электронная подпись оригинала не переносится.',
      en: 'The odadream mark, owned by Daler Arabov. Priority: 25 February 2026; registration: 2 July 2026; expiry: 25 February 2036. Public copy: registration address removed; original electronic signature is not transferred.',
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
      ru: 'Обзор трёх вариантов участия: базовые параметры, задачи студии и площадки, данные для подготовки предложения. Версия от 16 октября 2026 года.',
      en: 'An overview of three participation options: baseline parameters, studio and venue responsibilities, and information for preparing a proposal. Version dated 16 October 2026.',
    },
    href: '/documents/oda-dream-technical-overview-ru.pdf',
    year: 2026,
    language: 'ru',
    pages: 2,
    bytes: 28657,
    requiredConfigurations: ['mindshow-installation', 'neurobattle-game'],
    requiredEducationOverview: true,
    requiredPeople: [],
    asOf: '2026-10-16',
    rights: 'cleared',
    sha256: 'e67c2906deb690b2c833cac10574b36faf780c911d8f97f8676a958f594adbde',
    contentFingerprint: 'e09d4b9b82acd8ff3db7e3b2e11e804aeb630ce03c0555d2765ed1b3317cb536',
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
      ru: 'Обзор трёх вариантов участия: базовые параметры, задачи студии и площадки, данные для подготовки предложения. Версия от 16 октября 2026 года.',
      en: 'An overview of three participation options: baseline parameters, studio and venue responsibilities, and information for preparing a proposal. Version dated 16 October 2026.',
    },
    href: '/documents/oda-dream-technical-overview-en.pdf',
    year: 2026,
    language: 'en',
    pages: 2,
    bytes: 23192,
    requiredConfigurations: ['mindshow-installation', 'neurobattle-game'],
    requiredEducationOverview: true,
    requiredPeople: [],
    asOf: '2026-10-16',
    rights: 'cleared',
    sha256: '3814a382552e5a808319f8085317da9371c58d59e14c4f20260759b82965aab7',
    contentFingerprint: 'e09d4b9b82acd8ff3db7e3b2e11e804aeb630ce03c0555d2765ed1b3317cb536',
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
    asOf: '2026-10-16',
    language: 'ru',
    title: {
      ru: 'CV · Ольга Арабова',
      en: 'CV · Olga Arabova',
    },
    description: {
      ru: 'Биография, образование и профессиональный опыт, выбранные проекты и события студии. Версия от 16 октября 2026.',
      en: 'Biography, education and professional background, selected studio projects and engagements. Version dated 16 October 2026.',
    },
    href: '/documents/oda-dream-cv-olga-ru.pdf',
    year: 2026,
    pages: 1,
    bytes: 26158,
    rights: 'cleared',
    sha256: '2f36f8a4b4fe330772698116def09221e9e37e7e299802b003f4058029d88fc2',
    contentFingerprint: '6c09832eea2aae9c3b8d6830e3f3eb2cd0c0ded14e7f65245ab88b3516c810cd',
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
    asOf: '2026-10-16',
    language: 'en',
    title: {
      ru: 'CV · Ольга Арабова',
      en: 'CV · Olga Arabova',
    },
    description: {
      ru: 'Биография, образование и профессиональный опыт, выбранные проекты и события студии. Версия от 16 октября 2026.',
      en: 'Biography, education and professional background, selected studio projects and engagements. Version dated 16 October 2026.',
    },
    href: '/documents/oda-dream-cv-olga-en.pdf',
    year: 2026,
    pages: 1,
    bytes: 21380,
    rights: 'cleared',
    sha256: '9347564451bf010fceac5a172c76d73a06845412bd3f785a4f9ffe1db8f6e378',
    contentFingerprint: '6c09832eea2aae9c3b8d6830e3f3eb2cd0c0ded14e7f65245ab88b3516c810cd',
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
    asOf: '2026-10-16',
    language: 'ru',
    title: {
      ru: 'CV · Далер Арабов',
      en: 'CV · Daler Arabov',
    },
    description: {
      ru: 'Биография, образование и профессиональный опыт, выбранные проекты и события студии. Версия от 16 октября 2026.',
      en: 'Biography, education and professional background, selected studio projects and engagements. Version dated 16 October 2026.',
    },
    href: '/documents/oda-dream-cv-daler-ru.pdf',
    year: 2026,
    pages: 1,
    bytes: 26715,
    rights: 'cleared',
    sha256: '549c2c5ac15214ec07e0e93a4428dc6bbdf44f91e0d42d3b326196957218b717',
    contentFingerprint: '9c69fa9fc409c19d34610961408a02ae679b7489486e9d7a9f7599641992b609',
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
    asOf: '2026-10-16',
    language: 'en',
    title: {
      ru: 'CV · Далер Арабов',
      en: 'CV · Daler Arabov',
    },
    description: {
      ru: 'Биография, образование и профессиональный опыт, выбранные проекты и события студии. Версия от 16 октября 2026.',
      en: 'Biography, education and professional background, selected studio projects and engagements. Version dated 16 October 2026.',
    },
    href: '/documents/oda-dream-cv-daler-en.pdf',
    year: 2026,
    pages: 1,
    bytes: 21674,
    rights: 'cleared',
    sha256: '084b520c562c169a3e141924e38eedfabc69f56c1c76ad4e934f20821fbc9081',
    contentFingerprint: '9c69fa9fc409c19d34610961408a02ae679b7489486e9d7a9f7599641992b609',
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
