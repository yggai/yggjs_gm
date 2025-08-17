import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const sm2 = require('sm-crypto').sm2;

describe('sm-crypto encrypt/decrypt integration', () => {
  it('should encrypt and decrypt text roundtrip', () => {
    const { privateKey, publicKey } = sm2.generateKeyPairHex();
    const text = '集成测试-加解密';
    const cipher = sm2.doEncrypt(text, publicKey, 0);
    const plain = sm2.doDecrypt(cipher, privateKey, 0);

    expect(plain).toBe(text);
    expect(typeof cipher).toBe('string');
    expect(cipher.length).toBeGreaterThan(0);
  });
});

