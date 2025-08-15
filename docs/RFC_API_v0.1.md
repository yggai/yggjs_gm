## RFC: 国密算法库 v0.1 API 规范（草案）

状态：草案（Draft）
版本：v0.1 对齐
范围：SM3 摘要、SM4 CBC/CTR（PKCS7/None）、随机数、对称密钥导入导出、基础工具

### 1. 设计原则
- 强类型：TS strict；公开类型在 d.ts 中稳定暴露
- 数据统一：输入输出均支持 Uint8Array（字符串工具另提供）
- 安全默认：SM4 默认 CBC+PKCS7，IV 必填且长度 16；禁止弱参数
- 易用可扩展：选项对象可扩展；错误结构清晰

### 2. 命名空间
- gm.sm3：摘要相关
- gm.sm4：对称加解密相关
- gm.random：安全随机
- gm.util：编解码与工具
- gm.key：对称密钥导入导出

### 3. 类型定义（示意）

```ts
export type Bytes = Uint8Array | ArrayBuffer | ArrayLike<number>;
export type ByteArray = Uint8Array;

export interface GmError extends Error {
  code: string; // e.g. 'ERR_INVALID_PARAM' | 'ERR_CRYPTO_FAILURE' | 'ERR_UNSUPPORTED'
  cause?: unknown;
}

export type Sm4Mode = 'CBC' | 'CTR';
export type Sm4Padding = 'PKCS7' | 'None';

export interface Sm4EncryptOptions {
  mode?: Sm4Mode; // default 'CBC'
  padding?: Sm4Padding; // default 'PKCS7' when mode='CBC'
}

export interface Sm4DecryptOptions extends Sm4EncryptOptions {}

export interface JwkOctKey {
  kty: 'oct';
  alg?: 'SM4';
  k: string; // base64url
  key_ops?: ('encrypt'|'decrypt')[];
  ext?: boolean;
}
```

### 4. API 规范

#### 4.1 随机数
```ts
declare const random: {
  bytes(length: number): Promise<Uint8Array>;
};
```
- 行为：在 Web 使用 crypto.getRandomValues，在 Node 使用 crypto.randomBytes
- 错误：length <= 0 → ERR_INVALID_PARAM

#### 4.2 工具（可选导出）
```ts
declare const util: {
  toBytes(input: Bytes | string): Uint8Array; // utf-8 for string
  toHex(bytes: Bytes): string; // lowercase
  fromHex(hex: string): Uint8Array;
  toBase64(bytes: Bytes): string;
  fromBase64(s: string): Uint8Array; // 采用标准 Base64
  constTimeEqual(a: Bytes, b: Bytes): boolean;
};
```

#### 4.3 SM3
```ts
declare const sm3: {
  digest(data: Bytes): Promise<Uint8Array>;
  Hasher: new () => { update(chunk: Bytes): this; digest(): Uint8Array; reset(): this };
};
```
- 说明：digest 为便捷异步；Hasher 同步流式（内部可缓存），返回 Uint8Array
- 错误：输入为空合法；异常抛出 GmError

#### 4.4 SM4
```ts
declare const sm4: {
  encrypt(key: Bytes, iv: Bytes, data: Bytes, options?: Sm4EncryptOptions): Promise<Uint8Array>;
  decrypt(key: Bytes, iv: Bytes, data: Bytes, options?: Sm4DecryptOptions): Promise<Uint8Array>;
};
```
- 约束：
  - key 长度必须为 16 字节
  - iv 长度必须为 16 字节（CTR 作为 nonce+counter 起点；禁止全 0 重用）
  - CBC：默认 PKCS7；None 仅在 data 已对齐时允许
- 错误：
  - 长度/模式/填充不合法 → ERR_INVALID_PARAM
  - 解密填充错误或数据不一致 → ERR_DECRYPT_FAIL

#### 4.5 对称密钥导入/导出
```ts
declare const key: {
  importSymmetric(format: 'raw', input: Bytes): Promise<Uint8Array>; // returns key bytes
  importSymmetric(format: 'jwk', input: JwkOctKey): Promise<Uint8Array>;
  exportSymmetric(format: 'raw', keyBytes: Bytes): Promise<Uint8Array>;
  exportSymmetric(format: 'jwk', keyBytes: Bytes, opts?: {key_ops?: ('encrypt'|'decrypt')[]}): Promise<JwkOctKey>;
};
```
- 规则：
  - raw：长度必须 16（SM4）
  - jwk：kty='oct'、k 为 base64url，长度校验

### 5. 错误代码（初稿）
- ERR_INVALID_PARAM：参数不合法（长度、模式、填充、编码）
- ERR_UNSUPPORTED：不支持的运行时或功能
- ERR_CRYPTO_FAILURE：底层运算失败（内部错误）
- ERR_DECRYPT_FAIL：解密失败（填充或完整性）

### 6. 示例（Node）
```ts
import { sm3, sm4, key, random, util } from 'gm';

const data = util.toBytes('hello');
const hash = await sm3.digest(data);

const k = await key.importSymmetric('raw', await random.bytes(16));
const iv = await random.bytes(16);
const ct = await sm4.encrypt(k, iv, data, { mode: 'CBC' });
const pt = await sm4.decrypt(k, iv, ct, { mode: 'CBC' });
```

### 7. 版本与兼容性
- v0.1 API 稳定；向后兼容策略：仅在次版本引入新可选参数，不破坏已有签名
- v0.2 计划：HMAC-SM3、SM4 其他模式（CFB/OFB）、错误体系完善

### 8. 开放问题（Open Questions）
- 是否在 v0.1 即提供同步 API 变体（性能/易用 vs 统一异步）
- CTR 计数器大端/小端计数标准化约定（建议：大端）
- util.toBase64 是否同时支持 URL-safe 变体（建议：增加 toBase64Url）

