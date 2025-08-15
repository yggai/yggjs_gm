/**
 * SM4 算法类型定义
 *
 * @description SM4 相关的 TypeScript 类型定义
 */

/**
 * SM4 工作模式
 */
export type SM4Mode = 'ECB' | 'CBC' | 'CTR' | 'CFB' | 'OFB';

/**
 * SM4 填充方式
 */
export type SM4Padding = 'PKCS7' | 'Zero' | 'None';

/**
 * SM4 选项
 */
export interface SM4Options {
  /** 工作模式 */
  mode: SM4Mode;
  /** 填充方式 */
  padding: SM4Padding;
}

/**
 * SM4 密钥
 */
export interface SM4Key {
  algorithm: 'SM4';
  key: Uint8Array;
}
