
import { LocalizedString } from "./types";

// Helper to enforce type safety during definition
const txt = (en: string, ru: string): LocalizedString => ({ en, ru });

// --- ROOT ---
export const index_md = txt(
`**Interface for the Digital Subconscious**

We are a creative duo exploring the boundaries between biological wetware and silicon logic.

## The Methodology:
Our work is structured like a *Blossoming Lotus*. You are currently at the center. 
Surrounding you are eight pathways into our universe. Some lead to static objects, others to fluid experiences.

> "The screen is not a window, but a mirror of the nervous system."

Navigate by selecting the grid nodes on the right. 
The journey is non-linear.`,

`## ODA.DREAM
**Интерфейс Цифрового Подсознания**

Мы — творческий дуэт, исследующий границы между биологической "wetware" и кремниевой логикой.

**Методология**:
Наши работы структурированы по принципу *Цветущего Лотоса*. Сейчас вы находитесь в центре. 
Вокруг вас — восемь путей в нашу вселенную. Одни ведут к статичным объектам, другие — к текучим переживаниям.

> "Экран — это не окно, а зеркало нервной системы."

Навигация осуществляется через сетку [[navigator]]. 
Путешествие нелинейно.
`
);

// --- DEBUG / TEST BENCH ---
export const debug_root_md = txt(
`## DEBUG STATION
**Visual Classification System**

This node tests the iconography and behavior of the Lotus Grid cells.
Neighbors include:
1. Nested Hub (Folder)
2. Pure Article (Text)
3. Video Node
4. Audio Node
5. Image Node
6. External Action
`,
`## ОТЛАДОЧНАЯ СТАНЦИЯ
**Система Визуальной Классификации**

Этот узел тестирует иконографику и поведение ячеек сетки Лотоса.
Соседи включают:
1. Вложенный Хаб (Папка)
2. Чистая Статья (Текст)
3. Видео Узел
4. Аудио Узел
5. Изображение
6. Внешнее Действие
`
);

export const debug_hub_md = txt(
`## NESTED HUB
**Deep Structure**

You have navigated into a sub-category.
Notice the icon change to 'Layers'.`,
`## ВЛОЖЕННЫЙ ХАБ
**Глубокая Структура**

Вы перешли в подкатегорию.
Обратите внимание на иконку 'Layers'.
`
);

// EXPANDED KITCHEN SINK FOR TESTING STYLES
export const debug_article_md = txt(
`## STYLE GUIDE
**Typography & Elements Test**

This is a comprehensive test of all supported Markdown styles to ensure visual consistency.

### 1. Typography
Regular text should be readable with good contrast. **Bold text** should be white and heavy. *Italic text* should be serif and dim. ***Bold Italic*** creates a strong emphasis.

### 2. Lists & Alignment
Testing hanging indents for long lines:

*   **Unordered Item 1**: Short item.
*   **Unordered Item 2**: This is a very long list item designed to test the hanging indent behavior. If the CSS is correct, the second line of text should align with the start of the first line, not with the bullet point. It should look clean and professional.
*   **Unordered Item 3**: Another short item.

Numbered lists with improved spacing:

1.  **Step One**: Initial phase.
2.  **Step Two**: Intermediate phase with more detailed instructions that might wrap to a second line to ensure the numbers are aligned correctly outside the content box.
3.  **Step Three**: Final execution.

### 3. Media Integration
We support inline media via custom syntax. Below are examples of how they render without ugly URLs.

*   **Video**: ![[https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4]]
*   **Audio**: ![[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3]]
*   **Image**: ![[https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800]]
*   **Custom Label**: ![[https://images.unsplash.com/photo-1550684848-fac1c5b4e853|My Custom Image]]

### 4. Quotes & Code
> "The medium is the message." 
> — Marshall McLuhan

Inline \`code\` should look like technical artifacts.

### 5. Interactivity
Internal link to [[home]].
External link to [Google](https://google.com).
`,
`## ГАЙД ПО СТИЛЯМ
**Тест Типографики и Элементов**

Это комплексный тест всех поддерживаемых стилей Markdown для проверки визуальной целостности.

### 1. Типографика
Обычный текст должен быть читаемым. **Жирный текст** — белый. *Курсив* — с засечками и приглушенный. ***Жирный курсив*** для особого акцента.

### 2. Списки и Выравнивание
Тест висячих отступов для длинных строк (Hanging Indent):

*   **Элемент 1**: Короткий пункт.
*   **Элемент 2**: Это очень длинный пункт списка, созданный специально для проверки поведения висячего отступа. Если CSS настроен правильно, вторая строка текста должна выравниваться по началу первой строки, а не под маркером списка. Это важно для аккуратного вида.
*   **Элемент 3**: Еще один пункт.

Нумерованные списки с улучшенным отступом:

1.  **Шаг Первый**: Начальная фаза.
2.  **Шаг Второй**: Промежуточная фаза с более подробными инструкциями, которые могут переноситься на вторую строку, чтобы убедиться, что цифры выровнены корректно снаружи текстового блока.
3.  **Шаг Третий**: Финальное исполнение.

### 3. Медиа Интеграция
Мы поддерживаем инлайн-медиа. Ниже примеры того, как они рендерятся (URL должен быть скрыт):

*   **Видео**: ![[https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4]]
*   **Аудио**: ![[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3]]
*   **Изображение**: ![[https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800]]
*   **Кастомное название**: ![[https://images.unsplash.com/photo-1550684848-fac1c5b4e853|Моя Картинка]]

### 4. Цитаты и Код
> "Средство коммуникации есть сообщение." 
> — Маршалл Маклюэн

Инлайн \`код\` должен выглядеть как технический артефакт.

### 5. Интерактивность
Внутренняя ссылка на [[home]].
Внешняя ссылка на [Google](https://google.com).
`
);

