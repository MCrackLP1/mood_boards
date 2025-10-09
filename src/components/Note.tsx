"use client";

import { useBoards } from "@/lib/BoardContext";
import { Board, NoteItem } from "@/types";
import { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";

interface NoteProps {
    item: NoteItem;
    board: Board;
}

export default function Note({ item, board }: NoteProps) {
    const { updateBoard } = useBoards();
    const [content, setContent] = useState(item.content);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleBlur = () => {
        const updatedItem = { ...item, content };
        const updatedBoard = {
            ...board,
            items: board.items.map(i => i.id === item.id ? updatedItem : i),
        };
        updateBoard(updatedBoard);
    };
    
    const handleDelete = () => {
        const updatedBoard = {
            ...board,
            items: board.items.filter(i => i.id !== item.id),
        };
        updateBoard(updatedBoard);
    }

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [content]);

    return (
        <div className="group relative bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-yellow-200/50">
            <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                onBlur={handleBlur}
                className="w-full bg-transparent resize-none focus:outline-none placeholder-gray-400 text-gray-800 leading-relaxed"
                placeholder="Type your note here..."
                rows={1}
            />
            <button
                onClick={handleDelete}
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-xl text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:text-red-500 hover:scale-110 shadow-md"
                aria-label="Delete note"
            >
                <Trash2 size={16} />
            </button>
            
            {/* Decorative corner */}
            <div className="absolute bottom-0 right-0 w-8 h-8">
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-300/40 rounded-br-lg" />
            </div>
        </div>
    )
}
