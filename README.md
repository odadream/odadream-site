# ODA.dream V2 — editorial static site

Astro/TypeScript static multipage site for GitHub Pages. This is a **development branch only**. `main` keeps publishing the V1 site until content, media rights and visual acceptance are signed off. Do not point the public domain at this branch yet.

## Local use

Requires Node 22.19+ (CI uses Node 24). Run `npm ci`, then `npm run dev`. Preview the English home at `/en/`, Russian home at `/ru/`, or the root legacy bridge at `/`. Run `npm test`, `npm run content:check`, `npm run check`, `npm run build`, `npm run test:e2e` before review.

## Structure

- `src/data/site.ts`: typed curated works, formats, cases, evidence, people, organizations, media, localized fields, source/rights/publication metadata.
- `src/data/legacy-map.json`: 238 explicit old-ID dispositions. Generated once from the read-only old corpus using `npm run legacy:generate -- <path-to-old-src/content>`; the build does not need the old tree.
- `src/pages/`: generated language pages, custom 404 and noindex unresolved-ID page.
- `src/data/lastmod.json`: page-specific editorial modification dates used by sitemap; update only when the corresponding language page materially changes.
- `src/styles/tokens.css` and `global.css`: V5 palette/typography/spacing direction, rebuilt as a smaller component system. Fonts are self-hosted with Latin and Cyrillic subsets.
- `public/images/content/`: only seven curated local images, kept at their existing public URLs. All are marked `rights: review` pending approval. No restricted video was copied.

## Product and content decisions

- `docs/SITE-PRINCIPLES.md`: homepage as an editorial overview with drill-down paths, language-specific social links and content/visual rules.
- `docs/PROJECT-BACKLOG.yaml`: machine-readable backlog with stable IDs, priority, status, dependencies and acceptance criteria. Update it with the principles document when scope or decisions change.
- `docs/CONTENT-AND-CMS.md`: current static content model, what was inherited, CMS limitations, and the Golem/MindDB integration status.
- `docs/DESIGN-SYSTEM-SOURCE.md`: V5 source and shared token/component contract.

The current content layer is curated and hardcoded in TypeScript; it is not an admin CMS and has no database connection. The planned move to Astro Content Collections is tracked as `CMS-01`.

The V1 sources, builds and V5 snapshot are separately archived in `../odadream-site-v1-backup-2026-09-22`. The exact observed remote `origin/main` is `642bbb2` (`archive/published-site-v1.2.2`); local `main` is 20 commits ahead at `d4cb306` (`archive/site-v1.2.2`). `design/v5-approved` retains the approved prototype. Existing untracked files from the original worktree were copied there and never removed from their source.

## Release gate

1. Editorial approval of both language versions, the four case records, organization roles, and availability claims.
2. Written rights/consent review for each image. Replace or remove any image not cleared. Do not treat `access: public` in the old CMS as a license.
3. Desktop/mobile visual review and keyboard/lightbox audit; then review the branch build artifact.
4. Resolve the remaining 172 old media URLs using `docs/media-decisions.json`. `npm run release:check` must pass before cutover.
5. Only after approval: open a PR to `main`. The branch contains a deployment workflow that activates only on `main`, and itself runs the release gate before deploying. Keep the previous tag/build available for rollback.
6. After deployment: inspect HTTP HTML and old `?id` links, submit `sitemap-index.xml`, monitor Search Console and analytics. GitHub Pages cannot send per-query 301 redirects; add an external HTTP redirect layer only if traffic data justifies it.

`/materials/` is deliberately absent. Old records not selected for V2 resolve to `/legacy/unavailable/` with `noindex`, never silently to the home page. The root renders English HTML and has canonical `/en/`; its small script handles old query links, including `internal=true` variants.
