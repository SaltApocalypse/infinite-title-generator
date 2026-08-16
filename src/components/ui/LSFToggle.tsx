import { type ButtonHTMLAttributes, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * LSFToggle
 *
 * SaltsSciFi 设计系统下的开关组件。
 * - [] 括号装饰（贴边无间隔）：关闭时仅左右竖线 + 四角出头；打开时上下边缘从两端向中间连起成完整方框，
 *   再次关闭则断开恢复 [] 样子
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
  // 上下边缘：开启时连起、关闭时断开（随状态而非 hover）
  const edge = isOn ? "scale-x-100" : "scale-x-0";

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
      className={`relative inline-flex h-8 cursor-pointer select-none items-center gap-2 rounded-none border-0 px-3 transition-colors duration-500 focus-visible:outline-none ${text} ${className ?? ""}`}
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
      {/* 上下边缘：开启时连起、关闭时断开 */}
      <span
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 h-px w-1/2 origin-left transition-all duration-500 ${edge} ${deco}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute right-0 top-0 h-px w-1/2 origin-right transition-all duration-500 ${edge} ${deco}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0 left-0 h-px w-1/2 origin-left transition-all duration-500 ${edge} ${deco}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0 right-0 h-px w-1/2 origin-right transition-all duration-500 ${edge} ${deco}`}
      />
      {/* 状态标签：[开]/[关] 或 [ON]/[OFF] */}
      <span className="text-sm tracking-widest">{isOn ? t("toggle.on") : t("toggle.off")}</span>
    </button>
  );
}
