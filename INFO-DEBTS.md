# Info debts — ожидающие уточнения

**Единый реестр долгов по фактам.** Все новые запросы добавлять сюда (не в отдельные заметки).

Формат: `[ID]` · что нужно · узлы · источник

---

## Конвенция: события (одиночные и серийные)

| Роль | ID | `type` | `kind` / `subkind` | `parent` |
|------|-----|--------|-------------------|----------|
| Категория (Фестивали, Форумы…) | `hub-festivals` и т.п. | `hub` | — | `hub-events` |
| **Серия** (BYOB, Циолковский, Портал, Гонг) | `event-<slug>` | `hub` | `event` / `series` | `hub-festivals` |
| **Издание** (год, конкретный показ) | `event-<slug>-<year>` | `content` | `event` / `festival` (и др.) | `event-<slug>` |
| **Одиночное** событие (без серии) | `event-<slug>` | `content` | `event` / … | `hub-festivals` или подкатегория |

Префикс **`event-`** — для любой ноды в дереве событий (и серия, и издание). Префикс **`hub-`** — только навигационные разделы, не серии фестивалей.

Примеры (2026-05-30): `event-byob` → `event-byob-2019`; `event-tsiolkovsky` → `event-tsiolkovsky-2025`, `event-tsiolkovsky-2026`; `event-portal` → `event-portal-2024`, `event-portal-2025`.

## Конвенция: коллаборации (равное со-творчество)

| Роль | ID / kind | Связь |
|------|-----------|--------|
| Партнёр на равных (персона, труппа) | `collab-*`, `kind: collaboration` | `subkind`: `person` \| `ensemble` \| `duo` |
| Институт-хост события | `org-*`, `kind: organizer` | `organizer` на `event` |
| Заказчик коммерции | `org-*` | `client` на `event` |
| Работа / событие | `product` / `event` | `collaborators: ["[[collab-…]]"]` |

На карточке `collab-*`: `products`, `collab_events`, опционально `related_org` (институциональный якорь). Реестр: `hub-registry-collabs`.

---

## Открытые

### DEBT-001 · РИНЦ-публикация про «Код провинции 2024»

- Нужно: заголовок, авторы, DOI/URL, дата.
- Узлы: `proof-press-rinc-kod-provincii` (создать), `event-kod-provincii`.
- Источник: пользователь пришлёт.

### DEBT-002 · Фильм про ИТБ (2024)

- Нужно: название, режиссёр, дата, ссылка.
- Узлы: `media-itb-film-2024` или `media.ts`, `event-itb-lab-2024-11`, `org-itb`.
- Источник: пользователь.

### DEBT-003 · Точные даты фестиваля Циолковский 2025

- ~~Закрывающая лаборатория Шрёдингер: **2025-05-22** (афиша, `event-tsiolkovsky-2025`).~~
- Остаётся: полный календарь издания 2025 (дни фестиваля кроме 22.05), если нужен диапазон `date_start`/`date_end`.
- 2026 закрыто: `2026-05-16` на `event-tsiolkovsky-2026`.

### DEBT-004 · Точная дата «Код провинции 2024»

- Сейчас: `event-kod-provincii.date_start: 2024-01-01` (placeholder).
- Нужно: день/месяц конференции, организатор (если не только ИКЦ).

### DEBT-005 · Формат лекции на «Коде провинции»

- Узел: `feedback-empathy-brain` — keynote / секция / постер?
- Тело лекции: уточнить связь с названием «Мозг, БОС и техноэмпатия» vs текущий title «Empathy».

### DEBT-006 · Сайты организаторов

- `org-ikc`, `org-itb`, `org-senatova` — публичные URL/контакты.
- ~~`org-kovylina`~~ — достаточно `collab-kovylina` (`kind: collaboration`).

### DEBT-007 · Повторные показы Шрёдингер / Интерференция

- Оба не в репертуаре, ждут повторов — когда появятся даты, добавить `event-*` или обновить `presented_at`.

### DEBT-008 · CultTech Summit 2026

- Узел события для премьеры `ancestors` (ноябрь 2026) — создать `event-culttech-summit-2026`?

### DEBT-009 · Gong Fest / Portal 2024 — даты и тела карточек

- Узлы: `event-gong-fest-2024`, `event-gong-fest-2025`, `event-portal-2024` — stubs, нет `date_start`, минимальный текст.
- Серии: `event-gong-fest`, `event-portal` — дополнить EN/RU как у `event-byob` / `event-tsiolkovsky`.

### DEBT-010 · Коллаборация ИТБ × нейротеатр

- Узел: `collab-itb` (создан, заглушка).
- Нужно: роли (Ксения Голыжбина, Александр Шестернин и др.), договорённости со-постановки, райдер гастролей, ссылка на фильм про ИТБ (см. DEBT-002).
- Связи: `org-itb`, `org-ikc`, `schrodinger`, `interference`, `event-kod-provincii`, `event-itb-lab-2024-11`.

