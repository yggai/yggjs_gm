import gm from '../dist/index.js';

const { secretKey, publicKey } = gm.getKey();
console.log('私钥：', secretKey);
console.log('公钥：', publicKey);
