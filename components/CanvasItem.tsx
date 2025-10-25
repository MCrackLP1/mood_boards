'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { TimelineItem as TimelineItemType } from '@/lib/types';

interface CanvasItemProps {
  item: TimelineItemType;
  onUpdate: (id: number, updates: { content?: string; position_x?: number; position_y?: number; time?: string }) => void;
  onDelete: (id: number) => void;
}

export default function CanvasItem({ item, onUpdate, onDelete }: CanvasItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [editTime, setEditTime] = useState(item.time || '');
  const [isDragging, setIsDragging] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  useEffect(() => {
    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.content;
      img.onload = () => {
        // Max width 400px, maintain aspect ratio
        const maxWidth = 400;
        const ratio = img.naturalHeight / img.naturalWidth;
        const width = Math.min(maxWidth, img.naturalWidth);
        const height = width * ratio;
        setImageSize({ width, height });
      };
    }
  }, [item.content, item.type]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: item.position_x,
      initialY: item.position_y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    const newX = dragRef.current.initialX + deltaX;
    const newY = dragRef.current.initialY + deltaY;

    // Update position via callback (will trigger re-render from parent)
    onUpdate(item.id, { position_x: newX, position_y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragRef.current = null;
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const handleSave = () => {
    const updates: { content?: string; time?: string } = {};
    if (editContent.trim() !== item.content) {
      updates.content = editContent;
    }
    if (editTime !== item.time) {
      updates.time = editTime || undefined;
    }
    if (Object.keys(updates).length > 0) {
      onUpdate(item.id, updates);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && item.type === 'note') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditContent(item.content);
      setEditTime(item.time || '');
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        position: 'absolute',
        left: `${item.position_x}px`,
        top: `${item.position_y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 1000 : 10,
      }}
      className="group"
      onMouseDown={handleMouseDown}
    >
      <div className={`glass-strong rounded-2xl p-4 shadow-xl transition-all duration-300 ${isDragging ? 'scale-105 shadow-2xl shadow-purple-500/30' : 'hover:scale-[1.02]'}`}>
        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg z-20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Time display/edit */}
        {(item.time || isEditing) && (
          <div className="mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isEditing ? (
              <input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-purple-300 text-sm focus:outline-none focus:border-purple-500"
              />
            ) : (
              <span className="text-purple-300 text-sm font-medium">{item.time}</span>
            )}
          </div>
        )}

        {/* Content */}
        {item.type === 'image' ? (
          <div 
            className="relative rounded-xl overflow-hidden"
            style={{
              width: imageSize ? `${imageSize.width}px` : '400px',
              height: imageSize ? `${imageSize.height}px` : '300px',
            }}
          >
            <Image
              src={item.content}
              alt="Canvas image"
              fill
              className="object-contain"
              sizes="400px"
              priority
            />
          </div>
        ) : (
          <div onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} onMouseDown={(e) => e.stopPropagation()}>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  className="w-full min-w-[250px] min-h-[100px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="w-full px-3 py-1 text-sm rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-all"
                >
                  Speichern
                </button>
              </div>
            ) : (
              <p className="text-gray-200 whitespace-pre-wrap min-w-[200px]">{item.content}</p>
            )}
          </div>
        )}

        {/* Drag handle indicator */}
        <div className="absolute top-2 right-2 text-gray-500 opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