### DEBT-011 · Коллаборация Ковылина × «Предки в шуме»

- Узел: `collab-kovylina` (создан, заглушка).
- Нужно: биография Елены Ковылиной, публичное имя трека CultTech, дата/место премьеры (ноябрь 2026 — уточнить), отдельная нода `org-kovylina` или достаточно collab-карточки.
- Связи: `ancestors`, `org-culttech`, `proof-award-culttech-vienna`, `event-culttech-summit-2026` (см. DEBT-008).

### DEBT-015 · UX/UI: дубль обложки product-карточки и первого inline-эмбеда

**Что болит**: когда в frontmatter указан `image: /path/cover.webp` (используется как hero / cover карточки), и при этом в body первой же строкой стоит `![[media:<тот-же-asset>]]` — одна и та же картинка появляется **дважды**: как cover вверху карточки и как первый inline-блок текста.

**Пример наблюдения** (2026-05-31): `ancestors.md`:
- `image: /images/content/works/ancestors-hero.webp` (cover для лотоса и страницы)
- Body line 1: `![[media:ancestors-hero]]` (inline embed)
- → визитор видит то же фото подряд два раза.

**Что в коде**:
- `image:` поле читается `contentLoader.ts` → `imageUrl` на LotusNode. Используется в LotusGrid (петля cover) и предположительно как hero-блок в TextPanel/ProvenancePanel.
- `![[media:<id>]]` обрабатывается `contentProcessor.ts` → inline-token → разворачивается в эмбед при рендере body.

**Гипотезы решений** (нужно выбрать):
1. **Dedup при рендере body**: если первый inline `![[media:X]]` совпадает с `image:` cover'ом (по URL или asset id), не показывать его. Прозрачно для писателя — можно ставить hero как inline для удобства редактирования в Obsidian, рендер сам пропустит дубль.
2. **Правило в process**: hero держим только в `image:` frontmatter, в body первый inline должен быть другим asset'ом. Без code-fix, но требует дисциплины при наполнении.
3. **Hero — это вообще inline**: убрать рендер `image:` как отдельного hero-блока на странице (оставить только для лотос-петли); body сам диктует «обложку» через первый inline `![[media:...]]`. Семантически чище, но ломает текущий layout.

**Узлы для пилота**: `ancestors`, `interference`, `schrodinger` — у всех есть cover + inline-эмбеды.

