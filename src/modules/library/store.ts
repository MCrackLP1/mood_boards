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
  
  loadAssets: (folderId?: string) => Promise<void>;
  addAsset: (file: File, folderId?: string) => Promise<LibraryAsset>;
  deleteAsset: (id: string) => Promise<void>;
  getAsset: (id: string) => Promise<LibraryAsset | undefined>;
  moveAsset: (assetId: string, targetFolderId: string) => Promise<void>;
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  assets: [],
  isLoading: false,
  
  loadAssets: async (folderId?: string) => {
    set({ isLoading: true });
    
    let query = db.libraryAssets.orderBy('uploadedAt').reverse();
    
    if (folderId) {
      const assets = await query.filter(a => a.folderId === folderId).toArray();
      set({ assets, isLoading: false });
    } else {
      const assets = await query.toArray();
      set({ assets, isLoading: false });
    }
  },
  
  addAsset: async (file: File, folderId = 'uncategorized') => {
    // Read file as data URL
    const dataUrl = await readFileAsDataURL(file);
    
    // Get image dimensions
    const img = await loadImage(dataUrl);
    
    // Extract color palette
    const palette = await extractColors(dataUrl);
    
    const asset: LibraryAsset = {
      id: nanoid(),
      folderId,
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
  
  moveAsset: async (assetId: string, targetFolderId: string) => {
    await db.libraryAssets.update(assetId, { folderId: targetFolderId });
    
    set({
      assets: get().assets.map(a => 
        a.id === assetId ? { ...a, folderId: targetFolderId } : a
      ),
    });
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

