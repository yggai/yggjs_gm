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
  b: 0x28e9fa9e9d9f5e344d5a9e4bcf6509a7f39789f515ab8f92ddbcbd414d940e93n,

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

/**
 * 模逆运算 (使用扩展欧几里得算法)
 *
 * @param a 被求逆数
 * @param m 模数
 * @returns a 在模 m 下的逆元
 */
function modInverse(a: bigint, m: bigint): bigint {
  if (a < 0n) a = ((a % m) + m) % m;

  let [old_r, r] = [a, m];
  let [old_s, s] = [1n, 0n];

  while (r !== 0n) {
    const quotient = old_r / r;
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
  }

  if (old_r > 1n) {
    throw new Error('模逆不存在');
  }

  return old_s < 0n ? old_s + m : old_s;
}

/**
 * 判断点是否为无穷远点
 *
 * @param point 椭圆曲线点
 * @returns 是否为无穷远点
 */
export function isPointAtInfinity(point: ECPoint): boolean {
  return point.x === 0n && point.y === 0n;
}

/**
 * 椭圆曲线点加法
 *
 * @param p1 点1
 * @param p2 点2
 * @returns 点1 + 点2
 */
export function pointAdd(p1: ECPoint, p2: ECPoint): ECPoint {
  // 处理无穷远点
  if (isPointAtInfinity(p1)) return p2;
  if (isPointAtInfinity(p2)) return p1;

  const { p, a } = SM2_CURVE;

  // 如果两点 x 坐标相同
  if (p1.x === p2.x) {
    // 如果 y 坐标也相同，进行点倍乘
    if (p1.y === p2.y) {
      return pointDouble(p1);
    }
    // 如果 y 坐标不同，结果为无穷远点
    return POINT_AT_INFINITY;
  }

  // 计算斜率 λ = (y2 - y1) / (x2 - x1)
  const deltaY = (((p2.y - p1.y) % p) + p) % p;
  const deltaX = (((p2.x - p1.x) % p) + p) % p;
  const lambda = (deltaY * modInverse(deltaX, p)) % p;

  // 计算结果点坐标
  const x3 = (((lambda * lambda - p1.x - p2.x) % p) + p) % p;
  const y3 = (((lambda * (p1.x - x3) - p1.y) % p) + p) % p;

  return { x: x3, y: y3 };
}

/**
 * 椭圆曲线点倍乘
 *
 * @param point 椭圆曲线点
 * @returns 2 * point
 */
export function pointDouble(point: ECPoint): ECPoint {
  if (isPointAtInfinity(point)) return POINT_AT_INFINITY;

  const { p, a } = SM2_CURVE;

  // 计算斜率 λ = (3x² + a) / (2y)
  const numerator = (((3n * point.x * point.x + a) % p) + p) % p;
  const denominator = (((2n * point.y) % p) + p) % p;
  const lambda = (numerator * modInverse(denominator, p)) % p;

  // 计算结果点坐标
  const x3 = (((lambda * lambda - 2n * point.x) % p) + p) % p;
  const y3 = (((lambda * (point.x - x3) - point.y) % p) + p) % p;

  return { x: x3, y: y3 };
}

/**
 * 椭圆曲线标量乘法 (使用二进制方法)
 *
 * @param k 标量
 * @param point 椭圆曲线点
 * @returns k * point
 */
export function pointMultiply(k: bigint, point: ECPoint): ECPoint {
  if (k === 0n || isPointAtInfinity(point)) {
    return POINT_AT_INFINITY;
  }

  if (k === 1n) {
    return point;
  }

  if (k < 0n) {
    throw new Error('标量必须为非负数');
  }

  // 使用二进制方法进行标量乘法
  let result = POINT_AT_INFINITY;
  let addend = point;
  let scalar = k;

  while (scalar > 0n) {
    if (scalar & 1n) {
      result = pointAdd(result, addend);
    }
    addend = pointDouble(addend);
    scalar >>= 1n;
  }

  return result;
}

/**
 * 验证点是否在椭圆曲线上
 *
 * @param point 椭圆曲线点
 * @returns 是否在曲线上
 */
export function isPointOnCurve(point: ECPoint): boolean {
  if (isPointAtInfinity(point)) {
    return true;
  }

  const { p, a, b } = SM2_CURVE;
  const { x, y } = point;

  // 验证 y² ≡ x³ + ax + b (mod p)
  // 确保所有计算都在正确的模运算下进行
  const leftSide = (((y * y) % p) + p) % p;
  const x3 = (((x * x * x) % p) + p) % p;
  const ax = (((a * x) % p) + p) % p;
  const rightSide = (((x3 + ax + b) % p) + p) % p;

  return leftSide === rightSide;
}

/**
 * 获取 SM2 基点 G
 *
 * @returns SM2 基点
 */
export function getBasePoint(): ECPoint {
  return {
    x: SM2_CURVE.gx,
    y: SM2_CURVE.gy,
  };
}
