/**
 * Real image files present in public/images/content but not yet represented
 * by a MediaAsset. The catalog is deliberately small and explicit: it is a
 * visual index, not a second content database. Golem Data Base remains the
 * source used to discover and verify the underlying archive materials.
 */
export type RealImageRecord = {
  url: string;
  subjects: string[];
};

export const REAL_IMAGE_CATALOG: readonly RealImageRecord[] = [
  { url: "/images/content/proofs/collab_2024_ODA_Bitva_za_milliard.webp", subjects: ["proof-let-bitva-milliard", "event-bitva-milliard-2024", "neuromandala"] },
  { url: "/images/content/proofs/collab_2024_ODA_Kod_provintsii_Daler.webp", subjects: ["proof-let-kod-provincii", "event-kod-provincii", "theatre-my-name"] },
  { url: "/images/content/proofs/collab_2024_ODA_TechWeek_Olya.webp", subjects: ["proof-let-techweek", "event-techweek", "mindshow"] },
  { url: "/images/content/proofs/collab_2025_ODA_Dikaya_myata.webp", subjects: ["proof-let-wildmint", "event-myata-2025", "mindshow"] },
  { url: "/images/content/proofs/collab_2025_ODA_Khaskel.webp", subjects: ["proof-let-golos-obshchestva", "hub-world"] },
  { url: "/images/content/proofs/collab_2025_ODA_Moskva_2030_Olga.webp", subjects: ["proof-let-moscow2030", "event-bauman-moscow2030-2025", "mindshow"] },
  { url: "/images/content/proofs/collab_2025_ODA_Portal.webp", subjects: ["proof-let-portal", "event-portal-2025", "mindshow"] },
  { url: "/images/content/proofs/collab_2025_ODA_Severnaya_Osetiya_Media_Eksperty.webp", subjects: ["proof-let-media-experts", "hub-world", "neurobattle"] },
  { url: "/images/content/proofs/collab_2025_ODA_Shulgan_Tash.webp", subjects: ["proof-let-bashkiria", "mindshow", "event-pleinair-bashkiria-2025"] },
  { url: "/images/content/proofs/collab_2025_ODA_Tavrida_II.webp", subjects: ["proof-let-tavrida", "event-tavrida-ai-2025", "neuromandala"] },
  { url: "/images/content/proofs/collab_2025_ODA_TPP.webp", subjects: ["proof-let-tpp-techinno", "event-tpp-mindshow-2025", "mindshow"] },
  { url: "/images/content/proofs/collab_2025_ODA_VShE_ch2.webp", subjects: ["proof-let-hse-beautiful-brain", "event-hse-beautiful-brain-2025", "beautiful-brain"] },
  { url: "/images/content/proofs/collab_2026_ODA_Gostinyy_dvor.webp", subjects: ["proof-let-unique-russia", "unique-russia", "event-pleinair-metro-2024"] },
  { url: "/images/content/works/byob-2019-mindgrid.webp", subjects: ["event-byob-2019", "mindshow", "media-byob-2019-mindgrid"] },
  { url: "/images/content/events/interference-2026/interference-2026-02.webp", subjects: ["interference", "event-tsiolkovsky-2026", "media-interference-photos"] },
  { url: "/images/content/events/interference-2026/interference-2026-03.webp", subjects: ["interference", "event-tsiolkovsky-2026", "media-interference-photos"] },
  { url: "/images/content/events/interference-2026/interference-2026-04.webp", subjects: ["interference", "event-tsiolkovsky-2026", "media-interference-photos"] },
  { url: "/images/content/events/interference-2026/interference-2026-05.webp", subjects: ["interference", "event-tsiolkovsky-2026", "media-interference-photos"] },
  { url: "/images/content/events/interference-2026/interference-2026-06.webp", subjects: ["interference", "event-tsiolkovsky-2026", "media-interference-photos"] },
  { url: "/images/content/events/interference-2026/interference-2026-07.webp", subjects: ["interference", "event-tsiolkovsky-2026", "media-interference-photos"] },
  { url: "/images/content/events/interference-2026/interference-2026-08.webp", subjects: ["interference", "event-tsiolkovsky-2026", "media-interference-photos"] },
  { url: "/images/content/events/interference-2026/interference-2026-09.webp", subjects: ["interference", "event-tsiolkovsky-2026", "media-interference-photos"] },
  { url: "/images/content/events/schrodinger-2025/schrodinger-2025-02.webp", subjects: ["schrodinger", "event-tsiolkovsky-2025", "media-schrodinger-photos"] },
  { url: "/images/content/events/schrodinger-2025/schrodinger-2025-03.webp", subjects: ["schrodinger", "event-tsiolkovsky-2025", "media-schrodinger-photos"] },
  { url: "/images/content/events/schrodinger-2025/schrodinger-2025-04.webp", subjects: ["schrodinger", "event-tsiolkovsky-2025", "media-schrodinger-photos"] },
  { url: "/images/content/events/schrodinger-2025/schrodinger-2025-05.webp", subjects: ["schrodinger", "event-tsiolkovsky-2025", "media-schrodinger-photos"] },
  { url: "/images/content/events/schrodinger-2025/schrodinger-2025-06.webp", subjects: ["schrodinger", "event-tsiolkovsky-2025", "media-schrodinger-photos"] },
  { url: "/images/content/events/schrodinger-2025/schrodinger-2025-07.webp", subjects: ["schrodinger", "event-tsiolkovsky-2025", "media-schrodinger-photos"] },
  { url: "/images/content/events/schrodinger-2025/schrodinger-2025-08.webp", subjects: ["schrodinger", "event-tsiolkovsky-2025", "media-schrodinger-photos"] },
  { url: "/images/content/works/another-people/other-people-portrait.webp", subjects: ["another-people", "media-another-people-docs"] },
  { url: "/images/content/works/another-people/other-people-workshop.webp", subjects: ["another-people", "media-another-people-docs"] },
  { url: "/images/content/works/honors-skolkovo/honors-skolkovo-dome.webp", subjects: ["honors", "media-honors-presentation"] },
  { url: "/images/content/works/honors-skolkovo/honors-skolkovo-plan-detail.webp", subjects: ["honors", "media-honors-presentation"] },
  { url: "/images/content/works/honors-skolkovo/honors-skolkovo-plan.webp", subjects: ["honors", "media-honors-presentation"] },
  { url: "/images/content/works/honors-skolkovo/honors-skolkovo-scheme.webp", subjects: ["honors", "media-honors-presentation"] },
  { url: "/images/content/works/honors-skolkovo/honors-skolkovo-viz.webp", subjects: ["honors", "media-honors-presentation"] },
  { url: "/images/content/works/interference-plakats/interference-plakat-01-light.webp", subjects: ["interference", "media-interference-plakats"] },
  { url: "/images/content/works/interference-plakats/interference-plakat-02-sound.webp", subjects: ["interference", "media-interference-plakats"] },
  { url: "/images/content/works/interference-plakats/interference-plakat-03-dance.webp", subjects: ["interference", "media-interference-plakats"] },
  { url: "/images/content/works/interference-plakats/interference-plakat-04-brain.webp", subjects: ["interference", "media-interference-plakats"] },
  { url: "/images/content/works/interference-plakats/interference-plakat-05-technology.webp", subjects: ["interference", "media-interference-plakats"] },
  { url: "/images/content/works/interference-plakats/interference-plakat-06-waves.webp", subjects: ["interference", "media-interference-plakats"] },
  { url: "/images/content/works/interference-plakats/interference-plakat-07-reality.webp", subjects: ["interference", "media-interference-plakats"] },
  { url: "/images/content/works/interference-plakats/interference-plakat-08-dramaturgy.webp", subjects: ["interference", "media-interference-plakats"] },
  { url: "/images/content/works/potustoronniy/potustoronniy-drum.webp", subjects: ["potustoronniy", "media-potustoronniy-deck"] },
  { url: "/images/content/works/sync-circle/sync-circle-chairs-1.webp", subjects: ["sync-circle", "media-sync-circle-gallery"] },
  { url: "/images/content/works/sync-circle/sync-circle-chairs-2.webp", subjects: ["sync-circle", "media-sync-circle-gallery"] },
  { url: "/images/content/works/sync-circle/sync-circle-chairs-3.webp", subjects: ["sync-circle", "media-sync-circle-gallery"] },
  { url: "/images/content/works/sync-circle/sync-circle-dimensions.webp", subjects: ["sync-circle", "media-sync-circle-gallery"] },
  { url: "/images/content/works/sync-circle/sync-circle-states.webp", subjects: ["sync-circle", "media-sync-circle-gallery"] },
];
