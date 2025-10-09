/**
 * IndexedDB setup using Dexie.js
 * Local-first storage with potential for sync adapters later
 */

import Dexie, { Table } from 'dexie';
import { Board, BoardItem } from '@/types';

export class MoodboardDatabase extends Dexie {
  boards!: Table<Board>;
  items!: Table<BoardItem>;

  constructor() {
    super('MoodboardDB');
    
    this.version(1).stores({
      boards: 'id, createdAt, updatedAt',
      items: 'id, boardId, order, createdAt',
    });
  }
}

export const db = new MoodboardDatabase();

