// components/menu/__tests__/hamburger.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Hamburger from '../hamburger';

describe('Hamburger Component', () => {
  it('renders with correct aria attributes when closed', () => {
    const mockOnClick = vi.fn();
    render(<Hamburger isOpen={false} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Open menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders with correct aria attributes when open', () => {
    const mockOnClick = vi.fn();
    render(<Hamburger isOpen={true} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Close menu');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onClick when clicked', async () => {
    const mockOnClick = vi.fn();
    render(<Hamburger isOpen={false} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies open class when isOpen is true', () => {
    const mockOnClick = vi.fn();
    const { container } = render(<Hamburger isOpen={true} onClick={mockOnClick} />);
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('open');
  });

  it('does not apply open class when isOpen is false', () => {
    const mockOnClick = vi.fn();
    const { container } = render(<Hamburger isOpen={false} onClick={mockOnClick} />);
    
    const button = container.querySelector('button');
    expect(button?.className).not.toContain('open');
  });
});