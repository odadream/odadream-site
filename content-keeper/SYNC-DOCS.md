# SYNC-DOCS — playbook агента

**Команда в Cursor:** `/sync-docs` (`.cursor/commands/sync-docs.md`)
**Журнал прогонов:** [`SYNC-DOCS-LOG.md`](SYNC-DOCS-LOG.md)

---

## 1. Назначение

Привести **агентскую и операционную документацию** в соответствие с **кодом** и **[`CONTENT-SCHEMA.md`](../CONTENT-SCHEMA.md)**.

| Слой | Роль |
|------|------|
| **CONTENT-SCHEMA** | Канон организации карточек, полей, provenance, реестров |
| **Код** | Фактическое поведение парсера, типов, audit, скриптов |
| **BACKLOG** | Зафиксированный долг «довести код до схемы» |
| **Rules / README / CLAUDE** | Краткие дополнения со ссылками на канон |

---

## 2. Золотое правило

> При расхождении **CONTENT-SCHEMA** и кода — **приоритет у схемы** (организация).
> Текущее поведение кода описываем в **BACKLOG**, не переписываем схему молча.

Исключение: явная правка схемы по решению пользователя → в одном проходе: схема + код + шаблоны + BACKLOG.

---

## 3. Инвентарь документов

### Tier 1 — синхронизировать каждый прогон

| Файл | Что сверять |
|------|-------------|
| [`CONTENT-SCHEMA.md`](../CONTENT-SCHEMA.md) | Версия, §18 links, footer (schema wins) |
| [`CLAUDE.md`](../CLAUDE.md) | Архитектура, provenance, schema + BACKLOG |
| [`README.md`](../README.md) | Frontmatter examples, npm scripts, schema links |
| [`AGENTS.md`](../AGENTS.md) | Critical files, pre-release, npm scripts |
| [`.cursor/rules/devops-lead.mdc`](../.cursor/rules/devops-lead.mdc) | Schema priority, delegation |
| [`.cursor/rules/content-manager.mdc`](../.cursor/rules/content-manager.mdc) | `updated`, ссылка на §4, без дубля таблиц |
| [`.cursor/rules/lotus-cms.mdc`](../.cursor/rules/lotus-cms.mdc) | Canonical schema + BACKLOG |
| [`.cursor/rules/project-architecture.mdc`](../.cursor/rules/project-architecture.mdc) | LotusNode, frontmatter examples |
| [`.cursor/rules/testing-standards.mdc`](../.cursor/rules/testing-standards.mdc) | `npm run audit` vs `validate:*` (BL-007) |
| [`.cursor/rules/deploy-release.mdc`](../.cursor/rules/deploy-release.mdc) | CI scripts vs package.json |
| [`content-keeper/REGISTRY.md`](REGISTRY.md) | registry pipeline, без `eng-*` / `format` |
| [`content-keeper/BACKLOG.md`](BACKLOG.md) | Открытые BL, таблица приоритетов |

### Tier 2 — при заметном drift

| Файл | Примечание |
|------|------------|
| [`.cursor/README.md`](../.cursor/README.md) | Список rules + commands |
| [`.cursor/AGENT_QUICK_SOURCE_OF_TRUTH.md`](../.cursor/AGENT_QUICK_SOURCE_OF_TRUTH.md) | Canonical sources |
| [`package.json`](../package.json) | Эталон имён скриптов |

### Tier 3 — низкий приоритет (чеклист в LOG)

- `.cursor/ONBOARDING.md`, `HISTORY_KEEPER.md` — примеры `date:`, устаревшие версии
- `content-keeper/STRUCTURE-CURRENT.md` — исторический снимок (`eng-*`)
- `content-keeper/STRUCTURE-PROPOSED.md` — архив Phase H

---

## 4. Источники правды в коде

Сверять при каждом прогоне:

```
package.json          → scripts.* (audit, registry:sync, sync:fields, dates:sync, build, …)
src/types.ts          → LotusNode, provenance-related fields
src/utils/frontmatter.ts → принимаемые поля, legacy fallbacks (e.g. date → updated)
src/utils/provenance.ts  → inverse links (venue_events, partner_events, …)
scripts/audit/content-audit.js → REQUIRED, warnings, deprecated fields
scripts/sync-registry.js       → hub-registry / org stub frontmatter (updated, products)
```

---

## 5. Stale patterns (grep)

