export type Lang = 'en' | 'ru';
export type Localized = Record<Lang, string>;
export type Publication = 'draft' | 'review' | 'published';
export type Rights = 'cleared' | 'review' | 'restricted';
export type WorkStatus = 'premiere' | 'evolving' | 'event-format' | 'archive' | 'one-off' | 'research';

export interface Media {
  id: string;
  legacyId?: string;
  src: string;
  mobileSrc?: string;
  width?: number;
  height?: number;
  poster?: string;
  previewSrc?: string;
  alt: Localized;
  caption: Localized;
  rights: Rights;
  source: string;
  kind: 'image' | 'video';
}
export type HeroVisual =
  | {
      id: string;
      mediaId: string;
      target: { kind: 'work'; workId: string; caseId?: string };
    }
  | {
      id: string;
      mediaId: string;
      target: { kind: 'unmapped' };
    };

// Redacted aggregate snapshot only. Never import the catalogue's per-take rows
// or participant data into the public site.
export const minddbSnapshot = {
  asOf: '2026-08-30',
  sessionCount: 150,
  takeCount: 1751,
  videoDurationFileCount: 1348,
  videoDurationHours: 69.8,
  rhythmDistribution: null as null | Record<'theta' | 'alpha' | 'beta' | 'gamma', number>,
  publication: 'review' as Publication,
  privacyReview: 'review' as Publication,
  rhythmNote: {
    en: 'Rhythm distribution is not shown: a verified, consent-cleared aggregate is not available yet.',
    ru: 'Распределение по ритмам пока не показано: проверенная агрегированная статистика с подтверждённым разрешением не подготовлена.',
  } as Localized,
  source: 'MindDB sessions/catalog.json + qc_media_probe_20260830.json; aggregate-only calculation',
};
export interface Work {
  id: string;
  legacyId: string;
  slug: string;
  title: Localized;
  category: Localized;
  summary: Localized;
  experience: Localized;
  question: Localized;
  status: WorkStatus;
  realized: boolean;
  inRepertoire: boolean;
  bookable: boolean;
  rnd: boolean;
  availability: Localized;
  facts: Record<Lang, string[]>;
  media: string[];
  cases: string[];
  formats: string[];
  source: string;
  publication: Publication;
}
export interface Format {
  id: string;
  legacyId: string;
  slug: string;
  title: Localized;
  summary: Localized;
  scope: Localized;
  works: string[];
  source: string;
  publication: Publication;
}
export interface CaseEvent {
  id: string;
  legacyId: string;
  slug: string;
  title: Localized;
  summary: Localized;
  date: string;
  place: Localized;
  role: Localized;
  work: string;
  organizations: string[];
  evidence: string[];
  media: string[];
  source: string;
  publication: Publication;
}
export interface Evidence {
  id: string;
  legacyId: string;
  kind: 'event-record' | 'document' | 'press';
  title: Localized;
  source: string;
  permission: Rights;
}
export type RecognitionKind = 'award' | 'certificate' | 'acknowledgement-letter';
export interface Recognition {
  id: string;
  legacyId: string;
  kind: RecognitionKind;
  title: Localized;
  issuer: Localized;
  year: number;
  featuredOnHome?: boolean;
  event?: string;
  source: string;
  documentSource: string;
  publication: Publication;
  documentRights: Rights;
}
export interface Person {
  id: string;
  legacyId?: string;
  name: Localized;
  role: Localized;
  source: string;
  publication: Publication;
}
export interface Organization {
  id: string;
  legacyId: string;
  name: Localized;
  role: 'venue' | 'organizer' | 'client' | 'co-producer' | 'technology';
  source: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  languages: Lang[];
  source: string;
}

// Profile URLs recovered from the previous public site. VK remains intentionally
// omitted until an official profile URL is confirmed (a post URL is not a profile).
export const socialLinks: SocialLink[] = [
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/odadream_info',
    languages: ['en', 'ru'],
    source: 'previous src/data/contacts.ts',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@odadreamart',
    languages: ['en'],
    source: 'previous src/data/contacts.ts',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/odadream/',
    languages: ['en', 'ru'],
    source: 'previous public JSON-LD',
  },
  {
    id: 'dzen',
    label: 'Дзен',
    href: 'https://dzen.ru/odadream',
    languages: ['ru'],
    source: 'previous src/data/contacts.ts',
  },
];

