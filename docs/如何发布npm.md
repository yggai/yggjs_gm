npm adduser --registry=https://registry.npmjs.org/
npm whoami --registry=https://registry.npmjs.org/

pnpm version patch/minor/major

npm publish --registry=https://registry.npmjs.org/

npm config set registry https://registry.npmjs.org/

## 安装临时使用国内源

npm install <package> --registry=https://registry.npmmirror.com

## 安装验证

```bash
pnpm add -D yggjs-gm@latest
```

执行示例：

```bash
node examples/c01_get_key.js
node examples/c02_sm2_encrypt.js
node examples/c03_sm2_decrypt.js
```
