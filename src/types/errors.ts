/**
 * 错误类型定义
 *
 * @description 错误处理相关的类型定义
 */

/**
 * 错误码类型
 */
export type ErrorCode =
  | 'INVALID_KEY'
  | 'INVALID_SIGNATURE'
  | 'INVALID_CIPHERTEXT'
  | 'UNSUPPORTED_ALGORITHM'
  | 'RUNTIME_NOT_SUPPORTED';

/**
 * 错误上下文
 */
export interface ErrorContext {
  algorithm?: string;
  operation?: string;
  [key: string]: any;
}
