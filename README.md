# ODA.dream V2

Static bilingual Astro site. Work in `odadream-site-v2`, branch `codex/site-v2`; neighbouring React/Lotus V1 is a source archive. The public domain still serves V1. Publishing V2 requires an explicit owner request.

## Local workspace

Requires Node **22.19+**, preferably Node 24 as in CI, and `npm ci`. On Windows, double-click **start-local-v2.cmd** to start/restart both modes:

| View | Address |
| --- | --- |
| DEV, including review material | http://127.0.0.1:5177/ru/ |
| PUBLIC, actual publication projection | http://127.0.0.1:5178/ru/ |
| Text register | http://127.0.0.1:5177/editorial/ |
| Shared design stand | http://127.0.0.1:5177/design-system/ |

The local toolbar preserves route/anchor when switching modes. PUBLIC rebuilds after source changes and serves the previous verified version during rebuilding; “Сборка” shows its state. Both local modes disable analytics. The launcher checks server identity before stopping it. `npm run dev` starts only DEV.

The Windows launchers use the bundled Codex Node when available; the terminal may use another version. **check-v2.cmd** runs checks without restarting the site. `check-v2.cmd --doctor` explains runtime, server identity and PUBLIC build state. Logs/builds stay in ignored `.local-server/`.

## One verification entry point

| Command | Purpose |
| --- | --- |
| `npm run verify` | Local iteration: derive scope from staged, unstaged and untracked Git changes |
| `npm run verify -- --plan` | Show scope without running checks |
| `npm run verify -- --since REF` | Include committed changes since REF as well as the working tree |
| `npm run verify -- --files src/components/WorkCard.astro` | Add explicit files to actual changes; never hide other changes |
| `npm run verify:full` | Format, metadata, unit, content, types, fresh build/artifact and full browser matrix |
| `npm run verify:release` | Full verification, then content/media/analytics release gate on the same artifact |
| `npm run test:e2e` | Fresh build/artifact followed by the full browser matrix |

Quick supports a small explicit component allowlist. Shared styles, routes, publication logic, tools and unmapped files automatically select **full**. Markdown/backlog-only changes validate metadata without building the site. A quick result is scoped evidence, not full acceptance. Both browser projects currently use **Chromium**; mobile emulation does not prove Safari compatibility.

The runner verifies DEV identity before browser checks, records timings/logs under `.local-server/checks/<run>/`, and builds in that run's isolated `dist`. Changing inputs/artifact during verification fails the run. A successful run copies the tested packet to the root `dist` and verifies the copy's hash before CI can upload it. Environment files contribute to the fingerprint; their contents are never printed. Run one verification at a time. Quick narrows reading samples by affected family while preserving languages, themes, widths and profile perturbations; full/release retain all samples. These commands do not push or deploy anything themselves.

## Backup, restoration and storage

`npm run workspace -- backup` creates a new private snapshot under `%LOCALAPPDATA%/ODA.dream/site-v2-backups/`, outside YandexDisk. An optional new destination folder may be supplied. The snapshot includes the full history of the **current branch**, tracked/untracked working files (including deletions), root `.env*`, prepared media/text cache and OCR models. A Git bundle is used because V2 is a managed worktree whose `.git` points to the neighbouring repository. SHA-256 checks detect changes during copying and verify every restored file.

Backups contain private environment values and source texts: keep them in a private local folder; never publish or commit them. Other branches/tags, staging state, dependencies, temporary builds/logs and external original sources are outside this snapshot. Source paths remain recorded by the media preparation contract; retain the original YandexDisk/Golem/media-kit sources separately. Private indexes/OCR manifests retain their original absolute paths; text files are preserved, but relocating the preparation workspace requires rebinding those indexes and checking the external originals/tools. Simply rerunning preparation may reuse an OCR manifest containing the old path. Ordinary builds use the restored checked-in derivatives directly.

```text
npm run workspace -- verify ABSOLUTE_BACKUP_FOLDER
npm run workspace -- restore ABSOLUTE_BACKUP_FOLDER NEW_ABSOLUTE_CHECKOUT_FOLDER
```

Restore refuses an existing target, clones the bundled history into an independent repository and copies the saved working state; it never resets the original checkout. In the new checkout, use Node 22.19+/24, run `npm ci`, then `npm run check`, `npm run content:check` and `npm run build`. A fresh build may choose another generated CSS entry name with identical content; investigate differences rather than weakening the per-run artifact hash barrier. `npm run verify:full` additionally needs the original local servers stopped: its port identity guard deliberately rejects a server from another checkout. The recovered repository's `origin` points to the local bundle, not the production remote; remote actions require separate authorization. Local backups do not protect against loss of the whole computer.

