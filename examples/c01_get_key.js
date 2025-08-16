import gggm from 'yggjs-gm';

const { secretKey, publicKey } = gggm.getKey();
console.log('私钥：', secretKey);
console.log('公钥：', publicKey);
