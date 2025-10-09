"use client";

import { useBoards } from "@/lib/BoardContext";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import WelcomeAnimation from "@/components/WelcomeAnimation";
import Masonry from 'react-masonry-css';
import ImageCard from "@/components/ImageCard";
import { motion } from "framer-motion";

export default function ShareBoardPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { getBoard, isLoading } = useBoards();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  const boardId = typeof id === 'string' ? id : '';
  const board = getBoard(boardId);

  // Check password if board is protected
  useEffect(() => {
    if (board && board.password) {
      const urlPassword = searchParams.get('pwd');
      if (urlPassword === board.password) {
        setIsAuthorized(true);
      }
    } else if (board) {
      setIsAuthorized(true);
    }
  }, [board, searchParams]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (board && passwordInput === board.password) {
      setIsAuthorized(true);
      setError("");
    } else {
      setError("Falsches Passwort");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Board nicht gefunden</h1>
          <p className="text-gray-500">Dieses Moodboard existiert nicht oder wurde gelöscht.</p>
        </div>
      </div>
    );
  }

  // Password protection screen
  if (board.password && !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Geschütztes Moodboard</h1>
          <p className="text-gray-600 mb-6">Bitte gib das Passwort ein, um fortzufahren.</p>
          
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Passwort"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Eintreten
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const images = board.items.filter(item => item.type === 'image');
  const notes = board.items.filter(item => item.type === 'note');

  return (
    <>
      {showWelcome && (
        <WelcomeAnimation
          clientName={board.clientName}
          welcomeMessage={board.welcomeMessage}
          onComplete={() => setShowWelcome(false)}
        />
      )}

      {!showWelcome && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
        >
          {/* Header */}
          <div className="border-b border-gray-100 bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-6 md:px-12 py-12">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  {board.title}
                </h1>
                {board.clientName && (
                  <p className="text-xl text-gray-600 font-medium">for {board.clientName}</p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-6 md:px-12 py-16">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {board.items.map((item, index) => {
                  if (item.type === 'image') {
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.08, duration: 0.5 }}
                      >
                        <ImageCard image={item} />
                      </motion.div>
                    );
                  }
                  if (item.type === 'note') {
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.08, duration: 0.5 }}
                        className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-2xl shadow-md border border-yellow-200/50"
                      >
                        <p className="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">{item.content}</p>
                      </motion.div>
                    );
                  }
                  return null;
                })}
              </Masonry>
            </motion.div>
          </div>

          {/* Footer */}
          {board.showSignature !== false && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="border-t border-gray-100 bg-white/50 backdrop-blur-sm py-12"
            >
              <div className="container mx-auto px-6 md:px-12 text-center">
                <a 
                  href="https://www.marktietz.de" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium group"
                >
                  <span>by Mark Tietz Fotografie</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
}

