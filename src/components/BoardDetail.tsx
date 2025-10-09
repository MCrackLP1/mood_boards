"use client";

import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';
import { useBoards } from '@/lib/BoardContext';
import { Board, ImageItem, NoteItem } from '@/types';
import Masonry from 'react-masonry-css';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-12'
      >
        <div
          {...getRootProps()}
          className={`md:col-span-3 p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300 
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]' 
              : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/30 shadow-sm hover:shadow-md'
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            {isDragActive ? (
              <>
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 animate-bounce">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-blue-600 font-semibold text-lg">Drop your images here!</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-semibold text-lg mb-1">Drop images here</p>
                <p className="text-gray-500 text-sm">or click to browse your files</p>
              </>
            )}
          </div>
        </div>
        
        <button
          onClick={handleAddNote}
          className="p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300 border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/30 shadow-sm hover:shadow-md flex flex-col items-center justify-center group"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="text-yellow-600" size={32} />
          </div>
          <span className="text-gray-700 font-semibold">Add Note</span>
        </button>
      </motion.div>

      {allItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Your board is empty</h3>
          <p className="text-gray-500">Start by adding images or notes to create your moodboard</p>
        </motion.div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {allItems.map((item, index) => {
            if (item.type === 'image') {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ImageCard image={item} />
                </motion.div>
              );
            }
            if (item.type === 'note') {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Note item={item} board={board} />
                </motion.div>
              );
            }
            return null;
          })}
        </Masonry>
      )}
    </div>
  );
}
