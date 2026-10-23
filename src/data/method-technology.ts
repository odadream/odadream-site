import type { EditorialSection } from './editorial';
const l = (ru: string, en: string) => ({ ru, en });

/** Public reading guide: visual principles only; excludes implementation and patent claims. */
export const methodTechnologySections: EditorialSection[] = [
  {
    id: 'method-overview',
    title: l('Электрическая активность становится рисунком', 'Electrical activity becomes a drawing'),
    body: l(
      'Нейромандала — круговая запись изменения ритмов головного мозга во времени. Нейроинтерфейс регистрирует ЭЭГ с поверхности головы, а система переводит параметры сигнала в движущиеся линии. Так возникает изображение, которое можно наблюдать в процессе или сохранить как цифровой артефакт. В разных работах рисунок становится проекцией, светом или частью звуковой среды. MultiSync позволяет использовать несколько ЭЭГ-потоков одновременно; индивидуальная мандала и общая композиция группы — разные формы представления.',
      'Neuromandala is a circular record of changes in brain rhythms over time. An EEG interface records electrical activity at the scalp, and the system maps signal parameters to moving lines. The resulting image can be watched as it develops or saved as a digital artefact. Different works use it as a projection, light or part of a sound environment. MultiSync supports several EEG streams simultaneously; an individual mandala and a shared group composition are distinct representations.',
    ),
  },
  {
    id: 'signal-and-power',
    title: l('Четыре ритма и их мощность', 'Four rhythms and their power'),
    body: l(
      'ЭЭГ содержит колебания разных частот. В показанных версиях мандалы выделены четыре диапазона: тета, альфа, бета и гамма — от более медленных к более быстрым. Они присутствуют одновременно.\n\nДля каждого диапазона оценивается мощность: насколько выражен его вклад в записанный сигнал за некоторый интервал времени. Мощность ритма и частота колебаний — разные величины: большая мощность не означает более быстрый ритм. На линейном графике ниже видно, как вклад каждого диапазона меняется во времени.',
      'EEG contains oscillations at different frequencies. The versions shown use four bands: theta, alpha, beta and gamma, ordered from slower to faster. They coexist.\n\nPower is estimated for each band: how strongly it contributes to the recorded signal over a time interval. Rhythm power and oscillation frequency are different quantities: higher power does not mean a faster rhythm. The linear plot below shows how the contribution of each band changes over time.',
    ),
    media: ['method-power-timeline'],
  },
  {
    id: 'visual-language',
    title: l('Как читать нейромандалу', 'How to read a Neuromandala'),
    body: l(
      'Начните с цвета линии: в архивных примерах тета обозначена пурпурным, альфа — бирюзовым, бета — зелёным, гамма — жёлтым.\n\nДвижение по окружности показывает ход времени; полный оборот соответствует интервалу, выбранному для этой версии.\n\nРасстояние от центра показывает мощность ритма по шкале изображения. В относительном режиме это доля среди отображаемых диапазонов: рост одной доли может уменьшить остальные, даже если их абсолютная мощность не снизилась.\n\nПо контуру видны подъёмы, спады и повторения. Толщина, яркость и след линии добавляют динамику изображения, но сами по себе не служат шкалой эмоций. На чертеже и в разных версиях палитра может отличаться — ориентируйтесь на подписи ритмов и шкалу.',
      'Start with line colour: in the archival examples, theta is magenta, alpha turquoise, beta green and gamma yellow.\n\nMovement around the circle represents time; one revolution covers an interval selected for that version.\n\nDistance from the centre represents rhythm power on the image’s scale. In relative mode, this is a share of the displayed bands: an increasing share can reduce the others even when their absolute power has not fallen.\n\nThe contour reveals rises, falls and repetitions. Line width, brightness and trails add visual dynamics but are not emotion scales. Drawings and different versions may use different palettes: follow the rhythm labels and scale.',
    ),
    media: ['method-power-polar', 'neuromandala-frequencies'],
    links: [
      {
        id: 'dzen-neuromandala-reading',
        kind: 'article',
        title: l('Всё о Нейромандале · ODA.dream', 'All about Neuromandala · ODA.dream'),
        href: 'https://dzen.ru/a/Z47CgD1reSEUc43b',
      },
    ],
  },
  {
    id: 'archive-examples',
    title: l('Разные рисунки одного визуального языка', 'Different drawings in one visual language'),
    body: l(
      'Три кадра из архива MindDB показывают разные соотношения и контуры линий. Сравните, какая линия проходит дальше от центра, где она приближается к другим и как меняется форма вдоль окружности. Это примеры изображения, а не шкала «лучше — хуже» и не сравнение людей: для сопоставления измерений нужны одинаковые условия и настройки. Кадры представлены без персональных данных, исходных записей ЭЭГ и интерпретаций состояния участников.',
      'Three frames from the MindDB archive show different line relationships and contours. Compare which line sits farther from the centre, where lines converge and how the shape changes around the circle. These are visual examples, not a better–worse scale or a comparison of people: comparing measurements requires matching conditions and settings. The frames are presented without personal identifiers, raw EEG recordings or interpretations of participants’ states.',
    ),
    media: ['method-minddb-1', 'method-minddb-2', 'method-minddb-3'],
  },
  {
    id: 'encounter',
    title: l('Наблюдать отклик', 'Observing the response'),
    body: l(
      'Участник наблюдает, как рисунок меняется рядом с его собственным опытом: вниманием, дыханием, движением или закрыванием глаз. Совпадение изменения линии с ощущением — повод для наблюдения, а не доказательство причины. На сигнал влияют контакт датчиков, движения глаз и мышц. Поэтому отдельный всплеск или цвет нельзя прочитать как конкретную мысль, эмоцию или диагноз. В художественной ситуации ценен сам диалог с отзывчивой средой; участие без датчика и роль зрителя определяются форматом работы.',
      'The participant observes how the drawing changes alongside their experience: attention, breathing, movement or closing their eyes. A line changing alongside a sensation invites observation; it does not establish a cause. Sensor contact, eye movements and muscles affect the signal. A single spike or colour therefore cannot be read as a particular thought, emotion or diagnosis. In the artwork, the dialogue with a responsive environment matters; participation without a sensor and the audience role depend on the format.',
    ),
  },
  {
    id: 'invention-application',
    title: l('Технология и заявка на изобретение', 'Technology and invention application'),
    body: l(
      'Заявка на изобретение №2026113457/14(030103) подана 30 апреля 2026 года. Уведомление ФИПС от 15 июня 2026 года подтверждает проведение экспертизы по существу; патент не выдан. На странице показаны отдельные иллюстрации из материалов заявки, поясняющие чтение изображения.',
      'Invention application No. 2026113457/14(030103) was filed on 30 April 2026. A FIPS notice dated 15 June 2026 confirms substantive examination; no patent has been granted. This page uses selected illustrations from the application materials to explain how to read the image.',
    ),
  },
];

