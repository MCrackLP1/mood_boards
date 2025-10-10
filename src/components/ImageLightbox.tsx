/**
 * Lightbox component for fullscreen image view with swipe gestures
 */

import { useEffect, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { BoardItem } from '@/types';
import { ColorPalette } from './ColorPalette';
import styles from './ImageLightbox.module.css';

interface ImageLightboxProps {
  item: BoardItem;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function ImageLightbox({ item, onClose, onNext, onPrev }: ImageLightboxProps) {
  const [dragOffset, setDragOffset] = useState(0);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev]);
  
  const handleDragEnd = (_event: any, info: PanInfo) => {
    const swipeThreshold = 50; // pixels
    
    if (info.offset.x > swipeThreshold && onPrev) {
      onPrev();
    } else if (info.offset.x < -swipeThreshold && onNext) {
      onNext();
    }
    
    setDragOffset(0);
  };
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <button className={styles.close} onClick={onClose} aria-label="Schließen">
        ×
      </button>
      
      {onPrev && (
        <button 
          className={`${styles.nav} ${styles.prev}`} 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Vorheriges Bild"
        >
          ‹
        </button>
      )}
      
      {onNext && (
        <button 
          className={`${styles.nav} ${styles.next}`} 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Nächstes Bild"
        >
          ›
        </button>
      )}
      
      <motion.div 
        className={styles.content} 
        onClick={(e) => e.stopPropagation()}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={(_event, info) => setDragOffset(info.offset.x)}
        onDragEnd={handleDragEnd}
        style={{ x: dragOffset }}
      >
        <img 
          src={item.src} 
          alt={item.meta?.label || 'Bild'}
          className={styles.image}
          draggable={false}
        />
        
        <div className={styles.meta}>
          {item.meta?.label && (
            <h3 className={styles.label}>{item.meta.label}</h3>
          )}
          
          {item.meta?.description && (
            <p className={styles.description}>{item.meta.description}</p>
          )}
          
          {item.palette && item.palette.length > 0 && (
            <div className={styles.paletteWrapper}>
              <ColorPalette colors={item.palette} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}


