import type { CaseEvent, Localized, Organization, Media } from './site';
import { sourceSnapshots } from './editorial';
import { schoolEvents, educationEventRefs } from './additional-programmes';

const l = (ru: string, en: string): Localized => ({ ru, en });
type Definition = Pick<CaseEvent, 'id' | 'title' | 'summary' | 'date' | 'place' | 'role'> &
  Partial<CaseEvent> & { files: string[] };
const definitions: Definition[] = [
  {
    id: 'rukami-2020',
    date: '2020-12-05',
    dateEnd: '2020-12-06',
    dateMeaning: 'event-window',
    title: { ru: 'NeuroSync · Rukami', en: 'NeuroSync · Rukami' },
    summary: {
      ru: 'Проект NeuroSync отмечен благодарностью организаторов онлайн-фестиваля идей и технологий.',
      en: 'Project NeuroSync received an acknowledgement from the online festival of ideas and technology.',
    },
    place: { ru: 'Онлайн · Великий Новгород', en: 'Online · Veliky Novgorod' },
    role: {
      ru: 'Участие проекта NeuroSync в онлайн-фестивале идей и технологий.',
      en: 'Participation by project NeuroSync in the online festival of ideas and technology.',
    },
    files: ['OwnerRecognition/ODA - 2020 Руками - NeuroSync.pdf'],
    detailPage: true,
    limitations: [],
  },
  {
    id: 'national-business-awards-2025',
    date: '2025',
    title: {
      ru: 'Технологии и инновации · Национальная бизнес-премия',
      en: 'Technology and Innovation · National Business Awards',
    },
    summary: {
      ru: 'Благодарность творческому дуэту ODA.dream за помощь в организации мероприятия.',
      en: 'An acknowledgement to ODA.dream for helping organise the event.',
    },
    place: { ru: 'Площадка в документе не указана', en: 'Venue not stated in the document' },
    role: {
      ru: 'Помощь в организации мероприятия.',
      en: 'Organisational support for the event.',
    },
    files: ['OwnerRecognition/ODA - 2025 ТПП.pdf'],
    detailPage: true,
  },
  {
    id: 'oktava-2021',
    date: '2021-04-12',
    type: 'lecture',
    work: 'neurosync',
    title: l('Лекция и нейросинхронизация · «Октава»', 'Lecture and neurosynchronization · Oktava'),
    summary: l(
      'Лекция и демонстрация синхронизации родителя и ребёнка.',
      'A lecture and a parent–child synchronization demonstration.',
    ),
    place: l('Тула · творческий кластер «Октава»', 'Tula · Oktava creative cluster'),
    role: l('Лекция и демонстрация «Нейросинхронизации».', 'Lecture and Neurosynchronization demonstration.'),
    files: ['Obsidian_Oktava_2021.md'],
  },
  {
    id: 'frequencies-2025',
    featuredOnHome: true,
    date: '2025-10-16',
    work: 'neuromandala',
    title: l('Нейромандала · Частоты 6.0', 'Neuromandala · Frequencies 6.0'),
    summary: l(
      'Живой перформанс и коллективный нейропортрет выставки «Комиссия по трёхтысячному году».',
      'A live performance and collective neuro-portrait at the Commission for the Year Three Thousand exhibition.',
    ),
    place: l('Москва · Галерея на Песчаной', 'Moscow · Gallery on Peschanaya'),
    role: l(
      'Художественная система, запись и участие посетителей. Сергей Страхов указан автором видеоотчёта.',
      'Artistic system, recording and visitor participation. Sergey Strakhov is credited with the video report.',
    ),
    source: 'https://t.me/odadream/708',
    files: ['hub-chastoti.md', 'Golem_Frequencies_2025.md', 'Golem_Public_Event_Reports.json'],
    limitations: [],
  },
  {
    id: 'wind-of-change-2024',
    date: '2024-11-18',
    dateMeaning: 'reported-by',
    work: 'neurobattle',
    title: l('Парадокс Успеха · Ветер перемен', 'Paradox of Success · Wind of Change'),
    summary: l(
      'Нейроигра для участников семейного благотворительного события.',
      'A neuro-game for participants in a family charity event.',
    ),
    place: l('Площадка не уточнена', 'Venue unspecified'),
    role: l(
      'Нейроигры и разговор об эмпатии; дети и родители участвовали в парных игровых сессиях.',
      'Neuro-games and a conversation about empathy; children and parents joined paired game sessions.',
    ),
    source: 'https://t.me/odadream/475',
    files: ['Golem_Public_Event_Reports.json', 'neurobattle.md'],
    limitations: [
      l(
        'Дата в хронологии — 18 ноября 2024 года, день публикации отчёта. Игра тогда называлась «Нейробитва».',
        'The timeline date, 18 November 2024, is the report publication date. The game was then known as Neurobattle.',
      ),
    ],
  },
  {
    id: 'synergy-bali-2022',
    featuredOnHome: true,
    date: '2022-08-06',
    work: 'rings',
    relatedWorks: ['mom-baby'],
    title: l('ODA.dream · Synergy Crypto & NFT Forum', 'ODA.dream · Synergy Crypto & NFT Forum'),
    summary: l(
      'Форумный дебют ODA.dream на Бали: история колец, линия Материя и начало «Мамы и Малыша».',
      'ODA.dream’s forum debut in Bali: the ring story, the Materia line and the beginning of Mom & Baby.',
    ),
    place: l('Бали · Synergy Crypto & NFT Forum', 'Bali · Synergy Crypto & NFT Forum'),
    role: l(
      'Авторский показ истории колец и материальных объектов; диалог с Александрой Борзых стал исходным контекстом вложенного кулона.',
      'Presenting the ring story and material objects; the conversation with Alexandra Borzikh became the origin context for the nested pendant.',
    ),
    files: ['proof-oda-synergy-forum-2022.md', 'Golem_Synergy_Bali_2022.md', 'oda-rings.md', 'mom-baby.md'],
    limitations: [
      l(
        'В материалах представлен баннер первого форумного показа ODA.dream.',
        'The materials include a banner from ODA.dream’s first forum presentation.',
      ),
    ],
  },
  {
    id: 'meditation-day-2026',
    date: '2026-05-24',
    dateMeaning: 'reported-by',
    participationStatus: 'held',
    work: 'neuromandala',
    title: l(
      'Нейромандала · III Международный день медитации',
      'Neuromandala · third International Meditation Day',
    ),
    summary: l(
      'Живая визуализация Нейромандалы Натали Осман на главной сцене.',
      'Live visualization of Natali Osman’s Neuromandala on the main stage.',
    ),
    place: l('Площадка не уточнена', 'Venue unspecified'),
    role: l(
      'Запись и визуализация нейросигнала. Натали Осман — ведущая медитации и приглашающая сторона.',
      'Recording and visualizing the neural signal. Natali Osman led the meditation and invited the studio.',
    ),
    source: 'https://t.me/odadream/760',
    files: ['Golem_Public_Event_Reports.json', 'proof-tst-meditation-day.md'],
    limitations: [
      l(
        'Дата в хронологии — 24 мая 2026 года, день публикации отчёта студии.',
        'The timeline date, 24 May 2026, is the publication date of the studio’s report.',
      ),
    ],
  },
  {
    id: 'ashram-birthday-2024',
    date: '2024-06-25',
    work: 'mindshow',
    context: 'private',
    title: l('MindShow · день рождения Ashram', 'MindShow · Ashram birthday'),
    summary: l(
      'Нейровизуальная среда для дня рождения студии практик.',
      'A neurovisual environment for the practice studio’s birthday.',
    ),
    place: l('Москва · студия Ashram', 'Moscow · Ashram Studio'),
    role: l(
      'Подготовка и проведение MindShow для студии Ashram.',
      'Preparing and presenting MindShow for Ashram Studio.',
    ),
    organizations: ['ashram'],
    files: ['event-ashram-birthday-2024.md', 'Golem_Event_Ashram_2024.md'],
  },
  {
    id: 'ashram-tim',
    date: '2023',
    dateMeaning: 'series-start',
    work: 'theatre-my-name',
    context: 'private',
    title: l('Театр Имени Меня · практики в Ashram', 'Theatre of My Name · Ashram practices'),
    summary: l(
      'Повторяющиеся сессии «Театра Имени Меня» в пространстве практик с 2023 года.',
      'Recurring Theatre of My Name sessions in a practice space since 2023.',
    ),
    place: l('Москва · студия Ashram', 'Moscow · Ashram Studio'),
    role: l(
      'Художественный протокол, нейровизуальная система и фасилитация. Натали Осман — принимающая сторона.',
      'Artistic protocol, neurovisual system and facilitation. Natali Osman hosted the sessions.',
    ),
    organizations: ['ashram'],
    files: ['event-ashram-tim.md', 'org-ashram.md'],
    media: ['ashram-neuro-art-dance-poster'],
    limitations: [],
  },
  {
    id: 'audi-application-2020',
    legacyId: 'event-audi-brand-2024',
    date: '2020-07-12',
    participationStatus: 'submitted',
    context: 'application',
    work: 'mindshow',
    title: l(
      'Project Cocktail · заявка Audi Born Digital',
      'Project Cocktail · Audi Born Digital submission',
    ),
    summary: l(
      'Конкурсная концепция нейростенда MindGrid: запись нейрограмм, ассоциации участников и несколько экранов.',
      'A competition concept for the MindGrid stand: neurogram recording, participant associations and multiple screens.',
    ),
    place: l('Москва · концепция для Audi City Moscow', 'Moscow · concept for Audi City Moscow'),
    role: l(
      'Конкурсная заявка с интерактивной инсталляцией на тему «Пограничность».',
      'A competition submission for an interactive installation on the theme of liminality.',
    ),
    organizations: ['audi'],
    files: ['event-audi-brand-2024.md', 'Golem_Event_Audi_2020.md'],
    limitations: [],
  },
  {
    id: 'bauman-2025',
    date: '2025',
    method: 'neuromandala',
    participationStatus: 'invited',
    type: 'lecture',
    title: l('Лекция о брейнхакинге · МГТУ им. Баумана', 'Brain-hacking lecture · Bauman MSTU'),
    summary: l(
      'Архивное приглашение к лекции в контексте «Москва 2030».',
      'An archival lecture invitation in the Moscow 2030 context.',
    ),
    place: l('Москва · МГТУ им. Баумана', 'Moscow · Bauman MSTU'),
    role: l('Приглашение к лекции о брейнхакинге.', 'An invitation to give a lecture on brain hacking.'),
    organizations: ['bauman', 'moscow2030'],
    media: ['event-bauman-lecture'],
    files: ['event-bauman-moscow2030-2025.md'],
    limitations: [],
  },
  {
    id: 'byob-2019',
    featuredOnHome: true,
    date: '2019-12-22',
    work: 'mindshow',
    title: l('MindGrid · BYOB 2019', 'MindGrid · BYOB 2019'),
    summary: l(
      'Первый показ ранней линии MindShow на московском проекционном фестивале.',
      'The first presentation of the early MindShow trajectory at Moscow’s projection festival.',
    ),
    place: l('Москва · BYOB', 'Moscow · BYOB'),
    role: l(
      'Живая ЭЭГ-визуализация под историческим именем MindGrid. Екатерина Калашникова — организатор.',
      'Live EEG visualisation under the historical MindGrid name. Ekaterina Kalashnikova organised the event.',
    ),
    files: ['event-byob-2019.md', 'event-byob.md'],
    limitations: [
      l(
        '«Нейроанализ события» — художественная интерпретация динамики записи.',
        'Event neuroanalysis is an artistic interpretation of the recording’s dynamics.',
      ),
    ],
  },
  {
    id: 'byob-2020',
    date: '2020-08-15',
    method: 'neuromandala',
    title: l('MultiSync · BYOB 2020', 'MultiSync · BYOB 2020'),
    summary: l(
      'Коллективная визуализация нескольких ЭЭГ-потоков на базе Нейромандалы.',
      'A collective visualisation of multiple EEG streams using Neuromandala.',
    ),
    place: l('Москва · BYOB', 'Moscow · BYOB'),
    role: l(
      'Групповая запись и генеративная визуализация. Екатерина Калашникова — организатор.',
      'Group recording and generative visualisation. Ekaterina Kalashnikova organised the event.',
    ),
    files: ['event-byob-2020.md', 'event-byob.md', 'multisync.md'],
  },
  {
    id: 'gonchar-2024',
    date: '2024',
    work: 'mindshow',
    context: 'private',
    participationStatus: 'recorded',
    title: l('Частное нейрошоу · Ната Гончар', 'Private neuro-show · Nata Gonchar'),
    summary: l(
      'Архивный контекст частного приглашения к нейровизуальной и лекционной программе.',
      'An archival context for a private invitation to a neurovisual and lecture programme.',
    ),
    place: l('Москва', 'Moscow'),
    role: l(
      'Приглашённая программа; запись связывает её с MindShow.',
      'An invited programme, linked to MindShow in the record.',
    ),
    files: ['event-gonchar-private-2024.md'],
    limitations: [],
  },
  {
    id: 'gong-fest-2024',
    date: '2024-07-05',
    dateEnd: '2024-07-07',
    dateMeaning: 'event-window',
    work: 'neuromandala',
    relatedProgrammes: ['sound-brain'],
    title: l('Нейромандала · Гонг Фест 2024', 'Neuromandala · Gong Fest 2024'),
    summary: l(
      'Запись ЭЭГ во время гонг-медитации; здесь возникла лекция «Звук и мозг».',
      'EEG recording during gong meditation; the Sound and Brain lecture originated here.',
    ),
    place: l('Сергиев Посад', 'Sergiev Posad'),
    role: l(
      'Нейровизуальная запись в звуковой практике. Николай Льговский и Центр гонг-медитации — организаторы.',
      'Neurovisual recording within a sound practice. Nikolay Lgovsky and the Gong Meditation Centre organised the festival.',
    ),
    files: ['event-gong-fest-2024.md', 'Golem_Event_Gong_2024.md'],
    limitations: [
      l(
        'Даты в хронологии относятся к фестивалю в целом.',
        'The timeline dates cover the festival as a whole.',
      ),
    ],
  },
  {
    id: 'gong-fest-2025',
    date: '2025-07-04',
    dateEnd: '2025-07-06',
    dateMeaning: 'event-window',
    programme: 'sound-brain',
    type: 'lecture',
    title: l('«Звук и мозг» · Гонг Фест 2025', 'Sound and Brain · Gong Fest 2025'),
    summary: l(
      'Лекция и перформанс в этнопарке «Кочевник».',
      'A lecture and performance at the Kochevnik ethnopark.',
    ),
    place: l('Сергиев Посад · этнопарк «Кочевник»', 'Sergiev Posad · Kochevnik ethnopark'),
    role: l(
      'Лекция «Звук и мозг» и перформанс; организатор — Николай Льговский, оборудование предоставил шатёр AUM.',
      'Sound and Brain lecture and performance; Nikolay Lgovsky organised the festival and the AUM tent provided equipment.',
    ),
    files: ['event-gong-fest-2025.md', 'Golem_Event_Gong_2025.md'],
    limitations: [],
  },
  {
    id: 'hse-2025',
    date: '2025-03-25',
    programme: 'beautiful-brain',
    type: 'lecture',
    title: l('«Красиво про мозг» · НИУ ВШЭ', 'Beautiful About the Brain · HSE University'),
    summary: l(
      'Иммерсивная лекция для студентов 2–3 курса ИРКИ НИУ ВШЭ, профиль «Запуск и управление медиастартапом».',
      'An immersive lecture for second- and third-year students at HSE’s Creative Industries Institute, Media Startup Launch and Management programme.',
    ),
    place: l('Москва · НИУ ВШЭ', 'Moscow · HSE University'),
    role: l('Приглашённые авторы и ведущие лекции.', 'Invited lecture authors and facilitators.'),
    organizations: ['hse'],
    files: ['event-hse-beautiful-brain-2025.md', 'proof-let-hse-beautiful-brain.md'],
    sourceRefs: [
      sourceSnapshots['event-hse-beautiful-brain-2025.md'],
      sourceSnapshots['proof-let-hse-beautiful-brain.md'],
      ...educationEventRefs.hse,
    ],
    limitations: [],
  },
  {
    id: 'itb-lab-2024',
    legacyId: 'event-itb-lab-2024-11',
    date: '2024-11-08',
    work: 'theatre-my-name',
    relatedWorks: ['neurosync'],
    context: 'laboratory',
    type: 'laboratory',
    title: l('Нейроинтерфейсы в танце · лаборатория ИТБ', 'Neurointerfaces in dance · ITB laboratory'),
    summary: l(
      'Внутренняя сессия с «Театром Имени Меня» и «Нейросинхронизацией».',
      'An internal session with Theatre of My Name and Neurosynchronization.',
    ),
    place: l('Калуга · Инновационный культурный центр', 'Kaluga · Innovation Cultural Centre'),
    role: l(
      'Нейровизуальная система и протоколы участия; Ксения Голыжбина организовала лабораторию с театром балета.',
      'Neurovisual system and participation protocols; Ksenia Golyzhibina organised the laboratory with the ballet theatre.',
    ),
    organizations: ['ikc', 'itb'],
    files: ['event-itb-lab-2024-11.md', 'event-kod-provincii.md'],
    limitations: [
      l(
        'Закрытая рабочая сессия с труппой Инновационного театра балета.',
        'A closed working session with the Innovation Ballet Theatre company.',
      ),
    ],
  },
  {
    id: 'kod-provincii-2024',
    legacyId: 'event-kod-provincii',
    date: '2024',
    work: 'theatre-my-name',
    relatedWorks: ['neurosync'],
    relatedProgrammes: ['feedback-empathy-brain', 'dance-feedback'],
    title: l(
      'Код провинции · научная хореографическая конференция',
      'Code of Province · scientific choreography conference',
    ),
    summary: l(
      'Лекция «Мозг, БОС и техноэмпатия», «Театр Имени Меня» и «Нейросинхронизация».',
      'Brain, Feedback and Techno-Empathy lecture, Theatre of My Name and Neurosynchronization.',
    ),
    place: l('Калужская область', 'Kaluga region'),
    role: l(
      'Лекция и два перформанса. Организаторы — Ксения Голыжбина и Елена Панасенко.',
      'A lecture and two performances. Ksenia Golyzhibina and Elena Panasenko organised the conference.',
    ),
    files: ['event-kod-provincii.md', 'event-tsiolkovsky.md'],
    sourceRefs: [
      sourceSnapshots['event-kod-provincii.md'],
      sourceSnapshots['event-tsiolkovsky.md'],
      ...educationEventRefs.dance,
    ],
    limitations: [
      l(
        'Встреча с театром балета ИКЦ положила начало последующей постановочной линии.',
        'The meeting with the ballet theatre at the Innovation Cultural Centre began a continuing line of stage work.',
      ),
    ],
  },
  {
    id: 'korablik-2020',
    date: '2020-03-15',
    work: 'theatre-my-name',
    relatedWorks: ['neuromandala'],
    title: l('Кораблик · дебют «Театра Имени Меня»', 'Korablik · Theatre of My Name debut'),
    summary: l(
      'Телесно-двигательная сессия, из которой вырос протокол «Театра Имени Меня».',
      'A movement session from which the Theatre of My Name protocol emerged.',
    ),
    place: l('Подмосковье · ретрит «Кораблик»', 'Moscow region · Korablik retreat'),
    role: l(
      'ODA.dream привезла Нейромандалу для демонстрации. Юлия Коричина предложила участникам петь и танцевать мандалы; протокол «свидетель / движущиеся» формировался совместно.',
      'ODA.dream brought Neuromandala for a demonstration. Yulia Korichina invited participants to sing and dance the mandalas; the witness/mover protocol developed together.',
    ),
    files: ['event-korablik-2020.md', 'theatre-my-name.md'],
  },
  {
    id: 'lamborghini-tea',
    legacyId: 'event-lamborghini-brand-2024',
    date: '2025-12-14',
    dateMeaning: 'reported-by',
    work: 'mindshow',
    context: 'private',
    title: l('Lamborghini Edition · нейродегустация чая', 'Lamborghini Edition · neuro-assisted tea tasting'),
    summary: l(
      'Закрытое мероприятие клуба владельцев Lamborghini с нейровизуальной интерпретацией дегустации.',
      'A private Lamborghini owners’ club event with a neurovisual interpretation of tea tasting.',
    ),
    place: l('Место не установлено', 'Location unconfirmed'),
    role: l(
      'Версия Нейромандалы для перформанса, подготовленного вместе с «Мудро Чай».',
      'A Neuromandala version for a performance prepared with Mudro Chay.',
    ),
    organizations: ['mudro-chay'],
    files: ['event-lamborghini-brand-2024.md', 'Golem_Telegram_Lamborghini.json'],
    source: 'https://t.me/odadream/722',
    limitations: [
      l(
        '14 декабря 2025 года — дата сообщения о перформансе для клуба владельцев Lamborghini.',
        '14 December 2025 is the report date for the performance for the Lamborghini owners’ club.',
      ),
    ],
  },
  {
    id: 'merck-2025',
    legacyId: 'event-merck-corporate',
    date: '2025',
    programme: 'neuroaesthetics-lec',
    type: 'lecture',
    participationStatus: 'recorded',
    title: l('Science-art лекция · Merck', 'Science-art lecture · Merck'),
    summary: l('Лекция для корпоративной аудитории.', 'A lecture for a corporate audience.'),
    place: l('Москва · площадка не установлена', 'Moscow · venue unconfirmed'),
    role: l('Корпоративная лекционная программа.', 'A corporate lecture programme.'),
    organizations: ['merck'],
    files: ['event-merck-corporate.md', 'org-merck.md'],
    limitations: [],
  },
  {
    id: 'mipt-2025',
    legacyId: 'event-mipt-terraforming-2025',
    date: '2025-12-09',
    work: 'neuromandala',
    relatedWorks: ['mindshow'],
    relatedProgrammes: ['neuromandala-workshop'],
    title: l('Нейромандала · Терраформинг / МФТИ', 'Neuromandala · Terraforming / MIPT'),
    summary: l(
      'Перформанс и инсталляция с персональными нейромандалами и коллективным архивом записи.',
      'A performance and installation with personal neuromandalas and a collective recording archive.',
    ),
    place: l('МФТИ · выставка «Терраформинг»', 'MIPT · Terraforming exhibition'),
    role: l(
      'Нейроинтерфейсы, генеративная визуализация и аудиовизуальный перформанс; Екатерина Капица указана куратором приглашения.',
      'Neurointerfaces, generative visuals and audiovisual performance; Ekaterina Kapitsa is identified as the inviting curator.',
    ),
    organizations: ['mipt'],
    media: ['neuromandala-terra'],
    files: [
      'event-mipt-terraforming-2025.md',
      'Golem_Event_Terraforming_2025.md',
      'proof-mipt-letter.md',
      'hub-education.md',
    ],
    limitations: [],
  },
  {
    id: 'bashkiria-2025',
    legacyId: 'event-pleinair-bashkiria-2025',
    date: '2025',
    work: 'neuromandala',
    title: l('Цифровой пленэр · Шульган-Таш', 'Digital plein-air · Shulgan-Tash'),
    summary: l(
      'Участие в первом цифровом пленэре в Башкортостане.',
      'Participation in the first digital plein-air in Bashkortostan.',
    ),
    place: l('Шульган-Таш · Башкортостан', 'Shulgan-Tash · Bashkortostan'),
    role: l(
      'Нейровизуальная практика в пленэрном контексте.',
      'Neurovisual practice within the plein-air context.',
    ),
    files: ['event-pleinair-bashkiria-2025.md', 'proof-let-bashkiria.md', 'proof-press-tskhr-bashkiria.md'],
    limitations: [],
  },
  {
    id: 'metro-2024',
    legacyId: 'event-pleinair-metro-2024',
    date: '2024',
    work: 'neuromandala',
    title: l('Цифровой пленэр · метро «Фонвизинская»', 'Digital plein-air · Fonvizinskaya metro'),
    summary: l(
      'Нейровизуальная работа в пространстве московского метро.',
      'Neurovisual work in the Moscow metro setting.',
    ),
    place: l('Москва · станция «Фонвизинская»', 'Moscow · Fonvizinskaya station'),
    role: l(
      'Участие в цифровом пленэре; архив связывает событие с сюжетом НТВ.',
      'Participation in a digital plein-air; the archive links the event to an NTV report.',
    ),
    files: ['event-pleinair-metro-2024.md', 'proof-press-ntv-metro.md'],
  },
  {
    id: 'portal-2024',
    featuredOnHome: true,
    date: '2024',
    work: 'mindshow',
    relatedWorks: ['neuromandala'],
    title: l('MindShow · Портал 2030–2050 / Гиперкуб', 'MindShow · Portal 2030–2050 / Hypercube'),
    summary: l(
      'Вывод нейровизуальной системы на фасад Гиперкуба в Сколково.',
      'Presenting the neurovisual system on the Hypercube facade in Skolkovo.',
    ),
    place: l('Сколково · Гиперкуб', 'Skolkovo · Hypercube'),
    role: l(
      'Визуальная система MindShow / Нейромандала для крупной архитектурной проекции.',
      'A MindShow / Neuromandala visual system for a large architectural projection.',
    ),
    organizations: ['moscow2030'],
    files: ['event-portal-2024.md', 'event-portal.md'],
    limitations: [],
  },
  {
    id: 'sber-2025',
    featuredOnHome: true,
    legacyId: 'event-sber-lecture-2025',
    date: '2025',
    programme: 'neuroaesthetics-lec',
    type: 'lecture',
    participationStatus: 'held',
    title: l('Science-art лекция · Сбербанк', 'Science-art lecture · Sberbank'),
    summary: l(
      'Лекция для корпоративной аудитории; на архивном кадре обозначена тема «БОС: разгадать сигналы мозга».',
      'A lecture for a corporate audience; the archival image names the topic Feedback: Decoding Brain Signals.',
    ),
    place: l('Москва', 'Moscow'),
    role: l('Приглашённая лекционная программа.', 'An invited lecture programme.'),
    organizations: ['sberbank'],
    media: ['event-sber-lecture'],
    files: ['event-sber-lecture-2025.md'],
    relatedProgrammes: ['beautiful-brain'],
    sourceRefs: [sourceSnapshots['event-sber-lecture-2025.md'], ...educationEventRefs.sber],
    limitations: [
      l(
        'Тема программы — «БОС: разгадать сигналы мозга». В программе также участвовал Рустам Боровик.',
        'The programme topic was Biofeedback: Understanding Brain Signals. Rustam Borovik also appeared in the programme.',
      ),
    ],
  },
  {
    id: 'tavrida-ai-2025',
    date: '2025-08-02',
    dateMeaning: 'event-window',
    participationStatus: 'submitted',
    context: 'application',
    work: 'cultural-neuro-code',
    title: l('Культурный код России · фестиваль ИИ', 'Cultural Code of Russia · AI festival'),
    summary: l(
      'Организаторы фестиваля ИИ поблагодарили Ольгу и Далера Арабовых за участие в проекте и работу над конкурсной заявкой.',
      'The AI festival organisers thanked Olga and Daler Arabov for contributing to the project and preparing their submission.',
    ),
    place: l('Судак · Таврида.АРТ', 'Sudak · Tavrida.ART'),
    role: l('Подготовка и подача конкурсной заявки.', 'Preparing and submitting a competition application.'),
    organizations: ['tavrida'],
    files: ['event-tavrida-ai-2025.md', 'Golem_Event_Tavrida_AI_2025.md'],
    limitations: [
      l(
        'Заявка связана с программой фестиваля 2 августа 2025 года.',
        'The application concerns the festival programme on 2 August 2025.',
      ),
    ],
  },
  {
    id: 'tavrida-gastro-2025',
    featuredOnHome: true,
    date: '2025-07-13',
    dateEnd: '2025-07-19',
    dateMeaning: 'event-window',
    participationStatus: 'held',
    type: 'lecture',
    programme: 'taste-brain',
    relatedWorks: ['neurobattle', 'neuromandala'],
    title: l('Мозг и вкус · «Гастро.Юг», Таврида.Арт', 'Brain and Taste · Gastro.Yug, Tavrida.Art'),
    summary: l(
      'Интерактивная лекция «Мозг и вкус: искусство осознанного восприятия» и практические занятия для участников арт-школы.',
      'The interactive lecture Brain and Taste: The Art of Mindful Perception and practical sessions for the art school participants.',
    ),
    place: l('Судак · Таврида.Арт', 'Sudak · Tavrida.Art'),
    role: l(
      'Ольга и Далер Арабовы: авторы и ведущие лекции и мастер-классов. В программу вошли наблюдение нейросигналов и нейросостязание участников.',
      'Olga and Daler Arabov authored and led the lecture and workshops. The programme included observing neural signals and a neurocompetition for participants.',
    ),
    organizations: ['tavrida'],
    participants: [
      { name: l('Ольга Арабова', 'Olga Arabov'), role: l('Автор и ведущая', 'Author and facilitator') },
      { name: l('Далер Арабов', 'Daler Arabov'), role: l('Автор и ведущий', 'Author and facilitator') },
    ],
    media: ['archive-talk-workshop-lectures-tavrida'],
    files: ['Obsidian_Tavrida_Gastro_2025.md'],
    source: 'Obsidian_Tavrida_Gastro_2025.md; owner confirmation 2026-10-13',
  },
  {
    id: 'tpp-2025',
    featuredOnHome: true,
    legacyId: 'event-tpp-mindshow-2025',
    date: '2025',
    work: 'mindshow',
    participationStatus: 'held',
    title: l('MindShow · Russian Digital Creative', 'MindShow · Russian Digital Creative'),
    summary: l(
      'Приглашённая нейровизуальная программа в контексте саммита.',
      'An invited neurovisual programme in the summit context.',
    ),
    place: l(
      'Москва · ТПП РФ по архивной записи',
      'Moscow · Russian Chamber of Commerce according to the archive',
    ),
    role: l('Экспертное приглашение с MindShow.', 'An expert invitation with MindShow.'),
    organizations: ['cci'],
    media: ['event-tpp-mindshow'],
    files: ['event-tpp-mindshow-2025.md'],
  },
  {
    id: 'techweek-2024',
    legacyId: 'event-techweek',
    date: '2024-11',
    method: 'neuromandala',
    type: 'lecture',
    title: l('Лекция · TechWeek', 'Lecture · TechWeek'),
    summary: l(
      'Лекционное участие Ольги и Далера Арабовых в московской конференции.',
      'Olga and Daler Arabov’s lecture contribution to the Moscow conference.',
    ),
    place: l('Москва', 'Moscow'),
    role: l(
      'Приглашённые спикеры; организатор — Корпорация Синергия.',
      'Invited speakers; Synergy Corporation organised the conference.',
    ),
    organizations: ['synergy'],
    files: ['event-techweek.md', 'Golem_Event_TechWeek_2024.md'],
    limitations: [],
  },
  {
    id: 'battle-billion-2024',
    legacyId: 'event-bitva-milliard-2024',
    date: '2024-11-26',
    work: 'neuromandala',
    relatedWorks: ['mindshow'],
    title: l('Нейропортрет · Битва за миллиард', 'Neuroportrait · Battle for a Billion'),
    summary: l(
      'Нейровизуальная инсталляция и коллективный образ форума по развитию городов и территорий.',
      'A neurovisual installation and collective image of the cities and territories development forum.',
    ),
    place: l('Россия · город не установлен', 'Russia · city unconfirmed'),
    role: l(
      'Нейростенд и персональные анимации. Организаторы — Егор Евланников и Сергей Львов.',
      'A neuro stand and personal animations. Organisers: Egor Evlannikov and Sergey Lvov.',
    ),
    files: ['event-bitva-milliard-2024.md', 'Golem_Event_Battle_Billion_2024.md'],
    limitations: [
      l(
        '«Нейропортрет форума» обозначает художественное произведение, а не доказанное измерение коллективного видения будущего.',
        'The forum neuroportrait denotes an artwork, not an established measurement of a collective vision of the future.',
      ),
    ],
  },
  {
    id: 'unique-russia-2026',
    legacyId: 'unique-russia',
    date: '2026-01-23',
    dateEnd: '2026-02-08',
    dateMeaning: 'event-window',
    method: 'neuromandala',
    type: 'discussion',
    title: l('Уникальная Россия · дискуссия о цифровом искусстве', 'Unique Russia · digital art discussion'),
    summary: l(
      'Панель о цифровом искусстве, искусственном интеллекте, авторском праве и художественных кейсах.',
      'A panel on digital art, artificial intelligence, copyright and artistic cases.',
    ),
    place: l('Москва · Гостиный двор', 'Moscow · Gostiny Dvor'),
    role: l(
      'Участие в дискуссии блока «Креативные индустрии» выставки-форума.',
      'Participation in the exhibition forum’s Creative Industries discussion.',
    ),
    files: ['unique-russia.md', 'Golem_Event_Unique_Russia_2026.md'],
    limitations: [
      l(
        'Указан период выставки-форума: 23 января — 8 февраля 2026 года.',
        'The dates cover the exhibition-forum: 23 January–8 February 2026.',
      ),
    ],
  },
  {
    id: 'ossetia-2025',
    featuredOnHome: true,
    legacyId: undefined,
    date: '2025-10-27',
    dateEnd: '2025-10-29',
    dateMeaning: 'event-window',
    work: 'cultural-neuro-code',
    title: l('Культурный код Северной Осетии', 'Cultural Code of North Ossetia'),
    summary: l(
      'Мультимедийная выставка в рамках социального проекта «Великая Россия».',
      'A multimedia exhibition within the Great Russia social project.',
    ),
    place: l('Москва', 'Moscow'),
    role: l(
      'Вклад в организацию и проведение выставки; МАМЭ и Центр межкультурной коммуникации — организаторы.',
      'A contribution to organising and presenting the exhibition; the Media Experts Association and the Intercultural Communication Centre were the organisers.',
    ),
    organizations: ['mame', 'communication-centre'],
    media: ['neuromandala-cultural-code'],
    files: ['Ossetia_2025_Golem_Source.md', 'cultural-neuro-code.md'],
    limitations: [],
  },
];

