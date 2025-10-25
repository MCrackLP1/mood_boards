'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import BoardCard from '@/components/BoardCard';
import CreateBoardModal from '@/components/CreateBoardModal';
import { Board } from '@/lib/types';

export default function Home() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBoards = async () => {
    try {
      const response = await fetch('/api/boards');
      if (response.ok) {
        const data = await response.json();
        setBoards(data);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreateBoard = async (title: string) => {
    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        await fetchBoards(); // Refresh the list
      } else {
        throw new Error('Failed to create board');
      }
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400 animate-glow" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Mood Boards
            </h1>
            <Sparkles className="w-8 h-8 text-pink-400 animate-glow" />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Erstelle cinematische Mood Boards mit vertikalen Zeitleisten.
            Füge Bilder und Notizen hinzu, teile deine kreativen Ideen.
          </p>
        </motion.div>

        {/* Create Board Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
          >
            <Plus className="w-6 h-6" />
            <span className="text-lg font-semibold">Neues Board erstellen</span>
          </button>
        </motion.div>

        {/* Boards Grid */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-20"
          >
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Lade Boards...</p>
            </div>
          </motion.div>
        ) : boards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Noch keine Boards
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Erstelle dein erstes Mood Board, um mit der Organisation deiner kreativen Ideen zu beginnen.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              Erstelle dein erstes Board
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {boards.map((board, index) => (
              <BoardCard key={board.id} board={board} index={index} />
            ))}
          </motion.div>
        )}

        {/* Create Board Modal */}
        <CreateBoardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreateBoard={handleCreateBoard}
        />
      </div>
    </div>
  );
}