/**
 * Node.js 基础使用示例
 * 
 * @description 演示在 Node.js 环境中使用国密算法库
 */

// TODO: 实现 Node.js 示例
console.log('Node.js 示例待实现');

// 示例代码结构:
// const { gm } = require('yggjs-gm');
// 
// async function example() {
//   // SM3 摘要
//   const data = new TextEncoder().encode('Hello, World!');
//   const hash = await gm.sm3.digest(data);
//   console.log('SM3 摘要:', hash);
//   
//   // SM2 签名
//   const keyPair = await gm.sm2.generateKeyPair();
//   const signature = await gm.sm2.sign(keyPair.privateKey, data);
//   const isValid = await gm.sm2.verify(keyPair.publicKey, data, signature);
//   console.log('SM2 签名验证:', isValid);
//   
//   // SM4 加密
//   const key = gm.random.bytes(16);
//   const iv = gm.random.bytes(16);
//   const ciphertext = await gm.sm4.encrypt(key, iv, data, { mode: 'CBC', padding: 'PKCS7' });
//   const plaintext = await gm.sm4.decrypt(key, iv, ciphertext, { mode: 'CBC', padding: 'PKCS7' });
//   console.log('SM4 加解密成功:', new TextDecoder().decode(plaintext) === 'Hello, World!');
// }
// 
// example().catch(console.error);
