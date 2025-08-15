/**
 * 适配器类型定义
 *
 * @description 平台适配器相关的 TypeScript 类型定义
 */

/**
 * 运行时类型
 */
export type RuntimeType = 'node' | 'browser' | 'deno' | 'bun' | 'react-native' | 'unknown';

/**
 * 运行时能力
 */
export interface RuntimeCapabilities {
  /** 加密 API 类型 */
  crypto: 'node' | 'webcrypto' | 'polyfill';
  /** 是否支持 BigInt */
  bigint: boolean;
  /** 是否支持 WebAssembly */
  wasm: boolean;
  /** 是否支持 Web Workers */
  worker: boolean;
  /** 是否支持 Streams */
  streams: boolean;
  /** 是否支持 SharedArrayBuffer */
  sharedArrayBuffer: boolean;
}

/**
 * 平台适配器接口
 */
export interface PlatformAdapter {
  /** 适配器名称 */
  name: string;
  /** 是否支持当前环境 */
  isSupported(): boolean;
  /** 初始化适配器 */
  init(): void;
  /** 获取随机字节 */
  getRandomBytes(length: number): Uint8Array;
}
