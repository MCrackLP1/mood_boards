'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import TimelineItem from './TimelineItem';
import { TimelineItem as TimelineItemType } from '@/lib/types';

interface TimelineProps {
  items: TimelineItemType[];
  onItemUpdate: (id: number, updates: Partial<TimelineItemType>) => Promise<void>;
  onItemDelete: (id: number) => Promise<void>;
  onAddNote: (positionY: number, positionX: number) => void;
}

export default function Timeline({
  items,
  onItemUpdate,
  onItemDelete,
  onAddNote
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.timeline-item')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const positionY = e.clientY - rect.top + containerRef.current!.scrollTop;
    const positionX = e.clientX - rect.left;

    onAddNote(positionY, positionX);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen py-20"
      onClick={handleTimelineClick}
    >
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full">
        <motion.div
          className="w-full bg-gradient-to-b from-purple-400 via-pink-400 to-blue-400"
          style={{ height: y }}
        />
        <div className="w-full bg-white/20" />
      </div>

      {/* Timeline items */}
      {items.map((item, index) => (
        <TimelineItem
          key={item.id}
          item={item}
          index={index}
          onUpdate={onItemUpdate}
          onDelete={onItemDelete}
        />
      ))}

      {/* Timeline markers */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full h-full pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-purple-400/50 rounded-full"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              top: `${i * 5}%`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          />
        ))}
      </div>

      {/* Floating instruction */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
        >
          <div className="glass rounded-2xl p-8 max-w-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-pink-400 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Deine Zeitleiste
            </h3>
            <p className="text-gray-400 text-sm">
              Klicke hier, um Notizen hinzuzufügen, oder ziehe Bilder in die Zeitleiste.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
