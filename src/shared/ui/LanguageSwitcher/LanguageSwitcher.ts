import { getLanguage, setLanguage, t } from "../../i18n";
import type { Language } from "../../i18n";
import type { View } from "../../lib";
import { Dropdown } from "../Dropdown";
import "./LanguageSwitcher.css";

const LANGUAGES: { code: Language; label: string }[] = [
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
    value: getLanguage(),
    onSelect: (code) => {
      setLanguage(code);
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
