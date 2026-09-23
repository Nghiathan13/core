import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setLanguage } from "@/shared/i18n";
import { TOOLTIP_SHOW_DELAY } from "@/shared/ui/Tooltip";
import { setCollapsed } from "./collapse";
import { CollapseButton } from "./CollapseButton";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_000_000);
});

afterEach(() => {
  document.body.querySelectorAll(".tooltip").forEach((tip) => tip.remove());
  document.body.querySelectorAll("button").forEach((button) => button.remove());
  setCollapsed(false);
  vi.useRealTimers();
});

describe("CollapseButton tooltip", () => {
  it("hides on press and shows swapped text after click without re-hover", async () => {
    setLanguage("en");
    const view = CollapseButton();
    document.body.append(view.el);
    const button = view.el as HTMLButtonElement;

    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY);
    expect(document.body.querySelector(".tooltip")?.textContent).toBe("Collapse Sidebar");

    button.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(document.body.querySelectorAll(".tooltip").length).toBe(0);

    button.click();
    await Promise.resolve();
    expect(document.body.querySelector(".tooltip")?.textContent).toBe("Expand Sidebar");

    view.destroy?.();
  });

  it("survives real browser event order with focus between press and click", async () => {
    setLanguage("en");
    const view = CollapseButton();
    document.body.append(view.el);
    const button = view.el as HTMLButtonElement;

    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY);
    button.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    button.dispatchEvent(new FocusEvent("focus"));
    button.click();
    await Promise.resolve();
    await Promise.resolve();
    expect(document.body.querySelector(".tooltip")?.textContent).toBe("Expand Sidebar");

    view.destroy?.();
  });
});
