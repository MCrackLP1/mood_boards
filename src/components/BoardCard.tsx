/**
 * Board card component for home grid
 */

import { Board } from '@/types';
import { Card } from '@/modules/ui/Card';
import { Button } from '@/modules/ui/Button';
import styles from './BoardCard.module.css';

interface BoardCardProps {
  board: Board;
  previewImage?: string;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BoardCard({ board, previewImage, onOpen, onDuplicate, onDelete }: BoardCardProps) {
  const date = new Date(board.createdAt).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  
  return (
    <Card className={styles.card}>
      <div 
        className={styles.preview}
        onClick={() => onOpen(board.id)}
        style={{ backgroundImage: previewImage ? `url(${previewImage})` : undefined }}
      >
        {!previewImage && <div className={styles.placeholder}>Kein Vorschaubild</div>}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{board.title}</h3>
        <p className={styles.date}>{date}</p>
        
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onDuplicate(board.id)}>
            Duplizieren
          </Button>
          <Button 
            variant="danger" 
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Board "${board.title}" wirklich löschen?`)) {
                onDelete(board.id);
              }
            }}
          >
            Löschen
          </Button>
        </div>
      </div>
    </Card>
  );
}


