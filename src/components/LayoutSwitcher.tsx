/**
 * Layout Switcher Component
 * Allows users to switch between different grid layouts
 */

import styles from './LayoutSwitcher.module.css';

interface LayoutSwitcherProps {
  currentLayout: 'grid' | 'masonry' | 'single-column';
  onLayoutChange: (layout: 'grid' | 'masonry' | 'single-column') => void;
}

export function LayoutSwitcher({ currentLayout, onLayoutChange }: LayoutSwitcherProps) {
  const layouts = [
    { id: 'grid' as const, icon: '▦', label: 'Grid' },
    { id: 'masonry' as const, icon: '▢', label: 'Masonry' },
    { id: 'single-column' as const, icon: '▬', label: 'Single Column' },
  ];

  return (
    <div className={styles.container}>
      <span className={styles.label}>Layout:</span>
      <div className={styles.buttons}>
        {layouts.map(layout => (
          <button
            key={layout.id}
            className={`${styles.button} ${currentLayout === layout.id ? styles.active : ''}`}
            onClick={() => onLayoutChange(layout.id)}
            title={layout.label}
            aria-label={layout.label}
          >
            {layout.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

