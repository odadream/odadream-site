# SYNC-DOCS Log | Журнал синхронизации документации

**Last run:** 2026.06.02 · **Schema:** CONTENT-SCHEMA v1.6 · **Command:** `/sync-docs`

**Playbook:** [`SYNC-DOCS.md`](SYNC-DOCS.md) · **Cursor:** [`.cursor/commands/sync-docs.md`](../.cursor/commands/sync-docs.md)

**Приоритет:** [`CONTENT-SCHEMA.md`](../CONTENT-SCHEMA.md) — канон организации контента. Расхождение схема ↔ код → [`BACKLOG.md`](BACKLOG.md), не правка схемы «под парсер».

---

## Checklist

- [x] Инвентаризация объёма: канон `CONTENT-SCHEMA.md` + `CLAUDE.md`; операционка `content-keeper/`; агенты `.cursor/rules/` + `AGENTS.md`
- [x] Дедупликация: event/registry поля — только в CONTENT-SCHEMA; rules → ссылка на канон, без копии §4.2
- [x] Code-to-docs: `format` / `format_keys` удалены из docs; `products`, event-scoped roles (`orgs`, `venues`, `partners`)
- [x] Code-to-docs: `date` → `updated` в примерах frontmatter и в `sync-registry.js` (генерация hub-registry)
- [x] Противоречия: `REGISTRY.md` переписан (без `eng-*`, `registry-commercial`, `format`)
- [x] Противоречия: `testing-standards.mdc` — `npm run audit` вместо несуществующего `validate:content`
- [x] Слияние: не выполнялось (дробление не требуется; канон уже централизован)
- [x] Ссылки: CONTENT-SCHEMA §18, BACKLOG BL-006, REGISTRY.md cross-links
- [x] Stubs: `SYNC-DOCS-LOG.md` (этот файл); BL-001–005 остаются в BACKLOG.md
- [x] Приоритет схемы: footer CONTENT-SCHEMA §18; BL-007–009 (схема ↔ код)
- [x] `content-manager.mdc` — `updated` в примерах; ссылка на канон без дубля §4.2
- [x] `README.md`, `AGENTS.md`, `CLAUDE.md` — CONTENT-SCHEMA + BACKLOG
- [x] Команда `/sync-docs`: `.cursor/commands/sync-docs.md` + playbook `SYNC-DOCS.md`

---

## Remaining drift (не блокирует релиз)

- [ ] `.cursor/ONBOARDING.md`, `HISTORY_KEEPER.md` — версия 1.2.0, примеры `date:` (низкий приоритет)
- [ ] `content-keeper/STRUCTURE-CURRENT.md` — снимок с `eng-*` (исторический; см. `npm run assets:map`)
- [ ] `content-keeper/STRUCTURE-PROPOSED.md` — архив предложений Phase H
- [ ] BL-001–005, BL-007–009 в BACKLOG — открытые задачи кода/vault
- [x] `testing-standards.mdc` — aspirational `validate:*` помечены BL-007 (см. § Build Validation)

---

## Agent quick reference

| Вопрос | Ответ |
|--------|--------|
| Схема полей | `CONTENT-SCHEMA.md` |
| Реестр событий | `content-keeper/REGISTRY.md` |
| Архитектура (кратко) | `CLAUDE.md` |
| Аудит контента | `npm run audit` → `PHASE-F-AUDIT.md` |
| Долг CMS | `content-keeper/BACKLOG.md` |
