/**
 * Supported UI languages.
 */
export type Language = "en" | "ru";

/**
 * Supported Visual Themes.
 */
export type Theme = "dark" | "light" | "ocean" | "matrix";

/**
 * Interface for bilingual strings used throughout the application.
 */
export interface LocalizedString {
  en: string;
  ru: string;
}

/**
 * Supported media types for the lightbox and inline rendering.
 *
 * ICONOGRAPHY STANDARD:
 * - image: 'Image' (lucide-react)
 * - video: 'Film' (lucide-react)
 * - audio: 'AudioLines' (lucide-react)
 * - unknown: 'FileText' (lucide-react) fallback
 */
export type MediaType = "image" | "video" | "audio" | "unknown";

/**
 * Provenance entity kinds — orthogonal to `type`. `type` is a UI/behaviour
 * category (hub/content/media/action), while `kind` is the semantic role of
 * the node in the provenance graph.
 */
export type Kind = "product" | "event" | "organizer" | "proof" | "media";

/**
 * Visitor / contact counters for events. Both fields optional so partial
 * data still renders.
 */
export interface EventAttendance {
  visitors?: number;
  contacts?: number;
}

/**
 * Core node structure for the Lotus Graph.
 * Represents both navigational hubs, content pages, and interactive actions.
 *
 * NODE TYPE BEHAVIOR & ICONOGRAPHY:
 * - 'hub': Navigation container. Icon: 'Layers'. Shows children in grid.
 * - 'content': Leaf node with text. Icon: 'FileText'. Shows text panel.
 * - 'action': External trigger. Icon: 'Zap'. Opens external link/mail.
 * - 'media': Transient node. Icons: 'Film'/'AudioLines'/'Image'. Opens Lightbox.
 */
export interface LotusNode {
  /** Unique identifier for routing and logic */
  id: string;

  /**
   * ID of the parent node.
   * crucial for file-based system to reconstruct the tree.
   */
  parentId?: string;

  /** Main display title (Bilingual) */
  title: LocalizedString;

  /** Optional shorter title for tight UI spaces (Grid/Tabs) */
  shortTitle?: LocalizedString;

  /** Main content body (Markdown supported) */
  description: LocalizedString;

  /**
   * Node behavior type
   */
  type: "hub" | "content" | "action" | "media";

  /** Thumbnail or background image URL */
  imageUrl?: string;

  /** Full resolution media URL (Video/Audio/HighRes Image) */
  mediaUrl?: string;

  /** Type of mediaUrl, determines how Lightbox renders it and which icon is shown */
  mediaType?: MediaType;

  /** Connected nodes (Up to 8 for 3x3 grid layout) */
  children?: LotusNode[];

  /** Search keywords or visual categories */
  tags?: string[];

  /** External URL for 'action' types */
  externalLink?: string;

  /** Controls visibility in the grid */
  visible?: boolean;

  /** Maturity status of a work, shown as a badge: production | rnd | concept | patent */
  status?: "production" | "rnd" | "concept" | "patent";

  /** Date string (YYYY.MM.DD) representing when this specific node was last updated */
  lastModified?: string;

  /**
   * sort order for children in the grid
   * 0-based index.
   */
  order?: number;

  /**
   * Runtime flag: true when this node was injected into the grid
   * via ![[nodeId]] wiki-embed syntax (not a structural child).
   * Used by LotusGrid to trigger history-based navigation instead of hierarchy.
   * Never persisted — set dynamically in useLotusLogic.
   */
  _isEmbedded?: boolean;

  // -----------------------------------------------------------------
  // Provenance model (Phase A, see plan glowing-pondering-sparrow.md)
  // -----------------------------------------------------------------

  /** Semantic role in the provenance graph. */
  kind?: Kind;

  /**
   * Free-form subtype string. NOT a TS union — taxonomy is data-driven
   * (see src/data/taxonomy.ts). Unknown values render with a fallback.
   */
  subkind?: string;

  /** Events where this product was presented. */
  presented_at?: string[];

  /** Products shown at this event. */
  products?: string[];

  /** Organizer(s) of this event. */
  organizer?: string[];

  /** Commercial client / stand host (distinct from event organizer). */
  client?: string[];

  /** Proofs (awards, press, testimonials) tied to this node. */
  proofs?: string[];

  /** Event(s) or product(s) this proof refers to. */
  proof_of?: string[];

  /** Event(s) or product(s) this media work documents. */
  about?: string[];

  /** Who issued this proof. */
  issued_by?: string[];

  /** Media asset ids from src/data/media.ts attached to this node. */
  media?: string[];

  /** Event attendance counters. */
  attendance?: EventAttendance;

  /** Event start date (ISO YYYY-MM-DD). */
  date_start?: string;

  /** Event end date (ISO YYYY-MM-DD). */
  date_end?: string;

  /** Free-form venue label. */
  venue?: string;

  /** Publication source for press/interview proofs. */
  publication?: string;

  /** ISO date of publication. */
  publication_date?: string;

  /** Asset path (image/scan) for award/letter proofs. */
  asset?: string;

  /** Bilingual quote text for testimonial proofs. */
  quote?: LocalizedString;

  /** External URL for organizers. */
  website?: string;

  // -----------------------------------------------------------------
  // Phase D — external subsites + work access/sale
  // -----------------------------------------------------------------

  /** External canonical site for a product/event (e.g. interference.odadream.art). */
  external_site?: string;
  /** Bilingual CTA label for the external_site banner. */
  external_site_label?: LocalizedString;

  /** Access tier for a media work. public = freely playable, restricted = preview
   *  shown but full body behind paywall/request, private = mentioned only. */
  access?: "public" | "restricted" | "private";
  /** True if the work is purchasable / for licensing. */
  for_sale?: boolean;
  /** URL to a purchase / licensing flow when for_sale = true. */
  purchase_url?: string;
  /** Media asset id (from data/media.ts) used as a teaser when the full work is restricted. */
  preview_media?: string;
}

/**
 * Global navigation state.
 */
export interface NavigationState {
  path: LotusNode[];
}

/**
 * Result of the markdown content parser.
 */
export interface ParsedContent {
  /** The text content with special media syntax removed/cleaned */
  cleanText: string;
  /** Extracted media items converted to temporary LotusNodes */
  mediaNodes: LotusNode[];
}
