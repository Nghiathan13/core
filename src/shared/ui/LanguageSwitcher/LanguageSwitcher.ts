import { getLanguage, setLanguage, t } from "../../i18n";
import type { Language } from "../../i18n";
import { TabButton } from "../TabButton";
import "./LanguageSwitcher.css";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "vi", label: "VI" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher(): HTMLElement {
  const section = document.createElement("section");

  const heading = document.createElement("h2");
  heading.className = "language-switcher-title";
  heading.textContent = t("language");
  heading.setAttribute("data-i18n", "language");

  const group = document.createElement("div");
  group.className = "language-switcher";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "Language");

  const current = getLanguage();

  for (const { code, label } of LANGUAGES) {
    const button = TabButton({
      label,
      selected: code === current,
      onClick: () => {
        setLanguage(code);
        group.querySelectorAll("button").forEach((item) => {
          item.setAttribute("aria-pressed", String(item === button));
        });
      },
    });
    group.append(button);
  }

  section.append(heading, group);

  return section;
}
