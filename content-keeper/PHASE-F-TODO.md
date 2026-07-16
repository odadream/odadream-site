# Phase F — TODO

Generated: 2026-07-16T11:42:29.631Z

Items are grouped by **who fixes them** so non-trivial work isn't blocked on mechanical tasks.

## A. Auto-fixable (run `node scripts/audit/fix-conformance.js --write`)

Already applied at last fix run. Re-run if registry yamls change.

## B. Registry data — add fields to `data/registry/proofs.yaml`

These proofs lack `proof_of` / `issued_by` because the source YAML record has no `work` / `eng` / `org`. Add the missing keys to the YAML, then re-run the Phase C proof migrator.


## C. Phase B pilots not in registry

Pilot proof .md files exist without a matching record in `proofs.yaml`. Either back-fill the YAML or accept them as content-authored:


## D. Stubs to create

| missing_id | kind_guess | referenced_by |
|---|---|---|
| `Ars Electronica, Линц, Австрия` | product | proof-award-ars-electronica.issued_by |
| `CYENS Centre of Excellence, Кипр` | product | proof-press-cyens-cyprus.issued_by |
| `ODA.dream — сводка трека` | product | proof-cred-track-record.issued_by |
| `Tech Week` | product | proof-let-techweek.issued_by |
| `home` | product | proof-award-ars-electronica.proof_of; proof-cred-track-record.proof_of; proof-cred-tskhr.proof_of; proof-ip-trademark.proof_of; proof-let-golos-obshchestva.proof_of |
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
