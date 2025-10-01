import { describe, it, expect, vi, afterEach } from 'vitest';
import { scrollToSection } from '@/components/pagewrapper/useSectionObserver';

describe('scrollToSection utility', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('scrolls to element and updates hash', () => {
    // create a target element
    const el = document.createElement('section');
    el.id = 'foo';
    
    // Mock getBoundingClientRect to return a position
    el.getBoundingClientRect = vi.fn().mockReturnValue({
      top: 500,
      left: 0,
      right: 0,
      bottom: 600,
      width: 0,
      height: 100
    });
    
    document.body.appendChild(el);

    // Mock window.pageYOffset
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 1000
    });

    // Mock window.scrollTo
    const scrollToSpy = vi.spyOn(window, 'scrollTo');
    const pushSpy = vi.spyOn(window.history, 'pushState');

    const ok = scrollToSection('foo', { behavior: 'auto' });
    expect(ok).toBe(true);

    // Should scroll to: elementPosition (500 + 1000) - offset (60) = 1440
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 1440,
      behavior: 'auto'
    });
    expect(pushSpy).toHaveBeenCalledWith(null, '', '#foo');

    el.remove();
  });

  it('retries and warns if element not found', () => {
    vi.useFakeTimers();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const ok = scrollToSection('missing', { retryCount: 2, retryDelay: 5 });
    expect(ok).toBe(false); // schedules retries

    vi.runAllTimers();

    expect(warnSpy).toHaveBeenCalledWith('Could not find section with id: missing');
  });
});