const baseAdditionalEvents: CaseEvent[] = definitions.map(({ files, ...row }) => ({
  legacyId:
    files[0].startsWith('event-') || files[0] === 'unique-russia.md'
      ? files[0].replace(/\.md$/, '')
      : undefined,
  slug: row.id,
  datePrecision: row.date.length === 4 ? 'year' : row.date.length === 7 ? 'month' : 'day',
  dateMeaning: 'participation',
  participationStatus: 'held',
  context: 'public',
  detailPage: false,
  featuredOnHome: false,
  type: 'presentation',
  organizations: [],
  organizationRoles: (row.organizations ?? []).map((organizationId) => ({
    organizationId,
    role: ['ikc', 'mipt', 'bauman'].includes(organizationId)
      ? 'venue'
      : organizationId === 'itb' || organizationId === 'mudro-chay'
        ? 'co-producer'
        : 'organizer',
    description: ['ikc', 'mipt', 'bauman'].includes(organizationId)
      ? l('Площадка события.', 'Event venue.')
      : organizationId === 'itb' || organizationId === 'mudro-chay'
        ? l('Соорганизация события.', 'Co-production of the event.')
        : l('Организация события.', 'Event organization.'),
  })),
  evidence: [],
  media: [],
  participants: [],
  story: [],
  limitations: [],
  relatedWorks: [],
  relatedProgrammes: [],
  source: `src/content/${files[0]}`,
  sourceRefs: files.map((file) => sourceSnapshots[file]),
  publication: 'published',
  ...row,
}));

