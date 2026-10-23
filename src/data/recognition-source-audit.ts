import type { Recognition, RecognitionDocument } from './site';
import { recognitionSourceSnapshots } from './recognition-source-snapshots';

// Owner decision 2026-10-23: source prefix determines the catalogue. Records
// beginning `ODA -` remain ODA recognitions even when the letter names one
// person; `Далер -` and `Оля -` files remain in the individual CVs.
export const auditedRecognitions: Recognition[] = [
  {
    id: 'rukami-neurosync-2020',
    kind: 'acknowledgement-letter',
    year: 2020,
    title: {
      ru: 'Благодарность проекту NeuroSync · Rukami',
      en: 'Project NeuroSync acknowledgement · Rukami',
    },
    issuer: {
      ru: 'НовГУ · Дом научной коллаборации имени С. В. Ковалевской',
      en: 'Novgorod State University · S. V. Kovalevskaya House of Scientific Collaboration',
    },
    claim: {
      ru: 'Проект NeuroSync из Москвы отмечен за участие в онлайн-фестивале идей и технологий Rukami 5–6 декабря 2020 года.',
      en: 'Project NeuroSync from Moscow was acknowledged for participating in the online Rukami festival of ideas and technology on 5–6 December 2020.',
    },
    recipient: {
      ru: 'Проект NeuroSync, Москва',
      en: 'Project NeuroSync, Moscow',
    },
    event: 'rukami-2020',
    relatedWorks: [],
    contextPath: 'cases/rukami-2020/',
    source: 'Owner-supplied document, visually inspected 2026-10-16; source original retained privately.',
    sourceRefs: [
      {
        file: 'OwnerRecognition/ODA - 2020 Руками - NeuroSync.pdf',
        sha256: 'e7542632fff3734e4027891a7d52464a4e9d28830de2c18d0b7ef42833af696d',
        snapshot: '2026-10-16',
      },
    ],
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    previewSrc: '/images/recognition/rukami-neurosync-2020.webp',
    documentSource: '/images/recognition/rukami-neurosync-2020.webp',
    documentSha256: 'ee71df76bfbc2e508169a337ac92a1655eca15df987dcfd9416c8cc6976006a3',
    width: 1347,
    height: 953,
  },
  {
    id: 'battle-billion-certificate-2024',
    kind: 'acknowledgement-letter',
    year: 2024,
    title: {
      ru: 'Благодарность за интерактивную программу · Битва за миллиард',
      en: 'Interactive programme acknowledgement · Battle for a Billion',
    },
    issuer: {
      ru: 'Оргкомитет III форума «Битва за миллиард»',
      en: 'Third Battle for a Billion forum organising committee',
    },
    claim: {
      ru: 'Документ от 26 ноября 2024 года адресован ODA.dream за участие в качестве партнёра и вклад в интерактивную программу форума. Это отдельный документ к тому же событию, не новая награда.',
      en: 'The document dated 26 November 2024 thanks ODA.dream for its partner contribution to the forum’s interactive programme. It is a second document for the same event, not an additional award.',
    },
    recipient: {
      ru: 'ODA.dream',
      en: 'ODA.dream',
    },
    event: 'battle-billion-2024',
    relatedWorks: ['neuromandala'],
    contextPath: 'cases/battle-billion-2024/',
    source: 'Owner-supplied document, visually inspected 2026-10-16; source original retained privately.',
    sourceRefs: [
      {
        file: 'OwnerRecognition/ODA - 2024 Битва за миллиард ч2-1.png',
        sha256: '239b85b1013fa877a138e1e72b5499597fff2e5aca8a42ee2e97aecf24b141f7',
        snapshot: '2026-10-16',
      },
    ],
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    previewSrc: '/images/recognition/battle-billion-certificate-2024.webp',
    documentSource: '/images/recognition/battle-billion-certificate-2024.webp',
    documentSha256: 'ba6f236014bef1e695d1912d4e7137b362fc43c40723ac68906e01346b3efb13',
    width: 1273,
    height: 1800,
  },
  {
    id: 'hse-illustrated-2025',
    kind: 'acknowledgement-letter',
    year: 2025,
    title: {
      ru: 'Благодарность НИУ ВШЭ · иллюстрированный документ',
      en: 'HSE acknowledgement · illustrated document',
    },
    issuer: {
      ru: 'Институт развития креативных индустрий НИУ ВШЭ',
      en: 'HSE Institute for Creative Industries Development',
    },
    claim: {
      ru: 'Благодарность ODA.dream — Ольге и Далеру Арабовым — за иммерсивную лекцию «Красиво про мозг». Иллюстрированный документ дополняет развёрнутое письмо об этом же участии.',
      en: 'Thanks to ODA.dream — Olga and Daler Arabov — for the immersive lecture Beautiful About the Brain. The illustrated document accompanies the detailed letter for the same engagement.',
    },
    recipient: {
      ru: 'Ольга и Далер Арабовы · ODA.dream',
      en: 'Olga and Daler Arabov · ODA.dream',
    },
    event: 'hse-2025',
    relatedWorks: [],
    contextPath: 'cases/hse-2025/',
    source: 'Owner-supplied document, visually inspected 2026-10-16; source original retained privately.',
    sourceRefs: [
      {
        file: 'OwnerRecognition/ODA - 2025 ВШЭ ч1.jpg',
        sha256: '0f6de70da40811f1d5d3f6ab8b6a77bcec68e014596e349703c31e11978f5707',
        snapshot: '2026-10-16',
      },
    ],
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    previewSrc: '/images/recognition/hse-illustrated-2025.webp',
    documentSource: '/images/recognition/hse-illustrated-2025.webp',
    documentSha256: 'd05fecb036b45d12a5fb5576c49b6f2352a44a4c67cd7efb32439a4b5e795d63',
    width: 641,
    height: 883,
  },
  {
    id: 'ossetia-communication-letter-2025',
    kind: 'acknowledgement-letter',
    year: 2025,
    title: {
      ru: 'Благодарность · Центр межкультурной коммуникации',
      en: 'Acknowledgement · Intercultural Communication Centre',
    },
    issuer: {
      ru: 'Центр эффективной межличностной и межкультурной коммуникации',
      en: 'Centre for Effective Interpersonal and Intercultural Communication',
    },
    claim: {
      ru: 'Письмо дуэту ODA.dream за вклад в проект «Великая Россия» и выставку «Культурный код Северной Осетии» 27–29 октября 2025 года. Это второй отправитель, а не повтор первого письма.',
      en: 'A letter to ODA.dream for contributing to Great Russia and the Cultural Code of North Ossetia exhibition on 27–29 October 2025. It comes from a second issuer and is distinct from the Media Experts Association letter.',
    },
    recipient: {
      ru: 'Дуэт ODA.dream',
      en: 'ODA.dream duo',
    },
    event: 'ossetia-2025',
    relatedWorks: ['cultural-neuro-code'],
    contextPath: 'cases/ossetia-2025/',
    source: 'Owner-supplied document, visually inspected 2026-10-16; source original retained privately.',
    sourceRefs: [
      {
        file: 'OwnerRecognition/ODA - 2025 Северная Осетия - Центр Коммуникации.png',
        sha256: 'bdfc3c144203ecada6e6abb934a0f49f0c6b24b463267449b550fc0113bb68ae',
        snapshot: '2026-10-16',
      },
    ],
    documentState: 'available',
    documentRights: 'cleared',
    publication: 'published',
    previewSrc: '/images/recognition/ossetia-communication-letter-2025.webp',
    documentSource: '/images/recognition/ossetia-communication-letter-2025.webp',
    documentSha256: 'a0546c93eca5b06af918672769b68e87327ac6fc2b694f9f3c39d951de43f878',
    width: 962,
    height: 1344,
  },
  {
    id: 'rukami-daler-certificate-2020',
    kind: 'certificate',
    year: 2020,
    title: {
      ru: 'Сертификат участника · Rukami',
      en: 'Participant certificate · Rukami',
    },
    issuer: {
      ru: 'НовГУ · Дом научной коллаборации имени С. В. Ковалевской',
      en: 'Novgorod State University · S. V. Kovalevskaya House of Scientific Collaboration',
    },
    claim: {
      ru: 'Сертификат подтверждает участие Далера Арабова в онлайн-фестивале Rukami 5–6 декабря 2020 года. Документ хранится в архиве ODA и связан с историческим проектом NeuroSync.',
      en: 'The certificate documents Daler Arabov’s participation in the Rukami online festival on 5–6 December 2020. It is held in the ODA archive and linked to the historical NeuroSync project.',
    },
    recipient: { ru: 'Далер Арабов · проект NeuroSync', en: 'Daler Arabov · NeuroSync project' },
    event: 'rukami-2020',
    relatedWorks: [],
    contextPath: 'cases/rukami-2020/',
    limitations: {
      ru: 'Оригинал проверен в закрытом архиве; публичный скан ещё не подготовлен.',
      en: 'The original was checked in the private archive; a public scan has not been prepared yet.',
    },
    source:
      'Owner-supplied ODA-prefixed document, visually inspected 2026-10-16; source original retained privately.',
    sourceRefs: [recognitionSourceSnapshots['OwnerRecognition/ODA - 2020 Руками - Далер.pdf']],
    documentState: 'missing',
    documentRights: 'cleared',
    documentSource: '',
    publication: 'published',
  },
  {
    id: 'techweek-daler-letter-2024',
    kind: 'acknowledgement-letter',
    year: 2024,
    title: { ru: 'Благодарность · Tech Week', en: 'Acknowledgement · Tech Week' },
    issuer: { ru: 'Tech Week · Корпорация Синергия', en: 'Tech Week · Synergy Corporation' },
    claim: {
      ru: 'Благодарность Далеру Арабову за участие в конференции Tech Week и готовность делиться опытом. На документе указаны Москва и ноябрь 2024 года.',
      en: 'Thanks to Daler Arabov for participating in Tech Week and sharing his experience. The document states Moscow, November 2024.',
    },
    recipient: { ru: 'Далер Арабов · ODA.dream', en: 'Daler Arabov · ODA.dream' },
    event: 'techweek-2024',
    relatedWorks: [],
    contextPath: 'cases/techweek-2024/',
    limitations: {
      ru: 'Оригинал проверен в закрытом архиве; публичный скан ещё не подготовлен.',
      en: 'The original was checked in the private archive; a public scan has not been prepared yet.',
    },
    source:
      'Owner-supplied ODA-prefixed document, visually inspected 2026-10-16; source original retained privately.',
    sourceRefs: [recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 TechWeek - Далер.pdf']],
    documentState: 'missing',
    documentRights: 'cleared',
    documentSource: '',
    publication: 'published',
  },
  {
    id: 'province-code-olga-letter-2024',
    kind: 'acknowledgement-letter',
    year: 2024,
    title: { ru: 'Благодарность · КОД:Провинции', en: 'Acknowledgement · Code of the Province' },
    issuer: {
      ru: 'Инновационный культурный центр и театр «ТЕКТ»',
      en: 'Innovation Cultural Centre and TEKT theatre',
    },
    claim: {
      ru: 'Благодарственное письмо Ольге Арабовой за участие в конференции педагогов и практиков современной хореографии в качестве спикера.',
      en: 'A letter thanking Olga Arabova for speaking at the conference for contemporary choreography teachers and practitioners.',
    },
    recipient: { ru: 'Ольга Арабова · ODA.dream', en: 'Olga Arabova · ODA.dream' },
    event: 'kod-provincii-2024',
    relatedWorks: [],
    contextPath: 'cases/kod-provincii-2024/',
    limitations: {
      ru: 'Оригинал проверен в закрытом архиве; публичный скан ещё не подготовлен.',
      en: 'The original was checked in the private archive; a public scan has not been prepared yet.',
    },
    source:
      'Owner-supplied ODA-prefixed document, visually inspected 2026-10-16; source original retained privately.',
    sourceRefs: [recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 Код провинции - Оля.jpg']],
    documentState: 'missing',
    documentRights: 'cleared',
    documentSource: '',
    publication: 'published',
  },
  {
    id: 'moscow2030-daler-letter-2025',
    kind: 'acknowledgement-letter',
    year: 2025,
    title: { ru: 'Благодарность · Москва 2030', en: 'Acknowledgement · Moscow 2030' },
    issuer: {
      ru: 'Дирекция форума-фестиваля «Территория будущего. Москва 2030»',
      en: 'Directorate of the Territory of the Future: Moscow 2030 forum-festival',
    },
    claim: {
      ru: 'Письмо благодарит Далера Арабова за вклад в подготовку и проведение форума-фестиваля на флагманских площадках Москвы с 1 августа по 14 сентября 2025 года.',
      en: 'The letter thanks Daler Arabov for contributing to preparations and delivery at Moscow flagship venues from 1 August to 14 September 2025.',
    },
    recipient: { ru: 'Далер Арабов · ODA.dream', en: 'Daler Arabov · ODA.dream' },
    event: 'portal-2025',
    relatedWorks: [],
    contextPath: 'cases/portal-2025/',
    limitations: {
      ru: 'Оригинал проверен в закрытом архиве; публичный скан ещё не подготовлен.',
      en: 'The original was checked in the private archive; a public scan has not been prepared yet.',
    },
    source:
      'Owner-supplied ODA-prefixed document, visually inspected 2026-10-16; source original retained privately.',
    sourceRefs: [recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Москва 2030 - Далер.png']],
    documentState: 'missing',
    documentRights: 'cleared',
    documentSource: '',
    publication: 'published',
  },
  ...(['Далер', 'Ольга'] as const).map((person) => {
    const daler = person === 'Далер';
    const file = daler
      ? 'OwnerRecognition/ODA - 2025 Частоты - Далер.jpg'
      : 'OwnerRecognition/ODA - 2025 Частоты - Ольга.jpg';
    const name = daler ? 'Далер Арабов' : 'Ольга Арабова';
    return {
      id: daler ? 'frequencies-daler-certificate-2026' : 'frequencies-olga-certificate-2026',
      kind: 'certificate' as const,
      year: 2026,
      title: {
        ru: 'Справка об участии · «Частоты 6.0»',
        en: 'Participation record · Frequencies 6.0',
      },
      issuer: {
        ru: 'Организаторы выставки «Комиссия по трёхтысячному году»',
        en: 'Organisers of the Commission for the Year Three Thousand exhibition',
      },
      claim: {
        ru: `Справка от 6 февраля 2026 года подтверждает участие ${name} в выставке 16 октября — 30 ноября 2025 года. Это отдельный документ на каждого участника, а не вторая копия одной записи.`,
        en: `A record dated 6 February 2026 confirms ${name}’s participation in the exhibition from 16 October to 30 November 2025. Each participant has a separate document.`,
      },
      recipient: { ru: `${name} · ODA.dream`, en: `${daler ? 'Daler Arabov' : 'Olga Arabov'} · ODA.dream` },
      event: 'frequencies-2025',
      relatedWorks: ['neuromandala'],
      contextPath: 'cases/frequencies-2025/',
      limitations: {
        ru: 'Оригинал проверен в закрытом архиве; публичный скан ещё не подготовлен.',
        en: 'The original was checked in the private archive; a public scan has not been prepared yet.',
      },
      source:
        'Owner-supplied ODA-prefixed document, visually inspected 2026-10-16; source original retained privately.',
      sourceRefs: [recognitionSourceSnapshots[file]],
      documentState: 'missing' as const,
      documentRights: 'cleared' as const,
      documentSource: '',
      publication: 'published' as const,
    };
  }),
];
export const recognitionCorrections: Record<string, Partial<Recognition>> = {
  'battle-billion-certificate-2024': {
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 Битва за миллиард ч2-1.png'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 Битва за миллиард ч2.pdf'],
    ],
  },
  'province-code-letter-2024': {
    sourceRefs: [recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 Код провинции - Далер.jpg']],
  },
  'techweek-letter-2024': {
    sourceRefs: [recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 TechWeek - Оля.pdf']],
  },
  'moscow2030-letter-2025': {
    sourceRefs: [recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Москва 2030 - Ольга.png']],
  },
  'digital-art-ai-2026': {
    event: 'unique-russia-2026',
    contextPath: 'cases/unique-russia-2026/',
    sourceRefs: [
      {
        file: 'OwnerRecognition/ODA - 2026 Гостиный двор.pdf',
        sha256: '1bb44865a5faae1f1eb4e0ed589f28cf68acf719076c20ae757981d35c541c9b',
        snapshot: '2026-10-16',
      },
    ],
  },
  'mipt-letter-2025': {
    event: 'mipt-2025',
    contextPath: 'cases/mipt-2025/',
    relatedWorks: ['neuromandala'],
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Терраформинг МФТИ.pdf'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2026 Терраформинг.pdf'],
    ],
  },
  'portal-2030-2025': {
    event: 'portal-2025',
    contextPath: 'cases/portal-2025/',
    sourceRefs: [
      {
        file: 'OwnerRecognition/ODA - 2025 Портал.png',
        sha256: '9e11de6607ea20ea3179a18260ed58164e29b1459af204686b1a935bf709e46b',
        snapshot: '2026-10-16',
      },
    ],
  },
  'tavrida-letter-2025': {
    event: 'tavrida-ai-2025',
    contextPath: 'cases/tavrida-ai-2025/',
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Таврида ИИ.jpg'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Таврида ИИ.pdf'],
    ],
    limitations: {
      ru: 'Благодарственное письмо участника не является наградой конкурса.',
      en: 'The participant acknowledgement is not a competition award.',
    },
  },
  'hse-letter-2025': {
    event: 'hse-2025',
    contextPath: 'cases/hse-2025/',
    recipient: {
      ru: 'Ольга и Далер Арабовы · ODA.dream',
      en: 'Olga and Daler Arabov · ODA.dream',
    },
    sourceRefs: [
      {
        file: 'OwnerRecognition/ODA - 2025 ВШЭ ч2.jpg',
        sha256: 'abe975e4d33b6307d48da1d3d4f1ee511334b126d95ef82c3d983347dc16cb82',
        snapshot: '2026-10-16',
      },
    ],
  },
  'haskell-letter-2025': {
    sourceRefs: [recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Хаскел.png']],
  },
  'battle-billion-letter-2024': {
    event: 'battle-billion-2024',
    contextPath: 'cases/battle-billion-2024/',
    relatedWorks: ['neuromandala'],
    sourceRefs: [
      {
        file: 'OwnerRecognition/ODA - 2024 Битва за миллиард.pdf',
        sha256: '64a719892978a255c502c48ac523230d8f666f3c7a46162cc10b2f14f43f55db',
        snapshot: '2026-10-16',
      },
    ],
  },
  'wildmint-letter-2025': {
    event: 'wildmint-2025',
    contextPath: 'cases/wildmint-2025/',
    relatedWorks: ['neuromandala'],
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Дикая мята.jpg'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Дикая мята.pdf'],
    ],
  },
  'ossetia-letter-2025': {
    event: 'ossetia-2025',
    contextPath: 'cases/ossetia-2025/',
    relatedWorks: ['cultural-neuro-code'],
    recipient: {
      ru: 'Дуэт ODA.dream',
      en: 'ODA.dream duo',
    },
    sourceRefs: [
      {
        file: 'OwnerRecognition/ODA - 2025 Северная Осетия - Медиа Эксперты.png',
        sha256: '38fc6544c499eb1a92e7b2b46c7e7399f499a2de34f9b5ee756ea51edc67c4fd',
        snapshot: '2026-10-16',
      },
    ],
  },
  'digital-pleinair-certificate-2025': {
    event: 'bashkiria-2025',
    contextPath: 'cases/bashkiria-2025/',
    relatedWorks: [],
    sourceRefs: [
      {
        file: 'OwnerRecognition/ODA - 2025 Шульган Таш.png',
        sha256: '1522f0e3c4f09048eba6c9a8dde7c6ec6d4af92212320450ce4e9155f1dd13aa',
        snapshot: '2026-10-16',
      },
    ],
  },
  'business-awards-letter-2025': {
    event: 'national-business-awards-2025',
    contextPath: 'cases/national-business-awards-2025/',
    limitations: {
      ru: 'Письмо подтверждает помощь в организации Национальной бизнес-премии. Файл назван «ТПП», но сам документ не подтверждает тождество с кейсом Russian Digital Creative; связь с ним не назначена.',
      en: 'The letter confirms support for the National Business Awards. Its filename mentions the Chamber of Commerce, but the document does not establish that this was the Russian Digital Creative event; no such link is assigned.',
    },
    sourceRefs: [
      {
        file: 'OwnerRecognition/ODA - 2025 ТПП.pdf',
        sha256: '6e3e1ac0c2eb6b0bcfb0d4aa7a606cd7ea079b85fd6f6615f5ae6aca958bdd1f',
        snapshot: '2026-10-16',
      },
    ],
  },
  'skolkovo-arttech-2026': {
    recipient: {
      ru: 'Далер и Ольга Арабовы (ODA.dream), Анастасия Митина, Алексей Воробьёв, Виктор Ханженков',
      en: 'Daler and Olga Arabov (ODA.dream), Anastasia Mitina, Alexey Vorobyov, Viktor Khanzhenkov',
    },
    documentSource: '/images/recognition/skolkovo-confirmation-2026.webp',
    previewSrc: '/images/recognition/skolkovo-confirmation-2026.webp',
    documentSha256: '90838bda66c41d301204000994783e87dbe757acd4ad5a99eeedde7969e41368',
    width: 953,
    height: 1348,
    sourceRefs: [
      {
        file: 'OwnerRecognition/ODA - 2026 Cколково - письмо.pdf',
        sha256: '55dae696c6db1a2c903bb8b9c58505cdac501d3a0c609d8c2599f87a2297161d',
        snapshot: '2026-10-16',
      },
      {
        file: 'OwnerRecognition/ODA - 2026 Cколково.jpg',
        sha256: '83ad0e388f7504915678956358167f9dadfeaf22809535871ee4359bbb91df89',
        snapshot: '2026-10-16',
      },
    ],
  },
};

