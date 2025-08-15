/**
 * SM4 密码算法单元测试
 *
 * @description 测试 SM4 密码算法功能
 */

import { encryptBlock, keyExpansion } from '@/core/sm4/cipher.js';
import { describe, expect, it } from 'vitest';

describe('SM4 密码算法', () => {
  it('应该能够进行密钥扩展', () => {
    // TODO: 实现测试用例
    const key = new Uint8Array(16);
    expect(() => keyExpansion(key)).toThrow('SM4 密钥扩展功能待实现');
  });

  it('应该能够加密单个数据块', () => {
    // TODO: 实现测试用例
    const plaintext = new Uint8Array(16);
    const roundKeys = new Uint32Array(32);
    expect(() => encryptBlock(plaintext, roundKeys)).toThrow('SM4 单块加密功能待实现');
  });
});
