"use client";

import { useBoards } from "@/lib/BoardContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import BoardDetail from "@/components/BoardDetail";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

export default function BoardPage() {
  const { id } = useParams();
  const { getBoard, updateBoard, isLoading, activeColor, setActiveColor } = useBoards();
  const [isEditing, setIsEditing] = useState(false);
  
  // Reset active color when navigating away from the page
  useEffect(() => {
    return () => {
      setActiveColor(null);
    };
  }, [setActiveColor]);

  if (isLoading) {
    return <div className="text-center p-8">Loading board...</div>;
  }
  
  const boardId = typeof id === 'string' ? id : '';
  const board = getBoard(boardId);
  const [title, setTitle] = useState(board?.title || "");

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
      <div className="flex justify-between items-start">
        <div>
          <Link href="/" className="text-gray-500 hover:underline mb-8 block">
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
        {activeColor && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Filtering by:</span>
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: activeColor }} />
            <button 
              onClick={() => setActiveColor(null)}
              className="text-sm text-red-500 hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <BoardDetail board={board} />
    </div>
  );
}
