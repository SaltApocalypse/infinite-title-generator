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
import { type ViewControlMode } from "../components/ZoomableCanvas";
import {
  Dropdown,
  type DropdownOption,
  Input,
  LightButton,
  Sidebar,
  Slider,
  Toggle,
  Tooltip,
} from "@salta/theme-infinite/components";
import type { CharsetId } from "../constants";
import {
  CHARSETS,
  DEFAULT_CHARSET,
  DEFAULT_DELAY,
  DEFAULT_SCALE,
  MAX_DELAY,
  MAX_LINES,
  MAX_SCALE,
  MIN_DELAY,
  MIN_SCALE,
  SAMPLE,
} from "../constants";
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
  // 调试：笔画拆解开关（竖线纯黄、横线纯蓝、透明度固定 50%）
  const [strokeSplit, setStrokeSplit] = useState(false);
  // 调试：是否启用输入字符长度限制（默认开启 ≤14，关闭后无限输入）
  const [limitLength, setLimitLength] = useState(true);
  // 调试：是否启用多行输入行数限制（默认开启 ≤MAX_LINES 行，关闭后不限行数）
  const [limitLines, setLimitLines] = useState(true);
  // 标题输入框行数：随输入行数动态变化（至少 1 行，最多 6 行，超出滚动）
  const inputRows = Math.min(Math.max(input.split("\n").length, 1), 6);
  // 视图控制模式：设置页下拉选择（完整/精简[暂禁用]/无），控制右上角视图控制浮层
  const [viewControlMode, setViewControlMode] = useState<ViewControlMode>("full");
  // 字体结构（字符集）：设置页下拉选择（基本/优化[暂未开放]），默认基本
  const [charsetId, setCharsetId] = useState<CharsetId>(DEFAULT_CHARSET);

  // 视图控制选项：完整（默认）/ 精简（暂未开放，禁用）/ 无
  const viewControlOptions: DropdownOption[] = [
    { value: "full", label: t("view.modes.full") },
    { value: "compact", label: t("view.modes.compact"), disabled: true },
    { value: "none", label: t("view.modes.none") },
  ];

  // 字体结构选项：由字符集注册表生成（优化集已开放选择）
  const fontOptions: DropdownOption[] = CHARSETS.map((set) => ({
    value: set.id,
    label: t(set.labelKey),
  }));

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
              {/* 标题规则提示：hover info 显示，朝右下，内容居左 */}
              <Tooltip
                position="right"
                align="left"
                content={
                  <span className="block whitespace-nowrap">
                    <span className="block">{t("page.titleRuleChars")}</span>
                    <span className="block">{t("page.titleRuleLength")}</span>
                    <span className="block">{t("page.titleRuleLines")}</span>
                  </span>
                }
              >
                <Info className="h-3.5 w-3.5" />
              </Tooltip>
            </span>
            <div className="flex items-center gap-2">
              <Input
                multiline
                rows={inputRows}
                value={input}
                onChange={(e) => {
                  // 仅允许英文字母和数字（小写自动转大写）与换行；连续换行合并（空行由布局层过滤）；
                  // 长度限制开关开启时每行 ≤ 14；行数限制开关开启时 ≤ MAX_LINES 行
                  let cleaned = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9\n]/g, "")
                    .replace(/\n+/g, "\n");
                  if (limitLength) {
                    cleaned = cleaned
                      .split("\n")
                      .map((line) => line.slice(0, 14))
                      .join("\n");
                  }
                  if (limitLines) {
                    cleaned = cleaned.split("\n").slice(0, MAX_LINES).join("\n");
                  }
                  setInput(cleaned);
                }}
                placeholder={t("page.inputPlaceholder")}
                className="w-40 xl:w-56"
              />
              <LightButton onClick={() => setInput(SAMPLE)} aria-label={t("page.inputReset")}>
                <RotateCcw className="h-3.5 w-3.5" />
              </LightButton>
            </div>
          </div>
          {/* 文本尺寸行：滑块 + 重置按钮 */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-sm text-base-content">{t("page.textSize")}</span>
            <div className="flex items-center gap-2">
              <Slider
                value={scale}
                min={MIN_SCALE}
                max={MAX_SCALE}
                ticks={[MIN_SCALE, DEFAULT_SCALE, MAX_SCALE]}
                onChange={setScale}
                className="w-40 xl:w-56"
              />
              <LightButton
                onClick={() => setScale(DEFAULT_SCALE)}
                aria-label={t("page.inputReset")}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </LightButton>
            </div>
          </div>
          {/* 延时播放行：滑块（动画开始/重播/随机重播前暂停秒数）+ 重置按钮 */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-sm text-base-content">{t("page.delayPlay")}</span>
            <div className="flex items-center gap-2">
              <Slider
                value={delay}
                min={MIN_DELAY}
                max={MAX_DELAY}
                ticks={[MIN_DELAY, 1, MAX_DELAY]}
                onChange={setDelay}
                className="w-40 xl:w-56"
              />
              <LightButton
                onClick={() => setDelay(DEFAULT_DELAY)}
                aria-label={t("page.inputReset")}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </LightButton>
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
          {/* 设置项列表：字体结构（基本/优化[暂未开放]） */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm text-base-content">{t("settings.font")}</span>
            <Dropdown
              className="w-28"
              value={charsetId}
              options={fontOptions}
              onChange={(value) => setCharsetId(value as CharsetId)}
            />
          </div>
          {/* 设置项列表：视图控制（完整/精简[暂禁用]/无） */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm text-base-content">{t("settings.viewControls")}</span>
            <Dropdown
              className="w-28"
              value={viewControlMode}
              options={viewControlOptions}
              onChange={(value) => setViewControlMode(value as ViewControlMode)}
            />
          </div>
          {/* 设置项列表：语言（默认语言按浏览器环境，见 src/i18n） */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-base-content">{t("settings.language")}</span>
            <Dropdown
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
                {/* 总览按钮：一键填入全部三行总览内容（全局总览）；宽度保持 1/4 */}
                <div className="flex gap-2">
                  <LightButton
                    onClick={() => setInput("ABCDEFGHIJKLM\nNOPQRSTUVWXYZ\n0123456789")}
                    className="w-1/4 justify-center"
                  >
                    {t("debug.overview")}
                  </LightButton>
                </div>
                {/* 占位开关：画布字符占位辅助 */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-base-content">{t("debug.placeholder")}</span>
                  <Toggle checked={showPlaceholders} onChange={setShowPlaceholders} labels={{ on: t("toggle.on"), off: t("toggle.off") }} />
                </div>
                {/* 笔画拆解开关：竖线纯黄/横线纯蓝/透明度 50% */}
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-sm text-base-content">{t("debug.strokeSplit")}</span>
                  <Toggle checked={strokeSplit} onChange={setStrokeSplit} labels={{ on: t("toggle.on"), off: t("toggle.off") }} />
                </div>
                {/* 字符长度限制开关：关闭后每行可无限输入 */}
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-sm text-base-content">{t("debug.limitLength")}</span>
                  <Toggle checked={limitLength} onChange={setLimitLength} labels={{ on: t("toggle.on"), off: t("toggle.off") }} />
                </div>
                {/* 行数限制开关：关闭后不限输入行数 */}
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-sm text-base-content">{t("debug.limitLines")}</span>
                  <Toggle checked={limitLines} onChange={setLimitLines} labels={{ on: t("toggle.on"), off: t("toggle.off") }} />
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
        charsetId={charsetId}
        strokeSplit={strokeSplit}
      />
      <Sidebar tabs={tabs} defaultTabId="title" />
    </div>
  );
}
