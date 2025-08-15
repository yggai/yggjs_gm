/**
 * 内存管理工具
 *
 * @description 提供安全的内存管理功能
 */

/**
 * 安全清零字节数组
 */
export function secureZero(data: Uint8Array): void {
  // TODO: 实现安全内存清零
  data.fill(0);
}
