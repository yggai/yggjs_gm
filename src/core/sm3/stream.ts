/**
 * SM3 流式哈希
 *
 * @description 支持流式输入的 SM3 哈希实现
 */

import type { SM3HashState } from './sm3.types.js';

/**
 * SM3 流式哈希类
 */
export class SM3Hash {
  private state: SM3HashState;

  constructor() {
    this.state = this.initState();
  }

  /**
   * 更新哈希状态
   *
   * @param data 输入数据
   */
  update(data: Uint8Array): this {
    // TODO: 实现流式更新
    throw new Error('SM3 流式更新功能待实现');
  }

  /**
   * 完成哈希计算
   *
   * @returns 最终摘要
   */
  digest(): Uint8Array {
    // TODO: 实现最终摘要计算
    throw new Error('SM3 最终摘要计算功能待实现');
  }

  /**
   * 重置哈希状态
   */
  reset(): void {
    this.state = this.initState();
  }

  private initState(): SM3HashState {
    // TODO: 初始化 SM3 状态
    return {} as SM3HashState;
  }
}
