/**
 * Welcome animation component for customer view
 * Displays branding with cinematic camera aperture reveal
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WelcomeAnimation.module.css';

interface WelcomeAnimationProps {
  welcomeText: string;
  onComplete: () => void;
}

export function WelcomeAnimation({ welcomeText, onComplete }: WelcomeAnimationProps) {
  const [step, setStep] = useState(0); // 0: branding, 1: greeting, 2: aperture opening, 3: complete
  
  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1200);    // Show greeting after 1.2s
    const timer2 = setTimeout(() => setStep(2), 3500);    // Start aperture at 3.5s (text visible longer)
    const timer3 = setTimeout(() => setStep(3), 5000);    // Complete at 5s
    const timer4 = setTimeout(() => onComplete(), 5100);  // Callback slightly after
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);
  
  return (
    <AnimatePresence>
      {step < 3 && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Cinematic Wipe Transition (like film curtains) */}
          {step === 2 && (
            <>
              {/* Left curtain */}
              <motion.div
                className={styles.curtain}
                style={{ left: 0 }}
                initial={{ x: '0%' }}
                animate={{ x: '-100%' }}
                transition={{
                  duration: 1.2,
                  ease: [0.76, 0, 0.24, 1],
                  delay: 0.1,
                }}
              />
              {/* Right curtain */}
              <motion.div
                className={styles.curtain}
                style={{ right: 0 }}
                initial={{ x: '0%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.2,
                  ease: [0.76, 0, 0.24, 1],
                  delay: 0.1,
                }}
              />
            </>
          )}
          
          {/* Text Content */}
          <motion.div
            className={styles.content}
            initial={{ opacity: 0 }}
            animate={step === 2 ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={styles.branding}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Moodboard by Mark Tietz Fotografie
            </motion.div>
            
            {step >= 1 && (
              <motion.div
                className={styles.greeting}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              >
                {welcomeText}
              </motion.div>
            )}
          </motion.div>
          
          {/* Camera Lens Flare Effect */}
          {step === 2 && (
            <motion.div
              className={styles.lensFlare}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.5, 2] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}


