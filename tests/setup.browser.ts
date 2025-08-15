/**
 * Vitest 测试设置文件 (浏览器环境)
 *
 * @description 配置浏览器环境下的测试环境
 */

import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';

// 全局测试配置
beforeAll(() => {
  console.log('🧪 开始运行测试 (浏览器环境)');

  // 模拟浏览器 crypto API
  if (!globalThis.crypto) {
    // 简单的 crypto polyfill 用于测试
    globalThis.crypto = {
      getRandomValues: (array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      },
      subtle: {} as SubtleCrypto,
    } as Crypto;
  }

  // 模拟 TextEncoder/TextDecoder
  if (!globalThis.TextEncoder) {
    (globalThis as any).TextEncoder = class {
      encode(input: string): Uint8Array {
        const bytes = new Uint8Array(input.length);
        for (let i = 0; i < input.length; i++) {
          bytes[i] = input.charCodeAt(i);
        }
        return bytes;
      }
      get encoding() {
        return 'utf-8';
      }
      encodeInto() {
        throw new Error('Not implemented');
      }
    };
  }

  if (!globalThis.TextDecoder) {
    (globalThis as any).TextDecoder = class {
      decode(input: Uint8Array): string {
        return String.fromCharCode(...input);
      }
      get encoding() {
        return 'utf-8';
      }
      get fatal() {
        return false;
      }
      get ignoreBOM() {
        return false;
      }
    };
  }
});

afterAll(() => {
  console.log('✅ 测试完成 (浏览器环境)');
});

beforeEach(() => {
  // 每个测试前的清理工作
  if (globalThis.console && globalThis.console.warn) {
    globalThis.console.warn = vi.fn();
  }
});

afterEach(() => {
  // 每个测试后的清理工作
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

// 浏览器特定的测试工具
(globalThis as any).browserTestUtils = {
  // 检查是否在浏览器环境
  isBrowser: () => typeof window !== 'undefined',

  // 检查 Web Crypto API 支持
  hasWebCrypto: () => typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined',

  // 检查 BigInt 支持
  hasBigInt: () => typeof BigInt !== 'undefined',

  // 检查 WebAssembly 支持
  hasWebAssembly: () => typeof WebAssembly !== 'undefined',

  // 模拟用户代理
  mockUserAgent: (userAgent: string) => {
    if (typeof navigator !== 'undefined') {
      Object.defineProperty(navigator, 'userAgent', {
        value: userAgent,
        configurable: true,
      });
    }
  },
};

// 声明浏览器测试工具类型
declare global {
  var browserTestUtils: {
    isBrowser: () => boolean;
    hasWebCrypto: () => boolean;
    hasBigInt: () => boolean;
    hasWebAssembly: () => boolean;
    mockUserAgent: (userAgent: string) => void;
  };
}
