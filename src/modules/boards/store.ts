/**
 * Zustand store for boards and items
 * Provides reactive state management with Supabase cloud sync + IndexedDB fallback
 */

import { create } from 'zustand';
import { Board, BoardItem, Section } from '@/types';
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
  reorderItems: (itemIds: string[]) => Promise<void>;
  
  // Section Management
  addCustomSection: (boardId: string, section: Omit<Section, 'isCustom' | 'order'>) => Promise<void>;
  updateCustomSection: (boardId: string, sectionId: string, updates: Partial<Section>) => Promise<void>;
  deleteCustomSection: (boardId: string, sectionId: string) => Promise<void>;
  reorderSections: (boardId: string, sectionIds: string[]) => Promise<void>;
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
        customSections: (b.custom_sections as any) || [],
        layoutMode: (b.layout_mode as 'grid' | 'masonry' | 'single-column') || 'grid',
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
      customSections: [],
      layoutMode: 'grid',
    };

    // Save to Supabase FIRST - this is the source of truth
    try {
      const { error } = await supabase.from('boards').insert({
        id: board.id,
        title: board.title,
        created_at: board.createdAt,
        updated_at: board.updatedAt,
        welcome_text: board.welcomeText,
        branding_enabled: board.brandingEnabled,
        custom_sections: board.customSections as any,
        layout_mode: board.layoutMode,
      });

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`Board konnte nicht gespeichert werden: ${error.message}`);
      }

      // Only cache to IndexedDB if Supabase succeeded
      await db.boards.add(board);
      set({ boards: [board, ...get().boards] });
      return board;
    } catch (error: any) {
      console.error('Failed to create board:', error);
      alert(`Fehler beim Erstellen des Boards: ${error.message}\n\nBitte stelle sicher, dass du online bist.`);
      throw error;
    }
  },
  
  updateBoard: async (id: string, updates: Partial<Board>) => {
    const updatedData = { ...updates, updatedAt: Date.now() };

    // Update Supabase FIRST
    try {
      const supabaseUpdates: any = {};
      if (updates.title) supabaseUpdates.title = updates.title;
      if (updates.welcomeText) supabaseUpdates.welcome_text = updates.welcomeText;
      if (updates.brandingEnabled !== undefined) supabaseUpdates.branding_enabled = updates.brandingEnabled;
      if (updates.passwordHash !== undefined) supabaseUpdates.password_hash = updates.passwordHash;
      if (updates.ambientSoundUrl !== undefined) supabaseUpdates.ambient_sound_url = updates.ambientSoundUrl;
      if (updates.customSections !== undefined) supabaseUpdates.custom_sections = updates.customSections;
      if (updates.layoutMode !== undefined) supabaseUpdates.layout_mode = updates.layoutMode;
      if (updates.shootingDuration !== undefined) supabaseUpdates.shooting_duration = updates.shootingDuration;
      supabaseUpdates.updated_at = updatedData.updatedAt;

      const { error } = await supabase
        .from('boards')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
        throw new Error(`Board konnte nicht aktualisiert werden: ${error.message}`);
      }

      // Only cache to IndexedDB if Supabase succeeded
      await db.boards.update(id, updatedData);
      const board = await db.boards.get(id);
      if (!board) throw new Error('Board not found');
      
      set({
        boards: get().boards.map(b => b.id === id ? board : b),
        currentBoard: get().currentBoard?.id === id ? board : get().currentBoard,
      });
    } catch (error: any) {
      console.error('Failed to update board:', error);
      alert(`Fehler beim Speichern: ${error.message}\n\nBitte stelle sicher, dass du online bist.`);
      throw error;
    }
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
        custom_sections: newBoard.customSections as any,
        layout_mode: newBoard.layoutMode,
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
          link_url: newItem.linkUrl,
          link_preview: newItem.linkPreview as any,
          checklist_items: newItem.checklistItems as any,
          timeline_items: newItem.timelineItems as any,
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
        type: item.type as BoardItem['type'],
        section: item.section || undefined,
        order: item.order,
        createdAt: item.created_at,
        src: item.src || undefined,
        palette: item.palette as any,
        text: item.text || undefined,
        meta: item.meta as any,
        linkUrl: item.link_url || undefined,
        linkPreview: item.link_preview as any,
        checklistItems: item.checklist_items as any,
        timelineItems: item.timeline_items as any,
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

    // Save to Supabase FIRST
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
        link_url: newItem.linkUrl,
        link_preview: newItem.linkPreview as any,
        checklist_items: newItem.checklistItems as any,
        timeline_items: newItem.timelineItems as any,
      });

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`Item konnte nicht gespeichert werden: ${error.message}`);
      }

      // Only cache to IndexedDB if Supabase succeeded
      await db.items.add(newItem);
      set({ currentItems: [...get().currentItems, newItem] });
      return newItem;
    } catch (error: any) {
      console.error('Failed to add item:', error);
      alert(`Fehler beim Hinzufügen: ${error.message}\n\nBitte stelle sicher, dass du online bist.`);
      throw error;
    }
  },
  
  updateItem: async (id: string, updates: Partial<BoardItem>) => {
    // Update Supabase FIRST
    try {
      const supabaseUpdates: any = {};
      if (updates.type) supabaseUpdates.type = updates.type;
      if (updates.section !== undefined) supabaseUpdates.section = updates.section;
      if (updates.order !== undefined) supabaseUpdates.order = updates.order;
      if (updates.src !== undefined) supabaseUpdates.src = updates.src;
      if (updates.palette !== undefined) supabaseUpdates.palette = updates.palette;
      if (updates.text !== undefined) supabaseUpdates.text = updates.text;
      if (updates.meta !== undefined) supabaseUpdates.meta = updates.meta;
      if (updates.linkUrl !== undefined) supabaseUpdates.link_url = updates.linkUrl;
      if (updates.linkPreview !== undefined) supabaseUpdates.link_preview = updates.linkPreview;
      if (updates.checklistItems !== undefined) supabaseUpdates.checklist_items = updates.checklistItems;
      if (updates.timelineItems !== undefined) supabaseUpdates.timeline_items = updates.timelineItems;

      const { error } = await supabase
        .from('board_items')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
        throw new Error(`Item konnte nicht aktualisiert werden: ${error.message}`);
      }

      // Only cache to IndexedDB if Supabase succeeded
      await db.items.update(id, updates);
      const updatedItem = await db.items.get(id);
      if (!updatedItem) throw new Error('Item not found');
      
      set({
        currentItems: get().currentItems.map(item => 
          item.id === id ? updatedItem : item
        ),
      });
    } catch (error: any) {
      console.error('Failed to update item:', error);
      // Silent fail for updates (could be bulk operations)
      throw error;
    }
  },
  
  deleteItem: async (id: string) => {
    // Delete from Supabase FIRST
    try {
      const { error } = await supabase
        .from('board_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(`Item konnte nicht gelöscht werden: ${error.message}`);
      }

      // Only remove from IndexedDB cache if Supabase succeeded
      await db.items.delete(id);
      set({ currentItems: get().currentItems.filter(i => i.id !== id) });
    } catch (error: any) {
      console.error('Failed to delete item:', error);
      alert(`Fehler beim Löschen: ${error.message}\n\nBitte stelle sicher, dass du online bist.`);
      throw error;
    }
  },

  reorderItems: async (itemIds: string[]) => {
    // Optimistic update
    const itemsMap = new Map(get().currentItems.map(item => [item.id, item]));
    const reorderedItems = itemIds
      .map(id => itemsMap.get(id))
      .filter((item): item is BoardItem => item !== undefined)
      .map((item, index) => ({ ...item, order: index }));

    set({ currentItems: reorderedItems });

    // Batch update to Supabase
    try {
      const updates = reorderedItems.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('board_items')
          .update({ order: update.order })
          .eq('id', update.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Failed to reorder items in Supabase:', error);
    }

    // Update IndexedDB
    try {
      for (const item of reorderedItems) {
        await db.items.update(item.id, { order: item.order });
      }
    } catch (error) {
      console.error('Failed to reorder items in IndexedDB:', error);
    }
  },

  addCustomSection: async (boardId: string, section) => {
    const board = await db.boards.get(boardId);
    if (!board) throw new Error('Board not found');

    const customSections = board.customSections || [];
    const newSection = {
      ...section,
      isCustom: true,
      order: customSections.length + 3, // After default sections
    };

    const updatedSections = [...customSections, newSection];

    await get().updateBoard(boardId, { customSections: updatedSections });
  },

  updateCustomSection: async (boardId: string, sectionId: string, updates) => {
    const board = await db.boards.get(boardId);
    if (!board) throw new Error('Board not found');

    const customSections = board.customSections || [];
    const updatedSections = customSections.map(s =>
      s.id === sectionId ? { ...s, ...updates } : s
    );

    await get().updateBoard(boardId, { customSections: updatedSections });
  },

  deleteCustomSection: async (boardId: string, sectionId: string) => {
    const board = await db.boards.get(boardId);
    if (!board) throw new Error('Board not found');

    const customSections = board.customSections || [];
    const updatedSections = customSections.filter(s => s.id !== sectionId);

    await get().updateBoard(boardId, { customSections: updatedSections });

    // Also remove items in this section
    const itemsToUpdate = get().currentItems.filter(item => item.section === sectionId);
    for (const item of itemsToUpdate) {
      await get().updateItem(item.id, { section: 'general' });
    }
  },

  reorderSections: async (boardId: string, sectionIds: string[]) => {
    const board = await db.boards.get(boardId);
    if (!board) throw new Error('Board not found');

    const customSections = board.customSections || [];
    const sectionsMap = new Map(customSections.map(s => [s.id, s]));

    const reorderedSections = sectionIds
      .map(id => sectionsMap.get(id))
      .filter((s): s is Section => s !== undefined)
      .map((s, index) => ({ ...s, order: index + 3 })); // Offset for default sections

    await get().updateBoard(boardId, { customSections: reorderedSections });
  },
}));


