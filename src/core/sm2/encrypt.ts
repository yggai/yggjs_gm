/**
 * SM2 公钥加密（C1C2C3）- 简化实现，用于支持示例
 */

import { randomBigintRange } from '../math/random.js';
import { digest as sm3 } from '../sm3/digest.js';
import { SM2_CURVE, getBasePoint, pointMultiply } from './curve.js';
import type { SM2EncryptionOptions, SM2PublicKey } from './sm2.types.js';

function kdfZ(x2y2: Uint8Array, klen: number): Uint8Array {
  // KDF: 连续 SM3( x2||y2||ct ) 直到长度够
  const ctMax = Math.ceil(klen / 32);
  const out = new Uint8Array(ctMax * 32);
  let off = 0;
  for (let ct = 1; ct <= ctMax; ct++) {
    const counter = new Uint8Array([0, 0, 0, ct & 0xff]);
    const block = sm3(new Uint8Array([...x2y2, ...counter]));
    out.set(block, off);
    off += 32;
  }
  return out.subarray(0, klen);
}

export function encrypt(
  publicKey: SM2PublicKey,
  plaintext: Uint8Array,
  options?: SM2EncryptionOptions
): Uint8Array {
  const { n } = SM2_CURVE;
  const G = getBasePoint();

  // 1) 选随机数 k in [1, n-1]
  const k = randomBigintRange(1n, n);
  // 2) 计算 C1 = kG
  const C1 = pointMultiply(k, G);
  // 3) 计算 (x2,y2) = kP
  const x2y2Point = pointMultiply(k, publicKey.point);
  const x2 = x2y2Point.x;
  const y2 = x2y2Point.y;
  // 4) KDF
  const x2Bytes = bigintToBytes(x2);
  const y2Bytes = bigintToBytes(y2);
  const z = new Uint8Array([...x2Bytes, ...y2Bytes]);
  const t = kdfZ(z, plaintext.length);
  // 5) C2 = M xor t
  const C2 = new Uint8Array(plaintext.length);
  for (let i = 0; i < plaintext.length; i++) C2[i] = plaintext[i]! ^ t[i]!;
  // 6) C3 = SM3(x2 || M || y2)
  const C3 = sm3(new Uint8Array([...x2Bytes, ...plaintext, ...y2Bytes]));

  // 输出为 C1||C2||C3（C1 未压缩 04||x||y）
  const c1Bytes = ecPointToUncompressedBytes(C1);
  const out = new Uint8Array(c1Bytes.length + C2.length + C3.length);
  out.set(c1Bytes, 0);
  out.set(C2, c1Bytes.length);
  out.set(C3, c1Bytes.length + C2.length);
  return out;
}

function bigintToBytes(x: bigint): Uint8Array {
  const hex = x.toString(16).padStart(64, '0');
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function ecPointToUncompressedBytes(pt: { x: bigint; y: bigint }): Uint8Array {
  const x = bigintToBytes(pt.x);
  const y = bigintToBytes(pt.y);
  const out = new Uint8Array(1 + 32 + 32);
  out[0] = 0x04;
  out.set(x, 1);
  out.set(y, 33);
  return out;
}