export const media: Media[] = [
  {
    id: 'neuromandala-terra',
    src: '/video/hero/terra-preview.mp4',
    poster: '/video/hero/terra-poster.webp',
    previewSrc: '/video/hero/terra-preview.mp4',
    width: 1280,
    height: 720,
    alt: {
      en: 'Neuromandala visual field: Terraforming',
      ru: 'Визуальное поле Нейромандалы: «Терраформинг»',
    },
    caption: { en: 'Terraforming · mandala display', ru: '«Терраформинг» · экран мандалы' },
    rights: 'review',
    source: 'D:/YandexDisk/_ODA2/Сайт/odadream-presentation/public/images/nodes/mandala_terra.mp4',
    kind: 'video',
  },
  {
    id: 'neuromandala-frequencies',
    src: '/video/hero/frequencies-preview.mp4',
    poster: '/video/hero/frequencies-poster.webp',
    previewSrc: '/video/hero/frequencies-preview.mp4',
    width: 1280,
    height: 720,
    alt: { en: 'MindGrid visual field: Frequencies', ru: 'Визуальное поле MindGrid: «Частоты»' },
    caption: { en: 'Frequencies · MindGrid, first minute', ru: '«Частоты» · MindGrid, первая минута' },
    rights: 'review',
    source: 'D:/YandexDisk/_ODA2/Сайт/odadream-presentation/public/images/nodes/grid.mp4',
    kind: 'video',
  },
  {
    id: 'neuromandala-mindshow',
    src: '/video/hero/mindshow-preview.mp4',
    poster: '/video/hero/mindshow-poster.webp',
    previewSrc: '/video/hero/mindshow-preview.mp4',
    width: 1080,
    height: 1080,
    alt: { en: 'Neuromandala sequence from MindShow', ru: 'Последовательность Нейромандалы в MindShow' },
    caption: { en: 'MindShow · audiovisual session', ru: 'MindShow · аудиовизуальная сессия' },
    rights: 'review',
    source: 'D:/YandexDisk/_ODA2/_Photos Various/Мандалы/Neuromandala Show.mp4',
    kind: 'video',
  },
  {
    id: 'neuromandala-cultural-code',
    src: '/video/hero/cultural-code-preview.mp4',
    poster: '/video/hero/cultural-code-poster.webp',
    previewSrc: '/video/hero/cultural-code-preview.mp4',
    width: 1280,
    height: 720,
    alt: { en: 'Neuromandala ornament visual', ru: 'Орнаментальная визуализация Нейромандалы' },
    caption: { en: 'Cultural Code · Ossetia', ru: '«Культурный код» · Осетия' },
    rights: 'review',
    source: 'D:/YandexDisk/_ODA2/События/25-10-27 Осетия Плешка/Export/2_ornament_center_1080p.mp4',
    kind: 'video',
  },
  {
    id: 'neuromandala-kovylina',
    src: '/video/hero/kovylina-preview.mp4',
    poster: '/video/hero/kovylina-poster.webp',
    previewSrc: '/video/hero/kovylina-preview.mp4',
    width: 1280,
    height: 720,
    alt: { en: 'Neuromandala session with Elena Kovylina', ru: 'Сессия Нейромандалы с Еленой Ковылиной' },
    caption: { en: 'Neuromandala · Elena Kovylina session', ru: 'Нейромандала · сессия Елены Ковылиной' },
    rights: 'review',
    source: 'D:/YandexDisk/_ODA2/События/26-06-08 Ковылина Тест/Exports/04_193527_Елена.mp4',
    kind: 'video',
  },
  {
    id: 'interference-stage',
    previewSrc: '/video/interference-dawn.mp4',
    src: '/images/content/events/interference-2026/interference-2026-01.webp',
    mobileSrc: '/images/content/events/interference-2026/interference-2026-01-mobile.webp',
    width: 1732,
    height: 1155,
    alt: {
      en: 'Performers on stage during Interference of Realities',
      ru: 'Артисты на сцене «Интерференции реальностей»',
    },
    caption: {
      en: 'Interference of Realities · Kaluga, 2026',
      ru: '«Интерференция реальностей» · Калуга, 2026',
    },
    rights: 'review',
    source: 'src/content/interference.md; event-tsiolkovsky-2026',
    kind: 'image',
  },
  {
    id: 'mindshow',
    src: '/images/content/mindshow_mdsh_v5.webp',
    alt: { en: 'Generative visuals from MindShow', ru: 'Генеративная графика MindShow' },
    caption: { en: 'MindShow · audiovisual study', ru: 'MindShow · аудиовизуальный этюд' },
    rights: 'review',
    source: 'src/content/mindshow.md',
    kind: 'image',
  },
  {
    id: 'neurobattle',
    src: '/images/content/neurobattle_gameplay.webp',
    alt: { en: 'Neurobattle game screen', ru: 'Экран игры «Нейробитва»' },
    caption: { en: 'Neurobattle · game interface', ru: '«Нейробитва» · игровой интерфейс' },
    rights: 'review',
    source: 'src/content/neurobattle.md',
    kind: 'image',
  },
  {
    id: 'schrodinger',
    src: '/images/content/events/schrodinger-2025/schrodinger-2025-01.webp',
    alt: { en: 'Project Schrödinger laboratory performance', ru: 'Лабораторный показ «Проекта Шрёдингер»' },
    caption: { en: 'Project Schrödinger · Kaluga, 2025', ru: '«Проект Шрёдингер» · Калуга, 2025' },
    rights: 'review',
    source: 'src/content/schrodinger.md',
    kind: 'image',
  },
  {
    id: 'rings',
    src: '/images/content/materia/oda-rings/oda-rings-cover.webp',
    alt: { en: 'ODA.dream rings', ru: 'Кольца ODA.dream' },
    caption: { en: 'ODA.dream Rings · object', ru: 'Кольца ODA.dream · объект' },
    rights: 'review',
    source: 'src/content/oda-rings.md',
    kind: 'image',
  },
  {
    id: 'sync',
    src: '/images/content/works/sync-circle/sync-circle-hero.webp',
    alt: { en: 'Sync Circle concept rendering', ru: 'Концептуальная визуализация «Круга синхронизации»' },
    caption: {
      en: 'Sync Circle · concept rendering, not installation documentation',
      ru: '«Круг синхронизации» · концептуальная визуализация, не документация инсталляции',
    },
    rights: 'review',
    source: 'src/content/sync-circle.md',
    kind: 'image',
  },
  {
    id: 'neurobattle-dano',
    src: '/images/content/neurobattle_dano.webp',
    alt: { en: 'Neurobattle at DANO', ru: '«Нейробитва» на DANO' },
    caption: { en: 'DANO · Moscow, 2025', ru: 'DANO · Москва, 2025' },
    rights: 'review',
    source: 'src/content/event-dano-ekoniva-2025.md',
    kind: 'image',
  },
];

