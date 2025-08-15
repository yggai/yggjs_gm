/**
 * 数学库类型定义
 *
 * @description 数学运算相关的 TypeScript 类型定义
 */

/**
 * 椭圆曲线参数
 */
export interface EllipticCurve {
  /** 有限域的模数 */
  p: bigint;
  /** 椭圆曲线参数 a */
  a: bigint;
  /** 椭圆曲线参数 b */
  b: bigint;
  /** 基点的阶 */
  n: bigint;
  /** 基点 G 的 x 坐标 */
  gx: bigint;
  /** 基点 G 的 y 坐标 */
  gy: bigint;
  /** 余因子 */
  h: bigint;
}

/**
 * 数值格式
 */
export type NumberFormat = 'hex' | 'binary' | 'base64' | 'decimal';