export const additionalEvents: CaseEvent[] = [...baseAdditionalEvents, ...schoolEvents];

export interface EventSeries {
  id: string;
  legacyId: string;
  title: Localized;
  summary: Localized;
  cases: string[];
  sourceRefs: (typeof additionalEvents)[number]['sourceRefs'];
}
export const eventSeries: EventSeries[] = [
  {
    id: 'byob',
    legacyId: 'event-byob',
    title: l('BYOB', 'BYOB'),
    summary: l(
      'Проекционная фестивальная линия: от MindGrid к коллективной записи MultiSync и обновлённой MindShow.',
      'A projection-festival trajectory from MindGrid to collective MultiSync recording and the updated MindShow.',
    ),
    cases: ['byob-2019', 'byob-2020', 'byob-2026'],
    sourceRefs: [sourceSnapshots['event-byob.md']],
  },
  {
    id: 'portal',
    legacyId: 'event-portal',
    title: l('Портал 2030–2050', 'Portal 2030–2050'),
    summary: l(
      'Архитектурная проекция на Гиперкубе в 2024 году и участие в конкурсе медиаарта в 2025 году.',
      'An architectural projection on the Hypercube in 2024 and participation in a media-art contest in 2025.',
    ),
    cases: ['portal-2024', 'portal-2025'],
    sourceRefs: [sourceSnapshots['event-portal.md']],
  },
  {
    id: 'tsiolkovsky',
    legacyId: 'event-tsiolkovsky',
    title: l('Фестиваль Циолковского', 'Tsiolkovsky Festival'),
    summary: l(
      'От конференции и рабочей лаборатории к «Проекту Шрёдингер» и премьере «Интерференции реальностей».',
      'From a conference and working laboratory to Project Schrödinger and the Interference of Realities premiere.',
    ),
    cases: ['tsiolkovsky-2025', 'tsiolkovsky-2026'],
    sourceRefs: [sourceSnapshots['event-tsiolkovsky.md'], sourceSnapshots['event-kod-provincii.md']],
  },
  {
    id: 'gong-fest',
    legacyId: 'event-gong-fest',
    title: l('Гонг Фест', 'Gong Fest'),
    summary: l(
      'Нейровизуальная запись в звуковой практике и лекция «Звук и мозг».',
      'Neurovisual recording within sound practice and the Sound and Brain lecture.',
    ),
    cases: ['gong-fest-2024', 'gong-fest-2025'],
    sourceRefs: [
      sourceSnapshots['event-gong-fest.md'],
      sourceSnapshots['Golem_Event_Gong_2024.md'],
      sourceSnapshots['Golem_Event_Gong_2025.md'],
    ],
  },
];

