/**
 * 错误处理工具
 *
 * @description 提供统一的错误处理机制
 */

/**
 * 国密算法错误类
 */
export class GmError extends Error {
  constructor(
    public code: string,
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'GmError';
  }
}

/**
 * 错误码常量
 */
export const ErrorCodes = {
  INVALID_KEY: 'INVALID_KEY',
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',
  INVALID_CIPHERTEXT: 'INVALID_CIPHERTEXT',
  UNSUPPORTED_ALGORITHM: 'UNSUPPORTED_ALGORITHM',
  RUNTIME_NOT_SUPPORTED: 'RUNTIME_NOT_SUPPORTED',
} as const;
