/**
 * Welcome animation component for customer view
 * Displays branding and personalized greeting with fade-in effect
 */

import { useEffect, useState } from 'react';
import styles from './WelcomeAnimation.module.css';

interface WelcomeAnimationProps {
  welcomeText: string;
  onComplete: () => void;
}

export function WelcomeAnimation({ welcomeText, onComplete }: WelcomeAnimationProps) {
  const [step, setStep] = useState(0); // 0: branding, 1: greeting, 2: fade out
  
  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1000);
    const timer2 = setTimeout(() => setStep(2), 2500);
    const timer3 = setTimeout(() => onComplete(), 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);
  
  return (
    <div className={`${styles.overlay} ${step === 2 ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <div className={`${styles.branding} ${step >= 0 ? styles.show : ''}`}>
          Moodboard by Mark Tietz Fotografie
        </div>
        
        {step >= 1 && (
          <div className={`${styles.greeting} ${step >= 1 ? styles.show : ''}`}>
            {welcomeText}
          </div>
        )}
      </div>
    </div>
  );
}

