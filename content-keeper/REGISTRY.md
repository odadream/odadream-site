# Event Registry (SSOT) | Реестр событий

**Single source of truth** for ODA.dream engagements: commercial clients, expert invitations, awards, and organizations.

**Единый источник правды** об участиях ODA.dream: коммерческие заказы, экспертные приглашения, награды и организации.

---

## Where data lives | Где живут данные

| Layer | Path | Role |
|-------|------|------|
| **Master data** | `data/registry/organizations.yaml` | Clients, venues, institutions (`kind`) |
| **Master data** | `data/registry/engagements.yaml` | One row per ODA participation (`relationship`) |
| **Sync script** | `scripts/sync-registry.js` | Generates Lotus CMS files |
| **Site hubs** | `src/content/registry*.md` | Tables + navigation under `world` |
| **Detail cards** | `src/content/eng-*.md`, `org-*.md` | Wiki-link targets (`[[eng-…]]`, `[[org-…]]`) |
| **External archive** | YandexDisk `_ODA2/События`, Obsidian `Chudodeystvo/События` | Import source only — **not** runtime |

---

## Add a new engagement | Добавить участие

1. Add organizations to `organizations.yaml` if missing:

```yaml
- id: org-example
  name_ru: Пример
  name_en: Example
  kind: client   # client | venue | institution | partner
```

2. Add one row to `engagements.yaml`:

```yaml
- id: eng-2026-example
  date: 2026-06-01
  city: Moscow
  relationship: commercial   # commercial | invited | award | competition | internal
  format: lecture            # neurobattle | mindshow | lecture | installation | performance | ...
  orgs: [org-example]
  venues: [org-cipr]
  title_ru: "Краткое название"
  title_en: "Short title"
  card: true                 # true → generate eng-*.md page
  showcase: false            # true → candidate for Events showcase hub
  letter: false              # true → linked from letters archive
  site_media: [/images/content/example.webp]
  links:
    obsidian: "События/2026-..."
    yandex: "_ODA2/События/..."
```

3. Run sync:

```bash
npm run registry:sync
npm run assets:generate   # new node IDs need SVG backgrounds
npm run assets:map        # check orphans
```

4. On other pages, **link** instead of duplicating names:

```markdown
[[eng-2026-example|Short title]]
[[org-example|Example]]
See [[registry-commercial|Commercial registry]]
```

---

## `relationship` field | Поле relationship

| Value | Meaning on site | Hub |
|-------|-----------------|-----|
| `commercial` | Paid commission | `registry-commercial` |
| `invited` | Expert invitation (no vendor fee) | `registry-expert` |
| `award` | Prize / recognition | `registry-expert` |
| `competition` | Festival / open call | `registry-expert` |
| `internal` | Internal / R&D | registry table only |

---

## Auto-updated collab blocks | Авто-блоки в collab

Markers in `collab-business.md` and `collab-agents.md` are filled by `registry:sync`:

```markdown
<!-- registry:commercial-list -->
...generated...
<!-- /registry:commercial-list -->
```

Do not edit list items between markers manually.

---

## Two contours | Два контура

1. **Registry** — full accumulated log (tables on `registry`, optional `eng-*` / `org-*` cards).
2. **Events** (`src/content/events.md`) — curated showcase (5–15 stories). Link showcase cases to `eng-*` ids; do not copy facts as prose lists.

---

## Obsidian import (optional) | Импорт из Obsidian

```bash
# Default vault path (override with OBSIDIAN_EVENTS env)
npm run registry:import-obsidian

# Dry run
node scripts/import-from-obsidian.js --dry-run

# Merge without overwriting manual fields
node scripts/import-from-obsidian.js --merge
```

Expected note frontmatter in `Chudodeystvo/События`:

- `site_id` → maps to `id` in `engagements.yaml`
- `relationship`, `orgs`, `format`, `date`, `city`

Manual YAML edits are preserved when using `--merge` unless the note sets `registry_overwrite: true`.

---

## Editor rules | Правила для редакторов

- **Do not** paste brand lists on `collab-*`, `lectures`, or `cv` — use `[[registry-*]]` or `[[eng-*]]`.
- **Do not** add 80+ events to the Events showcase hub.
- **Do** keep EN/RU titles in YAML; sync generates bilingual `.md` bodies.
- **Grid limit:** only `card: true` engagements appear as children of `registry-commercial` / `registry-expert` (max 8 per hub). Full history stays in `registry.md` tables.

---

## Commands reference

```bash
npm run registry:sync
npm run registry:import-obsidian
npm run assets:generate
npm run assets:map
npm run build
```
