import type { Programme } from './programmes';
import type { CaseEvent, Localized } from './site';
import { sourceSnapshots, participationDetails, type EditorialSection } from './editorial';
const l = (ru: string, en: string): Localized => ({ ru, en });
const refs = (...files: string[]) => files.map((file) => sourceSnapshots[file]);
const module = (id: string, ru: string, en: string, bodyRu: string, bodyEn: string): EditorialSection => ({
  id,
  title: l(ru, en),
  body: l(bodyRu, bodyEn),
});
const brief = {
  id: 'programme-brief',
  label: l('Условия программы', 'Programme conditions'),
  value: l(
    'Точная длительность, возраст и размер группы, ведущие, оборудование и разрешения на запись согласуются для приглашения.',
    'The exact duration, audience age and size, facilitators, equipment and recording permissions are scoped for the invitation.',
  ),
  state: 'per-brief' as const,
};
type Definition = Pick<
  Programme,
  | 'id'
  | 'title'
  | 'summary'
  | 'story'
  | 'modules'
  | 'outcome'
  | 'participation'
  | 'programmeType'
  | 'deliveryStatus'
> &
  Partial<Programme> & { files: string[] };
const definitions: Definition[] = [
  {
    id: 'color-brain',
    title: l('Цвет и мозг', 'Colour and Brain'),
    programmeType: 'lecture',
    deliveryStatus: 'proposed',
    summary: l(
      'Как свет становится воспринимаемым цветом: зрительные иллюзии, опыт и художественный эксперимент.',
      'How light becomes perceived colour: visual illusions, experience and an artistic experiment.',
    ),
    story: l(
      'Рабочая лекционная программа соединяет путь зрительного сигнала с вопросами о том, как мы собираем видимый мир. Слепое пятно, послеобразы и контекст обсуждаются через наблюдение и художественные примеры. При согласовании демонстрации нейровизуальный слой становится материалом сравнения собственного опыта.',
      'This working lecture programme connects the visual signal pathway with questions about how we construct the visible world. Blind spots, afterimages and context are explored through observation and artistic examples. An agreed neurovisual demonstration can provide material for comparing personal experience.',
    ),
    modules: [
      module(
        'visual-path',
        'От света к образу',
        'From light to image',
        'Зрительный путь рассматривается как карта вопросов: что воспринимают глаза, как появляются форма и цвет и какую роль играет прошлый опыт.',
        'The visual pathway provides a map of questions: what the eyes perceive, how form and colour emerge, and how past experience contributes.',
      ),
      module(
        'illusions',
        'Провалы и достраивание',
        'Gaps and reconstruction',
        'Наблюдение слепого пятна и послеобразов помогает обсуждать различие между физическим стимулом и воспринимаемым образом.',
        'Observing blind spots and afterimages supports discussion of the difference between a physical stimulus and a perceived image.',
      ),
      module(
        'art-lab',
        'Художественное исследование',
        'Artistic exploration',
        'Участники сравнивают описания цветов и контекстов. Возможная ЭЭГ-демонстрация не устанавливает универсальную таблицу «цвет — эмоция».',
        'Participants compare descriptions of colours and contexts. An optional EEG demonstration does not establish a universal colour-to-emotion table.',
      ),
    ],
    participation: l(
      'Наблюдение, короткие перцептивные задания и обсуждение; нейровизуальная демонстрация — по согласованному сценарию.',
      'Observation, short perception tasks and discussion; a neurovisual demonstration follows an agreed scenario.',
    ),
    outcome: l(
      'Материал для различения стимула, контекста и личной интерпретации цвета в художественном опыте.',
      'Material for distinguishing stimulus, context and personal colour interpretation within an artistic experience.',
    ),
    files: ['Education_Source_d740ee68851c.md', 'Education_Source_4eccbb6244c5.md'],
  },
  {
    id: 'game-brain',
    title: l('Игра и мозг', 'Game and Brain'),
    programmeType: 'lecture',
    deliveryStatus: 'documented',
    summary: l(
      'Иммерсивная лекция об игровом вовлечении, внимании и биологической обратной связи.',
      'An immersive lecture on game engagement, attention and biofeedback.',
    ),
    story: l(
      'Игра рассматривается как ситуация, в которой меняются внимание, вовлечённость и способы взаимодействия. Разговор о потоке и игровых правилах соединяется с живой демонстрацией нейроинтерфейсов. Это образовательная программа, отдельная от игрового концепта Brain Hack и «Парадокса Успеха».',
      'Games are explored as situations that change attention, engagement and interaction strategies. A discussion of flow and game rules meets a live neurointerface demonstration. This educational programme is separate from the Brain Hack concept and Paradox of Success artwork.',
    ),
    modules: [
      module(
        'engagement',
        'Почему мы включаемся в игру',
        'Why we engage in games',
        'Обсуждение игровых правил, внимания и субъективного ощущения потока.',
        'Discussion of game rules, attention and the subjective experience of flow.',
      ),
      module(
        'feedback-game',
        'Обратная связь как правило',
        'Feedback as a rule',
        'На демонстрации сигнальные изменения становятся частью визуального процесса; участники обсуждают, какие выводы допустимы из наблюдения.',
        'During a demonstration, signal changes become part of a visual process; participants discuss which interpretations observation supports.',
      ),
      module(
        'shared-play',
        'Игра и совместный опыт',
        'Games and shared experience',
        'Техноэмпатия и образы коллективного сознания используются как вопросы для дискуссии, а не как доказательство передачи мыслей.',
        'Techno-empathy and images of collective consciousness are discussion questions, not evidence of thought transmission.',
      ),
    ],
    participation: l(
      'Разговор и добровольная нейровизуальная демонстрация; аудитория может наблюдать и обсуждать без измерения.',
      'A conversation and voluntary neurovisual demonstration; audience members can observe and discuss without measurement.',
    ),
    outcome: l(
      'Язык для обсуждения игровых механик, вовлечения и ограничений нейрофидбэка в игре.',
      'A vocabulary for discussing game mechanics, engagement and the limits of game neurofeedback.',
    ),
    files: ['Education_Source_d65a0ed80597.md'],
  },
  {
    id: 'meditation-brain',
    title: l('Медитация и мозг', 'Meditation and Brain'),
    programmeType: 'lecture',
    deliveryStatus: 'proposed',
    summary: l(
      'Лекционная схема о внимании, медитативных подходах и наблюдении с обратной связью.',
      'A lecture outline on attention, meditation approaches and feedback-supported observation.',
    ),
    story: l(
      'Программа начинается с различия целей и способов медитации, затем обращается к вниманию, работе нейроинтерфейса и Нейромандале. Практический блок предполагает наблюдение своего опыта и рефлексию. В источнике это рабочая схема; отдельный проведённый курс не подтверждён.',
      'The programme starts by distinguishing meditation goals and approaches, then explores attention, the neurointerface and Neuromandala. Its practical segment involves observing personal experience and reflection. The source is a working outline; a separately delivered course is not established.',
    ),
    modules: [
      module(
        'approaches',
        'Разные задачи медитации',
        'Different meditation goals',
        'Сфокусированное внимание, открытое наблюдение и другие подходы сравниваются по задаче практики.',
        'Focused attention, open monitoring and other approaches are compared through their practice goals.',
      ),
      module(
        'observation',
        'Что показывает запись',
        'What a recording shows',
        'Демонстрация связывает наблюдение сигнала с рассказом участника. Диаграмма не подтверждает духовный опыт или лечебный результат.',
        'The demonstration connects signal observation with the participant’s account. A diagram does not establish a spiritual experience or a therapeutic outcome.',
      ),
      module(
        'reflection',
        'Практика и обсуждение',
        'Practice and discussion',
        'Короткая практика, описание ощущений и разговор о трудностях наблюдения; выбор упражнений согласуется под аудиторию.',
        'A short practice, description of sensations and discussion of observation difficulties; exercises are scoped for the audience.',
      ),
    ],
    participation: l(
      'Слушание, наблюдение и согласованная короткая практика; измерение необязательно.',
      'Listening, observation and an agreed short practice; measurement is optional.',
    ),
    outcome: l(
      'Понимание различия целей практики, личного рассказа и возможностей нейровизуального наблюдения.',
      'Understanding the distinction between practice goals, personal accounts and neurovisual observation capabilities.',
    ),
    files: ['Education_Source_da6a1c533bfe.md'],
  },
  {
    id: 'self-regulation',
    title: l('Саморегуляция в напряжённые периоды', 'Self-Regulation During Demanding Periods'),
    programmeType: 'lecture',
    deliveryStatus: 'proposed',
    summary: l(
      'Диалог о привычках, внимании и способах исследовать собственный опыт перед экзаменами и другими важными этапами.',
      'A dialogue on habits, attention and ways to explore personal experience before exams and other demanding milestones.',
    ),
    story: l(
      'Рабочий план строится вокруг вопросов участников: с какими трудностями они сталкиваются, какие стратегии уже используют и что хотят изменить. Обсуждение включает привычки, мотивацию, короткие упражнения и идеи собственных проектов. В исходнике предложено 1,5 часа; использование общей Miro-доски ещё требует проверки.',
      'The working plan follows participants’ questions: which difficulties they encounter, which strategies they already use and what they want to change. Discussion includes habits, motivation, short exercises and ideas for personal projects. The source proposes 1.5 hours; a shared Miro board still requires testing.',
    ),
    modules: [
      module(
        'context',
        'Вопросы группы',
        'Group questions',
        'Участники описывают контекст и свои текущие стратегии; ведущий помогает сформулировать вопросы.',
        'Participants describe their context and current strategies; the facilitator helps formulate questions.',
      ),
      module(
        'habits',
        'Привычки и интерпретации',
        'Habits and interpretations',
        'Обсуждение мотивации, привычек и способов замечать собственные реакции.',
        'Discussion of motivation, habits and ways to notice personal responses.',
      ),
      module(
        'toolbox',
        'Собственный набор приёмов',
        'A personal toolbox',
        'Короткие упражнения внимания и рефлексия соединяются с проектами: дневник наблюдений, постер, игра или памятка.',
        'Short attention exercises and reflection connect with projects: an observation journal, poster, game or reminder.',
      ),
    ],
    audience: l(
      'В исходном плане — ученики в период экзаменов; возраст и адаптация уточняются.',
      'The source plan addresses students during exams; age and adaptation remain to be scoped.',
    ),
    participation: l(
      'Диалог и совместное обсуждение, ответы участников и краткие упражнения по согласованию.',
      'Dialogue and shared discussion, participant responses and agreed short exercises.',
    ),
    outcome: l(
      'Сформулированные вопросы о собственных привычках и идея небольшого проекта наблюдения.',
      'Formulated questions about personal habits and an idea for a small observation project.',
    ),
    conditions: [
      {
        id: 'historical-duration',
        label: l('Исходный план', 'Source plan'),
        value: l(
          '1,5 часа — предложенная длительность; итоговый сценарий согласуется отдельно.',
          '1.5 hours is the proposed duration; the final scenario is scoped separately.',
        ),
        state: 'historical',
      },
      brief,
    ],
    files: ['Education_Source_78eeea9e9dbb.md', 'Education_Source_aa23c27f3260.md'],
  },
  {
    id: 'dance-feedback',
    title: l('Танцевальный коннект и обратная связь', 'Dance Connection and Feedback'),
    programmeType: 'workshop',
    deliveryStatus: 'documented',
    summary: l(
      'Практикум о внимании к себе и партнёру: движение, наблюдение нейровизуальной записи и рефлексия.',
      'A workshop on attention to oneself and a partner: movement, neurovisual recording observation and reflection.',
    ),
    story: l(
      'Две версии источника описывают работу с танцевальными парами и наблюдателями. Участники двигаются, описывают ощущения, наблюдают визуальную обратную связь и повторяют последовательность. Калужская версия прямо обозначает мастер-класс, а не научный эксперимент; предположения о станцованности остаются вопросами.',
      'Two source versions describe work with dancing pairs and observers. Participants move, describe sensations, observe visual feedback and repeat the sequence. The Kaluga version explicitly describes a workshop rather than a scientific experiment; ideas about dance coordination remain questions.',
    ),
    modules: [
      module(
        'initial-movement',
        'Движение и описание',
        'Movement and description',
        'Парный танец и описание собственного опыта до знакомства с общей визуальной записью.',
        'Pair dancing and a description of personal experience before observing the shared visual recording.',
      ),
      module(
        'shared-feedback',
        'Совместное наблюдение',
        'Shared observation',
        'Пара рассматривает Нейромандалу и пробует согласованный сценарий внимания; число зрителей отличается от числа измеряемых участников.',
        'The pair observes Neuromandala and tries an agreed attention scenario; audience size differs from the number of measured participants.',
      ),
      module(
        'comparison',
        'Повтор и рефлексия',
        'Repetition and reflection',
        'Повтор движения, обратная связь пары и наблюдателей. Различия обсуждаются без утверждения доказанной эффективности метода.',
        'Repeated movement and feedback from the pair and observers. Differences are discussed without claiming established method efficacy.',
      ),
    ],
    audience: l(
      'Танцевальные пары и наблюдатели; профессиональный опыт и адаптация группы уточняются.',
      'Dancing pairs and observers; professional experience and group adaptation are scoped.',
    ),
    authorsNote: l(
      'Текущая адаптация — ODA.dream. Исторический анонс NeuroSync называет Ивана Ниненко, Далера Арабова и Ольгу Ногтеву; эти имена относятся к ранней версии протокола.',
      'Current adaptation: ODA.dream. The historical NeuroSync announcement names Ivan Ninenko, Daler Arabov and Olga Nogteva; these names belong to the early protocol version.',
    ),
    participation: l(
      'Две пары по очереди и группа наблюдателей в исходной калужской версии. Измерение, движение и обсуждение — отдельные части.',
      'Two pairs taking turns and a group of observers in the source Kaluga version. Measurement, movement and discussion are distinct segments.',
    ),
    outcome: l(
      'Рефлексия различий в парном движении и опыте наблюдения себя и партнёра.',
      'Reflection on differences in paired movement and in observing oneself and a partner.',
    ),
    conditions: [
      {
        id: 'historical-configuration',
        label: l('Калужская версия', 'Kaluga version'),
        value: l(
          'План: 2 часа, две пары и 30–40 наблюдателей; два нейроинтерфейса. Параметры не являются универсальной вместимостью.',
          'Plan: 2 hours, two pairs and 30–40 observers, with two neurointerfaces. These parameters are not a universal capacity.',
        ),
        state: 'historical',
      },
      brief,
    ],
    works: ['neurosync'],
    cases: ['kod-provincii-2024'],
    files: ['Education_Source_bcde848360a5.md', 'Education_Source_f9c8c1722f83.md'],
  },
  {
    id: 'feedback-media-art',
    title: l(
      'Нейрофидбэк и коллективная БОС в медиаискусстве',
      'Neurofeedback and Collective Feedback in Media Art',
    ),
    programmeType: 'lecture',
    deliveryStatus: 'documented',
    summary: l(
      'Лекция о нейроинтерфейсах, Нейромандале и художественной работе с обратной связью нескольких участников.',
      'A lecture on neurointerfaces, Neuromandala and artistic work with feedback from multiple participants.',
    ),
    story: l(
      'Источник задаёт последовательность от ритмов и нейроинтерфейса к биологической обратной связи, Нейромандале и коллективному взаимодействию. Технологический материал рассматривается через художественные приложения. В образовательной траектории студии лекция связана с поездкой в Калугу; конкретный день не устанавливается по этому конспекту.',
      'The source moves from rhythms and the neurointerface to biofeedback, Neuromandala and collective interaction. Technology is explored through artistic applications. The studio’s educational trajectory connects this lecture with a visit to Kaluga; this outline does not establish its exact day.',
    ),
    modules: [
      module(
        'signal',
        'Сигнал и интерфейс',
        'Signal and interface',
        'Что регистрирует нейроинтерфейс и как данные входят в контур обратной связи.',
        'What a neurointerface records and how data enters a feedback system.',
      ),
      module(
        'art-system',
        'Нейромандала как система',
        'Neuromandala as a system',
        'Авторская визуализация рассматривается как художественный перевод данных, а не чтение мыслей.',
        'The authorial visualisation is considered an artistic translation of data rather than thought reading.',
      ),
      module(
        'collective',
        'Коллективный опыт',
        'Collective experience',
        'Совместная запись, групповая визуализация и вопросы о связи между сигналом и взаимодействием.',
        'Shared recording, group visualisation and questions about the relationship between signal and interaction.',
      ),
    ],
    participation: l(
      'Лекция, примеры медиаискусства и согласованная демонстрация.',
      'A lecture, media-art examples and an agreed demonstration.',
    ),
    outcome: l(
      'Понимание различия между регистрацией, визуализацией и художественной интерпретацией коллективного опыта.',
      'Understanding the distinction between recording, visualisation and artistic interpretation of collective experience.',
    ),
    conditions: [
      {
        id: 'historical-duration',
        label: l('Конспект', 'Source outline'),
        value: l(
          'В исходнике — 1,5 часа; демонстрация и техника согласуются для площадки.',
          'The source gives 1.5 hours; demonstration and equipment are scoped for the venue.',
        ),
        state: 'historical',
      },
      brief,
    ],
    works: ['neuromandala', 'neurosync'],
    files: ['Education_Source_cac95e5bc8a1.md', 'Education_Source_7e278d34a0b5.md'],
  },
  {
    id: 'daler-art-path',
    title: l('Мой путь: от инженерии к нейроискусству', 'My Path: From Engineering to Neuroart'),
    programmeType: 'lecture',
    deliveryStatus: 'proposed',
    summary: l(
      'Авторский рассказ Далера Арабова о проектах, пробах, ошибках и становлении ODA.dream.',
      'Daler Arabov’s authorial account of projects, experiments, mistakes and the development of ODA.dream.',
    ),
    story: l(
      'Сценарий выступления построен как последовательность вопросов о творческом пути: первый инженерный проект, работа с сообществами, переход к медиаискусству и отношения между художественным замыслом и заказом. Рассказ использует собственный опыт автора; будущие идеи не выдаются за реализованные проекты.',
      'The talk script follows questions about a creative path: the first engineering project, work with communities, the transition to media art and the relationship between artistic intent and commissions. It uses the author’s own experience; future ideas are not presented as realised projects.',
    ),
    modules: [
      module(
        'engineering',
        'Первые проекты',
        'Early projects',
        'Инженерный опыт и попытки собрать устойчивое проектное сообщество.',
        'Engineering experience and attempts to build a lasting project community.',
      ),
      module(
        'art-practice',
        'Становление художественной практики',
        'Developing an artistic practice',
        'Нейросинхронизация, совместная работа и переход к публичным художественным ситуациям.',
        'Neurosynchronization, collaboration and the transition to public artistic situations.',
      ),
      module(
        'choices',
        'Выборы и дальнейший путь',
        'Choices and the path ahead',
        'Обсуждение творческих решений, отношения к ошибкам и взаимодействия с аудиторией.',
        'Discussion of creative choices, responses to mistakes and interaction with audiences.',
      ),
    ],
    authorsNote: l(
      'Автор и предполагаемый ведущий — Далер Арабов. Это сольный рассказ, а не совместное авторство всех упомянутых проектов.',
      'Author and intended speaker: Daler Arabov. This is a solo account, not a claim of sole authorship of every project mentioned.',
    ),
    authorIds: ['daler'],
    participation: l(
      'Авторский рассказ и обсуждение; состав вопросов адаптируется к приглашению.',
      'An authorial account and discussion; questions are adapted to the invitation.',
    ),
    outcome: l(
      'Материал для разговора о становлении собственной практики и выборе способов работы.',
      'Material for discussing the development of a personal practice and choosing ways of working.',
    ),
    files: ['Education_Source_988779f0c13a.md'],
  },
];
export const additionalProgrammes: Programme[] = definitions.map(({ files, ...row }) => ({
  ...participationDetails['talk-workshop'],
  topics: (row.modules ?? []).map((item) => item.title),
  studioProvides: {
    ru: [
      'Содержание программы и согласованный состав ведущих.',
      'Материалы и демонстрационный контур выбранной версии.',
    ],
    en: [
      'Programme content and agreed facilitators.',
      'Materials and the selected version’s demonstration system.',
    ],
  },
  venueProvides: {
    ru: [
      'Пространство, доступ и условия участия по согласованному брифу.',
      'AV и оборудование по выбранной программе.',
    ],
    en: [
      'Space, access and participation conditions under the agreed brief.',
      'AV and equipment for the selected programme.',
    ],
  },
  slug: row.id,
  audience: l(
    'Аудитория и адаптация определяются по задаче приглашения.',
    'Audience and adaptation are scoped for the invitation.',
  ),
  authorsNote: l(
    'Авторская программа ODA.dream; состав ведущих уточняется для приглашения.',
    'An ODA.dream programme; facilitators are scoped for the invitation.',
  ),
  scope: l(
    'Описание сохраняет исходный замысел. Финальная версия программы, условия участия и материалы фиксируются в предложении.',
    'The description retains the source intent. The final programme version, participation conditions and materials are fixed in the proposal.',
  ),
  conditions: [brief],
  works: [],
  cases: [],
  media: [],
  reviewNotes: [
    l(
      'Наличие конспекта не подтверждает проведение каждой версии программы.',
      'The existence of an outline does not establish delivery of every programme version.',
    ),
  ],
  source: files.join('; '),
  sourceRefs: refs(...files),
  publication: 'published',
  ...row,
}));

