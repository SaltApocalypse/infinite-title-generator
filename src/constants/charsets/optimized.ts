// NOTE: 优化字符集（暂为占位）——目前复用基本字符集的字形，
// 待字体结构精调设计完成后替换为独立定义（结构见 charsets/index.ts 的 TitleCharSet.metrics 预留）
import { basicChars } from "./basic";

export const optimizedChars: Record<string, TitleChar> = { ...basicChars };
