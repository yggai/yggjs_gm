/**
 * API 层模块入口
 *
 * @description 提供统一的高级 API 接口
 */
import * as sm2Api from './sm2';
import * as keyApi from './key';

/**
 * 统一的国密算法 API
 */
export const gm = {
  sm2: sm2Api,
  key: keyApi,

  /**
   * 生成 SM2 密钥对 (简化接口)
   *
   * @returns 包含 secretKey 和 publicKey 的对象
   */
  getKey() {
    return keyApi.generateSM2KeyPair();
  },

  // 供示例使用的字符串加解密封装
  sm2Encrypt(publicKeyHex: string, plaintextUtf8: string) {
    return sm2Api.sm2EncryptString(publicKeyHex, plaintextUtf8);
  },
  sm2Decrypt(privateKeyHex: string, ciphertextHex: string) {
    return sm2Api.sm2DecryptString(privateKeyHex, ciphertextHex);
  },
} as const;

export default gm;

