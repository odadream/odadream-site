import type { Work, Localized, Media } from './site';
import { sourceSnapshots, type EditorialSection } from './editorial';

const l = (ru: string, en: string): Localized => ({ ru, en });
const part = (id: string, ru: string, en: string, bodyRu: string, bodyEn: string): EditorialSection => ({
  id,
  title: l(ru, en),
  body: l(bodyRu, bodyEn),
});
const author = (nameRu: string, nameEn: string, roleRu: string, roleEn: string) => ({
  name: l(nameRu, nameEn),
  role: l(roleRu, roleEn),
});
type Definition = Pick<
  Work,
  | 'id'
  | 'title'
  | 'category'
  | 'summary'
  | 'experience'
  | 'question'
  | 'stage'
  | 'workType'
  | 'story'
  | 'media'
  | 'facts'
> &
  Partial<
    Pick<
      Work,
      | 'slug'
      | 'year'
      | 'aliases'
      | 'edition'
      | 'components'
      | 'credits'
      | 'reviewNotes'
      | 'relatedWorks'
      | 'sourceRefs'
      | 'mediaNote'
      | 'methodId'
      | 'featuredOnHome'
    >
  >;

const definitions: Definition[] = [
  {
    id: 'another-people',
    slug: 'other-people',
    title: l('Другие люди', 'Other People'),
    category: l('Партисипаторная выставка', 'Participatory exhibition'),
    workType: 'installation',
    stage: 'concept',
    aliases: ['Other Forms', 'Other Lives'],
    summary: l(
      'Концепт выставки о разных способах воспринимать мир: творческое действие, личная история и нейропортрет становятся материалом встречи.',
      'An exhibition concept about different ways of perceiving the world: creative action, personal history and a neuro-portrait become material for an encounter.',
    ),
    question: l(
      'Как встретиться с чужим опытом через творчество, сохраняя право человека говорить о себе?',
      'How can creative work open an encounter with another experience while preserving a person’s right to speak for themselves?',
    ),
    experience: l(
      'Зритель знакомится с историями и творческими действиями героев; предполагаемый интерактивный слой позволяет сопоставлять визуальные отклики.',
      'Visitors encounter protagonists’ stories and creative actions; a proposed interactive layer allows visual responses to be juxtaposed.',
    ),
    media: ['archive-another-people'],
    facts: {
      ru: [
        'Выставочный концепт',
        'Материалы заявок Tabakalera и Sónar, 2025',
        'Сценарий публичного показа в разработке',
      ],
      en: [
        'Exhibition concept',
        'Tabakalera and Sónar application materials, 2025',
        'Public presentation scenario in development',
      ],
    },
    story: [
      part(
        'encounter',
        'Разные способы восприятия',
        'Different ways of perceiving',
        'Проект обращается к опыту людей с инвалидностью через их собственные творческие действия — музыку, танец, рисунок и рассказ. Личная история и визуальный материал предлагаются как повод для встречи и разговора, а не как оценка человека по биосигналу.',
        'The project approaches disabled people’s experience through their own creative actions: music, dance, drawing and storytelling. Personal histories and visual material offer an encounter and conversation rather than an assessment of a person from a biosignal.',
      ),
      part(
        'structure',
        'Четыре этапа',
        'Four stages',
        'Архивный сценарий включает приглашение героев, съёмку творческого процесса с записью ЭЭГ, создание карточек и выставочную среду. Карточка соединяет историю, видео процесса и Нейромандалу; посетительский слой предполагает собственную запись и сравнение визуальных форм.',
        'The archived scenario includes inviting protagonists, filming creative processes with EEG capture, assembling character cards and creating an exhibition environment. A card combines a story, process video and Neuromandala; the visitor layer proposes personal recording and comparison of visual forms.',
      ),
      part(
        'development',
        'Рабочие названия и подготовка',
        'Working titles and preparation',
        'Ранние названия — Other Forms / Other Lives. В 2025 году подготовлены материалы заявок для Tabakalera и Sónar. Изображения представляют концепцию выставки.',
        'Early titles were Other Forms / Other Lives. Application materials were prepared for Tabakalera and Sónar in 2025. The images present the exhibition concept.',
      ),
    ],
  },
  {
    id: 'dashran',
    slug: 'darshan-moment',
    title: l('Момент Даршана', 'Darshan Moment'),
    category: l('Инсталляция-перформанс', 'Installation-performance'),
    workType: 'installation',
    stage: 'prototype',
    summary: l(
      'Лабораторный прототип встречи с многорукой ИИ-фигурой, которая отвечает на вопрос участника звуком, жестом и образом.',
      'A laboratory prototype of an encounter with a multi-armed AI figure answering a participant’s question through sound, gesture and imagery.',
    ),
    question: l(
      'Как меняется ритуал вопроса и созерцания при встрече человека с искусственным интеллектом?',
      'How does a ritual of questioning and contemplation change when a person encounters artificial intelligence?',
    ),
    experience: l(
      'Участник задаёт вопрос в проекционной среде; ответ разворачивается в аудиовизуальной композиции. Групповой финал задуман как граф связности участников.',
      'A participant asks a question within a projection environment; the answer unfolds as an audiovisual composition. A collective finale is conceived as a graph connecting participants.',
    ),
    media: ['archive-dashran'],
    facts: {
      ru: [
        'Внутренний лабораторный прототип',
        'Фестивальная версия — модульная скульптура',
        'Сценарий публичного показа в разработке',
      ],
      en: [
        'Internal laboratory prototype',
        'Festival version: modular sculpture',
        'Public presentation scenario in development',
      ],
    },
    story: [
      part(
        'ritual',
        'Встреча и вопрос',
        'Encounter and question',
        'Даршан становится художественной рамкой встречи с идеалом или абсолютом. Многорукая фигура проступает из стены; жесты и проекционный маппинг образуют её тело. Участник задаёт личный вопрос, а ответ приходит через звук, жест и изображение.',
        'Darshan becomes an artistic frame for encountering an ideal or an absolute. A multi-armed figure emerges from a wall; gestures and projection mapping form its body. A participant asks a personal question, receiving sound, gesture and imagery in response.',
      ),
      part(
        'cycle',
        'Архивный сценарий',
        'Archived scenario',
        'Сценарий описывает шесть мест, биобраслеты, подготовку, созерцание, индивидуальные вопросы и групповой финал. TouchDesigner соединяет генеративные модели и визуальный контур. Указанные в архиве цикл около 12 минут, зона от 5 × 5,5 м и затемнение относятся к проектной версии и не заменяют согласованный райдер.',
        'The scenario describes six places, biometric wristbands, preparation, contemplation, individual questions and a collective finale. TouchDesigner connects generative models with the visual system. The approximately 12-minute cycle, a footprint from 5 × 5.5 m and blackout are archived design parameters, not an agreed rider.',
      ),
      part(
        'laboratory',
        'Лаборатория и фестивальный проект',
        'Laboratory and festival project',
        'Сценарий взаимодействия отлаживался во внутренней лаборатории студии Ashram в Москве. Фестивальная версия предполагает переносную модульную скульптуру с алюминиевым каркасом и печатными сегментами. Для Play Digital Art, НУР, Intervals и Ars Electronica подготовлены заявки.',
        'The interaction scenario was developed in an internal laboratory at Ashram Studio in Moscow. A festival version proposes a portable modular sculpture with an aluminium frame and printed segments. Applications were prepared for Play Digital Art, NUR, Intervals and Ars Electronica.',
      ),
    ],
  },
  {
    id: 'fourth-dimension',
    title: l('4-е измерение', 'Fourth Dimension'),
    category: l('Ювелирный объект', 'Jewellery object'),
    workType: 'object',
    stage: 'realized',
    aliases: ['Two Waves'],
    summary: l(
      'Выбранный двухминутный фрагмент ЭЭГ ведущей коллективной медитации становится геометрией серебряного кулона.',
      'A selected two-minute EEG passage from a collective meditation facilitator becomes the geometry of a silver pendant.',
    ),
    question: l(
      'Как сохранить выбранный момент коллективного опыта в небольшом носимом объекте?',
      'How can a selected moment of collective experience be preserved in a small wearable object?',
    ),
    experience: l(
      'Лицевая и оборотная стороны кулона сохраняют волновую логику Нейромандалы — снимок выбранного интервала в материальной форме.',
      'The front and reverse retain Neuromandala’s wave logic: a selected interval given material form.',
    ),
    media: ['archive-fourth-dimension'],
    relatedWorks: ['rings'],
    facts: {
      ru: [
        'Документирован в 2023 году',
        'Источник формы — около двух минут ЭЭГ',
        'Серебро 925, холодная эмаль; отделка зависит от партии',
      ],
      en: [
        'Documented in 2023',
        'Form source: approximately two minutes of EEG',
        'Sterling silver and cold enamel; finishing varies by batch',
      ],
    },
    story: [
      part(
        'moment',
        'Выбранное окно',
        'A selected window',
        'Во время коллективной медитации студия записала ЭЭГ ведущей и выбрала примерно двухминутный отрезок. Нейромандала этого интервала стала исходником формы: гладкие внутренние петли и внешнее кольцо ритмов перенесены на компактный диск.',
        'During a collective meditation, the studio recorded the facilitator’s EEG and selected an approximately two-minute interval. Its Neuromandala became the form’s source: smooth inner loops and an outer rhythm ring translated to a compact disc.',
      ),
      part(
        'material',
        'Из сигнала в предмет',
        'From signal to object',
        'Геометрия развивалась в трёхмерной модели и была воплощена в серебре 925 с холодной эмалью; родирование и отделка относятся к отдельным партиям. Лицевая и оборотная стороны повторяют волновую структуру. В архиве сохранены исходная мандала, рендеры, фотографии и техническое задание.',
        'The geometry was developed in a three-dimensional model and fabricated in sterling silver with cold enamel; rhodium and finishing belong to specific batches. Front and reverse repeat the wave structure. The archive retains the source mandala, renders, photographs and specification.',
      ),
      part(
        'lineage',
        'Носимый архив внимания',
        'A wearable archive of attention',
        'Работа продолжает предметную линию колец ODA.dream: выбранный момент становится носимым архивом. Форма кулона основана на записи ЭЭГ ведущей групповой медитации.',
        'The work continues the object line begun with the ODA.dream rings: a chosen moment becomes a wearable archive. The pendant’s form is based on an EEG recording of the facilitator during a group meditation.',
      ),
    ],
  },
  {
    id: 'mom-baby',
    slug: 'mom-and-baby',
    title: l('Мама и Малыш', 'Mom & Baby'),
    category: l('Составной ювелирный объект', 'Composite jewellery object'),
    workType: 'object',
    stage: 'realized',
    year: 2022,
    summary: l(
      'Вложенный кулон соединяет два сердцебиения — матери и ребёнка — в частях, которые можно однажды передать друг другу.',
      'A nested pendant connects two heartbeats, mother and child, in parts that can one day be passed on.',
    ),
    question: l(
      'Как сделать предметом связь, возникшую ещё до рождения?',
      'How can a bond that precedes birth become an object?',
    ),
    experience: l(
      'Две части носятся вместе; внутреннее ядро может стать самостоятельной семейной реликвией ребёнка.',
      'Two parts are worn together; the inner core can become the child’s independent family heirloom.',
    ),
    media: ['archive-mom-baby-photo-with-statuette', 'archive-mom-baby'],
    relatedWorks: ['rings'],
    components: {
      ru: [
        'Внутреннее ядро — ритм ребёнка',
        'Внешняя оболочка — ритм матери',
        'Личная история и гравировка по заказу',
      ],
      en: [
        'Inner core: child’s rhythm',
        'Outer shell: mother’s rhythm',
        'Personal story and commissioned engraving',
      ],
    },
    facts: {
      ru: [
        'Исток линии — Бали, 2022',
        'Источник геометрии — совместные записи сердцебиений КТГ',
        'Сплавы и гравировка относятся к конкретному экземпляру',
      ],
      en: [
        'Line originated in Bali, 2022',
        'Geometry source: joint CTG heartbeat recordings',
        'Alloys and engraving belong to a specific piece',
      ],
    },
    story: [
      part(
        'origin',
        'История заказа',
        'Commission history',
        'Начало линии связано с форумом Synergy Crypto & NFT на Бали в августе 2022 года и заказом Александры Борзых. В разговоре с Ольгой Арабовой возник вопрос о переживании, которое хочется сохранить: ощущении ребёнка внутри и единстве с ним. Первый экземпляр изготовили балийские мастера.',
        'The line began with Alexandra Borzikh’s commission following the Synergy Crypto & NFT Forum in Bali in August 2022. In conversation with Olga Arabova, she explored an experience she wanted to preserve: carrying her child and feeling their unity. Balinese craftspeople made the first piece.',
      ),
      part(
        'structure',
        'Две части и два ритма',
        'Two parts and two rhythms',
        'Исходным материалом стали записи КТГ, где присутствуют ритмы матери и ребёнка. После нескольких компоновок выбрана вложенная конструкция: детское ядро и материнская оболочка. В описании канонического заказа указаны жёлтое и белое золото 750; материалы последующих версий различаются.',
        'The source material was CTG recordings containing maternal and fetal rhythms. After several layouts, a nested structure was chosen: a child’s core and a maternal shell. The canonical commission description specifies yellow and white 18-carat gold; later versions use different materials.',
      ),
      part(
        'inheritance',
        'Предмет и семейная память',
        'Object and family memory',
        'Две части соединены на время ожидания; позднее внутреннюю часть можно передать ребёнку. В отдельных версиях предусмотрены дата рождения и QR на личную историю. Линия включает последующие экземпляры и архивный подарок Кате IOWA. Личные страницы и исходные медицинские записи не публикуются вместе с описанием работы.',
        'The two parts stay together during pregnancy; the inner part can later be passed to the child. Specific versions include a birth date and a QR link to a personal story. The line includes later pieces and an archived gift to Katya IOWA. Personal pages and source medical records are not published with the work description.',
      ),
    ],
    featuredOnHome: true,
  },
  {
    id: 'happiness',
    title: l('Счастье', 'Happiness'),
    category: l('Ювелирная серия', 'Jewellery edition'),
    workType: 'object',
    stage: 'realized',
    year: 2022,
    edition: l(
      'Зимняя серия — 15 экземпляров по архивному описанию',
      'Winter edition: 15 copies according to the archive',
    ),
    summary: l(
      'Серебряная снежинка превращает культурный образ кристалла «Счастье» в небольшую подарочную серию.',
      'A silver snowflake turns the cultural image of the “Happiness” crystal into a small gift edition.',
    ),
    question: l(
      'Как сделать личный символ подарком, который существует в нескольких экземплярах?',
      'How can a personal symbol become a gift existing in multiple copies?',
    ),
    experience: l(
      'Двусторонний кулон соединяет матовые и зеркальные грани, разные уровни и просветы между серебряными плоскостями.',
      'The reversible pendant brings together matte and mirror facets, different heights and gaps between silver planes.',
    ),
    media: ['archive-happiness'],
    relatedWorks: ['rings', 'fourth-dimension', 'cultural-neuro-code'],
    facts: {
      ru: ['Декабрь 2022', 'Серебро 925', 'Геометрия культурного образа; форма не получена из ЭЭГ'],
      en: [
        'December 2022',
        'Sterling silver',
        'Geometry of a cultural image; the form does not derive from EEG',
      ],
    },
    story: [
      part(
        'reference',
        'Культурный образ',
        'A cultural image',
        'Работа появилась в декабре 2022 года как отдельная от ЭЭГ-линии предметная серия. Источником силуэта стала снежинка «Счастье» из образов водных кристаллов Масару Эмото. Здесь она используется как культурная и символическая форма.',
        'The work appeared in December 2022 as an object edition separate from the EEG line. Its silhouette references the “Happiness” snowflake in Masaru Emoto’s water-crystal imagery. Here it is used as a cultural and symbolic form.',
      ),
      part(
        'geometry',
        'Слои серебра',
        'Layers of silver',
        'Геометрия разложена по высотам и переведена в серебро 925. Матовые и зеркальные грани, микропрорези и двусторонняя носка превращают плоский образ в объёмный предмет. Архив описывает финальную зимнюю серию из 15 экземпляров.',
        'The geometry was split into different heights and translated into sterling silver. Matte and mirror facets, small gaps and reversible wear turn a flat image into a volumetric object. The archive describes a final winter edition of 15 copies.',
      ),
      part(
        'line',
        'Отдельная предметная ветка',
        'A distinct object branch',
        '«Счастье» создано как носимый и подарочный объект. В отличие от колец, «Воронки» и «4-го измерения», его форма основана на выбранном символе. Тема воды связывает эту предметную ветку с «Культурным нейрокодом».',
        'Happiness was created as a wearable gift. Unlike the rings, Vortex and Fourth Dimension, its form comes from a chosen symbol. The theme of water connects this object line with Cultural Neurocode.',
      ),
    ],
  },
  {
    id: 'voronka',
    slug: 'funnel',
    title: l('Воронка', 'Funnel'),
    category: l('Ювелирный комплект', 'Jewellery set'),
    workType: 'object',
    stage: 'realized',
    aliases: ['Vortex'],
    edition: l('Комплект одного частного заказа', 'A set from one private commission'),
    summary: l(
      'Плоская Нейромандала поднимается в объём: четыре ритмических слоя становятся кулоном и парой серёг.',
      'A flat Neuromandala gains volume: four rhythm layers become a pendant and a pair of earrings.',
    ),
    question: l(
      'Как придать глубину ритмической геометрии, сохранив её внутреннюю логику?',
      'How can rhythm geometry gain depth while retaining its internal logic?',
    ),
    experience: l(
      'Кулон показывает вложенные эмалевые ярусы; серьги раскрывают их структуру в уменьшенном разрезе.',
      'The pendant reveals nested enamel tiers; the earrings expose their structure as smaller sections.',
    ),
    media: ['archive-voronka'],
    relatedWorks: ['rings', 'fourth-dimension'],
    components: { ru: ['Кулон', 'Пара серёг'], en: ['Pendant', 'Pair of earrings'] },
    facts: {
      ru: [
        'Частный заказ',
        'Grasshopper / Rhinoceros',
        'Серебро 925, родий и холодная эмаль в архивной партии',
      ],
      en: [
        'Private commission',
        'Grasshopper / Rhinoceros',
        'Sterling silver, rhodium and cold enamel in the archived batch',
      ],
    },
    story: [
      part(
        'commission',
        'Из плоскости в глубину',
        'From plane to depth',
        'Заказ начинался с задачи поднять плоскую Нейромандалу из сессии «Мечта» в настоящий объём. Параметрическая модель в Grasshopper для Rhinoceros развивает топологию данных: ромбовая рамка удерживает ступенчатую воронку из вложенных органических колец.',
        'The commission began with a task to lift a flat Neuromandala from a “Dream” session into volume. A parametric Grasshopper model for Rhinoceros develops the data topology: a diamond frame holds a stepped funnel of nested organic rings.',
      ),
      part(
        'set',
        'Одна история, два масштаба',
        'One story, two scales',
        'Четыре физических яруса кулона соответствуют ритмическим слоям; канавки между стенками заполнены холодной эмалью. Пара серёг уменьшает и разделяет форму, раскрывая внутренний разрез. В архивной партии указаны серебро 925 и родирование; каталожные габариты около 34 × 34 × 6 мм относятся к конкретному силуэту.',
        'Four physical pendant tiers correspond to rhythm layers; cold enamel fills the grooves between walls. The earrings reduce and split the form to expose an internal section. The archived batch specifies sterling silver and rhodium; the approximately 34 × 34 × 6 mm catalogue dimensions belong to a particular silhouette.',
      ),
      part(
        'biography',
        'Биография модели',
        'The model’s biography',
        'Авторы рассказывают, что исправление геометрических коллизий совпало с важным выбором заказчицы. Они сохраняют этот эпизод как часть истории заказа. Комплект стал эталоном силуэта Vortex в последующих материалах студии.',
        'The authors recall that resolving geometric collisions coincided with a significant decision by the client. They retain the episode as part of the commission’s story. The set became a reference for the Vortex silhouette in later studio materials.',
      ),
    ],
  },
  {
    id: 'lighthouse',
    title: l('Маяк', 'Lighthouse'),
    category: l('Виртуальная архитектура', 'Virtual architecture'),
    workType: 'interactive-work',
    stage: 'prototype',
    summary: l(
      'Экранная генеративная башня разворачивает Нейромандалу во времени: параметры сигнала меняют её сечения и оболочку.',
      'A screen-based generative tower unfolds Neuromandala through time: signal parameters change its sections and shell.',
    ),
    question: l(
      'Как превратить изменяющийся биосигнал в архитектурную форму?',
      'How can a changing biosignal become an architectural form?',
    ),
    experience: l(
      'Зритель наблюдает виртуальную башню, которая растёт слоями и меняет силуэт по входным параметрам.',
      'A viewer observes a virtual tower growing in layers and changing silhouette with the input parameters.',
    ),
    media: ['archive-lighthouse'],
    relatedWorks: ['rings', 'emomandala'],
    facts: {
      ru: ['Виртуальный прототип', 'TouchDesigner Tower', 'Виртуальная модель и каталог анимаций'],
      en: ['Virtual prototype', 'TouchDesigner Tower', 'Virtual model and motion catalogue'],
    },
    story: [
      part(
        'context',
        'Экранная архитектура',
        'Screen-native architecture',
        'Линия разрабатывалась в период работы студии на Бали, в контексте Nuanu City; архив называет заказчиком Сергея Солоника. «Маяк» — виртуальный объект, а не изготовленное украшение или построенная башня. Ранний эскиз связан с логикой плафона Neurogon, где биосигнал задавал форму.',
        'The line was developed during the studio’s Bali period in the context of Nuanu City; the archive names Sergey Solonik as commissioner. Lighthouse is a virtual object rather than fabricated jewellery or a constructed tower. An early sketch relates to the Neurogon lampshade’s logic of biosignal-driven form.',
      ),
      part(
        'sections',
        'Сечения по времени',
        'Sections through time',
        'Спектральные параметры входного потока переводятся в сечения по высоте и внешнюю оболочку. В исследованиях TouchDesigner выделяются отдельные ритмы и их смеси; стек сечений становится вертикальной Нейромандалой и материалом для анимаций вращения.',
        'Spectral parameters of the input stream map to sections along the height and to the outer shell. TouchDesigner studies isolate individual rhythms and mixtures; the stacked sections become a vertical Neuromandala and material for rotation animations.',
      ),
      part(
        'status',
        'Состояние разработки',
        'Development state',
        'Сохранены кадры, виртуальный прототип и каталог движения. Связь с пространством Nuanu относится к истории разработки; форма «Маяка» не подменяет авторство существующей архитектуры площадки. Параметры развёртывания и отдельный показ обсуждаются по задаче.',
        'The archive retains still studies, a virtual prototype and a motion catalogue. The Nuanu connection concerns development history; Lighthouse does not substitute for the authorship of the venue’s existing architecture. Deployment and a presentation are scoped for a specific task.',
      ),
    ],
  },
  {
    id: 'potustoronniy',
    slug: 'beyond',
    title: l('Потусторонний', 'Beyond'),
    category: l('Иммерсивная инсталляция', 'Immersive installation'),
    workType: 'installation',
    stage: 'concept',
    summary: l(
      'Концепт теневого театра: удары по бубну вызывают свет, звук и движущиеся силуэты, а затем пространство меняет правила ответа.',
      'A shadow-theatre concept: drum strikes summon light, sound and moving silhouettes, then the space changes its rules of response.',
    ),
    question: l(
      'Что происходит с чувством управления, когда пространство перестаёт отвечать ожидаемым образом?',
      'What happens to a sense of agency when a space stops responding as expected?',
    ),
    experience: l(
      'Участник проходит ритуальный сюжет внутри кругового экрана, где инструмент, свет и тени становятся соисполнителями.',
      'A participant follows a ritual narrative inside a circular screen, with an instrument, light and shadows as co-performers.',
    ),
    media: ['archive-potustoronniy'],
    credits: [
      author(
        'Далер Арабов',
        'Daler Arabov',
        'Автор концепции, сюжета и светозвукового протокола',
        'Concept, narrative and light–sound protocol',
      ),
    ],
    facts: {
      ru: [
        'Концепция и сториборд',
        'Проектный круговой экран: диаметр 6 м, высота 3 м',
        'Учебный проект о свете и взаимодействии',
      ],
      en: [
        'Concept and storyboard',
        'Designed circular screen: 6 m diameter, 3 m height',
        'Learning project on light and interaction',
      ],
    },
    story: [
      part(
        'journey',
        'Путешествие внутри круга',
        'A journey inside the circle',
        'Участник находит бубен на центральном пьедестале. Удар вызывает пульсацию света и эхо, на полупрозрачном круговом экране появляются танцующие тени. Сюжет постепенно лишает действие ожидаемого ответа: звук и тени отступают, инструмент возвращается на место.',
        'A participant finds a drum on a central pedestal. A strike triggers pulsing light and echoes, and dancing shadows appear on the translucent circular screen. The narrative gradually removes the expected response: sound and shadows withdraw and the instrument returns to its place.',
      ),
      part(
        'protocol',
        'Свет, звук и действие',
        'Light, sound and action',
        'Схема соединяет пьезоконтактный микрофон, канал передачи, TouchDesigner, проекторы, поворотные стойки с силуэтами и синхронный звук. Удар, задержка и шум входят в партитуру. Маска, бубен и природная звуковая среда работают как элементы перцептивного театра.',
        'The scheme connects a piezo contact microphone, transmission channel, TouchDesigner, projectors, rotating silhouette stands and synchronized sound. Impact, delay and noise enter the score. A mask, drum and nature soundscape function as elements of perceptual theatre.',
      ),
      part(
        'archive',
        'Учебный концепт',
        'A study concept',
        'Концепт разработан в рамках учебного модуля Contented о свете. Сохранились презентация, сториборд и техническая схема теневого театра.',
        'The concept was developed for a Contented learning module on light. A presentation, storyboard and technical scheme for the shadow theatre are retained.',
      ),
    ],
  },
  {
    id: 'honors',
    slug: 'neuro-honor-board',
    title: l('Нейродоска почёта', 'Neuro Honor Board'),
    category: l('Интерактивный павильон', 'Interactive pavilion'),
    workType: 'installation',
    stage: 'concept',
    summary: l(
      'Конкурсный концепт для Сколково соединяет портреты, истории и Нейромандалы героев с общим проекционным объёмом.',
      'A competition concept for Skolkovo connects protagonists’ portraits, stories and Neuromandalas with a shared projection volume.',
    ),
    question: l(
      'Как показать людей за институциональными достижениями через их истории и внутренние визуальные ландшафты?',
      'How can people behind institutional achievements appear through their stories and internal visual landscapes?',
    ),
    experience: l(
      'Посетитель знакомится с нейропортретами на стенах; синхронизированная проекция связывает личный образ с центральным кубом.',
      'Visitors encounter neuro-portraits on the walls; synchronized projection connects a personal image with the central cube.',
    ),
    media: ['archive-honors', 'honors-scheme'],
    credits: [
      author(
        'ODA.dream',
        'ODA.dream',
        'Художественная концепция, нейротехнологии и содержание',
        'Artistic concept, neurotechnology and content',
      ),
      author(
        'Анастасия Митина',
        'Anastasia Mitina',
        'Архитектурная концепция объёма павильона',
        'Architectural concept of the pavilion volume',
      ),
    ],
    facts: {
      ru: [
        'Проект конкурса ART × TECHNOLOGY, направление 6',
        'Предполагаемый контекст — общественный интерьер Сколково',
        'Визуализации проектной конфигурации',
      ],
      en: [
        'ART × TECHNOLOGY competition project, Direction 6',
        'Proposed context: Skolkovo public interior',
        'Visualisations of the proposed configuration',
      ],
    },
    story: [
      part(
        'portraits',
        'Люди и внутренние ландшафты',
        'People and inner landscapes',
        'Предложенный цикл охватывает 10–15 героев экосистемы: интервью, ЭЭГ-сессию и портрет. На двух полукруглых стенах возникают диптихи — фотография, Нейромандала и биография. Человек остаётся рассказчиком своей истории; биосигнал становится художественным материалом.',
        'The proposed cycle covers 10–15 protagonists from the ecosystem: interview, EEG session and portrait. Diptychs appear on two semicircular walls: photograph, Neuromandala and biography. A person remains the narrator of their history; the biosignal becomes artistic material.',
      ),
      part(
        'space',
        'Павильон и диафильм',
        'Pavilion and diaporama',
        'В центре предусмотрен куб с многослойными проекционными сетками. Мандалы проходят как диафильм; соответствующая панель на стене подсвечивается, связывая объём и лицо. Купол-символ мозга и полукруглые стены задают пространственный образ; отдельный посетительский слой предполагает живое участие.',
        'A cube with layered projection scrims is proposed at the centre. Mandalas move through it as a diaporama; the corresponding wall panel lights up, connecting volume and face. A brain-symbol dome and semicircular walls create the spatial image; a separate visitor layer proposes live participation.',
      ),
      part(
        'competition',
        'Конкурсный проект',
        'Competition project',
        'Проект подготовлен для направления 6 конкурса ART × TECHNOLOGY. 20 апреля 2026 года работа получила первое место под названием «Мозг Сколково: Нейропортреты». Инсталляция остаётся концепцией; следующий этап — разработка её реализации и размещения.',
        'The project was prepared for track 6 of ART × TECHNOLOGY. On 20 April 2026 it received first place under the title Skolkovo Brain: Neuroportraits. The installation remains a concept; the next stage is to develop its production and placement.',
      ),
    ],
  },
  {
    id: 'theatre-my-name',
    slug: 'theatre-of-my-name',
    title: l('Театр Имени Меня', 'Theatre of My Name'),
    category: l('Партисипаторный перформанс', 'Participatory performance'),
    workType: 'performance',
    stage: 'realized',
    year: 2020,
    aliases: ['ТИМ', 'TIM', 'Neuro Art Dance', 'Нейро-арт-танец', 'neuro-dance'],
    summary: l(
      'Личный запрос и открытая Нейромандала становятся материалом группового танца и совместной интерпретации.',
      'A personal question and openly recorded Neuromandala become material for collective dance and interpretation.',
    ),
    question: l(
      'Как увидеть свой вопрос в движении других людей, не задавая им его словами?',
      'How can a person see their question in other people’s movement without telling them its words?',
    ),
    experience: l(
      'Свидетель удерживает запрос; движущиеся отвечают телом на экранную мандалу и затем делятся откликом. Роли могут меняться.',
      'A witness holds a question; movers respond bodily to the mandala on screen, then share their responses. Roles can rotate.',
    ),
    media: ['archive-theatre-my-name'],
    relatedWorks: ['neurosync', 'schrodinger', 'neuromandala'],
    credits: [
      author(
        'ODA.dream',
        'ODA.dream',
        'Нейромандала, художественная и технологическая часть',
        'Neuromandala, artistic and technological contribution',
      ),
      author(
        'Юлия Коричина',
        'Yulia Korichina',
        'Со-формирование практики группового движения на дебютном ретрите',
        'Co-shaping collective movement at the debut retreat',
      ),
    ],
    facts: {
      ru: [
        'Исток — ретрит «Кораблик», 15 марта 2020',
        'Роли свидетеля и движущихся',
        'Архивный сценарий группы 3–7 человек — около двух часов',
      ],
      en: [
        'Origin: Korablik retreat, 15 March 2020',
        'Witness and mover roles',
        'Archived 3–7-person scenario: approximately two hours',
      ],
    },
    story: [
      part(
        'origin',
        'Дебют на «Кораблике»',
        'Korablik debut',
        'Архив датирует начало работы 15 марта 2020 года на ретрите «Кораблик» в Подмосковье. ODA.dream привезли Нейромандалу, а Юлия Коричина предложила участникам петь, танцевать и коллективно двигать экранные мандалы друг друга. Этот опыт стал основой отдельного перформанса и практики.',
        'The archive dates the work’s origin to 15 March 2020 at the Korablik retreat near Moscow. ODA.dream brought Neuromandala, and Yulia Korichina invited participants to sing, dance and collectively move one another’s on-screen mandalas. The experience became the basis of a distinct performance and practice.',
      ),
      part(
        'roles',
        'Свидетель и движущиеся',
        'Witness and movers',
        'Свидетель формулирует личный запрос; ЭЭГ записывается открыто и превращается в экранную Нейромандалу. Движущиеся не знают запроса и отвечают движением на свой отклик и визуальное поле. После танца они дают словесную обратную связь, которую свидетель интерпретирует в контексте собственного опыта.',
        'The witness formulates a personal question; EEG is recorded openly and becomes an on-screen Neuromandala. Movers do not know the question and move in response to their own experience and the visual field. After the dance they offer verbal feedback, which the witness interprets within their own experience.',
      ),
      part(
        'session',
        'Сценарий участия',
        'Participation scenario',
        'Сценарий v2 включает вводную рамку, обсуждение ожиданий, запись запроса, разминку, расслабление и вторую мандалу, игровые действия, групповой танец и интеграцию. Открытая и завершающая записи сопоставляются в разговоре. Архив описывает разные масштабы группы; параметры конкретной сессии согласуются отдельно.',
        'Scenario v2 includes an introductory frame, discussion of expectations, question recording, warm-up, relaxation and a second mandala, play, collective dance and integration. Opening and closing recordings are juxtaposed in conversation. The archive describes different group sizes; a specific session’s conditions are agreed separately.',
      ),
      part(
        'lineage',
        'Родословная и интерпретация',
        'Lineage and interpretation',
        'Авторские публикации сопоставляют ТИМ с аутентичным движением, групповыми проекциями, плейбек-театром, психодрамой и метафорическими картами. Здесь Нейромандала и тела участников становятся материалом интерпретации; отзывы о точном совпадении с запросом остаются личными свидетельствами опыта.',
        'The authors’ writings juxtapose TIM with Authentic Movement, group projection, playback theatre, psychodrama and metaphorical cards. Neuromandala and participants’ bodies become material for interpretation; reports of close correspondence with a question remain personal accounts of experience.',
      ),
    ],
  },
  {
    id: 'cultural-neuro-code',
    title: l('Культурный нейрокод', 'Cultural Neuro Code'),
    category: l('Исследовательская медиа-работа', 'Research-based media work'),
    workType: 'interactive-work',
    stage: 'prototype',
    summary: l(
      'Личная память, культурные формы и биологическая обратная связь соединяются в исследовательскую художественную линию.',
      'Personal memory, cultural forms and biofeedback meet in a research-based artistic line.',
    ),
    question: l(
      'Как культурное наследие может стать живым материалом личного отклика?',
      'How can cultural heritage become living material for a personal response?',
    ),
    experience: l(
      'Истории, орнаменты, песни и другие культурные материалы сопоставляются с визуальным откликом и становятся генеративной композицией.',
      'Stories, ornaments, songs and other cultural materials are juxtaposed with visual responses and become generative composition.',
    ),
    media: ['neuromandala-cultural-code'],
    relatedWorks: ['happiness', 'neuromandala'],
    sourceRefs: [
      sourceSnapshots['cultural-neuro-code.md'],
      sourceSnapshots['Golem_Work_Roles.json'],
      sourceSnapshots['Ossetia_2025_Golem_Source.md'],
    ],
    facts: {
      ru: [
        'Самостоятельная работа и сквозная исследовательская линия',
        'Сохранились аудиовизуальные материалы нейроорнамента',
        'Участие в выставке культурного кода Северной Осетии, Москва, 2025',
      ],
      en: [
        'A distinct work and cross-media research line',
        'Audiovisual neuro-ornament material is retained',
        'Participation in the North Ossetia cultural-code exhibition, Moscow, 2025',
      ],
    },
    story: [
      part(
        'layers',
        'Личный и культурный слои',
        'Personal and cultural layers',
        'Работа соединяет семейные истории, фотографии и контекст идентичности с орнаментами, песнями, сказками, ландшафтами и предметной культурой. Предлагаемый протокол сопоставляет эти материалы с биосигнальными откликами; значения и личные ассоциации остаются частью рассказа участника.',
        'The work connects family narratives, photographs and identity context with ornaments, songs, tales, landscapes and material culture. A proposed protocol juxtaposes these materials with biosignal responses; meanings and personal associations remain part of the participant’s account.',
      ),
      part(
        'forms',
        'Сквозная художественная линия',
        'A cross-media artistic line',
        'Результат может принимать форму карты связей, генеративного медиа-объекта или среды участия. Это работа, развивающаяся через разные носители; она связана с предметной темой воды и нейроорнаментальными композициями. Нейромандала предоставляет отдельный технологический и художественный слой.',
        'The outcome can take the form of a relational map, a generative media object or a participatory environment. This work develops through different media, relating to the object line’s water motif and neuro-ornamental compositions. Neuromandala provides a distinct technological and artistic layer.',
      ),
      part(
        'context',
        'Нейроорнамент и выставка',
        'Neuro-ornament and exhibition',
        'ODA.dream участвовала в мультимедийной выставке «Культурный код Северной Осетии» в Москве 27–29 октября 2025 года. В материалах работы представлен центральный экран нейроорнамента. Полная инсталляционная версия исследовательского проекта остаётся в разработке.',
        'ODA.dream participated in the North Ossetia Cultural Code multimedia exhibition in Moscow on 27–29 October 2025. The work’s materials include the central neuro-ornament screen. A full installation version of the research project remains in development.',
      ),
    ],
  },
  {
    id: 'neuromandala',
    methodId: 'neuromandala',
    title: l('Нейромандала', 'Neuromandala'),
    category: l('Генеративная медиа-работа', 'Generative media work'),
    workType: 'interactive-work',
    stage: 'realized',
    summary: l(
      'Биосигнал становится живой аудиовизуальной формой, а участник одновременно наблюдает и изменяет её.',
      'A biosignal becomes living audiovisual form that a participant observes and changes at the same time.',
    ),
    question: l(
      'Как наблюдение собственного состояния становится художественным действием?',
      'How does observing one’s own state become artistic action?',
    ),
    experience: l(
      'Непрерывно меняющийся экранный образ соединяет запись сигнала, восприятие, внимание и личную интерпретацию участника.',
      'A continually changing on-screen image connects signal capture, perception, attention and personal interpretation.',
    ),
    media: ['neuromandala-terra', 'neuromandala-frequencies'],
    relatedWorks: ['mindshow', 'neurosync', 'interference', 'cultural-neuro-code'],
    sourceRefs: [sourceSnapshots['neuromandala.md'], sourceSnapshots['Golem_Work_Roles.json']],
    facts: {
      ru: [
        'Работа и технологический метод имеют связанные, самостоятельные роли',
        'Визуальная форма развивается в реальном времени',
        'Индивидуальное и совместное участие',
      ],
      en: [
        'Artwork and technological method have distinct, related roles',
        'Visual form develops in real time',
        'Individual and shared participation',
      ],
    },
    story: [
      part(
        'material',
        'Состояние как материал',
        'State as material',
        'В художественной Нейромандале биосигнал становится изменчивой формой. Интерфейс выступает переводчиком между измерением, визуальной композицией и восприятием. Участник наблюдает происходящее и влияет на дальнейшее развитие образа; личный смысл не извлекается автоматически из сигнала.',
        'In the artistic Neuromandala, a biosignal becomes changing form. The interface translates between measurement, visual composition and perception. A participant observes what unfolds and influences its further development; personal meaning is not automatically extracted from the signal.',
      ),
      part(
        'participation',
        'Работа существует как процесс',
        'The work exists as a process',
        'Экранная композиция создаётся во времени. Участие может быть индивидуальным или совместным; каждое действие меняет развитие образа. Разные художественные версии сохраняют собственные названия и контекст. Устройство записи и визуализации описано на странице метода.',
        'The screen composition develops over time. Participation can be individual or shared, with each action shaping how the image unfolds. Different artistic versions retain their own titles and contexts. Recording and visualisation are described on the method page.',
      ),
      part(
        'relations',
        'Произведение и метод',
        'Artwork and method',
        'Нейромандала существует как самостоятельное произведение и как метод создания других работ. Здесь раскрывается художественный опыт участия; на странице метода — устройство системы. MindShow, спектакли, Нейросинхронизация и предметные линии развивают этот язык по-своему.',
        'Neuromandala is both an artwork in its own right and a method used to create other works. This page explores the artistic experience of participation; the method page explains the system. MindShow, stage performances, Neurosynchronization and object lines each develop this language in their own way.',
      ),
    ],
  },
  {
    id: 'brain-hack',
    title: l('Взлом Мозга', 'Brain Hack'),
    category: l('Игровая лаборатория', 'Game laboratory'),
    workType: 'game',
    stage: 'concept',
    media: [],
    mediaNote: l('Работа представлена текстовой концепцией.', 'The work is presented as a written concept.'),
    summary: l(
      'Концепт серии игровых задач о том, как внимание, ожидание и иллюзии меняют воспринимаемую картину.',
      'A concept for a game series exploring how attention, expectation and illusions change what is perceived.',
    ),
    question: l(
      'Как прожить конфликт восприятия через игру и совместный разбор?',
      'How can a conflict of perception be experienced through play and collective reflection?',
    ),
    experience: l(
      'Короткие раунды соединяют интуитивный ответ, повторное рассмотрение и обсуждение того, что повлияло на решение.',
      'Short rounds connect an intuitive response, reconsideration and discussion of what influenced the decision.',
    ),
    facts: {
      ru: [
        'Серия интерактивных задач',
        'Концепция игровых раундов и совместного обсуждения',
        'Образовательные и событийные применения предложены в архиве',
      ],
      en: [
        'Series of interactive tasks',
        'Concept for game rounds and shared discussion',
        'Educational and event applications proposed in the archive',
      ],
    },
    story: [
      part(
        'conflict',
        'Конфликт восприятия',
        'Perceptual conflict',
        'Короткие головоломки предлагают участнику столкнуться с различием между первым впечатлением и последующим рассмотрением. Материалом служат внимание, ожидание и когнитивные искажения; игра открывает пространство разговора о собственном решении.',
        'Short puzzles invite participants to encounter a difference between first impressions and reconsideration. Attention, expectation and cognitive biases provide the material; the game opens a conversation about one’s decision.',
      ),
      part(
        'round',
        'Раунд и разбор',
        'Round and reflection',
        'Предложенная структура чередует быструю интуицию и осмысленное рассмотрение. После раунда участники обсуждают восприятие и стратегии ответа. Концепция предусматривает интерактивную зону для события, образовательный блок или командную практику.',
        'The proposed structure alternates quick intuition with considered reflection. After each round, participants discuss perception and response strategies. The concept can take the form of an interactive event area, an educational module or a team practice.',
      ),
    ],
  },
  {
    id: 'journey',
    slug: 'journey-to-yourself',
    title: l('Путешествие к себе', 'Journey to Yourself'),
    category: l('Интерактивная VR-среда', 'Interactive VR environment'),
    workType: 'interactive-work',
    stage: 'concept',
    aliases: ['Путешествие', 'Journey'],
    media: [],
    mediaNote: l('Работа представлена текстовой концепцией.', 'The work is presented as a written concept.'),
    summary: l(
      'Созерцательный VR-концепт: дыхание, внимание и внутренний темп становятся принципом постепенного раскрытия среды.',
      'A contemplative VR concept: breathing, attention and internal pace become the principle for a gradually unfolding environment.',
    ),
    question: l(
      'Как внутренняя смена темпа может стать способом перемещения по виртуальной среде?',
      'How can a change of internal pace become a way of moving through a virtual environment?',
    ),
    experience: l(
      'Участник входит в среду с небольшим количеством стимулов; её раскрытие задумано как ответ на изменение дыхания и внимания.',
      'A participant enters a low-stimulus environment whose unfolding is conceived as a response to changes in breathing and attention.',
    ),
    facts: {
      ru: [
        'VR-концепт',
        'Сценарий и техническое устройство в разработке',
        'Предложен как самостоятельная среда и связанный модуль внимания',
      ],
      en: [
        'VR concept',
        'Scenario and technical system in development',
        'Proposed as an environment and related attention module',
      ],
    },
    story: [
      part(
        'environment',
        'Минимальная среда',
        'A minimal environment',
        'На старте среда задумана низкостимульной. По мере изменения темпа и внимания сцена постепенно раскрывается. Этот художественный принцип связывает внутреннее наблюдение с воспринимаемым пространством.',
        'The initial environment is conceived as low-stimulus. As pace and attention change, the scene gradually unfolds. This artistic principle connects internal observation with perceived space.',
      ),
      part(
        'contexts',
        'Предлагаемые применения',
        'Proposed applications',
        'Концепция предусматривает иммерсивную зону, созерцательную практику и учебный модуль о внимании, теле и восприятии. Выбор датчиков, VR-оборудования и длительности сессии — задачи следующего этапа разработки.',
        'The concept proposes an immersive area, a contemplative practice and a learning module about attention, the body and perception. Sensor selection, VR equipment and session duration are tasks for the next development stage.',
      ),
    ],
  },
];

