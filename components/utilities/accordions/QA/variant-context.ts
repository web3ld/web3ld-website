'use client';

import { createContext, useContext } from 'react';
import type { AccordionVariant } from './types';

/**
 * Variant context for optional "inherit from parent" behavior.
 * Not used by default yet—see comments in AccordionText.tsx.
 */
export const AccordionVariantContext = createContext<AccordionVariant>('purple');

export const useAccordionVariant = () => useContext(AccordionVariantContext);
