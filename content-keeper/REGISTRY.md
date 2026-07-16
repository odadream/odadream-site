# Event Registry | Реестр участий

**Canonical schema:** [`CONTENT-SCHEMA.md`](../CONTENT-SCHEMA.md) v1.6 · **Backlog:** [`BACKLOG.md`](BACKLOG.md)

Единый реестр участий ODA.dream: коммерческие заказы, экспертные приглашения, награды, организации.

---

## Where data lives | Где живут данные

| Слой | Путь | Роль |
|------|------|------|
| **Канон** | `src/content/event-*.md` (тег `hub-registry`) | Редактируешь здесь (Obsidian `events.base`) |
| **Снимок** | `data/registry/engagements.yaml` | Генерируется из `.md` — **не** править вручную |
| **Справочник org** | `data/registry/organizations.yaml` | Имена EN/RU, `kind` — подсказка, не event-role |
| **Каталог работ** | `data/registry/works.yaml` | Dossier, funnel (без `format_keys`) |
| **Сайт** | `src/content/hub-registry.md` | Публичная таблица (генерируется) |
| **Синк** | `scripts/sync-registry.js` | yaml + hub-registry + dossier + org stubs |

> **Устарело:** `eng-*` id, `registry-commercial` / `registry-expert` hubs, поле `format`, ручное редактирование `engagements.yaml`.

---

## Add / edit engagement | Добавить участие

1. Создай или открой `src/content/event-{slug}-{year}.md` (шаблон: `src/content/_templates/event.md`).
2. Обязательно для реестра:
   - тег `hub-registry`
   - `kind: event`, `subkind`, `date_start` (ISO)
   - **`products`** — какая работа ODA (канон; `format` удалён, BL-006)
   - **роли:** `orgs`, `venues`, `partners`, `client`, `collaborators` (§4.2 CONTENT-SCHEMA)
   - `city_en` / `city_ru`, `relationship`
3. Новая организация → запись в `organizations.yaml` + `org-*.md` (или stub из sync).
4. Прогон:

```bash
npm run sync:fields      # organizer ← orgs; даты; proof (переходно)
npm run registry:sync    # engagements.yaml + hub-registry.md
npm run assets:generate  # SVG для новых id
npm run assets:map       # сироты
npm run audit            # PHASE-F-AUDIT.md
npm run build
```

5. На других страницах — **ссылки**, не дубли фактов: `[[event-portal-2025|…]]`, `[[org-hse|…]]`.

---

## `relationship` | Тип участия

| Значение | Смысл | Где видно |
|----------|--------|-----------|
| `commercial` | Коммерческий заказ | маркеры `hub-business`, `hub-event-agencies` |
| `invited` | Экспертное приглашение | то же (expert lists) |
| `award` | Награда / признание | provenance, awards table |
| `competition` | Фестиваль / конкурс | реестр, narrative hubs |

Колонка «Тип» в `hub-registry` — **`subkind`**, не `relationship` и не `products`.

---

## Auto-updated blocks | Авто-блоки

Маркеры в `hub-business.md`, `hub-event-agencies.md`, dossier на product-страницах — заполняет `registry:sync`. Между `<!-- marker -->` не редактировать вручную.

---

## Obsidian import (optional)

```bash
npm run registry:import-obsidian
node scripts/import-from-obsidian.js --dry-run
node scripts/import-from-obsidian.js --merge
```

Ожидаемые поля в заметках vault: `products`, `orgs`, `venues`, `relationship`, `date_start`, `city_*` — см. CONTENT-SCHEMA §4.2.

---

## Editor rules | Правила

- **Не** дублируй списки брендов на `collab-*`, `hub-lectures` — ссылайся на `[[hub-registry]]` или `event-*`.
- **Не** добавляй 80+ событий в showcase-хабы — полный лог только в `hub-registry`.
- **Не** пиши `organizer` вручную на registry-событиях — только `orgs` → `sync:fields`.
- **Не** используй `format` — только `products[]`.

---

## Commands

```bash
npm run sync:fields
npm run registry:sync
npm run registry:repair-dates
npm run audit
npm run build
```
