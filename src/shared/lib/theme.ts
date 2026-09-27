export type ThemeMode = "system" | "light" | "dark";

type EffectiveTheme = "light" | "dark";

let current: ThemeMode = "system";

function resolveTheme(mode: ThemeMode): EffectiveTheme {
  if (mode !== "system") {
    return mode;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(mode: ThemeMode): void {
  document.documentElement.setAttribute("data-theme", resolveTheme(mode));
}

export function getThemeMode(): ThemeMode {
  return current;
}

export function setThemeMode(mode: ThemeMode): void {
  current = mode;
  applyTheme(mode);
}

export function initTheme(): void {
  applyTheme(current);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", () => {
    if (current === "system") {
      applyTheme("system");
    }
  });
}