// --- NEUROMANDALA ---
export const neuromandala_md = txt(
`## NEUROMANDALA
**The Art of Brainwaves**

Our signature research project transforming EEG data into real-time generative art.

### Concept
The Neuromandala project bridges the gap between subjective experience (qualia) and objective data (quantifiable brainwaves). By utilizing 14-channel EEG headsets, we capture the raw electrical activity of the cortex and map it to generative visual algorithms.

![[/images/content/neuromandala-cover.jpg]]

### The Feedback Loop
1. **Input**: Participant wears an EEG headset.
2. **Process**: Alpha, Beta, and Theta waves drive the geometry.
3. **Output**: A digital mandala forms in real-time.
4. **Loop**: The participant sees their own mind, altering their state, changing the image.

**Result**: A digital fingerprint of a fleeting mental state.`,

`## НЕЙРОМАНДАЛА
**Искусство Мозговых Волн**

Наш ключевой исследовательский проект, трансформирующий ЭЭГ-данные в генеративное искусство реального времени.

### Концепция
Нейромандала — это мост между субъективным опытом (квалиа) и объективными данными (измеримые ритмы мозга). Используя 14-канальные ЭЭГ-гарнитуры, мы захватываем сырую электрическую активность коры и переводим её на язык визуальных алгоритмов.

![[/images/content/neuromandala-cover.jpg]]

### Петля Обратной Связи
1. **Вход**: Участник надевает нейроинтерфейс.
2. **Процесс**: Альфа, Бета и Тета ритмы управляют геометрией.
3. **Выход**: Цифровая мандала формируется здесь и сейчас.
4. **Цикл**: Участник видит работу своего ума, что меняет его состояние и, следовательно, изображение.

**Итог**: Цифровой отпечаток ускользающего ментального состояния.
`
);

// --- WORKS ---
export const works_index_md = txt(
`## WORKS
**Archive of Artifacts & Experiences**

Our portfolio spans from physical installations to purely digital realms. We categorize our output by the mode of interaction.

- **Games**: Active participation.
- **Lectures**: Knowledge transfer.
- **Research**: The "Why" behind the "How".
- **Objects**: Crystallized moments.`,

`## РАБОТЫ
**Архив Артефактов и Опытов**

Наше портфолио простирается от физических инсталляций до чисто цифровых миров. Мы категоризируем работы по типу взаимодействия.

- **Игры**: Активное участие.
- **Лекции**: Передача знаний.
- **Исследования**: "Почему" стоящее за "Как".
- **Объекты**: Кристаллизованные моменты.
`
);

