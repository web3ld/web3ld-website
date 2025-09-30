// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    css: {
      modules: { classNameStrategy: 'stable' },
    },
    // Exclude e2e tests (Playwright) and cloudflare-worker tests
    exclude: [
      'node_modules/',
      'e2e/**',
      'cloudflare-worker/**',
      '**/*.spec.ts', // Playwright uses .spec.ts, your unit tests should use .test.ts
      'test/',
      '*.config.*',
      '**/*.d.ts',
      '**/*.stories.tsx',
      '.next/',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '*.config.*',
        '**/*.d.ts',
        '**/*.stories.tsx',
        '.next/',
        'e2e/**',
        'cloudflare-worker/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@hooks': path.resolve(__dirname, './hooks'),
      '@config': path.resolve(__dirname, './app/config'),
      '@lib': path.resolve(__dirname, './lib'),
      '@cloudflare-worker': path.resolve(__dirname, './cloudflare-worker/src'),
      '@asteasolutions/zod-to-openapi': path.resolve(__dirname, './test/shims/zod-to-openapi.ts'),
    },
  },
});