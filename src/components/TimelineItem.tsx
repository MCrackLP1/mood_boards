'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { X, Edit3, Trash2 } from 'lucide-react';
import { TimelineItem as TimelineItemType } from '@/lib/types';

interface TimelineItemProps {
  item: TimelineItemType;
  index: number;
  onUpdate: (id: number, updates: Partial<TimelineItemType>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TimelineItem({
  item,
  index,
  onUpdate,
  onDelete
}: TimelineItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = async () => {
    if (editContent.trim() !== item.content) {
      await onUpdate(item.id, { content: editContent.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditContent(item.content);
      setIsEditing(false);
    }
  };

  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className={`absolute timeline-item ${isLeft ? 'left-0 pr-8' : 'right-0 pl-8'}`}
      style={{
        top: `${item.position_y}px`,
        left: isLeft ? '0' : 'auto',
        right: isLeft ? 'auto' : '0',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connecting line */}
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r ${
          isLeft ? 'from-purple-400 to-transparent right-0' : 'from-transparent to-purple-400 left-0'
        }`}
      />

      {/* Content */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`glass rounded-2xl p-4 max-w-sm relative group ${
          item.type === 'image' ? 'p-2' : ''
        }`}
      >
        {item.type === 'image' ? (
          <div className="relative">
            <img
              src={item.content}
              alt="Timeline item"
              className="w-full h-auto rounded-xl max-w-xs"
              draggable={false}
            />
          </div>
        ) : (
          <div className="relative">
            {isEditing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSave}
                className="w-full bg-transparent border-none outline-none resize-none text-white placeholder-gray-400"
                autoFocus
                rows={Math.max(2, item.content.split('\n').length)}
              />
            ) : (
              <p
                className="text-white whitespace-pre-wrap cursor-pointer hover:bg-white/5 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                {item.content}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute -top-2 -right-2 flex gap-1"
        >
          {item.type === 'note' && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(item.id)}
            className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Timeline dot */}
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-purple-400 rounded-full border-4 border-slate-900 shadow-lg ${
            isLeft ? '-right-2' : '-left-2'
          }`}
        />
      </motion.div>
    </motion.div>
  );
}
