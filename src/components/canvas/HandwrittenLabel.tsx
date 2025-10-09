/**
 * Handwritten Label Component
 * Text with handwriting font for authentic feel
 */

import { ReactNode } from 'react';
import styles from './HandwrittenLabel.module.css';

interface HandwrittenLabelProps {
  children: ReactNode;
  rotation?: number; // -3 to 3 degrees
  size?: 'sm' | 'md' | 'lg';
}

export function HandwrittenLabel({ children, rotation = 0, size = 'md' }: HandwrittenLabelProps) {
  return (
    <span
      className={`${styles.label} ${styles[size]}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {children}
    </span>
  );
}

