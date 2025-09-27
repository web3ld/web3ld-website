// components/menu/useSwipe.ts
import { useEffect, useRef } from 'react';

interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // minimum distance for swipe
  enabled?: boolean;
}

export function useSwipe(
  elementRef: React.RefObject<HTMLElement | null> | null,
  options: SwipeOptions
) {
  const { onSwipeLeft, onSwipeRight, threshold = 50, enabled = true } = options;
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isScrolling = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

    const element = elementRef?.current || document.body;

    // Check if an element or its parents have horizontal scroll
    const hasHorizontalScroll = (el: Element): boolean => {
      let current: Element | null = el;
      
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const overflowX = style.overflowX;
        
        // Check if element has horizontal scroll capability
        if ((overflowX === 'auto' || overflowX === 'scroll') && 
            current.scrollWidth > current.clientWidth) {
          return true;
        }
        
        current = current.parentElement;
      }
      
      return false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      
      // Check if touch started on a horizontally scrollable element
      const target = e.target as Element;
      isScrolling.current = hasHorizontalScroll(target);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      
      // Skip if we detected horizontal scrolling
      if (isScrolling.current) {
        touchStartX.current = null;
        touchStartY.current = null;
        isScrolling.current = false;
        return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;
      
      // Only trigger if horizontal swipe is greater than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
      isScrolling.current = false;
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, onSwipeLeft, onSwipeRight, threshold, enabled]);
}