import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setLanguage } from "../../i18n";
import { TOOLTIP_SHOW_DELAY } from "../Tooltip";
import { LanguageSwitcher } from "./LanguageSwitcher";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_000_000);
});

afterEach(() => {
  document.body.querySelectorAll(".tooltip").forEach((tip) => tip.remove());
  document.body.querySelectorAll("section").forEach((el) => el.remove());
  vi.useRealTimers();
});

describe("LanguageSwitcher tooltips", () => {
  it("shows language name on hover", () => {
    setLanguage("en");
    const view = LanguageSwitcher();
    document.body.append(view.el);
    const first = view.el.querySelector("button");
    first?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY);
    expect(document.body.querySelector(".tooltip")?.textContent).toBe("Vietnamese");
    view.destroy?.();
  });

  it("detaches tooltips on destroy", () => {
    setLanguage("en");
    const view = LanguageSwitcher();
    document.body.append(view.el);
    view.destroy?.();
    const first = view.el.querySelector("button");
    first?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY);
    expect(document.body.querySelectorAll(".tooltip").length).toBe(0);
    view.el.remove();
  });
});
