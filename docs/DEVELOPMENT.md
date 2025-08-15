# 开发指南

## 开发环境设置

### 1. 前置要求

- **Node.js**: >= 16.0.0
- **pnpm**: >= 8.0.0
- **VS Code**: 推荐使用最新版本

### 2. 项目设置

```bash
# 克隆项目
git clone https://github.com/yggdrasil-gm/yggjs-gm.git
cd yggjs-gm

# 安装依赖
pnpm install

# 初始化 Git hooks
pnpm prepare
```

### 3. VS Code 配置

项目已配置了推荐的 VS Code 扩展和设置：

- 打开项目时会自动提示安装推荐扩展
- 保存时自动格式化代码
- 自动修复 ESLint 错误
- 集成调试配置

## 开发工作流

### 1. 代码规范

项目使用以下工具确保代码质量：

- **ESLint**: 代码检查和规范
- **Prettier**: 代码格式化
- **TypeScript**: 类型检查
- **Husky**: Git hooks 自动化

### 2. 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能开发
git commit -m "feat: add SM2 signature algorithm"
git commit -m "feat(sm3): implement HMAC-SM3"

# 问题修复
git commit -m "fix: resolve memory leak in SM4 encryption"
git commit -m "fix(build): update tsup configuration"

# 文档更新
git commit -m "docs: update API documentation"

# 测试相关
git commit -m "test: add unit tests for SM2 keypair generation"

# 其他类型
git commit -m "chore: update dependencies"
git commit -m "style: format code with prettier"
git commit -m "refactor: optimize SM3 hash performance"
```

### 3. 分支策略

- `main`: 主分支，保持稳定
- `develop`: 开发分支
- `feature/*`: 功能分支
- `fix/*`: 修复分支
- `release/*`: 发布分支

### 4. 开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/sm2-implementation

# 2. 开发和测试
pnpm dev          # 开发模式构建
pnpm test         # 运行测试
pnpm test:coverage # 测试覆盖率

# 3. 代码检查
pnpm lint         # 检查代码规范
pnpm lint:fix     # 自动修复问题
pnpm type-check   # 类型检查

# 4. 提交代码 (会自动运行 pre-commit hooks)
git add .
git commit -m "feat: implement SM2 digital signature"

# 5. 推送代码 (会自动运行 pre-push hooks)
git push origin feature/sm2-implementation
```

## 测试指南

### 1. 测试结构

```text
tests/
├── unit/           # 单元测试
├── integration/    # 集成测试
├── e2e/           # 端到端测试
├── cross-lang/    # 跨语言兼容性测试
├── fixtures/      # 测试数据
└── utils/         # 测试工具
```

### 2. 测试命令

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test --watch

# 测试覆盖率
pnpm test:coverage

# 测试 UI
pnpm test:ui

# E2E 测试
pnpm test:e2e
```

### 3. 编写测试

```typescript
// tests/unit/core/sm3/digest.test.ts
import { describe, it, expect } from 'vitest';
import { digest } from '@/core/sm3/digest.js';

describe('SM3 摘要算法', () => {
  it('应该计算正确的摘要', async () => {
    const data = new TextEncoder().encode('abc');
    const hash = await digest(data);

    expect(hash).toHaveLength(32);
    expect(
      Array.from(hash)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    ).toBe('66c7f0f462eeedd9d1f2d46bdc10e4e24167c4875cf2f7a2297da02b8f4ba8e0');
  });
});
```

## 构建和发布

### 1. 构建命令

```bash
# 开发构建
pnpm build

# 生产构建
pnpm build:prod

# 监听模式
pnpm dev
```

### 2. 发布流程

```bash
# 1. 确保所有测试通过
pnpm test

# 2. 构建项目
pnpm build:prod

# 3. 版本管理 (自动生成 CHANGELOG)
pnpm version patch  # 或 minor, major

# 4. 发布到 npm
pnpm publish
```

## 调试指南

### 1. VS Code 调试

项目配置了多个调试配置：

- **Debug Node.js Tests**: 调试测试
- **Debug Current Test File**: 调试当前测试文件
- **Debug Build Script**: 调试构建脚本

### 2. 日志调试

```typescript
// 使用结构化日志
console.log('SM2 签名参数:', { privateKey: '***', data: data.length });

// 开发环境调试
if (process.env.NODE_ENV === 'development') {
  console.debug('调试信息:', debugData);
}
```

## 性能优化

### 1. 性能测试

```bash
# 运行性能基准测试
pnpm benchmark

# 分析构建产物
pnpm build --analyze
```

### 2. 优化建议

- 使用 `Uint8Array` 而非 `Array`
- 避免不必要的内存拷贝
- 实现对象池减少 GC 压力
- 使用 Web Workers 进行并行计算

## 故障排除

### 1. 常见问题

**问题**: `pnpm install` 失败

```bash
# 清理缓存
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**问题**: TypeScript 类型错误

```bash
# 重新生成类型
pnpm type-check
```

**问题**: ESLint 错误

```bash
# 自动修复
pnpm lint:fix
```

### 2. 获取帮助

- 查看 [Issues](https://github.com/yggdrasil-gm/yggjs-gm/issues)
- 阅读 [API 文档](./API.md)
- 参考 [示例代码](../examples/)

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 编写代码和测试
4. 确保所有检查通过
5. 提交 Pull Request

详细贡献指南请参考 [CONTRIBUTING.md](./CONTRIBUTING.md)。
