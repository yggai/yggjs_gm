/**
 * 平台适配器模块入口
 *
 * @description 导出所有平台适配器
 */

// 导出适配器功能
export * from './runtime-detector.js';
export * from './node.js';
export * from './browser.js';
export * from './deno.js';
export * from './bun.js';
export * from './react-native.js';
export * from './crypto-adapter.js';
export * from './buffer-adapter.js';
export * from './adapters.types.js';

// TODO: 实现平台适配器
console.warn('平台适配器模块待实现');
