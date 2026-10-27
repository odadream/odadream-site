import { personalCvSections, personalCvSources } from './personal-cv';
import type { Localized, Person, Publication } from './site';
import type { EditorialSection, SourceReference } from './editorial';
import { sourceSnapshots } from './editorial';

export interface StudioPage {
  id: string;
  title: Localized;
  summary: Localized;
  people: string[];
  sections: EditorialSection[];
  materials: { id: string; title: Localized; body: Localized; path: string }[];
  sourceRefs: SourceReference[];
  source: string;
  publication: Publication;
}
const l = (ru: string, en: string): Localized => ({ ru, en });
const refs = (...files: string[]) => files.map((file) => sourceSnapshots[file]);

const studioPeopleRecords: Person[] = [
  {
    id: 'olga',
    name: l('Ольга Арабова', 'Olga Arabova'),
    role: l('Междисциплинарная художница и фасилитатор', 'Interdisciplinary artist and facilitator'),
    biography: l(
      'Междисциплинарная художница и соосновательница ODA.dream. Разрабатывает партисипаторные работы и образовательные программы, соединяя художественный замысел с опытом участника.',
      'Interdisciplinary artist and co-founder of ODA.dream. Develops participatory works and educational programmes, connecting artistic concepts with the participant’s experience.',
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
      'Медиахудожник и инженер, сооснователь ODA.dream. Соединяет художественный замысел с разработкой интерактивных систем — от прототипа до сценического и выставочного показа.',
      'Media artist, engineer and co-founder of ODA.dream. Connects artistic concepts with interactive-system development, from prototypes to stage and exhibition presentations.',
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

export const studioPeople: Person[] = studioPeopleRecords.map((person) => ({
  ...person,
  cv: person.cv
    ? { ...person.cv, sections: [...person.cv.sections, ...personalCvSections[person.id]] }
    : undefined,
  sourceRefs: [...(person.sourceRefs ?? []), ...personalCvSources[person.id]],
}));

const studioPageRecords: StudioPage[] = [
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
          'Участие добровольно. До показа согласуются запись, хранение данных и доступ к результатам. Личный рассказ участника, измерение и художественная интерпретация рассматриваются раздельно; сигналы не используются для медицинских или психологических заключений.',
          'Participation is voluntary. Recording, data retention and access to results are agreed before each presentation. A participant’s account, measurements and artistic interpretation remain distinct; signals are not used to make medical or psychological judgments.',
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
    materials: [],
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

export const studioPages: StudioPage[] = studioPageRecords.map((page) => ({
  ...page,
  materials: [
    {
      id: 'works',
      path: 'works/',
      title: l('Работы', 'Works'),
      body: l('Произведения и их художественные истории.', 'Works and their artistic stories.'),
    },
    {
      id: 'education',
      path: 'education/',
      title: l('Образование', 'Education'),
      body: l('Лекции, практикумы и учебные программы.', 'Lectures, workshops and educational programmes.'),
    },
    {
      id: 'cases',
      path: 'cases/',
      title: l('Кейсы и события', 'Cases and events'),
      body: l(
        'Даты, площадки, участники и документация состоявшихся встреч.',
        'Dates, venues, participants and documentation of encounters.',
      ),
    },
    {
      id: 'recognition',
      path: 'recognition/',
      title: l('Признания', 'Recognition'),
      body: l(
        'Награды, благодарности и свидетельства студии; личные достижения — в CV авторов.',
        'Studio awards, acknowledgements and certificates; personal credits belong to the authors’ CVs.',
      ),
    },
    {
      id: 'cooperation',
      path: 'cooperation/',
      title: l('Сотрудничество', 'Cooperation'),
      body: l(
        'Форматы заказа, роли и подготовка показа.',
        'Commissioning formats, roles and presentation preparation.',
      ),
    },
  ],
}));
