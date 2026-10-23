import { methodTechnologyMedia } from './method-technology-media';
import {
  auditedRecognitions,
  recognitionCorrections,
  recognitionGroups,
  recognitionCaptionLabels,
} from './recognition-source-audit';
import { eventContexts, type EventContext } from './event-contexts';
import { classifyCatalogue } from './catalogue-classification';
import { sourceSectionsFor } from './archive-source-links';
import { archiveRecognitions } from './archive-recognitions';
import { participationDetails } from './editorial';
import type { ParticipationDetail } from './editorial';
import type { SourceReference } from './editorial';
import type { EditorialSection } from './editorial';
import { additionalWorks, additionalMedia } from './additional-works';
import { archiveMedia, archiveMediaFor } from './archive-media';
import {
  additionalEvents,
  eventMedia,
  eventOrganizations,
  eventSeries as seriesRecords,
} from './additional-events';
import { programmes as programmeRecords } from './programmes';
import { additionalProgrammes, programmeEnrichments } from './additional-programmes';
import { studioPeople } from './studio';
import { workDetails } from './work-details';
export { workDocuments, legacyWorkResources } from './work-details';
import type { WorkDetail } from './work-details';
import { caseDetails, historicalEvents } from './case-details';
import type { CaseDetail } from './case-details';
import { evidenceDetails, recognitionDetails } from './evidence-details';
import type { EvidenceDetail, RecognitionDetail } from './evidence-details';
import { sourceSnapshots } from './editorial';
export { methods, cooperationPages, sourceSnapshots } from './editorial';
export { studioPages } from './studio';
export { referenceDocuments } from './reference-documents';
export { educationOverview } from './programmes';

export type Lang = 'en' | 'ru';
export type Localized = Record<Lang, string>;
export type Publication = 'draft' | 'review' | 'published';
export type Rights = 'cleared' | 'review' | 'restricted';
export type WorkStage = 'concept' | 'prototype' | 'in-production' | 'realized';
export type WorkType =
  'performance' | 'installation' | 'game' | 'object' | 'participatory-practice' | 'interactive-work';

