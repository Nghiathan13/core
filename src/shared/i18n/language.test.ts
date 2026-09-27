import { beforeEach, describe, expect, it } from "vitest";
import {
  applyLanguage,
  getLanguage,
  getLanguageMode,
  initLanguage,
  setLanguage,
  setLanguageMode,
  t,
} from "./language";

function mockNavigatorLanguage(value: string): void {
  Object.defineProperty(window.navigator, "language", {
    value,
    configurable: true,
  });
}

function mockNavigatorLanguages(value: readonly string[] | undefined): void {
  Object.defineProperty(window.navigator, "languages", {
    value,
    configurable: true,
  });
}

describe("language", () => {
  beforeEach(() => {
    mockNavigatorLanguages(["en-US"]);
    mockNavigatorLanguage("en-US");
    setLanguage("en");
    document.body.innerHTML = "";
  });

  it("detects vietnamese system locale on init", () => {
    mockNavigatorLanguages(["vi-VN"]);
    mockNavigatorLanguage("en-US");
    initLanguage();
    expect(getLanguageMode()).toBe("system");
    expect(getLanguage()).toBe("vi");
  });

  it("prefers later vietnamese match in language list", () => {
    mockNavigatorLanguages(["en-US"]);
    mockNavigatorLanguage("vi-VN");
    initLanguage();
    expect(getLanguage()).toBe("vi");
  });

  it("falls back without language list", () => {
    mockNavigatorLanguages(undefined);
    mockNavigatorLanguage("vi-VN");
    initLanguage();
    expect(getLanguage()).toBe("vi");
  });

  it("defaults to english for other locales", () => {
    mockNavigatorLanguages(["en-US", "fr-FR"]);
    mockNavigatorLanguage("en-US");
    initLanguage();
    expect(getLanguage()).toBe("en");
  });

  it("resolves explicit mode and system mode", () => {
    mockNavigatorLanguages(["en-US"]);
    mockNavigatorLanguage("en-US");
    setLanguage("vi");
    expect(getLanguageMode()).toBe("vi");
    expect(getLanguage()).toBe("vi");
    setLanguageMode("system");
    expect(getLanguageMode()).toBe("system");
    expect(getLanguage()).toBe("en");
  });

  it("follows OS changes while in system mode", () => {
    mockNavigatorLanguages(["en-US"]);
    mockNavigatorLanguage("en-US");
    initLanguage();
    const element = document.createElement("p");
    element.setAttribute("data-i18n", "setting");
    document.body.append(element);
    applyLanguage();
    expect(element.textContent).toBe("Setting");
    mockNavigatorLanguages(["vi-VN"]);
    mockNavigatorLanguage("vi-VN");
    window.dispatchEvent(new Event("languagechange"));
    expect(getLanguage()).toBe("vi");
    expect(element.textContent).toBe("Cài đặt");
  });

  it("ignores unchanged OS locale while in system mode", () => {
    mockNavigatorLanguages(["en-US"]);
    mockNavigatorLanguage("en-US");
    initLanguage();
    window.dispatchEvent(new Event("languagechange"));
    expect(getLanguage()).toBe("en");
  });

  it("ignores OS changes while in explicit mode", () => {
    mockNavigatorLanguages(["en-US"]);
    mockNavigatorLanguage("en-US");
    setLanguage("vi");
    mockNavigatorLanguages(["en-US"]);
    mockNavigatorLanguage("en-US");
    window.dispatchEvent(new Event("languagechange"));
    expect(getLanguage()).toBe("vi");
    expect(getLanguageMode()).toBe("vi");
  });

  it("translates known keys", () => {
    setLanguage("vi");
    expect(t("setting")).toBe("Cài đặt");
  });

  it("returns key for unknown keys", () => {
    expect(t("missing.key")).toBe("missing.key");
  });

  it("applies language to data-i18n elements", () => {
    const element = document.createElement("p");
    element.setAttribute("data-i18n", "setting");
    document.body.append(element);
    setLanguage("vi");
    expect(element.textContent).toBe("Cài đặt");
  });

  it("skips data-i18n elements without key", () => {
    const element = document.createElement("p");
    element.setAttribute("data-i18n", "");
    element.textContent = "untouched";
    document.body.append(element);
    applyLanguage();
    expect(element.textContent).toBe("untouched");
  });
});