// Works -> Games
export const games_neurobattle_md = txt(
`## NEUROBATTLE
**Competitive Calmness**

A BCI (Brain-Computer Interface) experience where two participants compete not by force, but by silence.

**Mechanics**:
Two players sit opposite each other. A digital object floats between them. The player who achieves a higher ratio of Alpha waves (relaxation) pushes the object toward the opponent. 

*To win, you must surrender control.*

![[/images/content/neuromandala-cover.jpg]]`, // Placeholder for video link if real one existed

`## НЕЙРОБИТВА
**Соревновательное Спокойствие**

BCI (Нейрокомпьютерный интерфейс), где два участника соревнуются не силой, а тишиной.

**Механика**:
Два игрока сидят друг напротив друга. Между ними парит цифровой объект. Игрок, достигший более высокого коэффициента Альфа-волн (расслабления), толкает объект в сторону противника.

*Чтобы победить, нужно отпустить контроль.*

![[/images/content/neuromandala-cover.jpg]]
`
);

export const games_brain_hack_md = txt(
`## BRAIN HACK
**Perception Vulnerabilities**

An interactive puzzle series designed to demonstrate the limits of the visual cortex. Using optical illusions and latency tricks, we show how easily reality is constructed and deconstructed by the brain.`,
`## ВЗЛОМ МОЗГА
**Уязвимости Восприятия**

Серия интерактивных головоломок, демонстрирующая пределы зрительной коры. Используя оптические иллюзии и задержки восприятия, мы показываем, как легко мозг конструирует и деконструирует реальность.
`
);

export const games_journey_md = txt(
`## JOURNEY TO YOURSELF
**VR Guided Visualization**

A meditative VR experience. Unlike traditional VR which overwhelms the senses, this environment is deprived of stimuli, populating only when the user's breathing rhythm stabilizes.`,
`## ПУТЕШЕСТВИЕ К СЕБЕ
**VR Визуализация**

Медитативный VR опыт. В отличие от традиционного VR, перегружающего чувства, эта среда лишена стимулов и наполняется жизнью только тогда, когда дыхательный ритм пользователя стабилизируется.
`
);

// Works -> Lectures
export const lectures_art_brain_md = txt(
`## ART OF THE BRAIN
**Neuroaesthetics Explained**

Why do we find symmetry beautiful? Why does the Golden Ratio appear in nature?
This lecture explores the evolutionary biology behind aesthetic judgment.

![[/images/content/art-brain.jpg]]`,
`## ИСКУССТВО МОЗГА
**Нейроэстетика**

Почему мы считаем симметрию красивой? Почему Золотое Сечение пронизывает природу?
Эта лекция исследует эволюционную биологию, стоящую за эстетическим суждением.

![[/images/content/art-brain.jpg]]
`
);

export const lectures_sound_brain_md = txt(
`## SOUND & SYNC
**Auditory Entrainment**

The impact of binaural beats and isochronic tones on neural synchronization. We demonstrate live how sound frequencies can shift the collective state of an audience.

Sample Audio:
![[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3]]`,
`## ЗВУК И СИНХРОНИЗАЦИЯ
**Аудио-вовлечение**

Влияние бинауральных ритмов и изохронных тонов на нейронную синхронизацию. Мы демонстрируем в прямом эфире, как звуковые частоты могут смещать коллективное состояние аудитории.

Пример аудио:
![[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3]]
`
);

export const lectures_taste_brain_md = txt(
`## TASTE & BRAIN
**Gastronomic Synesthesia**

An experimental dinner where taste is modulated by color and sound.`,
`## ВКУС И МОЗГ
**Гастрономическая Синестезия**

Экспериментальный ужин, где восприятие вкуса модулируется цветом освещения и звуковым сопровождением.
`
);

export const lectures_color_brain_md = txt(
`## COLOR & BRAIN
**The Visual Spectrum**

How wavelengths affect hormonal production and emotional regulation.`,
`## ЦВЕТ И МОЗГ
**Визуальный Спектр**

Как длина световой волны влияет на выработку гормонов и эмоциональную регуляцию.
`
);

