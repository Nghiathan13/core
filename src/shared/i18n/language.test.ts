import { beforeEach, describe, expect, it } from "vitest";
import { applyLanguage, getLanguage, initLanguage, setLanguage, t } from "./language";

function mockNavigatorLanguage(value: string): void {
  Object.defineProperty(window.navigator, "language", { value, configurable: true });
}

describe("language", () => {
  beforeEach(() => {
    mockNavigatorLanguage("en-US");
    setLanguage("en");
    document.body.innerHTML = "";
  });

  it("detects vietnamese system locale on init", () => {
    mockNavigatorLanguage("vi-VN");
    initLanguage();
    expect(getLanguage()).toBe("vi");
  });

  it("defaults to english for other locales", () => {
    initLanguage();
    expect(getLanguage()).toBe("en");
  });

  it("translates known keys", () => {
    setLanguage("vi");
    expect(t("setting")).toBe("cài đặt");
  });

  it("returns key for unknown keys", () => {
    expect(t("missing.key")).toBe("missing.key");
  });

  it("applies language to data-i18n elements", () => {
    const element = document.createElement("p");
    element.setAttribute("data-i18n", "setting");
    document.body.append(element);
    setLanguage("vi");
    expect(element.textContent).toBe("cài đặt");
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
