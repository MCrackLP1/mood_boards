"use client";

import { useBoards } from "@/lib/BoardContext";
import { useState } from "react";
import BoardCard from "@/components/BoardCard";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { boards, addBoard, isLoading } = useBoards();
  const [newBoardTitle, setNewBoardTitle] = useState("");

  const handleAddBoard = () => {
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle.trim());
      setNewBoardTitle("");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-gray-500">Loading boards...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header */}
      <div className="border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:justify-between md:items-center gap-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Moodboards
              </h1>
              <p className="text-gray-500 mt-1 text-sm">Create stunning visual presentations for your clients</p>
            </div>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                placeholder="New board title..."
                className="px-5 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm hover:shadow-md text-sm min-w-[200px]"
                onKeyDown={(e) => e.key === 'Enter' && handleAddBoard()}
              />
              <button
                onClick={handleAddBoard}
                className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Create</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 py-12">
        {boards.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto mt-20"
          >
            <div className="text-center p-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gradient-to-br from-gray-50 to-white">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Plus size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">No moodboards yet</h2>
              <p className="text-gray-500 text-lg mb-8">Create your first moodboard to start building stunning visual presentations</p>
              <button
                onClick={() => document.querySelector('input')?.focus()}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {boards.map((board, index) => (
              <motion.div
                key={board.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <BoardCard board={board} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
