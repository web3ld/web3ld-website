// components/pagewrapper/pagewrapper.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import styles from './pagewrapper.module.css';
import { useSectionObserver } from './useSectionObserver';

interface PageWrapperProps {
  children: ReactNode;
  sectionIds: string[];
}

export default function PageWrapper({ children, sectionIds }: PageWrapperProps) {
  const activeSection = useSectionObserver(sectionIds);
  
  useEffect(() => {
    // Store active section in a global place where Header can access it
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('activeSectionChange', { 
        detail: { activeSection } 
      }));
    }
  }, [activeSection]);
  
  return (
    <div className={styles.wrapper} data-active-section={activeSection}>
      {children}
    </div>
  );
}