const archiveRoot = 'D:/YandexDisk/_ODA2/Благодарности';
const document = (id: string, file: string, src: string, ru: string, en: string): RecognitionDocument => {
  const sourceKey = `OwnerRecognition/${file}` as keyof typeof recognitionSourceSnapshots;
  return {
    id,
    src,
    label: { ru, en },
    ...(id === 'winner-diploma' ? { toneGamma: 0.72 } : {}),
    cover: ['techweek-olga', 'province-code-olga', 'frequencies-olga', 'rukami-daler-certificate'].includes(
      id,
    ),
    ...(id === 'rukami-daler-certificate' ? { rotation: 90 } : {}),
    sourcePath: `${archiveRoot}/${file}`,
    sourceSha256: recognitionSourceSnapshots[sourceKey]?.sha256,
  };
};

/** Curated credit groups: one event + one recognition form, with every original kept as a page. */
export const recognitionGroups: Record<string, { memberIds: string[] } & Partial<Recognition>> = {
  'rukami-neurosync-2020': {
    memberIds: ['rukami-daler-certificate-2020'],
    event: 'rukami-2020',
    contextPath: 'cases/rukami-2020/',
    documents: [
      {
        id: 'project-participation',
        src: '/images/recognition/rukami-neurosync-2020.webp',
        label: { ru: 'Благодарность проекту NeuroSync', en: 'NeuroSync project acknowledgement' },
      },
      document(
        'rukami-daler-certificate',
        'ODA - 2020 Руками - Далер.pdf',
        '/images/recognition/rukami-daler-certificate-2020.webp',
        'Сертификат Далера',
        'Daler participation certificate',
      ),
    ],
    limitations: undefined,
    recipient: {
      ru: 'Проект NeuroSync и Далер Арабов · ODA.dream',
      en: 'Project NeuroSync and Daler Arabov · ODA.dream',
    },
    claim: {
      ru: 'Благодарность проекту NeuroSync и сертификат участника Далеру Арабову подтверждают одно участие в онлайн-фестивале идей и технологий Rukami 5–6 декабря 2020 года.',
      en: 'The acknowledgement to project NeuroSync and participant certificate to Daler Arabov document the same participation in the Rukami online festival of ideas and technology on 5–6 December 2020.',
    },
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2020 Руками - NeuroSync.pdf'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2020 Руками - Далер.pdf'],
    ],
  },
  'battle-billion-certificate-2024': {
    memberIds: ['battle-billion-letter-2024'],
    event: 'battle-billion-2024',
    contextPath: 'cases/battle-billion-2024/',
    claim: {
      ru: 'Два письма оргкомитета за вклад ODA.dream в интерактивную программу и участие проекта на III форуме «Битва за миллиард» 26 ноября 2024 года.',
      en: 'Two organising-committee letters recognise ODA.dream’s interactive programme contribution and project participation at the third Battle for a Billion forum on 26 November 2024.',
    },
    documents: [
      {
        id: 'project-participation',
        src: '/images/recognition/battle-billion-certificate-2024.webp',
        label: { ru: 'Благодарность за участие проекта', en: 'Project participation acknowledgement' },
      },
      {
        id: 'interactive-programme',
        src: '/images/recognition/battle-billion-letter-2024.webp',
        label: {
          ru: 'Благодарность за интерактивную программу',
          en: 'Interactive programme acknowledgement',
        },
      },
    ],
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 Битва за миллиард.pdf'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 Битва за миллиард ч2-1.png'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 Битва за миллиард ч2.pdf'],
    ],
  },
  'hse-letter-2025': {
    memberIds: ['hse-illustrated-2025'],
    event: 'hse-2025',
    contextPath: 'cases/hse-2025/',
    documents: [
      {
        id: 'detailed-letter',
        src: '/images/recognition/hse-2025.webp',
        label: { ru: 'Развёрнутое письмо', en: 'Detailed letter' },
      },
      {
        id: 'illustrated-letter',
        src: '/images/recognition/hse-illustrated-2025.webp',
        label: { ru: 'Иллюстрированное письмо', en: 'Illustrated letter' },
      },
    ],
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 ВШЭ ч1.jpg'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 ВШЭ ч2.jpg'],
    ],
  },
  'ossetia-letter-2025': {
    memberIds: ['ossetia-communication-letter-2025'],
    event: 'ossetia-2025',
    contextPath: 'cases/ossetia-2025/',
    documents: [
      {
        id: 'media-experts-letter',
        src: '/images/recognition/ossetia-letter-2025.webp',
        label: { ru: 'Благодарность ассоциации «Медиа Эксперты»', en: 'Media Experts Association letter' },
      },
      {
        id: 'communication-centre-letter',
        src: '/images/recognition/ossetia-communication-letter-2025.webp',
        label: { ru: 'Благодарность Центра коммуникации', en: 'Communication Centre letter' },
      },
    ],
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Северная Осетия - Медиа Эксперты.png'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Северная Осетия - Центр Коммуникации.png'],
    ],
  },
  'techweek-letter-2024': {
    memberIds: ['techweek-daler-letter-2024'],
    event: 'techweek-2024',
    contextPath: 'cases/techweek-2024/',
    recipient: { ru: 'Далер и Ольга Арабовы · ODA.dream', en: 'Daler and Olga Arabov · ODA.dream' },
    claim: {
      ru: 'Два благодарственных письма за участие Далера и Ольги Арабовых от ODA.dream в конференции Tech Week и готовность делиться опытом. На документах указаны Москва и ноябрь 2024 года.',
      en: 'Two letters thank Daler and Olga Arabov of ODA.dream for participating in Tech Week and sharing their experience. The documents state Moscow, November 2024.',
    },
    documents: [
      document(
        'techweek-olga',
        'ODA - 2024 TechWeek - Оля.pdf',
        '/images/recognition/techweek-letter-2024.webp',
        'Письмо Ольге',
        'Letter to Olga',
      ),
      document(
        'techweek-daler',
        'ODA - 2024 TechWeek - Далер.pdf',
        '/images/recognition/techweek-daler-letter-2024.webp',
        'Письмо Далеру',
        'Letter to Daler',
      ),
    ],
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 TechWeek - Оля.pdf'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 TechWeek - Далер.pdf'],
    ],
  },
  'province-code-letter-2024': {
    memberIds: ['province-code-olga-letter-2024'],
    event: 'kod-provincii-2024',
    contextPath: 'cases/kod-provincii-2024/',
    recipient: { ru: 'Далер и Ольга Арабовы · ODA.dream', en: 'Daler and Olga Arabov · ODA.dream' },
    claim: {
      ru: 'Два благодарственных письма Далеру и Ольге Арабовым за участие в конференции педагогов и практиков современной хореографии в качестве спикеров.',
      en: 'Two letters thank Daler and Olga Arabov for speaking at the conference for contemporary choreography teachers and practitioners.',
    },
    documents: [
      {
        id: 'province-code-daler',
        src: '/images/recognition/province-code-letter-2024.webp',
        label: { ru: 'Письмо Далеру', en: 'Letter to Daler' },
      },
      document(
        'province-code-olga',
        'ODA - 2024 Код провинции - Оля.jpg',
        '/images/recognition/province-code-olga-letter-2024.webp',
        'Письмо Ольге',
        'Letter to Olga',
      ),
    ],
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 Код провинции - Далер.jpg'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2024 Код провинции - Оля.jpg'],
    ],
  },
  'moscow2030-letter-2025': {
    memberIds: ['moscow2030-daler-letter-2025'],
    event: 'portal-2025',
    contextPath: 'cases/portal-2025/',
    recipient: { ru: 'Далер и Ольга Арабовы · ODA.dream', en: 'Daler and Olga Arabov · ODA.dream' },
    claim: {
      ru: 'Два письма благодарят Далера и Ольгу Арабовых за вклад в подготовку и проведение форума-фестиваля на флагманских площадках Москвы с 1 августа по 14 сентября 2025 года.',
      en: 'Two letters thank Daler and Olga Arabov for contributing to preparations and delivery of the forum-festival at Moscow flagship venues from 1 August to 14 September 2025.',
    },
    documents: [
      {
        id: 'moscow2030-olga',
        cover: true,
        src: '/images/recognition/moscow2030-letter-2025.webp',
        label: { ru: 'Письмо Ольге', en: 'Letter to Olga' },
      },
      document(
        'moscow2030-daler',
        'ODA - 2025 Москва 2030 - Далер.png',
        '/images/recognition/moscow2030-daler-letter-2025.webp',
        'Письмо Далеру',
        'Letter to Daler',
      ),
    ],
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Москва 2030 - Ольга.png'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Москва 2030 - Далер.png'],
    ],
  },
  'frequencies-daler-certificate-2026': {
    memberIds: ['frequencies-olga-certificate-2026'],
    limitations: undefined,
    claim: {
      ru: 'Справки от 6 февраля 2026 года подтверждают участие Далера и Ольги Арабовых в выставке «Комиссия по трёхтысячному году» 16 октября — 30 ноября 2025 года.',
      en: 'Records dated 6 February 2026 confirm Daler and Olga Arabov’s participation in the Commission for the Year Three Thousand exhibition from 16 October to 30 November 2025.',
    },
    recipient: { ru: 'Далер и Ольга Арабовы · ODA.dream', en: 'Daler and Olga Arabov · ODA.dream' },
    documents: [
      document(
        'frequencies-daler',
        'ODA - 2025 Частоты - Далер.jpg',
        '/images/recognition/frequencies-daler-certificate-2026.webp',
        'Справка Далера',
        'Daler participation record',
      ),
      document(
        'frequencies-olga',
        'ODA - 2025 Частоты - Ольга.jpg',
        '/images/recognition/frequencies-olga-certificate-2026.webp',
        'Справка Ольги',
        'Olga participation record',
      ),
    ],
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Частоты - Далер.jpg'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2025 Частоты - Ольга.jpg'],
    ],
  },
  'skolkovo-arttech-2026': {
    memberIds: [],
    documents: [
      document(
        'winner-diploma',
        'ODA - 2026 Cколково.jpg',
        '/images/recognition/skolkovo-winner-2026.webp',
        'Диплом победителя · 1 место',
        'Winner diploma · 1st place',
      ),
      document(
        'team-award-confirmation',
        'ODA - 2026 Cколково - письмо.pdf',
        '/images/recognition/skolkovo-team-award-2026.webp',
        'Подтверждение награждения команды',
        'Team award confirmation',
      ),
    ],
    sourceRefs: [
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2026 Cколково.jpg'],
      recognitionSourceSnapshots['OwnerRecognition/ODA - 2026 Cколково - письмо.pdf'],
    ],
  },
};

