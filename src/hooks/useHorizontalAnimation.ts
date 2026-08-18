import gsap from "gsap";
import { useEffect, type RefObject } from "react";

import { HORIZON_GROWTH_WINDOW, PHASE_ONE_DURATION, TOTAL_DURATION } from "../lib/animTiming";

/**
 * 第二阶段动画：横线 水平扩散跟随 + 淡入 + 生长
 * - 横线从 0s 就"提前出场"（不可见、坍缩在左端点、带父竖线的 spread），
 *   全程跟随所属竖线水平平移，到出现时刻 appearAt 才淡入 + 向左端点生长到目标点
 * - 扩散 tween 与父竖线完全一致（起始值/时长/缓动），保证水平方向严格同步
 */
interface UseHorizontalAnimationParams {
  horizontalLines: HorizonLine[];
  /** 横线元素数组引用（索引与 horizontalLines 对应，由渲染层填充） */
  lineRefs: RefObject<SVGLineElement[]>;
  /** 线宽 SCALE */
  scale: number;
  /** 延时播放：动画开始前的暂停秒数 */
  startDelay: number;
  replayKey: number;
  /** 调试·笔画拆解：横线固定纯蓝色 + 50% 透明度（不做淡入） */
  strokeSplit: boolean;
}

export function useHorizontalAnimation({
  horizontalLines,
  lineRefs,
  scale,
  startDelay,
  replayKey,
  strokeSplit,
}: UseHorizontalAnimationParams) {
  useEffect(() => {
    const timelines: gsap.core.Timeline[] = [];
    const pauseAt = startDelay; // 延时播放：动画开始前的暂停秒数

    horizontalLines.forEach((line, index) => {
      const lineEl = lineRefs.current[index];
      if (!lineEl) return;

      const lineDelay = line.delay ?? 0; // 可选延时（秒）
      // 在 HORIZON_GROWTH_WINDOW（1.5s）内完成，延时越长的横线生长越急，最终同时完成
      const growthDuration = Math.max(HORIZON_GROWTH_WINDOW - lineDelay, 0.1);
      const appearAt = PHASE_ONE_DURATION + lineDelay; // 第二阶段该线出现时刻
      const spreadOffset = line.spreadOffset ?? 0;
      // 笔画拆解：横线固定纯蓝色 + 50% 透明度；否则白色 + 透明度 0（由淡入动画接管）
      const fixedAlpha = strokeSplit ? 0.5 : 0;

      // 初始状态：透明度 fixedAlpha、坍缩在左端点，并带上所属竖线的水平偏移
      lineEl.setAttribute("x1", String(line.x1 + spreadOffset));
      lineEl.setAttribute("y1", String(line.y1));
      lineEl.setAttribute("x2", String(line.x1 + spreadOffset));
      lineEl.setAttribute("y2", String(line.y1));
      lineEl.setAttribute("stroke-width", String(scale));
      lineEl.setAttribute("stroke", strokeSplit ? "#0000ff" : "#fff");
      lineEl.style.opacity = String(fixedAlpha);

      // GSAP 动画对象：x1/y1 为固定锚点，x2/y2 生长到目标端点，spread 水平偏移，alpha 透明度
      const state = {
        x1: line.x1,
        y1: line.y1,
        x2: line.x1,
        y2: line.y1,
        spread: spreadOffset,
        alpha: fixedAlpha,
      };

      // 统一将 state 写入 SVG 属性（横坐标附加 spread 偏移，透明度由 alpha 控制）
      const applyAttrs = () => {
        lineEl.setAttribute("x1", String(state.x1 + state.spread));
        lineEl.setAttribute("y1", String(state.y1));
        lineEl.setAttribute("x2", String(state.x2 + state.spread));
        lineEl.setAttribute("y2", String(state.y2));
        lineEl.style.opacity = String(state.alpha);
      };

      const tl = gsap.timeline();

      // 水平跟随所属竖线：全程 3s 向外展开（与竖线 tween 起始值/时长/缓动一致，保证严格同步）
      // pauseAt：延时播放，扩散（连同横线出场）从暂停结束后开始
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

      // 透明度：第二阶段出现时刻淡入（叠加延时播放）；笔画拆解模式跳过，保持固定 50%
      if (!strokeSplit) {
        tl.to(
          state,
          {
            alpha: 1,
            duration: Math.min(growthDuration, 0.3),
            ease: "power1.out",
            onUpdate: applyAttrs,
          },
          pauseAt + appearAt
        );
      }

      // 生长：从左端点向右生长到目标端点
      tl.to(
        state,
        {
          x2: line.x2,
          y2: line.y2,
          duration: growthDuration,
          ease: "power2.out",
          onUpdate: applyAttrs,
        },
        pauseAt + appearAt
      );

      timelines.push(tl);
    });

    return () => {
      timelines.forEach((tl) => tl.kill());
    };
  }, [horizontalLines, lineRefs, scale, startDelay, replayKey, strokeSplit]);
}