export const eventOrganizations: Organization[] = [
  ['audi', 'Audi', 'Audi'],
  ['bauman', 'МГТУ им. Баумана', 'Bauman MSTU'],
  ['merck', 'Merck · архивное имя', 'Merck · archival name'],
  ['mipt', 'МФТИ', 'MIPT'],
  ['sberbank', 'Сбербанк', 'Sberbank'],
  ['tavrida', 'Таврида.АРТ', 'Tavrida.ART'],
  ['cci', 'ТПП РФ', 'Russian Chamber of Commerce'],
  ['synergy', 'Корпорация Синергия', 'Synergy Corporation'],
  ['mudro-chay', 'Мудро Чай', 'Mudro Chay'],
  ['mame', 'Международная ассоциация медиа-экспертов', 'International Media Experts Association'],
  [
    'communication-centre',
    'Центр межличностной и межкультурной коммуникации',
    'Interpersonal and Intercultural Communication Centre',
  ],
].map(([id, ru, en]) => ({
  id,
  legacyId: ['synergy', 'mudro-chay', 'mame', 'communication-centre'].includes(id) ? undefined : `org-${id}`,
  name: l(ru, en),
  role: id === 'mipt' || id === 'bauman' ? 'venue' : id === 'mudro-chay' ? 'co-producer' : 'organizer',
  source:
    definitions.find((row) => row.organizations?.includes(id))?.files[0] ?? 'Related event source record',
}));

