/**
 * Customer view page (read-only)
 */

import { useEffect, useState } from 'react';
import { db } from '@/modules/database/db';
import { Board, BoardItem } from '@/types';
import { WelcomeAnimation } from '@/components/WelcomeAnimation';
import { BrandingSignature } from '@/components/BrandingSignature';
import { ImageCard } from '@/components/ImageCard';
import { SmoothScroller } from '@/components/SmoothScroller';
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import { audioManager } from '@/modules/audio/audioManager';
import { verifyPassword } from '@/modules/utils/hash';
import styles from './CustomerView.module.css';

interface CustomerViewProps {
  boardId: string;
}

export function CustomerView({ boardId }: CustomerViewProps) {
  const [board, setBoard] = useState<Board | null>(null);
  const [items, setItems] = useState<BoardItem[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.2);
  
  useEffect(() => {
    loadBoard();
  }, [boardId]);
  
  const loadBoard = async () => {
    const loadedBoard = await db.boards.get(boardId);
    
    if (!loadedBoard) {
      alert('Board nicht gefunden');
      return;
    }
    
    setBoard(loadedBoard);
    
    // Check if password protected
    if (loadedBoard.passwordHash) {
      setIsPasswordProtected(true);
      setIsUnlocked(false);
    } else {
      setIsUnlocked(true);
      loadItems();
    }
  };
  
  const loadItems = async () => {
    const loadedItems = await db.items
      .where('boardId')
      .equals(boardId)
      .sortBy('order');
    
    setItems(loadedItems);
  };
  
  const handlePasswordSubmit = async () => {
    if (!board?.passwordHash) return;
    
    const isValid = await verifyPassword(password, board.passwordHash);
    
    if (isValid) {
      setIsUnlocked(true);
      setPasswordError('');
      loadItems();
    } else {
      setPasswordError('Falsches Passwort');
    }
  };
  
  const toggleAudio = () => {
    if (isAudioPlaying) {
      audioManager.stop();
      setIsAudioPlaying(false);
    } else {
      // Play ambient sound (for demo, using a placeholder)
      // In production, board.ambientSoundUrl would be set
      if (board?.ambientSoundUrl) {
        audioManager.play(board.ambientSoundUrl, audioVolume);
        setIsAudioPlaying(true);
      }
    }
  };
  
  const handleVolumeChange = (volume: number) => {
    setAudioVolume(volume);
    audioManager.setVolume(volume);
  };
  
  if (!board) {
    return <div className={styles.loading}>Lade Board...</div>;
  }
  
  // Password protection screen
  if (isPasswordProtected && !isUnlocked) {
    return (
      <div className={styles.passwordScreen}>
        <div className={styles.passwordCard}>
          <h1>{board.title}</h1>
          <p>Dieses Moodboard ist passwortgeschützt.</p>
          
          <form onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit(); }}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort eingeben"
              error={passwordError}
              autoFocus
            />
            <Button type="submit" style={{ marginTop: '1rem', width: '100%' }}>
              Entsperren
            </Button>
          </form>
        </div>
      </div>
    );
  }
  
  const imageItems = items.filter(item => item.type === 'image');
  
  return (
    <div className={styles.page}>
      {showWelcome && (
        <WelcomeAnimation
          welcomeText={board.welcomeText}
          onComplete={() => setShowWelcome(false)}
        />
      )}
      
      <BrandingSignature visible={board.brandingEnabled} />
      
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>{board.title}</h1>
          
          {board.ambientSoundUrl && (
            <div className={styles.audioControls}>
              <Button 
                variant="ghost" 
                onClick={toggleAudio}
                aria-label={isAudioPlaying ? 'Sound stoppen' : 'Sound abspielen'}
              >
                {isAudioPlaying ? '⏸ Sound' : '▶ Sound'}
              </Button>
              
              {isAudioPlaying && (
                <div className={styles.volumeControl}>
                  <span>🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioVolume * 100}
                    onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                    className={styles.volumeSlider}
                  />
                </div>
              )}
            </div>
          )}
        </header>
        
        {imageItems.length > 0 ? (
          <SmoothScroller>
            <div className={styles.grid}>
              {imageItems.map(item => (
                <ImageCard key={item.id} item={item} />
              ))}
            </div>
          </SmoothScroller>
        ) : (
          <div className={styles.empty}>
            <p>Dieses Board ist noch leer.</p>
          </div>
        )}
      </div>
    </div>
  );
}

