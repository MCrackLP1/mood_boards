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
  }
}

export const db = new MoodboardDatabase();

