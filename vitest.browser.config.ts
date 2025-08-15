import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom', // 或 'jsdom'
    setupFiles: ['tests/setup.browser.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'coverage/browser',
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
        'src/constants/**',
        'src/adapters/node.ts' // 排除 Node.js 特定代码
      ],
      include: [
        'src/**/*.ts'
      ],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    include: [
      'tests/unit/**/*.browser.{test,spec}.{js,ts}',
      'tests/integration/**/*.browser.{test,spec}.{js,ts}'
    ],
    exclude: [
      'tests/e2e/**/*',
      'tests/fixtures/**/*',
      'tests/**/*.node.{test,spec}.{js,ts}',
      'node_modules/**/*'
    ],
    reporters: ['verbose'],
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true // 浏览器环境使用单线程
      }
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
    __BROWSER__: true,
    __VERSION__: JSON.stringify('test'),
    __DEV__: true,
    global: 'globalThis'
  }
});
