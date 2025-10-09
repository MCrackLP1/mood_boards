/**
 * Weather Badge Zone
 * Floating weather badge with glassmorphism
 */

import { motion } from 'framer-motion';
import { zoneEnter } from '@/animations/canvas';
import styles from './WeatherBadgeZone.module.css';

interface WeatherBadgeZoneProps {
  temp?: number;
  condition?: string;
  icon?: string;
}

export function WeatherBadgeZone({ temp = 22, condition = 'Sonnig', icon = '☀️' }: WeatherBadgeZoneProps) {
  return (
    <motion.div
      className={styles.badge}
      variants={zoneEnter}
      initial="hidden"
      animate="visible"
      custom={8}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.temp}>{temp}°C</div>
      <div className={styles.condition}>{condition}</div>
    </motion.div>
  );
}

