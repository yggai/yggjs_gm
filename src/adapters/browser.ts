/**
 * 浏览器适配器
 *
 * @description 浏览器环境的特定适配实现
 */

/**
 * 浏览器环境初始化
 */
export function initBrowserAdapter(): void {
  // TODO: 实现浏览器适配器初始化
  console.warn('浏览器适配器待实现');
}

/**
 * 获取 Web Crypto API
 */
export function getWebCrypto(): SubtleCrypto | undefined {
  // TODO: 实现 Web Crypto API 获取
  throw new Error('Web Crypto API 获取功能待实现');
}

/**
 * 浏览器随机数生成
 *
 * @param length 字节长度
 * @returns 随机字节
 */
export function browserRandomBytes(length: number): Uint8Array {
  // TODO: 实现浏览器随机数生成
  throw new Error('浏览器随机数生成功能待实现');
}
