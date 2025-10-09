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
        <div className="group relative bg-yellow-100 p-4 rounded-lg shadow-sm mb-4">
            <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                onBlur={handleBlur}
                className="w-full bg-transparent resize-none focus:outline-none placeholder-gray-500"
                placeholder="Type your note..."
                rows={1}
            />
            <button
                onClick={handleDelete}
                className="absolute top-2 right-2 p-1.5 bg-yellow-200/80 rounded-full text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-200 hover:text-red-500"
                aria-label="Delete note"
            >
                <Trash2 size={16} />
            </button>
        </div>
    )
}
