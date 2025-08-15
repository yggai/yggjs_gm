/**
 * SM2 椭圆曲线参数
 *
 * @description SM2 推荐椭圆曲线参数定义
 */

/**
 * SM2 推荐椭圆曲线参数 (sm2p256v1)
 */
export const SM2_CURVE = {
  // 有限域的模数
  p: 0xfffffffeffffffffffffffffffffffffffffffff00000000ffffffffffffffffn,

  // 椭圆曲线参数 a
  a: 0xfffffffeffffffffffffffffffffffffffffffff00000000fffffffffffffffcn,

  // 椭圆曲线参数 b
  b: 0x28e9fa9e9d9f5e344d5a9e4bcf6509a7f39789f515ab8f92dddcbdeen,

  // 基点的阶
  n: 0xfffffffeffffffffffffffffffffffff7203df6b21c6052b53bbf40939d54123n,

  // 基点 G 的 x 坐标
  gx: 0x32c4ae2c1f1981195f9904466a39c9948fe30bbff2660be1715a4589334c74c7n,

  // 基点 G 的 y 坐标
  gy: 0xbc3736a2f4f6779c59bdcee36b692153d0a9877cc62a474002df32e52139f0a0n,

  // 余因子
  h: 1n,
} as const;

/**
 * 椭圆曲线点结构
 */
export interface ECPoint {
  x: bigint;
  y: bigint;
}

/**
 * 无穷远点
 */
export const POINT_AT_INFINITY: ECPoint = {
  x: 0n,
  y: 0n,
};

// TODO: 实现椭圆曲线点运算
console.warn('SM2 椭圆曲线运算功能待实现');
