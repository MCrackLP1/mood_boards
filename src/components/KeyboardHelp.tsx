/**
 * Keyboard shortcuts help component
 */

import { useState, useEffect } from 'react';
import styles from './KeyboardHelp.module.css';

export function KeyboardHelp() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.shiftKey || e.key === '?')) {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);
  
  if (!isVisible) {
    return (
      <button 
        className={styles.trigger}
        onClick={() => setIsVisible(true)}
        title="Keyboard Shortcuts (drücke ?)"
      >
        ?
      </button>
    );
  }
  
  return (
    <div className={styles.overlay} onClick={() => setIsVisible(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Keyboard Shortcuts</h2>
          <button onClick={() => setIsVisible(false)} className={styles.close}>×</button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Lightbox</h3>
            <ul>
              <li><kbd>ESC</kbd> Schließen</li>
              <li><kbd>←</kbd> Vorheriges Bild</li>
              <li><kbd>→</kbd> Nächstes Bild</li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h3>Allgemein</h3>
            <ul>
              <li><kbd>?</kbd> Diese Hilfe anzeigen/verstecken</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


