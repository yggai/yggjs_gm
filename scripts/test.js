#!/usr/bin/env node

/**
 * 测试脚本
 * 
 * @description 项目测试自动化脚本
 */

import { execSync } from 'child_process';

console.log('🧪 开始运行测试...');

try {
  // 运行单元测试
  console.log('📋 运行单元测试...');
  execSync('vitest run', { stdio: 'inherit' });

  // 生成覆盖率报告
  console.log('📊 生成覆盖率报告...');
  execSync('vitest run --coverage', { stdio: 'inherit' });

  console.log('✅ 测试完成！');
} catch (error) {
  console.error('❌ 测试失败:', error.message);
  process.exit(1);
}
