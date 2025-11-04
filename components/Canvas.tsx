'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import CanvasItem from './CanvasItem';
import { useToast } from './Toast';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { optimizeImage } from '@/lib/imageOptimization';
import type { TimelineItem as TimelineItemType } from '@/lib/types';

interface CanvasProps {
  boardId: number;
  items: TimelineItemType[];
  onItemsChange: () => void;
}

export default function Canvas({ boardId, items: initialItems, onItemsChange }: CanvasProps) {
  const [items, setItems] = useState(initialItems);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const { showToast } = useToast();
  const pendingUpdatesRef = useRef<Map<number, { content?: string; position_x?: number; position_y?: number; width?: number; height?: number; time?: string }>>(new Map());
  const updateTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local state with props when items change - but preserve local position/size
  useEffect(() => {
    setItems(prevItems => {
      // If first load or no previous items, use initialItems as-is
      if (prevItems.length === 0) {
        return initialItems;
      }
      
      // Create a map of current items for quick lookup
      const prevItemsMap = new Map(prevItems.map(item => [item.id, item]));
      
      // Merge: prefer local position/size over server values (to keep optimistic updates)
      return initialItems.map(newItem => {
        const prevItem = prevItemsMap.get(newItem.id);
        if (prevItem) {
          // Prefer local values for position and dimensions
          return {
            ...newItem,
            position_x: prevItem.position_x,
            position_y: prevItem.position_y,
            width: prevItem.width ?? newItem.width,
            height: prevItem.height ?? newItem.height,
          };
        }
        // New item, use server values
        return newItem;
      });
    });
  }, [initialItems]);

  const handleAddNote = useCallback(async () => {
    try {
      // Add note at center of viewport
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board_id: boardId,
          type: 'note',
          content: 'Neue Notiz...',
          position_x: scrollX + viewportWidth / 2 - 150,
          position_y: scrollY + viewportHeight / 2 - 75,
          width: 300,
          height: 150,
        }),
      });

      if (response.ok) {
        showToast('Notiz erfolgreich hinzugefügt', 'success');
        onItemsChange();
      } else {
        let errorMessage = 'Unbekannter Fehler';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || 'Unbekannter Fehler';
          console.error('Error adding note:', errorData);
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        showToast('Fehler beim Hinzufügen der Notiz: ' + errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      showToast('Netzwerkfehler beim Hinzufügen der Notiz', 'error');
    }
  }, [boardId, onItemsChange, showToast]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Optimize image before upload
      const optimizedFile = await optimizeImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
        maxSizeMB: 2,
      });

      // Upload optimized image
      const formData = new FormData();
      formData.append('file', optimizedFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error('Upload error:', errorData);
        showToast('Fehler beim Hochladen: ' + (errorData.error || 'Unbekannter Fehler'), 'error');
        return;
      }

      const { url } = await uploadResponse.json();

      // Add image at center of viewport
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Create timeline item
      const itemResponse = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board_id: boardId,
          type: 'image',
          content: url,
          position_x: scrollX + viewportWidth / 2 - 200,
          position_y: scrollY + viewportHeight / 2 - 150,
          width: 400,
          height: 300,
        }),
      });

      if (itemResponse.ok) {
        showToast('Bild erfolgreich hochgeladen', 'success');
        onItemsChange();
      } else {
        let errorMessage = 'Unbekannter Fehler';
        try {
          const errorData = await itemResponse.json();
          errorMessage = errorData.error || errorData.details || 'Unbekannter Fehler';
          console.error('Error creating item:', errorData);
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        showToast('Fehler beim Erstellen des Items: ' + errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Netzwerkfehler beim Hochladen des Bildes', 'error');
    } finally {
      setIsUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  }, [boardId, onItemsChange, showToast]);

  const flushUpdate = useCallback(async (id: number, updates: { content?: string; position_x?: number; position_y?: number; width?: number; height?: number; time?: string }) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update item:', errorText);
        // Revert on error
        onItemsChange();
        return;
      }

      await response.json();

      // Only refetch if content or time changed
      // For position/size, keep optimistic update to avoid flickering
      if (updates.content !== undefined || updates.time !== undefined) {
        // Small delay to ensure DB has updated
        setTimeout(() => {
          onItemsChange();
        }, 100);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      // Revert on error
      onItemsChange();
    }
  }, [onItemsChange]);

  const handleUpdateItem = useCallback((
    id: number,
    updates: { content?: string; position_x?: number; position_y?: number; width?: number; height?: number; time?: string }
  ) => {
    // Always do optimistic update immediately
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );

    // Merge with pending updates
    const existingPending = pendingUpdatesRef.current.get(id) || {};
    const mergedUpdates = {
      ...existingPending,
      ...updates,
    };
    pendingUpdatesRef.current.set(id, mergedUpdates);

    // Clear existing timer for this item
    const existingTimer = updateTimersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Determine debounce delay: immediate for content/time, debounced for position/size
    const isPositionUpdate = updates.position_x !== undefined || updates.position_y !== undefined || updates.width !== undefined || updates.height !== undefined;
    const isContentUpdate = updates.content !== undefined || updates.time !== undefined;
    
    const delay = isContentUpdate ? 0 : (isPositionUpdate ? 300 : 0);

    if (delay === 0) {
      // Immediate update for content/time
      flushUpdate(id, mergedUpdates);
      pendingUpdatesRef.current.delete(id);
    } else {
      // Debounced update for position/size
      const timer = setTimeout(() => {
        const finalUpdates = pendingUpdatesRef.current.get(id);
        if (finalUpdates) {
          flushUpdate(id, finalUpdates);
          pendingUpdatesRef.current.delete(id);
          updateTimersRef.current.delete(id);
        }
      }, delay);
      updateTimersRef.current.set(id, timer);
    }
  }, [flushUpdate]);

  const handleDeleteItem = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showToast('Item erfolgreich gelöscht', 'success');
        onItemsChange();
      } else {
        const errorData = await response.json();
        showToast('Fehler beim Löschen: ' + (errorData.error || 'Unbekannter Fehler'), 'error');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showToast('Netzwerkfehler beim Löschen des Items', 'error');
    }
  }, [onItemsChange, showToast]);

  // Keyboard shortcuts - defined after handlers
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrl: true,
      handler: handleAddNote,
    },
    {
      key: 'i',
      ctrl: true,
      handler: () => {
        fileInputRef.current?.click();
      },
    },
    {
      key: 'Delete',
      handler: () => {
        if (selectedItemId !== null) {
          handleDeleteItem(selectedItemId);
          setSelectedItemId(null);
        }
      },
    },
    {
      key: 'Backspace',
      handler: () => {
        if (selectedItemId !== null) {
          handleDeleteItem(selectedItemId);
          setSelectedItemId(null);
        }
      },
    },
    {
      key: 'Escape',
      handler: () => {
        setSelectedItemId(null);
      },
    },
  ]);

  return (
    <div className="relative w-full min-h-screen">
      {/* Canvas area with grid background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          minHeight: '200vh',
          minWidth: '100%',
        }}
      >
        {/* Items */}
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <CanvasItem
              key={item.id}
              item={item}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
              isSelected={selectedItemId === item.id}
              onSelect={() => setSelectedItemId(item.id)}
            />
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-4">
                Dein Canvas ist noch leer
              </p>
              <p className="text-gray-500 text-sm">
                Füge Notizen oder Bilder hinzu und platziere sie frei
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating action buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        <button
          onClick={handleAddNote}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 flex items-center justify-center hover:shadow-2xl hover:shadow-purple-500/60 transition-all hover:scale-110 active:scale-95"
          title="Notiz hinzufügen (Ctrl+N)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <label
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 flex items-center justify-center hover:shadow-2xl hover:shadow-blue-500/60 transition-all cursor-pointer hover:scale-110 active:scale-95"
          title="Bild hinzufügen (Ctrl+I)"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </label>
      </div>
    </div>
  );
}

