import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// 根路由：静态 SPA 下文档骨架由 index.html 提供（title/viewport 也在其中），
// 这里仅渲染子路由内容与开发调试工具
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      {/* 背景点阵装饰：科幻网格点，装饰层不拦截交互 */}
      <div aria-hidden className="bg-dot-grid pointer-events-none fixed inset-0 z-0" />
      <TanStackRouterDevtools />
    </>
  );
}
