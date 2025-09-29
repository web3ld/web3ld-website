// components/menu/__tests__/menu.unit.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import Menu from '../menu';

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

describe('Menu Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    // make sure no timers leak between tests
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders closed by default', () => {
    render(<Menu isOpen={false} onClose={mockOnClose} />);

    const nav = screen.getByRole('navigation');
    expect(nav.className).not.toContain('open');
  });

  it('renders open when isOpen is true', () => {
    render(<Menu isOpen={true} onClose={mockOnClose} />);

    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('open');
  });

  it('calls onClose when close button is clicked', async () => {
    render(<Menu isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close menu');
    await userEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<Menu isOpen={true} onClose={mockOnClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside the menu', () => {
    render(
      <div>
        <div data-testid="outside">Outside element</div>
        <Menu isOpen={true} onClose={mockOnClose} />
      </div>
    );

    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders all menu items', () => {
    render(<Menu isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Sponsor')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });

  it('highlights active section', () => {
    render(<Menu isOpen={true} onClose={mockOnClose} activeSection="faq" />);

    const faqButton = screen.getByText('FAQ');
    expect(faqButton.className).toContain('active');
  });

  it('renders section items as buttons on homepage', () => {
    render(<Menu isOpen={true} onClose={mockOnClose} />);

    const sponsorButton = screen.getByRole('button', { name: /sponsor/i });
    expect(sponsorButton).toBeInTheDocument();
  });

  it('closes menu after item click with delay', async () => {
    // Fake timers can interfere with userEvent; use fireEvent for the click,
    // then run ONLY the pending timers (avoid waiting on intervals).
    vi.useFakeTimers();

    render(<Menu isOpen={true} onClose={mockOnClose} />);

    const sponsorButton = screen.getByRole('button', { name: /sponsor/i });

    // trigger the setTimeout(…, 300)
    fireEvent.click(sponsorButton);

    // Should not close immediately
    expect(mockOnClose).not.toHaveBeenCalled();

    // Flush the queued timeout in an act-aware block
    act(() => {
      vi.runOnlyPendingTimers(); // runs the 300ms timeout without hanging on intervals
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
