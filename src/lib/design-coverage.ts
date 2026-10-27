/** Auditable catalogue of roles, not a second component implementation. */
export const designCoverage = [
  {
    role: 'Основной контактный адрес',
    components: ['CalloutLink'],
    specimen: '#system-contact-action',
    consumer: '/ru/contact/#contact-channels',
    decision:
      'Существующая роль contact-address применяется к самому CalloutLink: type-statement и Manrope сохраняют иерархию, quiet-link оставляет общий tap-target. Отдельная подчёркивающая линия не добавляется: адрес использует общую CAD-выноску и цвет канала связи. Нового размера или компонента нет.',
  },
  {
    role: 'Постоянная локальная служебная панель',
    components: ['BaseLayout'],
    specimen: '#dev-workspace-specimen',
    consumer: '/design-system/#gallery-study',
    decision:
      'Локальный editorial-client добавляет панель внутрь sticky-шапки: понятные режимы, статус PUBLIC, справка и локальные правки медиа. Нативные details используют общие поверхности и типографику; всплывающие панели ограничены половиной viewport, Escape возвращает фокус. Панели взаимно исключаются с меню и оглавлением; уход фокуса закрывает справку. dev-toolbar-height учитывает один/два ряда в роли header-height и якорях; публикационный пакет панель не содержит.',
  },
  {
    role: 'Общая галерея, микрометаданные и единый фокус',
    components: [
      'GalleryStudy',
      'MediaGallery',
      'MediaMicrocaption',
      'MediaFigure',
      'MediaCropEditor',
      'MediaCropTrigger',
    ],
    specimen: '#system-gallery-study',
    consumer: '/ru/works/mindshow/#work-first-look',
    decision:
      'Общий производственный компонент и его живой образец: тип и описание кадра в figcaption; contextEventId убирает повтор события внутри его страницы, вне неё показывает связь; полный ID и кредит в просмотрщике. Роль media-micro: type-metadata и leading 1.3; интервалы image/label 4, item 12, columns 8/12 через семантические роли. Контейнерная сетка 2/3/4, до 300 px — 1 колонка; обычные телефоны 360/375 px сохраняют плитку. Клик по картинке без постоянного expand; фокус и клавиатура сохраняются. Фото и документы используют один расчёт колонок и промежутков. Редактор читает исходный фокус и применяет один фокус и fit к превью и DEV-галерее, включая соседние вкладки; черновики v2 сохраняются локально по ID, счётчик и экспорт в DEV-шапке показывают ожидающие переноса настройки. PUBLIC не меняется.',
  },
  {
    role: 'Визуальные островки повествования',
    components: ['MediaGallery', 'MediaFigure', 'CaseRow', 'DetailSection'],
    specimen: '#system-06',
    consumer: '/ru/works/mindshow/',
    decision:
      'Компактная естественная плитка сохраняет две колонки на телефоне; подробности доступны в общем просмотрщике. Обложка и материалы разных выборок не повторяются; хронология обратная.',
  },
  {
    role: 'Пояснение технологии и чтения нейромандалы',
    components: ['MacroSection', 'MediaFigure', 'MediaGallery', 'SourceLinks'],
    specimen: '#system-06',
    consumer: '/ru/technology/#visual-language',
    decision:
      'Переиспользуются общие главы, естественные пропорции медиа, галереи и единый просмотрщик. Обложка и медиа глав заданы в Method/EditorialSection, формулы и персональные записи не публикуются; локальных стилевых исключений нет.',
  },
  {
    role: 'Карточка работы с отдельным сайтом проекта',
    components: ['CalloutLink', 'MediaFigure', 'DetailSection', 'RecordStamp'],
    specimen: '#system-04',
    consumer: '/ru/works/interference-of-realities/',
    decision:
      'Повторно используются текстовая внешняя ссылка перед обложкой, основной материал, паспорт и краткий контекст. Work.projectSite передаёт полный рассказ, команду и медиархив отдельному сайту. Новые стили и токены не требуются; содержимое и якоря сокращённой карточки согласованы.',
  },
  {
    role: 'Универсальный просмотрщик медиа',
    components: ['MediaViewer'],
    specimen: '#system-06',
    consumer: '/ru/#recognition',
    decision:
      'Один dialog для изображений и видео: fit без прокрутки, подпись по центру, единая текстовая baseline управления через control-type/control-leading, счётчик между стрелками без рамок в нижней полосе, закрытие сверху справа на подложке, 1:1 и локальные pinch/pan. Геометрия содержимого рассчитывается по размеру оригинала, оформление — общие lightbox-токены. Все точки входа используют data-lightbox. Ссылка описания появляется только при дополнительном контексте: событие кадра или якорь признания, без автоматического перехода на открытую страницу.',
  },
  {
    role: 'Компактная стена документов признания',
    components: ['RecognitionWall', 'RecognitionCaption'],
    specimen: '#system-10',
    consumer: '/ru/#recognition',
    decision:
      'PUBLIC и DEV используют тот же живой компонент: отдельные страницы документов группируются по кредиту, не дублируют счётчик, показываются отдельными миниатюрами и открывают общий просмотрщик. Стена листает все сканы; карточка архива листает страницы только своего кредита. Стена адаптирует число обложек к полным рядам, максимум recognition-wall-max-rows; главная показывает одну обложку набора и исключает записи без сканов; полные наборы и общая статистика доступны в архиве.',
  },
  {
    role: 'Нативный select с общим шевроном',
    components: ['SelectControl'],
    specimen: '#system-17',
    consumer: '/ru/cases/',
    decision:
      'Общая оболочка существующего select: TechnicalMark down, резерв справа, типографика control-type. Те же поля на стенде и в редакторе; нативное управление и доступные label сохраняются.',
  },
  {
    role: 'Назначение ссылки',
    components: ['CalloutLink'],
    specimen: '#system-04',
    consumer: '/ru/works/',
    decision:
      'Утверждённая выноска 45° с TechnicalMark linkPlain/linkCircle/linkBar. Кружок — внешний origin, черта — download. Острие открытое, прежний размер. Цвет текста и выноски только на hover/focus: целевое семейство / SIGNAL / ALERT. Круг и черта увеличены на 50% внутри общего конверта 24×24; сравнение палитры — /link-test/#link-palette. Окончание ограничено шириной контейнера; длинное слово переносится внутри узкого паспорта (/en/cases/oktava-2021/). Включено для общих ссылок и названий карточек; DEV сохраняет историческое сравнение.',
  },
  {
    role: 'Ориентация и действия',
    components: ['PageCode', 'TechnicalMark', 'CalloutLink', 'ReadingNavigation', 'PageOutline'],
    specimen: '#system-outline-active',
    consumer: '/ru/education/#education-conditions',
    decision:
      'Использовать общий baseline кода и подписи; текущий раздел — в крошках, другие переходы — в верхнем ряду. Значок родительского раздела — ссылка с доступным названием и tap-target; текущая подробная страница — текст aria-current без повторного значка. Активная глава получает одну линию под всей группой знак/номер/текст через link-rule-width и link-offset, без отдельных текстовых подчёркиваний. Линия привязана к baseline, на уровне обычного подчёркивания. Явный образец использует производственный PageOutline рядом с обычной ссылкой.',
  },
  {
    role: 'Композиция страницы',
    components: ['MacroSection', 'DetailSection', 'SectionRail', 'PageView'],
    specimen: '#system-12',
    consumer: '/ru/works/',
    decision:
      'Пять функций макроблока, три режима поля. PageView только собирает их из данных; отдельного визуального языка страницы нет.',
  },
  {
    role: 'Каталог и хронология',
    components: ['WorkCard', 'ProgrammeCard', 'RecognitionCard'],
    specimen: '#system-05',
    consumer: '/ru/cases/',
    decision: 'Сохранить разные сущности, объединить их ритм через card/record-токены.',
  },
  {
    role: 'Архив событий',
    components: ['CaseRow', 'CaseArchive'],
    specimen: '#system-07',
    consumer: '/ru/cases/',
    decision:
      'CaseArchive использует существующие select, metadata и summary-роли; CaseRow имеет один переход на событие. Галерея и комментарии остаются на странице события. Новый визуальный токен не нужен.',
  },
  {
    role: 'Участие и процесс',
    components: ['ParticipationPanel', 'ProcessSteps', 'CollectiveFeedback'],
    specimen: '#system-14',
    consumer: '/ru/education/',
    decision:
      'Панель участия — композиция рассказа, списка и паспорта. На странице работы embedded-режим опускает повторный рассказ и сохраняет участие, результат и условия; контекстная проверка /ru/works/mindshow/#work-availability. Заголовок новой группы отделён от связанных абзацев общим gap-copy.',
  },
  {
    role: 'Паспорта и происхождение',
    components: ['RecordStamp', 'StatisticsStamp', 'MindDBStamp', 'EvidenceNote'],
    specimen: '#system-11',
    consumer: '/ru/recognition/',
    decision:
      'Один паспорт, варианты document/reference. Доказательство выделяется поверхностью и текстом, без декоративной полосы.',
  },
  {
    role: 'Рассказ, источники и раскрытия',
    components: ['EditorialSections', 'ReadingNote', 'SourceLinks', 'DisclosureHeading'],
    specimen: '#system-17',
    consumer: '/ru/studio/',
    decision:
      'Добавлены недостающие живые источники и общий заголовок раскрытия. Это существующие текстовые роли, отдельные шрифтовые токены не нужны.',
  },
  {
    role: 'Медиа и документы',
    components: ['MediaFigure', 'MediaGallery', 'MediaRegister', 'VideoPreview', 'DocumentList'],
    specimen: '#system-15',
    consumer: '/ru/works/',
    decision:
      'Один регистр, компактное вспомогательное превью с резервированием исходных пропорций до загрузки, полный материал в просмотрщике. Колонки tiles и последовательность sequence остаются разными режимами. Lightbox использует control-surface/hover для закрытия сверху справа, control-icon-size и две нижние полосы подписи/управления; стрелки без рамок, счётчик между ними. Горизонтальный touch-свайп в fit использует lightbox-swipe-* роли; pinch/pan и отменённый жест не листают. Проверка на белом скане — /ru/#recognition; правовая производная копия и DocumentList — /ru/studio/#legal.',
  },
  {
    role: 'Согласие и старый адрес',
    components: ['AnalyticsConsent', 'LegacyNotice'],
    specimen: '#system-06',
    consumer: '/404.html',
    decision:
      'Согласие показано безопасным specimen без сохранения выбора. Возврат фокуса с preventScroll проверяется на /ru/works/mindshow/?analytics_debug=1. LegacyNotice проверяется на отдельном адресе: его таймер не должен перенаправлять стенд.',
  },
  {
    role: 'Редакционная среда и кадрирование',
    components: ['DevNote', 'DevPublicationMark', 'MediaCropEditor', 'MediaCropTrigger'],
    specimen: '#dev-workspace-specimen',
    consumer: '/editorial/?lang=ru',
    decision:
      'Служебные компоненты используют те же поверхности, поля и раскрытия. Реальный редактор кадра открывается у медиа стенда; отдельная копия диалога не нужна.',
  },
] as const;

