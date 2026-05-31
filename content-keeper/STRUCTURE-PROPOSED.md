# Proposed content hierarchy

Чистовое дерево лотоса по итогам обсуждения. Применены подтверждённые решения, открытые вопросы помечены **🔵 OPEN** — нужно решение до миграции.

Правило-инвариант: **в каждом узле ≤ 8 прямых детей**. Если ветка достигает 8 — это сигнал «таксономия описана неточно», а не «добавить пагинацию».

Маркеры в дереве:
- ✅ — нода уже существует с этим id
- 🆕 — новая нода, нужно создать
- ✏️ — нода существует, но переименовывается (старый id уходит в `aliases`)
- 🗑️ — нода удаляется (содержимое перенесено)
- 🔵 — открытое решение, описано в конце

---

## Корень `hub-home` — 7 веток

```
hub-home ✅
├── hub-works ✅           Работы                        (4 категории)
├── hub-tech 🆕            Технологии                    (4-5 ✅)
├── hub-lectures ✅        Лекторий                      (8 ⚠ at-cap)
├── hub-events ✅          События                       (5 категорий)
├── hub-collab ✅          Сотрудничество                (5 аудиторий)
├── hub-world ✅           О нас                         (8 плоско ⚠)
└── hub-contacts ✅        Контакты                      (leaf)
```

**Не в лотосе** (выносим): `hub-changelog` → footer; `hub-debug*` → dev-only.  
**8-я ячейка корня** — резерв (под featured / curated portal).

---

## 1. `hub-works` — Работы (4 категории)

```
hub-works ✅
├── hub-big-forms 🆕        Большие формы
│   ├── schrodinger ✅             Проект Шрёдингер
│   ├── interference ✅            Интерференция реальностей
│   └── ancestors 🆕               Предки в шуме
├── hub-performances 🆕     Перформансы
│   ├── mindshow ✅                MindShow
│   ├── neurobattle ✅             Парадокс Успеха (aliases: [neurobattle])
│   ├── cultural-neuro-code ✅     Культурный нейрокод
│   ├── neuro-dance ✅             НейроАрт Танец
│   ├── neurosync ✏️               Нейросинхронизация  (aliases: [neurosync-perf])
│   └── gong ✅                    Gong / Гонг
├── hub-installations 🆕    Инсталляции
│   ├── honors ✅                  Нейродоска почёта
│   ├── darshan ✅                 Момент Даршана       (current id: ?)
│   ├── posustoronniy ✅           Посюсторонний
│   ├── sync-circle ✅             SyncCircle
│   └── another-people 🆕          Другие люди / Другие
└── hub-materia ✏️         Материя (renamed from hub-objects, aliases: [hub-objects])
    ├── oda-rings 🆕               Кольца ODA.dream
    ├── mom-baby ✅                Мать и дитя
    ├── two-waves 🆕               Две волны (кулон · ~2000 медитация)
    ├── emomandala ✅              Эмо-мандала
    ├── voronka 🆕                 Воронка
    ├── happiness 🆕               Счастье
    └── lighthouse 🆕              Маяк
```

**Удаляются хабы:**
- 🗑️ `hub-works-art`, `hub-works-education`, `hub-works-tech` — старая art/edu/tech раскладка не применяется. Дети распределяются по новым 4 категориям.
- 🗑️ `hub-research` — детей разнести в Большие формы / Инсталляции.
- 🗑️ `hub-practices` — coaching/workshops уходят в `event.subkind` (не продукты), neuro-dance/neurosync/gong/neurosynchronization — в Перформансы.
- 🗑️ `hub-games` — brain-hack и journey уходят в Лекторий как мастер-классные форматы (subkind: master-class).

**Замечания по cap:**
- Перформансы = 4. Watch-zone. Если уйдёт ещё одна работа — упадёт до 3 (слабо). Если добавишь новую — наполнит.

---

## 2. `hub-tech` 🆕 — Технологии (4-5)

```
hub-tech 🆕
├── neuromandala-os 🆕         Neuromandala Operational System
└── hyperscan-scene-engine 🆕  Hyperscan Scene Engine
```

