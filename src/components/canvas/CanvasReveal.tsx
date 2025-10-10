/**
 * Canvas Reveal Component
 * Initial scattered view that animates into organized zones
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardItem } from '@/types';
import { PolaroidFrame } from './PolaroidFrame';
import styles from './CanvasReveal.module.css';

interface CanvasRevealProps {
  items: BoardItem[];
  onReveal: () => void;
}

export function CanvasReveal({ items, onReveal }: CanvasRevealProps) {
  const [scattered, setScattered] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  
  const imageItems = items.filter(i => i.type === 'image').slice(0, 15);
  
  // Listen for scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !hasScrolled) {
        setHasScrolled(true);
        handleReveal();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);
  
  const handleReveal = () => {
    // Start overlay immediately
    setShowOverlay(true);
    // Start exit animation after short delay
    setTimeout(() => setScattered(false), 300);
    // Complete reveal after animations
    setTimeout(() => {
      onReveal();
    }, 1000);
  };
  
  // Generate random positions for scattered state
  const getScatteredPosition = (index: number) => {
    const angle = (index * 137.5) % 360; // Golden angle for nice distribution
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3;
    const x = Math.cos(angle * Math.PI / 180) * radius * (0.5 + Math.random() * 0.5);
    const y = Math.sin(angle * Math.PI / 180) * radius * (0.5 + Math.random() * 0.5);
    
    return { x, y };
  };
  
  const getRotation = (index: number) => {
    return -15 + (index * 7) % 30;
  };
  
  return (
    <>
      {/* Transition Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {scattered && (
          <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
          <div className={styles.scattered}>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Dein Moodboard
            </motion.h2>
            
            <motion.p
              className={styles.hint}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Scrolle oder klicke um zu entdecken
            </motion.p>
            
            <div className={styles.pile}>
              {imageItems.map((item, index) => {
                const { x, y } = getScatteredPosition(index);
                
                return (
                  <motion.div
                    key={item.id}
                    className={styles.item}
                    initial={{ 
                      opacity: 0, 
                      scale: 0.8,
                      x: 0,
                      y: 0,
                    }}
                    animate={{ 
                      opacity: 1,
                      scale: 1,
                      x,
                      y,
                      rotate: getRotation(index),
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.7,
                      y: -100,
                      transition: { 
                        duration: 0.6,
                        ease: [0.4, 0, 0.2, 1]
                      }
                    }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    style={{
                      zIndex: imageItems.length - index,
                    }}
                    onClick={handleReveal}
                    whileHover={{ 
                      scale: 1.05, 
                      zIndex: 999,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <PolaroidFrame
                      rotation={0}
                      onClick={() => {}}
                    >
                      <img src={item.src} alt={item.meta?.label || 'Mood'} />
                    </PolaroidFrame>
                  </motion.div>
                );
              })}
            </div>
            
            <motion.button
              className={styles.revealButton}
              onClick={handleReveal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Moodboard erkunden
            </motion.button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

