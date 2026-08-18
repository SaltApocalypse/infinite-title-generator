import { type InputHTMLAttributes, type ReactNode } from "react";

/**
 * LSFInput
 *
 * SaltsSciFi 设计系统下基于 daisyUI `input` 的输入框组件。
 * - 基底：daisyUI `.input` + `input-primary`（focus 边框/描边转主色）+ 直角
 * - LSF 装饰：[ ] 括号（左右竖线 + 四角出头），focus 时上下边缘从两端向中间连起
 * - 支持 prefix / suffix（label 包裹模式，点击可聚焦）
 * - 命名组 group/input + group-focus-within，仅响应本输入框聚焦
 * - multiline：渲染 <textarea>（支持换行），行高自适应、禁止缩放
 */
export interface LSFInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "suffix"> {
  /** 前置图标/内容（点击聚焦） */
  prefix?: ReactNode;
  /** 后置图标/内容 */
  suffix?: ReactNode;
  /** 多行模式：渲染 textarea（支持换行） */
  multiline?: boolean;
  /** 多行模式的行数（默认 3） */
  rows?: number;
}

export function LSFInput({
  prefix,
  suffix,
  className,
  multiline = false,
  rows = 3,
  ...rest
}: LSFInputProps) {
  return (
    <label
      className={`group/input input relative inline-flex gap-2 rounded-none border-0 px-2 shadow-none outline-none focus-within:outline-none focus-within:shadow-none ${
        multiline ? "h-auto items-start py-2" : "h-8 items-center"
      } ${className ?? ""}`}
    >
      {/* [ ] 括号装饰：左右竖线（贴边贯穿）+ 四角出头，无间隔 */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-primary/60"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 top-0 w-px bg-primary/60"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-px w-3 bg-primary/60"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px w-3 bg-primary/60"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-px w-3 bg-primary/60"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-px w-3 bg-primary/60"
      />
      {/* 上下边缘：focus 时两端向中间连起 */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-px w-1/2 origin-left scale-x-0 bg-primary transition-transform duration-500 group-focus-within/input:scale-x-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-px w-1/2 origin-right scale-x-0 bg-primary transition-transform duration-500 group-focus-within/input:scale-x-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px w-1/2 origin-left scale-x-0 bg-primary transition-transform duration-500 group-focus-within/input:scale-x-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-px w-1/2 origin-right scale-x-0 bg-primary transition-transform duration-500 group-focus-within/input:scale-x-100"
      />

      {prefix != null && <span className="shrink-0 text-primary">{prefix}</span>}
      {multiline ? (
        <textarea
          rows={rows}
          className="w-full resize-none bg-transparent leading-snug outline-none"
          {...rest}
        />
      ) : (
        <input className="w-full bg-transparent outline-none" {...rest} />
      )}
      {suffix != null && <span className="shrink-0 text-primary">{suffix}</span>}
    </label>
  );
}
