/**
 * Asset Library Store
 * Manages user's personal image library
 */

import { create } from 'zustand';
import { LibraryAsset } from './types';
import { db } from '@/modules/database/db';
import { nanoid } from '@/modules/utils/id';
import { extractColors } from '@/modules/assets/colorExtraction';

interface LibraryStore {
  assets: LibraryAsset[];
  isLoading: boolean;
  
  loadAssets: () => Promise<void>;
  addAsset: (file: File) => Promise<LibraryAsset>;
  deleteAsset: (id: string) => Promise<void>;
  getAsset: (id: string) => Promise<LibraryAsset | undefined>;
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  assets: [],
  isLoading: false,
  
  loadAssets: async () => {
    set({ isLoading: true });
    const assets = await db.libraryAssets.orderBy('uploadedAt').reverse().toArray();
    set({ assets, isLoading: false });
  },
  
  addAsset: async (file: File) => {
    // Read file as data URL
    const dataUrl = await readFileAsDataURL(file);
    
    // Get image dimensions
    const img = await loadImage(dataUrl);
    
    // Extract color palette
    const palette = await extractColors(dataUrl);
    
    const asset: LibraryAsset = {
      id: nanoid(),
      name: file.name,
      src: dataUrl,
      palette,
      width: img.width,
      height: img.height,
      fileSize: file.size,
      uploadedAt: Date.now(),
    };
    
    await db.libraryAssets.add(asset);
    
    // Update store
    set({ assets: [asset, ...get().assets] });
    
    return asset;
  },
  
  deleteAsset: async (id: string) => {
    await db.libraryAssets.delete(id);
    set({ assets: get().assets.filter(a => a.id !== id) });
  },
  
  getAsset: async (id: string) => {
    return db.libraryAssets.get(id);
  },
}));

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

