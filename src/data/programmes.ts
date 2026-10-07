import type { Localized, Publication } from './site';
import { participationDetails, sourceSnapshots, type ParticipationDetail } from './editorial';

export interface Programme extends ParticipationDetail {
  id: string;
  legacyId: string;
  slug: string;
  title: Localized;
  summary: Localized;
  scope: Localized;
  programmeType: 'lecture' | 'workshop' | 'laboratory';
  deliveryStatus: 'documented' | 'proposed';
  audience: Localized;
  authorsNote: Localized;
  media: string[];
  cases: string[];
  works: string[];
  source: string;
  publication: Publication;
}

// Common educational conditions also preserve the dated overview's factual input.
// This is not a standalone programme or a public Formats record.
export const educationOverview = {
  ...participationDetails['talk-workshop'],
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
  publication: 'published' as const,
};

const definitions = [
  {
    id: 'beautiful-brain',
    legacyId: 'beautiful-brain',
    slug: 'beautiful-about-the-brain',
    programmeType: 'lecture',
    title: {
      ru: 'Красиво про мозг',
      en: 'Beautiful About the Brain',
    },
    summary: {
      ru: 'Лекция-перформанс о восприятии с демонстрацией Нейромандалы и добровольным участием аудитории.',
      en: 'A lecture-performance on perception with a Neuromandala demonstration and voluntary audience participation.',
    },
    story: {
      ru: 'Разговор о нейронах, ритмах и творчестве соединён с демонстрацией ЭЭГ и генеративного изображения. Дуэт ведущих задаёт тему; спикер и добровольцы могут участвовать в нейровизуальной демонстрации. Источник связывает лекцию с приглашением НИУ ВШЭ в мае 2025; это конкретный контекст, а не постоянное институциональное партнёрство.',
      en: 'A conversation about neurons, rhythms and creativity meets an EEG and generative-image demonstration. Two hosts introduce the topic; the speaker and volunteers can join the neurovisual demonstration. The source links the lecture to an HSE invitation in May 2025, a specific context rather than an ongoing institutional partnership.',
    },
    topics: [
      {
        ru: 'Восприятие, внимание и творчество',
        en: 'Perception, attention and creativity',
      },
      {
        ru: 'ЭЭГ, нейроинтерфейсы и биологическая обратная связь',
        en: 'EEG, neural interfaces and biofeedback',
      },
      {
        ru: 'Наблюдение демонстрации и обсуждение опыта',
        en: 'Observing a demonstration and discussing the experience',
      },
    ],
    audience: {
      ru: 'Аудитория и адаптация определяются по задаче программы',
      en: 'Audience and adaptation are scoped for the programme',
    },
    authorsNote: {
      ru: 'Авторская программа ODA.dream. Состав ведущих согласуется для конкретного приглашения.',
      en: 'An ODA.dream programme. Facilitators are agreed for the invitation.',
    },
    deliveryStatus: 'documented',
    conditions: [
      {
        id: 'programme-brief',
        label: {
          ru: 'Длительность и условия',
          en: 'Duration and conditions',
        },
        value: {
          ru: 'Длительность, ведущие, оборудование, доступность, участие и разрешения на запись фиксируются в предложении. Архивные параметры не заменяют согласованную программу.',
          en: 'Duration, facilitators, equipment, accessibility, participation and recording permission are fixed in the proposal. Archival parameters do not replace an agreed programme.',
        },
        state: 'per-brief',
      },
    ],
    media: [],
    cases: [],
    works: [],
    source: 'src/content/beautiful-brain.md; hub-education.md',
    publication: 'published',
  },
  {
    id: 'neuroaesthetics-lec',
    legacyId: 'neuroaesthetics-lec',
    slug: 'neuroaesthetics',
    programmeType: 'lecture',
    title: {
      ru: 'Нейроэстетика',
      en: 'Neuroaesthetics',
    },
    summary: {
      ru: 'Лекция для художников, кураторов и междисциплинарной аудитории о восприятии искусства.',
      en: 'A lecture for artists, curators and interdisciplinary audiences on the perception of art.',
    },
    story: {
      ru: 'Программа связывает теории зрительного восприятия с современной медиа-арт практикой. Обсуждаются выделение, значимость, предсказание и эстетические решения, способы говорить об отклике аудитории и этические границы влияния. Формулировки источника используются как темы обсуждения, без обещания измерить вкус человека или управлять его реакцией.',
      en: 'The programme connects theories of visual perception with contemporary media-art practice. It discusses selection, salience, prediction, aesthetic decisions, ways to talk about audience response and the ethical limits of influence. Source claims are treated as discussion topics without promising to measure a person’s taste or control their response.',
    },
    topics: [
      {
        ru: 'Зрительное восприятие и современное искусство',
        en: 'Visual perception and contemporary art',
      },
      {
        ru: 'Внимание, значимость и ожидания',
        en: 'Attention, salience and expectations',
      },
      {
        ru: 'Этика эстетического воздействия',
        en: 'Ethics of aesthetic influence',
      },
    ],
    audience: {
      ru: 'Художники, кураторы и междисциплинарная аудитория',
      en: 'Artists, curators and interdisciplinary audiences',
    },
    authorsNote: {
      ru: 'Авторская программа ODA.dream. Состав ведущих согласуется для конкретного приглашения.',
      en: 'An ODA.dream programme. Facilitators are agreed for the invitation.',
    },
    deliveryStatus: 'documented',
    conditions: [
      {
        id: 'programme-brief',
        label: {
          ru: 'Длительность и условия',
          en: 'Duration and conditions',
        },
        value: {
          ru: 'Длительность, ведущие, оборудование, доступность, участие и разрешения на запись фиксируются в предложении. Архивные параметры не заменяют согласованную программу.',
          en: 'Duration, facilitators, equipment, accessibility, participation and recording permission are fixed in the proposal. Archival parameters do not replace an agreed programme.',
        },
        state: 'per-brief',
      },
    ],
    media: [],
    cases: [],
    works: [],
    source: 'src/content/neuroaesthetics-lec.md; hub-education.md',
    publication: 'published',
  },
  {
    id: 'sound-brain',
    legacyId: 'sound-brain',
    slug: 'sound-and-attention',
    programmeType: 'lecture',
    title: {
      ru: 'Звук и синхронизация',
      en: 'Sound and Synchronization',
    },
    summary: {
      ru: 'Лекция с практикой направленного слушания о звуке, внимании и опыте восприятия.',
      en: 'A lecture with guided listening on sound, attention and perceptual experience.',
    },
    story: {
      ru: 'Ритм, плотность звука и резонанс рассматриваются через слуховое внимание и проектирование звуковой среды. Участники пробуют направленное слушание и короткую рефлексию до и после. Демонстрационный нейровизуальный слой включается по задаче программы; сходство ощущений не объявляется доказанной физиологической синхронизацией.',
      en: 'Rhythm, sound density and resonance are explored through auditory attention and sound-environment design. Participants try guided listening and a short reflection before and after. A neurovisual demonstration is included when relevant; shared sensations are not presented as proof of physiological synchronization.',
    },
    topics: [
      {
        ru: 'Слуховая обработка и внимание',
        en: 'Auditory processing and attention',
      },
      {
        ru: 'Пассивное и направленное слушание',
        en: 'Passive and guided listening',
      },
      {
        ru: 'Рефлексия и проектирование звуковой среды',
        en: 'Reflection and sound-environment design',
      },
    ],
    audience: {
      ru: 'Аудитория и адаптация определяются по задаче программы',
      en: 'Audience and adaptation are scoped for the programme',
    },
    authorsNote: {
      ru: 'Авторская программа ODA.dream. Состав ведущих согласуется для конкретного приглашения.',
      en: 'An ODA.dream programme. Facilitators are agreed for the invitation.',
    },
    deliveryStatus: 'documented',
    conditions: [
      {
        id: 'programme-brief',
        label: {
          ru: 'Длительность и условия',
          en: 'Duration and conditions',
        },
        value: {
          ru: 'Длительность, ведущие, оборудование, доступность, участие и разрешения на запись фиксируются в предложении. Архивные параметры не заменяют согласованную программу.',
          en: 'Duration, facilitators, equipment, accessibility, participation and recording permission are fixed in the proposal. Archival parameters do not replace an agreed programme.',
        },
        state: 'per-brief',
      },
    ],
    media: [],
    cases: [],
    works: [],
    source: 'src/content/sound-brain.md; hub-education.md',
    publication: 'published',
  },
  {
    id: 'taste-brain',
    legacyId: 'taste-brain',
    slug: 'taste-and-the-brain',
    programmeType: 'lecture',
    title: {
      ru: 'Вкус и мозг',
      en: 'Taste and the Brain',
    },
    summary: {
      ru: 'Интерактивная лекция о вкусе, запахе, текстуре и роли контекста в восприятии еды.',
      en: 'An interactive lecture on taste, smell, texture and the role of context in food perception.',
    },
    story: {
      ru: 'Программа разбирает различие вкуса и flavor, роль памяти, внимания и ожиданий. Короткие сенсорные задания и изменение контекста становятся материалом для группового обсуждения различий восприятия. Прикладная часть связана с проектированием событийного и гастрономического опыта. Состав заданий и обеспечение площадки согласуются отдельно.',
      en: 'The programme explores the distinction between taste and flavour and the roles of memory, attention and expectations. Short sensory tasks and changes of context provide material for discussing differences in perception. The practical discussion concerns event and gastronomic experience design. Exercises and venue provision are agreed separately.',
    },
    topics: [
      {
        ru: 'Вкус и мультисенсорное восприятие',
        en: 'Taste and multisensory perception',
      },
      {
        ru: 'Свет, звук, нарратив и ожидания',
        en: 'Light, sound, narrative and expectations',
      },
      {
        ru: 'Сенсорные задания и групповая рефлексия',
        en: 'Sensory tasks and group reflection',
      },
    ],
    audience: {
      ru: 'Аудитория и адаптация определяются по задаче программы',
      en: 'Audience and adaptation are scoped for the programme',
    },
    authorsNote: {
      ru: 'Авторская программа ODA.dream. Состав ведущих согласуется для конкретного приглашения.',
      en: 'An ODA.dream programme. Facilitators are agreed for the invitation.',
    },
    deliveryStatus: 'documented',
    conditions: [
      {
        id: 'programme-brief',
        label: {
          ru: 'Длительность и условия',
          en: 'Duration and conditions',
        },
        value: {
          ru: 'Длительность, ведущие, оборудование, доступность, участие и разрешения на запись фиксируются в предложении. Архивные параметры не заменяют согласованную программу.',
          en: 'Duration, facilitators, equipment, accessibility, participation and recording permission are fixed in the proposal. Archival parameters do not replace an agreed programme.',
        },
        state: 'per-brief',
      },
    ],
    media: [],
    cases: [],
    works: [],
    source: 'src/content/taste-brain.md; hub-education.md',
    publication: 'published',
  },
  {
    id: 'feedback-empathy-brain',
    legacyId: 'feedback-empathy-brain',
    slug: 'empathy-protocol',
    programmeType: 'lecture',
    title: {
      ru: 'Протокол эмпатии',
      en: 'Empathy Protocol',
    },
    summary: {
      ru: 'Лекция-дискуссия о внимании, слушании и взаимодействии людей в диалоге.',
      en: 'A lecture-discussion on attention, listening and human interaction in dialogue.',
    },
    story: {
      ru: 'Программа предлагает язык для обсуждения наблюдаемых и частично измеримых аспектов межличностного взаимодействия. Разбираются возможности и ограничения парных сигналов, качество коммуникации и фасилитационные техники. Она может входить в культурную или командную программу; физиологические сигналы не трактуются как прямое измерение эмпатии.',
      en: 'The programme offers a language for discussing observable and partly measurable aspects of interpersonal interaction. It considers the possibilities and limits of paired signals, communication quality and facilitation techniques. It can be part of a cultural or team programme; physiological signals are not treated as a direct measure of empathy.',
    },
    topics: [
      {
        ru: 'Возможности и ограничения парных сигналов',
        en: 'Possibilities and limits of paired signals',
      },
      {
        ru: 'Слушание и совместное внимание',
        en: 'Listening and shared attention',
      },
      {
        ru: 'Фасилитация и обсуждение коммуникации',
        en: 'Facilitation and communication discussion',
      },
    ],
    audience: {
      ru: 'Аудитория и адаптация определяются по задаче программы',
      en: 'Audience and adaptation are scoped for the programme',
    },
    authorsNote: {
      ru: 'Авторская программа ODA.dream. Состав ведущих согласуется для конкретного приглашения.',
      en: 'An ODA.dream programme. Facilitators are agreed for the invitation.',
    },
    deliveryStatus: 'documented',
    conditions: [
      {
        id: 'programme-brief',
        label: {
          ru: 'Длительность и условия',
          en: 'Duration and conditions',
        },
        value: {
          ru: 'Длительность, ведущие, оборудование, доступность, участие и разрешения на запись фиксируются в предложении. Архивные параметры не заменяют согласованную программу.',
          en: 'Duration, facilitators, equipment, accessibility, participation and recording permission are fixed in the proposal. Archival parameters do not replace an agreed programme.',
        },
        state: 'per-brief',
      },
    ],
    media: [],
    cases: [],
    works: [],
    source: 'src/content/feedback-empathy-brain.md; hub-education.md',
    publication: 'published',
  },
  {
    id: 'gong',
    legacyId: 'gong',
    slug: 'gong-theatre',
    programmeType: 'workshop',
    title: {
      ru: 'Гонг Театр',
      en: 'Gong Theatre',
    },
    summary: {
      ru: 'Фасилитируемая звуковая практика с живым акустическим и нейровизуальным слоями.',
      en: 'A facilitated listening practice with live acoustic and neurovisual layers.',
    },
    story: {
      ru: 'Живой гонг, обертоновые инструменты или резонансные текстуры соединяются с внимательной траекторией слушания. Визуальная интерпретация поддерживает последующую рефлексию и не используется для диагностики. Источник описывает опыт присутствия, слушания и совместного внимания; конкретный состав исполнителей, оборудование и длительность определяются при подготовке.',
      en: 'A live gong, overtone instruments or resonant textures meet a guided listening trajectory. Visual interpretation supports reflection and is not used for diagnosis. The source describes presence, listening and shared attention; performers, equipment and duration are determined during preparation.',
    },
    topics: [
      {
        ru: 'Живой акустический слой',
        en: 'Live acoustic layer',
      },
      {
        ru: 'Фасилитируемое внимание',
        en: 'Facilitated attention',
      },
      {
        ru: 'Визуальная интерпретация и рефлексия',
        en: 'Visual interpretation and reflection',
      },
    ],
    audience: {
      ru: 'Аудитория и адаптация определяются по задаче программы',
      en: 'Audience and adaptation are scoped for the programme',
    },
    authorsNote: {
      ru: 'Авторская программа ODA.dream. Состав ведущих согласуется для конкретного приглашения.',
      en: 'An ODA.dream programme. Facilitators are agreed for the invitation.',
    },
    deliveryStatus: 'documented',
    conditions: [
      {
        id: 'programme-brief',
        label: {
          ru: 'Длительность и условия',
          en: 'Duration and conditions',
        },
        value: {
          ru: 'Длительность, ведущие, оборудование, доступность, участие и разрешения на запись фиксируются в предложении. Архивные параметры не заменяют согласованную программу.',
          en: 'Duration, facilitators, equipment, accessibility, participation and recording permission are fixed in the proposal. Archival parameters do not replace an agreed programme.',
        },
        state: 'per-brief',
      },
    ],
    media: [],
    cases: [],
    works: [],
    source: 'src/content/gong.md; hub-education.md',
    publication: 'published',
  },
  {
    id: 'neuromandala-workshop',
    legacyId: 'hub-education',
    slug: 'neuromandala-workshop',
    programmeType: 'workshop',
    title: {
      ru: 'Практикум Нейромандалы',
      en: 'Neuromandala Workshop',
    },
    summary: {
      ru: 'Знакомство с нейроинтерфейсом, наблюдение визуализации и работа с собственным опытом.',
      en: 'An introduction to neural interfaces, observation of the visualization and exploration of personal experience.',
    },
    story: {
      ru: 'Участники знакомятся с ЭЭГ-нейроинтерфейсами и наблюдают, как сигналы становятся генеративным изображением. Практика соединяется с обсуждением и созданием собственного материала. Общий архивный сценарий предполагает 1,5–3 часа и группу 10–30 человек с 14 лет; размер группы не означает одновременного измерения всех людей. Адаптации для детей 8–14 лет в источнике описаны отдельно и требуют иной подготовки.',
      en: 'Participants are introduced to EEG interfaces and observe signals becoming generative images. Practice is combined with discussion and the creation of personal material. The general archival scenario gives 1.5–3 hours and a group of 10–30 people aged 14 and over; group size does not mean simultaneous measurement of everyone. Adaptations for children aged 8–14 are described separately and require different preparation.',
    },
    topics: [
      {
        ru: 'Знакомство с интерфейсом и наблюдение',
        en: 'Introduction to the interface and observation',
      },
      {
        ru: 'Практика участия и обсуждение',
        en: 'Participation practice and discussion',
      },
      {
        ru: 'Создание собственного материала',
        en: 'Creating personal material',
      },
    ],
    audience: {
      ru: 'Архивный сценарий: с 14 лет; детская адаптация согласуется отдельно',
      en: 'Archival scenario: age 14+; a children’s adaptation is scoped separately',
    },
    authorsNote: {
      ru: 'Авторская программа ODA.dream. Состав ведущих согласуется для конкретного приглашения.',
      en: 'An ODA.dream programme. Facilitators are agreed for the invitation.',
    },
    deliveryStatus: 'documented',
    conditions: [
      {
        id: 'programme-brief',
        label: {
          ru: 'Длительность и условия',
          en: 'Duration and conditions',
        },
        value: {
          ru: 'Длительность, ведущие, оборудование, доступность, участие и разрешения на запись фиксируются в предложении. Архивные параметры не заменяют согласованную программу.',
          en: 'Duration, facilitators, equipment, accessibility, participation and recording permission are fixed in the proposal. Archival parameters do not replace an agreed programme.',
        },
        state: 'per-brief',
      },
    ],
    media: [],
    cases: [],
    works: [],
    source: 'src/content/hub-education.md',
    publication: 'published',
  },
  {
    id: 'neuro-laboratory',
    legacyId: 'hub-education',
    slug: 'neuro-laboratory',
    programmeType: 'laboratory',
    title: {
      ru: 'Нейролаборатория',
      en: 'Neuro Laboratory',
    },
    summary: {
      ru: 'Многодневная образовательная программа с лекциями, практикой и созданием работ участников.',
      en: 'A multi-day educational programme combining lectures, practice and participant-created works.',
    },
    story: {
      ru: 'Архив описывает летнюю школу или интенсив на 2–5 дней: лекции, воркшопы и сессии создания собственных работ Нейромандалы. Это рамка программы, а не утверждение о проведённом конкретном курсе. Возраст, число встреч, оборудование, содержание и результат собственной работы участников определяются под задачу приглашения.',
      en: 'The archive describes a summer school or a 2–5-day intensive with lectures, workshops and sessions for creating participants’ own Neuromandala works. This is a programme framework, not a claim that a specific course took place. Age, sessions, equipment, content and participant outcomes are scoped for the invitation.',
    },
    topics: [
      {
        ru: 'Искусство и восприятие',
        en: 'Art and perception',
      },
      {
        ru: 'Практика работы с обратной связью',
        en: 'Biofeedback practice',
      },
      {
        ru: 'Создание работы и обсуждение результатов',
        en: 'Creating a work and discussing outcomes',
      },
    ],
    audience: {
      ru: 'Аудитория и адаптация определяются по задаче программы',
      en: 'Audience and adaptation are scoped for the programme',
    },
    authorsNote: {
      ru: 'Авторская программа ODA.dream. Состав ведущих согласуется для конкретного приглашения.',
      en: 'An ODA.dream programme. Facilitators are agreed for the invitation.',
    },
    deliveryStatus: 'proposed',
    conditions: [
      {
        id: 'programme-brief',
        label: {
          ru: 'Длительность и условия',
          en: 'Duration and conditions',
        },
        value: {
          ru: 'Длительность, ведущие, оборудование, доступность, участие и разрешения на запись фиксируются в предложении. Архивные параметры не заменяют согласованную программу.',
          en: 'Duration, facilitators, equipment, accessibility, participation and recording permission are fixed in the proposal. Archival parameters do not replace an agreed programme.',
        },
        state: 'per-brief',
      },
    ],
    media: [],
    cases: [],
    works: [],
    source: 'src/content/hub-education.md',
    publication: 'published',
  },
];
export const programmes: Programme[] = definitions.map((row) => ({
  ...participationDetails['talk-workshop'],
  ...row,
  programmeType: row.programmeType as Programme['programmeType'],
  deliveryStatus: row.deliveryStatus as Programme['deliveryStatus'],
  publication: row.publication as Publication,
  conditions: row.conditions as ParticipationDetail['conditions'],
  scope: educationOverview.scope,
  participation:
    row.programmeType === 'lecture'
      ? {
          ru: 'Разговор, наблюдение и обсуждение; демонстрация и добровольное участие уточняются под тему.',
          en: 'Conversation, observation and discussion; demonstration and voluntary participation are scoped for the topic.',
        }
      : row.id === 'gong'
        ? {
            ru: 'Фасилитируемое слушание живого звука и рефлексия опыта.',
            en: 'Facilitated listening to live sound and reflection on the experience.',
          }
        : row.programmeType === 'laboratory'
          ? {
              ru: 'Лекции, воркшопы и сессии создания собственной работы с обсуждением.',
              en: 'Lectures, workshops and sessions for creating and discussing personal work.',
            }
          : {
              ru: 'Наблюдение визуализации, практика участия и обсуждение собственного материала.',
              en: 'Observing the visualization, participation practice and discussion of personal material.',
            },
  outcome:
    row.programmeType === 'laboratory'
      ? {
          ru: 'Согласованный результат собственной работы участников; содержание и способ представления определяются в брифе.',
          en: 'An agreed outcome of participants’ work; content and presentation are scoped in the brief.',
        }
      : {
          ru: 'Знакомство с темой и материал для обсуждения/рефлексии собственного опыта.',
          en: 'An introduction to the topic and material for discussing or reflecting on personal experience.',
        },
  sourceRefs: [
    sourceSnapshots[(row.legacyId === 'hub-education' ? 'hub-education' : row.legacyId) + '.md'],
    sourceSnapshots['hub-education.md'],
  ],
}));
