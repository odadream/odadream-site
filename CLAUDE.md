# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**ODA.dream** — bilingual (EN/RU) art-portfolio SPA built around a "Blossoming Lotus" spatial navigation graph. React 18 + TypeScript (strict) + Vite + Tailwind + Framer Motion. Deployed as a static site to GitHub Pages at odadream.art.

## Экосистема ODA.dream

Часть более широкой экосистемы студии (цены, кейсы событий, заявки на премии, тех-база, патент). Корневая карта — `D:\YandexDisk\_ODA2\CLAUDE.md`. Соседние сайты — `..\CLAUDE.md`. Конвейер заявок на премии, использующий этот сайт как источник портфолио, — `D:\YandexDisk\_ODA2\Премии\CLAUDE.md`.

## Commands

```bash
npm run dev              # Vite dev server on 0.0.0.0:5173
npm run build            # assets:generate → tsc → vite build → dist/
npm run preview          # serve dist/

npm run assets:generate  # Procedural SVG backgrounds for every node in src/content/. Run after adding/renaming nodes.
npm run assets:clean     # Wipe generated SVGs.
npm run assets:map       # Write scripts/CONTENT_TREE.md — hierarchy dump + orphan detection.

npm run version:sync     # Propagate versions.json → package.json, src/constants.ts SITE_VERSION, README badge, metadata.json, changelog.md
npm run dates:sync       # Set frontmatter `updated` from file mtime (page revision, not event date)
npm run registry:sync    # Sync content registry

npm run audit            # scripts/audit/content-audit.js — provenance + dup + dangling-ref report → content-keeper/PHASE-*-AUDIT.{md,json}
npm run photos:add ./folder  # pack-image.js + photo-pipeline.yaml → WebP + work-*.md
```

There is no test runner, linter, or formatter wired up. `tsc --noEmit` (run inside `npm run build`) is the only static check.

## Specialized guides

`.cursor/rules/*.mdc` — domain-specific rules auto-loaded by Cursor; treat as supplements to this file:
- `lotus-cms.mdc` — file-based CMS details (frontmatter, hierarchy, naming)
- `project-architecture.mdc`, `content-manager.mdc`, `devops-lead.mdc`, `testing-standards.mdc`, `code-quality.mdc`, `deploy-release.mdc`

Schema source of truth remains `CONTENT-SCHEMA.md` — rules are practical supplements, not overrides.

## Migration / audit tooling

- `scripts/audit/content-audit.js` (`npm run audit`) — generates `content-keeper/PHASE-*-AUDIT.{md,json}` plus a TODO of stub nodes; read-only.
- `scripts/audit/dump-structure.js` — snapshot of the current lotus tree to `content-keeper/STRUCTURE-CURRENT.md`.
- `scripts/audit/restructure.js` — declarative re-parenting / renames / stubs (dry-run by default; `--write` to apply, `--only=<phase>` to scope).
- `scripts/migrate/*` — one-off migrations per kind (products / organizers / engagements / proofs); shared helpers in `scripts/migrate/lib.js` (`readMd`, `writeMd`, `listContentFiles`).
- `scripts/import-from-obsidian.js` — pull engagements out of an Obsidian vault into `data/registry/engagements.yaml` (`--dry-run`, `--merge`, `--vault PATH`; `OBSIDIAN_EVENTS` env).

## Architecture

### File-based CMS → Lotus Graph

Content lives in `src/content/*.md`. Each file is one node; the graph is rebuilt at module-load time, not at runtime per render.

Pipeline (all under `src/utils/`):

1. `contentLoader.ts` — eager-globs `src/content/*.md` via Vite, calls the parser/processor for each, then `buildUnifiedGraph(STATIC_ROOT)` stitches every node into a single tree using `parent` fields.
2. `frontmatter.ts` — YAML frontmatter parser.
3. `contentProcessor.ts` — splits EN/RU on `---RU---`, extracts media references and `[[wiki-links]]` (both node embeds and media embeds).
4. `nodeHelpers.ts` — graph traversal (`findNode`, etc).

Output: `ROOT_NODE` and a flat `NODE_REGISTRY: ReadonlyMap<string, LotusNode>` (both exported from `src/constants.ts`). Everything downstream — `App.tsx`, `NavigationContext`, `LotusGrid`, sidebar, breadcrumbs, `provenance.ts` — operates on these in-memory structures. Routing is query-param only (`?id=node-id`); there is no router library.

### Node model

`LotusNode` (in `src/types.ts`) — fields: `id`, `parentId`, `title`/`shortTitle`/`description` as `LocalizedString { en, ru }`, `type` ∈ `hub | content | media | action`, optional `imageUrl`/`mediaUrl`/`mediaType`, `children`, `tags`, `order`, runtime `_isEmbedded`.

