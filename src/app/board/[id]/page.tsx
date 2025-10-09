"use client";

import { useBoards } from "@/lib/BoardContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import BoardDetail from "@/components/BoardDetail";
import BoardSettings from "@/components/BoardSettings";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

export default function BoardPage() {
  const { id } = useParams();
  const { getBoard, updateBoard, isLoading, activeColor, setActiveColor } = useBoards();
  const [isEditing, setIsEditing] = useState(false);
  
  const boardId = typeof id === 'string' ? id : '';
  const board = getBoard(boardId);
  const [title, setTitle] = useState("");
  
  // Initialize title when board is loaded
  useEffect(() => {
    if (board) {
      setTitle(board.title);
    }
  }, [board]);
  
  // Reset active color when navigating away from the page
  useEffect(() => {
    return () => {
      setActiveColor(null);
    };
  }, [setActiveColor]);

  const handleTitleBlur = () => {
    if (board && title.trim()) {
      updateBoard({ ...board, title: title.trim() });
    } else {
      setTitle(board?.title || ""); // Reset if empty
    }
    setIsEditing(false);
  };

  if (!board) {
    return (
      <div className="text-center p-8">
        <p>Board not found.</p>
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to all boards
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="flex-1">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4 group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to all boards</span>
              </Link>
              
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
                  className="text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none w-full max-w-2xl"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-3xl md:text-4xl font-bold cursor-pointer hover:text-gray-700 transition-colors bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                  onClick={() => setIsEditing(true)}
                  title="Click to edit"
                >
                  {board.title}
                </h1>
              )}
            </div>

            <div className="flex gap-3 items-center flex-wrap">
              {activeColor && (
                <div className="flex items-center gap-3 glass-effect px-4 py-2.5 rounded-xl shadow-md">
                  <span className="text-sm text-gray-600 font-medium">Filtering:</span>
                  <div className="w-7 h-7 rounded-lg border-2 border-white shadow-md" style={{ backgroundColor: activeColor }} />
                  <button 
                    onClick={() => setActiveColor(null)}
                    className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
              
              <BoardSettings board={board} onUpdate={updateBoard} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 py-12">
        <BoardDetail board={board} />
      </div>
    </div>
  );
}
