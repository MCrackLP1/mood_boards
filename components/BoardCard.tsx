'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Board } from '@/lib/types';

interface BoardCardProps {
  board: Board;
  index: number;
}

export default function BoardCard({ board, index }: BoardCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/board/${board.id}`}>
        <div className="group relative overflow-hidden rounded-2xl glass hover:glass-strong transition-all duration-300 p-6 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10" />
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">
              {board.title}
            </h3>
            <p className="text-sm text-gray-400">
              Erstellt: {formatDate(board.created_at)}
            </p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Öffnen
            </div>
          </div>

          {/* Animated border */}
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 group-hover:w-full transition-all duration-500" />
        </div>
      </Link>
    </motion.div>
  );
}

