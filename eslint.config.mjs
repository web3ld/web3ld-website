// eslint.config.mjs - ESLint v9 flat config format
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,
  
  // Configuration for all TypeScript and JavaScript files
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    
    // Language options - parser and environment
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        // Additional browser/TypeScript types not in globals package
        React: 'readonly',
        EventListener: 'readonly',
        HeadersInit: 'readonly',
        // Cloudflare Workers specific globals
        DurableObjectState: 'readonly',
        DurableObjectNamespace: 'readonly',
      },
    },
    
    // Load the plugins
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    
    // Settings for plugins
    settings: {
      react: {
        version: 'detect',
      },
    },
    
    // Rules configuration
    rules: {
      // TypeScript recommended rules
      ...tsPlugin.configs.recommended.rules,
      
      // React recommended rules
      ...reactPlugin.configs.recommended.rules,
      
      // React Hooks rules
      ...reactHooksPlugin.configs.recommended.rules,
      
      // JSX a11y recommended rules
      ...jsxA11yPlugin.configs.recommended.rules,
      
      // Custom overrides
      // React 17+ doesn't require React import in JSX files
      'react/react-in-jsx-scope': 'off',
      
      // TypeScript rules - be reasonable about 'any' types
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      
      // Make most accessibility rules warnings instead of errors
      // This gives feedback without blocking workflow
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/iframe-has-title': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/media-has-caption': 'warn',
      'jsx-a11y/mouse-events-have-key-events': 'warn',
      'jsx-a11y/no-access-key': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-distracting-elements': 'warn',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'jsx-a11y/scope': 'warn',
      'jsx-a11y/tabindex-no-positive': 'warn',
      
      // React Hooks rules are kept as errors because they catch real bugs
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  
  // Separate configuration for test files - more lenient rules
  {
    files: [
      '**/*.test.{ts,tsx,js,jsx}', 
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
      '**/test/**/*.{ts,tsx,js,jsx}',
      '**/tests/**/*.{ts,tsx,js,jsx}'
    ],
    rules: {
      // Allow 'any' types in tests - mocking complex objects is common
      '@typescript-eslint/no-explicit-any': 'off',
      
      // Allow unused variables in tests (like unused imports for type checking)
      '@typescript-eslint/no-unused-vars': 'off',
      
      // Tests often have accessibility violations in their test markup
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
    },
  },
  
  // Files to ignore - don't lint these
  {
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      'build/',
      'dist/',
      'playwright-report/',
      'test-results/',
      'coverage/',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      'next-env.d.ts',
    ],
  },
];