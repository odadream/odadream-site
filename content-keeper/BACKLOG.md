# BACKLOG — архитектурный долг контента и CMS

**Связь:** [`CONTENT-SCHEMA.md`](../CONTENT-SCHEMA.md) · **Обновлено:** 2026.06.02

**Правило приоритета:** [`CONTENT-SCHEMA.md`](../CONTENT-SCHEMA.md) — единый источник правды по **организации** карточек, полей и связей. Если парсер, типы, audit или скрипты ведут себя иначе — **не меняйте схему молча**; заведите или обновите пункт здесь. Задачи в BACKLOG — довести **код и конвейер** до схемы (или явно пересмотреть схему отдельным решением).

| ID | Приоритет | Область | Статус |
|----|-----------|---------|--------|
| [BL-001](#bl-001-развести-typemedia-и-kindmedia) | средний | типы / UI | open |
| [BL-002](#bl-002-префикс-media--без-work) | низкий | именование | open |
| [BL-003](#bl-003-proofsyaml--снимок-из-md) | высокий | sync / registry | open |
| [BL-004](#bl-004-obsidian-list-на-всех-relation-полях) | средний | vault / types.json | open |
| [BL-005](#bl-005-guests--notable-participants) | низкий | event fields | open |
| [BL-006](#bl-006-удалить-format--только-products) | — | event fields | **done** |
| [BL-007](#bl-007-validatecontent--целевые-скрипты-валидации) | низкий | testing / docs | open |
| [BL-008](#bl-008-products-обязателен-для-hub-registry) | средний | audit / content | open |
| [BL-009](#bl-009-legacy-date-в-парсере) | низкий | frontmatter | open |

---

## BL-001: развести `type: media` и `kind: media`

**Проблема:** одно слово «media» в двух осях (§2.1 UI vs §2.2 provenance). Путаница при создании карточек и в audit.

**Целевое поведение:**
- `type: media` — узел Lotus, который **сразу открывает lightbox** (поведение навигации).
- `kind: media` — **документирующая работа** (фото/видео/эскиз как узел provenance с `about`).

**Изменения кода (когда возьмём в работу):**
1. `src/types.ts` — комментарии / optional rename в доке (без breaking rename полей).
2. `src/utils/contentLoader.ts` — явная валидация: `kind: media` допустим только с `type: content` (не hub).
3. `scripts/audit/content-audit.js` — отдельные проверки: «lightbox-only без kind», «kind:media без about».
4. Обновить иконки/подсказки в Lotus (если появится UI-хинт для редакторов).

**Не делать:** переименование `kind: media` → `artifact` без миграции всех `media-*` файлов.

---

## BL-002: префикс `media-*` — без `work-*`

**Проблема:** в старых черновиках фигурировал префикс `work-*` для `kind: media`. Канон — только `media-{subject}-{descriptor}` (§10.7).

**Изменения кода:**
1. `scripts/audit/content-audit.js` — warning на id `work-*` в `src/content/`.
2. `scripts/audit/rename-prefixes.js` — маппинг `work-*` → `media-*` (если появятся файлы).
3. Проверить `src/content/_templates/media-work.md` — переименовать в `media.md` (опционально).

**Контент:** миграция не требуется (активных `work-*.md` нет).

---

## BL-003: `proofs.yaml` — снимок из `.md`

**Проблема:** сейчас `npm run sync:fields` **читает** `data/registry/proofs.yaml` и **пишет** в `.md` (обратно `engagements.yaml`). Дублирование, drift, отдельная таблица «поля только в yaml».

**Целевое поведение (как `engagements.yaml`):**
1. Редактор правит **`src/content/proof-*.md`** (и Obsidian `proofs.base`).
2. `npm run registry:sync` (или `sync:proofs-from-notes`) **генерирует** `data/registry/proofs.yaml`.
3. `sync:fields` **не** перезаписывает proof-карточки из yaml (только даты / кросс-ссылки events).

**Изменения кода:**
1. Новый модуль `scripts/sync/proofs-from-notes.js` — по аналогии с `engagements-from-notes.js`.
2. `scripts/sync-fields.js` — убрать или invert блок `proofSync` (yaml → md).
3. `scripts/sync-registry.js` — вызывать сборку proofs.yaml после content.
4. `scripts/audit/content-audit.js` — drift: yaml должен быть **производным**, не md-only/yaml-only как сейчас.
5. `scripts/migrate/proofs.js` — deprecated или one-way export.
6. Поля для переноса в frontmatter proof: `tier`, `scope`, `work`, `eng`, `subject`, `source_en`/`source_ru` (или только `issued_by` + `proof_of`).
7. Шаблон `src/content/_templates/proof.md` — добавить поля `tier`, `scope`, связи `work` / `event` (вместо yaml `eng`).

**Миграция данных:** один прогон yaml → md для всех записей без `site_node`-расхождений; затем freeze ручного редактирования yaml.

---

## BL-004: Obsidian List на всех relation-полях

**Проблема:** в vault часть relation-полей оформлена как Text; ломает Base-фильтры и wiki-links.

**Изменения (без runtime-кода сайта):**
1. `.obsidian/types.json` — для всех полей из §3–§4 с типом **List** / **List (Link)**.
2. Скрипт `scripts/audit/obsidian-types.js` (новый) — сверка types.json с CONTENT-SCHEMA.
3. Документировать в AGENTS.md / lotus-cms.mdc: «relation = всегда List».

**Поля (минимум):** `parent`, `products`, `presented_at`, `organizer`, `client`, `orgs`, `venues`, `partners`, `collaborators`, `proofs`, `proof_of`, `issued_by`, `about`, `related_org`, `collab_events`, `media` (на product/event).

---

## BL-005: `guests` / notable participants

**Проблема:** на событиях бывают VIP-гости, почётные участники, спикеры — сейчас нет отдельного поля; иногда путают с `collaborators` или `partners`.

**Целевое поведение:**
- Новое поле `guests` на `kind: event` — список `org-*` или `collab-*` (или отдельный префикс `person-*` — решить при реализации).
- Provenance: inverse `guest_events` на странице гостя.
- **Не** включать в колонки `hub-registry` (как `partners` / `client`).

**Изменения кода (когда возьмём в работу):**
1. `src/types.ts`, `frontmatter.ts`, `contentLoader.ts` — парсинг `guests`.
2. `src/utils/provenance.ts` + `ProvenancePanel` — секция «Гость / VIP».
3. `src/content/_templates/event.md` — `guests: []`.
4. `scripts/audit/content-audit.js` — валидация id.
5. `CONTENT-SCHEMA.md` — добавить в таблицу ролей §4.2.

**Пока:** использовать `proof-tst-*` для отзывов VIP; роли event-scoped — `orgs` / `venues` / `partners` / `client` / `collaborators` (§4.2 v1.6).

---

## BL-006: удалить `format` — только `products`

**Статус:** выполнено (CONTENT-SCHEMA v1.6).

**Было:** поле `format` дублировало `products`; dossier в `works.yaml` использовал `format_keys`.

**Стало:**
- Канон участия ODA на событии — `products[]` (обязательно для `hub-registry`).
- `engagements.yaml` хранит `products`, не `format`.
- `proof-builders.casesInline` матчит по `products` (в т.ч. дочерние product hub-узлов).
- Миграция: `scripts/migrate/remove-format-field.js`.

---

## BL-007: `validate:content` — целевые скрипты валидации

**Схема / docs:** целостность контента проверяется перед релизом.

**Код сейчас:** в `package.json` есть `npm run audit` → `scripts/audit/content-audit.js` + `PHASE-F-AUDIT.md`. Скриптов `validate:content` и `validate:links` **нет**; `.cursor/rules/testing-standards.mdc` описывает их как будущие.

**Целевое поведение (один из вариантов):**
1. Алиасы `validate:content` → audit; или
2. Отдельные `validate-content.js` / `validate-links.js` с exit code 1 при ошибках; audit остаётся отчётом.

**Пока:** `npm run audit`; aspirational примеры в testing-standards помечены ссылкой на BL-007.

---

## BL-008: `products` обязателен для `hub-registry`

**Схема:** §4.2 — `products` **да** для событий в `hub-registry` (участие ODA, строка реестра).

**Код сейчас:**
- `content-audit.js` — только **warning** `registry-no-products`, не в `REQUIRED.event`;
- `contentLoader` / `tsc` — не блокируют сборку при пустом `products`.

**Целевое поведение:** warning → error в audit; опционально fail в CI; `REQUIRED` для `parent: hub-registry` дополняется `products`.

---

## BL-009: legacy `date:` в парсере

**Схема:** §4.1 — каноническое поле ревизии страницы `updated` (`YYYY.MM.DD`); `date:` deprecated.

**Код сейчас:** `frontmatter.ts` — `lastModified: updated || date` (fallback на старое имя).

**Целевое поведение:** после миграции всех `.md` убрать fallback; audit — предупреждение на `date:` в frontmatter.

**Связанный doc-drift (не код):** `.cursor/ONBOARDING.md`, примеры в agent rules — см. `SYNC-DOCS-LOG.md`.

---

## Выполнено (архив)

| ID | Коммит / дата | Кратко |
|----|---------------|--------|
| BL-006 | 2026.06.02 | Удалён `format`; dossier по `products` |
| — | 2026.06.02 | Event-scoped roles: `orgs`, `venues`, `partners`; provenance inverse; миграция hub-registry |
| — | 2026.06.02 `c48353c` | `date` → `updated`; удалено поле `venue` |
| — | 2026.06.02 `bcf3a40` | `eng-*` / `pleinair-*` → `event-*`; HSE letter; `expo` → `exhibition` |
