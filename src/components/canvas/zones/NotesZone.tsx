/**
 * Notes Zone
 * Sticky notes with rotation and tape effects
 */

import { motion } from 'framer-motion';
import { BoardItem } from '@/types';
import { TapeStrip } from '../TapeStrip';
import { staggerContainer, staggerItem } from '@/animations/canvas';
import styles from './NotesZone.module.css';

interface NotesZoneProps {
  items: BoardItem[];
}

export function NotesZone({ items }: NotesZoneProps) {
  const noteItems = items.filter(i => i.type === 'note').slice(0, 4);
  
  if (noteItems.length === 0) return null;

  const colors = ['#FFF9C4', '#FFECB3', '#FFE0B2', '#F8BBD0'];
  const rotations = [-2, 1.5, -1, 2];

  return (
    <motion.div
      className={styles.zone}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {noteItems.map((item, index) => (
        <motion.div
          key={item.id}
          className={styles.note}
          variants={staggerItem}
          style={{
            background: colors[index % colors.length],
            transform: `rotate(${rotations[index % rotations.length]}deg)`,
          }}
        >
          <TapeStrip
            rotation={index % 2 === 0 ? -2 : 2}
            length="60px"
          />
          
          <p className={styles.noteText}>{item.text}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

