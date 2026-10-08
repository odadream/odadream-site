import type { Recognition } from './site';
import { sourceSnapshots } from './editorial';
const records = [
  {
    id: 'battle-billion-letter-2024',
    kind: 'acknowledgement-letter',
    year: 2024,
    title: {
      ru: 'Благодарность · Битва за миллиард',
      en: 'Acknowledgement · Battle for a Billion',
    },
    issuer: {
      ru: 'Оргкомитет III форума «Битва за миллиард»',
      en: 'Organising committee of the third Battle for a Billion forum',
    },
    claim: {
      ru: 'Оргкомитет благодарит команду ODA.dream за участие и арт-инсталляцию «Нейромандала», формировавшую коллективный нейропортрет форума.',
      en: 'The committee thanks ODA.dream for participation and the Neuromandala installation forming the forum’s collective neuro-portrait.',
    },
    recipient: {
      ru: 'Команда ODA.dream',
      en: 'ODA.dream team',
    },
    limitations: {
      ru: 'Документ подтверждает указанное участие, не победу в конкурсе или постоянное партнёрство. Год сохранён по документу/архивному контексту.',
      en: 'The document recognises the stated contribution, not a competition win or an ongoing partnership. The year follows the document or archival context.',
    },
    previewSrc: '/images/recognition/battle-billion-letter-2024.webp',
    documentSource: '/images/content/proofs/collab_2024_ODA_Bitva_za_milliard.webp',
    documentSha256: '47b5384dc6ead2c246ea45b9128ea4bdcd13ca4d254f649c2b984006e9a42eb3',
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    relatedWorks: [],
    source:
      'Owner-authorized studio archive material; full migration permission 2026-10-05/07; visually inspected received document',
    sourceFiles: ['hub-letters.md'],
    contextPath: 'cases/#case-battle-billion-2024',
  },
  {
    id: 'province-code-letter-2024',
    kind: 'acknowledgement-letter',
    year: 2024,
    title: {
      ru: 'Благодарность · КОД:Провинции',
      en: 'Acknowledgement · Code of the Province',
    },
    issuer: {
      ru: 'Инновационный культурный центр и театр «ТЕКТ»',
      en: 'Innovation Cultural Centre and TEKT theatre',
    },
    claim: {
      ru: 'Благодарственное письмо Далеру Арабову за участие в конференции педагогов и практиков современной хореографии в качестве спикера.',
      en: 'A letter thanking Daler Arabov for speaking at the conference for contemporary choreography teachers and practitioners.',
    },
    recipient: {
      ru: 'Далер Арабов',
      en: 'Daler Arabov',
    },
    limitations: {
      ru: 'Документ подтверждает указанное участие, не победу в конкурсе или постоянное партнёрство. Год сохранён по документу/архивному контексту.',
      en: 'The document recognises the stated contribution, not a competition win or an ongoing partnership. The year follows the document or archival context.',
    },
    previewSrc: '/images/recognition/province-code-letter-2024.webp',
    documentSource: '/images/content/proofs/collab_2024_ODA_Kod_provintsii_Daler.webp',
    documentSha256: '24805a1c080ff35166ab34fe5f2869ee716d8fc850b290f0d5d9b07a045b8cb0',
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    relatedWorks: [],
    source:
      'Owner-authorized studio archive material; full migration permission 2026-10-05/07; visually inspected received document',
    sourceFiles: ['hub-letters.md'],
  },
  {
    id: 'techweek-letter-2024',
    kind: 'acknowledgement-letter',
    year: 2024,
    title: {
      ru: 'Благодарность · Tech Week',
      en: 'Acknowledgement · Tech Week',
    },
    issuer: {
      ru: 'Tech Week · Корпорация Синергия',
      en: 'Tech Week · Synergy Corporation',
    },
    claim: {
      ru: 'Благодарность Ольге Арабовой за участие в конференции Tech Week и готовность делиться опытом. На документе указано: Москва, ноябрь 2024.',
      en: 'Thanks to Olga Arabov for participating in Tech Week and sharing her experience. The document states Moscow, November 2024.',
    },
    recipient: {
      ru: 'Ольга Арабова',
      en: 'Olga Arabov',
    },
    limitations: {
      ru: 'Документ подтверждает указанное участие, не победу в конкурсе или постоянное партнёрство. Год сохранён по документу/архивному контексту.',
      en: 'The document recognises the stated contribution, not a competition win or an ongoing partnership. The year follows the document or archival context.',
    },
    previewSrc: '/images/recognition/techweek-letter-2024.webp',
    documentSource: '/images/content/proofs/collab_2024_ODA_TechWeek_Olya.webp',
    documentSha256: 'e07601a68edec998e6d0d8f982df6e909ab31494febe39d1531f1d765f93d7f5',
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    relatedWorks: [],
    source:
      'Owner-authorized studio archive material; full migration permission 2026-10-05/07; visually inspected received document',
    sourceFiles: ['hub-letters.md'],
  },
  {
    id: 'wildmint-letter-2025',
    kind: 'acknowledgement-letter',
    year: 2025,
    title: {
      ru: 'Благодарность · Дикая Мята',
      en: 'Acknowledgement · Wild Mint',
    },
    issuer: {
      ru: 'Оргкомитет фестиваля «Дикая Мята»',
      en: 'Wild Mint festival organising committee',
    },
    claim: {
      ru: 'Организаторы благодарят Ольгу и Далера за лекцию и нейроаудиовизуальный перформанс «Нейромандала» на фестивале 13–15 июня 2025.',
      en: 'The organisers thank Olga and Daler for a lecture and Neuromandala neuroaudiovisual performance at the festival on 13–15 June 2025.',
    },
    recipient: {
      ru: 'Ольга и Далер Арабовы',
      en: 'Olga and Daler Arabov',
    },
    limitations: {
      ru: 'Документ подтверждает указанное участие, не победу в конкурсе или постоянное партнёрство. Год сохранён по документу/архивному контексту.',
      en: 'The document recognises the stated contribution, not a competition win or an ongoing partnership. The year follows the document or archival context.',
    },
    previewSrc: '/images/recognition/wildmint-letter-2025.webp',
    documentSource: '/images/content/proofs/collab_2025_ODA_Dikaya_myata.webp',
    documentSha256: '8ee89cc886606fbbccff5bc6c335c5d1500c05bc240a7b9f503ca21fd30e1f90',
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    relatedWorks: [],
    source:
      'Owner-authorized studio archive material; full migration permission 2026-10-05/07; visually inspected received document',
    sourceFiles: ['hub-letters.md'],
  },
  {
    id: 'haskell-letter-2025',
    kind: 'acknowledgement-letter',
    year: 2025,
    title: {
      ru: 'Благодарность · Голос общества',
      en: 'Acknowledgement · Voice of Society',
    },
    issuer: {
      ru: 'Олеся Хаскелл',
      en: 'Olesya Haskell',
    },
    claim: {
      ru: 'Благодарность спикерам Ольге и Далеру Арабовым за экспертизу и вклад в проект «Голос общества». Дата на показанном документе отсутствует.',
      en: 'Thanks to speakers Olga and Daler Arabov for their expertise and contribution to Voice of Society. No date is printed on the displayed document.',
    },
    recipient: {
      ru: 'Ольга и Далер Арабовы',
      en: 'Olga and Daler Arabov',
    },
    limitations: {
      ru: 'Документ подтверждает указанное участие, не победу в конкурсе или постоянное партнёрство. Год сохранён по документу/архивному контексту.',
      en: 'The document recognises the stated contribution, not a competition win or an ongoing partnership. The year follows the document or archival context.',
    },
    previewSrc: '/images/recognition/haskell-letter-2025.webp',
    documentSource: '/images/content/proofs/collab_2025_ODA_Khaskel.webp',
    documentSha256: 'e8870c4d4ed865ba393326d9345c6984a0ff4aa6cfad891be15d8010a7c1174c',
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    relatedWorks: [],
    source:
      'Owner-authorized studio archive material; full migration permission 2026-10-05/07; visually inspected received document',
    sourceFiles: ['hub-letters.md'],
  },
  {
    id: 'moscow2030-letter-2025',
    kind: 'acknowledgement-letter',
    year: 2025,
    title: {
      ru: 'Благодарность · Москва 2030',
      en: 'Acknowledgement · Moscow 2030',
    },
    issuer: {
      ru: 'Дирекция форума-фестиваля «Территория будущего. Москва 2030»',
      en: 'Directorate of the Territory of the Future: Moscow 2030 forum-festival',
    },
    claim: {
      ru: 'Письмо Ольге Арабовой за вклад в подготовку и проведение форума-фестиваля на флагманских площадках Москвы с 1 августа по 14 сентября 2025.',
      en: 'A letter thanking Olga Arabov for contributing to preparations and delivery at Moscow flagship venues from 1 August to 14 September 2025.',
    },
    recipient: {
      ru: 'Ольга Арабова',
      en: 'Olga Arabov',
    },
    limitations: {
      ru: 'Документ подтверждает указанное участие, не победу в конкурсе или постоянное партнёрство. Год сохранён по документу/архивному контексту.',
      en: 'The document recognises the stated contribution, not a competition win or an ongoing partnership. The year follows the document or archival context.',
    },
    previewSrc: '/images/recognition/moscow2030-letter-2025.webp',
    documentSource: '/images/content/proofs/collab_2025_ODA_Moskva_2030_Olga.webp',
    documentSha256: 'e28d2bf234915aa7d81846091a3fd7b0f10568b56d5f0c6da2c8539bc1ace4de',
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    relatedWorks: [],
    source:
      'Owner-authorized studio archive material; full migration permission 2026-10-05/07; visually inspected received document',
    sourceFiles: ['hub-letters.md'],
  },
  {
    id: 'ossetia-letter-2025',
    kind: 'acknowledgement-letter',
    year: 2025,
    title: {
      ru: 'Благодарность · Культурный код Северной Осетии',
      en: 'Acknowledgement · Cultural Code of North Ossetia',
    },
    issuer: {
      ru: 'Международная ассоциация медиа-экспертов',
      en: 'International Association of Media Experts',
    },
    claim: {
      ru: 'Письмо дуэту за вклад в социальный проект «Великая Россия» и мультимедийную выставку «Культурный код Северной Осетии» 27–29 октября 2025.',
      en: 'A letter to the duo for contributing to Great Russia and the Cultural Code of North Ossetia multimedia exhibition on 27–29 October 2025.',
    },
    recipient: {
      ru: 'Ольга и Далер Арабовы',
      en: 'Olga and Daler Arabov',
    },
    limitations: {
      ru: 'Документ подтверждает указанное участие, не победу в конкурсе или постоянное партнёрство. Год сохранён по документу/архивному контексту.',
      en: 'The document recognises the stated contribution, not a competition win or an ongoing partnership. The year follows the document or archival context.',
    },
    previewSrc: '/images/recognition/ossetia-letter-2025.webp',
    documentSource: '/images/content/proofs/collab_2025_ODA_Severnaya_Osetiya_Media_Eksperty.webp',
    documentSha256: 'b064b7e8bcce3470f1231791f8726d8287c5cfad585c47c6454f760ed969bb57',
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    relatedWorks: [],
    source:
      'Owner-authorized studio archive material; full migration permission 2026-10-05/07; visually inspected received document',
    sourceFiles: ['hub-letters.md'],
  },
  {
    id: 'digital-pleinair-certificate-2025',
    kind: 'certificate',
    year: 2025,
    title: {
      ru: 'Свидетельство участия · Первый цифровой пленэр',
      en: 'Participation certificate · First Digital Plein Air',
    },
    issuer: {
      ru: 'Первый цифровой пленэр · ТСХР',
      en: 'First Digital Plein Air · Creative Union of Artists of Russia',
    },
    claim: {
      ru: 'Свидетельство ODA.dream об участии в Первом цифровом пленэре 2025 года в Башкирии, Шульган-Таш.',
      en: 'A certificate of ODA.dream’s participation in the first 2025 Digital Plein Air in Bashkiria, Shulgan-Tash.',
    },
    recipient: {
      ru: 'ODA.dream',
      en: 'ODA.dream',
    },
    limitations: {
      ru: 'Документ подтверждает указанное участие, не победу в конкурсе или постоянное партнёрство. Год сохранён по документу/архивному контексту.',
      en: 'The document recognises the stated contribution, not a competition win or an ongoing partnership. The year follows the document or archival context.',
    },
    previewSrc: '/images/recognition/digital-pleinair-certificate-2025.webp',
    documentSource: '/images/content/proofs/collab_2025_ODA_Shulgan_Tash.webp',
    documentSha256: '1050ac6627ff450549f68506610cb7ccae1565c5a5466e68430a19aa738206bf',
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    relatedWorks: [],
    source:
      'Owner-authorized studio archive material; full migration permission 2026-10-05/07; visually inspected received document',
    sourceFiles: ['hub-letters.md'],
  },
  {
    id: 'business-awards-letter-2025',
    kind: 'acknowledgement-letter',
    year: 2025,
    title: {
      ru: 'Благодарность · Технологии и инновации',
      en: 'Acknowledgement · Technology and Innovation',
    },
    issuer: {
      ru: 'Организаторы Национальной бизнес-премии',
      en: 'National Business Awards organisers',
    },
    claim: {
      ru: 'Благодарственное письмо творческому дуэту за помощь в организации мероприятия «Технологии и инновации» 2025 года. Это благодарность, а не диплом победителя премии.',
      en: 'A letter thanking the creative duo for helping organise the 2025 Technology and Innovation event. It is an acknowledgement, not a winner’s diploma.',
    },
    recipient: {
      ru: 'Ольга и Далер Арабовы',
      en: 'Olga and Daler Arabov',
    },
    limitations: {
      ru: 'Документ подтверждает указанное участие, не победу в конкурсе или постоянное партнёрство. Год сохранён по документу/архивному контексту.',
      en: 'The document recognises the stated contribution, not a competition win or an ongoing partnership. The year follows the document or archival context.',
    },
    previewSrc: '/images/recognition/business-awards-letter-2025.webp',
    documentSource: '/images/content/proofs/collab_2025_ODA_TPP.webp',
    documentSha256: '175aae078338af17519f927c81b9af968a89ee7b5483614424deb09615912ddb',
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    relatedWorks: [],
    source:
      'Owner-authorized studio archive material; full migration permission 2026-10-05/07; visually inspected received document',
    sourceFiles: ['hub-letters.md'],
  },

  {
    year: 2026,
    recipient: {
      ru: 'ODA.dream',
      en: 'ODA.dream',
    },
    documentSource: '',
    documentState: 'missing',
    documentRights: 'review',
    publication: 'published',
    featuredOnHome: false,
    source:
      'Studio source records; owner-authorized full content migration; private correspondence/originals not published',
    id: 'skolkovo-arttech-2026',
    legacyId: 'proof-award-skolkovo-arttech',
    kind: 'award',
    title: {
      ru: 'Первое место · ART × TECHNOLOGY',
      en: 'First place · ART × TECHNOLOGY',
    },
    issuer: {
      ru: 'Технопарк «Сколково»',
      en: 'Skolkovo Technopark',
    },
    claim: {
      ru: 'Карточка результата конкурса в архиве студии фиксирует первое место проекта «Мозг Сколково: Нейропортреты», связанного с «Нейродоской почёта».',
      en: 'The studio’s competition-result record lists first place for Brain of Skolkovo: Neuro-portraits, linked to Neuro Honor Board.',
    },
    limitations: {
      ru: 'Результат конкурса не означает изготовление или открытие инсталляции. Скан наградного документа не приложен; дата результата в архиве — 20 апреля 2026 года.',
      en: 'The competition result does not establish fabrication or opening of the installation. No award scan is attached; the archive gives 20 April 2026 as the result date.',
    },
    relatedWorks: ['honors'],
    sourceFiles: ['proof-award-skolkovo-arttech.md', 'Golem_Skolkovo_2026.md'],
  },
  {
    year: 2026,
    recipient: {
      ru: 'ODA.dream',
      en: 'ODA.dream',
    },
    documentSource: '',
    documentState: 'missing',
    documentRights: 'review',
    publication: 'published',
    featuredOnHome: false,
    source:
      'Studio source records; owner-authorized full content migration; private correspondence/originals not published',
    id: 'culttech-school-grant-2026',
    legacyId: 'proof-award-culttech-vienna',
    kind: 'grant',
    title: {
      ru: 'Грант на обучение · CultTech Lab',
      en: 'School participation grant · CultTech Lab',
    },
    issuer: {
      ru: 'CultTech Association',
      en: 'CultTech Association',
    },
    claim: {
      ru: 'В источнике студии зафиксированы отбор в CultTech Lab 2026 и Participation Grant, покрывающий 100% стоимости School Phase.',
      en: 'The studio source records selection for CultTech Lab 2026 and a Participation Grant covering the full School Phase fee.',
    },
    limitations: {
      ru: 'Это грант на обучение, а не подтверждённый производственный грант €2500. Запланированная премьера «Предков в шуме» не состоялась; работа сохраняет статус внутреннего прототипа. Публичный скан не приложен.',
      en: 'This is a school participation grant, not a confirmed €2,500 production grant. The proposed Ancestors in the Noise premiere did not take place; the work remains an internal prototype. No public scan is attached.',
    },
    relatedWorks: ['ancestors'],
    sourceFiles: ['proof-award-culttech-vienna.md', 'Golem_CultTech_2026.md'],
  },
  {
    year: 2026,
    recipient: {
      ru: 'ODA.dream',
      en: 'ODA.dream',
    },
    documentSource: '',
    documentState: 'missing',
    documentRights: 'review',
    publication: 'published',
    featuredOnHome: false,
    source:
      'Studio source records; owner-authorized full content migration; private correspondence/originals not published',
    id: 'cyens-reserve-2026',
    legacyId: 'proof-press-cyens-cyprus',
    kind: 'selection',
    title: {
      ru: 'Резерв отбора · CYENS WIP',
      en: 'Selection reserve · CYENS WIP',
    },
    issuer: {
      ru: 'CYENS Centre of Excellence',
      en: 'CYENS Centre of Excellence',
    },
    claim: {
      ru: 'Заявки Neuromandala: MindGrid и MindShow рассматривались для фестиваля WIP 2026. В источнике зафиксирован runner-up / резервный список.',
      en: 'Neuromandala: MindGrid and MindShow proposals were considered for WIP 2026. The source records a runner-up / reserve-list status.',
    },
    limitations: {
      ru: 'Runner-up здесь означает резервный отбор, а не второе место на проведённом фестивале. Финальный статус архива от 29 сентября 2026 года — not selected: участие не состоялось. Публичный документ не приложен.',
      en: 'Runner-up here means reserve selection, not second prize at a completed festival. The archive’s final status on 29 September 2026 is not selected: participation did not take place. No public document is attached.',
    },
    relatedWorks: ['mindshow'],
    sourceFiles: ['proof-press-cyens-cyprus.md', 'CYENS_Final_Status_2026.md'],
  },
];
export const archiveRecognitions: Recognition[] = records.map(({ sourceFiles, ...row }) => ({
  ...row,
  kind: row.kind as Recognition['kind'],
  publication: 'published',
  documentRights: row.documentRights as Recognition['documentRights'],
  documentState: row.documentState as Recognition['documentState'],
  sourceRefs: sourceFiles.map((file) => sourceSnapshots[file]),
}));
