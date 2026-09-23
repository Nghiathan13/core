import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setLanguage } from "@/shared/i18n";
import { TOOLTIP_SHOW_DELAY } from "@/shared/ui/Tooltip";
import { setCollapsed } from "./collapse";
import { NavLinks } from "./NavLinks";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_000_000);
});

afterEach(() => {
  document.body.querySelectorAll(".tooltip").forEach((tip) => tip.remove());
  document.body.querySelectorAll(".sidebar-content").forEach((el) => el.remove());
  setCollapsed(false);
  vi.useRealTimers();
});

describe("NavLinks tooltips", () => {
  it("shows tooltip when sidebar is collapsed", () => {
    setLanguage("en");
    setCollapsed(true);
    const view = NavLinks();
    document.body.append(view.el);
    const first = view.el.querySelector("button");
    first?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY);
    expect(document.body.querySelector(".tooltip")?.textContent).toBe("dashboard");
    view.destroy?.();
  });

  it("hides tooltip when sidebar is expanded", () => {
    setLanguage("en");
    setCollapsed(false);
    const view = NavLinks();
    document.body.append(view.el);
    const first = view.el.querySelector("button");
    first?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY);
    expect(document.body.querySelectorAll(".tooltip").length).toBe(0);
    view.destroy?.();
  });
});
