export interface LotusNode {
  id: string;
  title: string;
  shortTitle?: string;
  description: string;
  type: 'hub' | 'content' | 'action' | 'media';
  imageUrl?: string;
  mediaUrl?: string; // For the full size media content
  children?: LotusNode[]; // Up to 8 children to surround the center
  tags?: string[];
  externalLink?: string;
  visible?: boolean; // Control visibility (default true)
}

export interface NavigationState {
  path: LotusNode[]; // The stack of nodes leading to the current view
}

export interface ParsedContent {
  cleanText: string;
  mediaNodes: LotusNode[];
}