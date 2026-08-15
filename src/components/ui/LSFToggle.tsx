import { type ButtonHTMLAttributes, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * LSFToggle（LSF = Light Sci-Fi）
 *
 * SaltsSciFi 设计系统下的开关组件。
 * - [] 括号装饰（贴边无间隔）：左右竖线 + 四角出头，hover 时上下边缘从两端向中间连起
 * - 开（ON）：主色；关（OFF）：中性色
 * - 状态标签显示 [开]/[关] 或 [ON]/[OFF]（i18n）
 */
export interface LSFToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** 受控开启状态（不传则内部维护） */
  checked?: boolean;
  /** 默认开启状态 */
  defaultChecked?: boolean;
  /** 状态变化回调 */
  onChange?: (checked: boolean) => void;
}

export function LSFToggle({
  checked,
  defaultChecked,
  onChange,
  className,
  ...rest
}: LSFToggleProps) {
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const isOn = checked ?? internal;
  const { t } = useTranslation();
  // 状态色：开=主色，关=中性
  const deco = isOn ? "bg-primary" : "bg-neutral";
  const text = isOn ? "text-primary" : "text-neutral";

  const handleClick = () => {
    const next = !isOn;
    setInternal(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={handleClick}
      className={`group/toggle relative inline-flex h-8 cursor-pointer select-none items-center gap-2 rounded-none border-0 px-3 transition-colors duration-500 focus-visible:outline-none ${text} ${className ?? ""}`}
      {...rest}
    >
      {/* [] 括号：左右竖线（贴边贯穿）+ 四角出头 */}
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0 left-0 top-0 w-px transition-colors duration-500 ${deco}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0 right-0 top-0 w-px transition-colors duration-500 ${deco}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 h-px w-3 transition-colors duration-500 ${deco}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0 left-0 h-px w-3 transition-colors duration-500 ${deco}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute right-0 top-0 h-px w-3 transition-colors duration-500 ${deco}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0 right-0 h-px w-3 transition-colors duration-500 ${deco}`}
      />
      {/* 上下边缘：hover 时两端向中间连起 */}
      <span
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 h-px w-1/2 origin-left scale-x-0 transition-all duration-500 group-hover/toggle:scale-x-100 ${deco}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute right-0 top-0 h-px w-1/2 origin-right scale-x-0 transition-all duration-500 group-hover/toggle:scale-x-100 ${deco}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0 left-0 h-px w-1/2 origin-left scale-x-0 transition-all duration-500 group-hover/toggle:scale-x-100 ${deco}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0 right-0 h-px w-1/2 origin-right scale-x-0 transition-all duration-500 group-hover/toggle:scale-x-100 ${deco}`}
      />
      {/* 状态标签：[开]/[关] 或 [ON]/[OFF] */}
      <span className="text-sm tracking-widest">{isOn ? t("toggle.on") : t("toggle.off")}</span>
    </button>
  );
}
