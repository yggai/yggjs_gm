/**
 * SM2 私钥解密（C1C2C3）- 简化实现，用于支持示例
 */

import { digest as sm3 } from '../sm3/digest.js';
import { pointMultiply } from './curve.js';
import type { SM2EncryptionOptions, SM2PrivateKey } from './sm2.types.js';

export function decrypt(
  privateKey: SM2PrivateKey,
  ciphertext: Uint8Array,
  options?: SM2EncryptionOptions
): Uint8Array {
  // 解析 C1||C2||C3
  if (ciphertext.length < 1 + 32 + 32 + 32) throw new Error('密文长度无效');
  if (ciphertext[0] !== 0x04) throw new Error('仅支持未压缩点');
  const x1 = bytesToBigint(ciphertext.subarray(1, 33));
  const y1 = bytesToBigint(ciphertext.subarray(33, 65));
  const C1 = { x: x1, y: y1 };

  const C3 = ciphertext.subarray(ciphertext.length - 32);
  const C2 = ciphertext.subarray(65, ciphertext.length - 32);

  // 计算 (x2,y2) = d * C1
  const x2y2 = pointMultiply(privateKey.d, C1);
  const x2Bytes = bigintToBytes(x2y2.x);
  const y2Bytes = bigintToBytes(x2y2.y);

  // KDF
  const z = new Uint8Array([...x2Bytes, ...y2Bytes]);
  const t = kdfZ(z, C2.length);
  const M = new Uint8Array(C2.length);
  for (let i = 0; i < C2.length; i++) M[i] = C2[i]! ^ t[i]!;

  // 校验 C3
  const u = sm3(new Uint8Array([...x2Bytes, ...M, ...y2Bytes]));
  for (let i = 0; i < 32; i++) if (u[i] !== C3[i]) throw new Error('C3 校验失败');

  return M;
}

function bigintToBytes(x: bigint): Uint8Array {
  const hex = x.toString(16).padStart(64, '0');
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function kdfZ(x2y2: Uint8Array, klen: number): Uint8Array {
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

function bytesToBigint(bytes: Uint8Array): bigint {
  let x = 0n;
  for (let i = 0; i < bytes.length; i++) {
    x = (x << 8n) | BigInt(bytes[i]!);
  }
  return x;
}
