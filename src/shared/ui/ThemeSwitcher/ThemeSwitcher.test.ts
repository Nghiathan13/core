import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setLanguage } from "../../i18n";
import { setThemeMode } from "../../lib";
import { TOOLTIP_SHOW_DELAY } from "../Tooltip";
import { ThemeSwitcher } from "./ThemeSwitcher";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_000_000);
});

afterEach(() => {
  document.body.querySelectorAll(".tooltip").forEach((tip) => tip.remove());
  document.body.querySelectorAll("section").forEach((el) => el.remove());
  vi.useRealTimers();
});

describe("ThemeSwitcher tooltips", () => {
  it("shows mode name on hover", () => {
    setLanguage("en");
    setThemeMode("system");
    const view = ThemeSwitcher();
    document.body.append(view.el);
    const first = view.el.querySelector("button");
    first?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY);
    expect(document.body.querySelector(".tooltip")?.textContent).toBe("System");
    view.destroy?.();
  });

  it("detaches tooltips on destroy", () => {
    setLanguage("en");
    setThemeMode("system");
    const view = ThemeSwitcher();
    document.body.append(view.el);
    view.destroy?.();
    const first = view.el.querySelector("button");
    first?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY);
    expect(document.body.querySelectorAll(".tooltip").length).toBe(0);
    view.el.remove();
  });
});
