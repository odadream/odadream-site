import type { WorkDocument } from './work-details';
import type { Rights } from './site';
import type { SourceReference } from './editorial';

export type DocumentMetadata = Pick<
  WorkDocument,
  'id' | 'title' | 'description' | 'href' | 'year' | 'language' | 'pages' | 'bytes'
>;
export interface ReferenceDocument extends DocumentMetadata {
  kind: 'technical-overview';
  owner: { kind: 'cooperation' | 'studio'; id: string };
  requiredFormats: string[];
  requiredPeople: string[];
  asOf: string;
  rights: Rights;
  sha256: string;
  contentFingerprint: string;
  sourceRefs: SourceReference[];
  source: string;
}

// Prepared from the same typed editorial facts as the HTML. Publication follows
// the owner and all dependencies; authorship of this overview does not publish them.
export const referenceDocuments: ReferenceDocument[] = [
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
    requiredFormats: ['mindshow-installation', 'neurobattle-game', 'talk-workshop'],
    requiredPeople: [],
    asOf: '2026-10-06',
    rights: 'cleared',
    sha256: '93be5b48e1fc658fd60c8d4503772a12f63db9fed0ab15e29517dd70361bae76',
    contentFingerprint: '5882f6f6ccda6e01e17be58626558a9024fa41667af0d2683f97cc13cd2f4310',
    sourceRefs: [
      {
        file: 'mindshow.md',
        sha256: '2f1ec367646d8a7bc439ce55ec4e96454bbec005807d4c535f8335b0e03d5ffa',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-host-events.md',
        sha256: 'ad1457377cb0f05148e726ac485cdfebcbb4ac7fb8886fd933a3a844a27e500e',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-collab.md',
        sha256: '12f7d5307ee36168fca26eeef06ef7545e241ae02327d84b1e72250398ee1fef',
        snapshot: '2026-10-06',
      },
      {
        file: 'neurobattle.md',
        sha256: '4d8e095213544cda0de10d4450ed4f1714a95917b66ef69fadcd3f52655ecc98',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-lectures.md',
        sha256: '8640c12613c002b01bbe5ee7c54bf202d647c979ea4ba3e2f22078d8cfb411f4',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-education.md',
        sha256: '9ddef4b4459c23304b1c5568f08b7c066587043439bf5183caa265b52b4670ae',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-institutions.md',
        sha256: '4c7c7585fca2fd1bcc25a3fb3e8686ffe24015df29e77ed7ec5c0a6f83449cb9',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-galleries.md',
        sha256: '589b5f9d9f1f8358fac90af050129f2f80e7de67ba202882f8e71b39312973ee',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-event-agencies.md',
        sha256: 'a2ad89edc59edfb4486e4a253b8abc1f0dba1da17af009644cd053b515019491',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-business.md',
        sha256: '0707d9a96cf473bd57671644b8250069ef60f2537259381480663e5fb5d73440',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-creators.md',
        sha256: '355a1b04f6fcb97bc7fc82622acf0c403054ecf237b4fee9aac0afec364fdff4',
        snapshot: '2026-10-06',
      },
    ],
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
    requiredFormats: ['mindshow-installation', 'neurobattle-game', 'talk-workshop'],
    requiredPeople: [],
    asOf: '2026-10-06',
    rights: 'cleared',
    sha256: 'f51b66a6d2584fa2e5629a1a31b144b66e0c222a8cff58a2c1391b07b0b2f7fd',
    contentFingerprint: '5882f6f6ccda6e01e17be58626558a9024fa41667af0d2683f97cc13cd2f4310',
    sourceRefs: [
      {
        file: 'mindshow.md',
        sha256: '2f1ec367646d8a7bc439ce55ec4e96454bbec005807d4c535f8335b0e03d5ffa',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-host-events.md',
        sha256: 'ad1457377cb0f05148e726ac485cdfebcbb4ac7fb8886fd933a3a844a27e500e',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-collab.md',
        sha256: '12f7d5307ee36168fca26eeef06ef7545e241ae02327d84b1e72250398ee1fef',
        snapshot: '2026-10-06',
      },
      {
        file: 'neurobattle.md',
        sha256: '4d8e095213544cda0de10d4450ed4f1714a95917b66ef69fadcd3f52655ecc98',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-lectures.md',
        sha256: '8640c12613c002b01bbe5ee7c54bf202d647c979ea4ba3e2f22078d8cfb411f4',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-education.md',
        sha256: '9ddef4b4459c23304b1c5568f08b7c066587043439bf5183caa265b52b4670ae',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-institutions.md',
        sha256: '4c7c7585fca2fd1bcc25a3fb3e8686ffe24015df29e77ed7ec5c0a6f83449cb9',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-galleries.md',
        sha256: '589b5f9d9f1f8358fac90af050129f2f80e7de67ba202882f8e71b39312973ee',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-event-agencies.md',
        sha256: 'a2ad89edc59edfb4486e4a253b8abc1f0dba1da17af009644cd053b515019491',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-business.md',
        sha256: '0707d9a96cf473bd57671644b8250069ef60f2537259381480663e5fb5d73440',
        snapshot: '2026-10-06',
      },
      {
        file: 'hub-creators.md',
        sha256: '355a1b04f6fcb97bc7fc82622acf0c403054ecf237b4fee9aac0afec364fdff4',
        snapshot: '2026-10-06',
      },
    ],
    source:
      'Typed V2 format conditions and cooperation scope; source snapshots recorded in sourceRefs. Authored overview, 2026-10-06.',
  },
];
