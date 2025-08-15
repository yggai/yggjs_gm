# 安全指南

> 🚧 此文档正在建设中，内容将随着开发进度逐步完善。

## 概述

本文档提供使用 yggjs-gm 国密算法库的安全最佳实践和注意事项。

## 密钥管理

### 私钥保护

1. **永远不要硬编码私钥**
   ```typescript
   // ❌ 错误做法
   const privateKey = 'hardcoded-private-key';
   
   // ✅ 正确做法
   const privateKey = process.env.PRIVATE_KEY || await loadFromSecureStorage();
   ```

2. **使用安全的存储方式**
   - 服务器端：使用环境变量、密钥管理服务 (KMS)
   - 浏览器端：避免在本地存储中保存私钥
   - 移动端：使用系统密钥链或安全存储

3. **密钥轮换**
   - 定期更换密钥
   - 建立密钥版本管理机制

### 密钥生成

```typescript
// 使用库提供的安全随机数生成器
const keyPair = await gm.sm2.generateKeyPair();

// 对于 SM4，使用安全随机密钥
const sm4Key = gm.random.bytes(16);
```

## 算法使用安全

### SM2 数字签名

1. **用户 ID 的使用**
   ```typescript
   // 建议为每个用户使用唯一的 ID
   const userId = new TextEncoder().encode(user.email);
   const signature = await gm.sm2.sign(privateKey, data, { userId });
   ```

2. **签名验证**
   ```typescript
   // 始终验证签名
   const isValid = await gm.sm2.verify(publicKey, data, signature, { userId });
   if (!isValid) {
     throw new Error('签名验证失败');
   }
   ```

### SM2 公钥加密

1. **数据大小限制**
   - SM2 加密适用于小数据量
   - 大数据建议使用混合加密（SM2 + SM4）

2. **混合加密示例**
   ```typescript
   // 生成随机 SM4 密钥
   const sm4Key = gm.random.bytes(16);
   const iv = gm.random.bytes(16);
   
   // 使用 SM4 加密数据
   const encryptedData = await gm.sm4.encrypt(sm4Key, iv, largeData, {
     mode: 'CBC',
     padding: 'PKCS7'
   });
   
   // 使用 SM2 加密 SM4 密钥
   const encryptedKey = await gm.sm2.encrypt(publicKey, sm4Key);
   ```

### SM3 哈希算法

1. **盐值使用**
   ```typescript
   // 为密码哈希添加盐值
   const salt = gm.random.bytes(16);
   const passwordWithSalt = new Uint8Array([...salt, ...passwordBytes]);
   const hash = await gm.sm3.digest(passwordWithSalt);
   ```

2. **HMAC 密钥**
   ```typescript
   // 使用足够长的 HMAC 密钥
   const hmacKey = gm.random.bytes(32); // 256 位
   const mac = await gm.sm3.hmac(hmacKey, data);
   ```

### SM4 对称加密

1. **工作模式选择**
   ```typescript
   // ❌ 避免使用 ECB 模式
   // ECB 模式不安全，相同明文产生相同密文
   
   // ✅ 推荐使用 CBC 或 CTR 模式
   const ciphertext = await gm.sm4.encrypt(key, iv, data, {
     mode: 'CBC', // 或 'CTR'
     padding: 'PKCS7'
   });
   ```

2. **初始向量 (IV)**
   ```typescript
   // 每次加密使用不同的随机 IV
   const iv = gm.random.bytes(16);
   
   // IV 可以公开，但必须是随机的
   const result = {
     iv: iv,
     ciphertext: await gm.sm4.encrypt(key, iv, data, options)
   };
   ```

## 随机数安全

### 使用安全随机数

```typescript
// ✅ 使用库提供的安全随机数
const randomBytes = gm.random.bytes(32);
const randomBigint = gm.random.bigint(256);

// ❌ 不要使用 Math.random()
// Math.random() 不是密码学安全的
```

### 随机数质量

- 库会自动选择最佳的随机数源
- Node.js: 使用 `crypto.randomBytes`
- 浏览器: 使用 `crypto.getRandomValues`

## 内存安全

### 敏感数据清理

```typescript
// 使用完敏感数据后及时清理
const sensitiveData = new Uint8Array(32);
// ... 使用数据
sensitiveData.fill(0); // 清零
```

### 避免数据泄露

1. **不要在日志中输出敏感信息**
2. **避免在错误消息中包含密钥**
3. **注意调试工具中的数据暴露**

## 网络传输安全

### HTTPS 传输

```typescript
// 确保在 HTTPS 环境下传输加密数据
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  console.warn('建议在 HTTPS 环境下使用加密功能');
}
```

### 数据编码

```typescript
// 网络传输时使用适当的编码
const signature = await gm.sm2.sign(privateKey, data);
const base64Signature = btoa(String.fromCharCode(...signature));
```

## 错误处理安全

### 避免信息泄露

```typescript
try {
  const result = await gm.sm2.decrypt(privateKey, ciphertext);
} catch (error) {
  // ❌ 不要直接暴露错误详情
  // throw error;
  
  // ✅ 记录详细错误，返回通用错误
  console.error('解密失败:', error);
  throw new Error('解密操作失败');
}
```

## 合规性考虑

### 标准符合性

- 本库实现遵循 GM/T 标准
- 建议在生产环境中进行合规性测试
- 关键应用建议使用经过认证的密码模块

### 审计和监控

1. **记录关键操作**
   ```typescript
   // 记录密钥生成、签名等关键操作
   console.log(`密钥生成: ${new Date().toISOString()}`);
   ```

2. **监控异常行为**
   - 频繁的解密失败
   - 异常的密钥使用模式

## 开发环境安全

### 测试密钥

```typescript
// 开发环境使用固定测试密钥
const isDevelopment = process.env.NODE_ENV === 'development';
const keyPair = isDevelopment 
  ? loadTestKeyPair() 
  : await gm.sm2.generateKeyPair();
```

### 代码审查

1. **密钥管理审查**
2. **随机数使用审查**
3. **错误处理审查**
4. **数据清理审查**

## 安全更新

### 保持更新

```bash
# 定期检查和更新依赖
npm audit
npm update yggjs-gm
```

### 漏洞报告

如发现安全漏洞，请通过以下方式报告：
- 邮箱: security@yggdrasil-gm.org
- GitHub Security Advisory

## 参考资源

- [国密算法标准文档](http://www.gmbz.org.cn/)
- [密码学最佳实践](https://cryptography.io/en/latest/faq/)
- [OWASP 密码学指南](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
