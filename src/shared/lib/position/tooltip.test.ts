import { describe, expect, it } from "vitest";
import {
  TOOLTIP_ARROW_SIZE,
  TOOLTIP_GAP,
  TOOLTIP_MARGIN,
  computeTooltipPosition,
  setupTooltipPosition,
} from "./tooltip";

describe("tooltip position", () => {
  function createFixture(): {
    trigger: HTMLButtonElement;
    tip: HTMLDivElement;
    arrowEl: HTMLDivElement;
  } {
    const trigger = document.createElement("button");
    const tip = document.createElement("div");
    const arrowEl = document.createElement("div");
    tip.append(arrowEl);
    document.body.append(trigger, tip);

    trigger.getBoundingClientRect = () => ({
      x: 100,
      y: 100,
      width: 80,
      height: 32,
      top: 100,
      bottom: 132,
      left: 100,
      right: 180,
      toJSON: () => {},
    });
    tip.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      width: 100,
      height: 24,
      top: 0,
      bottom: 24,
      left: 0,
      right: 100,
      toJSON: () => {},
    });
    arrowEl.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      width: 8,
      height: 8,
      top: 0,
      bottom: 8,
      left: 0,
      right: 8,
      toJSON: () => {},
    });

    return { trigger, tip, arrowEl };
  }

  it("computes position for top placement with horizontal arrow offset", async () => {
    const { trigger, tip, arrowEl } = createFixture();

    const result = await computeTooltipPosition(trigger, tip, arrowEl, "top");
    expect(result.placement).toBe("top");
    expect(tip.style.left).toBe(`${result.x}px`);
    expect(tip.style.top).toBe(`${result.y}px`);
    expect(tip.dataset.placement).toBe("top");
    expect(arrowEl.style.left).not.toBe("");
    expect(arrowEl.style.top).toBe("");

    trigger.remove();
    tip.remove();
  });

  it("computes position for bottom placement with horizontal arrow offset", async () => {
    const { trigger, tip, arrowEl } = createFixture();

    const result = await computeTooltipPosition(
      trigger,
      tip,
      arrowEl,
      "bottom",
      { gap: 10, padding: 12 },
    );
    expect(result.placement).toBe("bottom");
    expect(result.x).toBeDefined();
    expect(result.y).toBeDefined();
    expect(tip.dataset.placement).toBe("bottom");
    expect(arrowEl.style.left).not.toBe("");
    expect(arrowEl.style.top).toBe("");

    trigger.remove();
    tip.remove();
  });

  it("computes position for left placement with vertical arrow offset", async () => {
    const { trigger, tip, arrowEl } = createFixture();

    const result = await computeTooltipPosition(trigger, tip, arrowEl, "left");
    expect(result.placement).toBe("left");
    expect(arrowEl.style.top).not.toBe("");
    expect(arrowEl.style.left).toBe("");

    trigger.remove();
    tip.remove();
  });

  it("computes position for right placement with vertical arrow offset", async () => {
    const { trigger, tip, arrowEl } = createFixture();

    const result = await computeTooltipPosition(trigger, tip, arrowEl, "right");
    expect(result.placement).toBe("right");
    expect(arrowEl.style.top).not.toBe("");
    expect(arrowEl.style.left).toBe("");

    trigger.remove();
    tip.remove();
  });

  it("setupTooltipPosition sets initial synchronous styles for top/bottom", async () => {
    const { trigger, tip, arrowEl } = createFixture();

    const controller = setupTooltipPosition(
      trigger,
      tip,
      arrowEl,
      () => "bottom",
    );
    expect(tip.dataset.placement).toBe("bottom");
    expect(arrowEl.style.left).toContain("50%");
    expect(arrowEl.style.top).toBe("");

    const result = await controller.reposition();
    expect(result.x).toBeDefined();
    controller.destroy();

    trigger.remove();
    tip.remove();
  });

  it("setupTooltipPosition sets initial synchronous styles for left/right", async () => {
    const { trigger, tip, arrowEl } = createFixture();

    const controller = setupTooltipPosition(
      trigger,
      tip,
      arrowEl,
      () => "left",
    );
    expect(tip.dataset.placement).toBe("left");
    expect(arrowEl.style.top).toContain("50%");
    expect(arrowEl.style.left).toBe("");

    controller.destroy();

    trigger.remove();
    tip.remove();
  });

  it("exports correct default constants", () => {
    expect(TOOLTIP_MARGIN).toBe(8);
    expect(TOOLTIP_GAP).toBe(8);
    expect(TOOLTIP_ARROW_SIZE).toBe(8);
  });
});