export const heroVisuals: HeroVisual[] = [
  {
    id: 'terra',
    mediaId: 'neuromandala-terra',
    target: { kind: 'unmapped' },
  },
  {
    id: 'frequencies',
    mediaId: 'neuromandala-frequencies',
    target: { kind: 'work', workId: 'mindshow' },
  },
  {
    id: 'mindshow',
    mediaId: 'neuromandala-mindshow',
    target: { kind: 'work', workId: 'mindshow', caseId: 'byob-2026' },
  },
  {
    id: 'cultural-code',
    mediaId: 'neuromandala-cultural-code',
    target: { kind: 'unmapped' },
  },
  {
    id: 'kovylina',
    mediaId: 'neuromandala-kovylina',
    target: { kind: 'unmapped' },
  },
];

export const workStatusLabels: Record<WorkStatus, Localized> = {
  premiere: { en: 'Premiered · 2026', ru: 'Премьера · 2026' },
  evolving: { en: 'Evolving work', ru: 'Развивающаяся работа' },
  'event-format': { en: 'Event format', ru: 'Событийный формат' },
  archive: { en: 'Archive · not in repertoire', ru: 'Архив · не в репертуаре' },
  'one-off': { en: 'One-off object', ru: 'Единичный объект' },
  research: { en: 'R&D · concept', ru: 'R&D · концепция' },
};