Искать в `*.md`, `*.mdc` (исключая `src/content/`, `node_modules/`, `_archive/`):

| Паттерн | Проблема | Целевое |
|---------|----------|---------|
| `date:` в YAML-примерах frontmatter | deprecated | `updated:` (BL-009 для парсера) |
| `format:` / `format_keys` | удалено BL-006 | `products[]` |
| `eng-` | старый префикс | `event-*` |
| `registry-commercial` | удалён hub | — |
| `venue:` как frontmatter | удалено | `venues[]` |
| `validate:content` без BL-007 | скрипта нет | `npm run audit` + BL-007 |
| «приоритет у парсера» | устарело | schema wins → BACKLOG |
| полная копия таблицы §4.2 в rules | дубль | ссылка на CONTENT-SCHEMA |

Контентные слова `format` в теле статей (описание формата мероприятия) — **не** трогать.

---

## 6. Пошаговый workflow

### Шаг A — Подготовка

1. Записать версию из шапки `CONTENT-SCHEMA.md` (например v1.6).
2. Прочитать `BACKLOG.md` — таблицу и открытые BL.

### Шаг B — Аудит drift

1. Прогнать grep по §5 (или эквивалентный поиск).
2. Сверить `package.json` scripts с упоминаниями в AGENTS, README, testing-standards, deploy-release.
3. Сверить поля provenance в CLAUDE / CONTENT-SCHEMA / `types.ts` / `provenance.ts`.

### Шаг C — Правки документации

1. **Tier 1** — исправить найденный drift; в rules оставить короткие примеры + ссылку на канон.
2. **Не дублировать** большие таблицы полей — только `CONTENT-SCHEMA`.
3. Схему менять только если пользователь явно просил или это внутренняя опечатка схемы (согласованность §17 vs §4.2).

### Шаг D — BACKLOG

Для каждого расхождения **схема требует X, код делает Y**:

1. Проверить, есть ли уже BL-00x.
2. Если нет — добавить строку в таблицу + секцию с: **Схема**, **Код сейчас**, **Целевое поведение**.
3. Не закрывать BL без изменения кода (или явного пересмотра схемы).

Известные открытые пункты: BL-001–005, BL-007–009 (см. BACKLOG).

### Шаг E — Журнал

Обновить [`SYNC-DOCS-LOG.md`](SYNC-DOCS-LOG.md):

```markdown
**Last run:** YYYY.MM.DD · **Schema:** CONTENT-SCHEMA vX.Y · **Command:** `/sync-docs`
```

- Отметить checklist (что сделано в этом прогоне).
- Обновить **Remaining drift** — только реально открытое.
- Не снимать галочки с прошлых прогонов без причины.

### Шаг F — Отчёт пользователю

Кратко:

- Версия схемы
- Изменённые файлы (список)
- Новые/обновлённые BL
- Оставшийся drift (Tier 3)
- Коммит не делать, если не просили

---

## 7. Дедупликация (правила)

| Тема | Где полный текст | Где в rules |
|------|------------------|-------------|
| Поля event/product/org/proof | CONTENT-SCHEMA §3–§4 | 1 строка + ссылка |
| Event-scoped roles | CONTENT-SCHEMA §4.2 | `orgs`, `venues`, `partners`, `products` |
| npm scripts | package.json | перечисление в README/AGENTS |
| Pre-release checks | AGENTS + deploy-release | audit, assets:map, build |
| Архитектура Lotus | CLAUDE + project-architecture | без противоречий |

---

## 8. Связанные команды (не путать)

| Команда | Назначение |
|---------|------------|
| `/sync-docs` | Документация агентов ↔ код ↔ схема |
| `npm run audit` | Аудит **контента** `src/content/` |
| `npm run registry:sync` | YAML + hub-registry из engagements |
| `npm run sync:fields` | Поля md ↔ yaml |
| `npm run version:sync` | Версия релиза сайта |

---

## 9. Чеклист быстрого прогона

- [ ] CONTENT-SCHEMA footer + §18 актуальны
- [ ] Нет `date:` в примерах frontmatter (Tier 1 rules)
- [ ] Нет `format` / `eng-*` в ops-docs
- [ ] `npm run audit` вместо несуществующего `validate:content` (или BL-007)
- [ ] BACKLOG отражает известный schema↔code drift
- [ ] SYNC-DOCS-LOG обновлён
- [ ] Отчёт пользователю отправлен
