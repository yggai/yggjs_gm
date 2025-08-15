/**
 * 数据格式常量
 *
 * @description 数据格式相关的常量定义
 */

/**
 * 支持的密钥格式
 */
export const KEY_FORMATS = {
  JWK: 'jwk',
  PEM: 'pem',
  DER: 'der',
  PKCS8: 'pkcs8',
  SPKI: 'spki',
} as const;

/**
 * 支持的数据编码格式
 */
export const DATA_ENCODINGS = {
  HEX: 'hex',
  BASE64: 'base64',
  BASE64URL: 'base64url',
  BINARY: 'binary',
} as const;
