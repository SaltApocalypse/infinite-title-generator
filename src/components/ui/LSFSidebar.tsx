import { type LucideIcon } from "lucide-react";
import { type ReactNode, useState } from "react";

/**
 * LSFSidebar
 *
 * SaltsSciFi 设计系统下的左侧内容呈现侧边栏。
 * - 最左侧：48×48（w-12 h-12，尺寸取自点阵四点围成的最小正方形）直角方形 tab 按钮列，
 *   贴近左上角、不留边距；按钮内容为 Lucide 图标（Icon 版本）
 * - 紧邻右侧：内容浮层，hover 整个侧边栏时滑出呈现当前 tab 的内容，离开隐藏
 * - 浮层边框：[ ] 风格 —— 仅左右竖线 + 上下四角出头，贴紧内容、无独立方框
 * - 点击按钮仅切换浮层内容（呈现内容用，非整页切换；主页面由外部渲染）
 * - rest 时按钮列 50% 透明，hover 时 100%
 */
export interface LSFTabItem {
  id: string;
  label: string;
  /** Lucide 图标组件（统一使用 Icon 版本命名，见 docs/design-system.md） */
  icon?: LucideIcon;
  content: ReactNode;
}

export interface LSFSidebarProps {
  /** tab 列表 */
  tabs: LSFTabItem[];
  /** 默认激活的 tab id */
  defaultTabId?: string;
  /** 附加类名 */
  className?: string;
}

export function LSFSidebar({ tabs, defaultTabId, className }: LSFSidebarProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id ?? "");
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    // 侧边栏：靠左上角浮层，整个 aside 作为 hover 桥接区（按钮列 + 浮层同属一个 group）。
    // 交互：hover 按钮列 → 显示浮层；移入浮层保持显示；仅当移出浮层范围（整个 aside）才隐藏
    <aside className={`group fixed left-0 top-0 z-20 flex items-start ${className ?? ""}`}>
      {/* 按钮列：贴近左上角、直角方形；rest 50% → hover 100% */}
      <nav
        role="tablist"
        aria-label="侧边栏内容"
        className="flex flex-col gap-3 opacity-50 transition-opacity duration-500 group-hover:opacity-100"
      >
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              title={tab.label}
              onClick={() => setActiveId(tab.id)}
              className={`flex h-12 w-12 items-center justify-center rounded-none transition-colors duration-500 ${
                active ? "bg-primary/15 text-primary" : "text-neutral hover:text-base-content"
              }`}
            >
              {Icon ? <Icon className="h-5 w-5" /> : tab.label.charAt(0)}
            </button>
          );
        })}
      </nav>

      {/* 内容浮层：固定宽度，从下方切入（translate-y），贴紧按钮与内容，[] 边框（左右竖线 + 上下四角出头） */}
      <div className="relative w-80 translate-y-2 rounded-none bg-base-200/80 px-4 py-3 text-sm opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 xl:w-100">
        {/* 左右括号竖线（贴边） */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-primary"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 top-0 w-px bg-primary"
        />
        {/* 上下四角出头 */}
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
        {/* 内容页面：切换 tab 时从下往上显现（key=activeId 触发动画重放，方向与浮层滑出一致） */}
        <div key={activeId} className="animate-lsf-page-in">
          {activeTab?.content}
        </div>
      </div>
    </aside>
  );
}
