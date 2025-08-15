# 测试指南

## 测试框架概述

yggjs-gm 使用多层次的测试策略确保代码质量：

- **Vitest**: 单元测试和集成测试
- **Playwright**: E2E 测试和浏览器兼容性测试
- **跨语言测试**: 与 Python/Go 版本的兼容性验证

## 测试命令

### 基础测试

```bash
# 运行所有单元测试
pnpm test

# 监听模式
pnpm test:watch

# 测试覆盖率
pnpm test:coverage

# 测试 UI 界面
pnpm test:ui
```

### 浏览器环境测试

```bash
# 浏览器环境单元测试
pnpm test:browser

# 浏览器环境覆盖率
pnpm test:browser:coverage
```

### E2E 测试

```bash
# 运行 E2E 测试
pnpm test:e2e

# E2E 测试 UI 模式
pnpm test:e2e:ui

# E2E 调试模式
pnpm test:e2e:debug
```

### 跨语言兼容性测试

```bash
# 跨语言兼容性测试
pnpm test:cross-lang

# 完整测试套件
pnpm test:all
```

## 测试结构

### 目录组织

```text
tests/
├── unit/                   # 单元测试
│   ├── core/              # 核心算法测试
│   │   ├── sm2/           # SM2 算法测试
│   │   ├── sm3/           # SM3 算法测试
│   │   ├── sm4/           # SM4 算法测试
│   │   └── math/          # 数学库测试
│   ├── adapters/          # 适配器测试
│   ├── api/               # API 层测试
│   └── utils/             # 工具函数测试
├── integration/           # 集成测试
│   ├── workflows/         # 完整工作流测试
│   └── cross-platform/    # 跨平台测试
├── e2e/                   # 端到端测试
│   ├── browser-basic.e2e.ts    # 浏览器基础功能
│   ├── node-basic.e2e.ts       # Node.js 基础功能
│   └── performance.e2e.ts      # 性能测试
├── cross-lang/            # 跨语言兼容性测试
│   ├── python-compat.test.ts   # Python 兼容性
│   └── go-compat.test.ts       # Go 兼容性
├── fixtures/              # 测试数据
│   ├── test-vectors.json       # 标准测试向量
│   ├── keys.json              # 测试密钥
│   └── data.json              # 测试数据
├── utils/                 # 测试工具
│   ├── helpers.ts             # 辅助函数
│   ├── mocks.ts               # Mock 对象
│   └── setup.ts               # 测试设置
├── setup.ts               # Node.js 测试设置
└── setup.browser.ts       # 浏览器测试设置
```

### 文件命名规范

- **单元测试**: `*.test.ts`
- **集成测试**: `*.integration.test.ts`
- **浏览器测试**: `*.browser.test.ts`
- **Node.js 测试**: `*.node.test.ts`
- **E2E 测试**: `*.e2e.ts`
- **性能测试**: `*.bench.ts`

## 编写测试

### 单元测试示例

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { digest } from '@/core/sm3/digest';
import { hexToBytes, bytesToHex } from '../../utils/helpers';

describe('SM3 摘要算法', () => {
  it('应该计算正确的摘要', async () => {
    const input = hexToBytes('616263'); // "abc"
    const result = await digest(input);
    const resultHex = bytesToHex(result);

    expect(resultHex.toUpperCase()).toBe(
      '66C7F0F462EEEDD9D1F2D46BDC10E4E24167C4875CF2F7A2297DA02B8F4BA8E0'
    );
  });
});
```

### 浏览器环境测试

```typescript
import { describe, it, expect } from 'vitest';

describe('浏览器环境测试', () => {
  it('应该支持 Web Crypto API', () => {
    expect(globalThis.crypto).toBeDefined();
    expect(globalThis.crypto.getRandomValues).toBeDefined();
  });
});
```

### E2E 测试示例

```typescript
import { test, expect } from '@playwright/test';

test('SM3 摘要功能', async ({ page }) => {
  await page.goto('/examples/browser/');
  await page.click('button:has-text("测试 SM3 摘要")');

  const result = await page.locator('#sm3-result').textContent();
  expect(result).toMatch(/^[0-9a-fA-F]{64}$/);
});
```

### 性能测试示例

```typescript
import { benchmark } from '../utils/helpers';

