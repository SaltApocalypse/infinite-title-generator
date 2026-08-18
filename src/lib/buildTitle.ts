import { computeSpread } from "./spread";

/**
 * ============================================================================
 * 标题线条数据生成（纯函数，无副作用）
 * ============================================================================
 *
 * 【坐标系约定】
 *  - 所有线段坐标以"整块标题的几何中心"为原点 (0,0)：
 *    x ∈ [-最宽行/2, +最宽行/2]，y ∈ [-总高/2, +总高/2]。
 *    数据生成时先按绝对坐标逐行铺排，最后每行居中、整体 y 平移到几何中心。
 *  - SVG 内用 <g transform="translate(canvas.width/2, canvas.height/2)"> 把原点摆到画布中心
 *    （画布本身也是中心对称预留了扩散空间）。
 *  - 画布宽度额外预留 maxSpread（最大水平偏移），避免扩散起始态被 SVG 裁剪。
 *
 * 【多行布局 buildTitleLines】
 *    1) 输入 title 按 \n 拆行（空行过滤，不占行）；
 *    2) 逐行从 HORIZON_PADDING 独立推进 X，y 基准 = 行号 × (VERTICAL_HEIGHT + VERTICAL_SPACE)；
 *    3) 行内后处理：整行平移到自身中心（各行对齐同一中心 0）；
 *    4) 水平扩散按「行内」计算（每行独立从自身中心压缩展开），横线继承所属竖线偏移；
 *    5) 所有坐标按整块总高做 y 居中，并按 maxLineWidth / maxSpread 计算画布尺寸。
 * ============================================================================
 */

/** 调试用：单字符占位信息（坐标为全局绝对坐标，未做中心平移，见 buildTitleLines 后处理） */
export interface PlaceholderRect {
  /** 字符 */
  char: string;
  /** 声明占位单元格左边缘（char.width 声明范围） */
  cellX: number;
  /** 声明占位宽度 */
  cellWidth: number;
  /** 声明占位单元格顶部 y（整行字符格高度 = VERTICAL_HEIGHT） */
  cellY: number;
  /** 实际占用 bbox（已按线宽 SCALE 扩展） */
  x: number;
  y: number;
  width: number;
  height: number;
}

/** buildTitleLines 入参：由 getConstants(scale, charsetId) 提供的派生常量 */
export interface BuildTitleInput {
  /** 标题文本（多行以 \n 分隔） */
  title: string;
  /** 字符集（已按 scale 缩放） */
  chars: Record<string, TitleChar>;
  /** 线宽 SCALE */
  SCALE: number;
  VERTICAL_WIDTH: number;
  VERTICAL_HEIGHT: number;
  HORIZON_SPACE: number;
  HORIZON_PADDING: number;
  VERTICAL_PADDING: number;
  /** 多行行距（= VERTICAL_HEIGHT * 0.5） */
  VERTICAL_SPACE: number;
}

export interface BuildTitleResult {
  verticalLines: VerticalLine[];
  horizontalLines: HorizonLine[];
  placeholders: PlaceholderRect[];
  /** 画布尺寸（SVG width/height） */
  canvas: { width: number; height: number };
}

