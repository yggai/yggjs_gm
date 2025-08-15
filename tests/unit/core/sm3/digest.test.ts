/**
 * SM3 摘要算法单元测试
 *
 * @description 测试 SM3 摘要算法功能
 */

import { describe, it, expect } from 'vitest';
import { digest } from '@/core/sm3/digest.js';

describe('SM3 摘要算法', () => {
  it('应该能够计算正确的摘要', () => {
    // TODO: 实现测试用例
    const data = new Uint8Array([1, 2, 3]);
    expect(() => digest(data)).toThrow('SM3 摘要算法功能待实现');
  });
});
