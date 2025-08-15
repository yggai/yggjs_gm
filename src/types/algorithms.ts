/**
 * 算法相关类型定义
 *
 * @description 国密算法相关的通用类型定义
 */

/**
 * 支持的国密算法
 */
export type GMAlgorithm = 'SM2' | 'SM3' | 'SM4';

/**
 * 算法选项基础接口
 */
export interface AlgorithmOptions {
  algorithm: GMAlgorithm;
}
