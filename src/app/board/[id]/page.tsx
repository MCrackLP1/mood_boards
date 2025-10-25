'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import Timeline from '@/components/Timeline';
import { Board, TimelineItem } from '@/lib/types';

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = parseInt(params.id as string);

  const [board, setBoard] = useState<Board | null>(null);
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    try {
      const response = await fetch(`/api/boards/${boardId}`);
      if (response.ok) {
        const data = await response.json();
        setBoard(data);
        setItems(data.items || []);
      } else if (response.status === 404) {
        setError('Board nicht gefunden');
      } else {
        throw new Error('Fehler beim Laden des Boards');
      }
    } catch (error) {
      console.error('Error fetching board:', error);
      setError('Fehler beim Laden des Boards');
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    if (boardId) {
      fetchBoard();
    }
  }, [boardId, fetchBoard]);

  const handleItemUpdate = async (id: number, updates: Partial<TimelineItem>) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setItems(prev => prev.map(item =>
          item.id === id ? updatedItem : item
        ));
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleItemDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleAddNote = async (positionY: number, positionX: number) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board_id: boardId,
          type: 'note',
          content: 'Neue Notiz',
          position_y: positionY,
          position_x: positionX,
        }),
      });

      if (response.ok) {
        const newItem = await response.json();
        setItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // TODO: Add toast notification
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith('image/')) continue;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();

          // Add image to timeline
          const itemResponse = await fetch('/api/items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              board_id: boardId,
              type: 'image',
              content: url,
              position_y: Math.random() * 1000 + 200, // Random position
              position_x: Math.random() * 200, // Random horizontal offset
            }),
          });

          if (itemResponse.ok) {
            const newItem = await itemResponse.json();
            setItems(prev => [...prev, newItem]);
          }
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Lade Board...</p>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Fehler</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass border-b border-white/10 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">{board.title}</h1>
                <p className="text-gray-400 text-sm">
                  {items.length} Element{items.length !== 1 ? 'e' : ''} auf der Zeitleiste
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 glass rounded-xl hover:bg-white/10 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Teilen
              </button>

              <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all cursor-pointer">
                <Upload className="w-5 h-5" />
                Bilder hochladen
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <Timeline
        items={items}
        onItemUpdate={handleItemUpdate}
        onItemDelete={handleItemDelete}
        onAddNote={handleAddNote}
      />

      {/* Drag overlay */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* This will be shown when dragging */}
      </div>
    </div>
  );
}
