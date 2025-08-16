/**
 * API 层模块入口
 *
 * @description 提供统一的高级 API 接口
 */

// 导出各算法 API (命名空间导出避免冲突)
export * from './api.types.js';
export * as encoding from './encoding.js';
export * as key from './key.js';
export * as random from './random.js';
export * as sm2 from './sm2.js';
export * as sm3 from './sm3.js';
export * as sm4 from './sm4.js';

// 统一 API 对象
import * as keyApi from './key.js';
import * as randomApi from './random.js';
import * as sm2Api from './sm2.js';
import * as sm3Api from './sm3.js';
import * as sm4Api from './sm4.js';

/**
 * 统一的国密算法 API
 */
export const gm = {
  sm2: sm2Api,
  sm3: sm3Api,
  sm4: sm4Api,
  key: keyApi,
  random: randomApi,

  /**
   * 生成 SM2 密钥对 (简化接口)
   *
   * @returns 包含 secretKey 和 publicKey 的对象
   */
  getKey(): { secretKey: string; privateKey: string; publicKey: string } {
    return keyApi.generateSM2KeyPair();
  },

  // 供示例使用的字符串加解密封装
  sm2Encrypt(publicKeyHex: string, plaintextUtf8: string): string {
    return sm2Api.sm2EncryptString(publicKeyHex, plaintextUtf8);
  },
  sm2Decrypt(privateKeyHex: string, ciphertextHex: string): string {
    return sm2Api.sm2DecryptString(privateKeyHex, ciphertextHex);
  },
} as const;

export default gm;

// TODO: 实现 API 层
console.warn('API 层模块待实现');
