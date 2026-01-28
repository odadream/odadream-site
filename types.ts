
/**
 * Supported UI languages.
 */
export type Language = 'en' | 'ru';

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
export type MediaType = 'image' | 'video' | 'audio' | 'unknown';

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
  
  /** Main display title (Bilingual) */
  title: LocalizedString;
  
  /** Optional shorter title for tight UI spaces (Grid/Tabs) */
  shortTitle?: LocalizedString;
  
  /** Main content body (Markdown supported) */
  description: LocalizedString;
  
  /** 
   * Node behavior type
   */
  type: 'hub' | 'content' | 'action' | 'media';
  
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

  /** Date string (YYYY.MM.DD) representing when this specific node was last updated */
  lastModified?: string; 
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
