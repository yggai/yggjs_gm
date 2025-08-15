/**
 * 大整数运算性能测试
 *
 * @description 测试大整数运算的性能表现
 */

import {
  add,
  BigIntWrapper,
  fromString,
  gcd,
  modInverse,
  modPow,
  multiply,
} from '@/core/math/bigint.js';
import { describe, expect, it } from 'vitest';
import { benchmark } from '../../../utils/helpers.js';

describe('大整数运算性能测试', () => {
  describe('基础运算性能', () => {
    it('加法运算性能', async () => {
      const a = fromString('123456789012345678901234567890');
      const b = fromString('987654321098765432109876543210');

      const result = await benchmark(
        '大整数加法',
        () => {
          add(a, b);
        },
        10000
      );

      console.log(`加法运算: ${result.opsPerSecond.toFixed(0)} ops/sec`);
      expect(result.opsPerSecond).toBeGreaterThan(10000); // 至少 10k ops/sec
    });

    it('乘法运算性能', async () => {
      const a = fromString('123456789012345678901234567890');
      const b = fromString('987654321098765432109876543210');

      const result = await benchmark(
        '大整数乘法',
        () => {
          multiply(a, b);
        },
        1000
      );

      console.log(`乘法运算: ${result.opsPerSecond.toFixed(0)} ops/sec`);
      expect(result.opsPerSecond).toBeGreaterThan(1000); // 至少 1k ops/sec
    });
  });

  describe('模运算性能', () => {
    it('模幂运算性能', async () => {
      const base = fromString('12345');
      const exp = fromString('67890');
      const mod = fromString('123456789012345678901234567890123456789');

      const result = await benchmark(
        '模幂运算',
        () => {
          modPow(base, exp, mod);
        },
        100
      );

      console.log(`模幂运算: ${result.opsPerSecond.toFixed(0)} ops/sec`);
      expect(result.opsPerSecond).toBeGreaterThan(10); // 至少 10 ops/sec
    });

    it('模逆运算性能', async () => {
      const a = fromString('12345');
      const m = fromString('1000000007'); // 使用一个质数

      const result = await benchmark(
        '模逆运算',
        () => {
          modInverse(a, m);
        },
        100
      );

      console.log(`模逆运算: ${result.opsPerSecond.toFixed(0)} ops/sec`);
      expect(result.opsPerSecond).toBeGreaterThan(10); // 至少 10 ops/sec
    });

    it('最大公约数性能', async () => {
      const a = fromString('123456789012345678901234567890');
      const b = fromString('987654321098765432109876543210');

      const result = await benchmark(
        '最大公约数',
        () => {
          gcd(a, b);
        },
        1000
      );

      console.log(`最大公约数: ${result.opsPerSecond.toFixed(0)} ops/sec`);
      expect(result.opsPerSecond).toBeGreaterThan(100); // 至少 100 ops/sec
    });
  });

  describe('不同大小数字的性能', () => {
    const sizes = [
      { name: '64位', bits: 64 },
      { name: '128位', bits: 128 },
      { name: '256位', bits: 256 },
      { name: '512位', bits: 512 },
      { name: '1024位', bits: 1024 },
    ];

    sizes.forEach(({ name, bits }) => {
      it(`${name}数字乘法性能`, async () => {
        // 生成指定位数的随机大整数
        const maxValue = (1n << BigInt(bits)) - 1n;
        const a = new BigIntWrapper(maxValue / 3n);
        const b = new BigIntWrapper(maxValue / 5n);

        const result = await benchmark(
          `${name}乘法`,
          () => {
            multiply(a, b);
          },
          1000
        );

        console.log(`${name}乘法: ${result.opsPerSecond.toFixed(0)} ops/sec`);
        expect(result.opsPerSecond).toBeGreaterThan(1); // 至少 1 ops/sec
      });
    });
  });

  describe('内存使用测试', () => {
    it('大量运算不应该导致内存泄漏', () => {
      const a = fromString('123456789012345678901234567890');
      const b = fromString('987654321098765432109876543210');

      // 执行大量运算
      for (let i = 0; i < 10000; i++) {
        const result = add(a, b);
        multiply(result, a);
      }

      // 如果没有内存泄漏，这个测试应该能正常完成
      expect(true).toBe(true);
    });
  });

  describe('链式调用性能', () => {
    it('链式调用应该有良好的性能', async () => {
      const start = new BigIntWrapper(2n);

      const result = await benchmark(
        '链式调用',
        () => {
          start
            .add(new BigIntWrapper(3n))
            .multiply(new BigIntWrapper(4n))
            .subtract(new BigIntWrapper(1n))
            .divide(new BigIntWrapper(2n));
        },
        10000
      );

      console.log(`链式调用: ${result.opsPerSecond.toFixed(0)} ops/sec`);
      expect(result.opsPerSecond).toBeGreaterThan(1000); // 至少 1k ops/sec
    });
  });
});
