/**
 * Zustand store for boards and items
 * Provides reactive state management with backend API sync
 */

import { create } from 'zustand';
import { Board, BoardItem } from '@/types';
import { boardsApi, itemsApi } from '@/modules/api/client';

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
    try {
      const boards = await boardsApi.getAll();
      set({ boards, isLoading: false });
    } catch (error) {
      console.error('Failed to load boards:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  createBoard: async (title: string) => {
    const board = await boardsApi.create(title);
    set({ boards: [board, ...get().boards] });
    return board;
  },
  
  updateBoard: async (id: string, updates: Partial<Board>) => {
    const board = await boardsApi.update(id, updates);
    
    set({
      boards: get().boards.map(b => b.id === id ? board : b),
      currentBoard: get().currentBoard?.id === id ? board : get().currentBoard,
    });
  },
  
  deleteBoard: async (id: string) => {
    await boardsApi.delete(id);
    
    set({
      boards: get().boards.filter(b => b.id !== id),
      currentBoard: get().currentBoard?.id === id ? null : get().currentBoard,
      currentItems: get().currentBoard?.id === id ? [] : get().currentItems,
    });
  },
  
  duplicateBoard: async (id: string) => {
    const newBoard = await boardsApi.duplicate(id);
    set({ boards: [newBoard, ...get().boards] });
    return newBoard;
  },
  
  selectBoard: async (id: string) => {
    const board = await boardsApi.getById(id);
    set({ currentBoard: board });
    await get().loadItems(id);
  },
  
  loadItems: async (boardId: string) => {
    const items = await itemsApi.getByBoardId(boardId);
    set({ currentItems: items });
  },
  
  addItem: async (boardId: string, item) => {
    const newItem = await itemsApi.create({ ...item, boardId });
    set({ currentItems: [...get().currentItems, newItem] });
    return newItem;
  },
  
  updateItem: async (id: string, updates: Partial<BoardItem>) => {
    const updatedItem = await itemsApi.update(id, updates);
    
    set({
      currentItems: get().currentItems.map(item => 
        item.id === id ? updatedItem : item
      ),
    });
  },
  
  deleteItem: async (id: string) => {
    await itemsApi.delete(id);
    set({ currentItems: get().currentItems.filter(i => i.id !== id) });
  },
}));


