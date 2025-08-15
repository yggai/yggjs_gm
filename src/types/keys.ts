/**
 * 密钥相关类型定义
 *
 * @description 密钥管理相关的类型定义
 */

/**
 * 密钥类型
 */
export type KeyType = 'private' | 'public' | 'secret';

/**
 * 密钥用途
 */
export type KeyUsage = 'sign' | 'verify' | 'encrypt' | 'decrypt';

/**
 * 基础密钥接口
 */
export interface BaseKey {
  algorithm: string;
  type: KeyType;
  usages: KeyUsage[];
}