export const works: Work[] = [
  {
    id: 'interference',
    legacyId: 'interference',
    slug: 'interference-of-realities',
    title: { en: 'Interference of Realities', ru: 'Интерференция реальностей' },
    category: { en: 'Participatory performance', ru: 'Партисипаторный спектакль' },
    summary: {
      en: 'A live performance-lecture assembled with its audience beside a parallel virtual stage.',
      ru: 'Живой спектакль-лекция, который собирается вместе со зрителями рядом с параллельной виртуальной сценой.',
    },
    experience: {
      en: 'Spectators contribute choices, movement and stories to five scenes; the virtual stage never fully explains what it shares with the physical one.',
      ru: 'Зрители участвуют в создании пяти сцен через выбор, движение и истории; виртуальная сцена не объясняет до конца свою связь с физической.',
    },
    question: {
      en: 'When two realities seem to converge, is that connection measured, performed or imagined?',
      ru: 'Когда две реальности кажутся связанными, эта связь измерена, разыграна или воображена?',
    },
    status: 'premiere',
    realized: true,
    inRepertoire: false,
    bookable: false,
    rnd: false,
    availability: {
      en: 'Seeking presenting venues and development partners; not a standing repertory production.',
      ru: 'Ищем площадки и партнёров для развития; спектакль пока не в постоянном репертуаре.',
    },
    facts: {
      en: [
        '16 May 2026 · Kaluga',
        'Co-production with Innovation Ballet Theatre',
        'Technology partner: Neiry Group',
      ],
      ru: [
        '16 мая 2026 · Калуга',
        'Совместная постановка с Инновационным театром балета',
        'Технологический партнёр: Neiry Group',
      ],
    },
    media: ['interference-stage'],
    cases: ['tsiolkovsky-2026'],
    formats: [],
    source: 'src/content/interference.md',
    publication: 'review',
  },
  {
    id: 'mindshow',
    legacyId: 'mindshow',
    slug: 'mindshow',
    title: { en: 'MindShow', ru: 'Майнд-шоу' },
    category: { en: 'Interactive installation-performance', ru: 'Интерактивная инсталляция-перформанс' },
    summary: {
      en: 'A participant’s state and narrative become a personal audiovisual composition.',
      ru: 'Состояние и рассказ участника становятся личной аудиовизуальной композицией.',
    },
    experience: {
      en: 'A short EEG session and a spoken story shape a generative visual sequence, later shared as an object for reflection.',
      ru: 'Короткая сессия с ЭЭГ и устный рассказ формируют генеративную визуальную последовательность — объект для последующего размышления.',
    },
    question: {
      en: 'What changes when a person is simultaneously material, co-author and observer?',
      ru: 'Что меняется, когда человек становится одновременно материалом, соавтором и наблюдателем?',
    },
    status: 'evolving',
    realized: true,
    inRepertoire: false,
    bookable: true,
    rnd: false,
    availability: {
      en: 'Adaptable installation format; technical scope and rights confirmed per commission.',
      ru: 'Адаптируемый инсталляционный формат; технический состав и права уточняются для каждого заказа.',
    },
    facts: {
      en: ['Public presentations since 2019', 'BYOB 2026 · Moscow', 'Individual EEG and narrative input'],
      ru: ['Публичные показы с 2019 года', 'BYOB 2026 · Москва', 'Индивидуальный ввод ЭЭГ и рассказа'],
    },
    media: ['mindshow'],
    cases: ['byob-2026'],
    formats: ['mindshow-installation'],
    source: 'src/content/mindshow.md',
    publication: 'review',
  },
  {
    id: 'neurobattle',
    legacyId: 'neurobattle',
    slug: 'neurobattle',
    title: { en: 'Neurobattle', ru: 'Нейробитва' },
    category: { en: 'Participatory game', ru: 'Партисипаторная игра' },
    summary: {
      en: 'A two-person contest where attention and calm move a shared virtual object.',
      ru: 'Поединок двух участников, в котором внимание и спокойствие движут общим виртуальным объектом.',
    },
    experience: {
      en: 'Players discover the rules through a short live round while spectators read the changing visual field.',
      ru: 'Участники осваивают правила в коротком живом раунде, а зрители наблюдают меняющееся визуальное поле.',
    },
    question: {
      en: 'Can a contest reward the capacity to regulate oneself rather than force?',
      ru: 'Может ли соревнование вознаграждать саморегуляцию, а не силу?',
    },
    status: 'event-format',
    realized: true,
    inRepertoire: false,
    bookable: true,
    rnd: false,
    availability: {
      en: 'Available as an adapted event format; venue, display and staffing are scoped separately.',
      ru: 'Доступна адаптация для событий; площадка, экран и персонал согласуются отдельно.',
    },
    facts: {
      en: ['Two players per round', 'Approx. 90-second round', 'DANO Olympiad · Moscow, 2025'],
      ru: ['Два игрока в раунде', 'Около 90 секунд на раунд', 'Олимпиада DANO · Москва, 2025'],
    },
    media: ['neurobattle'],
    cases: ['dano-2025'],
    formats: ['neurobattle-game'],
    source: 'src/content/neurobattle.md',
    publication: 'review',
  },
  {
    id: 'schrodinger',
    legacyId: 'schrodinger',
    slug: 'project-schrodinger',
    title: { en: 'Project Schrödinger', ru: 'Проект Шрёдингер' },
    category: { en: 'Laboratory performance', ru: 'Лабораторный перформанс' },
    summary: {
      en: 'A theatre laboratory where collective biometric signals enter the visual field.',
      ru: 'Театральная лаборатория, в которой коллективные биометрические сигналы входят в визуальное поле.',
    },
    experience: {
      en: 'Audience and dancers exchange sensors, making each encounter with the performance singular.',
      ru: 'Зрители и танцовщики обмениваются сенсорами, поэтому каждый показ складывается по-своему.',
    },
    question: {
      en: 'Can theatre act as a live biofeedback protocol rather than illustrate a fixed plot?',
      ru: 'Может ли театр быть живым протоколом обратной связи, а не иллюстрацией готового сюжета?',
    },
    status: 'archive',
    realized: true,
    inRepertoire: false,
    bookable: false,
    rnd: false,
    availability: {
      en: 'Archive work; not currently in repertoire.',
      ru: 'Архивная работа; сейчас не в репертуаре.',
    },
    facts: {
      en: [
        '22 May 2025 · Kaluga',
        'Open laboratory at Tsiolkovsky Festival',
        'With Innovation Ballet Theatre',
      ],
      ru: [
        '22 мая 2025 · Калуга',
        'Открытая лаборатория фестиваля Циолковского',
        'Совместно с Инновационным театром балета',
      ],
    },
    media: ['schrodinger'],
    cases: ['tsiolkovsky-2025'],
    formats: [],
    source: 'src/content/schrodinger.md',
    publication: 'review',
  },
  {
    id: 'rings',
    legacyId: 'oda-rings',
    slug: 'oda-rings',
    title: { en: 'ODA.dream Rings', ru: 'Кольца ODA.dream' },
    category: { en: 'Material object', ru: 'Материальный объект' },
    summary: {
      en: 'A founding pair of rings engraved with traces of two alpha rhythms.',
      ru: 'Пара колец, с которой началась история студии: в металле запечатлены следы двух альфа-ритмов.',
    },
    experience: {
      en: 'An intimate signal becomes a durable, wearable object.',
      ru: 'Личный сигнал становится долговечным предметом, который можно носить.',
    },
    question: {
      en: 'How can a measured moment become a shared material memory?',
      ru: 'Как измеренный момент может стать общей материальной памятью?',
    },
    status: 'one-off',
    realized: true,
    inRepertoire: false,
    bookable: false,
    rnd: false,
    availability: {
      en: 'Original work, not an off-the-shelf product; commissions discussed individually.',
      ru: 'Авторская работа, не серийный товар; новые заказы обсуждаются отдельно.',
    },
    facts: {
      en: ['Founding object', 'Gold engraving from EEG rhythms'],
      ru: ['Объект, связанный с основанием студии', 'Гравировка по ритмам ЭЭГ на золоте'],
    },
    media: ['rings'],
    cases: [],
    formats: [],
    source: 'src/content/oda-rings.md',
    publication: 'review',
  },
  {
    id: 'sync',
    legacyId: 'sync-circle',
    slug: 'sync-circle',
    title: { en: 'Sync Circle', ru: 'Круг синхронизации' },
    category: { en: 'Art-research concept', ru: 'Художественно-исследовательская концепция' },
    summary: {
      en: 'A proposed group installation that makes patterns of collective attention visible.',
      ru: 'Проект групповой инсталляции, визуализирующей рисунок коллективного внимания.',
    },
    experience: {
      en: 'Participants would sit in a circle while a shared visual field responds to changing EEG signals.',
      ru: 'Участники располагаются по кругу, а общее визуальное поле реагирует на меняющиеся сигналы ЭЭГ.',
    },
    question: {
      en: 'What forms might shared attention take without claiming to measure human connection itself?',
      ru: 'Какую форму может принять совместное внимание, не претендуя на измерение человеческой близости?',
    },
    status: 'research',
    realized: false,
    inRepertoire: false,
    bookable: false,
    rnd: true,
    availability: {
      en: 'Not a completed installation or bookable format; development conversation only.',
      ru: 'Не реализованная инсталляция и не готовый формат заказа; возможно обсуждение разработки.',
    },
    facts: {
      en: ['Concept and technical study', 'Visual shown is a rendering'],
      ru: ['Концепция и техническое исследование', 'Изображение — концептуальная визуализация'],
    },
    media: ['sync'],
    cases: [],
    formats: [],
    source: 'src/content/sync-circle.md',
    publication: 'review',
  },
];