export const programmeEnrichments: Record<string, Partial<Programme>> = {
  'beautiful-brain': {
    authorIds: ['olga', 'daler'],
    authorsNote: l(
      'Ольга и Далер Арабовы — авторы и ведущие дуэта ODA.dream; адаптация ролей согласуется для приглашения.',
      'Olga and Daler Arabov are the ODA.dream duo’s authors and facilitators; role adaptation is scoped for the invitation.',
    ),
    story: l(
      'Лекция соединяет разговор об устройстве мозга, восприятии и творчестве с живой демонстрацией нейроинтерфейса. Один интерфейс использует ведущий, второй — добровольцы по очереди. Художественные примеры и вопросы аудитории помогают обсуждать различие между сигналом и его интерпретацией. Подтверждённые лекционные контексты включают «Зелёную Дверь», ИРКИ НИУ ВШЭ и Ashram; анонсы других версий сохраняют собственные статусы.',
      'The lecture connects a conversation about the brain, perception and creativity with a live neurointerface demonstration. One interface is used by a facilitator and a second by volunteers taking turns. Artistic examples and audience questions support discussion of the difference between signal and interpretation. Documented lecture contexts include Green Door, HSE’s Creative Industries Institute and Ashram; announcements of other versions retain their own statuses.',
    ),
    modules: [
      module(
        'brain-perception',
        'Устройство мозга и восприятие',
        'The brain and perception',
        'Научно-популярный разговор соединён с примерами science-art и вопросами о собственном опыте.',
        'A science-popularisation conversation meets science-art examples and questions about personal experience.',
      ),
      module(
        'interface-demo',
        'Живая демонстрация',
        'Live demonstration',
        'Ведущий и добровольцы наблюдают генеративную визуализацию; присутствие в зале не означает измерение каждого зрителя.',
        'The facilitator and volunteers observe generative visuals; attending does not mean every audience member is measured.',
      ),
      module(
        'feedback-discussion',
        'Обратная связь и разговор',
        'Feedback and conversation',
        'Ритмы, внимание, медитативные подходы и пределы интерпретации обсуждаются через демонстрацию и рефлексию.',
        'Rhythms, attention, meditation approaches and interpretation limits are explored through demonstration and reflection.',
      ),
    ],
    outcome: l(
      'Понимание принципа ЭЭГ-демонстрации и материал для обсуждения искусства, внимания и собственного наблюдения.',
      'Understanding the EEG demonstration principle and material for discussing art, attention and personal observation.',
    ),
    sourceRefs: refs(
      'Education_Source_824566fc0ab6.md',
      'Education_Source_594f523bb8c7.md',
      'Education_Source_52db415daad4.md',
    ),
  },
  'neuroaesthetics-lec': {
    outcome: l(
      'Материал для обсуждения эстетических решений, отклика аудитории и этических границ художественного воздействия.',
      'Material for discussing aesthetic choices, audience response and ethical boundaries of artistic influence.',
    ),
  },
  'sound-brain': {
    modules: [
      module(
        'listening',
        'Слушание и внимание',
        'Listening and attention',
        'Слуховая обработка и различие между пассивным слушанием и направленной практикой.',
        'Auditory processing and the distinction between passive listening and directed practice.',
      ),
      module(
        'rhythm-context',
        'Ритм и среда',
        'Rhythm and environment',
        'Ритм, плотность и акустические особенности звука рассматриваются в контексте опыта слушателя.',
        'Rhythm, density and acoustic sound characteristics are considered within the listener’s experience.',
      ),
      module(
        'sound-practice',
        'Практический блок',
        'Practical segment',
        'Направленное слушание и рефлексия до/после; нейровизуальный слой включается по согласованному сценарию.',
        'Directed listening and before/after reflection; a neurovisual layer follows an agreed scenario.',
      ),
    ],
    outcome: l(
      'Наблюдения о собственном слушании и язык для обсуждения звуковой среды без обещания универсального эффекта.',
      'Observations about personal listening and a vocabulary for discussing sound environments without a promised universal effect.',
    ),
    sourceRefs: refs(
      'Education_Source_572023a0dfa0.md',
      'Education_Source_eec27476a45b.md',
      'Education_Source_fcdd23dd1b18.md',
    ),
  },
  'taste-brain': {
    outcome: l(
      'Сравнение личных сенсорных наблюдений и идей для проектирования контекста дегустации.',
      'Comparison of personal sensory observations and ideas for designing a tasting context.',
    ),
    sourceRefs: refs('Education_Source_e3c9562b8e28.md'),
  },
  'feedback-empathy-brain': {
    authorIds: ['olga', 'daler'],
    outcome: l(
      'Язык для обсуждения сонастройки, слушания и различия между ощущением связи и наблюдаемым сигналом.',
      'A vocabulary for discussing attunement, listening and the distinction between a felt connection and an observed signal.',
    ),
    sourceRefs: refs('Education_Source_48282e445db2.md'),
  },
  gong: {
    outcome: l(
      'Рефлексия опыта слушания живого звука, внимания и нейровизуального наблюдения.',
      'Reflection on listening to live sound, attention and neurovisual observation.',
    ),
  },
  'neuromandala-workshop': {
    works: ['neuromandala'],
    outcome: l(
      'Собственный визуальный материал и обсуждение того, как он связан с опытом записи и художественной интерпретацией.',
      'Personal visual material and discussion of its relationship with the recording experience and artistic interpretation.',
    ),
  },
  'neuro-laboratory': {
    outcome: l(
      'Собственная работа или согласованный прототип участников, представленный и обсуждённый внутри программы.',
      'Participants’ own work or an agreed prototype, presented and discussed within the programme.',
    ),
    sourceRefs: refs('Education_Source_7e278d34a0b5.md'),
  },
};

