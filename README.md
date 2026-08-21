# Infinite Title Generator

Halo Infinite 风格 SVG 标题动画生成器（粉丝同人实验项目）。

在线体验：<https://lab.salta.top/infinite-title-generator/>

## 技术栈

- Vite + React 19（纯客户端静态 SPA，无 SSR）
- TanStack Router（文件路由，`basepath` 挂在子路径）
- GSAP（动画）
- Tailwind CSS v4 + daisyUI 5（主题与组件由 [`@salta/theme-infinite`](https://github.com/SaltApocalypse/salta-theme-infinite) 提供）
- i18next / react-i18next（国际化）
- lucide-react（图标）

## 命令

```bash
pnpm install   # 安装依赖
pnpm dev       # 开发：http://localhost:3000/infinite-title-generator/
pnpm build     # 生产构建：产出 dist/index.html + dist/assets
pnpm preview   # 本地预览构建产物
pnpm fix       # eslint --fix + prettier --write
```

## 使用指南

- **标题**：输入标题文本
- **设置**：切换语言与视图控制模式
- **视图控制浮层**（右上角）：滚轮缩放、按住拖拽平移、固定画布、重播动画

## 架构与目录结构

```text
src/
├── components/
│   ├── Page.tsx              # 核心：标题动画（SVG + GSAP）
│   ├── ZoomableCanvas.tsx    # 可缩放/平移画布容器 + 视图控制浮层
│   └── PlaceholderOverlay.tsx# 调试：字符占位辅助
├── constants/                # 动画常量与字符集（config/base/charsets/getConstants）
├── hooks/                    # 两阶段动画 effect（GSAP）
├── i18n/                     # i18next 配置与 en/zh 文案
├── lib/                      # 纯逻辑：buildTitle / spread / animTiming
├── routes/                   # TanStack Router 文件路由
└── types/                    # 类型定义
```

## 设计系统

Infinite 风格的 UI 主题与组件（`Button`/`Toggle`/`Sidebar` 等 Theme Component Set）由 [`@salta/theme-infinite`](https://github.com/SaltApocalypse/salta-theme-infinite) 提供：项目入口 CSS 引入主题，组件从 `@salta/theme-infinite/components` 导入。详见 [`docs/design-system.md`](docs/design-system.md)。

## 动画实现

动画的坐标系、时间轴与数据生成逻辑见 [`src/components/Page.tsx`](src/components/Page.tsx) 头部注释：线段坐标以整条标题的几何中心为原点，竖线/横线分段生长并全程水平扩散；「延时播放」会整体平移所有时间轴位置。

## 部署

构建产物 `dist/` 是纯静态文件，可部署到 `https://lab.salta.top/infinite-title-generator/`：

- 将 `dist/` 内容放入站点根目录下的 `infinite-title-generator/` 目录即可直接访问；
- 或使用 nginx：

```nginx
location /infinite-title-generator/ {
  alias /path/to/dist/;
  try_files $uri $uri/ =404;
}
```

资源引用与路由 `basepath` 均已带 `/infinite-title-generator` 前缀（见 `vite.config.ts` 的 `base` 与 `src/router.tsx` 的 `APP_BASEPATH`），无需额外路径改写。

> 注意：单页应用内部跳转会生成 `/infinite-title-generator/xxx` 路径。目前仅一个 `/` 路由；将来新增子路由时，静态托管需补充 SPA fallback（如 GitHub Pages 的 `404.html` 方案）。

## 开发约定

- UI 组件从 `@salta/theme-infinite/components` 导入；Lucide 图标一律以组件（Icon 版本）形式使用

## 免责声明

本项目为受 Halo Infinite 启发的粉丝同人项目，与 Microsoft、Xbox 或 Halo 官方无任何关联，亦未获得其认可或赞助。《Halo》及《Halo Infinite》以及相关商标与知识产权均归 Microsoft Corporation 所有。