The current working checkout remains on YandexDisk. Moving daily development outside synchronization is recommended if file-loss incidents recur; restore to a new local folder, validate it, then choose which checkout owns ports 5177/5178. Do not automatically move/delete the shared V1 Git repository or the existing working files.

`npm run workspace -- prune-checks` previews cleanup of **only** completed `.local-server/checks/<numeric-run>/dist` packets. Add `--apply` to remove the listed packets. Keep the two latest successful packets and the latest failed packet; preserve unfinished/unknown runs, all reports/logs, private media/OCR caches and PUBLIC-server builds. Nothing is removed automatically. Backup creation, verification and cleanup share `.local-server/maintenance.lock`, preventing overlapping operations. If interrupted, inspect the recorded PID and remove that single lock file only after confirming the process has stopped.

## Task context and sources of truth

Start with **AGENTS.md**, then the current task and referenced contract. Do not load all completed plans, migration JSON and this chat's history for every edit.

| Information | Canonical source |
| --- | --- |
| Product/IA, page purpose and owner decisions | [SITE-PRINCIPLES.md](docs/SITE-PRINCIPLES.md) |
| Entity fields, publication, source/media preparation | [CONTENT-AND-CMS.md](docs/CONTENT-AND-CMS.md) |
| Component semantics and layout contracts | [DESIGN-GUIDE.md](docs/DESIGN-GUIDE.md) |
| Token roles; actual values in `src/styles/tokens.css` | [DESIGN-TOKENS.md](docs/DESIGN-TOKENS.md) |
| Task status, priority, dependencies, acceptance | [PROJECT-BACKLOG.yaml](docs/PROJECT-BACKLOG.yaml) |
| Text revisions and owner review | [EDITORIAL-REGISTER.yaml](docs/EDITORIAL-REGISTER.yaml) |
| Maintenance findings/order | [MAINTENANCE-AUDIT.md](docs/MAINTENANCE-AUDIT.md) |

`npm run task` lists unfinished tasks and calculated status counts. Focused queries:

```text
npm run task -- MAINT-CHECKS-01
npm run task -- --area maintenance --status planned
npm run task -- --texts --status draft
npm run task -- --texts --en --status revision
npm run task -- --source neurobattle
npm run task -- --catalogue
```

Task cards come directly from the backlog, with current dependencies and a reading list; no second task state is stored. `--source` selects one historical source ID; `--catalogue` calculates current entity/route counts. Read relevant sections of listed contracts. Ordinary changes update the task and affected contract; update product principles too when an approved product decision changes. Detailed run logs belong to verification artifacts, not every document.

[MIGRATION-PLAN.md](docs/MIGRATION-PLAN.md), migration inventory/deferred list, [EDITORIAL-AUDIT.md](docs/EDITORIAL-AUDIT.md), [DESIGN-AUDIT-PLAN.md](docs/DESIGN-AUDIT-PLAN.md), [QUALITY-BASELINE.md](docs/QUALITY-BASELINE.md) and [DESIGN-SYSTEM-SOURCE.md](docs/DESIGN-SYSTEM-SOURCE.md) retain historical plans, audits or provenance. They are not competing sources of current task state. The editorial workflow remains in [EDITORIAL-PLAN.md](docs/EDITORIAL-PLAN.md). Migration progress is calculated by `npm run migration:status`; it is independent of editorial/design acceptance and publication authorization.

## Code and publication boundaries

`src/data/site.ts` assembles typed records; `catalogue.ts`/`publication-scope.ts` produce DEV or an explicitly allowed public packet. `routes.ts` generates localized routes. Components/layouts render them; shared styles import canonical tokens. This is curated static data, not an admin CMS or live Golem/MindDB connection. Future storage changes are tracked by CMS-01.

Old `?id=`, `/formats/` and unknown addresses show bilingual LegacyNotice and return home after five seconds. **There is no public runtime legacy map.** The 238-ID manifest is source provenance only. `internal=true` never grants access. PUBLIC excludes DEV tools, unapproved/internal data and physical files outside its allowlist. Passing a technical release gate does not grant owner acceptance.

`npm run media:prepare` prepares compressed images, PDF page galleries and private text copies; `--archive` also processes the historical archive privately. Python requirements and the source/page/text contract are in [CONTENT-AND-CMS.md](docs/CONTENT-AND-CMS.md#подготовка-изображений-pdf-и-текстовых-копий). Ordinary builds require neither Python nor OCR. `npm run documents:prepare` updates sourced CV/overview documents. Update localized `lastmod.json` only for material page-content changes.

V1 sources, builds and V5 are separately preserved in `../odadream-site-v1-backup-2026-09-22` and archive tags. `npm run migration:qa` creates an isolated, explicitly marked rehearsal; it must never be deployed. Deployment, domain changes and remote Git actions require explicit owner authorization.
