import { createFileRoute } from "@tanstack/react-router";

import Page from "../components/Page";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

// 路由组件：外层包裹 overflow hidden，防止 SVG 画布溢出页面
function RouteComponent() {
  return (
    <div style={{ overflow: "hidden" }}>
      <Page />
    </div>
  );
}
