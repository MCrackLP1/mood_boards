/**
 * Timeline Canvas Zone
 * Vertical artistic timeline with handwritten elements
 */

import { motion } from 'framer-motion';
import { TimelineItem } from '@/types';
import { HandwrittenLabel } from '../HandwrittenLabel';
import { staggerContainer, staggerItem } from '@/animations/canvas';
import styles from './TimelineCanvasZone.module.css';

interface TimelineCanvasZoneProps {
  items: TimelineItem[];
}

export function TimelineCanvasZone({ items }: TimelineCanvasZoneProps) {
  if (items.length === 0) return null;

  return (
    <motion.div
      className={styles.zone}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.header}>
        <HandwrittenLabel rotation={-1} size="lg">
          Zeitplan
        </HandwrittenLabel>
      </div>

      <div className={styles.timeline}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className={styles.item}
            variants={staggerItem}
          >
            <div className={styles.connector} />
            <div className={styles.icon}>📌</div>
            <div className={styles.content}>
              <HandwrittenLabel size="md" rotation={index % 2 === 0 ? -0.5 : 0.5}>
                {item.time}
              </HandwrittenLabel>
              <p className={styles.title}>{item.location}</p>
              {item.description && <p className={styles.description}>{item.description}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

