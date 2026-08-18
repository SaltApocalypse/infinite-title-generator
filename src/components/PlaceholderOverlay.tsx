import { theme } from "../theme";
import type { PlaceholderRect } from "../lib/buildTitle";

/**
 * 调试占位辅助层：为每个字符渲染
 * - 声明占位单元格（char.width）：虚线轮廓，辅助检查字符间空隙
 * - 实际占用 bbox：50% 强调色方块
 * - 字符标签：单元格上方，对应关系一目了然
 */
interface PlaceholderOverlayProps {
  placeholders: PlaceholderRect[];
  /** 字符单元格高度（VERTICAL_HEIGHT，用于轮廓与标签定位） */
  verticalHeight: number;
  /** 线宽 SCALE（标签字号） */
  scale: number;
}

export function PlaceholderOverlay({
  placeholders,
  verticalHeight,
  scale,
}: PlaceholderOverlayProps) {
  return (
    <>
      {placeholders.map((p, i) => (
        <g key={`ph-${i}`}>
          {/* 声明占位单元格（char.width）：虚线轮廓，辅助检查字符间空隙（y 取所在行的 cellY） */}
          <rect
            x={p.cellX}
            y={p.cellY}
            width={p.cellWidth}
            height={verticalHeight}
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
            y={p.cellY - 6}
            textAnchor="middle"
            fill={theme.colors.accent}
            fontSize={scale * 2}
            fontFamily="monospace"
          >
            {p.char}
          </text>
        </g>
      ))}
    </>
  );
}
