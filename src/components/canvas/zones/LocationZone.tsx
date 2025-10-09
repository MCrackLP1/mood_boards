/**
 * Location Zone
 * Polaroid-style location cards with scattered arrangement
 */

import { motion } from 'framer-motion';
import { BoardItem } from '@/types';
import { PolaroidFrame } from '../PolaroidFrame';
import { HandwrittenLabel } from '../HandwrittenLabel';
import { staggerContainer, staggerItem } from '@/animations/canvas';
import styles from './LocationZone.module.css';

interface LocationZoneProps {
  items: BoardItem[];
  onImageClick: (item: BoardItem) => void;
}

export function LocationZone({ items, onImageClick }: LocationZoneProps) {
  const imageItems = items.filter(i => i.type === 'image').slice(0, 5);
  
  if (imageItems.length === 0) return null;

  const rotations = [-1.5, 2, -2.5, 1, -0.5];

  return (
    <motion.div
      className={styles.zone}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.header}>
        <HandwrittenLabel rotation={1} size="lg">
          Location
        </HandwrittenLabel>
      </div>

      <div className={styles.scattered}>
        {imageItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={styles.card}
            variants={staggerItem}
          >
            <PolaroidFrame
              rotation={rotations[index % rotations.length]}
              caption={item.meta?.label}
              onClick={() => onImageClick(item)}
            >
              <img src={item.src} alt={item.meta?.label || 'Location'} />
            </PolaroidFrame>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