Семантика: то, что можно лицензировать, описать в патенте, передать другому художнику. Если нет — не сюда.

---

## 3. `hub-lectures` — Лекторий (8 ⚠ at-cap)

```
hub-lectures ✅
├── feedback-empathy-brain 🆕     Мозг БОС и техно-эмпатия    (aliases?)
├── beautiful-brain ✅            Красиво про мозг 
├── sound-brain ✅                Мозг и звук
├── taste-brain ✅                Мозг и вкус
├── meditation-brain 🆕           Мозг и медитация
├── neuroaesthetics-lec ✅        Нейроэстетика
├── brain-hack ✅                 Брейн-хак        (мастер-класс, was hub-games)
└── journey ✅                    Journey          (мастер-класс, was hub-games)
```

**Cap watch**: 8 ровно. Дальше упрётся — категория не может расти без разделения (например, выделить мастер-классы отдельной под-веткой).

---

## 4. `hub-events` — События (5 категорий)

```
hub-events ✅
├── hub-exhibitions 🆕     Выставки                    (5 ✅)
│   ├── terraforming ✅           Терраформинг
│   ├── chastoti ✅               Частоты
│   ├── unique-russia 🆕          Уникальная Россия 2026
│   ├── pleinair-metro 🆕         Плэнер в метро
│   └── pleinair-bashkiria 🆕     Цифровой плэнер в Башкирии
├── hub-festivals 🆕       Фестивали                   (4 ✅)
│   ├── event-tsiolkovsky 🆕        Циолковский (series-hub)
│   │   ├── event-tsiolkovsky-2025 🆕
│   │   └── tsiolkovsky-2026 🆕
│   ├── event-portal 🆕             Портал 2030–2050 (series-hub)
│   │   ├── event-portal-2024 🆕
│   │   └── event-portal-2025 🆕         (renamed from event-moscow2030-event-portal-2025)
│   ├── event-gong-fest 🆕          Гонг фест (series-hub)
│   │   ├── event-gong-fest-2024 🆕
│   │   └── event-gong-fest-2025 🆕
│   └── event-myata-2025 🆕       Дикая Мята 2025 (rename from event-wildmint-2025)
├── hub-forums 🆕          Форумы / конф.              (6 ✅)
│   ├── event-cipr-mindshow-2026 ✅
│   ├── event-tpp-mindshow-2025 ✅
│   ├── event-kod-provincii 🆕    Код провинции
│   ├── event-techweek 🆕         TechWeek
│   ├── event-bitva-milliard-2024 🆕  Битва за миллиард 2024
│   └── event-brics-plus 🆕       BRICS+
├── hub-edu-corporate 🆕   Лекции и образ. программы   (6 ✅)
│   ├── event-dano-ekoniva-2025 ✅          DANO олимпиада (organizer: hse, tbank; invited by ekoniva)
│   ├── event-sber-lecture-2025 ✅          Сбер — внутренняя образ. программа
│   ├── event-merck-corporate ✅            Merck — корп. конференция
│   ├── event-tavrida-ai-2025 ✅            Таврида.АРТ — летняя школа (was in Фестивали)
│   ├── event-hse-beautiful-brain-2025 ✅   ВШЭ лекция (moved from Форумы)
│   └── event-bauman-moscow2030-2025 ✅     МГТУ Баумана лекция (moved from Форумы)
└── hub-private-shows 🆕   Закрытые показы             (2 ⚠ watch-zone)
    ├── event-ashram-birthday-2024 ✅       Закрытый показ-вечеринка Ashram studio
    └── event-gonchar-private-2024 ✅       Частное нейрошоу — Ната Гончар
```

**Удаляются хабы:**
- 🗑️ `hub-pleinair` — категории не нужно, плэнеры растворяются в Выставки.
- 🗑️ `hub-registry-expert`, `hub-registry-commercial` — relationship-группировка, антипаттерн.
- 🗑️ `hub-registry-orgs` — будет переоформлено (см. п.5).
- 🗑️ `hub-registry` — обобщающий хаб не нужен.
- 🗑️ Категория «Прочие» — антипаттерн (расфасовка в новые subkinds).

