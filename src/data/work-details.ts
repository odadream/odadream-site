import type { Localized, Rights } from './site';
import type { EditorialSection, SourceReference } from './editorial';
import { sourceSnapshots } from './editorial';
import { documentPages, type NumberedDocumentPage } from '../lib/prepared-media';
import { archiveDocuments } from './archive-documents';

export interface WorkDetail {
  story: EditorialSection[];
  credits: { name: Localized; role: Localized }[];
  reviewNotes: Localized[];
  relatedWorks: string[];
  sourceRefs: SourceReference[];
}
const text = (ru: string, en: string): Localized => ({ ru, en });
const section = (
  id: string,
  titleRu: string,
  titleEn: string,
  bodyRu: string,
  bodyEn: string,
): EditorialSection => ({
  id,
  title: text(titleRu, titleEn),
  body: text(bodyRu, bodyEn),
});
const credit = (nameRu: string, nameEn: string, roleRu: string, roleEn: string) => ({
  name: text(nameRu, nameEn),
  role: text(roleRu, roleEn),
});
const studio = (ru: string, en: string) => credit('ODA.dream', 'ODA.dream', ru, en);
const refs = (...files: string[]) => files.map((file) => sourceSnapshots[file]);

export interface WorkDocument {
  id: string;
  legacyId?: string;
  workId: string;
  title: Localized;
  description: Localized;
  href: string;
  year: number | null;
  language: 'en' | 'ru';
  pages: number;
  bytes: number;
  pageImages?: NumberedDocumentPage[];
  selectedPages?: number[];
  originalAccess?: 'public' | 'internal';
  rights: Rights;
  sha256: string;
  source: string;
  sourceRefs: SourceReference[];
}

const documentRecords: WorkDocument[] = [
  {
    id: 'oda-rings-drawings',
    legacyId: 'media-oda-rings-drawings',
    workId: 'rings',
    title: text('Чертёж изготовления колец', 'Ring manufacturing drawing'),
    description: text(
      'Архивная версия v220927: профили колец, положение камней и развёртка гравировки. Это документация конкретной пары, а не актуальные условия заказа.',
      'Archive version v220927: ring profiles, gemstone placement and engraving layout. It documents this particular pair, rather than current commissioning terms.',
    ),
    href: '/documents/oda-rings-drawings-v220927.pdf',
    year: 2022,
    language: 'en',
    pages: 1,
    bytes: 4636536,
    rights: 'cleared',
    sha256: 'db6d16e59bdb669e81049f48a3752c07c8e71e180aea33d6bbd62176e88e3593',
    source:
      'src/content/media-oda-rings-drawings.md; owner permission to display works and private commissions 2026-10-05',
    sourceRefs: refs('media-oda-rings-drawings.md'),
  },
  {
    id: 'oda-rings-banner',
    legacyId: 'media-oda-rings-banner',
    workId: 'rings',
    title: text('Выставочный баннер Synergy', 'Synergy exhibition banner'),
    description: text(
      'Архивный баннер 2022 года с авторской историей колец. Текст и контакты сохранены в оригинале; это исторический материал, не актуальное предложение студии.',
      'A 2022 archive banner telling the authors’ ring story. Original wording and contacts are retained; this is historical material, not the studio’s current offer.',
    ),
    href: '/documents/oda-rings-synergy-banner-2022.pdf',
    year: 2022,
    language: 'en',
    pages: 1,
    bytes: 40404691,
    rights: 'cleared',
    sha256: 'bb32ed031005fdbe96b8f31c82f76a0c1fa95f7e582f52a5f589b4eea73b069f',
    source:
      'src/content/media-oda-rings-banner.md; owner permission to display works and private commissions 2026-10-05',
    sourceRefs: refs('media-oda-rings-banner.md'),
  },
];

export const workDocuments: WorkDocument[] = [...documentRecords, ...archiveDocuments].map((row) => ({
  ...row,
  pageImages: documentPages(row.href, row.selectedPages),
}));