/** 依据标题文本生成全部线条与占位数据（标题为空时返回空结果） */
export function buildTitleLines(input: BuildTitleInput): BuildTitleResult {
  const {
    title,
    chars,
    SCALE,
    VERTICAL_WIDTH,
    VERTICAL_HEIGHT,
    HORIZON_SPACE,
    HORIZON_PADDING,
    VERTICAL_PADDING,
    VERTICAL_SPACE,
  } = input;

  if (!title) {
    return { verticalLines: [], horizontalLines: [], placeholders: [], canvas: { width: 0, height: 0 } };
  }

  // 空行（首尾/连续换行产生的）不占行，直接过滤
  const lines = title.split("\n").filter((line) => line.length > 0);
  if (lines.length === 0) {
    return { verticalLines: [], horizontalLines: [], placeholders: [], canvas: { width: 0, height: 0 } };
  }
  const lineHeight = VERTICAL_HEIGHT + VERTICAL_SPACE; // 每行占位高度（字符高 + 行距）
  const blockHeight = lines.length * VERTICAL_HEIGHT + (lines.length - 1) * VERTICAL_SPACE; // 整块总高

  const verticalLines: VerticalLine[] = [];
  const horizontalLines: HorizonLine[] = [];
  const placeholders: PlaceholderRect[] = [];
  let gVerIndex = 0; // 竖线全局序号（fromTop 交替方向，跨行连续）
  let hIndex = 0; // 横线全局序号
  let maxLineWidth = 0; // 最宽行（决定画布宽度）
  let maxSpread = 0; // 全局最大水平偏移

  lines.forEach((lineText, row) => {
    // 空行已在上方过滤，此处仅防御
    if (!lineText) return;

    const rowY = row * lineHeight; // 本行 y 基准
    const lineVStart = verticalLines.length; // 本行竖线在全局数组中的起始索引（parentVIndex 溯源）
    const lineVertical: VerticalLine[] = [];
    const lineHorizon: HorizonLine[] = [];
    const linePh: PlaceholderRect[] = [];
    let lineX = HORIZON_PADDING; // 本行当前字符的起始 X

    lineText.split("").forEach((ch) => {
      const char = chars[ch];
      // 未定义的字符：仅推进间距，不生成线条
      if (!char) {
        lineX += HORIZON_SPACE;
        return;
      }

      const ver = char.vertical ?? [];
      const hor = char.horizon ?? [];
      const charVStart = lineVertical.length; // 本字符竖线在本行数组中的起始索引（父线溯源用）

      // ===== 生成竖线：叠加行内 X 与行偏移，附加随机动画参数 =====
      ver.forEach((line, index) => {
        lineVertical.push({
          id: `v-${gVerIndex}-${ch}${index}`,
          x1: lineX + line.x1,
          y1: rowY + line.y1,
          x2: lineX + line.x2,
          y2: rowY + line.y2,
          fromTop: gVerIndex % 2 === 1, // 奇偶交替：偶数从上向下生长，奇数从下向上生长
          initHeightRatio: Math.random() * 0.1, // 初始高度比例 0~0.1：线条从该比例长度开始生长
          delayAlpha: Math.random() * 0.3, // 透明度变化延时（秒）
          spreadOffset: 0,
        });
        gVerIndex++;
      });

      // ===== 生成横线：叠加行内 X 与行偏移，并应用 offsetXCoef/offsetYCoef 消除连接开口 =====
      hor.forEach((line, index) => {
        const offset = (line.offsetXCoef ?? 0) * SCALE; // 向左偏移 = 系数 * 线宽
        const offsetY = (line.offsetYCoef ?? 0) * SCALE; // 向上偏移 = 系数 * 线宽
        // 父竖线：行内与横线左端点 x1 最近的那根竖线（横线锚定 x1 生长，跟随其水平偏移）
        let parentLocal = -1;
        let bestDist = Infinity;
        ver.forEach((v, vi) => {
          const d = Math.abs(v.x1 - line.x1);
          if (d < bestDist) {
            bestDist = d;
            parentLocal = vi;
          }
        });
        lineHorizon.push({
          id: `h-${hIndex}-${ch}${index}`,
          x1: lineX + line.x1 - offset,
          y1: rowY + line.y1 - offsetY,
          x2: lineX + line.x2 - offset,
          y2: rowY + line.y2 - offsetY,
          delay: line.delay ?? 0, // 可选延时出现（秒）
          parentVIndex: parentLocal >= 0 ? lineVStart + charVStart + parentLocal : undefined,
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
        includePoint(lineX + l.x1, rowY + l.y1);
        includePoint(lineX + l.x2, rowY + l.y2);
      });
      hor.forEach((l) => {
        const offX = (l.offsetXCoef ?? 0) * SCALE; // 与生成横线时一致的向左偏移
        const offY = (l.offsetYCoef ?? 0) * SCALE; // 与生成横线时一致的向上偏移
        includePoint(lineX + l.x1 - offX, rowY + l.y1 - offY);
        includePoint(lineX + l.x2 - offX, rowY + l.y2 - offY);
      });
      const pad = SCALE / 2; // 线宽 SCALE 向两端各延伸一半，纳入实际占用范围
      linePh.push({
        char: ch,
        cellX: lineX,
        cellWidth: char.width,
        cellY: rowY,
        x: pMinX - pad,
        y: pMinY - pad,
        width: pMaxX - pMinX + SCALE,
        height: pMaxY - pMinY + SCALE,
      });

      // 推进到下一个字符的起始 X：字符宽度 + 字符间距
      lineX += char.width + HORIZON_SPACE;
    });

    // ===== 行内后处理：整行居中 + 行内独立扩散 =====
    const lineWidth = lineX; // 本行推进终点（含尾部间距，仅用于居中/画布）
    const shiftX = -(lineWidth / 2); // 每行对齐自身中心（各行共享同一中心 0）
    lineVertical.forEach((l) => {
      l.x1 += shiftX;
      l.x2 += shiftX;
    });
    lineHorizon.forEach((h) => {
      h.x1 += shiftX;
      h.x2 += shiftX;
    });
    linePh.forEach((p) => {
      p.cellX += shiftX;
      p.x += shiftX;
    });

    // 行内扩散：由行内竖线序号相对行中心确定方向与距离
    const lineVCount = lineVertical.length;
    lineVertical.forEach((l, j) => {
      l.spreadOffset = computeSpread(j, lineVCount, VERTICAL_WIDTH);
    });
    // 横线继承所属竖线的水平偏移（无父竖线如 Z 为 0）
    lineHorizon.forEach((h) => {
      h.spreadOffset =
        h.parentVIndex != null ? (lineVertical[h.parentVIndex - lineVStart]?.spreadOffset ?? 0) : 0;
    });

    maxLineWidth = Math.max(maxLineWidth, lineWidth);
    lineVertical.forEach((l) => {
      maxSpread = Math.max(maxSpread, Math.abs(l.spreadOffset));
    });

    verticalLines.push(...lineVertical);
    horizontalLines.push(...lineHorizon);
    placeholders.push(...linePh);
  });

  // ===== 全局后处理：y 平移到整块几何中心 =====
  const contentCenterY = blockHeight / 2;
  verticalLines.forEach((l) => {
    l.y1 -= contentCenterY;
    l.y2 -= contentCenterY;
  });
  horizontalLines.forEach((h) => {
    h.y1 -= contentCenterY;
    h.y2 -= contentCenterY;
  });
  placeholders.forEach((p) => {
    p.cellY -= contentCenterY;
    p.y -= contentCenterY;
  });

  return {
    verticalLines,
    horizontalLines,
    placeholders,
    canvas: {
      width: maxLineWidth + 2 * (HORIZON_PADDING + maxSpread),
      height: blockHeight + 2 * VERTICAL_PADDING,
    },
  };
}
