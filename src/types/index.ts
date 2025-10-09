export interface Board {
  id: string;
  title: string;
  items: BoardItem[];
  createdAt: string;
}

export type BoardItem = ImageItem | NoteItem | ColorPaletteItem;

export interface ImageItem {
  id: string;
  type: 'image';
  url: string; // This will be a base64 Data URL for local storage
  filename: string;
}

export interface NoteItem {
  id: string;
  type: 'note';
  content: string;
}

export interface ColorPaletteItem {
  id: string;
  type: 'color';
  colors: string[]; // Array of hex color codes
}
