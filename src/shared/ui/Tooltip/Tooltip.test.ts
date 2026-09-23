import { afterEach, describe, expect, it } from "vitest";
import { attachTooltip } from "./Tooltip";

function tips(): number {
  return document.body.querySelectorAll(".tooltip").length;
}

afterEach(() => {
  document.body.querySelectorAll(".tooltip").forEach((tip) => tip.remove());
});

describe("attachTooltip", () => {
  it("shows tooltip on hover with describedby link", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, { text: "Expand" });
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
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
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
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
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
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
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(document.body.querySelector(".tooltip")?.textContent).toBe("Collapse");
    trigger.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    label = "Expand";
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(document.body.querySelector(".tooltip")?.textContent).toBe("Expand");
    detach();
    trigger.remove();
  });

  it("refreshes visible text without re-hover", () => {
    let label = "Collapse";
    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach, refresh } = attachTooltip(trigger, { text: () => label });
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
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
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(calls).toBeGreaterThanOrEqual(1);
    detach();
    trigger.remove();
  });

  it("removes listeners on detach", () => {    const trigger = document.createElement("button");
    document.body.append(trigger);
    const { detach } = attachTooltip(trigger, { text: "Expand" });
    detach();
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(tips()).toBe(0);
    trigger.remove();
  });
});
