// components/menu/__tests__/menu.unit.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Menu from '../menu';
import { menuItems } from '../menuItems';
import styles from '../menu.module.css';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

// Mock the scrollToSection function
vi.mock('@components/pagewrapper/useSectionObserver', () => ({
  scrollToSection: vi.fn(),
}));

describe('Menu Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders closed by default', () => {
    render(<Menu isOpen={false} onClose={mockOnClose} />);
    const menu = screen.getByRole('navigation');
    expect(menu).not.toHaveClass(styles.open);
  });

  it('renders open when isOpen is true', () => {
    render(<Menu isOpen={true} onClose={mockOnClose} />);
    const menu = screen.getByRole('navigation');
    expect(menu).toHaveClass(styles.open);
  });

  it('calls onClose when close button is clicked', () => {
    render(<Menu isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<Menu isOpen={true} onClose={mockOnClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside the menu', () => {
    render(<Menu isOpen={true} onClose={mockOnClose} />);
    fireEvent.mouseDown(document.body);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders all menu items', () => {
    render(<Menu isOpen={true} onClose={mockOnClose} />);
    
    // Validate each item from the actual menuItems array
    menuItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
    
    // Validate the correct number of items
    expect(screen.getAllByRole('button').length + screen.getAllByRole('link').length)
      .toBeGreaterThanOrEqual(menuItems.length);
  });
});