export const recognitionCaptionLabels: Record<string, { ru: string; en: string }> = {
  'digital-art-ai-2026': { ru: 'Уникальная Россия', en: 'Unique Russia' },
  'mipt-letter-2025': { ru: 'Терраформинг · МФТИ', en: 'Terraforming · MIPT' },
  'portal-2030-2025': { ru: 'Портал 2030–2050', en: 'Portal 2030–2050' },
  'tavrida-letter-2025': { ru: 'Таврида.АРТ', en: 'Tavrida.ART' },
  'hse-letter-2025': { ru: 'НИУ ВШЭ', en: 'HSE University' },
  'province-code-letter-2024': { ru: 'КОД:Провинции', en: 'KOD:Province' },
  'techweek-letter-2024': { ru: 'Tech Week', en: 'Tech Week' },
  'wildmint-letter-2025': { ru: 'Дикая Мята', en: 'Wild Mint' },
  'haskell-letter-2025': { ru: 'Голос общества', en: 'Voice of Society' },
  'moscow2030-letter-2025': { ru: 'Москва 2030', en: 'Moscow 2030' },
  'ossetia-letter-2025': { ru: 'Культурный код Осетии', en: 'Cultural Code of Ossetia' },
  'digital-pleinair-certificate-2025': { ru: 'Первый цифровой пленэр', en: 'First Digital Plein Air' },
  'business-awards-letter-2025': { ru: 'Национальная бизнес-премия', en: 'National Business Awards' },
  'skolkovo-arttech-2026': { ru: 'ART × TECHNOLOGY · Сколково', en: 'ART × TECHNOLOGY · Skolkovo' },
  'rukami-neurosync-2020': { ru: 'Rukami', en: 'Rukami' },
  'battle-billion-certificate-2024': { ru: 'Битва за миллиард', en: 'Battle for a Billion' },
  'frequencies-daler-certificate-2026': { ru: 'Частоты 6.0', en: 'Frequencies 6.0' },
};