// Selected, edited source material. The source archive is never rendered or imported at runtime.
export const workDetails: Record<string, WorkDetail> = {
  interference: {
    story: [
      section(
        'stage',
        'Две сценические реальности',
        'Two stage realities',
        'Пять сцен собираются вживую из партитуры исполнителей и решений зрителей: движения, выбора и рассказанных историй. Рядом развивается виртуальная сцена со своими законами. Она не служит точным цифровым двойником; источник каждого совпадения между изображением и действием остаётся открытым вопросом.',
        'Five scenes are assembled live from the performers’ score and audience decisions: movement, choices and stories. A virtual stage develops alongside them according to its own rules. It is not an exact digital twin; the source of each apparent correspondence between image and action remains an open question.',
      ),
      section(
        'language',
        'Тело, сигнал и сценический образ',
        'Body, signal and stage image',
        'Компьютерное зрение и видимые ArUco-маркеры формируют внешний технический взгляд на тело. ЭЭГ вводит другой слой — изменяющийся сигнал участников. Эти слои соединяются с генеративной средой, живой музыкой и светом. Художественное изображение внутреннего процесса не выдаётся за измерение мыслей или чувств.',
        'Computer vision and visible ArUco markers create an external technical view of the body. EEG introduces another layer: participants’ changing signals. These layers meet a generative environment, live music and light. The artistic image of an inner process is not presented as a measurement of thoughts or feelings.',
      ),
      section(
        'history',
        'От лаборатории к премьере',
        'From laboratory to premiere',
        'Сотрудничество с Инновационным театром балета началось в 2024 году на «Коде провинции» и продолжилось внутренней лабораторией. В 2025 году на фестивале Циолковского был показан «Проект Шрёдингер». Премьера «Интерференции реальностей» состоялась 16 мая 2026 года в ИКЦ в Калуге. Это последовательные работы общей исследовательской линии, а не переименования одного спектакля.',
        'The collaboration with Innovation Ballet Theatre began at Code of the Province in 2024 and continued in an internal laboratory. Project Schrödinger was presented at the Tsiolkovsky festival in 2025. Interference of Realities premiered on 16 May 2026 at Kaluga’s Innovation Cultural Centre. These are successive works within a shared research trajectory, rather than new names for one performance.',
      ),
    ],
    credits: [
      studio(
        'Художественно-технологическое решение · Ольга и Далер Арабовы',
        'Artistic and technological design · Olga and Daler Arabov',
      ),
      credit('Анна Сенатова', 'Anna Senatova', 'Художественное руководство', 'Artistic leadership'),
      credit('Ксения Голыжбина', 'Ksenia Golyzhibina', 'Постановка', 'Staging'),
      credit(
        'Александр Шестернин',
        'Alexander Shesternin',
        'Оригинальная музыка, live set и саунд-дизайн',
        'Original music, live set and sound design',
      ),
      credit('Аркадий Лаврентьев', 'Arkady Lavrentiev', 'Свет', 'Lighting'),
      credit(
        'Инновационный театр балета',
        'Innovation Ballet Theatre',
        'Совместная постановка и исполнение',
        'Co-production and performance',
      ),
      credit(
        'Зрители-участники',
        'Participating audience',
        'Выбор, движение и истории внутри спектакля',
        'Choices, movement and stories within the performance',
      ),
    ],
    reviewNotes: [
      text(
        'Условия повторного показа и гастрольная конфигурация обсуждаются со студией.',
        'Repeat presentations and touring arrangements are discussed with the studio.',
      ),
    ],
    relatedWorks: ['schrodinger', 'neurosync'],
    sourceRefs: refs('interference.md', 'schrodinger.md'),
  },
  mindshow: {
    story: [
      section(
        'signal',
        'Сигнал становится изображением',
        'A signal becomes an image',
        'Участник подключается к ЭЭГ-гарнитуре и наблюдает, как относительные параметры сигнала меняют абстрактный визуальный паттерн. Изображение постоянно перестраивается и становится поводом заметить собственные ощущения и ассоциации. Участник одновременно создаёт материал и наблюдает его; интерпретация остаётся за человеком.',
        'A participant wears an EEG headset and observes how relative signal parameters change an abstract visual pattern. The image keeps transforming, inviting attention to sensations and associations. The participant both contributes material and observes it; interpretation remains with the person.',
      ),
      section(
        'narrative',
        'Рассказ и цифровой артефакт',
        'Narrative and a digital artefact',
        'В версиях с текстовыми и визуальными ИИ-слоями участник описывает увиденные образы. Его слова и параметрический видеоряд становятся материалом для последовательности сцен и аудиовизуальной сборки. Результаты нескольких участников могут показываться вместе. Состав этих слоёв зависит от версии; выдача и хранение личного цифрового результата согласуются для конкретного показа.',
        'In versions with text and visual AI layers, participants describe the images they perceive. Their words and the parametric video become material for a sequence of scenes and an audiovisual composition. Several participants’ results may be shown together. These layers depend on the version; delivery and storage of a personal digital result are agreed for each presentation.',
      ),
      section(
        'versions',
        'Одна работа, несколько конфигураций',
        'One work, several configurations',
        'Ранние фестивальные показы, в том числе BYOB 2019, проходили под названием MindGrid; позднее закрепилось MindShow. Интерактивная зона, VJ-сопровождение и самостоятельный перформанс используют общий художественный принцип, но различаются участием, оборудованием и сценическим устройством.',
        'Early festival presentations, including BYOB 2019, used the name MindGrid; MindShow became established later. An interactive area, VJ accompaniment and a standalone performance share an artistic principle but differ in participation, equipment and staging.',
      ),
    ],
    credits: [
      studio(
        'Концепция, нейрореактивная среда и проведение',
        'Concept, neuroreactive environment and facilitation',
      ),
    ],
    reviewNotes: [
      text(
        'Визуализация — художественный опыт, а не диагностика. Длительность сессии и поток посетителей зависят от выбранной конфигурации.',
        'The visualisation is an artistic experience, not a diagnosis. Session duration and visitor flow depend on the selected configuration.',
      ),
    ],
    relatedWorks: [],
    sourceRefs: refs('mindshow.md'),
  },
  neurobattle: {
    story: [
      section(
        'paradox',
        'Состязание без силового усилия',
        'Competition without physical force',
        'Два игрока управляют одним виртуальным объектом. В зависимости от режима игровой контур реагирует на относительные изменения альфа- или бета-активности. Попытка выиграть может требовать спокойствия или сосредоточенности вместо привычного напряжения — отсюда «Парадокс Успеха». Результат раунда относится к правилам игры, а не к оценке интеллекта или личности.',
        'Two players control one virtual object. Depending on the mode, the game responds to relative changes in alpha or beta activity. Winning may call for calm or focus rather than conventional effort: hence the Paradox of Success. A round’s result belongs to the game’s rules, not to an assessment of intelligence or personality.',
      ),
      section(
        'audience',
        'Игроки и наблюдатели',
        'Players and observers',
        'Механика осваивается во время короткого раунда. Зрители видят движение общего объекта, обсуждают стратегии и могут вступать в следующий поединок. Отдельные дуэли или турнирная последовательность меняют организацию участия; настройка гарнитур, инструктаж и смена игроков остаются частью проведения.',
        'The mechanics are learned during a short round. Spectators watch the shared object move, discuss strategies and may join the next duel. Individual matches or a tournament sequence change the organisation of participation; headset fitting, briefing and player changes remain part of delivery.',
      ),
      section(
        'versions',
        'Исторические имена',
        'Historical names',
        'Работа ранее называлась «Нейробитва», Neurobattle и «Нейробаттл». Сегодня она представлена как «Парадокс Успеха». На странице события можно узнать о её показе на олимпиаде DANO.',
        'The work was previously known as Neurobattle and Neurobattl. It is now presented as Paradox of Success. The event page tells the story of its presentation at the DANO Olympiad.',
      ),
    ],
    credits: [
      studio('Концепция, авторское ПО и проведение игры', 'Concept, custom software and game delivery'),
    ],
    reviewNotes: [
      text(
        'К игровому раунду добавляются настройка гарнитур, инструктаж и смена участников. Эти этапы учитываются при планировании потока посетителей.',
        'Headset setup, briefing and participant changeover take place in addition to the game round. They are included when planning visitor flow.',
      ),
    ],
    relatedWorks: [],
    sourceRefs: refs('neurobattle.md'),
  },
  schrodinger: {
    story: [
      section(
        'first-act',
        'Акт I: «Ничего не понятно»',
        'Act I: Nothing is clear',
        'Зрителей сначала размещают на сцене, а восемь добровольцев подходят к столу устройств. Гарнитуры и браслеты переходят от зрителей к танцорам; аудитория высказывает догадки о происходящем. Две зоны — старое шаманство и техношаманство — оставляют действие открытым для интерпретации. Устройства становятся частью драматургии до объяснения их назначения.',
        'The audience is initially seated onstage, and eight volunteers approach a table of devices. Headsets and wrist sensors pass from spectators to dancers while the audience voices its interpretations. Two areas—traditional shamanism and techno-shamanism—leave the action open to interpretation. The devices enter the dramaturgy before their purpose is explained.',
      ),
      section(
        'second-act',
        'Акт II: «Теперь всё ясно»',
        'Act II: Now everything is clear',
        'ODA.dream и труппа раскрывают устройство системы. Визуализация ЭЭГ, озвученные ассоциации и пульсовые данные становятся материалом этюдов. В показе использовались четыре ЭЭГ-канала и четыре пульсоканала. Сбой системы включён в партитуру как образ хрупкости эксперимента.',
        'ODA.dream and the company reveal how the system works. EEG visuals, spoken associations and pulse data become material for studies. The presentation used four EEG channels and four pulse channels. A system failure becomes part of the score, exposing the fragility of the experiment.',
      ),
      section(
        'history',
        'Состоявшаяся лаборатория',
        'A realised laboratory performance',
        'Работа показана 22 мая 2025 года в Калуге в завершение фестиваля Циолковского, совместно с Инновационным театром балета. Ей предшествовали встречи и лаборатория 2024 года; следующей работой этой линии стала «Интерференция реальностей». Сейчас «Проект Шрёдингер» не входит в репертуар.',
        'The work was presented with the Innovation Ballet Theatre on 22 May 2025 in Kaluga, at the close of the Tsiolkovsky Festival. It followed meetings and laboratory sessions in 2024; Interference of Realities became the next work in this line. Project Schrödinger is currently outside the repertoire.',
      ),
    ],
    credits: [
      studio(
        'Художественно-технологический контур и ведение лаборатории',
        'Artistic and technological system and laboratory facilitation',
      ),
      credit(
        'Инновационный театр балета',
        'Innovation Ballet Theatre',
        'Со-постановка и исполнение',
        'Co-staging and performance',
      ),
    ],
    reviewNotes: [
      text(
        'ЭЭГ и пульс становятся материалом сценической интерпретации; личные переживания раскрываются через рассказ и участие человека.',
        'EEG and pulse data become material for stage interpretation; personal experiences emerge through each person’s account and participation.',
      ),
    ],
    relatedWorks: ['interference', 'neurosync'],
    sourceRefs: refs('schrodinger.md', 'interference.md'),
  },
  rings: {
    story: [
      section(
        'origin',
        'До имени студии',
        'Before the studio’s name',
        'Ольга и Далер решили изготовить обручальные кольца сами и выгравировать на золоте следы двух альфа-ритмов. Сапфир в кольце Далера связан с цветом глаз Ольги, изумруд в кольце Ольги — с цветом глаз Далера. Пара была создана к свадьбе 20 марта 2020 года. Это два личных объекта, а не обозначение серийной коллекции.',
        'Olga and Daler chose to make their wedding rings and engrave traces of two alpha rhythms onto gold. The sapphire in Daler’s ring refers to Olga’s eye colour; the emerald in Olga’s ring refers to Daler’s. The pair was made for their wedding on 20 March 2020. These are two personal objects, not the name of a mass-produced collection.',
      ),
      section(
        'dream',
        'Мечта как авторская история',
        'A dream as an authored story',
        'Во время записи и изготовления авторы представляли общее будущее: море, тепло и ребёнка. Позднее поездка на Бали и семейные фотографии стали для них возвращением к этому образу. Эта связь рассказывается как личная интерпретация и память; нейросигнал не считается носителем предсказания или причиной последующих событий.',
        'During recording and making, the authors imagined a shared future: the sea, warmth and a child. Their later journey to Bali and family photographs became, for them, a return to that image. This relationship is told as personal interpretation and memory; the neural signal is not treated as a prediction or as the cause of subsequent events.',
      ),
      section(
        'history',
        'От личного объекта к Материи',
        'From a personal object to Materia',
        'История колец стала одним из истоков ODA.dream и линии Материя. 6 августа 2022 года баннер с кольцами сопровождал её публичный показ на Synergy Crypto & NFT Forum на Бали. Архивная хроника сохраняет этапы от эскиза и мастерской до семейных снимков. Новый заказ требует собственной истории и изготовления, а не копирования этой пары.',
        'The rings’ story became one of the origins of ODA.dream and the Materia line. On 6 August 2022, a banner featuring the rings accompanied its public presentation at Synergy Crypto & NFT Forum in Bali. The archival chronicle preserves stages from sketch and workshop to family photographs. A new commission requires its own story and making process rather than a copy of this pair.',
      ),
    ],
    credits: [
      credit(
        'Ольга и Далер Арабовы',
        'Olga and Daler Arabov',
        'Замысел, личная история и участие в изготовлении',
        'Concept, personal story and participation in making',
      ),
    ],
    reviewNotes: [
      text(
        'Мечта и её позднейшее узнавание — авторский нарратив. Запись ЭЭГ и материальная гравировка описываются отдельно от него.',
        'The dream and its later recognition are the authors’ narrative. EEG recording and physical engraving are described separately from it.',
      ),
    ],
    relatedWorks: ['emomandala'],
    sourceRefs: refs('oda-rings.md', 'media-oda-rings-story.md'),
  },
  emomandala: {
    story: [
      section(
        'selection',
        'Поиск внутреннего отклика',
        'Finding inner resonance',
        'Приложение предлагает меняющиеся мандалы: участник выбирает узор и палитру, с которыми ощущает связь. Emomandala OS использует генератор p5.js и самонаблюдение без ЭЭГ-гарнитуры. Выбор становится отправной точкой личной истории, а не измерением эмоций.',
        'The application offers changing mandalas: a participant chooses a pattern and palette with which they feel a connection. Emomandala OS uses a p5.js generator and self-observation without an EEG headset. The choice becomes a starting point for a personal narrative, rather than a measurement of emotions.',
      ),
      section(
        'artefact',
        'История получает физическую форму',
        'A story takes physical form',
        'Выбранный кадр и история человека становятся основой физического артефакта. В архиве описаны двусторонний кулон и шарм из серебра 925 с УФ-эмалью; QR-код связывает объект с паспортом создания. В состав работы входит ончейн-сайт, связанный с нарративом участника и историей изготовления. Конкретный адрес и состав открываемых материалов определяются для отдельного артефакта.',
        'The selected frame and the person’s story become the basis for a physical artefact. The archive describes a two-sided pendant and a charm in sterling silver with UV enamel; a QR code connects the object to its creation record. The work includes an on-chain site linked to the participant’s narrative and making history. The specific address and materials made accessible are defined for each artefact.',
      ),
      section(
        'history',
        'Несколько элементов одной работы',
        'Several elements of one work',
        'Работа началась в августе 2022 года на хакатоне с приложения для эмоционального интеллекта. Позднее появились украшения и образцы цветной лазерной гравировки, созданные совместно с исследовательской группой ИТМО. Приложение, личная история, физический объект и запись его создания развиваются как элементы одной работы.',
        'The work began with an emotional-intelligence application at a hackathon in August 2022. Jewellery and colour laser-engraving samples followed, made with an ITMO research group. The application, personal narrative, physical object and creation record develop as elements of one work.',
      ),
    ],
    credits: [
      studio(
        'Концепция составной работы, цифровая и физическая персонализация',
        'Composite work concept, digital and physical personalisation',
      ),
      credit(
        'Исследовательская группа ИТМО',
        'ITMO research group',
        'Совместная ветка цветной лазерной гравировки',
        'Collaborative colour laser-engraving branch',
      ),
    ],
    reviewNotes: [
      text(
        'Изготовленные артефакты и исследовательские версии приложения имеют разную степень готовности. Публичный доступ к личной истории не следует автоматически из QR-кода или ончейн-записи.',
        'Made artefacts and research versions of the application have different levels of readiness. Public access to a personal story is not implied by a QR code or an on-chain record.',
      ),
    ],
    relatedWorks: ['rings'],
    sourceRefs: refs('emomandala.md', 'emomandala-os.md'),
  },
  neurosync: {
    story: [
      section(
        'practice',
        'От индивидуального внимания к группе',
        'From individual attention to the group',
        'Сессия начинается с фиксации собственного состояния и намерения. Ведущий предлагает циклы сонастройки через дыхание, внимание, небольшие движения и слушание. Участники наблюдают происходящее с ними и с группой; элементы биологической обратной связи поддерживают наблюдение, но не заменяют личный рассказ.',
        'A session starts with observing one’s state and setting an intention. A facilitator proposes cycles of attunement through breathing, attention, small movements and listening. Participants observe themselves and the group; elements of biofeedback support observation without replacing personal accounts.',
      ),
      section(
        'reflection',
        'Разбор опыта',
        'Reflecting on the experience',
        'После совместной практики группа обсуждает визуальные и поведенческие маркеры, различия ощущений и способы взаимодействия. В фестивальном, ретритном или образовательном контексте разбор связывает опыт с конкретной задачей участников. Размер группы, инструменты обратной связи и длительность определяются при подготовке.',
        'After the shared practice, the group discusses visual and behavioural markers, differences in experience and ways of interacting. In festival, retreat or educational settings, reflection connects the experience to participants’ specific questions. Group size, feedback tools and duration are defined during preparation.',
      ),
      section(
        'development',
        'Практика и инсталляционный концепт',
        'Practice and an installation concept',
        'Нейросинхронизация — групповая практика с ведущим. На её основе развивается «Круг синхронизации»: инсталляционный концепт, в котором расположение участников, общее изображение и свет создают пространство совместного внимания.',
        'Neurosynchronization is a facilitated group practice. Sync Circle develops this practice into an installation concept in which the participants’ arrangement, shared imagery and light create a space for shared attention.',
      ),
    ],
    credits: [
      studio('Разработка практики и фасилитация сессий', 'Practice development and session facilitation'),
    ],
    reviewNotes: [
      text(
        'Совместный опыт не является доказательством измеренной психологической близости или гарантией командной регуляции.',
        'A shared experience is not proof of measured psychological closeness or a guarantee of team regulation.',
      ),
    ],
    relatedWorks: [],
    sourceRefs: refs('neurosync.md', 'sync-circle.md'),
  },
  sync: {
    story: [
      section(
        'concept',
        'Круг как общее поле',
        'The circle as a shared field',
        'Концепция предлагает разместить участников по кругу и собрать их изменяющиеся ЭЭГ-сигналы в напольную проекцию. Индивидуальные мандалы-нейрограммы соседствуют с цветными связями между ними. Музыка и LED-свет продолжают пространственный рисунок. Это проектируемая среда на основе Нейросинхронизации, а не описание завершённой установки.',
        'The concept proposes seating participants in a circle and combining their changing EEG signals in a floor projection. Individual mandala neurograms appear alongside coloured connections between them. Music and LED lighting extend the spatial composition. This is a proposed environment based on Neurosynchronization, not a description of a completed installation.',
      ),
      section(
        'configuration',
        'Предложенная конфигурация',
        'Proposed configuration',
        'Проектный сценарий рассчитан на пять–семь участников. Он включает MultiSync, TouchDesigner, напольную проекцию, звук и LED-свет. Предлагается сессия 25–30 минут и обсуждение 10–15 минут. Оборудование и ход участия предстоит испытать при разработке инсталляции.',
        'The proposed scenario is for five to seven participants and uses MultiSync, TouchDesigner, floor projection, sound and LED lighting. It proposes a 25–30-minute session followed by 10–15 minutes of discussion. Equipment and participation need testing as the installation develops.',
      ),
      section(
        'interpretation',
        'Связь на экране и связь между людьми',
        'A screen connection and a human connection',
        'Цветные линии показывают результат выбранного алгоритма сопоставления сигналов. Художественная метафора общего внимания не означает, что система измеряет согласие, близость или единую мысль группы. Изображение на карточке обозначено концептуальной визуализацией; обсуждать можно дальнейшую разработку, а не заказ готового показа.',
        'Coloured lines show the result of a chosen signal-comparison algorithm. The artistic metaphor of shared attention does not mean the system measures agreement, closeness or a group’s shared thought. The card image is identified as a conceptual rendering; inquiries concern further development, not a ready-made presentation.',
      ),
    ],
    credits: [
      studio(
        'Инсталляционный концепт на основе Нейросинхронизации',
        'Installation concept based on Neurosynchronization',
      ),
    ],
    reviewNotes: [
      text(
        'Работа находится на стадии концепции; условия производства определяются при разработке.',
        'The work is at the concept stage; production requirements will be defined during development.',
      ),
    ],
    relatedWorks: [],
    sourceRefs: refs('sync-circle.md', 'neurosync.md'),
  },
  ancestors: {
    story: [
      section(
        'memory',
        'Память одного художественного тела',
        'The memory of one artistic body',
        'Внутренняя лаборатория с Еленой Ковылиной исследовала память, род и идентичность после миграции. Личный архив и рассказ перформера соединялись с генеративной средой. В концептуальной цепочке присутствовали вероятностные данные consumer-ДНК, ИИ-интерпретации пробелов архива и ЭЭГ одного участника; каждый источник имеет собственные ограничения.',
        'An internal laboratory with Elena Kovylina explored memory, lineage and identity after migration. The performer’s personal archive and account met a generative environment. The conceptual chain included probabilistic consumer-DNA data, AI interpretations of archival gaps and EEG from one participant; each source has its own limits.',
      ),
      section(
        'method',
        'Измерение и метафора',
        'Measurement and metaphor',
        'Образы «нейропортрета рода» относятся к художественной интерпретации. ЭЭГ не извлекает память предков, ДНК не задаёт судьбу, а ИИ-гипотеза не становится архивным фактом. Биологическая обратная связь позволяет сопоставлять реакцию участника и меняющееся изображение, сохраняя разницу между сигналом, семейным рассказом и сгенерированным образом.',
        'Images of a “neural portrait of lineage” belong to artistic interpretation. EEG does not retrieve ancestral memory, DNA does not determine destiny, and an AI hypothesis does not become an archival fact. Biofeedback allows a participant’s responses to be compared with a changing image while keeping signal, family account and generated imagery distinct.',
      ),
      section(
        'laboratory',
        'Лаборатория и дальнейшее развитие',
        'Laboratory and further development',
        'Работа осталась на этапе прототипа и внутренней лаборатории с Еленой Ковылиной. Представленные материалы показывают исследовательский процесс. Для дальнейшего развития предстоит определить сценарий участия и условия доступа к личным данным.',
        'The work remains a prototype developed in an internal laboratory with Elena Kovylina. The materials shown document that research process. Further development requires a participation scenario and agreed access to personal data.',
      ),
    ],
    credits: [
      studio(
        'Художественно-технологическая разработка прототипа',
        'Artistic and technological prototype development',
      ),
      credit(
        'Елена Ковылина',
        'Elena Kovylina',
        'Совместная лаборатория, перформер и личный архив',
        'Collaborative laboratory, performer and personal archive',
      ),
    ],
    reviewNotes: [
      text(
        'Доступ к личным архивам, генетическим сведениям и записям участников требует отдельного согласия.',
        'Access to personal archives, genetic information and participant recordings requires separate consent.',
      ),
    ],
    relatedWorks: [],
    sourceRefs: refs('ancestors.md', 'Golem_CultTech_2026.md', 'proof-award-culttech-vienna.md'),
  },
};

