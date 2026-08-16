import gsap from "gsap";
import { memo, useEffect, useMemo, useRef, useState } from "react";

import { DEFAULT_DELAY, DEFAULT_SCALE, getConstants } from "../constants/constants";
import { theme } from "../theme";
// 可缩放/平移的画布容器（含右上角视图控制浮层）
import ZoomableCanvas, { type ViewControlMode } from "./ZoomableCanvas";

/**
 * ============================================================================
 * Halo Infinite 风格标题动画（Page 组件）—— 整体动画拆解思路
 * ============================================================================
 *
 * 【一、动画分镜】总时长 3s：两个阶段 + 一条贯穿全程的水平扩散动画。
 *
 *   时间轴  |----0s----1s----2s----3s----|
 *   竖线生长 |██████████                  |  生长 + 淡入（第 0.7s 前完成）
 *   竖线淡入 |██████████                  |
 *   横线生长 |          ████████████████   |  第 1s 起，0~1.5s 内完成
 *   水平扩散 |███████████████████████████  |  全程 3s，压缩态向外展开
 *
 *  ① 第一阶段（0~1s）——竖线（见下方"第一阶段动画"effect）：
 *     - 竖线从"初始短线段"生长到完整长度。锚点由 fromTop 决定（奇偶交替：
 *       偶数线锚定顶部向下生长、奇数线锚定底部向上生长），初始长度取
 *       initHeightRatio（0~0.5）。
 *     - 同时在 delayAlpha 延时内淡入；线宽恒定 SCALE（不随生长变宽，避免等比缩放观感）。
 *
 *  ② 第二阶段（1~3s）——横线（见下方"第二阶段动画"effect）：
 *     - 横线锚定左端点，从左向右生长到目标端点。生长时长 = HORIZON_GROWTH_WINDOW - delay，
 *       即 delay 越大的线生长越急，所有横线最终同时完成。
 *     - 可选 delay：部分横线（如 E 的中间短横）延时出现。
 *
 *  ③ 水平扩散（0~3s 全程）——spread：
 *     - 所有线条的"初始水平位置"按全局竖线序号相对中心向外压缩，动画结束时落到布局位置：
 *         奇数根竖线：中间为 0，向外第 k 根偏移 ±k*VERTICAL_WIDTH；
 *         偶数根竖线：向中心数第 N 根偏移 ±(N-0.5)*VERTICAL_WIDTH（中间两根为 ±0.5W）。
 *     - 左侧竖线初始向中心右偏、右侧竖线初始向中心左偏，全程用 power1.out 向外展开。
 *     - 横线继承所属竖线的偏移（父线 = 本字符内左端点 x1 最近的竖线），与竖线严格同步平移。
 *
 * 【二、坐标系约定】
 *    - 所有线段坐标以"整条标题的几何中心"为原点 (0,0)：
 *      x ∈ [-内容宽/2, +内容宽/2]，y ∈ [-VERTICAL_HEIGHT/2, +VERTICAL_HEIGHT/2]。
 *      数据生成时先按绝对坐标从左往右铺排，最后统一平移到几何中心。
 *    - SVG 内用 <g transform="translate(canvas.width/2, canvas.height/2)">
 *      把原点摆到画布中心（画布本身也是中心对称预留了扩散空间）。
 *    - 画布宽度额外预留 maxSpread（最大水平偏移），避免扩散起始态被 SVG 裁剪。
 *
 * 【三、数据生成流程 initLines（useMemo 驱动）】
 *    1) 遍历输入字符，从 TITLE_CHARS 取竖线/横线定义，叠加全局 X 推进生成绝对坐标；
 *    2) 计算每根竖线的 spreadOffset（由全局序号相对中心确定方向与距离，见 computeSpread）；
 *    3) 横线按"左端点 x1 最近的竖线"作为父线，记录 parentVIndex 并继承其 spreadOffset；
 *    4) 所有坐标平移到标题几何中心，并按 maxSpread 计算画布尺寸。
 *
 * 【四、动画执行流程（两个 useEffect，各自维护时间轴数组）】
 *    - "第一阶段动画"effect：为每根竖线建 timeline（水平扩散 + 生长 + 淡入）；
 *    - "第二阶段动画"effect：为每根横线建 timeline（水平扩散跟随 + 淡入 + 生长）。
 *    依赖数组变化（输入防抖结果 / 重播 / 随机重播）时先 kill 旧时间轴再重建。
 *    重播（replayKey）复用现有数据；随机重播（randomizeKey）重新生成随机参数。
 * ============================================================================
 */

