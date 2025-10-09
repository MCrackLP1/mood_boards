/**
 * Image card component for board editor
 * Now supports drag and drop
 */

import { BoardItem } from '@/types';
import { Card } from '@/modules/ui/Card';
import { LazyImage } from './LazyImage';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './ImageCard.module.css';

interface ImageCardProps {
  item: BoardItem;
  isHighlighted?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  isDraggable?: boolean;
}

export function ImageCard({ item, isHighlighted, onClick, onDelete, isDraggable = false }: ImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card 
        className={`${styles.card} ${isHighlighted ? styles.highlighted : ''} ${isDragging ? styles.dragging : ''}`}
        onClick={onClick}
      >
        <div className={styles.imageWrapper}>
          <LazyImage 
            src={item.src!} 
            alt={item.meta?.label || 'Board image'} 
            className={styles.image}
          />
          
          {isDraggable && (
            <div className={styles.dragHandle} {...attributes} {...listeners}>
              ⋮⋮
            </div>
          )}
          
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
    </div>
  );
}

