/**
 * Home page - Board overview
 */

import { useEffect, useState } from 'react';
import { useBoardStore } from '@/modules/boards/store';
import { db } from '@/modules/database/db';
import { BoardCard } from '@/components/BoardCard';
import { Button } from '@/modules/ui/Button';
import { Modal } from '@/modules/ui/Modal';
import { Input } from '@/modules/ui/Input';
import { SmoothScroller } from '@/components/SmoothScroller';
import { ExampleBoardsCreator } from '@/components/ExampleBoardsCreator';
import styles from './Home.module.css';

interface HomeProps {
  onOpenBoard: (id: string) => void;
}

export function Home({ onOpenBoard }: HomeProps) {
  const { boards, loadBoards, createBoard, duplicateBoard, deleteBoard } = useBoardStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExamplesModalOpen, setIsExamplesModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [boardPreviews, setBoardPreviews] = useState<Record<string, string>>({});
  
  useEffect(() => {
    loadBoards();
  }, [loadBoards]);
  
  // Load preview images for boards
  useEffect(() => {
    const loadPreviews = async () => {
      const previews: Record<string, string> = {};
      
      for (const board of boards) {
        const items = await db.items
          .where('boardId')
          .equals(board.id)
          .and(item => item.type === 'image' && !!item.src)
          .first();
        
        if (items?.src) {
          previews[board.id] = items.src;
        }
      }
      
      setBoardPreviews(previews);
    };
    
    loadPreviews();
  }, [boards]);
  
  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;
    
    const board = await createBoard(newBoardTitle);
    setNewBoardTitle('');
    setIsCreateModalOpen(false);
    onOpenBoard(board.id);
  };
  
  const handleDuplicateBoard = async (id: string) => {
    const newBoard = await duplicateBoard(id);
    onOpenBoard(newBoard.id);
  };
  
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Moodboards</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={() => setIsExamplesModalOpen(true)}>
            🎨 Beispiele erstellen
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Neues Board
          </Button>
        </div>
      </header>
      
      {boards.length === 0 ? (
        <div className={styles.empty}>
          <p>Noch keine Moodboards vorhanden.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Erstes Board erstellen
            </Button>
            <Button variant="secondary" onClick={() => setIsExamplesModalOpen(true)}>
              🎨 Oder Beispiele laden
            </Button>
          </div>
        </div>
      ) : (
        <SmoothScroller>
          <div className={styles.grid}>
            {boards.map(board => (
              <BoardCard
                key={board.id}
                board={board}
                previewImage={boardPreviews[board.id]}
                onOpen={onOpenBoard}
                onDuplicate={handleDuplicateBoard}
                onDelete={deleteBoard}
              />
            ))}
          </div>
        </SmoothScroller>
      )}
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Neues Moodboard"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCreateBoard(); }}>
          <Input
            label="Titel"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="z.B. Hochzeit Lisa & Tom"
            autoFocus
          />
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={!newBoardTitle.trim()}>
              Erstellen
            </Button>
          </div>
        </form>
      </Modal>
      
      <Modal
        isOpen={isExamplesModalOpen}
        onClose={() => setIsExamplesModalOpen(false)}
        title="Beispiel-Moodboards erstellen"
      >
        <ExampleBoardsCreator />
      </Modal>
    </div>
  );
}


