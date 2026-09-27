import { createElement, Monitor, Moon, Sun } from "lucide";
import type { IconNode } from "lucide";
import { t } from "../../i18n";
import { getThemeMode, setThemeMode } from "../../lib";
import type { ThemeMode, View } from "../../lib";
import { TabButton } from "../TabButton";
import { attachTooltip } from "../Tooltip";
import "./ThemeSwitcher.css";

const MODES: { mode: ThemeMode; icon: IconNode }[] = [
  { mode: "system", icon: Monitor },
  { mode: "light", icon: Sun },
  { mode: "dark", icon: Moon },
];

export function ThemeSwitcher(): View {
  const section = document.createElement("section");

  const header = document.createElement("h2");
  header.className = "settings-section-header";
  header.textContent = t("appearance");
  header.setAttribute("data-i18n", "appearance");

  const heading = document.createElement("h3");
  heading.className = "theme-switcher-title";
  heading.textContent = t("theme");
  heading.setAttribute("data-i18n", "theme");

  const group = document.createElement("div");
  group.className = "theme-switcher";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "Theme");

  const current = getThemeMode();
  const detachTooltips: (() => void)[] = [];

  for (const { mode, icon } of MODES) {
    const button = TabButton({
      icon: createElement(icon),
      label: mode,
      selected: mode === current,
      onClick: () => {
        setThemeMode(mode);
        group.querySelectorAll("button").forEach((item) => {
          item.setAttribute("aria-pressed", String(item === button));
        });
      },
    });
    const { detach } = attachTooltip(button, {
      text: () => t(mode),
      placement: "top",
    });
    detachTooltips.push(detach);
    group.append(button);
  }

  section.append(header, heading, group);

  return {
    el: section,
    destroy: () => {
      for (const detach of detachTooltips) {
        detach();
      }
    },
  };
}
