import { createFileRoute } from "@tanstack/react-router";
import { Globe, Info, PencilLine, Settings, Skull } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Page from "../components/Page";
import { LSFDropdown, LSFInput, LSFLightButton, LSFSidebar } from "../components/ui";
import { SAMPLE } from "../constants/constants";
import { changeLanguage, getCurrentLang, type Lang, LANGUAGES } from "../i18n";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

// 语言切换按钮：右上角，点击在 中文 / English 之间切换（复用轻量按钮组件）
function LanguageToggle() {
  const { i18n } = useTranslation();
  const isZh = i18n.language.toLowerCase().startsWith("zh");

  return (
    <LSFLightButton
      className="fixed right-4 top-4 z-30"
      onClick={() => changeLanguage(isZh ? "en" : "zh")}
      aria-label={isZh ? "Switch to English" : "切换到中文"}
    >
      <Globe className="h-3.5 w-3.5" />
      {isZh ? "EN" : "中文"}
    </LSFLightButton>
  );
}

function RouteComponent() {
  const { t } = useTranslation();
  // 标题输入状态 + 防抖（停止输入 1s 后驱动动画重建）
  const [input, setInput] = useState(SAMPLE);
  const [debouncedInput, setDebouncedInput] = useState(input);
  const debounceTimer = useRef<number | null>(null);

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
          {/* 输入行：左 Key 右 Value（参考设置页语言行） */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-base-content">{t("page.inputLabel")}</span>
            <LSFInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("page.inputPlaceholder")}
              className="w-40"
            />
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
        </div>
      ),
    },
  ];

  return (
    <div style={{ overflow: "hidden" }}>
      <Page title={debouncedInput} />
      <LSFSidebar tabs={tabs} defaultTabId="title" />
      <LanguageToggle />
    </div>
  );
}