export const formats: Format[] = [
  {
    id: 'mindshow-installation',
    legacyId: 'mindshow',
    slug: 'mindshow-installation',
    title: { en: 'MindShow installation', ru: 'Инсталляция MindShow' },
    summary: {
      en: 'A participant-led audiovisual encounter for exhibitions and events.',
      ru: 'Аудиовизуальный опыт, создаваемый участником, для выставок и событий.',
    },
    scope: {
      en: 'Requires a dedicated area, display, EEG equipment and an operator; final configuration depends on the venue.',
      ru: 'Нужны отдельная зона, экран, ЭЭГ-оборудование и оператор; итоговая конфигурация зависит от площадки.',
    },
    works: ['mindshow'],
    source: 'src/content/hub-collab.md; mindshow.md',
    publication: 'review',
  },
  {
    id: 'neurobattle-game',
    legacyId: 'neurobattle',
    slug: 'neurobattle-game',
    title: { en: 'Neurobattle game', ru: 'Игра «Нейробитва»' },
    summary: {
      en: 'Short, legible two-person rounds for a live audience.',
      ru: 'Короткие понятные поединки двух участников перед зрителями.',
    },
    scope: {
      en: 'Requires screen or projector, two seats, power and ODA.dream operators; venue production is not included by default.',
      ru: 'Нужны экран или проектор, два места, питание и операторы ODA.dream; производство площадки не включено по умолчанию.',
    },
    works: ['neurobattle'],
    source: 'src/content/hub-collab.md; neurobattle.md',
    publication: 'review',
  },
  {
    id: 'talk-workshop',
    legacyId: 'hub-lectures',
    slug: 'talk-workshop',
    title: { en: 'Talk or workshop', ru: 'Лекция или практикум' },
    summary: {
      en: 'A situated conversation about art, perception and neurotechnology.',
      ru: 'Разговор об искусстве, восприятии и нейротехнологиях в контексте вашей программы.',
    },
    scope: {
      en: 'Topic, duration, demonstration and recording permissions are agreed for each invitation.',
      ru: 'Тема, длительность, демонстрация и разрешения на запись согласуются для каждого приглашения.',
    },
    works: [],
    source: 'src/content/hub-collab.md',
    publication: 'review',
  },
];

