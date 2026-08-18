import gsap from "gsap";
import { useEffect, type RefObject } from "react";

import { GROWTH_WINDOW, TOTAL_DURATION } from "../lib/animTiming";

/**
 * 第一阶段动画：竖线 水平扩散 + 生长 + 淡入
 * - 每条竖线独立 timeline：三组动画可并行（生长/扩散从 pauseAt 起，淡入按 pauseAt+delayAlpha）
 * - 先按初始态写死 SVG 属性，再让 GSAP 接管（state 中间值 + onUpdate 写回 DOM）
 * - 依赖变化（线条重建 / 重播 / 随机重播 / 延时播放）时先清理上一轮时间轴再重建
 */
interface UseVerticalAnimationParams {
  verticalLines: VerticalLine[];
  /** 竖线元素数组引用（索引与 verticalLines 对应，由渲染层填充） */
  lineRefs: RefObject<SVGLineElement[]>;
  /** 线宽 SCALE */
  scale: number;
  /** 延时播放：动画开始前的暂停秒数 */
  startDelay: number;
  replayKey: number;
  randomizeKey: number;
}

export function useVerticalAnimation({
  verticalLines,
  lineRefs,
  scale,
  startDelay,
  replayKey,
  randomizeKey,
}: UseVerticalAnimationParams) {
  useEffect(() => {
    const timelines: gsap.core.Timeline[] = [];
    const pauseAt = startDelay; // 延时播放：动画开始前的暂停秒数

    verticalLines.forEach((line, index) => {
      const lineEl = lineRefs.current[index];
      if (!lineEl) return;

      const { fromTop, delayAlpha, spreadOffset, initHeightRatio } = line;

      // 生长在 GROWTH_WINDOW（0.7s）内完成；透明度按 delayAlpha 延时淡入
      const growthDuration = GROWTH_WINDOW;
      const alphaDuration = Math.max(GROWTH_WINDOW - delayAlpha, 0.1);

      // 锚点逻辑：fromTop=true 时锚在顶部 (x1,y1)，否则锚在底部 (x2,y2)
      // 初始端点位于从锚点沿线段方向 initHeightRatio（0~0.5）比例处
      const isAnchorTop = fromTop;

      const initX1 = isAnchorTop ? line.x1 : line.x2 + (line.x1 - line.x2) * initHeightRatio;
      const initY1 = isAnchorTop ? line.y1 : line.y2 + (line.y1 - line.y2) * initHeightRatio;
      const initX2 = isAnchorTop ? line.x1 + (line.x2 - line.x1) * initHeightRatio : line.x2;
      const initY2 = isAnchorTop ? line.y1 + (line.y2 - line.y1) * initHeightRatio : line.y2;

      // ===== 重置到初始状态（从初始高度起点到锚点，横坐标带上 spread，宽度恒为 SCALE，透明度 0） =====
      lineEl.setAttribute("x1", String(initX1 + spreadOffset));
      lineEl.setAttribute("y1", String(initY1));
      lineEl.setAttribute("x2", String(initX2 + spreadOffset));
      lineEl.setAttribute("y2", String(initY2));
      lineEl.setAttribute("stroke-width", String(scale));
      lineEl.style.opacity = "0";

      // GSAP 动画对象：x1/y1/x2/y2 为坐标（生长目标 = 最终布局），spread 为水平偏移（扩散目标 = 0）
      const state = {
        x1: initX1,
        y1: initY1,
        x2: initX2,
        y2: initY2,
        spread: spreadOffset,
      };

      // 统一将 state 写入 SVG 属性（横坐标附加 spread 偏移）
      const applyAttrs = () => {
        lineEl.setAttribute("x1", String(state.x1 + state.spread));
        lineEl.setAttribute("y1", String(state.y1));
        lineEl.setAttribute("x2", String(state.x2 + state.spread));
        lineEl.setAttribute("y2", String(state.y2));
      };

      const tl = gsap.timeline();

      // 水平扩散：初始向中心压缩，全程 3s 向外展开落到布局位置，水平方向运动函数为 power1.out
      // pauseAt：延时播放，扩散（连同生长）从暂停结束后开始
      tl.to(
        state,
        {
          spread: 0,
          duration: TOTAL_DURATION,
          ease: "power1.out",
          onUpdate: applyAttrs,
        },
        pauseAt
      );

      // 生长动画：x1/y1/x2/y2 从初始高度端点同步展开到完整长度（"<" 表示与前一个同时启动）
      tl.to(
        state,
        {
          x1: line.x1,
          duration: growthDuration,
          ease: "sine.out",
          onUpdate: applyAttrs,
        },
        pauseAt
      );

      tl.to(
        state,
        {
          y1: line.y1,
          duration: growthDuration,
          ease: "sine.out",
          onUpdate: applyAttrs,
        },
        "<"
      );

      tl.to(
        state,
        {
          x2: line.x2,
          duration: growthDuration,
          ease: "sine.out",
          onUpdate: applyAttrs,
        },
        "<"
      );

      tl.to(
        state,
        {
          y2: line.y2,
          duration: growthDuration,
          ease: "sine.out",
          onUpdate: applyAttrs,
        },
        "<"
      );

      // 线宽恒定 SCALE（不再随生长变宽，避免等比缩放观感）

      // 透明度：按 delayAlpha 延时淡入（叠加延时播放），与生长相互独立
      // power1.out：早期快速显现，让线条在还较短时就可见（呈现完整生长过程）
      tl.to(
        lineEl,
        {
          opacity: 1,
          duration: alphaDuration,
          ease: "power1.out",
        },
        pauseAt + delayAlpha
      );

      timelines.push(tl);
    });

    return () => {
      timelines.forEach((tl) => tl.kill());
    };
  }, [verticalLines, lineRefs, scale, startDelay, replayKey, randomizeKey]);
}
