/**
 * Tape Strip Component
 * Decorative tape element for mixed-media aesthetic
 */

import styles from './TapeStrip.module.css';

interface TapeStripProps {
  variant?: 'horizontal' | 'vertical';
  rotation?: number; // -5 to 5 degrees
  length?: string; // CSS length value
}

export function TapeStrip({ variant = 'horizontal', rotation = 0, length = '60px' }: TapeStripProps) {
  return (
    <div
      className={`${styles.tape} ${styles[variant]}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        [variant === 'horizontal' ? 'width' : 'height']: length,
      }}
    />
  );
}

