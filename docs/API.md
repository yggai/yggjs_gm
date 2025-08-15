# API 文档

> 🚧 此文档正在建设中，内容将随着开发进度逐步完善。

## 概述

yggjs-gm 提供了简洁易用的国密算法 API，支持 SM2、SM3、SM4 算法。

## 快速开始

```typescript
import { gm } from 'yggjs-gm';

// SM3 摘要
const data = new TextEncoder().encode('Hello, World!');
const hash = await gm.sm3.digest(data);

// SM2 签名
const keyPair = await gm.sm2.generateKeyPair();
const signature = await gm.sm2.sign(keyPair.privateKey, data);
const isValid = await gm.sm2.verify(keyPair.publicKey, data, signature);

// SM4 加密
const key = gm.random.bytes(16);
const iv = gm.random.bytes(16);
const ciphertext = await gm.sm4.encrypt(key, iv, data, { mode: 'CBC', padding: 'PKCS7' });
```

## API 参考

### SM2 椭圆曲线算法

#### `gm.sm2.generateKeyPair()`

生成 SM2 密钥对。

**返回值**: `Promise<SM2KeyPair>`

#### `gm.sm2.sign(privateKey, data, options?)`

使用私钥对数据进行数字签名。

**参数**:
- `privateKey`: SM2 私钥
- `data`: 待签名数据 (Uint8Array)
- `options`: 签名选项 (可选)

**返回值**: `Promise<Uint8Array>`

#### `gm.sm2.verify(publicKey, data, signature, options?)`

使用公钥验证数字签名。

**参数**:
- `publicKey`: SM2 公钥
- `data`: 原始数据 (Uint8Array)
- `signature`: 签名数据 (Uint8Array)
- `options`: 验证选项 (可选)

**返回值**: `Promise<boolean>`

### SM3 哈希算法

#### `gm.sm3.digest(data)`

计算数据的 SM3 摘要。

**参数**:
- `data`: 输入数据 (Uint8Array)

**返回值**: `Promise<Uint8Array>` - 256 位摘要

#### `gm.sm3.hmac(key, data)`

计算基于 SM3 的 HMAC。

**参数**:
- `key`: HMAC 密钥 (Uint8Array)
- `data`: 输入数据 (Uint8Array)

**返回值**: `Promise<Uint8Array>`

### SM4 对称加密

#### `gm.sm4.encrypt(key, iv, data, options)`

使用 SM4 算法加密数据。

**参数**:
- `key`: 128 位密钥 (Uint8Array)
- `iv`: 初始向量 (Uint8Array)
- `data`: 明文数据 (Uint8Array)
- `options`: 加密选项

**返回值**: `Promise<Uint8Array>`

#### `gm.sm4.decrypt(key, iv, data, options)`

使用 SM4 算法解密数据。

**参数**:
- `key`: 128 位密钥 (Uint8Array)
- `iv`: 初始向量 (Uint8Array)
- `data`: 密文数据 (Uint8Array)
- `options`: 解密选项

**返回值**: `Promise<Uint8Array>`

### 工具函数

#### `gm.random.bytes(length)`

生成安全随机字节。

**参数**:
- `length`: 字节长度 (number)

**返回值**: `Uint8Array`

#### `gm.key.generate(algorithm)`

生成指定算法的密钥。

**参数**:
- `algorithm`: 算法类型 ('SM2' | 'SM4')

**返回值**: `Promise<CryptoKey>`

## 类型定义

详细的 TypeScript 类型定义请参考自动生成的 API 文档。

## 错误处理

所有 API 都会抛出 `GmError` 类型的错误，包含错误码和详细信息。

```typescript
try {
  const result = await gm.sm2.sign(invalidKey, data);
} catch (error) {
  if (error instanceof GmError) {
    console.log('错误码:', error.code);
    console.log('错误信息:', error.message);
  }
}
```

## 浏览器兼容性

- Chrome 63+
- Firefox 57+
- Safari 11.1+
- Edge 79+

## Node.js 兼容性

- Node.js 16.0+
