import { DEFAULT_SCALE } from "./config";

// 这三参考自 SeekLogo 网站下载的矢量图标
export const WIDTH_RATIO = 1.7257; // （竖直）宽比例
export const HEIGHT_RATIO = 20.6635; // （竖直）高比例
export const HORIZON_RATIO = 10.8934; // （水平）宽比例

/**
 * 基准度量：字符集定义在 DEFAULT_SCALE 下构建，getConstants 再按 scale 统一缩放。
 * 字符集文件（charsets/*）引用这些基准值书写坐标。
 */
export const BASE_SCALE = DEFAULT_SCALE;
export const BASE_VERTICAL_WIDTH = BASE_SCALE * WIDTH_RATIO;
export const BASE_VERTICAL_HEIGHT = (HEIGHT_RATIO / WIDTH_RATIO) * BASE_VERTICAL_WIDTH;
export const BASE_HORIZON_WIDTH = BASE_SCALE * HORIZON_RATIO;