// ========== 动画时长常量（单位：秒） ==========
// 注意：以上所有时间轴位置都会整体叠加 startDelay（延时播放）——动画开始/重播/随机重播前暂停
const TOTAL_DURATION = 3; // 总动画时长 3s
const PHASE_ONE_DURATION = 1; // 第一阶段时长 1s（竖线生长 + 透明度）
const GROWTH_WINDOW = 0.7; // 第一阶段竖线生长/透明度的完成窗口（第 0.7s 前完成）
const HORIZON_GROWTH_WINDOW = 1.5; // 第二阶段横线生长窗口（第 1s 起的 0~1.5s 内完成）

// 计算某根全局竖线（序号 i，共 total 根）的水平偏移：
// - 奇数：中间为 0，向外第 k 根偏移 ±k*VERTICAL_WIDTH
// - 偶数：向中心数第 N 根偏移 ±(N-0.5)*VERTICAL_WIDTH（中间两根为 ±0.5W）
// 偏移作用于「初始位置」：左侧为正（初始向中心右偏，动画向左展开）、右侧为负（初始向中心左偏，动画向右展开）
// 即动画全程由压缩态向外展开，最终落到预定的布局位置
const computeSpread = (i: number, total: number, verticalWidth: number): number => {
  if (total <= 1) return 0;
  if (total % 2 === 1) {
    const c = (total - 1) / 2;
    const k = Math.abs(i - c);
    return (i < c ? 1 : i > c ? -1 : 0) * k * verticalWidth;
  }
  const c = total / 2;
  const k = i < c ? c - i - 0.5 : i - c + 0.5;
  return (i < c ? 1 : -1) * k * verticalWidth;
};

/** 页面组件 props */
interface PageProps {
  /** 标题文本（已由外部防抖处理），驱动动画线条重建 */
  title: string;
  /** 文本尺寸（SCALE），默认 DEFAULT_SCALE */
  scale?: number;
  /** 调试：显示字符占位辅助（实际占用方块 + 声明宽度单元格轮廓） */
  showPlaceholders?: boolean;
  /** 视图控制模式（设置页选择，控制右上角视图控制浮层显示） */
  viewControlMode?: ViewControlMode;
  /** 延时播放（动画开始/重播/随机重播前的暂停秒数），默认 DEFAULT_DELAY */
  startDelay?: number;
}

/** 调试用：单字符占位信息（坐标为全局绝对坐标，未做中心平移，见 initLines 后处理） */
interface PlaceholderRect {
  /** 字符 */
  char: string;
  /** 声明占位单元格左边缘（char.width 声明范围） */
  cellX: number;
  /** 声明占位宽度 */
  cellWidth: number;
  /** 实际占用 bbox（已按线宽 SCALE 扩展） */
  x: number;
  y: number;
  width: number;
  height: number;
}

