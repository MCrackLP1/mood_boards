/**
 * Folder Store for asset library organization
 */

import { create } from 'zustand';
import { LibraryFolder, DEFAULT_FOLDERS } from './folderTypes';
import { db } from '@/modules/database/db';
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
    const folders = await db.libraryFolders.orderBy('order').toArray();
    
    // Initialize default folders if none exist (except uncategorized)
    if (folders.filter(f => f.id !== 'uncategorized').length === 0) {
      await get().initializeDefaultFolders();
      const updatedFolders = await db.libraryFolders.orderBy('order').toArray();
      set({ folders: updatedFolders, isLoading: false });
    } else {
      set({ folders, isLoading: false });
    }
  },
  
  initializeDefaultFolders: async () => {
    const existingFolders = await db.libraryFolders.toArray();
    const existingIds = new Set(existingFolders.map(f => f.id));
    
    for (const defaultFolder of DEFAULT_FOLDERS) {
      // Skip if already exists
      const folderId = `default-${defaultFolder.name.toLowerCase().replace(/\s+/g, '-')}`;
      if (existingIds.has(folderId)) continue;
      
      const folder: LibraryFolder = {
        id: folderId,
        ...defaultFolder,
        createdAt: Date.now(),
      };
      
      await db.libraryFolders.add(folder);
    }
  },
  
  createFolder: async (name: string, icon = '📁') => {
    const folders = get().folders;
    const maxOrder = folders.length > 0 ? Math.max(...folders.map(f => f.order)) : 0;
    
    const folder: LibraryFolder = {
      id: nanoid(),
      name,
      icon,
      createdAt: Date.now(),
      order: maxOrder + 1,
    };
    
    await db.libraryFolders.add(folder);
    set({ folders: [...get().folders, folder].sort((a, b) => a.order - b.order) });
    
    return folder;
  },
  
  updateFolder: async (id: string, updates: Partial<LibraryFolder>) => {
    await db.libraryFolders.update(id, updates);
    
    set({
      folders: get().folders.map(f => f.id === id ? { ...f, ...updates } : f),
    });
  },
  
  deleteFolder: async (id: string) => {
    // Don't allow deleting uncategorized folder
    if (id === 'uncategorized') {
      alert('Der "Nicht kategorisiert" Ordner kann nicht gelöscht werden.');
      return;
    }
    
    // Move assets from this folder to uncategorized
    await db.libraryAssets
      .where('folderId')
      .equals(id)
      .modify({ folderId: 'uncategorized' });
    
    // Delete folder
    await db.libraryFolders.delete(id);
    
    set({ folders: get().folders.filter(f => f.id !== id) });
  },
}));

