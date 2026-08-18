// NOTE: 优化字符集设计说明
//
// 通过参数调整优化了字符显示的具体效果，使其在视觉上舒服
import {
  BASE_HORIZON_WIDTH as HORIZON_WIDTH,
  BASE_SCALE as SCALE,
  BASE_VERTICAL_HEIGHT as VERTICAL_HEIGHT,
  BASE_VERTICAL_WIDTH as VERTICAL_WIDTH,
} from "../base";

export const optimizedChars: Record<string, TitleChar> = {
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
      {
        x1: 0,
        y1: 0,
        x2: HORIZON_WIDTH * 0.0886,
        y2: 0,
        offsetXCoef: SCALE * -0.9928,
        offsetYCoef: SCALE * -0.0746,
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
        offsetXCoef: 0.156,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.156,
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
        offsetXCoef: -0.0575,
        offsetYCoef: -0.233,
      },
      {
        x1: HORIZON_WIDTH * 0.5,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: 0,
        offsetXCoef: 0.0575,
        offsetYCoef: -0.233,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.48025,
        x2: VERTICAL_WIDTH * 0.4456,
        y2: VERTICAL_HEIGHT * 0.48025,
        offsetXCoef: -5.062,
        offsetYCoef: -0.375,
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
        x2: HORIZON_WIDTH * 0.989,
        y2: VERTICAL_HEIGHT * 0.977,
        offsetXCoef: -0.06,
        offsetYCoef: -0.2355,
      },
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
        offsetXCoef: SCALE * -0.01,
        offsetYCoef: SCALE * 0.0434,
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
    horizon: [
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.9639,
        x2: HORIZON_WIDTH * 0.0886,
        y2: VERTICAL_HEIGHT * 0.9639,
        offsetXCoef: SCALE * -0.9928,
        offsetYCoef: SCALE * -0.0748,
      },
    ],
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
        offsetXCoef: -0.0575,
        offsetYCoef: 0.233,
      },
      {
        x1: HORIZON_WIDTH * 0.5,
        y1: VERTICAL_HEIGHT * 0.5,
        x2: HORIZON_WIDTH,
        y2: VERTICAL_HEIGHT,
        offsetXCoef: 0.0575,
        offsetYCoef: 0.233,
      },
      {
        x1: 0,
        y1: VERTICAL_HEIGHT * 0.48025,
        x2: VERTICAL_WIDTH * 0.4456,
        y2: VERTICAL_HEIGHT * 0.48025,
        offsetXCoef: -5.062,
        offsetYCoef: -0.44,
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
        x1: HORIZON_WIDTH - SCALE * 0.4445,
        y1: SCALE * 0.77,
        x2: SCALE * 0.443,
        y2: VERTICAL_HEIGHT - SCALE * 0.76775,
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
