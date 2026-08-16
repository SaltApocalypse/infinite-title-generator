import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * LSFButton
 *
 * LightSciFi 设计系统下的科幻按钮，基于 daisyUI `btn btn-primary`。
 *
 * 视觉结构（装饰用 aria-hidden 元素，不参与布局）：
 *  - 左右两侧：常显的「[ ]」括号 —— 贯穿按钮高度的竖线 + 上下两端各一段水平“出头”
 *  - 上、下边缘：各两段横线，hover 时从左右两端（括号顶点）向中间连起（scale-x 动画）
 *  - 线条粗细：默认 1px（原 2px 的一半），hover 时恢复 2px
 *  - Hover 效果：底色叠加 10% 白色变亮（约定见 docs/design-system.md）
 *  - 无辉光，仅边框装饰
 */
export interface LSFButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function LSFButton({ children, className, ...rest }: LSFButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-primary group relative h-8 duration-500 uppercase tracking-widest hover:[--btn-bg:color-mix(in_oklab,var(--color-primary)_90%,white)] ${className ?? ""}`}
      {...rest}
    >
      {/* 左右括号竖线（常显，贯穿按钮高度） */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 -top-2 -bottom-2 w-px bg-primary transition-all duration-500 ease-out group-hover:w-0.5"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-2 -bottom-2 w-px bg-primary transition-all duration-500 ease-out group-hover:w-0.5"
      />
      {/* 括号上下端的水平“出头”（[ ] 字形的帽），常显 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 -top-2 h-px w-3 bg-primary transition-all duration-500 ease-out group-hover:h-0.5"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 -bottom-2 h-px w-3 bg-primary transition-all duration-500 ease-out group-hover:h-0.5"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-2 h-px w-3 bg-primary transition-all duration-500 ease-out group-hover:h-0.5"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -bottom-2 h-px w-3 bg-primary transition-all duration-500 ease-out group-hover:h-0.5"
      />
      {/* 上边缘：两段横线从括号顶点向中间连起 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 -top-2 h-px w-[calc(50%+0.5rem)] origin-left scale-x-0 bg-primary transition-all duration-500 ease-out group-hover:scale-x-100 group-hover:h-0.5"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-2 h-px w-[calc(50%+0.5rem)] origin-right scale-x-0 bg-primary transition-all duration-500 ease-out group-hover:scale-x-100 group-hover:h-0.5"
      />
      {/* 下边缘：两段横线从括号顶点向中间连起 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 -bottom-2 h-px w-[calc(50%+0.5rem)] origin-left scale-x-0 bg-primary transition-all duration-500 ease-out group-hover:scale-x-100 group-hover:h-0.5"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -bottom-2 h-px w-[calc(50%+0.5rem)] origin-right scale-x-0 bg-primary transition-all duration-500 ease-out group-hover:scale-x-100 group-hover:h-0.5"
      />
      {children}
    </button>
  );
}
