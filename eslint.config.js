export default [
  {
    files: ['src/**/*.ts'],
    rules: {
      // 只保留最基础的规则
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'warn',
    },
  },
  {
    ignores: [
      'dist/**/*',
      'coverage/**/*',
      'node_modules/**/*',
      'playwright-report/**/*',
      'test-results/**/*',
      'tests/**/*',
      '*.config.js',
      '*.config.ts',
    ],
  },
];
