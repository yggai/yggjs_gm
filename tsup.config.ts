import { defineConfig } from 'tsup';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig([
  // 主包构建 - 通用入口
  {
    name: 'main',
    entry: {
      index: 'src/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    splitting: true,
    treeshake: true,
    minify: isProduction,
    target: ['es2020', 'node16'],
    platform: 'neutral',
    sourcemap: true,
    outDir: 'dist',
    banner: {
      js: '/* yggjs-gm - 国密算法 TypeScript 库 */',
    },
    define: {
      __VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.0'),
      __DEV__: JSON.stringify(!isProduction),
    },
    external: ['big-integer', 'sm-crypto'],
    noExternal: [],
  },

  // Node.js 专用构建
  {
    name: 'node',
    entry: {
      'adapters/node': 'src/adapters/node.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    treeshake: true,
    minify: isProduction,
    target: 'node16',
    platform: 'node',
    sourcemap: true,
    outDir: 'dist',
    external: ['crypto', 'util', 'big-integer', 'sm-crypto'],
  },

  // 浏览器专用构建
  {
    name: 'browser',
    entry: {
      'adapters/browser': 'src/adapters/browser.ts',
    },
    format: ['esm'],
    dts: true,
    splitting: false,
    treeshake: true,
    minify: isProduction,
    target: 'es2020',
    platform: 'browser',
    sourcemap: true,
    outDir: 'dist',
    external: ['big-integer', 'sm-crypto'],
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  },

  // 核心算法模块 - 支持按需导入
  {
    name: 'core',
    entry: {
      'core/sm2': 'src/core/sm2/index.ts',
      'core/sm3': 'src/core/sm3/index.ts',
      'core/sm4': 'src/core/sm4/index.ts',
      'core/math': 'src/core/math/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    treeshake: true,
    minify: isProduction,
    target: ['es2020', 'node16'],
    platform: 'neutral',
    sourcemap: true,
    outDir: 'dist',
    external: ['big-integer', 'sm-crypto'],
  },

  // API 模块 - 支持按需导入
  {
    name: 'api',
    entry: {
      'api/sm2': 'src/api/sm2.ts',
      'api/sm3': 'src/api/sm3.ts',
      'api/sm4': 'src/api/sm4.ts',
      'api/key': 'src/api/key.ts',
      'api/random': 'src/api/random.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    treeshake: true,
    minify: isProduction,
    target: ['es2020', 'node16'],
    platform: 'neutral',
    sourcemap: true,
    outDir: 'dist',
    external: ['big-integer', 'sm-crypto'],
  },
]);
