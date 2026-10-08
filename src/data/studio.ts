import type { Localized, Person, Publication } from './site';
import type { EditorialSection, SourceReference } from './editorial';
import { intellectualProperty, sourceSnapshots } from './editorial';

export interface StudioPage {
  id: string;
  title: Localized;
  summary: Localized;
  people: string[];
  sections: EditorialSection[];
  teaching: (EditorialSection & { year: number })[];
  materials: { id: string; title: Localized; body: Localized; path: string }[];
  sourceRefs: SourceReference[];
  source: string;
  publication: Publication;
}
const l = (ru: string, en: string): Localized => ({ ru, en });
const refs = (...files: string[]) => files.map((file) => sourceSnapshots[file]);

export const studioPeople: Person[] = [
  {
    id: 'olga',
    name: l('Ольга Арабова', 'Olga Arabova'),
    role: l('Междисциплинарная художница и фасилитатор', 'Interdisciplinary artist and facilitator'),
    biography: l(
      'Работает с телесным вниманием, коммуникацией и опытом участника. В ODA.dream связывает художественный замысел с фасилитацией: знакомством с форматом, взаимодействием группы и разбором пережитого. Участвует в разработке образовательных и партисипаторных работ.',
      'Works with embodied attention, communication and participant experience. Within ODA.dream, she connects artistic concepts with facilitation: introducing a format, supporting group interaction and reflecting on the experience. She contributes to educational and participatory works.',
    ),
    cv: {
      sections: [
        {
          id: 'practice',
          title: l('Практика', 'Practice'),
          body: l(
            'Партисипаторные и образовательные форматы, телесное внимание, коммуникация и фасилитация групп. В художественных проектах связывает взаимодействие участников с замыслом работы и последующим обсуждением опыта.',
            'Participatory and educational formats, embodied attention, communication and group facilitation. In artistic projects, she connects participant interaction with the work’s concept and reflection on the experience.',
          ),
        },
        {
          id: 'background',
          title: l('Образование и профессиональный опыт', 'Education and professional background'),
          body: l(
            'В биографическом источнике для заявки CYENS указаны высшее образование в Астраханском государственном техническом университете, коучинговая квалификация ICF PCC и подготовка в телесных и танцевально-двигательных практиках. Даты обучения и текущий сертификационный статус источником не уточнены.',
            'The CYENS application biography records higher education at Astrakhan State Technical University, an ICF PCC coaching qualification, and training in embodied and dance-movement practices. Study dates and current certification status are not specified by the source.',
          ),
        },
      ],
      base: l(
        'Текущая рабочая база и условия поездок уточняются при обращении.',
        'Current working base and travel arrangements are confirmed on inquiry.',
      ),
      workIds: ['mindshow', 'neurobattle', 'interference'],
      caseIds: ['tsiolkovsky-2026', 'cipr-2026'],
    },
    sourceRefs: refs('hub-cv.md', 'Olga_Arabova_CV.md'),
    source: 'src/content/hub-cv.md',
    publication: 'published',
  },
  {
    id: 'daler',
    name: l('Далер Арабов', 'Daler Arabov'),
    role: l('Медиахудожник, инженер и проектировщик систем', 'Media artist, engineer and system designer'),
    biography: l(
      'Создаёт системы реального времени, генеративные среды и взаимодействия с нейроинтерфейсами. В ODA.dream соединяет художественный визуальный язык с архитектурой сенсоров и авторского ПО, подготовкой сценической или выставочной конфигурации и её работой во время показа.',
      'Creates real-time systems, generative environments and interactions with neurointerfaces. Within ODA.dream, he connects an artistic visual language with sensor and custom-software architecture, the preparation of stage or exhibition configurations and their operation during a presentation.',
    ),
    cv: {
      sections: [
        {
          id: 'practice',
          title: l('Практика', 'Practice'),
          body: l(
            'Генеративные среды, интерактивные инсталляции, сценические системы и прототипирование художественных интерфейсов. Соединяет программирование, сенсоры и визуальный язык с подготовкой и работой системы во время показа.',
            'Generative environments, interactive installations, stage systems and artistic-interface prototyping. He connects software, sensors and a visual language with preparing and operating a system during a presentation.',
          ),
        },
        {
          id: 'background',
          title: l('Образование и профессиональный опыт', 'Education and professional background'),
          body: l(
            'Биографический источник CYENS указывает инженерное образование в МГТУ им. Н. Э. Баумана по направлению проектирования и технологии электронной аппаратуры, преподавание технического творчества, руководство выпускными работами и создание FabLab «ЦЕХ-4» в МГТУ. Точные периоды в источнике не приведены.',
            'The CYENS biography records an engineering degree in electronic-equipment design and technology at Bauman Moscow State Technical University, teaching technical creativity, supervising graduation projects and founding FabLab TSEKH-4 at BMSTU. Exact periods are not provided by the source.',
          ),
        },
      ],
      base: l(
        'Текущая рабочая база и условия поездок уточняются при обращении.',
        'Current working base and travel arrangements are confirmed on inquiry.',
      ),
      workIds: ['mindshow', 'neurobattle', 'interference'],
      caseIds: ['tsiolkovsky-2026', 'cipr-2026'],
    },
    sourceRefs: refs('hub-cv.md', 'Daler_Arabov_CV.md'),
    source: 'src/content/hub-cv.md',
    publication: 'published',
  },
];

