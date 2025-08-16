/**
 * 国密算法 TypeScript 库主入口
 *
 * @description 提供 SM2/SM3/SM4 国密算法的现代化 TypeScript 实现
 * @version 0.1.0
 * @author YggJS Team
 * @license Apache-2.0
 */

// 导出核心算法 (命名空间导出避免冲突)
export * as core from './core/index.js';

// 导出 API 层
export * from './api/index.js';

// 导出类型定义
export * from './types/index.js';

// 导出常量
export * from './constants/index.js';

// 导出工具函数 (命名空间导出避免冲突)
export * as utils from './utils/index.js';

// 默认导出统一 API
export { gm as default } from './api/index.js';

// 兼容示例中的 print 调用（不推荐在应用中依赖此全局）
try {
  if (typeof globalThis !== 'undefined' && !(globalThis as any).print) {
    (globalThis as any).print = (...args: any[]) => console.log(...args);
  }
} catch {}

// 版本信息
export const VERSION = '0.1.0';

// 库信息
export const LIB_INFO = {
  name: 'yggjs-gm',
  version: VERSION,
  description: '国密算法 TypeScript 库',
  algorithms: ['SM2', 'SM3', 'SM4'],
  author: 'YggJS Team',
  license: 'Apache-2.0',
} as const;
