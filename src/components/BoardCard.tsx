'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { Board } from '@/lib/types';

interface BoardCardProps {
  board: Board;
  index: number;
}

export default function BoardCard({ board, index }: BoardCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <Link href={`/board/${board.id}`}>
        <div className="glass rounded-2xl p-6 h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/10 hover:border-purple-500/30">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
              {board.title}
            </h3>
          </div>

          {/* Timeline Preview - Placeholder for now */}
          <div className="mb-6 relative">
            <div className="w-full h-32 bg-gradient-to-b from-purple-900/20 to-blue-900/20 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Zeitleiste</p>
              </div>
            </div>
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-pink-400 opacity-30"></div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatDate(board.updated_at)}</span>
            </div>
            <div className="text-xs opacity-70">
              ID: {board.id}
            </div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300 pointer-events-none"></div>
        </div>
      </Link>
    </motion.div>
  );
}