Graph invariants enforced by the loader:
- Root is `home` (defined in the skeleton inside `constants.ts`).
- Every non-root node MUST have a parent that exists; otherwise it becomes an orphan and vanishes from navigation. Use `npm run assets:map` to surface orphans.
- `LOTUS_GRID_LIMIT = 8` — the 3×3 grid minus center. Excess children are trimmed.
- `LOTUS_SORT_MODE` in `constants.ts` controls grid ordering: `"by-mention"` (current — structural children first by `order`, then embeds/media interleaved in text order) vs `"by-type"`.

### Bilingual content

Markdown body splits on the literal separator `---RU---`. Frontmatter uses parallel keys: `title_en` / `title_ru`. Both must be present; missing `---RU---` silently drops the Russian view. Language is held in `NavigationContext`.

### Wiki-link syntax (extension over standard Markdown)

- `[[node-id]]` or `[[node-id|label]]` — embeds another node into the current node's Lotus grid (`_isEmbedded: true`).
- `![[url]]` / `![[url | title]]` / `![[url | title | poster_url]]` — embeds an inline media node from a raw URL; the lightbox handles playback.
- `![[media:asset-id]]` / `![[media:asset-id | Custom Label]]` — preferred form; resolves the asset from `src/data/media.ts` by key, inheriting its URL, poster, and bilingual title. Use this instead of raw URLs to keep media centralised.

Wiki-links in frontmatter YAML (e.g. `organizer: ["[[org-cipr]]"]`) are stripped to plain IDs by `unwrapWikilink` in `frontmatter.ts`. You can write them with or without brackets.

Embedded nodes are how cross-references and dynamic grid composition work — they don't move the file, they just surface it as a petal on this node.

### Media registry

`src/data/media.ts` — single source of truth for reusable media assets (video embeds, images, audio). Each entry: `url`, optional `poster`, bilingual `title`, optional `subject[]` (node IDs for provenance cross-reference), `subkind`, and `mirrors`. Reference from content via `![[media:key-name]]`. The `media:` frontmatter field (a plain string list of asset IDs, not wiki-links) attaches media to a node for provenance display in `ProvenancePanel`.

### Provenance model

Nodes carry semantic relationship fields in frontmatter — all are lists of node IDs (plain strings or `[[wiki-link]]` syntax):

| Field | Direction | Description |
|-------|-----------|-------------|
| `kind` | — | Semantic role: `product \| event \| organizer \| collaboration \| proof \| media` |
| `subkind` | — | Data-driven subtype; see `src/data/taxonomy.ts` |
| `presented_at` | product→event | Events where this product was shown |
| `products` | event→product | Products shown at this event — **required** for hub-registry (replaces deprecated `format`) |
| `orgs` | event→org | Organizer(s) — canonical; `organizer` is derived mirror for UI compat |
| `venues` | event→org | Venue(s) where the event took place |
| `partners` | event→org | Partner / sponsor (in-kind, tech support) |
| `client` | event→org | Commercial client (distinct from organizer) |
| `collaborators` | product/event→collab | Equal co-creative partners |
| `organizer` | event→org | **Derived** from `orgs` by `sync:fields`; do not hand-edit |
| `proofs` | subject→proof | Evidence nodes (awards, press, etc.) |
| `proof_of` | proof→subject | What this proof attests |
| `about` | media→subject | What media work documents |
| `issued_by` | proof→org | Who issued this proof |

`src/utils/provenance.ts` builds a bidirectional index at module load from `NODE_REGISTRY` and exposes `getProvenance(node, registry)` → `Provenance` (direct + inverse links). `ProvenancePanel` renders this. The index is cached by registry reference identity.

### Taxonomy

`src/data/taxonomy.ts` — `TAXONOMY[kind][subkind]` gives `{ label: LocalizedString, icon: string, color: string }` for badge rendering. Unknown subkinds get a graceful fallback via `subkindMeta(kind, subkind)`. To add a subkind, append to the relevant kind's map — no TS changes elsewhere.

### Content file naming conventions

File IDs follow semantic prefixes by kind:
- `hub-*` — navigation hubs
- `event-*` — events (suffix `YYYY` or `YYYY-MM`)
- `org-*` — organizers / venues
- `proof-award-*`, `proof-let-*`, `proof-tst-*`, `proof-press-*` — proofs by subkind
- `collab-*` — collaborations

### State, theming, components

