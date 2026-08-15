import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// 静态 SPA 部署在 https://lab.salta.top/infinite-title-generator/ 下（纯客户端，无 SSR）
// - base：让构建产物的资源引用带上 /infinite-title-generator/ 前缀
// - 路由 basepath 在 src/router.tsx 中配置（需与 base 一致）
const APP_BASEPATH = "/infinite-title-generator/";

export default defineConfig({
  base: APP_BASEPATH,
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
    TanStackRouterVite(), // 自动生成 src/routeTree.gen.ts
    tailwindcss(),
    viteReact(), // viteReact() 必须放在其他插件之后
  ],
});
