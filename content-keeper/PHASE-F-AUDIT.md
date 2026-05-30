# Phase F — Content audit

Generated: 2026-05-30T06:36:46.523Z

## Summary

- Total nodes: **154**
  - (no kind): 44
  - event: 17
  - media: 8
  - organizer: 22
  - product: 28
  - proof: 35
- Conformance gaps: **14**
- Body smells: **16**
- Missing referenced ids: **0**
- Orphan nodes: **44**
- Duplicate candidates: **1**
- Proof drift — md-only / yaml-only / no-relations: **3 / 0 / 25**
- Gratitude mentions / without link: **3 / 0**

## 1. Conformance gaps

- `proof-award-ars-electronica.md` (id: proof-award-ars-electronica) — missing: proof_of
- `proof-award-culttech-vienna.md` (id: proof-award-culttech-vienna) — missing: proof_of
- `proof-cred-track-record.md` (id: proof-cred-track-record) — missing: proof_of
- `proof-cred-tskhr.md` (id: proof-cred-tskhr) — missing: proof_of
- `proof-ip-trademark.md` (id: proof-ip-trademark) — missing: proof_of
- `proof-let-golos-obshchestva.md` (id: proof-let-golos-obshchestva) — missing: proof_of
- `proof-let-kod-provincii.md` (id: proof-let-kod-provincii) — missing: proof_of
- `proof-let-media-experts.md` (id: proof-let-media-experts) — missing: proof_of
- `proof-let-moscow2030.md` (id: proof-let-moscow2030) — missing: proof_of
- `proof-let-techweek.md` (id: proof-let-techweek) — missing: proof_of
- `proof-let-tpp-techinno.md` (id: proof-let-tpp-techinno) — missing: proof_of
- `proof-let-unique-russia.md` (id: proof-let-unique-russia) — missing: proof_of
- `proof-press-cyens-cyprus.md` (id: proof-press-cyens-cyprus) — missing: proof_of
- `proof-press-vecherka.md` (id: proof-press-vecherka) — missing: proof_of

## 2. Body smells

### manual-link-list (16)
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

## 3. Missing referenced ids (→ stubs)

_None — every wikilink resolves._

## 4. Orphan nodes (no inbound refs, no children)

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

## 5. Duplicate candidates (same title_en within kind)

- `hub-events` ⇄ `hub-host-events` — same title_en (undefined)

## 6. Proof drift

### Md-only (in src/content/ but not in proofs.yaml) — 3
- `proof-cipr-quote`
- `proof-mipt-letter`
- `proof-portal-1st`
### Yaml-only (in proofs.yaml but no .md) — 0
### Proofs missing required relations — 25
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

## 7. Gratitude-letter mentions

- `beautiful-brain.md` — has proof link: yes
- `proof-hse-beautiful-brain.md` — has proof link: yes
- `proof-mipt-letter.md` — has proof link: yes
