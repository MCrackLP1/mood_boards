"use client";

import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';
import { useBoards } from '@/lib/BoardContext';
import { Board, ImageItem, NoteItem } from '@/types';
import Masonry from 'react-masonry-css';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import Note from './Note';
import ImageCard from './ImageCard';

interface BoardDetailProps {
  board: Board;
}

export default function BoardDetail({ board }: BoardDetailProps) {
  const { updateBoard } = useBoards();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImageItem: ImageItem = {
          id: crypto.randomUUID(),
          type: 'image',
          url: reader.result as string, // base64 Data URL
          filename: file.name,
        };
        const updatedBoard = {
          ...board,
          items: [...board.items, newImageItem],
        };
        updateBoard(updatedBoard);
      };
      reader.readAsDataURL(file);
    });
  }, [board, updateBoard]);

  const handleAddNote = () => {
    const newNote: NoteItem = {
      id: crypto.randomUUID(),
      type: 'note',
      content: 'Type your note here...',
    };
    const updatedBoard = {
      ...board,
      items: [...board.items, newNote],
    };
    updateBoard(updatedBoard);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const images = board.items.filter(item => item.type === 'image') as ImageItem[];
  const allItems = board.items;

  return (
    <div>
      <div className='flex gap-4 mb-8'>
        <div
          {...getRootProps()}
          className={`flex-1 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-600">Drop the files here ...</p>
          ) : (
            <p className="text-gray-500">Drag 'n' drop images, or click to select</p>
          )}
        </div>
        <button
          onClick={handleAddNote}
          className="p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center"
        >
          <Plus className="text-gray-500 mb-2" />
          <span className="text-gray-500">Add Note</span>
        </button>
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {allItems.map(item => {
          if (item.type === 'image') {
            return <ImageCard key={item.id} image={item} />
          }
          if (item.type === 'note') {
            return <Note key={item.id} item={item} board={board} />
          }
          return null;
        })}
      </Masonry>
    </div>
  );
}
