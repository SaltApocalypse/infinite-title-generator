import {
  HEIGHT_RATIO,
  HORIZON_RATIO,
  STANDARD_SCALE,
  WIDTH_RATIO,
} from "./base";
import { DEFAULT_CHARSET, getCharset, type CharsetId } from "./charsets";
import { DEFAULT_SCALE } from "./config";

/** 按比例缩放字符集中所有坐标（坐标均为基准度量的线性组合） */
function scaleTitleChars(
  chars: Record<string, TitleChar>,
  factor: number
): Record<string, TitleChar> {
  const out: Record<string, TitleChar> = {};
  for (const [key, char] of Object.entries(chars)) {
    out[key] = {
      vertical: char.vertical.map((l) => ({
        x1: l.x1 * factor,
        y1: l.y1 * factor,
        x2: l.x2 * factor,
        y2: l.y2 * factor,
      })),
      horizon: (char.horizon ?? []).map((l) => ({
        ...l,
        x1: l.x1 * factor,
        y1: l.y1 * factor,
        x2: l.x2 * factor,
        y2: l.y2 * factor,
      })),
      width: char.width * factor,
    };
  }
  return out;
}

/** 依据 SCALE 生成的整套派生常量与字符数据 */
export interface LSFConstants {
  SCALE: number;
  VERTICAL_WIDTH: number;
  VERTICAL_HEIGHT: number;
  HORIZON_SPACE: number;
  HORIZON_PADDING: number;
  VERTICAL_PADDING: number;
  TITLE_CHARS: Record<string, TitleChar>;
}

/**
 * 根据 SCALE 与字符集构建动画所需常量（文本尺寸滑块绑定此值）。
 * 度量说明：字符集度量默认沿用全局度量（charset.metrics 预留，暂未接线）。
 */
export function getConstants(scale: number, charsetId: CharsetId = DEFAULT_CHARSET): LSFConstants {
  const factor = scale / DEFAULT_SCALE;
  const charset = getCharset(charsetId);
  const VERTICAL_WIDTH = scale * WIDTH_RATIO;
  const VERTICAL_HEIGHT = (HEIGHT_RATIO / WIDTH_RATIO) * VERTICAL_WIDTH;
  const HORIZON_WIDTH = scale * HORIZON_RATIO;
  const FORMAT_SCALE = scale / STANDARD_SCALE;
  const HORIZON_SPACE = FORMAT_SCALE * HORIZON_WIDTH * 0.6;
  const HORIZON_PADDING = HORIZON_SPACE;
  const VERTICAL_PADDING = HORIZON_PADDING;
  return {
    SCALE: scale,
    VERTICAL_WIDTH,
    VERTICAL_HEIGHT,
    HORIZON_SPACE,
    HORIZON_PADDING,
    VERTICAL_PADDING,
    TITLE_CHARS: scaleTitleChars(charset.chars, factor),
  };
}
