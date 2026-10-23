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
    bytes: 28650,
    requiredConfigurations: ['mindshow-installation', 'neurobattle-game'],
    requiredEducationOverview: true,
    requiredPeople: [],
    asOf: '2026-10-23',
    rights: 'cleared',
    sha256: '4e4d514aa0f000a9dd9a2bec0a24f90b695e3bd2bd1025c99d534883beb8cb48',
    contentFingerprint: 'aeee64c12df8dd62aa0e39b453879171cd5e6d383914bcfbe0d19012e5755b67',
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
    bytes: 23191,
    requiredConfigurations: ['mindshow-installation', 'neurobattle-game'],
    requiredEducationOverview: true,
    requiredPeople: [],
    asOf: '2026-10-23',
    rights: 'cleared',
    sha256: '6b7a8855edadcd86ab44425d71ec1caf9a9a7280e77cae9ce3a58cdd2cc0a754',
    contentFingerprint: 'aeee64c12df8dd62aa0e39b453879171cd5e6d383914bcfbe0d19012e5755b67',
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
    asOf: '2026-10-23',
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
    bytes: 26230,
    rights: 'cleared',
    sha256: '99fabef0e4a0d7d1d8340f5b81a44b57aff6dc8766c065171525f39ba7d9999c',
    contentFingerprint: '8f29811340f71ec3d363e893d6605b5044d71663865991f4df1cda7241d8e37b',
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
    asOf: '2026-10-23',
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
    bytes: 21427,
    rights: 'cleared',
    sha256: '0aed3dae1e50206a7ddf5d673804234bb9083db6624b0b6d035adc729804199e',
    contentFingerprint: '8f29811340f71ec3d363e893d6605b5044d71663865991f4df1cda7241d8e37b',
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
    asOf: '2026-10-23',
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
    bytes: 26852,
    rights: 'cleared',
    sha256: 'ddf7810161cd85ba96b5b1ecc5ea930e31ba7e2748ea8abcc281c4eac8fb0861',
    contentFingerprint: 'd8278f737246f28f7575073e7d2fd74821bfc72f17c3dcb7852826737430d5aa',
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
    asOf: '2026-10-23',
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
    bytes: 21768,
    rights: 'cleared',
    sha256: 'e77f2b06d18d5617ce0696f71d3e02d2b7dfcacf60ec6e0c4af89fc5d7a4ddee',
    contentFingerprint: 'd8278f737246f28f7575073e7d2fd74821bfc72f17c3dcb7852826737430d5aa',
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
