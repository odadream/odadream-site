# Phase F — Content audit

Generated: 2026-07-16T11:42:29.631Z

## Summary

- Total nodes: **225**
  - (no kind): 49
  - collaboration: 4
  - event: 37
  - media: 34
  - organizer: 31
  - product: 34
  - proof: 36
- Conformance gaps: **0**
- Body smells: **10**
- Missing referenced ids: **20**
- Orphan nodes: **26**
- Duplicate candidates: **0**
- Proof drift — md-only / yaml-only / no-relations: **0 / 0 / 0**
- Gratitude mentions / without link: **4 / 1**
- Event role warnings: **1**

## 1. Conformance gaps

_None — all kinded nodes have required fields._

## 2. Body smells

### provenance-header (2)
- `emomandala.md` — Provenance
- `mom-baby.md` — Provenance
### manual-link-list (8)
- `event-portal.md` — 6 link bullets in 2 block(s)
- `hub-business.md` — 12 link bullets in 2 block(s)
- `hub-event-agencies.md` — 44 link bullets in 6 block(s)
- `hub-events.md` — 12 link bullets in 2 block(s)
- `hub-lectures.md` — 12 link bullets in 2 block(s)
- `hub-registry-collabs.md` — 8 link bullets in 2 block(s)
- `hub-world.md` — 14 link bullets in 2 block(s)
- `org-ashram.md` — 6 link bullets in 2 block(s)

## 3. Missing referenced ids (→ stubs)

| missing_id | kind_guess | referenced_by |
|---|---|---|
| `Ars Electronica, Линц, Австрия` | product | proof-award-ars-electronica.issued_by |
| `CYENS Centre of Excellence, Кипр` | product | proof-press-cyens-cyprus.issued_by |
| `ODA.dream — сводка трека` | product | proof-cred-track-record.issued_by |
| `Tech Week` | product | proof-let-techweek.issued_by |
| `home` | product | proof-award-ars-electronica.proof_of, proof-cred-track-record.proof_of, proof-cred-tskhr.proof_of, proof-ip-trademark.proof_of, proof-let-golos-obshchestva.proof_of, proof-let-kod-provincii.proof_of, proof-let-media-experts.proof_of, proof-let-moscow2030.proof_of, proof-let-techweek.proof_of, proof-let-tpp-techinno.proof_of, proof-let-unique-russia.proof_of, proof-oda-synergy-forum-2022.proof_of, proof-press-cyens-cyprus.proof_of, proof-press-vecherka.proof_of |
| `Архив студии · линейка талисманов` | product | proof-emomandala-abundance.issued_by |
| `Архив студии · параллельный заказ` | product | proof-mom-baby-iowa-gift.issued_by |
| `Вечерняя Москва` | product | proof-press-vecherka.issued_by |
| `Конференция «КОД: Провинции», Калуга` | product | proof-let-kod-provincii.issued_by |
| `Медиа Эксперты — проект «Великая Россия»` | product | proof-let-media-experts.issued_by |
| `НТВ` | product | proof-press-ntv-metro.issued_by |
| `Проект «Голос Общества»` | product | proof-let-golos-obshchestva.issued_by |
| `Роспатент` | product | proof-ip-trademark.issued_by |
| `ТНТ, «Ты как Я»` | product | proof-press-tnt-tykakya.issued_by |
| `ТСХР — первый цифровой пленэр, Шульган-Таш` | product | proof-let-bashkiria.issued_by |
| `ТСХР` | product | proof-press-tskhr-bashkiria.issued_by |
| `Творческий союз художников России (ТСХР)` | product | proof-cred-tskhr.issued_by |
| `Технологии и Инновации (Национальная бизнес-премия)` | product | proof-let-tpp-techinno.issued_by |
| `Уникальная Россия (Гостиный двор, Москва)` | product | proof-let-unique-russia.issued_by |
| `ФИПС / патентная заявка` | product | proof-ip-patent.issued_by |

## 4. Orphan nodes (no inbound refs, no children)

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

## 5. Duplicate candidates (same title_en within kind)

_None._

## 6. Proof drift

### Md-only (in src/content/ but not in proofs.yaml) — 0
### Yaml-only (in proofs.yaml but no .md) — 0
### Proofs missing required relations — 0

## 7. Gratitude-letter mentions

- `beautiful-brain.md` — has proof link: yes
- `hub-registry.md` — has proof link: **NO**
- `proof-let-hse-beautiful-brain.md` — has proof link: yes
- `proof-mipt-letter.md` — has proof link: yes

## 8. Event role warnings

- `event-portal-2025.md` (org-venue-overlap) — same id in orgs and venues: org-skolkovo