export interface Media {
  id: string;
  legacyId?: string;
  /** Byte-identical historical resources, subject to this media's publication scope and rights. */
  legacyPaths?: string[];
  src: string;
  /** Preparation input retained for provenance; internal originals are excluded from dist. */
  originalAccess?: 'public' | 'internal';
  archiveSource?: {
    path: string;
    sha256: string;
    sourceIds: string[];
    inputPath?: string;
    segment?: { start: number; duration: number };
  };
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
  representation?:
    'illustration' | 'photograph' | 'render' | 'diagram' | 'poster' | 'document' | 'screenshot';
  credit?: Localized;
  /** Normalised object-position exported from the DEV composition editor. */
  focalPosition?: { desktop: { x: number; y: number }; mobile?: { x: number; y: number } };
  focalPoint?:
    | 'top-left'
    | 'top'
    | 'top-right'
    | 'left'
    | 'center'
    | 'right'
    | 'bottom-left'
    | 'bottom'
    | 'bottom-right';
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
      target: { kind: 'method'; methodId: string };
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
export interface Work extends WorkDetail {
  id: string;
  legacyId: string;
  slug: string;
  title: Localized;
  category: Localized;
  summary: Localized;
  experience: Localized;
  question: Localized;
  stage: WorkStage;
  workType: WorkType;
  aliases: string[];
  basedOn: string[];
  components?: Record<Lang, string[]>;
  year: number | null;
  edition?: Localized;
  featuredOnHome: boolean;
  inRepertoire: boolean;
  bookable: boolean;
  rnd: boolean;
  availability: Localized;
  facts: Record<Lang, string[]>;
  media: string[];
  mediaNote?: Localized;
  methodId?: string;
  cases: string[];
  configurations: string[];
  source: string;
  publication: Publication;
}
export interface WorkConfiguration extends ParticipationDetail {
  id: string;
  legacyId: string;
  slug: string;
  title: Localized;
  summary: Localized;
  scope: Localized;
  workId: string;
  source: string;
  publication: Publication;
}
export interface CaseEvent extends CaseDetail {
  sourceUrl?: string;
  /** Curated subsets of this event's media, shown on the corresponding work. */
  workSelections?: { workId: string; media: string[] }[];
  event?: EventContext;
  id: string;
  legacyId?: string;
  slug: string;
  title: Localized;
  summary: Localized;
  date: string;
  datePrecision: 'day' | 'month' | 'year';
  dateEnd?: string;
  dateMeaning: 'participation' | 'event-window' | 'series-start' | 'reported-by';
  participationStatus: 'held' | 'invited' | 'submitted' | 'declined' | 'planned' | 'recorded';
  context: 'public' | 'private' | 'laboratory' | 'application';
  relatedWorks?: string[];
  relatedProgrammes?: string[];
  detailPage: boolean;
  featuredOnHome: boolean;
  type: 'performance' | 'presentation' | 'participatory-format' | 'lecture' | 'discussion' | 'laboratory';
  place: Localized;
  role: Localized;
  work?: string;
  method?: string;
  programme?: string;
  organizations: string[];
  evidence: string[];
  media: string[];
  source: string;
  publication: Publication;
}
export interface Evidence extends EvidenceDetail {
  id: string;
  legacyId: string;
  kind: 'event-record' | 'document' | 'press';
  title: Localized;
  source: string;
  permission: Rights;
}
export type RecognitionKind = 'award' | 'certificate' | 'acknowledgement-letter' | 'grant' | 'selection';
export interface RecognitionDocument {
  cover?: boolean;
  rotation?: number;
  toneGamma?: number;
  id: string;
  src: string;
  label: Localized;
  width?: number;
  height?: number;
  /** Local-only path and fingerprint used by media preparation; PUBLIC projection drops both. */
  sourcePath?: string;
  sourceSha256?: string;
}
export interface Recognition extends RecognitionDetail {
  captionLabel?: Localized;
  place?: number;
  id: string;
  legacyId?: string;
  kind: RecognitionKind;
  title: Localized;
  issuer: Localized;
  year: number;
  featuredOnHome?: boolean;
  event?: string;
  source: string;
  documentSource: string;
  previewSrc?: string;
  /** Separate files/pages that document the same event and recognition credit. */
  documents?: RecognitionDocument[];
  publication: Publication;
  documentRights: Rights;
  width?: number;
  height?: number;
}
export interface Person {
  id: string;
  legacyId?: string;
  name: Localized;
  role: Localized;
  biography?: Localized;
  cv?: { sections: EditorialSection[]; base: Localized; workIds: string[]; caseIds: string[] };
  sourceRefs?: SourceReference[];
  source: string;
  publication: Publication;
}
export type OrganizationRole = 'venue' | 'organizer' | 'client' | 'co-producer' | 'technology';
export interface Organization {
  id: string;
  legacyId?: string;
  name: Localized;
  role: OrganizationRole;
  source: string;
}

export type SocialPlatform = 'telegram' | 'youtube' | 'instagram' | 'dzen' | 'vk';

export interface SocialLink {
  id: SocialPlatform;
  label: string;
  href: string;
  languages: Lang[];
  source: string;
}

// Profile URLs recovered from the previous site and confirmed by the studio.
export const socialLinks: SocialLink[] = [
  {
    id: 'vk',
    label: 'VK',
    href: 'https://vk.ru/odadream',
    languages: ['ru'],
    source: 'Owner confirmation 2026-10-12',
  },
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
  ...methodTechnologyMedia,
  ...eventMedia,
  {
    id: 'schrodinger-poster',
    src: '/images/content/works/schrodinger-2025-poster.webp',
    kind: 'image',
    representation: 'poster',
    rights: 'cleared',
    width: 1446,
    height: 2048,
    alt: {
      ru: 'Архивная афиша «Проекта Шрёдингер», 22 мая 2025',
      en: 'Archival Project Schrödinger poster, 22 May 2025',
    },
    caption: {
      ru: '«Проект Шрёдингер» · афиша лабораторного показа, 2025',
      en: 'Project Schrödinger · laboratory performance poster, 2025',
    },
    credit: { ru: 'Авторы идеи: Ольга и Далер Арабовы', en: 'Idea: Olga and Daler Arabov' },
    source:
      'src/content/media-schrodinger-poster.md; owner display permission for works and related materials 2026-10-07',
  },
  {
    id: 'honors-scheme',
    src: '/images/content/works/honors-skolkovo/honors-skolkovo-scheme.webp',
    kind: 'image',
    representation: 'diagram',
    rights: 'cleared',
    width: 1229,
    height: 880,
    alt: { ru: 'Схема размещения экранов «Нейродоски почёта»', en: 'Neuro Honor Board screen-layout scheme' },
    caption: { ru: 'Архивная схема размещения инсталляции.', en: 'Archival installation layout.' },
    source: 'src/content/media-honors-presentation.md',
  },

  {
    id: 'neuromandala-terra',
    width: 1280,
    height: 720,
    src: '/video/hero/terra-preview.mp4',
    poster: '/video/hero/terra-poster.webp',
    previewSrc: '/video/hero/terra-preview.mp4',
    alt: {
      en: 'Neuromandala visual field: Terraforming',
      ru: 'Визуальное поле Нейромандалы: «Терраформинг»',
    },
    caption: {
      en: 'Terraforming · mandala display',
      ru: '«Терраформинг» · экран мандалы',
    },
    rights: 'cleared',
    source: 'D:/YandexDisk/_ODA2/Сайт/odadream-presentation/public/images/nodes/mandala_terra.mp4',
    kind: 'video',
  },
  {
    id: 'neuromandala-frequencies',
    width: 1280,
    height: 720,
    src: '/video/hero/frequencies-preview.mp4',
    poster: '/video/hero/frequencies-poster.webp',
    previewSrc: '/video/hero/frequencies-preview.mp4',
    alt: {
      en: 'MindGrid visual field: Frequencies',
      ru: 'Визуальное поле MindGrid: «Частоты»',
    },
    caption: {
      en: 'Frequencies · MindGrid, first minute',
      ru: '«Частоты» · MindGrid, первая минута',
    },
    rights: 'cleared',
    source: 'D:/YandexDisk/_ODA2/Сайт/odadream-presentation/public/images/nodes/grid.mp4',
    kind: 'video',
  },
  {
    id: 'neuromandala-mindshow',
    width: 720,
    height: 720,
    src: '/video/hero/mindshow-preview.mp4',
    poster: '/video/hero/mindshow-poster.webp',
    previewSrc: '/video/hero/mindshow-preview.mp4',
    alt: {
      en: 'Neuromandala sequence from MindShow',
      ru: 'Последовательность Нейромандалы в MindShow',
    },
    caption: {
      en: 'MindShow · audiovisual session',
      ru: 'MindShow · аудиовизуальная сессия',
    },
    rights: 'cleared',
    source: 'D:/YandexDisk/_ODA2/_Photos Various/Мандалы/Neuromandala Show.mp4',
    kind: 'video',
  },
  {
    id: 'neuromandala-cultural-code',
    width: 1280,
    height: 720,
    src: '/video/hero/cultural-code-preview.mp4',
    poster: '/video/hero/cultural-code-poster.webp',
    previewSrc: '/video/hero/cultural-code-preview.mp4',
    alt: {
      en: 'Neuromandala ornament visual',
      ru: 'Орнаментальная визуализация Нейромандалы',
    },
    caption: {
      en: 'Cultural Code · Ossetia',
      ru: '«Культурный код» · Осетия',
    },
    rights: 'cleared',
    source: 'D:/YandexDisk/_ODA2/События/25-10-27 Осетия Плешка/Export/2_ornament_center_1080p.mp4',
    kind: 'video',
  },
  {
    id: 'neuromandala-kovylina',
    width: 720,
    height: 720,
    src: '/video/hero/kovylina-preview.mp4',
    poster: '/video/hero/kovylina-poster.webp',
    previewSrc: '/video/hero/kovylina-preview.mp4',
    alt: {
      en: 'Neuromandala session with Elena Kovylina',
      ru: 'Сессия Нейромандалы с Еленой Ковылиной',
    },
    caption: {
      en: 'Neuromandala · Elena Kovylina session',
      ru: 'Нейромандала · сессия Елены Ковылиной',
    },
    rights: 'cleared',
    source: 'D:/YandexDisk/_ODA2/События/26-06-08 Ковылина Тест/Exports/04_193527_Елена.mp4',
    kind: 'video',
  },
  {
    id: 'interference-stage',
    width: 1732,
    height: 1155,
    poster: '/video/interference-dawn-poster.webp',
    previewSrc: '/video/interference-dawn.mp4',
    src: '/images/content/events/interference-2026/interference-2026-01.webp',
    mobileSrc: '/images/content/events/interference-2026/interference-2026-01-mobile.webp',
    alt: {
      en: 'Performers on stage during Interference of Realities',
      ru: 'Артисты на сцене «Интерференции реальностей»',
    },
    caption: {
      en: 'Interference of Realities · Kaluga, 2026',
      ru: '«Интерференция реальностей» · Калуга, 2026',
    },
    rights: 'cleared',
    source: 'src/content/interference.md; event-tsiolkovsky-2026',
    kind: 'image',
  },
  {
    id: 'mindshow',
    width: 1440,
    height: 1080,
    src: '/images/content/mindshow_mdsh_v5.webp',
    representation: 'screenshot',
    alt: {
      en: 'Generative visuals from MindShow',
      ru: 'Генеративная графика MindShow',
    },
    caption: {
      en: 'MindShow · test visualization interface',
      ru: 'MindShow · тестовый интерфейс визуализации',
    },
    rights: 'cleared',
    source: 'src/content/mindshow.md',
    kind: 'image',
  },
  {
    id: 'neurobattle',
    width: 1920,
    height: 1080,
    src: '/images/content/neurobattle_gameplay.webp',
    representation: 'screenshot',
    alt: {
      en: 'Paradox of Success game screen',
      ru: 'Экран игры «Парадокс Успеха»',
    },
    caption: {
      en: 'Paradox of Success · game interface',
      ru: '«Парадокс Успеха» · игровой интерфейс',
    },
    rights: 'cleared',
    source: 'src/content/neurobattle.md',
    kind: 'image',
  },
  {
    id: 'schrodinger',
    width: 1706,
    height: 2560,
    src: '/images/content/events/schrodinger-2025/schrodinger-2025-01.webp',
    alt: {
      en: 'Project Schrödinger laboratory performance',
      ru: 'Лабораторный показ «Проекта Шрёдингер»',
    },
    caption: {
      en: 'Project Schrödinger · Kaluga, 2025',
      ru: '«Проект Шрёдингер» · Калуга, 2025',
    },
    rights: 'cleared',
    source: 'src/content/schrodinger.md',
    kind: 'image',
  },
  {
    id: 'rings',
    width: 1080,
    height: 1080,
    legacyPaths: ['/images/content/materia/oda-rings/ig-01-hero.webp'],
    src: '/images/content/materia/oda-rings/oda-rings-cover.webp',
    alt: {
      en: 'ODA.dream rings',
      ru: 'Кольца ODA.dream',
    },
    caption: {
      en: 'ODA.dream Rings · object',
      ru: 'Кольца ODA.dream · объект',
    },
    rights: 'cleared',
    source: 'src/content/oda-rings.md',
    kind: 'image',
  },
  {
    id: 'sync',
    width: 1200,
    height: 675,
    src: '/images/content/works/sync-circle/sync-circle-hero.webp',
    alt: {
      en: 'Sync Circle concept rendering',
      ru: 'Концептуальная визуализация «Круга синхронизации»',
    },
    caption: {
      ru: '«Круг синхронизации» · концептуальная визуализация.',
      en: 'Sync Circle · conceptual rendering.',
    },
    rights: 'cleared',
    source: 'src/content/sync-circle.md',
    kind: 'image',
  },
  {
    id: 'neurobattle-dano',
    width: 1920,
    height: 1080,
    src: '/images/content/neurobattle_dano.webp',
    alt: {
      en: 'Paradox of Success at DANO',
      ru: '«Парадокс Успеха» на DANO',
    },
    caption: {
      en: 'DANO · Moscow, 2025',
      ru: 'DANO · Москва, 2025',
    },
    rights: 'cleared',
    source: 'src/content/event-dano-ekoniva-2025.md',
    kind: 'image',
  },
  {
    id: 'emomandala-object',
    width: 1668,
    height: 1920,
    legacyPaths: [
      '/images/content/materia/emomandala/emomandala-cover.webp',
      '/images/content/materia/emomandala/photo-pendant-front.webp',
    ],
    src: '/images/works/emomandala.webp',
    kind: 'image',
    rights: 'cleared',
    alt: {
      en: 'Emomandala physical artefact',
      ru: 'Физический артефакт «Эмомандалы»',
    },
    caption: {
      en: 'Emomandala · physical component of the work',
      ru: '«Эмомандала» · физическая часть работы',
    },
    source: 'src/content/emomandala.md; owner display permission 2026-10-05',
  },
  {
    id: 'ancestors-prototype',
    width: 1536,
    height: 1024,
    legacyPaths: ['/images/content/works/ancestors-hero.webp'],
    src: '/images/works/ancestors.webp',
    kind: 'image',
    rights: 'cleared',
    alt: {
      en: 'Ancestors in the Noise · prototype study',
      ru: '«Предки в шуме» · исследование прототипа',
    },
    caption: {
      en: 'Ancestors in the Noise · prototype, internal laboratory with Elena Kovylina',
      ru: '«Предки в шуме» · прототип, внутренняя лаборатория с Еленой Ковылиной',
    },
    source: 'src/content/ancestors.md; owner display permission 2026-10-05',
  },
  {
    id: 'neurosync-session',
    width: 1280,
    height: 720,
    representation: 'illustration',
    src: '/video/hero/frequencies-poster.webp',
    kind: 'image',
    rights: 'cleared',
    alt: {
      en: 'MindGrid · individual neuroportraits within Neuromandala',
      ru: 'MindGrid · индивидуальные нейропортреты в составе Нейромандалы',
    },
    caption: {
      ru: 'MindGrid · Нейромандала в форме нейропортрета.',
      en: 'MindGrid · Neuromandala presented as a neuroportrait.',
    },
    source:
      'src/content/neuromandala.md; owner display permission 2026-10-05; owner MindGrid identification 2026-10-16',
  },
  ...additionalMedia,
  ...archiveMedia,
];

export const heroVisuals: HeroVisual[] = [
  {
    id: 'terra',
    mediaId: 'neuromandala-terra',
    target: { kind: 'method', methodId: 'neuromandala' },
  },
  {
    id: 'frequencies',
    mediaId: 'neuromandala-frequencies',
    target: { kind: 'work', workId: 'mindshow' },
  },
  {
    id: 'mindshow',
    mediaId: 'neuromandala-mindshow',
    target: { kind: 'work', workId: 'mindshow' },
  },
  {
    id: 'cultural-code',
    mediaId: 'neuromandala-cultural-code',
    target: { kind: 'work', workId: 'cultural-neuro-code' },
  },
  {
    id: 'kovylina',
    mediaId: 'neuromandala-kovylina',
    target: { kind: 'work', workId: 'ancestors' },
  },
];

export const workStageLabels: Record<WorkStage, Localized> = {
  concept: { en: 'Concept', ru: 'Концепция' },
  prototype: { en: 'Prototype', ru: 'Прототип' },
  'in-production': { en: 'In production', ru: 'В производстве' },
  realized: { en: 'Realized', ru: 'Реализовано' },
};

const workRecords: Omit<Work, keyof WorkDetail>[] = [
  {
    id: 'interference',
    legacyId: 'interference',
    slug: 'interference-of-realities',
    title: {
      en: 'Interference of Realities',
      ru: 'Интерференция реальностей',
    },
    category: {
      en: 'Performance',
      ru: 'Спектакль',
    },
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
    media: ['archive-interference-interference-2026-02', 'interference-stage'],
    cases: ['tsiolkovsky-2026'],
    configurations: [],
    source: 'src/content/interference.md',
    publication: 'published',
    stage: 'realized',
    year: null,
    workType: 'performance',
    aliases: [],
    basedOn: [],
    featuredOnHome: true,
  },
  {
    id: 'mindshow',
    legacyId: 'mindshow',
    slug: 'mindshow',
    title: {
      en: 'MindShow',
      ru: 'Майнд-шоу',
    },
    category: {
      en: 'Installation-performance',
      ru: 'Инсталляция-перформанс',
    },
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
    media: ['portal-2024-recording', 'mindshow'],
    cases: ['byob-2026', 'portal-2025', 'cipr-2026'],
    configurations: ['mindshow-installation'],
    source: 'src/content/mindshow.md',
    publication: 'published',
    stage: 'realized',
    year: null,
    workType: 'installation',
    aliases: ['MindGrid', 'Майнд-шоу'],
    basedOn: [],
    featuredOnHome: true,
  },
  {
    id: 'neurobattle',
    legacyId: 'neurobattle',
    slug: 'neurobattle',
    title: {
      en: 'Paradox of Success',
      ru: 'Парадокс Успеха',
    },
    category: {
      en: 'Interactive game',
      ru: 'Интерактивная игра',
    },
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
    media: ['dano-game-recording', 'neurobattle', 'neurobattle-dano'],
    cases: ['dano-2025'],
    configurations: ['neurobattle-game'],
    source: 'src/content/neurobattle.md',
    publication: 'published',
    stage: 'realized',
    year: null,
    workType: 'game',
    aliases: ['Нейробитва', 'Neurobattle', 'Нейробаттл'],
    basedOn: [],
    featuredOnHome: true,
  },
  {
    id: 'schrodinger',
    legacyId: 'schrodinger',
    slug: 'project-schrodinger',
    title: {
      en: 'Project Schrödinger',
      ru: 'Проект Шрёдингер',
    },
    category: {
      en: 'Performance',
      ru: 'Спектакль',
    },
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
    media: ['archive-schrodinger-schrodinger-2025-06', 'schrodinger', 'schrodinger-poster'],
    cases: ['tsiolkovsky-2025'],
    configurations: [],
    source: 'src/content/schrodinger.md',
    publication: 'published',
    stage: 'realized',
    year: null,
    workType: 'performance',
    aliases: [],
    basedOn: [],
    featuredOnHome: true,
  },
  {
    id: 'rings',
    legacyId: 'oda-rings',
    slug: 'oda-rings',
    title: {
      en: 'ODA.dream Rings',
      ru: 'Кольца ODA.dream',
    },
    category: {
      en: 'Jewellery object',
      ru: 'Ювелирный объект',
    },
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
    configurations: [],
    source: 'src/content/oda-rings.md',
    publication: 'published',
    stage: 'realized',
    year: 2020,
    workType: 'object',
    aliases: [],
    basedOn: [],
    featuredOnHome: true,
    edition: {
      en: 'One original pair · two wedding bands',
      ru: 'Одна авторская пара · два обручальных кольца',
    },
  },
  {
    id: 'sync',
    legacyId: 'sync-circle',
    slug: 'sync-circle',
    title: {
      en: 'Sync Circle',
      ru: 'Круг синхронизации',
    },
    category: {
      en: 'Group installation',
      ru: 'Групповая инсталляция',
    },
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
    inRepertoire: false,
    bookable: false,
    rnd: true,
    availability: {
      en: 'Installation concept. We welcome a conversation about further development.',
      ru: 'Инсталляционный концепт. Приглашаем обсудить дальнейшую разработку.',
    },
    facts: {
      en: ['Concept based on the work Neurosynchronization', 'Visual shown is a conceptual rendering'],
      ru: ['Концепт на основе работы «Нейросинхронизация»', 'Изображение — концептуальная визуализация'],
    },
    media: ['sync'],
    cases: [],
    configurations: [],
    source: 'src/content/sync-circle.md',
    publication: 'published',
    stage: 'concept',
    year: null,
    workType: 'installation',
    aliases: [],
    basedOn: ['neurosync'],
    featuredOnHome: false,
  },
  {
    legacyId: 'emomandala',
    slug: 'emomandala',
    aliases: [],
    basedOn: [],
    inRepertoire: false,
    bookable: false,
    rnd: false,
    featuredOnHome: false,
    cases: [],
    configurations: [],
    publication: 'published',
    id: 'emomandala',
    title: {
      en: 'Emomandala',
      ru: 'Эмомандала',
    },
    category: {
      en: 'Interactive work',
      ru: 'Интерактивная работа',
    },
    workType: 'interactive-work',
    stage: 'realized',
    year: null,
    summary: {
      en: 'A personal story takes shape through an application, a physical artefact and an on-chain record of its creation.',
      ru: 'Личная история обретает форму через приложение, физический артефакт и ончейн-паспорт его создания.',
    },
    experience: {
      en: 'The participant searches for inner resonance, builds a narrative and embodies it in an artefact whose creation history is kept on an on-chain site.',
      ru: 'Участник ищет внутренний отклик, формирует личную историю и воплощает её в артефакте, история создания которого хранится на ончейн-сайте.',
    },
    question: {
      en: 'How can an inner response become a personal story and a tangible object?',
      ru: 'Как внутренний отклик становится личной историей и осязаемым объектом?',
    },
    components: {
      en: [
        'Emotional-intelligence concept',
        'Application for exploring inner resonance',
        'Participant narrative',
        'Physical artefact',
        'On-chain site and creation record',
      ],
      ru: [
        'Концепт об эмоциональном интеллекте',
        'Приложение для поиска внутреннего отклика',
        'Нарратив пользователя',
        'Физический артефакт',
        'Ончейн-сайт и история создания',
      ],
    },
    availability: {
      en: 'Presentation and new versions are discussed with the studio; an artefact is linked to its participant’s story.',
      ru: 'Показ и новые версии обсуждаются со студией; артефакт связан с историей конкретного участника.',
    },
    facts: {
      en: [
        'A composite work spanning digital and physical forms',
        'Emomandala OS is a related method, not an alias of the work',
        'Application, personal narrative, physical artefact and on-chain record',
      ],
      ru: [
        'Составная работа в цифровой и физической форме',
        'Эмомандала OS — связанный метод, не алиас работы',
        'Приложение, личная история, физический артефакт и ончейн-паспорт',
      ],
    },
    media: ['emomandala-object'],
    source: 'src/content/emomandala.md; studio confirmation 2026-10-05',
  },
  {
    legacyId: 'neurosync',
    slug: 'neurosynchronization',
    aliases: ['Нейросинк', 'Neurosync'],
    basedOn: [],
    inRepertoire: false,
    bookable: false,
    rnd: false,
    featuredOnHome: false,
    cases: [],
    configurations: [],
    publication: 'published',
    id: 'neurosync',
    title: {
      en: 'Neurosynchronization',
      ru: 'Нейросинхронизация',
    },
    category: {
      en: 'Participatory practice',
      ru: 'Партисипаторная практика',
    },
    workType: 'participatory-practice',
    stage: 'realized',
    year: null,
    summary: {
      en: 'Participants explore shared attention through breathing, listening and biofeedback, guided by a facilitator.',
      ru: 'Участники исследуют совместное внимание через дыхание, слушание и биологическую обратную связь под руководством ведущего.',
    },
    experience: {
      en: 'A group moves through attention, breathing, listening and reflection, observing how individual experiences meet.',
      ru: 'Группа проходит через внимание, дыхание, слушание и рефлексию, наблюдая, как встречаются индивидуальные переживания.',
    },
    question: {
      en: 'How does shared attention emerge within a group?',
      ru: 'Как внутри группы возникает совместное внимание?',
    },
    availability: {
      en: 'The current conditions for presentation are discussed with the studio.',
      ru: 'Актуальные условия проведения обсуждаются со студией.',
    },
    facts: {
      en: [
        'Guided group practice with biofeedback',
        'Sync Circle is a separate installation concept based on this work',
      ],
      ru: [
        'Фасилитируемая групповая практика с биологической обратной связью',
        '«Круг синхронизации» — отдельный инсталляционный концепт на основе этой работы',
      ],
    },
    media: ['neurosync-lab-recording'],
    source: 'src/content/neurosync.md; studio confirmation 2026-10-05',
  },
  {
    legacyId: 'ancestors',
    slug: 'ancestors-in-the-noise',
    aliases: [],
    basedOn: [],
    inRepertoire: false,
    bookable: false,
    rnd: true,
    featuredOnHome: false,
    cases: [],
    configurations: [],
    publication: 'published',
    id: 'ancestors',
    title: {
      en: 'Ancestors in the Noise',
      ru: 'Предки в шуме',
    },
    category: {
      en: 'Performance',
      ru: 'Перформанс',
    },
    workType: 'performance',
    stage: 'prototype',
    year: null,
    summary: {
      en: 'A prototype exploring memory and identity, developed in an internal laboratory with Elena Kovylina.',
      ru: 'Прототип о памяти и идентичности, созданный во внутренней лаборатории с Еленой Ковылиной.',
    },
    experience: {
      en: 'Archival material and biosignals meet within a generative environment in a laboratory exploration of personal memory.',
      ru: 'Архивные материалы и биосигналы встречаются в генеративной среде лабораторного исследования личной памяти.',
    },
    question: {
      en: 'How can personal memory take shape in a performative environment?',
      ru: 'Как личная память обретает форму в перформативной среде?',
    },
    availability: {
      en: 'Internal laboratory prototype; development inquiries only.',
      ru: 'Прототип внутренней лаборатории; возможно обсуждение дальнейшей разработки.',
    },
    facts: {
      en: [
        'Internal laboratory with Elena Kovylina',
        'The work remained at the prototype stage',
        'Laboratory research materials',
      ],
      ru: [
        'Внутренняя лаборатория с Еленой Ковылиной',
        'Работа осталась на этапе прототипа',
        'Материалы лабораторного исследования',
      ],
    },
    media: ['ancestors-prototype'],
    source: 'src/content/ancestors.md; studio confirmation 2026-10-05',
  },
];

const artworkRecords: Work[] = [
  ...workRecords.map((work) => ({ ...work, ...workDetails[work.id] })),
  ...additionalWorks,
];

export const configurations: WorkConfiguration[] = [
  {
    ...participationDetails['mindshow-installation'],
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
    workId: 'mindshow',
    source: 'src/content/hub-collab.md; mindshow.md',
    publication: 'published',
  },
  {
    ...participationDetails['neurobattle-game'],
    id: 'neurobattle-game',
    legacyId: 'neurobattle',
    slug: 'neurobattle-game',
    title: { en: 'Paradox of Success game', ru: 'Игра «Парадокс Успеха»' },
    summary: {
      en: 'Short, legible two-person rounds for a live audience.',
      ru: 'Короткие понятные поединки двух участников перед зрителями.',
    },
    scope: {
      en: 'Requires screen or projector, two seats, power and ODA.dream operators; venue production is not included by default.',
      ru: 'Нужны экран или проектор, два места, питание и операторы ODA.dream; производство площадки не включено по умолчанию.',
    },
    workId: 'neurobattle',
    source: 'src/content/hub-collab.md; neurobattle.md',
    publication: 'published',
  },
];

export const organizations: Organization[] = [
  ...eventOrganizations,
  {
    id: 'moscow2030',
    legacyId: 'org-moscow2030',
    name: { en: 'Moscow 2030', ru: 'Москва 2030' },
    role: 'organizer',
    source: 'src/content/event-portal-2025.md',
  },
  {
    id: 'wildmint',
    legacyId: 'org-wildmint',
    name: { en: 'Wild Mint', ru: 'Дикая Мята' },
    role: 'organizer',
    source: 'src/content/proof-let-wildmint.md',
  },
  {
    id: 'cipr',
    legacyId: 'org-cipr',
    name: { en: 'CIPR', ru: 'ЦИПР' },
    role: 'venue',
    source: 'src/content/event-cipr-mindshow-2026.md',
  },
  {
    id: 'ashram',
    legacyId: 'org-ashram',
    name: { en: 'Ashram Studio', ru: 'Студия Ashram' },
    role: 'client',
    source: 'src/content/event-cipr-mindshow-2026.md',
  },
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

const evidenceRecords: Omit<Evidence, keyof EvidenceDetail>[] = [
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
export const evidence: Evidence[] = evidenceRecords.map((row) => ({ ...row, ...evidenceDetails[row.id] }));

const recognitionRecords: Omit<Recognition, keyof RecognitionDetail>[] = [
  {
    id: 'digital-art-ai-2026',
    kind: 'certificate',
    year: 2026,
    featuredOnHome: true,
    title: { en: 'Diploma · Digital Art & AI panel', ru: 'Диплом · панель «Цифровое искусство и ИИ»' },
    issuer: { en: 'Unique Russia · Gostiny Dvor', ru: 'Уникальная Россия · Гостиный двор' },
    source: 'previous src/content/hub-letters.md',
    documentSource: '/images/content/proofs/collab_2026_ODA_Gostinyy_dvor.webp',
    previewSrc: '/images/recognition/digital-art-ai-2026.webp',
    publication: 'review',
    documentRights: 'review',
  },
  {
    id: 'mipt-letter-2025',
    legacyId: 'proof-mipt-letter',
    kind: 'certificate',
    year: 2026,
    featuredOnHome: false,
    title: { en: 'Terraforming · participation certificate', ru: 'Терраформинг · сертификат участника' },
    issuer: {
      en: 'Creative Union of Artists of Russia',
      ru: 'Творческий союз художников России',
    },
    source: 'Owner-supplied Terraforming certificate, 2026-10-15; exhibition 2025-12-09 to 2026-03-31',
    documentSource: '/images/proofs/mipt-terraforming-2026.webp',
    publication: 'published',
    documentRights: 'cleared',
    previewSrc: '/images/proofs/mipt-terraforming-2026.webp',
    width: 1191,
    height: 1684,
  },
  {
    id: 'portal-2030-2025',
    legacyId: 'proof-award-portal-visioning',
    kind: 'award',
    year: 2025,
    featuredOnHome: true,
    title: {
      en: 'First prize · Portal 2030–2050, VJ contest',
      ru: 'Первое место · Портал 2030–2050, «Виджеинг»',
    },
    issuer: { en: 'Moscow 2030', ru: 'Москва 2030' },
    source: 'previous src/content/hub-letters.md; outcome wording requires source review',
    documentSource: '/images/content/proofs/collab_2025_ODA_Portal.webp',
    previewSrc: '/images/recognition/portal-2025.webp',
    publication: 'review',
    documentRights: 'review',
  },
  {
    id: 'tavrida-letter-2025',
    legacyId: 'proof-let-tavrida',
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
    previewSrc: '/images/recognition/tavrida-2025.webp',
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
    previewSrc: '/images/recognition/hse-2025.webp',
    publication: 'review',
    documentRights: 'review',
  },
];

const recognitionGroupMembers = new Set(Object.values(recognitionGroups).flatMap((group) => group.memberIds));
export const recognitions: Recognition[] = [
  ...recognitionRecords.map((row) => ({
    ...row,
    ...recognitionDetails[row.id],
    publication: 'published' as const,
    documentRights:
      recognitionDetails[row.id].documentState === 'available' ? ('cleared' as const) : ('review' as const),
    source: row.source + '; owner authorization for full studio material migration 2026-10-05/07',
  })),
  ...archiveRecognitions,
  ...auditedRecognitions,
]
  .filter((row) => !recognitionGroupMembers.has(row.id))
  .map((row) => {
    const group = recognitionGroups[row.id];
    const { memberIds: _memberIds, ...groupData } = group ?? { memberIds: [] };
    return {
      ...row,
      ...recognitionCorrections[row.id],
      ...groupData,
      captionLabel: recognitionCaptionLabels[row.id],
      ...(['portal-2030-2025', 'skolkovo-arttech-2026'].includes(row.id) ? { place: 1 } : {}),
      ...(group?.documents?.length
        ? {
            previewSrc: group.documents[0].src,
            documentSource: group.documents[0].src,
            documentState: 'available' as const,
          }
        : {}),
    };
  });

const caseRecords: Omit<
  CaseEvent,
  keyof CaseDetail | 'datePrecision' | 'detailPage' | 'dateMeaning' | 'participationStatus' | 'context'
>[] = [
  {
    id: 'tsiolkovsky-2026',
    featuredOnHome: true,
    legacyId: 'event-tsiolkovsky-2026',
    slug: 'tsiolkovsky-festival-2026',
    title: { en: 'Interference at Tsiolkovsky Festival', ru: '«Интерференция» на фестивале Циолковского' },
    summary: {
      en: 'Opening performance and premiere of Interference of Realities.',
      ru: 'Открывающий спектакль и премьера «Интерференции реальностей».',
    },
    date: '2026-05-16',
    type: 'performance',
    place: { en: 'Kaluga · Innovation Cultural Center', ru: 'Калуга · Инновационный культурный центр' },
    role: {
      en: 'ODA.dream: artistic and technological design; co-production with Innovation Ballet Theatre.',
      ru: 'ODA.dream: художественно-технологическое решение; совместная постановка с Инновационным театром балета.',
    },
    work: 'interference',
    organizations: ['ikc', 'itb', 'neiry'],
    evidence: ['tsiolkovsky-2026-record'],
    media: ['archive-interference-interference-2026-poster', 'interference-stage'],
    source: 'src/content/event-tsiolkovsky-2026.md',
    publication: 'published',
  },
  {
    id: 'tsiolkovsky-2025',
    featuredOnHome: true,
    legacyId: 'event-tsiolkovsky-2025',
    slug: 'tsiolkovsky-laboratory-2025',
    title: { en: 'Schrödinger at Tsiolkovsky Festival', ru: '«Шрёдингер» на фестивале Циолковского' },
    summary: {
      en: 'An open laboratory performance involving the audience.',
      ru: 'Открытый лабораторный показ с участием зрителей.',
    },
    date: '2025-05-22',
    type: 'performance',
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
    publication: 'published',
  },
  {
    id: 'dano-2025',
    featuredOnHome: false,
    legacyId: 'event-dano-ekoniva-2025',
    slug: 'dano-2025',
    title: { en: 'Paradox of Success at DANO', ru: '«Парадокс Успеха» на DANO' },
    summary: {
      en: 'An event adaptation of Paradox of Success at the DANO Olympiad.',
      ru: 'Событийная версия «Парадокса Успеха» на олимпиаде DANO.',
    },
    date: '2025-12-17',
    type: 'participatory-format',
    place: { en: 'Moscow', ru: 'Москва' },
    role: {
      en: 'ODA.dream: an interactive programme for EkoNiva. The Olympiad organisers were HSE University and T-Bank.',
      ru: 'ODA.dream: интерактивная программа для «ЭкоНивы». Организаторы олимпиады — НИУ ВШЭ и Т-Банк.',
    },
    work: 'neurobattle',
    organizations: ['ekoniva', 'hse', 'tbank'],
    evidence: ['dano-2025-record'],
    media: ['neurobattle-dano'],
    source: 'src/content/event-dano-ekoniva-2025.md',
    publication: 'published',
  },
  {
    id: 'byob-2026',
    featuredOnHome: false,
    legacyId: 'event-byob-2026',
    slug: 'byob-2026',
    title: { en: 'MindShow at BYOB', ru: 'MindShow на BYOB' },
    summary: {
      en: 'A public presentation of MindShow on an updated production stack.',
      ru: 'Публичный показ MindShow на обновлённой технологической основе.',
    },
    date: '2026-02-28',
    type: 'presentation',
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
    publication: 'published',
  },
];

const caseInventory: CaseEvent[] = [
  ...caseRecords.map((row) => ({
    ...row,
    datePrecision: 'day' as const,
    dateMeaning: 'participation' as const,
    participationStatus: 'held' as const,
    context: 'public' as const,
    detailPage: true,
    ...caseDetails[row.id],
  })),
  ...historicalEvents,
  ...additionalEvents,
].map((row) => ({
  ...row,
  event: eventContexts[row.id],
  media: [...new Set([...row.media, ...archiveMediaFor('case', row.id)])],
}));

export const eventSeries = seriesRecords;
const workInventory: Work[] = artworkRecords.map((work) => ({
  ...work,
  story: [...work.story, ...sourceSectionsFor('work', work.id)],
  sourceRefs: sourceSectionsFor('work', work.id).length
    ? [...work.sourceRefs, sourceSnapshots['V1_Media_Registry.ts']]
    : work.sourceRefs,
  media: [...new Set([...work.media, ...archiveMediaFor('work', work.id)])],
  cases: [
    ...new Set([
      ...work.cases,
      ...caseInventory
        .filter((item) => item.work === work.id || item.relatedWorks?.includes(work.id))
        .map((item) => item.id),
    ]),
  ],
}));
const programmeInventory = [
  ...programmeRecords.map((row) => ({
    ...row,
    ...programmeEnrichments[row.id],
    sourceRefs: [...row.sourceRefs, ...(programmeEnrichments[row.id]?.sourceRefs ?? [])],
  })),
  ...additionalProgrammes,
].map((programme) => ({
  ...programme,
  media: [...new Set([...programme.media, ...archiveMediaFor('programme', programme.id)])],
  cases: [
    ...new Set([
      ...programme.cases,
      ...caseInventory
        .filter((item) => item.programme === programme.id || item.relatedProgrammes?.includes(programme.id))
        .map((item) => item.id),
    ]),
  ],
}));

export const { works, programmes, cases } = classifyCatalogue(
  workInventory,
  programmeInventory,
  caseInventory,
);

export const people: Person[] = [
  {
    id: 'founders',
    name: { en: 'Olga and Daler Arabov', ru: 'Ольга и Далер Арабовы' },
    role: { en: 'Artists and founders of ODA.dream', ru: 'Художники и основатели ODA.dream' },
    source: 'src/content/hub-cv.md; interference.md',
    publication: 'published',
  },
  ...studioPeople,
];

export const mediaById = (id: string) => media.find((item) => item.id === id);
export const workById = (id: string) => works.find((item) => item.id === id);

/** Shared catalogue selection; availability and repertoire remain independent fields. */
export const isRealizedWork = (work: Pick<Work, 'stage'>) => work.stage === 'realized';
export const realizedWorks = works.filter(isRealizedWork);
export const researchWorks = works.filter((work) => !isRealizedWork(work));
export const selectedWorks = realizedWorks.filter((work) => work.featuredOnHome);
