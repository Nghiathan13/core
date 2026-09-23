import { describe, expect, it } from "vitest";
import { computePlacement } from "./position";
import type { TooltipSize, TooltipViewport } from "./position";

const VIEWPORT: TooltipViewport = { width: 1000, height: 800 };
const SIZE: TooltipSize = { width: 100, height: 40 };

describe("computePlacement", () => {
  it("places on preferred side when it fits", () => {
    const placed = computePlacement({ x: 400, y: 400, width: 50, height: 30 }, SIZE, VIEWPORT, "top");
    expect(placed.placement).toBe("top");
    expect(placed.x).toBe(400 + (50 - 100) / 2);
    expect(placed.y).toBe(400 - 40 - 8);
  });

  it("places right of trigger", () => {
    const placed = computePlacement({ x: 100, y: 400, width: 50, height: 30 }, SIZE, VIEWPORT, "right");
    expect(placed.placement).toBe("right");
    expect(placed.x).toBe(150 + 8);
    expect(placed.y).toBe(400 + (30 - 40) / 2);
  });

  it("flips to opposite side when preferred overflows", () => {
    const placed = computePlacement({ x: 400, y: 10, width: 50, height: 30 }, SIZE, VIEWPORT, "top");
    expect(placed.placement).toBe("bottom");
    expect(placed.y).toBe(40 + 8);
  });

  it("keeps 8px margin from viewport edge", () => {
    const placed = computePlacement({ x: 0, y: 400, width: 50, height: 30 }, SIZE, VIEWPORT, "top");
    expect(placed.x).toBeGreaterThanOrEqual(8);
  });

  it("shifts into viewport instead of flipping when only cross axis overflows", () => {
    const placed = computePlacement({ x: 8, y: 100, width: 36, height: 36 }, SIZE, VIEWPORT, "bottom");
    expect(placed.placement).toBe("bottom");
    expect(placed.x).toBe(8);
    expect(placed.y).toBe(136 + 8);
  });

  it("clamps into viewport when nothing fits", () => {
    const huge: TooltipSize = { width: 2000, height: 1600 };
    const placed = computePlacement({ x: 400, y: 400, width: 50, height: 30 }, huge, VIEWPORT, "top");
    expect(placed.x).toBeGreaterThanOrEqual(8);
    expect(placed.y).toBeGreaterThanOrEqual(8);
  });
});
