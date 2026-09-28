import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BASE_TIERS,
  acquireOverlay,
  dismissTopOverlay,
  getActiveOverlaysCount,
  hasActiveOverlaysAbove,
  releaseOverlay,
  resetStackingForTesting,
} from "./stacking";

describe("Dynamic Stacking Manager", () => {
  beforeEach(() => {
    resetStackingForTesting();
  });

  describe("acquireOverlay and releaseOverlay", () => {
    it("allocates correct base z-index for each tier", () => {
      const modal = acquireOverlay({ id: "m1", tier: "modal" });
      const dropdown = acquireOverlay({ id: "d1", tier: "dropdown" });
      const tooltip = acquireOverlay({ id: "t1", tier: "tooltip" });

      expect(modal.zIndex).toBe(BASE_TIERS.modal);
      expect(dropdown.zIndex).toBe(BASE_TIERS.dropdown);
      expect(tooltip.zIndex).toBe(BASE_TIERS.tooltip);
      expect(getActiveOverlaysCount()).toBe(3);
    });

    it("increments z-index for multiple overlays in the same tier", () => {
      const m1 = acquireOverlay({ id: "m1", tier: "modal" });
      const m2 = acquireOverlay({ id: "m2", tier: "modal" });
      const m3 = acquireOverlay({ id: "m3", tier: "modal" });

      expect(m1.zIndex).toBe(1000);
      expect(m2.zIndex).toBe(1010);
      expect(m3.zIndex).toBe(1020);
    });

    it("releases overlay via handle.release()", () => {
      const modal = acquireOverlay({ id: "m1", tier: "modal" });
      expect(getActiveOverlaysCount()).toBe(1);

      modal.release();
      expect(getActiveOverlaysCount()).toBe(0);
    });

    it("releases overlay via releaseOverlay(id)", () => {
      acquireOverlay({ id: "m1", tier: "modal" });
      expect(getActiveOverlaysCount()).toBe(1);

      releaseOverlay("m1");
      expect(getActiveOverlaysCount()).toBe(0);
    });

    it("safely handles releasing non-existent overlay id", () => {
      acquireOverlay({ id: "m1", tier: "modal" });
      releaseOverlay("non-existent");
      expect(getActiveOverlaysCount()).toBe(1);
    });

    it("auto-generates sequential IDs when id is omitted", () => {
      const first = acquireOverlay({ tier: "modal" });
      const second = acquireOverlay({ tier: "modal" });

      expect(first.id).toBe("overlay-1");
      expect(second.id).toBe("overlay-2");
      expect(getActiveOverlaysCount()).toBe(2);
    });

    it("supports handle.hasOverlaysAbove() directly", () => {
      const modal = acquireOverlay({ tier: "modal" });
      expect(modal.hasOverlaysAbove()).toBe(false);

      const dropdown = acquireOverlay({ tier: "dropdown" });
      expect(modal.hasOverlaysAbove()).toBe(true);
      expect(dropdown.hasOverlaysAbove()).toBe(false);

      dropdown.release();
      expect(modal.hasOverlaysAbove()).toBe(false);
    });
  });

  describe("hasActiveOverlaysAbove", () => {
    it("returns false when stack is empty", () => {
      expect(hasActiveOverlaysAbove("modal")).toBe(false);
    });

    it("detects when higher tier overlay is active (without id)", () => {
      acquireOverlay({ id: "m1", tier: "modal" });
      expect(hasActiveOverlaysAbove("modal")).toBe(false);

      acquireOverlay({ id: "d1", tier: "dropdown" });
      expect(hasActiveOverlaysAbove("modal")).toBe(true);
      expect(hasActiveOverlaysAbove("dropdown")).toBe(false);

      acquireOverlay({ id: "t1", tier: "tooltip" });
      expect(hasActiveOverlaysAbove("dropdown")).toBe(true);
      expect(hasActiveOverlaysAbove("tooltip")).toBe(false);
    });

    it("detects overlays above by stack position when id is specified", () => {
      acquireOverlay({ id: "m1", tier: "modal" });
      acquireOverlay({ id: "m2", tier: "modal" });

      expect(hasActiveOverlaysAbove("modal", "m1")).toBe(true);
      expect(hasActiveOverlaysAbove("modal", "m2")).toBe(false);
    });

    it("falls back to tier comparison when specified id is not found", () => {
      acquireOverlay({ id: "d1", tier: "dropdown" });

      expect(hasActiveOverlaysAbove("modal", "unknown-id")).toBe(true);
      expect(hasActiveOverlaysAbove("dropdown", "unknown-id")).toBe(false);
    });
  });

  describe("dismissTopOverlay", () => {
    it("returns false when stack is empty", () => {
      expect(dismissTopOverlay()).toBe(false);
    });

    it("calls onDismiss of the topmost overlay", () => {
      const dismiss1 = vi.fn();
      const dismiss2 = vi.fn();

      acquireOverlay({ id: "m1", tier: "modal", onDismiss: dismiss1 });
      acquireOverlay({ id: "d1", tier: "dropdown", onDismiss: dismiss2 });

      const result = dismissTopOverlay();
      expect(result).toBe(true);
      expect(dismiss2).toHaveBeenCalledTimes(1);
      expect(dismiss1).not.toHaveBeenCalled();
    });

    it("releases topmost overlay if onDismiss is not provided", () => {
      acquireOverlay({ id: "m1", tier: "modal" });
      expect(getActiveOverlaysCount()).toBe(1);

      const result = dismissTopOverlay();
      expect(result).toBe(true);
      expect(getActiveOverlaysCount()).toBe(0);
    });
  });
});
