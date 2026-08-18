import { computeSpread } from "./spread";

/**
 * ============================================================================
 * 标题线条数据生成（纯函数，无副作用）
 * ============================================================================
 *
 * 【坐标系约定】
 *  - 所有线段坐标以"整条标题的几何中心"为原点 (0,0)：
 *    x ∈ [-内容宽/2, +内容宽/2]，y ∈ [-VERTICAL_HEIGHT/2, +VERTICAL_HEIGHT/2]。
 *    数据生成时先按绝对坐标从左往右铺排，最后统一平移到几何中心。
 *  - SVG 内用 <g transform="translate(canvas.width/2, canvas.height/2)"> 把原点摆到画布中心
 *    （画布本身也是中心对称预留了扩散空间）。
 *  - 画布宽度额外预留 maxSpread（最大水平偏移），避免扩散起始态被 SVG 裁剪。
 *
 * 【生成流程 buildTitleLines】
 *    1) 遍历输入字符，从字符集取竖线/横线定义，叠加全局 X 推进生成绝对坐标；
 *    2) 计算每根竖线的 spreadOffset（由全局序号相对中心确定方向与距离，见 computeSpread）；
 *    3) 横线按"左端点 x1 最近的竖线"作为父线，记录 parentVIndex 并继承其 spreadOffset；
 *    4) 所有坐标平移到标题几何中心，并按 maxSpread 计算画布尺寸。
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
  /** 实际占用 bbox（已按线宽 SCALE 扩展） */
  x: number;
  y: number;
  width: number;
  height: number;
}

/** buildTitleLines 入参：由 getConstants(scale, charsetId) 提供的派生常量 */
export interface BuildTitleInput {
  /** 标题文本 */
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
  } = input;

  if (!title) {
    return { verticalLines: [], horizontalLines: [], placeholders: [], canvas: { width: 0, height: 0 } };
  }

  let gVerIndex = 0; // 竖线全局序号（决定 fromTop 交替方向）
  let hIndex = 0; // 横线全局序号
  let gVerX = HORIZON_PADDING; // 当前字符的全局起始 X 坐标

  const verticalLines: VerticalLine[] = [];
  const horizontalLines: HorizonLine[] = [];
  const placeholders: PlaceholderRect[] = [];

  title.split("").forEach((ch) => {
    const char = chars[ch];
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

  return {
    verticalLines,
    horizontalLines,
    placeholders,
    canvas: {
      width: gVerX + 2 * (HORIZON_PADDING + maxSpread),
      height: VERTICAL_HEIGHT + 2 * VERTICAL_PADDING,
    },
  };
}
