// app/home/pagewrapper/pagewrapper.tsx
'use client';

import { ReactNode } from 'react';
import styles from './pagewrapper.module.css';
import { useSectionObserver } from './useSectionObserver';

interface PageWrapperProps {
  children: ReactNode;
  sectionIds: string[];
}

export default function PageWrapper({ children, sectionIds }: PageWrapperProps) {
  const activeSection = useSectionObserver(sectionIds);
  
  return (
    <div className={styles.wrapper} data-active-section={activeSection}>
      {children}
    </div>
  );
}