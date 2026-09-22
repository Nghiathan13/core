import { createElement, Monitor, Moon, Sun } from "lucide";
import type { IconNode } from "lucide";
import { getThemeMode, setThemeMode } from "../../lib";
import type { ThemeMode } from "../../lib";
import { TabButton } from "../TabButton";
import "./ThemeSwitcher.css";

const MODES: { mode: ThemeMode; icon: IconNode }[] = [
  { mode: "system", icon: Monitor },
  { mode: "light", icon: Sun },
  { mode: "dark", icon: Moon },
];

export function ThemeSwitcher(): HTMLElement {
  const group = document.createElement("div");
  group.className = "theme-switcher";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "Theme");

  const current = getThemeMode();

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
    group.append(button);
  }

  return group;
}
