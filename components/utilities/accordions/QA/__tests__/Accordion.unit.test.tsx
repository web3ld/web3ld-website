import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { Accordion } from '../Accordion';
import type { AccordionItem } from '../types';

describe('Accordion Component', () => {
  const mockItems: AccordionItem[] = [
    {
      value: 'item-1',
      title: 'First Item',
      content: <div>First content</div>,
    },
    {
      value: 'item-2', 
      title: 'Second Item',
      content: <div>Second content</div>,
    },
    {
      value: 'item-3',
      title: 'Third Item',
      content: <div>Third content</div>,
    },
  ];

  describe('Basic Functionality', () => {
    it('renders all accordion items', () => {
      render(<Accordion items={mockItems} />);
      
      expect(screen.getByText('First Item')).toBeInTheDocument();
      expect(screen.getByText('Second Item')).toBeInTheDocument();
      expect(screen.getByText('Third Item')).toBeInTheDocument();
    });

    it('starts with all items closed', () => {
      render(<Accordion items={mockItems} />);
      
      // Content should not be visible initially
      expect(screen.queryByText('First content')).not.toBeInTheDocument();
      expect(screen.queryByText('Second content')).not.toBeInTheDocument();
      expect(screen.queryByText('Third content')).not.toBeInTheDocument();
    });

    it('opens and closes items on click', async () => {
      const user = userEvent.setup();
      render(<Accordion items={mockItems} />);
      
      const firstTrigger = screen.getByText('First Item');
      
      // Open first item
      await user.click(firstTrigger);
      await waitFor(() => {
        expect(screen.getByText('First content')).toBeInTheDocument();
      });
      
      // Close first item
      await user.click(firstTrigger);
      await waitFor(() => {
        expect(screen.queryByText('First content')).not.toBeInTheDocument();
      });
    });

    it('allows multiple items to be open simultaneously', async () => {
      const user = userEvent.setup();
      render(<Accordion items={mockItems} />);
      
      // Open first item
      await user.click(screen.getByText('First Item'));
      await waitFor(() => {
        expect(screen.getByText('First content')).toBeInTheDocument();
      });
      
      // Open second item (first should remain open)
      await user.click(screen.getByText('Second Item'));
      await waitFor(() => {
        expect(screen.getByText('First content')).toBeInTheDocument();
        expect(screen.getByText('Second content')).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation with Enter/Space', async () => {
      const user = userEvent.setup();
      render(<Accordion items={mockItems} />);
      
      const firstTrigger = screen.getByText('First Item').closest('button');
      if (!firstTrigger) throw new Error('Trigger not found');
      
      // Open with Enter
      firstTrigger.focus();
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(screen.getByText('First content')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Close with Space
      await user.keyboard(' ');
      await waitFor(() => {
        expect(screen.queryByText('First content')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('maintains focus after interaction', async () => {
      const user = userEvent.setup();
      render(<Accordion items={mockItems} />);
      
      const firstTrigger = screen.getByText('First Item').closest('button');
      
      await user.click(firstTrigger!);
      expect(firstTrigger).toHaveFocus();
    });
  });

  describe('Variants and Styling', () => {
    it('applies purple variant by default', () => {
      const { container } = render(<Accordion items={mockItems} />);
      const root = container.querySelector('[data-variant="purple"]');
      expect(root).toBeInTheDocument();
    });

    it('applies green variant when specified', () => {
      const { container } = render(<Accordion items={mockItems} variant="green" />);
      const root = container.querySelector('[data-variant="green"]');
      expect(root).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Accordion items={mockItems} className="custom-class" />
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Accordion items={mockItems} />);
      
      const triggers = screen.getAllByRole('button');
      triggers.forEach(trigger => {
        expect(trigger).toHaveAttribute('aria-expanded');
      });
    });

    it('announces expanded state changes', async () => {
      const user = userEvent.setup();
      render(<Accordion items={mockItems} />);
      
      const firstTrigger = screen.getByText('First Item').closest('button');
      
      expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
      
      await user.click(firstTrigger!);
      await waitFor(() => {
        expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      render(<Accordion items={[]} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles items with same value gracefully', () => {
      const duplicateItems: AccordionItem[] = [
        { value: 'same', title: 'Item 1', content: 'Content 1' },
        { value: 'same', title: 'Item 2', content: 'Content 2' },
      ];
      
      // Should render without crashing (React will warn about duplicate keys)
      const { container } = render(<Accordion items={duplicateItems} />);
      expect(container).toBeInTheDocument();
    });

    it('cleans up properly on unmount', () => {
      const { unmount } = render(<Accordion items={mockItems} />);
      expect(() => unmount()).not.toThrow();
    });
  });
});