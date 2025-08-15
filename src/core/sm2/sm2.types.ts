/**
 * SM2 算法类型定义
 *
 * @description SM2 相关的 TypeScript 类型定义
 */

import type { ECPoint } from './curve.js';

/**
 * SM2 私钥
 */
export interface SM2PrivateKey {
  algorithm: 'SM2';
  d: bigint;
  publicKey?: SM2PublicKey;
}

/**
 * SM2 公钥
 */
export interface SM2PublicKey {
  algorithm: 'SM2';
  point: ECPoint;
}

/**
 * SM2 密钥对
 */
export interface SM2KeyPair {
  privateKey: SM2PrivateKey;
  publicKey: SM2PublicKey;
}

/**
 * SM2 签名选项
 */
export interface SM2SignatureOptions {
  /** 哈希算法，默认 SM3 */
  hash?: 'SM3';
  /** 签名编码格式，默认 DER */
  encoding?: 'DER' | 'RS';
  /** 用户标识，默认 "1234567812345678" */
  userId?: Uint8Array;
}

/**
 * SM2 加密选项
 */
export interface SM2EncryptionOptions {
  /** 密文格式，默认 C1C2C3 */
  mode?: 'C1C2C3' | 'C1C3C2';
}

/**
 * SM2 签名结果
 */
export interface SM2Signature {
  r: bigint;
  s: bigint;
}

/**
 * SM2 密文结构
 */
export interface SM2Ciphertext {
  c1: ECPoint; // 椭圆曲线点
  c2: Uint8Array; // 密文
  c3: Uint8Array; // 摘要
}
