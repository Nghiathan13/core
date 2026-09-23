import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button popup", () => {
  it("sets haspopup and expanded attributes", () => {
    const button = Button({ label: "setting", hasPopup: "dialog", expanded: false });
    expect(button.getAttribute("aria-haspopup")).toBe("dialog");
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("omits popup attributes when not provided", () => {
    const button = Button({ label: "setting" });
    expect(button.hasAttribute("aria-haspopup")).toBe(false);
    expect(button.hasAttribute("aria-expanded")).toBe(false);
  });
});
