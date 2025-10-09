/**
 * Smooth scroll component
 * Adds smooth scrolling behavior and fade-in animations on scroll
 */

import { ReactNode, useEffect, useRef } from 'react';
import styles from './SmoothScroller.module.css';

interface SmoothScrollerProps {
  children: ReactNode;
}

export function SmoothScroller({ children }: SmoothScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );
    
    // Observe all direct children
    const container = containerRef.current;
    if (container) {
      const children = container.children;
      Array.from(children).forEach((child) => {
        child.classList.add(styles.fadeIn);
        observer.observe(child);
      });
    }
    
    return () => {
      observer.disconnect();
    };
  }, [children]);
  
  return (
    <div ref={containerRef} className={styles.container}>
      {children}
    </div>
  );
}


