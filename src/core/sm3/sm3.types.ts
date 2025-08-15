/**
 * SM3 算法类型定义
 *
 * @description SM3 相关的 TypeScript 类型定义
 */

/**
 * SM3 哈希状态
 */
export interface SM3HashState {
  /** 8 个 32 位状态字 */
  state: Uint32Array;
  /** 缓冲区 */
  buffer: Uint8Array;
  /** 缓冲区长度 */
  bufferLength: number;
  /** 总长度 */
  totalLength: number;
}

/**
 * SM3 选项
 */
export interface SM3Options {
  /** 输出格式 */
  format?: 'hex' | 'binary' | 'base64';
}