describe('性能测试', () => {
  it('SM3 摘要性能', async () => {
    const data = new Uint8Array(1024); // 1KB

    const result = await benchmark(
      'SM3 摘要',
      async () => {
        await digest(data);
      },
      1000
    );

    expect(result.opsPerSecond).toBeGreaterThan(1000);
  });
});
```

## 测试工具

### 自定义匹配器

```typescript
// 扩展 expect 匹配器
expect.extend({
  toBeValidUint8Array(received: any) {
    const pass = received instanceof Uint8Array && received.length > 0;
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be a valid Uint8Array`
          : `Expected ${received} to be a valid Uint8Array`,
    };
  },
});

// 使用自定义匹配器
expect(result).toBeValidUint8Array();
expect(hash).toHaveByteLength(32);
expect(hexString).toBeValidHexString();
```

### 测试工具函数

```typescript
import {
  hexToBytes,
  bytesToHex,
  randomBytes,
  compareBytes,
  benchmark,
  loadTestVectors,
} from '../utils/helpers';

// 加载标准测试向量
const vectors = await loadTestVectors('sm3', 'digest');

// 生成测试数据
const testData = randomBytes(32);

// 性能测试
const perf = await benchmark('测试函数', testFunction, 1000);
```

### Mock 对象

```typescript
import { mockCrypto, mockConsole, setupGlobalMocks } from '../utils/mocks';

beforeEach(() => {
  setupGlobalMocks();
  vi.mocked(crypto.getRandomValues).mockImplementation(
    mockCrypto.getRandomValues
  );
});
```

## 测试覆盖率

### 覆盖率目标

- **全局覆盖率**: ≥ 85%
- **核心算法**: ≥ 90%
- **API 层**: ≥ 85%
- **工具函数**: ≥ 80%

### 覆盖率报告

```bash
# 生成覆盖率报告
pnpm test:coverage

# 查看 HTML 报告
open coverage/index.html
```

### 覆盖率配置

```typescript
// vitest.config.ts
coverage: {
  threshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    'src/core/**': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}
```

## 持续集成

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test:all

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### 测试矩阵

```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

## 调试测试

### VS Code 调试

1. 设置断点
2. 运行调试配置 "Debug Node.js Tests"
3. 检查变量和调用栈

### 浏览器调试

```bash
# 在浏览器中调试 E2E 测试
pnpm test:e2e:debug
```

### 日志调试

```typescript
// 启用详细日志
process.env.LOG_LEVEL = 'debug';

// 使用测试专用日志
console.log('测试数据:', testData);
```

## 最佳实践

### 测试原则

1. **独立性**: 每个测试应该独立运行
2. **可重复性**: 测试结果应该一致
3. **快速性**: 单元测试应该快速执行
4. **清晰性**: 测试意图应该明确

### 测试结构

```typescript
describe('功能模块', () => {
  beforeEach(() => {
    // 测试前设置
  });

  describe('具体功能', () => {
    it('应该满足特定条件', () => {
      // 准备 (Arrange)
      const input = createTestData();

      // 执行 (Act)
      const result = functionUnderTest(input);

      // 断言 (Assert)
      expect(result).toBe(expectedValue);
    });
  });
});
```

### 错误测试

```typescript
it('应该处理无效输入', () => {
  expect(() => {
    functionWithInvalidInput(null);
  }).toThrow('Invalid input');
});

it('应该处理异步错误', async () => {
  await expect(asyncFunction()).rejects.toThrow('Async error');
});
```

## 故障排除

### 常见问题

**问题**: 测试超时

```bash
# 增加超时时间
vitest --testTimeout=60000
```

**问题**: 内存不足

```bash
# 增加内存限制
node --max-old-space-size=4096 node_modules/.bin/vitest
```

**问题**: 浏览器测试失败

```bash
# 安装浏览器
npx playwright install
```

### 调试技巧

1. 使用 `console.log` 输出调试信息
2. 使用 `debugger` 语句设置断点
3. 检查测试覆盖率找出未测试的代码
4. 使用 `--reporter=verbose` 获取详细输出
