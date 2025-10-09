"use client";

import { Board } from "@/types";
import Link from "next/link";
import { Trash2, Copy } from 'lucide-react';
import { useBoards } from "@/lib/BoardContext";
import { MouseEvent } from "react";
import Image from "next/image";

interface BoardCardProps {
    board: Board;
}

export default function BoardCard({ board }: BoardCardProps) {
    const { deleteBoard, duplicateBoard } = useBoards();

    const handleDelete = (e: MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${board.title}"?`)) {
            deleteBoard(board.id);
        }
    }

    const handleDuplicate = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        duplicateBoard(board.id);
    }

    const firstImage = board.items.find(item => item.type === 'image');

    return (
        <Link href={`/board/${board.id}`} className="group relative block">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
                {firstImage && 'url' in firstImage ? (
                    <>
                        <Image 
                            src={firstImage.url} 
                            alt={`Preview for ${board.title}`}
                            fill
                            className="object-cover object-center transition-all duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white/50 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">Empty Board</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="text-xl font-bold text-white drop-shadow-lg truncate group-hover:translate-y-[-4px] transition-transform duration-300">
                    {board.title}
                </h2>
                <p className="text-xs text-white/80 mt-1">
                    {board.items.length} {board.items.length === 1 ? 'item' : 'items'}
                </p>
            </div>
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-8px] group-hover:translate-y-0">
                <button 
                    onClick={handleDuplicate}
                    className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl text-gray-700 hover:bg-white hover:scale-110 hover:text-blue-600 transition-all duration-200 shadow-lg"
                    aria-label="Duplicate board"
                >
                    <Copy size={18} />
                </button>
                <button 
                    onClick={handleDelete}
                    className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl text-gray-700 hover:bg-white hover:scale-110 hover:text-red-600 transition-all duration-200 shadow-lg"
                    aria-label="Delete board"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-gray-300 transition-all duration-300 pointer-events-none" />
        </Link>
    );
}
