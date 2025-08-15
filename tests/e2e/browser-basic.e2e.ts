/**
 * 浏览器基础功能 E2E 测试
 * 
 * @description 测试在真实浏览器环境中的基础功能
 */

import { test, expect } from '@playwright/test';

test.describe('浏览器环境基础测试', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到测试页面
    await page.goto('/examples/browser/');
  });

  test('页面应该正确加载', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/国密算法库浏览器示例/);
    
    // 检查主要元素是否存在
    await expect(page.locator('h1')).toContainText('国密算法库浏览器示例');
    await expect(page.locator('.example')).toHaveCount(3);
  });

  test('SM3 摘要功能测试', async ({ page }) => {
    // 点击 SM3 测试按钮
    await page.click('button:has-text("测试 SM3 摘要")');
    
    // 等待结果显示
    await expect(page.locator('#sm3-result')).toBeVisible();
    
    // 检查结果内容
    const result = await page.locator('#sm3-result').textContent();
    expect(result).toContain('功能待实现'); // 当前的占位符文本
    
    // TODO: 当功能实现后，检查实际的摘要结果
    // expect(result).toMatch(/^[0-9a-fA-F]{64}$/);
  });

  test('SM2 数字签名功能测试', async ({ page }) => {
    // 点击 SM2 测试按钮
    await page.click('button:has-text("测试 SM2 签名")');
    
    // 等待结果显示
    await expect(page.locator('#sm2-result')).toBeVisible();
    
    // 检查结果内容
    const result = await page.locator('#sm2-result').textContent();
    expect(result).toContain('功能待实现'); // 当前的占位符文本
  });

  test('SM4 对称加密功能测试', async ({ page }) => {
    // 点击 SM4 测试按钮
    await page.click('button:has-text("测试 SM4 加密")');
    
    // 等待结果显示
    await expect(page.locator('#sm4-result')).toBeVisible();
    
    // 检查结果内容
    const result = await page.locator('#sm4-result').textContent();
    expect(result).toContain('功能待实现'); // 当前的占位符文本
  });

  test('浏览器兼容性检查', async ({ page }) => {
    // 检查必要的 Web API 支持
    const hasWebCrypto = await page.evaluate(() => {
      return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
    });
    expect(hasWebCrypto).toBe(true);

    // 检查 BigInt 支持
    const hasBigInt = await page.evaluate(() => {
      return typeof BigInt !== 'undefined';
    });
    expect(hasBigInt).toBe(true);

    // 检查 Uint8Array 支持
    const hasUint8Array = await page.evaluate(() => {
      return typeof Uint8Array !== 'undefined';
    });
    expect(hasUint8Array).toBe(true);
  });

  test('错误处理测试', async ({ page }) => {
    // 监听控制台错误
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 执行可能产生错误的操作
    await page.click('button:has-text("测试 SM3 摘要")');
    await page.click('button:has-text("测试 SM2 签名")');
    await page.click('button:has-text("测试 SM4 加密")');

    // 等待一段时间确保所有操作完成
    await page.waitForTimeout(1000);

    // 检查是否有意外的错误
    const unexpectedErrors = errors.filter(error => 
      !error.includes('功能待实现') && 
      !error.includes('TODO')
    );
    expect(unexpectedErrors).toHaveLength(0);
  });

  test('性能测试', async ({ page }) => {
    // 测试页面加载性能
    const startTime = Date.now();
    await page.reload();
    const loadTime = Date.now() - startTime;
    
    // 页面应该在合理时间内加载完成
    expect(loadTime).toBeLessThan(5000); // 5秒内
    
    // 测试脚本执行性能
    const scriptStartTime = await page.evaluate(() => performance.now());
    await page.click('button:has-text("测试 SM3 摘要")');
    const scriptEndTime = await page.evaluate(() => performance.now());
    
    const scriptTime = scriptEndTime - scriptStartTime;
    expect(scriptTime).toBeLessThan(1000); // 1秒内
  });
});

test.describe('跨浏览器兼容性测试', () => {
  test('基础功能在不同浏览器中正常工作', async ({ page, browserName }) => {
    await page.goto('/examples/browser/');
    
    // 检查页面基础功能
    await expect(page.locator('h1')).toBeVisible();
    
    // 根据浏览器类型进行特定测试
    if (browserName === 'chromium') {
      // Chrome 特定测试
      const userAgent = await page.evaluate(() => navigator.userAgent);
      expect(userAgent).toContain('Chrome');
    } else if (browserName === 'firefox') {
      // Firefox 特定测试
      const userAgent = await page.evaluate(() => navigator.userAgent);
      expect(userAgent).toContain('Firefox');
    } else if (browserName === 'webkit') {
      // Safari 特定测试
      const userAgent = await page.evaluate(() => navigator.userAgent);
      expect(userAgent).toContain('Safari');
    }
    
    // 通用功能测试
    await page.click('button:has-text("测试 SM3 摘要")');
    await expect(page.locator('#sm3-result')).toBeVisible();
  });
});

test.describe('移动端测试', () => {
  test('移动端基础功能', async ({ page }) => {
    await page.goto('/examples/browser/');
    
    // 检查移动端适配
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      // 移动端特定检查
      await expect(page.locator('body')).toHaveCSS('font-family', /Arial/);
    }
    
    // 触摸事件测试
    await page.tap('button:has-text("测试 SM3 摘要")');
    await expect(page.locator('#sm3-result')).toBeVisible();
  });
});
