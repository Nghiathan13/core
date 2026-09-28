import { describe, expect, it } from "vitest";
import { strictAxe } from "@/test-setup";
import { Button } from "./Button";

describe("Button popup", () => {
  it("sets haspopup and expanded attributes", () => {
    const button = Button({
      label: "setting",
      hasPopup: "dialog",
      expanded: false,
    });
    expect(button.getAttribute("aria-haspopup")).toBe("dialog");
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("omits popup attributes when not provided", () => {
    const button = Button({ label: "setting" });
    expect(button.hasAttribute("aria-haspopup")).toBe(false);
    expect(button.hasAttribute("aria-expanded")).toBe(false);
  });

  it("has no accessibility violations", async () => {
    const button = Button({ label: "Settings" });
    document.body.append(button);
    expect(await strictAxe(button)).toHaveNoViolations();
    button.remove();
  });
});
