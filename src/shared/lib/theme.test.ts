import { beforeEach, describe, expect, it } from "vitest";
import { getThemeMode, initTheme, setThemeMode } from "./theme";

const mediaRecords: { listeners: (() => void)[]; dark: boolean }[] = [];

function mockColorScheme(dark: boolean): void {
  const record: { listeners: (() => void)[]; dark: boolean } = {
    listeners: [],
    dark,
  };
  mediaRecords.push(record);
  window.matchMedia = ((query: string) => ({
    matches: record.dark,
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: () => void) => {
      record.listeners.push(listener);
    },
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function fireColorSchemeChange(): void {
  for (const record of mediaRecords) {
    for (const listener of record.listeners) {
      listener();
    }
  }
}

function appliedTheme(): string | null {
  return document.documentElement.getAttribute("data-theme");
}

describe("theme mode", () => {
  beforeEach(() => {
    mediaRecords.length = 0;
    mockColorScheme(false);
    setThemeMode("system");
  });

  it("defaults to system", () => {
    expect(getThemeMode()).toBe("system");
  });

  it("applies forced mode to document", () => {
    setThemeMode("dark");
    expect(getThemeMode()).toBe("dark");
    expect(appliedTheme()).toBe("dark");
  });

  it("resolves system to light when OS is light", () => {
    mockColorScheme(false);
    setThemeMode("system");
    expect(appliedTheme()).toBe("light");
  });

  it("resolves system to dark when OS is dark", () => {
    mockColorScheme(true);
    setThemeMode("system");
    expect(appliedTheme()).toBe("dark");
  });

  it("initTheme applies stored mode", () => {
    setThemeMode("light");
    document.documentElement.removeAttribute("data-theme");
    initTheme();
    expect(appliedTheme()).toBe("light");
  });

  it("follows OS change while mode is system", () => {
    initTheme();
    mockColorScheme(true);
    fireColorSchemeChange();
    expect(appliedTheme()).toBe("dark");
  });

  it("ignores OS change when mode is forced", () => {
    setThemeMode("light");
    initTheme();
    mockColorScheme(true);
    fireColorSchemeChange();
    expect(appliedTheme()).toBe("light");
  });
});