**Уточнения `subkind` на существующих узлах** (требуют исправления):

| Узел | Было | Стало | Где |
|---|---|---|---|
| `event-mipt-terraforming-2025` | workshop | **exhibition** | Выставки (под `hub-terraforming`) |
| `event-tsiolkovsky-2026` | competition | **festival** | Фестивали (под `event-tsiolkovsky`) |
| `event-dano-ekoniva-2025` | competition | **olympiad** | Лекции и образ. программы |
| `event-sber-lecture-2025` | workshop | **lecture** | Лекции и образ. программы |
| `event-merck-corporate` | workshop | **conference** | Лекции и образ. программы |
| `event-tavrida-ai-2025` | festival | **school** | Лекции и образ. программы |
| `event-hse-beautiful-brain-2025` | conference | **lecture** | Лекции и образ. программы |
| `event-bauman-moscow2030-2025` | forum | **lecture** | Лекции и образ. программы |

**Cap watch:**
- Лекции и образ. программы = 6 ✅ — здоровая категория с громкими именами в карточках через `organizer: [[org-X]]`.
- Форумы = 6 ✅ после переноса HSE и Bauman в Лекции.
- Фестивали = 4 ⚠ watch-zone — series-hubs дают глубину, но верхний счёт сам по себе невелик.
- Закрытые показы = 2 ⚠ полу-пустой. Категория редкая, может расти со временем (другие частные показы клиентов). На данный момент держим как 5-ю ветку Событий.
- Всего категорий в `hub-events` = 5 → 5-я ячейка лотоса занята. Запас на 3 ячейки.

---

## 5. `hub-collab` — Сотрудничество (6 ✅)

```
hub-collab ✅
├── hub-institutions ✏️      Арт-институциям         (was hub-institutions / for-institutions)
├── hub-education ✏️         Образованию             (was hub-education / for-education)
├── hub-business ✏️          Бизнесу                 (was hub-business / for-business)
├── hub-event-agencies ✏️    Ивент-агентствам        (was hub-agents / for-agents — переименование)
├── hub-creators ✏️          Креаторам               (was hub-artists / for-artists)
└── hub-collab-media 🆕      Медиа                   (пресса, блогеры, журналисты)
```

**Заметка**: `hub-galleries` → подгруппа Арт-институций (информационный раздел внутри `hub-institutions`).

---

## 6. `hub-world` — О нас (8 плоско ⚠)

```
hub-world ✅
├── manifesto ✅             Манифест
├── cv ✅                    CV
├── press ✅                 Пресса
├── awards 🆕                Награды        (отдельная страница, не путать с letters)
├── testimonials ✅          Отзывы
├── partners 🆕              Партнёры       (бренды, что показывали на стендах)
├── clients 🆕               Клиенты        (кто платил за стенд / коммерческий заказ)
└── collabs 🆕               Коллабы        (художники-соавторы)
```

Cap = 8 ровно (предел). Дальше расти О нас не должно — это финальный раздел.

**🗑️ Хабы для удаления:**
- `hub-letters` (текущий с 23 детьми) — растворяется: пруфы становятся доступны через provenance графа, **не** через отдельную плоскую страницу. Если хочется единый «архив наград» — это `awards` страница с filtered view (`.base` на kind:proof).
- `hub-team` — содержимое переезжает в `cv` (команда — это часть CV-данных).
- Вложение «Партнёры → Партнёры/Клиенты/Коллабы» (с двойным именем) удаляется.

---

## 7. `hub-contacts` — Контакты (leaf)

Без изменений. Остаётся одиночной страницей.

---

## Что выносится из лотоса

- `hub-changelog` → footer (есть `package.json` version → автогенерация)
- `hub-debug`, `hub-debug-action`, `hub-debug-article`, `hub-debug-audio`, `hub-debug-hub`, `hub-debug-image`, `hub-debug-video` → dev-only (доступ через `?debug=1` или скрыто в продакшен сборке)

---

## Сводный список открытых вопросов 🔵