/** Native HTML patterns also belong to the contract, even without an Astro wrapper. */
export const designPatterns = [
  [
    'Текст и заголовки',
    'h1–h4, p, .copy-summary, .small-note',
    '--type-*, --leading-*, --copy-measure',
    '#system-02',
  ],
  ['Смысловой список', '.facts', '--gap-copy, --s3, --mark-size', '#system-03'],
  [
    'Хронология и биографии',
    '.timeline, .list-row, .studio-people-layout',
    '--record-*, --gap-component, --portrait-measure',
    '/ru/studio/',
  ],
  ['Цитата', 'blockquote.quote', '--type-statement, --copy-measure', '#system-06'],
  ['Раскрытие', 'details > summary', '--disclosure-*, --tap-target', '#system-17'],
  ['Поле ввода', 'input, select, textarea', '--control-*, --tap-target, --focus-*', '#system-17'],
  [
    'Кнопка и состояние',
    '.button, :disabled, :focus-visible, .status',
    '--tap-target, --focus-*, --signal-*',
    '#system-04',
  ],
  ['Просмотрщик и ошибки загрузки', 'dialog.lightbox', '--lightbox-*, --control-icon-size', '#system-06'],
  ['Полноширинный hero', '.nm-hero, .nm-heading, .nm-data-panel', '--hero-*, --page-inset', '/ru/'],
  ['Шапка и футер', '.site-header, .site-footer', '--header-*, --nav-label-gap, --gap-*', '#page-top'],
] as const;
