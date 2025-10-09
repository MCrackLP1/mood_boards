/**
 * Folder Store for asset library organization with Supabase cloud sync + IndexedDB fallback
 */

import { create } from 'zustand';
import { LibraryFolder, DEFAULT_FOLDERS } from './folderTypes';
import { db } from '@/modules/database/db';
import { supabase } from '@/modules/database/supabase';
import { nanoid } from '@/modules/utils/id';

interface FolderStore {
  folders: LibraryFolder[];
  isLoading: boolean;
  
  loadFolders: () => Promise<void>;
  createFolder: (name: string, icon?: string) => Promise<LibraryFolder>;
  updateFolder: (id: string, updates: Partial<LibraryFolder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  initializeDefaultFolders: () => Promise<void>;
}

export const useFolderStore = create<FolderStore>((set, get) => ({
  folders: [],
  isLoading: false,
  
  loadFolders: async () => {
    set({ isLoading: true });
    try {
      // Load from Supabase
      const { data: supabaseFolders, error } = await supabase
        .from('library_folders')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      // Transform to camelCase
      const folders: LibraryFolder[] = supabaseFolders?.map(f => ({
        id: f.id,
        name: f.name,
        icon: f.icon,
        order: f.order,
        createdAt: f.created_at,
      })) || [];

      // Initialize default folders if none exist (except uncategorized)
      if (folders.filter(f => f.id !== 'uncategorized').length === 0) {
        await get().initializeDefaultFolders();
        // Reload from Supabase after initialization
        const { data: updatedFolders } = await supabase
          .from('library_folders')
          .select('*')
          .order('order', { ascending: true });
        
        const transformedFolders = updatedFolders?.map(f => ({
          id: f.id,
          name: f.name,
          icon: f.icon,
          order: f.order,
          createdAt: f.created_at,
        })) || [];

        // Sync to IndexedDB
        await db.libraryFolders.clear();
        await db.libraryFolders.bulkAdd(transformedFolders);

        set({ folders: transformedFolders, isLoading: false });
      } else {
        // Sync to IndexedDB
        await db.libraryFolders.clear();
        await db.libraryFolders.bulkAdd(folders);

        set({ folders, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load folders from Supabase, falling back to IndexedDB:', error);
      const folders = await db.libraryFolders.orderBy('order').toArray();
      
      // Initialize default folders if none exist (except uncategorized)
      if (folders.filter(f => f.id !== 'uncategorized').length === 0) {
        await get().initializeDefaultFolders();
        const updatedFolders = await db.libraryFolders.orderBy('order').toArray();
        set({ folders: updatedFolders, isLoading: false });
      } else {
        set({ folders, isLoading: false });
      }
    }
  },
  
  initializeDefaultFolders: async () => {
    // Check existing folders in Supabase
    const { data: existingFolders } = await supabase
      .from('library_folders')
      .select('id');
    
    const existingIds = new Set((existingFolders || []).map(f => f.id));
    
    for (let i = 0; i < DEFAULT_FOLDERS.length; i++) {
      const defaultFolder = DEFAULT_FOLDERS[i];
      const folderId = `default-${defaultFolder.name.toLowerCase().replace(/\s+/g, '-')}`;
      
      // Skip if already exists
      if (existingIds.has(folderId)) continue;
      
      const folder: LibraryFolder = {
        id: folderId,
        name: defaultFolder.name,
        icon: defaultFolder.icon,
        order: i + 1, // Start at 1 since uncategorized is 0
        createdAt: Date.now(),
      };
      
      // Save to Supabase
      try {
        const { error } = await supabase.from('library_folders').insert({
          id: folder.id,
          name: folder.name,
          icon: folder.icon,
          order: folder.order,
          created_at: folder.createdAt,
        });

        if (error) throw error;
      } catch (error) {
        console.error('Failed to save folder to Supabase:', error);
      }

      // Save to IndexedDB
      await db.libraryFolders.add(folder);
    }
  },
  
  createFolder: async (name: string, icon = '📁') => {
    const maxOrder = Math.max(0, ...get().folders.map(f => f.order));
    const folder: LibraryFolder = {
      id: nanoid(),
      name,
      icon,
      order: maxOrder + 1,
      createdAt: Date.now(),
    };

    // Save to Supabase
    try {
      const { error } = await supabase.from('library_folders').insert({
        id: folder.id,
        name: folder.name,
        icon: folder.icon,
        order: folder.order,
        created_at: folder.createdAt,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save folder to Supabase:', error);
    }

    // Save to IndexedDB
    await db.libraryFolders.add(folder);
    set({ folders: [...get().folders, folder].sort((a, b) => a.order - b.order) });
    return folder;
  },
  
  updateFolder: async (id: string, updates: Partial<LibraryFolder>) => {
    // Update Supabase
    try {
      const supabaseUpdates: any = {};
      if (updates.name) supabaseUpdates.name = updates.name;
      if (updates.icon) supabaseUpdates.icon = updates.icon;
      if (updates.order !== undefined) supabaseUpdates.order = updates.order;

      const { error } = await supabase
        .from('library_folders')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update folder in Supabase:', error);
    }

    // Update IndexedDB
    await db.libraryFolders.update(id, updates);
    const folder = await db.libraryFolders.get(id);
    if (!folder) throw new Error('Folder not found');
    
    set({
      folders: get().folders.map(f => f.id === id ? folder : f),
    });
  },
  
  deleteFolder: async (id: string) => {
    // Don't allow deleting uncategorized folder
    if (id === 'uncategorized') {
      alert('Der "Nicht kategorisiert" Ordner kann nicht gelöscht werden.');
      return;
    }
    
    // Move all assets in this folder to uncategorized in Supabase
    try {
      const { error } = await supabase
        .from('library_assets')
        .update({ folder_id: 'uncategorized' })
        .eq('folder_id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to move assets in Supabase:', error);
    }

    // Move in IndexedDB
    await db.libraryAssets.where('folderId').equals(id).modify({ folderId: 'uncategorized' });
    
    // Delete from Supabase
    try {
      const { error } = await supabase
        .from('library_folders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete folder from Supabase:', error);
    }

    // Delete from IndexedDB
    await db.libraryFolders.delete(id);
    set({ folders: get().folders.filter(f => f.id !== id) });
  },
}));