| #   | Вопрос                                                                             | Влияет на          | Статус                                                                                                        | Решение                                                                                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Технологии = top-level или подкатегория Работ?                                     | Корень + Работы    | **resolved**: top-level                                                                                       | top-level                                                                                                                                                                                                             |
| 2   | Лекторий = top-level или под Сотрудничество→Образованию?                           | Корень             | **resolved**: top-level                                                                                       | top-level                                                                                                                                                                                                             |
| 3   | Корп-частные события: вариант A (категория) или B (visible:false)?                 | События            | **resolved**: 2 категории — `hub-edu-corporate` (6) для громких имён, `hub-private-shows` (2 ⚠) для приватных | Интимные - закрытый хаб по паролю :)                                                                                                                                                                                  |
| 4   | `moscow2030-event-portal-2025` — это форум Москва 2030 или Портал-серия?                 | Форумы / Фестивали | **resolved**: Портал-серия (`event-portal-2025`)                                                                    | Вообще рамочный такой, фестиваль Портал 2030-2050 проходит в рамках форума "Территория будущего. **Москва** **2030**". Mindshow и первое место по VJ я выиграл на портале, а лекцию читал в Бауманке в рамках форума. |
| 5   | Добавлять «Медиа» аудиторию в Сотрудничество?                                      | Сотрудничество     | **resolved**: добавлено `hub-collab-media` (6-я аудитория)                                                    | Добавить                                                                                                                                                                                                              |
| 6   | `galleries` — подгруппа арт-институций или отдельная аудитория?                    | Сотрудничество     | **resolved**: подгруппа Арт-институций                                                                        | Подгруппа арт-институций                                                                                                                                                                                              |
| 7   | Команда `hub-team` — куда переезжает (cv vs отдельно)?                             | О нас              | **resolved**: содержимое `hub-team` → `cv`                                                                    | команда должна переехать в CV - это общие сущности                                                                                                                                                                    |
| 8   | `games` (brain-hack, journey) — куда (Перформансы или собственная мини-категория)? | Работы             | **resolved**: brain-hack, journey → Лекторий (subkind: master-class), `hub-games` удаляется                   | brain-hack, journey - тоже, можно назвать их мастер-классами                                                                                                                                                          |

---

## Сводный список миграций ID

### Переименования (с `aliases`)

| Старый id | Новый id | Aliases |
|---|---|---|
| `hub-objects` | `hub-materia` | `[hub-objects, objects]` |
| `hub-agents` | `hub-event-agencies` | `[hub-agents, for-agents]` |
| `hub-artists` | `hub-creators` | `[hub-artists, for-artists]` |
| `event-wildmint-2025` | `event-myata-2025` | `[event-wildmint-2025]` |
| `event-tavrida-ai-2025` — title only | (id keep) | — |

### Новые хабы (не существуют)

`hub-big-forms`, `hub-performances`, `hub-installations`, `hub-tech`, `hub-exhibitions`, `hub-festivals`, `hub-forums`, `hub-edu-corporate`, `hub-private-shows`, `event-tsiolkovsky`, `event-portal`, `event-gong-fest`, `hub-collab-media`.

### Заглушки-узлы

`ancestors`, `another-people`, `two-waves`, `voronka`, `happiness`, `lighthouse`, `feedback-empathy-brain`, `meditation-brain`, `neuromandala-os`, `hyperscan-scene-engine`, `unique-russia`, `pleinair-metro`, `pleinair-bashkiria`, `event-kod-provincii`, `event-techweek`, `event-bitva-milliard-2024`, `event-brics-plus`, `event-tsiolkovsky-2025`, `tsiolkovsky-2026`, `event-portal-2024`, `event-portal-2025`, `event-gong-fest-2024`, `event-gong-fest-2025`, `awards`, `partners`, `clients`, `collabs`.

### Удаляются (содержимое перенесено)

`hub-works-art`, `hub-works-education`, `hub-works-tech`, `hub-research`, `hub-practices`, `hub-games` (brain-hack, journey → hub-lectures), `hub-pleinair`, `hub-registry`, `hub-registry-commercial`, `hub-registry-expert`, `hub-registry-orgs`, `hub-letters` (растворяется в awards + filtered views), `hub-team` (содержимое → cv), `hub-changelog` (footer).

