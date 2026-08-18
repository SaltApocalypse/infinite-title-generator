import { type ReactNode } from "react";

/**
 * LSFTooltip
 *
 * 基于 daisyUI `tooltip` 的提示组件（info 配色，直角边框）。
 * - 背景：info-content；文字/边框：info；直角（rounded-none）
 * - position：top / bottom / left / right / bottom-left / bottom-right（默认 top）
 * - align：内容对齐 left / center / right（默认 left），作用于 tooltip-content 内的文本
 */
export interface LSFTooltipProps {
  /** 提示内容（字符串或节点） */
  content: ReactNode;
  /** 位置，默认 top */
  position?: "top" | "bottom" | "left" | "right" | "bottom-left" | "bottom-right";
  /** 内容对齐：left / center / right，默认 left */
  align?: "left" | "center" | "right";
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

const alignClass: Record<NonNullable<LSFTooltipProps["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function LSFTooltip({
  content,
  position = "top",
  align = "left",
  children,
}: LSFTooltipProps) {
  return (
    <span
      className={`tooltip cursor-help ${positionClass[position]} [--tt-bg:var(--color-info-content)]`}
    >
      <span
        className={`tooltip-content block rounded-none border border-info bg-info-content text-info ${alignClass[align]}`}
      >
        {content}
      </span>
      {children}
    </span>
  );
}
