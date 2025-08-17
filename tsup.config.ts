import { defineConfig } from 'tsup';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  // 主包构建 - 通用入口
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
});
