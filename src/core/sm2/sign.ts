/**
 * SM2 数字签名
 *
 * @description 实现 SM2 数字签名算法
 */

import type { SM2PrivateKey, SM2SignatureOptions } from './sm2.types.js';

/**
 * SM2 数字签名
 *
 * @param privateKey 私钥
 * @param data 待签名数据
 * @param options 签名选项
 * @returns 签名结果
 */
export function sign(
  privateKey: SM2PrivateKey,
  data: Uint8Array,
  options?: SM2SignatureOptions
): Uint8Array {
  // TODO: 实现 SM2 数字签名
  throw new Error('SM2 数字签名功能待实现');
}
