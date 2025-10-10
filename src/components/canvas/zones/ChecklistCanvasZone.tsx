/**
 * Checklist Canvas Zone
 * Displays checklist items in customer view
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BoardItem } from '@/types';
import styles from './ChecklistCanvasZone.module.css';

interface ChecklistCanvasZoneProps {
  items: BoardItem[];
}

export function ChecklistCanvasZone({ items }: ChecklistCanvasZoneProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  // Get all checklist items from all checklist boards
  const allChecklistItems = items
    .filter(item => item.type === 'checklist' && item.checklistItems && item.checklistItems.length > 0)
    .flatMap(item => item.checklistItems || [])
    .sort((a, b) => a.order - b.order);
  
  if (allChecklistItems.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      className={styles.zone}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>✓</span>
          Checkliste
        </h2>
      </div>

      <div className={styles.checklist}>
        {allChecklistItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={styles.item}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.2 + index * 0.08,
              ease: "easeOut" 
            }}
          >
            <div className={styles.checkbox}>
              {item.checked && (
                <motion.svg
                  className={styles.checkmark}
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.4 + index * 0.08,
                    ease: "easeInOut" 
                  }}
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              )}
            </div>
            <span className={item.checked ? styles.textChecked : styles.text}>
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