/** Archival originals for URL compatibility; not new gallery entries or cover aliases. */
export interface LegacyWorkResource {
  id: string;
  workId: string;
  path: string;
  rights: Rights;
  sha256: string;
  permissionBasis: string;
  source: string;
}
export const legacyWorkResources: LegacyWorkResource[] = [
  {
    id: 'legacy-emomandala-cover-thumb',
    workId: 'emomandala',
    path: '/images/content/materia/emomandala/emomandala-cover-thumb.webp',
    rights: 'cleared',
    sha256: '97feab4667c3c36d54e22f79c4b1bba5d6851b68c7ee10855926f8e30e8a16e4',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'emomandala.md',
  },
  {
    id: 'legacy-ig-02-wedding',
    workId: 'rings',
    path: '/images/content/materia/oda-rings/ig-02-wedding.webp',
    rights: 'cleared',
    sha256: '9835fe48bccd2d84c53f10426f9e5f4214e09b4636799ba147a7f5145c60d479',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'media-oda-rings-story.md',
  },
  {
    id: 'legacy-ig-03-sketch',
    workId: 'rings',
    path: '/images/content/materia/oda-rings/ig-03-sketch.webp',
    rights: 'cleared',
    sha256: '76326ce2cf00553baaeac1b52142586fb0ae63b2cce013888e007b14d077adf9',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'media-oda-rings-story.md',
  },
  {
    id: 'legacy-ig-04-workshop',
    workId: 'rings',
    path: '/images/content/materia/oda-rings/ig-04-workshop.webp',
    rights: 'cleared',
    sha256: 'ccf3572170aab3f523f5e3b37375395931af58ed56f6747a84b7a16a7130be1b',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'media-oda-rings-story.md',
  },
  {
    id: 'legacy-ig-05-model-eeg',
    workId: 'rings',
    path: '/images/content/materia/oda-rings/ig-05-model-eeg.webp',
    rights: 'cleared',
    sha256: 'b702ea261ccf0f926a972328b0ee5b01b9d661c444501f548420fbfdd3f077d3',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'media-oda-rings-story.md',
  },
  {
    id: 'legacy-ig-06-hands',
    workId: 'rings',
    path: '/images/content/materia/oda-rings/ig-06-hands.webp',
    rights: 'cleared',
    sha256: '33bf52defe211924260d67c9d0b072bcb7f7d46aed75ff9d9905c02bc302766f',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'media-oda-rings-story.md',
  },
  {
    id: 'legacy-ig-07-flight',
    workId: 'rings',
    path: '/images/content/materia/oda-rings/ig-07-flight.webp',
    rights: 'cleared',
    sha256: '3d55ac2e94a3cfa1e3db3749f513d0ed8d8183a7fc23451a5f349b01af513c17',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'media-oda-rings-story.md',
  },
  {
    id: 'legacy-ig-08-dream-photo',
    workId: 'rings',
    path: '/images/content/materia/oda-rings/ig-08-dream-photo.webp',
    rights: 'cleared',
    sha256: 'cff4361c2e315b3686f71e81742d1c90a6dd1158055db823854581516fd52810',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'media-oda-rings-story.md',
  },
  {
    id: 'legacy-ig-09-lempuyang',
    workId: 'rings',
    path: '/images/content/materia/oda-rings/ig-09-lempuyang.webp',
    rights: 'cleared',
    sha256: '5a4a8f6d6a7bf3b207cad58dc8b59e3335d1204c8e2047135532156a6aaaf63d',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'media-oda-rings-story.md',
  },
  {
    id: 'legacy-oda-rings-cover-thumb',
    workId: 'rings',
    path: '/images/content/materia/oda-rings/oda-rings-cover-thumb.webp',
    rights: 'cleared',
    sha256: '1c7f4b92f53829044ce51bf7b10ebdeba465bfff2c7aa8aca944d4d82255e0aa',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'media-oda-rings-drawings.md + media-oda-rings-story.md + oda-rings.md',
  },
  {
    id: 'legacy-synergy-banner-preview-thumb',
    workId: 'rings',
    path: '/images/content/materia/oda-rings/synergy-banner-preview-thumb.webp',
    rights: 'cleared',
    sha256: '3f57c854028600516eef8ef60e44bde75190c93642ff3e6ccb8516928b13d713',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'media-oda-rings-banner.md',
  },
  {
    id: 'legacy-synergy-banner-preview',
    workId: 'rings',
    path: '/images/content/materia/oda-rings/synergy-banner-preview.webp',
    rights: 'cleared',
    sha256: '6c10e4386ed01ffdba6f295b0d904562e455626d0a49f0b70e85c603a42eb790',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'media-oda-rings-banner.md',
  },
  {
    id: 'legacy-interference-2026-poster-thumb',
    workId: 'interference',
    path: '/images/content/works/interference-2026-poster-thumb.webp',
    rights: 'cleared',
    sha256: 'ba75bb7479ce6a0383f41845b729673232e0d68fcaaa62b9b871678b9906ffa4',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'interference.md',
  },
  {
    id: 'legacy-schrodinger-2025-poster-thumb',
    workId: 'schrodinger',
    path: '/images/content/works/schrodinger-2025-poster-thumb.webp',
    rights: 'cleared',
    sha256: 'f79c90dd680375aa387acbfdabff303fbe97e6c659eab10a77d2d9669fdff1a3',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'schrodinger.md',
  },
  {
    id: 'legacy-sync-circle-hero-thumb',
    workId: 'sync',
    path: '/images/content/works/sync-circle/sync-circle-hero-thumb.webp',
    rights: 'cleared',
    sha256: 'f5e551a47eba54b0a25ad572329eca9db62a29f0b1ba3b246a0424e44a6241fe',
    permissionBasis:
      'Owner permission to display works and private commissions, 2026-10-05. Does not approve editorial publication or retirement of other URLs.',
    source: 'sync-circle.md',
  },
];
