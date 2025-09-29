import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import PageWrapper from '@/components/pagewrapper/pagewrapper';

// 👇 Mock the hook so we focus on PageWrapper behavior.
let currentActiveSection = 'sec-1';
const useSectionObserverMock = vi.fn(() => currentActiveSection);

vi.mock('@/components/pagewrapper/useSectionObserver', () => ({
  useSectionObserver: (..._args: unknown[]) => useSectionObserverMock(),
}));

describe('PageWrapper', () => {
  afterEach(() => {
    currentActiveSection = 'sec-1';
    useSectionObserverMock.mockClear();
  });

  it('sets data-active-section and dispatches activeSectionChange on mount', async () => {
    const events: string[] = [];
    const handler = (e: Event) => {
      // @ts-ignore - detail is from CustomEvent
      events.push(e.detail?.activeSection);
    };
    window.addEventListener('activeSectionChange', handler);

    const { container, unmount } = render(
      <PageWrapper sectionIds={['sec-1', 'sec-2']}>
        <div>content</div>
      </PageWrapper>
    );

    const wrapper = container.querySelector('[data-active-section]') as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.dataset.activeSection).toBe('sec-1');

    expect(events).toEqual(['sec-1']);

    window.removeEventListener('activeSectionChange', handler);
    unmount();
  });

  it('updates attribute and dispatches event when active section changes', async () => {
    const events: string[] = [];
    const handler = (e: Event) => {
      // @ts-ignore - detail is from CustomEvent
      events.push(e.detail?.activeSection);
    };
    window.addEventListener('activeSectionChange', handler);

    const utils = render(
      <PageWrapper sectionIds={['sec-1', 'sec-2']}>
        <div>content</div>
      </PageWrapper>
    );

    // initial render
    let wrapper = utils.container.querySelector('[data-active-section]') as HTMLElement;
    expect(wrapper.dataset.activeSection).toBe('sec-1');

    // change the mocked hook return and re-render
    currentActiveSection = 'sec-2';
    utils.rerender(
      <PageWrapper sectionIds={['sec-1', 'sec-2']}>
        <div>content</div>
      </PageWrapper>
    );

    wrapper = utils.container.querySelector('[data-active-section]') as HTMLElement;
    expect(wrapper.dataset.activeSection).toBe('sec-2');

    expect(events).toEqual(['sec-1', 'sec-2']);

    window.removeEventListener('activeSectionChange', handler);
    utils.unmount();
  });
});
