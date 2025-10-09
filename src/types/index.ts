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
}

export interface BoardItem {
  id: string;
  boardId: string;
  type: 'image' | 'note';
  section?: 'inspiration' | 'location' | 'general'; // Section assignment
  order: number; // For sorting items within section
  createdAt: number;
  
  // Image-specific fields
  src?: string; // Base64 or blob URL
  palette?: Color[];
  
  // Note-specific fields
  text?: string;
  
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

