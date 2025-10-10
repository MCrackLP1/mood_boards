/**
 * Customer View - Canvas Mode
 * Emotional, artistic presentation for clients
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/modules/database/db';
import { supabase } from '@/modules/database/supabase';
import { Board, BoardItem, Color } from '@/types';
import { WelcomeAnimation } from '@/components/WelcomeAnimation';
import { BrandingSignature } from '@/components/BrandingSignature';
import { ImageLightbox } from '@/components/ImageLightbox';
import { ExportPDFButton } from '@/components/ExportPDFButton';
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
import { ChecklistCanvasZone } from '@/components/canvas/zones/ChecklistCanvasZone';
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
    try {
      // Try to load from Supabase first (for shared links)
      const { data: supabaseBoard, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .single();

      if (error) throw error;

      if (!supabaseBoard) {
        // Fallback to local IndexedDB if not found on server
        const localBoard = await db.boards.get(boardId);
        if (!localBoard) {
          alert('Board nicht gefunden');
          return;
        }
        setBoard(localBoard);
        loadItemsLocal();
        return;
      }

      // Transform from snake_case to camelCase
      const loadedBoard: Board = {
        id: supabaseBoard.id,
        title: supabaseBoard.title,
        createdAt: supabaseBoard.created_at,
        updatedAt: supabaseBoard.updated_at,
        welcomeText: supabaseBoard.welcome_text || '',
        brandingEnabled: supabaseBoard.branding_enabled ?? true,
        passwordHash: supabaseBoard.password_hash || undefined,
        ambientSoundUrl: supabaseBoard.ambient_sound_url || undefined,
        customSections: supabaseBoard.custom_sections || [],
        layoutMode: supabaseBoard.layout_mode || 'grid',
        shootingDuration: supabaseBoard.shooting_duration || undefined,
      };

      setBoard(loadedBoard);

      if (loadedBoard.passwordHash) {
        setIsPasswordProtected(true);
        setIsUnlocked(false);
      } else {
        setIsUnlocked(true);
        loadItems(loadedBoard);
      }
    } catch (error) {
      console.error('Error loading board from server:', error);
      
      // Fallback to local IndexedDB
      const localBoard = await db.boards.get(boardId);
      if (!localBoard) {
        alert('Board nicht gefunden. Bitte stelle sicher, dass du online bist.');
        return;
      }
      setBoard(localBoard);
      loadItemsLocal();
    }
  };

  const loadItems = async (boardData: Board) => {
    try {
      // Load items from Supabase
      const { data: supabaseItems, error } = await supabase
        .from('board_items')
        .select('*')
        .eq('board_id', boardId)
        .order('order', { ascending: true });

      if (error) throw error;

      // Transform to camelCase
      const loadedItems: BoardItem[] = supabaseItems?.map(item => ({
        id: item.id,
        boardId: item.board_id,
        type: item.type as BoardItem['type'],
        section: item.section || 'general',
        order: item.order,
        createdAt: item.created_at,
        src: item.src,
        palette: item.palette,
        text: item.text,
        linkUrl: item.link_url,
        linkPreview: item.link_preview,
        checklistItems: item.checklist_items,
        timelineItems: item.timeline_items,
        meta: item.meta,
      })) || [];

      setItems(loadedItems);

      const firstImage = loadedItems.find(item => item.type === 'image' && item.src);
      updateMetaTags({
        title: `${boardData.title} | Moodboard by Mark Tietz Fotografie`,
        description: boardData.welcomeText || `Entdecke das Moodboard "${boardData.title}"`,
        image: firstImage?.src,
      });
    } catch (error) {
      console.error('Error loading items from server:', error);
      // Fallback to local
      loadItemsLocal();
    }
  };

  const loadItemsLocal = async () => {
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
      if (board) {
        loadItems(board);
      }
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
      
      <div className={styles.content} style={{ opacity: isRevealed ? 1 : 0 }}>
        <header className={styles.header}>
          <h1 className={styles.title}>{board.title}</h1>
          
          <div className={styles.headerActions}>
            <ExportPDFButton boardId={boardId} variant="ghost" />
            
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
          </div>
        </header>
        
        <motion.div 
          className={styles.canvas}
          initial={isRevealed ? { opacity: 0, y: 30 } : false}
          animate={isRevealed ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 1, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Hero Mood Zone - Shows all images EXCEPT location images */}
          <MoodHeroZone
            items={items.filter(item => item.type === 'image' && (item.section || 'general') !== 'location')}
            onImageClick={handleImageClick}
          />

          {/* Color Palette Zone */}
          {uniqueColors.length > 0 && (
            <ColorStripeZone colors={uniqueColors} />
          )}

          {/* Checklist Zone - Prominent placement for task overview */}
          <ChecklistCanvasZone items={items} />

          {/* Notes Zone - More prominent for important information */}
          <NotesZone items={getItemsBySection('notes')} />

          {/* Timeline Zone */}
          {timelineItems.length > 0 && (
            <TimelineCanvasZone 
              items={timelineItems} 
              shootingDuration={board.shootingDuration}
            />
          )}

          {/* Location Zone - Shows images from 'location' section */}
          {getItemsBySection('location').filter(i => i.type === 'image').length > 0 && (
            <LocationZone
              items={getItemsBySection('location')}
              onImageClick={handleImageClick}
            />
          )}

          {/* Weather Badge - Integrated with content flow */}
          <WeatherBadgeZone
            temp={22}
            condition="Sonnig"
            icon="☀️"
          />
        </motion.div>
        
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
    </motion.div>
  );
}
