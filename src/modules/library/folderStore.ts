/**
 * Folder Store for asset library organization with backend sync
 */

import { create } from 'zustand';
import { LibraryFolder, DEFAULT_FOLDERS } from './folderTypes';
import { foldersApi } from '@/modules/api/client';

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
      const folders = await foldersApi.getAll();
      
      // Initialize default folders if none exist (except uncategorized)
      if (folders.filter(f => f.id !== 'uncategorized').length === 0) {
        await get().initializeDefaultFolders();
        const updatedFolders = await foldersApi.getAll();
        set({ folders: updatedFolders, isLoading: false });
      } else {
        set({ folders, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load folders:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  initializeDefaultFolders: async () => {
    const existingFolders = await foldersApi.getAll();
    const existingIds = new Set(existingFolders.map(f => f.id));
    
    for (const defaultFolder of DEFAULT_FOLDERS) {
      // Skip if already exists
      const folderId = `default-${defaultFolder.name.toLowerCase().replace(/\s+/g, '-')}`;
      if (existingIds.has(folderId)) continue;
      
      await foldersApi.create({
        name: defaultFolder.name,
        icon: defaultFolder.icon,
      });
    }
  },
  
  createFolder: async (name: string, icon = '📁') => {
    const folder = await foldersApi.create({ name, icon });
    set({ folders: [...get().folders, folder].sort((a, b) => a.order - b.order) });
    return folder;
  },
  
  updateFolder: async (id: string, updates: Partial<LibraryFolder>) => {
    const folder = await foldersApi.update(id, updates);
    
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
    
    await foldersApi.delete(id);
    set({ folders: get().folders.filter(f => f.id !== id) });
  },
}));


