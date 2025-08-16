/**
 * SM2 密钥对生成
 *
 * @description 实现 SM2 密钥对的生成、导入、导出功能
 */

import { randomBigintRange } from '../math/random.js';
import { SM2_CURVE, getBasePoint, isPointOnCurve, pointMultiply } from './curve.js';
import type { SM2KeyPair, SM2PrivateKey, SM2PublicKey } from './sm2.types.js';

/**
 * 生成 SM2 密钥对
 *
 * @returns SM2 密钥对
 */
export function generateKeyPair(): SM2KeyPair {
  const { n } = SM2_CURVE;
  const basePoint = getBasePoint();

  // 生成私钥 d，范围为 [1, n-1]
  const d = randomBigintRange(1n, n);

  // 计算公钥点 Q = d * G
  const publicKeyPoint = pointMultiply(d, basePoint);

  // 验证公钥点是否在曲线上
  if (!isPointOnCurve(publicKeyPoint)) {
    throw new Error('生成的公钥点不在椭圆曲线上');
  }

  const privateKey: SM2PrivateKey = {
    algorithm: 'SM2',
    d,
  };

  const publicKey: SM2PublicKey = {
    algorithm: 'SM2',
    point: publicKeyPoint,
  };

  // 将公钥引用添加到私钥中
  privateKey.publicKey = publicKey;

  return {
    privateKey,
    publicKey,
  };
}

/**
 * 从私钥导出公钥
 *
 * @param privateKey 私钥
 * @returns 公钥
 */
export function derivePublicKey(privateKey: SM2PrivateKey): SM2PublicKey {
  const basePoint = getBasePoint();

  // 计算公钥点 Q = d * G
  const publicKeyPoint = pointMultiply(privateKey.d, basePoint);

  // 验证公钥点是否在曲线上
  if (!isPointOnCurve(publicKeyPoint)) {
    throw new Error('导出的公钥点不在椭圆曲线上');
  }

  return {
    algorithm: 'SM2',
    point: publicKeyPoint,
  };
}

/**
 * 验证密钥对是否匹配
 *
 * @param keyPair 密钥对
 * @returns 是否匹配
 */
export function validateKeyPair(keyPair: SM2KeyPair): boolean {
  try {
    // 验证私钥是否在有效范围内
    const { n } = SM2_CURVE;
    if (keyPair.privateKey.d <= 0n || keyPair.privateKey.d >= n) {
      return false;
    }

    // 验证公钥点是否在曲线上
    if (!isPointOnCurve(keyPair.publicKey.point)) {
      return false;
    }

    // 验证公钥是否能从私钥正确导出
    const derivedPublicKey = derivePublicKey(keyPair.privateKey);
    return (
      derivedPublicKey.point.x === keyPair.publicKey.point.x &&
      derivedPublicKey.point.y === keyPair.publicKey.point.y
    );
  } catch (error) {
    return false;
  }
}
