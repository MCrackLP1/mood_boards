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
        <Link href={`/board/${board.id}`} className="group relative block aspect-square">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200 shadow-sm">
                {firstImage && 'url' in firstImage && (
                    <Image 
                        src={firstImage.url} 
                        alt={`Preview for ${board.title}`}
                        fill
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                )}
                 <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl">
                <h2 className="text-lg font-semibold text-white truncate">{board.title}</h2>
            </div>
            
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={handleDuplicate}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:bg-white hover:text-blue-500 focus:opacity-100"
                    aria-label="Duplicate board"
                >
                    <Copy size={18} />
                </button>
                <button 
                    onClick={handleDelete}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:bg-white hover:text-red-500 focus:opacity-100"
                    aria-label="Delete board"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </Link>
    );
}
