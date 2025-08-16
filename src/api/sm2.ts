/**
 * SM2 高级 API
 *
 * @description 提供易用的 SM2 算法接口
 */

import { decrypt as sm2DecryptCore } from '../core/sm2/decrypt.js';
import { encrypt as sm2EncryptCore } from '../core/sm2/encrypt.js';
import type {
  SM2EncryptionOptions,
  SM2KeyPair,
  SM2PrivateKey,
  SM2PublicKey,
  SM2SignatureOptions,
} from '../core/sm2/sm2.types.js';
import { bytesToHex, bytesToUtf8, hexToBytes, utf8ToBytes } from './encoding.js';

/**
 * 生成 SM2 密钥对（占位，暂未使用此高阶接口）
 */
export async function generateKeyPair(): Promise<SM2KeyPair> {
  throw new Error('SM2 密钥对生成 API 待实现');
}

/**
 * SM2 数字签名（占位）
 */
export async function sign(
  privateKey: any,
  data: Uint8Array,
  options?: SM2SignatureOptions
): Promise<Uint8Array> {
  throw new Error('SM2 签名 API 待实现');
}

/**
 * SM2 签名验证（占位）
 */
export async function verify(
  publicKey: any,
  data: Uint8Array,
  signature: Uint8Array,
  options?: SM2SignatureOptions
): Promise<boolean> {
  throw new Error('SM2 验证 API 待实现');
}

/**
 * SM2 公钥加密（字节级）
 */
export async function encrypt(
  publicKey: SM2PublicKey,
  plaintext: Uint8Array,
  options?: SM2EncryptionOptions
): Promise<Uint8Array> {
  return sm2EncryptCore(publicKey, plaintext, options);
}

/**
 * SM2 私钥解密（字节级）
 */
export async function decrypt(
  privateKey: SM2PrivateKey,
  ciphertext: Uint8Array,
  options?: SM2EncryptionOptions
): Promise<Uint8Array> {
  return sm2DecryptCore(privateKey, ciphertext, options);
}

/**
 * 供示例使用的字符串友好接口：
 * - publicKeyHex: 04||X||Y（十六进制未压缩公钥）
 * - privateKeyHex: 64 位十六进制私钥
 * - 明文为 UTF-8 字符串
 * - 密文返回为十六进制字符串（C1C2C3）
 */
export function sm2EncryptString(publicKeyHex: string, plaintextUtf8: string): string {
  const pub = parsePublicKey(publicKeyHex);
  const pt = utf8ToBytes(plaintextUtf8);
  const ctBytes = sm2EncryptCore(pub, pt);
  return bytesToHex(ctBytes);
}

export function sm2DecryptString(privateKeyHex: string, ciphertextHex: string): string {
  const pri = parsePrivateKey(privateKeyHex);
  const ct = hexToBytes(ciphertextHex);
  const ptBytes = sm2DecryptCore(pri, ct);
  return bytesToUtf8(ptBytes);
}

function parsePublicKey(hex: string): SM2PublicKey {
  let h = hex.trim();
  if (h.startsWith('0x') || h.startsWith('0X')) h = h.slice(2);
  if (h.startsWith('04')) h = h.slice(2);
  if (h.length !== 128) throw new Error('无效的公钥长度');
  const x = BigInt('0x' + h.slice(0, 64));
  const y = BigInt('0x' + h.slice(64));
  return { algorithm: 'SM2', point: { x, y } };
}

function parsePrivateKey(hex: string): SM2PrivateKey {
  let h = hex.trim();
  if (h.startsWith('0x') || h.startsWith('0X')) h = h.slice(2);
  if (h.length !== 64) throw new Error('无效的私钥长度');
  const d = BigInt('0x' + h);
  return { algorithm: 'SM2', d };
}
