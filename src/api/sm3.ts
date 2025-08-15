/**
 * SM3 高级 API
 *
 * @description 提供易用的 SM3 算法接口
 */

import { SM3Hash } from '../core/sm3/stream.js';

/**
 * SM3 摘要计算
 *
 * @param data 输入数据
 * @returns 256 位摘要
 */
export async function digest(data: Uint8Array): Promise<Uint8Array> {
  // TODO: 实现 SM3 摘要 API
  throw new Error('SM3 摘要 API 待实现');
}

/**
 * HMAC-SM3 计算
 *
 * @param key 密钥
 * @param data 数据
 * @returns HMAC 值
 */
export async function hmac(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  // TODO: 实现 HMAC-SM3 API
  throw new Error('HMAC-SM3 API 待实现');
}

/**
 * 创建 SM3 流式哈希对象
 *
 * @returns SM3 哈希对象
 */
export function createHash(): SM3Hash {
  return new SM3Hash();
}
