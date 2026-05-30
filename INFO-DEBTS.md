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

- Сейчас: `event-tsiolkovsky-2025.date_start: 2025-01-01` (placeholder).
- Нужно: календарные даты издания 2025, когда шла закрывающая лаборатория Шрёдингер.
- 2026 закрыто: `2026-05-16` на `event-tsiolkovsky-2026`.

### DEBT-004 · Точная дата «Код провинции 2024»

- Сейчас: `event-kod-provincii.date_start: 2024-01-01` (placeholder).
- Нужно: день/месяц конференции, организатор (если не только ИКЦ).

### DEBT-005 · Формат лекции на «Коде провинции»

- Узел: `feedback-empathy-brain` — keynote / секция / постер?
- Тело лекции: уточнить связь с названием «Мозг, БОС и техноэмпатия» vs текущий title «Empathy».

### DEBT-006 · Сайты организаторов

- `org-ikc`, `org-itb`, `org-senatova` — публичные URL/контакты.
- `org-kovylina` — отдельная нода или только в `ancestors` (сейчас в тексте).

### DEBT-007 · Повторные показы Шрёдингер / Интерференция

- Оба не в репертуаре, ждут повторов — когда появятся даты, добавить `event-*` или обновить `presented_at`.

### DEBT-008 · CultTech Summit 2026

- Узел события для премьеры `ancestors` (ноябрь 2026) — создать `event-culttech-summit-2026`?

### DEBT-009 · Gong Fest / Portal 2024 — даты и тела карточек

- Узлы: `event-gong-fest-2024`, `event-gong-fest-2025`, `event-portal-2024` — stubs, нет `date_start`, минимальный текст.
- Серии: `event-gong-fest`, `event-portal` — дополнить EN/RU как у `event-byob` / `event-tsiolkovsky`.

---

## Закрыто (2026-05-30)

- ~~DEBT-005 (visibility lab)~~ — `event-itb-lab-2024-11` с `visible: false` под `hub-private-shows`.
- ~~Организаторы ИТБ/ИКЦ~~ — созданы `org-itb`, `org-ikc`.
- ~~Приглашение на Циолковский 2025~~ — `org-senatova`, `event-tsiolkovsky-2025`.
- ~~CultTech grant~~ — `proof-award-culttech-vienna.proof_of` → `ancestors`, `org-culttech`.
- ~~Именование серий фестивалей~~ — `hub-byob` / `hub-portal` / `hub-tsiolkovsky` / `hub-gong-fest` → `event-*`; издания `event-*-YYYY`; удалена дублирующая заглушка `tsiolkovsky-2026`.
