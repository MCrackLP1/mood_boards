'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CanvasItem from './CanvasItem';
import type { TimelineItem as TimelineItemType } from '@/lib/types';

interface CanvasProps {
  boardId: number;
  items: TimelineItemType[];
  onItemsChange: () => void;
}

export default function Canvas({ boardId, items: initialItems, onItemsChange }: CanvasProps) {
  const [items, setItems] = useState(initialItems);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleAddNote = async () => {
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
        onItemsChange();
      } else {
        const errorData = await response.json();
        console.error('Error adding note:', errorData);
        alert('Fehler beim Hinzufügen der Notiz: ' + (errorData.error || 'Unbekannter Fehler'));
      }
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Netzwerkfehler beim Hinzufügen der Notiz');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload image
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error('Upload error:', errorData);
        alert('Fehler beim Hochladen: ' + (errorData.error || 'Unbekannter Fehler'));
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
        onItemsChange();
      } else {
        const errorData = await itemResponse.json();
        console.error('Error creating item:', errorData);
        alert('Fehler beim Erstellen des Items: ' + (errorData.error || 'Unbekannter Fehler'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Netzwerkfehler beim Hochladen des Bildes');
    } finally {
      setIsUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleUpdateItem = async (
    id: number,
    updates: { content?: string; position_x?: number; position_y?: number; width?: number; height?: number; time?: string }
  ) => {
    try {
      console.log('Updating item:', { id, updates });
      
      // Optimistic update
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        )
      );

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

      const result = await response.json();
      console.log('Update successful:', result);

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
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      onItemsChange();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

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
          title="Notiz hinzufügen"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <label
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 flex items-center justify-center hover:shadow-2xl hover:shadow-blue-500/60 transition-all cursor-pointer hover:scale-110 active:scale-95"
          title="Bild hinzufügen"
        >
          <input
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

