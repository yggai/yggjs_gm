# 使用指南

> 🚧 此文档正在建设中，内容将随着开发进度逐步完善。

## 安装

```bash
npm install yggjs-gm
# 或
yarn add yggjs-gm
# 或
pnpm add yggjs-gm
```

## 基础使用

### 在 Node.js 中使用

```javascript
const { gm } = require('yggjs-gm');
// 或 ES 模块
import { gm } from 'yggjs-gm';

async function example() {
  // 使用 SM3 计算摘要
  const data = Buffer.from('Hello, World!', 'utf8');
  const hash = await gm.sm3.digest(data);
  console.log('SM3 摘要:', Buffer.from(hash).toString('hex'));
}
```

### 在浏览器中使用

```html
<script type="module">
  import { gm } from 'https://unpkg.com/yggjs-gm/dist/browser/index.js';
  
  async function example() {
    const data = new TextEncoder().encode('Hello, World!');
    const hash = await gm.sm3.digest(data);
    console.log('SM3 摘要:', Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join(''));
  }
  
  example();
</script>
```

### 在 TypeScript 中使用

```typescript
import { gm, type SM2KeyPair } from 'yggjs-gm';

async function example(): Promise<void> {
  // 生成 SM2 密钥对
  const keyPair: SM2KeyPair = await gm.sm2.generateKeyPair();
  
  // 数字签名
  const data = new Uint8Array([1, 2, 3, 4, 5]);
  const signature = await gm.sm2.sign(keyPair.privateKey, data);
  const isValid = await gm.sm2.verify(keyPair.publicKey, data, signature);
  
  console.log('签名验证结果:', isValid);
}
```

## 算法详解

### SM2 椭圆曲线算法

SM2 是基于椭圆曲线的公钥密码算法，支持数字签名和公钥加密。

#### 数字签名

```typescript
// 生成密钥对
const keyPair = await gm.sm2.generateKeyPair();

// 签名
const message = new TextEncoder().encode('重要消息');
const signature = await gm.sm2.sign(keyPair.privateKey, message, {
  userId: new TextEncoder().encode('user@example.com') // 可选用户ID
});

// 验证
const isValid = await gm.sm2.verify(keyPair.publicKey, message, signature, {
  userId: new TextEncoder().encode('user@example.com')
});
```

#### 公钥加密

```typescript
// 加密
const plaintext = new TextEncoder().encode('机密信息');
const ciphertext = await gm.sm2.encrypt(keyPair.publicKey, plaintext);

// 解密
const decrypted = await gm.sm2.decrypt(keyPair.privateKey, ciphertext);
const message = new TextDecoder().decode(decrypted);
```

### SM3 哈希算法

SM3 是密码杂凑算法，输出 256 位摘要。

#### 基础摘要

```typescript
const data = new TextEncoder().encode('待哈希的数据');
const hash = await gm.sm3.digest(data);
```

#### HMAC-SM3

```typescript
const key = gm.random.bytes(32);
const data = new TextEncoder().encode('待认证的数据');
const mac = await gm.sm3.hmac(key, data);
```

#### 流式哈希

```typescript
const hasher = gm.sm3.createHash();
hasher.update(new TextEncoder().encode('第一部分数据'));
hasher.update(new TextEncoder().encode('第二部分数据'));
const hash = hasher.digest();
```

### SM4 对称加密

SM4 是分组密码算法，支持多种工作模式。

#### 基础加密

```typescript
const key = gm.random.bytes(16); // 128 位密钥
const iv = gm.random.bytes(16);  // 初始向量
const plaintext = new TextEncoder().encode('需要加密的数据');

// 加密
const ciphertext = await gm.sm4.encrypt(key, iv, plaintext, {
  mode: 'CBC',
  padding: 'PKCS7'
});

// 解密
const decrypted = await gm.sm4.decrypt(key, iv, ciphertext, {
  mode: 'CBC',
  padding: 'PKCS7'
});
```

#### 支持的工作模式

- **ECB**: 电子密码本模式（不推荐用于生产环境）
- **CBC**: 密码分组链接模式
- **CTR**: 计数器模式
- **CFB**: 密码反馈模式
- **OFB**: 输出反馈模式

#### 流式加密

```typescript
const cipher = gm.sm4.createCipher(key, iv, { mode: 'CBC', padding: 'PKCS7' });
let encrypted = cipher.update(chunk1);
encrypted = Buffer.concat([encrypted, cipher.update(chunk2)]);
encrypted = Buffer.concat([encrypted, cipher.final()]);
```

## 最佳实践

### 安全建议

1. **密钥管理**: 妥善保管私钥，不要硬编码在代码中
2. **随机数**: 使用库提供的安全随机数生成器
3. **参数验证**: 始终验证输入参数的有效性
4. **错误处理**: 正确处理加密操作中的错误

### 性能优化

1. **批量操作**: 对于大量数据，考虑使用流式 API
2. **密钥复用**: 避免频繁生成密钥对
3. **内存管理**: 及时清理敏感数据

### 跨平台兼容

1. **数据格式**: 使用 Uint8Array 作为统一的数据格式
2. **编码转换**: 注意字符串和字节数组之间的转换
3. **环境检测**: 库会自动适配不同的运行时环境

## 常见问题

### Q: 如何在 React Native 中使用？

A: 库支持 React Native 环境，会自动使用适当的 polyfill。

### Q: 是否支持 Web Workers？

A: 是的，库可以在 Web Workers 中正常工作。

### Q: 如何与其他语言的实现互操作？

A: 库遵循国密标准，与标准实现完全兼容。确保使用相同的参数和编码格式。

### Q: 性能如何？

A: 库针对 JavaScript 环境进行了优化，并计划支持 WebAssembly 后端以提升性能。

## 更多资源

- [API 文档](./API.md)
- [安全指南](./SECURITY.md)
- [示例代码](../examples/)
- [GitHub 仓库](https://github.com/yggdrasil-gm/yggjs-gm)
