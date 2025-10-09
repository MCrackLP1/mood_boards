/**
 * IndexedDB setup using Dexie.js
 * Local-first storage with potential for sync adapters later
 */

import Dexie, { Table } from 'dexie';
import { Board, BoardItem } from '@/types';
import { LibraryAsset } from '@/modules/library/types';

export class MoodboardDatabase extends Dexie {
  boards!: Table<Board>;
  items!: Table<BoardItem>;
  libraryAssets!: Table<LibraryAsset>;

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
  }
}

export const db = new MoodboardDatabase();

