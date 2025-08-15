/**
 * SM4 工作模式
 *
 * @description 实现 SM4 的各种工作模式
 */

import type { SM4Mode } from './sm4.types.js';

/**
 * SM4 ECB 模式加密
 *
 * @param key 密钥
 * @param plaintext 明文
 * @returns 密文
 */
export function encryptECB(key: Uint8Array, plaintext: Uint8Array): Uint8Array {
  // TODO: 实现 ECB 模式加密
  throw new Error('SM4 ECB 加密功能待实现');
}

/**
 * SM4 CBC 模式加密
 *
 * @param key 密钥
 * @param iv 初始向量
 * @param plaintext 明文
 * @returns 密文
 */
export function encryptCBC(key: Uint8Array, iv: Uint8Array, plaintext: Uint8Array): Uint8Array {
  // TODO: 实现 CBC 模式加密
  throw new Error('SM4 CBC 加密功能待实现');
}

/**
 * SM4 CTR 模式加密
 *
 * @param key 密钥
 * @param iv 初始向量
 * @param plaintext 明文
 * @returns 密文
 */
export function encryptCTR(key: Uint8Array, iv: Uint8Array, plaintext: Uint8Array): Uint8Array {
  // TODO: 实现 CTR 模式加密
  throw new Error('SM4 CTR 加密功能待实现');
}

/**
 * SM4 通用加密函数
 *
 * @param key 密钥
 * @param iv 初始向量
 * @param plaintext 明文
 * @param mode 工作模式
 * @returns 密文
 */
export function encrypt(
  key: Uint8Array,
  iv: Uint8Array,
  plaintext: Uint8Array,
  mode: SM4Mode
): Uint8Array {
  switch (mode) {
    case 'ECB':
      return encryptECB(key, plaintext);
    case 'CBC':
      return encryptCBC(key, iv, plaintext);
    case 'CTR':
      return encryptCTR(key, iv, plaintext);
    default:
      throw new Error(`不支持的 SM4 工作模式: ${mode}`);
  }
}

/**
 * SM4 通用解密函数
 *
 * @param key 密钥
 * @param iv 初始向量
 * @param ciphertext 密文
 * @param mode 工作模式
 * @returns 明文
 */
export function decrypt(
  key: Uint8Array,
  iv: Uint8Array,
  ciphertext: Uint8Array,
  mode: SM4Mode
): Uint8Array {
  // TODO: 实现各种模式的解密
  throw new Error('SM4 解密功能待实现');
}
