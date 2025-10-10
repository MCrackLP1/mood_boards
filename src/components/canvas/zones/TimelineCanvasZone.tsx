/**
 * Timeline Canvas Zone
 * Animated horizontal timeline with prominent display
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TimelineItem } from '@/types';
import styles from './TimelineCanvasZone.module.css';

interface TimelineCanvasZoneProps {
  items: TimelineItem[];
  shootingDuration?: string;
}

export function TimelineCanvasZone({ items, shootingDuration }: TimelineCanvasZoneProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  if (items.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      className={styles.zone}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>
            <span className={styles.titleIcon}>⏱️</span>
            Tagesablauf
          </h2>
          {shootingDuration && (
            <div className={styles.duration}>
              <span className={styles.durationLabel}>Dauer:</span>
              <span className={styles.durationValue}>{shootingDuration}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.timelineContainer}>
        {/* Animated progress line */}
        <motion.div
          className={styles.progressLine}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        />
        
        <div className={styles.timeline}>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className={styles.item}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.5 + index * 0.15,
                ease: "easeOut" 
              }}
            >
              <motion.div 
                className={styles.dot}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.8 + index * 0.15,
                  ease: "backOut"
                }}
              />
              <div className={styles.content}>
                <div className={styles.time}>{item.time}</div>
                <div className={styles.location}>{item.location}</div>
                {item.description && (
                  <div className={styles.description}>{item.description}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