export const lectures_empathy_md = txt(
`## EMPATHY PROTOCOL
**Hyperscanning Research**

Can we mathematically prove empathy? Using dual-EEG setups, we measure "neural coupling" between people during conversation versus silence.`,
`## ПРОТОКОЛ ЭМПАТИИ
**Гиперсканирование**

Можем ли мы математически доказать эмпатию? Используя двойные ЭЭГ-установки, мы измеряем "нейронное сцепление" (neural coupling) между людьми во время разговора и в тишине.
`
);

export const lectures_neuroaesthetics_md = txt(
`## NEUROAESTHETICS
**The Science of Beauty**

A deep dive into Semir Zeki's laws of visual brain and how contemporary digital art exploits these neural pathways.`,
`## НЕЙРОЭСТЕТИКА
**Наука о Красоте**

Глубокое погружение в законы зрительного мозга Семира Зеки и то, как современное цифровое искусство эксплуатирует эти нейронные пути.
`
);

// Works -> Workshops
export const workshops_dance_md = txt(
`## NEURO DANCE
**Motion from Stillness**

A performance where the music is generated not by instruments, but by the dancers' focus levels. If they lose concentration, the music stops.`,
`## НЕЙРО ТАНЕЦ
**Движение из Тишины**

Перформанс, где музыка генерируется не инструментами, а уровнем концентрации танцоров. Если они теряют фокус, музыка останавливается.
`
);

export const workshops_neurosync_md = txt(
`## NEUROSYNC
**Collective Consciousness**

A group meditation experience facilitated by biometric feedback. 20 participants, one visualized heartbeat.`,
`## НЕЙРОСИНК
**Коллективное Сознание**

Групповая медитация с биометрической обратной связью. 20 участников, одно визуализированное сердцебиение на всех.
`
);

export const workshops_gong_md = txt(
`## GONG THEATER
**Resonance**

A sound healing session visualized in real-time on a 360-degree dome.`,
`## ГОНГ ТЕАТР
**Резонанс**

Сессия звуковой терапии, визуализированная в реальном времени на куполе 360 градусов.
`
);

export const workshops_coaching_md = txt(
`## NEURO COACHING
**High Performance States**

Training executives to access "Flow State" on command using biofeedback protocols.`,
`## НЕЙРО КОУЧИНГ
**Состояния Высокой Эффективности**

Тренинг для руководителей по доступу к "Состоянию Потока" по команде, используя протоколы биологической обратной связи.
`
);

export const workshops_mindshow_md = txt(
`## MINDSHOW
**Improvisation**

An interactive performance where the lighting of the stage is controlled by the actor's emotional valence.`,
`## МАЙНД-ШОУ
**Импровизация**

Интерактивный спектакль, где освещение сцены управляется эмоциональной валентностью актера в реальном времени.
`
);

// Works -> Research
export const research_heritage_md = txt(
`## CULTURAL HERITAGE
**Preserving the Intangible**

Mapping the neural patterns of traditional craftspeople to preserve not just the object, but the state of mind required to create it.`,
`## КУЛЬТУРНОЕ НАСЛЕДИЕ
**Сохранение Нематериального**

Картирование нейронных паттернов традиционных ремесленников для сохранения не просто объекта, а состояния ума, необходимого для его создания.
`
);

export const research_schrodinger_md = txt(
`## PROJECT SCHRODINGER
**Quantum Cognition**

An art installation exploring the observer effect. The artwork changes only when you *look away*.`,
`## ПРОЕКТ ШРЁДИНГЕР
**Квантовое Познание**

Арт-инсталляция, исследующая эффект наблюдателя. Произведение искусства меняется только тогда, когда вы *отводите взгляд*.
`
);

export const research_sync_circle_md = txt(
`## SYNC CIRCLE
**Social Dynamics**

Visualizing non-verbal communication in group settings.`,
`## КРУГ СИНХРОНИЗАЦИИ
**Социальная Динамика**

Визуализация невербальной коммуникации в групповых настройках.
`
);

export const research_dashran_md = txt(
`## DASHRAN
**The Anatomy of Epiphany**

Studying the Gamma bursts associated with "Aha!" moments.`,
`## ДАШРАН
**Анатомия Озарения**

Изучение гамма-всплесков, ассоциируемых с моментами "Эврика!".
`
);

