// components/pagewrapper/useSectionObserver.ts
import { useEffect, useRef, useState } from 'react';

export function useSectionObserver(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Track visibility percentages of each section
    const visibilityMap = new Map<string, number>();

    const updateActiveSection = () => {
      let mostVisible = '';
      let maxVisibility = 0;
      let minDistanceFromCenter = Infinity;

      visibilityMap.forEach((visibility, id) => {
        if (visibility > 0) {
          const element = document.getElementById(id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const elementCenter = rect.top + rect.height / 2;
            const distanceFromCenter = Math.abs(viewportCenter - elementCenter);

            // Prioritize visibility, but use distance from center as tiebreaker
            if (visibility > maxVisibility || 
                (visibility === maxVisibility && distanceFromCenter < minDistanceFromCenter)) {
              maxVisibility = visibility;
              minDistanceFromCenter = distanceFromCenter;
              mostVisible = id;
            }
          }
        }
      });

      if (mostVisible && mostVisible !== activeSection) {
        setActiveSection(mostVisible);
        // Update URL hash without scrolling
        window.history.replaceState(null, '', `#${mostVisible}`);
      } else if (!mostVisible && activeSection) {
        setActiveSection('');
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    // Create observer with multiple thresholds for smooth tracking
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          visibilityMap.set(id, entry.intersectionRatio);
        });
        updateActiveSection();
      },
      {
        rootMargin: '-10% 0px -10% 0px', // Consider center 80% of viewport
        threshold: Array.from({ length: 101 }, (_, i) => i / 100) // 0 to 1 in 0.01 increments
      }
    );

    // Observe ONLY the specific sections passed in sectionIds
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
        visibilityMap.set(id, 0);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sectionIds, activeSection]);

  return activeSection;
}