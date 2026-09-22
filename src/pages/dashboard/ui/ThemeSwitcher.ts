import { getThemeMode, setThemeMode } from "@/shared/lib";
import type { ThemeMode } from "@/shared/lib";
import "./ThemeSwitcher.css";

const MODES: ThemeMode[] = ["system", "light", "dark"];

export function ThemeSwitcher(): HTMLElement {
  const group = document.createElement("div");
  group.className = "theme-switcher";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "Theme");

  const current = getThemeMode();

  for (const mode of MODES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-switcher__button state-layer";
    button.textContent = mode;
    button.setAttribute("aria-pressed", String(mode === current));
    button.addEventListener("click", () => {
      setThemeMode(mode);
      group.querySelectorAll("button").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
    });
    group.append(button);
  }

  return group;
}
