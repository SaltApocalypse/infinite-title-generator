// 动画时长常量（单位：秒）
// 注意：所有时间轴位置都会整体叠加 startDelay（延时播放）——动画开始/重播/随机重播前暂停
export const TOTAL_DURATION = 3; // 总动画时长 3s
export const PHASE_ONE_DURATION = 1; // 第一阶段时长 1s（竖线生长 + 透明度）
export const GROWTH_WINDOW = 0.7; // 第一阶段竖线生长/透明度的完成窗口（第 0.7s 前完成）
export const HORIZON_GROWTH_WINDOW = 1.5; // 第二阶段横线生长窗口（第 1s 起的 0~1.5s 内完成）
