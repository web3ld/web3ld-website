import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock framer-motion for tests (animations don't work well in tests)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
}));