export const organizations: Organization[] = [
  {
    id: 'ikc',
    legacyId: 'org-ikc',
    name: { en: 'Innovation Cultural Center', ru: 'Инновационный культурный центр' },
    role: 'venue',
    source: 'event-tsiolkovsky-2026.md',
  },
  {
    id: 'itb',
    legacyId: 'collab-itb',
    name: { en: 'Innovation Ballet Theatre', ru: 'Инновационный театр балета' },
    role: 'co-producer',
    source: 'interference.md',
  },
  {
    id: 'neiry',
    legacyId: 'org-neiry',
    name: { en: 'Neiry Group', ru: 'Neiry Group' },
    role: 'technology',
    source: 'interference.md',
  },
  {
    id: 'ekoniva',
    legacyId: 'org-ekoniva',
    name: { en: 'EkoNiva', ru: 'ЭкоНива' },
    role: 'client',
    source: 'event-dano-ekoniva-2025.md',
  },
  {
    id: 'hse',
    legacyId: 'org-hse',
    name: { en: 'HSE University', ru: 'НИУ ВШЭ' },
    role: 'organizer',
    source: 'event-dano-ekoniva-2025.md',
  },
  {
    id: 'tbank',
    legacyId: 'org-tbank',
    name: { en: 'T-Bank', ru: 'Т-Банк' },
    role: 'organizer',
    source: 'event-dano-ekoniva-2025.md',
  },
];

