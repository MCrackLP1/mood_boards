"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Board } from '@/types';

interface BoardContextType {
  boards: Board[];
  addBoard: (title: string) => void;
  deleteBoard: (id: string) => void;
  getBoard: (id: string) => Board | undefined;
  updateBoard: (updatedBoard: Board) => void;
  isLoading: boolean;
  activeColor: string | null;
  setActiveColor: (color: string | null) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoards = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoards must be used within a BoardProvider');
  }
  return context;
};

const STORAGE_KEY = 'moodboards-data';

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeColor, setActiveColor] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedBoards = localStorage.getItem(STORAGE_KEY);
      if (storedBoards) {
        setBoards(JSON.parse(storedBoards));
      }
    } catch (error) {
      console.error("Failed to load boards from local storage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
        } catch (error) {
            console.error("Failed to save boards to local storage", error);
        }
    }
  }, [boards, isLoading]);

  const addBoard = (title: string) => {
    const newBoard: Board = {
      id: crypto.randomUUID(),
      title,
      items: [],
      createdAt: new Date().toISOString(),
    };
    setBoards(prevBoards => [...prevBoards, newBoard]);
  };

  const deleteBoard = (id: string) => {
    setBoards(prevBoards => prevBoards.filter(board => board.id !== id));
  };

  const getBoard = (id: string) => {
    return boards.find(board => board.id === id);
  };
  
  const updateBoard = (updatedBoard: Board) => {
    setBoards(prevBoards => 
      prevBoards.map(board => board.id === updatedBoard.id ? updatedBoard : board)
    );
  };

  const value = { boards, addBoard, deleteBoard, getBoard, updateBoard, isLoading, activeColor, setActiveColor };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
};
