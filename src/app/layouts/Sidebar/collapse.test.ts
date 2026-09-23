import { afterEach, describe, expect, it } from "vitest";
import { isCollapsed, setCollapsed, subscribeCollapse } from "./collapse";

afterEach(() => {
  setCollapsed(false);
  document.body.removeAttribute("data-sidebar");
});

describe("collapse state", () => {
  it("starts expanded", () => {
    expect(isCollapsed()).toBe(false);
  });

  it("marks body attribute when collapsed", () => {
    setCollapsed(true);
    expect(isCollapsed()).toBe(true);
    expect(document.body.getAttribute("data-sidebar")).toBe("collapsed");
  });

  it("clears body attribute when expanded", () => {
    setCollapsed(true);
    setCollapsed(false);
    expect(document.body.hasAttribute("data-sidebar")).toBe(false);
  });

  it("notifies subscribers on change", () => {
    let calls = 0;
    const unsubscribe = subscribeCollapse(() => {
      calls += 1;
    });
    setCollapsed(true);
    expect(calls).toBe(1);
    unsubscribe();
    setCollapsed(false);
    expect(calls).toBe(1);
  });

  it("ignores setting the same value", () => {
    setCollapsed(true);
    let calls = 0;
    const unsubscribe = subscribeCollapse(() => {
      calls += 1;
    });
    setCollapsed(true);
    expect(calls).toBe(0);
    unsubscribe();
  });
});
