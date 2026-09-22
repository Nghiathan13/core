import { en, vi } from "./locales";

export type Language = "en" | "vi";

type Dict = Record<string, string>;

const DICTS: Record<Language, Dict> = { en, vi };

let current: Language = "en";

function detectLanguage(): Language {
  return window.navigator.language.toLowerCase().startsWith("vi") ? "vi" : "en";
}

export function getLanguage(): Language {
  return current;
}

export function t(key: string): string {
  return DICTS[current][key] ?? key;
}

export function setLanguage(language: Language): void {
  current = language;
  applyLanguage();
}

export function applyLanguage(root: ParentNode = document): void {
  root.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (key) {
      element.textContent = t(key);
    }
  });
}

export function initLanguage(): void {
  current = detectLanguage();
  applyLanguage();
}
