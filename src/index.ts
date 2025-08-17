/**
 * 国密算法 TypeScript 库主入口
 *
 * @description 提供 SM2/SM3/SM4 国密算法的现代化 TypeScript 实现
 * @version 0.1.0
 * @author YggJS Team
 * @license Apache-2.0
 */
import { gm } from './api/index';

export const VERSION = __VERSION__ as string;

export const LIB_INFO = {
  name: 'yggjs-gm',
  version: VERSION,
  description: '国密算法 TypeScript 库',
  algorithms: ['SM2', 'SM3', 'SM4'] as const,
  author: 'YggJS Team',
  license: 'Apache-2.0',
} as const;

export { gm, gm as default };
export * as sm2 from './api/sm2';
export * as key from './api/key';

