// components/menu/hamburger.tsx
'use client';

import styles from './hamburger.module.css';

interface HamburgerProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function Hamburger({ isOpen, onClick }: HamburgerProps) {
  return (
    <button
      className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      aria-controls="navigation-menu"
    >
      <svg
        viewBox="0 0 24 24"
        className={styles.icon}
        aria-hidden="true"
      >
        <line 
          x1="3" 
          y1="6" 
          x2="21" 
          y2="6" 
          className={styles.line}
        />
        <line 
          x1="3" 
          y1="12" 
          x2="21" 
          y2="12" 
          className={styles.line}
        />
        <line 
          x1="3" 
          y1="18" 
          x2="21" 
          y2="18" 
          className={styles.line}
        />
      </svg>
    </button>
  );
}