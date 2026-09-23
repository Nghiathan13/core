import { describe, expect, it } from "vitest";
import { applySidebarWidthTokens, clampWidth, computeLiveWidth, maxWidth, shouldSnapCollapse } from "./width";

describe("maxWidth", () => {
  it("limits sidebar to 40% of viewport", () => {
    expect(maxWidth(1000)).toBe(400);
  });
});

describe("clampWidth", () => {
  it("keeps value inside min and max", () => {
    expect(clampWidth(200, 1000)).toBe(200);
  });

  it("raises value below minimum", () => {
    expect(clampWidth(100, 1000)).toBe(200);
  });

  it("lowers value above maximum", () => {
    expect(clampWidth(500, 1000)).toBe(400);
  });
});

describe("computeLiveWidth", () => {
  it("measures pointer distance from sidebar edge", () => {
    expect(computeLiveWidth(300, 47, 1000)).toBe(253);
  });

  it("never goes below collapsed width", () => {
    expect(computeLiveWidth(0, 47, 1000)).toBe(53);
  });

  it("never goes above max width", () => {
    expect(computeLiveWidth(900, 47, 1000)).toBe(400);
  });
});

describe("shouldSnapCollapse", () => {
  it("snaps when below snap threshold", () => {
    expect(shouldSnapCollapse(75)).toBe(true);
  });

  it("keeps open at snap threshold", () => {
    expect(shouldSnapCollapse(100)).toBe(false);
  });
});

describe("applySidebarWidthTokens", () => {
  it("exposes width constants as CSS variables", () => {
    const root = document.createElement("div");
    applySidebarWidthTokens(root);
    expect(root.style.getPropertyValue("--sidebar-width")).toBe("253px");
    expect(root.style.getPropertyValue("--sidebar-collapsed-width")).toBe("53px");
  });
});
