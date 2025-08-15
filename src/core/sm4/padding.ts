/**
 * SM4 填充算法
 *
 * @description 实现各种填充算法
 */

import type { SM4Padding } from './sm4.types.js';

/**
 * PKCS#7 填充
 *
 * @param data 原始数据
 * @param blockSize 块大小
 * @returns 填充后的数据
 */
export function pkcs7Pad(data: Uint8Array, blockSize: number = 16): Uint8Array {
  // TODO: 实现 PKCS#7 填充
  throw new Error('PKCS#7 填充功能待实现');
}

/**
 * PKCS#7 去填充
 *
 * @param data 填充后的数据
 * @returns 原始数据
 */
export function pkcs7Unpad(data: Uint8Array): Uint8Array {
  // TODO: 实现 PKCS#7 去填充
  throw new Error('PKCS#7 去填充功能待实现');
}

/**
 * 零填充
 *
 * @param data 原始数据
 * @param blockSize 块大小
 * @returns 填充后的数据
 */
export function zeroPad(data: Uint8Array, blockSize: number = 16): Uint8Array {
  // TODO: 实现零填充
  throw new Error('零填充功能待实现');
}

/**
 * 通用填充函数
 *
 * @param data 原始数据
 * @param padding 填充类型
 * @param blockSize 块大小
 * @returns 填充后的数据
 */
export function pad(data: Uint8Array, padding: SM4Padding, blockSize: number = 16): Uint8Array {
  switch (padding) {
    case 'PKCS7':
      return pkcs7Pad(data, blockSize);
    case 'Zero':
      return zeroPad(data, blockSize);
    case 'None':
      return data;
    default:
      throw new Error(`不支持的填充类型: ${padding}`);
  }
}

/**
 * 通用去填充函数
 *
 * @param data 填充后的数据
 * @param padding 填充类型
 * @returns 原始数据
 */
export function unpad(data: Uint8Array, padding: SM4Padding): Uint8Array {
  switch (padding) {
    case 'PKCS7':
      return pkcs7Unpad(data);
    case 'Zero':
    case 'None':
      return data;
    default:
      throw new Error(`不支持的填充类型: ${padding}`);
  }
}
