import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        'tests/',
        'examples/',
        'scripts/',
        'docs/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        'src/types/**',
        'src/constants/**'
      ],
      include: [
        'src/**/*.ts'
      ],
      threshold: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        },
        'src/core/**': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      },
      watermarks: {
        statements: [80, 95],
        functions: [80, 95],
        branches: [80, 95],
        lines: [80, 95]
      }
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    include: [
      'tests/**/*.{test,spec}.{js,ts}'
    ],
    exclude: [
      'tests/e2e/**/*',
      'tests/fixtures/**/*',
      'node_modules/**/*'
    ],
    reporters: ['verbose', 'json', 'html'],
    outputFile: {
      json: 'test-results.json',
      html: 'test-results.html'
    },
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4,
        minThreads: 1
      }
    },
    logHeapUsage: true,
    sequence: {
      shuffle: true
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/core': resolve(__dirname, 'src/core'),
      '@/adapters': resolve(__dirname, 'src/adapters'),
      '@/api': resolve(__dirname, 'src/api'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/constants': resolve(__dirname, 'src/constants')
    }
  },
  define: {
    __TEST__: true,
    __VERSION__: JSON.stringify('test'),
    __DEV__: true
  }
});
