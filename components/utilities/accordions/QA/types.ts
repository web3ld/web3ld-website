// Pure types (server-safe)

import type { ReactNode } from 'react';

export type AccordionVariant = 'purple' | 'green';

export interface AccordionItem {
  /** Header (button) label shown in the trigger row */
  title: string;
  /** Content node rendered inside the animated pane */
  content: ReactNode;
  /** Unique value for Radix item */
  value: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Visual style; defaults to 'purple' */
  variant?: AccordionVariant;
  /** Optional extra class names to append on the root */
  className?: string;
}
