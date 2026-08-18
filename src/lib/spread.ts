/**
 * 计算某根全局竖线（序号 i，共 total 根）的水平偏移：
 * - 奇数：中间为 0，向外第 k 根偏移 ±k*VERTICAL_WIDTH
 * - 偶数：向中心数第 N 根偏移 ±(N-0.5)*VERTICAL_WIDTH（中间两根为 ±0.5W）
 * 偏移作用于「初始位置」：左侧为正（初始向中心右偏，动画向左展开）、右侧为负（初始向中心左偏，动画向右展开）
 * 即动画全程由压缩态向外展开，最终落到预定的布局位置
 */
export function computeSpread(i: number, total: number, verticalWidth: number): number {
  if (total <= 1) return 0;
  if (total % 2 === 1) {
    const c = (total - 1) / 2;
    const k = Math.abs(i - c);
    return (i < c ? 1 : i > c ? -1 : 0) * k * verticalWidth;
  }
  const c = total / 2;
  const k = i < c ? c - i - 0.5 : i - c + 0.5;
  return (i < c ? 1 : -1) * k * verticalWidth;
}
