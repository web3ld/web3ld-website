// components/menu/__tests__/menu-integration.test.tsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { act } from 'react';
import Hamburger from '../hamburger';
import Menu from '../menu';
import { menuItems } from '../menuItems';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

// Mock Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock scrollToSection
vi.mock('@components/pagewrapper/useSectionObserver', () => ({
  scrollToSection: vi.fn(),
}));

// Mock Github component
vi.mock('@components/utilities/socials/github', () => ({
  default: () => <div>Github Icon</div>,
}));

// CSS-modules-agnostic helpers for open/closed checks
const expectOpen = (nav: HTMLElement) => {
  expect(nav.className).toContain('open');
};
const expectClosed = (nav: HTMLElement) => {
  expect(nav.className).not.toContain('open');
};

// Test wrapper component that simulates the header behavior
function MenuSystem() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Hamburger
        isOpen={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('Menu System Integration', () => {
  it('opens menu when hamburger is clicked', async () => {
    render(<MenuSystem />);

    const nav = screen.getByRole('navigation');
    expectClosed(nav);

    const hamburgerButton = screen.getByLabelText('Open menu', {
      selector: 'button[aria-controls="navigation-menu"]',
    });
    await userEvent.click(hamburgerButton);

    expectOpen(nav);
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Close menu');
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes menu when hamburger is clicked while open', async () => {
    render(<MenuSystem />);

    const hamburgerButton = screen.getByLabelText('Open menu', {
      selector: 'button[aria-controls="navigation-menu"]',
    });
    await userEvent.click(hamburgerButton);

    const nav = screen.getByRole('navigation');
    expectOpen(nav);

    const closeHamburger = screen.getByLabelText('Close menu', {
      selector: 'button[aria-controls="navigation-menu"]',
    });

    fireEvent.click(closeHamburger);

    await waitFor(() => {
      expectClosed(screen.getByRole('navigation'));
    });
  });

  it('closes menu when close button inside menu is clicked', async () => {
    render(<MenuSystem />);

    const hamburgerButton = screen.getByLabelText('Open menu', {
      selector: 'button[aria-controls="navigation-menu"]',
    });
    await userEvent.click(hamburgerButton);

    const nav = screen.getByRole('navigation');
    expectOpen(nav);

    const closeButton = within(nav).getByRole('button', { name: 'Close menu' });
    await userEvent.click(closeButton);

    expectClosed(nav);
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Open menu');
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes menu when a menu item is clicked', async () => {
    vi.useFakeTimers();
    render(<MenuSystem />);

    const hamburgerButton = screen.getByLabelText('Open menu', {
      selector: 'button[aria-controls="navigation-menu"]',
    });
    fireEvent.click(hamburgerButton);

    const nav = screen.getByRole('navigation');
    expectOpen(nav);

    // Use first menu item (should be a button on homepage)
    const firstItem = menuItems[0];
    const itemButton = within(nav).getByRole('button', { name: firstItem.label });
    fireEvent.click(itemButton);

    expectOpen(nav);

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expectClosed(nav);
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('closes menu when Escape key is pressed', async () => {
    render(<MenuSystem />);

    const hamburgerButton = screen.getByLabelText('Open menu', {
      selector: 'button[aria-controls="navigation-menu"]',
    });
    await userEvent.click(hamburgerButton);

    const nav = screen.getByRole('navigation');
    expectOpen(nav);

    fireEvent.keyDown(document, { key: 'Escape' });

    expectClosed(nav);
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('closes menu when clicking outside', async () => {
    render(
      <div>
        <div data-testid="outside">Outside content</div>
        <MenuSystem />
      </div>
    );

    const hamburgerButton = screen.getByLabelText('Open menu', {
      selector: 'button[aria-controls="navigation-menu"]',
    });
    await userEvent.click(hamburgerButton);

    const nav = screen.getByRole('navigation');
    expectOpen(nav);

    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);

    expectClosed(nav);
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('maintains proper accessibility throughout interaction flow', async () => {
    render(<MenuSystem />);

    const hamburgerButton = screen.getByLabelText('Open menu', {
      selector: 'button[aria-controls="navigation-menu"]',
    });
    const nav = screen.getByRole('navigation');

    expect(hamburgerButton).toHaveAttribute('aria-controls', 'navigation-menu');
    expect(nav).toHaveAttribute('id', 'navigation-menu');

    await userEvent.click(hamburgerButton);
    expectOpen(nav);

    // Check all menu items from menuItems array are accessible
    menuItems.forEach((item) => {
      expect(within(nav).getByText(item.label)).toBeInTheDocument();
    });

    expect(within(nav).getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  });
});