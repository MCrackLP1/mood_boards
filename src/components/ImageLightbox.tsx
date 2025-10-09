/**
 * Lightbox component for fullscreen image view
 */

import { useEffect } from 'react';
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
      
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <img 
          src={item.src} 
          alt={item.meta?.label || 'Bild'}
          className={styles.image}
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
      </div>
    </div>
  );
}

