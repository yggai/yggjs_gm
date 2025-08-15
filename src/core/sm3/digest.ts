/**
 * SM3 摘要算法
 *
 * @description 实现 SM3 密码杂凑算法
 */

/**
 * SM3 摘要计算
 *
 * @param data 输入数据
 * @returns 256 位摘要
 */
export function digest(data: Uint8Array): Uint8Array {
  // TODO: 实现 SM3 摘要算法
  throw new Error('SM3 摘要算法功能待实现');
}

/**
 * SM3 摘要计算 (支持多个数据块)
 *
 * @param dataBlocks 数据块数组
 * @returns 256 位摘要
 */
export function digestMultiple(dataBlocks: Uint8Array[]): Uint8Array {
  // TODO: 实现多块数据的 SM3 摘要
  throw new Error('SM3 多块摘要算法功能待实现');
}
