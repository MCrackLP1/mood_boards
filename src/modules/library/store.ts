/**
 * Asset Library Store
 * Manages user's personal image library with Supabase cloud sync + IndexedDB fallback
 */

import { create } from 'zustand';
import { LibraryAsset } from './types';
import { db } from '@/modules/database/db';
import { supabase } from '@/modules/database/supabase';
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
    try {
      // Load from Supabase
      let query = supabase
        .from('library_assets')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (folderId) {
        query = query.eq('folder_id', folderId);
      }

      const { data: supabaseAssets, error } = await query;

      if (error) throw error;

      // Transform to camelCase
      const assets: LibraryAsset[] = supabaseAssets?.map(a => ({
        id: a.id,
        folderId: a.folder_id,
        name: a.name,
        src: a.src,
        thumbnailSrc: a.thumbnail_src || undefined,
        palette: a.palette as any,
        width: a.width,
        height: a.height,
        fileSize: a.file_size,
        uploadedAt: a.uploaded_at,
        tags: a.tags || undefined,
      })) || [];

      // Sync to IndexedDB
      if (folderId) {
        // Don't clear all - just add new ones
        for (const asset of assets) {
          try {
            await db.libraryAssets.put(asset);
          } catch (e) {
            console.warn('Failed to sync asset to IndexedDB:', e);
          }
        }
      } else {
        await db.libraryAssets.clear();
        if (assets.length > 0) {
          await db.libraryAssets.bulkAdd(assets);
        }
      }

      set({ assets, isLoading: false });
    } catch (error: any) {
      console.error('Failed to load assets from Supabase, falling back to IndexedDB:', error);
      console.error('Load assets error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
      });
      let assets: LibraryAsset[];
      if (folderId) {
        assets = await db.libraryAssets.where('folderId').equals(folderId).reverse().sortBy('uploadedAt');
      } else {
        assets = await db.libraryAssets.orderBy('uploadedAt').reverse().toArray();
      }
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
    
    // Save to Supabase
    try {
      const { error } = await supabase.from('library_assets').insert({
        id: asset.id,
        folder_id: asset.folderId,
        name: asset.name,
        src: asset.src,
        thumbnail_src: asset.thumbnailSrc,
        palette: asset.palette as any,
        width: asset.width,
        height: asset.height,
        file_size: asset.fileSize,
        uploaded_at: asset.uploadedAt,
        tags: asset.tags,
      });

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Failed to save asset to Supabase:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });
      // Don't throw - continue with IndexedDB
    }

    // Save to IndexedDB first (for immediate display)
    await db.libraryAssets.add(asset);
    
    // Update store immediately for instant feedback
    set({ assets: [asset, ...get().assets] });
    
    // Reload from Supabase after a short delay to ensure sync
    setTimeout(() => {
      get().loadAssets(folderId).catch(err => 
        console.warn('Background reload failed:', err)
      );
    }, 1000);
    
    return asset;
  },
  
  deleteAsset: async (id: string) => {
    // Delete from Supabase
    try {
      const { error } = await supabase
        .from('library_assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete asset from Supabase:', error);
    }

    // Delete from IndexedDB
    await db.libraryAssets.delete(id);
    set({ assets: get().assets.filter(a => a.id !== id) });
  },
  
  getAsset: async (id: string) => {
    return db.libraryAssets.get(id);
  },
  
  moveAsset: async (assetId: string, targetFolderId: string) => {
    // Update Supabase
    try {
      const { error } = await supabase
        .from('library_assets')
        .update({ folder_id: targetFolderId })
        .eq('id', assetId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to move asset in Supabase:', error);
    }

    // Update IndexedDB
    await db.libraryAssets.update(assetId, { folderId: targetFolderId });
    const asset = await db.libraryAssets.get(assetId);
    if (!asset) throw new Error('Asset not found');
    
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

