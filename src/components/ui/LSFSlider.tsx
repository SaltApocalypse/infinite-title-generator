import { type InputHTMLAttributes } from "react";

/**
 * LSFSlider
 *
 * 简约滑块（------0--- 效果）：
 * - 细线滑轨：已填充部分主色、未填充部分淡色（2px 细线）
 * - 主色方块滑块
 * - 下方可选刻度（如 1 / 5 / 10）
 *
 * 说明：daisyUI range 的填充是与滑块同高的 box-shadow（无法做成细线），
 * 故此处用自绘细轨 + 透明 range 输入实现目标观感。
 */
export interface LSFSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** 当前值 */
  value: number;
  /** 最小值 */
  min: number;
  /** 最大值 */
  max: number;
  /** 步长 */
  step?: number;
  /** 下方刻度值列表 */
  ticks?: number[];
  /** 值变化回调 */
  onChange?: (value: number) => void;
}

export function LSFSlider({
  value,
  min,
  max,
  step = 1,
  ticks,
  onChange,
  className,
  ...rest
}: LSFSliderProps) {
  const progress = min === max ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div className={className ?? ""}>
      <div className="relative h-3">
        {/* 轨道底（未填充部分，淡色细线） */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-base-300/70" />
        {/* 轨道已填充（主色细线） */}
        <div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary"
          style={{ width: `${progress}%` }}
        />
        {/* 滑块：透明 range 输入，仅显示主色方块 thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent
            [&::-webkit-slider-runnable-track]:h-full [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-runnable-track]:appearance-none
            [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-primary
            [&::-moz-range-track]:bg-transparent
            [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
          {...rest}
        />
      </div>
      {ticks && ticks.length > 0 && (
        <div className="mt-1 flex w-full justify-between px-1 text-[10px] tabular-nums text-base-content/60">
          {ticks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      )}
    </div>
  );
}
