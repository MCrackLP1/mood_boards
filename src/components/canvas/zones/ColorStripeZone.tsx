/**
 * Color Stripe Zone
 * Vertical color palette with handwritten labels
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Color } from '@/types';
import { HandwrittenLabel } from '../HandwrittenLabel';
import { staggerContainer, staggerItem } from '@/animations/canvas';
import styles from './ColorStripeZone.module.css';

interface ColorStripeZoneProps {
  colors: Color[];
}

export function ColorStripeZone({ colors }: ColorStripeZoneProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (colors.length === 0) return null;

  const handleColorClick = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const rotations = [1, -1.5, 0.5, -0.5, 1.5, -2, 1];

  return (
    <motion.div
      className={styles.zone}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.header}>
        <HandwrittenLabel rotation={-2} size="lg">
          Farben
        </HandwrittenLabel>
      </div>

      <div className={styles.stripes}>
        {colors.slice(0, 7).map((color, index) => (
          <motion.div
            key={index}
            className={styles.stripeWrapper}
            variants={staggerItem}
          >
            <div
              className={styles.stripe}
              style={{
                background: color.hex,
                transform: `rotate(${rotations[index % rotations.length]}deg)`,
              }}
              onClick={() => handleColorClick(color.hex, index)}
              title={`Klick zum Kopieren: ${color.hex}`}
            >
              {copiedIndex === index && (
                <div className={styles.copied}>Kopiert!</div>
              )}
            </div>
            <div className={styles.labelWrapper}>
              <HandwrittenLabel size="sm" rotation={rotations[index % rotations.length]}>
                {color.hex}
              </HandwrittenLabel>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

