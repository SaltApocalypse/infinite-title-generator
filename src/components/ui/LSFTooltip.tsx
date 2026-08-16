import { type ReactNode } from "react";

/**
 * LSFTooltip
 *
 * 基于 daisyUI `tooltip` 的提示组件（info 配色，直角边框）。
 * - 背景：info-content；文字/边框：info；直角（rounded-none）
 * - position：top / bottom / left / right / bottom-left / bottom-right（默认 top）
 */
export interface LSFTooltipProps {
  /** 提示内容（字符串或节点） */
  content: ReactNode;
  /** 位置，默认 top */
  position?: "top" | "bottom" | "left" | "right" | "bottom-left" | "bottom-right";
  children: ReactNode;
}

const positionClass: Record<NonNullable<LSFTooltipProps["position"]>, string> = {
  top: "tooltip-top",
  bottom: "tooltip-bottom",
  "bottom-left": "tooltip-bottom tooltip-start",
  "bottom-right": "tooltip-bottom tooltip-end",
  left: "tooltip-left",
  right: "tooltip-right",
};

export function LSFTooltip({ content, position = "top", children }: LSFTooltipProps) {
  return (
    <span
      className={`tooltip cursor-help ${positionClass[position]} [--tt-bg:var(--color-info-content)]`}
    >
      <span className="tooltip-content rounded-none border border-info bg-info-content text-info">
        {content}
      </span>
      {children}
    </span>
  );
}