export const eventMedia: Media[] = [
  {
    id: 'ashram-neuro-art-dance-poster',
    kind: 'image',
    src: '/images/events/mindshow_ashram.webp',
    width: 608,
    height: 1080,
    alt: {
      ru: 'Архивная афиша Neuro Art Dance в контексте практик Ashram',
      en: 'An archival Neuro Art Dance poster in the Ashram practice context',
    },
    representation: 'poster',
    rights: 'cleared',
    caption: {
      ru: 'Neuro Art Dance · афиша встречи 19 января; год не указан.',
      en: 'Neuro Art Dance · poster for a 19 January meeting; year unspecified.',
    },
    source: 'Archive images/content/mindshow_ashram.webp; owner display permission 2026-10-07',
  },
  {
    id: 'event-bauman-lecture',
    kind: 'image',
    src: '/images/events/lectures-moscow2030.webp',
    width: 1920,
    height: 1080,
    alt: {
      ru: 'Архивный кадр лекционной программы «Москва 2030»',
      en: 'An archival image of the Moscow 2030 lecture programme',
    },
    representation: 'photograph',
    rights: 'cleared',
    caption: { ru: 'Лекционная программа «Москва 2030».', en: 'Moscow 2030 lecture programme.' },
    source: 'Archive images/content/lectures-moscow2030.webp; owner display permission 2026-10-07',
  },
  {
    id: 'event-sber-lecture',
    kind: 'image',
    src: '/images/events/lectures-sber.webp',
    width: 1920,
    height: 1080,
    alt: {
      ru: 'Архивный кадр лекционной программы для Сбербанка',
      en: 'An archival image of the Sberbank lecture programme',
    },
    representation: 'photograph',
    rights: 'cleared',
    caption: { ru: 'Лекционная программа для Сбербанка.', en: 'Lecture programme for Sberbank.' },
    source: 'Archive images/content/lectures-sber.webp; owner display permission 2026-10-07',
  },
  {
    id: 'event-tpp-mindshow',
    kind: 'image',
    src: '/images/events/mindshow_tpp.webp',
    width: 1920,
    height: 1080,
    alt: {
      ru: 'MindShow в контексте Russian Digital Creative',
      en: 'MindShow in the Russian Digital Creative context',
    },
    representation: 'photograph',
    rights: 'cleared',
    caption: { ru: 'MindShow · Russian Digital Creative.', en: 'MindShow · Russian Digital Creative.' },
    source: 'Archive images/content/mindshow_tpp.webp; owner display permission 2026-10-07',
  },
];
