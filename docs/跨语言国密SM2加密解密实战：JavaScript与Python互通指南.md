# 跨语言国密SM2加密解密实战：JavaScript与Python互通指南

> 关键词：SM2、国密算法、JavaScript、Python、跨语言互通、前后端加密、安全通信

在国产化替代的大背景下，国密SM2算法已成为保障数据安全的核心手段之一。实际开发中，前端JavaScript与后端Python的SM2加解密互通需求尤为普遍：前端加密敏感数据，后端解密处理；或后端加密下发数据，前端解密使用。本文将通过实战代码，手把手教你如何实现JavaScript与Python之间的SM2加密解密互通。

## 一、技术选型：选对工具，事半功倍

| 语言 | 推荐库 | 特点 | 安装方式 |
|---|---|---|---|
| **JavaScript** | [sm-crypto](https://www.npmjs.com/package/sm-crypto) 或 [sm-crypto-v2](https://www.npmjs.com/package/sm-crypto-v2) | 纯JS实现，支持浏览器、Node.js，API简洁 | `npm install sm-crypto` |
| **Python** | [gmssl-python](https://github.com/duanhongyi/gmssl) | 官方推荐，支持SM2/SM3/SM4，接口友好 | `pip install gmssl` |

> 提示：sm-crypto-v2是sm-crypto的升级版，性能提升4倍，支持TypeScript，推荐使用。

## 二、密钥对生成与格式统一：互通的基石

SM2密钥对由私钥（32字节十六进制字符串）和公钥（130字节未压缩十六进制字符串，04开头）组成。两端必须使用同一套密钥对，且格式必须一致。

### JavaScript端（以sm-crypto为例）
```javascript
const sm2 = require('sm-crypto').sm2;

// 生成密钥对
const keypair = sm2.generateKeyPairHex();
const publicKey = keypair.publicKey; // 130位十六进制字符串
const privateKey = keypair.privateKey; // 64位十六进制字符串

console.log("公钥:", publicKey);
console.log("私钥:", privateKey);
```

### Python端（以gmssl为例）
```python
from gmssl import sm2, func

# 使用JS端生成的密钥对
public_key = '04B9C9A6E04E9C91F7BA880429273747D7EF5DDEB0BB2FF6317EB00BEF331A83081A6994B8993F3F5D6EADDDB81872266C87C018FB4162F5AF347B483E24620207'  # JS端公钥
private_key = '00B9AB0B828FF68872F21A837FC303668428DEA11DCD1B24429D0C99E24EED83D5'  # JS端私钥
```

## 三、加密解密流程：前后端协同作战

### 3.1 前端JavaScript加密 → 后端Python解密

#### ① JavaScript端加密
```javascript
const sm2 = require('sm-crypto').sm2;

const publicKey = '04B9C9A6E04E9C91F7BA880429273747D7EF5DDEB0BB2FF6317EB00BEF331A83081A6994B8993F3F5D6EADDDB81872266C87C018FB4162F5AF347B483E24620207';
const message = 'Hello, Python!';

// 加密，模式1：C1C3C2（国密标准）
const encrypted = sm2.doEncrypt(message, publicKey, 1);
console.log("加密结果（十六进制）:", encrypted);
```

#### ② Python端解密
```python
from gmssl import sm2

private_key = '00B9AB0B828FF68872F21A837FC303668428DEA11DCD1B24429D0C99E24EED83D5'
public_key = '04B9C9A6E04E9C91F7BA880429273747D7EF5DDEB0BB2FF6317EB00BEF331A83081A6994B8993F3F5D6EADDDB81872266C87C018FB4162F5AF347B483E24620207'

sm2_crypt = sm2.SM2Crypt(public_key=public_key.encode(), private_key=private_key.encode())

# 解密JS端加密的数据
encrypted_hex = '04...'  # JS端加密结果
decrypted = sm2_crypt.decrypt(bytes.fromhex(encrypted_hex))
print("解密结果:", decrypted.decode('utf-8'))
```

### 3.2 后端Python加密 → 前端JavaScript解密

#### ① Python端加密
```python
from gmssl import sm2

public_key = '04B9C9A6E04E9C91F7BA880429273747D7EF5DDEB0BB2FF6317EB00BEF331A83081A6994B8993F3F5D6EADDDB81872266C87C018FB4162F5AF347B483E24620207'
sm2_crypt = sm2.SM2Crypt(public_key=public_key.encode())

message = 'Hello, JavaScript!'
encrypted = sm2_crypt.encrypt(message.encode())
print("加密结果（十六进制）:", encrypted.hex())
```

#### ② JavaScript端解密
```javascript
const sm2 = require('sm-crypto').sm2;

const privateKey = '00B9AB0B828FF68872F21A837FC303668428DEA11DCD1B24429D0C99E24EED83D5';
const encryptedHex = '04...';  // Python端加密结果

const decrypted = sm2.doDecrypt(encryptedHex, privateKey, 1);
console.log("解密结果:", decrypted);
```

## 四、实战中的“坑”与解决方案

| 常见问题 | 原因 | 解决方案 |
|---|---|---|
| **解密失败** | 加密模式不一致 | 统一使用`C1C3C2`（模式1） |
| **公钥格式错误** | 使用了压缩公钥 | 统一使用130位未压缩公钥（04开头） |
| **编码混乱** | 十六进制与Base64混用 | 统一使用十六进制字符串传输 |
| **密钥长度不足** | 私钥未补零 | 确保私钥为64位十六进制字符串（不足前面补0） |

## 五、完整示例：Node.js与Flask API互通

### 5.1 Node.js（前端）加密
```javascript
const express = require('express');
const sm2 = require('sm-crypto').sm2;
const app = express();

app.get('/encrypt', (req, res) => {
    const publicKey = '04...';  // 后端公钥
    const message = req.query.message || 'default';
    const encrypted = sm2.doEncrypt(message, publicKey, 1);
    res.json({ encrypted });
});

app.listen(3000);
```

### 5.2 Python（后端）解密API
```python
from flask import Flask, request, jsonify
from gmssl import sm2

app = Flask(__name__)

@app.route('/decrypt', methods=['POST'])
def decrypt():
    encrypted_hex = request.json.get('encrypted')
    private_key = '00...'  # 后端私钥
    sm2_crypt = sm2.SM2Crypt(private_key=private_key.encode())
    decrypted = sm2_crypt.decrypt(bytes.fromhex(encrypted_hex))
    return jsonify({'decrypted': decrypted.decode('utf-8')})

app.run(port=5000)
```

## 六、总结与展望

通过本文的实战演练，我们成功实现了JavaScript与Python的SM2加密解密互通。关键点在于：
- **密钥格式统一**：确保两端使用同一套密钥对，且格式一致。
- **加密模式统一**：推荐使用国密标准的`C1C3C2`模式。
- **编码一致**：建议统一使用十六进制字符串传输密文。

未来，随着国密算法的普及和生态完善，SM2将在更多场景中替代国际算法，成为数据安全的中坚力量。开发者应积极拥抱国密，为国产化替代贡献力量。

> **参考文献**：
> sm-crypto官方文档
> gmssl-python官方仓库
> CSDN博客《SM2加解密（JS与Java互通）》 
