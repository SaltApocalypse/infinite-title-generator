import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * LSFLightButton—— 轻量按钮
 *
 * 用于简单场景的紧凑按钮：直角主色边框 + 淡底 + 主色文字，
 * 内嵌 flex 布局可放图标；定位等外部样式通过 className 传入。
 */
export interface LSFLightButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function LSFLightButton({ children, className, ...rest }: LSFLightButtonProps) {
  return (
    <button
      type="button"
      className={`flex items-center gap-1.5 rounded-none border border-primary/50 px-3 py-1 text-xs uppercase tracking-widest text-primary transition-colors duration-500 hover:bg-primary/15 disabled:cursor-not-allowed disabled:border-neutral/30 disabled:text-neutral/50 disabled:hover:bg-transparent ${className ?? ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}