const schoolDefinitions = [
  {
    id: 'green-door-2024',
    date: '2024-06-07',
    title: l('«Красиво про мозг» · Зелёная Дверь', 'Beautiful About the Brain · Green Door'),
    place: l('Москва · антикафе «Зелёная Дверь»', 'Moscow · Green Door anti-cafe'),
    summary: l(
      'Онлайн/офлайн лекция с живой нейровизуальной демонстрацией.',
      'An online/offline lecture with a live neurovisual demonstration.',
    ),
    status: 'held',
    file: 'Education_Source_b386e325729a.md',
  },
  {
    id: 'ashram-lecture-2025',
    date: '2025-04-06',
    title: l('«Красиво про мозг» · Ashram', 'Beautiful About the Brain · Ashram'),
    place: l('Студия Ashram', 'Ashram Studio'),
    summary: l(
      'Лекция для камерной аудитории; в источнике указаны 18 участников.',
      'A lecture for a small audience; the source records 18 participants.',
    ),
    status: 'held',
    file: 'Education_Source_934ad240fa6a.md',
  },
  {
    id: 'tskhr-lecture-2025',
    date: '2025-04-08',
    title: l(
      '«Красиво про мозг» · Мастерская Мультимедиа ТСХР',
      'Beautiful About the Brain · TSKhR Multimedia Workshop',
    ),
    place: l('Москва · Мастерская Мультимедиа ТСХР', 'Moscow · TSKhR Multimedia Workshop'),
    summary: l(
      'Архивный анонс лекции с демонстрацией и добровольным участием.',
      'An archival lecture announcement with a demonstration and voluntary participation.',
    ),
    status: 'planned',
    file: 'Education_Source_b0ed2d97692d.md',
  },
  {
    id: 'almaz-lecture-2026',
    date: '2026-03-21',
    title: l('«Красиво про мозг» · Алмаз', 'Beautiful About the Brain · Almaz'),
    place: l(
      'Площадка «Алмаз» по имени карточки; адрес не установлен.',
      'Almaz venue according to the record name; address unconfirmed.',
    ),
    summary: l(
      'Архивный план лекции на 21 марта 2026; отдельный отчёт о проведении не найден в карточке.',
      'An archival lecture plan for 21 March 2026; a separate delivery report is absent from the record.',
    ),
    status: 'planned',
    file: 'Education_Source_fb0b17f9f0d2.md',
  },
];
export const schoolEvents: CaseEvent[] = schoolDefinitions.map((row) => ({
  id: row.id,
  slug: row.id,
  title: row.title,
  summary: row.summary,
  date: row.date,
  datePrecision: 'day',
  dateMeaning: 'participation',
  participationStatus: row.status as CaseEvent['participationStatus'],
  context: 'public',
  type: 'lecture',
  place: row.place,
  role: l(
    'ODA.dream: лекция Ольги и Далера Арабовых с нейровизуальной демонстрацией.',
    'ODA.dream: a lecture by Olga and Daler Arabov with a neurovisual demonstration.',
  ),
  programme: 'beautiful-brain',
  organizations: [],
  organizationRoles: [],
  participants: [],
  story: [],
  evidence: [],
  media: [],
  detailPage: false,
  featuredOnHome: false,
  limitations:
    row.status === 'planned'
      ? [
          l(
            'Сохранён анонс из источника; прошедшая календарная дата сама по себе не подтверждает проведение.',
            'The source announcement is retained; a past calendar date does not itself establish delivery.',
          ),
        ]
      : [],
  source: row.file,
  sourceRefs: refs(row.file, 'Education_Source_824566fc0ab6.md'),
  publication: 'published',
}));
export const educationEventRefs = {
  dance: refs('Education_Source_f9c8c1722f83.md'),
  beautiful: refs('Education_Source_824566fc0ab6.md'),
  hse: refs('Education_Source_763c5e4423f4.md', 'Education_Source_824566fc0ab6.md'),
  sber: refs('Education_Source_875d38acafd9.md'),
};
