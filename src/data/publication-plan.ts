import type { PublicationPlan } from '../lib/publication-scope';

// Candidate packet, not editorial approval. Each selected record must also be published.
export const publicationPlan: PublicationPlan = {
  version: 'v2-packet-2026-10-06.1',
  asOf: '2026-10-06',
  works: [
    'interference',
    'mindshow',
    'neurobattle',
    'schrodinger',
    'rings',
    'sync',
    'emomandala',
    'neurosync',
    'ancestors',
  ],
  formats: ['mindshow-installation', 'neurobattle-game', 'talk-workshop'],
  cases: ['tsiolkovsky-2026', 'tsiolkovsky-2025', 'dano-2025', 'byob-2026'],
  people: ['founders'],
  recognitions: [],
  heroVisuals: ['frequencies', 'mindshow'],
  minddb: false,
};
