/**
 * Mood Hero Zone
 * Main inspiration area with masonry grid of images
 */

import { motion } from 'framer-motion';
import { BoardItem } from '@/types';
import { PolaroidFrame } from '../PolaroidFrame';
import { TapeStrip } from '../TapeStrip';
import { HandwrittenLabel } from '../HandwrittenLabel';
import { staggerContainer, staggerItem } from '@/animations/canvas';
import styles from './MoodHeroZone.module.css';

interface MoodHeroZoneProps {
  items: BoardItem[];
  onImageClick: (item: BoardItem) => void;
}

export function MoodHeroZone({ items, onImageClick }: MoodHeroZoneProps) {
  const imageItems = items.filter(i => i.type === 'image').slice(0, 10);
  
  if (imageItems.length === 0) return null;

  const rotations = [-2, 1, -1, 2, -1.5, 1.5, -0.5, 0.5, -2.5, 1];

  return (
    <motion.div
      className={styles.zone}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.header}>
        <HandwrittenLabel rotation={-1} size="lg">
          Mood & Inspiration
        </HandwrittenLabel>
      </div>

      <div className={styles.masonry}>
        {imageItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={styles.masonryItem}
            variants={staggerItem}
          >
            <PolaroidFrame
              rotation={rotations[index % rotations.length]}
              onClick={() => onImageClick(item)}
            >
              <img src={item.src} alt={item.meta?.label || 'Mood image'} />
            </PolaroidFrame>
            
            {/* Decorative tape on some items */}
            {index % 3 === 0 && (
              <TapeStrip
                rotation={index % 2 === 0 ? -3 : 3}
                length="80px"
              />
            )}

            {/* Mini color palette */}
            {item.palette && item.palette.length > 0 && (
              <div className={styles.miniPalette}>
                {item.palette.slice(0, 3).map((color, i) => (
                  <div
                    key={i}
                    className={styles.miniSwatch}
                    style={{ background: color.hex }}
                    title={color.hex}
                  />
                ))}
              </div>
            )}

            {/* Source credit */}
            {item.meta?.description && (
              <div className={styles.credit}>
                <HandwrittenLabel size="sm" rotation={-0.5}>
                  {item.meta.description}
                </HandwrittenLabel>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