export const evidence: Evidence[] = [
  {
    id: 'tsiolkovsky-2026-record',
    legacyId: 'event-tsiolkovsky-2026',
    kind: 'event-record',
    title: { en: 'Festival event record, 2026', ru: 'Запись о фестивальном показе, 2026' },
    source: 'src/content/event-tsiolkovsky-2026.md',
    permission: 'cleared',
  },
  {
    id: 'tsiolkovsky-2025-record',
    legacyId: 'event-tsiolkovsky-2025',
    kind: 'event-record',
    title: { en: 'Festival laboratory record, 2025', ru: 'Запись о фестивальной лаборатории, 2025' },
    source: 'src/content/event-tsiolkovsky-2025.md',
    permission: 'cleared',
  },
  {
    id: 'dano-2025-record',
    legacyId: 'event-dano-ekoniva-2025',
    kind: 'event-record',
    title: { en: 'DANO event record, 2025', ru: 'Запись о событии DANO, 2025' },
    source: 'src/content/event-dano-ekoniva-2025.md',
    permission: 'cleared',
  },
  {
    id: 'byob-2026-record',
    legacyId: 'event-byob-2026',
    kind: 'event-record',
    title: { en: 'BYOB event record, 2026', ru: 'Запись о событии BYOB, 2026' },
    source: 'src/content/event-byob-2026.md',
    permission: 'cleared',
  },
];

// Transcribed from the previous site's public archive. Kept out of public
// rendering until issuer/date/event details and scan permissions are reviewed.
export const recognitions: Recognition[] = [
  {
    id: 'digital-art-ai-2026',
    legacyId: 'recognition-digital-art-ai-2026',
    kind: 'certificate',
    year: 2026,
    featuredOnHome: true,
    title: { en: 'Diploma · Digital Art & AI panel', ru: 'Диплом · панель «Цифровое искусство и ИИ»' },
    issuer: { en: 'Unique Russia · Gostiny Dvor', ru: 'Уникальная Россия · Гостиный двор' },
    source: 'previous src/content/hub-letters.md',
    documentSource: '/images/content/proofs/collab_2026_ODA_Gostinyy_dvor.webp',
    publication: 'review',
    documentRights: 'review',
  },
  {
    id: 'mipt-letter-2025',
    legacyId: 'proof-mipt-letter',
    kind: 'acknowledgement-letter',
    year: 2025,
    featuredOnHome: true,
    title: { en: 'Letter of recognition', ru: 'Благодарственное письмо' },
    issuer: {
      en: 'Moscow Institute of Physics and Technology',
      ru: 'Московский физико-технический институт',
    },
    source: 'previous src/content/hub-letters.md',
    documentSource: '/images/proofs/proof-mipt-letter.webp',
    publication: 'review',
    documentRights: 'review',
  },
  {
    id: 'portal-2030-2025',
    legacyId: 'recognition-portal-2030-2025',
    kind: 'award',
    year: 2025,
    featuredOnHome: false,
    title: { en: 'Diploma · Portal 2030–2050, “Visioning”', ru: 'Диплом · Портал 2030–2050, «Виджеинг»' },
    issuer: { en: 'Moscow 2030', ru: 'Москва 2030' },
    source: 'previous src/content/hub-letters.md; award wording requires source review',
    documentSource: '/images/content/proofs/collab_2025_ODA_Portal.webp',
    publication: 'review',
    documentRights: 'review',
  },
  {
    id: 'tavrida-letter-2025',
    legacyId: 'recognition-tavrida-2025',
    kind: 'acknowledgement-letter',
    year: 2025,
    featuredOnHome: true,
    title: {
      en: 'Letter of appreciation · Cultural Code of Russia',
      ru: 'Благодарность · «Культурный код России»',
    },
    issuer: { en: 'Tavrida.ART', ru: 'Таврида.АРТ' },
    source: 'previous src/content/hub-letters.md',
    documentSource: '/images/content/proofs/collab_2025_ODA_Tavrida_II.webp',
    publication: 'review',
    documentRights: 'review',
  },
  {
    id: 'hse-letter-2025',
    legacyId: 'proof-let-hse-beautiful-brain',
    kind: 'acknowledgement-letter',
    year: 2025,
    featuredOnHome: true,
    title: {
      en: 'Letter of appreciation · Beautiful About the Brain',
      ru: 'Благодарность · «Красиво про мозг»',
    },
    issuer: { en: 'HSE University', ru: 'НИУ ВШЭ' },
    source: 'previous src/content/hub-letters.md',
    documentSource: '/images/content/proofs/collab_2025_ODA_VShE_ch2.webp',
    publication: 'review',
    documentRights: 'review',
  },
];

