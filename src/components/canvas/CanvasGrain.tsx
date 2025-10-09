/**
 * Canvas Grain Overlay
 * Adds subtle paper texture to the canvas
 */

import styles from './CanvasGrain.module.css';

export function CanvasGrain() {
  return (
    <div className={styles.grain}>
      <svg xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
        <defs>
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 0 0 1" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

