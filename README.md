# ODA.dream V2 — editorial static site

Astro/TypeScript static multipage site for GitHub Pages. This is a **development branch only**. `main` keeps publishing the V1 site until content, media rights and visual acceptance are signed off. Do not point the public domain at this branch yet.

## Local use

On Windows, double-click `start-local-v2.cmd` in the project root to start or restart the editorial server at `http://127.0.0.1:5177/ru/`. It waits for the server to respond, opens the site, and runs Astro in the background. Logs are stored in the ignored `.local-server/` directory. An unrelated process on port 5177 is reported and left running. Node.js and installed dependencies (`npm ci`) are required.

Requires Node 22.19+ (CI uses Node 24). Run `npm ci`, then `npm run dev`. The dev server is an editorial preview with a notice and noindex; it retains review material. The production build contains only the explicit publication packet and its allowed files. Preview the English home at `/en/`, Russian home at `/ru/`, or the root legacy bridge at `/`. Run `npm run format:check`, `npm test`, `npm run content:check`, `npm run check`, `npm run build`, `npm run test:e2e` before review.

## Structure

- `src/data/publication-plan.ts`, `src/lib/publication-scope.ts`, `src/data/catalogue.ts`: versioned candidate IDs, shared publication checks, public projection and dev review mode.
- `src/data/editorial.ts`: sourced bilingual method, format conditions and cooperation scenarios; source SHA-256 snapshots remain internal.
- `src/data/site.ts`: typed curated works, formats, cases, evidence, people, organizations, media, localized fields, source/rights/publication metadata.
- `src/data/legacy-map.json`: 238 explicit old-ID dispositions. Generated once from the read-only old corpus using `npm run legacy:generate -- <path-to-old-src/content>`; the build does not need the old tree.
- `src/pages/`: generated language pages, custom 404 and noindex unresolved-ID page. The design stand lives in src/views/DesignSystem.astro and is injected only in dev. The root fetches the static `/legacy-map.json` only for an `?id=` request.
- `src/data/lastmod.json`: page-specific editorial modification dates used by sitemap; update only when the corresponding language page materially changes.
- `src/styles/tokens.css` and `global.css`: V5 palette/typography/spacing direction, rebuilt as a smaller component system. Fonts are self-hosted with Latin and Cyrillic subsets.
- `public/images/content/`, `public/images/works/`, `public/images/recognition/`, and `public/video/`: curated work images, document previews and video previews. The owner authorized selected work media display on 2026-10-05. Document permissions and editorial publication remain separate; the release gate still blocks deployment.

## Product and content decisions

- `docs/SITE-PRINCIPLES.md`: homepage as an editorial overview with drill-down paths, language-specific social links and content/visual rules.
- `docs/PROJECT-BACKLOG.yaml`: machine-readable backlog with stable IDs, priority, status, dependencies and acceptance criteria. Update it with the principles document when scope or decisions change.
- `docs/CONTENT-AND-CMS.md`: current static content model, what was inherited, CMS limitations, and the Golem/MindDB integration status.
- `docs/DESIGN-SYSTEM-SOURCE.md`: V5 source and shared token/component contract.
- `docs/DESIGN-GUIDE.md` and `docs/DESIGN-TOKENS.md`: content field semantics and parameterized visual roles; keep the live `/design-system/` examples aligned with shared components.

The current content layer is curated and hardcoded in TypeScript; it is not an admin CMS and has no database connection. The planned move to Astro Content Collections is tracked as `CMS-01`.

The V1 sources, builds and V5 snapshot are separately archived in `../odadream-site-v1-backup-2026-09-22`. The exact observed remote `origin/main` is `642bbb2` (`archive/published-site-v1.2.2`); local `main` is 20 commits ahead at `d4cb306` (`archive/site-v1.2.2`). `design/v5-approved` retains the approved prototype. Existing untracked files from the original worktree were copied there and never removed from their source.

## Release gate

1. Editorial approval of both language versions, the four case records, organization roles, and availability claims.
2. Apply the existing owner display permission for work media and respect later withdrawals. Resolve additional document and private-source permissions separately; access: public alone is not the approval record.
3. Desktop/mobile visual review and keyboard/lightbox audit; then review the branch build artifact.
4. Resolve old media URL dispositions against the actual public packet (currently 179 pending, including 7 editorial files excluded with review works) using `docs/media-decisions.json`. `npm run release:check` must pass before cutover.
5. Only after approval: open a PR to `main`. The branch contains a deployment workflow that activates only on `main`, and itself runs the release gate before deploying. Keep the previous tag/build available for rollback.
6. After deployment: inspect HTTP HTML and old `?id` links, submit `sitemap-index.xml`, monitor Search Console and analytics. GitHub Pages cannot send per-query 301 redirects; add an external HTTP redirect layer only if traffic data justifies it.

`/materials/` is deliberately absent. Old records not selected for V2 resolve to `/legacy/unavailable/` with `noindex`, never silently to the home page. The root renders English HTML and has canonical `/en/`; its small script handles old query links, including `internal=true` variants.


Migration review uses two files: [MIGRATION-PLAN.md](docs/MIGRATION-PLAN.md) for scope, content selection, phases and cutover; [INVENTORY-2026-10-05.json](docs/migration/INVENTORY-2026-10-05.json) for 238 source IDs, editorial assessments, hashes and 550 archived resources. The plan is awaiting agreement; 238 sources do not imply 238 new pages. Editorial preview contains 9 works and 44 localized pages. While all works remain review, the public build has 18 localized overview pages and no work/case pages; release remains blocked. Build validation derives the expected routes from the route registry. Accepted owner decisions are recorded in [CONTENT-AND-CMS.md](docs/CONTENT-AND-CMS.md); the shared card contract is in [DESIGN-GUIDE.md](docs/DESIGN-GUIDE.md).

Migration progress is computed with `npm run migration:status` from weighted completion checkpoints in the existing backlog. It does not measure publication approval, final design or editorial polish. Per-stage change reports stay in `docs/MIGRATION-PLAN.md`.
