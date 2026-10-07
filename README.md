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
4. Verify the selected publication packet, actual file rights and canonical links. Exact V1 URL preservation is not a release condition (owner decision 2026-10-07).
5. Only after an explicit owner request: open a PR / deploy to main. Keep the previous tag/build available for rollback.
6. After deployment: inspect canonical HTML, the bilingual obsolete-address notice, sitemap and analytics.

Old ?id, former /formats/ and unknown page addresses show LegacyNotice and return to the language home after 5 seconds; a manual link works immediately. There is no public runtime legacy map. The internal 238-ID manifest remains a source ledger; internal=true grants no access.

Migration review uses [MIGRATION-PLAN.md](docs/MIGRATION-PLAN.md) for the compact approved course, [PROJECT-BACKLOG.yaml](docs/PROJECT-BACKLOG.yaml) for tasks/weights, and the existing [inventory](docs/migration/INVENTORY-2026-10-05.json) for provenance and source application. Current data: 23 works, 2 work configurations, 8 educational programmes, 33 event records and 4 series, producing 88 canonical localized routes. Conditions live with works; Education has its own catalogue/detail pages. This is the prepared foundation, not the completed full corpus. Prepared owner-authorized records are published in the static packet; award-document rights and MindDB privacy remain separate gates.

Migration progress is computed with `npm run migration:status` from completed deliverables within the original weighted checkpoints in the existing backlog. It separately reports fully closed stages. Measurement revision 2026-10-06.2 credits completed parts of M4/M5 without changing their budgets or the migration scope. It does not measure publication approval, final design or editorial polish. Progress/acceptance lives in the existing backlog and inventory; avoid appending turn-by-turn logs to the compact plan.

`npm run migration:qa` builds the selected candidate in an ignored isolated copy with synthetic publication statuses, then checks internal links, allowed files over HTTP, representative screen/theme geometry and three repeated Lighthouse runs per scenario. It updates the current verification in the existing inventory. The real catalogue and rights are unchanged; the marked rehearsal output must never be deployed. Detailed reports stay in `.local-server/`.