export const studioPages: StudioPage[] = [
  {
    id: 'studio',
    title: l('Студия ODA.dream', 'ODA.dream studio'),
    summary: l(
      'Ольга и Далер Арабовы создают произведения на пересечении сценического искусства, человеческого восприятия и технологических систем. Художественный замысел, инженерная работа и сопровождение участия образуют общий процесс.',
      'Olga and Daler Arabov create works at the intersection of performance, human perception and technological systems. Artistic concepts, engineering and participant facilitation form one shared process.',
    ),
    people: ['olga', 'daler'],
    sections: [
      {
        id: 'intellectual-property',
        title: l('Товарный знак и изобретение', 'Trademark and invention'),
        body: l(
          `ODA.dream® — зарегистрированный товарный знак №${intellectualProperty.trademark.number} от 25 февраля 2026 года. Заявка на изобретение №${intellectualProperty.inventionApplication.number} подана 30 апреля 2026 года. Номера и даты подтверждены владельцем студии; подача заявки не означает выдачу патента.`,
          `ODA.dream® is registered trademark No. ${intellectualProperty.trademark.number}, dated 25 February 2026. Invention application No. ${intellectualProperty.inventionApplication.number} was filed on 30 April 2026. The numbers and dates were confirmed by the studio owner; filing does not establish a granted patent.`,
        ),
      },
      {
        id: 'submissions',
        title: {
          ru: 'Заявки и результаты отбора',
          en: 'Applications and selection outcomes',
        },
        body: {
          ru: 'В 2026 году Нейромандала подана на Prix Ars Electronica в категории Interactive Art+. Подача не означает награду. Заявки MindGrid и MindShow для CYENS WIP попали в резервный список; итоговый архив от 29 сентября фиксирует отсутствие отбора на фестиваль. Эти истории сохраняются как конкурсная работа, а не состоявшиеся показы.',
          en: 'In 2026, Neuromandala was submitted to Prix Ars Electronica in the Interactive Art+ category. A submission does not establish an award. The MindGrid and MindShow proposals for CYENS WIP entered the reserve list; the final archive dated 29 September records that festival selection did not follow. These histories remain competition work, not completed presentations.',
        },
      },
      {
        id: 'professional',
        title: {
          ru: 'Профессиональные связи',
          en: 'Professional affiliations',
        },
        body: {
          ru: 'Биографические материалы студии указывают членство в Творческом союзе художников России: Ольга — в секции научного искусства, Далер — мультимедиа. Участие в событиях других организаций описывается через конкретную роль: автор, соавтор, приглашённый спикер или участник показа.',
          en: 'Studio biographies record membership in the Creative Union of Artists of Russia: Olga in Scientific Art and Daler in Multimedia. Contributions to other organizations’ events are described through a specific role: author, co-author, invited speaker or presenting participant.',
        },
      },
      {
        id: 'press',
        title: {
          ru: 'Публикации и эфиры',
          en: 'Publications and broadcasts',
        },
        body: {
          ru: 'Внешние материалы о публичных проектах студии. Публикации сохраняют авторство редакций и открываются на площадке источника.',
          en: 'External materials about the studio’s public projects. Publications retain their publishers’ authorship and open at the source.',
        },
        links: [
          {
            id: 'ntv-metro',
            title: {
              ru: 'НТВ · цифровой пленэр в московском метро',
              en: 'NTV · digital plein air in the Moscow metro',
            },
            href: 'https://www.ntv.ru/novosti/2887676/',
            kind: 'article',
          },
          {
            id: 'tskhr-bashkiria',
            title: {
              ru: 'ТСХР · первый цифровой пленэр в Башкирии',
              en: 'TSKhR · first digital plein air in Bashkiria',
            },
            href: 'https://tcxp.ru/news/regions/v-bashkirii-proshel-pervyy-cifrovoy-plener',
            kind: 'article',
          },
        ],
      },
      {
        id: 'position',
        title: l('Человек внутри системы', 'The person within the system'),
        body: l(
          'Биосигналы используются как материал изображения, звука и взаимодействия. Сенсорный отклик не заменяет живой опыт человека: значение возникает из наблюдения, рассказа и контекста. Нейромандала связывает индивидуальный сигнал с художественной средой; коллективные работы добавляют движение, сценическую партитуру и участие группы.',
          'Biosignals become material for image, sound and interaction. A sensor’s response does not replace lived experience: meaning emerges through observation, personal accounts and context. Neuromandala connects an individual signal with an artistic environment; collective works add movement, a stage score and group participation.',
        ),
      },
      {
        id: 'ethics',
        title: l('Согласие и интерпретация', 'Consent and interpretation'),
        body: l(
          'Сигналы не используются для медицинских или психологических выводов о человеке. Для каждого показа определяются добровольность участия, работа с записью, хранение данных и доступ к результату. Личная история, измерение и художественная метафора различаются; устройство не получает права объяснять участника вместо него самого.',
          'Signals are not used to make medical or psychological judgments about a person. Voluntary participation, recording, data retention and access to results are defined for each presentation. Personal accounts, measurements and artistic metaphors remain distinct; a device does not speak on a participant’s behalf.',
        ),
      },
      {
        id: 'production',
        title: l('Авторская работа и инфраструктура показа', 'Authored work and presentation infrastructure'),
        body: l(
          'Студия отвечает за свою художественную и техническую часть и сопровождение участников по выбранной конфигурации. Исполнители, соавторы и специалисты включаются в конкретный проект и получают обозначенные роли. Экран, звук, пространство, local production и поток посетителей согласуются с площадкой; состав команды и длительность эксплуатации не выводятся из одного архивного показа.',
          'The studio provides its artistic and technical contribution and participant facilitation for the chosen configuration. Performers, co-authors and specialists join specific projects with attributed roles. Screen, sound, space, local production and visitor flow are agreed with the venue; staffing and operating duration are not inferred from a single archival presentation.',
        ),
      },
    ],
    teaching: [
      {
        id: 'hse',
        year: 2025,
        title: l('«Красиво про мозг» · НИУ ВШЭ', 'Beautiful About the Brain · HSE University'),
        body: l(
          'В архиве зафиксировано экспертное приглашение к лекции в НИУ ВШЭ в Москве. Это контекст образовательной практики студии; роль приглашённого автора не подменяется постоянной преподавательской должностью.',
          'The archive records an expert invitation to give a lecture at HSE University in Moscow. This is a context for the studio’s educational practice; an invited contribution does not imply a permanent teaching position.',
        ),
      },
      {
        id: 'sber',
        year: 2025,
        title: l('Science-art лекция · Сбербанк', 'Science-art lecture · Sberbank'),
        body: l(
          'Архив описывает экспертное приглашение к science-art лекции для корпоративной аудитории в Москве. Это лекционное участие, а не заказ интерактивного стенда. Точный день не уточнён; сохранён год события.',
          'The archive describes an expert invitation for a science-art lecture to a corporate audience in Moscow. This is a lecture contribution, not a commission for an interactive stand. The exact day is unconfirmed; the event year is retained.',
        ),
      },
      {
        id: 'mipt',
        year: 2025,
        title: l('«Терраформинг» · МФТИ', 'Terraforming · MIPT'),
        body: l(
          'Архив связывает выставку Нейромандалы «Терраформинг» на площадке МФТИ с воркшопами. Событийная запись указывает приглашение и площадку; образовательное описание раскрывает практическую часть. Участие не обозначено бессрочным партнёрством с институцией.',
          'The archive connects the Neuromandala exhibition Terraforming at MIPT with workshops. The event record identifies an invitation and venue; the educational description explains the practical contribution. Participation is not described as an ongoing institutional partnership.',
        ),
      },
    ],
    materials: [
      {
        id: 'portfolio',
        path: 'works/',
        title: l('Работы и их истории', 'Works and their stories'),
        body: l(
          'Страницы реализованных работ и отдельная подборка концепций и прототипов.',
          'Pages for realised works and a separate selection of concepts and prototypes.',
        ),
      },
      {
        id: 'method',
        path: 'technology/',
        title: l('Нейромандала: метод', 'Neuromandala: the method'),
        body: l(
          'Сигнал, визуальный язык, участие и границы интерпретации.',
          'Signal, visual language, participation and interpretation boundaries.',
        ),
      },
      {
        id: 'programme',
        path: 'education/',
        title: l('Образовательные программы', 'Educational programmes'),
        body: l(
          'Механика участия, базовые темы лаборатории, исторические параметры и условия подготовки.',
          'Participation mechanics, core laboratory topics, historical parameters and preparation requirements.',
        ),
      },
      {
        id: 'brief',
        path: 'cooperation/',
        title: l('Сотрудничество и состав брифа', 'Cooperation and briefing'),
        body: l(
          'Сценарии сотрудничества, роли студии и площадки, данные для первого обращения.',
          'Cooperation scenarios, studio and venue roles, and information for an initial inquiry.',
        ),
      },
    ],
    sourceRefs: refs(
      'Owner_IP_Confirmation_2026-10-08.md',
      'Golem_Ars_2026.md',
      'CYENS_Final_Status_2026.md',
      'hub-press.md',
      'Olga_Arabova_CV.md',
      'Daler_Arabov_CV.md',
      'hub-cv.md',
      'hub-manifesto.md',
      'hub-education.md',
      'hub-collab.md',
      'event-hse-beautiful-brain-2025.md',
      'event-sber-lecture-2025.md',
      'event-mipt-terraforming-2025.md',
    ),
    source: 'src/content/hub-cv.md; hub-manifesto.md; hub-education.md; hub-collab.md',
    publication: 'published',
  },
];
