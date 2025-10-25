'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import type { TimelineItem as TimelineItemType } from '@/lib/types';

interface TimelineItemProps {
  item: TimelineItemType;
  onUpdate: (id: number, updates: { content?: string; position_x?: number; position_y?: number }) => void;
  onDelete: (id: number) => void;
}

export default function TimelineItem({ item, onUpdate, onDelete }: TimelineItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    if (editContent.trim() !== item.content) {
      onUpdate(item.id, { content: editContent });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditContent(item.content);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`group relative ${isDragging ? 'z-50' : 'z-10'}`}
    >
      <div className="absolute -left-8 top-1/2 -translate-y-1/2">
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50" />
      </div>

      <div className={`glass-strong rounded-2xl p-4 hover:scale-[1.02] transition-all duration-300 cursor-move ${isDragging ? 'shadow-2xl shadow-purple-500/30' : ''}`}>
        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg z-20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {item.type === 'image' ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden">
            <Image
              src={item.content}
              alt="Timeline image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div onClick={() => setIsEditing(true)}>
            {isEditing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full min-h-[100px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                autoFocus
              />
            ) : (
              <p className="text-gray-200 whitespace-pre-wrap">{item.content}</p>
            )}
          </div>
        )}

        {/* Drag handle indicator */}
        <div className="absolute top-2 right-2 text-gray-500 opacity-0 group-hover:opacity-50 transition-opacity">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

