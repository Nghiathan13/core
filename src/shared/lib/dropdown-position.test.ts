import { describe, expect, it } from "vitest";
import {
  DEFAULT_MENU_WIDTH,
  MENU_GAP,
  VIEWPORT_MARGIN,
  computeDropdownPosition,
} from "./dropdown-position";

describe("computeDropdownPosition", () => {
  const defaultViewport = { width: 1000, height: 800 };

  it("places dropdown below trigger when it fits", () => {
    const trigger = { x: 100, y: 100, width: 120, height: 40 };
    const menu = { width: 150, height: 200 };

    const pos = computeDropdownPosition(trigger, menu, defaultViewport);

    expect(pos.x).toBe(100);
    expect(pos.y).toBe(100 + 40 + MENU_GAP);
    expect(pos.minWidth).toBe(120);
  });

  it("flips above trigger when it does not fit below", () => {
    const trigger = { x: 100, y: 650, width: 120, height: 40 };
    const menu = { width: 150, height: 200 };

    const pos = computeDropdownPosition(trigger, menu, defaultViewport);

    expect(pos.x).toBe(100);
    expect(pos.y).toBe(650 - 200 - MENU_GAP);
  });

  it("clamps to left viewport margin when trigger is off-screen to the left", () => {
    const trigger = { x: 2, y: 100, width: 120, height: 40 };
    const menu = { width: 150, height: 200 };

    const pos = computeDropdownPosition(trigger, menu, defaultViewport);

    expect(pos.x).toBe(VIEWPORT_MARGIN);
  });

  it("clamps to right viewport margin when menu overflows right edge", () => {
    const trigger = { x: 920, y: 100, width: 120, height: 40 };
    const menu = { width: 150, height: 200 };

    const pos = computeDropdownPosition(trigger, menu, defaultViewport);

    expect(pos.x).toBe(1000 - 150 - VIEWPORT_MARGIN);
  });

  it("uses default width when menu and trigger width are 0", () => {
    const trigger = { x: 50, y: 50, width: 0, height: 30 };
    const menu = { width: 0, height: 100 };

    const pos = computeDropdownPosition(trigger, menu, defaultViewport);

    expect(pos.minWidth).toBe(DEFAULT_MENU_WIDTH);
    expect(pos.x).toBe(50);
  });

  it("clamps to top margin when it neither fits below nor above", () => {
    const tinyViewport = { width: 500, height: 150 };
    const trigger = { x: 50, y: 60, width: 100, height: 30 };
    const menu = { width: 100, height: 120 };

    const pos = computeDropdownPosition(trigger, menu, tinyViewport);

    expect(pos.y).toBe(VIEWPORT_MARGIN);
  });
});
