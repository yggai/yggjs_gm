import gggm from 'yggjs-gm';

// 生成公钥和私钥
const { privateKey, publicKey } = gggm.getKey();
console.log('私钥：', privateKey);
console.log('公钥：', publicKey);

// 使用公钥进行加密
const originStr = 'zhangdapeng520';
const encryptStr = gggm.sm2Encrypt(publicKey, originStr);
console.log('加密后的字符串：', encryptStr);

// 使用私钥进行解密
const decryptStr = gggm.sm2Decrypt(privateKey, encryptStr);
console.log('解密后的字符串：', decryptStr);
console.log('解密后的字符串：', decryptStr === originStr);
