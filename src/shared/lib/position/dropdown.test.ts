import { describe, expect, it } from "vitest";
import {
  DEFAULT_MENU_WIDTH,
  MENU_GAP,
  VIEWPORT_MARGIN,
  computeDropdownPosition,
  setupDropdownPosition,
} from "./dropdown";

describe("dropdown position", () => {
  it("computes position with default options and sets style", async () => {
    const trigger = document.createElement("button");
    const menu = document.createElement("div");
    document.body.append(trigger, menu);

    trigger.getBoundingClientRect = () => ({
      x: 100,
      y: 100,
      width: 120,
      height: 40,
      top: 100,
      bottom: 140,
      left: 100,
      right: 220,
      toJSON: () => {},
    });
    menu.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      width: 150,
      height: 200,
      top: 0,
      bottom: 200,
      left: 0,
      right: 150,
      toJSON: () => {},
    });

    const result = await computeDropdownPosition(trigger, menu);
    expect(result.placement).toBe("bottom-start");
    expect(menu.style.left).toBe(`${result.x}px`);
    expect(menu.style.top).toBe(`${result.y}px`);

    trigger.remove();
    menu.remove();
  });

  it("computes position with custom options", async () => {
    const trigger = document.createElement("button");
    const menu = document.createElement("div");
    document.body.append(trigger, menu);

    trigger.getBoundingClientRect = () => ({
      x: 100,
      y: 100,
      width: 120,
      height: 40,
      top: 100,
      bottom: 140,
      left: 100,
      right: 220,
      toJSON: () => {},
    });
    menu.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      width: 150,
      height: 200,
      top: 0,
      bottom: 200,
      left: 0,
      right: 150,
      toJSON: () => {},
    });

    const result = await computeDropdownPosition(trigger, menu, {
      placement: "top-start",
      gap: 12,
      padding: 16,
    });
    expect(result.placement).toBe("top-start");
    expect(menu.style.left).toBe(`${result.x}px`);
    expect(menu.style.top).toBe(`${result.y}px`);

    trigger.remove();
    menu.remove();
  });

  it("uses DEFAULT_MENU_WIDTH when trigger has 0 width", async () => {
    const trigger = document.createElement("button");
    const menu = document.createElement("div");
    document.body.append(trigger, menu);

    trigger.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      toJSON: () => {},
    });
    menu.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      toJSON: () => {},
    });

    const controller = setupDropdownPosition(trigger, menu);
    expect(menu.style.minWidth).toBe(`${DEFAULT_MENU_WIDTH}px`);
    const result = await controller.reposition();
    expect(result).toBeDefined();
    controller.destroy();

    trigger.remove();
    menu.remove();
  });

  it("setupDropdownPosition sets minWidth and binds autoUpdate lifecycle", async () => {
    const trigger = document.createElement("button");
    const menu = document.createElement("div");
    document.body.append(trigger, menu);

    trigger.getBoundingClientRect = () => ({
      x: 100,
      y: 100,
      width: 140,
      height: 36,
      top: 100,
      bottom: 136,
      left: 100,
      right: 240,
      toJSON: () => {},
    });
    menu.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      width: 140,
      height: 180,
      top: 0,
      bottom: 180,
      left: 0,
      right: 140,
      toJSON: () => {},
    });

    const controller = setupDropdownPosition(trigger, menu, { gap: 6 });
    expect(menu.style.minWidth).toBe("140px");

    const result = await controller.reposition();
    expect(result.x).toBeDefined();
    expect(result.y).toBeDefined();

    controller.destroy();
    trigger.remove();
    menu.remove();
  });

  it("exports correct default constants", () => {
    expect(MENU_GAP).toBe(4);
    expect(VIEWPORT_MARGIN).toBe(8);
    expect(DEFAULT_MENU_WIDTH).toBe(160);
  });
});
