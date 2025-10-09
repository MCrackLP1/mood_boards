/**
 * Customer View - Canvas Mode
 * Emotional, artistic presentation for clients
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/modules/database/db';
import { Board, BoardItem, Color } from '@/types';
import { WelcomeAnimation } from '@/components/WelcomeAnimation';
import { BrandingSignature } from '@/components/BrandingSignature';
import { ImageLightbox } from '@/components/ImageLightbox';
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import { audioManager } from '@/modules/audio/audioManager';
import { verifyPassword } from '@/modules/utils/hash';
import { updateMetaTags } from '@/modules/utils/meta';
import { CanvasGrain } from '@/components/canvas/CanvasGrain';
import { CanvasReveal } from '@/components/canvas/CanvasReveal';
import { MoodHeroZone } from '@/components/canvas/zones/MoodHeroZone';
import { ColorStripeZone } from '@/components/canvas/zones/ColorStripeZone';
import { NotesZone } from '@/components/canvas/zones/NotesZone';
import { LocationZone } from '@/components/canvas/zones/LocationZone';
import { TimelineCanvasZone } from '@/components/canvas/zones/TimelineCanvasZone';
import { WeatherBadgeZone } from '@/components/canvas/zones/WeatherBadgeZone';
import { fadeInOut } from '@/animations/canvas';
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
  const [isRevealed, setIsRevealed] = useState(false);
  
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

  // Extract all colors from all images
  const allColors: Color[] = [];
  items.forEach(item => {
    if (item.palette) {
      allColors.push(...item.palette);
    }
  });
  const uniqueColors = Array.from(
    new Map(allColors.map(c => [c.hex, c])).values()
  );

  // Get timeline items
  const timelineItems = items
    .filter(i => i.type === 'timeline')
    .flatMap(i => i.timelineItems || []);
  
  return (
    <motion.div
      className={styles.page}
      {...fadeInOut}
    >
      <CanvasGrain />
      
      {showWelcome && (
        <WelcomeAnimation
          welcomeText={board.welcomeText}
          onComplete={() => setShowWelcome(false)}
        />
      )}
      
      {!showWelcome && !isRevealed && (
        <CanvasReveal
          items={items}
          onReveal={() => setIsRevealed(true)}
        />
      )}
      
      <BrandingSignature visible={board.brandingEnabled} />
      
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0 }}
        animate={{ opacity: isRevealed ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{ pointerEvents: isRevealed ? 'auto' : 'none' }}
      >
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
        
        <motion.div 
          className={styles.canvas}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Hero Mood Zone - Shows ALL images or images from general */}
          <MoodHeroZone
            items={imageItems}
            onImageClick={handleImageClick}
          />

          {/* Color Palette Zone */}
          {uniqueColors.length > 0 && (
            <ColorStripeZone colors={uniqueColors} />
          )}

          {/* Location Zone - Only show if there are specific location images */}
          {getItemsBySection('location').filter(i => i.type === 'image').length > 0 && (
            <LocationZone
              items={getItemsBySection('location')}
              onImageClick={handleImageClick}
            />
          )}

          {/* Timeline Zone */}
          {timelineItems.length > 0 && (
            <TimelineCanvasZone items={timelineItems} />
          )}

          {/* Weather Badge */}
          <WeatherBadgeZone
            temp={22}
            condition="Sonnig"
            icon="☀️"
          />

          {/* Notes Zone */}
          <NotesZone items={getItemsBySection('notes')} />
        </motion.div>
        
        {items.length === 0 && (
          <div className={styles.empty}>
            <p>Dieses Board ist noch leer.</p>
          </div>
        )}
      </motion.div>
      
      {lightboxItem && (
        <ImageLightbox
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
          onNext={imageItems.length > 1 ? handleLightboxNext : undefined}
          onPrev={imageItems.length > 1 ? handleLightboxPrev : undefined}
        />
      )}
    </motion.div>
  );
}
