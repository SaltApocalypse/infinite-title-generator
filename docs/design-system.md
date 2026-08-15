# Design System — LightSciFi

本设计系统为「Halo Infinite 灵感同人」项目开发。

## 命名约定

- **LSF（Light Sci-Fi）**：本项目轻量科幻风格的前缀。所有自定义组件统一以 `LSF` 开头命名（如 `LSFButton`），文件描述标注「Light Sci-Fi」，以标识这是本项目的风格，而非第三方/官方样式。
- **LightSciFi**：设计系统主题名，配色 token 基于 daisyUI 承载，定义于 `src/index.css`（`@plugin "daisyui/theme"`），JS 侧镜像见 `src/theme/tokens.ts`。

## 配色

- 主色：能量淡蓝 `primary`（`#3dc6ff`）
- 深空背景：`base-100/200/300`（`#0b1120 / #111827 / #1f2937`）
- 完整 token 范围与 daisyUI 一致：`base / primary / secondary / accent / neutral / info / success / warning / error`（各含 `-content`）

## 按钮 / 按钮效果

- 自定义按钮组件：`LSFButton`（`src/components/ui/LSFButton.tsx`），基于 daisyUI `btn btn-primary`。
- 边框装饰：`[ 按钮 ]` 括号风格 —— 左右贯穿竖线 + 上下两端水平“出头”；hover 时上下边缘从两端向中间连起。
- **Hover 效果约定：所有按钮/按钮效果组件的 hover，底色叠加 10% 白色变亮**。
    - 实现方式（覆盖 daisyUI 默认暗化）：
        ```
        hover:[--btn-bg:color-mix(in_oklab,var(--color-primary)_90%,white)]
        ```
    - 即 `90% 主色 + 10% 白色`，使 hover 时按钮变亮；文字颜色保持不变（`primary-content`）。
- **Hover 动画时长约定：所有按钮/按钮效果组件的 hover 过渡统一为 `500ms`**。
    - 装饰线条（括号、出头、上下边缘）使用 `transition-all duration-500 ease-out`；
    - 按钮本身使用 `duration-500`，覆盖 daisyUI 默认的 `200ms`，使底色变亮与线条动画节奏一致。

## 图标（Lucide）

- 图标统一使用 `lucide-react`。
- **一律以组件（Icon）形式使用，组件名使用 Icon 版本**（如 `PencilLine`、`Settings`、`Info`），以便与普通文本/内容区分，避免直接写图标名称字符串。
- 示例：tab 按钮图标以 `<PencilLine className="h-5 w-5" />` 方式渲染，并作为 `LSFTabItem.icon` 传入。
