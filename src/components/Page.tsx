import { memo, useMemo, useRef, useState } from "react";

import type { CharsetId } from "../constants";
import { DEFAULT_CHARSET, DEFAULT_DELAY, DEFAULT_SCALE, getConstants } from "../constants";
import { useHorizontalAnimation } from "../hooks/useHorizontalAnimation";
import { useVerticalAnimation } from "../hooks/useVerticalAnimation";
import { buildTitleLines } from "../lib/buildTitle";
import { PlaceholderOverlay } from "./PlaceholderOverlay";
import ZoomableCanvas, { type ViewControlMode } from "./ZoomableCanvas";

/**
 * ============================================================================
 * Halo Infinite 风格标题动画（Page 组件）—— 编排层
 * ============================================================================
 *
 * 职责划分（模块化拆分后各司其职，详见各文件头部注释）：
 *  - 常量/字符集：src/constants/（config / base / charsets / getConstants）
 *  - 线条数据生成：src/lib/buildTitle.ts（buildTitleLines，纯函数）
 *  - 动画执行：src/hooks/useVerticalAnimation.ts（竖线：扩散+生长+淡入）
 *              src/hooks/useHorizontalAnimation.ts（横线：扩散跟随+淡入+生长）
 *  - 动画时长：src/lib/animTiming.ts
 *  - 调试占位辅助：src/components/PlaceholderOverlay.tsx
 *
 * 本组件仅做编排：取常量 → 生成线条数据 → 驱动两个动画 hook → 渲染 SVG。
 *
 * 动画分镜概览（总时长 3s，可叠加 startDelay 延时播放）：
 *   时间轴  |----0s----1s----2s----3s----|
 *   竖线生长 |██████████                  |  生长 + 淡入（第 0.7s 前完成）
 *   横线生长 |          ████████████████   |  第 1s 起，0~1.5s 内完成
 *   水平扩散 |███████████████████████████  |  全程 3s，压缩态向外展开
 * ============================================================================
 */

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
  /** 字符集（设置页「字体结构」选择），默认 DEFAULT_CHARSET */
  charsetId?: CharsetId;
  /** 调试·笔画拆解：竖线纯黄、横线纯蓝、透明度固定 50%（便于查看线条结构） */
  strokeSplit?: boolean;
}

const Page: React.FC<PageProps> = ({
  title,
  scale = DEFAULT_SCALE,
  showPlaceholders = false,
  viewControlMode = "full",
  startDelay = DEFAULT_DELAY,
  charsetId = DEFAULT_CHARSET,
  strokeSplit = false,
}) => {
  // ========== DOM 引用 ==========
  const lineRefs = useRef<SVGLineElement[]>([]); // 竖线元素数组（索引与 verticalLines 对应）
  const hLineRefs = useRef<SVGLineElement[]>([]); // 横线元素数组（索引与 horizontalLines 对应）

  // ========== SVG 画布尺寸 ==========
  const [canvas, setCanvas] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // ===== 重播/随机重播计数（用于视图控制浮层的按钮） =====
  // replayKey：仅重播动画，数据（含随机参数）保持不变
  // randomizeKey：重新生成线条数据（随机参数变化）并重播动画
  const [replayKey, setReplayKey] = useState(0);
  const [randomizeKey, setRandomizeKey] = useState(0);
  const handleReplay = () => setReplayKey((k) => k + 1);
  const handleRandomReplay = () => setRandomizeKey((k) => k + 1);

  // ========== 依据 scale 与字符集生成动画常量（TITLE_CHARS 等随文本尺寸缩放） ==========
  const {
    SCALE,
    VERTICAL_WIDTH,
    VERTICAL_HEIGHT,
    HORIZON_SPACE,
    HORIZON_PADDING,
    VERTICAL_PADDING,
    VERTICAL_SPACE,
    TITLE_CHARS,
  } = useMemo(() => getConstants(scale, charsetId), [scale, charsetId]);

  // ========== 标题（防抖后）变化或随机重播时重建所有线条数据 ==========
  const { verticalLines, horizontalLines, placeholders } = useMemo(() => {
    const result = buildTitleLines({
      title,
      chars: TITLE_CHARS,
      SCALE,
      VERTICAL_WIDTH,
      VERTICAL_HEIGHT,
      HORIZON_SPACE,
      HORIZON_PADDING,
      VERTICAL_PADDING,
      VERTICAL_SPACE,
    });
    setCanvas(result.canvas);
    return result;
  }, [
    title,
    TITLE_CHARS,
    SCALE,
    VERTICAL_WIDTH,
    VERTICAL_HEIGHT,
    HORIZON_SPACE,
    HORIZON_PADDING,
    VERTICAL_PADDING,
    VERTICAL_SPACE,
    randomizeKey,
  ]);

  // ========== 动画执行（两个阶段，各自维护时间轴清理） ==========
  useVerticalAnimation({
    verticalLines,
    lineRefs,
    scale: SCALE,
    startDelay,
    replayKey,
    randomizeKey,
    strokeSplit,
  });
  useHorizontalAnimation({
    horizontalLines,
    lineRefs: hLineRefs,
    scale: SCALE,
    startDelay,
    replayKey,
    strokeSplit,
  });

  return (
    <ZoomableCanvas
      viewControlMode={viewControlMode}
      onReplay={handleReplay}
      onRandomReplay={handleRandomReplay}
    >
      <div className="h-screen w-screen flex items-center justify-center">
        <svg
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
            {showPlaceholders && (
              <PlaceholderOverlay
                placeholders={placeholders}
                verticalHeight={VERTICAL_HEIGHT}
                scale={SCALE}
              />
            )}
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
  );
};

export default memo(Page);
