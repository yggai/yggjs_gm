import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';
import analyze from 'rollup-plugin-analyzer';
import filesize from 'rollup-plugin-filesize';

const isProduction = process.env.NODE_ENV === 'production';
const isAnalyze = process.env.ANALYZE === 'true';

// 通用插件配置
const getPlugins = (platform = 'neutral') => [
  resolve({
    browser: platform === 'browser',
    preferBuiltins: platform === 'node',
    exportConditions: platform === 'browser' ? ['browser'] : ['node'],
  }),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: false, // 由单独的配置生成
    declarationMap: false,
    sourceMap: true,
  }),
  isProduction && terser({
    compress: {
      drop_console: false, // 保留 console，由用户决定
      drop_debugger: true,
      pure_funcs: ['console.debug'],
    },
    mangle: {
      reserved: ['GmError'], // 保留错误类名
    },
    format: {
      comments: false,
      preamble: '/* yggjs-gm - 国密算法 TypeScript 库 */',
    },
  }),
  filesize({
    showMinifiedSize: true,
    showGzippedSize: true,
  }),
  isAnalyze && analyze({
    summaryOnly: true,
    limit: 10,
  }),
].filter(Boolean);

// 外部依赖配置
const external = ['big-integer'];
const nodeExternal = [...external, 'crypto', 'util', 'fs', 'path'];

export default defineConfig([
  // 主包 - ESM
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
    external,
    plugins: getPlugins(),
  },
  
  // 主包 - CJS
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    external,
    plugins: getPlugins(),
  },
  
  // 浏览器专用包 - ESM (优化体积)
  {
    input: 'src/adapters/browser.ts',
    output: {
      file: 'dist/browser.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins: getPlugins('browser'),
  },
  
  // 浏览器专用包 - UMD (全局使用)
  {
    input: 'src/adapters/browser.ts',
    output: {
      file: 'dist/browser.umd.js',
      format: 'umd',
      name: 'YggGM',
      sourcemap: true,
      globals: {
        'big-integer': 'bigInt',
      },
    },
    external,
    plugins: getPlugins('browser'),
  },
  
  // Node.js 专用包
  {
    input: 'src/adapters/node.ts',
    output: [
      {
        file: 'dist/node.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/node.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
    ],
    external: nodeExternal,
    plugins: getPlugins('node'),
  },
  
  // 按需导入 - 核心算法模块
  {
    input: {
      'sm2/index': 'src/core/sm2/index.ts',
      'sm3/index': 'src/core/sm3/index.ts',
      'sm4/index': 'src/core/sm4/index.ts',
      'math/index': 'src/core/math/index.ts',
    },
    output: [
      {
        dir: 'dist/core',
        format: 'esm',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src/core',
      },
      {
        dir: 'dist/core',
        format: 'cjs',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src/core',
        entryFileNames: '[name].cjs.js',
      },
    ],
    external,
    plugins: getPlugins(),
  },
  
  // 类型声明文件
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
  
  // 适配器类型声明
  {
    input: {
      'adapters/browser': 'src/adapters/browser.ts',
      'adapters/node': 'src/adapters/node.ts',
    },
    output: {
      dir: 'dist',
      format: 'esm',
    },
    plugins: [dts()],
  },
  
  // 核心模块类型声明
  {
    input: {
      'core/sm2/index': 'src/core/sm2/index.ts',
      'core/sm3/index': 'src/core/sm3/index.ts',
      'core/sm4/index': 'src/core/sm4/index.ts',
      'core/math/index': 'src/core/math/index.ts',
    },
    output: {
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [dts()],
  },
]);
