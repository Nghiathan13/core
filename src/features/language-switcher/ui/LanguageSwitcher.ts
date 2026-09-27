import { getLanguageMode, setLanguageMode, t } from "@/shared/i18n";
import type { LanguageMode } from "@/shared/i18n";
import type { View } from "@/shared/lib";
import { Dropdown } from "@/shared/ui";
import "./LanguageSwitcher.css";

const LANGUAGES: { code: LanguageMode; label: string }[] = [
  { code: "system", label: "Auto detect" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
];

export function LanguageSwitcher(): View {
  const section = document.createElement("section");

  const header = document.createElement("h2");
  header.className = "settings-section-header";
  header.textContent = t("general");
  header.setAttribute("data-i18n", "general");

  const heading = document.createElement("h3");
  heading.className = "language-switcher-title";
  heading.textContent = t("language");
  heading.setAttribute("data-i18n", "language");

  const dropdown = Dropdown({
    label: t("language"),
    options: LANGUAGES.map(({ code, label }) => ({ value: code, label })),
    value: getLanguageMode(),
    onSelect: (code: LanguageMode) => {
      setLanguageMode(code);
    },
  });

  section.append(header, heading, dropdown.el);

  return {
    el: section,
    destroy: () => {
      dropdown.destroy?.();
    },
  };
}
