import type { CaseEvent, Localized, OrganizationRole } from './site';
import type { EditorialSection, SourceReference } from './editorial';
import { sourceSnapshots } from './editorial';

export interface CaseDetail {
  story: EditorialSection[];
  organizationRoles: { organizationId: string; role: OrganizationRole; description: Localized }[];
  participants: { name: Localized; role: Localized }[];
  limitations: Localized[];
  sourceRefs: SourceReference[];
}
const l = (ru: string, en: string): Localized => ({ ru, en });
const refs = (...files: string[]) => files.map((file) => sourceSnapshots[file]);
const section = (id: string, ru: string, en: string, bodyRu: string, bodyEn: string): EditorialSection => ({
  id,
  title: l(ru, en),
  body: l(bodyRu, bodyEn),
});
const org = (organizationId: string, role: OrganizationRole, ru: string, en: string) => ({
  organizationId,
  role,
  description: l(ru, en),
});

export const caseDetails: Record<string, CaseDetail> = {
  'tsiolkovsky-2026': {
    story: [
      section(
        'presentation',
        'Открытие XIV фестиваля',
        'Opening the 14th festival',
        '16 мая 2026 года в Инновационном культурном центре Калуги состоялась премьера «Интерференции реальностей». Спектакль открывал фестиваль Циолковского. Исполнители и зрители собирали пять сцен рядом с самостоятельной виртуальной реальностью; нейротехнологии и компьютерное зрение входили в художественно-технический контур.',
        'Interference of Realities premiered on 16 May 2026 at Kaluga’s Innovation Cultural Centre, opening the Tsiolkovsky festival. Performers and spectators assembled five scenes alongside an independent virtual reality; neurotechnology and computer vision formed part of the artistic and technical system.',
      ),
      section(
        'trajectory',
        'Контекст совместной постановки',
        'Context of the co-production',
        'Показ продолжил сотрудничество ODA.dream с Инновационным театром балета и лабораторную линию «Проекта Шрёдингер» 2025 года. Состоявшаяся премьера подтверждает конкретное участие команды в фестивале. Повторный показ, гастроли и дальнейшая конфигурация согласуются отдельно.',
        'The presentation continued ODA.dream’s collaboration with Innovation Ballet Theatre and the 2025 Project Schrödinger laboratory trajectory. The realised premiere documents this specific festival contribution. Repeat presentations, touring and future configurations are agreed separately.',
      ),
    ],
    organizationRoles: [
      org('ikc', 'venue', 'Площадка премьеры в Калуге.', 'Premiere venue in Kaluga.'),
      org(
        'itb',
        'co-producer',
        'Совместная постановка и труппа исполнителей.',
        'Co-production and performing company.',
      ),
      org(
        'neiry',
        'technology',
        'Технологический партнёр этой постановки.',
        'Technology partner for this production.',
      ),
    ],
    participants: [
      {
        name: l('Анна Сенатова', 'Anna Senatova'),
        role: l(
          'Художественное руководство; остальные авторские роли указаны на странице работы.',
          'Artistic leadership; other creative roles are credited on the work page.',
        ),
      },
    ],
    limitations: [
      l(
        'Награда за спектакль и постоянный репертуар в источниках этого показа не подтверждены.',
        'An award for the performance and a standing repertory are not established by the sources for this presentation.',
      ),
    ],
    sourceRefs: refs('event-tsiolkovsky-2026.md', 'interference.md'),
  },
  'tsiolkovsky-2025': {
    story: [
      section(
        'presentation',
        'Закрывающая лаборатория',
        'Closing laboratory',
        '22 мая 2025 года «Проект Шрёдингер» завершил программу фестиваля Циолковского в ИКЦ Калуги. Открытая лаборатория-спектакль вовлекала зрителей в сценическую работу с нейроинтерфейсами и пульсовыми датчиками. Устройства переходили между участниками и танцорами; технический контур раскрывался внутри драматургии.',
        'On 22 May 2025, Project Schrödinger closed the Tsiolkovsky festival programme at Kaluga’s Innovation Cultural Centre. The open laboratory performance involved spectators in stage work with neurointerfaces and pulse sensors. Devices passed between participants and dancers, and the technical system was revealed within the dramaturgy.',
      ),
      section(
        'participation',
        'Приглашение и со-постановка',
        'Invitation and co-staging',
        'Архив связывает участие с приглашением Анны Сенатовой и совместной постановкой с Инновационным театром балета. ODA.dream обеспечивала свой художественно-технологический контур и ведение лаборатории. Четыре ЭЭГ-канала и четыре пульсоканала описывают этот показ, а не универсальную производительность всех работ студии.',
        'The archive links participation to an invitation from Anna Senatova and co-staging with Innovation Ballet Theatre. ODA.dream provided its artistic and technological system and laboratory facilitation. Four EEG and four pulse channels describe this presentation, not a universal capacity for all studio works.',
      ),
    ],
    organizationRoles: [
      org('ikc', 'venue', 'Площадка фестивальной лаборатории.', 'Festival laboratory venue.'),
      org('itb', 'co-producer', 'Со-постановка и исполнение.', 'Co-staging and performance.'),
    ],
    participants: [
      {
        name: l('Анна Сенатова', 'Anna Senatova'),
        role: l('Приглашение к участию в фестивале.', 'Invitation to take part in the festival.'),
      },
    ],
    limitations: [
      l(
        'Лабораторный показ состоялся; сейчас работа не в репертуаре. Описанная конфигурация не является обещанием повторного показа без подготовки.',
        'The laboratory presentation took place; the work is currently outside the repertory. Its documented configuration is not a promise of a repeat presentation without preparation.',
      ),
    ],
    sourceRefs: refs('event-tsiolkovsky-2025.md', 'schrodinger.md'),
  },
  'dano-2025': {
    story: [
      section(
        'commission',
        'Событийная адаптация игры',
        'An event adaptation of the game',
        '17 декабря 2025 года на олимпиаде DANO в Москве была представлена версия «Парадокса Успеха» для «ЭкоНивы». Два игрока управляли общим виртуальным объектом через игровой контур ЭЭГ. Историческое название «Нейробитва» в архиве относится к той же работе.',
        'On 17 December 2025, a version of Paradox of Success for EkoNiva was presented at the DANO Olympiad in Moscow. Two players controlled a shared virtual object through an EEG game system. The archival Neurobattle name refers to the same work.',
      ),
      section(
        'roles',
        'Заказчик и организаторы',
        'Client and organisers',
        'В событийной записи «ЭкоНива» указана заказчиком, а НИУ ВШЭ и Т-Банк — организаторами олимпиады. Эти роли относятся к конкретному участию; они не означают, что все организации совместно создавали игру или являются постоянными партнёрами ODA.dream. Количество участников и фактический поток этого показа не указаны.',
        'The event record lists EkoNiva as the client, with HSE University and T-Bank as Olympiad organisers. These roles belong to this specific contribution; they do not imply that all organisations co-created the game or are permanent ODA.dream partners. Participant numbers and actual throughput for this presentation are not recorded.',
      ),
    ],
    organizationRoles: [
      org(
        'ekoniva',
        'client',
        'Заказчик интерактивного формата на событии.',
        'Client for the event’s interactive format.',
      ),
      org(
        'hse',
        'organizer',
        'Организатор олимпиады по метаданным события.',
        'Olympiad organiser according to the event metadata.',
      ),
      org(
        'tbank',
        'organizer',
        'Организатор олимпиады по метаданным события.',
        'Olympiad organiser according to the event metadata.',
      ),
    ],
    participants: [],
    limitations: [
      l(
        'Шаблонное поле «площадки» в старом тексте перечисляет организаторов; точный адрес проведения этим не подтверждён.',
        'The old template’s venue field lists the organisers; it does not establish the exact event address.',
      ),
    ],
    sourceRefs: refs('event-dano-ekoniva-2025.md', 'neurobattle.md'),
  },
  'byob-2026': {
    story: [
      section(
        'presentation',
        'MindShow в проекционной среде',
        'MindShow in a projection setting',
        '28 февраля 2026 года MindShow вновь показана на BYOB в Москве. Архив описывает приглашённое участие и обновлённую программно-техническую конфигурацию. Проекционная культура фестиваля соединяет живую аудиторию с генеративным изображением; Нейромандала составляет основу художественной системы.',
        'On 28 February 2026, MindShow returned to BYOB in Moscow. The archive describes an invited contribution with an updated software and technical configuration. The festival’s projection culture connects a live audience with generative imagery; Neuromandala underpins the artistic system.',
      ),
      section(
        'versions',
        'Продолжение фестивальной линии',
        'Continuing the festival trajectory',
        'В источнике показ связан с предыдущими участиями BYOB 2019 и 2020. История названий и версий относится к MindShow, тогда как эта запись фиксирует отдельное участие 2026 года. Приглашение и конкретный показ не превращаются в бессрочное институциональное партнёрство.',
        'The source connects this presentation to earlier BYOB contributions in 2019 and 2020. The history of names and versions belongs to MindShow, while this record documents the separate 2026 contribution. An invitation and a particular presentation do not imply an ongoing institutional partnership.',
      ),
    ],
    organizationRoles: [],
    participants: [
      {
        name: l('Екатерина Калашникова', 'Ekaterina Kalashnikova'),
        role: l(
          'Указана организатором в метаданных событийной записи.',
          'Listed as organiser in the event record’s metadata.',
        ),
      },
    ],
    limitations: [
      l(
        'Источник фиксирует город и дату; отдельная подтверждённая площадка не указана.',
        'The source records the city and date; a separately confirmed venue is not specified.',
      ),
    ],
    sourceRefs: refs('event-byob-2026.md', 'org-kalashnikova.md', 'mindshow.md'),
  },
};

