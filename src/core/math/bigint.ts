/**
 * 大整数运算封装
 *
 * @description 基于 BigInt + big-integer 的大整数运算功能
 */

import bigInt from 'big-integer';

/**
 * 大整数包装类
 *
 * @description 统一 BigInt 和 big-integer 的接口
 */
export class BigIntWrapper {
  public readonly value: bigint;
  private readonly _bigInt: ReturnType<typeof bigInt>;

  constructor(value: bigint | number | string) {
    if (typeof value === 'bigint') {
      this.value = value;
    } else if (typeof value === 'number') {
      this.value = BigInt(value);
    } else {
      this.value = BigInt(value);
    }

    this._bigInt = bigInt(this.value.toString());
  }

  /**
   * 加法运算
   */
  add(other: BigIntWrapper): BigIntWrapper {
    return new BigIntWrapper(this.value + other.value);
  }

  /**
   * 减法运算
   */
  subtract(other: BigIntWrapper): BigIntWrapper {
    return new BigIntWrapper(this.value - other.value);
  }

  /**
   * 乘法运算
   */
  multiply(other: BigIntWrapper): BigIntWrapper {
    return new BigIntWrapper(this.value * other.value);
  }

  /**
   * 除法运算
   */
  divide(other: BigIntWrapper): BigIntWrapper {
    if (other.value === 0n) {
      throw new Error('Division by zero');
    }
    return new BigIntWrapper(this.value / other.value);
  }

  /**
   * 取模运算
   */
  mod(other: BigIntWrapper): BigIntWrapper {
    if (other.value === 0n) {
      throw new Error('Division by zero');
    }
    return new BigIntWrapper(this.value % other.value);
  }

  /**
   * 转换为字符串
   */
  toString(radix?: number): string {
    if (radix && radix !== 10) {
      return this.value.toString(radix);
    }
    return this.value.toString();
  }

  /**
   * 转换为字节数组
   */
  toBytes(length?: number): Uint8Array {
    return toBytes(this, length);
  }

  /**
   * 获取 big-integer 实例 (用于复杂运算)
   */
  get bigInteger() {
    return this._bigInt;
  }
}

/**
 * 工厂函数：从数字创建大整数
 */
export function fromNumber(value: number): BigIntWrapper {
  return new BigIntWrapper(value);
}

/**
 * 工厂函数：从字符串创建大整数
 */
export function fromString(value: string, radix: number = 10): BigIntWrapper {
  if (radix === 16 && value.startsWith('0x')) {
    return new BigIntWrapper(BigInt(value));
  }

  if (radix === 10) {
    return new BigIntWrapper(BigInt(value));
  }

  // 使用 big-integer 处理其他进制
  const bigIntValue = bigInt(value, radix as any);
  return new BigIntWrapper(BigInt(bigIntValue.toString()));
}

/**
 * 工厂函数：从字节数组创建大整数
 */
export function fromBytes(bytes: Uint8Array): BigIntWrapper {
  let result = 0n;
  for (let i = 0; i < bytes.length; i++) {
    result = (result << 8n) | BigInt(bytes[i]!);
  }
  return new BigIntWrapper(result);
}

/**
 * 工厂函数：从十六进制字符串创建大整数
 */
export function fromHex(hex: string): BigIntWrapper {
  const cleanHex = hex.startsWith('0x') ? hex : '0x' + hex;
  return new BigIntWrapper(BigInt(cleanHex));
}

/**
 * 转换为字节数组
 */
export function toBytes(big: BigIntWrapper, length?: number): Uint8Array {
  let value = big.value;

  if (value === 0n) {
    return length ? new Uint8Array(length) : new Uint8Array([0]);
  }

  // 计算所需字节数
  const bytes: number[] = [];
  let temp = value;

  while (temp > 0n) {
    bytes.unshift(Number(temp & 0xffn));
    temp = temp >> 8n;
  }

  const result = new Uint8Array(bytes);

  if (length) {
    if (result.length > length) {
      throw new Error(`Value too large for ${length} bytes`);
    }

    const padded = new Uint8Array(length);
    padded.set(result, length - result.length);
    return padded;
  }

  return result;
}

/**
 * 转换为十六进制字符串
 */
export function toHex(big: BigIntWrapper): string {
  return big.value.toString(16);
}

/**
 * 加法运算
 */
export function add(a: BigIntWrapper, b: BigIntWrapper): BigIntWrapper {
  return a.add(b);
}

/**
 * 减法运算
 */
export function subtract(a: BigIntWrapper, b: BigIntWrapper): BigIntWrapper {
  return a.subtract(b);
}

/**
 * 乘法运算
 */
export function multiply(a: BigIntWrapper, b: BigIntWrapper): BigIntWrapper {
  return a.multiply(b);
}

/**
 * 除法运算
 */
export function divide(a: BigIntWrapper, b: BigIntWrapper): BigIntWrapper {
  return a.divide(b);
}

/**
 * 取模运算
 */
export function mod(a: BigIntWrapper, b: BigIntWrapper): BigIntWrapper {
  return a.mod(b);
}

/**
 * 模幂运算
 */
export function modPow(
  base: BigIntWrapper,
  exponent: BigIntWrapper,
  modulus: BigIntWrapper
): BigIntWrapper {
  // 使用 big-integer 的 modPow 方法
  const result = base.bigInteger.modPow(exponent.bigInteger, modulus.bigInteger);
  return new BigIntWrapper(BigInt(result.toString()));
}

/**
 * 模逆运算
 */
