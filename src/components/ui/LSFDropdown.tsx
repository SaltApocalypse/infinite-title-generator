import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * LSFDropdown（LSF = Light Sci-Fi）
 *
 * SaltsSciFi 设计系统下的下拉选项组件。
 * - 触发器：SaltsSciFi 配色（主色边框/文字 + 主色淡底），直角边框，内容最右侧为 chevron-down 图标
 * - 下拉选项：与下拉本体同底色、无边框；hover 时左右出现 [ ] 括号装饰
 * - 点击触发器开合；点击外部 / 按 Esc 关闭
 */
export interface LSFDropdownOption {
  value: string;
  label: string;
}

export interface LSFDropdownProps {
  /** 选项列表 */
  options: LSFDropdownOption[];
  /** 受控选中值（不传则内部维护） */
  value?: string;
  /** 默认选中值 */
  defaultValue?: string;
  /** 选中变化回调 */
  onChange?: (value: string) => void;
  /** 未选中时占位文本 */
  placeholder?: string;
  /** 附加类名 */
  className?: string;
}

export function LSFDropdown({
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  className,
}: LSFDropdownProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const selected = value ?? internalValue;
  const selectedOption = options.find((opt) => opt.value === selected);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // 点击外部关闭、Esc 关闭
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSelect = (opt: LSFDropdownOption) => {
    setInternalValue(opt.value);
    onChange?.(opt.value);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative inline-block ${className ?? ""}`}>
      {/* 触发器：主色边框（直角）+ 主色文字/淡底，最右侧 chevron-down */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-none border border-primary/50 bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors duration-500 hover:bg-primary/15"
      >
        <span className="truncate">{selectedOption?.label ?? placeholder ?? ""}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-500 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* 下拉菜单：选项与下拉本体同底色、无边框，hover 时左右出现 [ ] 括号 */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-40 mt-2 flex min-w-full flex-col gap-1 rounded-none bg-base-200/90 p-2 shadow-lg"
        >
          {options.map((opt) => {
            const isSelected = opt.value === selected;
            // 命名 group（group/option）：避免被外层（如侧边栏 aside 的 group）的 hover 触发
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt)}
                className="group/option relative w-full rounded-none px-3 py-2 text-left text-sm text-base-content transition-colors duration-500 hover:text-primary"
              >
                {/* hover 时左右出现的 [ ] 括号竖线 */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-1 left-0 w-px bg-primary opacity-0 transition-opacity duration-500 group-hover/option:opacity-100"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-1 right-0 w-px bg-primary opacity-0 transition-opacity duration-500 group-hover/option:opacity-100"
                />
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
