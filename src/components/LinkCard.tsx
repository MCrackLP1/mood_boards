/**
 * Link Card Component
 * Displays a preview of an embedded link
 */

import { LinkPreview } from '@/types';
import styles from './LinkCard.module.css';

interface LinkCardProps {
  url: string;
  preview: LinkPreview;
  onDelete?: () => void;
  readOnly?: boolean;
}

export function LinkCard({ url, preview, onDelete, readOnly = false }: LinkCardProps) {
  const handleOpen = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.card}>
      <div className={styles.content} onClick={handleOpen}>
        {/* Preview Image or Icon */}
        <div className={styles.imageContainer}>
          {preview.image.startsWith('http') ? (
            <img src={preview.image} alt={preview.title} className={styles.image} />
          ) : (
            <div className={styles.iconPlaceholder}>
              <span className={styles.icon}>{preview.image}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={styles.info}>
          <div className={styles.domain}>{preview.domain}</div>
          <h3 className={styles.title}>{preview.title}</h3>
          {preview.description && (
            <p className={styles.description}>{preview.description}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.openButton}
          onClick={handleOpen}
          title="Link öffnen"
        >
          Öffnen ↗
        </button>
        {!readOnly && onDelete && (
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Löschen"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

