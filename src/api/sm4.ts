/**
 * SM4 高级 API
 *
 * @description 提供易用的 SM4 算法接口
 */

import type { SM4Options } from '../core/sm4/sm4.types.js';
import { SM4Cipher, SM4Decipher } from '../core/sm4/stream.js';

/**
 * SM4 加密
 *
 * @param key 密钥
 * @param iv 初始向量
 * @param data 明文
 * @param options 选项
 * @returns 密文
 */
export async function encrypt(
  key: Uint8Array,
  iv: Uint8Array,
  data: Uint8Array,
  options: SM4Options
): Promise<Uint8Array> {
  // TODO: 实现 SM4 加密 API
  throw new Error('SM4 加密 API 待实现');
}

/**
 * SM4 解密
 *
 * @param key 密钥
 * @param iv 初始向量
 * @param data 密文
 * @param options 选项
 * @returns 明文
 */
export async function decrypt(
  key: Uint8Array,
  iv: Uint8Array,
  data: Uint8Array,
  options: SM4Options
): Promise<Uint8Array> {
  // TODO: 实现 SM4 解密 API
  throw new Error('SM4 解密 API 待实现');
}

/**
 * 创建 SM4 加密器
 *
 * @param key 密钥
 * @param iv 初始向量
 * @param options 选项
 * @returns 加密器
 */
export function createCipher(key: Uint8Array, iv: Uint8Array, options: SM4Options): SM4Cipher {
  return new SM4Cipher(key, iv, options);
}

/**
 * 创建 SM4 解密器
 *
 * @param key 密钥
 * @param iv 初始向量
 * @param options 选项
 * @returns 解密器
 */
export function createDecipher(key: Uint8Array, iv: Uint8Array, options: SM4Options): SM4Decipher {
  return new SM4Decipher(key, iv, options);
}
