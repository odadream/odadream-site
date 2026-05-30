# Phase F — TODO

Generated: 2026-05-30T06:28:40.492Z

Items are grouped by **who fixes them** so non-trivial work isn't blocked on mechanical tasks.

## A. Auto-fixable (run `node scripts/audit/fix-conformance.js --write`)

Already applied at last fix run. Re-run if registry yamls change.

## B. Registry data — add fields to `data/registry/proofs.yaml`

These proofs lack `proof_of` / `issued_by` because the source YAML record has no `work` / `eng` / `org`. Add the missing keys to the YAML, then re-run the Phase C proof migrator.

- `proof-award-ars-electronica` — missing: proof_of
- `proof-award-culttech-vienna` — missing: proof_of
- `proof-cred-track-record` — missing: proof_of
- `proof-cred-tskhr` — missing: proof_of
- `proof-ip-trademark` — missing: proof_of
- `proof-let-golos-obshchestva` — missing: proof_of
- `proof-let-kod-provincii` — missing: proof_of
- `proof-let-media-experts` — missing: proof_of
- `proof-let-moscow2030` — missing: proof_of
- `proof-let-techweek` — missing: proof_of
- `proof-let-tpp-techinno` — missing: proof_of
- `proof-let-unique-russia` — missing: proof_of
- `proof-press-cyens-cyprus` — missing: proof_of
- `proof-press-vecherka` — missing: proof_of
- `proof-award-ars-electronica` — missing: proof_of, issued_by
- `proof-award-culttech-vienna` — missing: proof_of, issued_by
- `proof-award-portal-visioning` — missing: issued_by
- `proof-cred-track-record` — missing: proof_of, issued_by
- `proof-cred-tskhr` — missing: proof_of, issued_by
- `proof-ip-patent` — missing: issued_by
- `proof-ip-trademark` — missing: proof_of, issued_by
- `proof-let-bashkiria` — missing: issued_by
- `proof-let-bitva-milliard` — missing: issued_by
- `proof-let-golos-obshchestva` — missing: proof_of, issued_by
- `proof-let-kod-provincii` — missing: proof_of, issued_by
- `proof-let-media-experts` — missing: proof_of, issued_by
- `proof-let-moscow2030` — missing: proof_of
- `proof-let-portal` — missing: issued_by
- `proof-let-techweek` — missing: proof_of, issued_by
- `proof-let-tpp-techinno` — missing: proof_of, issued_by
- `proof-let-unique-russia` — missing: proof_of, issued_by
- `proof-portal-1st` — missing: issued_by
- `proof-press-cyens-cyprus` — missing: proof_of, issued_by
- `proof-press-ntv-metro` — missing: issued_by
- `proof-press-tnt-tykakya` — missing: issued_by
- `proof-press-tskhr-bashkiria` — missing: issued_by
- `proof-press-vecherka` — missing: proof_of, issued_by
- `proof-tst-bitva-milliard` — missing: issued_by
- `proof-tst-meditation-day` — missing: issued_by

## C. Phase B pilots not in registry

Pilot proof .md files exist without a matching record in `proofs.yaml`. Either back-fill the YAML or accept them as content-authored:

- `proof-cipr-quote`
- `proof-mipt-letter`
- `proof-portal-1st`

## D. Stubs to create

_None — every wikilink resolves._

## E. Human decision — duplicates

- `hub-events` ⇄ `hub-host-events` — same title_en (undefined). Decide: rename, merge, or keep (different audiences).

## F. Human decision — body smells

Hub pages contain bullet lists of `[[…]]`. These are navigation by hand. Decision per file:
- **keep** — list is the page (e.g. landing hubs `events.md`, `lectures.md`).
- **convert to `.base`** — large registries (`registry-expert.md` with 18 bullets, `collab-agents.md` with 40).
- **delete + render computed inverse** — when the same data is already on referenced nodes (e.g. `works-art.md`).

- `heritage.md` — 6 link bullets in 2 block(s)
- `hub-agents.md` — 40 link bullets in 6 block(s)
- `hub-business.md` — 12 link bullets in 2 block(s)
- `hub-events.md` — 12 link bullets in 2 block(s)
- `hub-lectures.md` — 12 link bullets in 2 block(s)
- `hub-pleinair.md` — 6 link bullets in 2 block(s)
- `hub-portal.md` — 6 link bullets in 2 block(s)
- `hub-practices.md` — 10 link bullets in 2 block(s)
- `hub-registry-commercial.md` — 8 link bullets in 2 block(s)
- `hub-registry-expert.md` — 18 link bullets in 2 block(s)
- `hub-works-art.md` — 6 link bullets in 2 block(s)
- `hub-world.md` — 14 link bullets in 2 block(s)
- `interference.md` — 6 link bullets in 2 block(s)
- `posustoronniy.md` — 6 link bullets in 2 block(s)
- `sync-circle.md` — 6 link bullets in 2 block(s)
- `workshops.md` — 8 link bullets in 2 block(s)

## G. Orphans (informational)

Total: 44. These are leaf nodes nobody points at and that anchor nothing themselves. Many are legitimate (standalone lectures, untouched practices). Audit list:

- `art-brain.md` (kind: product)
- `brain-hack.md` (kind: product)
- `coaching.md` (kind: product)
- `color-brain.md` (kind: product)
- `cultural-neuro-code.md` (kind: product)
- `dashran.md` (kind: product)
- `emomandala.md` (kind: product)
- `empathy.md` (kind: product)
- `event-bauman-moscow2030-2025.md` (kind: event)
- `event-gonchar-private-2024.md` (kind: event)
- `event-merck-corporate.md` (kind: event)
- `event-sber-lecture-2025.md` (kind: event)
- `gong.md` (kind: product)
- `heritage.md` (kind: product)
- `jewellery.md` (kind: product)
- `journey.md` (kind: product)
- `mom-baby.md` (kind: product)
- `neuro-dance.md` (kind: product)
- `neuroaesthetics-lec.md` (kind: product)
- `neurosync.md` (kind: product)
- `org-audi.md` (kind: organizer)
- `org-culture-sport-uao.md` (kind: organizer)
- `org-inforce.md` (kind: organizer)
- `org-lamborghini.md` (kind: organizer)
- `posustoronniy.md` (kind: product)
- `proof-award-ars-electronica.md` (kind: proof)
- `proof-award-culttech-vienna.md` (kind: proof)
- `proof-cred-track-record.md` (kind: proof)
- `proof-cred-tskhr.md` (kind: proof)
- `proof-ip-trademark.md` (kind: proof)
- `proof-let-golos-obshchestva.md` (kind: proof)
- `proof-let-kod-provincii.md` (kind: proof)
- `proof-let-media-experts.md` (kind: proof)
- `proof-let-moscow2030.md` (kind: proof)
- `proof-let-techweek.md` (kind: proof)
- `proof-let-tpp-techinno.md` (kind: proof)
- `proof-let-unique-russia.md` (kind: proof)
- `proof-press-cyens-cyprus.md` (kind: proof)
- `proof-press-vecherka.md` (kind: proof)
- `schrodinger.md` (kind: product)
- `sound-brain.md` (kind: product)
- `sync-circle.md` (kind: product)
- `taste-brain.md` (kind: product)
- `workshops.md` (kind: product)
