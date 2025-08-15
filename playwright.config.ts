import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 测试配置
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* 并行运行测试 */
  fullyParallel: true,
  
  /* 在 CI 环境中失败时不重试，本地开发时重试一次 */
  retries: process.env.CI ? 2 : 0,
  
  /* 在 CI 环境中使用更少的 worker */
  workers: process.env.CI ? 1 : undefined,
  
  /* 测试报告配置 */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['junit', { outputFile: 'test-results/e2e-results.xml' }],
    process.env.CI ? ['github'] : ['list']
  ],
  
  /* 全局设置 */
  use: {
    /* 基础 URL */
    baseURL: 'http://localhost:3000',
    
    /* 收集失败测试的追踪信息 */
    trace: 'on-first-retry',
    
    /* 截图配置 */
    screenshot: 'only-on-failure',
    
    /* 视频录制 */
    video: 'retain-on-failure',
    
    /* 忽略 HTTPS 错误 */
    ignoreHTTPSErrors: true,
    
    /* 设置超时 */
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  /* 测试项目配置 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* 移动端测试 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* 微软 Edge 测试 */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },

    /* Google Chrome 测试 */
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* 本地开发服务器配置 */
  webServer: {
    command: 'pnpm preview',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* 输出目录 */
  outputDir: 'test-results/e2e',
  
  /* 全局超时 */
  globalTimeout: 60 * 60 * 1000, // 1 小时
  
  /* 单个测试超时 */
  timeout: 30 * 1000, // 30 秒
  
  /* expect 超时 */
  expect: {
    timeout: 5 * 1000, // 5 秒
  },
  
  /* 测试匹配模式 */
  testMatch: [
    '**/*.e2e.{js,ts}',
    '**/*.spec.{js,ts}'
  ],
  
  /* 忽略的文件 */
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**'
  ]
});
