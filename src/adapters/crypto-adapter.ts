/**
 * 加密 API 适配器
 *
 * @description 统一不同平台的加密 API 接口
 */

/**
 * 统一的随机数生成接口
 *
 * @param length 字节长度
 * @returns 随机字节数组
 */
export function getRandomBytes(length: number): Uint8Array {
  // TODO: 实现统一随机数生成
  throw new Error('统一随机数生成功能待实现');
}

/**
 * 统一的哈希计算接口
 *
 * @param algorithm 哈希算法
 * @param data 输入数据
 * @returns 哈希值
 */
export function computeHash(algorithm: string, data: Uint8Array): Promise<Uint8Array> {
  // TODO: 实现统一哈希计算
  throw new Error('统一哈希计算功能待实现');
}
