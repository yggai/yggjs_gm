/**
 * SM2 公钥加密
 *
 * @description 实现 SM2 公钥加密算法
 */

import type { SM2PublicKey, SM2EncryptionOptions } from './sm2.types.js';

/**
 * SM2 公钥加密
 *
 * @param publicKey 公钥
 * @param plaintext 明文
 * @param options 加密选项
 * @returns 密文
 */
export function encrypt(
  publicKey: SM2PublicKey,
  plaintext: Uint8Array,
  options?: SM2EncryptionOptions
): Uint8Array {
  // TODO: 实现 SM2 公钥加密
  throw new Error('SM2 公钥加密功能待实现');
}
