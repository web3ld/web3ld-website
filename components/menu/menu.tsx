// components/menu/menu.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './menu.module.css';
import Github from '@components/utilities/socials/github';
import { menuItems } from './menuItems';
import { scrollToSection } from '@components/pagewrapper/useSectionObserver';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
}

export default function Menu({ isOpen, onClose, activeSection }: MenuProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const menuRef = useRef<HTMLDivElement>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);



  const handleItemClick = (item: typeof menuItems[0]) => {
    // Visual feedback
    setClickedItem(item.href);
    
    // If it's a section on the current page, scroll to it
    if (isHomePage && item.isSection) {
      const sectionId = item.href.replace('/#', '');
      scrollToSection(sectionId, { behavior: 'smooth', block: 'start' });
    }

    // Close menu after a brief delay for visual feedback
    setTimeout(() => {
      onClose();
      setClickedItem(null);
    }, 300);
  };

  const getActiveClass = (item: typeof menuItems[0]) => {
    // If item was just clicked, show as active
    if (clickedItem === item.href) {
      return styles.active;
    }
    
    // If on home page and it's a section
    if (isHomePage && item.isSection) {
      const sectionId = item.href.replace('/#', '');
      return activeSection === sectionId ? styles.active : '';
    }
    
    // For regular pages
    if (!item.isSection && pathname === item.href) {
      return styles.active;
    }
    
    return '';
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        aria-hidden="true"
      />
      
      {/* Menu Modal */}
      <nav
        ref={menuRef}
        id="navigation-menu"
        className={`${styles.menu} ${isOpen ? styles.open : ''}`}
        aria-label="Main navigation"
      >
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg
            viewBox="0 0 24 24"
            className={styles.closeIcon}
            aria-hidden="true"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <Link 
          href="/" 
          className={styles.logoLink}
          onClick={() => setTimeout(onClose, 100)}
          aria-label="web3LD home"
        >
          <img
            src="/images/logos/logomark.png"
            alt="web3LD"
            className={styles.logo}
          />
        </Link>

        {/* Menu Items */}
        <ul className={styles.menuItems}>
          {menuItems.map((item) => (
            <li key={item.href}>
              {item.isSection && isHomePage ? (
                <button
                  className={`${styles.menuItem} ${getActiveClass(item)}`}
                  onClick={() => handleItemClick(item)}
                  aria-current={getActiveClass(item) ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`${styles.menuItem} ${getActiveClass(item)}`}
                  onClick={() => handleItemClick(item)}
                  aria-current={getActiveClass(item) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* GitHub Icon */}
        <div className={styles.githubWrapper}>
          <Github size={32} />
        </div>
      </nav>
    </>
  );
}