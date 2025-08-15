/**
 * 大整数运算封装测试
 *
 * @description 测试基于 BigInt + big-integer 的大整数运算功能
 */

import {
  abs,
  add,
  and,
  BigIntWrapper,
  bitLength,
  compare,
  divide,
  equals,
  fromBytes,
  fromHex,
  fromNumber,
  fromString,
  gcd,
  isEven,
  isOdd,
  isOne,
  isZero,
  max,
  min,
  mod,
  modInverse,
  modPow,
  multiply,
  negate,
  not,
  or,
  pow,
  randomBigInt,
  shiftLeft,
  shiftRight,
  sqrt,
  subtract,
  toBytes,
  toHex,
  xor,
} from '@/core/math/bigint.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('大整数运算封装', () => {
  describe('BigIntWrapper 类', () => {
    it('应该能够创建 BigIntWrapper 实例', () => {
      const big = new BigIntWrapper(123n);
      expect(big).toBeInstanceOf(BigIntWrapper);
      expect(big.value).toBe(123n);
    });

    it('应该支持链式调用', () => {
      const result = new BigIntWrapper(10n)
        .add(new BigIntWrapper(5n))
        .multiply(new BigIntWrapper(2n));

      expect(result.value).toBe(30n);
    });

    it('应该正确转换为字符串', () => {
      const big = new BigIntWrapper(12345n);
      expect(big.toString()).toBe('12345');
      expect(big.toString(16)).toBe('3039');
    });

    it('应该正确转换为字节数组', () => {
      const big = new BigIntWrapper(0x1234n);
      const bytes = big.toBytes();
      expect(bytes).toEqual(new Uint8Array([0x12, 0x34]));
    });
  });

  describe('工厂函数', () => {
    it('fromNumber 应该正确创建大整数', () => {
      const big = fromNumber(123);
      expect(big.value).toBe(123n);
    });

    it('fromString 应该正确解析字符串', () => {
      expect(fromString('123').value).toBe(123n);
      expect(fromString('0x1a', 16).value).toBe(26n);
      expect(fromString('1010', 2).value).toBe(10n);
    });

    it('fromBytes 应该正确解析字节数组', () => {
      const bytes = new Uint8Array([0x12, 0x34]);
      const big = fromBytes(bytes);
      expect(big.value).toBe(0x1234n);
    });

    it('fromHex 应该正确解析十六进制字符串', () => {
      const big = fromHex('1234');
      expect(big.value).toBe(0x1234n);
    });
  });

  describe('转换函数', () => {
    it('toBytes 应该正确转换为字节数组', () => {
      const big = new BigIntWrapper(0x1234n);
      const bytes = toBytes(big);
      expect(bytes).toEqual(new Uint8Array([0x12, 0x34]));
    });

    it('toBytes 应该支持指定长度', () => {
      const big = new BigIntWrapper(0x12n);
      const bytes = toBytes(big, 4);
      expect(bytes).toEqual(new Uint8Array([0x00, 0x00, 0x00, 0x12]));
    });

    it('toHex 应该正确转换为十六进制字符串', () => {
      const big = new BigIntWrapper(0x1234n);
      expect(toHex(big)).toBe('1234');
    });
  });

  describe('基础运算', () => {
    let a: BigIntWrapper;
    let b: BigIntWrapper;

    beforeEach(() => {
      a = new BigIntWrapper(15n);
      b = new BigIntWrapper(6n);
    });

    it('add 应该正确执行加法', () => {
      const result = add(a, b);
      expect(result.value).toBe(21n);
    });

    it('subtract 应该正确执行减法', () => {
      const result = subtract(a, b);
      expect(result.value).toBe(9n);
    });

    it('multiply 应该正确执行乘法', () => {
      const result = multiply(a, b);
      expect(result.value).toBe(90n);
    });

    it('divide 应该正确执行除法', () => {
      const result = divide(a, b);
      expect(result.value).toBe(2n);
    });

    it('mod 应该正确执行取模', () => {
      const result = mod(a, b);
      expect(result.value).toBe(3n);
    });
  });

  describe('模运算', () => {
    it('modPow 应该正确执行模幂运算', () => {
      // 2^10 mod 1000 = 24
      const base = new BigIntWrapper(2n);
      const exp = new BigIntWrapper(10n);
      const modulus = new BigIntWrapper(1000n);

      const result = modPow(base, exp, modulus);
      expect(result.value).toBe(24n);
    });

    it('modInverse 应该正确计算模逆', () => {
      // 3 * 4 ≡ 1 (mod 11)
      const a = new BigIntWrapper(3n);
      const m = new BigIntWrapper(11n);

      const result = modInverse(a, m);
      expect(result.value).toBe(4n);

      // 验证: (3 * 4) mod 11 = 1
      const verification = mod(multiply(a, result), m);
      expect(verification.value).toBe(1n);
    });

    it('gcd 应该正确计算最大公约数', () => {
      const a = new BigIntWrapper(48n);
      const b = new BigIntWrapper(18n);

      const result = gcd(a, b);
      expect(result.value).toBe(6n);
    });
  });

  describe('比较函数', () => {
    it('compare 应该正确比较大小', () => {
      const a = new BigIntWrapper(10n);
      const b = new BigIntWrapper(5n);
      const c = new BigIntWrapper(10n);

      expect(compare(a, b)).toBe(1); // a > b
      expect(compare(b, a)).toBe(-1); // b < a
      expect(compare(a, c)).toBe(0); // a = c
    });

    it('equals 应该正确判断相等', () => {
      const a = new BigIntWrapper(10n);
      const b = new BigIntWrapper(10n);
      const c = new BigIntWrapper(5n);

      expect(equals(a, b)).toBe(true);
      expect(equals(a, c)).toBe(false);
    });
  });

  describe('状态检查', () => {
    it('isZero 应该正确判断零值', () => {
      expect(isZero(new BigIntWrapper(0n))).toBe(true);
      expect(isZero(new BigIntWrapper(1n))).toBe(false);
    });

    it('isOne 应该正确判断一值', () => {
      expect(isOne(new BigIntWrapper(1n))).toBe(true);
      expect(isOne(new BigIntWrapper(0n))).toBe(false);
    });

    it('isEven 应该正确判断偶数', () => {
      expect(isEven(new BigIntWrapper(4n))).toBe(true);
      expect(isEven(new BigIntWrapper(5n))).toBe(false);
    });

    it('isOdd 应该正确判断奇数', () => {
      expect(isOdd(new BigIntWrapper(5n))).toBe(true);
      expect(isOdd(new BigIntWrapper(4n))).toBe(false);
    });
  });

  describe('位运算', () => {
    it('bitLength 应该正确计算位长度', () => {
      expect(bitLength(new BigIntWrapper(0n))).toBe(0);
      expect(bitLength(new BigIntWrapper(1n))).toBe(1);
      expect(bitLength(new BigIntWrapper(7n))).toBe(3);
      expect(bitLength(new BigIntWrapper(8n))).toBe(4);
    });

    it('shiftLeft 应该正确执行左移', () => {
      const big = new BigIntWrapper(5n); // 101
      const result = shiftLeft(big, 2); // 10100
      expect(result.value).toBe(20n);
    });

    it('shiftRight 应该正确执行右移', () => {
      const big = new BigIntWrapper(20n); // 10100
      const result = shiftRight(big, 2); // 101
      expect(result.value).toBe(5n);
    });

    it('and 应该正确执行按位与', () => {
      const a = new BigIntWrapper(0b1100n);
      const b = new BigIntWrapper(0b1010n);
      const result = and(a, b);
      expect(result.value).toBe(0b1000n);
    });

    it('or 应该正确执行按位或', () => {
      const a = new BigIntWrapper(0b1100n);
      const b = new BigIntWrapper(0b1010n);
      const result = or(a, b);
      expect(result.value).toBe(0b1110n);
    });

    it('xor 应该正确执行按位异或', () => {
      const a = new BigIntWrapper(0b1100n);
      const b = new BigIntWrapper(0b1010n);
      const result = xor(a, b);
      expect(result.value).toBe(0b0110n);
    });

    it('not 应该正确执行按位取反', () => {
      const big = new BigIntWrapper(0b1010n);
      const result = not(big, 4); // 4位取反
      expect(result.value).toBe(0b0101n);
    });
  });

  describe('边界情况', () => {
    it('应该处理零值运算', () => {
      const zero = new BigIntWrapper(0n);
      const five = new BigIntWrapper(5n);

      expect(add(zero, five).value).toBe(5n);
      expect(multiply(zero, five).value).toBe(0n);
    });

    it('应该处理负数', () => {
      const neg = new BigIntWrapper(-5n);
      const pos = new BigIntWrapper(3n);

      expect(add(neg, pos).value).toBe(-2n);
      expect(multiply(neg, pos).value).toBe(-15n);
    });

    it('应该处理大数运算', () => {
      const big1 = fromString('123456789012345678901234567890');
      const big2 = fromString('987654321098765432109876543210');

      const result = add(big1, big2);
      expect(result.toString()).toBe('1111111110111111111011111111100');
    });

    it('除零应该抛出错误', () => {
      const a = new BigIntWrapper(10n);
      const zero = new BigIntWrapper(0n);

      expect(() => divide(a, zero)).toThrow();
      expect(() => mod(a, zero)).toThrow();
    });
  });

  describe('扩展功能', () => {
    it('randomBigInt 应该生成指定位数的随机大整数', () => {
      const random64 = randomBigInt(64);
      const random128 = randomBigInt(128);

      expect(bitLength(random64)).toBeLessThanOrEqual(64);
      expect(bitLength(random128)).toBeLessThanOrEqual(128);
      expect(bitLength(random64)).toBeGreaterThan(60); // 应该接近64位
      expect(bitLength(random128)).toBeGreaterThan(120); // 应该接近128位
    });

    it('abs 应该正确计算绝对值', () => {
      const pos = new BigIntWrapper(5n);
      const neg = new BigIntWrapper(-5n);

      expect(abs(pos).value).toBe(5n);
      expect(abs(neg).value).toBe(5n);
    });

    it('negate 应该正确取负值', () => {
      const pos = new BigIntWrapper(5n);
      const neg = new BigIntWrapper(-5n);

      expect(negate(pos).value).toBe(-5n);
      expect(negate(neg).value).toBe(5n);
    });

    it('pow 应该正确执行幂运算', () => {
      const base = new BigIntWrapper(2n);
      const exp = new BigIntWrapper(10n);

      const result = pow(base, exp);
      expect(result.value).toBe(1024n);
    });

    it('sqrt 应该正确计算平方根', () => {
      const big = new BigIntWrapper(16n);
      const result = sqrt(big);
      expect(result.value).toBe(4n);

      const big2 = new BigIntWrapper(15n);
      const result2 = sqrt(big2);
      expect(result2.value).toBe(3n); // 整数部分
    });

    it('min 和 max 应该正确比较', () => {
      const a = new BigIntWrapper(10n);
      const b = new BigIntWrapper(5n);

      expect(min(a, b).value).toBe(5n);
      expect(max(a, b).value).toBe(10n);
    });

    it('应该处理边界情况', () => {
      expect(() => randomBigInt(0)).toThrow();
      expect(() => sqrt(new BigIntWrapper(-1n))).toThrow();
      expect(() => pow(new BigIntWrapper(2n), new BigIntWrapper(-1n))).toThrow();
    });
  });
});
