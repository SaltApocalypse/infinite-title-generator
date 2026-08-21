import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// 静态 SPA 部署在 https://lab.salta.top/infinite-title-generator/ 下（纯客户端，无 SSR）
// - base：让构建产物的资源引用带上 /infinite-title-generator/ 前缀
// - 路由 basepath 在 src/router.tsx 中配置（需与 base 一致）
const APP_BASEPATH = "/infinite-title-generator/";

/**
 * 基路径缺尾斜杠时自动 301 重定向（如 /infinite-title-generator → /infinite-title-generator/）。
 * Vite 的 baseMiddleware 对「不以 base 开头且非 /」的路径直接 404 并提示，
 * 该中间件在 Vite 内部中间件之前执行，先补齐尾斜杠。
 */
function baseSlashRedirect(base: string): Plugin {
  const baseWithoutSlash = base.replace(/\/$/, "");
  const redirect = (
    req: { url?: string },
    res: {
      statusCode: number;
      setHeader: (name: string, value: string) => void;
      end: () => void;
    },
    next: () => void
  ) => {
    const raw = req.url ?? "";
    const [pathname, search] = raw.split("?");
    if (pathname === baseWithoutSlash) {
      res.statusCode = 301;
      res.setHeader("Location", base + (search ? `?${search}` : ""));
      res.end();
      return;
    }
    next();
  };
  return {
    name: "salta-base-slash-redirect",
    configureServer(server) {
      server.middlewares.use(redirect);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect);
    },
  };
}

export default defineConfig({
  base: APP_BASEPATH,
  server: {
    port: 3000,
  },
  plugins: [
    baseSlashRedirect(APP_BASEPATH),
    tsConfigPaths(),
    TanStackRouterVite(), // 自动生成 src/routeTree.gen.ts
    tailwindcss(),
    viteReact(), // viteReact() 必须放在其他插件之后
  ],
});
