/**
 * Customer view page (read-only)
 */

import { useEffect, useState } from 'react';
import { db } from '@/modules/database/db';
import { Board, BoardItem } from '@/types';
import { WelcomeAnimation } from '@/components/WelcomeAnimation';
import { BrandingSignature } from '@/components/BrandingSignature';
import { ImageCard } from '@/components/ImageCard';
import { LinkCard } from '@/components/LinkCard';
import { Checklist } from '@/components/Checklist';
import { Timeline } from '@/components/Timeline';
import { ImageLightbox } from '@/components/ImageLightbox';
import { SmoothScroller } from '@/components/SmoothScroller';
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import { audioManager } from '@/modules/audio/audioManager';
import { verifyPassword } from '@/modules/utils/hash';
import { updateMetaTags } from '@/modules/utils/meta';
import { DEFAULT_SECTIONS } from '@/types/sections';
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
  const [lightboxItem, setLightboxItem] = useState<BoardItem | null>(null);
  
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
    
    // Update meta tags for SEO
    if (board) {
      const firstImage = loadedItems.find(item => item.type === 'image' && item.src);
      updateMetaTags({
        title: `${board.title} | Moodboard by Mark Tietz Fotografie`,
        description: board.welcomeText || `Entdecke das Moodboard "${board.title}"`,
        image: firstImage?.src,
      });
    }
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
  
  const handleImageClick = (item: BoardItem) => {
    setLightboxItem(item);
  };
  
  const handleLightboxNext = () => {
    if (!lightboxItem || !items) return;
    const imageItems = items.filter(i => i.type === 'image');
    const currentIndex = imageItems.findIndex(i => i.id === lightboxItem.id);
    const nextIndex = (currentIndex + 1) % imageItems.length;
    setLightboxItem(imageItems[nextIndex]);
  };
  
  const handleLightboxPrev = () => {
    if (!lightboxItem || !items) return;
    const imageItems = items.filter(i => i.type === 'image');
    const currentIndex = imageItems.findIndex(i => i.id === lightboxItem.id);
    const prevIndex = (currentIndex - 1 + imageItems.length) % imageItems.length;
    setLightboxItem(imageItems[prevIndex]);
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
  
  const getItemsBySection = (sectionId: string) => {
    return items
      .filter(item => (item.section || 'general') === sectionId)
      .sort((a, b) => a.order - b.order);
  };

  // Combine default and custom sections
  const allSections = [
    ...DEFAULT_SECTIONS,
    ...(board?.customSections || [])
  ].sort((a, b) => a.order - b.order);

  const layoutMode = board?.layoutMode || 'grid';
  
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
        
        <SmoothScroller>
          {allSections.map(section => {
            const sectionItems = getItemsBySection(section.id);
            if (sectionItems.length === 0) return null;
            
            const sectionImageItems = sectionItems.filter(i => i.type === 'image');
            const sectionLinkItems = sectionItems.filter(i => i.type === 'link');
            const sectionNotes = sectionItems.filter(i => i.type === 'note');
            const sectionChecklistItems = sectionItems.filter(i => i.type === 'checklist');
            const sectionTimelineItems = sectionItems.filter(i => i.type === 'timeline');
            
            return (
              <div key={section.id} className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>{section.icon}</span>
                  <div>
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                    <p className={styles.sectionDescription}>{section.description}</p>
                  </div>
                </div>
                
                <div className={styles.sectionContent}>
                  {sectionNotes.length > 0 && (
                    <div className={styles.notes}>
                      {sectionNotes.map(note => (
                        <div key={note.id} className={styles.note}>
                          <p>{note.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Checklists */}
                  {sectionChecklistItems.map(item => (
                    <div key={item.id} style={{ marginBottom: '1rem' }}>
                      <Checklist
                        items={item.checklistItems || []}
                        onChange={() => {}} // Read-only
                        readOnly={true}
                      />
                    </div>
                  ))}

                  {/* Timelines */}
                  {sectionTimelineItems.map(item => (
                    <div key={item.id} style={{ marginBottom: '1rem' }}>
                      <Timeline
                        items={item.timelineItems || []}
                        onChange={() => {}} // Read-only
                        readOnly={true}
                      />
                    </div>
                  ))}
                  
                  {sectionImageItems.length > 0 && (
                    <div className={`${styles.grid} ${styles[layoutMode]}`}>
                      {sectionImageItems.map(item => (
                        <ImageCard 
                          key={item.id} 
                          item={item}
                          onClick={() => handleImageClick(item)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  {sectionLinkItems.length > 0 && (
                    <div className={`${styles.linksGrid} ${styles[layoutMode]}`}>
                      {sectionLinkItems.map(item => (
                        <LinkCard
                          key={item.id}
                          url={item.linkUrl || ''}
                          preview={item.linkPreview!}
                          readOnly={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </SmoothScroller>
        
        {items.length === 0 && (
          <div className={styles.empty}>
            <p>Dieses Board ist noch leer.</p>
          </div>
        )}
      </div>
      
      {lightboxItem && (
        <ImageLightbox
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
          onNext={imageItems.length > 1 ? handleLightboxNext : undefined}
          onPrev={imageItems.length > 1 ? handleLightboxPrev : undefined}
        />
      )}
    </div>
  );
}

