/**
 * Zustand store for boards and items
 * Provides reactive state management with auto-save to IndexedDB
 */

import { create } from 'zustand';
import { Board, BoardItem } from '@/types';
import { db } from '@/modules/database/db';
import { nanoid } from '@/modules/utils/id';

interface BoardStore {
  boards: Board[];
  currentBoard: Board | null;
  currentItems: BoardItem[];
  isLoading: boolean;
  
  // Board CRUD
  loadBoards: () => Promise<void>;
  createBoard: (title: string) => Promise<Board>;
  updateBoard: (id: string, updates: Partial<Board>) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  duplicateBoard: (id: string) => Promise<Board>;
  
  // Board selection
  selectBoard: (id: string) => Promise<void>;
  
  // Item CRUD
  loadItems: (boardId: string) => Promise<void>;
  addItem: (boardId: string, item: Omit<BoardItem, 'id' | 'boardId' | 'createdAt' | 'order'>) => Promise<BoardItem>;
  updateItem: (id: string, updates: Partial<BoardItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  boards: [],
  currentBoard: null,
  currentItems: [],
  isLoading: false,
  
  loadBoards: async () => {
    set({ isLoading: true });
    const boards = await db.boards.orderBy('createdAt').reverse().toArray();
    set({ boards, isLoading: false });
  },
  
  createBoard: async (title: string) => {
    const board: Board = {
      id: nanoid(),
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      welcomeText: `Willkommen zu ${title}`,
      brandingEnabled: true,
    };
    
    await db.boards.add(board);
    set({ boards: [board, ...get().boards] });
    return board;
  },
  
  updateBoard: async (id: string, updates: Partial<Board>) => {
    const updated = { ...updates, updatedAt: Date.now() };
    await db.boards.update(id, updated);
    
    set({
      boards: get().boards.map(b => b.id === id ? { ...b, ...updated } : b),
      currentBoard: get().currentBoard?.id === id 
        ? { ...get().currentBoard!, ...updated } 
        : get().currentBoard,
    });
  },
  
  deleteBoard: async (id: string) => {
    await db.boards.delete(id);
    await db.items.where('boardId').equals(id).delete();
    
    set({
      boards: get().boards.filter(b => b.id !== id),
      currentBoard: get().currentBoard?.id === id ? null : get().currentBoard,
      currentItems: get().currentBoard?.id === id ? [] : get().currentItems,
    });
  },
  
  duplicateBoard: async (id: string) => {
    const original = await db.boards.get(id);
    if (!original) throw new Error('Board not found');
    
    const newBoard: Board = {
      ...original,
      id: nanoid(),
      title: `${original.title} (Kopie)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    await db.boards.add(newBoard);
    
    // Duplicate items
    const items = await db.items.where('boardId').equals(id).toArray();
    const newItems = items.map(item => ({
      ...item,
      id: nanoid(),
      boardId: newBoard.id,
    }));
    
    await db.items.bulkAdd(newItems);
    
    set({ boards: [newBoard, ...get().boards] });
    return newBoard;
  },
  
  selectBoard: async (id: string) => {
    const board = await db.boards.get(id);
    if (!board) throw new Error('Board not found');
    
    set({ currentBoard: board });
    await get().loadItems(id);
  },
  
  loadItems: async (boardId: string) => {
    const items = await db.items
      .where('boardId')
      .equals(boardId)
      .sortBy('order');
    
    set({ currentItems: items });
  },
  
  addItem: async (boardId: string, item) => {
    const items = get().currentItems;
    const order = items.length > 0 ? Math.max(...items.map(i => i.order)) + 1 : 0;
    
    const newItem: BoardItem = {
      ...item,
      id: nanoid(),
      boardId,
      createdAt: Date.now(),
      order,
    };
    
    await db.items.add(newItem);
    set({ currentItems: [...get().currentItems, newItem] });
    
    // Auto-save board timestamp
    await get().updateBoard(boardId, {});
    
    return newItem;
  },
  
  updateItem: async (id: string, updates: Partial<BoardItem>) => {
    await db.items.update(id, updates);
    
    set({
      currentItems: get().currentItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ),
    });
    
    // Auto-save board timestamp
    const item = get().currentItems.find(i => i.id === id);
    if (item) {
      await get().updateBoard(item.boardId, {});
    }
  },
  
  deleteItem: async (id: string) => {
    await db.items.delete(id);
    
    const item = get().currentItems.find(i => i.id === id);
    set({ currentItems: get().currentItems.filter(i => i.id !== id) });
    
    // Auto-save board timestamp
    if (item) {
      await get().updateBoard(item.boardId, {});
    }
  },
}));

