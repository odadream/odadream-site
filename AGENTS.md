# ODA.dream V2 working rules

This branch is a clean Astro static site, not the Lotus CMS. Do not copy the old React graph, 238 legacy Markdown records or generated SVG nodes into this tree. The old sources remain read-only under the archive tag and local backup.

Keep the V5 visual grammar: warm near-black, restrained green signal, JetBrains Mono for reading, Manrope for headings, disciplined spacing and lines, material before interface. The canonical tokens are in `src/styles/tokens.css`; do not add ad-hoc inline styles.

The profile contract is in `docs/DESIGN-TOKENS.md`: profile inputs → semantic roles → components. Use `--signal-*` for both navigation and page accents, `--grid-*` for page/specimen grids, and `TechnicalMark` for technical symbols. Statistics use `RecordStamp tone="reference"`, not a raised document panel. Filled Manrope 800 folios belong only to the background.

Before adding or changing presentation patterns, read `docs/DESIGN-GUIDE.md`. It defines field semantics for every content type, the distinction between positional codes and stable IDs, and the functional use of marginal notes, vertical position codes, folios, media registers and record stamps. Use the shared `SectionRail`, `StatisticsStamp`, `RecordStamp` and `MediaFigure` components and keep their live examples in `/design-system/` synchronized. Never invent technical data to fill a decorative field.

Content is bilingual in `src/data/site.ts`. Keep work, format, case/event, evidence, person, organization and media roles distinct. Every public assertion needs a source; `production` never means bookable. R&D and archival status must be explicit. Do not call outreach contacts partners. Media access is not a usage license; all copied images remain under rights review until approved.

Treat `docs/SITE-PRINCIPLES.md` as the approved information-architecture and homepage contract. Treat `docs/PROJECT-BACKLOG.yaml` as the canonical machine-readable task list. When an accepted decision changes page purpose, section order, content model or scope, update both documents in the same change. Update backlog status/acceptance when work progresses; do not record speculative decisions as approved rules. `docs/CONTENT-AND-CMS.md` describes the current data layer and integrations; keep it factual as architecture changes.

Before changing URLs, edit `scripts/generate-legacy-map.mjs` overrides and regenerate/verify the explicit manifest. Unknown or uncurated legacy IDs must reach the noindex unresolved page, never silently the home page. Preserve `?id` compatibility on `/` and paired EN/RU routes. No SPA fallback or router.

Update the specific localized entry in `src/data/lastmod.json` when page content materially changes; do not replace it with a build timestamp.

Before a review commit: `npm run format:check`, `npm test`, `npm run content:check`, `npm run check`, `npm run build`, `npm run test:e2e`. The release gate `npm run release:check` is expected to fail until editorial approval and media URL decisions are recorded. The V2 workflow verifies and uploads an artifact only; it must not deploy to GitHub Pages. Do not push, create a PR, switch the domain or alter `main` without explicit owner approval.
