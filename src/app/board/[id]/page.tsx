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
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <Link href="/" className="text-gray-500 hover:underline mb-4 block">
            &larr; Back to all boards
          </Link>
          
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
              className="text-4xl font-bold mb-4 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <h1
              className="text-4xl font-bold mb-4 cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {board.title}
            </h1>
          )}
        </div>

        <div className="flex gap-3 items-start">
          <BoardSettings board={board} onUpdate={updateBoard} />
          
          {activeColor && (
            <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-500">Filter:</span>
              <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: activeColor }} />
              <button 
                onClick={() => setActiveColor(null)}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      <BoardDetail board={board} />
    </div>
  );
}
