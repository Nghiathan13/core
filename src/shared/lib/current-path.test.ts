import { describe, expect, it } from "vitest";
import { getCurrentPath } from "./current-path";

describe("getCurrentPath", () => {
  it("returns / when hash is empty", () => {
    window.location.hash = "";
    expect(getCurrentPath()).toBe("/");
  });

  it("returns path from hash", () => {
    window.location.hash = "#/test";
    expect(getCurrentPath()).toBe("/test");
  });
});
