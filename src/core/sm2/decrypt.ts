/**
 * SM2 私钥解密
 *
 * @description 实现 SM2 私钥解密算法
 */

import type { SM2PrivateKey, SM2EncryptionOptions } from './sm2.types.js';

/**
 * SM2 私钥解密
 *
 * @param privateKey 私钥
 * @param ciphertext 密文
 * @param options 解密选项
 * @returns 明文
 */
export function decrypt(
  privateKey: SM2PrivateKey,
  ciphertext: Uint8Array,
  options?: SM2EncryptionOptions
): Uint8Array {
  // TODO: 实现 SM2 私钥解密
  throw new Error('SM2 私钥解密功能待实现');
}
