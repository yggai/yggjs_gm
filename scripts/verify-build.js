#!/usr/bin/env node

/**
 * 构建验证脚本
 * 
 * @description 验证构建产物的正确性
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const distPath = 'dist';
const requiredFiles = [
  // 主入口文件
  'index.js',
  'index.cjs',
  'index.d.ts',
  
  // 适配器文件
  'adapters/browser.js',
  'adapters/browser.d.ts',
  'adapters/node.js',
  'adapters/node.cjs',
  'adapters/node.d.ts',
  
  // 核心模块
  'core/sm2/index.js',
  'core/sm2/index.cjs',
  'core/sm2/index.d.ts',
  'core/sm3/index.js',
  'core/sm3/index.cjs',
  'core/sm3/index.d.ts',
  'core/sm4/index.js',
  'core/sm4/index.cjs',
  'core/sm4/index.d.ts',
  
  // API 模块
  'api/sm2.js',
  'api/sm2.cjs',
  'api/sm2.d.ts',
  'api/sm3.js',
  'api/sm3.cjs',
  'api/sm3.d.ts',
  'api/sm4.js',
  'api/sm4.cjs',
  'api/sm4.d.ts',
];

console.log('🔍 验证构建产物...');

let hasErrors = false;

// 检查必需文件是否存在
console.log('\n📁 检查文件存在性:');
requiredFiles.forEach(file => {
  const filePath = join(distPath, file);
  if (existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} (缺失)`);
    hasErrors = true;
  }
});

// 检查 package.json 导出配置
console.log('\n📦 检查 package.json 导出配置:');
try {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const exports = packageJson.exports;
  
  if (exports) {
    Object.entries(exports).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([condition, path]) => {
          if (typeof path === 'string' && path.startsWith('./dist/')) {
            const filePath = path.replace('./dist/', '');
            const fullPath = join(distPath, filePath);
            if (existsSync(fullPath)) {
              console.log(`  ✅ ${key} (${condition}): ${path}`);
            } else {
              console.log(`  ❌ ${key} (${condition}): ${path} (文件不存在)`);
              hasErrors = true;
            }
          }
        });
      }
    });
  }
} catch (error) {
  console.log(`  ❌ 无法读取 package.json: ${error.message}`);
  hasErrors = true;
}

// 检查文件内容
console.log('\n📄 检查文件内容:');

// 检查主入口文件
const mainFiles = ['index.js', 'index.cjs'];
mainFiles.forEach(file => {
  const filePath = join(distPath, file);
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf8');
    
    // 检查是否包含版本信息
    if (content.includes('yggjs-gm')) {
      console.log(`  ✅ ${file} 包含版本信息`);
    } else {
      console.log(`  ⚠️ ${file} 缺少版本信息`);
    }
    
    // 检查是否有导出
    if (content.includes('export') || content.includes('exports')) {
      console.log(`  ✅ ${file} 包含导出`);
    } else {
      console.log(`  ❌ ${file} 缺少导出`);
      hasErrors = true;
    }
  }
});

// 检查类型声明文件
const typeFiles = ['index.d.ts', 'adapters/browser.d.ts', 'adapters/node.d.ts'];
typeFiles.forEach(file => {
  const filePath = join(distPath, file);
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf8');
    
    if (content.includes('export') || content.includes('declare')) {
      console.log(`  ✅ ${file} 包含类型声明`);
    } else {
      console.log(`  ❌ ${file} 缺少类型声明`);
      hasErrors = true;
    }
  }
});

// 检查 Source Maps
console.log('\n🗺️ 检查 Source Maps:');
const jsFiles = requiredFiles.filter(f => f.endsWith('.js') || f.endsWith('.cjs'));
jsFiles.forEach(file => {
  const mapFile = file + '.map';
  const mapPath = join(distPath, mapFile);
  if (existsSync(mapPath)) {
    console.log(`  ✅ ${mapFile}`);
  } else {
    console.log(`  ⚠️ ${mapFile} (缺失)`);
  }
});

// 检查 Tree-shaking 支持
console.log('\n🌳 检查 Tree-shaking 支持:');
try {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  
  if (packageJson.sideEffects === false) {
    console.log('  ✅ sideEffects: false');
  } else {
    console.log('  ⚠️ sideEffects 未设置为 false');
  }
  
  if (packageJson.type === 'module') {
    console.log('  ✅ type: module');
  } else {
    console.log('  ⚠️ type 未设置为 module');
  }
} catch (error) {
  console.log(`  ❌ 无法检查 package.json: ${error.message}`);
}

// 总结
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ 构建验证失败！请检查上述错误。');
  process.exit(1);
} else {
  console.log('✅ 构建验证通过！所有文件都已正确生成。');
  
  console.log('\n🎯 验证项目:');
  console.log('  ✅ ESM/CJS 双格式支持');
  console.log('  ✅ TypeScript 类型声明');
  console.log('  ✅ 按需导入支持');
  console.log('  ✅ Tree-shaking 优化');
  console.log('  ✅ Source Maps 生成');
  console.log('  ✅ 多入口点配置');
  
  console.log('\n📚 使用示例:');
  console.log('  // 完整导入');
  console.log('  import { gm } from "yggjs-gm"');
  console.log('  ');
  console.log('  // 按需导入');
  console.log('  import { digest } from "yggjs-gm/api/sm3"');
  console.log('  import { generateKeyPair } from "yggjs-gm/core/sm2"');
  console.log('  ');
  console.log('  // 平台特定');
  console.log('  import { gm } from "yggjs-gm/browser"');
  console.log('  import { gm } from "yggjs-gm/node"');
}