- Global state: single `NavigationContext` (`src/context/NavigationContext.tsx`) — path stack, language, theme.
- Themes: CSS custom properties on `<html data-theme="...">`, defined in `src/index.css`. Currently `dark | light | ocean | matrix`, but `ENABLE_THEME_SWITCHER` in `constants.ts` is `false`, so the toggle is hidden. To add a theme: define the `[data-theme="x"]` block in `index.css`, extend the `Theme` union in `types.ts`, and add it to the cycle array in `NavigationContext.tsx`.
- Components: `LotusGrid` (main 3×3 navigator — the largest component), `LotusMap` (fractal site-map view, toggled from the sidebar), `LotusSidebar`, `TextPanel`, `Lightbox` (lazy-loaded), `HeaderTabs`, `Breadcrumbs`, `CyberText`, `ErrorBoundary`. Custom hooks: `useLotusLogic`, `useImageFallback`, `useScrollOverflow`.
- **Lotus Map** (`lotusMode === "map"`): phased rebuild. **Phase 1** — flat fractal subdivision to atomic cells in `src/utils/fractalGrid.ts` + `src/components/map/FractalMapCanvas.tsx` (arbitrary split order, 1px inner borders, no graph/text yet). Legacy pyramid code remains in `src/utils/mapPyramid.ts` for later phases.

### Procedural assets

`scripts/generate-assets.js` reads all node IDs and emits a unique SVG per node into `public/images/nodes/{id}.svg`, seeded by ID so output is stable. Without this step nodes have no background. A node can override the generated SVG by setting `image: /images/content/custom.jpg` in frontmatter. **Always re-run `npm run assets:generate` after adding or renaming a node** — `npm run build` does it automatically; `npm run dev` does not.

### Version management

`versions.json` is the source of truth — `current` plus a `history[]` of bilingual changelog entries. `npm run version:sync` fans the version out to `package.json`, `src/constants.ts` (`SITE_VERSION`), `README.md` badge, `metadata.json`, `versions.md` (derived human-readable history), and `src/content/changelog.md`. Bump by editing `versions.json` and running the sync, not the other way around.

### CI/CD

`.github/workflows/deploy.yml`: push to `main` → build → deploy to `gh-pages` → optionally create a GitHub Release if the version changed. No staging environment.

## Content schema

**[`CONTENT-SCHEMA.md`](CONTENT-SCHEMA.md)** — canonical reference for card types (`kind`), frontmatter fields, Obsidian property types, provenance relations, registry fields, and sync commands (`sync:fields`, `registry:sync`). **Schema wins over code** for how content is organized; parser/runtime drift is tracked in [`content-keeper/BACKLOG.md`](content-keeper/BACKLOG.md), not by silently editing the schema to match broken behavior.

## Conventions

- Components: functional only, PascalCase filenames; hooks `use*`; node IDs and content filenames are kebab-case and must match (`id: lectures-neuroplasticity` ↔ `lectures-neuroplasticity.md`).
- Dates: new structured fields (`date_start`, `date_end`, `publication_date`) use ISO `YYYY-MM-DD` for Obsidian date-picker compatibility. Legacy `date` fields in older content may still be `YYYY.MM.DD` — leave them unless doing an intentional migration.
- Vite path alias: `@/*` → `src/*`.
- The `content-keeper/` directory and `scripts/_archive/` are out-of-band tools and archived scripts respectively — not part of the runtime bundle.

## Before committing content changes

1. Frontmatter valid: `id` matches filename, `parent` resolves, `---RU---` present.
2. Provenance IDs (`orgs`, `venues`, `partners`, `client`, `products`, `proofs`, etc.) must point to existing node IDs — typos silently produce empty provenance. Roles are **event-scoped** — same `org-*` can be `partners` on one event and `orgs` on another.
3. New media assets added to `src/data/media.ts` before referencing them with `![[media:id]]`.
4. `npm run assets:map` — no orphans.
5. `npm run assets:generate` if any nodes were added/renamed.
6. `npm run build` to confirm `tsc` is clean.

## Content enrichment workflow (bottom-up)

Walking ~174 nodes leaf-first (atomic products/events → category hubs → root). Per-leaf process:

1. Source materials tracked in `content-keeper/CONTENT-SOURCES.yaml` (path to project folder / canon text — so future auto-update can find them).
2. Outstanding info needs go to `INFO-DEBTS.md` at repo root as `DEBT-NNN` entries.
3. Status grades 🟢/🟡/🔴 come from `npm run audit` checklist (≥60 EN+RU words + per-kind required fields → 🟢).
4. New images go through pack-image.js (Sharp → WebP master + thumb, 1920/800 max edge, q=82) into `public/images/content/works/`, then registered in `src/data/media.ts` before being referenced via `![[media:id]]`.

**Do not draft hub bodies before their leaves are populated** — describing a category before knowing what it contains produces aspirational/fantasy content. Established rule from prior sessions.

## Persistent memory

Long-running context lives in `C:\Users\daler\.claude\projects\D--YandexDisk--ODA2------odadream-site\memory\` — index in `MEMORY.md`, one file per memory. Check there for prior decisions and user-feedback rules before re-deriving conventions from code.
