// ========== 允许输入的字符 ==========
type Digit = `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

type UppercaseLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";
// 标题输入：** 仅允许**数字和大写字符**
type TitleInput = Digit | UppercaseLetter;

// ========== 字符结构 ==========
/** 线段定义 */
type LineType = { x1: number; y1: number; x2: number; y2: number };

/** 线段类型 */
type BasicLine = LineType & {
  /** v/h-no-ch 纵/横-编号-字符+字符内序号 */
  id: string;
};

/** 纵向线段 */
type VerticalLine = BasicLine & {
  /** 是否从上面出现（true：锚定顶部向下生长；false：锚定底部向上生长） */
  fromTop?: boolean;
  /** 初始线宽（已废弃，宽度恒定 SCALE） */
  lineWidth?: number;
  /** 水平偏移量（压缩态到布局态的位移，0~3s 内归位，见 Page.tsx computeSpread） */
  spreadOffset: number;
  /** 透明度变化延时（秒）：随机 0~0.3，让线条依次淡入 */
  delayAlpha: number;
  /** 初始高度比例 0~0.5：线条从该比例的长度开始生长（替代原来的生长延时） */
  initHeightRatio: number;
};

/** 横向线段 */
type HorizonLine = BasicLine & {
  /** 可选延迟出现时间（秒）：用于部分横线延时出现，最终与其他横线同时完成 */
  delay?: number;
  /** 水平偏移量（继承自所属竖线，0~3s 内归位） */
  spreadOffset?: number;
  /** 所属竖线的全局序号（用于计算 spreadOffset） */
  parentVIndex?: number;
};

/** 字符结构 */
type TitleChar = {
  /** 纵向线段（用于第一阶段动画） */
  vertical: LineType[];
  /**
   * 横向线段（用于第二阶段动画）
   * - delay：可选延时出现时间（秒）
   * - offsetXCoef：向左偏移系数（offsetXCoef * SCALE），消除连接处开口
   * - offsetYCoef：向上偏移系数（offsetYCoef * SCALE），校正底部对齐
   */
  horizon?: (LineType & {
    delay?: number;
    offsetXCoef?: number;
    offsetYCoef?: number;
  })[];
  /** 字符占位宽度 */
  width: number;
};
