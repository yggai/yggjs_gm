import gggm from 'yggjs-gm';

const { privateKey, publicKey } = gggm.getKey();
console.log('私钥：', privateKey);
console.log('公钥：', publicKey);
