/**
 * Vitest 测试设置文件 (Node.js 环境)
 *
 * @description 配置 Node.js 环境下的测试环境
 */

import { afterAll, afterEach, beforeAll, beforeEach, expect, vi } from 'vitest';

// 全局测试配置
beforeAll(() => {
  console.log('🧪 开始运行测试 (Node.js 环境)');

  // 设置测试环境变量
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'error'; // 减少测试日志

  // 模拟 Node.js crypto 模块
  if (typeof global !== 'undefined' && !global.crypto) {
    try {
      const { webcrypto } = require('crypto');
      (global as any).crypto = webcrypto;
    } catch (error) {
      console.warn('无法加载 Node.js crypto 模块:', error);
    }
  }
});

afterAll(() => {
  console.log('✅ 测试完成 (Node.js 环境)');
});

beforeEach(() => {
  // 每个测试前的清理工作
  // 清理控制台警告计数
  if (typeof global !== 'undefined' && global.console) {
    (global.console as any).warn = vi.fn();
  }
});

afterEach(() => {
  // 每个测试后的清理工作
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

// 扩展 expect 匹配器
expect.extend({
  toBeValidUint8Array(received: any) {
    const pass = received instanceof Uint8Array && received.length > 0;
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be a valid Uint8Array`
          : `Expected ${received} to be a valid Uint8Array`,
    };
  },

  toBeValidHexString(received: any) {
    const pass = typeof received === 'string' && /^[0-9a-fA-F]+$/.test(received);
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be a valid hex string`
          : `Expected ${received} to be a valid hex string`,
    };
  },

  toHaveByteLength(received: Uint8Array, expected: number) {
    const pass = received instanceof Uint8Array && received.length === expected;
    return {
      pass,
      message: () =>
        pass
          ? `Expected Uint8Array not to have length ${expected}`
          : `Expected Uint8Array to have length ${expected}, but got ${received?.length}`,
    };
  },
});

// 声明自定义匹配器类型
declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining {
      toBeValidUint8Array(): any;
      toBeValidHexString(): any;
      toHaveByteLength(expected: number): any;
    }
  }
}

// 全局测试工具函数
(global as any).testUtils = {
  // 生成测试用的随机字节
  randomBytes: (length: number): Uint8Array => {
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return bytes;
  },

  // 字节数组转十六进制字符串
  bytesToHex: (bytes: Uint8Array): string => {
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  // 十六进制字符串转字节数组
  hexToBytes: (hex: string): Uint8Array => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  },

  // 比较两个字节数组
  compareBytes: (a: Uint8Array, b: Uint8Array): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  },
};

// 声明全局测试工具类型
declare global {
  var testUtils: {
    randomBytes: (length: number) => Uint8Array;
    bytesToHex: (bytes: Uint8Array) => string;
    hexToBytes: (hex: string) => Uint8Array;
    compareBytes: (a: Uint8Array, b: Uint8Array) => boolean;
  };
}
