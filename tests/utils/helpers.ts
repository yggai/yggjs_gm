/**
 * 测试辅助函数
 *
 * @description 提供测试中常用的工具函数
 */

import { expect } from 'vitest';

/**
 * 测试向量接口
 */
export interface TestVector {
  description: string;
  input: string | Uint8Array;
  expected: string | Uint8Array;
  [key: string]: any;
}

/**
 * 性能测试结果
 */
export interface PerformanceResult {
  name: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  opsPerSecond: number;
}

/**
 * 加载测试向量
 *
 * @param algorithm 算法名称
 * @param testType 测试类型
 * @returns 测试向量数组
 */
export async function loadTestVectors(algorithm: string, testType: string): Promise<TestVector[]> {
  try {
    const { default: vectors } = await import('../fixtures/test-vectors.json');
    const algorithmData = (vectors as any)[algorithm];
    return algorithmData?.[testType] || [];
  } catch (error) {
    console.warn(`无法加载测试向量: ${algorithm}.${testType}`, error);
    return [];
  }
}

/**
 * 十六进制字符串转字节数组
 *
 * @param hex 十六进制字符串
 * @returns 字节数组
 */
export function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('十六进制字符串长度必须是偶数');
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * 字节数组转十六进制字符串
 *
 * @param bytes 字节数组
 * @returns 十六进制字符串
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 生成随机字节数组
 *
 * @param length 字节长度
 * @returns 随机字节数组
 */
export function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // 降级到伪随机数
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  return bytes;
}

/**
 * 比较两个字节数组
 *
 * @param a 字节数组 A
 * @param b 字节数组 B
 * @returns 是否相等
 */
export function compareBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

/**
 * 创建测试用的固定字节数组
 *
 * @param pattern 重复的模式
 * @param length 总长度
 * @returns 字节数组
 */
export function createTestBytes(pattern: number[], length: number): Uint8Array {
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    const patternValue = pattern[i % pattern.length];
    if (patternValue !== undefined) {
      bytes[i] = patternValue;
    }
  }

  return bytes;
}

/**
 * 性能测试函数
 *
 * @param name 测试名称
 * @param fn 测试函数
 * @param iterations 迭代次数
 * @returns 性能测试结果
 */
export async function benchmark(
  name: string,
  fn: () => Promise<void> | void,
  iterations: number = 1000
): Promise<PerformanceResult> {
  // 预热
  for (let i = 0; i < Math.min(10, iterations); i++) {
    await fn();
  }

  // 正式测试
  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    await fn();
  }

  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const averageTime = totalTime / iterations;
  const opsPerSecond = 1000 / averageTime;

  return {
    name,
    iterations,
    totalTime,
    averageTime,
    opsPerSecond,
  };
}

/**
 * 等待指定时间
 *
 * @param ms 毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 创建测试用的大数据
 *
 * @param sizeKB 数据大小 (KB)
 * @returns 字节数组
 */
export function createLargeTestData(sizeKB: number): Uint8Array {
  const size = sizeKB * 1024;
  const data = new Uint8Array(size);

  // 填充有意义的测试数据
  for (let i = 0; i < size; i++) {
    data[i] = i % 256;
  }

  return data;
}

/**
 * 验证错误类型和消息
 *
 * @param error 错误对象
 * @param expectedType 期望的错误类型
 * @param expectedMessage 期望的错误消息 (可选)
 */
export function expectError(
  error: any,
  expectedType: new (...args: any[]) => Error,
  expectedMessage?: string
): void {
  expect(error).toBeInstanceOf(expectedType);

  if (expectedMessage) {
    expect(error.message).toContain(expectedMessage);
  }
}

/**
 * 模拟异步操作
 *
 * @param result 返回结果
 * @param delay 延迟时间 (ms)
 * @returns Promise
 */
export async function mockAsync<T>(result: T, delay: number = 0): Promise<T> {
  if (delay > 0) {
    await sleep(delay);
  }
  return result;
}

/**
 * 检查运行时环境
 */
export const runtime = {
  isNode: () => typeof process !== 'undefined' && process.versions?.node,
  isBrowser: () => typeof window !== 'undefined',
  hasWebCrypto: () => typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined',
  hasBigInt: () => typeof BigInt !== 'undefined',
  hasWebAssembly: () => typeof WebAssembly !== 'undefined',
};
