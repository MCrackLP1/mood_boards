/**
 * Asset Library Store
 * Manages user's personal image library with backend sync
 */

import { create } from 'zustand';
import { LibraryAsset } from './types';
import { assetsApi } from '@/modules/api/client';
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
    try {
      const assets = await assetsApi.getAll(folderId);
      set({ assets, isLoading: false });
    } catch (error) {
      console.error('Failed to load assets:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  addAsset: async (file: File, folderId = 'uncategorized') => {
    // Read file as data URL
    const dataUrl = await readFileAsDataURL(file);
    
    // Get image dimensions
    const img = await loadImage(dataUrl);
    
    // Extract color palette
    const palette = await extractColors(dataUrl);
    
    const asset = await assetsApi.create({
      folderId,
      name: file.name,
      src: dataUrl,
      palette,
      width: img.width,
      height: img.height,
      fileSize: file.size,
    });
    
    // Update store
    set({ assets: [asset, ...get().assets] });
    
    return asset;
  },
  
  deleteAsset: async (id: string) => {
    await assetsApi.delete(id);
    set({ assets: get().assets.filter(a => a.id !== id) });
  },
  
  getAsset: async (id: string) => {
    return assetsApi.getById(id);
  },
  
  moveAsset: async (assetId: string, targetFolderId: string) => {
    const asset = await assetsApi.move(assetId, targetFolderId);
    
    set({
      assets: get().assets.map(a => 
        a.id === assetId ? asset : a
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

