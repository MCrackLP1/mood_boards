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
    <main className="container mx-auto p-8 md:p-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Moodboards</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="New board title..."
            className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            onKeyDown={(e) => e.key === 'Enter' && handleAddBoard()}
          />
          <button
            onClick={handleAddBoard}
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Create</span>
          </button>
        </div>
      </motion.div>

      {boards.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl"
        >
          <h2 className="text-xl font-semibold text-gray-700">No moodboards yet</h2>
          <p className="text-gray-500 mt-2">Create your first one to get started!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
    </main>
  );
}
