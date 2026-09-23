import { getLanguage, setLanguage, t } from "../../i18n";
import type { Language } from "../../i18n";
import type { View } from "../../lib";
import { TabButton } from "../TabButton";
import { attachTooltip } from "../Tooltip";
import "./LanguageSwitcher.css";

const LANGUAGES: { code: Language; label: string; key: string }[] = [
  { code: "vi", label: "VI", key: "vietnamese" },
  { code: "en", label: "EN", key: "english" },
];

export function LanguageSwitcher(): View {
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
  const detachTooltips: (() => void)[] = [];

  for (const { code, label, key } of LANGUAGES) {
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
    const { detach } = attachTooltip(button, { text: () => t(key), placement: "top" });
    detachTooltips.push(detach);
    group.append(button);
  }

  section.append(heading, group);

  return {
    el: section,
    destroy: () => {
      for (const detach of detachTooltips) {
        detach();
      }
    },
  };
}