export const additionalWorks: Work[] = definitions.map((row) => ({
  legacyId: row.id,
  slug: row.id,
  year: null,
  aliases: [],
  basedOn: [],
  relatedWorks: [],
  cases: [],
  configurations: [],
  credits: [
    author(
      'ODA.dream',
      'ODA.dream',
      'Художественная концепция и авторская разработка',
      'Artistic concept and authorial development',
    ),
  ],
  reviewNotes: [
    l(
      'Условия показа и адаптации обсуждаются со студией.',
      'Presentation and adaptation arrangements are discussed with the studio.',
    ),
  ],
  sourceRefs: [
    sourceSnapshots[row.id + '.md'],
    ...(row.id === 'honors'
      ? [sourceSnapshots['Golem_Skolkovo_2026.md'], sourceSnapshots['proof-award-skolkovo-arttech.md']]
      : []),
  ],
  availability: l(
    row.stage === 'realized'
      ? 'Показ, изготовление нового экземпляра или адаптация обсуждаются со студией.'
      : 'Работа в разработке. Возможности участия и дальнейшего развития обсуждаются со студией.',
    row.stage === 'realized'
      ? 'Presentation, refabrication or adaptation are scoped for the task; current conditions are agreed with the studio.'
      : 'The work is in development. Its next stage and possible participation are scoped for the task.',
  ),
  featuredOnHome: false,
  inRepertoire: false,
  bookable: false,
  rnd: row.stage !== 'realized',
  publication: 'published',
  source: 'src/content/' + row.id + '.md',
  ...row,
}));

