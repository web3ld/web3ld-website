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
    (el as any).scrollIntoView = vi.fn(); // no directive needed
    document.body.appendChild(el);

    const pushSpy = vi.spyOn(window.history, 'pushState');

    const ok = scrollToSection('foo', { behavior: 'auto', block: 'center' });
    expect(ok).toBe(true);

    expect((el as any).scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'center' });
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
