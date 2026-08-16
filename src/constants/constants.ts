// 这三参考自 SeekLogo 网站下载的矢量图标
export const WIDTH_RATIO = 1.7257; // （竖直）宽比例
export const HEIGHT_RATIO = 20.6635; // （竖直）高比例
export const HORIZON_RATIO = 10.8934; // （水平）宽比例

/** 默认 SCALE（TITLE_CHARS 基于此构建），可通过 getConstants 按比例缩放 */
export const DEFAULT_SCALE = 5;
/** SCALE 可调范围（文本尺寸滑块） */
export const MIN_SCALE = 1;
export const MAX_SCALE = 10;
/** 延时播放（动画开始/重播/随机重播前的暂停秒数）范围 */
export const MIN_DELAY = 0;
export const MAX_DELAY = 2;
export const DEFAULT_DELAY = 2;
const SCALE = DEFAULT_SCALE;

const STANDARD_SCALE = 3; // 基准尺寸

/** 竖直宽度（基准） */
const VERTICAL_WIDTH = SCALE * WIDTH_RATIO;
/** 竖直高度（基准） */
const VERTICAL_HEIGHT = (HEIGHT_RATIO / WIDTH_RATIO) * VERTICAL_WIDTH;
/** 水平宽度（基准） */
const HORIZON_WIDTH = SCALE * HORIZON_RATIO;

export const INITIAL_HEIGHT = VERTICAL_HEIGHT * 0.4; // 初始高度
export const OFFSET_RATIO = 0.05; // 终点偏移

/** 秒/毫秒 */
const MILLISECONDS = 1000;
/** 竖直动画时长 2s 0~2 */
export const VERTICAL_ANIM_DURATION = 2000 / MILLISECONDS;
/** 横向动画时长 1s 1~2 */
export const HORIZON_ANIM_DURATION = 1000 / MILLISECONDS;

/** 测试样例 */
export const SAMPLE = "INFINITE";

/**
 * 字符设定组
 * 每条横线（horizon）可配置：
 *   - delay：可选延时出现时间（秒），与其他横线同时完成
 *   - offsetXCoef：向左偏移系数（offsetXCoef * SCALE）
 *   - offsetYCoef：向上偏移系数（offsetYCoef * SCALE）
 */
export const TITLE_CHARS: Record<string, TitleChar> = {
  A: {
    vertical: [
      {
        x1: HORIZON_WIDTH * 0.5,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH * 0.5,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: HORIZON_WIDTH * 0.25,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH * 0.25 * 3,
        y2: VERTICAL_HEIGHT * 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  B: {
    vertical: [
      {
        x1: HORIZON_WIDTH * 0.25,
        y1: 0,
        x2: HORIZON_WIDTH * 0.25,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: HORIZON_WIDTH * 0.25,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
        delay: 0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  C: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  D: {
    vertical: [
      {
        x1: HORIZON_WIDTH * 0.25,
        y1: 0,
        x2: HORIZON_WIDTH * 0.25,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  // NOTE:
  // E：三条横线示例
  // - 全部横线向左偏移 0.5 * SCALE，消除与竖线连接处的开口
  // - 中间最短横线额外 delay 0.5s 延时出现
  E: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH * 0.8,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
        delay: 0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  F: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH * 0.8,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  G: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: HORIZON_WIDTH * 0.5,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
        delay: 0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  H: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  I: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [],
    width: SCALE,
  },
  J: {
    vertical: [
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  K: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: 0,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
      },
    ],
    width: HORIZON_WIDTH,
  },
  L: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  M: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH * 0.5,
        y2: VERTICAL_HEIGHT * 0.5,
      },
      {
        x1: HORIZON_WIDTH * 0.5,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: 0,
      },
    ],
    width: HORIZON_WIDTH,
  },
  N: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
      },
      // {
      //   x1: 0,
      //   y1: 0,
      //   x2: 0.99 * HORIZON_WIDTH,
      //   y2: 0.975 * VERTICAL_HEIGHT,
      //   offsetXCoef: -0.05,
      //   offsetYCoef: -0.25,
      // },
    ],
    width: HORIZON_WIDTH,
  },
  O: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  P: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT * 0.5,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  Q: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
      {
        x1: (HORIZON_WIDTH - SCALE) * 0.5,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    width: HORIZON_WIDTH,
  },
  R: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT * 0.5,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
      },
      {
        x1: (HORIZON_WIDTH - SCALE) * 0.5,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    width: HORIZON_WIDTH,
  },
  S: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT * 0.5,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  T: {
    vertical: [
      {
        x1: HORIZON_WIDTH * 0.5,
        y1: 0,
        x2: HORIZON_WIDTH * 0.5,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetYCoef: -0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },

  U: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  V: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH * 0.5,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH,
        y1: 0,
        x2: HORIZON_WIDTH * 0.5,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [],
    width: HORIZON_WIDTH,
  },
  W: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH * 0.5,
        y2: VERTICAL_HEIGHT * 0.5,
      },
      {
        x1: HORIZON_WIDTH * 0.5,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
      },
    ],
    width: HORIZON_WIDTH,
  },
  X: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [],
    width: HORIZON_WIDTH,
  },
  Y: {
    vertical: [
      {
        x1: HORIZON_WIDTH * 0.5,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH * 0.5,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH * 0.5,
        y2: VERTICAL_HEIGHT * 0.5,
      },
      {
        x1: HORIZON_WIDTH,
        y1: 0,
        x2: HORIZON_WIDTH * 0.5,
        y2: VERTICAL_HEIGHT * 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  Z: {
    vertical: [],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: HORIZON_WIDTH - SCALE * 0.5,
        y1: SCALE * 0.5,
        x2: SCALE * 0.5,
        y2: VERTICAL_HEIGHT - SCALE * 0.5,
        offsetXCoef: 0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  0: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
      {
        x1: HORIZON_WIDTH - SCALE * 0.5,
        y1: SCALE * 0.5,
        x2: SCALE * 0.5,
        y2: VERTICAL_HEIGHT - SCALE * 0.5,
        offsetXCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  1: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [],
    width: SCALE,
  },
  2: {
    vertical: [
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT * 0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
        delay: 0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  3: {
    vertical: [
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: HORIZON_WIDTH * 0.2,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
        delay: 0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  4: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT * 0.5,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  5: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT * 0.5,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH * 0.8,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
        delay: 0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  6: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
        delay: 0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  7: {
    vertical: [
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  8: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
        delay: 0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
  9: {
    vertical: [
      {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: VERTICAL_HEIGHT * 0.5,
      },
      {
        x1: HORIZON_WIDTH - SCALE,
        y1: 0,
        x2: HORIZON_WIDTH - SCALE,
        y2: VERTICAL_HEIGHT,
      },
    ],
    horizon: [
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.5,
        offsetYCoef: -0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT * 0.5,
        offsetXCoef: 0.5,
        delay: 0.5,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.5,
        offsetYCoef: 0.5,
      },
    ],
    width: HORIZON_WIDTH,
  },
};

/** 按比例缩放 TITLE_CHARS 中所有坐标（坐标均为 SCALE 的线性组合） */
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

/** 根据 SCALE 构建动画所需常量（文本尺寸滑块绑定此值） */
export function getConstants(scale: number): LSFConstants {
  const factor = scale / DEFAULT_SCALE;
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
    TITLE_CHARS: scaleTitleChars(TITLE_CHARS, factor),
  };
}