export function modInverse(a: BigIntWrapper, m: BigIntWrapper): BigIntWrapper {
  // 使用 big-integer 的 modInv 方法
  const result = a.bigInteger.modInv(m.bigInteger);
  return new BigIntWrapper(BigInt(result.toString()));
}

/**
 * 最大公约数
 */
export function gcd(a: BigIntWrapper, b: BigIntWrapper): BigIntWrapper {
  // 使用 big-integer 的 gcd 方法
  const result = bigInt.gcd(a.bigInteger, b.bigInteger);
  return new BigIntWrapper(BigInt(result.toString()));
}

/**
 * 比较大小
 */
export function compare(a: BigIntWrapper, b: BigIntWrapper): number {
  if (a.value < b.value) return -1;
  if (a.value > b.value) return 1;
  return 0;
}

/**
 * 判断相等
 */
export function equals(a: BigIntWrapper, b: BigIntWrapper): boolean {
  return a.value === b.value;
}

/**
 * 判断是否为零
 */
export function isZero(big: BigIntWrapper): boolean {
  return big.value === 0n;
}

/**
 * 判断是否为一
 */
export function isOne(big: BigIntWrapper): boolean {
  return big.value === 1n;
}

/**
 * 判断是否为偶数
 */
export function isEven(big: BigIntWrapper): boolean {
  return (big.value & 1n) === 0n;
}

/**
 * 判断是否为奇数
 */
export function isOdd(big: BigIntWrapper): boolean {
  return (big.value & 1n) === 1n;
}

/**
 * 计算位长度
 */
export function bitLength(big: BigIntWrapper): number {
  if (big.value === 0n) return 0;
  return big.value.toString(2).length;
}

/**
 * 左移运算
 */
export function shiftLeft(big: BigIntWrapper, bits: number): BigIntWrapper {
  return new BigIntWrapper(big.value << BigInt(bits));
}

/**
 * 右移运算
 */
export function shiftRight(big: BigIntWrapper, bits: number): BigIntWrapper {
  return new BigIntWrapper(big.value >> BigInt(bits));
}

/**
 * 按位与运算
 */
export function and(a: BigIntWrapper, b: BigIntWrapper): BigIntWrapper {
  return new BigIntWrapper(a.value & b.value);
}

/**
 * 按位或运算
 */
export function or(a: BigIntWrapper, b: BigIntWrapper): BigIntWrapper {
  return new BigIntWrapper(a.value | b.value);
}

/**
 * 按位异或运算
 */
export function xor(a: BigIntWrapper, b: BigIntWrapper): BigIntWrapper {
  return new BigIntWrapper(a.value ^ b.value);
}

/**
 * 按位取反运算
 */
export function not(big: BigIntWrapper, bits: number): BigIntWrapper {
  const mask = (1n << BigInt(bits)) - 1n;
  return new BigIntWrapper(~big.value & mask);
}

/**
 * 生成随机大整数
 */
export function randomBigInt(bits: number): BigIntWrapper {
  if (bits <= 0) {
    throw new Error('Bits must be positive');
  }

  const bytes = Math.ceil(bits / 8);
  const randomBytes = new Uint8Array(bytes);

  // 使用 crypto.getRandomValues 生成随机字节
  if (typeof crypto !== 'undefined' && crypto?.getRandomValues) {
    crypto.getRandomValues(randomBytes);
  } else {
    // 降级到伪随机数
    for (let i = 0; i < bytes; i++) {
      randomBytes[i]! = Math.floor(Math.random() * 256);
    }
  }

  // 确保最高位为1（如果需要精确的位数）
  const extraBits = bits % 8;
  if (extraBits > 0) {
    const mask = (1 << extraBits) - 1;
    randomBytes[0]! &= mask;
    randomBytes[0]! |= 1 << (extraBits - 1);
  } else {
    randomBytes[0]! |= 0x80;
  }

  return fromBytes(randomBytes);
}

/**
 * 计算绝对值
 */
export function abs(big: BigIntWrapper): BigIntWrapper {
  return new BigIntWrapper(big.value < 0n ? -big.value : big.value);
}

/**
 * 取负值
 */
export function negate(big: BigIntWrapper): BigIntWrapper {
  return new BigIntWrapper(-big.value);
}

/**
 * 幂运算 (不取模)
 */
export function pow(base: BigIntWrapper, exponent: BigIntWrapper): BigIntWrapper {
  if (exponent.value < 0n) {
    throw new Error('Negative exponent not supported');
  }

  let result = 1n;
  let baseValue = base.value;
  let expValue = exponent.value;

  while (expValue > 0n) {
    if (expValue & 1n) {
      result *= baseValue;
    }
    baseValue *= baseValue;
    expValue >>= 1n;
  }

  return new BigIntWrapper(result);
}

/**
 * 平方根 (整数部分)
 */
export function sqrt(big: BigIntWrapper): BigIntWrapper {
  if (big.value < 0n) {
    throw new Error('Square root of negative number');
  }

  if (big.value === 0n || big.value === 1n) {
    return big;
  }

  // 使用牛顿法求平方根
  let x = big.value;
  let y = (x + 1n) / 2n;

  while (y < x) {
    x = y;
    y = (x + big.value / x) / 2n;
  }

  return new BigIntWrapper(x);
}

/**
 * 最小值
 */
export function min(a: BigIntWrapper, b: BigIntWrapper): BigIntWrapper {
  return a.value < b.value ? a : b;
}

/**
 * 最大值
 */
export function max(a: BigIntWrapper, b: BigIntWrapper): BigIntWrapper {
  return a.value > b.value ? a : b;
}
