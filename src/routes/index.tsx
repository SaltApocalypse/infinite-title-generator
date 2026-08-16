import { createFileRoute, useSearch } from "@tanstack/react-router";
import {
  Code,
  ExternalLink,
  Info,
  ListTodo,
  PencilLine,
  RotateCcw,
  Settings,
  Skull,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Page from "../components/Page";
import {
  LSFDropdown,
  type LSFDropdownOption,
  LSFInput,
  LSFLightButton,
  LSFSidebar,
  LSFSlider,
  LSFToggle,
  LSFTooltip,
} from "../components/ui";
import { type ViewControlMode } from "../components/ZoomableCanvas";
import {
  DEFAULT_DELAY,
  DEFAULT_SCALE,
  MAX_DELAY,
  MAX_SCALE,
  MIN_DELAY,
  MIN_SCALE,
  SAMPLE,
} from "../constants/constants";
import { changeLanguage, getCurrentLang, type Lang, LANGUAGES } from "../i18n";

export const Route = createFileRoute("/")({
  // ?debug 查询参数：作为调试模式的开关（存在即开启）
  validateSearch: (search) => ({
    debug: search.debug === true || search.debug === "true" || search.debug === "",
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  // 标题输入状态 + 防抖（停止输入 1s 后驱动动画重建）
  const [input, setInput] = useState(SAMPLE);
  const [debouncedInput, setDebouncedInput] = useState(input);
  const debounceTimer = useRef<number | null>(null);
  // 文本尺寸（SCALE）：初始 DEFAULT_SCALE，范围 MIN~MAX 整数
  const [scale, setScale] = useState(DEFAULT_SCALE);
  // 延时播放（动画开始/重播/随机重播前暂停秒数）：默认 DEFAULT_DELAY
  const [delay, setDelay] = useState(DEFAULT_DELAY);
  // 调试模式：由 ?debug 查询参数控制（个人使用，存在即显示调试页）
  const debug = useSearch({
    select: (s) => s.debug,
    from: undefined,
  });
  // 调试：画布字符占位辅助开关（实际占用方块 + 声明宽度单元格轮廓）
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  // 调试：是否启用输入字符长度限制（默认开启 ≤14，关闭后无限输入）
  const [limitLength, setLimitLength] = useState(true);
  // 视图控制模式：设置页下拉选择（完整/精简[暂禁用]/无），控制右上角视图控制浮层
  const [viewControlMode, setViewControlMode] = useState<ViewControlMode>("full");

  // 视图控制选项：完整（默认）/ 精简（暂未开放，禁用）/ 无
  const viewControlOptions: LSFDropdownOption[] = [
    { value: "full", label: t("view.modes.full") },
    { value: "compact", label: t("view.modes.compact"), disabled: true },
    { value: "none", label: t("view.modes.none") },
  ];

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = window.setTimeout(() => setDebouncedInput(input), 1000);
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [input]);

  // 侧边栏 tabs：内容呈现在浮层中（主页面动画常显，文本随语言切换）
  const tabs = [
    {
      id: "title",
      label: t("tabs.title"),
      icon: PencilLine,
      content: (
        <div className="w-full">
          <h2 className="mb-2 text-base font-semibold text-primary">{t("tabs.titleGenerator")}</h2>
          {/* 输入行：左 Key（含标题规则提示），右侧 输入框 + 重置按钮 */}
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-sm text-base-content">
              {t("page.inputLabel")}
              {/* 标题规则提示：hover info 显示，朝右下 */}
              <LSFTooltip
                position="right"
                content={
                  <span className="block whitespace-nowrap">
                    <span className="block">{t("page.titleRuleChars")}</span>
                    <span className="block">{t("page.titleRuleLength")}</span>
                  </span>
                }
              >
                <Info className="h-3.5 w-3.5" />
              </LSFTooltip>
            </span>
            <div className="flex items-center gap-2">
              <LSFInput
                value={input}
                onChange={(e) => {
                  // 仅允许英文字母和数字，小写自动转大写；限制开关开启时长度 ≤ 14
                  let cleaned = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                  if (limitLength) {
                    cleaned = cleaned.slice(0, 14);
                  }
                  setInput(cleaned);
                }}
                placeholder={t("page.inputPlaceholder")}
                maxLength={limitLength ? 14 : undefined}
                className="w-40 xl:w-56"
              />
              <LSFLightButton onClick={() => setInput(SAMPLE)} aria-label={t("page.inputReset")}>
                <RotateCcw className="h-3.5 w-3.5" />
              </LSFLightButton>
            </div>
          </div>
          {/* 文本尺寸行：滑块 + 重置按钮 */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-sm text-base-content">{t("page.textSize")}</span>
            <div className="flex items-center gap-2">
              <LSFSlider
                value={scale}
                min={MIN_SCALE}
                max={MAX_SCALE}
                ticks={[MIN_SCALE, DEFAULT_SCALE, MAX_SCALE]}
                onChange={setScale}
                className="w-40 xl:w-56"
              />
              <LSFLightButton
                onClick={() => setScale(DEFAULT_SCALE)}
                aria-label={t("page.inputReset")}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </LSFLightButton>
            </div>
          </div>
          {/* 延时播放行：滑块（动画开始/重播/随机重播前暂停秒数）+ 重置按钮 */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-sm text-base-content">{t("page.delayPlay")}</span>
            <div className="flex items-center gap-2">
              <LSFSlider
                value={delay}
                min={MIN_DELAY}
                max={MAX_DELAY}
                ticks={[MIN_DELAY, 1, MAX_DELAY]}
                onChange={setDelay}
                className="w-40 xl:w-56"
              />
              <LSFLightButton
                onClick={() => setDelay(DEFAULT_DELAY)}
                aria-label={t("page.inputReset")}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </LSFLightButton>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "skulls",
      label: t("tabs.skulls"),
      icon: Skull,
      content: (
        <div className="w-full">
          {/* 大标题：骷髅头 / SKULLS（随语言切换，尺寸与其他页面一致） */}
          <h2 className="text-base font-semibold text-primary">{t("tabs.skullsTitle")}</h2>
          {/* 内容：计划中 */}
          <p className="mt-3 text-sm text-base-content/70">{t("tabs.skullsPlaceholder")}</p>
        </div>
      ),
    },
    {
      id: "settings",
      label: t("tabs.settings"),
      icon: Settings,
      content: (
        <div className="w-full">
          <h2 className="mb-4 text-base font-semibold text-primary">{t("tabs.settings")}</h2>
          {/* 设置项列表：视图控制（完整/精简[暂禁用]/无） */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm text-base-content">{t("settings.viewControls")}</span>
            <LSFDropdown
              className="w-28"
              value={viewControlMode}
              options={viewControlOptions}
              onChange={(value) => setViewControlMode(value as ViewControlMode)}
            />
          </div>
          {/* 设置项列表：语言（默认语言按浏览器环境，见 src/i18n） */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-base-content">{t("settings.language")}</span>
            <LSFDropdown
              className="w-28"
              value={getCurrentLang()}
              options={LANGUAGES}
              onChange={(value) => changeLanguage(value as Lang)}
            />
          </div>
        </div>
      ),
    },
    {
      id: "about",
      label: t("tabs.about"),
      icon: Info,
      content: (
        <div className="w-full">
          <h2 className="mb-3 text-base font-semibold text-primary">{t("tabs.about")}</h2>
          <p className="text-sm leading-relaxed">{t("tabs.aboutIntro")}</p>
          <p className="mt-2 text-sm leading-relaxed text-base-content/80">
            {t("tabs.aboutDisclaimer")}
          </p>
          {/* BUG 提交或建议：跳转外部 Issues（info 配色） */}
          <a
            href="https://github.com/SaltApocalypse/infinite-title-generator/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-between gap-2 rounded-none border border-info px-3 py-1.5 text-sm text-info transition-colors duration-500 hover:bg-info/15"
          >
            <span>{t("tabs.bugReport")}</span>
            <ExternalLink className="h-4 w-4 shrink-0" />
          </a>
        </div>
      ),
    },
    // 调试模式内容（?debug 时显示，个人使用）
    ...(debug
      ? [
          {
            id: "plan",
            label: t("tabs.plan"),
            icon: ListTodo,
            content: (
              <div className="w-full">
                {/* 大标题（与其他页面一致） */}
                <h2 className="mb-2 text-base font-semibold text-primary">{t("tabs.plan")}</h2>
                {/* NOTE: 更新计划列表为写死文本，不做 i18n（需求要求） */}
                <ul className="list-disc space-y-1 pl-5 text-sm text-base-content">
                  <li>主页 &gt; 标题 &gt; 多行输入支持</li>
                  <li>设置 &gt; 视图控制 &gt; 精简视图</li>
                  <li>导出功能</li>
                  <li>骷髅头实现</li>
                </ul>
              </div>
            ),
          },
          {
            id: "debug",
            label: t("tabs.debug"),
            icon: Code,
            content: (
              <div className="w-full">
                {/* 大标题：调试（与其他页面一致） */}
                <h2 className="mb-2 text-base font-semibold text-primary">{t("tabs.debug")}</h2>
                {/* 快捷调试：小标题（同 主页→标题/文本尺寸 样式） */}
                <span className="mb-2 block text-sm text-base-content">{t("debug.quick")}</span>
                {/* 四个总览按钮：一行，各占 1/4，中间留 gap；总览(第4个)暂禁用 */}
                <div className="flex gap-2">
                  <LSFLightButton
                    onClick={() => setInput("ABCDEFGHIJKLM")}
                    className="flex-1 justify-center"
                  >
                    {t("debug.overview1")}
                  </LSFLightButton>
                  <LSFLightButton
                    onClick={() => setInput("NOPQRSTUVWXYZ")}
                    className="flex-1 justify-center"
                  >
                    {t("debug.overview2")}
                  </LSFLightButton>
                  <LSFLightButton
                    onClick={() => setInput("0123456789")}
                    className="flex-1 justify-center"
                  >
                    {t("debug.overview3")}
                  </LSFLightButton>
                  <LSFLightButton disabled className="flex-1 justify-center">
                    {t("debug.overview4")}
                  </LSFLightButton>
                </div>
                {/* 占位开关：画布字符占位辅助 */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-base-content">{t("debug.placeholder")}</span>
                  <LSFToggle checked={showPlaceholders} onChange={setShowPlaceholders} />
                </div>
                {/* 字符长度限制开关：关闭后无限输入 */}
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-sm text-base-content">{t("debug.limitLength")}</span>
                  <LSFToggle checked={limitLength} onChange={setLimitLength} />
                </div>
                {/* 基本信息：小标题 */}
                <span className="mb-2 mt-4 block text-sm text-base-content">
                  {t("debug.basic")}
                </span>
                <div className="font-mono text-xs text-primary">
                  <div>title: {debouncedInput || "(empty)"}</div>
                  <div>scale: {scale}</div>
                  <div>lang: {getCurrentLang()}</div>
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div style={{ overflow: "hidden" }}>
      <Page
        title={debouncedInput}
        scale={scale}
        showPlaceholders={showPlaceholders}
        viewControlMode={viewControlMode}
        startDelay={delay}
      />
      <LSFSidebar tabs={tabs} defaultTabId="title" />
    </div>
  );
}
