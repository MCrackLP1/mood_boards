/**
 * Folder types for asset library organization
 */

export interface LibraryFolder {
  id: string;
  name: string;
  icon: string;
  createdAt: number;
  order: number;
}

export const DEFAULT_FOLDERS: Omit<LibraryFolder, 'id' | 'createdAt'>[] = [
  { name: 'Logos & Branding', icon: '🏷️', order: 0 },
  { name: 'Portraits', icon: '👤', order: 1 },
  { name: 'Locations', icon: '📍', order: 2 },
  { name: 'Hochzeiten', icon: '💍', order: 3 },
  { name: 'Produkte', icon: '📦', order: 4 },
];

