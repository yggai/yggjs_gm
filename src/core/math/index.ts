/**
 * 数学基础库模块
 *
 * @description 提供密码学所需的数学运算功能
 */

// 导出数学基础功能
export * from './bigint.js';
export * from './ecc.js';
export * from './math.types.js';
export * from './modular.js';
export * from './random.js';

// 重新导出主要的大整数类和函数
export {
  BigIntWrapper,
  abs,
  add,
  and,
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
} from './bigint.js';
