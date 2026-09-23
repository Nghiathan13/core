import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TOOLTIP_GRACE_PERIOD, TOOLTIP_SHOW_DELAY } from "./Tooltip";
import { attachTooltip } from "./Tooltip";

function tips(): number {
  return document.body.querySelectorAll(".tooltip").length;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_000_000);
});

afterEach(() => {
  document.body.querySelectorAll(".tooltip").forEach((tip) => tip.remove());
  vi.useRealTimers();
});

function hover(trigger: HTMLElement): void {
  trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
  vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY);
}

describe("attachTooltip", () => {
  it("shows tooltip on hover with describedby link", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, { text: "Expand" });
    hover(trigger);
    expect(tips()).toBe(1);
    const tip = document.body.querySelector(".tooltip");
    expect(tip?.textContent).toBe("Expand");
    expect(tip?.getAttribute("role")).toBe("tooltip");
    expect(trigger.getAttribute("aria-describedby")).toBe(tip?.id);
    detach();
    trigger.remove();
  });

  it("hides tooltip on leave", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, { text: "Expand" });
    hover(trigger);
    trigger.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    expect(tips()).toBe(0);
    expect(trigger.hasAttribute("aria-describedby")).toBe(false);
    detach();
    trigger.remove();
  });

  it("hides tooltip on Escape", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, { text: "Expand" });
    hover(trigger);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(tips()).toBe(0);
    detach();
    trigger.remove();
  });

  it("resolves text lazily on each show", () => {
    let label = "Collapse";
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, { text: () => label });
    hover(trigger);
    expect(document.body.querySelector(".tooltip")?.textContent).toBe("Collapse");
    trigger.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    label = "Expand";
    hover(trigger);
    expect(document.body.querySelector(".tooltip")?.textContent).toBe("Expand");
    detach();
    trigger.remove();
  });

  it("refreshes visible text without re-hover", () => {
    let label = "Collapse";
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach, refresh } = attachTooltip(trigger, { text: () => label });
    hover(trigger);
    label = "Expand";
    refresh();
    expect(document.body.querySelector(".tooltip")?.textContent).toBe("Expand");
    detach();
    trigger.remove();
  });

  it("resolves placement lazily on each show", () => {
    let calls = 0;
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, {
      text: "tip",
      placement: () => {
        calls += 1;
        return "top";
      },
    });
    expect(calls).toBe(0);
    hover(trigger);
    expect(calls).toBeGreaterThanOrEqual(1);
    detach();
    trigger.remove();
  });

  it("hides tooltip on click while hovering", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, { text: "Expand" });
    hover(trigger);
    expect(tips()).toBe(1);
    trigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(tips()).toBe(0);
    detach();
    trigger.remove();
  });

  it("waits for delay before showing", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, { text: "Expand" });
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(tips()).toBe(0);
    vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY);
    expect(tips()).toBe(1);
    detach();
    trigger.remove();
  });

  it("cancels pending show when leaving early", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, { text: "Expand" });
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    trigger.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY);
    expect(tips()).toBe(0);
    detach();
    trigger.remove();
  });

  it("shows immediately when hovering within grace period", () => {
    const first = document.createElement("button");
    const second = document.createElement("button");
    document.body.append(first, second);
    const a = attachTooltip(first, { text: "A" });
    const b = attachTooltip(second, { text: "B" });
    hover(first);
    expect(tips()).toBe(1);
    first.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    second.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(document.body.querySelector(".tooltip")?.textContent).toBe("B");
    a.detach();
    b.detach();
    first.remove();
    second.remove();
  });

  it("waits full delay after grace period expires", () => {
    const first = document.createElement("button");
    const second = document.createElement("button");
    document.body.append(first, second);
    const a = attachTooltip(first, { text: "A" });
    const b = attachTooltip(second, { text: "B" });
    hover(first);
    first.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    vi.advanceTimersByTime(TOOLTIP_GRACE_PERIOD);
    second.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(tips()).toBe(0);
    vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY);
    expect(tips()).toBe(1);
    a.detach();
    b.detach();
    first.remove();
    second.remove();
  });

  it("exposes actual placement for directional animation", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, { text: "Expand", placement: "bottom" });
    hover(trigger);
    const tip = document.body.querySelector(".tooltip");
    expect(tip instanceof HTMLElement ? tip.dataset.placement : undefined).toBe("bottom");
    detach();
    trigger.remove();
  });

  it("renders arrow pointing at trigger", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, { text: "Expand", placement: "bottom" });
    hover(trigger);
    const arrow = document.body.querySelector(".tooltip-arrow");
    expect(arrow?.getAttribute("aria-hidden")).toBe("true");
    expect((arrow as HTMLElement | null)?.style.left).not.toBe("");
    detach();
    trigger.remove();
  });

  it("removes listeners on detach", () => {    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, { text: "Expand" });
    detach();
    hover(trigger);
    expect(tips()).toBe(0);
    trigger.remove();
  });
});
