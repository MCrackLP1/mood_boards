/**
 * Polaroid Frame Component
 * Wraps images in authentic polaroid-style frames
 */

import { ReactNode } from 'react';
import styles from './PolaroidFrame.module.css';

interface PolaroidFrameProps {
  children: ReactNode;
  rotation?: number; // -5 to 5 degrees
  caption?: string;
  onClick?: () => void;
}

export function PolaroidFrame({ children, rotation = 0, caption, onClick }: PolaroidFrameProps) {
  return (
    <div
      className={styles.polaroid}
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={onClick}
    >
      <div className={styles.imageArea}>{children}</div>
      {caption && (
        <div className={styles.caption}>
          <span className={styles.captionText}>{caption}</span>
        </div>
      )}
    </div>
  );
}

