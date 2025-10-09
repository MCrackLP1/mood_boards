/**
 * Color palette component
 * Displays color swatches with click-to-filter functionality
 */

import { Color } from '@/types';
import styles from './ColorPalette.module.css';

interface ColorPaletteProps {
  colors: Color[];
  selectedColor?: Color;
  onColorSelect?: (color: Color) => void;
  title?: string;
}

export function ColorPalette({ colors, selectedColor, onColorSelect, title }: ColorPaletteProps) {
  if (colors.length === 0) return null;
  
  return (
    <div className={styles.wrapper}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.palette}>
        {colors.map((color, i) => (
          <button
            key={i}
            className={`${styles.swatch} ${selectedColor?.hex === color.hex ? styles.selected : ''}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => onColorSelect?.(color)}
            title={`${color.hex} (${Math.round(color.score * 100)}%)`}
          >
            <span className={styles.hex}>{color.hex}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


