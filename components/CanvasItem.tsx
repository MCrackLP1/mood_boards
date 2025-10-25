'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { TimelineItem as TimelineItemType } from '@/lib/types';

interface CanvasItemProps {
  item: TimelineItemType;
  onUpdate: (id: number, updates: { content?: string; position_x?: number; position_y?: number; width?: number; height?: number; time?: string }) => void;
  onDelete: (id: number) => void;
}

type ResizeHandle = 'se' | 'sw' | 'ne' | 'nw' | 'e' | 'w' | 'n' | 's' | null;

export default function CanvasItem({ item, onUpdate, onDelete }: CanvasItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [editTime, setEditTime] = useState(item.time || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  
  // Initialize dimensions only once from item
  const [dimensions, setDimensions] = useState(() => ({
    width: item.width || (item.type === 'note' ? 300 : 400),
    height: item.height || (item.type === 'note' ? 150 : 300),
  }));
  
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; initialWidth: number; initialHeight: number; initialLeft: number; initialTop: number } | null>(null);

  useEffect(() => {
    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.content;
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        setImageAspectRatio(ratio);
        
        // Set initial size if not set
        if (!item.width || !item.height) {
          const maxWidth = 400;
          const width = Math.min(maxWidth, img.naturalWidth);
          const height = width / ratio;
          setDimensions({ width, height });
        }
      };
    }
  }, [item.content, item.type, item.width, item.height]);

  // Only update dimensions if they come from database and we're not currently interacting
  useEffect(() => {
    if (!isResizing && !isDragging && item.width && item.height) {
      // Only update if significantly different (to avoid fighting with local state)
      if (Math.abs(dimensions.width - item.width) > 5 || Math.abs(dimensions.height - item.height) > 5) {
        setDimensions({ width: item.width, height: item.height });
      }
    }
  }, [item.width, item.height, isResizing, isDragging, dimensions.width, dimensions.height]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing || !e.shiftKey) {
      // Without Shift: open editing
      if (!e.shiftKey && !isEditing && item.type === 'note') {
        setIsEditing(true);
      }
      return;
    }
    
    // With Shift: start dragging
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: item.position_x,
      initialY: item.position_y,
    };
  };

  const handleResizeMouseDown = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeHandle(handle);
    
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialWidth: dimensions.width,
      initialHeight: dimensions.height,
      initialLeft: item.position_x,
      initialTop: item.position_y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && dragRef.current) {
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      const newX = dragRef.current.initialX + deltaX;
      const newY = dragRef.current.initialY + deltaY;

      onUpdate(item.id, { position_x: newX, position_y: newY });
    } else if (isResizing && resizeRef.current && resizeHandle) {
      const deltaX = e.clientX - resizeRef.current.startX;
      const deltaY = e.clientY - resizeRef.current.startY;

      let newWidth = resizeRef.current.initialWidth;
      let newHeight = resizeRef.current.initialHeight;
      let newX = item.position_x;
      let newY = item.position_y;

      // Calculate new dimensions based on resize handle
      switch (resizeHandle) {
        case 'se': // Bottom-right
          newWidth = Math.max(100, resizeRef.current.initialWidth + deltaX);
          newHeight = Math.max(50, resizeRef.current.initialHeight + deltaY);
          break;
        case 'sw': // Bottom-left
          newWidth = Math.max(100, resizeRef.current.initialWidth - deltaX);
          newHeight = Math.max(50, resizeRef.current.initialHeight + deltaY);
          newX = resizeRef.current.initialLeft + deltaX;
          break;
        case 'ne': // Top-right
          newWidth = Math.max(100, resizeRef.current.initialWidth + deltaX);
          newHeight = Math.max(50, resizeRef.current.initialHeight - deltaY);
          newY = resizeRef.current.initialTop + deltaY;
          break;
        case 'nw': // Top-left
          newWidth = Math.max(100, resizeRef.current.initialWidth - deltaX);
          newHeight = Math.max(50, resizeRef.current.initialHeight - deltaY);
          newX = resizeRef.current.initialLeft + deltaX;
          newY = resizeRef.current.initialTop + deltaY;
          break;
        case 'e': // Right
          newWidth = Math.max(100, resizeRef.current.initialWidth + deltaX);
          break;
        case 'w': // Left
          newWidth = Math.max(100, resizeRef.current.initialWidth - deltaX);
          newX = resizeRef.current.initialLeft + deltaX;
          break;
        case 'n': // Top
          newHeight = Math.max(50, resizeRef.current.initialHeight - deltaY);
          newY = resizeRef.current.initialTop + deltaY;
          break;
        case 's': // Bottom
          newHeight = Math.max(50, resizeRef.current.initialHeight + deltaY);
          break;
      }

      // For images, maintain aspect ratio if available
      if (item.type === 'image' && imageAspectRatio) {
        if (resizeHandle.includes('e') || resizeHandle.includes('w')) {
          newHeight = newWidth / imageAspectRatio;
        } else if (resizeHandle.includes('n') || resizeHandle.includes('s')) {
          newWidth = newHeight * imageAspectRatio;
        }
      }

      setDimensions({ width: newWidth, height: newHeight });
      if (newX !== item.position_x || newY !== item.position_y) {
        onUpdate(item.id, { position_x: newX, position_y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      dragRef.current = null;
    }
    if (isResizing) {
      const finalWidth = Math.round(dimensions.width);
      const finalHeight = Math.round(dimensions.height);
      
      console.log('Resize completed:', { 
        itemId: item.id, 
        finalWidth, 
        finalHeight,
        previousWidth: item.width,
        previousHeight: item.height
      });
      
      setIsResizing(false);
      setResizeHandle(null);
      resizeRef.current = null;
      
      // Save final dimensions with rounded values
      onUpdate(item.id, { 
        width: finalWidth, 
        height: finalHeight 
      });
    }
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, isResizing]);

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
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        cursor: isDragging ? 'grabbing' : (isResizing ? 'nwse-resize' : 'default'),
        zIndex: isDragging || isResizing ? 1000 : 10,
      }}
      className="group"
      onMouseDown={handleMouseDown}
    >
      <div className={`h-full glass-strong rounded-2xl p-4 shadow-xl transition-all duration-300 ${isDragging || isResizing ? 'scale-105 shadow-2xl shadow-purple-500/30' : ''}`}>
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

        {/* Hint text */}
        {!isEditing && (
          <div className="absolute top-2 left-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Shift + Drag zum Verschieben
          </div>
        )}

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
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src={item.content}
              alt="Canvas image"
              fill
              className="object-contain"
              sizes={`${dimensions.width}px`}
            />
          </div>
        ) : (
          <div 
            className="h-full overflow-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {isEditing ? (
              <div className="space-y-2 h-full flex flex-col">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-3 py-2 text-sm rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-all"
                  >
                    Speichern
                  </button>
                  <button
                    onClick={() => {
                      setEditContent(item.content);
                      setEditTime(item.time || '');
                      setIsEditing(false);
                    }}
                    className="px-3 py-2 text-sm rounded-lg bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 transition-all"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-200 whitespace-pre-wrap cursor-text">{item.content}</p>
            )}
          </div>
        )}

        {/* Resize handles - only show on hover and not while editing */}
        {!isEditing && (
          <>
            {/* Corner handles */}
            <div
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-nwse-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
            />
            <div
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-nesw-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
            />
            <div
              className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-nesw-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
            />
            <div
              className="absolute -top-2 -left-2 w-4 h-4 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-nwse-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
            />

            {/* Edge handles */}
            <div
              className="absolute top-1/2 -right-1 w-2 h-8 -translate-y-1/2 bg-purple-500/50 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-ew-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
            />
            <div
              className="absolute top-1/2 -left-1 w-2 h-8 -translate-y-1/2 bg-purple-500/50 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-ew-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
            />
            <div
              className="absolute -top-1 left-1/2 w-8 h-2 -translate-x-1/2 bg-purple-500/50 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-ns-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
            />
            <div
              className="absolute -bottom-1 left-1/2 w-8 h-2 -translate-x-1/2 bg-purple-500/50 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-ns-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, 's')}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}