export const historicalEvents: CaseEvent[] = [
  {
    id: 'portal-2025',
    legacyId: 'event-portal-2025',
    slug: 'portal-2025',
    title: l('MindShow · Портал 2030–2050', 'MindShow · Portal 2030–2050'),
    summary: l(
      'Конкурсный контекст MindShow; результат выделен в наградную запись.',
      'A competition context for MindShow; the result has a separate award record.',
    ),
    date: '2025',
    datePrecision: 'year',
    detailPage: false,
    featuredOnHome: false,
    type: 'presentation',
    place: l('Москва · площадка уточняется', 'Moscow · venue unconfirmed'),
    role: l(
      'ODA.dream: работа на конкурсе медиаарта «Виджеинг».',
      'ODA.dream: work in the VJ media-art competition.',
    ),
    work: 'mindshow',
    organizations: ['moscow2030'],
    evidence: [],
    media: [],
    story: [],
    participants: [],
    organizationRoles: [
      org(
        'moscow2030',
        'organizer',
        'Организационный контекст конкурса.',
        'Organisational context for the competition.',
      ),
    ],
    limitations: [
      l(
        'День не установлен. Архив указывает Сколково, а наградное изображение — Кинозавод «Москино»; площадка этого участия требует уточнения.',
        'The day is unconfirmed. The archive names Skolkovo, while the award image names Moschino Film Park; the venue for this contribution needs clarification.',
      ),
    ],
    sourceRefs: refs('event-portal-2025.md', 'proof-award-portal-visioning.md', 'hub-letters.md'),
    source: 'src/content/event-portal-2025.md; proof-award-portal-visioning.md',
    publication: 'published',
  },
  {
    id: 'wildmint-2025',
    legacyId: 'event-myata-2025',
    slug: 'wildmint-2025',
    title: l('Нейромандала · Дикая Мята', 'Neuromandala · Wild Mint'),
    summary: l(
      'Архивный контекст лекции и перформанса Нейромандалы на фестивале.',
      'An archival context for a Neuromandala lecture and performance at the festival.',
    ),
    date: '2025',
    datePrecision: 'year',
    detailPage: false,
    featuredOnHome: false,
    type: 'presentation',
    place: l('Фестиваль «Дикая Мята» · место уточняется', 'Wild Mint festival · location unconfirmed'),
    role: l('ODA.dream: приглашённые лекция и перформанс.', 'ODA.dream: invited lecture and performance.'),
    method: 'neuromandala',
    organizations: ['wildmint'],
    evidence: [],
    media: [],
    story: [],
    participants: [],
    organizationRoles: [
      org(
        'wildmint',
        'organizer',
        'Фестивальный контекст участия.',
        'Festival context for the contribution.',
      ),
    ],
    limitations: [
      l(
        'Событийный текст был заглушкой. Год и формат сохранены по связанному письму; точный день и место не подтверждены.',
        'The event body was a stub. The year and format are retained from the linked letter record; the exact day and location are unconfirmed.',
      ),
    ],
    sourceRefs: refs('event-myata-2025.md', 'proof-let-wildmint.md', 'hub-letters.md'),
    source: 'src/content/event-myata-2025.md; proof-let-wildmint.md',
    publication: 'published',
  },
  {
    id: 'cipr-2026',
    legacyId: 'event-cipr-mindshow-2026',
    slug: 'cipr-2026',
    title: l('MindShow · TechFriendly / ЦИПР', 'MindShow · TechFriendly / CIPR'),
    summary: l(
      'Приглашённое участие в программе TechFriendly в контексте форума ЦИПР.',
      'An invited contribution to TechFriendly in the context of the CIPR forum.',
    ),
    date: '2026',
    datePrecision: 'year',
    detailPage: false,
    featuredOnHome: false,
    type: 'presentation',
    place: l('Нижний Новгород', 'Nizhny Novgorod'),
    role: l(
      'ODA.dream: совместное выступление со студией Ashram / Натали Осман.',
      'ODA.dream: a joint presentation with Ashram Studio / Natali Osman.',
    ),
    work: 'mindshow',
    organizations: ['cipr', 'ashram'],
    evidence: [],
    media: [],
    story: [],
    participants: [],
    organizationRoles: [
      org(
        'cipr',
        'venue',
        'Контекст форума; отдельный адрес площадки не приведён.',
        'Forum context; no separate venue address is supplied.',
      ),
      org(
        'ashram',
        'client',
        'Указана заказчиком в метаданных; участие описано как совместное выступление.',
        'Listed as client in the metadata; participation is described as a joint presentation.',
      ),
    ],
    limitations: [
      l(
        'Точный день не установлен. Текст отзыва не цитируется: подтверждённого разрешения на публичное цитирование нет.',
        'The exact day is unconfirmed. The testimonial is not quoted because public quotation permission is unresolved.',
      ),
    ],
    sourceRefs: refs('event-cipr-mindshow-2026.md', 'proof-tst-cipr-techfriendly.md', 'org-ashram.md'),
    source: 'src/content/event-cipr-mindshow-2026.md; proof-tst-cipr-techfriendly.md',
    publication: 'published',
  },
];
