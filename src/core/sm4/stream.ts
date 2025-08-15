/**
 * SM4 流式加解密
 *
 * @description 支持流式输入的 SM4 加解密实现
 */

import type { SM4Options } from './sm4.types.js';

/**
 * SM4 流式加密器
 */
export class SM4Cipher {
  private readonly key: Uint8Array;
  private readonly iv: Uint8Array;
  private readonly options: SM4Options;

  constructor(key: Uint8Array, iv: Uint8Array, options: SM4Options) {
    this.key = key;
    this.iv = iv;
    this.options = options;
  }

  /**
   * 更新加密数据
   *
   * @param data 输入数据
   * @returns 加密结果
   */
  update(data: Uint8Array): Uint8Array {
    // TODO: 实现流式加密更新
    throw new Error('SM4 流式加密更新功能待实现');
  }

  /**
   * 完成加密
   *
   * @returns 最终加密结果
   */
  final(): Uint8Array {
    // TODO: 实现加密完成
    throw new Error('SM4 加密完成功能待实现');
  }
}

/**
 * SM4 流式解密器
 */
export class SM4Decipher {
  private readonly key: Uint8Array;
  private readonly iv: Uint8Array;
  private readonly options: SM4Options;

  constructor(key: Uint8Array, iv: Uint8Array, options: SM4Options) {
    this.key = key;
    this.iv = iv;
    this.options = options;
  }

  /**
   * 更新解密数据
   *
   * @param data 输入数据
   * @returns 解密结果
   */
  update(data: Uint8Array): Uint8Array {
    // TODO: 实现流式解密更新
    throw new Error('SM4 流式解密更新功能待实现');
  }

  /**
   * 完成解密
   *
   * @returns 最终解密结果
   */
  final(): Uint8Array {
    // TODO: 实现解密完成
    throw new Error('SM4 解密完成功能待实现');
  }
}
