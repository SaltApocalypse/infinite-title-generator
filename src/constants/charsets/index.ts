import { basicChars } from "./basic";
import { optimizedChars } from "./optimized";

/** 字符集 id（设置页下拉选择，映射到 getConstants 的 charsetId） */
export type CharsetId = "basic" | "optimized";

/**
 * 字符集可选的独立度量（预留）：
 * 未来某套字符若想使用与全局不同的度量（如更窄的字符格），在此提供
 * BASE_SCALE 下的基准值，getConstants 将优先采用；缺省时沿用全局度量。
 */
export interface CharsetMetrics {
  VERTICAL_WIDTH: number;
  VERTICAL_HEIGHT: number;
  HORIZON_WIDTH: number;
}

/** 一套字符集：chars 在基准度量（BASE_SCALE）下书写，getConstants 统一缩放 */
export interface TitleCharSet {
  id: CharsetId;
  /** i18n key（settings.font.modes.*） */
  labelKey: string;
  /** 字符定义 */
  chars: Record<string, TitleChar>;
  /** 预留：本字符集独有的度量（暂未接线，均使用全局度量） */
  metrics?: CharsetMetrics;
}

/** 字符集注册表：新增字符集时在此登记即可 */
export const CHARSETS: TitleCharSet[] = [
  { id: "basic", labelKey: "font.modes.basic", chars: basicChars },
  { id: "optimized", labelKey: "font.modes.optimized", chars: optimizedChars },
];

/** 默认字符集 */
export const DEFAULT_CHARSET: CharsetId = "basic";

/** 按 id 取字符集（未知 id 回退到默认集） */
export function getCharset(id: CharsetId): TitleCharSet {
  return CHARSETS.find((set) => set.id === id) ?? CHARSETS[0];
}
