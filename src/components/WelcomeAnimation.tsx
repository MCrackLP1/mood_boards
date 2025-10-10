/**
 * Welcome animation component for customer view
 * Displays branding with video background
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './WelcomeAnimation.module.css';

interface WelcomeAnimationProps {
  welcomeText: string;
  onComplete: () => void;
}

export function WelcomeAnimation({ welcomeText, onComplete }: WelcomeAnimationProps) {
  const [step, setStep] = useState(0); // 0: branding, 1: greeting, 2: fade text
  const [videoError, setVideoError] = useState(false);
  
  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1200);   // Show greeting after 1.2s
    const timer2 = setTimeout(() => setStep(2), 3500);   // Fade text at 3.5s
    const timer3 = setTimeout(() => onComplete(), 4000); // Complete at 4s (video stays visible)
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);
  
  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {/* Video Background */}
      <div className={styles.videoContainer}>
        {!videoError ? (
          <video
            className={styles.video}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
          >
            <source src="/videos/welcome-background.mp4" type="video/mp4" />
            <source src="/videos/welcome-background.webm" type="video/webm" />
          </video>
        ) : (
          // Animated gradient fallback
          <div className={styles.gradientFallback} />
        )}
        
        {/* Video overlay for better text readability */}
        <div className={styles.videoOverlay} />
      </div>
      
      {/* Text Content */}
      <motion.div
        className={styles.content}
        initial={{ opacity: 0 }}
        animate={step === 2 ? { opacity: 0 } : { opacity: 1 }}
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
    </motion.div>
  );
}


