/**
 * IndexedDB setup using Dexie.js
 * Local-first storage with potential for sync adapters later
 */

import Dexie, { Table } from 'dexie';
import { Board, BoardItem } from '@/types';
import { LibraryAsset } from '@/modules/library/types';
import { LibraryFolder } from '@/modules/library/folderTypes';

export class MoodboardDatabase extends Dexie {
  boards!: Table<Board>;
  items!: Table<BoardItem>;
  libraryAssets!: Table<LibraryAsset>;
  libraryFolders!: Table<LibraryFolder>;

  constructor() {
    super('MoodboardDB');
    
    this.version(1).stores({
      boards: 'id, createdAt, updatedAt',
      items: 'id, boardId, order, createdAt',
    });
    
    // Version 2: Add library assets
    this.version(2).stores({
      boards: 'id, createdAt, updatedAt',
      items: 'id, boardId, order, createdAt',
      libraryAssets: 'id, uploadedAt, name',
    });
    
    // Version 3: Add section to items
    this.version(3).stores({
      boards: 'id, createdAt, updatedAt',
      items: 'id, boardId, section, order, createdAt',
      libraryAssets: 'id, uploadedAt, name',
    }).upgrade(trans => {
      // Set default section for existing items
      return trans.table('items').toCollection().modify(item => {
        if (!item.section) {
          item.section = 'general';
        }
      });
    });
    
    // Version 4: Add folders and update assets with folderId
    this.version(4).stores({
      boards: 'id, createdAt, updatedAt',
      items: 'id, boardId, section, order, createdAt',
      libraryAssets: 'id, folderId, uploadedAt, name',
      libraryFolders: 'id, order, createdAt',
    }).upgrade(async trans => {
      // Create default "Uncategorized" folder
      const defaultFolder = {
        id: 'uncategorized',
        name: 'Nicht kategorisiert',
        icon: '📁',
        createdAt: Date.now(),
        order: 999,
      };
      
      await trans.table('libraryFolders').add(defaultFolder);
      
      // Assign existing assets to default folder
      await trans.table('libraryAssets').toCollection().modify(asset => {
        if (!asset.folderId) {
          asset.folderId = 'uncategorized';
        }
      });
    });
  }
}

export const db = new MoodboardDatabase();

