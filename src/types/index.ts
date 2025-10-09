/**
 * Core data types for the moodboard application
 */

export interface Color {
  hex: string;
  rgb: [number, number, number];
  score: number; // Dominance score (0-1)
}

export interface Board {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  welcomeText: string;
  brandingEnabled: boolean;
  passwordHash?: string; // Simple SHA-256 hash for basic protection
  ambientSoundUrl?: string; // Optional ambient sound URL
  customSections?: Section[]; // Custom user-defined sections
  layoutMode?: 'grid' | 'masonry' | 'single-column'; // Layout preference
}

export interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  isCustom: boolean;
  order: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  order: number;
}

export interface TimelineItem {
  id: string;
  time: string; // ISO 8601 format or time string
  location: string;
  description: string;
  coordinates?: { lat: number; lng: number };
  order: number;
}

export interface LinkPreview {
  title: string;
  description: string;
  image: string;
  domain: string;
}

export interface BoardItem {
  id: string;
  boardId: string;
  type: 'image' | 'note' | 'link' | 'checklist' | 'timeline';
  section?: string; // Now flexible to support custom sections
  order: number; // For sorting items within section
  createdAt: number;
  
  // Image-specific fields
  src?: string; // Base64 or blob URL
  palette?: Color[];
  
  // Note-specific fields
  text?: string;
  
  // Link-specific fields
  linkUrl?: string;
  linkPreview?: LinkPreview;
  
  // Checklist-specific fields
  checklistItems?: ChecklistItem[];
  
  // Timeline-specific fields
  timelineItems?: TimelineItem[];
  
  // Optional metadata
  meta?: {
    label?: string;
    description?: string;
  };
}

export interface AudioProvider {
  name: string;
  search(query: string, options?: AudioSearchOptions): Promise<AudioResult[]>;
  getStreamUrl(id: string): Promise<string>;
}

export interface AudioSearchOptions {
  duration?: 'short' | 'medium' | 'long';
  limit?: number;
}

export interface AudioResult {
  id: string;
  title: string;
  duration: number; // seconds
  previewUrl: string;
  license: string;
  author?: string;
}

