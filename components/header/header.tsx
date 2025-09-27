// components/header/header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './header.module.css';
import Github from '@components/utilities/socials/github';
import Hamburger from '@components/menu/hamburger';
import Menu from '@components/menu/menu';
import { useSwipe } from '@components/menu/useSwipe';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Swipe to open/close menu from anywhere on the page
  useSwipe(null, {
    onSwipeLeft: () => setIsMenuOpen(true),
    onSwipeRight: () => setIsMenuOpen(false),
    enabled: true
  });

  useEffect(() => {
    const handleActiveSectionChange = (event: CustomEvent) => {
      setActiveSection(event.detail.activeSection);
    };

    window.addEventListener('activeSectionChange', handleActiveSectionChange as EventListener);
    
    return () => {
      window.removeEventListener('activeSectionChange', handleActiveSectionChange as EventListener);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className={styles.spacer} aria-hidden="true" />
      <header className={styles.fixed}>
        <div className={styles.inner}>
          {/* Left: GitHub (render both sizes, toggle via CSS) */}
          <div className={styles.left}>
            <div className={styles.githubMobile}>
              <Github size={28} />
            </div>
            <div className={styles.githubDesktop}>
              <Github size={30} />
            </div>
          </div>
          {/* Center: Logo -> root */}
          <Link href="/" className={styles.center} aria-label="web3LD home">
            <img
              src="/images/logos/wordmark.png"
              alt="web3LD"
              className={styles.logo}
            />
          </Link>
          {/* Right: Hamburger Menu */}
          <div className={styles.right}>
            <Hamburger isOpen={isMenuOpen} onClick={toggleMenu} />
          </div>
        </div>
      </header>
      
      {/* Menu Modal */}
      <Menu isOpen={isMenuOpen} onClose={closeMenu} activeSection={activeSection} />
    </>
  );
}