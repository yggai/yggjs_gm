import { describe, it, expect } from 'vitest';
import gm from '@/index.js';

describe('gm.sm2Encrypt / gm.sm2Decrypt', () => {
  it('应该能加密并解密回原文（默认 C1C2C3，十六进制密文）', () => {
    const { privateKey, publicKey } = gm.getKey();
    const msg = 'zhangdapeng520';
    const cipher = gm.sm2Encrypt(publicKey, msg);
    const plain = gm.sm2Decrypt(privateKey, cipher);

    expect(plain).toBe(msg);
    expect(typeof cipher).toBe('string');
    expect(cipher.length).toBeGreaterThan(0);
  });
});

