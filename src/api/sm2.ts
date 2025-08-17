import { sm2 } from 'sm-crypto';

/**
 * SM2 高级 API（精简版）
 * - 直接使用 sm-crypto 作为底层
 * - 字符串级 API 满足 examples 所需
 */

/**
 * 字符串加密
 * - 输入：publicKeyHex（04 + X + Y，130 hex），plaintextUtf8（UTF-8 字符串）
 * - 输出：密文十六进制（C1C3C2）
 */
export function sm2EncryptString(publicKeyHex: string, plaintextUtf8: string): string {
  // 使用 sm-crypto 按 C1C3C2 输出（1 表示 C1C3C2）
  return sm2.doEncrypt(plaintextUtf8, publicKeyHex, 1);
}

/**
 * 字符串解密
 * - 输入：privateKeyHex（64 hex），ciphertextHex（C1C3C2 或 C1C2C3）
 * - 输出：UTF-8 明文
 */
export function sm2DecryptString(privateKeyHex: string, ciphertextHex: string): string {
  // 优先尝试 C1C3C2，失败时尝试将 C1C2C3 转换为 C1C3C2
  try {
    return sm2.doDecrypt(ciphertextHex, privateKeyHex, 1);
  } catch {
    const fixed = reorderHex_C1C2C3_to_C1C3C2(ciphertextHex);
    return sm2.doDecrypt(fixed, privateKeyHex, 1);
  }
}

function reorderHex_C1C2C3_to_C1C3C2(hex: string): string {
  let h = hex.trim().toLowerCase();
  if (h.startsWith('0x')) h = h.slice(2);
  if (h.length < 2 + 64 + 64) return h; // 长度不够
  if (!h.startsWith('04')) return h; // 非未压缩点
  const c1 = h.slice(0, 130); // 1 + 64 + 64 = 130 hex
  const c3 = h.slice(-64);
  const c2 = h.slice(130, -64);
  return c1 + c3 + c2;
}

