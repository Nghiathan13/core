import { describe, expect, it } from "vitest";
import {
  getNextActiveIndex,
  isNavigationKey,
  isSelectKey,
  isTriggerOpenKey,
} from "./list-navigation";

describe("list-navigation key helpers", () => {
  it("identifies navigation keys", () => {
    expect(isNavigationKey("ArrowDown")).toBe(true);
    expect(isNavigationKey("ArrowUp")).toBe(true);
    expect(isNavigationKey("Home")).toBe(true);
    expect(isNavigationKey("End")).toBe(true);
    expect(isNavigationKey("Escape")).toBe(false);
    expect(isNavigationKey("Tab")).toBe(false);
    expect(isNavigationKey("Enter")).toBe(false);
  });

  it("identifies trigger open keys", () => {
    expect(isTriggerOpenKey("ArrowDown")).toBe(true);
    expect(isTriggerOpenKey("ArrowUp")).toBe(true);
    expect(isTriggerOpenKey("Enter")).toBe(false);
    expect(isTriggerOpenKey("Escape")).toBe(false);
  });

  it("identifies select keys", () => {
    expect(isSelectKey("Enter")).toBe(true);
    expect(isSelectKey(" ")).toBe(true);
    expect(isSelectKey("ArrowDown")).toBe(false);
    expect(isSelectKey("Tab")).toBe(false);
  });
});

describe("getNextActiveIndex", () => {
  it("returns -1 when total is 0 or negative", () => {
    expect(getNextActiveIndex(0, 0, "ArrowDown")).toBe(-1);
    expect(getNextActiveIndex(0, -1, "ArrowUp")).toBe(-1);
  });

  describe("ArrowDown", () => {
    it("moves to first item if current is -1", () => {
      expect(getNextActiveIndex(-1, 3, "ArrowDown")).toBe(0);
    });

    it("advances to next index", () => {
      expect(getNextActiveIndex(0, 3, "ArrowDown")).toBe(1);
      expect(getNextActiveIndex(1, 3, "ArrowDown")).toBe(2);
    });

    it("wraps around to 0 at the end of the list", () => {
      expect(getNextActiveIndex(2, 3, "ArrowDown")).toBe(0);
    });
  });

  describe("ArrowUp", () => {
    it("moves backward to previous index", () => {
      expect(getNextActiveIndex(2, 3, "ArrowUp")).toBe(1);
      expect(getNextActiveIndex(1, 3, "ArrowUp")).toBe(0);
    });

    it("wraps around to the last item from 0", () => {
      expect(getNextActiveIndex(0, 3, "ArrowUp")).toBe(2);
    });

    it("wraps around to the last item from -1", () => {
      expect(getNextActiveIndex(-1, 3, "ArrowUp")).toBe(2);
    });
  });

  describe("Home and End", () => {
    it("jumps to first item on Home", () => {
      expect(getNextActiveIndex(2, 5, "Home")).toBe(0);
    });

    it("jumps to last item on End", () => {
      expect(getNextActiveIndex(1, 5, "End")).toBe(4);
    });
  });
});