export const additionalMedia: Media[] = [
  {
    id: 'archive-another-people',
    src: '/images/works/archive-another-people.webp',
    width: 2199,
    height: 1467,
    kind: 'image',
    representation: 'render',
    rights: 'cleared',
    source:
      'another-people.md; original archived artwork image; owner display permission 2026-10-05 and full work/material migration 2026-10-07',
    alt: {
      ru: 'Другие люди · визуализация проекта',
      en: 'Other People · project visualization',
    },
    caption: {
      ru: 'Другие люди · визуализация проекта',
      en: 'Other People · project visualization',
    },
  },
  {
    id: 'archive-dashran',
    src: '/images/works/archive-dashran.webp',
    width: 1280,
    height: 853,
    kind: 'image',
    representation: 'render',
    rights: 'cleared',
    source:
      'dashran.md; original archived artwork image; owner display permission 2026-10-05 and full work/material migration 2026-10-07',
    alt: {
      ru: 'Момент Даршана · визуализация проекта',
      en: 'Darshan Moment · project visualization',
    },
    caption: {
      ru: 'Момент Даршана · визуализация проекта',
      en: 'Darshan Moment · project visualization',
    },
  },
  {
    id: 'archive-fourth-dimension',
    src: '/images/works/archive-fourth-dimension.webp',
    width: 628,
    height: 932,
    kind: 'image',
    representation: 'photograph',
    rights: 'cleared',
    source:
      'fourth-dimension.md; original archived artwork image; owner display permission 2026-10-05 and full work/material migration 2026-10-07',
    alt: {
      ru: '4-е измерение · фотография работы',
      en: 'Fourth Dimension · work photograph',
    },
    caption: {
      ru: '4-е измерение · фотография работы',
      en: 'Fourth Dimension · work photograph',
    },
  },
  {
    id: 'archive-mom-baby',
    src: '/images/works/archive-mom-baby.webp',
    width: 627,
    height: 836,
    kind: 'image',
    representation: 'photograph',
    rights: 'cleared',
    source:
      'mom-baby.md; original archived artwork image; owner display permission 2026-10-05 and full work/material migration 2026-10-07',
    alt: {
      ru: 'Мама и Малыш · фотография работы',
      en: 'Mom & Baby · work photograph',
    },
    caption: {
      ru: 'Мама и Малыш · фотография работы',
      en: 'Mom & Baby · work photograph',
    },
  },
  {
    id: 'archive-happiness',
    src: '/images/works/archive-happiness.webp',
    width: 960,
    height: 1280,
    kind: 'image',
    representation: 'photograph',
    rights: 'cleared',
    source:
      'happiness.md; original archived artwork image; owner display permission 2026-10-05 and full work/material migration 2026-10-07',
    alt: {
      ru: 'Счастье · фотография работы',
      en: 'Happiness · work photograph',
    },
    caption: {
      ru: 'Счастье · фотография работы',
      en: 'Happiness · work photograph',
    },
  },
  {
    id: 'archive-voronka',
    src: '/images/works/archive-voronka.webp',
    width: 1280,
    height: 960,
    kind: 'image',
    representation: 'photograph',
    rights: 'cleared',
    source:
      'voronka.md; original archived artwork image; owner display permission 2026-10-05 and full work/material migration 2026-10-07',
    alt: {
      ru: 'Воронка · фотография работы',
      en: 'Funnel · work photograph',
    },
    caption: {
      ru: 'Воронка · фотография работы',
      en: 'Funnel · work photograph',
    },
  },
  {
    id: 'archive-lighthouse',
    src: '/images/works/archive-lighthouse.webp',
    width: 1065,
    height: 1110,
    kind: 'image',
    representation: 'render',
    rights: 'cleared',
    source:
      'lighthouse.md; original archived artwork image; owner display permission 2026-10-05 and full work/material migration 2026-10-07',
    alt: {
      ru: 'Маяк · визуализация проекта',
      en: 'Lighthouse · project visualization',
    },
    caption: {
      ru: 'Маяк · визуализация проекта',
      en: 'Lighthouse · project visualization',
    },
  },
  {
    id: 'archive-potustoronniy',
    src: '/images/works/archive-potustoronniy.webp',
    width: 1920,
    height: 1080,
    kind: 'image',
    representation: 'diagram',
    rights: 'cleared',
    source:
      'potustoronniy.md; original archived artwork image; owner display permission 2026-10-05 and full work/material migration 2026-10-07',
    alt: {
      ru: 'Потусторонний · архивный эскиз концепции',
      en: 'Beyond · archival concept sketch',
    },
    caption: {
      ru: 'Потусторонний · архивный эскиз концепции',
      en: 'Beyond · archival concept sketch',
    },
  },
  {
    id: 'archive-honors',
    src: '/images/works/archive-honors.webp',
    width: 1920,
    height: 1097,
    kind: 'image',
    representation: 'render',
    rights: 'cleared',
    source:
      'honors.md; original archived artwork image; owner display permission 2026-10-05 and full work/material migration 2026-10-07',
    alt: {
      ru: 'Нейродоска почёта · визуализация проекта',
      en: 'Neuro Honor Board · project visualization',
    },
    caption: {
      ru: 'Нейродоска почёта · визуализация проекта',
      en: 'Neuro Honor Board · project visualization',
    },
  },
  {
    id: 'archive-theatre-my-name',
    src: '/images/works/archive-theatre-my-name.webp',
    width: 1920,
    height: 1282,
    kind: 'image',
    representation: 'photograph',
    rights: 'cleared',
    source:
      'theatre-my-name.md; original archived artwork image; owner display permission 2026-10-05 and full work/material migration 2026-10-07',
    alt: {
      ru: 'Театр Имени Меня · фотография работы',
      en: 'Theatre of My Name · work photograph',
    },
    caption: {
      ru: 'Театр Имени Меня · фотография работы',
      en: 'Theatre of My Name · work photograph',
    },
  },
];
