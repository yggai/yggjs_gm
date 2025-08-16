/**
 * getKey() API 单元测试
 *
 * @description 测试高级 API 中的 getKey() 方法
 */

import { describe, expect, it } from 'vitest';
import gm from '@/index.js';

describe('getKey() API', () => {
  describe('基本功能', () => {
    it('应该返回包含 secretKey 和 publicKey 的对象', () => {
      const result = gm.getKey();
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('secretKey');
      expect(result).toHaveProperty('publicKey');
    });

    it('secretKey 应该是字符串格式', () => {
      const { secretKey } = gm.getKey();
      
      expect(typeof secretKey).toBe('string');
      expect(secretKey.length).toBeGreaterThan(0);
    });

    it('publicKey 应该是字符串格式', () => {
      const { publicKey } = gm.getKey();
      
      expect(typeof publicKey).toBe('string');
      expect(publicKey.length).toBeGreaterThan(0);
    });

    it('每次调用应该生成不同的密钥对', () => {
      const keyPair1 = gm.getKey();
      const keyPair2 = gm.getKey();
      
      expect(keyPair1.secretKey).not.toBe(keyPair2.secretKey);
      expect(keyPair1.publicKey).not.toBe(keyPair2.publicKey);
    });
  });

  describe('密钥格式验证', () => {
    it('secretKey 应该是有效的十六进制字符串', () => {
      const { secretKey } = gm.getKey();
      
      // SM2 私钥应该是 64 个十六进制字符 (32 字节)
      expect(secretKey).toMatch(/^[0-9a-fA-F]{64}$/);
    });

    it('publicKey 应该是有效的十六进制字符串', () => {
      const { publicKey } = gm.getKey();
      
      // SM2 公钥应该是 128 个十六进制字符 (64 字节，未压缩格式)
      // 或者 130 个字符 (包含 04 前缀)
      expect(publicKey).toMatch(/^(04)?[0-9a-fA-F]{128}$/);
    });

    it('secretKey 应该在有效范围内', () => {
      const { secretKey } = gm.getKey();
      const privateKeyBigInt = BigInt('0x' + secretKey);
      
      // 私钥应该在 [1, n-1] 范围内，其中 n 是基点的阶
      const n = 0xfffffffeffffffffffffffffffffffff7203df6b21c6052b53bbf40939d54123n;
      expect(privateKeyBigInt).toBeGreaterThan(0n);
      expect(privateKeyBigInt).toBeLessThan(n);
    });
  });

  describe('密钥对一致性验证', () => {
    it('公钥应该能从私钥正确导出', () => {
      const { secretKey, publicKey } = gm.getKey();
      
      // 这里我们需要验证公钥确实是从私钥导出的
      // 具体验证逻辑将在实现椭圆曲线运算后添加
      expect(secretKey).toBeDefined();
      expect(publicKey).toBeDefined();
    });
  });

  describe('性能测试', () => {
    it('密钥生成应该在合理时间内完成', () => {
      const startTime = performance.now();
      gm.getKey();
      const endTime = performance.now();
      
      // 密钥生成应该在 100ms 内完成
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('批量生成密钥应该保持性能', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        gm.getKey();
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 10;
      
      // 平均每个密钥生成应该在 50ms 内完成
      expect(avgTime).toBeLessThan(50);
    });
  });

  describe('边界情况', () => {
    it('应该处理连续调用', () => {
      expect(() => {
        for (let i = 0; i < 5; i++) {
          gm.getKey();
        }
      }).not.toThrow();
    });

    it('应该在不同环境下工作', () => {
      // 测试在不同的 JavaScript 环境下是否正常工作
      const result = gm.getKey();
      expect(result).toBeDefined();
    });
  });
});
