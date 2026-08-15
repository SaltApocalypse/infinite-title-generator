import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

// 应用挂在子路径下部署（见 vite.config.ts 的 APP_BASEPATH）：
// 线上 https://lab.salta.top/infinite-title-generator/ = 应用内部 "/"
// 该 basepath 在客户端渲染时用于裁剪 URL 前缀，需与 vite.config.ts 的 base 保持一致
export const APP_BASEPATH = "/infinite-title-generator";

export function getRouter() {
  const router = createRouter({
    routeTree,
    basepath: APP_BASEPATH,
    scrollRestoration: true,
  });

  return router;
}
