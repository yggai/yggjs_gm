/**
 * 安全随机数生成
 *
 * @description 提供密码学安全的随机数生成功能
 */

/**
 * 生成安全随机字节
 *
 * @param length 字节长度
 * @returns 随机字节数组
 */
export function randomBytes(length: number): Uint8Array {
  if (length <= 0) {
    throw new Error('长度必须为正数');
  }

  // 在浏览器环境中使用 crypto.getRandomValues
  if (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as any).crypto !== 'undefined' &&
    typeof (globalThis as any).crypto.getRandomValues === 'function'
  ) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  }

  // 在 Node.js 环境中使用 crypto 模块
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    try {
      const nodeCrypto = require('crypto');
      return new Uint8Array(nodeCrypto.randomBytes(length));
    } catch (e) {
      // 如果 crypto 模块不可用，回退到伪随机数
    }
  }

  // 回退方案：使用 Math.random() (不够安全，仅用于测试)
  console.warn('使用不安全的随机数生成器，仅用于测试目的');
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

/**
 * 生成指定范围的随机整数
 *
 * @param min 最小值
 * @param max 最大值
 * @returns 随机整数
 */
export function randomInt(min: number, max: number): number {
  if (min >= max) {
    throw new Error('最小值必须小于最大值');
  }

  const range = max - min;
  const bytes = randomBytes(4); // 使用 4 字节生成随机数
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const randomValue = view.getUint32(0, false); // 大端

  return min + (randomValue % range);
}

/**
 * 生成指定位长度的随机大整数
 *
 * @param bitLength 位长度
 * @returns 随机大整数
 */
export function randomBigint(bitLength: number): bigint {
  if (bitLength <= 0) {
    throw new Error('位长度必须为正数');
  }

  const byteLength = Math.ceil(bitLength / 8);
  const bytes = randomBytes(byteLength);

  // 将字节数组转换为 bigint
  let result = 0n;
  for (let i = 0; i < bytes.length; i++) {
    result = (result << 8n) | BigInt(bytes[i] as number);
  }

  // 确保结果具有正确的位长度
  const mask = (1n << BigInt(bitLength)) - 1n;
  return result & mask;
}

/**
 * 生成指定范围内的随机大整数
 *
 * @param min 最小值
 * @param max 最大值
 * @returns 随机大整数
 */
export function randomBigintRange(min: bigint, max: bigint): bigint {
  if (min >= max) {
    throw new Error('最小值必须小于最大值');
  }

  const range = max - min;
  const bitLength = range.toString(2).length;

  // 使用拒绝采样确保均匀分布
  let result: bigint;
  do {
    result = randomBigint(bitLength);
  } while (result >= range);

  return min + result;
}
