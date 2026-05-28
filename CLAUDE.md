# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**ODA.dream** — bilingual (EN/RU) art-portfolio SPA built around a "Blossoming Lotus" spatial navigation graph. React 18 + TypeScript (strict) + Vite + Tailwind + Framer Motion. Deployed as a static site to GitHub Pages at odadream.art.

## Commands

```bash
npm run dev              # Vite dev server on 0.0.0.0:5173
npm run build            # assets:generate → tsc → vite build → dist/
npm run preview          # serve dist/

npm run assets:generate  # Procedural SVG backgrounds for every node in src/content/. Run after adding/renaming nodes.
npm run assets:clean     # Wipe generated SVGs.
npm run assets:map       # Write scripts/CONTENT_TREE.md — hierarchy dump + orphan detection.

npm run version:sync     # Propagate versions.json → package.json, src/constants.ts SITE_VERSION, README badge, metadata.json, changelog.md
npm run dates:sync       # Update frontmatter `date` from git last-commit date for each .md
npm run registry:sync    # Sync content registry
```

There is no test runner, linter, or formatter wired up. `tsc --noEmit` (run inside `npm run build`) is the only static check.

## Architecture

### File-based CMS → Lotus Graph

Content lives in `src/content/*.md`. Each file is one node; the graph is rebuilt at module-load time, not at runtime per render.

Pipeline (all under `src/utils/`):

1. `contentLoader.ts` — eager-globs `src/content/*.md` via Vite, calls the parser/processor for each, then `buildUnifiedGraph(STATIC_ROOT)` stitches every node into a single tree using `parent` fields.
2. `frontmatter.ts` — YAML frontmatter parser.
3. `contentProcessor.ts` — splits EN/RU on `---RU---`, extracts media references and `[[wiki-links]]` (both node embeds and media embeds).
4. `nodeHelpers.ts` — graph traversal (`findNode`, etc).

Output: `ROOT_NODE` exported from `src/constants.ts`. Everything downstream — `App.tsx`, `NavigationContext`, `LotusGrid`, sidebar, breadcrumbs — operates on this in-memory tree. Routing is query-param only (`?id=node-id`); there is no router library.

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
- `![[url]]` / `![[url | title]]` / `![[url | title | poster_url]]` — embeds a media node (video/audio/image) inline; the lightbox handles playback.

Embedded nodes are how cross-references and dynamic grid composition work — they don't move the file, they just surface it as a petal on this node.

### State, theming, components

- Global state: single `NavigationContext` (`src/context/NavigationContext.tsx`) — path stack, language, theme.
- Themes: CSS custom properties on `<html data-theme="...">`, defined in `src/index.css`. Currently `dark | light | ocean | matrix`, but `ENABLE_THEME_SWITCHER` in `constants.ts` is `false`, so the toggle is hidden. To add a theme: define the `[data-theme="x"]` block in `index.css`, extend the `Theme` union in `types.ts`, and add it to the cycle array in `NavigationContext.tsx`.
- Components: `LotusGrid` (main 3×3 navigator — the largest component), `LotusMap` (fractal site-map view, toggled from the sidebar), `LotusSidebar`, `TextPanel`, `Lightbox` (lazy-loaded), `HeaderTabs`, `Breadcrumbs`, `CyberText`, `ErrorBoundary`. Custom hooks: `useLotusLogic`, `useImageFallback`, `useScrollOverflow`.
- **Lotus Map pyramid** (`lotusMode === "map"`): fractal 3×3 nesting with four display modes (L0–L1 `full`, L2 terminal `micro`, L3 `density`, deeper `aggregate`). View model in `src/utils/mapPyramid.ts`; hub double-click/tap zooms `zoomRoot`. Atom budget (`usableSize/9|27|81`) collapses deep branches when cells would be smaller than `oda_map_min_atom_px`. Atomic calibration UI only when `import.meta.env.DEV && MAP_ATOMIC_DEBUG`.

### Procedural assets

`scripts/generate-assets.js` reads all node IDs and emits a unique SVG per node into `public/images/nodes/{id}.svg`, seeded by ID so output is stable. Without this step nodes have no background. A node can override the generated SVG by setting `image: /images/content/custom.jpg` in frontmatter. **Always re-run `npm run assets:generate` after adding or renaming a node** — `npm run build` does it automatically; `npm run dev` does not.

### Version management

`versions.json` is the source of truth — `current` plus a `history[]` of bilingual changelog entries. `npm run version:sync` fans the version out to `package.json`, `src/constants.ts` (`SITE_VERSION`), `README.md` badge, `metadata.json`, `versions.md` (derived human-readable history), and `src/content/changelog.md`. Bump by editing `versions.json` and running the sync, not the other way around.

### CI/CD

`.github/workflows/deploy.yml`: push to `main` → build → deploy to `gh-pages` → optionally create a GitHub Release if the version changed. No staging environment.

## Conventions

- Components: functional only, PascalCase filenames; hooks `use*`; node IDs and content filenames are kebab-case and must match (`id: lectures-neuroplasticity` ↔ `lectures-neuroplasticity.md`).
- Dates in frontmatter use dots: `YYYY.MM.DD` (not dashes).
- Vite path alias: `@/*` → `src/*`.
- The `content-keeper/` directory and `scripts/_archive/` are out-of-band tools and archived scripts respectively — not part of the runtime bundle.

## Before committing content changes

1. Frontmatter valid, `parent` resolves, `---RU---` present.
2. `npm run assets:map` — no orphans.
3. `npm run assets:generate` if any nodes were added/renamed.
4. `npm run build` to confirm `tsc` is clean.
