import type { CaseEvent, Localized, Organization, Media } from './site';
import { sourceSnapshots } from './editorial';
import { schoolEvents, educationEventRefs } from './additional-programmes';

const l = (ru: string, en: string): Localized => ({ ru, en });
type Definition = Pick<CaseEvent, 'id' | 'title' | 'summary' | 'date' | 'place' | 'role'> &
  Partial<CaseEvent> & { files: string[] };
const definitions: Definition[] = [
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
      'ODA.dream: подготовка и проведение MindShow для студии Ashram.',
      'ODA.dream: preparing and presenting MindShow for Ashram Studio.',
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
      'ODA.dream: художественный протокол, нейровизуальная система и фасилитация. Натали Осман — принимающая сторона.',
      'ODA.dream: artistic protocol, neurovisual system and facilitation. Natali Osman hosted the sessions.',
    ),
    organizations: ['ashram'],
    files: ['event-ashram-tim.md', 'org-ashram.md'],
    media: ['ashram-neuro-art-dance-poster'],
    limitations: [
      l(
        'Сентябрь 2023 обозначает начало сотрудничества; это не дата всех повторных сессий. Число встреч не установлено.',
        'September 2023 marks the start of collaboration, not the date of every session. The number of meetings is unconfirmed.',
      ),
    ],
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
      'ODA.dream: конкурсная заявка с интерактивной инсталляцией на тему «Пограничность».',
      'ODA.dream: a competition submission for an interactive installation on the theme of liminality.',
    ),
    organizations: ['audi'],
    files: ['event-audi-brand-2024.md', 'Golem_Event_Audi_2020.md'],
    limitations: [
      l(
        'Источник Obsidian подтверждает подачу 12 июля 2020, а не коммерческий показ Audi в 2024. Реализация проекта и победа не подтверждены.',
        'The Obsidian source documents submission on 12 July 2020, not a commercial Audi presentation in 2024. Realisation and an award are unconfirmed.',
      ),
    ],
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
    role: l(
      'ODA.dream: приглашённая лекция о брейнхакинге; точная образовательная версия не установлена.',
      'ODA.dream: an invited lecture on brain hacking; the exact programme version is unconfirmed.',
    ),
    organizations: ['bauman', 'moscow2030'],
    media: ['event-bauman-lecture'],
    files: ['event-bauman-moscow2030-2025.md'],
    limitations: [
      l(
        'Это лекция, а не подтверждённый показ игрового концепта Brain Hack. Шаблонное 1 января заменено годом.',
        'This is a lecture, not an established presentation of the Brain Hack game concept. The placeholder 1 January is replaced by the year.',
      ),
    ],
  },
  {
    id: 'byob-2019',
    date: '2019-12-22',
    work: 'mindshow',
    title: l('MindGrid · BYOB 2019', 'MindGrid · BYOB 2019'),
    summary: l(
      'Первый показ ранней линии MindShow на московском проекционном фестивале.',
      'The first presentation of the early MindShow trajectory at Moscow’s projection festival.',
    ),
    place: l('Москва · BYOB', 'Moscow · BYOB'),
    role: l(
      'ODA.dream: живая ЭЭГ-визуализация под историческим именем MindGrid. Екатерина Калашникова — организатор.',
      'ODA.dream: live EEG visualisation under the historical MindGrid name. Ekaterina Kalashnikova organised the event.',
    ),
    files: ['event-byob-2019.md', 'event-byob.md'],
    limitations: [
      l(
        'Предложенный «нейроанализ событий» — художественная рамка интерпретации динамики записи; она не подтверждает измерение эмоций аудитории.',
        'The proposed event neuroanalysis is an artistic framework for interpreting recorded dynamics; it does not establish measurement of the audience’s emotions.',
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
      'ODA.dream: групповая запись и генеративная визуализация. Екатерина Калашникова — организатор.',
      'ODA.dream: group recording and generative visualisation. Ekaterina Kalashnikova organised the event.',
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
      'ODA.dream: приглашённая программа; запись связывает её с MindShow.',
      'ODA.dream: an invited programme, linked to MindShow in the record.',
    ),
    files: ['event-gonchar-private-2024.md'],
    limitations: [
      l(
        'Метаданные называют MindShow, текст — лекцию. Точный состав и день не установлены; карточка не приписывает событию определённую конфигурацию.',
        'Metadata names MindShow while the body names a lecture. The exact scope and day are unconfirmed; this record does not assign a specific configuration.',
      ),
    ],
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
      'ODA.dream: нейровизуальная запись в звуковой практике. Николай Льговский и Центр гонг-медитации — организаторы.',
      'ODA.dream: neurovisual recording within a sound practice. Nikolay Lgovsky and the Gong Meditation Centre organised the festival.',
    ),
    files: ['event-gong-fest-2024.md', 'Golem_Event_Gong_2024.md'],
    limitations: [
      l(
        'Интервал относится к фестивалю; точный день сессии студии не указан. Запись не является медицинской оценкой эффекта медитации.',
        'The interval describes the festival; the exact day of the studio session is not specified. The recording is not a medical assessment of meditation effects.',
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
      'ODA.dream: лекция «Звук и мозг» и перформанс; организатор — Николай Льговский, оборудование предоставил шатёр AUM.',
      'ODA.dream: Sound and Brain lecture and performance; Nikolay Lgovsky organised the festival and the AUM tent provided equipment.',
    ),
    files: ['event-gong-fest-2025.md', 'Golem_Event_Gong_2025.md'],
    limitations: [
      l(
        'Даты обозначают фестивальный интервал, а не подтверждённую продолжительность программы ODA.dream.',
        'The dates describe the festival window, not an established duration for the ODA.dream programme.',
      ),
    ],
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
    role: l(
      'ODA.dream: приглашённые авторы и ведущие лекции.',
      'ODA.dream: invited lecture authors and facilitators.',
    ),
    organizations: ['hse'],
    files: ['event-hse-beautiful-brain-2025.md', 'proof-let-hse-beautiful-brain.md'],
    sourceRefs: [
      sourceSnapshots['event-hse-beautiful-brain-2025.md'],
      sourceSnapshots['proof-let-hse-beautiful-brain.md'],
      ...educationEventRefs.hse,
    ],
    limitations: [
      l(
        'Письмо подтверждает конкретный вклад; постоянная преподавательская должность этим не устанавливается. Дата 25 марта уточнена по первичной событийной карточке и сводке программы; май в старой записи не используется как дата лекции.',
        'The letter supports a specific contribution, not an ongoing teaching appointment. 25 March is established by the primary event card and programme summary; the old record’s May date is not used as the lecture date.',
      ),
    ],
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
      'ODA.dream: нейровизуальная система и протоколы участия; Ксения Голыжбина организовала лабораторию с театром балета.',
      'ODA.dream: neurovisual system and participation protocols; Ksenia Golyzhibina organised the laboratory with the ballet theatre.',
    ),
    organizations: ['ikc', 'itb'],
    files: ['event-itb-lab-2024-11.md', 'event-kod-provincii.md'],
    limitations: [
      l(
        'Закрытая рабочая сессия не обозначается публичной премьерой. Источник сообщает об использовании материалов в фильме, но конкретный монтаж пока не определён.',
        'This internal working session is not described as a public premiere. The source reports use of materials in a film, but the specific edit is not identified.',
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
      'ODA.dream: лекция и два перформанса. Организаторы — Ксения Голыжбина и Елена Панасенко.',
      'ODA.dream: a lecture and two performances. Ksenia Golyzhibina and Elena Panasenko organised the conference.',
    ),
    files: ['event-kod-provincii.md', 'event-tsiolkovsky.md'],
    sourceRefs: [
      sourceSnapshots['event-kod-provincii.md'],
      sourceSnapshots['event-tsiolkovsky.md'],
      ...educationEventRefs.dance,
    ],
    limitations: [
      l(
        'Знакомство с театром балета ИКЦ стало началом последующей постановочной линии. Ссылка на статью в РИНЦ в архиве требует отдельной библиографической проверки.',
        'Meeting the ICC ballet theatre began the later production trajectory. The archive’s reference to an RSCI article requires a separate bibliographic check.',
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
      'ODA.dream: версия Нейромандалы для перформанса, подготовленного вместе с «Мудро Чай».',
      'ODA.dream: a Neuromandala version for a performance prepared with Mudro Chay.',
    ),
    organizations: ['mudro-chay'],
    files: ['event-lamborghini-brand-2024.md', 'Golem_Telegram_Lamborghini.json'],
    source: 'https://t.me/odadream/722',
    limitations: [
      l(
        '14 декабря 2025 — дата сообщения о состоявшемся перформансе, не точная дата показа. Шаблонный год 2024 не подтверждён. Клуб владельцев не выдаётся за заказ от автомобильного производителя.',
        '14 December 2025 is the publication date of a report about the performance, not its exact presentation date. The template year 2024 is unconfirmed. The owners’ club is not represented as a commission from the car manufacturer.',
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
    summary: l(
      'Корпоративный лекционный контекст из реестра студии.',
      'A corporate lecture context from the studio registry.',
    ),
    place: l('Москва · площадка не установлена', 'Moscow · venue unconfirmed'),
    role: l(
      'ODA.dream: лекционная программа, отмеченная коммерческим участием в архиве.',
      'ODA.dream: a lecture programme recorded as a commercial contribution in the archive.',
    ),
    organizations: ['merck'],
    files: ['event-merck-corporate.md', 'org-merck.md'],
    limitations: [
      l(
        'Сохранено архивное имя Merck (в исходнике также «Мерц»); юридическое лицо и точный день не уточнены. Это не свидетельство постоянного партнёрства.',
        'The archival Merck name is retained (the source also says Merts); the legal entity and exact day are unconfirmed. This is not evidence of an ongoing partnership.',
      ),
    ],
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
      'ODA.dream: нейроинтерфейсы, генеративная визуализация и аудиовизуальный перформанс; Екатерина Капица указана куратором приглашения.',
      'ODA.dream: neurointerfaces, generative visuals and audiovisual performance; Ekaterina Kapitsa is identified as the inviting curator.',
    ),
    organizations: ['mipt'],
    media: ['neuromandala-terra'],
    files: [
      'event-mipt-terraforming-2025.md',
      'Golem_Event_Terraforming_2025.md',
      'proof-mipt-letter.md',
      'hub-education.md',
    ],
    limitations: [
      l(
        'Нейромандала — художественное преобразование сигнала. Цвета и ритмы не являются однозначным измерением эмоций; личный массив исходных записей не публикуется.',
        'Neuromandala is an artistic transformation of signal. Colours and rhythms do not uniquely measure emotions; the personal source-recording dataset is not published.',
      ),
    ],
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
      'ODA.dream: нейровизуальная практика в пленэрном контексте.',
      'ODA.dream: neurovisual practice within the plein-air context.',
    ),
    files: ['event-pleinair-bashkiria-2025.md', 'proof-let-bashkiria.md', 'proof-press-tskhr-bashkiria.md'],
    limitations: [
      l(
        'Связанные письмо и публикация обозначены в архиве; их наличие не разрешает цитирование или публикацию сканов автоматически. Точный день не установлен.',
        'The archive identifies a related letter and publication; their existence does not automatically authorise quotation or publication of scans. The exact day is unconfirmed.',
      ),
    ],
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
      'ODA.dream: участие в цифровом пленэре; архив связывает событие с сюжетом НТВ.',
      'ODA.dream: participation in a digital plein-air; the archive links the event to an NTV report.',
    ),
    files: ['event-pleinair-metro-2024.md', 'proof-press-ntv-metro.md'],
  },
  {
    id: 'portal-2024',
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
      'ODA.dream: визуальная система MindShow / Нейромандала для крупной архитектурной проекции.',
      'ODA.dream: a MindShow / Neuromandala visual system for a large architectural projection.',
    ),
    organizations: ['moscow2030'],
    files: ['event-portal-2024.md', 'event-portal.md'],
    limitations: [
      l(
        'Участие восстановлено из содержательной страницы серии, а не из пустой карточки 2024. Этот показ отделён от конкурса 2025.',
        'The participation is reconstructed from the substantive series page, not the empty 2024 card. This presentation is separate from the 2025 competition.',
      ),
    ],
  },
  {
    id: 'sber-2025',
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
    role: l(
      'ODA.dream: приглашённая лекционная программа; точная версия и день уточняются.',
      'ODA.dream: an invited lecture programme; the exact version and day remain unconfirmed.',
    ),
    organizations: ['sberbank'],
    media: ['event-sber-lecture'],
    files: ['event-sber-lecture-2025.md'],
    relatedProgrammes: ['beautiful-brain'],
    sourceRefs: [sourceSnapshots['event-sber-lecture-2025.md'], ...educationEventRefs.sber],
    limitations: [
      l(
        'Архив относит встречу к лекционной линии нейроэстетики; фото показывает конкретную тему БОС и также указывает Рустама Боровика в программе. Это не подтверждает тождество всех лекционных версий. Точный день не установлен. Отдельная заметка о встрече-питче для команды Сбера также не имеет даты: её связь сохранена как контекст программы, без вымышленного второго показа.',
        'The archive associates the encounter with the neuroaesthetics lecture trajectory; the image shows a specific feedback topic and also lists Rustam Borovik in the programme. This does not establish that every lecture version is identical. The exact day is unconfirmed. A separate note about a pitch meeting for the Sber team is also undated: its relationship is retained as programme context without inventing a second presentation.',
      ),
    ],
  },
  {
    id: 'tavrida-ai-2025',
    date: '2025-08-02',
    dateMeaning: 'event-window',
    participationStatus: 'declined',
    context: 'application',
    work: 'cultural-neuro-code',
    title: l(
      'Культурный код России · заявка на фестиваль ИИ',
      'Cultural Code of Russia · AI festival submission',
    ),
    summary: l(
      'Заявка ODA.dream была отклонена; участия в фестивале не было.',
      'ODA.dream’s submission was declined; the studio did not participate in the festival.',
    ),
    place: l('Судак · Таврида.АРТ', 'Sudak · Tavrida.ART'),
    role: l(
      'ODA.dream: подготовка и подача заявки. Статус коммерческого участия в V1 исправлен по источнику Obsidian.',
      'ODA.dream: preparing and submitting an application. The V1 commercial-participation status is corrected using the Obsidian source.',
    ),
    organizations: ['tavrida'],
    files: ['event-tavrida-ai-2025.md', 'Golem_Event_Tavrida_AI_2025.md'],
    limitations: [
      l(
        '2 августа — дата публичной программы фестиваля, не подачи заявки. Благодарности за другие программы Тавриды не доказывают участие в этом фестивале.',
        '2 August is the festival programme date, not the submission date. Appreciation for other Tavrida programmes does not establish participation in this festival.',
      ),
    ],
  },
  {
    id: 'tpp-2025',
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
    role: l(
      'ODA.dream: экспертное приглашение с MindShow.',
      'ODA.dream: an expert invitation with MindShow.',
    ),
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
      'ODA.dream: приглашённые спикеры; организатор — Корпорация Синергия.',
      'ODA.dream: invited speakers; Synergy Corporation organised the conference.',
    ),
    organizations: ['synergy'],
    files: ['event-techweek.md', 'Golem_Event_TechWeek_2024.md'],
    limitations: [
      l(
        'Восстановлено из источника Obsidian и контекста персональных благодарностей. Точное название лекционной версии не установлено.',
        'Reconstructed from the Obsidian source and personal-appreciation context. The exact lecture version is unconfirmed.',
      ),
    ],
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
      'ODA.dream: нейростенд и персональные анимации. В источнике организаторами названы Егор Евланников и Сергей Львов.',
      'ODA.dream: a neuro stand and personal animations. The source names Egor Evlannikov and Sergey Lvov as organisers.',
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
      'ODA.dream: участие в дискуссии блока «Креативные индустрии» выставки-форума.',
      'ODA.dream: participation in the exhibition forum’s Creative Industries discussion.',
    ),
    files: ['unique-russia.md', 'Golem_Event_Unique_Russia_2026.md'],
    limitations: [
      l(
        'Интервал относится ко всей выставке; день панели не установлен. Наличие диплома не обозначает конкурсную награду.',
        'The interval describes the entire exhibition; the panel day is unconfirmed. A participation diploma is not a competition award.',
      ),
    ],
  },
  {
    id: 'ossetia-2025',
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
      'ODA.dream: вклад в организацию и проведение выставки; МАМЭ и Центр межкультурной коммуникации — организаторы.',
      'ODA.dream: a contribution to organising and presenting the exhibition; the Media Experts Association and the Intercultural Communication Centre were the organisers.',
    ),
    organizations: ['mame', 'communication-centre'],
    media: ['neuromandala-cultural-code'],
    files: ['Ossetia_2025_Golem_Source.md', 'cultural-neuro-code.md'],
    limitations: [
      l(
        'Этот вклад не подтверждает завершение всей исследовательской системы «Культурного нейрокода», остающейся прототипом.',
        'This contribution does not establish completion of the entire Cultural Neuro Code research system, which remains a prototype.',
      ),
    ],
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
    description: row.role,
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
      'Архитектурная проекция 2024 и отдельное конкурсное участие 2025. Наградные сведения сохраняют самостоятельную проверку.',
      'The 2024 architectural projection and separate 2025 competition contribution. Award claims retain their own verification.',
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
      ru: 'Афиша Neuro Art Dance: указано 19.01, год выпуска неизвестен. Она не подтверждает дату дня рождения студии Ashram.',
      en: 'Neuro Art Dance poster: 19 January is shown, but the publication year is unknown. It does not establish the Ashram birthday date.',
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
    caption: {
      ru: 'Архивный материал события; автор фотографии не установлен.',
      en: 'Archival event material; the photographer is unconfirmed.',
    },
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
    caption: {
      ru: 'Архивный материал события; автор фотографии не установлен.',
      en: 'Archival event material; the photographer is unconfirmed.',
    },
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
    caption: {
      ru: 'Архивный материал события; автор фотографии не установлен.',
      en: 'Archival event material; the photographer is unconfirmed.',
    },
    source: 'Archive images/content/mindshow_tpp.webp; owner display permission 2026-10-07',
  },
];