export const research_posustoronniy_md = txt(
`## POSUSTORONNIY
**Altered States**

A safe exploration of non-ordinary states of consciousness through sensory deprivation and flickering light stimulation.`,
`## ПОТУСТОРОННИЙ
**Измененные Состояния**

Безопасное исследование необычных состояний сознания через сенсорную депривацию и стимуляцию мерцающим светом.
`
);

// Works -> Objects
export const objects_mom_baby_md = txt(
`## MOM AND BABY
**The First Bond**

Visualizing the neural synchronization between a mother and child during breastfeeding.`,
`## МАМА И МАЛЫШ
**Первая Связь**

Визуализация нейронной синхронизации между матерью и ребенком во время грудного вскармливания.
`
);

export const objects_jewellery_md = txt(
`## DATA ARTIFACTS
**Wearable Code**

Your brainwave pattern, recorded during a moment of intense emotion, 3D printed in silver. A memory you can touch.

![[/images/content/jewellery.jpg]]`,
`## АРТЕФАКТЫ ДАННЫХ
**Носимый Код**

Ваш паттерн мозговых волн, записанный в момент сильной эмоции и напечатанный на 3D-принтере в серебре. Память, к которой можно прикоснуться.

![[/images/content/jewellery.jpg]]
`
);

export const objects_emomandala_md = txt(
`## EMOMANDALA
**Crystallized Emotions**

Generative sculptures derived from aggregate emotional data of city districts.`,
`## ЭМОМАНДАЛА
**Кристаллизованные Эмоции**

Генеративные скульптуры, полученные из агрегированных эмоциональных данных городских районов.
`
);

// --- EVENTS ---
export const events_index_md = txt(
`## EVENTS
**Space & Time**

Where the digital manifests in the physical.
Upcoming exhibitions, past performances, and future gatherings.

Check our latest visual essay:
![[https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4]]`,
`## СОБЫТИЯ
**Пространство и Время**

Где цифровое проявляется в физическом.
Предстоящие выставки, прошедшие перформансы и будущие собрания.

Посмотрите наше последнее визуальное эссе:
![[https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4]]
`
);

export const events_chastoti_md = txt(
`## CHASTOTI
**Frequencies Festival**

An annual gathering of sound artists and neuroscientists in the mountains.`,
`## ЧАСТОТЫ
**Фестиваль Звука**

Ежегодный сбор звуковых художников и нейроученых в горах.
`
);

export const events_terraforming_md = txt(
`## TERRAFORMING
**Digital Ecology**

A projection mapping installation turning urban concrete into living, breathing biological textures.`,
`## ТЕРРАФОРМИРОВАНИЕ
**Цифровая Экология**

Инсталляция видео-мэппинга, превращающая городской бетон в живые, дышащие биологические текстуры.
`
);

export const events_portal_md = txt(
`## PORTAL
**Augmented Reality Gateway**

A location-based AR experience revealing the invisible data layers of the city.`,
`## ПОРТАЛ
**Шлюз Дополненной Реальности**

AR-опыт с привязкой к локации, раскрывающий невидимые слои данных города.
`
);

export const events_byob_md = txt(
`## BYOB
**Bring Your Own Beamer**

A chaotic, energetic one-night exhibition of light and projection.`,
`## BYOB
**Принеси Свой Проектор**

Хаотичная, энергичная выставка света и проекций на одну ночь.
`
);

export const events_pleinair_md = txt(
`## DIGITAL PLEIN AIR
**Nature & Code**

Creating generative landscapes while immersed in the physical wilderness.`,
`## ЦИФРОВОЙ ПЛЕНЭР
**Природа и Код**

Создание генеративных пейзажей при полном погружении в дикую природу.
`
);

// --- COLLABORATION ---
export const collab_index_md = txt(
`## COLLABORATION
**Co-Creation**

We believe that intelligence is a network effect. We partner with brands, galleries, and researchers to push boundaries.

[Contact Us via External Link](mailto:hello@oda.dream)`,
`## СОТРУДНИЧЕСТВО
**Со-Творчество**

Мы верим, что интеллект — это сетевой эффект. Мы сотрудничаем с брендами, галереями и исследователями, чтобы раздвигать границы возможного.

[Связаться с нами](mailto:hello@oda.dream)
`
);