const Page: React.FC<PageProps> = ({
  title,
  scale = DEFAULT_SCALE,
  showPlaceholders = false,
  viewControlMode = "full",
  startDelay = DEFAULT_DELAY,
}) => {
  // ========== DOM 引用 ==========
  const svgRef = useRef<SVGSVGElement | null>(null); // SVG 根元素
  const lineRefs = useRef<SVGLineElement[]>([]); // 竖线元素数组（索引与 verticalLines 对应）
  const hLineRefs = useRef<SVGLineElement[]>([]); // 横线元素数组（索引与 horizontalLines 对应）

  // ========== GSAP 时间轴引用（用于清理重建） ==========
  const timelinesRef = useRef<gsap.core.Timeline[]>([]); // 竖线动画时间轴集合
  const hTimelinesRef = useRef<gsap.core.Timeline[]>([]); // 横线动画时间轴集合

  // ========== SVG 画布尺寸 ==========
  const [canvas, setCanvas] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // ========== 文本输入状态 ==========
  // （输入状态与防抖已上移到路由，本组件仅接收 title prop）

  // ========== 依据 scale 生成动画常量（TITLE_CHARS 等随文本尺寸缩放） ==========
  const {
    SCALE,
    VERTICAL_WIDTH,
    VERTICAL_HEIGHT,
    HORIZON_SPACE,
    HORIZON_PADDING,
    VERTICAL_PADDING,
    TITLE_CHARS,
  } = useMemo(() => getConstants(scale), [scale]);

  // ===== 重播/随机重播计数（用于调试按钮） =====
  // replayKey：仅重播动画，数据（含随机参数）保持不变
  // randomizeKey：重新生成线条数据（随机参数变化）并重播动画
  const [replayKey, setReplayKey] = useState(0);
  const [randomizeKey, setRandomizeKey] = useState(0);
  const handleReplay = () => setReplayKey((k) => k + 1);
  const handleRandomReplay = () => setRandomizeKey((k) => k + 1);

  const initLines = () => {
    if (!title) {
      return { verticalLines: [], horizontalLines: [], placeholders: [] };
    }

    let gVerIndex = 0; // 竖线全局序号（决定 fromTop 交替方向）
    let hIndex = 0; // 横线全局序号
    let gVerX = HORIZON_PADDING; // 当前字符的全局起始 X 坐标

    const verticalLines: VerticalLine[] = [];
    const horizontalLines: HorizonLine[] = [];
    const placeholders: PlaceholderRect[] = [];

    title.split("").forEach((ch) => {
      const char = TITLE_CHARS[ch];
      // 未定义的字符：仅推进间距，不生成线条
      if (!char) {
        gVerX += HORIZON_SPACE;
        return;
      }

      const ver = char.vertical ?? [];
      const hor = char.horizon ?? [];
      const charStartIndex = verticalLines.length; // 本字符竖线在数组中的起始索引

      // ===== 生成竖线：叠加全局 X 偏移，附加随机动画参数 =====
      ver.forEach((line, index) => {
        verticalLines.push({
          id: `v-${gVerIndex}-${ch}${index}`,
          x1: gVerX + line.x1,
          y1: line.y1,
          x2: gVerX + line.x2,
          y2: line.y2,
          fromTop: gVerIndex % 2 === 1, // 奇偶交替：偶数从上向下生长，奇数从下向上生长
          // 初始高度比例 0~0.5：线条从该比例的长度开始生长（替代原来的生长延时 delay）
          initHeightRatio: Math.random() * 0.1,
          delayAlpha: Math.random() * 0.3, // 透明度变化延时（秒）
          spreadOffset: 0,
        });
        gVerIndex++;
      });

      // ===== 生成横线：叠加全局 X 偏移，并应用 offsetXCoef/offsetYCoef 消除连接开口 =====
      hor.forEach((line, index) => {
        const offset = (line.offsetXCoef ?? 0) * SCALE; // 向左偏移 = 系数 * 线宽
        const offsetY = (line.offsetYCoef ?? 0) * SCALE; // 向上偏移 = 系数 * 线宽
        // 父竖线：本字符内与横线左端点 x1 最近的那根竖线（横线锚定 x1 生长，跟随其水平偏移）
        let parentLocal = -1;
        let bestDist = Infinity;
        ver.forEach((v, vi) => {
          const d = Math.abs(v.x1 - line.x1);
          if (d < bestDist) {
            bestDist = d;
            parentLocal = vi;
          }
        });
        horizontalLines.push({
          id: `h-${hIndex}-${ch}${index}`,
          x1: gVerX + line.x1 - offset,
          y1: line.y1 - offsetY,
          x2: gVerX + line.x2 - offset,
          y2: line.y2 - offsetY,
          delay: line.delay ?? 0, // 可选延时出现（秒）
          parentVIndex: parentLocal >= 0 ? charStartIndex + parentLocal : undefined,
          spreadOffset: 0,
        });
        hIndex++;
      });

      // ===== 占位范围（调试用）：遍历全部笔画（含横线偏移）求实际占用 bbox =====
      let pMinX = Infinity;
      let pMaxX = -Infinity;
      let pMinY = Infinity;
      let pMaxY = -Infinity;
      const includePoint = (x: number, y: number) => {
        pMinX = Math.min(pMinX, x);
        pMaxX = Math.max(pMaxX, x);
        pMinY = Math.min(pMinY, y);
        pMaxY = Math.max(pMaxY, y);
      };
      ver.forEach((l) => {
        includePoint(gVerX + l.x1, l.y1);
        includePoint(gVerX + l.x2, l.y2);
      });
      hor.forEach((l) => {
        const offX = (l.offsetXCoef ?? 0) * SCALE; // 与生成横线时一致的向左偏移
        const offY = (l.offsetYCoef ?? 0) * SCALE; // 与生成横线时一致的向上偏移
        includePoint(gVerX + l.x1 - offX, l.y1 - offY);
        includePoint(gVerX + l.x2 - offX, l.y2 - offY);
      });
      const pad = SCALE / 2; // 线宽 SCALE 向两端各延伸一半，纳入实际占用范围
      placeholders.push({
        char: ch,
        cellX: gVerX,
        cellWidth: char.width,
        x: pMinX - pad,
        y: pMinY - pad,
        width: pMaxX - pMinX + SCALE,
        height: pMaxY - pMinY + SCALE,
      });

      // 推进到下一个字符的起始 X：字符宽度 + 字符间距
      gVerX += char.width + HORIZON_SPACE;
    });

    // ===== 全局后处理：中心原点平移 + 全局水平偏移 =====
    const totalV = verticalLines.length;
    // 每根竖线的水平偏移（由全局序号相对中心确定方向与距离）
    verticalLines.forEach((l, i) => {
      l.spreadOffset = computeSpread(i, totalV, VERTICAL_WIDTH);
    });
    // 横线继承所属竖线的水平偏移（无父竖线如 Z 为 0）
    horizontalLines.forEach((h) => {
      h.spreadOffset =
        h.parentVIndex != null ? computeSpread(h.parentVIndex, totalV, VERTICAL_WIDTH) : 0;
    });
    // 最大偏移量（决定画布需要预留的宽度，防止扩散起始态被裁剪）
    const maxSpread = verticalLines.reduce((m, l) => Math.max(m, Math.abs(l.spreadOffset)), 0);
    // 将坐标原点平移到整条标题的几何中心（0,0）：x 范围 [-gVerX/2, +gVerX/2]，y 范围 [-H/2, +H/2]
    const contentCenterX = gVerX / 2;
    const contentCenterY = VERTICAL_HEIGHT / 2;
    const shiftToCenter = (l: { x1: number; y1: number; x2: number; y2: number }) => {
      l.x1 -= contentCenterX;
      l.x2 -= contentCenterX;
      l.y1 -= contentCenterY;
      l.y2 -= contentCenterY;
    };
    verticalLines.forEach(shiftToCenter);
    horizontalLines.forEach(shiftToCenter);
    placeholders.forEach((p) => {
      p.cellX -= contentCenterX;
      p.x -= contentCenterX;
      p.y -= contentCenterY;
    });

    setCanvas({
      width: gVerX + 2 * (HORIZON_PADDING + maxSpread),
      height: VERTICAL_HEIGHT + 2 * VERTICAL_PADDING,
    });

    return { verticalLines, horizontalLines, placeholders };
  };

  // 标题（防抖后）变化或随机重播时重建所有线条数据
  const { verticalLines, horizontalLines, placeholders } = useMemo(
    () => initLines(),
    [title, scale, randomizeKey]
  );

  // =====================================================================
  // 第一阶段动画：竖线 水平扩散 + 生长 + 淡入
  // - 每条竖线独立 timeline：三组动画可并行（生长/扩散从 0s，淡入按 delayAlpha 延时）
  // - 先按初始态写死 SVG 属性，再让 GSAP 接管（state 中间值 + onUpdate 写回 DOM）
  // =====================================================================
  useEffect(() => {
    // 清理上一轮的动画时间轴
    timelinesRef.current.forEach((tl) => tl.kill());
    timelinesRef.current = [];

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
      lineEl.setAttribute("stroke-width", String(SCALE));
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

      timelinesRef.current.push(tl);
    });
  }, [verticalLines, replayKey, randomizeKey, startDelay]);

  // =====================================================================
  // 第二阶段动画：横线 水平扩散跟随 + 淡入 + 生长
  // - 横线从 0s 就"提前出场"（不可见、坍缩在左端点、带父竖线的 spread），
  //   全程跟随所属竖线水平平移，到出现时刻 appearAt 才淡入 + 向左端点生长到目标点
  // - 扩散 tween 与父竖线完全一致（起始值/时长/缓动），保证水平方向严格同步
  // =====================================================================
  useEffect(() => {
    // 清理上一轮的动画时间轴
    hTimelinesRef.current.forEach((tl) => tl.kill());
    hTimelinesRef.current = [];

    const pauseAt = startDelay; // 延时播放：动画开始前的暂停秒数

    horizontalLines.forEach((line, index) => {
      const lineEl = hLineRefs.current[index];
      if (!lineEl) return;

      const lineDelay = line.delay ?? 0; // 可选延时（秒）
      // 在 HORIZON_GROWTH_WINDOW（1.5s）内完成，延时越长的横线生长越急，最终同时完成
      const growthDuration = Math.max(HORIZON_GROWTH_WINDOW - lineDelay, 0.1);
      const appearAt = PHASE_ONE_DURATION + lineDelay; // 第二阶段该线出现时刻
      const spreadOffset = line.spreadOffset ?? 0;

      // 初始状态：透明度 0、坍缩在左端点，并带上所属竖线的水平偏移
      lineEl.setAttribute("x1", String(line.x1 + spreadOffset));
      lineEl.setAttribute("y1", String(line.y1));
      lineEl.setAttribute("x2", String(line.x1 + spreadOffset));
      lineEl.setAttribute("y2", String(line.y1));
      lineEl.setAttribute("stroke-width", String(SCALE));
      lineEl.style.opacity = "0";

      // GSAP 动画对象：x1/y1 为固定锚点，x2/y2 生长到目标端点，spread 水平偏移，alpha 透明度
      const state = {
        x1: line.x1,
        y1: line.y1,
        x2: line.x1,
        y2: line.y1,
        spread: spreadOffset,
        alpha: 0,
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

      // 透明度：第二阶段出现时刻淡入（叠加延时播放）
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

      hTimelinesRef.current.push(tl);
    });
  }, [horizontalLines, replayKey, startDelay]);

  return (
    <>
      <ZoomableCanvas
        viewControlMode={viewControlMode}
        onReplay={handleReplay}
        onRandomReplay={handleRandomReplay}
      >
        <div className="h-screen w-screen flex items-center justify-center">
          <svg
            ref={svgRef}
            width={canvas.width}
            height={canvas.height}
            preserveAspectRatio="xMidYMid meet"
            // shrink-0：避免 flex 容器把超长画布压缩回视口宽度（SVG 默认裁剪到元素框，压缩后超出部分会永久丢失）
            // overflow-visible：即使个别笔画/标签略超边界也不裁剪，保证拖拽都能看到
            className="shrink-0 overflow-visible"
          >
            {/* 将坐标原点（标题几何中心）平移到画布中心 */}
            <g transform={`translate(${canvas.width / 2}, ${canvas.height / 2})`}>
              {/* 调试占位辅助：声明宽度单元格轮廓 + 实际占用强调色方块 + 字符标签 */}
              {showPlaceholders &&
                placeholders.map((p, i) => (
                  <g key={`ph-${i}`}>
                    {/* 声明占位单元格（char.width）：虚线轮廓，辅助检查字符间空隙 */}
                    <rect
                      x={p.cellX}
                      y={-VERTICAL_HEIGHT / 2}
                      width={p.cellWidth}
                      height={VERTICAL_HEIGHT}
                      fill="transparent"
                      stroke={theme.colors.primary}
                      strokeOpacity={0.25}
                      strokeDasharray="4 4"
                    />
                    {/* 实际占用 bbox：50% 强调色方块 */}
                    <rect
                      x={p.x}
                      y={p.y}
                      width={p.width}
                      height={p.height}
                      fill={theme.colors.accent}
                      fillOpacity={0.5}
                    />
                    {/* 字符标签：单元格上方，对应关系一目了然 */}
                    <text
                      x={p.cellX + p.cellWidth / 2}
                      y={-VERTICAL_HEIGHT / 2 - 6}
                      textAnchor="middle"
                      fill={theme.colors.accent}
                      fontSize={SCALE * 2}
                      fontFamily="monospace"
                    >
                      {p.char}
                    </text>
                  </g>
                ))}
              {/* 竖线：坐标/线宽/透明度均由第一阶段动画控制 */}
              {verticalLines.map((line, index) => (
                <line
                  key={line.id}
                  ref={(el) => {
                    lineRefs.current[index] = el!;
                  }}
                  stroke="#fff"
                />
              ))}
              {/* 横线：坐标由第二阶段动画控制 */}
              {horizontalLines.map((line, index) => (
                <line
                  key={line.id}
                  ref={(el) => {
                    hLineRefs.current[index] = el!;
                  }}
                  stroke="#fff"
                />
              ))}
            </g>
          </svg>
        </div>
      </ZoomableCanvas>
    </>
  );
};

export default memo(Page);
