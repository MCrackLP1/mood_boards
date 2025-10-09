/**
 * Zustand store for boards and items
 * Provides reactive state management with Supabase cloud sync + IndexedDB fallback
 */

import { create } from 'zustand';
import { Board, BoardItem } from '@/types';
import { db } from '@/modules/database/db';
import { supabase } from '@/modules/database/supabase';
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
    try {
      // Try to load from Supabase first
      const { data: supabaseBoards, error } = await supabase
        .from('boards')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Transform snake_case to camelCase
      const boards: Board[] = supabaseBoards?.map(b => ({
        id: b.id,
        title: b.title,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
        welcomeText: b.welcome_text,
        brandingEnabled: b.branding_enabled,
        passwordHash: b.password_hash || undefined,
        ambientSoundUrl: b.ambient_sound_url || undefined,
      })) || [];

      // Sync to IndexedDB for offline access
      await db.boards.clear();
      await db.boards.bulkAdd(boards);

      set({ boards, isLoading: false });
    } catch (error) {
      console.error('Failed to load boards from Supabase, falling back to IndexedDB:', error);
      // Fallback to IndexedDB
      const boards = await db.boards.orderBy('updatedAt').reverse().toArray();
      set({ boards, isLoading: false });
    }
  },
  
  createBoard: async (title: string) => {
    const now = Date.now();
    const board: Board = {
      id: nanoid(),
      title,
      createdAt: now,
      updatedAt: now,
      welcomeText: `Willkommen zu "${title}"`,
      brandingEnabled: true,
    };

    // Save to Supabase first
    try {
      const { error } = await supabase.from('boards').insert({
        id: board.id,
        title: board.title,
        created_at: board.createdAt,
        updated_at: board.updatedAt,
        welcome_text: board.welcomeText,
        branding_enabled: board.brandingEnabled,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save board to Supabase:', error);
    }

    // Always save to IndexedDB for offline access
    await db.boards.add(board);
    set({ boards: [board, ...get().boards] });
    return board;
  },
  
  updateBoard: async (id: string, updates: Partial<Board>) => {
    const updatedData = { ...updates, updatedAt: Date.now() };

    // Update Supabase
    try {
      const supabaseUpdates: any = {};
      if (updates.title) supabaseUpdates.title = updates.title;
      if (updates.welcomeText) supabaseUpdates.welcome_text = updates.welcomeText;
      if (updates.brandingEnabled !== undefined) supabaseUpdates.branding_enabled = updates.brandingEnabled;
      if (updates.passwordHash !== undefined) supabaseUpdates.password_hash = updates.passwordHash;
      if (updates.ambientSoundUrl !== undefined) supabaseUpdates.ambient_sound_url = updates.ambientSoundUrl;
      supabaseUpdates.updated_at = updatedData.updatedAt;

      const { error } = await supabase
        .from('boards')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update board in Supabase:', error);
    }

    // Update IndexedDB
    await db.boards.update(id, updatedData);
    const board = await db.boards.get(id);
    if (!board) throw new Error('Board not found');
    
    set({
      boards: get().boards.map(b => b.id === id ? board : b),
      currentBoard: get().currentBoard?.id === id ? board : get().currentBoard,
    });
  },
  
  deleteBoard: async (id: string) => {
    // Delete from Supabase (cascade will delete items)
    try {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete board from Supabase:', error);
    }

    // Delete from IndexedDB
    await db.boards.delete(id);
    await db.items.where('boardId').equals(id).delete();
    
    set({
      boards: get().boards.filter(b => b.id !== id),
      currentBoard: get().currentBoard?.id === id ? null : get().currentBoard,
      currentItems: get().currentBoard?.id === id ? [] : get().currentItems,
    });
  },
  
  duplicateBoard: async (id: string) => {
    const originalBoard = await db.boards.get(id);
    if (!originalBoard) throw new Error('Board not found');
    
    const now = Date.now();
    const newBoard: Board = {
      ...originalBoard,
      id: nanoid(),
      title: `${originalBoard.title} (Kopie)`,
      createdAt: now,
      updatedAt: now,
    };
    
    // Save new board to Supabase
    try {
      const { error } = await supabase.from('boards').insert({
        id: newBoard.id,
        title: newBoard.title,
        created_at: newBoard.createdAt,
        updated_at: newBoard.updatedAt,
        welcome_text: newBoard.welcomeText,
        branding_enabled: newBoard.brandingEnabled,
        password_hash: newBoard.passwordHash,
        ambient_sound_url: newBoard.ambientSoundUrl,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to duplicate board in Supabase:', error);
    }

    await db.boards.add(newBoard);
    
    // Duplicate all items
    const originalItems = await db.items.where('boardId').equals(id).toArray();
    for (const item of originalItems) {
      const newItem = {
        ...item,
        id: nanoid(),
        boardId: newBoard.id,
        createdAt: now,
      };

      // Save to Supabase
      try {
        const { error } = await supabase.from('board_items').insert({
          id: newItem.id,
          board_id: newItem.boardId,
          type: newItem.type,
          section: newItem.section,
          order: newItem.order,
          created_at: newItem.createdAt,
          src: newItem.src,
          palette: newItem.palette as any,
          text: newItem.text,
          meta: newItem.meta as any,
        });

        if (error) throw error;
      } catch (error) {
        console.error('Failed to duplicate item in Supabase:', error);
      }

      await db.items.add(newItem);
    }
    
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
    try {
      // Load from Supabase
      const { data: supabaseItems, error } = await supabase
        .from('board_items')
        .select('*')
        .eq('board_id', boardId)
        .order('order', { ascending: true });

      if (error) throw error;

      // Transform to camelCase
      const items: BoardItem[] = supabaseItems?.map(item => ({
        id: item.id,
        boardId: item.board_id,
        type: item.type as 'image' | 'note',
        section: item.section as 'inspiration' | 'location' | 'general' | undefined,
        order: item.order,
        createdAt: item.created_at,
        src: item.src || undefined,
        palette: item.palette as any,
        text: item.text || undefined,
        meta: item.meta as any,
      })) || [];

      // Sync to IndexedDB
      await db.items.where('boardId').equals(boardId).delete();
      await db.items.bulkAdd(items);

      set({ currentItems: items });
    } catch (error) {
      console.error('Failed to load items from Supabase, falling back to IndexedDB:', error);
      const items = await db.items.where('boardId').equals(boardId).sortBy('order');
      set({ currentItems: items });
    }
  },
  
  addItem: async (boardId: string, item) => {
    const maxOrder = Math.max(0, ...get().currentItems.map(i => i.order || 0));
    const newItem: BoardItem = {
      ...item,
      id: nanoid(),
      boardId,
      createdAt: Date.now(),
      order: maxOrder + 1,
    };

    // Save to Supabase
    try {
      const { error } = await supabase.from('board_items').insert({
        id: newItem.id,
        board_id: newItem.boardId,
        type: newItem.type,
        section: newItem.section,
        order: newItem.order,
        created_at: newItem.createdAt,
        src: newItem.src,
        palette: newItem.palette as any,
        text: newItem.text,
        meta: newItem.meta as any,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save item to Supabase:', error);
    }

    // Save to IndexedDB
    await db.items.add(newItem);
    set({ currentItems: [...get().currentItems, newItem] });
    return newItem;
  },
  
  updateItem: async (id: string, updates: Partial<BoardItem>) => {
    // Update Supabase
    try {
      const supabaseUpdates: any = {};
      if (updates.type) supabaseUpdates.type = updates.type;
      if (updates.section !== undefined) supabaseUpdates.section = updates.section;
      if (updates.order !== undefined) supabaseUpdates.order = updates.order;
      if (updates.src !== undefined) supabaseUpdates.src = updates.src;
      if (updates.palette !== undefined) supabaseUpdates.palette = updates.palette;
      if (updates.text !== undefined) supabaseUpdates.text = updates.text;
      if (updates.meta !== undefined) supabaseUpdates.meta = updates.meta;

      const { error } = await supabase
        .from('board_items')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update item in Supabase:', error);
    }

    // Update IndexedDB
    await db.items.update(id, updates);
    const updatedItem = await db.items.get(id);
    if (!updatedItem) throw new Error('Item not found');
    
    set({
      currentItems: get().currentItems.map(item => 
        item.id === id ? updatedItem : item
      ),
    });
  },
  
  deleteItem: async (id: string) => {
    // Delete from Supabase
    try {
      const { error } = await supabase
        .from('board_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete item from Supabase:', error);
    }

    // Delete from IndexedDB
    await db.items.delete(id);
    set({ currentItems: get().currentItems.filter(i => i.id !== id) });
  },
}));