export const collab_events_md = txt(
`## FOR EVENTS
**Interactive Installations**

We create "wow" moments that are scientifically grounded. From brain-controlled drink dispensers to collective data visualization.`,
`## ДЛЯ ИВЕНТОВ
**Интерактивные Инсталляции**

Мы создаем "wow"-моменты, имеющие под собой научную основу. От диспенсеров напитков, управляемых силой мысли, до коллективной визуализации данных.
`
);

export const collab_business_md = txt(
`## FOR BUSINESS
**Innovation Labs**

R&D for companies looking to integrate neuro-tech into consumer experiences.`,
`## ДЛЯ БИЗНЕСА
**Лаборатории Инноваций**

R&D для компаний, желающих интегрировать нейротехнологии в пользовательский опыт.
`
);

export const collab_galleries_md = txt(
`## FOR GALLERIES
**Curation & Acquisition**

Consulting on the presentation and preservation of new media art.`,
`## ДЛЯ ГАЛЕРЕЙ
**Кураторство и Приобретение**

Консультирование по презентации и сохранению нового медиа-искусства.
`
);

export const collab_artists_md = txt(
`## FOR ARTISTS
**Mentorship**

We support emerging artists in bridging the gap between traditional mediums and creative coding.`,
`## ДЛЯ ХУДОЖНИКОВ
**Менторство**

Мы поддерживаем начинающих художников в преодолении разрыва между традиционными медиа и креативным кодингом.
`
);

// --- WORLD ---
export const world_index_md = txt(
`## THE WORLD
**Context & History**

The philosophy, the people, and the path behind oda.dream.`,
`## МИР
**Контекст и История**

Философия, люди и путь, стоящий за oda.dream.
`
);

export const world_manifesto_md = txt(
`## MANIFESTO
**Silicon & Synapse**

1. We reject the dualism of mind and machine.
2. Code is poetry; data is paint.
3. The observer is always part of the system.
4. Technology should reveal humanity, not obscure it.`,
`## МАНИФЕСТ
**Кремний и Синапс**

1. Мы отвергаем дуализм разума и машины.
2. Код — это поэзия; данные — это краска.
3. Наблюдатель всегда является частью системы.
4. Технологии должны раскрывать человечность, а не скрывать её.
`
);

export const world_team_md = txt(
`## TEAM
**The Duo**

Founded in 2018, oda.dream is the synthesis of a neurobiologist and a creative technologist.`,
`## КОМАНДА
**Дуэт**

Основанный в 2018 году, oda.dream представляет собой синтез нейробиолога и креативного технолога.
`
);

export const world_press_md = txt(
`## PRESS
**Featured In**

- Wired Magazine: "The Future of Art is Biological"
- Vogue: "Wearable Data"
- TechCrunch: "Top 10 Immersive Studios"`,
`## ПРЕССА
**О Нас Пишут**

- Wired Magazine: "Будущее искусства биологично"
- Vogue: "Носимые данные"
- TechCrunch: "Топ 10 Иммерсивных Студий"
`
);

export const world_testimonials_md = txt(
`## ECHOES
**What They Say**

> "A transformative experience. I saw my own calm."
> — Visitor, 2023

> "The most honest art I've ever seen."
> — Curator, MoMA`,
`## ЭХО
**Отзывы**

> "Трансформирующий опыт. Я увидел собственное спокойствие."
> — Посетитель, 2023

> "Самое честное искусство, которое я когда-либо видел."
> — Куратор, MoMA
`
);

export const world_acknowledgments_md = txt(
`## ACKNOWLEDGMENTS
**Gratitude**

To our patrons, our coders, and the scientists whose shoulders we stand on.`,
`## БЛАГОДАРНОСТИ
**Признательность**

Нашим патронам, нашим кодерам и ученым, на чьих плечах мы стоим.
`
);

// --- CONTACTS ---
export const contacts_md = txt(
`## CONTACTS
**Signal**

Ready to collaborate?

**Email**: hello@oda.dream
**Social**: @oda.dream

*Transmission Ends.*`,
`## КОНТАКТЫ
**Сигнал**

Готовы к сотрудничеству?

**Email**: hello@oda.dream
**Соцсети**: @oda.dream

*Конец Связи.*
`
);
