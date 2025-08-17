/**
 * 国密算法 TypeScript 库主入口
 *
 * @description 提供 SM2/SM3/SM4 国密算法的现代化 TypeScript 实现
 * @version 0.1.0
 * @author YggJS Team
 * @license Apache-2.0
 */

import { sm2 } from 'sm-crypto';

/**
 * 生成密钥对
 */
const getKey = () => {
  const keypair = sm2.generateKeyPairHex();
  const privateKey = keypair.privateKey; // 64字符私钥
  const publicKey = keypair.publicKey; // 04开头公钥
  return {
    privateKey,
    publicKey,
  };
};

/**
 * 使用sm2算法加密
 * @param publicKey
 * @param text
 * @returns
 */
const sm2Encrypt = (publicKey: string, text: string) => {
  return sm2.doEncrypt(text, publicKey, 0);
};

export default {
  getKey,
  sm2Encrypt,
};
