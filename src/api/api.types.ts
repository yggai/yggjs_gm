/**
 * API 层类型定义
 *
 * @description API 相关的 TypeScript 类型定义
 */

/**
 * 密钥算法类型
 */
export type KeyAlgorithm = 'SM2' | 'SM4';

/**
 * 密钥格式
 */
export type KeyFormat = 'jwk' | 'pem' | 'der' | 'pkcs8' | 'spki';

/**
 * 数据编码格式
 */
export type DataFormat = 'hex' | 'base64' | 'base64url' | 'binary';

/**
 * 通用选项接口
 */
export interface CommonOptions {
  /** 输入数据格式 */
  inputFormat?: DataFormat;
  /** 输出数据格式 */
  outputFormat?: DataFormat;
}
