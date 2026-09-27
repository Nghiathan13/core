import { en, vi } from "./locales";

export type Language = "en" | "vi";
export type LanguageMode = "system" | Language;

type Dict = Record<string, string>;

const DICTS: Record<Language, Dict> = { en, vi };

let mode: LanguageMode = "system";
let current: Language = "en";
let listenerBound = false;

function systemLanguage(): Language {
  const candidates = [
    ...(window.navigator.languages ?? []),
    window.navigator.language,
  ];
  for (const tag of candidates) {
    if (tag.toLowerCase().startsWith("vi")) {
      return "vi";
    }
  }
  return "en";
}

function resolveLanguage(next: LanguageMode): Language {
  return next === "system" ? systemLanguage() : next;
}

export function getLanguage(): Language {
  return current;
}

export function getLanguageMode(): LanguageMode {
  return mode;
}

export function t(key: string): string {
  return DICTS[current][key] ?? key;
}

export function setLanguageMode(next: LanguageMode): void {
  mode = next;
  current = resolveLanguage(next);
  applyLanguage();
}

export function setLanguage(language: Language): void {
  setLanguageMode(language);
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
  mode = "system";
  current = resolveLanguage(mode);
  applyLanguage();

  if (!listenerBound) {
    listenerBound = true;
    window.addEventListener("languagechange", () => {
      if (mode === "system") {
        const next = systemLanguage();
        if (next !== current) {
          current = next;
          applyLanguage();
        }
      }
    });
  }
}
