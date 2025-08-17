/**
 * SM2 加密解密单元测试
 */

import { beforeEach, describe, expect, it } from 'vitest';
import gggm from '../src/index.js';

describe('SM2 加密解密测试', () => {
  let keyPair: { privateKey: string; publicKey: string };

  beforeEach(() => {
    // 每个测试前生成新的密钥对
    keyPair = gggm.getKey();
  });

  describe('密钥生成', () => {
    it('应该生成有效的密钥对', () => {
      expect(keyPair).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey).toBeDefined();

      // 私钥应该是64位十六进制字符串
      expect(keyPair.privateKey).toMatch(/^[0-9a-fA-F]{64}$/);

      // 公钥应该是130位十六进制字符串（04开头）
      expect(keyPair.publicKey).toMatch(/^04[0-9a-fA-F]{128}$/);
    });

    it('每次生成的密钥对应该不同', () => {
      const keyPair1 = gggm.getKey();
      const keyPair2 = gggm.getKey();

      expect(keyPair1.privateKey).not.toBe(keyPair2.privateKey);
      expect(keyPair1.publicKey).not.toBe(keyPair2.publicKey);
    });
  });

  describe('SM2 加密', () => {
    it('应该能够加密简单字符串', () => {
      const plaintext = 'hello world';
      const ciphertext = gggm.sm2Encrypt(keyPair.publicKey, plaintext);

      expect(ciphertext).toBeDefined();
      expect(typeof ciphertext).toBe('string');
      expect(ciphertext.length).toBeGreaterThan(0);
      expect(ciphertext).not.toBe(plaintext);
    });

    it('应该能够加密中文字符串', () => {
      const plaintext = '你好世界';
      const ciphertext = gggm.sm2Encrypt(keyPair.publicKey, plaintext);

      expect(ciphertext).toBeDefined();
      expect(typeof ciphertext).toBe('string');
      expect(ciphertext.length).toBeGreaterThan(0);
      expect(ciphertext).not.toBe(plaintext);
    });

    it('应该能够加密长字符串', () => {
      const plaintext = 'zhangdapeng520'.repeat(100); // 长字符串
      const ciphertext = gggm.sm2Encrypt(keyPair.publicKey, plaintext);

      expect(ciphertext).toBeDefined();
      expect(typeof ciphertext).toBe('string');
      expect(ciphertext.length).toBeGreaterThan(0);
      expect(ciphertext).not.toBe(plaintext);
    });

    it('应该能够加密空字符串', () => {
      const plaintext = '';
      const ciphertext = gggm.sm2Encrypt(keyPair.publicKey, plaintext);

      expect(ciphertext).toBeDefined();
      expect(typeof ciphertext).toBe('string');
    });

    it('相同明文每次加密结果应该不同（随机性）', () => {
      const plaintext = 'test message';
      const ciphertext1 = gggm.sm2Encrypt(keyPair.publicKey, plaintext);
      const ciphertext2 = gggm.sm2Encrypt(keyPair.publicKey, plaintext);

      expect(ciphertext1).not.toBe(ciphertext2);
    });

    it('使用无效公钥应该抛出错误', () => {
      const invalidPublicKey = 'invalid_key';
      const plaintext = 'test';

      expect(() => {
        gggm.sm2Encrypt(invalidPublicKey, plaintext);
      }).toThrow();
    });
  });

  describe('SM2 解密 (TDD)', () => {
    it('应该能够解密加密后的简单字符串', () => {
      const plaintext = 'hello world';
      const ciphertext = gggm.sm2Encrypt(keyPair.publicKey, plaintext);

      const decrypted = gggm.sm2Decrypt(keyPair.privateKey, ciphertext);
      expect(decrypted).toBe(plaintext);
    });

    it('应该能够解密加密后的中文字符串', () => {
      const plaintext = '你好世界';
      const ciphertext = gggm.sm2Encrypt(keyPair.publicKey, plaintext);

      const decrypted = gggm.sm2Decrypt(keyPair.privateKey, ciphertext);
      expect(decrypted).toBe(plaintext);
    });

    it('应该能够解密加密后的长字符串', () => {
      const plaintext = 'zhangdapeng520'.repeat(50);
      const ciphertext = gggm.sm2Encrypt(keyPair.publicKey, plaintext);

      const decrypted = gggm.sm2Decrypt(keyPair.privateKey, ciphertext);
      expect(decrypted).toBe(plaintext);
    });

    it('应该能够解密加密后的空字符串', () => {
      const plaintext = '';
      const ciphertext = gggm.sm2Encrypt(keyPair.publicKey, plaintext);

      const decrypted = gggm.sm2Decrypt(keyPair.privateKey, ciphertext);
      expect(decrypted).toBe(plaintext);
    });

    it('使用错误的私钥解密应该返回空字符串', () => {
      const plaintext = 'test message';
      const ciphertext = gggm.sm2Encrypt(keyPair.publicKey, plaintext);
      const wrongKeyPair = gggm.getKey();

      const decrypted = gggm.sm2Decrypt(wrongKeyPair.privateKey, ciphertext);
      expect(decrypted).toBe(''); // sm-crypto 在解密失败时返回空字符串
    });

    it('使用无效私钥应该返回空字符串', () => {
      const invalidPrivateKey = 'invalid_key';
      const ciphertext = 'some_ciphertext';

      const decrypted = gggm.sm2Decrypt(invalidPrivateKey, ciphertext);
      expect(decrypted).toBe('');
    });

    it('使用无效密文应该返回空字符串', () => {
      const invalidCiphertext = 'invalid_ciphertext';

      const decrypted = gggm.sm2Decrypt(keyPair.privateKey, invalidCiphertext);
      expect(decrypted).toBe('');
    });
  });

  describe('加密解密完整流程', () => {
    it('应该能够完成完整的加密解密流程', () => {
      const testCases = [
        'hello world',
        '你好世界',
        'zhangdapeng520',
        '123456789',
        'special chars: !@#$%^&*()',
        '',
        'a'.repeat(1000), // 长字符串
      ];

      testCases.forEach((plaintext) => {
        const ciphertext = gggm.sm2Encrypt(keyPair.publicKey, plaintext);
        const decrypted = gggm.sm2Decrypt(keyPair.privateKey, ciphertext);
        expect(decrypted).toBe(plaintext);
      });
    });
  });
});
