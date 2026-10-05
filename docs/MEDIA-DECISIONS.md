# Public media URL migration audit

The V1 public `images/content` directory contains 179 files. The old content and media registry reference 178 distinct paths in that directory. V2 currently retains **seven** selected image files at **their original public URLs**, without copying restricted recordings. All seven still have `rights: review` in the typed media records. The remaining **172** URL paths have not been copied; the exact machine-readable inventory is in `media-audit.json`.

This is a deliberate pre-release hold, not a claim that the 172 URLs have no audience or may be removed. Before switching the public domain, the owners must decide per URL whether to retain it (with rights confirmed), replace it with an approved asset, or accept retirement after checking inbound links and Search Console. GitHub Pages cannot return HTTP 301 for individual retired media paths without an external layer.

Approved exceptions belong in `media-decisions.json`, keyed by the exact old path and containing `action` (`retire` or `redirect`), `approvedBy`, `approvedOn` and `reason`. A `redirect` decision additionally needs `target` and `httpLayerVerified: true` after an external HTTP redirect is actually tested; GitHub Pages alone is insufficient. An empty decision file is intentional during review.

`npm run audit:media` regenerates the inventory from the V1 archive worktree. `npm run release:check` fails while any right, editorial record or historical media URL remains undecided. The development artifact and local preview remain available, but the public deployment workflow must not be switched until this gate and visual acceptance pass.


Display permission, 2026-10-05: the owner authorized display of works and private commissions by default, subject to later withdrawals. Selected local Media records are cleared on this basis (CONTENT-AND-CMS.md). Historical URL retirement/redirect decisions remain separate.


Publication scope, 2026-10-06: a legacy file is preserved only when its path is in the built public packet. The historical audit's retained flag records presence in the editorial source tree and cannot bypass this check. With all works still under review, 7 copied old paths are temporarily excluded alongside 172 previously missing paths: release currently requires 179 dispositions. Publishing an approved work can restore its permitted assets to the allowlist; deferring it never authorizes URL retirement automatically.
