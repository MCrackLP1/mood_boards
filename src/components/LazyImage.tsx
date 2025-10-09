/**
 * Lazy-loaded image component with loading state
 */

import { useState, useEffect, useRef } from 'react';
import styles from './LazyImage.module.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export function LazyImage({ src, alt, className, onClick }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (!imgRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before image enters viewport
      }
    );
    
    observer.observe(imgRef.current);
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className={`${styles.wrapper} ${className || ''}`} onClick={onClick}>
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && <div className={styles.placeholder} />}
    </div>
  );
}

