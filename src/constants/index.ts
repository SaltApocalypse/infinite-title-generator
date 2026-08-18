/** constants 统一出口：config（滑块范围/样例）、charsets（字符集注册表）、getConstants（派生常量） */
export {
  DEFAULT_DELAY,
  DEFAULT_SCALE,
  MAX_DELAY,
  MAX_LINES,
  MAX_SCALE,
  MIN_DELAY,
  MIN_SCALE,
  SAMPLE,
} from "./config";
export { CHARSETS, DEFAULT_CHARSET, getCharset } from "./charsets";
export type { CharsetId, CharsetMetrics, TitleCharSet } from "./charsets";
export { getConstants } from "./getConstants";
export type { LSFConstants } from "./getConstants";
