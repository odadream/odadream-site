---
name: sync-docs
description: Синхронизировать агентскую документацию с кодом; CONTENT-SCHEMA — канон, drift → BACKLOG
---

# /sync-docs

Выполни полный workflow из **[`content-keeper/SYNC-DOCS.md`](../content-keeper/SYNC-DOCS.md)**.

## Обязательные правила

1. **Канон организации:** [`CONTENT-SCHEMA.md`](../CONTENT-SCHEMA.md) — единый источник правды по полям, связям и реестрам.
2. **Схема ↔ код:** расхождения **не** сглаживай правкой схемы «под парсер» — заведи или обнови пункт в [`content-keeper/BACKLOG.md`](../content-keeper/BACKLOG.md).
3. **Дедупликация:** таблицы полей §3–§4 — **только** в CONTENT-SCHEMA; в `.cursor/rules/` и README — ссылки на канон, без копипасты таблиц.
4. **Источник скриптов:** `package.json` — эталон для `npm run *`; в docs не ссылаться на несуществующие команды без пометки BL-007.
5. **Коммит:** только по явной просьбе пользователя.

## Порядок работы (кратко)

1. Прочитай версию схемы в шапке `CONTENT-SCHEMA.md`.
2. Сверь код: `package.json`, `src/types.ts`, `src/utils/frontmatter.ts`, `scripts/audit/content-audit.js`.
3. Прогони поиск устаревших паттернов (список в SYNC-DOCS.md § «Stale patterns»).
4. Исправь документацию Tier 1–2; Tier 3 — по чеклисту в `SYNC-DOCS-LOG.md`.
5. Новые gap'ы схема↔код → `BACKLOG.md` (BL-0xx).
6. Обнови [`content-keeper/SYNC-DOCS-LOG.md`](../content-keeper/SYNC-DOCS-LOG.md): дата, schema version, checklist, remaining drift.
7. Отчитайся: что изменено, что осталось, новые BL-пункты.

## Не трогать без запроса

- `src/content/*.md` (контент сайта — не часть sync-docs, кроме явного drift в примерах в rules)
- `versions.json` / релиз
- `.obsidian/`, `content-keeper/_pdf-extract.txt`, личные заметки
