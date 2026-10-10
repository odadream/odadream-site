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
            'Высшее образование — Астраханский государственный технический университет. Профессиональная подготовка включает коучинг, телесные и танцевально-двигательные практики.',
            'Higher education at Astrakhan State Technical University. Professional training includes coaching, embodied practices and dance-movement practices.',
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
            'Получил инженерное образование в МГТУ им. Н. Э. Баумана по направлению проектирования и технологии электронной аппаратуры. Преподавал техническое творчество, руководил выпускными работами и создал FabLab «ЦЕХ-4» в МГТУ.',
            'Studied electronic-equipment design and technology at Bauman Moscow State Technical University. Taught technical creativity, supervised graduation projects and founded FabLab TSEKH-4 at BMSTU.',
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
          `ODA.dream® — зарегистрированный товарный знак №${intellectualProperty.trademark.number} от 25 февраля 2026 года. Заявка на изобретение №${intellectualProperty.inventionApplication.number} подана 30 апреля 2026 года.`,
          `ODA.dream® is registered trademark No. ${intellectualProperty.trademark.number}, dated 25 February 2026. Invention application No. ${intellectualProperty.inventionApplication.number} was filed on 30 April 2026.`,
        ),
      },
      {
        id: 'submissions',
        title: {
          ru: 'Заявки и результаты отбора',
          en: 'Applications and selection outcomes',
        },
        body: {
          ru: 'В 2026 году Нейромандала участвовала в заявочной кампании Prix Ars Electronica в категории Interactive Art+. Заявки MindGrid и MindShow вошли в резервный список CYENS WIP, но не прошли итоговый отбор.',
          en: 'In 2026, Neuromandala was submitted to Prix Ars Electronica in the Interactive Art+ category. MindGrid and MindShow were placed on the CYENS WIP reserve list but were not selected for the festival.',
        },
      },
      {
        id: 'professional',
        title: {
          ru: 'Профессиональные связи',
          en: 'Professional affiliations',
        },
        body: {
          ru: 'Ольга и Далер — члены Творческого союза художников России: Ольга — секции научного искусства, Далер — секции мультимедиа. В проектах студия сотрудничает с художниками, исполнителями и техническими специалистами; их роли указаны на страницах работ.',
          en: 'Olga and Daler are members of the Creative Union of Artists of Russia: Olga in the science-art section and Daler in multimedia. The studio collaborates with artists, performers and technical specialists, whose roles are credited on the work pages.',
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
          'Студия готовит художественную и техническую часть проекта и сопровождает участников. Исполнители, соавторы и специалисты присоединяются в зависимости от замысла. Экран, звук, пространство, монтаж и работу с потоком посетителей согласуем с площадкой.',
          'The studio prepares the artistic and technical parts of a project and supports participants. Performers, co-authors and specialists join according to the concept. We agree screens, sound, space, installation and visitor flow with the venue.',
        ),
      },
    ],
    teaching: [
      {
        id: 'hse',
        year: 2025,
        title: l('«Красиво про мозг» · НИУ ВШЭ', 'Beautiful About the Brain · HSE University'),
        body: l(
          'В 2025 году студия была приглашена с лекцией «Красиво про мозг» в НИУ ВШЭ в Москве.',
          'In 2025, the studio was invited to give Beautiful About the Brain at HSE University in Moscow.',
        ),
      },
      {
        id: 'sber',
        year: 2025,
        title: l('Science-art лекция · Сбербанк', 'Science-art lecture · Sberbank'),
        body: l(
          'В 2025 году студия получила приглашение провести science-art лекцию для корпоративной аудитории Сбербанка в Москве.',
          'In 2025, the studio was invited to give a science-art lecture to a corporate audience at Sberbank in Moscow.',
        ),
      },
      {
        id: 'mipt',
        year: 2025,
        title: l('«Терраформинг» · МФТИ', 'Terraforming · MIPT'),
        body: l(
          '«Терраформинг» объединил выставку Нейромандалы и практическую образовательную программу на площадке МФТИ.',
          'Terraforming combined a Neuromandala exhibition with a practical educational programme at MIPT.',
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
