/**
 * Image card component for board editor
 */

import { BoardItem } from '@/types';
import { Card } from '@/modules/ui/Card';
import styles from './ImageCard.module.css';

interface ImageCardProps {
  item: BoardItem;
  isHighlighted?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export function ImageCard({ item, isHighlighted, onClick, onDelete }: ImageCardProps) {
  return (
    <Card 
      className={`${styles.card} ${isHighlighted ? styles.highlighted : ''}`}
      onClick={onClick}
    >
      <div className={styles.imageWrapper}>
        <img src={item.src} alt={item.meta?.label || 'Board image'} className={styles.image} />
        
        {onDelete && (
          <button 
            className={styles.delete} 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Bild löschen"
          >
            ×
          </button>
        )}
      </div>
      
      {item.meta?.label && (
        <div className={styles.label}>{item.meta.label}</div>
      )}
      
      {item.palette && item.palette.length > 0 && (
        <div className={styles.palette}>
          {item.palette.slice(0, 5).map((color, i) => (
            <div
              key={i}
              className={styles.swatch}
              style={{ backgroundColor: color.hex }}
              title={color.hex}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

