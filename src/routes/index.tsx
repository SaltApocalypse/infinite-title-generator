import { createFileRoute } from "@tanstack/react-router";
import { Globe, Info, PencilLine, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

import Page from "../components/Page";
import { LSFDropdown, LSFSidebar } from "../components/ui";
import { changeLanguage, getCurrentLang, type Lang, LANGUAGES } from "../i18n";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

// 语言切换按钮：右上角（测试用），点击在 中文 / English 之间切换
function LanguageToggle() {
  const { i18n } = useTranslation();
  const isZh = i18n.language.toLowerCase().startsWith("zh");

  return (
    <button
      type="button"
      onClick={() => changeLanguage(isZh ? "en" : "zh")}
      className="fixed right-4 top-4 z-30 flex items-center gap-1.5 rounded-none border border-primary/50 px-3 py-1 text-xs uppercase tracking-widest text-primary transition-colors duration-500 hover:bg-primary/15"
      aria-label={isZh ? "Switch to English" : "切换到中文"}
    >
      <Globe className="h-3.5 w-3.5" />
      {isZh ? "EN" : "中文"}
    </button>
  );
}

function RouteComponent() {
  const { t } = useTranslation();

  // 侧边栏 tabs：内容呈现在浮层中（主页面动画常显，文本随语言切换）
  const tabs = [
    {
      id: "title",
      label: t("tabs.title"),
      icon: PencilLine,
      content: (
        <div className="max-w-xs">
          <h2 className="mb-2 text-base font-semibold text-primary">{t("tabs.titleGenerator")}</h2>
          <p className="text-sm leading-relaxed">{t("tabs.titleDesc")}</p>
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
      <Page />
      <LSFSidebar tabs={tabs} defaultTabId="title" />
      <LanguageToggle />
    </div>
  );
}
