import { describe, it, expect } from 'vitest';
import gm from '@/index.js';

describe('sm-crypto integration', () => {
  it('should generate keys using sm-crypto backend', () => {
    const { privateKey, publicKey } = gm.getKey();
    
    // 验证私钥格式：64位十六进制
    expect(privateKey).toMatch(/^[0-9a-f]{64}$/i);
    expect(privateKey.length).toBe(64);
    
    // 验证公钥格式：04开头 + 128位十六进制坐标
    expect(publicKey).toMatch(/^04[0-9a-f]{128}$/i);
    expect(publicKey.length).toBe(130);
    expect(publicKey.startsWith('04')).toBe(true);
  });

  it('should generate different keys on each call', () => {
    const key1 = gm.getKey();
    const key2 = gm.getKey();
    
    expect(key1.privateKey).not.toBe(key2.privateKey);
    expect(key1.publicKey).not.toBe(key2.publicKey);
  });

  it('should maintain API compatibility with examples', () => {
    // 验证示例代码期望的返回结构
    const result = gm.getKey();
    expect(result).toHaveProperty('privateKey');
    expect(result).toHaveProperty('publicKey');
    expect(typeof result.privateKey).toBe('string');
    expect(typeof result.publicKey).toBe('string');
  });

  it('should work with sm2Encrypt/sm2Decrypt using sm-crypto keys', () => {
    const { privateKey, publicKey } = gm.getKey();
    const message = 'test message for sm-crypto integration';
    
    const encrypted = gm.sm2Encrypt(publicKey, message);
    const decrypted = gm.sm2Decrypt(privateKey, encrypted);
    
    expect(decrypted).toBe(message);
    expect(typeof encrypted).toBe('string');
    expect(encrypted.length).toBeGreaterThan(0);
  });
});
