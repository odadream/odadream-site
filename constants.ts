import { LotusNode } from "./types";
import * as Content from "./content";

// --- CONFIGURATION ---
// Images are now served locally from public/images/nodes/
// Run 'npm run assets:generate' to populate these files.
const getImg = (id: string) => `/images/nodes/${id}.svg`;

// Helper to build nodes concisely
const createNode = (
  id: string,
  title: string,
  description: string,
  type: "hub" | "content" | "action",
  children: LotusNode[] = [],
  visible: boolean = true,
  shortTitle?: string
): LotusNode => {
  return {
    id,
    title,
    shortTitle: shortTitle || title,
    description,
    type,
    imageUrl: getImg(id), // Links to local file
    visible,
    children: children.filter((c) => c.visible !== false),
  };
};

// --- STRUCTURE DEFINITION ---

// 1. WORKS SUB-TREES

const games = createNode(
  "games",
  "Games",
  "Interactive neuro-gaming experiences.",
  "hub",
  [
    createNode(
      "neurobattle",
      "Neurobattle",
      Content.games_neurobattle_md,
      "content"
    ),
    createNode(
      "brain-hack",
      "Brain Hack",
      Content.games_brain_hack_md,
      "content"
    ),
    createNode("journey", "Journey", Content.games_journey_md, "content"),
  ]
);

const lectures = createNode(
  "lectures",
  "Lectures",
  "Educational talks on neuroaesthetics.",
  "hub",
  [
    createNode(
      "art-brain",
      "Art of Brain",
      Content.lectures_art_brain_md,
      "content"
    ),
    createNode(
      "sound-brain",
      "Sound",
      Content.lectures_sound_brain_md,
      "content"
    ),
    createNode(
      "taste-brain",
      "Taste",
      Content.lectures_taste_brain_md,
      "content"
    ),
    createNode(
      "color-brain",
      "Color",
      Content.lectures_color_brain_md,
      "content"
    ),
    createNode(
      "empathy",
      "Empathy",
      Content.lectures_empathy_md,
      "content",
      [],
      true,
      "Empathy"
    ),
    createNode(
      "neuroaesthetics-lec",
      "Neuroaesthetics",
      Content.lectures_neuroaesthetics_md,
      "content"
    ),
  ]
);

const workshops = createNode(
  "workshops",
  "Workshops",
  "Participatory sessions.",
  "hub",
  [
    createNode(
      "neuro-dance",
      "Neuro Dance",
      Content.workshops_dance_md,
      "content"
    ),
    createNode(
      "neurosync",
      "Neurosync",
      Content.workshops_neurosync_md,
      "content"
    ),
    createNode("gong", "Gong Theater", Content.workshops_gong_md, "content"),
    createNode(
      "coaching",
      "Coaching",
      Content.workshops_coaching_md,
      "content"
    ),
    createNode(
      "mindshow",
      "Mindshow",
      Content.workshops_mindshow_md,
      "content"
    ),
  ]
);

const research = createNode(
  "research",
  "Research",
  "Scientific and artistic exploration.",
  "hub",
  [
    createNode("heritage", "Heritage", Content.research_heritage_md, "content"),
    createNode(
      "schrodinger",
      "Schrodinger",
      Content.research_schrodinger_md,
      "content"
    ),
    createNode(
      "sync-circle",
      "Sync Circle",
      Content.research_sync_circle_md,
      "content"
    ),
    createNode("dashran", "Dashran", Content.research_dashran_md, "content"),
    createNode(
      "posustoronniy",
      "Posustoronniy",
      Content.research_posustoronniy_md,
      "content"
    ),
  ]
);

const objects = createNode(
  "objects",
  "Objects",
  "Physical artifacts of mental states.",
  "hub",
  [
    createNode(
      "mom-baby",
      "Mom & Baby",
      Content.objects_mom_baby_md,
      "content"
    ),
    createNode(
      "jewellery",
      "Jewellery",
      Content.objects_jewellery_md,
      "content"
    ),
    createNode(
      "emomandala",
      "Emomandala",
      Content.objects_emomandala_md,
      "content"
    ),
  ]
);

// 2. MAIN CATEGORIES

const works = createNode("works", "Works", Content.works_index_md, "hub", [
  games,
  lectures,
  workshops,
  research,
  objects,
]);

const events = createNode("events", "Events", Content.events_index_md, "hub", [
  createNode("chastoti", "Chastoti", Content.events_chastoti_md, "content"),
  createNode(
    "terraforming",
    "Terraforming",
    Content.events_terraforming_md,
    "content"
  ),
  createNode("portal", "Portal", Content.events_portal_md, "content"),
  createNode("byob", "BYOB", Content.events_byob_md, "content"),
  createNode("pleinair", "Plein Air", Content.events_pleinair_md, "content"),
]);

const collaboration = createNode(
  "collab",
  "Collaboration",
  Content.collab_index_md,
  "hub",
  [
    createNode("for-events", "Events", Content.collab_events_md, "content"),
    createNode(
      "for-business",
      "Business",
      Content.collab_business_md,
      "content"
    ),
    createNode(
      "for-galleries",
      "Galleries",
      Content.collab_galleries_md,
      "content"
    ),
    createNode("for-artists", "Artists", Content.collab_artists_md, "content"),
  ]
);

const world = createNode("world", "World", Content.world_index_md, "hub", [
  createNode("manifesto", "Manifesto", Content.world_manifesto_md, "content"),
  createNode("team", "Team", Content.world_team_md, "content"),
  createNode("press", "Press", Content.world_press_md, "content"),
  createNode(
    "testimonials",
    "Testimonials",
    Content.world_testimonials_md,
    "content"
  ),
  createNode(
    "acknowledgments",
    "Thanks",
    Content.world_acknowledgments_md,
    "content"
  ),
]);

const neuromandala = createNode(
  "neuromandala",
  "Neuromandala",
  Content.neuromandala_md,
  "content"
);

const contacts = createNode(
  "contacts",
  "Contacts",
  Content.contacts_md,
  "action"
);

// 3. ROOT NODE
export const ROOT_NODE = createNode(
  "home",
  "oda.dream",
  Content.index_md,
  "hub",
  [neuromandala, works, events, collaboration, world, contacts]
);

// 4. FOOTER ACCESS
export const QUICK_ACCESS = [
  ROOT_NODE,
  neuromandala,
  works,
  events,
  collaboration,
  world,
  contacts,
];
