/**
 * Branding signature component
 * Displays photographer's branding in bottom-right corner
 */

import styles from './BrandingSignature.module.css';

interface BrandingSignatureProps {
  visible?: boolean;
}

export function BrandingSignature({ visible = true }: BrandingSignatureProps) {
  if (!visible) return null;
  
  return (
    <div className={styles.signature}>
      by Mark Tietz Fotografie
    </div>
  );
}

