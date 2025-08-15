# 构建指南

## 构建系统概述

yggjs-gm 使用双构建系统来满足不同的需求：

- **tsup**: 快速开发构建，支持热重载
- **Rollup**: 生产构建，体积优化和高级功能

## 构建命令

### 开发构建

```bash
# 开发构建 (tsup)
pnpm build

# 监听模式
pnpm dev

# 清理构建产物
pnpm clean
```

### 生产构建

```bash
# 生产构建 (tsup)
pnpm build:prod

# 生产构建 (Rollup)
pnpm build:rollup:prod

# 完整构建 (两种方式)
pnpm build:all

# 构建体积分析
pnpm build:rollup:analyze
```

## 构建产物

### 文件结构

```
dist/
├── index.js              # ESM 主入口
├── index.cjs             # CJS 主入口
├── index.d.ts            # 类型声明
├── browser.esm.js        # 浏览器 ESM
├── browser.umd.js        # 浏览器 UMD
├── node.esm.js           # Node.js ESM
├── node.cjs.js           # Node.js CJS
├── adapters/             # 适配器模块
│   ├── browser.js
│   ├── browser.d.ts
│   ├── node.js
│   ├── node.cjs
│   └── node.d.ts
├── core/                 # 核心算法模块
│   ├── sm2/
│   ├── sm3/
│   ├── sm4/
│   └── math/
└── api/                  # API 模块
    ├── sm2.js
    ├── sm3.js
    ├── sm4.js
    ├── key.js
    └── random.js
```

### 格式支持

| 格式 | 用途 | 文件 |
|------|------|------|
| **ESM** | 现代模块系统 | `*.js` |
| **CJS** | Node.js 兼容 | `*.cjs` |
| **UMD** | 浏览器全局使用 | `*.umd.js` |
| **TypeScript** | 类型声明 | `*.d.ts` |

## 导入方式

### 完整导入

```typescript
// ESM
import { gm } from 'yggjs-gm';

// CJS
const { gm } = require('yggjs-gm');

// 浏览器 UMD
<script src="https://unpkg.com/yggjs-gm/dist/browser.umd.js"></script>
<script>
  const { gm } = window.YggGM;
</script>
```

### 按需导入

```typescript
// 核心算法
import { digest } from 'yggjs-gm/core/sm3';
import { generateKeyPair } from 'yggjs-gm/core/sm2';
import { encrypt } from 'yggjs-gm/core/sm4';

// API 层
import { digest } from 'yggjs-gm/api/sm3';
import { sign, verify } from 'yggjs-gm/api/sm2';

// 平台特定
import { gm } from 'yggjs-gm/browser';
import { gm } from 'yggjs-gm/node';
```

## 构建优化

### Tree-shaking

项目支持 Tree-shaking，未使用的代码会被自动移除：

```typescript
// 只会打包 SM3 相关代码
import { digest } from 'yggjs-gm/api/sm3';
```

### 代码分割

Rollup 构建支持代码分割，共享代码会被提取到单独的 chunk：

```typescript
// 共享的数学库会被单独打包
import { modPow } from 'yggjs-gm/core/math';
```

### 体积优化

| 构建方式 | 主包大小 | 压缩后 | Gzip |
|----------|----------|--------|------|
| **开发** | ~200KB | ~80KB | ~25KB |
| **生产** | ~150KB | ~60KB | ~20KB |
| **按需** | ~50KB | ~20KB | ~8KB |

## 构建配置

### tsup 配置

```typescript
// tsup.config.ts
export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: true,
    treeshake: true,
    minify: isProduction,
    target: ['es2020', 'node16'],
    platform: 'neutral',
  }
]);
```

### Rollup 配置

```javascript
// rollup.config.js
export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.esm.js', format: 'esm' },
      { file: 'dist/index.cjs.js', format: 'cjs' }
    ],
    plugins: [typescript(), terser()],
    external: ['big-integer']
  }
]);
```

## 构建验证

### 自动验证

```bash
# 验证构建产物
node scripts/verify-build.js
```

验证项目包括：

- ✅ 文件存在性检查
- ✅ 导出配置验证
- ✅ 类型声明检查
- ✅ Source Maps 验证
- ✅ Tree-shaking 支持

### 手动测试

```bash
# 测试 ESM 导入
node -e "import('./dist/index.js').then(m => console.log(Object.keys(m)))"

# 测试 CJS 导入
node -e "console.log(Object.keys(require('./dist/index.cjs')))"

# 测试按需导入
node -e "import('./dist/api/sm3.js').then(m => console.log(Object.keys(m)))"
```

## 性能监控

### 构建时间

```bash
# 开发构建 (~2s)
time pnpm build

# 生产构建 (~10s)
time pnpm build:rollup:prod
```

### 体积分析

```bash
# 详细体积分析
pnpm build:rollup:analyze

# 简单体积检查
pnpm size-check
```

## 故障排除

### 常见问题

**问题**: 构建失败 "Cannot resolve module"
```bash
# 检查依赖
pnpm install

# 清理缓存
pnpm clean
rm -rf node_modules/.cache
```

**问题**: 类型声明错误
```bash
# 重新生成类型
pnpm type-check
pnpm build:prod
```

**问题**: 导入路径错误
```bash
# 验证导出配置
node scripts/verify-build.js
```

### 调试构建

```bash
# 详细日志
DEBUG=* pnpm build:rollup:prod

# 分析依赖
pnpm build:rollup:analyze
```

## 发布准备

### 发布前检查

```bash
# 完整检查流程
pnpm type-check
pnpm lint
pnpm test
pnpm build:all
node scripts/verify-build.js
```

### 版本管理

```bash
# 更新版本
pnpm version patch  # 或 minor, major

# 发布到 npm
pnpm publish
```

## 持续集成

### GitHub Actions

```yaml
- name: Build
  run: |
    pnpm build:all
    node scripts/verify-build.js

- name: Size Check
  run: pnpm size-check
```

### 构建缓存

```yaml
- name: Cache dist
  uses: actions/cache@v3
  with:
    path: dist
    key: build-${{ hashFiles('src/**/*') }}
```
