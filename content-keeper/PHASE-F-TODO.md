# Phase F — TODO

Generated: 2026-09-14T08:03:52.519Z

Items are grouped by **who fixes them** so non-trivial work isn't blocked on mechanical tasks.

## A. Auto-fixable (run `node scripts/audit/fix-conformance.js --write`)

Already applied at last fix run. Re-run if registry yamls change.

## B. Registry data — add fields to `data/registry/proofs.yaml`

These proofs lack `proof_of` / `issued_by` because the source YAML record has no `work` / `eng` / `org`. Add the missing keys to the YAML, then re-run the Phase C proof migrator.


## C. Phase B pilots not in registry

Pilot proof .md files exist without a matching record in `proofs.yaml`. Either back-fill the YAML or accept them as content-authored:

- `proof-award-ars-electronica`
- `proof-award-culttech-vienna`
- `proof-award-portal-visioning`
- `proof-award-skolkovo-arttech`
- `proof-cred-track-record`
- `proof-cred-tskhr`
- `proof-emomandala-abundance`
- `proof-ip-patent`
- `proof-ip-trademark`
- `proof-let-bashkiria`
- `proof-let-bitva-milliard`
- `proof-let-golos-obshchestva`
- `proof-let-hse-beautiful-brain`
- `proof-let-kod-provincii`
- `proof-let-media-experts`
- `proof-let-moscow2030`
- `proof-let-portal`
- `proof-let-tavrida`
- `proof-let-techweek`
- `proof-let-tpp-techinno`
- `proof-let-unique-russia`
- `proof-let-wildmint`
- `proof-mipt-letter`
- `proof-mom-baby-borzikh-origin`
- `proof-mom-baby-iowa-gift`
- `proof-oda-synergy-forum-2022`
- `proof-press-cyens-cyprus`
- `proof-press-ntv-metro`
- `proof-press-tnt-tykakya`
- `proof-press-tskhr-bashkiria`
- `proof-press-vecherka`
- `proof-tst-ashram-osman`
- `proof-tst-bitva-milliard`
- `proof-tst-cipr-techfriendly`
- `proof-tst-meditation-day`
- `proof-tst-tavrida-ai`

## D. Stubs to create

_None — every wikilink resolves._

## E. Human decision — duplicates

_None._

## F. Human decision — body smells

Hub pages contain bullet lists of `[[…]]`. These are navigation by hand. Decision per file:
- **keep** — list is the page (e.g. landing hubs `events.md`, `lectures.md`).
- **convert to `.base`** — large registries (`registry-expert.md` with 18 bullets, `collab-agents.md` with 40).
- **delete + render computed inverse** — when the same data is already on referenced nodes (e.g. `works-art.md`).

- `emomandala.md` — Provenance
- `event-portal.md` — 6 link bullets in 2 block(s)
- `hub-business.md` — 12 link bullets in 2 block(s)
- `hub-event-agencies.md` — 44 link bullets in 6 block(s)
- `hub-events.md` — 12 link bullets in 2 block(s)
- `hub-lectures.md` — 12 link bullets in 2 block(s)
- `hub-registry-collabs.md` — 8 link bullets in 2 block(s)
- `hub-world.md` — 14 link bullets in 2 block(s)
- `mom-baby.md` — Provenance
- `org-ashram.md` — 6 link bullets in 2 block(s)
- `org-synergy-forum.md` — Provenance

## G. Orphans (informational)

Total: 26. These are leaf nodes nobody points at and that anchor nothing themselves. Many are legitimate (standalone lectures, untouched practices). Audit list:

- `emomandala-os.md` (kind: product)
- `event-audi-brand-2024.md` (kind: event)
- `event-bauman-moscow2030-2025.md` (kind: event)
- `event-bitva-milliard-2024.md` (kind: event)
- `event-brics-plus.md` (kind: event)
- `event-gonchar-private-2024.md` (kind: event)
- `event-gong-fest-2024.md` (kind: event)
- `event-gong-fest-2025.md` (kind: event)
- `event-lamborghini-brand-2024.md` (kind: event)
- `event-merck-corporate.md` (kind: event)
- `event-pleinair-bashkiria-2025.md` (kind: event)
- `event-pleinair-metro-2024.md` (kind: event)
- `event-portal-2024.md` (kind: event)
- `event-sber-lecture-2025.md` (kind: event)
- `event-techweek.md` (kind: event)
- `gong.md` (kind: product)
- `hyperscan-scene-engine.md` (kind: product)
- `journey.md` (kind: product)
- `meditation-brain.md` (kind: product)
- `neuromandala-os.md` (kind: product)
- `org-culture-sport-uao.md` (kind: organizer)
- `org-inforce.md` (kind: organizer)
- `org-itb.md` (kind: organizer)
- `sound-brain.md` (kind: product)
- `taste-brain.md` (kind: product)
- `unique-russia.md` (kind: event)
