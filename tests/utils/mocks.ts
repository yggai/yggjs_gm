/**
 * 测试 Mock 对象
 *
 * @description 提供测试中使用的 Mock 对象和函数
 */

import { vi } from 'vitest';

/**
 * Mock 加密 API
 */
export const mockCrypto = {
  getRandomValues: vi.fn((array: Uint8Array) => {
    // 生成可预测的"随机"数据用于测试
    for (let i = 0; i < array.length; i++) {
      array[i] = (i + 1) % 256;
    }
    return array;
  }),

  subtle: {
    digest: vi.fn(async (algorithm: string, data: Uint8Array) => {
      // 简单的 mock 摘要
      const hash = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        hash[i] = (data.length + i) % 256;
      }
      return hash.buffer;
    }),
  },
};

/**
 * Mock Node.js crypto 模块
 */
export const mockNodeCrypto = {
  randomBytes: vi.fn((size: number) => {
    const bytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      bytes[i] = (i + 1) % 256;
    }
    return Buffer.from(bytes);
  }),

  createHash: vi.fn((algorithm: string) => ({
    update: vi.fn().mockReturnThis(),
    digest: vi.fn(() => {
      const hash = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        hash[i] = i % 256;
      }
      return Buffer.from(hash);
    }),
  })),
};

/**
 * Mock 控制台方法
 */
export const mockConsole = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
};

/**
 * Mock 性能 API
 */
export const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(() => []),
  getEntriesByType: vi.fn(() => []),
};

/**
 * Mock 大整数库
 */
export const mockBigInteger: any = {
  default: vi.fn((value: any) => {
    const mockInstance = {
      toString: vi.fn(() => value.toString()),
      add: vi.fn((other: any) => mockBigInteger.default(value + other)),
      subtract: vi.fn((other: any) => mockBigInteger.default(value - other)),
      multiply: vi.fn((other: any) => mockBigInteger.default(value * other)),
      divide: vi.fn((other: any) => mockBigInteger.default(Math.floor(value / other))),
      mod: vi.fn((other: any) => mockBigInteger.default(value % other)),
      modPow: vi.fn((exp: any, mod: any) => mockBigInteger.default(1)), // 简化实现
      modInv: vi.fn((mod: any) => mockBigInteger.default(1)), // 简化实现
      equals: vi.fn((other: any) => value === other),
      compare: vi.fn((other: any) => value - other),
      isZero: vi.fn(() => value === 0),
      isOne: vi.fn(() => value === 1),
    };
    return mockInstance;
  }),
};

/**
 * 设置全局 Mock
 */
export function setupGlobalMocks() {
  // Mock crypto API
  if (!globalThis.crypto) {
    (globalThis as any).crypto = mockCrypto;
  }

  // Mock performance API
  if (!globalThis.performance) {
    (globalThis as any).performance = mockPerformance;
  }

  // Mock console (可选)
  if (typeof process !== 'undefined' && process.env?.MOCK_CONSOLE === 'true') {
    Object.assign(globalThis.console, mockConsole);
  }
}

/**
 * 清理全局 Mock
 */
export function cleanupGlobalMocks() {
  vi.clearAllMocks();
  vi.restoreAllMocks();
}

/**
 * Mock 错误类
 */
export class MockError extends Error {
  constructor(
    message: string,
    public code: string = 'MOCK_ERROR'
  ) {
    super(message);
    this.name = 'MockError';
  }
}

/**
 * 创建 Mock 函数的工厂
 */
export const createMockFactory = <T extends (...args: any[]) => any>(implementation?: T) => {
  const mock = implementation ? vi.fn(implementation) : vi.fn();

  return {
    mock,
    mockResolvedValue: (value: ReturnType<T>) => mock.mockResolvedValue(value),
    mockRejectedValue: (error: Error) => mock.mockRejectedValue(error),
    mockImplementation: (impl: T) => mock.mockImplementation(impl),
    mockReturnValue: (value: ReturnType<T>) => mock.mockReturnValue(value),
    mockClear: () => mock.mockClear(),
    mockReset: () => mock.mockReset(),
    mockRestore: () => mock.mockRestore(),
  };
};

/**
 * 异步 Mock 工厂
 */
export const createAsyncMock = <T>(resolveValue?: T, rejectError?: Error, delay: number = 0) => {
  return vi.fn(async (...args: any[]) => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    if (rejectError) {
      throw rejectError;
    }

    return resolveValue;
  });
};

/**
 * 创建 Spy 对象
 */
export const createSpy = <T extends Record<string, any>>(object: T, methods: (keyof T)[]) => {
  const spies: Record<string, any> = {};

  methods.forEach(method => {
    spies[method as string] = vi.spyOn(object, method as any);
  });

  return {
    spies,
    restore: () => {
      Object.values(spies).forEach((spy: any) => spy.mockRestore());
    },
    clear: () => {
      Object.values(spies).forEach((spy: any) => spy.mockClear());
    },
  };
};

/**
 * 时间相关的 Mock
 */
export const mockTime = {
  freeze: (timestamp?: number) => {
    const frozenTime = timestamp || Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(frozenTime);
    return frozenTime;
  },

  unfreeze: () => {
    vi.useRealTimers();
  },

  advance: (ms: number) => {
    vi.advanceTimersByTime(ms);
  },

  runAll: () => {
    vi.runAllTimers();
  },
};
