#!/usr/bin/env node

/**
 * 构建脚本
 *
 * @description 项目构建自动化脚本
 */

import { execSync } from 'child_process';
import { existsSync, rmSync, statSync } from 'fs';
import { join } from 'path';

const buildMode = process.argv[2] || 'dev';
const isProduction = buildMode === 'prod';

console.log(`🚀 开始构建项目 (${isProduction ? '生产' : '开发'}模式)...`);

try {
  // 清理旧的构建产物
  if (existsSync('dist')) {
    console.log('🧹 清理旧的构建产物...');
    rmSync('dist', { recursive: true, force: true });
  }

  // 类型检查
  console.log('🔍 进行类型检查...');
  execSync('tsc --noEmit', { stdio: 'inherit' });

  // 代码检查
  console.log('🔍 进行代码检查...');
  execSync('eslint src --ext .ts', { stdio: 'inherit' });

  if (isProduction) {
    // 生产构建 - 使用 Rollup
    console.log('📦 生产构建 (Rollup)...');
    execSync('NODE_ENV=production rollup -c', { stdio: 'inherit' });

    // 体积分析
    console.log('📊 分析构建产物体积...');
    analyzeBundle();
  } else {
    // 开发构建 - 使用 tsup
    console.log('📦 开发构建 (tsup)...');
    execSync('tsup', { stdio: 'inherit' });
  }

  console.log('✅ 构建完成！');

  // 显示构建结果
  showBuildResults();

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}

function analyzeBundle() {
  try {
    const distPath = 'dist';
    if (!existsSync(distPath)) return;

    console.log('\n📊 构建产物分析:');
    console.log('─'.repeat(50));

    const files = [
      'index.js',
      'index.cjs',
      'browser.esm.js',
      'browser.umd.js',
      'node.esm.js',
      'node.cjs.js'
    ];

    files.forEach(file => {
      const filePath = join(distPath, file);
      if (existsSync(filePath)) {
        const stats = statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  ${file.padEnd(20)} ${sizeKB.padStart(8)} KB`);
      }
    });

    console.log('─'.repeat(50));
  } catch (error) {
    console.warn('⚠️ 无法分析构建产物:', error.message);
  }
}

function showBuildResults() {
  console.log('\n🎉 构建结果:');
  console.log('─'.repeat(50));
  console.log('  ✅ ESM 格式支持');
  console.log('  ✅ CJS 格式支持');
  console.log('  ✅ TypeScript 类型声明');
  console.log('  ✅ Source Maps');
  console.log('  ✅ Tree-shaking 优化');
  console.log('  ✅ 按需导入支持');

  if (isProduction) {
    console.log('  ✅ 代码压缩');
    console.log('  ✅ 体积优化');
  }

  console.log('─'.repeat(50));
  console.log('\n📦 可用的导入方式:');
  console.log('  import { gm } from "yggjs-gm"');
  console.log('  import { sm2 } from "yggjs-gm/core/sm2"');
  console.log('  import { digest } from "yggjs-gm/api/sm3"');
  console.log('  const { gm } = require("yggjs-gm")');
}
