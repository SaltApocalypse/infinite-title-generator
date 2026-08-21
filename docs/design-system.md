# Design System — 使用约定

本项目使用 [`@salta/theme-infinite`](https://github.com/SaltApocalypse/salta-theme-infinite) 提供的 Infinite 风格 UI 主题与组件（Theme Component Set），本文档记录使用约定。

## 主题

- 主题名：`infinite`（科幻淡蓝配色），由 daisyUI 承载，定义于 `@salta/theme-infinite`（`@plugin "daisyui/theme"`），JS 侧镜像见 `@salta/theme-infinite/tokens`。
- 入口 CSS 引入方式见 `src/index.css`。

## 组件

- 组件（`Button` / `LightButton` / `Input` / `Slider` / `Toggle` / `Dropdown` / `Sidebar` / `Tooltip`）从 `@salta/theme-infinite/components` 导入。
- 基础组件能力由 daisyUI 提供；本包组件在其上叠加 Infinite 视觉与动画。

## 配色

- 主色：能量淡蓝 `primary`（`#3dc6ff`）
- 深空背景：`base-100/200/300`（`#0b1120 / #111827 / #1f2937`）
- 完整 token 范围与 daisyUI 一致：`base / primary / secondary / accent / neutral / info / success / warning / error`（各含 `-content`）

## 按钮 / 按钮效果

- 按钮组件：`Button`（`@salta/theme-infinite/components`），基于 daisyUI `btn btn-primary`。
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
- 示例：tab 按钮图标以 `<PencilLine className="h-5 w-5" />` 方式渲染，并作为 `TabItem.icon` 传入（`Sidebar`）。
