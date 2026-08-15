/**
 * 设计系统 SaltaSciFi 的配色 token（与 src/index.css 中 @theme 保持一致）
 *
 * 命名与 daisyui 主题编辑器的配色范围一致，供无法使用 Tailwind 工具类的场景引用：
 * SVG 描边/填充、GSAP 动画、内联样式等。修改配色时请同时同步 @theme 与这里。
 */
export const theme = {
  colors: {
    /* 基础表面 */
    base100: "#0b1120",
    base200: "#111827",
    base300: "#1f2937",
    baseContent: "#d7f5ff",
    /* 主色：能量淡蓝 */
    primary: "#3dc6ff",
    primaryContent: "#08101e",
    /* 副色：传感器青 */
    secondary: "#5eead4",
    secondaryContent: "#04211c",
    /* 强调：电感紫 */
    accent: "#818cf8",
    accentContent: "#0d1024",
    /* 中性 */
    neutral: "#8b98a8",
    neutralContent: "#0a1018",
    /* 状态色 */
    info: "#38bdf8",
    infoContent: "#082f49",
    success: "#4ade80",
    successContent: "#052e16",
    warning: "#fbbf24",
    warningContent: "#451a03",
    error: "#f87171",
    errorContent: "#450a0a",
  },
} as const;

export type ThemeColorName = keyof typeof theme.colors;