**Связано с**: [[#DEBT-014]] (UX медиа в провенансе).

**Источник**: пользователь, 2026-05-31.

### DEBT-014 · UX/UI: представление медиа в лотосе («Медиа» vs «Артефакты»)

**Что болит**: на карточке продукта в секции «Связи» сейчас два раздела — **«Медиа»** и **«Артефакты»** — и граница между ними непонятна посетителю. Оба показывают изображения/видео; вложенность media-нод-документаций создаёт лишний уровень.

**Структура данных** (источник дублирования):
- `Артефакты` = `prov.inverse.works_about` — полноценные `kind: media` ноды (`media-*.md`, например `media-schrodinger-teaser`). У них собственный маршрут, бади, провенанс. Рендерятся как NodeChip с навигацией.
- `Медиа` = `prov.media` — short MediaAsset из `src/data/media.ts` (`schrd-teaser`, `schrd-poster` и т.п.). Лёгкий ресурс: URL + title + subject.
- **Дублирование возникает потому, что в `subject:` MediaAsset обычно прописана соответствующая media-нода** (`schrd-teaser.subject: ["schrodinger", ..., "media-schrodinger-teaser"]`). В итоге на странице Шрёдингера тизер появляется и как «артефакт» (полная нода), и как «медиа» (краткий ресурс) — один и тот же контент.

**Что починено quick-fix'ом** (2026-05-31, commit upcoming):
1. **Dedup в `ProvenancePanel.tsx:555`** — `prov.media` фильтруется против `artifactsForSubject`: если у MediaAsset.subject есть id уже показанной media-ноды, MediaAsset не показывается. На странице Шрёдингера секция «Медиа» теперь пустая (все три asset'а покрыты артефактами).
2. **Клик по чипу «Медиа» открывает Lightbox** — раньше это был `<span>`, теперь `<button>`. `getMediaType(asset.url)` определяет видео vs картинку. Зеркала (YouTube/VK) — отдельные `<a>` внутри (`stopPropagation`, чтобы не дублировать клик).

**Что осталось архитектурно (для будущих решений)**:
- **Нужны ли вообще MediaAsset, если есть media-нода с тем же контентом?** Дешёвый ответ: оставить MediaAsset только для inline-эмбедов в bodies (`![[media:schrd-teaser]]`), но не дублировать в `subject` те, что уже стали полноценными media-нодами.
- **Нужно ли media-нодам быть в лотосе как петли?** Они занимают слот в 3×3 grid, чтобы туда зайти, посетитель кликает дважды (продукт → артефакт → лайтбокс). Альтернатива — inline-галерея на странице продукта (один клик → лайтбокс) и медиа-нода доступна только через прямой URL.
- **Какие сценарии оправдывают отдельный маршрут на media-ноду?** Подробный фоторепортаж с подписями к каждому кадру — да. Просто афиша — нет.

**Узлы для следующего пилота**: `interference` (5 media-артефактов: photos, plakats, poster, recording, sketch). После применения тех же дедуп-правил проверить, что осталось в «Медиа», и решить, нужно ли inline-разворачивать артефакты на странице продукта.

**Источник**: пользователь, 2026-05-31.

### DEBT-016 · UI: просмотр PDF в лотосе (документы в `public/documents/`)

**Что болит**: PDF уже лежат в репозитории и подключены в контент (`media_url`, `[[media:*-deck-pdf]]`, `subkind: text`), но **в интерфейсе не открываются** — клик по чипу в «Связях» или по `![[media:…]]` ведёт в Lightbox, который умеет только image / video / audio.

**Текущее состояние (2026-05-31)**:
- Файлы: `public/documents/posustoronniy-deck.pdf`, `public/documents/honors-skolkovo-presentation.pdf` (папка `public/documents/` пока untracked в git — добавить при коммите).
- Регистр: `pos-deck-pdf`, `hon-deck-pdf` в `media.ts` (`subkind: text`, URL `.pdf`).
- Ноды: `media-posustoronniy-deck`, `media-honors-presentation` — в body ссылка «Полный PDF» + галерея WebP-слайдов.
- `getMediaType()` не распознаёт `.pdf` → fallback `'image'` → Lightbox пытается показать PDF как картинку (ошибка / «Signal Lost»).
- `MediaType` в `types.ts` не включает `document` / `pdf`.

**Желаемое поведение** (выбрать вариант при реализации):
1. **Lightbox + `<iframe>` / `<embed>`** — PDF на весь экран внутри существующего оверлея (минимальный diff).
2. **Отдельная панель DocumentViewer** — как TextPanel, с кнопкой «скачать» и fallback-ссылкой, если браузер не рендерит PDF.
3. **Только внешняя ссылка** — чип открывает PDF в новой вкладке (`target="_blank"`), без встроенного просмотра (самый дешёвый UX, хуже для «tech noir» потока).

**Затронутые файлы** (ориентир):
- `src/utils/mediaHelpers.ts` — `getMediaType`: `.pdf` → `document` (или `pdf`).
- `src/types.ts` — расширить `MediaType`.
- `src/components/Lightbox.tsx` и/или `TextPanel.tsx` — ветка рендера PDF.
- `ProvenancePanel.tsx` — для PDF-чипов: preview не как image; клик → viewer или новая вкладка.
- Опционально: иконка FileText в чипах провенанса.

**Узлы-пилоты**: `honors` + `media-honors-presentation`, `posustoronniy` + `media-posustoronniy-deck`.

**Источник**: пользователь, 2026-05-31 (контент PDF загружен, просмотр в UI — отложен).

### DEBT-013 · Проект Шрёдингер — медиа и отдельный сайт

- Узел: `schrodinger` — тело из vault (сценарий v5, итого v10).
- ~~Медиа: `media-schrodinger-poster`, `media-schrodinger-photos`, `media-schrodinger-teaser`; `npm run image:pack` для афиши.~~
- Подписи к 8 кадрам фоторепортажа — уточнить по сюжету (сейчас `фото 1…8`).
- Отдельный сайт проекта (как у `interference`) — URL в `external_site`, когда готов.

### DEBT-012 · «Код провинции» — официальное название в текстах

- В `hub-big-forms` и навигации: зафиксировать форму **«Код провинции» — научная хореографическая конференция** vs краткое «Код провинции».
- Сверить с программой конференции и публикацией РИНЦ (DEBT-001).

---

## Закрыто (2026-05-30)

- ~~DEBT-005 (visibility lab)~~ — `event-itb-lab-2024-11` с `visible: false` под `hub-private-shows`.
- ~~Организаторы ИТБ/ИКЦ~~ — созданы `org-itb`, `org-ikc`.
- ~~Приглашение на Циолковский 2025~~ — `org-senatova`, `event-tsiolkovsky-2025`.
- ~~CultTech grant~~ — `proof-award-culttech-vienna.proof_of` → `ancestors`, `org-culttech`.
- ~~Именование серий фестивалей~~ — `hub-byob` / `hub-portal` / `hub-tsiolkovsky` / `hub-gong-fest` → `event-*`; издания `event-*-YYYY`; удалена дублирующая заглушка `tsiolkovsky-2026`.
- ~~`kind: collaboration`~~ — шестой базовый kind; префикс `collab-*`; `collab-itb`, `collab-kovylina`; реестр `hub-registry-collabs`; поле `collaborators` на product/event.
