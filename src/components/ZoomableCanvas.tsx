import { type ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { LSFLightButton, LSFToggle } from "./ui";

// ============================================================
// 画布视图控制
// - 滚轮：以光标为锚点缩放，范围 1% ~ 10000%（0.01 ~ 100 倍）
// - 按住拖拽：平移画布
// - 右上角视图控制浮层（与左侧浮层同风格的 LSF 组件）：
//   a. 固定画布开关：开启后禁止缩放/拖拽
//   b. 缩放倍数（左）+ 重置按钮（右）
//   c. 重播 / 随机重播按钮
// - viewControlMode 决定浮层显示：full=显示完整浮层，none=隐藏（compact 暂未实现）
// ============================================================

const MIN_ZOOM = 0.01; // 1%
const MAX_ZOOM = 100; // 10000%

/** 视图控制模式（设置页下拉选择，控制右上角视图控制浮层） */
export type ViewControlMode = "full" | "compact" | "none";

interface ZoomableCanvasProps {
  children: ReactNode;
  /** 视图控制模式：full=完整浮层，none=不显示（compact 暂未实现，视为不显示） */
  viewControlMode?: ViewControlMode;
  /** 点击重播按钮时触发（由父组件重启动画，数据不变） */
  onReplay?: () => void;
  /** 点击随机重播按钮时触发（由父组件重新生成随机数据并重启动画） */
  onRandomReplay?: () => void;
}

const ZoomableCanvas: React.FC<ZoomableCanvasProps> = ({
  children,
  viewControlMode = "full",
  onReplay,
  onRandomReplay,
}) => {
  const { t } = useTranslation();
  const outerRef = useRef<HTMLDivElement | null>(null);

  // 统一的变换状态：zoom 倍率 + 平移偏移（视口像素）
  const [transform, setTransform] = useState({ zoom: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  // 固定画布：开启后禁止缩放/拖拽（默认关，即默认可自由缩放拖拽）
  const [fixed, setFixed] = useState(false);

  // 拖拽起始记录（用 ref 避免每次 move 都重建闭包）
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
  });

  // 滚轮缩放：以光标为锚点，缩放前后光标下的内容点保持不动
  // React 的 wheel 是 passive 监听，无法 preventDefault，故用原生监听
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (fixed) return; // 固定画布：禁用缩放
      e.preventDefault();

      // 变换原点位于内层容器左上角，等于外层 fixed 容器的左上角
      const rect = el.getBoundingClientRect();
      const originX = rect.left;
      const originY = rect.top;

      setTransform((prev) => {
        const factor = Math.exp(-e.deltaY * 0.001);
        const nextZoom = Math.min(Math.max(prev.zoom * factor, MIN_ZOOM), MAX_ZOOM);
        if (nextZoom === prev.zoom) return prev;

        // 屏幕坐标：screen = pan + zoom * local，反推新 pan 使光标下点不变
        const pointerX = e.clientX - originX;
        const pointerY = e.clientY - originY;
        const ratio = nextZoom / prev.zoom;

        return {
          zoom: nextZoom,
          x: pointerX - (pointerX - prev.x) * ratio,
          y: pointerY - (pointerY - prev.y) * ratio,
        };
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [fixed]);

  const reset = () => setTransform({ zoom: 1, x: 0, y: 0 });

  // 浮层仅在"完整"模式下显示（精简暂未实现）
  const showPanel = viewControlMode === "full";

  return (
    <div ref={outerRef} className="fixed inset-0 overflow-hidden">
      {/* 可缩放平移的内容层 */}
      <div
        className="h-full w-full"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
          transformOrigin: "0 0",
          cursor: fixed ? "default" : dragging ? "grabbing" : "grab",
          touchAction: "none",
          userSelect: "none",
        }}
        onPointerDown={(e) => {
          if (fixed) return; // 固定画布：禁止拖拽
          dragRef.current.pointerId = e.pointerId;
          dragRef.current.startX = e.clientX;
          dragRef.current.startY = e.clientY;
          dragRef.current.startPanX = transform.x;
          dragRef.current.startPanY = transform.y;
          setDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (fixed) return; // 固定画布：禁止拖拽
          if (e.pointerId !== dragRef.current.pointerId) return;
          setTransform((prev) => ({
            ...prev,
            x: dragRef.current.startPanX + (e.clientX - dragRef.current.startX),
            y: dragRef.current.startPanY + (e.clientY - dragRef.current.startY),
          }));
        }}
        onPointerUp={(e) => {
          if (e.pointerId !== dragRef.current.pointerId) return;
          dragRef.current.pointerId = -1;
          setDragging(false);
        }}
        onPointerCancel={(e) => {
          if (e.pointerId !== dragRef.current.pointerId) return;
          dragRef.current.pointerId = -1;
          setDragging(false);
        }}
      >
        {children}
      </div>

      {/* 视图控制浮层：与左侧浮层同风格（[] 边框 + LSF 组件），右上角 */}
      {showPanel && (
        <div className="absolute right-4 top-4 z-50 w-56">
          <div className="relative bg-base-200/80 px-4 py-3 text-sm shadow-lg">
            {/* [] 边框：左右竖线 + 四角出头（与左侧浮层一致） */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-primary"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 right-0 top-0 w-px bg-primary"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 h-px w-3 bg-primary"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 h-px w-3 bg-primary"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 h-px w-3 bg-primary"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 right-0 h-px w-3 bg-primary"
            />

            {/* a. 固定画布开关：开启后禁止缩放/拖拽 */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-base-content">{t("view.fixedCanvas")}</span>
              <LSFToggle checked={fixed} onChange={setFixed} />
            </div>

            {/* b. 缩放倍数（1%~10000%）+ 重置 */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-sm tabular-nums text-base-content">
                {Math.round(transform.zoom * 100)}%
              </span>
              <LSFLightButton onClick={reset}>{t("view.reset")}</LSFLightButton>
            </div>

            {/* c. 重播 / 随机重播：占满一行，各占 1/3 与 2/3，中间留小 gap */}
            {(onReplay || onRandomReplay) && (
              <div className="mt-4 flex gap-2">
                {onReplay && (
                  <LSFLightButton onClick={onReplay} className="flex-1 justify-center">
                    {t("view.replay")}
                  </LSFLightButton>
                )}
                {onRandomReplay && (
                  <LSFLightButton onClick={onRandomReplay} className="flex-2 justify-center">
                    {t("view.randomReplay")}
                  </LSFLightButton>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoomableCanvas;