export const cases: CaseEvent[] = [
  {
    id: 'tsiolkovsky-2026',
    legacyId: 'event-tsiolkovsky-2026',
    slug: 'tsiolkovsky-festival-2026',
    title: { en: 'Interference at Tsiolkovsky Festival', ru: '«Интерференция» на фестивале Циолковского' },
    summary: {
      en: 'Opening performance and premiere of Interference of Realities.',
      ru: 'Открывающий спектакль и премьера «Интерференции реальностей».',
    },
    date: '2026-05-16',
    place: { en: 'Kaluga · Innovation Cultural Center', ru: 'Калуга · Инновационный культурный центр' },
    role: {
      en: 'ODA.dream: art direction and technology; co-production with Innovation Ballet Theatre.',
      ru: 'ODA.dream: художественное руководство и технологии; совместная постановка с Инновационным театром балета.',
    },
    work: 'interference',
    organizations: ['ikc', 'itb', 'neiry'],
    evidence: ['tsiolkovsky-2026-record'],
    media: ['interference-stage'],
    source: 'src/content/event-tsiolkovsky-2026.md',
    publication: 'review',
  },
  {
    id: 'tsiolkovsky-2025',
    legacyId: 'event-tsiolkovsky-2025',
    slug: 'tsiolkovsky-laboratory-2025',
    title: { en: 'Schrödinger at Tsiolkovsky Festival', ru: '«Шрёдингер» на фестивале Циолковского' },
    summary: {
      en: 'An open laboratory performance, not a repertory launch.',
      ru: 'Открытый лабораторный показ, не репертуарная премьера.',
    },
    date: '2025-05-22',
    place: { en: 'Kaluga · Innovation Cultural Center', ru: 'Калуга · Инновационный культурный центр' },
    role: {
      en: 'ODA.dream: art and technology in collaboration with Innovation Ballet Theatre.',
      ru: 'ODA.dream: художественная и технологическая работа совместно с Инновационным театром балета.',
    },
    work: 'schrodinger',
    organizations: ['ikc', 'itb'],
    evidence: ['tsiolkovsky-2025-record'],
    media: ['schrodinger'],
    source: 'src/content/event-tsiolkovsky-2025.md',
    publication: 'review',
  },
  {
    id: 'dano-2025',
    legacyId: 'event-dano-ekoniva-2025',
    slug: 'dano-2025',
    title: { en: 'Neurobattle at DANO', ru: '«Нейробитва» на DANO' },
    summary: {
      en: 'An event adaptation of Neurobattle at the DANO Olympiad.',
      ru: 'Событийная версия «Нейробитвы» на олимпиаде DANO.',
    },
    date: '2025-12-17',
    place: { en: 'Moscow', ru: 'Москва' },
    role: {
      en: 'ODA.dream: interactive format for EkoNiva; HSE University and T-Bank listed as organizers in the source record.',
      ru: 'ODA.dream: интерактивный формат для «ЭкоНивы»; НИУ ВШЭ и Т-Банк указаны организаторами в исходной записи.',
    },
    work: 'neurobattle',
    organizations: ['ekoniva', 'hse', 'tbank'],
    evidence: ['dano-2025-record'],
    media: ['neurobattle-dano'],
    source: 'src/content/event-dano-ekoniva-2025.md',
    publication: 'review',
  },
  {
    id: 'byob-2026',
    legacyId: 'event-byob-2026',
    slug: 'byob-2026',
    title: { en: 'MindShow at BYOB', ru: 'MindShow на BYOB' },
    summary: {
      en: 'A public presentation of MindShow on an updated production stack.',
      ru: 'Публичный показ MindShow на обновлённой технологической основе.',
    },
    date: '2026-02-28',
    place: { en: 'Moscow', ru: 'Москва' },
    role: {
      en: 'ODA.dream: invited presentation of MindShow.',
      ru: 'ODA.dream: приглашённый показ MindShow.',
    },
    work: 'mindshow',
    organizations: [],
    evidence: ['byob-2026-record'],
    media: ['mindshow'],
    source: 'src/content/event-byob-2026.md',
    publication: 'review',
  },
];

export const people: Person[] = [
  {
    id: 'founders',
    name: { en: 'Olga and Daler Arabov', ru: 'Ольга и Далер Арабовы' },
    role: { en: 'Artists and founders of ODA.dream', ru: 'Художники и основатели ODA.dream' },
    source: 'src/content/hub-cv.md; interference.md',
    publication: 'review',
  },
];

export const mediaById = (id: string) => media.find((item) => item.id === id);
export const workById = (id: string) => works.find((item) => item.id === id);