export const methodTechnologySources = {
  'Method_Obsidian_Introduction_2026-10-23.md': {
    file: 'Method_Obsidian_Introduction_2026-10-23.md',
    sha256: 'a2957f19e581a386f06f7e4526accb8078842f25c2b50b059f5ab62955274d00',
    snapshot: '2026-10-23',
  },
  'Method_Obsidian_Description_2026-10-23.md': {
    file: 'Method_Obsidian_Description_2026-10-23.md',
    sha256: '2359eed29b109d51f47371302a221999fe8155ff9841787b6cc9354303300702',
    snapshot: '2026-10-23',
  },
  'Method_Dzen_Reading_2026-10-23.md': {
    file: 'Method_Dzen_Reading_2026-10-23.md',
    sha256: '545cc516ab62abc135df9546830f28afc5ac3624cd6fa206dbae1bf97d4334d1',
    snapshot: '2026-10-23',
  },
  'Method_Patent_Figures_2026-10-23.md': {
    file: 'Method_Patent_Figures_2026-10-23.md',
    sha256: '539e2d987c97794104049146ceb3bf13649071278abafc689f4de1d93a1814b9',
    snapshot: '2026-10-23',
  },
  'Method_MindDB_Selection_2026-10-23.json': {
    file: 'Method_MindDB_Selection_2026-10-23.json',
    sha256: '6ce3d46d95e835efef28f5808b768a8538c1097cc5b54c4edc5d51669920fb68',
    snapshot: '2026-10-23',
  },
};
