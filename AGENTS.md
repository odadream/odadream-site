# ODA.dream V2 working rules

This branch is a clean Astro static site, not the Lotus CMS. Do not copy the old React graph, 238 legacy Markdown records or generated SVG nodes into this tree. The old sources remain read-only under the archive tag and local backup.

Keep the V5 visual grammar: warm near-black, restrained green signal, JetBrains Mono for reading, Manrope for headings, disciplined spacing and lines, material before interface. The canonical tokens are in `src/styles/tokens.css`; do not add ad-hoc inline styles.

Content is bilingual in `src/data/site.ts`. Keep work, format, case/event, evidence, person, organization and media roles distinct. Every public assertion needs a source; `production` never means bookable. R&D and archival status must be explicit. Do not call outreach contacts partners. Media access is not a usage license; all copied images remain under rights review until approved.

Before changing URLs, edit `scripts/generate-legacy-map.mjs` overrides and regenerate/verify the explicit manifest. Unknown or uncurated legacy IDs must reach the noindex unresolved page, never silently the home page. Preserve `?id` compatibility on `/` and paired EN/RU routes. No SPA fallback or router.

Update the specific localized entry in `src/data/lastmod.json` when page content materially changes; do not replace it with a build timestamp.

Before a review commit: `npm test`, `npm run content:check`, `npm run check`, `npm run build`, `npm run test:e2e`. The release gate `npm run release:check` is expected to fail until editorial approval and media URL decisions are recorded. The V2 workflow verifies and uploads an artifact only; it must not deploy to GitHub Pages. Do not push, create a PR, switch the domain or alter `main` without explicit owner approval.
